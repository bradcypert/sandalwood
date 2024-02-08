---
title: "Flutter's LayoutBuilder Widget - Dynamically Sized Widgets"
date: 2021-06-07
status: publish
permalink: /flutter-layoutbuilder-widget
author: "Brad Cypert"
type: blog
images:
  - flutter-layoutbuilder-cover.jpg
category:
  - Dart
  - Flutter
tags:
  - dart
  - flutter
description: "Flutter's LayoutBuilder Widget is a widget that allows you to layout widgets differently in different sized containers (phone vs tablet), but LayoutBuilder also allows you to change how widgets render based on the container they're rendered within."
versions:
  dart: 2.16.2
  flutter: 2.10.5
---

Flutter's LayoutBuilder Widget is a widget that allows you to adapt children widgets based off the constraints that the LayoutBuilder is contained in. This allows you to layout widgets differently in different sized containers (like a phone screen vs a tablet screen), but LayoutBuilder also allows you to change how widgets render based off the container that they're rendered within. A good example of the later is rendering a list of items as a list when the container is taller than 500 dp, but when it's smaller, rendering a select dropdown with the items as options.

There are three common patterns that I see with LayoutBuilder:

1. Using a Flutter LayoutBuilder as a child of MaterialApp.
2. Using a LayoutBuilder as a child of a Scaffold.
3. Using a LayoutBuilder elsewhere.

Using Flutter's LayoutBuilder as a child of the MaterialApp gives you full control over how the app renders against different constraints. You may want to use a LayoutBuilder at this point in the widget tree when you want to show a Scaffold on a mobile device, but possibly dont want to show a scaffold on a tablet or a desktop computer.

Using a Flutter LayoutBuilder as a child of a scaffold allows you to adapt the widget tree below the app bar and above the bottom navigation to different device constraints. You would take this approach when you want a consistent Scaffold (Appbar, Bottom Nav, etc) but want to change the main content on the screen based on the device's size and constraints.

Using a LayoutBuilder elsewhere allows you to adapt those widgets based on the size and constraints that they are contained within. This means if you have a Container => LayoutBuilder flow, the dimensions provided to the LayoutBuilder are based on the container. The constraints to the layout builder are provided from the closest constraining parent (Container, SizedBox, etc). This allows you to build widgets that lay themselves out one way in small containers and another way in larger containers, for example.

Indeed, LayoutBuilder can effectively allow you to build not only responsive applications, but can help you build adaptive applications as well. Let's take a look at how to use a LayoutBuilder.

```dart
LayoutBuilder(builder: (context, constraints) {
    return Container(...);
}
```

As we can see from the example above, the LayoutBuilder widget takes in a builder function as a named parameter. That builder function receives a [BuildContext](https://api.flutter.dev/flutter/widgets/BuildContext-class.html) and a [BoxConstraints](https://api.flutter.dev/flutter/rendering/BoxConstraints-class.html). While the build context can be helpful, most of the code for adapting to layouts will leverage the BoxConstraints.

BoxConstraints are the immutable (unable to be changed) layout constraints for the [RenderBox](https://api.flutter.dev/flutter/rendering/RenderBox-class.html). These box constraints have properties to get the minimum and maximum width and height of the Renderbox.

For example, in Luna Journal, I check the BoxConstraints' maxWidth on the home screen. If it's bigger than 900 dp, I render the layout in a row to create a [master detail view](https://mobikul.com/how-to-make-master-details-layout-for-small-mobile-devices/). If the screen is smaller than 900 dp, I render the layout in a column (top to bottom, for phone and small devices).

```dart
LayoutBuilder(builder: (context, constraints) {
    if (constraints.maxWidth > 900) {
        return Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
                Flexible(
                    flex: 1,
                    child: PetCard(),
                ),
                Flexible(
                    flex: 2,
                    child: getActionGrid(context, petVm, appVm),
                ),
            ]
        );
    } else {
        return Column(
            children: [
                Container(
                    height: 110,
                    child: Center(
                        child: PetCard(),
                    )
                ),
                Flexible(
                    flex: 1,
                    fit: FlexFit.tight,
                    child: getActionGrid(context, petVm, appVm)
                )
            ],
        );
    }
```

You'll notice that I render the `PetCard()` twice. That PetCard also uses LayoutBuilder, but instead of changing the layout of the widgets on the screen, it fundamentally changes how the PetCard is rendered. If the constraints are of a small height, then we render a select dropdown however, if the contstraints are of a large height, we render a ListView. Despite the name being _Layout_Builder, you can actually do a lot more than just change the layout!

**Note** A lot of small things (like TextStyles and Padding) have been removed from this example to remove some of the unrelated "noise". The intent was to focus on the use of layout builder to create a drastic shift in how a component is built. All this to say, "If you copy and paste this code, you _may_ have issues with rendering. Probably won't, but maybe 😁"

```dart
LayoutBuilder(builder: (context, constraints) {
    if (constraints.maxHeight > 400) {
        // render everything as a listview
        return Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
                if (data != null)
                Expanded(
                    flex: 1,
                    child: ListView.builder(
                        itemCount: data.length,
                        itemBuilder: (context, index) {
                            return GestureDetector(
                                onTap: () {
                                    petVm.setActivePet(data[index].documentID);
                                },
                                child: Text(data[index].name),
                            );
                        }),
                ),
                GestureDetector(
                    onTap: () {
                        Navigator.of(context).pushNamed("/pets");
                    },
                    child: Text("Manage Pets")
                )
            ],
        );
}

// render everything as a PopupMenuButton
return Row(
    mainAxisSize: MainAxisSize.max,
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
        Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
            PopupMenuButton<String>(
                child: Text("${petVm.getActivePet().name} ▾",
                onSelected: (String result) {
                    if (result == "Manage Pets") {
                        Navigator.of(context).pushNamed("/pets");
                    } else {
                        petVm.setActivePet(result);
                    }
                },
                itemBuilder: (BuildContext context) => 
                    data.map((e) => PopupMenuItem<String>(
                        value: e.documentID,
                        child: Text(e.name != null ? e.name : ""),
                    )).toList()
                    ..add(PopupMenuItem<String>(
                        value: "Manage Pets",
                        child: Text("Manage Pets"),
                    )),
            ),
            if (pet != null && pet.birthDate != null)
                Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                        Text("Birthdate:"),
                        Text(formatter.format(pet?.birthDate?.toDate()))
                    ]
                ),
            ],
        )
    ],
);
```

In this example you can see how we can completely change how a Widget is rendered through the constraints passed in to our LayoutBuilder. In fact, you can even have a LayoutBuilder that may import and render one specific widget when a certain constraint is met, but render other specific widgets when other constraints are met.

LayoutBuilder is ultimately a very simple widget that allows your widget tree to make some pretty powerful decisions regarding how it's children should be displayed. When building my first flutter app, I did not use LayoutBuilder at all. After some serious refactoring, almost every screen is using it in some way. This has allowed me to provide a more meaningful and expected experience on different devices and different display resolutions.
