---
title: "Intro to Reflection in Java"
date: 2015-09-16
status: publish
permalink: /intro-to-reflection-in-java
author: "Brad Cypert"
excerpt: ""
type: blog
id: 19
images:
  - person-reflect-on-round-brown-wooden-framed-mirror-1502800.jpg
category:
  - Java
tags:
  - java
  - meta
  - metaprogramming
  - reflection
post_format: []
description: "Use reflection to dynamically inspect classes at runtime! Learn about dynamically reading member variables or executing methods!"
versions:
  java: jdk8
---

Recently, I began exploring an interesting idea I had – creating a RESTful framework built on top of Spark. Now, Spark is naturally restful, but I basically want the user to be able to define an object, flag it as a resource, and compile their code. They should then have `GET`, `POST`, `PUT`, and `DELETE` verbs available on that object. Sounds relatively trivial right?

There are actually several ways to do this, but the simplest way (once I was able to wrap my head around it) involves metaprogramming, and specifically reflection. These can be naturally scary words, but it’s important to keep in mind, they’re both just programming.

That being said, there seems to be infinitely more resources for **ANY** other Java API on the web than there are for reflection. So, hopefully this post will be helpful, as I’m going to describe some of the topics and actions that I wished I didn’t have to dig into the Java APIs to figure out.

If, at any point, you’re interested in seeing this framework project that I’m working on, [named Ginger](http://www.github.com/bradcypert/Ginger), feel free to [click here](http://www.github.com/bradcypert/Ginger). Don’t worry, this tutorial isn’t going anywhere.

## What is reflection?

When you look in a mirror, you see a reflection. You’re able to inspect qualities about yourself that wouldn’t normally see, such as, the birthmark on your ear, or the color of your eyes. Reflection, in Java, is quite similar. A class can inspect itself, or another class, and provide data about that class. Since data is just data, we’re actually able to act on that data to make decisions and execute code.

One of the things to keep in mind, Java is naturally a very verbose language, and that’s because the compiler likes to know exactly what you’re doing. Because of this, the compiler will often let you know if something is going to go wrong when compiling. Reflection is often extremely abstract, and you may have to stray away from the safety net the compiler sets up for you – **especially** if other people are writing the code that your code reflects upon.

## Reflecting upon a class

When setting up reflection for the first time, one of the first things you’ll want to do is define the class that you’re going to reflect upon. If, for example, we have a MyLinkedList class that we want to reflect upon, we could write something like the following

```java
Class reference = MyLinkedList.class;
```

It’s that simple! Let’s go ahead and actually define that class in a separate file.

```java

public class MyLinkedList {
private Object head;
private int count;
public String name;

public MyLinkedList(){
  this.head = new Object();
  this.count = 0;
  this.name = "LinkedListHero";
}

public void add(Object o) {
  // do something
  System.out.println("Called 'add' with object: "+o);
}

public void get(int index) {
  //look up by index
  System.out.println("Called 'get' with index: "+index);
}

public static void sayHello() {
  System.out.println("Hello");
}

```

Although the example is quite contrived, We’ve created this pseudo-LinkedList and I’ve just stubbed out the add and get methods, as their actual implement is mostly irrelevant. Additionally, there’s a a `name` property, and a `sayHello()` method that aren’t really relevant to the LinkedList, but we’re going to use them to demo some reflection. So we’ve defined out class, and in a separate file, we created a reflective reference to that class. Now we can get to the cool stuff!

## Getting Member Variables

Let’s do something useful. We’re going to get all the member variables that are available to the class at runtime.

```java
for(Field f: reference.getFields()) System.out.println(f.getName());
```

Will print out… `name`

Notice that it’s not printing `head` or `count`. Indeed, this returns only the public fields that we’ve declared. Additionally, if our LinkedList class inherited from another class with public members, they would display here, too!

## But what if I need private members too?

If you’re in need of private member variables, then you’re in luck!
instead of using `.getFields()`, you can use `getDeclaredFields()`. This will return all of the fields that have been declared on that class and that class only. That is, if we inherited public members from another class, `getDeclaredFields()` would not show them here.

## More with Fields

There’s a lot to be done regarding fields, and [I’d advise looking over the documentation for full examples](https://docs.oracle.com/javase/8/docs/api/java/lang/reflect/Field.html). However, I’ll quickly cover a few common methods of the field class.

#### getName()

```java

for(Field f: MyLinkedList.class.getFields()) f.getName()

```

This method simply returns the name of the fields. For example, a class with an age property (as an int, for example) would return `age`.

#### getType()

```java
for(Field f: MyLinkedList.class.getFields()) f.getType()
```

`getType()` returns the type stored within the field. This could be a `String`, `Object`, `double`, `int`, `ArrayList`, or even `MyCustomClass`.

## Methodical Madness with Methods

Personally, I believe the power of reflection really shines with the use of methods. They function quite similar to Fields, actually, but can do quite a bit more than just reflective fields.

Let’s get right down to it. If you want to get the member variables of the class (remember, these are the variables set at runtime), you can do so with the following:

```java
Class reference = MyLinkedList.class;
Method[] methods = reference.getMethods();
for(Method m: methods)
  System.out.println(m.getName());
```

This will not only get all the methods that are available at runtime, but will print the name of them too.

When you execute this code, your console/terminal should give you something like this…

```bash
add
get
sayHello
wait
wait
wait
equals
toString
hashCode
getClass
notify
notifyAll
```

Notice that it’s also printing out the methods that our class inherited, such as `toString` and `hashCode`. This is because reflection doesn’t inspect what code has been written, it inspects the code that is being ran at runtime.

<HeadsUp title="Wait. What?">
  If you’re extra observant, you may have noticed that “wait” appears three
  times in the above output. The reason why is that [the `wait` method appears
  on the java.lang.Object three different
  times](https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html), each
  with different signatures. The `wait` method uses a concept called method
  overloading. This allows you to call in one of three different ways. Since
  each one is a unique method, and we’re only printing the name above, we’ll see
  the same name twice. Method overloading is fairly common in Java, so don’t be
  surprised is you see the same method name multiple times!
</HeadsUp>

## Getting a single method by name

Additionally, provided you know the name of the method, you can retrieve that single method by its name as a string. **Be Careful as this call can throw a `NoSuchMethodException`.**

```java
Method add = MyLinkedList.class.getMethod("add", new Class[]{Object.class});
```

This roughly translates to `find the add method that takes in a parameter of an Object.`, which, if you remember, is the `add(Object o)` method we defined on our “LinkedList” class at the beginning of this article.

If the method takes no parameters, such as our `sayHello()`, you can pass `null` in as the second parameter.

## Checking Method Parameters

That’s pretty cool, but just knowing the name of the method isn’t all that practical. Let’s inspect the parameters that can be passed into our methods.

```java

Method[] methods = MyLinkedList.class.getMethods();
for(Method m: method)
m.getParameterTypes();

```

## Checking Method Return Values

Additionally, we can check the type of value being returned from our methods like so.

```java
Method[] methods = MyLinkedList.class.getMethods();
for(Method m: method)
  m.getReturnType();
```

## Invoking Methods via Reflection

Alright, the moment you’ve all been waiting for – Invoking methods. Once you have a reference to your method, actually invoking the method is really quite simple.

```java
Method add = MyLinkedList.class.getMethod("add", new Class[]{Object.class});
add.invoke(new MyLinkedList(), "parameter1");
```

You can also invoke the static method, `sayHello()` like so.

```java
Method hello = MyLinkedList.class.getMethod("sayHello", null);
hello.invoke(null);
```

Pretty cool right? Well, that’s all I have for you for right now. Remember, metaprogramming is just programming from a different perspective! [If you’d like to learn more about Java, you can find more of my articles on the matter here.](/tags/java)

Thanks for reading!
