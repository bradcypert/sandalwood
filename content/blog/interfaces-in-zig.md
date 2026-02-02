---
title: "Interfaces in Zig"
date: 2026-02-01
status: publish
permalink: /interfaces-in-zig
author: "Brad Cypert"
type: blog
images:
  - black-and-white-blank-challenge-connect-262488.jpg
tags:
  - zig
description: "While Zig doesn't have an interface keyword, interfaces are indeed supported by the language and even commonly used throughout the standard library."
outline:
  what: "Interfaces as a pattern in Zig"
  why: "Interfaces are used by the standard library and ultimately can help make end-user code easier to work with or understand, but there are consequences to approaching this pattern."
  how: "VTables, Interface functions, and anyopaque"
  when: "Should be measured for performance gains/losses, but can be used when it helps with code reuse and abstraction."
---

> *Zig does not have an `interface` keyword — and that’s a feature, not a bug.*

Zig’s design deliberately avoids baking object-oriented abstractions into the language. Instead, it gives you a small set of powerful primitives — structs, pointers, comptime, and function pointers — and lets *you* decide when abstraction is worth the cost.

Yet if you look closely at Zig’s standard library, you’ll quickly notice something interesting: **interfaces are core to several commonly used parts of the standard library**.

Indeed, they're used in Allocators, Readers, Writers, Streams, Formatters and more.

It may not be immediately obvious that these are interfaces due to the lack of an `interface` or `implements` keyword.

This article is intended to be a deep dive into how Zig implements interface-like abstractions using [**vtables**](https://en.wikipedia.org/wiki/Virtual_method_table), why the standard library uses them, how they compare to Go-style interfaces, and — most importantly — **when you should and should not use them in your own Zig code**. However, this article ultimately reflects my the depths of my own understanding and I strongly recommend that you do not use this as your only source of truth and opinions.

---

## What Do We Mean by “Interfaces” in Zig?

When most developers hear *interface*, they think of:

* A named set of methods
* Implemented implicitly or explicitly by types (perhaps an `interface` keyword)
* Used for polymorphism at runtime

Zig provides **none** of this directly.

Instead, Zig supports:

* **Static polymorphism** via `comptime`, generics, and `anytype`
* **Sum types** via tagged unions
* **Dynamic polymorphism** via *manual* vtables

That last one is what we’ll focus on for the remainder of this article.

In Zig, an "interface" is typically represented by:

1. A pointer to *some unknown concrete type* (`*anyopaque`)
2. A collection of function pointers that operate on that pointer (often referred to as a VTable)

Together, these form what is commonly called a [**fat pointer**](https://www.educative.io/answers/what-is-a-fat-pointer):

```
{ data pointer, vtable pointer }
```

If that sounds familiar, it should — it’s conceptually very close to how Go interfaces work.

The difference is that in Zig, **you build it yourself**.

---

## The Canonical Example: `std.mem.Allocator`

Arguably, the most important interface in Zig is `std.mem.Allocator`.

Almost every non-trivial Zig program uses it, and it is a textbook example of a vtable-based interface.

Stripped down, it looks roughly like this ([full source code here](https://ziglang.org/documentation/0.15.2/std/#src/std/mem/Allocator.zig)):

```zig
pub const Allocator = struct {
    ptr: *anyopaque,
    vtable: *const VTable,

    pub const VTable = struct {
        alloc: *const fn (
            ctx: *anyopaque,
            len: usize,
            alignment: u8,
            ret_addr: usize,
        ) ?[*]u8,

        resize: *const fn (
            ctx: *anyopaque,
            buf: []u8,
            alignment: u8,
            new_len: usize,
            ret_addr: usize,
        ) bool,

        free: *const fn (
            ctx: *anyopaque,
            buf: []u8,
            alignment: u8,
            ret_addr: usize,
        ) void,
    };
};
```

Every allocator implementation — page allocator, arena allocator, debug allocator — provides:

* Some concrete state (a struct)
* A **static vtable** with function pointers
* A method that returns an `Allocator` pointing at that state

Calling `allocator.alloc(...)` is just:

```zig
allocator.vtable.alloc(allocator.ptr, ...);
```

That’s it.

There's no generics, no traits, and certainly no inheritance.

Pleasantly, this pattern is just data + behavior.

---

## Why the VTable Is a Pointer (and Not Embedded)

Notice that `Allocator` stores a **pointer to a vtable**, not the vtable itself.

That’s a deliberate design choice.

### Benefits

* Each allocator instance is only **two [machine words](https://en.wikipedia.org/wiki/Word_(computer_architecture))**
* The vtable lives in read-only memory
* All instances of the same allocator type share the same vtable

This matters because allocators are passed *everywhere*.

If the vtable were embedded, every allocator value would duplicate those function pointers and that could drastically add memory overhead.

Zig’s design optimizes for:

* Cheap copying
* Low memory overhead
* Predictable layout

---

## Readers and Writers: Interfaces with State

Zig 0.15 introduced new I/O interfaces:

* `std.Io.Reader`
* `std.Io.Writer`

These are also vtable-based, but they introduce an important twist:

> **The interface object itself owns state.**

In particular, readers and writers often contain:

* A ring buffer
* Cursor state
* Error tracking

That means:

* They are usually passed by pointer
* They must live at a stable address
* Copying them by value is usually a bug

Conceptually, they still follow the same pattern:

```
{ buffer + state, vtable }
```

But unlike `Allocator`, the *interface* is no longer just a thin handle — it is a full object with it's own state.
There are benefits to both approaches and ultimately this distinction does matter when designing your own interfaces.

---

## A Minimal Interface Example

Let’s build a tiny interface by hand.

### Step 1: Define the Interface

```zig
const Logger = struct {
    ptr: *anyopaque,
    logFn: *const fn (*anyopaque, []const u8) void,

    pub fn log(self: Logger, msg: []const u8) void {
        self.logFn(self.ptr, msg);
    }
};
```

### Step 2: Implement a Concrete Type

```zig
const StdoutLogger = struct {};

fn logStdout(ptr: *anyopaque, msg: []const u8) void {
    _ = ptr;
    std.debug.print("{s}\n", .{msg});
}

fn asLogger(self: *StdoutLogger) Logger {
    return .{
        .ptr = self,
        .logFn = logStdout,
    };
}
```

### Step 3: Use It

```zig
var logger_impl = StdoutLogger{};
const logger = asLogger(&logger_impl);

logger.log("hello interfaces");
```

Congratulations — you just implemented runtime polymorphism in Zig.

---

## How This Compares to Go Interfaces

I know this post is intended to cover Zig, but bear with me for a moment. We're going to compare this to Go since Go is generally a very approachable language.

Go programmers will find this pattern very familiar.

In Go:

```go
type Writer interface {
    Write([]byte) (int, error)
}
```

Under the hood, a Go interface value is:

```
{ type pointer, data pointer }
```

Zig’s version is:

```
{ data pointer, vtable pointer }
```

### Key Differences

| Aspect      | Go                 | Zig                |
| ----------- | ------------------ | ------------------ |
| Declaration | Language feature   | Library pattern    |
| Dispatch    | Implicit           | Explicit           |
| Inlining    | Never              | Never (via vtable) |
| Allocation  | Sometimes implicit | Explicit           |
| Visibility  | Hidden             | Fully transparent  |

Zig makes the cost visible.

You always know when you’re paying for indirection and to be honest, I feel that Zig adds a certain amount of friction to help prohibit individuals from over-optimizing with interfaces.

---

## The Cost of VTables

As with everything in software design, there are tradeoffs to be considered.

### Runtime Cost

Each interface call involves:

* Loading a function pointer
* Performing an indirect call

That usually means:

* No inlining
* Fewer optimization opportunities

On modern CPUs, the *raw cost* of the indirect jump is relatively small.

The bigger cost is **what the compiler can’t do** afterward.

### Memory Cost

Typically:

* 2 pointers per interface value
* One static vtable per implementation

This is usually negligible.

### Cognitive Cost

* More boilerplate
* More places to make mistakes
* Lifetime and ownership become critical

In Zig, this level of abstraction is achievable, but difficult. Personally, I feel like this is a good approach, as it encourages you to build simple solutions first and can always retrofit interfaces into your code if you truly find the need.

---

## When You *Should* Use Interfaces

Interfaces shine when:

* You need **runtime polymorphism**
* You want to store heterogeneous values together
* You’re writing **library code**
* You need plugin-like extensibility

Examples:

* Logging backends
* Allocators
* I/O streams
* Rendering backends
* Game engine subsystems

If you need to choose behavior *at runtime*, interfaces are often the cleanest solution, but I would encourage you to see if you can determine the behavior elsewhere (comptime, for example).

---

## When You Probably Shouldn’t

Avoid interfaces when:

* There is only one implementation
* The call is in a hot inner loop
* Compile-time dispatch is sufficient

Prefer instead:

* Generics (`anytype`)
* Tagged unions
* Function pointers passed directly
* Concrete types

Zig’s philosophy really shines through here. It's not "always abstract" — it’s **"be honest about cost."**

---

## Identifying Interface Candidates in Your Code

Ask yourself:

* Do multiple types share the same behavior?
* Do I need to decide between them at runtime?
* Do I want to hide implementation details from callers?

If the answer is *yes* to all three, an interface may be appropriate.

If not, I encourage you to keep it concrete.

---

## Final Thoughts

Zig doesn’t give you interfaces because **it doesn’t want you to reach for them casually**.

But when you need them, the language gives you all the tools to build a proper solution:

* Explicit memory
* Explicit dispatch
* Explicit cost

Understanding Zig’s vtable-based interfaces, especially allocators and I/O, is key to understanding how large Zig programs and even the standard library itself are structured.

Once you internalize the pattern, you’ll start seeing it everywhere.

And more importantly, you’ll know exactly *why* it’s there.

---

## Further Reading

* [Zig Standard Library: `std.mem.Allocator`](https://ziglang.org/documentation/0.15.2/std/#src/std/mem/Allocator.zig)
* [Zig Writergate](https://ziglang.org/download/0.15.1/release-notes.html#Writergate)
* [Karl Seguin, Zig Interfaces](https://www.openmymind.net/Zig-Interfaces/)
* [Karl Seguin, I'm too dumb for Zig's new IO interface](https://www.openmymind.net/Im-Too-Dumb-For-Zigs-New-IO-Interface/)
* [William Wong, *Interfaces in Zig*](https://williamw520.github.io/2025/07/13/zig-interface-revisited.html)
