---
title: "What Is Gradle Scan?"
date: 2019-04-17
status: publish
permalink: /what-is-gradle-scan
author: "Brad Cypert"
type: blog
id: 760
thumbnail: /eco-ecology-environment-5808.jpg
category:
  - DevOps
tags:
  - DevOps
  - gradle
description:
  - "A Gradle scan is a build scan that provides insights into how your build ran and why it did what it did. Scans are shareable and configurable."
---



A Gradle scan is a build scan that provides insights into how your build ran and why it did what it did. Once you’ve generated a scan, you can share that with other members of your team (or anyone who may help diagnose issues) via a URL. [Here’s a sample scan](https://gradle.com/s/czajmbyg73t62)!

<HeadsUp title="Heads Up!">
  Scans are supported with Gradle 4.3+ out of the box. Most new projects are
  going to be using this, but you may need to update OR install the [Gradle Scan
  plugin](https://guides.gradle.org/creating-build-scans/#enable_build_scans_on_all_builds_of_your_project)
  in your existing project.
</HeadsUp>

## Creating a Gradle Scan

Creating a Gradle scan is extremely easy! In your existing gradle project simply run `./gradlew build --scan` or `gradle build --scan` if you’re not using the gradle wrapper.

You’ll be prompted to accept the Gradle Cloud Services license agreement. To proceed, you’ll need to accept the agreement, but as always, you should read through and evaluate if you should accept the agreement.

Ultimately, if you accept, you should see something like `https://gradle.com/s/czajmbyg73t62` printed to the console at the end of the command. That link is your Gradle scan — [Open it in a browser](https://gradle.com/s/czajmbyg73t62)!

## Grokking the Gradle Scan

There’s a lot of information presented in an unconfigured scan, and parsing it can be confusing. Thankfully, Gradle has broken the scan down into relevant chunks of information, such as [Plugins](https://scans.gradle.com/s/czajmbyg73t62/plugins), [Switches](https://scans.gradle.com/s/czajmbyg73t62/switches), or the [Timeline](https://scans.gradle.com/s/czajmbyg73t62/timeline).

Plugins merely shows what plugins are enabled in this gradle build, while switches does the same — but for switches.

The timeline, however, shows the stages of your build over time. This is extremely helpful for profiling your build and figuring out what exactly is taking so long. While the build I shared above is quite simply, you’ll likely find that in your application, the timeline will be full of information, especially the more complicated your build is.

## Configuring the Scan

Perhaps one of the nicest features, is the ability to provide additional information from the environment in your scan. For example: you may want to publish a scan and tie it to a commit hash, or a git tag. You can do that simply by specifying additional configuration options in the scan’s task.

```gradle
buildScan {
    background {
        def commitId = 'git rev-parse --verify HEAD'.execute().text.trim()
        value "Git Commit ID", commitId
    }
}
```

It’s worth mentioning that, as an effort to avoid slowing builds down with this operation, this is ran on a background thread (as illustrated by the “background” block in that configuration). Ideally, any additional information should now impact the build — It wouldn’t be as useful of a tool if it did!

<HeadsUp title="A Note for Gradle Enterprise Users">
  Gradle Scans are pushed to public servers by default. If you pay for Gradle
  enterprise,[you can configure them so that they hit your enterprise server
  instead](https://docs.gradle.com/build-scan-plugin/?_ga=2.101945985.1677862482.1555510221-996774626.1548092762#set_the_location_of_your_gradle_enterprise_instance)
  and require enterprise authentication.
</HeadsUp>

Hopefully you found this post on Gradle scans helpful! If you’d like to learn
more about Gradle,[ you can find my posts on the subject
here](/tags/gradle) or the [official docs
here](https://docs.gradle.org/current/userguide/userguide.html)!
