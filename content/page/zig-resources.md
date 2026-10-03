---
title: "Zig Resources"
description: "Zig — interfaces, release modes, C interop, zig fetch, and a B+ tree."
date: 2025-09-10
lastmod: 2026-10-03
status: publish
permalink: /zig-resources
author: "Brad Cypert"
excerpt: ""
type: page
id: 2232
---

Blazingly fast. No hidden control flow. No hidden memory allocations. No preprocessor. No macros. Zig is a blessing to the programming language community.

I keep coming back to Zig when I want to see what the computer is actually doing. The compiler is honest with you, which is refreshing after years of languages that try to be helpful behind your back.

Lately that's been wrapping C libraries, picking a release mode, and a B+ tree for [LowkeyDB](https://github.com/bradcypert/lowkeydb).

### Language internals

- [Interfaces in Zig](/interfaces-in-zig/) — Zig has no `interface` keyword, but the standard library is full of them. Vtables, `anyopaque`, and when you shouldn't bother.
- [Zig's release modes](/zigs-release-modes/) — Debug, ReleaseSafe, ReleaseFast, ReleaseSmall. Four ways to compile, and they aren't interchangeable.
- [Multithreading in Zig](/multithreading-zig/) — Thread pools, mutexes, and wait groups, mostly because I wanted tests to run in parallel without lying to myself about safety.
- [Using C libraries in Zig](/using-c-libraries-in-zig/) — Zig's C interop is one of the best reasons to try the language. I walked through ImageMagick and a sepia filter to prove it.
- [Add git dependencies with zig fetch](/adding-dependencies-to-your-zig-project-with-zig-fetch/) — How I pull a git dependency into a Zig project.

### Systems projects

The point of learning Zig, for me, is building systems with it.

- [Writing a B+ Tree in Zig](/writing-a-b-tree-in-zig/) — Pages, splits, and the storage engine work behind LowkeyDB.
