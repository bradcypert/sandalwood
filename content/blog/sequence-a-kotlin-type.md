---
title: "Sequence: A Kotlin Type"
date: 2018-11-03
status: publish
permalink: /sequence-a-kotlin-type
author: "Brad Cypert"
excerpt: ""
type: blog
id: 687
thumbnail: /pexels-photo-507410.jpeg
category:
  - kotlin
tags:
  - "Functional Programming"
  - kotlin
  - Sequences
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_primary_category:
  - "104"
_yoast_wpseo_focuskw:
  - sequence
description:
  - "Sequences are a performant alternative to chaining operations on list-like data structures. You should consider a sequence anytime you would perform multiple operations on a list."
_yoast_wpseo_linkdex:
  - "81"
_yoast_wpseo_content_score:
  - "90"
---

Kotlin, despite being an object oriented language, offers a ton of support for Functional paradigms. One of the most common functional paradigms involves using a combination of `map`, `filter`, and `reduce` on Iterable types. However, Kotlin uses extension functions on Java Collections to create these functions in their standard library. That means that when you call `map` on a list, you’ll return a new list. This is usually intended, however, it can become problematic when chaining multiple operations on the same list — You’ll create a ton of intermediate lists!

Sequences provide a clear and performant alternative to multiple intermediate lists. Sequences have the same functions available to them as lists do, but instead of producing an intermediate collection each time, they are lazily evaluated. With this in mind, it’s easy to see that sequences have two different types of operations on them: Operations that produce an intermediate (a lazy evaluated sequence) or operations that are terminal (operations that process the lazy sequence).

## When to use a Sequence?

You should consider using a sequence whenever you’re doing more than one operation on a list of data. Take, for example, the following code:

```kotlin
listOf(1,2,3,4).map { it * 2 }.filter {it % 4 == 0}.reduce {acc, i -> acc + i}
```

Let’s break that down: We’re creating a list of the values, `1, 2, 3, 4`, we’re taking each value and multiplying it by two, then we’re removing all the values that aren’t divisible by four, and finally, we’re adding them all together. Phew.

If you’re using Intellij to write that, you’re editor is going to suggest you convert it to a sequence. Smart move, Intellij — but why?

Tackle the problem like this:

```kotlin
val mainList = listOf(1,2,3,4)
val mappedList = mainList.map { it \* 2 }
val filtered = mappedList.filter { it % 4 == 0 }
val reduced = filtered.reduce { acc, i -> acc + i }

```

Wow. We’re creating a total of 3 lists there. That is quite a bit. But how is a sequence different? With a sequence, we can perform these same operations, but perform them lazily. That means we won’t actually create any lists until we call a terminal function. Alright, but what is a terminal function?
There are several terminal functions, but the one we can use in this instance is `reduce`. That will evaluate our sequence and return the result of that reduction. Let’s write the original implementation once more, but this time using a sequence (This is also what Intellij will auto-convert to for us):

```kotlin
listOf(1,2,3,4).asSequence().map { it * 2 }.filter {it % 4 == 0}.reduce {acc, i -> acc + i}
```

What’s interesting is if we try to evaluate (in the REPL) the above code using multiple values, it’ll end up like this:

```kotlin
val mainSeq = listOf(1,2,3,4).asSequence()
val mappedList = mainSeq.map { it \* 2 }
val filtered = mappedList.filter { it % 4 == 0 }
val reduced = filtered.reduce { acc, i -> acc + i }
```

Which looks to be the same until you actually inspect the type in `mappedList` or `filtered`. If you do, you’ll see that the type is actually a `kotlin.sequences.TransformingSequence`. Lastly, if you log reduced, you’ll see that we still get `12`. Just as before with the lists! Neat!

## TLDR: Sequences are great!

Sequences are a performant alternative to multiple operations upon Iterables. You can (and should) use them in place of multiple list operations (especially on large lists).

Want to learn more about Kotlin? You can[ find more of posts on Kotlin here](http://www.bradcypert.com/tags/kotlin/)!
