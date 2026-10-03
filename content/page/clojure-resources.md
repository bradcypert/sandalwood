---
title: "Clojure Resources"
description: "Clojure — threading macros, multimethods, macros, async, spec, and a bit of web."
date: 2020-01-09
lastmod: 2026-10-03
status: publish
permalink: /clojure-resources
author: "Brad Cypert"
excerpt: ""
type: page
id: 2232
---

Clojure is a Lisp that feels like a scripting language until you notice it's sitting on a very serious runtime. I came to it for the REPL and stayed for multimethods, spec, and the way data stays data.

Threading macros make pipelines readable. `core.async` is what I reach for when I want channels on the JVM. Spec is the honest answer to "what does this map actually contain?"

### Core Clojure

- [Threading (not multi-threading)](/threading-pipelines-in-clojure) — `->` and friends. Pipelines instead of nested parens soup.
- [Multimethods](/mighty-morphing-multimethods) — Runtime polymorphism on a value, with Power Rangers, because I was in a mood.
- [Macros](/understanding-clojure-macros) — Code that writes code. Useful, easy to overuse, worth understanding anyway.

### Async

Clojure's concurrency story is bigger than this list.

- [In-Depth Introduction to Async in Clojure](/clojure-async) — `core.async` from the ground up.
- [Working with Futures](/using-futures-in-clojure) — Run work on another thread, deref when you need the answer.
- [Map vs PMap](/understanding-clojures-map-pmap) — `pmap` looks like a free speedup. It often isn't.

### Spec

I like spec because it describes data without pretending your maps are classes.

- [An Informal Guide to working with Clojure.spec](/an-informal-guide-to-clojure-spec) — Spec as I actually used it, not as a textbook.

### Tooling

A repeatable environment beats "it works on my machine" even when the machine is a REPL.

- [Setup Clojure Dev environment using Ansible + Vagrant](/provisioning-a-development-environment-for-clojure-web-services-via-ansible-and-vagrant) — A sandboxed Clojure web-service environment you can rebuild.

### Web

Clojure on the web is still just data in, data out. JWTs are the boring part that has to work.

- [JSON Web Tokens](/using-json-web-tokens-with-clojure) — Auth headers with Buddy, without turning the app into a framework demo.
