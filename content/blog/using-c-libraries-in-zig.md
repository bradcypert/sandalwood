---
title: "Using C libraries in Zig"
date: 2025-11-08
status: publish
permalink: /using-c-libraries-in-zig
author: "Brad Cypert"
type: blog
images:
  - pexels-tools.jpg
tags:
  - zig
  - interoperability
description: "Learn how to harness the power of C libraries directly in Zig. In this tutorial, I demonstrate Zig's excellent C interop capabilities by creating a simple program that applies a sepia filter to images using the popular ImageMagick library."
outline:
  what: "How to use existing C libraries directly from Zig code with minimal friction"
  why: "Access to the massive C ecosystem while enjoying Zig's safety and expressiveness"
  how: "Using @cImport, linkSystemLibrary, and Zig's native error handling with C code"
  when: "When you need mature, established libraries without writing wrappers or bindings"
versions:
  zig: "0.14.0"
---

Hey, everyone! Welcome to this tutorial where we'll explore one of Zig's most powerful features. Today, we're going to see how easy it is to use existing C libraries directly from Zig code.

## Why C Interoperability Matters

One of the things that got me really excited about a different language, Clojure, when I was learning it was that although the Clojure ecosystem felt small, I had interoperability with anything that ran on the JVM. So you could interop with Java, Scala, eventually Kotlin after Kotlin really kind of caught on. It was great.

And one of the things I like about Zig is that same interoperability but with the entire C ecosystem, which is so much bigger. Today we'll be working with ImageMagick, a popular image processing library, to create a simple program that applies a sepia tone filter to an image. This is a really great real world example of leveraging established C libraries while enjoying Zig's safety and expressiveness.

If you're new to Zig or curious about how it works with existing C code, this post is perfect for you. Let's dive right in.

## Prerequisites

Before we start coding, let's make sure we have everything we need:

- **Zig 0.14** - Make sure you have Zig 0.14 installed
- **ImageMagick development libraries** - Installed on your system
- **Basic understanding of Zig syntax** 
- **A sample image to test with** - I've got a sample image of a thumbnail for my YouTube channel, and we're just gonna make it sepia

### Installing ImageMagick

If you're on macOS like me, you can install ImageMagick using Homebrew:

```bash
brew install imagemagick
```

For Linux users, you can use your package manager. If you're a Linux user, you probably know what you're doing here. But for example, on Ubuntu:

```bash
sudo apt-get install libmagickwand-dev
```

## Setting Up the Project

Let's get started. We're gonna make a new directory called `zig-image-magic`:

```bash
mkdir zig-image-magic
cd zig-image-magic
```

This is completely empty, so we're gonna run `zig init`. But before we do, I want to set my Zig version. I'm using ASDF to manage my Zig versions:

```bash
asdf local zig 0.14
zig init
```

If you're not using ASDF, you can just run `zig init`. Or if you're using something else, just make sure you're on 0.14.

Additionally, you'll want to make sure that ImageMagick is installed:

```bash
magick-config --version
```

## Configuring the Build Script

So we have a `build.zig` file, a `build.zig.zon` (which I don't think we'll need), our `main` file, and a `root` file. Let's go ahead and start with our `build.zig` file.

I'm gonna delete everything and start from scratch. Here's what we need:

```zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const imagemagick_exe = b.addExecutable(.{
        .name = "zig-imagemagick",
        .root_source_file = b.path("./src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    imagemagick_exe.linkSystemLibrary("MagickWand");
    imagemagick_exe.linkSystemLibrary("MagickCore");
    imagemagick_exe.linkLibC();

    b.installArtifact(imagemagick_exe);

    const run_cmd = b.addRunArtifact(imagemagick_exe);
    run_cmd.step.dependOn(b.getInstallStep());

    const run_step = b.step("run", "Run the code example");
    run_step.dependOn(&run_cmd.step);
}
```

It's only 25 lines, which is not bad at all. Now we need to add the ImageMagick library. We're linking `MagickWand` and `MagickCore`, and then we're linking libc as well.

## Understanding Zig's C Interop

Before we look at our main code, it's important to understand how Zig works with C:

- Zig can **directly import C headers** using the `@cImport` directive (or built-in)
- C functions, types, and constants become available as if they were native Zig
- Zig handles memory management and error handling in its own way
- We can **mix Zig and C freely**, using Zig's safety features with C's ecosystem, which is really powerful

This gives us immediate access to thousands of mature C libraries without any wrappers or bindings.

## Writing the Image Processing Code

Now let's go ahead and wire up our ImageMagick and our Zig code. We have a lot going on in the generated `main.zig`, and we're gonna get rid of all of it. Let's start from scratch:

```zig
const std = @import("std");

const c = @cImport({
    @cInclude("MagickWand/MagickWand.h");
});

pub fn main() !void {
    c.MagicWandGenesis();
    defer c.MagicWandTerminus();

    const wand = c.NewMagickWand();
    if (wand == null) {
        return error.MagicWandCreationFailed;
    }
    defer _ = c.DestroyMagickWand(wand);

    const status = c.MagickReadImage(wand, "input.png");
    if (status == c.MagickFalse) {
        var exeception_type: c.ExceptionType = undefined;
        const description = c.MagickGetException(wand, &exeception_type);
        defer _ = c.MagickRelinquishMemory(description);
        std.debug.print("Error reading image: {s}\n", .{description});
        return error.ImageReadFailed;
    }

    const sepai_status = c.MagickSepiaToneImage(wand, 58000);
    if (sepai_status == c.MagickFalse) {
        var exeception_type: c.ExceptionType = undefined;
        const description = c.MagickGetException(wand, &exeception_type);
        defer _ = c.MagickRelinquishMemory(description);
        std.debug.print("Error applying sepia filter: {s}\n", .{description});
        return error.SepaiToneFailed;
    }

    const write_status = c.MagickWriteImage(wand, "output.jpg");
    if (write_status == c.MagickFalse) {
        var exeception_type: c.ExceptionType = undefined;
        const description = c.MagickGetException(wand, &exeception_type);
        defer _ = c.MagickRelinquishMemory(description);
        std.debug.print("Error writing image: {s}\n", .{description});
        return error.ImageWriteFailed;
    }

    std.debug.print("Image processing completed successfully.", .{});
}
```

### Breaking Down the Code

The really cool part about this is basically everything you're gonna see is standard Zig. There's not really anything C-ish going on or anything really strange that would feel different if you are used to writing Zig.

**Initializing ImageMagick:**
```zig
c.MagicWandGenesis();
defer c.MagicWandTerminus();
```

We call `MagicWandGenesis` to start everything. We defer the cleanup, which is `Terminus`. They have fun names for all of this.

**Creating a wand:**
```zig
const wand = c.NewMagickWand();
if (wand == null) {
    return error.MagicWandCreationFailed;
}
defer c.DestroyMagickWand(wand);
```

This is essentially the pattern that we're gonna use over and over again here. You can see that it is a potentially null pointer to a struct MagickWand, so we check if it's null.

**Reading the image:**

We read in an image using `MagickReadImage`. It returns a C unsigned int (`c_uint`), so we can check this using `MagickFalse` (a primitive available in the MagickWand library).

When there's an error, this is where it gets a little weird when you're interacting with a C library that takes care of its own allocations. We need to make sure that we're relinquishing memory and cleaning up our C code:

```zig
var exeception_type: c.ExceptionType = undefined;
const description = c.MagickGetException(wand, &exeception_type);
defer _ = c.MagickRelinquishMemory(description);
```

**Applying the sepia tone:**

There's a threshold value here. I've done a little bit of testing and found that 58,000 is roughly what we want, but you can check the documentation for ImageMagick and figure out exactly what that value should be.

One thing really nice about the ImageMagick library is that if you wanna do sepia, it's just built in. You could go through and manually manipulate each pixel if you wanted to take that approach, but you can also just grab the `sepiaToneImage` function.

## Running the Program

It's 45 lines to create a wrapper around ImageMagick in Zig that takes a file and applies a sepia filter to it. Let's go ahead and give this a build:

```bash
zig build
```

Let it be known that I did not make an error. No typos. Excellent!

Now let's run it:

```bash
zig build run
```

Make sure you have an `input.png` file in your project directory. You know, if we wanted to, we could take the file path in as input to our program, but I just have it hard coded.

After running, you should see:
```
Image processing completed successfully!
```

And there's a nice sepia filter that's been applied to `output.jpg`.

## Key Takeaways

Here are some key things to remember when using C libraries in Zig:

1. **Use `@cImport`** to import your C header files
2. **Use `linkSystemLibrary`** in your build script to link against your C libraries
3. **Call C functions directly** while leveraging Zig's error handling - it makes it so much nicer
4. **Remember to use `defer`** to clean up resource management just like you would in normal Zig
5. **Remember that C libraries follow C conventions** - so you might run into things like null checks and specific return values that indicate statuses

Lastly, there's one thing we didn't really run into, but if you have multiple versions and you need to use a specific version, you can add library paths in your build step for your specific version as well.

## What's Next?

This pattern works for thousands of C libraries, not just ImageMagick, and you can apply these same techniques to libraries like:
- libcurl
- SDL
- SQLite
- And many, many more

## Conclusion

The ability to work seamlessly with C code is one of Zig's biggest strengths, giving you access to decades of established libraries when writing modern, safer code.

