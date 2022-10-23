---
title: "Building a Simple API in PHP using Slim & Eloquent"
date: 2017-01-16
status: publish
permalink: /building-a-restful-api-in-php-using-slim-eloquent
author: "Brad Cypert"
excerpt: ""
type: blog
id: 44
category:
  - PHP
tags:
  - API
  - Eloquent
  - PHP
  - Slim
post_format: []
---

I’ve been exposed to a lot of PHP recently! I’ve been reviewing a course on functional PHP for a publishing company (link will be added once it’s released) and my friend has recruited me into working on an API that’s written in PHP using the Slim framework. I figured now would be a good time to write about my recent findings!

[Slim is a microframework](http://www.slimframework.com/), similar to [Flask](https://palletsprojects.com/p/flask/) or [Sinatra](http://sinatrarb.com/) but for PHP. I’ve been pretty reserved about PHP in the past (It was the first language that I was paid to write) and I naturally associate PHP with poor code (because I wrote a ton of poor code in PHP). Perhaps you do that as well. Hopefully, by the end of this tutorial, I can help remedy that negative outlook on PHP as my own outlook on it has changed drastically over the past year.

My goal is to recreate my once-popular “[Building a RESTful API with Flask and SQLAlchemy post](/writing-a-restful-api-in-flask-sqlalchemy/)” but using Slim and Eloquent. I’ll try to keep it as simple and streamlined as that post, however, I’ll go ahead and admit that I ran into a few annoying roadblocks on this journey. I’ll go ahead and clear the air about them:

1. Eloquent is Laravel’s ORM. It’s coupled to the framework, although it’s basically in a spot where it can easily be treated as its own project. I had to write a class that extended an exception handler that comes with Laravel so that Eloquent would work.
2. This might not be the most idiomatic PHP. It’s been a long while since I’ve written anything substantial in PHP. I spent a lot of time refactoring the code trying to figure out what the most idiomatic option would be.

Let’s get started!

## Getting Started

For this tutorial, we’re going to use PHP-7.1 and Slim-3.7. We’re also going to use a Postgres database and Eloquent-5.1.

We’re breaking up our code into separate files but most of the Slim logic will be contained in a single file. If you’re not using PHP’s package manager, Composer, you definitely should. It’ll help with this tutorial a lot. In fact, we’ll start by having composer manage our dependencies for us!

**Note:** I’ve installed Composer via homebrew (arguably a weird way to use Composer,
but I prefer to use a package manager to install my package managers). If you aren’t
using Homebrew, you’ll probably have to use `php composer.phar ${my - commands - here}` instead of my example.

```bash
composer require slim/slim:3.7
composer require illuminate/database:5.1
```

Alternatively, you can just create a `composer.json` file in your project’s root folder and add the following to it:

###### composer.json

```json
{
  "require": {
    "slim/slim": "^3.7",
    "illuminate/database": "~5.1"
  }
}
```

Then, follow up with `composer install`.

Let’s go ahead and run the following commands as well to make some directories for our project.

```bash
mkdir -p public src/handlers src/models
```

We’ll add an index.php file to our public folder, use the `models` folder to hold our database model, and use the handlers folder for that Eloquent Exception fix that I mentioned above.

Let’s go ahead and define our model. In Postgres, I have a table that looks like this…

![Table Schema, ID - serial integer, name - text, focus - text, hireDate - date updated_at - date, created_at - date](/Screen-Shot-2017-01-16-at-1.09.11-AM.png)
We can go ahead and create `src/models/dev.php` to represent this table.

###### src/models/dev.php

```php
<?php
class Dev extends IlluminateDatabaseEloquentModel {
  protected $table = 'devs';
}
```

And that’s it! We can technically ditch the `protected $table = 'devs'` line too, but then we wouldn’t have anything to talk about for this file! So, it’s obvious that a lot of magic happens simply by extending `IlluminateDatabaseEloquentModel`. This is very reminiscent of ActiveRecord in my past experiences and concerns me a bit. That being said, everything seemed to “magically” work and the documentation for Eloquent’s Models is actually pretty good.

Our next thing worth mentioning is how easy it is to override the model configuration to set our own values. We’re overwriting the table name and can follow the same pattern for other configuration options such as hiding specific fields like a password.

One thing I don’t like about Eloquent is the lack of defining what model fields exist. With Flask, Grails, Rails, and several other frameworks, I’ve had to define the member variables for those models. That level of clarity (and knowing I don’t need to poll the schema for my table via pgsql) is something that I really appreciate in an ORM, but enough concern, let’s move on!

## The API

Let’s open our next file, `public/index.php`, and get started on that Slim API! I’m actually shocked at how few of lines this file ended up being and hopefully you will be too!

This is our biggest file, so I’ll break it up into separate pieces.

###### public/index.php

```php
<?php
require '../vendor/autoload.php';
require '../src/models/dev.php';
require '../src/handlers/exceptions.php';

$config = include('../src/config.php');

$app = new SlimApp(['settings'=> $config]);

$container = $app->getContainer();

$capsule = new IlluminateDatabaseCapsuleManager;
$capsule->addConnection($container['settings']['db']);
$capsule->setAsGlobal();
$capsule->bootEloquent();

$capsule->getContainer()->singleton(
  IlluminateContractsDebugExceptionHandler::class,
  AppExceptionsHandler::class
);
```

Alright! Let’s cover this bootstrappy piece of the API!

We’ve got a few require’s at the top that are loading in our other pieces of code. I’m aware that you can write an autoloader, but our project felt like it didn’t warrant one, especially since composer generates an autoloader for the vendor libraries (slim and eloquent) that we’re using.

You’ll notice that we haven’t created our `src/handlers/exceptions.php` or `src/config.php` files yet, but we’ll do that in just a second. Let’s talk about Slim concepts!

Slim is running as an application (very similar to Flask), but it also provides a “container” that the application runs within. This container is used for dependency injection and actually works really well. In the scope of this project, we won’t really do much with it except use the settings that get set on the container from our app constructor.

We’re creating something called a “capsule” as well. The capsule is a concept used by Eloquent and acts as a container for our database connection. There’s a [small forward from the Eloquent team about the capsule that you can read here](https://github.com/illuminate/database/blob/master/README.md).

In the capsule, we’re setting up a connection based on some config settings that we’re about to write, setting this connection as our global connection, and booting the eloquent ORM with these settings.
Then, we do the weird Eloquent fix/hack that was mentioned earlier.

We need to write our config and our exception handler so that our capsule can use both of them! Let’s start with the handler.

###### src/handlers/exception.php

```php

<?php namespace AppExceptions;
class Handler implements IlluminateContractsDebugExceptionHandler {
  public function report(Exception $e) {
    throw $e;
  }

  public function render($request, Exception $e) {
    throw $e;
  }

  public function renderForConsole($output, Exception $e) {
    throw $e;
  }
}

```

In the first line here, we’re setting a namespace as I didn’t want to leave something like “Handler” out there without one! Generic names like that are a prime subject for naming conflicts!

Our handler must implement the `IlluminateContractsDebugExceptionHandler` so we’ll make sure to implement that interface. With that interface comes the responsibility to implement `report`, `render`, and `renderForConsole`.There’s definitely better options here, but for the sake of this tutorial, I’m willing to just let the errors bubble up to Slim’s error handler.

There’s nothing else really going on here, but we needed a stub of the Laravel class that doesn’t come with our Eloquent package. Let’s write that config file.

###### src/config.php

```php
<?php
return [
  'determineRouteBeforeAppMiddleware' => false,
  'outputBuffering' => false,
  'displayErrorDetails' => true,
  'db' => [
    'driver' => 'pgsql',
    'host' => 'localhost',
    'port' => '5432',
    'database' => 'slim_test',
    'username' => 'slim2',
    'password' => 'slim2',
    'charset' => 'utf8',
    'collation' => 'utf8_unicode_ci',
  ]
];

```

Yet again, nothing fancy here. We’re creating an “associative array” (or a dictionary or map in every other programming language) and setting values to be used by our application. Just make sure to have your database settings mimic by this config file. Also, if you haven’t written a config file using return, you should! It alleviates the pain caused by requiring a file that creates a ton of globals and instead gets required into a specific variable.

Alright, let’s finish the API now! All of the following lines will just be added sequentially to the index.php. I’ll post the complete index.php at the end too!

###### public/index.php

```php
$app->get('/dev/', function($request, $response) {
  return $response->getBody()->write(Dev::all()->toJson());
});

```

Alright! Our first route! This is simple a GET request to `localhost:8080/dev/`. You may be wondering why we accept a request and a response for this function — great question! Slim supports a layered middleware system and the request and response can be modified before they reach our routes. If we were to create our response in this function body, we wouldn’t be able to leverage that middleware properly.

We take the response, get the body and write our output to it. In this case, our output is an array — a request to get all of the “devs” in our database. We use `toJson()` to convert this to a JSON string before returning it.

Let’s talk about getting a single developer.

```php
$app->get('/dev/{id}/', function($request, $response, $args) {
  $id = $args['id'];
  $dev = Dev::find($id);
  $response->getBody()->write($dev->toJson());
  return $response;
});

```

This should look similar. The main difference is that we’re taking in an ID in our route and that gets stored in our \$args parameter (as would any route parameters that we create). We’re pulling that out into `$id` and then using `Dev::find($id)` to look up the developer with that ID. Then, just like before we write that developer to the response body and return that response.

Alright, time to add a new developer.

```php
$app->post('/dev/', function($request, $response, $args) {
  $data = $request->getParsedBody();
  $dev = new Dev();
  $dev->name = $data['name'];
  $dev->focus = $data['focus'];
  $dev->hireDate = $data['hireDate'];

  $dev->save();

  return $response->withStatus(201)->getBody()->write($dev->toJson());
});

```

This should be rather obvious too (its kind of the theme for this framework, which I like)
but let’s talk through it. The main difference here is that we’re taking POST data via the request body.
You’ll notice that we’re doing that via `getParsedBody()`. We create a new “Dev” object and then set the
properties of that object equal to what we pulled in from the request body. Lastly, we have to save
that to persist it to the database. You’ll also notice that we’re setting our response status to 201
to be a bit more helpful with our response codes.

Let’s delete a developer!

```php
$app->delete('/dev/{id}/', function($request, $response, $args) {
  $id = $args['id'];
  $dev = Dev::find($id);
  $dev->delete();

  return $response->withStatus(200);
});
```

The delete is actually really simple too! With the routes we’ve already defined, you should be able to figure this one out. The main difference here is that we’re calling `$dev->delete();` as opposed to `$dev->save()` like we did earlier.

Lastly, let’s end with a put!

```php
$app->put('/dev/{id}/', function($request, $response, $args) {
  $id = $args['id'];
  $data = $request->getParsedBody();
  $dev = Dev::find($id);
  $dev->name = $data['name'] ?: $dev->name;
  $dev->focus = $data['focus'] ?: $dev->focus;
  $dev->hireDate = $data['hireDate'] ?: $dev->hireDate;

  $dev->save();

  return $response->getBody()->write($dev->toJson());
});

```

This one updates any incoming properties with the one’s specified in the request body. If there’s not a new body param, we just keep the data we already have stored in our \$dev object. Lastly, we save it and write that to the response body as JSON.

One more thing!

We’ve got to actually run our app! Add the following:

```php
$app->run();
```

Here’s the entire `index.php` once more for you to review.

```php
<?php
require '../vendor/autoload.php';
require '../src/models/dev.php';
require '../src/handlers/exceptions.php';

$config = include('../src/config.php');

$app = new SlimApp(['settings'=> $config]);

$container = $app->getContainer();

$capsule = new IlluminateDatabaseCapsuleManager;
$capsule->addConnection($container['settings']['db']);
$capsule->setAsGlobal();
$capsule->bootEloquent();

$capsule->getContainer()->singleton(
  IlluminateContractsDebugExceptionHandler::class,
  AppExceptionsHandler::class
);

$app->get('/dev/', function($request, $response) {
  return $response->getBody()->write(Dev::all()->toJson());
});

$app->get('/dev/{id}/', function($request, $response, $args) {
  $id = $args['id'];
  $dev = Dev::find($id);
  $response->getBody()->write($dev);
  return $response;
});

$app->post('/dev/', function($request, $response, $args) {
  $data = $request->getParsedBody();
  $dev = new Dev();
  $dev->name = $data['name'];
  $dev->focus = $data['focus'];
  $dev->hireDate = $data['hireDate'];

  $dev->save();

  return $response->withStatus(201)->getBody()->write($dev->toJson());
});

$app->delete('/dev/{id}/', function($request, $response, $args) {
  $id = $args['id'];
  $dev = Dev::find($id);
  $dev->delete();

  return $response->withStatus(200);
});

$app->put('/dev/{id}/', function($request, $response, $args) {
  $id = $args['id'];
  $data = $request->getParsedBody();
  $dev = Dev::find($id);
  $dev->name = $data['name'] ?: $dev->name;
  $dev->focus = $data['focus'] ?: $dev->focus;
  $dev->hireDate = $data['hireDate'] ?: $dev->hireDate;

  $dev->save();

  return $response->getBody()->write($dev->toJson());
});

$app->run();
```

#### Test It!

From the `public` directory, use `php -S localhost:8080` and the server will launch. Then, from another terminal tab we can leverage `curl` to test our API!

```bash
curl http://localhost:8080/dev/                                                          []
```

You’ll notice that our “list all developers” array is empty. That seems right. Let’s add some developers to it!

```bash
curl --data "name=Brad&focus=Frontend&hireDate=1/17/2017" http://localhost:8080/dev/
{"name":"Brad","focus":"Frontend","hireDate":"1/17/2017","updated_at":"2017-01-16 10:21:35","created_at":"2017-01-16 10:21:35","id":3}
```

Yay, its working!

```bash
curl http://localhost:8080/dev/
[{"id":3,"name":"Brad","focus":"Frontend","hireDate":"2017-01-17","updated_at":"2017-01-16 00:00:00","created_at":"2017-01-16 00:00:00"}]
```

And now it’s showing up in our list! Great! Everything seems to be working well and it’s snappy too! So what do you think? PHP isn’t all that bad right? Slim is very similar to flask, with a few minor differences, but I definitely think it’s my PHP framework of choice!
