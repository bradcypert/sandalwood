---
title: "Building a better blog"
date: 2023-03-30
status: publish
permalink: /building-a-better-blog
author: "Brad Cypert"
type: blog
category:
  - meta
images:
  - pexels-jessica-lewis-creative-606541.jpg
tags:
  - meta
description: "My content over the years has teeter-tottered between good and bad. Here's my plan to ensure I'm producing quality, educational content moving forward."
outline:
  what: "How I am going to write blog posts going forward"
  why: "Other bloggers may find value in my content creation process."
  how:
    - "Teach something general or answer a specific question"
    - "Break down how the smaller pieces contribute to the larger problem"
    - "Show examples of how the larger solution can be used"
    - "Strive to be evergreen or clearly dated"
  when: "when starting a new form of content"
---

I have been writing blog posts for almost ten years now. Ten years is a long time. My personality has changed, my aspirations have changed, and my knowledge and area of focus has changed (See: [Why I'm switched from Python to Clojure](/why-i-switched-from-python-to-clojure/) and I haven't written a single line of Clojure in years). 

When I first started my blog, I wanted a platform to share knowledge with other developers. I was sharing articles on things that I was learning at a surface level and occasionally, I'd really have something click and would write a post about that.  I did this for a bit but wasn't really seeing any traffic with my blog. This left me disheartened, so I stopped blogging for a while.

Less than a year later, I adopted this aggressive, startup-y hustle culture from a few coworkers that I had grown close with. During this time, I learned about SEO, Side Hustles, and "the grind." Parts of the blog flourished, because I was spending a lot of time blogging and applying what I had been learning regarding SEO. I had some posts make the frontpage of hackernews a time or two and looking back on that now, I can say that's a cool experience and I'm glad that happened. People aggressively criticizing your work is both very humbling and very educational.

I moved out to Silicon Valley and very quickly realized it wasn't for me. At this point in my career, I was starting to get to the point where I was confident making large-scale technical decisions and I found that I was able to really grasp most software-related learnings with ease. I felt stifled in my 9-5 (or realistically I should be calling it a 6:50AM to 5PM). I wanted to pursue avenues to grow, learn, and thrive in the little time I was spending outside of work.  I switched from Python to Clojure for my every-day-hacking-on-random-shit language. I partnered up with a friend to build the "best web player for podcasts". We had a great time, and I shared so much of my learnings on my blog.

Fast foward a bit to the rise of influencer-marketing and content creation. I had streamed gaming on twitch in the past, and while I realized that was never going to be a full time reality for me (and now I definitely do not want it to be), I had interest in creating content that put me in an influencer space. I was continually impressed with the content that was being produced by people like [Jason Lengstorf](https://www.jason.af/), [Kent C. Dodds](https://kentcdodds.com/), [Chris Coyier](https://chriscoyier.net/), [John Papa](https://www.johnpapa.net/), [Jake Wharton](https://jakewharton.com/), and many more. I wanted what they had so I set out to build it.

In the span of a few years, I put out a single-season podcast originally titled "Design Doc" (now rebranded to "Megabyte" in an effort to not squat on a contested name and to motivate myself to do a second season), started a [YouTube channel](https://www.youtube.com/@CodeWithCypert), and continued working on my blog.

Regarding the content, I had found a few different technologies that I had developed some level of expertise in over the years and fell back on my aggressive, startup-y hustle culture learnings to help me formulate a plan. Looking back on it now, It was definitely a "spaghetti at the wall" type approach. My plan was to create a bunch of content and hope that a few items made it viral. Everyone just needed one great post to pull them in and then they'd realize how great all of my other content was, right? Wrong -- because in an effort to produce the "spaghetti", I created some crap content.

## Crap Content

I see this now when I look at my "Learning Dart" playlist on Youtube. It's a bunch of very short, not super helpful videos taking you through the basics of the Dart programming language. And by basics, I do mean basics -- Plus it was never finished! Thankfully, most of my blog posts don't fall into this category, but there are a few that do: [Python Length of a List](/python-length-of-a-list/), [What is Laravel's Homestead](/what-is-laravels-homestead/), [PHP: Add to an Array](/php-add-array/). Clearly, these are low-effort posts that were aimed at creating a presence for certain keyword searches. Truthfully, I was working with PHP a lot when writing the PHP posts and Python a lot when writing the Python post, but the quality is abysmal.

Renewing crap content is entirely dependent on the medium. I am not skilled enough in video production to chop up my crap videos and produce something more meaningful, so I will likely re-record them, but older blog posts can be flushed out to provide value. We're aware these posts are what I consider to be "crap content" but how do we improve the content so that it creates value?

## Creating Value

There are so many great posts that provide informative content that helps educate and grow the reader. The people I listed above are great examples of this, and had I not tried to take shortcuts, I likely would have not felt the need to write this post or to think through better blog posts. We can analyze the content from these great content creators to figure out exactly what works well for them. I've distilled it down to the following items:

1. The content teaches something general or answers a specific question
2. The content breaks down how the smaller pieces contribute to a larger solution.
3. The content shows examples of how the larger solution can be used.
4. The content should strive to be evergreen or clearly dated.

I feel that a good post should hit each of these items. A recent attempt to do this is my post on [Dart's Futures and Streams](/dart-futures-and-streams/). I talk about Futures and Streams, talk about what Futures and Streams represent (possibly data at a later time and data over time, respectively), and then I show some examples of when you might interact with a future and stream as well as when you might want to create a future or a stream on your own.

That article is not perfect, but I am proud of how it's shaping up. Its a home to add more information as I explore more scenarios with Futures and Streams in Dart. The quality is something that feels closer to the brand I want to portray as I focus less on being a super-cool-viral-tech-influencer and focus in more on teaching, mentoring, and growing my readers. It's now easier than ever to create a ton of "crap content" via GPT and it's now more important than ever to focus on using the best parts of what make us human to help teach, grow, and, hopefully, inspire others.

## The secret sauce

My blog runs on Hugo and I have a janky little script in a "tool" directory that I use to scaffold out new posts. This is effectively just a template that is echo'd to the output directory. This allows me to do something like this:

```bash
./tool/make_post.sh naive-bayes-classifier-in-rust-with-taylor-swift
```

which would then generate a new blog post with data like so:

```yaml
---
title: "Naive Bayes Classifier in Rust trained on Taylor Swift lyrics"
date: 2023-01-22
status: publish
permalink: /naive-bayes-classifier-in-rust-with-taylor-swift
author: "Brad Cypert"
type: blog
id: 39
tags:
  - tag
description: ""
---
```

I've added a new set of fields to this YAML to help me outline my posts. The section is titled `outline` and looks like so:
```yaml
outline:
  what: "What's the main goal I am trying to convey"
  why: "Why does anyone care?"
  how: "How is whatever Im teaching used?"
  when: "When should it be used?"
```

My plan is to not post content if I cant answer these questions and to start by answering these questions. I feel that this will help me ensure that my content is quality and beneficial. For the post you're reading right now, the outline looks something like this:

```yaml
outline:
  what: "How I am going to write blog posts going forward"
  why: "Other bloggers may find value in my content creation process."
  how:
    - "Teach something general or answer a specific question"
    - "Break down how the smaller pieces contribute to the larger problem"
    - "Show examples of how the larger solution can be used"
    - "Strive to be evergreen or clearly dated"
  when: "when starting a new form of content"
```