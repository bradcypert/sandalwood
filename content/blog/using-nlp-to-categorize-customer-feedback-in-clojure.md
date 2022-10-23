---
title: "Using NLP to Categorize Customer Feedback in Clojure"
date: 2016-12-23
status: publish
permalink: /using-nlp-to-categorize-customer-feedback-in-clojure
author: "Brad Cypert"
excerpt: ""
type: blog
id: 42
category:
  - Algorithms
  - clojure
  - NLP
tags:
  - categorization
  - clojure
  - nlp
post_format: []
_yoast_wpseo_title:
  - "Using NLP to Categorize Customer Feedback in Clojure"
---

First – an apology. It’s been a long while since I’ve written and I kind-of dropped my last series on it’s head and left it to rest. If you were particularly interested in the Zero-To-Hero for Android Development, let me know. I’ll pick it back up. The reason I stopped writing it was because the community sentiment was straight-forward — they wanted more Clojure!

Then, I became a bit confused with my next steps as a developer and got mixed up in Rust. Turns out, that’s not for me and I’m in a good spot where I’m at so expect more Clojure posts to return!

Today, however, we’re going to talk about something very, very significant to me. NLP (Natural Language Processing). Our goal is to take customer feedback emails (“Hello, you suck.” or “Hey, love your product. You guys saved my butt in a meeting with so-and-so”) and categorize them. Positive feedback is always nice to read and great to respond to, but it’s generally more important to categorize negative feedback so the issue can be quickly resolved before someone starts shaming your company on twitter. And that’s our goal – Quickly determine if something is negative enough that we need to elevate this to customer service to defuse the situation.

We’ll be writing this in Clojure (We’re back, baby!) but we will end up using Stanford’s wonderful NLP library (which is in Java). Thankfully, unless this is the first post you’ve read on my blog, you’re more than aware that Clojure has astounding Java interoperability. Let’s get to it!

#### Tests First

Don’t worry, I’ll keep this simple and not worry about writing tests files, but I want to go ahead and get our test data out there so we can check our progress along the way.

Here’s four emails that I’ve found recently by searching the webs.

###### The Hate Mail

```
Dude, your product freaking sucks. You guys charge way too freaking much and I can't stand all the bugs. It's absolute trash.

```

###### The Happy Mail

```
Hey there!

Just wanted to say that what you're doing is really important. I'm really glad that there's people out there in the world trying to solve the problems that my son faces. Special needs is a field that always needs more love, and it's nice to see that you're providing that.

```

###### Sarcastic Mail

```
Oh, your product is sooooo good. I just love that it breaks down on me all the time, and the bugs really come of as extra features and not a shitty user experience. I'm sooooo thankful that you guys are around.

```

###### The Happy Mail #2

```
You guys are doing a great job! Keep up the great work!

```

#### Dependencies

Alright, we’ve got our test data out of the way. I’ll test against all four of those cases in the REPL once we get coding. First, let’s add Standford’s NLP library to our project. I won’t worry about editing the `lein` boilerplate.

```clojure
(defproject nlp "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [edu.stanford.nlp/stanford-corenlp "3.6.0"]
                 [edu.stanford.nlp/stanford-corenlp "3.6.0" :classifier "models"]]
  :main ^:skip-aot nlp.core
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all}})

```

Don’t forget to run `lein deps` to download your new dependencies. This could take **a while**.

#### Pipelines

Stanford’s Core-NLP library has a built in way to help determine text sentiment (called `sentiment`) and we’ll leverage that. We’ll run our text through the following pipeline – tokenize, ssplit, pos, llema, parse, sentiment. There are several other pipelines available for all sorts of different NLP use cases, and I’d recommend exploring them all if you’re just interested in the NLP aspects of this post.

#### Let’s Code

Crack open your `main.clj` file and let’s get started.

First we want to add our dependencies.

```clojure
(ns nlp.core
  (:import (edu.stanford.nlp.pipeline Annotation StanfordCoreNLP)
           (edu.stanford.nlp.sentiment SentimentCoreAnnotations$SentimentClass)
           (edu.stanford.nlp.ling CoreAnnotations$SentencesAnnotation)
           java.util.Properties))

```

Next, we’re going to define a function that’ll take care of creating the StanfordCoreNLP object. We’ll also go ahead and define our sentiment pipeline.

```clojure
(def pipeline "tokenize, ssplit, pos, lemma, parse, sentiment")

(defn build-nlp
  "Builds a Stanford NLP object"
  []
  (let [p Properties.]
    (.put p "annotators" pipeline)
    (StanfordCoreNLP. p true)))

```

Now, we define a function that will use our NLP Object to parse and annotate the text that we’re examining. We’ll end up passing in separate sentences later, so we’ll write this function to just parse and annotate one sentence at a time. Since this function will annotate our text for us, we’ll call this “annotate-text”.

```clojure
(defn- annotate-text
  "Runs the given text through the NLP pipeline"
  [text]
    (.process (build-nlp) text))

```

Now, we want to write a function to pull the sentiment for a given annotated sentence. This is basically unpacking the value from the Java class. It’ll look something like this.

```clojure
(defn- get-sentiment
  [anno-sentence]
  (.get anno-sentence SentimentCoreAnnotations$SentimentClass))

```

Finally, we throw it all together with some sweet, sweet threading magic. You’ll notice that we’re not doing anything crazy here, just taking text and threading that through annotation and a few anonymous functions.

```clojure
(defn get-sentiment
  [text]
  (-> text
      annotate-text
      (#(.get % CoreAnnotations$SentencesAnnotation))
      (#(map get-sentiment %))))

```

#### Time to Test

Let’s run `get-sentiment` against a few of our above test cases, shall we?

###### Hate Mail

```clojure
nlp.core=> (get-sentiment "Dude, your product freaking sucks. You guys charge way too freaking much and I can't stand all the bugs. It's absolute trash.")
("Negative" "Negative" "Negative")

```

Nice! It realized that the entire email was negative! That’s wonderful!

###### Happy Mail #1

```clojure
nlp.core=> (get-sentiment "Hey there!
      #_=>
      #_=> Just wanted to say that what you're doing is really important. I'm really glad that there's people out there in the world trying to solve the problems that my son faces. Special needs is a field that always needs more love, and it's nice to see that you're providing that."
      #_=> )
("Neutral" "Positive" "Negative" "Positive")

```

Not great, but this is a good time to mention two things.

1. I’d consider setting up a filter (maybe even using the `filter` function!) to determine how many “Negatives” are required to make up a “bad email”.
2. You can actually leverage the SentimentTrees instead of the Sentiment class and get more details (such as “Error predictability”, or how likely we are to be wrong about this classification).

###### Sarcastic Mail

```clojure
(get-sentiment "Oh, your product is sooooo good. I just love that it breaks down on me all the time, and the bugs really come of as extra features and not a shitty user experience. I'm sooooo thankful that you guys are around.")
("Positive" "Negative" "Negative")

```

This is one that I was excited. The tone is positive although it’s littered with sarcasm and our code picks up on that. It realizes the negativity and (mostly) marks it as so.

###### Happy Mail #2

```clojure
(get-sentiment "You guys are doing a great job! Keep up the great work!")
("Positive" "Very positive")

```

You’ll notice in this one our first “Very positive”. Indeed, there is a “Very positive” and a “Very negative” that can be a possible outcome (it’s a 1-5 rating scale, actually). This granularity is nice!

###### Full Code

The code for this is rather small, so I’ve decided to include it all here for your enjoyment! Hope you were able to learn something new!

```clojure
(ns nlp.core
  (:import (edu.stanford.nlp.pipeline Annotation StanfordCoreNLP)
           (edu.stanford.nlp.sentiment SentimentCoreAnnotations$SentimentClass)
           (edu.stanford.nlp.ling CoreAnnotations$SentencesAnnotation)
           java.util.Properties))

(def pipeline "tokenize, ssplit, pos, lemma, parse, sentiment")

(defn build-nlp
  "Builds a Stanford NLP object"
  []
  (let [p (Properties.)]
    (.put p "annotators" pipeline)
    (StanfordCoreNLP. p true)))

(defn- annotate-text
  "Runs the given text through the NLP pipeline"
  [text]
    (.process (build-nlp) text))

(defn- get-sentiment
  [anno-sentence]
  (.get anno-sentence SentimentCoreAnnotations$SentimentClass))

(defn get-sentiment
  [text]
  (-> text
      annotate-text
      (#(.get % CoreAnnotations$SentencesAnnotation))
      (#(map get-sentiment %))))

```
