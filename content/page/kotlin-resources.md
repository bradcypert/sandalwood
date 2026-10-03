---
title: "Kotlin Resources"
description: "Kotlin on the JVM and Android — sequences, sealed classes, Ktor, testing, and the Android notes I still use."
date: 2020-01-09
lastmod: 2026-10-03
status: publish
permalink: /kotlin-resources
author: "Brad Cypert"
excerpt: ""
type: page
id: 2232
---

Kotlin is a statically typed language that usually targets the JVM. I used it for Android, for servers, and for the stretch of years when it was the obvious next step after Java.

It still is a pleasant language. Null safety is the feature people quote. Sealed classes and sequences are the ones I actually missed when I went back to Java. Ktor is the server framework I reached for when I wanted Kotlin on the backend without Spring.

A lot of the Android posts are from an older toolkit — Butterknife, ListView, Proguard. The platform moved. The explanations of SurfaceFlinger, pending intents, and dimensions still hold.

If you want language features, start with sealed classes. If you want Android, start with dimensions or pending intents. There is also a combined index on [JVM resources](/jvm-resources/).

### Core Kotlin

The type-system bits that change how you write everyday code.

- [Kotlin Sequences](/sequence-a-kotlin-type/) — Lazy collections. Use them when you do not want every intermediate list.
- [Sealed Classes](/kotlin-sealed-classes/) — Restricted hierarchies. `when` becomes exhaustive, which is the whole appeal.

### Testing

Kotlin's testing story is fine. These are the two spots that were not obvious.

- [Testing via Expekt](/bdd-assertions-expekt-kotlin/) — BDD-style assertions when I wanted the test to read like a sentence.
- [Testing Companion Objects](/static-methods-companion-objects-and-testing/) — Companion objects as the testable stand-in for static methods.

### Web

Ktor does not give you controllers. You can still structure a service like you have them.

- [Dependency Injection via The Facade Pattern](/the-facade-pattern-for-simple-dependency-injection/) — A small facade instead of a DI framework for everything.
- [Controllers in the KTOR web framework](/controllers-in-ktor/) — Extract routes into something that looks like a controller, because a single routing file does not stay small.

### Android

Android is a mobile OS. Development is mostly Kotlin now, with a long Java history underneath. These posts mix both.

- [SurfaceFlinger](/what-is-androids-surfaceflinger/) — The compositor. Worth knowing even if you never touch it directly.
- [Testing views via FormatterObjects](/formatter-objects-testable-fragments/) — Pull view formatting out of the fragment so you can test it.
- [What is Proguard?](/what-the-heck-is-androids-proguard/) — Shrinking and obfuscation, and why your release build suddenly cannot find a class.
- [Overriding Button Styles](/overriding-button-styles-in-android/) — Theme and style overrides without fighting the framework for an afternoon.
- [When to use a Dimensions file](/the-complete-guide-to-dimensions-in-android/) — `dp`, `sp`, and why a dimensions file beats magic numbers in layouts.
- [Using Butterknife with Kotlin](/using-butterknife-kotlin/) — View binding from a Java library, used from Kotlin. Historical, still useful if you land in an older codebase.
- [Pending Intents](/android-pending-intents/) — An intent you can hand to another app and still have around if your process dies.
- [ListView/RecyclerView](/android-listview-recyclerview-adapters/) — When to use which, and how to write an adapter for both.
