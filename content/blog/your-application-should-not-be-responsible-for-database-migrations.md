---
title: "Your application should not be responsible for Database Migrations."
date: 2019-06-09
status: publish
permalink: /your-application-should-not-be-responsible-for-database-migrations
author: "Brad Cypert"
excerpt: ""
type: blog
id: 1450
thumbnail: /animal-photography-clouds-daylight-635006.jpg
category:
  - Databases
tags:
  - databases
  - migrations
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_primary_category:
  - "208"
_yoast_wpseo_content_score:
  - "90"
---



Classic database/schema migration patterns are a nightmare for modern systems. As Software Engineers push for a more distributed ecosystem, one is tempted to ask: “Why should the code that manages one system, live with the application code of another system?”

<HeadsUp title="What pattern is this?">
  My first exposure to this pattern was with Rails in 2013. With
  Rails/ActiveRecord, when your application boots up it checks the database
  schema against a list of schema changes you’ve defined and ensures the
  database meets those requirements.
</HeadsUp>

“But Brad, this is really convenient”. I agree that it is really convenient when
you’re working with a monolithic system that runs on one server. However, you start
to run into issues regarding responsibility when you encounter scalability.

As you scale up your monolith, you’re now running on multiple servers. If your application automatically runs schema migrations, you have the concern of multiple applications attempting to alter the schema. Of course, this can be alleviated via transactions and checking the schema before trying to run a new migration (which most migration libraries do).

## Enter Microservices

A recent trend, however, has been to split monoliths into microservices (a great trend, at that!). This poses the question: Do we also split up the databases? If you’ve been building a monolith for many years and hear this question, almost always, your answer will be “Maybe later.” That’s fine, it’s a scary concept and one that should be done slowly. But now you have a new issue: Multiple services managing the schema for that one database.

Imagine the following: We have a table for tickets and a table for users in a Rails monolith. We decide we want to break the users logic and the tickets logic out into their own services. We do that and everything seems fine, but we now see the error in our ways: The `tickets` table and the `users` table are connected via the `users_tickets` table. If we make migrations in the users service, the tickets service will also need to run those migrations. So who’s responsible for schema migrations on the `users_tickets` table?

## My Proposal

Hopefully, you can begin to see the issues with this pattern. Personally, I’ve taken to moving all of my schema migrations away from the framework and into their own tool. This means, disabling the “evolutions” support in the Play framework or ActiveRecord migrations in Rails. I’ve looked for alternatives for pulling the schema changes out of the application. At a previous employer, our DBAs used SQitch. I looked into that, as well as Liquibase. The price-point on Liquibase concerned me, and SQitch’s API didn’t look enjoyable to use.

That being said, investigating these tools was not without merit. They both left me with a lot of inspiration. I’ve been learning Go in my spare time and decided to tackle the problem myself so I built [Deckard](https://github.com/bradcypert/deckard). The journey of building this has been a blast, and it’s been very easy to start using as well. I know there’s still plenty of room to grow the tool, but I’m using it for several production applications currently. If you’d like to see how to use it, check out the readme in the link above or take a look at [this example on Github](https://github.com/Charitycode/CharityCode.org/tree/master/migrations).

Ultimately, the decision to keep your schema migrations alongside of your application is a decision we all must make, but after being bitten time and time again, choosing to pull the schema migrations out of my application was a decision I was happy to make.
