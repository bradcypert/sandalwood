---
title: "JVM Resources"
description: "Java, Kotlin, Clojure, Scala, and Android — writing from years on the JVM."
date: 2020-01-10
lastmod: 2026-10-03
status: publish
permalink: /jvm-resources
author: "Brad Cypert"
excerpt: ""
type: page
id: 2260
---

The JVM is the platform I spent the most years on. Java paid the bills. Kotlin made Android and servers nicer. Clojure was the Lisp I actually shipped. Scala was the bet that you could have both objects and functions without leaving the runtime.

I've also written about each of those on their own: [Java](/java-resources/), [Kotlin](/kotlin-resources/), [Clojure](/clojure-resources/), and [Scala](/scala-resources/).

## Java

Java is a language and a platform. Oracle maintains it. It's known for "write once, run anywhere," and, in my opinion, for its verbosity. I think that verbosity is why old Java code is readable.

- [How to use Java’s Enums](/a-beginners-guide-to-java-enums/) — Enums with behavior, not just a list of names.
- [The Builder Design Pattern](/design-patterns-builder/) — Optional constructor arguments without a telescoping mess.
- [Reflection](/intro-to-reflection-in-java/) — Inspect and call things at runtime. Powerful, under-documented, easy to regret.

## Kotlin

Kotlin is a statically typed language that often targets the JVM. I've used it for web services, Android, and as a Java upgrade.

- [Dependency Injection via The Facade Pattern](/the-facade-pattern-for-simple-dependency-injection/) — A small facade instead of a full DI framework.
- [Controllers in the KTOR web framework](/controllers-in-ktor/) — Structure Ktor routes like controllers even though the framework doesn't.
- [Testing via Expekt](/bdd-assertions-expekt-kotlin/) — Assertions that read like sentences.
- [Kotlin Sequences](/sequence-a-kotlin-type/) — Lazy collections for pipelines that shouldn't allocate every step.
- [Sealed Classes](/kotlin-sealed-classes/) — Restricted hierarchies and exhaustive `when`.
- [Testing Companion Objects](/static-methods-companion-objects-and-testing/) — Companion objects as the testable version of static methods.

## Android

Android is a mobile OS. Development is mostly Kotlin, with a long Java history.

- [SurfaceFlinger](/what-is-androids-surfaceflinger/) — The compositor that actually puts pixels on the screen.
- [Testing views via FormatterObjects](/formatter-objects-testable-fragments/) — Formatting pulled out of the fragment so tests can reach it.
- [What is Proguard?](/what-the-heck-is-androids-proguard/) — Shrink, obfuscate, and then debug the class that vanished in release.
- [Overriding Button Styles](/overriding-button-styles-in-android/) — Theme overrides without a style fight.
- [When to use a Dimensions file](/the-complete-guide-to-dimensions-in-android/) — `dp` and `sp` in one place instead of magic numbers.
- [Using Butterknife with Kotlin](/using-butterknife-kotlin/) — A Java view-binding library used from Kotlin.
- [Pending Intents](/android-pending-intents/) — Wrap an intent so it survives your process dying.
- [ListView/RecyclerView](/android-listview-recyclerview-adapters/) — Which list widget, and how to write the adapter.

## Clojure

Clojure is a Lisp that usually targets the JVM (or JavaScript). I liked it because the REPL was honest and the data stayed data.

- [Futures in Clojure](/using-futures-in-clojure/) — Background work you can deref later.
- [Intro to Async Programming](/clojure-async/) — `core.async` without assuming you already live in it.
- [Guide to Clojure.Spec](/an-informal-guide-to-clojure-spec/) — Describing maps as data, which is the whole language.
- [Provisioning a Clojure VM](/provisioning-a-development-environment-for-clojure-web-services-via-ansible-and-vagrant/) — Ansible and Vagrant for a Clojure web service environment.
- [Map vs PMap](/understanding-clojures-map-pmap/) — Why `pmap` is often slower than you wanted.
- [Linting with Kibit and Eastwood](/clojure-kibit-eastwood/) — Static analysis in a language that likes to look dynamic.
- [The Thread Macro (->)](/threading-pipelines-in-clojure/) — Pipelines instead of nested calls.
- [Multimethods](/mighty-morphing-multimethods/) — Polymorphism on a value. Power Rangers included.
- [JSON Web Tokens](/using-json-web-tokens-with-clojure/) — Auth headers with Buddy.
- [Macros](/understanding-clojure-macros/) — When you actually want code to write code.
- [Postgres + YeSQL Trigram Search](/adding-trigram-searching-to-a-clojure-webapp/) — Fuzzy search in Postgres, queried from Clojure.

## Scala

Scala 2, mostly. Object-oriented and functional on the same runtime.

- [Pagination with Slick](/pagination-in-scala-with-slick) — Paging database results in Slick.
- [Creating a Java Bean from a Scala class](/creating-a-java-bean-from-a-scala-class/) — Interop when a Java library wants a bean.
- [Scheduling background tasks in Play](/scheduling-background-jobs-in-play-with-scala/) — Interval jobs in Play.
- [Upper/Lower Bounds in Scala](/upper-and-lower-bounds-in-scala/) — Bounds on type parameters.
- [Generics in Scala](/using-generics-in-scala/) — Parameterized types, before the bounds.
