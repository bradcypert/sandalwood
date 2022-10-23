---
title: "Building a Simple API in PHP using Lumen"
date: 2017-01-22
status: publish
permalink: /building-a-simple-api-in-php-using-lumen
author: "Brad Cypert"
excerpt: ""
type: blog
id: 47
category:
  - PHP
tags:
  - Eloquent
  - lumen
  - PHP
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_title:
  - "Building a Simple API in PHP using Lumen"
_yoast_wpseo_primary_category:
  - "81"
_yoast_wpseo_content_score:
  - "90"
_yoast_wpseo_focuskw:
  - Lumen
description:
  - "Lumen is a microframework (like Slim) but comes bundled with the Eloquent ORM. Read on to find out how to setup and use Lumen in your project today!"
_yoast_wpseo_linkdex:
  - "88"
---

Alright, at it again with another PHP post. Hopefully this doesn’t dislodge my blog from the [planet.clojure.in](http://planet.clojure.in) newsletter from writing too much non-clojure. The other day I wrote a post about using Slim with Eloquent to build a simple API. It was a fun project and I decided to share it with the PHP subreddit. Thankfully, the PHP community is far better than I remembered it — we created a lot of great feedback and had a few discussions about **Lumen**.

What is Lumen, you ask? Well, it’s a microframework (like Slim) but comes bundled with Eloquent (the ORM we used in our last tutorial). It’s also from the team that brought you Laravel. In fact, one of the big selling points for Lumen (although the community seems disjointed on agreeing with this) is that upgrading from Lumen to Laravel should be an easy transition.

My post for you today is simple — We’ll take my last post and just write it with Lumen instead. We won’t have to tackle that weird ExceptionHandler issue for Eloquent and I enjoyed the syntax even more with Lumen than I did with Slim. Hopefully, you’ll enjoy it too!

## Getting Started

For this tutorial, we’re going to use PHP-7.1 and Lumen-5.3.3. We’re also going to use a Postgres database.

We’re breaking up our code into separate files but most of the Slim logic will be contained in a single file. If you’re not using PHP’s package manager, Composer, you definitely should. It’ll help with this tutorial a lot. In fact, we’ll start by having composer manage our dependencies for us!

Note: I’ve installed Composer via homebrew (arguably a weird way to use Composer, but I prefer to use a package manager to install my package managers). If you aren’t using Homebrew, you’ll probably have to use `php composer.phar ${my-commands-here}` instead of my example. It also looks like Lumen has a tool to help us with scaffolding out a project. Let’s install that now.

`composer global require "laravel/lumen-installer"`

You’ll likely need to add your composer global directory to your path which you can do like so (provided you’ve got your composer directory in the same location):

Then you should be able to run a command to generate our lumen project. I’ll call mine `lumen-test` because why not?

`lumen new lumen-test`

Awesome. You can launch the current app by changing to the `lumen-test` directory and using `php -S localhost:8000 -t public` to make sure everything runs out of the box.

We’ll end up using the same database and table from our previous post (so please don’t mind the references to slim). Here’s a picture of the schema once more.

![Database Schema](/Screen-Shot-2017-01-16-at-1.09.11-AM-1-1024x505.png)

Alright, let’s setup our server config so we have access to our database.

## The Config

The config for our server is contained in a `.env` file. If you’ve scaffolded the project, you’ll see a `.env_example` file. Feel free to copy that file to a new `.env` file.

`cp .env_example .env`

Crack open that `.env` file and let’s setup our database. Your file (provided you’re using the same database config as I am) should look something like this.

```php
APP_ENV=local
APP_DEBUG=true
APP_KEY=
APP_TIMEZONE=UTC

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=slim_test
DB_USERNAME=slim2
DB_PASSWORD=nopassword

CACHE_DRIVER=memcached
QUEUE_DRIVER=sync
```

And that’s it for our config.

## The Magic

My rule for Microframeworks is that they should have minimal “magic”. Slim felt pretty “magic-less” and Lumen has until this point as wel (but we’ve really only written a config). Eloquent support comes out of the box when creating a new Lumen app, but we have to activate it. Open up `bootstrap/app.php` and find the following line:

`// $app->withEloquent();`

Simply uncomment that line and your app hookup Eloquent to the database that you’ve configured in your `.env` file. Feel free to look around this file, there’s a few other options here that you can setup if you’d like such as Middleware or Facades.

## The PHP

Alright, let’s write all of our PHP for this project. It’s not bad at all, should be easy to understand, and (for simplicity) we’ll be able to keep it all in one file. Let’s go ahead and start by modifying `public/index.php`.

```php
<?php

use IlluminateHttpRequest;

$app = require __DIR__.'/../bootstrap/app.php';

class Dev extends IlluminateDatabaseEloquentModel {
  protected $table = 'devs';
}
```

We’re starting a new PHP document using the annoying `<?php` half-tag that we never close, defining Request as IlluminateHttpRequest, bootstrapping our application based off of the file we just touched, and then defining our “magic” model. The model has it’s table set to `devs` and the rest is handled for us by Eloquent.

Let’s start with something basic. We’ll go ahead and define our behavior for a `GET` request to retrieve all the developers from our database. That part is really cool, as Eloquent plays very nicely with the Lumen request/response objects.

```php
$app->get('dev', function() {
  return response()->json(Dev::all());
});
```

Simple right? This looks great. It’s obvious as to what is happening and what is being returned. Actually, it’s not that obvious. The `response()` being called with no parameters actually leverages the Lumen contracts system and returns a ResponseFactory. The responseFactory has a `json()` method and that builds a response from the given object (in our case, an array). Despite that “magic”, this knowledge isn’t too necessary in most cases and allows us to write really concise callbacks for our routes. Overall, I like it.

Let’s go ahead and add the code to perform a get using an ID to lookup a specific developer.

```php
$app->get('dev/{id}', function($id) {
  return response()->json(Dev::find($id));
});
```

This should also be pretty obvious, but let’s go over it! We’re mostly doing the same thing as before, except this time we have a route parameter. We’re expecting an `id` to be passed in on our route so we could match against `dev/1` or even `dev/frank`. We can fine tune this as well, but I’ll cover that in another post. For now, we’ll take that `id` in our callback and find the specific developer with that `id`. Moving onto a `POST`.

```php
$app->post('dev', function(Request $request) {
  $dev = new Dev();
  $dev->name = $request->input('name');
  $dev->focus = $request->input('focus');
  $dev->hireDate = $request->input('hireDate');

  $dev->save();
  return response()->json($dev, 201);
});
```

With the post, we’re listening on the `dev` route again, but you’ll notice our callback is actually taking in a `Request` object. You’ll remember from earlier that we wrote `use IlluminateHttpRequest;`. This means that the request in this context is of type `IlluminateHttpRequest`. Next, we create a new developer object, then we peel the `name`, `focus`, and `hireDate` from the request object and assign them the respective fields for the `$dev` object. We then save the `$dev` object to the database and then return it with a `201` to signify that it’s been created. We can add a developer, but now we need to delete one from our database. Let’s make that route.

```php
$app->delete('dev/{id}', function($id) {
  Dev::find($id)->delete();
  return response('', 200);
});
```

Short and sweet. We’re able to take an ID, listen for a `delete` request on the `dev/{id}` route and then find that developer in the db and issue a delete on it. Eloquent takes care of the rest from here and then we return a successful response. What about a patch?

```php
$app->patch('dev/{id}', function(Request $request, $id) {
  $dev = Dev::find($id);
  $dev->name = $request->input('name', $dev->name);
  $dev->focus = $request->input('focus', $dev->focus);
  $dev->hireDate = $request->input('hireDate', $dev->hireDate);


$dev->save();
  return response()->json($dev);
});
```

In this route, you’ll see we’re listening on `dev/{id}` again, but this time for a patch. We’re taking in the Request object once more (as we’ll need to extract data from it) and then the `$id`. We’re updating the values of the developer for that given id and then saving it. You’ll notice that we’re passing in a second parameter to `$request->input();`. That second parameter is the “default” value. If there is no data for ‘name’ for example, it’ll return `$dev->name`. This allows us to only update the values that are passed to us in our request. We then save it like before, and return the updated object. The last piece is up next, I swear!

```php
\$app->run();
```

And that’s it! That last line runs our application! The entire `public/index.php` file is here below for you to inspect in one solid piece.

```php

<?php

use IlluminateHttpRequest;

$app = require __DIR__.'/../bootstrap/app.php';

class Dev extends IlluminateDatabaseEloquentModel {
  protected $table = 'devs';
}

$app->get('dev', function() {
  return response()->json(Dev::all());
});

$app->get('dev/{id}', function($id) {
  return response()->json(Dev::find($id));
});

$app->post('dev', function(Request $request) {
  $dev = new Dev();
  $dev->name = $request->input('name');
  $dev->focus = $request->input('focus');
  $dev->hireDate = $request->input('hireDate');

  $dev->save();
  return response()->json($dev, 201);
});

$app->delete('dev/{id}', function($id) {
  Dev::find($id)->delete();
  return response('', 200);
});

$app->patch('dev/{id}', function(Request $request, $id) {
  $dev = Dev::find($id);
  $dev->name = $request->input('name', $dev->name);
  $dev->focus = $request->input('focus', $dev->focus);
  $dev->hireDate = $request->input('hireDate', $dev->hireDate);

  $dev->save();
  return response()->json($dev);
});

$app->run();
```

I hope this tutorial was as helpful as the last one! Have a comment? Let me know below! Thanks again for reading! If you’d like to learn more about PHP, [you can find more of most posts on the matter here](http://www.bradcypert.com/tags/php)!
