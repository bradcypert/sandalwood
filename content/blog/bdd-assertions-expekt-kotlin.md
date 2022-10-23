---
title: "BDD Assertions with Expekt for Kotlin"
date: 2018-10-26
status: publish
permalink: /bdd-assertions-expekt-kotlin
author: "Brad Cypert"
excerpt: ""
type: blog
id: 654
category:
  - kotlin
tags:
  - bdd
  - kotlin
  - testing
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_primary_category:
  - "104"
_yoast_wpseo_content_score:
  - "90"
_yoast_wpseo_focuskw:
  - Expekt
description:
  - "Expekt is a behavior-driven development assertion library for Kotlin. Writing tests using Expekt can help make assertions clearer and more robust."
_yoast_wpseo_linkdex:
  - "90"
---

Behavior-Driven Development (BDD) has became quite a popular strategy for writing tests in the past ten or so years. BDD is a style of test-writing that focuses on test cases that flow like natural English sentences. Expekt is one such library for writing JUnit assertions in Kotlin. Combining JUnit and Expekt you can achieve results like this:

```kotlin
class FormatterTest {
  @Test
  fun shouldFormatFloatsWithADollarSignAndTwoDecimalPlaces() {
    Formatter.format(1.2345).to.equal("$1.23")
  }
}
```

## Adding Expekt to Your Project

As of writing, the current version of Expekt is `0.5.0` so that’s the one we’ll include in our project. If you’re using Gradle, you can add the following to your dependency list in your build.gradle.

```gradle
testImplementation "com.winterbe:expekt:0.5.0"
```

If you’re using Maven, you can switch to Gradle (let the flame war commence). Alternatively, you can add the following to your pom.xml

```xml
<dependency>
    <groupId>com.winterbe</groupId>
    <artifactId>expekt</artifactId>
    <version>0.5.0</version>
    <scope>test</scope>
</dependency>
```

Both of these are added as test dependencies, so they will only be available in the context of tests. That is, you won’t be able to use these (nor should you) when writing Activities, Fragments, Controllers, Services, or any other “This goes in my product that I deliver to customers” Kotlin code.

## Writing your Test

Let’s assume we want an object that is going to format a float into a string value (namely \$USD). Before we write this object, we can start by writing a few tests. We’re using a compiled and static language so the compiler sanity checks our code for us — we don’t need to go overboard on tests and see what happens when we call our function with a boolean, for example.

Let’s write our test!

```kotlin
class DollarFormatterTest {
  @Test
  fun shouldFormatFloatAsUSDAndRoundUp() {
    DollarFormatter.format(1.5555555F).to.equal("$1.56")
  }

  @Test
  fun shouldFormatFloatAsUSDAndRoundDown() {
    DollarFormatter.format(1.5333333F).to.equal("$1.53")
  }
}
```

Perfect. We have two test cases. These will fail — in fact, they won’t even compile. Regardless, we can see how nice it is to use a BDD library to help write our tests.

## Without Expekt

We can do this without Expekt and simply with JUnit. Without Expekt, we’d have to write something like:

```kotlin
class DollarFormatterTest {
  @Test
  fun shouldFormatFloatAsUSDAndRoundUp() {
    Assert.assertEquals(DollarFormatter.format(1.5555555F),"$1.56")
  }

  @Test
  fun shouldFormatFloatAsUSDAndRoundDown() {
    Assert.assertEquals(DollarFormatter.format(1.5333333F),"$1.53")
  }
}
```

This isn’t bad, but its does feel less descriptive and looks less idiomatic. These will also fail to run and compiled. That’s because we haven’t even created our object yet! Let’s do that now!

```kotlin
interface Formatter {
  fun format(): String
}
object DollarFormatter {
  fun format(num: Float): String {
    return "\$%.2f".format(num)
  }
}
```

Regardless of which assertion library you use, both of our tests should pass now! Hopefully you feel that you’ve had a good opportunity to sample a BDD library (Expekt) and see how easy it is to use Expekt to write concise and clear test cases!
Interested in learning more about Kotlin? [Check out my other Kotlin related posts here!](http://www.bradcypert.com/category/kotlin/)
