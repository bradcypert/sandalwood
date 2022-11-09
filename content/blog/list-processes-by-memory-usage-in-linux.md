---
title: "List Processes by Memory Usage in Linux"
date: 2019-05-09
status: publish
permalink: /list-processes-by-memory-usage-in-linux
author: "Brad Cypert"
excerpt: ""
type: blog
id: 1367
images:
  - circuit-board-circuits-components-825258.jpg
category:
  - "Developer Tools"
tags:
  - linux
  - ps
  - terminal
description: "Learn how to list processes by memory usage in Linux and learn what the commands are actually doing for you."
---

I recently was running into an issue where a Systemd service was crashing due to an out of memory error. I was pretty sure that my project wasn’t taking up **too** much memory, but I wasn’t certain what was. Thankfully, with the use of some command-line wizardry, I was able to find out that Hyper (the terminal app) was using almost 3gb of memory!

```bash
ps -e -o pid,vsz,comm= | sort -r -n -k 2
```

We have two commands here, each with their own `man` page should you want to learn more. The first command is `ps` which displays information about all of your running processes.

The `-e` flag is actually identical to the `-A` flag, which tells the command to list all users processes, including those not controlling terminals.

The `-o` flag takes parameters (that’s the `pid,vsz,comm=`) and that controls how the output is formatted. In our case, that will format the output with a process id, virtual size in kilobytes, and the command.

We then pipe this into another command named `sort`. The `-r` reverses the sort
order, so the highest value will be at the top in our case. `-n` indicates that
we’d like to sort our fields numerically by arithmetic value and finally `-k`
takes a parameter indicating the field to key your sort off of. In our case,
it’s our virtual size in kilobytes, indicated by the “2”nd field in our output.
