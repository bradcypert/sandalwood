---
title: "Gleam Resources"
description: "A friendly language for building type-safe systems on the Erlang VM. Notes from an SMTP server called sheesh."
date: 2026-06-11
lastmod: 2026-10-03
status: publish
permalink: /gleam-resources
author: "Brad Cypert"
excerpt: ""
type: page
---

A friendly language for building type-safe systems on the Erlang VM. I'm currently using it to learn networking from the TCP layer up.

Gleam is the first language in a while that made me want to write a network service for the joy of it. The type system is small. The syntax is calm. You still get BEAM concurrency underneath, which is the whole point if you are building something that has to stay up while a client is being weird.

The writing here is tied to one project: an SMTP server called [sheesh](https://github.com/bradcypert/sheesh). I am not claiming a complete mail stack. So far that means reading TCP, parsing SMTP, and answering the client. No IMAP. No POP. Just enough protocol to learn.

If you want the post, start with part 1. If you want the code, the GitHub repo is the source of truth.

### Building an SMTP server

I am using [Glisten](https://github.com/rawhat/glisten) for the TCP layer and writing the rest myself. The retrospective is as much about what I got wrong as what worked.

- [Retro: Building an SMTP Server in Gleam - Part 1](/retro-building-an-smtp-server-in-gleam/) — TCP, Glisten's `new` callback, and the first SMTP commands I actually implemented.
- [sheesh on GitHub](https://github.com/bradcypert/sheesh) — The code, including the bits that have not made it into a post yet.
