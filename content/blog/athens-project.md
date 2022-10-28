---
title: "Go's Athens Project"
date: 2019-08-26
status: publish
permalink: /athens-project
author: "Brad Cypert"
excerpt: ""
type: blog
id: 1813
images:
  - /athens-e1566846297678.png
category:
  - Go
tags:
  - athens-project
  - go
  - modules
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_primary_category:
  - "209"
_yoast_wpseo_content_score:
  - "90"
_yoast_wpseo_focuskw:
  - "athens project"
_yoast_wpseo_title:
  - "Better dependency management via %%title%% %%page%% %%sep%% %%sitename%%"
description:
  - "The Athens Project is a module proxy for Go that supports most major version control systems. Its currently in beta, but is growing fast."
_yoast_wpseo_linkdex:
  - "78"
---

I recently got back from Gophercon in San Diego and am still excited about the talk on the Athens Project. For those unaware, the Athens Project is a module proxy for Go! It’s currently in beta, but showing a ton of promise already.

Go’s dependency management has changed a lot over the past few years. For simplicity, Go allowed you to simply specify your dependencies in your code as an import. `go get` would then get all the dependencies that your application needed. This worked, for a while, but as dependency versions began to churn, we began to see issues with this pattern — especially due to the fact that Go really wants you to follow [SemVer](https://semver.org/), but not all developers were.

[With Go 1.11, we finally got access to modules](https://github.com/golang/go/wiki/Modules) (but they’re still experimental). [Go modules allow us to specify our dependencies in a ](https://github.com/golang/go/wiki/Modules#gomod)`<a href="https://github.com/golang/go/wiki/Modules#gomod">go.mod</a>`[ file](https://github.com/golang/go/wiki/Modules#gomod), similar to a [Maven file](https://maven.apache.org/pom.html#What_is_the_POM) or `<a href="https://docs.npmjs.com/files/package.json">package.json</a>` in the frontend world. The benefit of the mod file is two-fold. We have an actual package management solution that now ships with Go (as opposed to third-party tools), and we can now easily specify our dependencies and **their expected versions** via our `.mod` file.

## Enter The Athens Project

Now, we have a new tool that fits into our Go stack — Athens. Athens is a proxy for Go modules, similar to a tool like Artifactory. Athens is open-source and there is a public proxy available, however, you can run your own Athens server, too. This is great if you have private packages behind a firewall or if you want to keep a local module cache on your machine.

Athens seems like the next logical step towards maintainable Go dependencies. The module cache allows us to maintain specific versions, even if the hosted repo removes the commit or tag, for example.

Athens is a project that I’m excited to see grow and hopefully, you are too! If you’re interested in contributing to Athens, their [Github repo can be found here](https://github.com/gomods/athens#contributing). Alternatively, if you just want to use Athens,[ you can find their documentation here](https://docs.gomods.io/). Lastly, if you want to find more of [my posts on Golang, you can do so here](/tags/go/). Thanks!
