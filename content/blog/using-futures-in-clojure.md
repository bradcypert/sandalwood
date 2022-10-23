---
title: "Using Futures in Clojure"
date: 2017-10-29
status: publish
permalink: /using-futures-in-clojure
author: "Brad Cypert"
excerpt: ""
type: blog
id: 73
category:
  - clojure
tags:
  - Async
  - clojure
post_format: []
description:
  - "What is a future?\nA future is simply a function that executes code on a background thread and can be dereferenced to get the result of that code."
_yoast_wpseo_title:
  - "Using Futures in Clojure"
---

It’s late at night so I’ll keep this post short. I’m going to quickly cover how to use Futures in Clojure and why you would want to use them. Let’s start with the why.

#### What is a Future?

A future is simply a function that executes code on a background thread and can be dereferenced to get the result of that code. Here’s what they look like!

```clojure
(future (println "foo") (+ 1 1))

```

This code will start a new thread, print “foo” and then do the heavy-lifting of calculating 1+1.

Keep in mind the result of a future has to be dereferenced. If you try to log a future hoping to get the result, you’ll just get the instance of the future. Instead, dereference them with `(deref my-future-here)` or, the reader macro, `@my-future-here`.

#### Why Future?

Imagine that you have `N` operations that all work independently of each-other. Let’s say that each operation is a function and that function calculates the cost of an item in someone’s shopping cart. Let’s also assume that each function takes 2.5 seconds to run. If you want to calculate the total of someone’s cart with 3 items in it, it’s going to take you 7.5 seconds based off of what we have. Alternatively, you may say “Hey. I’ve got 4 threads on my machine. Why don’t I just delegate those threads to doing the calculations? It should then only take 2.5 seconds total.” This is the perfect case for using futures to background tasks.

#### A bigger example

I’ve recently been working on an “omnisearch” feature for a Clojure api that I work on for Porios (The Podcast Place). One of the parts about this search is that it needs to query 3 different sources to determine matches. We check usernames, podcast names, and episode names. The response is simply all the results that match a given query. Notice that since the result of one call isn’t dependent on the results of a previous, these make great targets for multithreading with futures.

Here’s some code to accomplish that!

```clojure
(let [users-future (search-users query limit offset)
      podcasts-future (search-podcasts query limit offset)
      episodes-future (search-episodes query limit offset)]
          {:users @users-future
           :podcasts @podcasts-future
           :episodes @episodes-future})

```

In the let-binding we’re calling 3 functions that return futures, then we’re dereferencing them at the end as we place them in our data structure.

#### A Case for Returning Futures

Writing this code got me thinking a lot about lazy evaluation. Futures, in a way, provide some of the same benefits as lazy evaluation in regards to the main thread. Lazy evaluation allows you to defer computations until you actually need to realize the result of those computations and futures allow you back-burner those computations on another thread. In both cases you’re still allowing the main-thread to carry on, but with lazy evaluation you’re still forcing that thread to do the computation at some point (if its needed) and futures take the burden off the main thread entirely (in regards to that computation, at least). I know threads become your limit at some point but I think I’d be okay seeing a lot more Clojure code, especially libraries, with functions that return promises to leverage the multi-threaded machines that are so commonplace in this day and age.
