---
title: "The Many Constructors of Dart"
date: 2020-09-09
status: publish
permalink: /the-many-constructors-of-dart
author: "Brad Cypert"
excerpt: ""
type: blog
id: 3559
images:
  - pexels-iconcom-226569.jpg
category:
  - dart
tags:
  - dart
description: 'Dart has many different forms of constructors including redirecting constructors, factory constructors, constant constructors and more!'
versions:
  dart: 2.16.2
---

Last night, as I was writing code in a Flutter app, I came across an interesting dilemma. I wanted to throw a custom exception if I was unable to sign in with Apple on the login screen — nothing too crazy. Naturally, this lead me to creating a custom exception. I tried something along the lines of:

```dart
class PlatformException extends Exception {}
// ^ does not work!
```

However, I found out quickly that this wasn’t valid. In fact, you get an error that looks like this: `The generative constructor 'Exception Exception([dynamic message])' expected, but factory found - line 1`. This lead me down the rabbit-hole that prompted me to write this post.

I need you to know that I’m not an expert with Dart by any means. I’m learning as I go, but I like to think that, with my studies in Clojure, Java, Scala, Kotlin, Python and a few others, I have a decent understanding on how to construct an object. This message, however, made my second guess myself.

[If you google that error message, you’ll quickly find two things](https://github.com/dart-lang/sdk/issues/25874). First, to create a custom exception, you must implement the Exception class instead of extending it.

```dart

class PlatformException implements Exception {}
// ^ this one works

```

Second, you’ll find that the `factory` in question from the error message stems from the fact that the Exception class uses a “factory constructor.” Despite using factories and constructors, I’ve never heard of a “factory constructor” before, so I felt inclined to investigate. What I found was that [Dart has many (and I do mean **many**) different ways to construct an object](https://dart.dev/guides/language/language-tour#constructors).

## The Classic Constructor

To understand the alternatives, we must first understand the classic constructor (the ~90% use case constructor). If we have a class called `Person`, it might simply look like this:

```dart
class Person {
  String name;
  Person(this.name);
}
```

This is a more concise version of the [classic Java constructor syntax](https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html) (which can also be used in Dart like so):

```dart
class Person {
  String name;
  Person(String name) {
    this.name = name;
  }
}
```

Both of these are roughly the same thing. They both create a class that can be instantiated by calling `Person("Brad")`. This is (arguably) the simplest constructor type available in Dart.

## Named Constructors

Dart also provides a constructor that is referred to as a “Named” constructor. To properly illustrate how this can be valuable, let’s adjust our `Person` class to include an `ageGroup` field. We’ll make it a simple “child” or “adult” string choice (you can validate the choice on your own time 😉). Finally, we’ll add a `bool` to determine whether or not they have access to something. Adults have access, kids generally do not, although we may make exceptions (hence why we don’t derive this property).

We could write our new class like so:

```dart
class Person {
  String name;
  String ageGroup;
  bool hasAccess;
  Person(this.name, this.ageGroup) {
    this.hasAccess = this.ageGroup == "adult";
  }
}
```

However, as mentioned above, Dart provides [a concept known as Named Constructors](https://sites.google.com/site/dartlangexamples/learn/class/constructors/named-constructor) that can help us better illustrate the business problem that we’re trying to solve with the code above.

```dart
class Person {
  String name;
  String ageGroup;
  bool hasAccess;

  // lets provide a standard (classic) constructor so people
  // can new up a very configurable person
  Person(this.name, this.ageGroup, this.hasAccess);

  // lets use named constructors to help express our business
  // logic a little better.
  Person.adult(this.name) {
    this.ageGroup = "adult";
    this.hasAccess = true;
  }

  // and now one for a child as well
  Person.child(this.name) {
    this.ageGroup = "child";
    this.hasAccess = true;
  }
}

```

This gives you the flexibility to instantiate a Person via `Person("Brad", "adult", true)`, `Person.adult("Brad")`, or `Person.child("Luna")`, each with their own constructor function.

It’s important to remember that constructors are **not** inherited in Dart. This means if we were to extend Person with a new class, that new class would not have access to `.child` or `.adult`.

**Bonus points: Named constructors are a wonderful use case for de-serialized data. `Person.fromJson(String jsonString)`!**

## Redirecting Constructors

Redirecting constructors are constructors with an empty body that simply proxy to another constructor.

This can allow us to clean up the above example by proxying to the original constructor.

```dart
class Person {
  String name;
  String ageGroup;
  bool hasAccess;

  // lets provide a standard (classic) constructor so people
  // can new up a very configurable person
  Person(this.name, this.ageGroup, this.hasAccess);

  // named + redirect is pretty clean;
  Person.adult(String name): this(name, "adult", true);

  // and now one for a child as well
  Person.child(String name): this(name, "child", false);
}
```

## Constant Constructors

Constant Constructors are a bit of a weird case. A constant constructor requires the class to have all final fields and a `const` constructor. If we know that we’re never going to change any of our fields, then we may want to use a constant constructor.

```dart
class Person {
  final String name;
  final String ageGroup;
  final bool hasAccess;

  const Person (this.name, this.ageGroup, this.hasAccess);
}
```

Constantr Contstructors work great with Read-Only data and are extremely effective in sharing memory. For example, since the constructor is constant, any time that you pass the same arguments to a constant constructor, the same object will be shared between the references. This means that calling the same constant constructor with the same arguments will only create one object in memory.

It's important to note that your properties may also need to be constant for this to effectively work. For example, a list being passed to a constant constructor also needs to be a constant list (use the `const`) keyword when creating that list.

## Factory Constructors

Finally, we’re ready to tackle what started this weird journey to begin with. In case you forgot (and won’t scroll up), I ran into the word `factory`, which pointed towards `factory constructor` while trying to extend `Exception` from the Dart standard library.

Factory constructors are constructors in Dart that may return either a new instance or an existing instance of their respective class. In this very primitive and contrived example, imagine that we want each person to be unique. Factory constructors help us ensure that we aren’t creating a new class that violates our unique constraint. Commonly, they’re paired with internal constructors to actually construct the new instance of the object when needed.

```dart
static final Map<String, Person> _cache =
    <String, Person>{};

class Person {
  String name;
  String ageGroup;
  bool hasAccess;

  factory Person (String name, String ageGroup, bool hasAccess) {
    return _cache.putIfAbsent(
        name, () => Person._internal(name, ageGroup, bool));
  }

  // "_internal" is just a convention. You can name this whatever.
  // but the underscore (_) is what makes it internal
  Person._internal(this.name, this.ageGroup, this.hasAccess);
}
```

It’s worth mentioning that you would invoke a factory constructor just like you would any other constructor. Additionally, it’s important to know that factory constructors do not have access to `this` (as they havent created it, yet)!

So that wraps up my weird journey into learning about Dart’s many constructors. No source code was harmed in the production of this blog post.
