---
title: "Something NLP-ish in Clojure"
date: 2018-07-17
status: publish
permalink: /something-nlp-ish-in-clojure
author: "Brad Cypert"
type: blog
id: 39
category:
  - clojure
  - NLP
tags:
  - bayes
  - classifier
  - clojure
  - nlp
description: "Clojure can leverage existing JVM libraries to build applications that handle a variety of features, including NLP. In this blog post, we\'ll use a Bayestian classifier to classify a small dataset of lyrics and then determine which artist would be most likely to write lyrics that we produce."
---

**I started writing this article almost 2 years ago. While some things have changed (interests, time, priorities), I thought about this the other day and thought it was too neat to just let die. I came back into this article today and tried to fill out a few of the lesser detailed areas and decided to just hit publish to ensure the code, thoughts, and process was shared with you all. Sorry that it’s not of my usual quality.**

<del>
  Hey all! I haven’t written anything in awhile and wanted to jump back in with
  something fun and cool, but first an apology — I haven’t had much time to
  write anything due to me losing a bit of interest in Clojure. I’ve had a few
  issues with the language lately (another post, maybe?) and decided to explore
  Rust with the hopes of my complaints being alleviated. Sadly, the grass isn’t
  always greener and I’m deciding to stick with Clojure for the time being.
</del>

I left the above for prosperity but most of my efforts at this time are focused on Kotlin and Android, with some spare efforts going to Scala and Clojure.

#### A Bayesian Classifier for Song Lyrics

I’ve been spending a **lot** of my recent time exploring Natural Language Processing. So today, I’m sharing with you a fun little project that was inspired by something I found online written in Python. We’re analyzing the lyrics of a few popular bands and then asking the user to input a few lyrics of their own. Finally, we inform the user which Artist (based off the lyrics we have analyzed) is most likely to use the user’s input in their song.

#### Text files for Lyrics

I’m storing the lyrics in text files for simplicities sake. We’ll write code to trim and clean these files as we process them, but if you look at the source code, you’ll also notice that the lyrics aren’t separated by blank lines or anything that you’d get from a standard copy/paste job.

The songs and artists that I’m using for this exercise (but feel free to use your own!) are the following :

- Heat of the Moment by Asia
- War Pigs by Black Sabbath
- Peace of Mind by Boston
- I Believe in a Thing Called Love by The Darkness

_Side bar: If you haven’t heard all of these songs, you should definitely look them up. They’re classics and are very powerful works of art.  
Side bar#2: I’m not including the lyrics here as I do not own them or have the right to them, you’ll have to look up your own lyrics!_

#### I Believe in a Thing Called Code

Alright, let’s get to it! I’m going to break the code up piece by piece and talk about each block.

```clojure
(ns clj-bayes.core
  (:gen-class))

(def test-data {
   :asia          (slurp "resources/asia-heat-of-the-moment.txt")
   :black-sabbath (slurp "resources/black-sabbath-war-pigs.txt")
   :boston        (slurp "resources/boston-peace-of-mind.txt")
   :the-darkness  (slurp "resources/the-darkness-i-believe.txt")})

```

Nothing crazy here, we’re defining a map of test data and slurping that text from the filesystem. **You may need to change the resource paths in your project.**

```clojure
(defn- clean-string [s]
  (-> s
      (clojure.string/lower-case)
      (clojure.string/replace "n" " ")
      (clojure.string/replace #"[^A-Za-z0-9 ]" "")))

```

Next, we’re defining a function that’ll help us clean the text input from these files. We’re taking in that string that we slurped, and piping it through the following transformations:

- Lowercasing the string
- Replacing line breaks with spaces
- Removing special characters (because some people write lyrics like “Yeah!!!!!!!!!”)

```clojure
(defn- clean-data [test-map]
  (let [d (for [[k v] test-map] [k (clean-string v)])]
    (into {} d)))

```

This function takes the entire map of test data that we defined earlier and calls the above function (clean-string) on all of the values. It takes this cleaned data, and shoves it into a new map for us and returns that.

#### The NLP Part

Alright, we’re getting into the NLP part now. Now’s a good time to tell you that we’re doing a Naive Bayes classification here, so it’s not 100% accurate but should be close. This form of classification is commonly used to classify emails as spam or not. As with most forms of text classification, the more data you shove into your test-set, the more accurate it will be.

The algorithm that we’ll be using for this example is written like so:  
![Probability of X being of Class TODO]()

```clojure
; Given 4 bands with equal representation, we have a 1/4 chance.
(defn- get-probability-of-single-band []
  (/ 1 (count (keys test-data))))

```

Next, we define a function that calculates the probability of the song lyrics being from a specific band. This is really straightforward for us, as we only have four songs from four unique bands, so a one-in-four chance.

```clojure
(defn- get-probability-of-word-for-band-song [w t]
  (let [d (for [[k v] t]
            [k (frequencies (clojure.string/split v #"s+"))])
        probw (map (fn [[k v]] {k (get v w)}) d)]
    probw))

```

```clojure
(defn- get-total-word-count-for-band-songs [t]
  (let [d (for [[k v] t]
    [k (count (clojure.string/split v #"s+"))])]
  d))

(defn- get-probs [input times total]
  (let [times (into {} times)]
    (println times total input)
    (map #([input % total]) (vals times))))

```

#### Putting it all together

Finally, we’ll need to pipe together all of the functions that we’ve written. We’ll read from the console and then sanitize that a bit, and finally figure out what band is most likely to say the words you gave us, based off of the bayes implementation that we’ve written above.

```clojure
(defn -main
  [& args]
  (println "Enter some text and I'll tell you which band is most likely to say it [Asia, Black Sabbath, Boston, The Darkness]")
  (let [data (clean-data test-data)
        n (read-line)
        inputs (clean-string n)
        inputs (clojure.string/split inputs #"s+")
        band-prob (get-probability-of-single-band)
        times-appeared (map #(get-probability-of-word-for-band-song % data) inputs)
        total-word-count (get-total-word-count-for-band-songs data)
        word-prob (map get-probs inputs times-appeared total-word-count)]
    (println word-prob)))

```

#### Final Code

Here’s all the code together, feel free to copy/paste!

```clojure
(ns clj-bayes.core
  (:gen-class))

(def test-data {
   :asia          (slurp "resources/asia-heat-of-the-moment.txt")
   :black-sabbath (slurp "resources/black-sabbath-war-pigs.txt")
   :boston        (slurp "resources/boston-peace-of-mind.txt")
   :the-darkness  (slurp "resources/the-darkness-i-believe.txt")})

(defn- clean-string [s]
  (-> s
      (clojure.string/lower-case)
      (clojure.string/replace "n" " ")
      (clojure.string/replace #"[^A-Za-z0-9 ]" "")))

(defn- clean-data [test-map]
  (let [d (for [[k v] test-map] [k (clean-string v)])]
    (into {} d)))

; P(Band | word) =

; Given 4 bands with equal representation, we have a 1/4 chance.
(defn- get-probability-of-single-band []
  (/ 1 (count (keys test-data))))

(defn- get-probability-of-word-for-band-song [w t]
  (let [d (for [[k v] t]
            [k (frequencies (clojure.string/split v #"s+"))])
        probw (map (fn [[k v]] {k (get v w)}) d)]
    probw))

(defn- get-total-word-count-for-band-songs [t]
  (let [d (for [[k v] t]
            [k (count (clojure.string/split v #"s+"))])]
    d))

(defn- get-probs [input times total]
  (let [times (into {} times)]
    (println times total input)
    (map #([input % total]) (vals times))))

(defn -main
  [& args]
  (println "Enter some text and I'll tell you which band is most likely to say it [Asia, Black Sabbath, Boston, The Darkness]")
  (let [data (clean-data test-data)
        n (read-line)
        inputs (clean-string n)
        inputs (clojure.string/split inputs #"s+")
        band-prob (get-probability-of-single-band)
        times-appeared (map #(get-probability-of-word-for-band-song % data) inputs)
        total-word-count (get-total-word-count-for-band-songs data)
        word-prob (map get-probs inputs times-appeared total-word-count)]
    (println word-prob)))

```

Once again, sorry that this isn’t of the best quality. I just did not want to leave this post unposted. Thanks for reading!
