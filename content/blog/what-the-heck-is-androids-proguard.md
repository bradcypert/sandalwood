---
title: "What the heck is Android's Proguard?"
date: 2018-02-21
status: publish
permalink: /what-the-heck-is-androids-proguard
author: "Brad Cypert"
excerpt: "Hello there Android developer or curious onlooker. Welcome back to another blog post talking about your favorite, my favorite, and the world's favorite mobile operating system. Today we're going to talk about Proguard and what that means for Android Developers."
type: blog
id: 211
category:
  - Android
  - Java
tags:
  - android
  - java
  - proguard
post_format: []
_yoast_wpseo_title:
  - "What the heck is Android's Proguard?"
---

Hello there Android developer or curious onlooker. Welcome back to another blog post talking about your favorite, my favorite, and [the world’s favorite mobile operating system](https://www.statista.com/statistics/266136/global-market-share-held-by-smartphone-operating-systems/). Today we’re going to talk about Proguard and what that means for Android Developers.

Proguard is a free tool that has recently became pretty mainstream in the Android ecosystem. In fact, you’ve probably seen it’s name mentioned a few times in Android Studio (provided you’re using Android Studio), but what does it do? Proguard helps developers by shrinking, optimizing, obfuscating, and preverifying your Java class files. It’ll take care of some helpful tidbits like removing unused classes, methods, fields and attributes as well as unused instructions (Dead Code). Additionally, it takes care of optimizing your bytecode for you and renaming your classes, fields, and methods to extremely short and meaningless names. The two main purposes of Proguard are to make your Android application more performant and make it more difficult to reverse engineer.

#### Reverse Engineering an Android Application

I’ve reverse engineered an Android app before. I wasn’t difficult and honestly, it helped me learn a lot. In fact I’ll play devil’s advocate for a moment and say that reverse engineering applications can be extremely educational — however, most of these Android developers (yourself included) have spent a lot of time, effort and money into making these apps. They don’t to produce the latest and greatest TODO list, only to have it reverse engineered and cloned within hours. Google has gotten better about preventing this over the years, but if anyone can get their hands on an APK, they can use a tool like [Dex2Jar](https://github.com/pxb1988/dex2jar) against an unzipped APK and have an executable JAR file from it. From there, it’s only a matter of leveraging a tool like [this Java Decompiler](http://jd.benow.ca/) to view the source files for this jar.

However, running your app through Proguard before deploying it will lead to a different result should someone decompile it. In fact, it’ll be frustratingly hard to follow with misshaped class, method, and field names.

<script async="" src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>{" "}

<ins
  class="adsbygoogle"
  data-ad-client="ca-pub-8945603214034079"
  data-ad-format="fluid"
  data-ad-layout="in-article"
  data-ad-slot="2376037128"
  style="display: block; text-align: center;"
></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

#### Enabling Proguard in Android Studio

Enabling Proguard in Android Studio isn’t difficult at all. In fact, considering that Android Studio ships with Proguard, all you need to do is add `minifyEnabled=true` to your build.gradle and Proguard will run automatically on release builds. The next time your gradle file is ran (whether building or other), Android studio should create a `proguard-rules.pro` file in your root project directory. This file can be used to customize Proguard to fit your needs.
