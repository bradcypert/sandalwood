---
title: "Zero to Hero: Android App - Part 0 - Overview"
date: 2016-09-13
status: publish
permalink: /zero-to-hero-android-app-iteration-0
author: "Brad Cypert"
excerpt: ""
type: blog
id: 36
category:
  - Android
  - Zero-To-Hero
tags:
  - android
  - zero-to-hero
post_format: []
_yoast_wpseo_title:
  - "Zero to Hero - Android App - Part 0 - Overview"
---

I’ve decided to try something new with this post and start a new series called **Zero to Hero**. The concept behind this is simple – From no knowledge about the proposed domain, we’ll create something cool and get you started with the fundamentals of that domain. Zero knowledge isn’t to say I’ll teach you how to build something as if you have never touched a computer, but it’s, for example, an interactive and fun way to learn Android given: You know what an Android phone is, you’re somewhat comfortable with Java, and XML doesn’t give you the heebeegeebees!

The first part of my Zero to Hero series is exactly that. We’re going to build a simple Android app called Turnip – an App for building Habits/ToDos. Turnip will do the following:

1. Allow the user to create a new task with a recurring schedule
2. Allow the user view all of their tasks in a list-like fashion.
3. Allow the user to “check” or delete their tasks.
4. Allow the user to receive a notification to help remind them to complete their task.

Throughout creation of the app, I’ll be providing a brief overview of some of the tools used for Android development and you’ll be given assets for App Icon and other things of that nature.

That means that this tutorial will teach you (at least a little) about:

1. Android Views
2. Recycler Views
3. List Adapters
4. Data Storage on Android
5. Android SQLite Cursors
6. Android Services
7. Android Notifications
8. Gradle and External Dependencies

_Disclaimer: Although we will be building a fully-functioning application, I am not a full-time android developer. The techniques shown here may not be best practice, although they are not necessarily bad, either. The app works, is performant, and easy to maintain. If you have questions about the techniques used, a full-time Android developer may be able to help you find a better way._

#### Iteration 0

Iteration 0 is a term commonly used for the amount of time taken to research or set up for a big project. For our Iteration 0, we’re going to download Android studio, download some android libraries and system images, and set up our phone to run our application. Let’s get started!

**Warning**: The files necessary to get started make take up quite a bit of space. Now is a good time to ensure you have at least 15gb of free space available if you’re not testing your application with a phone and will use an emulator instead.

To start, we want to download Android Studio, a partnered effort by Jetbrains and Google. Jetbrains makes awesome software to help others build software (mainly IDEs) and Google is… well, Google. [You can download the latest build of android studio here](https://developer.android.com/studio/index.html).

Once you have it installed, launch it using your respective operating system. My walkthrough will be for OSX, but that won’t matter much after Iteration 0. Once Android Studio launches, you should see a small window asking you to do one of several things. At the very bottom of that window, find “Configure”. Click that, and then click “SDK Manager” – We’re going to go ahead and install the libraries needed to build our project. Check at least Android 5.0 (Lollipop), Api 21 and hit install. This could take a while.

Why Android 5.0? Although 6.0 is out, and Android N is on the way, a LOT of users still have Lollipop phones. Lollipop gives us material design and a relatively great API to code against, so we’ll use it.

Next, click the tab that says SDK Tools and install the following:

- Android SDK Build Tools
- Android SDK Platform Tools
- Android SDK Tools
- Android Support Library
- Documentation for Android SDK
- Google Play Services
- Google Repository
- Intel x86 Emulator Accelerator (Only needed if using an emulator).

Finally, hit “Okay”. We’ve now set up everything needed to get started. In my next post, I’ll cover starting a new project, fragments vs activities, views, and intents.
