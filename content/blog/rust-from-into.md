---
title: "From and Into in Rust"
date: 2022-10-23
status: publish
permalink: /rust-from-into
author: "Brad Cypert"
images:
  - rusted-lock.jpg
type: blog
category:
  - rust
tags:
  - rust
description: "Rust's trait system is like a breath of fresh air when compared to some of more recent language forays. One of my favorite things about Rust and it's trait system is how the From and Into traits work."
versions:
    rust: "2018"
---

Rust's trait system is like a breath of fresh air when compared to some of more recent language forays. One of my favorite things about Rust and it's trait system is how the From and Into traits work.

The `From` trait is a trait that you can implement on your own types, but [its also implemented on a few existing types](https://doc.rust-lang.org/stable/std/convert/trait.From.html#implementors), too. `From` allows you to specify code to generate something of type X from something of type Y. For example, the standard library implements `impl From<&'_ str> for String` which allows you to generate a `String` from a `&str`.

You're also able to implement From for your own types. For example, you may implement `From<String> for Email`. This would allow you to generate an email from a String.  Let's go ahead and implement that now (pardon the contrived example).

```rust
struct Email {
    value: String,
}

impl From<String> for Email {
    fn from(item: String) -> Self {
        Email { value: item }
    }
}
```

## But how is From used?

Using from actually has a few different options. Let's follow along from our above example that uses the email struct that we've defined.

```rust
fn main() {
    let my_email = "brad@example.com";
    let example1 = Email::from(my_email);
    let example2: Email = my_email.into();
}
```

You'll notice two different examples here. We can explicitly use the `from` method that we've implemented on our Email, however, we can also use `.into()` -- but there's a catch. `into()` cant be inferred. Imagine we have multiple implementers of `From<String>` -- would it create an Email, an Address, or something different? We have to explicitly annotate the type of the variable that the `into()` is being stored in. This helps the rust compiler figure out which `From` implementation is being called. Technically, we _may_ not have to annotate the type if the compiler can figure it out on its own, but at the time of writing, the compiler seems to need help here.

## Into?

A natural question at this point is where is that "into" method defined? The Rust docs do a great job explaining this, so [I'll share what they have here](https://practice.rs/type-conversions/from-into.html):

> The From and Into traits are inherently linked, and this is actually part of its implementation. It means if we write something like this: impl From<T> for U, then we can use let u: U = U::from(T) or let u:U = T.into().

Because the Into trait is linked and is a reciprocal trait, it will automatically be implemented for types that implement `From`.

You're free to use `into()` and `from()` both! It's ultimately up to you to decide which one feels the most expressive to your code and that's the one I'd recommend using!

## Two traits? Which to implement?

If both of these traits exist and are reciprocals, a natural question is which one do I implement? The answer is `From`. Implementing `From` will generate the `Into` implementation for you, but the inverse is not (to my knowledge) true.

## Trys

`From` and `Into` have `TryFrom` and `TryInto` (respectively) counterparts. You're able to implement `TryFrom` just like you would `From` and `TryInto` will be generated for you. Our email example is a great one here -- there's a good chance that String _isn't an email!_ Let's go ahead and implement TryFrom so we can return a Result with our Email type.

```rust
use std::convert::TryFrom;
use std::convert::TryInto;

struct Email {
    pub value: String,
}

impl TryFrom<String> for Email {
    type Error = ();

    fn try_from(item: String) -> Result<Self, Self::Error> {
        if item.ends_with(".com") {
            Ok(Email {
                value: item
            })
        } else {
            Err(())
        }
    }
}

fn main() {
    let email: Result<Email, ()> = String::from("brad@example.com").try_into();
    println!("{}", email.unwrap().value);
}
```

As you can see, `TryFrom` is nice when theres a possibility that the conversion fails. The alternative with using `From` is to either allow non-email Strings to be used in our Email struct or to panic (and you probably dont want to do this).

Hopefully this helps explain the `From` and `Into` traits, as well as `TryFrom` and `TryInto`.