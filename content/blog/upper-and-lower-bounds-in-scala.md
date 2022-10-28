---
title: "Upper and Lower Bounds in Scala"
date: 2018-04-09
status: publish
permalink: /upper-and-lower-bounds-in-scala
author: "Brad Cypert"
type: blog
id: 289
images:
  - /TypeBounds-1.jpg
category:
  - Scala
tags:
  - Scala
  - type-bounds
description: 'Scala supports upper and lower bound type constraints via the covariant and contravarient keyword.'

---

It’s pretty common to find yourself working with generics in Scala, but you may find yourself where you want a generic with some constraints. Generally, these constraints can be boiled down to “Subclass” or “Superclass” and Scala offers functionality out of the box to help facilitate this. If you’re not familiar with generics then fret not, we’ll start with them and work our way through type bounds as well. Let’s start by taking a moment and look over the following classes, trait, and hierarchy. We’ll reference these through the rest of the post as well.

```scala
abstract class Dog {
  def woof
}

class Pug extends Dog {
  // https://www.youtube.com/watch?v=S1a8DvjLC3o
  def woof { println("hrrr-cull") }
}

class Aussie extends Dog {
  def woof { println("arr-woof!") }
}

trait Meowable {
  def meow
}

// Meow is still abstract at this point
abstract class Cat extends Meowable

class Sphynx extends Cat {
  def meow { println("meee-owww") }
}

class Burmilla extends Cat {
  def meow { println("kshhh! meow!") }
}

```

Nothing at this point should be outlandish. We’re simply defining some classes and a trait, and setting up a small amount of inheritance. Let’s introduce our generic with the following code:

```scala
class House[A](val animal: A)
```

The `A` in our example is the generic. We can new up our house with a concrete class implementation like so:

```scala
new House[Pug](new Pug)
```

We’re essentially saying “We want a new house of pugs, and here’s a pug to put to associate with that house.” But what happens if someone doesn’t know what a Pug is?

```scala
new House[Pug](new Sphynx)
```

In this example, we’ll get a compiler error because there is no super to subclass relationship between Pug and Sphinx. Conversely, based off the statement I just told you, this **will** work and won’t throw a compiler error.

```scala
new House[Dog](new Pug)
```

This is because Pug is a subclass of Dog. To reiterate, because of the inheritance hierarchy, any properties or methods that belong to do the Dog class also belong to the Pug class. That is to say, we can abstract our Pug reference into a Dog reference with the only downside being that we lose Pug-specific precision. For example, if our Pug has a specific method and we reference the Dog in the house, our compiler will only guarantee that we have a Dog object and we will not be able to call the Pug-specific method without type-casting back to a Pug object.

The same level of abstraction works for traits as well. Regarding our cats, we can do the following:

```scala
new House[Meowable](new Sphynx)
```

All we’re saying here is this – “I want a new house that contains something that extends the Meowable trait. Because the trait has an abstract method called `meow`, I know that I can reference the object in the house and call `meow` on it.”

That’s generics in a nutshell. The use case for them helps alleviate having a “CatHouse” or “DogHouse” when we don’t really care what animal exists there. But… what if we do care about the type of object contained in the house? Sure, you could create a “CatHouse”, “DogHouse”, “SphynxHouse”, “PugHouse” etc., but there is a better way. Enter type bounds.

## Upper Type Bounds

```
class DogHouse[A <: Dog](val animal: A) {
  def sayWoof { this.animal.woof(); }
}
```

This leverages an UpperBound to create a DogHouse for any type of Dog. `A <: Dog` simply states that our generic type must be the type or a valid subtype of Dog. This allows us to do the following successfully:

```scala
new DogHouse[Dog](new Pug).sayWoof
new DogHouse[Aussie](new Aussie).sayWoof
```

Just like before, we can do the same thing with traits as well.

```scala

class HouseOfMeows[A <: Meowable](val animal: A) {
  def sayMeow { this.animal.meow(); }
}

new HouseOfMeows[Cat](new Sphynx).sayMeow
new HouseOfMeows[Burmilla](new Burmilla).sayMeow

```

## Lower Type Bounds

```scala

class DogHouse[A >: Dog](val animal: A) {
  def sayWoof { this.animal.woof(); }
}

```

You may have already figured that that if the Upper Type bounds require the generic type to be the same type or a subtype of the bound, then the Lower Type Bounds are simply the opposite. That’s true, for the most part. Our Lower Type Bound (`A >: Dog`) simply states that our generic type must be the type or a valid supertype of Dog.

_Uhhh. But why would I ever use this?_

Valid question. The practical use cases for a Lower Type Bound are few and far between, but there certainly are some cases where it makes sense — just don’t expect to see them in every Scala codebase. You’ll commonly found them used with covarient generics (and often when writing custom list implementations). For now, consider this example instead. Let’s rewrite our dog class to be like this:

```scala

abstract class Animal {
// Lets assume all animals can woof.
  def woof
}

class Dog extends Animal {
  def woof { println("I am dog. woof.") }
}

```

And we’ll keep our existing dog definitions. Now, the layers of inheritance are getting quite deep. We can use lower and upper bounds to target specifically what generic types we want to allow

```scala
class DogHouse[A <: Animal >: Dog](val animal: A) {
  def sayWoof { this.animal.woof(); }
}

```

This type bound specifies that our supplied type must be a type of animal or subtype of animal, but also must be a type of dog, or a super type of dog. This essentially leaves us with two type options for this DogHouse — `Animal` or `Dog`. Using our new Doghouse like so will generate a compiler error:

```scala
new DogHouse[Pug](new Pug)

```

but the following will not:

```scala
new DogHouse[Dog](new Dog)

```

The use cases for Type Bounds can become pretty complex and I’ve found that a lot of fantastic libraries seems to implement them quite elegantly. Personally, I feel like they’re not necessary for the language to have, but since they do exist I find myself tending to use them. They make abstractions much more simple than without. Do you use type bounds in your Scala application? Why or why not?
