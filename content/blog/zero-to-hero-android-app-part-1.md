---
title: "Zero to Hero: Android App - Part 1 - Views"
date: 2016-09-15
status: publish
permalink: /zero-to-hero-android-app-part-1
author: "Brad Cypert"
excerpt: ""
type: blog
id: 37
category:
  - Android
  - Zero-To-Hero
tags:
  - android
  - zero-to-hero
post_format: []
description:
  - "Build an Android app from scratch with the Zero to Hero series. Learn about Views, SQLite, DBCusors, Activities and more as we build a Habit Builder app."
_yoast_wpseo_title:
  - "Zero to Hero - Android App - Part 1 - Views"
---

App development is never a straight-forward task. In fact, apps are built from many components that handle specific needs. It’s up to you, the app developer, to determine which components you need, how they should be implemented, and how they should interface with the rest of the app. The most common component is called a View.

#### Android Views

Look around. What do you see? Sure, the specifics of what you and I see are different, but they both represent the same concept. We both see things that have some visual representation and are usually something we can interact with. In Android, views represent the same thing – They’re essentially just the part of the app a user can see and interact with.

If you’ve never built an application before, Android or other, you might be a bit confused. Well, there’s more to Android Apps than just the views! In fact, there’s a **lot** going on behind the scenes of your views, but this is all logic that the developer — you — need to worry about and users will never know about. If you’ve never built an app before, you might not realize that there’s so much that goes on behind the scenes. Now that we’ve covered the importance of views, let’s start a new application and make our view!

#### A New Android Application

If you haven’t already, launch Android Studio. If you’ve played around with Android Studio since the last post and need to get back to the launch screen, you can use the top-most menu to close your current project. Next, click **Start a new Android Studio Project**.

You’ll be asked to fill out a few fields for the next part of this tutorial. These aren’t super complicated so I’ll go through them quickly:

- Application Name: type **Turnip**. This is the name of our application.
- Company Domain: type **yourname.com**, but using your actual name. For me, this is **bradcypert.com**. Don’t worry if you don’t actually own that domain.
- Project Location: Leave the default value. This is where all of your code will be stored.

Now, click “Next”. In this next view, we’re just going to check the box for Phone and Tablet and set the Minimum SDK to Android 5.0 (Lollipop). This is where you would add support for other types of devices, like watches or Android TV, but we’ll skip that for now. You can always add support later, too. Go ahead and click “Next” once more.

In the next screen, you’ll be presented with the option to “Add an Activity to Mobile”. We’ll get into Activities in our next tutorial, but for now, click “Empty Activity” and then click “Next”.

Finally, we’ll have one more set of prompts. For activity name, type: **AddTaskActivity**. Make sure **Generate Layout File** is checked. The Layout name should be auto-set to **activity_add_task**. Now, click finish!

Technically, you’ve just built your first Android app, even though doesn’t really do anything – yet. We’re going to change that.

#### A Few Tips Before We Start Coding

Android Studio can be overwhelming, especially if you’ve never used an IDE (Integrated Development Environment) before. There are a lot of buttons and a massive list of files. I’m going to do my best to give you exact instructions, but here are a few tips:

- If I say “Open TaskListActivity.java”, you can double-press the shift key to open the file finder. Then, type TaskListActivity.java and hit enter. It’ll open it for you.
- The Build Button is the green button at the top that looks like the “Play” button that you’d see on Spotify or Netflix.
- We’ll usually use Android Studio, but there are a few times where we’ll want to use our file explorer (Explorer on Windows; Finder on Mac). I’ll clearly state when we’re going to use our File Explorer so pay close attention for that!

#### Our First Android View

Views in Android are written in XML. If you have little or no experience with XML, fret not! It’s actually really basic to use! Although I won’t go over the intricacies in this post, there are a few things worth mentioning:

- XML is represented as a tree with elements. This means that some elements contain other elements.
- XML elements have attributes that define how we can interact with them or how we see them in our Android Application.

In the right-most pane, you should see some Java Code. At the top of that pane, you should see some tabs opened. Click the tab labeled **activity_add_task.xml**. You should see something like this:

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:paddingBottom="@dimen/activity_vertical_margin"
    android:paddingLeft="@dimen/activity_horizontal_margin"
    android:paddingRight="@dimen/activity_horizontal_margin"
    android:paddingTop="@dimen/activity_vertical_margin"
    tools:context="com.bradcypert.turnip.AddTaskActivity">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!" />
</RelativeLayout>

```

If you don’t see that, but instead see a picture of an Android Phone that says “Hello World” click the “Text” tab at the bottom of that pane.

Go ahead and delete it all. We’re going to build our view from scratch and I’ll talk about each element as we add them. The first thing we want to add is the `<xml>` tag.

```xml
<?xml version="1.0" encoding="utf-8"?>
```

This specifics that the version of XML used to parse this document is version 1.0, and it’s encoded in UTF-8. Don’t worry too much about fully understanding what that means, just know that each XML document that we’ll add needs this line.

Next, we have to define the base layout that we want for our view. We’re going to add a `LinearLayout`. A `LinearLayout` tells our Android Application that the direct children of this view should be rendered in a vertical line. Add this code:

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:paddingBottom="@dimen/activity_vertical_margin"
    android:paddingLeft="@dimen/activity_horizontal_margin"
    android:paddingRight="@dimen/activity_horizontal_margin"
    android:paddingTop="@dimen/activity_vertical_margin"
    tools:context="com.bradcypert.turnip.AddTodoActivity"
    android:orientation="vertical">

```

There’s a **lot** happening in this element. Let’s talk about each attribute one at a time.

- `xmlns:android` defines the default android namespace. This is used to resolve the rest of the child elements and their attributes. For now, just know that **it’s needed on every root element**.
- `xmlns:tools` defines the namespace for our tools. You can usually leave this one off, but you get a lot of benefits for having it here as well, so we’re going to keep it.
- `android_layout_height` & `android layout_width` define the height and width of the application. `match_parent` tells the Application that this view is going to be the same size as it’s parent. This view has no parent, so it’s going to be the size of the full screen.
- `android:paddingWhatever` defines how much space is in between this view and it’s parent. The value of this is usually a number followed by `dp`, so something like `10dp`. This is valid, but we have another alternative as well. If we want to easily reuse a value, we can make a reference to it. That way, if we ever want to change the value in every place that uses it, we can just update the reference to be the new value. For us, that reference looks like `@dimen/activity_horizontal_margin` or `@dimen/activity_vertical_margin`. These are values provided to us by the Android system.
- `tools:context` tells the Android Application’s tools that this view is intended to be used with a specific activity. In this case, `com.bradcypert.turnip.AddTodoActivity`. We’ll talk more about activities in our next tutorial.
- `android:orientation` defines the orientation for this view. Vertical means that the children will be in separate rows; horizontal means that the children will be in separate columns.

Phew. A mouthful! Next, we’re going to add something called an `EditText`. An `EditText` is simply a way for users to input text. We’ll use this as a means to let users name the task that they want to complete.

```xml
<EditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:id="@+id/addNewTaskName"
        android:textSize="26sp" />

```

You might notice a few different things here. For example, we’re using `wrap_content` instead of `match_parent` for the height. That tells the element that it should only be as tall as it needs to be for all of it’s content to be visible. We’re also adding an `android:id`. An ID provides a way to uniquely reference this element from the rest of our application. This will be very relevant later once we need to get the text that the user input into this element. `android:textSize` determines how big the input should be. Text Size is in a unique unit as well, called SP. Remember this: **Text is SP. Everything else is DP**. If you’re XML-savvy, you’ll also notice that this element is self-closing, meaning it doesn’t need a closing tag. We didn’t add a closing tag for the LinearLayout either, but we will need to in the near future.

Next, we’re going to add some space in between our views. There’s actually several ways to do this, but one of the most obvious ones is creating a new `Space` element. So let’s go ahead and do that.

```xml
<Space
    android:layout_width="20dp"
    android:layout_height="20dp"/>

```

This tells our Application that I want a space of 20DP tall to be in between the elements we just added and the elements that we’re about to add. Very simple!

Next, we want to add something called a switch. Android switches come with a few defaults setup for the text that it’s displayed, and while that’s something we can overwrite, we’re just going to choose to leave the text off of the switch and create a text element instead. Basically, we want these to be side by side so they look as if they belong together. To do that, we’ll leverage a tool that we’ve already used, called a LinearLayout. Remember how we can define the `android:orientation` for a linear layout? That’s exactly what we need.

```xml
<LinearLayout
        android:orientation="horizontal"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginBottom="20dp"
        android:layout_gravity="center_vertical">

        <TextView
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:text="Want a reminder?"
            android:id="@+id/textView"
            android:layout_weight="0.60"
            android:textSize="24sp"
            android:layout_gravity="center" />

        <Switch
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:id="@+id/reminderSwitch"
            android:checked="false"
            android:showText="false"
            android:layout_gravity="bottom" />
    </LinearLayout>

```

I won’t go over all of these properties, as you should be able to figure most of them out by now, but I’ll highlight a few things:

- `android:orientation` being set to horizontal is key to getting the two elements to be side by side.
- `android:layout_gravity` is used to vertically center views in this case. It can be used to align child items in other ways, too.
- We create a new element called TextView. The entire purpose of this element is to show text to the user. We set the default text to “Want a reminder?”
- The width of this TextView is `0dp`. Once you set a width to `0dp`, the `weight` of the view takes over. The `weight` is a way to define how much of the parent container it takes up for whatever value is set to `0dp`. So, in this case, we’re saying we want the TextView to take up `0.60` or 60% of the parent view.
- We define an element called Switch. A switch is a slidable switch (you’ll know it once you see it!).
- We set the ID of the switch. We’ll need this later.
- We turn off showText, since we have our own implementation to show text next to this Switch.

We’ve covered almost all of the elements and their property, so this next block of XML to add will be the biggest block yet, however, we only need to talk about Buttons and Button types. Here we go!

```xml
   <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="How frequently do you need to do this?"
        android:id="@+id/textView2"
        android:textSize="18sp"
        android:layout_marginBottom="20dp"
        android:textAlignment="center" />

    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_horizontal">

        <ToggleButton
            android:layout_width="100dp"
            android:layout_height="wrap_content"
            android:text="Daily"
            android:textOff="Daily"
            android:textOn="Daily"
            android:background="@drawable/select_button"
            android:textColor="@color/select_button_color"
            android:id="@+id/toggleDaily"
            android:elevation="2dp" />

        <ToggleButton
            android:layout_width="100dp"
            android:layout_height="wrap_content"
            android:text="Weekly"
            android:textOff="Weekly"
            android:textOn="Weekly"
            android:background="@drawable/select_button"
            android:textColor="@color/select_button_color"
            android:id="@+id/toggleWeekly"
            android:elevation="2dp" />

        <ToggleButton
            android:layout_width="100dp"
            android:layout_height="wrap_content"
            android:text="Monthly"
            android:textOff="Monthly"
            android:textOn="Monthly"
            android:background="@drawable/select_button"
            android:textColor="@color/select_button_color"
            android:id="@+id/toggleMonthly"
            android:elevation="2dp" />
    </LinearLayout>

    <Button
        android:layout_width="fill_parent"
        android:layout_height="wrap_content"
        android:text="Create Task"
        android:id="@+id/createButton"
        android:background="@color/colorAccent"
        android:textColor="@color/abc_primary_text_material_dark"
        android:layout_marginTop="15dp"
        android:minHeight="50dp" />

</LinearLayout>
```

First thing’s first. Remember how I said we’d have to close out that LinearLayout earlier when I mentioned how XML-savvy you were? Well, we close that out here. We add another `TextView` to present the user with some more text, and we add a `LinearLayout` to put some `ToggleButton`s next to each other. Lastly, we create a Button.

#### ToggleButtons

ToggleButtons are interesting. A ToggleButton is simply a button that can be turned “on” or “off”, which sounds an awful lot like a switch (like we used above). We only want one ToggleButton to be “on” at a time so we’re going to define custom behavior. With this behavior the user can press a button, and if the user switches to another ToggleButton, it will untoggle the current one. This will allow them to only select one timeframe at a time: daily, monthly, or weekly. `android:textOff` and `android:textOn` allows you to set the text for when the button isn’t toggled and is toggled, respectively. For us, we want them to show the same text regardless of whether they’re on or off. We can define a background for our ToggleButtons, which is something we’re certainly going to do. We want our app to be pretty, right? And ToggleButtons look terrible out-of-the-box. We can also define the text color similarly to how we define the background. This lines will be red because we haven’t built the drawable or color yet. That’s okay, we’ll get back to that soon! For now, just add it and move on to the button.

#### Buttons

Ah. The de facto of user interaction. The button that we’ve added at the end will act as our save button. When we press it, we’re going to get all of the values that the user has entered above and do something with them – but not yet! Instead of setting up `height`, we’ve decided to set a `minHeight` of `50dp`, which means this element will always be taller than `49dp`.

#### Design Tab

At this point, you should be able to click the design tab at the bottom of the pane. You’ll be taken back to the view of an Android Phone, but instead of seeing Hello World, you’ll see the view that we’ve created. You should also see a little notification saying we have rendering problems. Let’s go ahead and fix those.

The First issue we’re running into is this: **Couldn’t resolve resource: @drawable/select_button**. This is because we set the background of our toggle buttons to reference this and it’s a very easy thing to fix – we simply create the file called select_button!

In the far left, **right-click on Java** and then **click on “New”**, and finally click **Android Resource file**. You’ll be greeted with a menu requesting more information. Fill it out like so:

- File Name: select_button.xml – simply the name of the file. This needs to match the background we added for the toggle buttons.
- Resource Type: drawable – See “What is a drawable” below.
- Root Element: resources – Resources are also XML, so we need a root element. A selector is a type of root element that picks a different child to represent it based on certain conditions.
- Source Set: main – You can use the source set to create different resources for different versions of your application, like Debug or Release. Although this isn’t very useful with Drawables, it’s great for API URLs/keys or other authentication secrets.
- Directory Name: drawable – just the directory that we’re adding the resources to. We’re creating a drawable, so we add it to the drawable directory! Kudos for being organized!

Now, go ahead and click “Okay.” If you did everything properly, you should now be looking at this:

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">

</selector>

```

#### So what exactly is a “Drawable”?

A Drawable is a resource that the Android Operating system (and by association – your app) is able to render to the screen. We can leverage this drawable to define a how a drawable should act under certain conditions – like what it should look like when a user is pressing the button, or when it’s active. Drawables can be used in many places in your Android App, but one of the most common use cases is for the Background property on buttons or other widgets. We’re going to use our drawable to change the background of those toggle buttons.

We’re going to add three new items where the dots are below:

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    ...
</selector>

```

First, we’re going to add the default button style. We’ll create an `item` element and define that shape and color via child elements within it. Once again, you’ll the dots in the above example with this code:

```xml
<item>
    <shape android:shape="rectangle">
        <padding
            android:bottom="10dp"
            android:left="10dp"
            android:right="10dp"
            android:top="10dp"/>
    </shape>
</item>

```

We have a few new elements we’re working with here. `shape` simply defines a shape to be used. Android has several shapes available out of the box, but we can make our own if we’d like. Thankfully, for this tutorial the rectangle will suffice. `padding` is used to define how much space we’d like this element to have inside the border. This is similar to a margin, except margins grow the space outside of the element, and padding grows the space inside. And with that, we’ve defined our default state for our toggle buttons. But what if we want our buttons to look different when after a user touches them?

We simply add another item! For this item, add it above the one that you just added, but still within the selector tag.

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

This should look VERY similar to the above example, with a few new things added. First, our `item` has a property set called `android:state_checked` set to true. That means that this item will only be shown when the button has “On”. To reiterate: The point of the toggle button is a button that can be turned on and off. The next difference you’ll notice is that we’re defining the `corners` of our drawable. We can use `android:radius` to round off our corners. We’re also defining `stroke` which allows us to color the border. We’re setting the color to transparent, which is a default color provided by Android.

Next, we’re setting `solid` and the property `android:color`. `solid` is the meat and potatoes of the drawable. This color that we set here will fill the entire button. In this case, we’re setting it “@color/colorAccent”, a reference to a color provided by Android. Later, we’ll talk about overriding these colors to brand your app in unique way.

We can add one more item to our list, one that will show when the user is pressing the button. Add the following above the previous item as well:

```xml
<item android:state_pressed="true">
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

The only difference with this item is that the state is set to pressed. If we wanted to change the color of our drawable when it’s pressed, we could do it with the `solid` in the last example. Congratulations! You’ve made your first custom drawable.

#### Back to Design

In the top of the rightmost pane, if you click **activity_add_task.xml**, you’ll be taken back to design view. You’ll still notice that we have a few errors in our popup notification at the bottom of the pane. Let’s take care of those, too!

Following the same process as earlier, add a new Android Resource file. This time, however, make sure it’s name is “**select_button_color**” and it’s resource type is set to “**color**“. Click “**Okay**” and you’ll be taken to a new file. Replace that file’s contents with the following:

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_pressed="true"
        android:color="#000000"/>
    <item android:state_checked="true"
          android:color="#000000"/>
    <item android:color="#ff000000"/>
</selector>

```

This is very similar to the drawable we created earlier, except smaller. Given the drawable and what we’ve talked about above, this file shouldn’t need much of an explanation. The main difference is that the items have a color property set on them. This is because the item is a color and will be used anywhere we can use a color in our Android App. You’ll also notice that the colors we specified look different than all of the others. If you’re not familiar with that syntax, don’t worry, it’s called Hexadecimal format and describes the Red, Green and Blue values of the color. You can learn more about that from a quick Google search, if you’re interested.

Let’s go back to design view. We should no longer see our errors and everything should be rendering properly. Given that it renders properly and we have no errors, we can now build our app. If you’re trying to deploy to your phone, you will have to turn on developer options (see below). If you’re not deploying to your phone, you’ll need an emulator (see below as well). Once you have your device or emulator setup, look for the green play button at the top of Android Studio. Press that, and then press Okay. It’ll take some time, but your application will be built and pushed to your device or emulator. It _should_ also automatically open it for you but you may need to look for it in your launcher. Congratulations! You’ve created your first custom view in Android.

#### Developer Options

Developer options allows you to push code and apps to your phone without the app store. This is commonly used to test code before deploying it to millions of actual users and is common part of the development cycle. Sadly, the process of turning Developer Options on varies heavily depending on your phone. Your best bet is Googling for how to turn on developer options for your specific phone. Once you’ve done that and hit play, make sure your phone model is selected in the list. It should also go without saying that your phone needs to be connected to your computer via USB for your app to be pushed to it.

#### Emulators

Emulators provide you with a quick way to test your android app on your own computer and across multiple devices. They’re not as accurate or fun as an actual phone, but unless you’d like to invest thousands of dollars in test devices, they’re a great way to test your code on all the mainstream devices. To setup your first emulator, in the toolbar go to **Tools &gt; Android &gt; AVD Manager**. Then, click Create Virtual Device in the bottom left. Select a phone from the list (I recommend a Nexus) and hit next. Then, download whichever OS you’d like for the phone to run, and then hit next. Name your emulator and hit finish. Now, when you hit play, you’ll see your emulator in the list of available devices. Make sure that’s selected when you try to push your app.

#### Closing

Sure, the app doesn’t do much yet, but it does look pretty — and now you’re more familiar with Android or XML than you were 30 minutes ago! In the next chapter, we’ll talk about storing data on android, using SQLite and Android DB Cursors. These are the tools necessary to make sure the data that the user inputs in this view persists from day to day and that they can actually save their task. Hopefully, after our next session, you’ll get a better idea of the app we’re building, too!
