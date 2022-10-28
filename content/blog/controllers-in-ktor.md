---
title: "Controllers in Ktor"
date: 2019-01-10
status: publish
permalink: /controllers-in-ktor
author: "Brad Cypert"
excerpt: ""
type: blog
id: 769
images:
  - /connection-device-display-776092.jpg
category:
  - kotlin
tags:
  - kotlin
  - ktor
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_primary_category:
  - "104"
_yoast_wpseo_content_score:
  - "30"
_yoast_wpseo_focuskw:
  - controllers
description:
  - "Although Ktor does not have any explicit concept of controllers, it's very easy to refactor your routes to support this pattern."
_yoast_wpseo_linkdex:
  - "88"
---

Ktor is a microframework written in Kotlin. It’s focus is on building asynchronous servers and clients in connected systems. I’ve been using it predominantly for the “server” slice of that statement. I call Ktor a “microframework” simply because, while it’s opinionated, you have a lot of freedom in the way that you accomplish tasks within the framework.

If you’d like to follow along, you can scaffold out a basic Ktor project via Intellij Idea or the [online tool for generating a seed project](https://ktor.io/quickstart/generator.html).

The main idea behind the Ktor server is that everything is contained within an application and you can enable “features” (ie: plugins) that enable certain functionality. The feature I wanted to talk about today is the routing feature and how to write clean code for that feature.

A simple example of a Ktor application might be as follows:

```kotlin
fun Application.module(testing: Boolean = false) {

    routing {
        get("/") {
            call.respondText("Hello World", contentType = ContentType.Text.Plain)
        }

        get("/users") {
            call.respondText("here are my users", contentType = ContentType.Text.Plain)
        }

        get("/organizations") {
            call.respondText("here are my organizations", contentType = ContentType.Text.Plain)
        }

        get("/tickets") {
            // code to get all tickets
        }

        get("/tickets/{id}") {
            // code to get a specific ticket by ID
        }

        post("/tickets") {
          // code to add a new ticket
        }

       delete("/tickets/{id}") {
         // code to delete a ticket
       }
    }
}
```

Indeed, this code is quite trivial, However, if we keep growing our codebase in this pattern, it can be quite messy. Thankfully, Kotlin is a very powerful language and offers a fantastic solution to this scalability concern.

## Refactoring to Controllers

Because of the implicit context provided to the DSL, you cant just call a controller without passing in the call or request. Instead, you can write an extension function on the Route object to encapsulate routes.

We’ll do this with the ticket example from above as it’s the most complex of the
three controllers that we can create.

```kotlin
fun Route.ticketRoutes() {
  route("/tickets") {
    get("") {
    // code to get all tickets
    }

    get("/{id}") {
        // code to get a specific ticket
    }

    post("/") {
        // create a new ticket
    }

    delete("/{id}") {
        // delete an existing ticket
    }
  }
}

```

As a result, we end up with a nice single-responsibility piece of code. Assuming we do the same extraction of our routes for our other resources (creating controllers for each organizations and users as well), we can then refactor our Ktor routes DSL to look like the following:

## Refactoring our Application Module

```kotlin
fun Application.module(testing: Boolean = false) {

    routing {
        get("/") {
            call.respondText("Hello World", contentType = ContentType.Text.Plain)
        }

        userRoutes()
        organizationRoutes()
        ticketRoutes()
    }
}
```

Much cleaner! Although there is no explicit concept of controllers in Ktor, we can extract our routes out into controller-like structures using extension functions on the Route.

Want to [read more of my Kotlin-related](http://www.bradcypert.com/tags/kotlin/) posts? How about [Ktor](http://www.bradcypert.com/tags/ktor/)?

If you’re interested in learning more about Ktor, [you can find the documentation for the project here](https://ktor.io/).
