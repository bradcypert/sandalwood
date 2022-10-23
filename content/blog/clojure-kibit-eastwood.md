---
title: "Clojure + Kibit & Eastwood"
date: 2017-06-28
status: publish
permalink: /clojure-kibit-eastwood
author: "Brad Cypert"
excerpt: ""
type: blog
id: 61
category:
  - clojure
tags:
  - clojure
post_format: []
_yoast_wpseo_title:
  - "Clojure + Kibit & Eastwood"
---

I’ve been writing Clojure for a while now, but my day job is still predominantly JavaScript and Java. There are two tools that I use every single time I write JavaScript and Java code. Respectively, a linter and a static code analyzer. Recently, I set out to search for similar tools in the Clojure domain.

#### Enter Eastwood

Named after a fantastic actor, [Eastwood](https://github.com/jonase/eastwood) is a linter for Clojure code. Also like the many roles the actor plays, Eastwood is pretty aggressive in the checks that it runs against your code. However, like Clint Eastwood in _The Bridges of Madison County_, Eastwood can also be understanding. You can configure Eastwood to meet the demands of your project, but it ships with a great default configuration too!

Implementing Eastwood is extremely simple. You can add the Eastwood plugin to your project if you’re using leinengen or incorporate the library into your build pipeline if you’re using boot. I’ve still yet to be sold on boot (and this post is a bit pressed for time), so I’ll only be showing you how to incorporate the plugins into leinengen. Modify your `project.clj` to include the Eastwood plugin:

```clojure
(defproject myproject "0.0.1"
  :description "Eastwood Sample Project"
  :license "Eclipse Public License 1.0"
  :url "http://www.bradcypert.com"
  :dependencies [[org.clojure/clojure "1.8.0"]]
  :plugins [[lein-tar "3.2.0"]
            [jonase/eastwood "0.2.4"]])
```

Once you’ve done this step, you can simply run `lein eastwood` from the terminal to lint your clojure application! An example output from one of my application is as follows:

```
== Eastwood 0.2.4 Clojure 1.9.0-alpha16 JVM 1.8.0_31
Directories scanned for source files:
  src test
== Linting app.routes.users ==
src/app/routes/users.clj:133:43: suspicious-expression: -> called with 1 args.  (-> x) always returns x.  Perhaps there are misplaced parentheses?
src/app/routes/users.clj:115:3: constant-test: Test expression is always logical true or always logical false: true in form (if true (do (users/update-user-password {:hash (:id params), :pass (:pass params)}) (ok)) (bad-request))
== Linting app.routes.login ==
== Linting app.helpers.helpers ==
== Linting app.routes.inbox ==
== Linting app.middleware ==
```

You can see from the example output that Eastwood found an issue with users.clj line 133. The issue is that there’s a suspicious expression: specifically, we’re threading `x` into nothing. Seems like a good thing for us to clean up! Below that, you’ll see that our `if` expression is always checking against `true`. Specifically, because our code is `(if true ... ...)`. It looks like this was probably added as a quick solution, and I wouldn’t be surprised to find a `TODO` above that expression. Regardless, that’s an example of how to use Eastwood to help lint your Clojure code.

#### Kibit

[Kibit](https://github.com/jonase/kibit) is another tool, specifically for static analysis of your codebase. Kibit is literally one of my favorite tools in the clojure ecosystem and I can’t recommend this enough to newcomers to Clojure. Kibit provides a great opportunity to write code and learn a more idiomatic way to solve the same problem. It also introduces you to some of the “combination” expressions like `if-let`. Kibit can be incorporated similarly to Eastwood, but serves a different purpose. Let’s go ahead and add kibit to the above project definition as well. Note: You don’t need Eastwood for Kibit or vice-versa.

```clojure
(defproject myproject "0.0.1"
  :description "Eastwood Sample Project"
  :license "Eclipse Public License 1.0"
  :url "http://www.bradcypert.com"
  :dependencies [[org.clojure/clojure "1.8.0"]]
  :plugins [[lein-tar "3.2.0"]
            [jonase/eastwood "0.2.4"]
            [lein-kibit "0.1.5"]])
```

Let’s run `lein kibit`, you’ll see output like this:

```
At /Users/brad/Projects/podcasts/app/src/app/db/processors.clj:14:
Consider using:
  (update-in podcast [:feed] podcast-service/parse-feed)
instead of:
  (assoc podcast :feed (podcast-service/parse-feed (:feed podcast)))

At /Users/brad/Projects/podcasts/app/src/app/db/processors.clj:30:
Consider using:
  (when (not exists?)
    (doall
      (map
        (partial notifications/new-episode podcast episode)
        subscribed-users)))
instead of:
  (if (not exists?)
    (doall
      (map
        (partial notifications/new-episode podcast episode)
        subscribed-users))
    nil)

At /Users/brad/Projects/podcasts/app/src/app/modules/auth.clj:17:
Consider using:
  (if-not (some nil? [item source]) (hashers/check item source) false)
instead of:
  (if (not (some nil? [item source])) (hashers/check item source) false)
```

Kibit will actually scan your code and check it against patterns with `core.logic` to help determine how to simplify and reduce your code complexity. There output excerpt here shows two different suggestions: Simplifying an `if` to a `when` and condensing an `if` and `not` to an `if-not`. You can actually run `lein kibit --replace` and it will fix these issues for you. If you’re afraid of letting it automatically replace everything, you can even choose to run Kibit in interactive mode via `lein kibit --replace --interactive`. This will walk you through each occurrence and ask if you’d like to replace it with the suggestion provided.

We’ve recently added Kibit and Eastwood into our codebase for Porios and hope to see cleaner, more consistent code in the future. Have you had experience with Linters or Analyzers in Clojure? Let me know below!
