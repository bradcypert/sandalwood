---
title: "Scheduling background tasks in Play with Scala"
date: 2018-02-13
status: publish
permalink: /scheduling-background-jobs-in-play-with-scala
author: "Brad Cypert"
excerpt: "A common theme with web applications is to run tasks in the background. Commonly, they're ran at set intervals. You'll find data processing servers, online-game servers, and several other types of servers using regularly scheduled background tasks and today, you'll learn how to implement these tasks in Play with Scala."
type: blog
id: 79
category:
  - Play
  - Scala
tags:
  - Async
  - "Background Tasks"
  - Play
  - Scala
post_format: []
_yoast_wpseo_title:
  - "Scheduling background tasks in Play with Scala"
---

A common theme with web applications is to run tasks in the background. Commonly, they’re ran at set intervals. You’ll find data processing servers, online-game servers, and several other types of servers using regularly scheduled background tasks and today, you’ll learn how to implement these tasks in Play with Scala.

This is my first post on Scala and Play but expect to see more in the future. I’ve been digging into it deeply and have decided that its worth investing the time and effort into both — the language and the framework. It’s worth mentioning that this tutorial assumes you’re using Guice for dependency injection.

Play is built with on top the Akka framework. “Build powerful reactive, concurrent, and distributed applications more easily.” — that’s the sales pitch for Akka. If you’ve never used the Akka framework, please allow me to elaborate more. The Akka framework uses the Actor model to allow you to build reactive and easily-scalable systems with ease. It’s worth mentioning that its reactivity also makes it asynchronous. To work properly with Play, we’ll create an Akka actor to run our background task and bootstrap it into a module to be loaded by Play. We’ll also keep the code in our actor minimal to focus on the actor itself and the bootstrapping process.

You’ll want to start by creating a new file in your application. Generally, I put these in a `tasks` module, but a module named `actors` also would make a lot of sense. Then, create a new file in that module with the name `HelloTask.scala`. In that file, you’ll want to add the contents:

```scala
package tasks

import akka.actor.ActorSystem
import scala.concurrent.ExecutionContext
import scala.concurrent.duration._

@Singleton
class HelloTask @Inject()(actorSystem: ActorSystem)(implicit ec: ExecutionContext){

  actorSystem.scheduler.schedule(initialDelay = 5.minutes, interval = 4.hours) {
    process()
  }

  def process(): Unit = {
    println("This originally executed 5 minutes after the server started and will execute again in 4 hours")
  }
}

```

That’ll do it for the actor. For those unacquainted, we’re creating a new actor named `HelloTask` under the `tasks` module. We’re injecting the ActorSystem and providing an implicit ExecutionContext. We’re scheduling our task to execute after an initial delay of 5 minutes and once again every 4 hours. Finally, we’re creating a process function that prints some text to the console.

This won’t actually do anything on it’s own, however. We have to create a module to hold this task and to bootstrap our play application with our newly created actor. We can do this by creating (in the same module) a file named `HelloTaskModule.scala` and adding the following code into it:

```scala
package tasks

import play.api.inject.{SimpleModule, _}

class HelloTaskModule extends SimpleModule(bind[HelloTask].toSelf.eagerly())

```

Now, believe it or not, we’re still not done, but we are pretty close. This file
creates a SimpleModule and eagerly loads the HelloTask actor. Lastly, we have one
final step.

You’ll now need to open up your `application.conf` and add the following line: `play.modules.enabled += tasks.HelloTaskModule`. This simply enables your new module in your application. Now you can launch your application and, 5 minutes later, you’ll see the `println` that we have added to our task. Of course, you can change the 5 minute delay and the 4 hour interval to something a little easier to test with at your leisure.

Background tasks are a wonderful tool for recurrent processes such as flushing or processing queues, batch data processing, or even health-check and service discovery tasks. For example: we use background tasks on Porios to ensure that our database stays up to date with the latest podcast information available.
