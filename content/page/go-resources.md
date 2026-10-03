---
title: "Go Resources"
description: "Simple, boring, and excellent for servers, CLIs, and gRPC. Notes on interfaces, channels, WaitGroup, slog, and shipping."
date: 2024-11-08
lastmod: 2026-10-03
status: publish
permalink: /go-resources
author: "Brad Cypert"
excerpt: ""
type: page
---

Simple, boring, and excellent for servers, CLIs, and gRPC. The language I reach for when I want to ship.

Go does not try to impress you. That is the feature. Interfaces are implicit. Goroutines are cheap. The standard library covers more than you think until you have lived in a language that makes you vendor a logging framework before you print a line.

I still write Go when the job is a server, a CLI, or anything that needs to be done on Tuesday. The posts below are the notes I kept: how interfaces actually work, how channels and WaitGroups fit together, and a few projects that forced me to leave the happy path.

Start with interfaces if you are coming from Java or C#. Start with channels if you already know the syntax and keep tripping on concurrency.

### Language

The boring parts that stop being boring once you have to explain them.

- [How Golang Interfaces Work](/how-golang-interfaces-work/) — Implicit implementation, and a Reuben, because sandwiches make better examples than `Fooer`.
- [Golang: What is a receiver function?](/go-receiver-function/) — Functions that belong to a struct without turning Go into an OOP language.
- [Go Channels](/go-channels/) — How goroutines talk to each other without sharing memory the hard way.
- [Go's WaitGroup](/go-waitgroup/) — Waiting for a pile of goroutines to finish, which is half of real concurrent Go.
- [Log is dead, long live slog](/go-slog/) — Structured logging with `log/slog` once `log` is not enough.

### Networking and tooling

These are the posts that came out of actually shipping something.

- [gRPC fundamentals with Go](/grpc-fundamentals-with-go/) — Why I reach for gRPC in Go and what you have to understand before the generated code makes sense.
- [Testing a Cobra CLI in Go](/testing-a-cobra-cli-in-go/) — Pull the command function out so you can test it like a normal function.
- [Using Mongo's ObjectIDs with Go-Graphql](/using-mongos-objectids-with-go-graphql/) — A custom scalar so Mongo IDs stop being a serialization headache.
- [An Introduction to Targeting Web Assembly with Golang](/an-introduction-to-targeting-web-assembly-with-golang/) — Compiling Go to Wasm when the browser is the runtime.
- [Building a Soil Moisture Sensor in TinyGo with Arduino](/building-a-soil-moisture-sensor-in-tinygo-with-arduino/) — Go on a microcontroller, because not every Go program needs a server.
