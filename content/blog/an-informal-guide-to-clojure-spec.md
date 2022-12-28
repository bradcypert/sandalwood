---
title: "An Informal & Practical Guide to Clojure.Spec"
date: 2017-05-14
status: publish
permalink: /an-informal-guide-to-clojure-spec
author: "Brad Cypert"
excerpt: ""
type: blog
id: 53
category:
  - clojure
tags:
  - clojure
  - spec
post_format: []
description: "Clojure's spec allows you to declaratively define specifications that you use in your code for numerous things such as checking validity and more!"
---

Hello again! No witty intro this time, I’ve just been working with Clojure 1.9-alpha recently, and have decided to write about Clojure spec and some of the features it offers. Let’s get to it!

**Note: There’s a lot to Clojure Spec. I’m going to cover what I consider to be the practical aspects, or the aspects that I commonly use. My goal is to make this light and comprehensible.**

#### What is Spec?

Clojure’s spec is a core part of the Clojure library as of Clojure 1.9. It allows you to declaratively define specifications that you use in your code for numerous things such as checking validity, conforming objects to a spec, or even automated test generation. Let’s talk about writing a spec.

#### Getting Started With Spec

To get started with Clojure’s spec library, you’ll need to make sure you’re using Clojure 1.9-alpha or higher. You can include it in your leiningen project like so `[org.clojure/clojure "1.9.0-alpha16"]`.

Then you can leverage it in your namespace like so:

```clojure
(ns spec.demo
  (:require [clojure.spec.alpha :as spec]))
```

#### Writing a Spec

Now that we’ve added Spec to our project, we can start writing our first spec. Let’s create a simple spec definition that validates that a symbol resolves to a string.

```clojure
(spec/def ::id string?)
```

Indeed, it is that simple. We can now leverage that spec definition in our code, for example, to check validity.

```clojure
(spec/valid? ::id "ABC-123")
```

Alright, you’re probably thinking “But Brad, we can just use `(string? "ABC-123")`“, and you’re totally right. However, you get two key benefits from using Clojure’s Spec: You can check validity against one singular interface (`valid?`) **and** you can compose spec definitions. That’s right. Composition.

#### Composing Spec Definitions

Perhaps we want to allow the id to be an integer or a string that meets a certain regex. We can compose two different specs to create an applicable spec. In this case, we’ll define a spec for the integer and one for the regex and combine them using `spec/or` and `spec/and`.

```clojure
(def id-regex #"^[0-9]*$")
(spec/def ::id int?)
(spec/def ::id-regex
  (spec/and
    string?
    #(re-matches id-regex %)))
(spec/def ::id-types (spec/or ::id ::id-regex))
```

Now we can check the validity like so:

```clojure
(spec/valid? ::id-types "12345")
(spec/valid? ::id-types 12435)
```

You’re probably thinking “This is cool, but I’m a strong independent Clojure developer and I use maps. How do I make this work with maps?”

![But wait, we need to go deeper](http://i3.kym-cdn.com/photos/images/facebook/000/531/557/a88.jpg)

And in fact, we can go deeper. We can leverage `spec.keys` to compose a map specification built off of existing specifications. Let’s imagine we have a map for representing a developer that looks like this:

```clojure
{::name "Brad" ::age 24 ::skills '()}
```

Let’s define some specs for this map!

```clojure
(spec/def ::name string?)
(spec/def ::age int?)
(spec/def ::skills list?)
```

Great! This is really basic and you can make these as fancy as you like, but this will work for our example. Let’s compose a map with these values! Let’s make one more assumption though: A developer does not necessarily have to have any skills, but will have a name and an age.

```clojure
(spec/def ::developer (spec/keys :req [::name ::age]
                                 :opt [::skills]))

(spec/valid? ::developer {::name "Brad" ::age 24 ::skills '()})
```

That’ll do it! But what if we’re parsing something like JSON via Chesire? Our keys won’t be namespaced and our map will actually look like this:

```clojure
{:name "Brad" :age 24 :skills '()}
```

Oh dear, well this won’t work at all. We can modify our developer spec so that the keys required don’t have to be namespaced.

```clojure
(spec/def ::developer (spec/keys :req-un [::name ::age]
                                 :opt-un [::skills]))
```

#### Failing a validity check

One of the nice things about spec is that it offers you an actual error message (Yes, clojure can do real error messaging) when a value fails to meet a spec. You can ask Clojure to explain the issue using `spec/explain`.

```clojure
(spec/explain ::id-types "Wrong!")
```

#### What the Heck is with the Double Colon?

If you haven’t used the double colon to declare your keywords before, Clojure’s spec is pretty adamant about using it, so you’ll have to use it more now.

Clojure’s keywords are defined as a word prefixed with a colon. Words prefixed with two colons are namespaced keywords. If we have a namespace named ‘spec.demo’, a `:word` resolves to `:word`, however a `::word` resolves to `:spec.demo/word`

#### The Registry

Spec does something interesting with all of the definitions that you create. It actually stores them into a global registry when you use `spec/def`. Now, these globals are namespaced so you can have `::id-types` in a `foo` namespace and `::id-types` in a `bar` namespace.

If you don’t want to use the registry, you can actually avoid defining the spec and just check the validity directly.

```clojure
(spec/valid int? 1234)
```

#### Test.Check

You’re a savvy Clojure Developer. You’ve already added `[org.clojure/test.check "0.9.0"]` to your dev dependencies and you’re using it in your application, but you want to leverage the awesome integration with Clojure’s Spec, too. You’ll start by requiring `[clojure.spec.gen.alpha :as gen]` in your namespace.

We can then leverage generation with the same sense of composition as a spec definition.

```clojure
(gen/generate (spec/gen int?))
> 612
```

**Note: The value with be random**.

```clojure
(gen/generate (spec/gen ::developer))
> {:spec.demo/name "A1s41l"
   :spec.demo/age 9134
   :spec.demo/skills '()}
```

You can use these in your tests and leverage your tests as a way to measure the quality of your specs. They compliment each other to help you write better code!

#### Read the Docs

There is so much more to Clojure Spec, but these are the parts that I love and use regularly. A declarative form to validate maps or even simple values is a wonderful addition to Clojure and hopefully you’ll end up using it, too! You can find the official guide for Clojure’s spec [here](https://clojure.org/guides/spec).
