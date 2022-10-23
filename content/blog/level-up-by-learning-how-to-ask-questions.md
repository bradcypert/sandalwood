---
title: "Level Up by Learning How to Ask Questions"
date: 2021-03-11
status: publish
author: "Brad Cypert"
type: blog
thumbnail: /Screen-Shot-2018-11-19-at-12.35.12-PM.png
category:
  - meta
tags:
  - meta
---

There are several differences between junior and senior developers, but one of the most noticeable differences is around how they communicate. In development, questions are one of the most common forms of communication. Here are some tips that I have to help you ask senior-level questions.

# Ask a question.
This one might seem obvious, but if you're looking for an answer, start by asking a legitimate question. "My code doesn't work" is not a question. "How do I make this code work?" is better, but still not great. We'll make it great with the next three steps.

# Establish the context.
Establishing a context makes sure that you and whoever you're talking to are on the same page. "How do I make this code work?" is probably better off as "I am trying to get this React hook to trigger when the name property has changed. How do I make this code work?" But... this question can still be better.

# Clarify your question.
If someone doesn't know what you're asking, its difficult to get a clear answer. Clarifying your question helps make sure that you get the answer that you're looking for. We can make this question even better. "I am trying to get this React hook to trigger when the name property has changed. How do I make this code work?" What even is "this code?" Perhaps this is better as "I am trying to get this React hook to trigger when the name property has changed. How do I ensure that this hook on line 14 is running every time that the name property from the parent is updated?"

# Explain what you've already tried.
Our last step is the most important. You have history with this problem, but the person helping you may not. They may start down the same path that you already did. Help them avoid this mistake (unless they think you missed something originally) by telling them what you've already tried. Let's enhance our question one more time. "I am trying to get this React hook to trigger when the name property has changed. I've tried setting up a local state to hold the name property but that's not working. I've also tried adding a dependency array to the useEffect hook. How do I ensure that this hook on line 14 is running every time that the name property from the parent is updated?"
