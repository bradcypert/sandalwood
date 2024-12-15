---
title: "Adding dependencies to your Zig project with zig fetch"
date: 2024-12-15
status: publish
permalink: /todo
author: "Brad Cypert"
type: blog
tags:
  - zig
images:
  - zig-dependencies.png
versions:
  zig: 0.13.0
description: "Here's how to add a git dependency to your Zig project."
outline:
  what: "How to add dependencies to your zig project"
  why: "No one wants to recreate the wheel and package managers make avoiding that easy."
  how: "Used to leverage code by other engineers"
  when: "you need to leverage code written by others in a scalable and maintainable fashion"
---

Boy, does this feel like a weird blog post to write. I had to dig into the source code for the Zig cli to figure out how to do this, so I'm going to write about this and hopefully spare others from that pain.

Zig is a fun language and there's something ~~sexy~~ ~~powerful~~ ~~dangerous~~ enjoyable about having control of how memory is allocated. However, as with any language that I'm learning in my spare time, I don't want to have to write everything from scratch. I'd like to use the code written by others.

Git is a common tool for storing code and has become a common tool for sharing code. It seems reasonable to want to "depend" on code in Git. This external code is what we'd call a "dependency".

Zig has gone years without a dedicated package manager, and while I believe that having dedicated tooling as a part of the language offering is essential to a language's adoption (at least at this point in time), Zig has been fine without a dedicated package manager and several third-party options have shown up to fill that role.

The year is 2024 and Zig does have a sort-of dedicated package manager now though. Zig's build system can manage dependencies for you via a `build.zig.zon` file. This is kind of similar to a `package.json` from Node land and includes convenience methods in the CLI for managing this file, too.

However, there's not a central registry that is used by Zig's build system, so there's no `npm install @react/create-react-app` equivalent type command. Instead, we use `zig fetch --save {url}`. But if you try to add a dependency on a git repo, you have to structure it like so:

```
zig fetch --save git+https://github.com/discord-zig/discord.zig/#HEAD
```

This example adds a dependency on the discord.zig project on github. Notice we're referencing the head directly, but you can use a different commit hash if you'd prefer.

This will add the dependency to our `build.zig.zon` file. Of course, you'll need to make that available to your zig project as well by modifying the `build.zig` file and adding something like the following to it:

```zig
const dzig = b.dependency("discord.zig", .{});

exe.root_module.addImport("discord.zig", dzig.module("discord.zig"));
```

The key thing here is leveraging the build's `dependency` function and adding an import to the root module.

My hope is that this gets easier over time, but given how powerful Zig's build system is, this may be by design. If this seems like a pain to you (I don't blame you), you can also look at [Zigmod, a package manager for Zig](https://github.com/nektro/zigmod).