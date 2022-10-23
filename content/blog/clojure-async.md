---
title: "Introduction to Asynchronous Programming in Clojure"
date: 2016-07-15
status: publish
permalink: /clojure-async
author: "Brad Cypert"
excerpt: ""
type: blog
id: 23
category:
  - clojure
tags:
  - Async
  - clojure
post_format: []
description:
  - "Learn to use Clojure's Core.Async to your advantage! Experiment with Channels, Threads, and Buffers while building a virtual warehouse."
_yoast_wpseo_title:
  - "Building Async Processes with Clojure"
---

I’ve been writing about my favorite language, Clojure, for a while now. I’ve also been gauging your interest in Clojure and, if you’re reading this, I think you’re ready to take this relationship to the next level. Let’s talk about asynchronous code in Clojure.

#### Getting Started

If you want to follow along with the code examples, start a new project. I’m going to be using Leinengen and we’re going to name this app “warehouse”.

```bash
lein new app warehouse
```

Let’s open `warehouse/src/warehouse/core.clj` and modify it so it looks like this:

```clojure
(ns warehouse.core
  (:gen-class)
  (:require [clojure.core.async :as async
             :refer [>! <! >!! <!! go chan buffer close! alts!!]]))

(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (println "Hello, World!"))
```

The key thing to note is that we’re requiring clojure.core.async.

#### What is a warehouse?

A warehouse is a place where goods are stored. For us, we’re going to store virtual “goods” in this warehouse and then retrieve them from the warehouse when asked. This will decrease the amount of goods available in the warehouse and provide those virtual “goods” to whomever is asking for them. Pretty exciting, right?

#### Channels

To do this, we’re going to use something called a channel. A channel is similar to a queue. We can define a channel simply by saying `(def c (chan))`. We can provide an optional argument to a channel to provide a buffer size. For example `(def c (chan 10))` will give us a channel with a buffer size of 10. This means that we can not store more than 10 things in our channel at once. **If we attempt to store more than 10 things, our current thread will block**.

Let’s define our channel limit, and then define a channel. I’ll store the limit separately, as we’ll use that value in the future _(no pun intended)_ too.

```clojure
(def warehouse-capacity 10)

(def warehouse-channel (chan warehouse-capacity))
```

Awesome, we have a warehouse-channel that will act as our warehouse, and we know that the limit of items we can store in that warehouse is 10 items. Let’s define a function to populate that channel with items.

#### Populating the Channel

Our warehouse is going to be a clothing warehouse and we’re going to store `:socks`, `:shoes`, `:pants`, and `:shirt`. To make this fun, we’re going to randomize what items we have in stock. Let’s go ahead and create a map that maps a number value to each item. Then, we’ll create a private function to get a random selection of items for our warehouse.

```clojure
(def stock-map {0 :shirt
                1 :pants
                2 :socks
                3 :shoes})

(defn- generate-random-items []
  (let [items (for [x (range warehouse-capacity)] (rand-int (count (keys stock-map))))]
    (map #(get stock-map %) items)))

```

When we run generate-random-items, we should get something like this – `(:shoes :shirt :pants :shoes :shirt :shirt :shoes :shoes :socks :socks)`. Not very many pants, but that’s okay! Next we want to load a list of items into a channel. We’ll write a function to do just that! We’ll also go ahead and update our main function to call the functions we’ve written thus far.

```clojure
(defn load-items-into-channel [items channel]
  (map #(>!! channel %) items))

(defn -main [&args]
  (load-items-into-channel (generate-random-items) warehouse-channel))

```

`>!!` is a pretty weird symbol. Lets break it apart, piece by piece. `>` says I’m going to be putting something INTO the channel on the right. You can remember this because it points **into** the channel on the right. `!!` says this is blocking.

So what `>!!` does is that it takes the item we provide it, and one at a time put them onto the channel. Each one blocks the previous one. You’re probably thinking if we have a block put, then we have a blocking take, right? Rightfully so, and yes, we do! The symbol for a blocking take is `<!!`. You can remember this one because it’s funneling values **out** of the channel to the right of it.

#### Parking vs Blocking

So we’re able to create this list of items, and load it into our channel. If we want, we can take the channel and pull items from it now, too. If you’re using a REPL, go ahead an try `(<!! warehouse-channel)`. You should see something like `:shoes`. If you keep using `<!!` you’ll see more results until you feel like your computer has frozen. If you get to this point, `CTRL+C` will take you out of the blocking state in the REPL.

The reason that the REPL would block is simply because we told it to. We said “take from this channel and block until we get the result” (`<!!`). If there’s nothing to take, we’ll block the current thread and wait for something to exist in that channel. Once something does exist, we’ll retrieve it from the channel and be unblocked. This is standard async behavior.

But there is an alternative. It’s called – Parking. There’s one thing left to understand before we can get into parking, however: All these channels are ran as processes which run on threads.

Parking is available when you aren’t adding to or reading from channels on the main thread, but instead delegating these processes to a thread pool. What’s the difference exactly? When we were blocked in the REPL earlier, we had locked that thread, and it patiently waited for something to exist in that channel. With Parking, we’re able to tell our thread “Hey, wait for this channel to have something to take, but you can do other stuff in the meantime.” We can use the `go` macro to help take care of this for us.

One of the key differences with the `go` macro is the ability to use `>!` and `<!`. These are only usable within a `go` block, and they signify that you’d like to park the thread instead of block the thread. If you park the thread, the thread can be relieved to work on other tasks in the mean time. Most of the time, you’ll want to use `>!` and `<!` when you’re in `go` block instead of `>!!` and `<!!`. That being said, you’re free to use both types in a `go` block, too!

#### More on Go

Hopefully this all makes sense, but when I first started doing async, I wasn’t sure when to use Go blocks at all. Think of this real life example – When you wait for the mail, you’re parking, not blocking (unless you stand in front of your mailbox and do nothing until the mail-person arrives). Realistically, you’re waiting on the mail to arrive, but you’re still able to handle other tasks like vacuuming, eating, or writing code. Once the mail arrives, you retrieve it from the mailbox, and continue what you you were doing before. Writing your async processes in this manner is a very powerful technique.

Now that we’ve loaded our items into our warehouse-channel, we’re going to make one more channel – a channel that loosely evaluates the user’s currency (making sure they’re trying to pay with a number). This channel is going to be accepting input, and deciding if it should take from the warehouse channel and give that item back to the user.

```clojure
(defn make-payment-channel []
  (let [payments (chan)]
    (go (while true
      (let [in (<! payments)]
        (if (number? in)
          (do (println (<!! warehouse-channel)))
          (println "We only accept numeric values! No Number, No Clothes!")))))
    payments))

```

Notice that we’re creating this channel via a function – We’re wanting to be able to easily create multiple payment channels in the future. We’re also setting up the expected behavior for this channel when it receives input. This particular channel will take it’s input, check if it’s a number – if it is, it’ll take and print an item from the warehouse channel we defined earlier; If it’s not a number, we’ll print a message alerting the user that we are expecting a number.

Let’s run this via our REPL and make sure it works. Output per line is commented on the following line `;`.

```clojure
(load-items-into-channel (generate-random-items) warehouse-channel)

(def incoming (make-payment-channel))

(>!! incoming 5)
;:pants

(>!! incoming :foo)
;We only accept numeric values! No Number, No Clothes!

```

So far everything is working! Great! What happens if we take until the warehouse-channel is empty though? Evaluating `(>!! incoming 5)` 10 more times results in the repl being blocked. Because this thread, that blocks (`>!!`), is trying to take from another channel, and there’s nothing to take. Let’s go ahead and press `CTRL+C` to unblock us.

Let’s make sure that if we add another item to the warehouse, we can continue to take again.

```clojure
(>!! warehouse-channel :banana)
;:banana

```

Notice how it went ahead and printed Banana? That’s because that thread was parked until it received input, and that parked thread was blocked. Now that there’s something in the channel for it to take, it will go ahead and print out the `:banana` that we just added to the warehouse! Pretty neat! We can continue to load more into our channel if we’d like and play around with it, but I want to cover a few more things and this post is already very long!

#### Alts and Buffers

Let’s change our warehouse model. We’ve clearly added fruit to the channel, but we don’t want to mix fruit and clothes, and now we want our warehouse to serve up both. We can actually make another channel, and call it banana-channel and just load it with bananas. When a user gives us a number, the payments channel is going to try to get fruit or clothes, and print whichever it gets back first. A more practical example of this would could be uploading multiple images at once, and displaying the first one that completes as a “main image” or something similar.

Let’s go ahead and define that banana-channel. It’s only going to hold three bananas and we’re going to go ahead and put into it only one banana. There’s a catch, however. Bananas can rot. We’re not worried about serving bad bananas, but if we can only hold three and we receive another, we want to throw the oldest one out to help us keep the freshest bananas in our channel. There’s a very easy way to do that – It’s called a `sliding-buffer`.

```clojure
(def banana-channel (chan (sliding-buffer 3)))

(>!! banana-channel :banana)

```

A `sliding-buffer` follows the first-in-first-out principle. If we were to put `0`, `1`, and `2` into this channel, and then put `3` into the channel as well, the items in the channel would be `1`, `2`, and `3`. There’s also a `dropping-buffer`, which does the opposite – Last-in-first-out. These buffers are particularly interesting because they **never** block their current thread on a put. They simply remove an object from the queue if you try to add beyond it’s capacity.

Alright, let’s go back to the task of serving either Bananas or Clothing when a user provides us with a number. We can actually rewrite our `make-payment-channel` function using the `alts!!` symbol. What `alts!!` does is this – “Given a vector of channels, block the current thread until I can take from any of the channels. I will take an item from that channel and return \[item channel-taken-from\]”.

So basically, we can leverage `alts!!` to take whatever item we can get first. Sometimes this will be bananas, sometimes this will be clothing. Regardless, when a user gives us money, we’re going to try to give them whichever we can take first. If a channel is empty, you can bet that we’re going to take from the other channel every time (unless it’s also empty, then we’ll block until there’s something in either of the channels). Let’s modify our `make-payment-channel` function.

```clojure
(defn make-payment-channel []
  (let [payments (chan)]
    (go (while true
      (let [in (<! payments)]
        (if (number? in)
          (let [[item ch] (alts!! [warehouse-channel banana-channel])]
            (println item))
          (println "We only accept numeric values! No Number, No Clothes || Bananas!")))))
    payments))
```

If we run this in the repl, and then add to the payments channel, we’ll see something like this…

**NOTE:** If you emptied out the warehouse channel, you will want to repopulate it again. You can do so using the `(load-items-into-channel (generate-random-items) warehouse-channel)` function we wrote earlier.

```clojure
(def new-payments (make-payment-channel))

(>!! new-payments 5)
;:socks

(>!! new-payments 5)
;:bananas

(>!! new-payments 5)
;:pants

```

#### Cleaning Up with Close!

Every warehouse shuts down at some point in time, maybe it’s the holidays, maybe it’s the weekend. It doesn’t really matter. What does matter is the fact that we can close any of channels at any time. The way closing works is a bit misleading though. When you close a channel, it’s not inaccessible. You’re still able to take from the channel, but you can not put anything else into the channel. Eventually, we’ll run out of things to take. If we tried to take while the channel was open and there is nothing left, we’d be blocking our current thread but if we close that channel and try to take from it while nothing is left we’ll instead take `nil` from the channel.

From our REPL, we can go ahead and `close!` our `banana-channel`.

```clojure
(close! banana-channel)

(<!! banana-channel)
;:banana

(<!! banana-channel)
;nil

```

Worth mentioning: My channel returned nil on the 2nd time because I only had 1 banana left in the channel. You should close any channels that you’re finished with. Additionally, you should never return `nil` from a channel, because that makes it very difficult to determine if you’re taking `nil` or if the channel is closed.

#### Closing Regards

I’ve done async in Clojure, Java, Scala, Python, and JavaScript (who hasn’t done async in JavaScript?) and I have to admit: I really enjoy async Clojure and JavaScript more than the others.

How does this compare to the languages you use async frameworks with? Easier? More difficult? Let me know below!
