---
title: "Flutter Isolates"
date: 2021-12-22
status: publish
permalink: /flutter-isolates
author: "Brad Cypert"
type: blog
images:
  - silhouette-photography-of-banana-hook-decor-706138.jpg
category:
  - Flutter
tags:
  - flutter
  - dart
description: "Isolates are a way to run long-running tasks in a separate, isolated thread. They are useful for things like network requests, database access, and long-running calculations."
---

Unfortunately the documentation around isolates is not very good, but they're a very powerful feature. If your goal is to avoid jank, you need to keep your main thread's UI responsive, and you need to make sure your main thread is not blocked by long-running tasks. Isolates help you achieve this.

Isolates are a way to run long-running tasks in a separate, isolated thread. They are useful for things like network requests, database access, and long-running calculations. If you're aiming for 60fps, you'll need to make sure your main thread is not blocked for longer than 16ms. When you look at your entire application's processes, 16ms will not feel like a lot. To be fair, it's not a lot at all.

You may want to use isolates for some of the following:
 - Database access
 - Network requests
 - IO processes
 - Background processes
 - Long-running calculations
 - JSON parsing
 - sorting long lists of data
 - and many more.

So how do you use isolates? Flutter provides you with two main ways to use isolates. The first (and arguably the simplest) is to use the `compute` function.

[The `compute` function is a simple function](https://api.flutter.dev/flutter/foundation/ComputeImpl.html) that spawns an isolate and runs a callback on that isolate. You can pass a single argument (though that argument can be a list or map) to the callback.

The callback argument must be a top-level function. It can not be a closure, instance method, or static method of a class.

```dart
List<Entry> sortItems(List<Entry> items) {
  var result = items;
  result.sort((a, b) => b.date!.toDate().compareTo(a.date!.toDate()));
  return result;
}

class Repo {
    Stream<List<Entry>> getAsStream(ownerId) {
    var data = getAdapter().getAll(ownerId).first as Future<List<Entry>>;
    return data
        .then((value) => compute<List<Entry>, List<Entry>>(sortItems, value))
        .asStream();
  }
}
```

The second way to use isolates involves actually creating the isolate and leveraging ports to pass data to and from the isolate. This is simplified a bit if you only need to pass data to the isolate, but it's a bit more complicated if you need to pass data back to the main thread. That becomes even more complicated if the isolate should receieve data multiple times from the main thread. More examples for this coming soon.