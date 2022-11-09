---
title: "My Project Umbrella"
date: 2020-10-22
status: publish
permalink: /my-project-umbrella
author: "Brad Cypert"
excerpt: ""
type: blog
id: 3605
images:
  - pexels-engin-akyurt-1451040.jpg
category:
  - Business
tags:
  - developer-happiness
  - project-structure
  - "side projects"
description: "When I build an 'App', there are three other projects that roll up into that 'app' -- An API, a web app, and a marketing site. Here's how I make those all fit together."
---

I was talking with a friend the other day about Flutter for Web’s SEO, which… is not very good. He asked if I was concerned about search engines not being able to find my app to which I said “No.” My Flutter app is behind a login, so Google wouldn’t be able to index anything behind the login anyways, but that’s not why I’m not concerned. I still want people to find my app, but I handle how they find the app in a way that separates several different concerns. I call it my “Project Umbrella”.

When I build an “App”, there are three other projects that roll up into that “App” (I also refer to this as the Brand). For example, [Bluejay.app](https://www.bluejay.app) consists of three pieces — A web server, a client side application, and a marketing site. These three subprojects make up my standard project (or Brand) at this point.

With Bluejay, I don’t want search engines to index my API (why would I?) and my client side application contains data specific to whoever is logged in (also something that I don’t want indexed for privacy reasons). However, I do want people to stumble upon the project, the project’s blog posts, and similar pages.

The tech side of this is extremely simple (at a high level). I have a web server written in [Go](https://golang.org/). I have a client side application written in [React](https://reactjs.org/). I have a marketing site built with [Gatsby](https://www.gatsbyjs.com/). This separation of concerns means a lot to me (and ideally my users). It means that my marketing materials don’t get shipped alongside my app (you don’t need to download my marketing images and content if you just want to use the app). Additionally, since the client apps and backend servers are separated, I’m not spending CPU cycles on serving static assets or stitching together web pages with some templating library.

My Go server only responds to [GraphQL](https://graphql.org/) and will only render GraphQL JSON responses. My client side app is served via [Netlify](https://www.netlify.com/) and their CDN, which helps me get insanely fast load times. In this project, the marketing site is a static website that is also served via Netlify for the same reason.

The [Flutter](https://flutter.dev/) app that started this conversation follows the same pattern, although the tech is slightly different. On the web server side, I’m currently using [Firebase](https://firebase.google.com/) for storage, firestore, and functions. On the client side, I build out an extremely not-SEO-friendly Flutter web app, and an iOS and Android app. To keep everything close, I chose to use Firebase to deploy the Flutter web app, although Netlify would work here too. Finally, the marketing site is [WordPress](https://wordpress.com/), although it could be Gatsby, plain HTML, or whatever.

Separating my concerns out like this makes it extremely easy to overhaul one
piece of the Brand/Project without drastically effecting the other pieces. For
example, if I want to swap React for [Vue](https://vuejs.org/), I only have to
do that on the client-side project. More interestingly, if I swap React for
[ClojureScript](https://clojurescript.org/), I only have to do that in the
client side project, and I don’t have to modify any additional build pipelines
(or find a way to make my web server compile Clojure to JavaScript on the fly).

## Accessing the Subprojects

The golden standard that I follow that allows this work is actually fairly straightforward. My projects are linked and communicate with their partner projects by three things: [DNS Entries](https://www.presslabs.com/how-to/dns-records/), [HyperLinks](https://en.wikipedia.org/wiki/Hyperlink), and [JSON](https://www.json.org/json-en.html) as the communication standard.

Generally, I follow the idea that my marketing site should live at “www.xyz.com”, my app should live at “app.xyz.com” and my server-side API lives at “api.xyz.com”. There are some exceptions to this, however. Notably, if I end up buying a `.app` domain instead of a `.com` domain, “app.xyz.app” feels weird. Bluejay and Luna Journal are both good examples of this. Here’s how I structure their DNS records:

- Bluejay:
  - marketing lives at [www.bluejay.app](http://www.bluejay.app)
  - The server-side API lives at [api.bluejay.app](http://api.bluejay.app)
  - The client side application lives at [write.bluejay.app](http://write.bluejay.app)
    - I chose “write” specifically because Bluejay is a tool for writers
- Luna Journal
  - Marketing site lives at [www.lunajournal.app](http://www.lunajournal.app)
  - The API is handled by Firebase and I do not have to manage DNS records for it
  - The client side (web) application lives at [my.lunajournal.app](http://my.lunajournal.app)
    - I chose “my” specifically because Luna Journal helps you manage **your** pet’s information.
  - The mobile apps are available via the App Store.

## Why?

I understand that there are dozens (hundreds, maybe?) of other ways to effectively build Web/Mobile apps and the services that support them. I’ve found that this pattern works best for me, as it helps me build apps that support my values and beliefs.

Namely, I believe that I should be able to separate my client side from the web server for scalability and decoupling reasons. I also believe that your client-side experience should be fast. Marketing sites are full of images and images drastically increase the size of a webpage. Finally, I believe that I shouldn’t be the reason you hit your mobile phone’s data cap. Building my applications in this way helps me ensure that I code against my values and ensure that, as a user, you get a fast, considerate experience that scales well under pressure.
