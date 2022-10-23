---
title: "Simple NPM Wrapper using NVM"
date: 2018-06-07
status: publish
permalink: /simple-npm-wrapper-using-nvm
author: "Brad Cypert"
type: blog
id: 554
category:
  - "Developer Tools"
  - Node
tags:
  - "Developer Tools"
  - DevOps
  - node
description:
  - "Learn to build a simple NPM wrapper for your node projects so that your team can easily stay on the same version of NodeJS."
---

The NPM team has always done a pretty good job of not requiring a specific version of NPM to execute most of it’s commands properly. However, with the recent addition of the package-lock file (and the recent tinkering of the package-lock file across some of the more recent releases of NPM), it’s starting to become a bit of a pain to manage. I work with developers using a gamut of NPM versions from 5.1.1 to 6.0.1. These may sound like minor version changes but since 5.6.0, most of the changes have included changes to the package-lock file. More importantly, this generates a lot of a noise in PRs (we check to ensure that package-lock changes are actually warranted as we’ve had child dependencies break on us in the past) and that causes confusion and takes time to sift through.

My solution for this was to write a simple NPM wrapper that can be placed alongside your package.json. The wrapper uses [NVM (The Node Version Manager)](https://github.com/creationix/nvm) under the hood and takes care of installing it for you if needed. I’ll caveat this with the following: I’m not a bash expert and this was hastily thrown together. I think a tool like this may be valuable to (or inspire) another team or developer so I figured I’d share it here.

```bash
#!/usr/bin/env bash

# Export these paths once so we can check if NVM exists.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion


if ! hash nvm 2>/dev/null; then
  echo 'Warning: NVM is not installed' >&2
  echo 'Installing NVM...'
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
fi

# Export again in case we had to install. Sometimes NVM doesnt do a good job manually exporting quick enough.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion


version=$(grep -Eo '"npmw-node":.*?[^\\]",' package.json | cut -d: -f2- | tr -dc '[.][:alnum:]')
nvm install ${version}
nvm use ${version}


echo "executing npm $@"
npm "$@"

```

## Adding to the package.json

This code expects you to have a property in your package.json called `"npmw-node"` which has a value of the version of node you’d like to use. For example, something like this:

```json
{
  "name": "my-project",
  "preferGlobal": true,
  "version": "0.0.1",
  "npmw-node": "8.4.0",
  "author": "Brad Cypert <brad.cypert@gmail.com>",
  "description": "Something awesome",
  "license": "MIT",
  "scripts": {
    "start": "node ./app.js"
  },
  "dependencies": {
    "express": "~3.4.7"
  }
}
```

Anyways, that’s about it. You can call this `npmw` or something similar and drop it in your project folder. Then, instead of using `npm install` you can use `npmw install`. This will ensure that you’re all using the same package-lock generation techniques and help avoid unnecessary changes to the package-lock file due to formatting changes with NPM. This also gives you a centralized way to manage node versions across multiple machines, and since it uses NVM, should you want to try out a new node version (or need an old one for a legacy product), you can just leverage NVM to swap versions or try out new ones!
