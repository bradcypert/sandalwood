---
title: "A Chili Cookoff with Rust, Rocket, Render, and Supabase"
date: 2022-12-06
status: publish
permalink: /chili-cookoff-with-rust-rocket-render-and-supabase
author: "Brad Cypert"
images:
  - pexels-peppers.jpg
type: blog
category:
  - rust
tags:
  - rust
description: "Learn how Rust, Rocket, Render, and Supabase helped streamline my annual Chili Cookoff"
---

This is the 2nd year that my wife and I have hosted a chili cookoff. We invite friends and family, some of them bring chili, and everyone participates in a democratic vote for the 1st, 2nd, and 3rd best chilis (and this year, we're doing hottest and most creative, too). Last year, we assigned the chilis a number and gave three scraps of paper to each cookoff-goer on which they'd write the number of their top 3 chilis. We'd then collect these in a hat and go count up the votes. This works but we found that it was a bit tedious. This year, I've been learning Rust and in an effort to be a good software engineer (and make a technical problem out of something that doesn't need to be), I've decided to build a simple web server in Rust that helps make this process less painful. Here's how it went.

## The Original Plan
My original plan was to build a simple Rust web server with [Rocket](https://rocket.rs/). This server would render a form and that form would post back to the server, which would ultimately dump the value in a google sheet. Then, I'd take the google sheet and generate a form from those values that others could use to vote.

Unfortunately, this looked to be far more complicated than I realized. Interacting with Google Sheets looks as if it [depends on OAuth](https://developers.google.com/sheets/api) and I didn't want to juggle that headache for something so small. I had a genius solution: I'll post the data to a [Zapier](https://zapier.com) webhook and let Zapier manage the sheet for me. This worked but it didn't provide a way to get the row that the cell was inserted into (this would be the number for that chili).

## The New Plan

I decided to instead try out [Supabase (the open source firebase alternative)](https://supabase.com/). I would set up an account, create a table, and then connect to that. I remembered hearing on the [Changelog podcast](https://changelog.com/podcast/476) that Supabase has [PostgREST](https://postgrest.org/en/stable/) support and I decided to try instead of connecting to the db directly. I also settled on Supabase's managed services instead of hosting my own. I wanted this to be quick and easy which meant I did not want to have to figure out hosting my own Supabase instance.

I signed up for Supabase and then created a project called "Cookoff". Once that was up and running, I added a table called "registrants". That table has an auto-incrementing ID, a `created_at` timestamp, and a `name` of type varchar.

![Supabase Registration Cookoff Table](supabase-registration-cookoff-table.png)

While in Supabase's UI, I found my API key, the Postrest URL for my database, and wrote down my table name. We'll use these as environment variables in just a moment. I also found that Supabase supports [row-level security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) which seems extremely useful. I'll be transparent: I'm learning what that means as I go. Databases are not my strongest suite, but from what I've gathered, it seems like a very powerful security feature.

Now let's actually write some Rust and connect to this thing. We'll start by creating a new Rust project with Cargo.

```
cargo new --bin cookoff
```

Now we can open up our Cargo.toml file and specify a few dependencies. We'll be using Rocket, serde, and postgrest.

```toml
[package]
name = "cookoff"
version = "0.1.0"
edition = "2021"

[dependencies]
rocket = { version = "0.5.0-rc.2", features = ["json"] }
rocket_dyn_templates = { version = "0.1.0-rc.2", features = ["handlebars"] }
serde = { version = "1.0.147" }
serde_json = "1.0.89"
postgrest = "1.0"
```

For simplicity's sake, we'll keep all of our Rust in `src/main.rs`. We'll go ahead and delete everything in this file and use rocket's launch macro to help launch our web server.

```rust
#[macro_use] 
extern crate rocket;
use std::env;
use rocket_dyn_templates::{Template, context};

#[derive(FromForm, Serialize, Deserialize)]
struct Registrant<'r> {
    name: &'r str
}

#[derive(Serialize, Deserialize)]
struct SupabaseResp {
    id: u32,
    name: String,
}

struct TableNames {
    registrant: String
}

#[launch]
fn rocket() -> _ {
    rocket::build()
    .attach(Template::fairing())
    .mount("/", routes![index, post_index])
    .manage(Postgrest::new(env::var("supabase_rest_url").unwrap())
        .insert_header("apikey", env::var("supabase_api_key").unwrap()))
    .manage(TableNames {
        registrant: env::var("supabase_table_name").unwrap()
    })
}
```

We're setting up our new rocket server, attaching the template fairing so that templates work, mount our two routes, and then add two pieces of [server state](https://rocket.rs/v0.5-rc/guide/state/#state) (sort-of a form of dependency injection). One state item is our Postgrest instance and the second is a struct to hold our table names from our environment. We're calling `.unwrap()` here because we want to panic if these environment variables are not set. Additionally, we're creating a few structs that we'll use in our application.

We'll go ahead and add the two route handlers mentioned above, one for a GET and one for a POST. The GET will simply render a rocket template (which we'll create in a moment).

```rust
#[get("/")]
fn index() -> Template {
    Template::render("index", None::<String>)
}
```

This handler is simply rendering the index.html.hbs file (that we're about to create) and is providing None for the context. Let's go ahead and create that template now (cookoff/templates/index.html.hbs).
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Chili Cookoff</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
  </head>
  <body>
  <section class="section">
    <div class="container">       
        {{#if registered}}
            <div class="message is-success">
                <div class="message-body">
                    Thanks {{name}}! You're registered. Your number is {{number}}. Please write this on a piece of paper and place this number visibily near your chili.
                </div>
            </div>
        {{/if}}
      <h1 class="title">
        Welcome to the Chili Cookoff.
      </h1>
      <p class="subtitle">
       Please enter your name.
      </p>
      <form action="/" method="post">
         <input type="text" id="name" name="name"/>
         <button type="submit">Submit</button>
      </form>
    </div>
  </section>
  </body>
</html>
```

HTML fundamentals are sort-of out of the scope for this post, but we're pulling in a style sheet to make the web page look not awful, and setting up some form elements. We're using handlebars for conditional rendering, too. Namely, if registered is true, we'll show a little alert that lets them know their chili's number. It will look something like this:

![A successful state for a cookoff contestant signup](cookoff-signup-successful.png)

Our Post handler is also going to render this template, but will be doing a fair bit of logic before hand. This is really the "meat-and-potatoes" of our web server so we'll walk through it piece by piece.

```rust
#[post("/", data = "<registrant>")]
async fn post_index(registrant: Form<Registrant<'_>>, client: &State<Postgrest>, tables: &State<TableNames>) -> Result<Template, Status> {
    let registrant = registrant.into_inner();

    if let Ok(json) = serde_json::to_string(&registrant) {
        let ins = client.from(&tables.registrant).insert(json).execute().await;
        match ins {
            Ok(response) =>  match response.text().await.ok() {
                Some(body) => {
                    let items: Vec<SupabaseResp> = serde_json::from_str(body.as_str()).unwrap();
                    if let Some(resp) = items.first() {
                        Ok(Template::render("index", context! { registered: "true", number: resp.id.to_string().as_str(), name: resp.name.as_str() }))
                    } else {
                        Err(Status::InternalServerError)
                    }
                },
                _ => {
                    // unable to get text from response body
                    Err(Status::InternalServerError)
                },
            },
            Err(_) => {
                Err(Status::FailedDependency)
            },
        }
    } else {
        Ok(Template::render("index", context! { error: "Something went wrong. Let Brad know and he'll fix it!" }))
    }
}
```

We're specifying that this a post request to the root and we're expecting data. `<registrant>` maps to the function parameter of the same name -- in this case `Form<Registrant<'_>>`. We're also injecting our Postgrest instance and our Tablenames struct. We'll use `into_inner()` to convert our registrant form into a registrant. We'll also use [serde](https://serde.rs/) to serialize our registrant into a JSON string. Then we'll use our Postgrest client to insert our registrant json into the registrants table. We'll match on that insert request and if its okay, we'll serialize the response so that we can get the id of the inserted value. Finally, we'll render the same template as before but we'll use the context! macro to pass in a context to our handlebars template.

We also set up several error cases. We can be more thorough with how errors are handled here and I've left the code like this to show where you would handle each error state individually. Finally, if we weren't able to serialize the registrant (maybe in the case of the form values not being posted properly), we render the template with an error context letting them know to let me know.

Putting the entire Rust file (main.rs) together looks like this:

```rust
#[macro_use] 
extern crate rocket;
extern crate serde;
use std::env;

use postgrest::Postgrest;
use rocket::{serde::{Serialize, Deserialize}, State, http::Status};
use rocket::form::Form;
use rocket_dyn_templates::{Template, context};

#[get("/")]
fn index() -> Template {
    Template::render("index", None::<String>)
}

#[derive(FromForm, Serialize, Deserialize)]
struct Registrant<'r> {
    name: &'r str
}

#[derive(Serialize, Deserialize)]
struct SupabaseResp {
    id: u32,
    name: String,
}

struct TableNames {
    registrant: String
}

#[post("/", data = "<registrant>")]
async fn post_index(registrant: Form<Registrant<'_>>, client: &State<Postgrest>, tables: &State<TableNames>) -> Result<Template, Status> {
    let registrant = registrant.into_inner();

    if let Ok(json) = serde_json::to_string(&registrant) {
        let ins = client.from(&tables.registrant).insert(json).execute().await;
        match ins {
            Ok(response) =>  match response.text().await.ok() {
                Some(body) => {
                    let items: Vec<SupabaseResp> = serde_json::from_str(body.as_str()).unwrap();
                    if let Some(resp) = items.first() {
                        Ok(Template::render("index", context! { registered: "true", number: resp.id.to_string().as_str(), name: resp.name.as_str() }))
                    } else {
                        Err(Status::InternalServerError)
                    }
                },
                _ => {
                    // unable to get text from response body
                    Err(Status::InternalServerError)
                },
            },
            Err(_) => {
                Err(Status::FailedDependency)
            },
        }
    } else {
        Ok(Template::render("index", context! { error: "Something went wrong. Let Brad know and he'll fix it!" }))
    }
}


#[launch]
fn rocket() -> _ {
    rocket::build()
    .attach(Template::fairing())
    .mount("/", routes![index, post_index])
    .manage(Postgrest::new(env::var("supabase_rest_url").unwrap())
        .insert_header("apikey", env::var("supabase_api_key").unwrap()))
    .manage(TableNames {
        registrant: env::var("supabase_table_name").unwrap()
    })
}
```

## Deploying

This seems like a fantastic project to deploy on Heroku's free tier. [Unfortunately, they canned that a few months ago](https://blog.heroku.com/next-chapter) and I was stuck looking for alternatives. [Render](https://render.com/) came up and I decided to give them a try. I signed up and connected my Github repo. Render recognized it as a Rust project and started deploying right away.

![Render Dashboard for the Cookoff Project](render-cookoff-dashboard.png)

I did, however, need to go into render's admin UI and set up my environment variables (`supabase_rest_url`, `supabase_api_key`, and `supabase_table_name`).

![Render Env Variables for the Cookoff Project](render-cookoff-env.png)

Render feels very similar to Heroku's dynos, especially the free tier. The servers go into standby after 15 minutes of inactivity but given that this web server is running in rust and the specs on the free tier aren't bad, once the server is "hot", everything excutes fairly fast. I can definitely see myself using Render again for future projects.

## Conclusion

Rust was a fun choice for this project and it gave me a great opportunity to build something small. Supabase and Render made the data management and deployment (respectively) a breeze. Supabase ultimately helped me create a better solution than my direct-to-sheets approach that I was originally going to take as well. Here's to a good chili cookoff this year!
