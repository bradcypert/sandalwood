---
title: "How to query flutter dimensions with MediaQuery"
date: 2020-12-24
status: publish
author: "Brad Cypert"
excerpt: ""
type: blog
images:
  - pexels-lightbulb.jpg
category:
  - Flutter
tags:
  - dart
  - flutter
description: "Flutter's Media Query can be used to look up the width, height and more of your applications context and the user's device."
versions:
  dart: 2.16.2
  flutter: 2.10.5
---

One of the key selling points for building Flutter applications is the framework's options for building responsive mobile applications. However, it's easy to find yourself overwhelmed by the many options that are available. Often times, you'll want to leverage BoxConstraints, LayoutBuilder, AspectRatio, FittedBox or maybe even the rare FractionallySizedBox. You might even be able to keep things simple by sticking to Flex widgets. However, you'll likely find yourself in a predicament where, for one reason or another, you just need to know information about the device viewport.

Whether you need to query the width or height, or maybe something a little more interesting like the device orientation, `MediaQuery` can help provide answers! MediaQuery requires a context and, generally, you'll want to construct a MediaQuery via the `.of` static method. That ends up looking something like `MediaQuery.of(context)`. This returns a `MediaQueryData` object, which is what we'll be using for the rest of this lesson.

## Getting information about the device's screen dimensions

`MediaQueryData` can be used to gather information about the device's dimensions via the `size` property. Let's look at an example that gets the width and height of the screen.

```dart
class MyWidget extends StatelessWidget {
  @override
  Widget build(context) {
    var size = MediaQuery.of(context).size;
    return Container(
      child: Column(
        children: [
          Text("Width: ${size.width}"),
          Text("Height: ${size.height}"),
        ]
      )
    );
  }
}
```

This simple widget leverages `MediaQuery` to get the width and height of the viewport and then renders that data to the screen. For most queries, this example should give you what you need, however, we'll also modify this widget to display even more data from the MediaQuery.

### Displaying Device orientation

Let's modify the above widget so that we also display the device orientation.

```dart
class MyWidget extends StatelessWidget {
  @override
  Widget build(context) {
    var query = MediaQuery.of(context);
    return Container(
      child: Column(
        children: [
          Text("Width: ${query.size.width}"),
          Text("Height: ${query.size.height}"),
          Text("Orientation: ${query.orientation}"),
        ]
      )
    );
  }
}
```

You should see a new addition when rendering this widget: "Orientation: Orientation.landscape" or "Orientation: Orientation.portrait." Working with the MediaQuery really is as simple as that!

<HeadsUp>
    The entire example can be ran in your browser. Here's a link: <a target="_blank" href="https://dartpad.dev/01a4b740e5e0a16c8a6c5804f6a299a7?">https://dartpad.dev/01a4b740e5e0a16c8a6c5804f6a299a7</a>
</HeadsUp>

There's a lot more to MediaQuery that we haven't covered in today's post. [Flutter's documentation on MediaQuery is wonderful](https://api.flutter.dev/flutter/widgets/MediaQuery-class.html) and, if you're wanting to explore what data can be provided by the MediaQuery object, the [MediaQueryData](https://api.flutter.dev/flutter/widgets/MediaQueryData-class.html) class reference can be a huge help! Thanks for your time and happy fluttering!

