---
title: "KNN: My Nearest Neighbors"
date: 2017-06-03
status: publish
permalink: /k-nearest-neighbors
author: "Brad Cypert"
excerpt: ""
type: blog
id: 58
category:
  - algorithms
  - clojure
  - machine-Learning
tags:
  - clojure
  - knn
  - machine-learning
post_format: []
description:
  - "Thanks for tuning in for another awesome blog post! In this post, we're going to cover KNN and it's implementation in Clojure!"
_yoast_wpseo_title:
  - "KNN - My Nearest Neighbors"
---

Thanks for tuning in for another _fantastic_ **awesome** `hardcore` <del>slippery</del> blog post! In this post, we’re going to cover KNN and it’s implementation in Clojure!

#### What is KNN?

KNN (K-Nearest Neighbors) is simply an algorithm, but you probably knew that at this point. For many, KNN is a terrifying first step into a domain that they’re often not too familiar with — machine learning. That being said, KNN gets looped into several much more complex things by categorizing it like so. Specifically, they get elevated to the same complexity of Neural Networks. KNN is not a neural network, and in fact is simply a classification algorithm, similar conceptually to Voronoi diagrams or even Bayes classifiers.

#### 6 Steps to KNN

KNN is a really simple algorithm that can be broken down to a few simple steps. We’ll work with a simple two-dimensional plane (X,Y coordinates) to keep the algorithm simple.

1. Group and normalize your starting/training data (may or may not be needed)
2. Define what data points are relevant to classification distance
3. Calculate distance between each individual point and the query point then store that in list L
4. Sort list L
5. Grab the K first items from list L
6. Determine the most common “class” in the first K items of list L

For the sake of our project, let’s assume a single data point looks like this: `pos` is a pair of integers describing the data point’s position on our plane. Class is the class of that data point, in this case, we’re using “Windows”, “OSX” or “Unix”. For our data set, `:pos` is `[city-blocks-up-or-down, city-blocks-left-or-right]` where `[0,0]` is my apartment. We have now done Step #2 `Define what data points are relevant to classification distance`.

```clojure
{
  :pos [4 9]
  :class "Windows"
}

```

In this case, we’re plotting the location and classification of my actual neighbors in San Francisco, and we’ll be able to make a decent estimate of whether or not my new neighbor is more likely to perfer a Windows, OSX, or Unix machine.

Here’s our training set defined in Clojure:

```clojure
(def training-set
  [{:pos [ 2  0] :class "OSX"}
   {:pos [ 1  3] :class "Windows"}
   {:pos [-1  0] :class "Unix"}
   {:pos [-9  1] :class "Unix"}
   {:pos [ 8 -8] :class "OSX"}
   {:pos [ 4  1] :class "OSX"}
   {:pos [ 0  0] :class "OSX"}
   {:pos [ 4  2] :class "Unix"}
   {:pos [ 2 -3] :class "OSX"}
   {:pos [ 8 -3] :class "OSX"}])

```

#### Going the Distance / Going for Speed

Next, we need to define a function to determine the distance between two points. For us, this is really straightforward! It’s the distance between the X/Y coordinates in the `:pos` vector. You can write your own distance formula, but there’s a lot of really great ones out there already and each with their pros and cons (I’ll let you dig into that on your own). For us, we’ll simply used the Euclidean distance formula.

![]()

Let’s go ahead and define this in Clojure:

```clojure
(defn euclidean-distance
  [vec1 vec2]
  (Math/sqrt
    (reduce + (map #(Math/pow (- %1 %2) 2) vec1 vec2))))

```

#### Getting the Nearest Neighbors

Awesome, with step #3 out of the way, we can move on to step #4 and #5! Now let’s define the `nearest-neighbors` function. This function will take in our sample data, our query data point, and then `k`. We’ll associate the euclidean distance to the data point as `:score` and then sort by `:score`.

```clojure
(defn nearest-neighbors
  [samples query k]
  (take k
    (sort-by :score
      (map
        #(assoc % :score (euclidean-distance query (:pos %)))
        samples))))

```

#### The Classifier

Alright, we’re almost done! Our final step is to Determine the most common “class” in the first K items of list L. We can do this by allowing the K Nearest Neighbors to vote on our query item’s class based on their own class. We can get the `frequencies` of each classification and bind that to `vote-freq`, then we can select the highest valued key from that map!

```clojure
(defn knn
  [samples query k]
  (let [votes (nearest-neighbors samples query k)
        vote-freq (frequencies (map :class votes))]
        (key (apply max-key val vote-freq))))

```

#### Putting It All Together

The final product for this looks something like this!

```clojure
(ns knn.core
  (:gen-class))

(defn euclidean-distance
  [vec1 vec2]
  (Math/sqrt
    (reduce + (map #(Math/pow (- %1 %2) 2) vec1 vec2))))

(defn nearest-neighbors
  [samples query k]
  (take k
    (sort-by :score
      (map
        #(assoc % :score (euclidean-distance query (:pos %)))
        samples))))

(defn knn
  [samples query k]
  (let [votes (nearest-neighbors samples query k)
        vote-freq (frequencies (map :class votes))]
        (key (apply max-key val vote-freq))))

(def training-set
  [{:pos [ 2  0] :class "OSX"}
   {:pos [ 1  3] :class "Windows"}
   {:pos [-1  0] :class "Unix"}
   {:pos [-9  1] :class "Unix"}
   {:pos [ 8 -8] :class "OSX"}
   {:pos [ 4  1] :class "OSX"}
   {:pos [ 0  0] :class "OSX"}
   {:pos [ 4  2] :class "Unix"}
   {:pos [ 2 -3] :class "OSX"}
   {:pos [ 8 -3] :class "OSX"}])

(defn -main
  [& args]
  (let [query [4 2]
        k 4]
    (println query "-" (knn training-set query1 k))))

```

We’ve added a `-main` function to just stub out some test data. You can remove this in favor of tests, but it’s getting late so I wanted to wrap up the post!

#### Let’s Test It

Alright, we can `lein run` our application and get some data back. Given our `-main` function that we’ve defined, we’re going to classify coordinates (4,2) based on 4 nearest neighbors. If you run this program as-is, you should get `[4 2] - OSX` as your output! Congratulations, you just wrote the KNN algorithm using Euclidean distance in Clojure!

#### Next Steps

From here, you can actually plot the new point into your training set and use that for the next query! Any questions or concerns? Let me know below!

P.S. – Tired of my dank blog formatting for Clojure code? Me too! For now, you can [find the source for this project here](https://github.com/bradcypert/knn-clojure/blob/master/src/knn/core.clj).

Eventually, I’ll fix my weird syntax formatting, but I’m probably just going to rewrite my ghost theme or move to Jekyl.
