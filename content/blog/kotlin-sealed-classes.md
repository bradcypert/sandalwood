---
title: "Kotlin Sealed Classes"
date: 2018-10-19
status: publish
permalink: /kotlin-sealed-classes
author: "Brad Cypert"
excerpt: ""
type: blog
id: 642
thumbnail: /sealed.jpg
category:
  - kotlin
tags:
  - kotlin
  - "sealed classes"
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_primary_category:
  - "104"
_yoast_wpseo_content_score:
  - "60"
_yoast_wpseo_focuskw:
  - "sealed classes"
_yoast_wpseo_title:
  - "Sealed Classes in Kotlin - A Beginner's Guide%%page%% %%sep%% %%sitename%%"
description:
  - "Sealed Classes provide you with a more powerful alternative to enumerations in Kotlin. You can use sealed classes to help solve problems that enums wouldnt."
_yoast_wpseo_linkdex:
  - "94"
---

Kotlin has a concept known as sealed hierarchies (several other languages implement this feature as well). In Kotlin, we can generate a sealed hierarchy through the use of sealed classes.

## What are Sealed Classes?

Sealed classes are basically an extension to an enum class. They offer similar functionality with a few key differences. Similarly:

- The class can not be instantiated directly
- The type can be represented as a type from a limited set, but not from any type outside of the set.

Differences however, are the important part:

- Permutations of enumerations are declared within the enum.
- Permutations of sealed classes are defined as extensions to the class.
- Permutations of enumerations are all required to take in the same arguments.
- Extensions of sealed classes can all take in different numbers and types of arguments.

## Defining Sealed Classes

In Kotlin, the `sealed` keyword can be used to construct a Sealed Class.

```kotlin
sealed class CalendarFormat
```

Following the idea of a type for a CalendarFormat, let’s set a few expectations:

1. Our Calendar can be formatted in days, weeks, months, or years.
2. We need to account for leap years where applicable.

We need to create our CalendarFormat. That’s our end goal, after all. We could start with an enum for this as well, but to determine if that permutation is a leap year, we’d need every, we’d need every permutation of that enum to also implement a method to determine if it is a leap year. That would give us something like this:

```kotlin
enum class CalendarFormat {
  DAY {
    override fun isLeapYear(): Boolean = false
  },
  WEEK {
    override fun isLeapYear(): Boolean = false
  },
  MONTH {
    override fun isLeapYear(): Boolean = false
  },
  YEAR {
    override fun isLeapYear(): Boolean {
      // new up a date and figure out if its a leap year
      return true
    }
  }

  abstract fun isLeapYear(): Boolean
}

```

Obviously, this isn’t ideal. If we add MORE enum types, we have to implement `isLeapYear` for all of them. Using a sealed class is a better solution here. Let’s do that instead.

```
sealed class CalendarFormat {
  class Days: CalendarFormat()
  class Weeks: CalendarFormat()
  class Months: CalendarFormat()
  data class Years(val isLeapYear: Boolean): CalendarFormat()
}
```

That’s much better! We no longer need to implement a method on each permutation of the enum simply by using a sealed class.

## Using Sealed Classes with When

One of the nice features of using an enum is the compiler support for ensuring you cover all your cases with a when statement. You might be familiar with the following:

```kotlin
enum class Color {
  RED, BLUE, GREEN
}

fun colorStuff(color: Color): String {
  return when(color) {
    Color.RED -> "red"
    Color.BLUE -> "blue"
    Color.GREEN -> "green"
  }
}

```

If you don’t cover each available case in a when expression, you’ll be warned by the compiler that you’re handling all of your possible cases. Nice! However, this feature is also available with sealed classes. Going back to our previous Calendar example, we can do something like this:

```kotlin
sealed class CalendarFormat {
  class Days: CalendarFormat()
  class Weeks: CalendarFormat()
  class Months: CalendarFormat()
  data class Years(val isLeapYear: Boolean): CalendarFormat()
}

class Calendar {
  // this would ideally, have some calendar related logic in it
}

// exchange Calendar(...) with an actual constructor call.
fun buildCalendar(format: CalendarFormat): Calendar {
  return when (format) {
    is CalendarFormat.Days -> Calendar(...)
    is CalendarFormat.Weeks -> Calendar(...)
    is CalendarFormat.Months -> Calendar(...)
    is CalendarFormat.Years ->  Calendar(..., isLeapYear = format.isLeapYear)
  }
}
```

Its important to note that `is CalendarFormat.Years ->` will smart-cast the format to a Year. After the smart cast, we will have access to the members and functions on that Year object.

## Conclusion

And that’s a quick primer on sealed classes. You can learn more at the [documentation page on sealed classes](https://kotlinlang.org/docs/reference/sealed-classes.html). Interested in learning more about Kotlin? [Check out my other Kotlin articles here](http://www.bradcypert.com/category/kotlin/)!
