---
title: "Mighty Morphing Multimethods"
date: 2016-08-02
status: publish
permalink: /mighty-morphing-multimethods
author: "Brad Cypert"
type: blog
id: 27
category:
  - clojure
tags:
  - beginner-friendly
  - clojure
  - multimethods
description: "Today we’re going to talk about Multimethods, a particular form of runtime polymorphism. And since I’m in a playful mood, our example is going to involve Power Rangers."
---

Type systems are a tricky thing. A lot of languages have very flexible type systems, such as F# with its inferred (and extremely well inferred at that) type system, or JavaScript with it’s untyped nature. Clojure hits a happy middle ground (for me, at least) – It’s dynamically typed (or “gradually typed”, if that’s your cup of tea).

Why is the typing important? Polymorphism. Most of you probably learned polymorphism from your introduction to object-oriented programming course/book which was probably in C++ or Java. While it’s true, polymorphism is blatantly obvious in OOP, it’s still a thing in functional languages, too. Clojure, considering it runs on the JVM as well, is certainly no exception. Today we’re going to talk about Multimethods, a particular form of runtime polymorphism. And since I’m in a playful mood, our example is going to involve Power Rangers.

Behold, a multimethod in all of it’s glory!

```clojure
(defmulti fight
  (fn [ranger]
    (:color ranger)))

```

Now, I’m going to go ahead and clear the air – this “multi” doesn’t really do anything, because we haven’t written any “methods” for it to dispatch to. The way that this “multi” works is like so – We can call `(fight my-power-ranger)` and it will look up the color of the ranger, then it will call the appropriate method for the given color (which we haven’t defined yet). Let’s go ahead and make a few rangers to play with.

```clojure
(def r {:color :red :name "Steve"})

(def b {:color :blue :name "Jessica"})

```

Simply enough, we’re just binding maps of color and name values to symbols. Now that that’s out of the way, we can go ahead and define our methods.

```clojure
(defmethod fight :red
  [ranger]
  (str (:name ranger) ", the red ranger, fights with the sword of light!"))

(defmethod fight :blue
  [ranger]
  (str (:name ranger) ", the blue ranger, fights with the thunder slinger!"))

```

If we run all the above code in our repl, we should see something like the following:

```clojure
(fight r)
;Steve, the red ranger, fights with the sword of light.

(fight b)
;Jessica, the blue ranger, fights with the thunder slinger!

```

Thats… cool. But certainly not something we need a multimethod for and that’s certainly not how the power rangers would fight. They’d fight together by fusion of their colors (basically, the red and blue ranger can become a red-blue ranger)! Let’s add a new method to handle this.

```clojure
(def rb {:color '(:red :blue) :names '("Jessica" "Steve")})

(defmethod fight '(:red :blue)
  [ranger]
    (let [color (:color ranger)
          name  (clojure.string/join " & " (:names ranger))]
      (str "Fusing together, " name " reach their ultimate power!")))

```

That’s a little bit more interesting. We’re now able to dispatch off the **values** of a list of colors. Perhaps we wanted to dispatch off the type instead of the value. You could define a multimethod that uses `(type (:color ranger))`, but a better option is to learn about protocols. They’re made for specifically dispatching off of types and are much faster than multimethods for that purpose.

I’ll get a post up soon explaining how to use protocols. In the mean time, check out the [official docs here](http://clojure.org/reference/protocols).

What do you think of multimethods? Let me know below!
