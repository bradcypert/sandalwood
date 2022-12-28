---
title: "Using Generics in Scala"
date: 2018-02-15
status: publish
permalink: /using-generics-in-scala
author: "Brad Cypert"
description: "Scala has, in it's core library, several classes that are intended to contain (at some point or another) some instance of another class. A few examples of this are seen in Option and Future. These container classes allow you to act upon values that may or may not exist or even to work with values that should appear in the future (hence the name \"Future\"). The idea of these container classes is fundamentally simple"
type: blog
id: 156
category:
  - Scala
tags:
  - Generics
  - Scala
images:
  - pexels-spoons.jpg
versions:
  scala: 2.8
---

Scala has, in it’s core library, several classes that are intended to contain (at some point or another) some object. A few examples of this are seen in [Option](https://www.scala-lang.org/api/2.12.2/scala/Option.html) and [Future](https://www.scala-lang.org/api/2.12.2/scala/concurrent/Future.html). These container classes allow you to act upon values that may or may not exist or even to work with values that should appear in the future (hence the name “Future”). The idea of these container classes is fundamentally simple. Let’s define a container class to hold an instance of class called Egg.

```scala
class Container {
  private var eggs: List[Egg] = Nil
  def push(egg: Egg) { eggs = egg :: eggs }
  def peek: Egg = eggs.head
  def pop(): Egg = {
    val currentTop = peek
    eggs = eggs.tail
    currentTop
  }
}

val eggContainer = new Container
eggContainer.push(new Egg)
eggContainer.pop

```

Now, this container isn’t anything special. In fact, you might realize that this is simply a stack of eggs, with the ability to pop an egg onto the stack or pop an egg off the stack. Regardless, this is a class that contains instances of another class. However, this stack is specific to eggs despite not actually containing any logic that is egg related. To create the same Container for Bananas, we’d need to copy and paste and write the same thing again! Gross! To alleviate this, we can actually create the same Container class using a generic so we can specify the type of objects that the container will contain.

```scala
class Container[A] {
  private var items: List[A] = Nil
  def push(item: A) { items = item :: items }
  def peek: A = items.head
  def pop(): A = {
    val currentTop = peek
    items = items.tail
    currentTop
  }
}

val eggContainer = new Container[Egg]
eggContainer.push(new Egg)
eggContainer.pop

val bananaContainer = new Container[Banana]
bananaContainer.push(new Banana)
bananaContainer.pop

```

You’ll notice that with the use of generics, we can reuse the same class for instances of different objects. You’ll also notice the `[A]` in the class definition. This signifies that instances of this class are constructed with a provided type which tells the compiler what type of objects this class is going to contain. The `A` is a variable and supplied type is substituted wherever the `A` appears in the class definition. When we create a `new Container[Egg]` we’re specifying that we’re going to be pushing `Egg`s into the container and retrieving them from the container. When we create a `new Container[Banana]`, we’re specifying that we’re going to be pushing `Banana`s into the container and retrieving them from the container. Neat!

The idea of generics really shines when working with Options and Futures. Options allow you to work with a container which contains 0 or 1 of the supplied type. This may not sound that important but this helps developers avoid the treacherous null pointer exception! Futures allow you to work with a container which may contain a value in the future. Both of these solutions work in a typed system thanks to generic types. Generics provide you the tools to abstract in a simple and safe manner without downgrading all expected types to `Object`s. Hopefully you can see a use case for them and will consider using them in the systems you build going forward!
