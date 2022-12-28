---
title: "Understanding Clojure's Map & PMap"
date: 2016-07-18
status: publish
permalink: /understanding-clojures-map-pmap
author: "Brad Cypert"
excerpt: ""
type: blog
id: 25
category:
  - clojure
tags:
  - clojure
  - map
  - pmap
description: "Clojure's map is a staple of the language and used liberally throughout the language's source code.  pmap is know for being slow. Learn why now!"
versions:
  clojure: 1.7
---

Let’s be honest – Part of the reason you’re using Clojure is the higher order functions like `map`. They’re great, composable, and describe what you’re trying to do instead of defining what to do – this keeps code simple. Maybe you’ve been playing with `map` for a while now and have even tried using `pmap`. If you did, you probably noticed that `pmap` is often slower than `map`, and if you want to know why – read on.

#### What is `map`?

Before we get into `pmap` lets go ahead and clarify our understanding of `map`. There’s actually several neat use cases for `map`, some that you may not be familiar with. From their source code, _“Returns a lazy sequence consisting of the result of applying f to the set of first items of each coll, followed by applying f to the set of second items in each coll, until any one of the colls is exhausted. Any remaining items in other colls are ignored. Function f should accept number-of-colls arguments. **Returns a transducer when no collection is provided.**“_

If you’ve used `map` before, you’re probably aware of everything in the doc string with the possible exception of the bolded part – returning a transducer. We’ll also talk about the multiple collections use case before moving onto `pmap` as well.

A standard use case of map can be seen as:

```clojure
(map inc (range 10))
;(1 2 3 4 5 6 7 8 9 10)

(map #(* % 2) (range 10))
;(0 2 4 6 8 10 12 14 16 18)

```

As you can see, we take the numbers `0-9` and increment them by one in the first example. In the second, we use an anonymous function to describe how we want to multiply each value by two. But what happens if we provide multiple collections to map, perhaps with a different size?

```clojure
(map list '(:a :b :c) '(foo-bar jazz))
;((:a foo-bar) (:b jazz))

```

In the above example, map produces a list, it also creates a list from the first two items in the collections passed to it, and then from the second two items from the collections, but then it stops because there’s not a set of two values to map. This is why, in the output, you don’t see `:c` anywhere. It’s also worth noting in this example that `foo-bar` and `jazz` are symbols, but I haven’t defined them anywhere. This is valid because these bindings aren’t evaluated unless they’re needed.

Alright, we’ve seen passing in a single collection, multiple collections, but what happens if we don’t pass in a collection at all? We get a transducer.

```clojure
(def t-inc (map inc))

(transduce t-inc + (range 5))
;15

(transduce t-inc conj (range 5))
;[1 2 3 4 5]

```

Transducers can be intimidating at first, and I won’t go into them much here. For now, you can think of them as partials that describe data transformations that can be used with `transduce`. In the first example above, we take our `t-inc` transducer (which increments a value by one), and define the reducer as `+` and our collection as `(range 5)` or `0-4`. We apply the data transformation (incrementing each number by one, and reduce that down using our reducing function. Our end result is 15, because 1+2+3+4+5 = 15. In the second example, we take the same transducer and collection, but instead of reducing it down via add, we reduce it via `conj`. We increment our data set, and then reduce it into a vector.

#### What about `pmap`?

Alright, the moment you’ve all been waiting for – `pmap`, and why is it so slow?

`pmap` is the parallel equivalent for map. If you’re familiar with the concept behind hadoop, `pmap` operates behind a similar concept. Define your task, spin up threads needed, dispatch that task to a thread for each item in our collection, get the results back, and concat that all into a collection. This highlights a key concept for `pmap` – **threads**. The overhead for spinning up multiple threads can be pretty high, especially on lower end machines. In fact, the overhead often makes `pmap` slower than `map` for many operations.

You actually need a pretty intense example for `pmap` to be faster, simply incrementing the values in a collection by one isn’t a good enough example because the overhead of threads outweighs the minor operation you’re trying to perform. A better example would be something that’s computation heavy and such, `pmap` functions often do much more than `map` functions, simply to make the most of the over head. I don’t have any crazy algorithms or anything to share with you for pmap, so let’s use an example where we can “simulate” a long running computation.

```clojure
(defn slow-task [n]
  (Thread/sleep 1000)
  (+ n 10))

(time (doall (map slow-task (range 4))))
;"Elapsed time: 4008.776521 msecs"
;(10 11 12 13)

(time (doall (pmap slow-task (range 4))))
"Elapsed time: 1006.011012 msecs"
(10 11 12 13)
```

Why is it so much faster in this case? Each thread gets tied up doing “logic” (or in this case – sleeping), but when we can leverage multiple threads, we can have 4 threads sleep for one second, instead of 1 thread sleep for 1 second 4 different times. Pretty cool, right?

It’s important to keep in mind that `pmap` is semi-lazy and will only evaluate what is needed for parallel computation, but won’t realize the entire result unless/until it’s needed. Another important note – unlike `map`, `pmap` does not generate transducers.

I tried to write this post to answer the questions I had while learning `map` and `pmap`. Please let me know below if you have any other questions!
