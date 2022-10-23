---
title: "Understanding Clojure Macros"
date: 2016-06-14
status: publish
permalink: /understanding-clojure-macros
author: "Brad Cypert"
excerpt: ""
type: blog
id: 21
category:
  - clojure
tags:
  - clojure
  - jvm
  - macros
description: "Macros allow you to write code that's effectively writting more code for you, possibly by transforming the code provided to the macro. Clojure has an expressive macro system that helps aid in this."
---

Learning Clojure has been one of the most thought-provoking experiences of my life. Coming from a predominantly OOP background, it’s safe to say that it’s always been a bit of a challenge. Macro’s specifically, were a challenge that was hard for me to grasp, and I know cause a lot of pain points to new Clojuristas. To first understand a Macro, we must understand what a function does.

#### What is a function?

For the sake of this example – A function is a named procedure that tells a computer to do something (realistically, it’s a mapping between values that undergo a set sequence of instructions that transforms input into output, but that’s overkill for this example). A real life example is “taking out the trash.” When someone tells you to take out the trash, you know what steps you must take to make this happen. They can also provided more information (called arguments) to help you make a decision on which trash to take out – “Take out the **bathroom** trash.” Functions give us an easy way to refer to repeatable tasks, and computers treat them the same way.

#### What is a macro?

A macro, in the Clojure world, is effectively a function that operates upon code instead of values. A great real world example is telling someone to **not** take out the trash or **not** close the door. Take out the trash and close the door are functions, but not changes the meaning of those functions. In the case of a computer program, Macros change the execution of a function. A great example is this macro, called **do-nothing**.

```clojure
(defmacro do-nothing
  "always returns nil"
  [f]
  nil)

```

We can call it like so…

```clojure
(do-nothing (list 1 2 3))

```

Without the **do-nothing** call, this would return `'(1 2 3)`, but since this macro is processed before the function is registered, we’re actually able to just return nil, like in the example above.

It’s important to keep in mind that the macros return value is executed in place of the Macro and its arguments, when the code is actually ran. That being said, using the `do-nothing` macro is roughly the same as just using `nil`, because of what the macro does.

#### A more interesting example

Most Clojure macros are written to manipulate a list of data and your code often expects a list to be returned from your Macros. An important tool for this is a macro called syntax quoting and it’s the backtick. That’s right, the backtick. Check out this Macro that uses the syntax quoting.

```clojure
(defmacro do-second [f] `(rest ~f))

(do-second (println (list 1 2 3)))
$> (1 2 3)

```

Notice the backtick and the tilde. The backtick says, “I’m going to syntax quote everything unless told otherwise”, the tilde says “I’m telling you otherwise for this next item”. The backtick fully resolves all function names (core/rest in this case), which makes it valid in this context. Then, we use the unquote macro (**~**) to tell our code to “Use the parameter F, not a fully qualified version of the F symbol”. F, in this case, is `(println (list 1 2 3))`. Rest gives us everything but the first element, so we skip the println and evaluate the `(list 1 2 3)` bit.

#### Macro Expansion

Clojure has a great macro (look at that! A macro for dealing with macros) for helping you learn more about the macros you’re running. It’s called macroexpand. Let’s use it on our previous example.

```clojure
(macroexpand '(do-second (println (list 1 2 3))))
$> (clojure.core/rest (println (list 1 2 3)))

```

You can see that the result is the code that our macro runs to generate our return value. You’ll also notice that the **rest** call is fully qualified. This lets us know exactly what our macro is doing to our code.

This tool can be extremely powerful in figuring out what exactly a macro does under the hood, and can be used with your REPL to really dig into the language.

#### Macros, a core piece of Clojure

One of the most interesting pieces of macros, in my opinion, is how much of the core language is written with them. **if-let**, **or**, and even **-&gt;&gt;** are actually Clojure Macros. Dig into Clojure yourself and see if you can find any interesting parts of the language that you didn’t expect to be macros. Also, feel free to share any interesting macros you have below in the comment section!
