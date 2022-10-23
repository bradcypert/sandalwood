---
title: "JavaScript: Generators"
date: 2016-07-19
status: publish
permalink: /javascript-generators
author: "Brad Cypert"
excerpt: ""
type: blog
id: 26
category:
  - javascript
tags:
  - beginner-friendly
  - Generators
  - javascript
post_format: []
_yoast_wpseo_title:
  - "JavaScript - Generators"
hefo_before:
  - "0"
hefo_after:
  - "0"
saswp_custom_schema_field:
  - ""
saswp_webpage_speakable_3050:
  - "0"
saswp_modify_this_schema_3049:
  - "0"
saswp_blogposting_speakable_3049:
  - "0"
_yoast_wpseo_primary_category:
  - "84"
wp_last_modified_info:
  - "September 6, 2020 @ 2:20 pm"
wplmi_shortcode:
  - "[lmt-post-modified-info]"
_yoast_wpseo_content_score:
  - "90"
---

One thing I’ve learned recently from Clojure (don’t worry, this post **is** about JavaScript) is that laziness is great. Lazy code is powerful code, allowing you to model things like infinite sequences or complex computations over a range of data. Without this laziness, an infinite sequence would cause a stack overflow or complex computations would bog down your performance when you may not even need to perform all those computations to begin with!

#### Enter Generators

With the latest rendition of JavaScript, developers now have access to tools to help them be lazy! Iterables and Generators. This post will cover generators, as I think they’re the most applicable out of the two, although they both are very similar. Generators let you define an algorithm for generating new values each time you request the next value from the generator. This allows us to do last-second computations or illustrate lists with infinite length.

Let’s go ahead and write a simple generator.

```javascript
function* nameGenerator() {
  yield "Brad";
  yield "Jake";
  yield "Matt";
}
```

Simple enough, right? The two things to note here are `function*` and `yield`. The asterisk in the function definition tells us that we’re making a generator. Yield, on the other hand, it’s practically a return value except that when you call this `.next()` on this generator again, you’ll pick up where you last left off.

Invoking a generator function like you would a standard function will actually return a very different result. You may expect `nameGenerator()` to return `'Brad'`, but in fact, it will return a generator object. To get the first yielded value from the generator, we call `next()` on that generator. Let’s take a look at some code.

```javascript
let names = nameGenerator();
console.log(names.next().value);
// Brad
console.log(names.next().value);
// Jake
console.log(names.next().value);
// Matt
```

You’ll notice that we’re actually printing the value property of the result of calling `next()`. That’s because `next()` actually returns an object with a `value` and a `done` property. Once the generator is out of values to yield, the done property will be true and the generator will not yield more values.

#### A More Complex Example

Alright, I guess that’s cool, right? Generators really shine once you’re doing something complex, or something that could cause – say – a stack overflow if you’re processing it all at once. What would an generator look like that counted up to infinity? Something like this:

```javascript
function* infiniteRange() {
  var i = 0;
  while (true) yield i++;
}

let infinity = infiniteRange();
```

`infinity` will never be completed. When we call `next()` we’re going to keep getting the next number in the list of real numbers. How cool is that?! We can finally evaluate sequences lazily in JavaScript!

#### More on `next()`

`next()` is the bread and butter of a generator, but there’s more to it than you’ve seen so far. `next()` actually accepts a parameter that replaces the yielded value. So if I have a statement `yield i`, and I trigger that yield via a `next()`, then call `next('foo')`, `foo` will replace the `yield i` in the generator. This sounds a bit confusing but hopefully this example will clear things up.

```javascript
function* passBack() {
  let a = yield 1;
  console.log(a);
}

let noPassBack = passBack();
let yesPassBack = passBack();

noPassBack.next(); //We yield the value 1;
// Object {value: 1, done: false}
noPassBack.next(); //We dont pass anything back
// undefined

yesPassBack.next(); // We yield the value 1;
// Object {value: 1, done: false}
yesPassBack.next("foo"); //We pass 'foo' back
// foo
```

Need a practical example? Let’s say we’re using promises. If you get a promise from `next()`, you can evaluate the promise and pass the value back into the generator using the following `next()`. This means you can essentially write generators to model code synchronously, but use the generator in an asynchronous fashion. Personally, I feel like this helps keep your main logic very clean, while delegating to the generator for the ugly asynchronous pieces.

#### Returning a Generator

By far, the most practical use for me has been creating generators via a function. Here’s a very simple example, but I think it can show you how powerful it can actually be!

```javascript
/**
 * Returns a generator for a given range of values.
 */
function range(n, l) {
  let start = l ? n : 0;
  let limit = l ? l : n;

  return (function* rangeGenerator() {
    for (var i = start; i <= limit; i++) {
      yield i;
    }
  })();
}

let oneToTen = range(1, 10);
console.log(oneToTen.next());
// {value: 1, done: false}
console.log(oneToTen.next().value);
// 2
```

By now, you should have noticed that these generators are acting a lot like iterables. In fact, if you crawl up the prototype on a generator object, you’ll see that they actually inherit from `Symbol.iterator`. This means we can actually use them as we would iterables.

```javascript
let reduce = 0;
for (let i of range(5)) {
  reduce += i;
}
console.log(i);
// 15
```

Perhaps you’re familiar with the latest Ecmascript standards and, specifically, the spread operator. You can actually use those on generators too!

```javascript
console.log(...range(5));
// 0 1 2 3 4 5
```

#### Are Generators the next great thing?

They’re certainly a great thing, but I don’t think they’re the next great thing. Mastering them could be very powerful, but the use cases for them might not be as vast as we can hope for. That being said, I believe that they’re a unqiue tool to help solve a lot of challenging problems in the world of JavaScript. What do you think? Let me know below!
