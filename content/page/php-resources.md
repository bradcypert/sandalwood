---
title: "PHP Resources"
description: "PHP, Laravel, Lumen, and Slim — arrays, files, and a few small HTTP services."
date: 2020-01-09
lastmod: 2026-10-03
status: publish
permalink: /php-resources
author: "Brad Cypert"
excerpt: ""
type: page
id: 2232
---

PHP was one of the first programming languages I learned. I appreciate the stateless nature of web development. A request comes in, you handle it, you leave. Laravel made that feel like a real framework. WordPress made it feel like the web.

Arrow functions landed in 7.4 and I was glad they did. Arrays and file I/O are the first things you have to get right. When I want to learn a web stack, I build something that answers JSON — Laravel, Lumen, or Slim plus Eloquent.

### Core PHP

- [Arrow Functions](/arrow-functions-in-php-7-4) — Short closures, finally, and why they were worth the wait.
- [Read from a File](/how-to-read-from-a-file-in-php) — `file` vs `file_get_contents`. Both work. They aren't the same.
- [Add to an Array](/php-add-array) — Assignment over `array_push`. I still believe that.

### Laravel

Laravel is the PHP framework I actually enjoyed. Homestead was how I kept the environment from rotting.

- [What is Laravel's Homestead?](/what-is-laravels-homestead) — A Vagrant box for Laravel so you aren't installing PHP packages on the host and hoping.

### Tutorials

Three small HTTP services. Same idea, three different amounts of framework.

- [Laravel URL shortener](/building-a-simple-url-shortener-in-php-with-laravel) — A full Laravel app, on purpose, for a problem that stays small.
- [Building a simple API with Lumen](/building-a-simple-api-in-php-using-lumen) — Laravel's microframework with Eloquent already in the box.
- [Building a simple API with Slim and Eloquent](/building-a-restful-api-in-php-using-slim-eloquent) — Slim for the HTTP layer, Eloquent for the database, because that pairing was nicer than it had any right to be.
