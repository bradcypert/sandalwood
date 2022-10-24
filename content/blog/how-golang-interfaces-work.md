---
title: "How Golang Interfaces Work"
date: 2019-07-08
status: publish
permalink: /how-golang-interfaces-work
author: "Brad Cypert"
excerpt: ""
type: blog
id: 1653
thumbnail: /cropped-bread-burlap-close-up-1600711-e1562602457160-1.jpg
category:
  - Go
tags:
  - go
  - interfaces
description: "Golang's interfaces allow you to define the behavior of structs, but Golang has a few unique features for interfaces that you may not expect."
---

[Interfaces](https://gobyexample.com/interfaces) are a tool that allows you to define the behavior of objects and in Golang, interfaces are no different (except that they work on structs instead of “objects”). However, Go has some strange features for interfaces that users from other languages might not expect.

Let’s take it slow and start by defining an interface in Go:

```go
type Sandwich interface {
    BeEaten()
    CountPickles()
}
```

This fairly simple interface defines what a sandwich is capable of. Not what it looks like, not how it’s composed, but for the purposes of our application it’s all that we need to constitute a sandwich. This allows us to create things that ideally represent an actual sandwich (based on what a sandwich can and cannot do), but will also allow us to create strange amalgamations that aren’t actually sandwiches but can act as a sandwich. Confusing? Let’s distill that idea.

But first! We need to talk about the “_strange features_” that I mentioned in our first Paragraph. In Java, C#, and other languages — classes need to declare that they’re implementing an interface. In Go, interface implementation is implied simply by implementing the required methods on the interface — no need to say `implements` when defining a struct.

## The Reuben

With our newly found wisdom on implied interface implementations and our excellent sandwich simile, we can create our first sandwich — The Reuben!

```go
type Reuben struct {
  MeatInOunces int
  DillPickleCount int
  BreadAndButterPickleCount int
}

```

So! We’ve defined our Reuben sandwich, but… by our code’s standards it’s not a sandwich yet! Notice how we didn’t use the `implements` keyword (it doesnt exist in Go!), but we still don’t have an implicit implementation. We can define that with receiver functions:

```go
func (r Reuben) BeEaten() {
    r.MeatInOunces = 0
}

func (r Reuben) CountPickles() {
    return r.DillPickleCount + r.BreadAndButterPickleCount
}
```

Now we’re implicitly implementing our interface! So if we have a function like so:

```go

func chowDown(s sandwich) {
  s.BeEaten()
}

```

We can instead pass in our Reuben as it satisfies **all** the requirements to be a sandwich. However, if we were to have a hot dog (which should certainly NOT have anything to do with pickles but could still `BeEaten`), it would not meet all the requirements of a sandwich, so it could not be passed to `chowDown`. Here’s an example implementation of our hot dog.

```go
type Hotdog struct {
    bunType string
    isEaten bool
}

func (h Hotdog) BeEaten() {
    h.isEaten = true
}
```

**Since our Hotdog only implements** `<strong>BeEaten()</strong>` **it does not satisfy all requirements for our** `<strong>Sandwich</strong>` **interface and can’t be used as a** `<strong>Sandwich</strong>`. In fact, calling `chowDown()` with a Hotdog will throw a compiler error.

Bonus: A really interesting tidbit about Go is the empty interface concept. If you look at a lot of the standard library functions [like ](https://golang.org/pkg/fmt/#Println)`<a href="https://golang.org/pkg/fmt/#Println">func Println(a ...interface{}) (n int, err error)</a>` you’ll see the method signature takes in a variable number arguments that implement an empty interface. Everything in Go implements an empty interface by default so anything can be passed into `Println`!

If you’d like to [learn more about Go, you can find my topics on the language here](/tags/go)!
