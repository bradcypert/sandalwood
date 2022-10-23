---
title: "A Quick Script to Update All of Your NPM Dependencies"
date: 2018-03-21
status: publish
permalink: /a-quick-script-to-update-all-of-your-npm-dependencies
author: "Brad Cypert"
description: "Nothing crazy here, I've just found myself chaining together pipes for something that I feel should ship with NPM. You can use this script to update all of your outdated dependencies to the latest. This is something you'll want to do cautiously, definitely don't run this and commit it without testing. However, if you have a pretty solid test suite, you can integrate something like this into your CI pipeline and fix forward should you find any issues."
type: blog
id: 280
category:
  - DevOps
  - javascript
tags:
  - javascript
  - npm
  - package.json
---

Nothing crazy here, I’ve just found myself chaining together pipes for something that I feel should ship with NPM. You can use this script to update all of your outdated dependencies to the latest. This is something you’ll want to do cautiously, definitely don’t run this and commit it without testing. However, if you have a pretty solid test suite, you can integrate something like this into your CI pipeline and fix forward should you find any issues. Anyways, without further ado, here’s the script.

```bash
rm -rf node_modules/; rm -f package-lock.json;  npm outdated | sed 1,1d | awk '{ print $1 }' | xargs npm update
```

For best results, I recommend throwing this in your package.json as a script. Perhaps “deps-update” or something similar. Are there any other scripts you can recommend for routine `package.json` maintenance?
