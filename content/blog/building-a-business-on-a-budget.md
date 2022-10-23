---
title: "Building a Business on a Budget"
date: 2018-04-12
status: publish
permalink: /building-a-business-on-a-budget
author: "Brad Cypert"
type: blog
id: 310
thumbnail: /DO_Logo_Horizontal_Blue.png
category:
  - Business
  - Meta
description: "Building a business on a budget is difficult, but not impossible. These are some of my favorite tools for running a business on a budget."
---
## IE: Seven cheap (or free) tools we use on Porios and you should use too!

I’m a firm believer in the expression _“You get what you pay for”_ but I’ve quickly learned the following:

- There are exceptions to this rule.
- You often don’t need as much as you think you do.
- Businesses will often times offer you free options with the hope that you’ll grow into a paid plan.

Today I’m going to blog a bit about the tools that we use on Porios and how we use them, plus some of the costs associated with them. Hopefully, I’ll be able to find this blog post again the next time I start a project and can skip the relearning phase of growing a business from a small seed into something larger. Hopefully it helps you, too!

_Heads Up: Some of the links below are affiliate links. This means I can get a kick back from the service should you choose to subscribe to their services._

## \#1. Digital Ocean[![Digital Ocean](/DO_Logo_Horizontal_Blue.png)](https://m.do.co/c/f968a2744d2a)

DigitalOcean (often misheard as “Digital Lotion”) is a cloud computing platform that let’s developers take a VM by the horns and wrangle it into whatever they need. It’s also the meat and potatoes of our infrastructure at Porios. With DigitalOcean, you can requisition a new VM for as little as $5/month. Or, for that same $5, you can setup one of their dead-simple “one click” installs for anything as simple as WordPress, as flexible as Docker, or as painful as Django (lookin’ at you, Python developers!). Plus, if you’re a developer (and if you’re on my blog, you likely are), you’ll be happy to know that they expose a full-fledged API for managing your droplets (that’s what they call their VMs).

But wait, there’s more. Droplets are indeed DigitalOcean’s core offering, but they’e recently started doing so much more. They’ve added “Spaces” which are similar to S3 buckets in that they’re used to store and serve static assets. Plus, they even offer load balancers and tack-on storage for your virtual machines. They’re a specialized company focused on a domain predominantly served by AWS and they do a fantastic job. With Porios, we’ve been running our servers on DigitalOcean for (the longest one being) almost 2 years and I can’t think of a better option for us.

One last thing to mention about Digital Ocean. With all of their VMs, they offer add-on features image-backups, virtual private networking, and VM monitoring (this one’s a freebie!). If you’re interested, check them out here – [DigitalOcean](https://m.do.co/c/f968a2744d2a).

## \#2. AWS

![AWS Logo](/AWS_logo_RGB.png)

I know, I know. I just mentioned that we prefer DigitalOcean over AWS for our servers and I sincerely do mean that. However, we actually run the frontend for Porios out of an S3 bucket. On top of that, we leverage buckets for storing user-uploaded images and other media. S3 is a fantastic tool and allows us to run a sizable chunk of our functionality at a very, very cheap monthly cost. We’ve had monthly costs as low as several cents (when we were first starting) but even now, they’re cheaper than running the frontend through Apache on the VM somewhere in the cloud. We also use AWS’s Cloudfront CDN for distributing Porios world-wide to ensure faster page load times, cacheing, and location-based fail-overs. AWS is a fantastic suite of tools, but I will warn you — It’s very easy to rack up a big bill quickly. When Porios was written in Clojure, we originally deployed to Elastic Beanstalk and had almost no traffic. However, we ran a \$45 bill in our first month and for a personal side project, that was out of the budget.

Tools that I’d recommend from AWS while keeping budget in mind:

- [S3 (Simple Storage Service)](https://aws.amazon.com/s3/?nc2=h_m1) – store static content and/or host the frontend of your website for cheap.
- [Cloudfront (CDN)](https://aws.amazon.com/cloudfront/?nc2=h_m1) – spread your content across the globe with cacheing.
- [Route 53](https://aws.amazon.com/route53/?nc2=h_m1) – Buy and manage domain names and DNS entries.

You can hit AWS’s landing page here – [AWS](https://aws.amazon.com/). Just keep in mind, there are tools that are cool and then there are tools that are affordable.

## \#3. Mailgun

[![Mailgun](/mailgun_primary_logo-1024x282.png)](https://www.mailgun.com/)

[Mailgun](https://www.mailgun.com/) is a service that allows developers to leverage powerful APIs that enable you to send, receive and track email effortlessly. Our Mailgun integration was one of the first integrations we built into Porios and we use it for all of our automatic emails. In Porios, we leverage [OUTR’s Mailgun4S](https://github.com/outr/mailgun4s) which is a great Mailgun client for Scala. The integration and client work great together and they allow us to write rich HTML emails and bundle those along with our deployable application. Unfortunately, there are no tools for building an “all-email-client-friendly” email integrated into mailgun (or the ability to create emails via the web portal and call the api with those as a reference) but this has only became a recent concern for us (as I tire of writing these email templates from scratch).

The best part about mailgun, however, is that **they have a fantastic free-tier offering**. The free plan offers support for sending 1,000 emails per month, and supports logs, analytics and webhooks. We send most of our emails and manage preferences from our application, but I believe that Mailgun also offers mailing lists and you can target emails by mailing lists as well. The configuration for allowing emails from your domain is not that difficult to setup and they have a great tutorial showing you how to do so.

## \#4. Sentry.io

[![Sentry Logo](/sentry-logo-white.png)](https://sentry.io/welcome/)

[Sentry.io](https://sentry.io/welcome/), a relatively new addition to the list of inexpensive tools we use at Porios, is an excellent open-source error tracker that helps developers track and fix errors in real time. When we migrated from Clojure to Scala, we wanted to cut over to our new API as soon as possible. In doing so, we introduced several errors from calling unfinished endpoints (I know, we’re terrible) or from poor test coverage. Unfortunately, our logging wasn’t in a good place at the time either and debugging errors because extremely difficult. We’ve learned our lesson, but we wouldn’t have without the help of sentry.

Since Porios is a Scala/Play project, we were able to integrate into Sentry via a simple configuration addition to our Logback.xml file. After making this change and deploying our application, we were able to hit a faulty endpoint to generate a 500 and see an error within a minute in Sentry. Of course, it integrates with the application logger and logback so we got a rich stack-trace and error log that we’d expect to see if an application error was thrown in development. This made the act of fixing these errors all too easy.

Of course, Sentry has support for more than just Scala. Their supported languages cover almost all of the major languages I could think of and seem to be pretty well received in all of their communities. Additionally, **Sentry has a free-tier plan available** that works wonderfully for small teams. As we grow, we know that Sentry will grow with us and will be an essential part of our tech stack for a long time to come.

## \#5. Datadog

[![Data Dog](/dd_h_w_logo-300x300.png)](https://www.datadoghq.com/)

A strong complement to Sentry.io, Datadog is a tool for monitoring your cloud infrastructure at scale. An interesting issue we ran into shortly after deploying the Scala API was an out of memory exception. Unfortunately, Sentry wasn’t catching this for us properly as the application needed to be up to successfully log any issues (quite the Catch 22). Datadog allows you to install their agent on your virtual machines and monitor everything you could want to know (and possibly some things you didn’t even care to know) about your servers. It has integrations for hundreds of applications and tools as well, including the JVM and Postgres (two tools we use on Porios) and many more!

I’m positive that Datadog does more than what I’ve outlined so far, but I haven’t had much of a chance to dig into it yet. I love the dashboards that they provide and the fact that you can build your own dashboard just makes their tool even better. Best yet, **Datadog has a free 14-day trial that leads to a free plan after that.** The free plan pales in comparison to the full paid product, but it’s still something we plan on keeping in our repertoire. Also, check out how cute that logo is!

## \#6. Gitlab

[![Gitlab](/wm_no_bg-300x114.png)](http://www.gitlab.com)

[Gitlab](http://www.gitlab.com) is, without a doubt, my favorite git platform. While Github takes a focus on all things Git, Gitlab spends its efforts on providing a complete DevOps solution with Git at the core of it. For what it’s worth, I use both Github and Gitlab, but here’s why I prefer Gitlab:

- Integrated CI/CD tool that works wonderfully.
- Integrated Kanban board that is generated from project issues.
- Rich set of analytics regarding cycle time, issue resolution time, and commit metrics.
- With the <span style="background-color: #f6d5d9;">Gitlab </span>agent, you can deploy directly from <span style="background-color: #f6d5d9;">Gitlab </span>using the CD pipeline.
- You can integrate your service desk software into their issue tracker.
- You can schedule jobs via Gitlab pipelines.
- You can even integrate Kubernetes cluster management via Google Compute Engine.
- The UI, despite housing a ton of content, is rather clean and intuitive.
- **It’s got unlimited free private repositories.**

With Porios, we use Gitlab all the time. All of our code is hosted there and our unit tests and integration tests run against their CI/CD pipeline. Plus we integrate our git notifications and build notifications with Slack so the team can stay up to date on progress simply by watching a channel.

## \#7. Slack

[![Slack](/slack_rgb-300x141.png)](https://slack.com/)

For those unacquainted, [Slack](https://slack.com/) is a chat-ops related tool. It exists to foster communication between coworkers and is, in my opinion, the best tool for doing so. With a plethora of integrations (and a webhook api for any that don’t exist), Slack fits into any tech stack or process pipeline like the final piece of a puzzle. **Slack has a wonderful free plan**, is highly customizable and is full of useful shortcuts and features to help make sure information gets disseminated across your team and to make sure voices are heard. It’s one of the first tools we’ve introduced to the Porios team and will be one of the last remaining tools we’ll be clutching onto as we grow.

There’s a reason why most web communities are migrating to slack and I think that the tool speaks for itself. I highly recommend giving it a shot.
