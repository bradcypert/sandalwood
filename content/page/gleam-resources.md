---
title: "Gleam Resources"
description: "A friendly language for building type-safe systems on the Erlang VM. I'm currently building an SMTP server in it."
date: 2026-06-11
lastmod: 2026-10-03
status: publish
permalink: /gleam-resources
author: "Brad Cypert"
excerpt: ""
type: page
---

A friendly language for building type-safe systems on the Erlang VM. I'm currently using it to learn networking from the TCP layer up.

Gleam is the first language in a while that made me want to write a network service for the joy of it. The type system is small. The syntax is calm. You still get BEAM concurrency underneath, which is the whole point if you're building something that has to stay up while a client is being weird.

That project is an SMTP server called [sheesh](https://github.com/bradcypert/sheesh). I'm not claiming a complete mail stack. So far that means reading TCP, parsing SMTP, and answering the client. No IMAP. No POP. Just enough protocol to learn.

### Building an SMTP server

I'm using [Glisten](https://github.com/rawhat/glisten) for the TCP layer and writing the rest myself.

- [Retro: Building an SMTP Server in Gleam - Part 1](/retro-building-an-smtp-server-in-gleam/) — TCP, Glisten's `new` callback, and the first SMTP commands I actually implemented.
- [sheesh on GitHub](https://github.com/bradcypert/sheesh) — The code, including the bits that haven't made it into a post yet.
