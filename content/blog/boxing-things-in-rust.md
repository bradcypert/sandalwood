---
title: "Boxing things in Rust"
date: 2021-09-16
status: publish
permalink: /boxing-things-in-rust
author: "Brad Cypert"
images:
  - rusted-lock.jpg
excerpt: ""
type: blog
category:
  - rust
tags:
  - rust
  - boxing
  - memory-management
description: "Boxing is a practice for allocating memory on the heap. A Box is a smart pointer to a value allocated on the heap."
---

Rust's memory management can feel a bit intimidating for most developers. Rust gives you some control over whether you're allocating data on the stack or the heap and its up to you to decide where memory should be allocated.

When you allocate memory for values in Rust, that memory is allocated on the [Stack](https://en.wikipedia.org/wiki/Stack-based_memory_allocation). Memory on the Stack is allocated in a "stack frame" which contains information for the Stack's local variables and some metadata about that stack frame. When a function exits, that functions stack frame gets deallocated. This structure is a LIFO (Last in, First out) pattern for reclaiming memory.

The stack does not work for every usecase. For example, you may want to pass some memory between different functions or keep some memory alive longer than a single function's stack frame. To do this, you can allocate memory on the heap (sometimes referred to as dynamic memory).

<HeadsUp title="Stack? Heap? Whaaa?">
  If the idea of the Stack and/or Heap is confusing -- no worries! Memory management is a very complicated topic but it's fundamental when reasoning about how computers operate.

  <div style={{marginTop: "10px"}}>
    Most programming languages help abstract these concerns  so you don't have to worry about them, however there are a few that do not. Rust is one of those languages. If you don't feel comfortable with the Stack and Heap yet, you can learn more about them as you go! Don't let it hold you up!
  </div>
</HeadsUp>

Boxing is a practice for allocating memory on the heap. A Box is a [smart pointer](https://doc.rust-lang.org/book/ch15-00-smart-pointers.html) to a value allocated on the heap. As an example, if we wanted to box a User, we can use a `Box<User>`.

Boxes are created by using [`Box::new`](https://doc.rust-lang.org/std/boxed/struct.Box.html#method.new), and `Box::new` takes in the value that you'd like to box. In some cases, you may have to provide a generic type to the box to help it identify what type of values it's referencing.

Boxes implement the [`Deref` trait](https://doc.rust-lang.org/std/ops/trait.Deref.html) so you can work with boxes as if you were working with the values that the box contains. To clarify, if you Box a User struct, you can access the fields of that User struct without manually needing to deference the User from the box.

This example is a bit contrived, but hopefully it showcases how boxes automatically deref when needed:

```rust
pub struct User {
    name: String,
}

fn main() {
    // b here is a Box<User> NOT a User
    let b = Box::new(User{name: String::from("Brad")});
    // deref kicks in here, so we can treat b as a User instead of a Box<User>
    println!("{}", b.name);
}
```

In this example, our User gets stored on the heap and b, on the stack, is the pointer to the user on the heap.

One thing that's really neat is that boxes do not have performance overhead besides the impact of storing data on the heap instead of the stack.

I've mentioned that Boxes are "Smart Pointers" but what exactly is a Smart Pointer? Smart Pointers are usually implemented via Structs but they also have to implement `Deref` and `Drop`. `Deref` was mentioned above, but we haven't mentioned `Drop` yet. The `Drop` trait allows you to run code when the struct goes out of scope, in the case of smart pointers, deallocation. There are other smart pointers besides Boxes, but those are out of the scope for this article. Perhaps another time!