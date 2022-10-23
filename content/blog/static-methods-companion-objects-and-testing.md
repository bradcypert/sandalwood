---
title: "Static Methods, Companion Objects, and Testing"
date: 2018-07-18
status: publish
permalink: /static-methods-companion-objects-and-testing
author: "Brad Cypert"
excerpt: "A companion object sits inside a class definition and houses all the static methods which that class will own. Let's convert a piece of Java code to Kotlin so you can see what I mean."
type: blog
id: 586
thumbnail: /background-board-card-825262.jpg
category:
  - kotlin
tags:
  - "companion object"
  - kotlin
  - static
  - testing
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_primary_category:
  - ""
_yoast_wpseo_content_score:
  - "30"
_yoast_wpseo_focuskw:
  - "Companion Objects"
description:
  - "Learn to use Companion Objects to help with testing static methods in Kotlin. Find out how to make the most of your companion objects!"
_yoast_wpseo_linkdex:
  - "83"
_yoast_wpseo_title:
  - "Static Methods, Companion Objects, and Testing"
---

I’ve been working with Kotlin a ton recently, both at work and for fun. It’s a fantastic language on the JVM that combines almost all of my favorite Scala features and adds in several new features as well. If you haven’t given it a shot yet and you’re a Java reader, give it a try! You’ll love how expressive it can be and how simple and concise some of the code can be. If you’re a Scala reader, you’ll feel familiar with a lot of the syntax and ideas (Objects, replacing statics for example). One thing Kotlin does that still feels a bit weird is it promotes the use of companion objects. A companion object sits inside a class definition and houses all the `static` methods which that class will own. Let’s convert a piece of Java code to Kotlin so you can see what I mean.

```kotlin
class Foo {
  public Foo() {}
  public static String getBar() { return "Bar"; }

  public boolean amIFoo() { return true; }
}
```

We define a class with two methods, one of which is static. The first method, the static one, simple returns a string and the second method, the instance method just returns true. Since it’s an instance method, we’d have to new up a `Foo` to be able to call it. Let’s convert this to Kotlin.

```kotlin

class Foo() {
  companion object {
    fun getBar(): String { return "Bar" }
  }

  fun amIFoo(): Boolean { return true }
}

```

You’ll likely notice some differences:

1. We don’t have a constructor in our Kotlin class. Well… we do have a primary constructor and it’s this defined by the `()` in this block `class Foo()`.
2. We have a companion object. We’ll talk more about that in a moment.
3. We don’t need semi-colons.
4. We define functions differently, specifically using the `fun` keyword. That’s because Kotlin is fun! 😉

It’s worth mentioning that we can actually simplify our Kotlin code to be even more idiomatic. Let’s do that first and then we’ll talk about the companion object.

```kotlin
class Foo() {
  companion object {
    fun getBar() = "Bar"
  }

  fun amIFoo() = true
}
```

The only thing I wanted to point out here is that simple functions (as in, one-liner function bodies) can be inlined instead of using `{}` expression blocks. Anyways, Companion Objects!

## Companion Objects

Companion Objects are how you define static methods in Kotlin. A companion object is built from two Kotlin keywords: `companion` and `object`. To fully understand a companion object, we must first understand an `object`. The `object` keyword starts an object declaration. It’s important to note that this is a declaration and not an expression, so it cant be used on the value side of an assignment. **That being said, `object` allows you to define a Singleton object.** So then what is a `companion`? A `companion` is paired with a class and is used to indicate that the object we’re about to define can be called simply by using the class qualifier that this object is nested in. This means that in our above example we can call `Foo.getBar()` in Kotlin. Why did I say “in Kotlin?” That’s because in Java, you’ll actually reference the companion object’s functions like so: `Foo.Companion.getBar()`. There’s arguments and merits to this syntax (but why would you write Java when you could write Kotlin?) and I won’t go into those here but I will say that I’m a fan of it, because it explicitly calls out the Kotlin interop from your Java code.

## Companion Objects – Why?

So why in the world do we have companion objects? Kotlin is an extremely object-oriented language (with some “functional” love as well). The language tends to favor the use of classes and objects over random functions so much that it even allows you to extend existing objects and provide new methods onto them (at compile time; they compile out to statics). Coming from a heavy functional background, I really started to question why this was but the more I looked into it the more I saw similarities between functional languages (like Clojure) and the heavy use of singleton objects like in Scala and Kotlin. In most of the functional languages, you have namespaces. In Kotlin and Scala, you have objects. These are different but they both provide one similar thing — They’re both a target for mocks when testing. In Clojure, you can easily mock out a namespace. In Kotlin, you can easily mock out an object. This allows you to write static methods with all the benefits of them (they can be static at run-time) but to be able to mock them for testing purposes. With a library like Mockito (there’s even Kotlin bindings and extensions), testing (what would be) statics is a complete breeze.

Interested in learning more about Kotlin? [Check out my other Kotlin articles here](http://www.bradcypert.com/category/kotlin/)!
