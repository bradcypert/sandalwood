---
title: "5 Things You Should Know Before Deploying Your Ionic App"
date: 2015-02-23
status: publish
permalink: /5-things-you-should-know-before-deploying-your-ionic-app
author: "Brad Cypert"
excerpt: ""
type: blog
id: 16
category:
  - Ionic
  - javascript
tags:
  - ionic
  - mobile
description: "Before you deploy your ionic app, these are five things you need to know."
---

I’ve been out of the mobile app world for almost two years now, and it certainly has had some interesting advances, but the thing that drew me back in – Ionic.

Ionic is an extremely powerful “hybrid” (air quotes around hybrid because it’s certainly not obvious) mobile app SDK. It recently hit version 1.0-BETA but don’t let that scare you. Hundreds of Ionic apps have been created and thousands more are in development even as we speak. What makes Ionic beautiful? I’m able to write my entire app using a framework that I know and am extremely comfortable with – AngularJS.

Here’s my only hiccup – although I’ve produced several mobile apps (iOS & Android both), this is my first hybrid app. There are a few things you really need to know.

1. The Ionic CLI can’t do it all.

---

The Ionic CLI, as wonderful as it is can’t do a few things. It can’t generate a new keystore to sign your app. It can’t sign your app with that keystore nor can It deploy your app for you. If you’re expecting it to do everything, you’re fighting a losing battle. However, what it does for you immensely speeds up development time.

If you’re at the point where you need to generate a keystore, sign your app, or whatever – check out [<mark>Ionic’s guide to publishing your app</mark>](http://ionicframework.com/docs/guide/publishing.html).

2. Change Your AppID.

---

Seriously. Do it. Right now, don’t wait or you’ll forget. Nothing is as awkward as deploying a new app and seeing **com.ionicframework.myappXXXXXX** as your AppId. My first app was deployed with this ID and after having users already purchase the app, I decided to just roll with it. It doesn’t hurt anything but it’s still awkard.

3. Leverage Ionic’s Resources.

---

This should be obvious, but there were several times I found myself trying to create an object that looked like something you’ll find on a phone. Ionic has done it for you, so use theirs! It’s easy to forget when you’re just writing CSS and HTML, but I strongly recommend browsing their docs. Anything you’d want to use, you’ll find in there plus they conform to their platform’s native looks!


4. Concat/Minify

---

You’re working with web code, so treat it like you would any production ready website. By taking the time to concat and minify your code, you’re helping optimize performance, reduce load time, and speed up your app overall. You can handle this with Gulp.js and the Gulp file included in your starter project. Keep in mind, if you minify, you need to lint! It’s possible your app may not work after minifying. Need a good package to help with minifying? Check out [<mark>Uglify</mark>](https://www.npmjs.com/package/gulp-uglifyjs).

5. Use Local Storage.

---

Holy Toledo, this was by far my favorite part of working on my Ionic app. All the data is stored in local storage, requiring absolutely no backend (just Angular frontend), and works pretty seemlessly with Ionic. The only catch I’ve found to this is sometimes I started to respect it like a database, and it began to cause problems updating objects on the scope of Angular templates. Regardless, Local Storage has saved me tons of dev time and helped me avoid costly mongo database services.

## Final Word.

I’ve got ideas for another app, and there’s plenty of features left to go on Munch (the app this post is about). I’m certainly going to continue exploring and using Ionic in the future and I think you should too!

If you haven’t checked out Munch! yet, <mark>[_you can find it on the Android app store here_](https://play.google.com/store/apps/details?id=com.ionicframework.myapp259284)</mark> and on the iOS store in the near future.
