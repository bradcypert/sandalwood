---
title: "Overriding Button Styles in Android"
date: 2016-08-22
status: publish
permalink: /overriding-button-styles-in-android
author: "Brad Cypert"
excerpt: ""
type: blog
id: 29
category:
  - Android
tags:
  - android
  - beginner-friendly
post_format: []
description: "Quickly learn how to override the default android styles to help you create a look and feel unique to your application!"
---

Android comes with a ton of widgets, gizmos, and gadgets (maybe just widgets) out of the box, but it can be difficult to find one that works exactly how you would expect it to. My advice is this – find one that functions the way you want it to and override the styles to make it look the way you’d like. If that doesn’t work, you can always create a custom view, too!

For now, let’s assume that will work, and I’ll show you a recent example where I decided to use Android’s ToggleButton, a widget notoriously known for looking out of place. Brief background: This example is taken from a project I’m working on called **Turnip**. If you see references to that in the code, you can replace it with your application’s respective references.

#### Setting up the layout

First thing’s first, we’ll set up the layout for this view. Nothing fancy is going on here, I’m just creating a LinearLayout and adding a ToggleButton as a child of that layout. The magic comes later.

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:materialdesign="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:paddingBottom="@dimen/activity_vertical_margin"
    android:paddingLeft="@dimen/activity_horizontal_margin"
    android:paddingRight="@dimen/activity_horizontal_margin"
    android:paddingTop="@dimen/activity_vertical_margin"
    tools:context="com.bradcypert.turnip.AddTodoActivity"
    android:orientation="vertical">

    <ToggleButton
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:text="Monthly"
       android:textOff="Monthly"
       android:textOn="Monthly"
       android:background="@drawable/select_button"
       android:textColor="@color/select_button_color"
       android:id="@+id/toggleMonthly" />

</LinearLayout>

```

The two things to note are the following: `android:background` points to a drawable that doesn’t exist and `android:textColor` points to a color that doesn’t exist. Let’s make these now.

#### Flat Design ToggleButton

For the sake of simplicity, we’re going to override our ToggleButton to be flat. Currently, It looks like something you’d find in the cockpit of _Flight Simulator 1998_ for Windows 95.

Let’s create a new drawable resource file and call it `select_button.xml`. This file is going to take care of the overall shape of the button (handled via the background of the view). Let’s define a rectangle.

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android" >
   <item>
        <shape android:shape="rectangle"  >
            <padding
                android:bottom="10dp"
                android:left="10dp"
                android:right="10dp"
                android:top="10dp"/>
        </shape>
    </item>
</selector>

```

Now, if you notice, we’re outlining a shape and just the padding. This will render as just the button text, which is fine for now. Now let’s add another item to handle the `checked` state. Add this `item` right after the last `item` but still as a child to `selector`.

```xml
<item android:state_checked="true">
        <shape android:shape="rectangle" >
            <corners android:radius="3dip" />
            <stroke android:width="1dip" android:color="@android:color/transparent" />
            <solid android:color="@color/colorAccent" />
            <padding
                android:bottom="10dp"
                android:left="10dp"
                android:right="10dp"
                android:top="10dp"/>
        </shape>
    </item>

```

This item is a conditional item. It’s only used when the view it’s used with is checked. This will override the default “checked” theme for our ToggleButton and give us a nice flat button. It’s worth mentioning `@color/colorAccent` is a custom color setup for the theme of **Turnip**. You can use whatever color you’d like.

#### Updating the Text Color on State Change

One last thing! We still need to create the `xml` file for the text color. If you’re not using a bright color for the button background, you’ll probably notice that the text is hard to read, so we’ll define a custom color state. Create a new resource under `color` called `select_button_color.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_checked="true"
          android:color="#ffffff"/> <!-- pressed -->
    <item android:color="#000000"/> <!-- default -->
</selector>
```

This is even simpler than before, since we’re not worried about drawing rectangles or anything, and we’re just setting a value. If the state is `checked`, we set the color to a strong white. Otherwise, we set the color to a strong black. This will solve our problem with our button and it’s text not having enough contrast.

Our end result should give us something like this (The buttons at the bottom, UI subject to change before releasing **Turnip**).

![Example](/ss-1.png)
