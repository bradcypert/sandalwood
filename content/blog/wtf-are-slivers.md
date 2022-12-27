---
title: "WTF are Slivers?"
date: 2022-05-21
lastUpdated: 2022-05-21
status: publish
author: "Brad Cypert"
type: blog
images:
  - pexels-ann-poan-5797904.jpg
category:
  - flutter
tags:
  - dart
  - flutter
  - fancy_ui
description: "Slivers help give you a deeper level of control over scrollable items in Flutter. Learn when to use slivers here."
versions:
  dart: "2.16.2"
  flutter: "2.10.5"
---

A fantastic user experience is a powerful tool for your application. It can help market your application (everyone loves a pretty app), can help with user engagement and can even be a competitive advantage in certain contexts. Flutter gives us so many tools to help us build fantastic user experiences - Hero, LayoutBuilder, Snackbar and more. Most of these are fairly well documented and are rather straightforward to use. Slivers, however, are even more powerful and less clearly documented (from my experience). Let's dig into Slivers and talk through how they're used in scrollable regions in a Flutter application.

When I say "scrollable regions", your mind probably jumps to ListView and GridView. These widgets are actually high level abstractions over Slivers! This means that you could build a ListView from scratch with Slivers -- which, more importantly, means that you can build a ListView or GridView with custom behavior specific to your application. But Slivers don't just stop there! As I said before, Slivers are used for "scrollable regions" in your Flutter application. This means that you can use Slivers to implement custom scroll behavior any time that you find yourself building something scrollable.

## But first we need to talk about ~~parallel universes~~ render objects
We know that a Flutter app is widgets all the way down. If we were to take a closer look at many of these widgets (especially the widgets that focus on doing one thing, like Opacity), we'd notice that some of these widgets are extending LeafRenderObjectWidget, SingleChildRenderObjectWidget, or MultiChildRenderObjectWidget. Upon further inspection, each of _these_ widgets extend RenderObjectWidget, which ultimately extends Widget.

Widgets aren't whats actually being rendered to the screen by Flutter. The Widget tree is a declarative tree that describes how your application is structured, but at the end of the day Flutter is using a Render Tree to actually render objects (we call those "RenderObjects" surprisingly enough) to the device screen. The Widget tree rebuilds itself a _lot_, but the render tree rebuilds itself significantly less often (unless something is wrong).

## Get to the point, Brad

So these RenderObjects are responsible for controlling how portions of your application are rendered to the screen. They control the size, layout and logic to determine if something should be rendered when forming the user interface for your Flutter application. Generally, we don't need to use RenderObjects directly -- they can actually be a bit on a pain to work with (which is why people are often _slightly_ afraid of Slivers). Most of the time, normal Widgets work fine and you can build many useful Flutter applications without using RenderObjects. If you're looking to tackle complex designs in a very performant fashion, however, you'll probably want to look into getting closer to the RenderObjects that Flutter is using.

These RenderObjects often manifest as RenderBoxes (containers, sized boxes, etc.) but these don't really work for scollable render areas. This is where RenderSliver comes in. RenderSlivers have additional constraints passed in by their parent and this allows them to only render items when they're in the viewport. This means that Slivers can provide extremely performant scrolling experiences on Flutter when built properly. To clarify, properly built RenderSlivers will allow you to lazy-render the contents of that Sliver so that you're only showing the visible portion of a screen at any given time.

Circling back, our Listview and GridView use RenderSliver. This means that Listview and Gridview takes advantage of the lazy-render experience provided by the RenderSliver!

One of the easiest ways to get started with Slivers is with the [CustomScrollView widget](https://api.flutter.dev/flutter/widgets/CustomScrollView-class.html). CustomScrollViews are scrollviews whose children are Slivers. Some widgets commonly used inside of a CustomScrollView are SliverAppBar, SliverList and SliverGrid. The SliverAppBar, for example, allows you to create an app bar that can shrink and/or pin itself to the top of the screen as the user scrolls the Scrollview.

## SliverDelegates

The SliverList and SliverGrid have a delegate property associated with them. You can use an instance of SliverChildListDelegate or SliverChildBuilderDelegate, but I'd recommend using the later. The ListDelegate provides a list of all the widgets being used by the sliver (commonly, you'd map the list to widgets) but this ultimately builds all of the widgets in advance. It is generally more performant to use the SliverchildBuilderDelegate which takes in a Builder function and generates widgets as needed from the builder function.

## SliverToBoxAdapter

The children (actually, its the "slivers" property not "children" property) of a CustomScrollView are required to produce RenderSliver objects. But what if you wanted to include something that doesn't produce a RenderSliver object? As an example, in one of my apps, I wanted to show a CircularProgressIndicator in the CustomScrollView.

```dart
Center(
  child: CircularProgressIndicator(),
)
```

We can inspect the Center and CircularProgressIndicator widgets and see that neither of them produce RenderSliver objects. Thankfully, Flutter provides adapters to help use non-rendersliver-producing widgets as the children of CustomScrollViews. In our case, we can simply use the SliverToBoxAdapter widget to create a bridge back to a box-based widget. Our above code would change like so:

```dart
SliverToBoxAdapter(
  child: Center(
    child: CircularProgressIndicator(),
  ),
)
```

You'll want to be careful if you find yourself using many of these adapters. You can likely accomplish what you're trying to do without the use of adapters and instead by using a SliverList, SliverFixedExtentList, SliverPrototypeExtentList or SliverGrid. Using one of these options will likely help the performance of your view as well.

## Sliver me timbers!

I'll admit, Slivers are complex compared to many other Flutter widgets, but I appreciate the flexibility they provide. You likely do not **need** slivers to build your application, but you can leverage them when you're comfortable with them to provide better performance and possibly a better experience for your users. There are actually quite a lot of Slivers ([go here and CMD+F \"sliver\"](https://api.flutter.dev/flutter/widgets/widgets-library.html)) and the best way to get comfortable with them is to explore the Flutter documentation and actually build something with them.  