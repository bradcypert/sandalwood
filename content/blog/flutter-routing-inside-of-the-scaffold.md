---
title: "Flutter routing inside of the Scaffold"
date: 2020-08-11
status: publish
permalink: /flutter-routing-inside-of-the-scaffold
author: "Brad Cypert"
excerpt: ""
type: blog
id: 3528
thumbnail: /pexels-pixabay-349758.jpg
category:
  - Flutter
tags:
  - dart
  - flutter
  - mobile
  - navigation
  - web
post_format: []
wp_last_modified_info:
  - "August 11, 2020 @ 8:29 pm"
wplmi_shortcode:
  - "[lmt-post-modified-info]"
hefo_before:
  - "0"
hefo_after:
  - "0"
saswp_custom_schema_field:
  - ""
itemlist_item_3050:
  - "a:0:{}"
music_composer_3050:
  - "a:0:{}"
movie_actor_3050:
  - "a:0:{}"
article_items_3050:
  - "a:0:{}"
image_object_exif_data_3050:
  - "a:0:{}"
blogposting_items_3050:
  - "a:0:{}"
newsarticle_items_3050:
  - "a:0:{}"
tech_article_items_3050:
  - "a:0:{}"
product_reviews_3050:
  - "a:0:{}"
feed_element_3050:
  - "a:0:{}"
faq_question_3050:
  - "a:0:{}"
performer_3050:
  - "a:0:{}"
organizer_3050:
  - "a:0:{}"
accepted_answer_3050:
  - "a:0:{}"
suggested_answer_3050:
  - "a:0:{}"
howto_supply_3050:
  - "a:0:{}"
howto_tool_3050:
  - "a:0:{}"
howto_step_3050:
  - "a:0:{}"
announcement_location_3050:
  - "a:0:{}"
music_playlist_track_3050:
  - "a:0:{}"
music_album_track_3050:
  - "a:0:{}"
apartment_amenities_3050:
  - "a:0:{}"
additional_property_3050:
  - "a:0:{}"
mc_cause_3050:
  - "a:0:{}"
mc_symptom_3050:
  - "a:0:{}"
mc_risk_factor_3050:
  - "a:0:{}"
tvseries_actor_3050:
  - "a:0:{}"
tvseries_season_3050:
  - "a:0:{}"
trip_itinerary_3050:
  - "a:0:{}"
saswp_webpage_speakable_3050:
  - "0"
saswp_modify_this_schema_3049:
  - "0"
itemlist_item_3049:
  - "a:0:{}"
music_composer_3049:
  - "a:0:{}"
movie_actor_3049:
  - "a:0:{}"
article_items_3049:
  - "a:0:{}"
image_object_exif_data_3049:
  - "a:0:{}"
blogposting_items_3049:
  - "a:0:{}"
newsarticle_items_3049:
  - "a:0:{}"
tech_article_items_3049:
  - "a:0:{}"
product_reviews_3049:
  - "a:0:{}"
feed_element_3049:
  - "a:0:{}"
faq_question_3049:
  - "a:0:{}"
performer_3049:
  - "a:0:{}"
organizer_3049:
  - "a:0:{}"
accepted_answer_3049:
  - "a:0:{}"
suggested_answer_3049:
  - "a:0:{}"
howto_supply_3049:
  - "a:0:{}"
howto_tool_3049:
  - "a:0:{}"
howto_step_3049:
  - "a:0:{}"
announcement_location_3049:
  - "a:0:{}"
music_playlist_track_3049:
  - "a:0:{}"
music_album_track_3049:
  - "a:0:{}"
apartment_amenities_3049:
  - "a:0:{}"
additional_property_3049:
  - "a:0:{}"
mc_cause_3049:
  - "a:0:{}"
mc_symptom_3049:
  - "a:0:{}"
mc_risk_factor_3049:
  - "a:0:{}"
tvseries_actor_3049:
  - "a:0:{}"
tvseries_season_3049:
  - "a:0:{}"
trip_itinerary_3049:
  - "a:0:{}"
saswp_blogposting_speakable_3049:
  - "0"
_yoast_wpseo_content_score:
  - "60"
_yoast_wpseo_primary_category:
  - "434"
_yoast_wpseo_focuskw:
  - "Flutter Routing"
_yoast_wpseo_title:
  - "%%title%% | Flutter Tips %%page%% %%sep%% %%sitename%%"
description:
  - "When Flutter's Navigator finds a route that matches one defined on the MaterialApp's routes property, it will swap out the MaterialApp's current child with the one that matches the route."
_yoast_wpseo_linkdex:
  - "68"
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