---
title: "Scala Resources"
description: "Scala combines object-oriented and functional programming in one concise, high-level language. Most of these examples use Scala 2.X."
date: 2020-01-10
lastmod: 2026-10-03
status: publish
permalink: /scala-resources
author: "Brad Cypert"
excerpt: ""
type: page
id: 2260
---

Scala combines object-oriented and functional programming in one language. I wrote a lot of Scala 2, and that's what these examples use. If you're on Scala 3, the ideas still map; the syntax won't always.

I liked Scala because I could stay on the JVM without writing Java. Generics and bounds are where that bet gets tested. Slick and Play are where it met production: pagination, background jobs, and the occasional Java bean because some library still wanted one.

- [Pagination with Slick](/pagination-in-scala-with-slick) — Paging database results in Slick without inventing your own windowing scheme.
- [Creating a Java Bean from a Scala class](/creating-a-java-bean-from-a-scala-class/) — Scala classes aren't beans. Sometimes you still have to pretend.
- [Scheduling background tasks in Play](/scheduling-background-jobs-in-play-with-scala/) — Interval jobs in a Play app, which every non-trivial service eventually needs.
- [Upper/Lower Bounds in Scala](/upper-and-lower-bounds-in-scala/) — `<:` and `>:` once generics stop being "this is a list of A."
- [Generics in Scala](/using-generics-in-scala/) — Parameterized types, before the bounds post makes sense.
