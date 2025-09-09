---
title: "Zig's release modes"
date: 2025-09-09
status: publish
permalink: /zigs-release-modes
author: "Brad Cypert"
type: blog
images:
  - zig-multithreading.jpeg
tags:
  - zig
versions:
  zig: "0.15.1"
description: "Zig has multiple release modes to suite each individual's needs. Here's when to use one over the other."
outline:
  what: "What's the main goal I am trying to convey"
  why: "Why does anyone care?"
  how: "How is whatever Im teaching used?"
  when: "When should it be used?"
---

One of the first things I bumped into when I started writing Zig was its *release modes*. At first I thought: *do I really need four different ways to compile my code?* But as I dug in, I realized that release modes are one of Zig’s most practical features. They let you explicitly choose between **safety, speed, and binary size** — depending on whether you’re prototyping, testing, or shipping.  

In this post, I’ll walk you through each release mode in detail, show you how they differ, and benchmark a simple Zig program across them.  

---

## What Are Release Modes?  

Whenever you build a Zig program, you tell the compiler what tradeoffs you’re willing to make. Some languages hide these decisions behind a generic “debug” vs “release” switch, but Zig makes them explicit.  

You pick the mode with the `-O` flag:  

```bash
zig build-exe main.zig -O Debug
zig build-exe main.zig -O ReleaseSafe
zig build-exe main.zig -O ReleaseFast
zig build-exe main.zig -O ReleaseSmall
```

If you don’t specify one, Debug is the default.

### Debug Mode

Debug mode is Zig’s safety net.

- Full safety checks: Bounds checking, integer overflow detection, invalid pointer usage checks.
- Debug symbols: Great stack traces and compatibility with debuggers.
- No optimizations: Programs run slower and binaries are larger.

When I’m exploring an idea, Debug mode is where I live. I’d rather catch a slice-out-of-bounds immediately than chase a memory corruption bug for an hour.

### ReleaseSafe

ReleaseSafe is like Debug mode’s older sibling — it still cares about safety but also wants you to see how your program performs with optimizations.

- Optimizations enabled: Faster execution than Debug.
- Runtime safety checks remain: Bounds, overflow, and null checks are still active.
- Larger binary sizes: You pay for both safety code and optimizations.

This mode shines when you’re close to shipping but aren’t ready to drop the training wheels yet. For me, it’s the mode I'd use when testing new features that might hit edge cases.

### ReleaseFast

ReleaseFast is the “pedal-to-the-metal” mode.

- All major optimizations: Inlining, vectorization, loop unrolling, the works.
- No runtime checks: If you index out of bounds, Zig won’t catch it here.
- Maximum performance: The compiler assumes you know what you’re doing.

This is my go-to for production binaries. If I’m compiling a game loop or a high-performance tool, ReleaseFast makes a noticeable difference. But — and this is important — bugs that safety checks would catch are now yours to debug the hard way.

### ReleaseSmall

ReleaseSmall takes a different tack: optimize for binary size.

- Code size minimized: Ideal for embedded systems, WASM, or environments with strict limits.
- Performance may vary: Smaller doesn’t always mean faster. Some optimizations are sacrificed to shrink the binary.
- Useful for distribution: Great if you’re writing CLI tools where every MB counts.

I’ve used ReleaseSmall while experimenting with Zig for WebAssembly — the resulting .wasm files were significantly smaller compared to ReleaseFast.

# A Hands-On Example

Let’s try this with a simple Fibonacci benchmark. We'll use [hyperfine](https://github.com/sharkdp/hyperfine) to benchmark things and we'll setup a shell script to automate all of this for us, because automation is rad. Our zig program is just going to calculate fibbonaci sequences up to a certain value (we'll use 44 for this benchmark). We'll also do some internal benchmarking of our program just to compare the program's perceieved speed and hyperfine's percieved speed. Also, some of these releases dont have the [need for speed](https://en.wikipedia.org/wiki/Need_for_Speed), so we'll ultimately look at the file size of each executable, too -- but let's start with speed.

```zig
const std = @import("std");

fn fib(n: u32) u64 {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}

pub fn main() !void {
    var stdout_buffer: [1024]u8 = undefined;
    var stdout_writer = std.fs.File.stdout().writer(&stdout_buffer);
    const stdout = &stdout_writer.interface;
    defer stdout.flush() catch {};
    const start = std.time.nanoTimestamp();

    const result = fib(44); // intentionally slow
    try stdout.print("fib(44) = {}\n", .{result});

    const duration = std.time.nanoTimestamp() - start;
    try stdout.print("Took {} ns\n", .{duration});
}
```

Alright, let's get to that shell script. We'll use zig's build-exe just to simplify the build process here and we'll orchestrate some benchmarking with hyperfine. Some key notes, we're using the `--runs` flag to run the program multiple times and we're also using the `--warmup` flag to run a few warmup runs that aren't factored into the benchmark numbers. 

```bash
zig build-exe ./src/main.zig -O ReleaseFast --name main_release_fast
zig build-exe ./src/main.zig -O ReleaseSafe --name main_release_safe
zig build-exe ./src/main.zig -O ReleaseSmall --name main_release_small
zig build-exe ./src/main.zig -O Debug --name main_debug

hyperfine --warmup 3 --runs 5 "./main_release_fast"
hyperfine --warmup 3 --runs 5 "./main_release_safe"
hyperfine --warmup 3 --runs 5 "./main_release_small"
hyperfine --warmup 3 --runs 5 "./main_debug"
```

## Benchmark Results

Here's the output from our script from the previous section.

```
Benchmark 1: ./main_release_fast
  Time (mean ± σ):      2.118 s ±  0.002 s    [User: 2.111 s, System: 0.005 s]
  Range (min … max):    2.116 s …  2.121 s    5 runs

Benchmark 1: ./main_release_safe
  Time (mean ± σ):      3.033 s ±  0.002 s    [User: 3.024 s, System: 0.007 s]
  Range (min … max):    3.031 s …  3.036 s    5 runs

Benchmark 1: ./main_release_small
  Time (mean ± σ):      2.116 s ±  0.003 s    [User: 2.109 s, System: 0.005 s]
  Range (min … max):    2.112 s …  2.121 s    5 runs

Benchmark 1: ./main_debug
  Time (mean ± σ):      4.467 s ±  0.008 s    [User: 4.455 s, System: 0.009 s]
  Range (min … max):    4.462 s …  4.480 s    5 runs
```

Also here's the standard output from running each of these programs:

```
./main_release_fast
fib(44) = 701408733
Took 2149937000 ns

./main_release_safe
fib(44) = 701408733
Took 3066496000 ns

./main_release_small
fib(44) = 701408733
Took 2151497000 ns

./main_debug
fib(44) = 701408733
Took 4501470000 ns
```

## Filesize

It's important to keep in mind that the only release mode that is really speed-oriented is `ReleaseFast`. We've talked about some of the benefits of other release modes already (Debug symbols in debug, for example), but I think it's also important to give `ReleaseSmall` it's time to shine.

```
ls -l | awk '{printf "%d, %dKB %s\n", $5, $5/1024, $9}'
1202920  1174KB   main_debug
69888    68KB     main_release_fast
264464   258KB    main_release_safe
52592    51KB     main_release_small
```

Release small does happen to be the smallest, but in this case fast is also pretty small. Keep in mind that debug symbols carry a _lot_ of weight, so that would explain why our debug build is so much larger than the others.

# How to Choose

Here’s my advice on choosing:

- Debug → everyday hacking, prototyping.
- ReleaseSafe → feature testing, pre-release sanity checks, potentially production.
- ReleaseFast → production builds where performance matters.
- ReleaseSmall → distribution or embedded targets where size matters.

# Wrapping Up

Zig’s release modes aren’t just compiler quirks — they’re a clear, explicit way to align your build with your goals. Whether you want safety, speed, or size, Zig hands you the dial.

My advice: start in Debug, switch to ReleaseSafe when things stabilize, and pick between Fast or Small depending on your production needs -- or just stay with ReleaseSafe.

If you want to dive deeper, check out the [official Zig docs on the build system](https://ziglang.org/learn/build-system/)