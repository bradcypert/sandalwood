---
title: "What you need to know about the Gilded Rose interview problem"
date: 2019-01-16
status: publish
permalink: /what-you-need-to-know-about-the-gilded-rose-interview-problem
author: "Brad Cypert"
type: blog
id: 795
images:
  - beauty-bloom-blue-67636.jpg
category:
  - clojure
tags:
  - clojure
  - interview
description:
  - "The Gilded Rose interview problem is far more than meets the eyes. You may have requirements, but you need to refactor and provide test coverage, as well!"
---

A few years ago, I interviewed for a Dev Ops position at a pretty prominent CI shop in San Francisco. Part of the interview process involved a take-home code-assignment (of course). This particular assignment is known as the Gilded Rose.

The Gilded Rose isn’t a fizzbuzz. It’s not “Implement a Trie” in whatever language you want. The Gilded Rose is a problem that involves adding some functionality into the worst code that a developer could ever write. I don’t mean any offense to whoever created the Gilded Rose problem, bad code is entirely the intention! They want to see how you work through a terrible codebase to add new functionality.

This example will be in Clojure, as thats what I did this exercise with at the time, but it’s worth mentioning that the Gilded Rose exists for almost any programming language. If you find yourself facing this question, you’ll be left with usually two files.

## The README

The README for this project is quite long. It’ll list stipulations for this problem that you have to follow for it to be successful. Some are downright stupid (more on that in a moment), but that’s the reality of actually working in real code. You’ll find those there, too. Anyways, here’s an example of what you might find in the Gilded Rose README (also, if you’ve ever played WoW, you might notice some references here).

---

Hi and welcome to team Gilded Rose.

As you know, we are a small inn with a prime location in a prominent city ran by a friendly innkeeper named Allison. We also buy and sell only the finest goods. Unfortunately, our goods are constantly degrading in quality as they approach their sell by date.

We have a system in place that updates our inventory for us. It was developed by a no-nonsense type named Leeroy, who has moved on to new adventures. Your task is to add the new feature to our system so that we can begin selling a new category of items.

First an introduction to our system:

- All items have a sell-in value which denotes the number of days we have to sell the item
- All items have a quality value which denotes how valuable the item is
- At the end of each day our system lowers both values for every item

Pretty simple, right? Well this is where it gets interesting:

- Once the sell by date has passed, quality degrades twice as fast
- The quality of an item is never negative
- “Aged Brie” actually increases in quality the older it gets
- The quality of an item is never more than 50
- “Sulfuras”, being a legendary item, never has to be sold or decreases in quality
- “Backstage passes”, like aged brie, increases in quality as it’s sell-in value approaches; quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less but quality drops to 0 after the concert

We have recently signed a supplier of conjured items. This requires an update to our system:

- “Conjured” items degrade in quality twice as fast as normal items

Feel free to make any changes to the update-quality method and add any new code as long as everything still works correctly. However, do not alter the item function as that belongs to the goblin in the corner who will insta-rage and one-shot you as he doesn’t believe in shared code ownership.

Just for clarification, an item can never have its quality increase above 50, however “Sulfuras” is a legendary item and as such its quality is 80 and it never alters.

## Analyzing the Requirements

There’s a lot going on in this README, so I’m going to break this problem apart piece by piece. However, the interesting parts of this README aren’t the bullet points contained within it. It’s the content not bulleted (in fact, Im going to leave those bullet points out, scroll back up and read them if needed).

- You’re making an update to this system to support conjured items. That’s it.
- the “item” function can **NOT** be changed. Don’t touch it.
- Legendary Items are an edge case. Sulfuras breaks the rules.
- This is implied but not directly stated: **YOU NEED TO WRITE TESTS**.
- **YOU NEED TO WRITE TESTS FIRST**.

If you do this for an interview, you’ll likely be told, “Oh don’t spend more than an hour or two on it.” Which is fair. If you don’t get anything else done in that hour or two, write tests and try to refactor. That is actually what this interview question is all about — the conjured items (the addition) is not substantial compared to ensuring code works before and after refactoring.

Why do I keep mentioning refactoring? Like I said at the beginning, this code is a nightmare. You’ll be given code like this (Clojure, sorry everyone else, but you should still be able to recognize that this is NOT good code):

```clojure
(ns gilded-rose.core)

(defn update-quality [items]
  (map
    (fn[item] (cond
      (and (< (:sell-in item) 0) (= "Backstage passes to a TAFKAL80ETC concert" (:name item)))
        (merge item {:quality 0})
      (or (= (:name item) "Aged Brie") (= (:name item) "Backstage passes to a TAFKAL80ETC concert"))
        (if (and (= (:name item) "Backstage passes to a TAFKAL80ETC concert") (>= (:sell-in item) 5) (< (:sell-in item) 10))
          (merge item {:quality (inc (inc (:quality item)))})
          (if (and (= (:name item) "Backstage passes to a TAFKAL80ETC concert") (>= (:sell-in item) 0) (< (:sell-in item) 5))
            (merge item {:quality (inc (inc (inc (:quality item))))})
            (if (< (:quality item) 50)
              (merge item {:quality (inc (:quality item))})
              item)))
      (< (:sell-in item) 0)
        (if (= "Backstage passes to a TAFKAL80ETC concert" (:name item))
          (merge item {:quality 0})
          (if (or (= "+5 Dexterity Vest" (:name item)) (= "Elixir of the Mongoose" (:name item)))
            (merge item {:quality (- (:quality item) 2)})
            item))
      (or (= "+5 Dexterity Vest" (:name item)) (= "Elixir of the Mongoose" (:name item)))
        (merge item {:quality (dec (:quality item))})
      :else item))
  (map (fn [item]
      (if (not= "Sulfuras, Hand of Ragnaros" (:name item))
        (merge item {:sell-in (dec (:sell-in item))})
        item))
  items)))

(defn item [item-name, sell-in, quality]
  {:name item-name, :sell-in sell-in, :quality quality})

(defn update-current-inventory[]
  (let [inventory
    [
      (item "+5 Dexterity Vest" 10 20)
      (item "Aged Brie" 2 0)
      (item "Elixir of the Mongoose" 5 7)
      (item "Sulfuras, Hand Of Ragnaros" 0 80)
      (item "Backstage passes to a TAFKAL80ETC concert" 15 20)
    ]]
    (update-quality inventory)
    ))
```

## Tips for the Gilded Rose

I’m not going to share my solution with you — where’s the fun in that? Also, you can just browse Github if you **must** know. However, I will leave you with some tips.

- Sulfuras is an edge case, but refactor it in such a way that you can add new edge cases (Perhaps Thunderfury, Blessed Blade of the Windseeker)
- Use as many private functions as you find makes the public function readable, in Clojure, it can mean quite a few.
- Consider using overloading, pattern matching, or value matching for items that have specific requirements (Brie, Concert Tickets)
- Consider storing items in a map with a lambda that contains their “update-quality” behavior function.
- Write tests first. Especially if your interviewer is asking you to commit this to Github. They will look at your commit history, because no-one (myself included) should touch this monster without adequate test coverage first.
- Use comments throughout your code. The idea here is to see if you can take an abomination and make it usable for other developers while not breaking anything.
- If you’re using Clojure for your project, this problem is an excellent one to consider Multimethods.

That’s all I have for you! Best of luck and have fun with it!

If you’re interested in learning more about Clojure, [you can find my other Clojure related posts here!](http://www.bradcypert.com/clojure-async/)
