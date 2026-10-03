---
title: "Rust Resources"
description: "Memory safety without a GC. Notes on Drop, From/Into, boxing, and a couple of side projects."
date: 2024-03-20
lastmod: 2026-10-03
status: publish
permalink: /rust-resources
author: "Brad Cypert"
excerpt: ""
type: page
---

Memory safety without a GC. These are the Rust notes I still stand behind.

Rust's type system is the part that stuck with me. Traits feel like they were designed by someone who had already been burned by inheritance, which is a compliment. `Drop`, `From`, and `Into` are small ideas that show up in almost every non-trivial crate.

I do not write Rust every week the way I write Zig or Go. When I do, it is usually because I want the compiler to argue with me before production does. The posts here are short on cheerleading and long on the mechanics that actually confused me.

If you are new, start with `Drop`. If you already like traits, `From` and `Into` are the ones I keep recommending.

### Language

The trait system is the reason I keep a Rust toolchain around.

- [Rust's Drop trait](/rust-drop-trait/) — One method, and it is the place you free what you claimed. Most of RAII is hiding in here.
- [From and Into](/rust-from-into/) — Converting types without a pile of ad-hoc helper functions. `From` is the one you implement; `Into` comes along for the ride.
- [Boxing things in Rust](/boxing-things-in-rust/) — `Box` is a smart pointer to a heap allocation. That sentence is easy. Using it on purpose is the post.

### Projects

I learn languages by building something slightly too big.

- [Naive Bayes Classifier in Rust trained on Taylor Swift lyrics](/naive-bayes-classifier-in-rust-with-taylor-swift/) — A classifier, a corpus, and a joke that got out of hand.
- [Chili cookoff with Rust, Rocket, Render, and Supabase](/chili-cookoff-with-rust-rocket-render-and-supabase/) — A yearly cookoff needed a site. Rust and Rocket were the stack that actually shipped.
