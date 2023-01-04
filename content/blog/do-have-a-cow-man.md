---
title: "Do have a cow, man"
date: 2023-01-04
status: publish
permalink: /do-have-a-cow-man
author: "Brad Cypert"
type: blog
images:
  - pexels-cow.jpg
tags:
  - rust
  - cow
description: "Let's start by clearing the air. Rust has cows. These cows don't moo, can't be milked (or can they?), and can't even be tipped. In fact, theses cows aren't cows at all -- they're Cows (Clone On Write)."
---

Let's start by clearing the air. Rust has cows. These cows don't moo, can't be milked (or can they?), and can't even be tipped (please don't tip cows). In fact, theses cows aren't cows at all -- they're Cows (Clone On Write).

```rust
pub enum Cow<'a, B> where
    B: 'a + ToOwned + ?Sized,{
    Borrowed(&'a B),
    Owned(<B as ToOwned>::Owned),
}
```

The Cow type is a smart pointer used to enable "Clone on Write" functionality for a piece of data. A Cow allows you to provide immutable access to borrowed data and can clone the data lazily if you try to mutate that data or pass ownership. Under the hood, the Cow is just an enum with a generic type B where B has a lifetime of `'a` and B implements ToOwned and + ?Sized. The Cow can either be Borrowed or Owned.

ToOwned is a trait that implementors use to specify that their type can be converted from borrowed data to owned data. While the ToOwned trait doesn't definite _how_ that's done, its usually by cloning the borrowed data and giving the caller ownership of the cloned data. 

`?Sized` is a bit of a weirder case. `?Sized` is a trait that says "This type may or may not be sized." This means that since we can not guarantee that B's size is known at compile time. 

Additionally, Cow also implements Deref, allowing you to access non-mutating methods directly on the data enclosed by the Cow.

## How and When to use a Cow?

An excellent example of when to use a Cow is when you're working with some data that may or may not be changed by your function. Possibly the simplest version of that is a function that replaces characters of a string. We can achieve this without a Cow like so:

```rust
fn replace_world(s: &str) -> String {
  s.replace("World", "Planet")
}
```

Sure this example is extremely simple, and simple is always good so maybe we should just leave this as is (or simply inline the `s.replace()` call). However, what if there's _not_ "World" in that string? What happens if the string is "Hello Brad" and not "Hello World". Well, let's take a look at the signature for `replace` to find out.

```rust
pub fn replace<'a, P>(&'a self, from: P, to: &str) -> String
where 
  P: Pattern<'a>,
```
We can see that `replace` returns a `String`. `String` is heap allocated because its growable (non-fixed size) so even if our replace function doesn't actually replace anything, we're making a new allocation on the heap for the result. Instead, we can return a `Cow<str>`.

```rust
fn replace_world(s: &str) -> Cow<str> {
  if s.contains("World") {
    Cow::Owned(s.to_string().replace("World", "Planet"))
  } else {
    Cow::Borrowed(s)
  }
}
```

In this example, we actually check to see if our string contains "World" before replacing it. If we do need to replace it, we can Own that string with our Cow enum. If we don't need to modify the string, we can simply borrow it. This helps us avoid unnecessary allocations. This example may feel a little contrived compared to standard application development but really showcases a simple but great usecase for Cow.

## Getting out of the Cow

So we have a function that returns a `Cow<str>` but at some point, we probably want to get an &str or String out of the Cow. Thankfully, this is actually really easy. We can call `into_owned()` on the `Cow<str>` which will extract the owned data from the Cow and will clone the data if it's not already owned. If the Cow is Cow::Owned, the owned data is returned without cloning.

```rust
fn replace_world(s: &str) -> Cow<str> {
  if s.contains("World") {
    Cow::Owned(s.to_string().replace("World", "Planet"))
  } else {
    Cow::Borrowed(s)
  }
}

fn main() {
  let result = replace_world("Captain World!");
  println!("{}", result.into_owned);
}
```

## Cows are ~~mooing~~ growing

Cows are getting some new features in Rust nightly. Specifically, [this issue here](https://github.com/rust-lang/rust/issues/65143) is for tracking two new methods getting added to Cows -- `is_borrowed` and `is_owned`. These nightly features can help you determine the status of a Cow.