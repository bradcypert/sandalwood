---
title: "Threading Pipelines in Clojure"
date: 2016-12-24
status: publish
permalink: /threading-pipelines-in-clojure
author: "Brad Cypert"
excerpt: ""
type: blog
id: 43
category:
  - clojure
tags:
  - clojure
  - macros
  - threading
post_format: []
description:
  - "In this post, we cover the Thread macro in Clojure and how to use it to define data transformation pipelines. Additionally, we look at the comp function and it's ability to act as an alternative."
_yoast_wpseo_title:
  - "Threading Pipelines in Clojure"
---

Today we’re going to talk about the `thread` macro (`->`) and how to manipulate functions to fit them into your “thread pipeline”. First, let’s figure out what exactly the thread macro is.

#### The Thread Macro

If you’ve used `->` before, you’ve done some threading. Other languages refer to this as “piping”, although this can be often confused with piping from the command-line. Check out this code (that doesn’t use the threading macro).

```clojure
(first
  (get-accounts
    (get-user 8675309)))

```

Now this isn’t complicated, per se, but it could be a bit easier to figure out what exactly is going on. If you’re unaware — this is getting the first account for the user whom has an id of 8675309 (Jenny). Let’s rewrite this with the threading macro!

```clojure
(-> 8675309
    get-user
    get-accounts
    first)

```

Indeed, the threading macro really illustrates the order of our operations in a linear fashion. We “thread” the number 8675309 into `get-user`, then that result into `get-accounts`, and then that result into `first`. Neat! To compare, I commonly read this as “I’m threading 8675309 into get-user, then that into get-accounts, then that into first.”

But Brad, why use this over the non-threaded version above? Threading takes more lines of code and is out of the standard AST-style structure that Clojure generally is written in. You’re totally right! The threading macro is great for defining a series of operations, or pipeline, over data. It also makes it very easy to modify the existing pipelines by simply adding your new function in the appropriate location.

Let’s look deeper at the threading macro. Running `(doc ->)` (as of Clojure 1.8) gives us the following:

```clojure
-------------------------
clojure.core/->
([x & forms])
Macro
  Threads the expr through the forms. Inserts x as the second item in the first form, making a list of it if it is not a list already. If there are more forms, inserts the first form as the second item in second form, etc.

```

Simple enough. We’re able to take an expression and run it through a form. Then, the result of that will be ran through the next form (and so on and so forth) until we run out of forms. Here’s a simple example.

We want to take a number, square it, add 5, and then square that. We can write that using anonymous functions like so.

```clojure
(defn square-five-square [n]
  (-> n ; let n = 2
      (#(* %1 %1)) ; 2 * 2 = 4
      (#(+ 5 %1)) ; 4 + 5 = 9
      (#(* %1 %1)))) ; 9 * 9 = 81

```

Notice how the last result is used as the supplied expression the the following form?

Now, you’re probably thinking “Brad, I feel like I’ve seen something similar accomplished in another way before.” You’re right, and as a little bonus, let’s briefly talk about `comp`.

`comp` is a function that “composes” functions together. Using our above example, we could rewrite this using `comp` instead of the `->` (thread) macro. That last sentence also highlights a very key difference. `comp` is a function and is executed at run-time. `->` is a macro and is executed at compile-time.

Enough chatter! Let’s write that function using comp instead!

```clojure
(defn square-five-square [n]
  ((comp
    #(* %1 %1)
    #(+ 5 %1)
    #(* %1 %1))
   n))

```

What this does is quite simple, really. We’re composing three anonymous functions into one single function. Then, we’re executing that function with `n` passed into it as the only parameter.

Let’s see what happens if we execute this function with `2`. It should give us `81`, just like our previous example with the threading macro.

```clojure
nlp.core=> (square-five-square 2)
81

```

Hey! It works! Hopefully you now see that you have two new options to define transformation pipelines in Clojure! For what it’s worth, there’s other ways to define these transformations as well, but these are the most common ways that I would do it. Which do you prefer – the `->` or the `comp` approach? Let me know below!
