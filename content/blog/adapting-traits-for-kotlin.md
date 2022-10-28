---
title: "Adapting Traits for Kotlin"
date: 2019-04-10
status: publish
permalink: /adapting-traits-for-kotlin
author: "Brad Cypert"
excerpt: ""
type: blog
id: 1245
images:
  - /code-coding-computer-574070.jpg
category:
  - kotlin
tags:
  - kotlin
  - traits
description:
  - "Although Traits have first-class support in Scala, Kotlin does not directly have Traits. However, we can create our own traits in Kotlin using interfaces."
---
[Traits](https://docs.scala-lang.org/tour/traits.html) are a pattern introduced in Scala (at least, this was my first introduction to them) that help avoid deep class hierarchies in favor of composition. If you don’t have Scala experience, but do have Java experience, you can treat this similarly to [Java 8 Interfaces](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html). However, I still prefer to call them Traits.

Although Traits have first-class support in Scala, Kotlin does not directly have Traits. However, [Kotlin does support default interface implementations](https://kotlinlang.org/docs/reference/interfaces.html), just like Java 8. It’s fair to assume then, that Kotlin can have a similar concept of Traits only constructed from Interfaces with default implementations.

In Scala, you might see something like this:

```scala
trait Parcelizable {
  def parcelize(): Parcel
}
```

This trait simply marks a class/object as Parcelizable, and then requires an implementation of `parcelize` to return a Parcel. If you need something concrete to tie this to, imagine Parcels being a standard way to communicate across a buffer and this trait helps ensure classes and objects can be sent and received across a buffer.

In Kotlin, we can define the same thing like so:

```kotlin
interface Parcelizable {
  fun parcelize(): Parcel
}

```

## This is just an interface…

Sure. You’re absolutely right. But let’s add a default implementation to the interface and we can see how this really flourishes.

```kotlin
interface Parcelizable {
  fun parcelize(): Parcel {
    return Parcel.fromString(this.toString())
  }
}
```

Although, this is a very contrived example, we can now make a class or object “Parcelizable” simply by adding this interface to it. Let’s try to keep the example simple for now.

```kotlin
class StringList(): Parcelizable {
  private var strings = listOf<String>()

  fun setStringList(strings: List<String>) {
    this.strings = strings
  }

  fun toString(): String {
    return this.strings.joinToString(",")
  }
}
```

Because our Parcelizable implementation is encapsulated in the trait, and the StringList class implements that Trait, we get all of that logic “for-free” simply by implementing the trait.

## Overriding the Trait

A default implementation is bound to have exceptions. Thankfully, just like with standard interfaces, you can override the implementation when necessary. A good use case here might be a data class for a user object that contains a password. Because the data class provides a great default implementation for `toString` (and our `parcelize` function uses toString) it might feel natural to simply write:

```kotlin
data class User(val name: String, val email: String, val password: String) : Parcelizable
```

And that’s simply it! If we don’t need to modify our `toString` behavior, our new data class can get Parcelizable “for-free.” In this case, however, we do want to remove the password. Thankfully we can override the trait implementation like so:

```kotlin
data class User(val name: String, val email: String, val password: String) : Parcelizable {
  override fun parcelize(): Parcel {
    return Parcel.fromString("$name, $email")
  }
}

```

## A Practical Example

Suppose you have some logic that exists in multiple view models. We can encapsulate this behind a trait. Here’s a view model before encapsulating:

```kotlin
class MyViewModel @Inject constructor(val userRepo: UserRepository): ViewModel {
  fun getUserInfo(val id: Int): UserInfo {
    return userRepo.getUserInfo(id)
  }
}

// almost identical
class YourViewModel @Inject constructor(val userRepo: UserRepository): ViewModel {
  fun getUserInfo(val id: Int): UserInfo {
    return userRepo.getUserInfo(id)
  }
}
```

<HeadsUp title="What is a view model?">
  Although not important in regards to this post, view models are a concept that
  helps organize your code. In practice, a view model is a place to convert your
  model into something meaningful for your view.
</HeadsUp>

This is quite simple code, and you might be inclined to move this to an abstract
class if it’s being used all over the place. Instead, I’d consider using traits.

```kotlin
interface HasUserInfo {
  val userRepo: UserRepository

  fun getUserInfo(val id: Int): UserInfo {
    return userRepo.getUserInfo(id)
  }
}

class MyViewModel @Inject constructor(override val userRepo: UserRepository): ViewModel, HasUserInfo

class YourViewModel @Inject constructor(override val userRepo: UserRepository): ViewModel, HasUserInfo
```

## Composing with Traits

Let’s talk more about composing objects and classes from traits. A pattern that I’ve seen before involves not adding functionality directly to your class, but instead to traits and then composing your class from traits. Take, for example, this repository:

```kotlin
class UserRepository(val database: AppDatabase, val api: AppApi) {
  fun getUserInfo(id: Int): UserInfo {
    return database.getUserInfo(id)
  }

  fun updateUserInfo(info: UserInfo) {
     database.updateUserInfo(info)
   }

  fun getBalance(id: Int): Float {
    return api.fetchBalanceForUser(id)
  }

  fun getFamilyTree(id: Int): FamilyTree {
    return api.getFamilyTreeForUserById(id)
   }

  fun addMemberIdToFamilyTree(rootTreeUserId: Int, additionId: Int) {
    return api.addMemberToMemberTree(rootTreeUserId, additionId)
  }

  fun removeMemberFromFamilyTree(rootTreeUserId: Int, additionId: Int) {
    return api.removeMemberFromTree(rootTreeUserId, additionId);
  }
}
```

There’s quite a lot going on here, but there’s three common “domains” that this code could live within. We can pull these methods out into respective traits and compose our class from those traits. Let’s see what that would look like:

```kotlin
interface HasUserInfo {
  val database: AppDatabase

  fun getUserInfo(id: Int): UserInfo {
    return database.getUserInfo(id)
  }

  fun updateUserInfo(info: UserInfo) {
     database.updateUserInfo(info)
   }
}

interface HasBalance {
  val api: AppApi

  fun getBalance(id: Int): Float {
    return api.fetchBalanceForUser(id)
  }
}

interface HasFamilyTree {
  val api: AppApi

  fun getFamilyTree(id: Int): FamilyTree {
    return api.getFamilyTreeForUserById(id)
   }

  fun addMemberIdToFamilyTree(rootTreeUserId: Int, additionId: Int) {
    return api.addMemberToMemberTree(rootTreeUserId, additionId)
  }

  fun removeMemberFromFamilyTree(rootTreeUserId: Int, additionId: Int) {
    return api.removeMemberFromTree(rootTreeUserId, additionId);
  }
}

class UserRepository(override val database: AppDatabase, override val api: AppApi) : HasUserInfo, HasBalance, HasFamilyTree
```

To me, this feels like quite an interesting pattern. I feel like it definitely has a place, but is more of an architecture pattern than something someone should just add to an existing codebase. That is, all code should follow this pattern or none at all, in my opinion.

What are your thoughts?

If you’d like to learn more about Kotlin, [you can find more of my Kotlin related posts here.](/tags/kotlin/) Thanks for reading!
