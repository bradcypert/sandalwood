---
title: "Setting Up Sentry Logging with Scala / Play"
date: 2019-04-16
status: publish
permalink: /setting-up-sentry-logging-with-scala-play
author: "Brad Cypert"
excerpt: ""
type: blog
id: 1256
images:
  - chopped-wood-evening-forest-7557.jpg
category:
  - Scala
tags:
  - logback
  - logging
  - Play
  - Scala
  - sentry
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_primary_category:
  - "61"
_yoast_wpseo_content_score:
  - "90"
_yoast_wpseo_focuskw:
  - "Sentry Scala"
_yoast_wpseo_linkdex:
  - "93"
description:
  - "Adding Sentry to your Scala / Play application is easy and can be accomplished in three small steps."
---



[Sentry](https://sentry.io/welcome/) is an error tracking service that helps you quickly track errors in many environments. While it’s not the only option for error reporting ([Rollbar](https://rollbar.com/) comes to mind since they sponsor most of the podcasts I listen to), Sentry is my favorite option. Today, we’re going to setup Sentry reporting for our Scala / Play application.

<HeadsUp title="Unfamiliar with Play?">
  The [Play framework](https://www.playframework.com/) is a web framework for
  building predictable and scalable applications. Featuring support for Java and
  Scala, the Play framework is a great consideration when choosing your next
  framework.
</HeadsUp>

## Creating an account

First, you’ll need to create a free account on Sentry’s website. They’ll ask you to sign up and create a project, go ahead with those steps. At the end of that process, they’ll show you a DSN ( a client key ). Copy that key as we’ll need it in a few moments.

If you didn’t see the key anywhere, have closed it too fast, or are trying to add support to an existing project, you can find your key by modifying the following link – `https://sentry.io/settings/[project]/projects/api/keys/`. Just change `[project]` to your actual project name.

## Setting up Scala / Play for Sentry

The Play framework has built in support for [Logback logging](https://github.com/qos-ch/logback). Thankfully, Sentry also supports Logback as well! This makes integrating the two extremely easy. We can essentially add support for Sentry with three simple steps:

1. Add the `sentry-logback` dependency to `build.sbt`
2. Modify our `logback.xml` to use the Sentry appender.
3. Expose our DSN (client key) to our application.

## Adding the Sentry dependency to your Scala Project

The simplest step by far. Go ahead and add a new library dependency to your `build.sbt`.

```scala
libraryDependencies +=   "io.sentry" % "sentry-logback" % "1.7.16"
```

And that’s it! Now we can configure our `logback.xml`.

## Configuring logback.xml

We’ve now got two entries that we want to add to our `logback.xml` file. First, we’ll want to add the appender definition like so:

```xml
<appender name="Sentry" class="io.sentry.logback.SentryAppender">
  <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
    <level>ERROR</level>
  </filter>
</appender>
```

I’ve got my Threshold Filter level set to Error, but you can change this meet your needs. Secondly, we’ll want to add the appender reference to the root. In my case, I only want to pass on errors to it.

```xml
  <root level="ERROR">
    <appender-ref ref="Sentry" />
  </root
```

After all is said and done, your `logback.xml` might look like the following:

```xml
<!-- https://www.playframework.com/documentation/latest/SettingsLogger -->
<configuration>

  <conversionRule conversionWord="coloredLevel" converterClass="play.api.libs.logback.ColoredLevel" />

  <appender name="FILE" class="ch.qos.logback.core.FileAppender">
    <file>/var/log/porios.log</file>
    <encoder>
      <pattern>%date [%level] from %logger in %thread - %message%n%xException</pattern>
    </encoder>
  </appender>

  <appender name="Sentry" class="io.sentry.logback.SentryAppender">
    <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
      <level>ERROR</level>
    </filter>
  </appender>

  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <pattern>%coloredLevel %logger{15} - %message%n%xException{10}</pattern>
    </encoder>
  </appender>

  <appender name="ASYNCFILE" class="ch.qos.logback.classic.AsyncAppender">
    <appender-ref ref="FILE" />
  </appender>

  <appender name="ASYNCSTDOUT" class="ch.qos.logback.classic.AsyncAppender">
    <appender-ref ref="STDOUT" />
  </appender>

  <logger name="play" level="INFO" />
  <logger name="application" level="DEBUG" />

  <!-- Off these ones as they are annoying, and anyway we manage configuration ourselves -->
  <logger name="com.avaje.ebean.config.PropertyMapLoader" level="OFF" />
  <logger name="com.avaje.ebeaninternal.server.core.XmlConfigLoader" level="OFF" />
  <logger name="com.avaje.ebeaninternal.server.lib.BackgroundThread" level="OFF" />
  <logger name="com.gargoylesoftware.htmlunit.javascript" level="OFF" />

  <root level="WARN">
    <!--<appender-ref ref="ASYNCFILE" />-->
    <appender-ref ref="ASYNCSTDOUT" />
  </root>

  <root level="ERROR">
    <appender-ref ref="Sentry" />
  </root>

</configuration>
```

## Exposing the DSN to the Application

Finally, we’ll need to expose our DSN to the application. Thankfully, Sentry provides several different ways to do this. The simplest way is to create a `sentry.properties` file on the classpath and add `dsn=https://public:private@host:port/1`, but there are other ways as well.

For production runs, you can add a `-D` property to the Java command to set the DSN. For example `java -Dsentry.dsn=https://public:private@host:port/1 -jar app.jar`

Alternatively, you can expose this by setting an environment variable before running your application: `SENTRY_DSN=https://public:private@host:port/1`.

## Getting Errors

At this point, you should be receiving events and messages in Sentry. If you’re not seeing anything yet, you’ve either missed a step, they’ve changed the setup process, or you don’t have any errors! It’s worth mentioning that without additional configuration (which you can find in the Sentry guides), you’ll only be logging application level errors.

Hopefully you found this brief guide helpful in connecting Sentry with your Scala / Play application! If you want to [learn more about Scala and Play, you can find more of my posts on the subject here!](/tags/scala)
