---
title: "Retro: Building an SMTP Server in Gleam - Part 1"
date: 
status: publish
permalink: /todo
author: "Brad Cypert"
type: blog
tags:
  - gleam
  - smtp
  - retrospective
description: "I started building an SMTP server in Gleam. Here's what I've learned so far (Part 1)"
outline:
  what: "What's the main goal I am trying to convey"
  why: "Why does anyone care?"
  how: "How is whatever Im teaching used?"
  when: "When should it be used?"
---
I've been building an SMTP server in Gleam lately. I won't say "From scratch" as I'm using Rawhat's wonderful [Glisten](https://github.com/rawhat/glisten) library, which providers the TCP transport layer,
but outside of that, I'm not (currently) using any other libraries. What I've actually implemented so far is rather small. I haven't touched IMAP or POP and have just focused
on reading TCP packets, parsing them as SMTP payloads, and responding to the client appropriately. I'm hoping to share my learnings and document my progress with this post and others.
Lets get into it!

## TCP is everywhere

For most of our run-of-the-mill software development, when we send requests we're sending them over TCP. Now, you might say "I have never sent a TCP request in my life. I always use HTTP(s)" and to be honest,
this would be a normal reaction. It's reasonable to lack the knowledge that HTTP is built ontop of TCP if the lowest level primitive you use is HTTP, but now that we've cleared the air, we can agree that
you've likely been doing your networking over TCP. There are alternatives to TCP (UDP being the primary and the differences are probably out of the scope of this blog post) but HTTP (and HTTPS) is built
ontop of TCP. Similarly, SMTP is also built on top of TCP.

Armed with this information, we know that we can build an SMTP server (or an HTTP server) simply by building ontop of a TCP layer. In fact, TCP is such a common protocol to build ontop of that most languages
ship a standard library that includes support for a TCP layer, however, Gleam does not. Thankfully, an open source library named "Glisten" fits the bill quite nicely for us!

## A bit about Glisten

Glisten's interface is actually quite simple.
