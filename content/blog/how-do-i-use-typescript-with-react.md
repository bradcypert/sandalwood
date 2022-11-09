---
title: "How do I use TypeScript with React?"
date: 2020-01-11
status: publish
permalink: /how-do-i-use-typescript-with-react
author: "Brad Cypert"
excerpt: ""
type: blog
id: 2271
images:
  - react-typescript-1.png
category:
  - React
tags:
  - react
  - typescript
description: "Using typescript with react is easy! In this post, I'll show you how."
---

[React](https://reactjs.org/) is allowing developers to iterate faster and build safer, more reliable frontend applications than we were building many years ago. [TypeScript](https://www.typescriptlang.org/), a relatively new addition to the “JavaScript Alternatives” scene, also aims to add a new level of safety in the form of type safety. Naturally, it makes sense for us to want to use TypeScript to write React components.

But how do you do that? There are two different ways.

## Using the –typescript flag with create-react-app

If you’re starting a new React project, the easiest way to enable typescript is via a flag to [create-react-app](https://github.com/facebook/create-react-app) when starting your new react project. If you’re not starting your react project with create-react-app ([you probably should](https://reactjs.org/docs/create-a-new-react-app.html#recommended-toolchains)!) then this section won’t apply to you.

`create-react-app` ships with a number of flags that can be listed by running `create-react-app --help` in your terminal. The one we want to use is the `--typescript` flag, and we can use it like so:

```bash
create-react-app frontend --typescript
```

This creates a new React app in our current directory named “frontend” and initializes it with typescript support. You can now open this in your editor and where you would see `.js` files, you’ll now see `.ts` files. Your build pipeline is already configured, so you’re good to start coding right away!

## Without create-react-app

It gets more difficult to give concrete advice at this point, but you’ll essentially need to compile from typescript to javascript and plug that into the rest of your build chain. For [webpack](https://webpack.js.org/), this is as simple as adding a new loader (like [awesome-typescript-loader](https://www.npmjs.com/package/awesome-typescript-loader/v/3.0.3)) to your webpack config and changing our source files to be TypeScript files instead of JavaScript. In fact, an even better idea is to install `create-react-app`, run the above command, and immediately `npm run eject`. This will eject a webpack config already configured for use with TypeScript. Then you can copy the relevant pieces into your own config.
