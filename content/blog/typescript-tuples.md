---
title: "TypeScript Tuples"
date: 2020-04-09
status: publish
permalink: /typescript-tuples
author: "Brad Cypert"
excerpt: ""
type: blog
id: 3405
thumbnail: /green-artichoke-on-gray-round-plate-3647046.jpg
category:
  - TypeScript
tags:
  - tuple
  - typescript
post_format: []
---

[TypeScript offers a plethora of types](https://www.typescriptlang.org/docs/handbook/basic-types.html) for developers to leverage, but some of the types may be ones that you’re unfamiliar with. Take the tuple, for example. [JavaScript doesn’t have a concept of tuples](https://stackoverflow.com/questions/4512405/javascript-variable-assignments-from-tuples), so figuring out how and when to use one might feel tricky. Thankfully, Tuples are pretty simple and are used by popular frameworks, like React.

## What is a tuple?

Tuples allow you to express an array with a fixed number of elements of which each element may be of a different type. For example, an array of two elements where the first is a string and the second is a number can be represented with a tuple. A tuple could also be used to express an array containing three elements — a string, a boolean, and an object respectively.

The key takeaway here is that tuples (in TypeScript) are simply arrays with predetermined types existing at specific indexes.

Other languages treat tuples as their own structure and are not backed by an array. TypeScript chose to have tuples act as an extension of an array, which allows us to leverage existing methods for arrays on tuples. In my opinion, this also helps reduce the complexity of learning tuples for newer developers.

## How to declare a tuple in TypeScript

Tuples are extremely easy to leverage in your TypeScript code. For example, let’s say that we want a tuple containing a function, and the number of arguments that you can pass to that function. We could represent that example like so:

```typescript
let myTuple: [(...args: any[]) => any, number];
```

This is a pretty interesting type. The element in the tuple has to be a function that takes any number of arguments and returns anything. The second parameter has to be a number. If we fail to uphold these requirements, the typescript compiler will yell at us.

```typescript
let myTuple: [(...args: any[]) => any, number];

// this is valid
myTuple = [(x, y, z) => x + y + z, 2];

// this isn't
myTuple = ["Hello World", { foo: "bar" }];
```

## When would you use a tuple?

Tuples pose an interesting dilemma. Why not use an array? Wouldn’t it be more meaningful to use an object so that there are keys labeling what they values are?

You could use an array, but you would lose some type safety. For the above example, the type in the array would look like this:

```typescript
Array<((...args: any[]) => any) | number>
```

Which, aside from looking hideous, is actually a very misleading type. This represents an array where any element of that array can be a function or a number, which is not what we’re trying to represent. Naturally, a tuple trumps an array here.

But what about an object? This is a more difficult question to answer as the answer is far more subjective than an array. Using the same tuple example from above, we could represent that structure as an object like so:

```typescript
{ fn: (...args: any[]) => any, argCount: number };
```

This will allow us to reference the function via the `fn` property and the number of arguments that this function accepts via `argCount`. Fairly straight forward, but it could lead to unnecessarily verbose code. Let’s take a look at how React uses tuples and compare the code to what it would look like with objects intead.

## How React uses tuples

React recently pushed out an API update that allows developers to leverage hooks in their code. [These hooks, such as `useState`](https://reactjs.org/docs/hooks-state.html) and `useEffect` allow people to manage state and lifecycle events in newer, and in my opinion — cleaner, ways. These hooks promote composition over inheritance (of which I’m all for!) but most relevant for this blog post, some of the hooks return tuples.

The `useState` hook returns a tuple where the first element is the current state and the second element is a function to update the current state. Let’s look at an example.

```typescript
const [counter, setCounter] = React.useState(0);
```

You’ll notice that, because tuples are arrays under the hood, we can destructure them just like we would an array. I would argue that this syntax is cleaner than if the hook was to return an object.

```typescript
const { value, updateValueFn } = React.useState(0);
```

If you’re familiar with destructuring, you’ll also immediately recognize that, in the tuple example, we can name our destructured parameters whatever we want — they’re index-based. However, In the object example, we have to name them based on the keys provided by React in the returned object. Let’s look at a more complicated example to see where this really becomes problematic. With tuples:

```typescript
const [bradsAge, setBradsAge] = React.useState(0);
const [megansAge, setMegansAge] = React.useState(0);
const [stevesAge, setStevesAge] = React.useState(0);

setBradsAge(26);
setMegansAge(22);
setStevesAge(49);
```

If we were to try and write them same thing in a world where `useState` returned objects, we’d end up with something like this:

```typescript
const { value, updateValueFn } = React.useState(0); // this is for brad
const megan = React.useState(0); // we cant destructure anymore because we've already defined those consts
const steve = React.useState(0);

updateValueFn(26);
megan.updateValueFn(22);
steve.updateValueFn(49);
```

With this example, its easy to see how the tuples provide a much cleaner API to work with!

## One last note

The first time that I had ever used a tuple was in python, long ago. I felt that I needed to return multiple values from a function, and I didn’t have the luxury of easy-to-use objects like in JavaScript. I had the option to use a list, a dictionary, or a tuple (or make my own class for a return type, but that seemed like overkill at the time). The dictionary left too many questions on the table. Could more data be added at a later date? How do we maintain an API where the keys are simply strings?

The list felt wrong for similar reasons. It left way too many questions open. How many items does a list have? Well, however many I tell it to have. As someone consuming my code, that leaves a lot of uncertainty. If you called my function, could you be sure that it was always going to return a list with two elements? What if a conditional path added extra elements? What if they weren’t added to the end of the list?

The tuple felt just right. I’ll be honest, I don’t find myself writing tuples often, but when I find myself needing to return multiple values from a function, a tuple is where I go to first.
