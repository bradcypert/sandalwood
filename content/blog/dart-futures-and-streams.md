---
title: "Dart's Futures and Streams"
date: 2020-09-26
status: publish
permalink: /dart-futures-and-streams
author: "Brad Cypert"
excerpt: ""
type: blog
id: 3565
images:
  - pexels-buenosia-carol-707582.jpg
category:
  - dart
tags:
  - Async
  - dart
description: 'Futures and Streams help solve the problem of asynchronous programming in Dart. Futures are intended to be used when you have a value that is returned asynchronously but streams are intended to be used for asynchronous values being emitted over time.'
---

Asynchronous programming in Dart is an absolute blast. Dart offers a couple of different options when writing asynchronous code: namely [Futures](https://api.dart.dev/stable/2.9.3/dart-async/Future-class.html) and [Streams](https://api.dart.dev/stable/2.9.3/dart-async/Stream-class.html). You can use both Futures and Streams to solve a lot of the same problems, but each serve their own purpose as well.

Futures are a type that models a computation who’s value may or may not be available. If you’re unfamiliar with Futures, you can think of getting a receipt at your favorite fast food restaurant as a Future. At some point, that receipt can be exchanged for a Hamburger (or whatever you order). However, something the grill could also break, and you may not receieve that Hamburger. You can think of a receipt as a `Future<Hamburger>`.

Futures are often used for particularly length computations such as HTTP requests or file IO. A lot of Dart packages (like [HTTP](https://pub.dev/packages/http)) will return futures from the methods that you call within those packages, however, you can even build your own Futures and work with those just like you would any other.

Futures can either succeed or fail (technically, both failure and success complete the future) and you can install a callback to handle each case. To register a callback for a successful future:

```dart
myFuture.then((value) => print(value));
```

To handle a failing future:

```dart
myFuture.catchError(err => print(err));
```

Most commonly, you’ll do both!

```dart
myFuture.then((value) => print(value))
  .catchError(err => print(err));
```

It’s worth noting that `.then` and `.catchError` both return the future, so you can chain any number of them.

## Creating your own Future

Sometimes you’ll want to create a Future, even if the value is readily available. You can do that using `<a href="https://api.dart.dev/stable/2.9.3/dart-async/Future/Future.value.html">Future.value()</a>`. This is common in scenarios where you might have cached data locally, but you also might have to make an HTTP request for the data.

For example:

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {

  List<String> cached = null;

  Future<List<String>> getData() {
    if (cached != null) {
      print("hit cache");
      return Future.value(cached);
    } else {
      return http.get("https://api.github.com/users/bradcypert/repos")
        .then((response) => jsonDecode(response.body).map((repo) => repo['name']).toList().cast<String>())
        .then((repos) {
          cached = repos;
          return repos;
        });
    }
  }

  getData().then((body) {
    print(body[0]);
  }).then((_) => getData())
  .then((body) {
    print(body[0]);
  });
}
```

## Streams

Streams are similar to futures, except they’re used to model an asynchronous sequence of data. If Futures are a single piece of data that may or may not be available, Streams are sequence of data over time that may or may not be available. For example, Streams can be used to consume updates from sockets, where those updates are pushed to the frontend automatically. Another example would be listening to a stream built and controlled by your application and pushing data into that stream in response to user events. I use that particular pattern in View Models with Flutter quiet a bit.

Several dart packages return streams, and just like Futures you can create your own Streams. Probably one of the most common ways that you’ll end up working with streams is via [the File API](https://api.dart.dev/stable/2.9.3/dart-io/File-class.html) (provided you’re writing server-side Dart). Let’s write some code that opens a file and reads the bytes of that file via a Stream.

```dart
import 'dart:io';

void main() {
  final myFile = new File('example.txt');
  Stream<List<int>> inputStream = myFile.openRead();

  inputStream.listen((List<int> byteChunk) {
    print(byteChunk);
  });
}
```

If you create a file called example.txt in the same directory (I added the text “this is an example m8”), you’ll find that you’ll print out something like `[116, 104, 105, 115, 32, 105, 115, 32, 97, 110, 32, 101, 120, 97, 109, 112, 108, 101, 32, 109, 56]`. Woo. It works.

However, for most people, bytes aren’t exactly helpful. It’d probably be better to see the actual contents of the file. Streams have a [`.transform` method](https://api.dart.dev/stable/2.9.3/dart-async/Stream/transform.html) that allows us to provide a transform function to the stream. In this case, we’ll transform those bytes into UTF-8 characters.

```dart

import "dart:io"
import "dart:convert"

void main() {
  final myFile = new File('example.txt');
  Stream<List<int>> inputStream = myFile.openRead();

  inputStream
  .transform(utf8.decoder)
  .listen((String text) {
    print(text);
  });
}

```

Take note that our `.listen` callback isn’t working with a `List` of `int`s anymore. Because the `utf8decoder` decodes a `List<int>` into a `String`, we have to adjust our listen function accordingly. Running this, we’ll now see output of whatever is contained within your `example.txt` file.

If you’d prefer to have more control over your transformations, Streams also support `.map` as a function. You can also do really neat things with `skip`(), `where()`, `reduce()`, and much more ([Stream API docs here!](https://api.dart.dev/stable/2.9.3/dart-async/Stream-class.html)). Additionally, if you’re working with a Stream and only care about one emission, you can use the Stream’s `.single` property to receive a Future for that one emission.

## Creating your own Stream

Creating your own Stream is actually quite similar to creating your own Future! The Stream class has several constructors available:

- `Stream.empty()` gives you an empty string.
- `Stream.value(...)` gives you a stream containing whatever you pass to `.value(...)`
- `Stream.fromFuture(...)` creates a new stream from a given future.
- `Stream.fromFutures(...)` creates a new stream from the provided futures. This one is particularly interesting as the stream emits as the futures complete, so ordering can be fairly random.
- `Stream.periodic(interval, computation)` creates a new stream and on the provided interval, runs the provided computation, emitting it’s result.

There are actually a couple more Stream constructors, but these are the ones that I’ve found myself using the most. You can find all of the constructors available in the [Dart Stream API documentation](https://api.dart.dev/stable/2.9.3/dart-async/Stream-class.html).
