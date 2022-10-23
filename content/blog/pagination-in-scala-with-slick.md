---
title: "Pagination in Scala with Slick"
date: 2019-09-02
status: publish
permalink: /pagination-in-scala-with-slick
author: "Brad Cypert"
excerpt: ""
type: blog
id: 1833
thumbnail: /cropped-bandwidth-close-up-connection-1148820-e1567445450631-1.jpg
category:
  - Scala
tags:
  - Play
  - Scala
  - slick
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_primary_category:
  - "61"
_yoast_wpseo_content_score:
  - "90"
_yoast_wpseo_focuskw:
  - "pagination scala slick"
description:
  - "Pagination in Scala can be achieved with the use of the drop and take methods from Slick . Support for play can be handled via Query Parameters."
_yoast_wpseo_linkdex:
  - "69"
---



Pagination is the idea that a list of content can be broken into separate pages. When I first heard of pagination, the common practice was to use query params to influence which rows of content was loaded by the server. If you clicked the “next” button on the page, it would reload the page with new query params.

Fundamentally, pagination hasn’t changed much, but the landscape in which it exists has changed drastically. While some monolithic apps are still built today, the pattern for modern web development involves APIs and SPAs. In the example we’ll cover today, we’ll talk about the API side of things and use Scala as our example language.

<HeadsUp title="API? SPA?">
  Although these terms are fairly common these days, I hate to make assumptions
  about what everyone knows. An API is an acronym for **Application Program
  Interface** where an SPA is an acronym for **Single Page Application**. A SPA
  is a client-side interface usually written in languages like JavaScript or
  TypeScript and builds the view that the user sees in their web browser. An API
  is what that SPA communicates with. The API listens to updates from the SPA
  for form submissions and user interaction. The API also is home to most of the
  business logic for your application as well as an access layer to any database
  you may use.
</HeadsUp>

One of the benefits of [Slick, a domain-specific language for accessing database contents in Scala](http://slick.lightbend.com/), is the fact that its framework agnostic. This means that we can write our API in anything we’d like, but for this example, we’ll use the [Play framework](https://www.playframework.com/).

## Adding Pagination to a Scala + Slick project

Imagine that we’re making an API that returns podcasts. We’ll also imagine that we’ve already got an existing Play API and Slick setup against a database, although I’d recommend [Postgres](https://www.postgresql.org/). We want to add an endpoint that returns podcasts, but the subsection of podcasts returned is controlled by [query parameters](https://en.wikipedia.org/wiki/Query_string).

All requests in Play start with a route and we can start our project at the [Routes file](https://www.playframework.com/documentation/2.7.x/ScalaRouting). Let’s add the following line to our `routes` file to create a new route!

```
GET     /podcasts                               controllers.PodcastsController.getPodcasts
```

This route is fairly simple. When we call `${our_webserver}/podcasts` it will call the `getPodcasts` function, on the `PodcastsController` in the `controllers` package.

## The Controller – Scala + Play

Let’s go ahead and modify the PodcastsController to have our new route receiver function. We can add the following to our podcasts controller:

```scala

package controllers

import dal.PodcastRepository
import javax.inject._
import play.api._
import play.api.libs.json.Json
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

@Singleton
class PodcastsController @Inject()(
  cc: ControllerComponents,
podcastRepo: PodcastRepository,
) extends AbstractController(cc) {

def getPodcasts(): Action[AnyContent] = Action.async {
  implicit request: Request[AnyContent] =>
  val limit: Long = request.getQueryString("limit").map(_.toLong).getOrElse(50)
  val offset: Long =request.getQueryString("offset").map(_.toLong).getOrElse(0)
  podcastRepo
    .paginate(limit, offset)
    .map(podcasts => Ok(Json.toJson(podcasts)))

  }
}

```

Let’s walk through this line by line. We start with our imports, including [javax’s inject annotation](https://docs.oracle.com/javaee/6/api/javax/inject/package-summary.html), our repository (will code momentarily), all the contents of Play’s API package, all the contents of Play’s MVC package, and Play’s JSON package. Oh, we also need to [import (or create) an execution context](https://docs.scala-lang.org/overviews/core/futures.html#execution-context). I’ll use the global one, for now, to keep things simple.

Next, we define our PodcastsController as a `@Singleton`. This signifies that the PodcastController will only be instantiated once. Now, we `@Inject()` right before our constructor, which tells [Guice](https://www.playframework.com/documentation/2.7.x/ScalaDependencyInjection) to inject our ControllerComponents and PodcastRepo. Finally, we extend our PodcastController from [AbstractController](https://www.playframework.com/documentation/2.7.x/api/scala/play/api/mvc/AbstractController.html) which is provided by Play.

Let’s look at the controller action specifically:

```scala
def getPodcasts(): Action[AnyContent] = Action.async {
    implicit request: Request[AnyContent] =>
      val limit: Long =
        request.getQueryString("limit").map(_.toLong).getOrElse(50)
      val offset: Long =
        request.getQueryString("offset").map(_.toLong).getOrElse(0)

      podcastRepo
        .paginate(limit, offset)
        .map(podcasts => Ok(Json.toJson(podcasts)))
  }
```

Here we’re defining a function called `getPodcasts()` (it lives on the controller from above). The function itself takes in no parameters and it returns an `Action` that contains `AnyContent`. We use `Action.async` here to tell Play that this controller has asynchronous code. Specifically, our code is working with Futures. This let’s Play know to wait for a response before returning a 200 to the requesting client.

Now we can define our function body. We have an implicit request thats provided by Play’s Actions. We use that request to get the query string “limit” and “offset” as long values, and if they’re not provided we default to 50 and 0 respectively. Finally, we call the `paginate()` function on our (currently nonexistant) Podcast Repo instance. Let’s take a look at the repo as well.

## The Repo – Scala + Slick

Our Repo will hold our [Slick table definition](http://slick.lightbend.com/doc/3.3.1/gettingstarted.html#schema) as well as the functions that Create, Read, Update, or Delete the rows in that table. It’ll also be a Scala class like so:

```scala

package dal

import javax.inject.{Inject, Singleton}
import models.{Podcast}
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile

import scala.concurrent.{ExecutionContext, Future}

  @Singleton
  class PodcastRepository @Inject()(
  dbConfigProvider: DatabaseConfigProvider,
  subscriptionRepository: SubscriptionRepository
  )(implicit ec: ExecutionContext) {
  // We want the JdbcProfile for this provider
  val dbConfig = dbConfigProvider.get[JdbcProfile]

// These imports are important, the first one brings db into scope, which will let you do the actual db operations.
// The second one brings the Slick DSL into scope, which lets you define the table and other queries.
import dbConfig._
import profile.api._

class PodcastTable(tag: Tag) extends Table[Podcast](tag, "podcasts") {

    /** The ID column, which is the primary key, and auto incremented */
    def id = column[Option[Long]]("id", O.PrimaryKey, O.AutoInc)

    def name = column[String]("name")

    def feed = column[Option[String]]("feed")

    /**
      * This is the tables default "projection".
      *
      * It defines how the columns are converted to and from the Person object.
      *
      */
    def * =
      (
        name,
        feed,
        id,
      ).<>((Podcast.apply _).tupled, Podcast.unapply)
  }

  val podcasts = TableQuery[PodcastTable]

  def paginate(limit: Long, offset: Long): Future[Seq[Podcast]] = db.run {
    podcasts.drop(offset)
    .take(limit)
    .result
  }
}

```

Here we’re simply defining our package, imports, and `PodcastRepository`. You’ll notice that it’s also a Singleton and has injectable properties. We then get our database config from Play and then import Slick’s functions into our working context. Then, we define our Table using Slick’s DSL for database tables. We define our default projection or the way that we create class instances from data and data from our class instances. Finally, we define our paginate method and leverage slick’s `drop()` and `take()` functions to build our pagination.

Calling result in the `db.run` block will execute the query and return the results asynchronously. In our case, a sequence of podcasts.

## The Model – Scala

The last thing we’ll need to do is define our Podcast model. We’ll use a [case class](https://docs.scala-lang.org/tour/case-classes.html) for this for the help with `apply` and `unapply` that it provides us. This will be useful in our repo where we have our default projection.

Our podcast model can be simple, and ideally something like:

```scala
package models

object Podcast {
  // this is used to convert our Podcast to JSON for Play
  implicit val podcastFormat = Json.format[Podcast]
}

case class Podcast(name: String,
                   feed: Option[String],
                   id: Option[Long])

```

And that should be it! We should be able to run our existing Play service with the modifications that we’ve made and now paginate against our endpoint by calling `localhost:9000/podcasts?limit=10&offset=100` or similar. Of course, you’ll need data in your database and to use your respectively URL and port.

Thanks for taking the time to read through this. If you spot anything off, feel free to comment below. If you’d like to learn more about Scala, [you can find my other posts on the flexible language here](/tags/scala).
