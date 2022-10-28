---
title: "Building a CI/CD Pipeline for Dart Packages with Github Actions"
date: 2020-10-05
status: publish
permalink: /dart-packages-with-github-actions
author: "Brad Cypert"
excerpt: ""
type: blog
id: 3596
images:
  - /GitHub_Logo.png
category:
  - dart
tags:
  - dart
  - DevOps
  - github-actions
post_format: []
wp_last_modified_info:
  - "October 5, 2020 @ 1:14 am"
wplmi_shortcode:
  - "[lmt-post-modified-info]"
hefo_before:
  - "0"
hefo_after:
  - "0"
saswp_custom_schema_field:
  - ""
saswp_webpage_speakable_3050:
  - "0"
saswp_modify_this_schema_3049:
  - "0"
saswp_blogposting_speakable_3049:
  - "0"
_yoast_wpseo_content_score:
  - "90"
_yoast_wpseo_primary_category:
  - "450"
_yoast_wpseo_focuskw:
  - "Dart github actions"
_yoast_wpseo_title:
  - "%%title%% %%page%%"
description:
  - "Through the use of Github actions, you can set up a continuous integration and continuous deployment pipeline for Dart packages."
_yoast_wpseo_linkdex:
  - "75"
---

If you look back at any of my blog posts, you’ll likely find an introduction like “Recently I was exploring…” This time is no different. I’ve been exploring [Dart](https://dart.dev/) (and have dreams of a frontend framework written in Dart) as well as [Github Actions](https://github.com/features/actions). At work, we recently migrated [TeamSnap UI](https://github.com/teamsnap/teamsnap-ui) (our open source component library) from our internal CI pipeline to use Github actions and it’s worked out really well. I’ve been writing [Essence](https://github.com/bradcypert/essence) (a Dart [virtual DOM](https://bitsofco.de/understanding-the-virtual-dom/) implementation) and decided that for this project, I’d try to use GitHub actions for continuous integration and continuous deployments.

## A Quick Look at Dart Tooling

If you’re looking to integrate your project with continuous integration or continuous deployments, one of the first things that you’ll want to do is identify what tools are available to you. These tools can range from code analysis tools, test runners, linters, or even code formatters. In the case of Dart, we have an analyzer, compiler, formatter, test command and a few more. You can see these options when running the `dart` command in your terminal:

```bash
$ dart
A command-line utility for Dart development...
#truncated for brevity
Available commands:
  analyze Analyze the project's Dart code.
  compile Compile Dart to various formats.
  create Create a new project.
  format Idiomatically formats Dart source code.
  migrate Perform a null safety migration on a project or package.
  pub Work with packages.
  run Run a Dart program.
  test Runs tests in this project.
  Run "dart help " for more information about a command.
```

So with my Dart package, Essence, I wanted to set up a continuous integration pipeline that ran tests on each pull request and push to master. Additionally, I wanted to set up a continuous deployment pipeline so that pushing a tag to Github would trigger a publication on pub.dev (dart’s package registry).

## Continuous Integration with Dart and Github Actions

Setting up the CI Pipeline was, without a doubt, the easiest of the two pipelines. I was able to simply create a new file in the project root that lives at the following path: `.github/workflows/dart.yml`. This is a [yaml file](https://yaml.org/) that contains the information needed by Github to define the workflow (or pipeline).

```yml
#give the pipeline a name
name: Dart CI

#set conditions to trigger on
on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

# define what happens when conditions are met
jobs:
  build:
    # use ubuntu's latest OS
    runs-on: ubuntu-latest
    # use the google/dart container (this makes `dart` available to use)
    container:
      image: google/dart:latest

    # checkout the code, run pub get and finally run tests
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: pub get
      - name: Run tests
        run: pub run test
```

This will run a new CI pipeline on every push and pull request to master. This helps me ensure that the changes into my codebase pass tests and build successfully.

## Continuous Deployment to pub.dev with Github Actions

Once we’ve successfully been able to validate and push code to master, we’ll eventually want to ship it. In this case of my Dart package, I want to publish to [pub.dev](https://pub.dev) (dart’s package registry). I did a bit of research first and found that there was an [existing Github action](https://github.com/marketplace/actions/dart-and-flutter-package-publisher) specifically for publishing to Dart’s package registry and was able to implement that action as a part of my own workflow.

In this case, I created another workflow at the path `.github/workflows/pub_deploy.yml` . This workflow is slightly different, as I was able to use a prebuilt action, but I did have to supply [secret keys](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets) to it. Here’s the yaml:

```yml
# Deploy to pub.dev

name: Pub Deploy

# Controls when the action will run. In this case, all tags that start with a v
on:
  push:
    tags:
      - v**

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2

      - name: Run a one-line script
        uses: k-paxian/dart-package-publisher@v1.2
        with:
          accessToken: ${{ secrets.PUB_ACCESS_TOKEN }}
          refreshToken: ${{ secrets.PUB_REFRESH_TOKEN}}
```

Next, we’ll have to define our secrets in Github. First, we’ll pull the values from our `~/.pub_cache/credentials.json`. The two keys you want are `accessToken` and `refreshToken`. You will need to set up pub.dev publishing locally to get these keys.

Now, we can go to our Github repo, click on “Settings” and then click “Secrets” on the left, You’ll want to add those keys as secrets to your project.

Finally, when we push tags, our workflow will leverage the k-paxian’s github action to publish our changes to pub.dev.

Note: The `v**` format was intentionally used in an effort to support the Dart versioning standards of Major.Minor.Patch+Build. This allows us to tag our code like so: `git tag v0.0.1+4`. Pushing those tags via `git push --tags` triggers the action and ultimately ends up publishing our code to pub.dev!
