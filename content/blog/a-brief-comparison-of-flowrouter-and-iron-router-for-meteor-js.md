---
title: "A Brief Comparison of FlowRouter and Iron:Router for Meteor.js"
date: 2015-09-11
status: publish
permalink: /a-brief-comparison-of-flowrouter-and-iron-router-for-meteor-js
author: "Brad Cypert"
excerpt: ""
type: blog
id: 18
category:
  - javascript
tags:
  - flowrouter
  - "iron:router"
  - javascript
  - meteor
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_title:
  - "A Brief Comparison of FlowRouter and Iron:Router for Meteor.js"
---

Recently, I was updating an open source package that I maintain – [a project structure scaffolding tool](http://www.github.com/bradcypert/ignite). While updating the template I use for my Meteor apps, I realized my tool was still catering towards Iron:Router. For those unaware, Iron:Router has a history of being **the** Router for Meteor apps. When I first used it, however, it felt like it was lacking in some ways. After using it on about several Meteor apps now, I’ve adjusted my design to conform to Iron:Router and it works extremely well, but recently [KadiraHQ](http://www.kadira.io) created their own Router – FlowRouter – and oh, is it nice.

#### A New Challenger Approaches

The key thing to take away about FlowRouter is that it’s minimal. Iron:Router tries to heavily integrate into your app and hook into routing, subscriptions, rendering, and more. FlowRouter focuses solely on routing and keeping your UI performant.

That being said, each offer different benefits, and after using FlowRouter in two different Meteor apps, I think it’s safe to say that each router is situational. Let’s compare the two more in-depth.

#### Routing

Both, Iron:Router and FlowRouter offer routing (wouldn’t it be misleading if they didn’t?). The most important thing to note about each is the following: FlowRouter is client-side. Iron:Router is server and client. It’s important to note that FlowRouter is eventually adding Server-Side routes, too.

Additionally, FlowRouter feels more modern as it offers exceptional support for nesting routes, while Iron:Router… not so much.

For example – Nested Routes in each.  
**FlowRouter**

```javascript
var adminGroup = FlowRouter.group({
    prefix: '/admin'
    name 'admin'
  });

  //localhost:1234/admin/
  adminGroup.route('/',{
    //do something
  });

  //localhost:1234/admin/posts
  adminGroup.route('/posts/',{
    //do something
  });

```

Doing the same thing in Iron:Router yields the following:

```javascript
Router.route("/api");
Router.route("/api/posts/");
```

#### Rendering

This was my biggest selling point on FlowRouter – It’s render agnostic! Blaze, Meteor’s de facto rendering library, is great. Indeed, you’re able to use Blaze with both, Iron:Router and FlowRouter, but if you want to switch from Blaze to Ember or React, you better be on FlowRouter. That’s not to say you can’t make the switch with Iron:Router, but it assumes you’re going to be using Blaze, so you’re going to have quite a bit of extra work to render non-Blaze views.

Using React with FlowRouter is as simple as the following (Implies you’ve generated a React component named “Post”):

```javascript
FlowRouter.route("/post/:_id", {
  name: "post",
  action: function (parameters) {
    ReactLayout.render(SomeLayout, {
      content: <Post _id={parameters._id} />,
    });
  },
});
```

#### Reactive Router Content

Sometimes, you want to have content passed from your router to your view. Then there’s times where you want that content to be reactive. Iron:Router allows this reactive route content, but it’s never really worked how I’ve expected it to (so I usually avoid using it to the best of my ability). The issue, I believe, stems from hooks and methods rerunning unpredictably, and often at strange times. FlowRouter offers an alternative – router content is loaded only once, when the user requests the route.

#### Fast Render

I’ve actually not used this feature in FlowRouter, but almost everyone who has highly recommends it. Fast Render is a library that helps render your app even before the DDP (distributed data protocol) is alive. What this means is you’re able to serve your page at lightning fast speeds, and then wire up the reactive data bits after rendering. Faster page load is always great!

So how does that hook into FlowRouter? FlowRouter has built in support for Fast Render out of the box. Simply run `meteor add meteorhacks:fast-render` from your terminal and you’re good to go! Snazzy!

_Edit: Thanks to David Miranda for pointing out that Iron:Router can add fast-render support as well, by simply adding `fastRender:true` to the options object on the route itself. The full steps can vary based on how you’re using Iron:Router, so I urge you to check out [this blog post](https://meteorhacks.com/fast-render/iron-router-support/) if that’s something you’re looking to do!_

#### Coding for Each Router

When I think of Meteor, I think of writing very little code to accomplish something great at lightning fast speeds (both development and performance). So the amount of code and complexity of the Router means a lot to me.

FlowRouter, for example, feels exponentially more verbose than Iron:Router. Additionally, it feels like it can become outlandishly more complex than Iron:Router quite fast. That being said, I’ve used Iron:Router a lot more than Flow, so I may just be more familiar with keeping my Iron:Router simple.

FlowRouter

```javascript
var adminRoutes = FlowRouter.group({
  prefix: "/admin",
  name: "admin",
  triggersEnter: [
    function (context, redirect) {
      console.log("running group triggers");
    },
  ],
});

// handling /admin route
adminRoutes.route("/", {
  action: function () {
    BlazeLayout.render("componentLayout", { content: "admin" });
  },
  triggersEnter: [
    function (context, redirect) {
      console.log("running /admin trigger");
    },
  ],
});

// handling /admin/posts
adminRoutes.route("/posts", {
  action: function () {
    BlazeLayout.render("componentLayout", { content: "posts" });
  },
});
```

While the same thing in Iron:Router can roughly be accomplished with…

```javascript
Router.route("/admin", function () {
  console.log("running admin/");
  this.render("componentLayout", { content: "admin" });
});

Router.route("/admin/posts", function () {
  this.render("componentLayout", { content: "posts" });
});
```

#### The TLDR

Both solutions are great, and offer different benefits. I’d choose Iron:Router if any of the following are true:

- I’m new to Meteor, and need support from the community.
- I don’t mind conforming to Iron:Router and understand the trade-off is less worry about the routing doing it’s job.
- I need server-side routing.

On the other end of things, I’d choose FlowRouter if the following is true:

- I want nested routes or route groups.
- I’m not sure Im going to stick to Blaze over Ember, React or Angular.
- I want to easily integrate Fast Render Support.
- I want more control over what my Router does.

Do you prefer Iron:Router or FlowRouter? Let me know in the comments below!
