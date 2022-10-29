---
title: "Rust's Drop Trait"
date: 2022-10-28
status: publish
permalink: /rust-drop-trait
author: "Brad Cypert"
images:
  - /rusted-metal.jpg
type: blog
category:
  - rust
tags:
  - rust
description: "The Drop trait in Rust only has one method but it's extremely important. Learn what Drop does and how to implement it yourself here."
---

The `Drop` trait in Rust only has one method but it's extremely important. The `drop` method on the `Drop` trait is called automatically when an object goes out of scope. This means that when an object's lifetime ends, `drop` will be called on that object.

The main purpose of the `Drop` trait is to give developers a place to free up resources when an object is no longer in scope. If your object claims memory, the `drop` method is where you'll free that memory.

The trait itself is fairly simple:

```rust
trait Drop {
    fn drop(&mut self);
}
```

There is a standard trait definition with a single function that gets a mutable reference to self.

## Automatic Drops

As mentioned above, `drop` is called automatically when an object goes out of scope. It's important to keep in mind that variables are dropped in reverse order from their creation. For example, if we created variables A then B then C in that order, they would drop in the order of C then B then A. Struct properties, however, are dropped in order of declaration. If you declared a struct with properties A then B then C, they would drop in the order of A then B then C when that struct was dropped itself.

Automatic drops are managed for us via the compiler. This helps prevent common memory management issues like the [double free error](https://owasp.org/www-community/vulnerabilities/Doubly_freeing_memory).

## Manually Dropping a Value

Drop is a bit weird compared to other traits. If you try to call `drop()` on your object, Rust's compiler will complain. The exact message may have changed since publication of this post, but it should be something like `error[E0040]: explicit use of destructor method`. The destructor is the opposite of a constructor and is a term generally used for the block of code responsible for tearing down objects (in our case, the `drop` method). Rust does not like us calling drop because when the object goes out of scope, drop will also be called which creates the [double free error](https://owasp.org/www-community/vulnerabilities/Doubly_freeing_memory) that Rust has painstakingly tried to avoid for us.

Instead, if we want to drop a value early, we can call `std::mem::drop` (this is included in the prelude but I'll be referring to it by its fully qualified name to avoid confusion) and pass in the instance we want to drop. Doing so will drop the object right away and not call `drop()` on the object when it goes out of scope. A shared mutex is a good example of an object that you may want to drop before it goes out of scope.

What's particular interesting about `std::mem::drop` in my opinion is that the function definition is literally the following:

```rust
pub fn drop<T>(_x: T) { }
```

On top of that, the documentation declares that "This function is not magic" and indeed, it's not! The value of _x is moved into the function and subsequently goes out of scope as soon as the function is closed, so `drop` from the `Drop` trait is called on that object. Anything implementing copy is actually unaffected by `drop`. Since the value is copied into the above function and the reference is not moved into that function, the copied value's object will still be in scope after calling `std::mem::drop`. 

## What actually goes in drop?

If you've been searching online, almost every example you'll find of someone implementing drop in a tutorial is simply printing a statement to STDOUT. Unfortunately, that's not helpful in most cases but this is likely because each case of a custom drop implementation is usually unique to a larger context. Take for example a Tree structure in Rust. Assuming you have a node and that node has access to its children via `RC` and a weak reference to its parents via the `Weak` type, you may implement `drop` on a node in such a way that it deallocates that node and it's children. Or perhaps the entire tree is invalid in your usecase then and you can climb to the parent and recursively free the entire tree. Again, this ends up being fairly dependent on what you're building and trying to solve.

Another interesting example revolves around `RefCell`. Since `RefCell` enforces its borrow rules at runtime, you can use `Drop` to release a Refcell borrow.