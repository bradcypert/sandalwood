---
title: "Dart Resources"
description: "Dart, Flutter, GitHub Actions, and Bosun — notes from building apps and CLIs."
date: 2020-01-09
lastmod: 2026-10-03
status: publish
permalink: /dart-resources
author: "Brad Cypert"
excerpt: ""
type: page
id: 2232
---

Dart is a client-optimized language for fast apps on any platform. Flutter lets you build for phones, desktops, and whatever screen is next.

I still care about Dart. It is just not the headline right now. The language is pleasant, the tooling is better than people remember, and Flutter is still the fastest way I know to get a UI on more than one device without maintaining three codebases.

This page is the Dart and Flutter writing from when that was a bigger part of my week. JSON, futures, constructors, slivers, plus the CI bits I needed to publish packages without clicking around GitHub.

[Bosun](https://github.com/bradcypert/bosun) is in here too. I built it because CLI structure in Dart was underserved.

### Core Dart

The language parts you hit on day two, once hello world stops being interesting.

- [Working with JSON](/working-with-json-in-dart) — Encoding and decoding without pretending Dart is JavaScript.
- [Futures and Streams](/dart-futures-and-streams) — One value later vs values over time. Mixing them up is how you get sad.
- [Constructors (and their many forms)](/the-many-constructors-of-dart) — Named, factory, const, redirecting. Dart has a lot of constructors. That is not an accident.

### CI/CD

Publishing a Dart package is easy until you want tests and coverage on every push.

- [Run tests and Publish to Registry with Github Actions](/dart-packages-with-github-actions) — Test, then publish, without doing it from a laptop.
- [Generate Coverage and Upload to CodeCov via Github Actions](/how-to-upload-coverage-to-codecov-for-dart) — Coverage numbers in CI so you can see the drop before a reviewer does.

### Flutter

Flutter is where Dart pays rent. These are the UI problems I actually had to solve.

- [Routing inside the Scaffold](/flutter-routing-inside-of-the-scaffold) — Navigator matching a route and swapping the child. Sounds small. It is not.
- [Querying Width, Height, and Device Orientation](/how-to-query-flutter-dimensions-with-mediaquery) — `MediaQuery` for size and orientation without hard-coding a phone.
- [Reusable SimpleDialog Bodies](/reusable-simpledialog-bodies-in-flutter) — Dialog content you can reuse instead of copy-pasting a column.
- [WTF are Slivers](/wtf-are-slivers) — Scrollables with more control than a `ListView`, once you need it.

### Bosun (CLIs in Dart)

There are plenty of guides for web apps. There were not many for structuring a CLI. Bosun was my answer.

- [Building a CLI in Dart with Bosun](/building-a-cli-in-dart-with-bosun) — Commands, structure, and why I did not want to reinvent argument parsing every time.
