---
title: "Modifying incoming requests via Charles Proxy"
date: 2018-03-08
status: publish
permalink: /modifying-incoming-requests-via-charles-proxy
author: "Brad Cypert"
excerpt: ""
type: blog
id: 250
images:
  - /Screen-Shot-2018-03-08-at-10.51.47-AM-e1520524383391.png
category:
  - "Developer Tools"
tags:
  - Charles
  - "Developer Tools"
post_format: []
description: "Charlex proxy allows you to listen to incoming requests, capture those, and modify them before letting them continue. This is extremely helpful with testing and QA, and heres how I use it."
---

Charles Proxy is an outstanding development tool that I’ve recently started to fall in love with. I think the most practical use of this tool is probably using the rewrite tool to rewrite outgoing or incoming requests, however, I’m going to talk to you about setting up request breakpoints. Breakpoints allow you to halt an incoming or outgoing requests, possibly modify it, and send it whenever you’re content with it. It’s a fantastic tool for simulating edge-cases like making an http request to a server that wraps and returns the response of a request that it makes.

### Installing Charles Proxy

Charles proxy is a paid tool. There’s a lot of hard work that goes into it and the license is not that expensive. However, there is a free trial version of Charles that works great for quick testing. You [can download the free trial version here](https://www.charlesproxy.com/). Once you’ve downloaded it, install it via whatever standard installer your operating system has and boot that proxy up! You’ll be presented with something like this:

![Charles
  Proxy](/Screen-Shot-2018-03-08-at-10.19.09-AM-e1520522726804-300x220.png)
There’s quite a bit going on here. By default, Charles is listening to all incoming
and outgoing requests and organizing them into “folders” based off their respective
hosts. There’s also buttons at the top for emptying out the requests that we’ve recorded,
toggling recording, toggling throttling, toggling breakpoints and more.

From here, you’ll want to open the Charle’s menu and click on Proxy.

![Charles Menu, Click
  Proxy](/Screen-Shot-2018-03-08-at-10.22.23-AM.png)
From there, you’ll want to click breakpoint settings:

![Charles Proxy Menu, Click Breakpoint Settings](/Screen-Shot-2018-03-08-at-10.22.41-AM.png)

You’ll notice that you can quickly toggle breakpoint settings by the shortcut: **SHIFT+CMD+K.**

The breakpoint view will look like this:

![Charles Proxy Breakpoint View](/Screen-Shot-2018-03-08-at-10.29.55-AM.png)
From here, you’ll want to click **“Add”**. You’ll want to fill out the form with all the necessary data for the request you’d like to break on. We’ll fill it out like so:

![](/Screen-Shot-2018-03-08-at-10.33.03-AM.png)

Now, when we make a **GET** request to _http://localhost:8080/todos,_ we’ll hit our breakpoint and Charles will allow us to inspect and modify the response from our server. By ticking the Request checkbox above, you’re able to inspect and modify the outgoing request as well. When you hit this breakpoint, the proxy will hold the request until you abort or execute it, so be sure to press the **Abort** or **Execute** buttons after inspecting and or modifying the request.

### What about HTTPS?

If you’re trying this with HTTPS, you’ll probably notice that inspecting your request can lead to a bunch of jumbled (see also: encoded) characters in the response body. Thankfully, Charles finds a way. To enable HTTPS debugging, you can go to the **Charles Menu**, like we did above, and click on **Proxy**, followed by **Proxy Settings**. Then, fill out the form so it looks like this:

![Charles Proxy SSL Debugging](/Screen-Shot-2018-03-08-at-10.39.59-AM.png)Charles Proxy SSL Debugging
Finally, you’ll need to add support for the domain that you’re looking to debug. You can do that by clicking the **Charles Proxy Menu,** then **SSL Proxy Settings**, followed by **SSL Proxying.**
![Charles SSL Proxy Settings](/Screen-Shot-2018-03-08-at-10.45.15-AM.png)Charles SSL Proxy Settings
You’ll want to click **Add**, and fill out the form appropriately. This should be enough to debug HTTPS requests in most cases, but its possible that you’ll need to provide the client and or root certificates. You can do that using the tabs above. Once you’ve done this, ensure that debugging is still enabled and then refresh your browser to try to trigger the request again!
