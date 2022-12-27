---
title: "Dart Mixins Guide"
date: 2021-04-24
status: publish
permalink: /dart-mixins
author: "Brad Cypert"
type: blog
images:
  - dart-mixins-cover.jpg
category:
  - Dart
tags:
  - dart
  - learn_dart
description: "Dart's mixins are a way to reuse class code in multiple class hierarchies."
versions:
  dart: 2.16.2
---

There are a _lot_ of alternatives to inheritance. Abstract classes, interfaces, some languages have "traits", and in Dart,
we have Mixins (and abstract classes and implicit interfaces, too). Mixins are a way to reuse class code in multiple class hierarchies.

## How do you declare a Mixin in Dart?

Mixins require using 2 different keywords to fully make use of them in Dart.

First, we use the `mixin` keyword to declare a new mixin.

```dart
mixin Quacker {
  void quack() {
    print("Quack!");
  }
}
```

Our mixin can then be applied to other classes using the `with` keyword:

```dart
class Mallard with Quacker {
  Gender gender;
  String name;

  Mallard({this.gender, this.name});

  makeNoise() {
    quack();
  }
}
```

Clearly this example is a bit contrived, but I'll share a few more practical ones as we go. For now, take note that we're
using the `with` keyword to mix-in our Quacker mixin into our Mallard class. You'll also notice that our class now has access
to the `quack` method that we defined on our mixin. We can call this indirectly (like via the `makeNoise` method I created)
or we can call it directly via `Mallard(...).quack()`.

## Adding properties to our class via Mixins

Mixins can be used to add more than just methods to our classes. Indeed, they can also add properties! Let's take a look at
another mixin that I've written for a Flutter app. This mixin is called `SubscriptionBag`. It adds a property for a
List of StreamSubscriptions. Additionally, we use generics with type bounds to specify that this mixin can be mixed in to
anything that extends a `StatefulWidget`. We use the type bounds to specify an override for the dispose lifecycle method.

In layman's terms, this mixin allows us to add subscriptions to a list that gets cleaned up when the stateful widget is
disposed of.

```dart
import 'dart:async';

import 'package:flutter/material.dart';

mixin SubscriptionBag<T extends StatefulWidget> on State<T> {
  List<StreamSubscription> _bag = [];

  addToBag(StreamSubscription sub) {
    _bag.add(sub);
  }

  @override
  void dispose() {
    super.dispose();
    _bag.forEach((sub) {
      sub.cancel();
    });
  }
}
```

This allows us to consume the mixin like so (truncated in some irrelevant areas for brevity):

```dart
class _PetState extends State<Pet> with SubscriptionBag {
  String id;
  TextEditingController nameController = TextEditingController();
  TextEditingController dateController = TextEditingController();
  String photoUrl;
  final picker = ImagePicker();

  _PetState({this.id});

  isExisting() => this.id != null;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    var petsVm = Provider.of<PetViewModel>(context);
    if (this.isExisting()) {
      addToBag(petsVm.getEntryById(this.id).listen((event) {
        setState(() {
          nameController.text = event.name;
          photoUrl = event.photoUrl;
          dateController.text =
          event.birthDate != null ? formatter.format(event.birthDate.toDate()) : "Unknown (edit to add)";
        });
      }));
    } else {
      setState(() {
        editMode = true;
      });
    }
  }

  /// truncated ....
}
```

## Multiple Mixins
Dart supports implementing multiple mixins via a comma separated list in the `with` expression.
`class Mallard extends Animal with Quacker, Flappers, Beak {...}` for example. Due to the way that Dart processes
mixins, the ordering is relevant. [Stackoverflow user Irn explains this concept well](https://stackoverflow.com/questions/45901297/when-to-use-mixins-and-when-to-use-interfaces-in-dart/45903671#45903671):

> Mixins in Dart work by creating a new class that layers the implementation of the mixin on top of a superclass
> to create a new class - it is not "on the side" but "on top" of the superclass, so there is no ambiguity in how
> to resolve lookups.
>
>  -- answer from ["When to use Mixins and when to use interfaces in Dart?"](https://stackoverflow.com/questions/45901297/when-to-use-mixins-and-when-to-use-interfaces-in-dart/45903671#45903671) by Stackoverflow user Irn

## What about Abstract Classes?

The main benefit of a  mixin over an abstract class is the ability to share code and functionality outside of the inheritance hierarchy.
Mixins can be "mixed in" to a class at any level and doesnt influence the inheritance chain. Where a class can only directly extend one class,
they can compose themselve with as many mixins as they see fit. This allows mixins to be smaller (and often more composable) than abstract classes.
However, there are times where an abstract class still makes the most sense, in my opinion. In Dart, the inheritance hierarchy is used to model
a lot of the core library. This means that you can accumulate behavior from multiple subclasses via abstract classes and this provides a clear
pattern for extending the core library with your own types (your own implementation of a list, for example).
