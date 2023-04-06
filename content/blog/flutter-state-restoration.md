---
title: "Flutter State Restoration"
date: 2023-04-05
status: publish
permalink: /flutter-state-restoration
author: "Brad Cypert"
type: blog
images:
  - pexels-pixabay-209728.jpg
category:
  - flutter
tags:
  - flutter
  - mobile app UX
description: Flutter state restoration is a feature that allows you to preserve and restore the state of your application, providing value to your users and improving the user experience. It involves enabling state restoration and wrapping your widgets with the necessary classes. Examples of when to use state restoration include games, productivity tools, and e-commerce applications."
outline:
  what: "Flutter state restoration is a feature that allows you to preserve and restore the state of your application"
  why: "State restoration provides value to your application's users by allowing them to pick up where they left off after closing or suspending the application."
  how: "Show code examples using restoration scope, restoration id, etc."
  when: "use with games, productivity tools, ecommerce"
---

As a Flutter developer, you may have encountered the challenge of restoring the state of an application after it has been closed or suspended. Flutter state restoration is a feature that allows you to preserve and restore the state of your application. This feature is particularly useful for applications that require persistent state, such as games or productivity tools.

In this article, we will explore what state restoration is, why you would use it, how to set it up in your Flutter application, and common examples of when you would want to use state restoration.

## What is State Restoration?

State restoration is a feature in Flutter that enables you to preserve and restore the state of your application. This feature is particularly useful when an application is closed or suspended, and the user returns to the application at a later time. With state restoration, the user can pick up where they left off, without losing their place in the application.

State restoration is implemented through the Navigator class in Flutter. When you enable state restoration, the Navigator will automatically save and restore the state of your application. The Navigator does this by saving the state of the route stack and each route's state.

## Why use State Restoration?

State restoration provides value to your application's users by allowing them to pick up where they left off after closing or suspending the application. This can be particularly useful for applications that require persistent state, such as games or productivity tools.

In addition to providing value to your users, state restoration can also improve the user experience of your application. Without state restoration, users would need to start over from the beginning of the application every time they closed or suspended it. With state restoration, users can seamlessly return to the application without losing their place.

## Setting up State Restoration in Flutter

Setting up state restoration in Flutter is a straightforward process. To enable state restoration, you need to do the following:

Enable state restoration in your MaterialApp widget by setting the restorationScopeId property. This property should be set to a unique string that identifies your application.

```dart
MaterialApp(
  restorationScopeId: 'my_application',
  // ...
)
```

Wrap the Navigator widget with a RestorationScope widget. This widget allows the Navigator to save and restore its state.

```dart
RestorationScope(
  restorationId: 'navigator',
  child: Navigator(
    // ...
  ),
)
```

Add a RestorableRouteFuture widget for each route in your application. This widget allows the Navigator to save and restore the state of each route.

```dart
RestorableRouteFuture<MyRoute>(
  restorationId: 'my_route',
  builder: (context) => MyRoute(),
)
```

In each route, add a RestorableProperty widget for each property that you want to restore. This widget allows the Navigator to save and restore the state of each property.


```dart
class MyRoute extends StatefulWidget {
  @override
  _MyRouteState createState() => _MyRouteState();
}

class _MyRouteState extends State<MyRoute> with RestorationMixin {
  final _counter = RestorableInt(0);

  @override
  String get restorationId => 'my_route';

  @override
  void restoreState(RestorationBucket? oldBucket, bool initialRestore) {
    registerForRestoration(_counter, 'counter');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text('Counter: ${_counter.value}'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          setState(() {
            _counter.value++;
          });
        },
        child: Icon(Icons.add),
      ),
    );
  }
}
```

## Examples of when to use State Restoration

There are several examples of when you might want to use state restoration in your Flutter application. Here are some common scenarios:

- Games: Games often require persistent state, such as the player's score or progress. With state restoration, the player can seamlessly return to the game without losing their progress.
- Productivity Tools: Productivity tools, such as to-do lists or note-taking applications, often require persistent state. With state restoration, the user can pick up where they left off without losing any unsaved changes.
- E-commerce: E-commerce applications often require the user to navigate through multiple screens to complete a purchase. With state restoration, the user can return to the application and resume the checkout process without losing their place.

## Conclusion

Flutter state restoration is a powerful feature that allows you to preserve and restore the state of your application. By enabling state restoration, you can provide value to your users and improve the user experience of your application. With the steps outlined in this article, you can easily set up state restoration in your Flutter application and take advantage of this useful feature.