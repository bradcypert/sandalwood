---
title: "Why I Switched from Python to Clojure"
date: 2016-07-18
status: publish
permalink: /why-i-switched-from-python-to-clojure
author: "Brad Cypert"
type: blog
id: 24
images:
  - Screen-Shot-2019-03-25-at-9.21.39-AM.png
category:
  - clojure
  - Meta
  - Python
tags:
  - clojure
  - meta
  - Python
description:
  - "I spent some more time with Python and started to realize that I needed something more. Here's a brief list of the reasons why I switched to Clojure."
---

First – a bit of background. When I first started to learn programming, I started with a course in high school that focused on Java. From there, I decided I wanted to work for a start-up and I had to learn Python (I was naive). I started playing around with Python and it just felt right – at first. I spent some more time with it and started to realize that I needed something more. Here’s a brief list of the reasons why I switched from Python to Clojure.

## Interpreted Language

Python is a [dynamic language](https://en.wikipedia.org/wiki/Dynamic_programming_language). There’s a massive list of Pros and Cons for this, but I’ll highlight a few of my concerns.

- It’s easy to introduce bugs on uncommon code paths that would be much more obvious in a compiled language.
- The performance of an interpreted language is almost always slower than a compiled language.

Those things aside, I **LOVED** being able to quickly run code with a fast turn around time. When testing, I didn’t have to worry about compiling anything and, when I was developing with [Flask](http://flask.pocoo.org/), tools like Live-Reload were things I didn’t want to give up.

With Clojure, I found that I could have the benefits of an Interpreted Language and the benefits of a compiled language, too! By leveraging Clojure’s REPL, I’m able to quickly test code before/while/after I write it. You’re able to switch into your Clojure code's namespace and test any functions you’ve written, as well as get the source code for any specific function, or check the docs for any function too! If you’re not using the REPL when you’re writing Clojure, you really should give it a try! If you’re using Leinengen, you can run `lein repl` from your project directory!

With Clojure, you compile down to Java Byte Code when you run your application or library. You get the benefits and performance optimizations of a compiled language, but can treat it like an interpreted language when developing. It’s great!

## Classes Vs Data

When I moved from Java to Python, I fell in love with Mutable Dictionaries. I became very intimate with the dictionary API and defaulted to using them instead of classes because they often met my needs on their own and honestly, the “implied self parameter” on python methods turned me off. For the non-pythonistas, dictionaries are basically just a map data structure.

When I learned about Clojure, I was baffled by their lack of classes, but felt liberated by the thought of only writing functions in namespaces. I decided to give it a try and immediately started thinking of Dictionaries in Python and how I didn’t enjoy writing classes. With Clojure, I’m able to focus on what the data looks like, and not on how an object is expected to act (What’s an instance of a class but a hash-map with some namespaced functions anyways?).

## Immutable Data & Stateless Code

Like most now-functional programmers, I had **THE** incident. I had a class with several methods, but only two were particularly important. Both methods were glorified getters, but the 1st method updated the value that was returned by the 2nd. This was extremely misleading when the code executed. In fact, almost all of the bugs with this code involed this theme. I didn’t know what to do and I thought this was the expected way to write code. I later read a great post on immutable data and tried writing my python code this way. This worked great – until I started working with other developers.

With Clojure, you have to fight to use mutable data structures (that’s not to say it’s impossible, it’s just not the default). More importantly, if you’re working with Clojure developers, the chances are high that they’re very familiar with the benefits of immutable data. I say “fight” because, when you do want to mutable structures, you do have to put forth some effort to do it, but you won't often find yourself needing them.

## Community

Don’t get me wrong, the Python community is great. It's probably one of the best communities out there. Theres a massive number of Pythonistas and conferences and ways to continue learning about the language. In comparison, Clojure’s community is very small. 

As you know, the communities are the groups of people responsible for building libraries for the language to use and helping people who get stuck with strange error messages or confusing domain problems. In terms of libraries, Clojure has extremely nice Java Interoperability (Clojure can call Java code directly from itself). This means that Clojure has access to **ALL** Java libraries and any Clojure libraries as well. That’s a vast amount of libraries!

The support and documentation for most Clojure code pales in comparison to Python, but what I have noticed is that Clojure code tends to be documented where it really counts. For example, Clojure’s core API is relatively lean and extremely well documented. Additionally, the Clojure community didn’t experience the [weird split that Pythonistas had with Python2 and Python3](https://wiki.python.org/moin/Python2orPython3) that created a massive rift in terms of documentation, blog posts, and more. 

## No \_\_init\_\_.py or setup.py

You can argue that these are both shitty reasons to dislike python, but \_\_init\_\_.py and setup.py irritated me a lot.

For those who don’t know, and `__init__.py` file is used to declare a directory as a python module, while a `setup.py` is used to define how other scripts should interact with yours. 

That being said, neither of these have to do just that. In fact, I feel like the expectations for what each should do is extremely vague and troublesome. Some people prefer to import modules into their `__init__.py` or even add convenience functions there, too. It’s often easy to overlook these files, but if you can’t find the definition for a particular function or module, check the `\_\_init\_\_.py`.

As for \_\_setup\_\_.py, you should probably just call the `setup` function from `distutils.core`. But, you can do more in that file – so much more! In fact, the actual documentation on this is pretty vague on what all should exist in a setup file, and can be found [here](https://docs.python.org/3/distutils/setupscript.html).

The Clojure community has gravitated towards Leinengen and everything is handled in a nice `project.clj` file. That being said, you can also use a nice, structured `.gradle` file, if that’s more your cup of tea. A `project.clj` file is defined similar to a `package.json` if you’ve ever used NPM for a JavaScript Project.

## The Switch

To sum everything up, I switched predominantly because I wanted to speed and comfort of the JVM, but wanted a language that supported functional programming paradigms. Which do you prefer – Python or Clojure or something else? Comment below and let me know!

If you’d like to learn more about Clojure, you can [find my additional Clojure related posts here](/tags/clojure/) (the KNN one is great)!
