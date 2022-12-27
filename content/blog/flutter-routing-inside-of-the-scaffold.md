---
title: "Flutter routing inside of the Scaffold"
date: 2020-08-11
status: publish
permalink: /flutter-routing-inside-of-the-scaffold
author: "Brad Cypert"
excerpt: ""
type: blog
id: 3528
images:
  - pexels-pixabay-349758.jpg
category:
  - Flutter
tags:
  - dart
  - flutter
  - mobile
  - navigation
  - web
description: "When Flutter's Navigator finds a route that matches one defined on the MaterialApp's routes property, it will swap out the MaterialApp's current child with the one that matches the route."
versions:
  dart: 2.16.2
  flutter: 2.10.5
---

If you’re coming from React Native to Flutter, one of the first things you’ll likely ask is “How do I do routing?” First, I’d ask you to consider if you actually need routing. Instead, could you just have a global state that determines which screen to show? In most cases, probably. But if you want things to feel right when building Flutter for Web (or want decent deep linking support), you’ll probably want to build your flutter app with routing.

Routing can easily be accomplished via the [MaterialApp ](https://api.flutter.dev/flutter/material/MaterialApp-class.html)widget in Flutter. In fact, the MaterialApp has a [routes](https://api.flutter.dev/flutter/material/MaterialApp/routes.html) property for exactly that! When Flutter’s [Navigator](https://api.flutter.dev/flutter/widgets/Navigator-class.html) finds a route that matches one defined on the MaterialApp’s routes property, it will swap out the MaterialApp’s current child with the one that matches the route. This is common behavior for most frontend routing libraries (including [React Router](https://reactrouter.com/) for React, for example).

The dilemma here is that most of the time, your MaterialApp’s direct child will be a Scaffold, which may or may not include a drawer (in my case, it does). **However, as stated above, routing will swap out the direct child of the MaterialApp widget (in this case, the scaffold).**

Why is this problematic? There are two key issues here. First, you’ll end up creating a new Scaffold as the main widget that you route to for each route that you define. Let’s consider the following code \[[dartpad link](https://dartpad.dev/24689b2afaa80279e86fc7e5c17b5fff)\]:

```dart
import 'package:flutter/material.dart';

final Color darkBlue = Color.fromARGB(255, 18, 32, 47);

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData.dark().copyWith(scaffoldBackgroundColor: darkBlue),
      debugShowCheckedModeBanner: false,
      initialRoute: '/1',
      routes: {
        '/1': (ctx) => Widget1(),
        '/2': (ctx) => Widget2(),
        '/3': (ctx) => Widget3(),
      }
    );
  }
}

class Widget1 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: Drawer(
        child: const Text('In the Drawer', textAlign: TextAlign.center),
      ),
      body: Text('Hello, World!', style: Theme.of(context).textTheme.headline4)
    );
  }
}

class Widget2 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: Drawer(
        child: const Text('In the Drawer', textAlign: TextAlign.center),
      ),
      body: Text('Hello, World!', style: Theme.of(context).textTheme.headline4)
    );
  }
}

class Widget3 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: Drawer(
        child: const Text('In the Drawer', textAlign: TextAlign.center),
      ),
      body: Text('Hello, World!', style: Theme.of(context).textTheme.headline4)
    );
  }
}
```

You’ll notice that we’ve duplicated our Scaffold three times, which is not great for code reuse, and if you paste this code in a flutter project and build for mobile, you’d notice that despite the route that you’re on, you’d **ALWAYS** have the hamburger/drawer in the top left. This probably isn’t desired, especially if you allow the user to navigate down into data (for example, navigating to a specific item from a list view). Let’s solve for both of these issues.

The Scaffold copy/paste can be reduced by creating a widget for the scaffold and
passing the scaffold’s body to our widget \[[dartpad link](https://dartpad.dev/9d6b30f43fff419b1a0a74cc2f801801)\].

```dart

import "package:flutter/material.dart"

final Color darkBlue = Color.fromARGB(255, 18, 32, 47);

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData.dark().copyWith(scaffoldBackgroundColor: darkBlue),
      debugShowCheckedModeBanner: false,
      initialRoute: '/1',
      routes: {
      '/1': (ctx) => Widget1(),
      '/2': (ctx) => Widget2(),
      '/3': (ctx) => Widget3(),
      }
    );
  }
}

class MyScaffold extends StatelessWidget {
  final Widget body;

  MyScaffold({this.body});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: Drawer(
        child: const Text('In the Drawer', textAlign: TextAlign.center),
      ),
      body: this.body
    );
    }
}

class Widget1 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MyScaffold(
        body: Text('Widget 1', style: Theme.of(context).textTheme.headline4)
    );
  }
}

class Widget2 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MyScaffold(
      body: Text('Widget 2', style: Theme.of(context).textTheme.headline4)
      );
    }
  }

class Widget3 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MyScaffold(
      body: Text('Widget 3', style: Theme.of(context).textTheme.headline4)
    );
  }
}

```

Great! This helps us avoid the need to recreate our drawer and scaffold in each child component. Now let’s add some code to allow you to actually navigate. We’ll do something simple that navigates by pushing a new route from Widget1 to Widget2 to Widget3. \[[dartpad link](https://dartpad.dev/a004e164c5f80ef84b22537b335cabd5)\]

```dart
import 'package:flutter/material.dart';

final Color darkBlue = Color.fromARGB(255, 18, 32, 47);

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData.dark().copyWith(scaffoldBackgroundColor: darkBlue),
      debugShowCheckedModeBanner: false,
      initialRoute: '/1',
      routes: {
        '/1': (ctx) => Widget1(),
        '/2': (ctx) => Widget2(),
        '/3': (ctx) => Widget3(),
      }
    );
  }
}

class MyScaffold extends StatelessWidget {
  final Widget body;

  MyScaffold({this.body});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: Drawer(
        child: const Text('In the Drawer', textAlign: TextAlign.center),
      ),
      body: this.body
    );
  }
}

class Widget1 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MyScaffold(
      body: Column(
        children: [
          Text('Widget 1', style: Theme.of(context).textTheme.headline4),
          FlatButton(child: Text("Go to 2"), onPressed: () => {
            Navigator.pushNamed(context, "/2")
          }),
        ]
      )
    );
  }
}


class Widget2 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MyScaffold(
      body: Column(
        children: [
          Text('Widget 2', style: Theme.of(context).textTheme.headline4),
          FlatButton(child: Text("Go to 3"), onPressed: () => {
            Navigator.pushNamed(context, "/3")
          }),
        ]
      )
    );
  }
}

class Widget3 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MyScaffold(
      body: Text('Widget 3', style: Theme.of(context).textTheme.headline4)
    );
  }
}
```

It’s worth mentioning that on web, you won’t see the app bar like you would on mobile, so to really drive this example home, I recommend copy/pasting the code from the dart pad into your project and running on iOS / Android.
Our latest changes add in navigation. If we were to remove the drawer from the scaffold, our mobile app would show a back button instead of the drawer when there items on the navigator stack. What we would like is to show the drawer when the user is at the root (Widget1 in this case). If they’re on Widget2 or Widget3 (remember: Down the navigation stack), then we want to show them the back button. This is very common (and often desired behavior) that most of the apps on your phone already perform.
We just want to conditionally change whether the app bar shows the drawer. So how do we do that? Quite easily \[[dartpad for entire file](http://e88b5e90e89c8a3c9859fdbdcc52c686)\]:

```dart

class MyScaffold extends StatelessWidget {
  final Widget body;

  MyScaffold({this.body});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: Navigator.canPop(context) ? null : Drawer(
        child: const Text('In the Drawer', textAlign: TextAlign.center),
      ),
      body: this.body
    );
  }
}

```

You can see here that we simply ask the navigator if it “can pop” (that is, if there are navigation items on it’s stack) and if so, we don’t render the drawer. The Scaffold has a preconfigured behavior to show the back button when a Drawer is not provided and when the Navigator `canPop` returns true. With this behavior, we can build an app that shows the drawer at the root level and a back button when navigating “down” into items.
