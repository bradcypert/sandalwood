---
title: "Trial by Code Review"
date: 2016-08-22
status: publish
permalink: /trial-by-code-review
author: "Brad Cypert"
excerpt: ""
type: blog
id: 32
images:
  - access-blur-business-1181271.jpg
category:
  - Meta
tags:
  - meta
post_format: []
_yoast_wpseo_title:
  - "%%title%% %%sep%% A Plan for Helpful Code Reviews %%sep%% %%sitename%%"
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_primary_category:
  - "70"
_yoast_wpseo_content_score:
  - "60"
_yoast_wpseo_focuskw:
  - "code review"
description:
  - "A code review can be scary, especially for newer developers, but through a good understand of ettiquete and accountability, a code review can become an enlightening experience."
_yoast_wpseo_linkdex:
  - "73"
---

Today wasn’t the day, but I remember it like it was. My first big project that I submitted at a big company working with engineers that I respected and looked up to. I pushed my code to our code review tool and anxiously awaited their feedback. Some of it was the most non-constructive feedback that I’ve ever seen in a code review and since then I’ve thought of some standards that might (or might not) be worth adhering to in code reviews. Perhaps a better title for this post is actually **A brief guide to writing code reviews.**

#### A brief treatise on Accountability

The way I view accountability of code is very simple. If the code is in your branch, you’re accountable for it. Not much can happen to it and it is yours to maintain. When the branch gets merged into your mainline branch (master, prod, whatever), the team becomes accountable. Why does this make sense to me? Because the team has the opportunity to review your code, address any concerns, and accept the responsibility for it by merging it into the mainline branch.

Finally, when the team agrees to deploy this code to product, the entire company is accountable for it. More on this in another post, perhaps, but the above paragraph should give you enough insight into my following thoughts on code reviews.

#### Code Review Features

For the sake of simplicity (and completeness of the tool), I’m going to assume that your code review tool has the following features:

- View the differences from the current version and proposed changes.
- Add a comment to a specific line of code (or multiple).
- Add a comment to the overall request.
- Flag a comment as an issue.
- Grant your blessing to the changes that you’ve reviewed.

There are many tools that fit this need, but arguably the most common one is [Github’s Pull-Request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests) feature.

#### Tips for Commenting on Lines of Code

Commenting on one or more lines of code is one of the best features that a tool like this offers. It allows you to provide suggestions and ask questions in the context of a specific function, scope, or operation. That being said, there are some things you should do when commenting on one or more lines of code.

- If you’re commenting on how a function does something, comment on the entire function.
- If you’re commenting on most of the file, break it up into smaller comments.
- If you’re commenting to provide an alternative means to do something, ensure that your code sample leverages the same scope as the commented on code.

#### Tips for Commenting on the Request

Sometimes, you have comments that aren’t necessary relevant to a single line. Perhaps a question about how this fits into the bigger picture or maybe you want to suggest a different design pattern. The “top of the review” – that is, not tied to a specific line – is the place to do this.

- Ask questions in paragraph form. We don’t have the context of our code to help piece together your concerns.
- This is the place to mention performance, accessibility, or hierarchy concerns.
- Mention the test-coverage (or lack thereof) provided by this request.
- Link to any styleguides or code sample demonstrating proper code formatting.
- Offer to help. Offer to walk through the way this fits into your existing application or help setup a linter or other tool.

#### Flagging a Comment as an Issue

Arguably the most useful feature of any code review tool is the ability to flag something as an issue. Great code review tools will also group the issues and/or allow you to see each issue raised side by side with your code. If you’re flagging a comment as an issue, here’s a few things to keep in mind:

- Don’t raise an issue to ask a question.
- Don’t raise an issue to talk about code style or formatting.
- Use issues as an opportunity to offer an alternative solution.
- Explain why this is an issue. “Using a threadpool has some overhead associated with it. Here’s why that’s an issue for us…”

#### Granting Your Blessing

![](/Screen-Shot-2019-10-28-at-2.14.21-PM.png)

If your code review tool provides this feature, it’s important to leverage. [Review
Board](https://www.reviewboard.org/), a tool that I frequently use, has a checkbox
called “Ship-It!” which is used to grant your blessing on this change. At LinkedIn,
you can’t ship code changes without a “Ship-It!” from the code owners. When you’re
granting your blessing, it’s a good time to recap the history of this review request.
Consider doing the following:

- Thanking the engineer for making any changes they’ve made.
- “Bump” any concerns that have been **Todo’d**.
- Mention any dependencies that may be waiting on this commit to make it into the master branch.
- Use an appropriately placed `.gif` to celebrate.
