---
title: "Introducing the Fish Shell"
date: 2018-02-13
status: publish
permalink: /introducing-the-fish-shell
author: "Brad Cypert"
excerpt: "Fish is a command line shell that (in my workflow) replaces Bash -- the shell most developers are used to. There are plenty of alternatives to Bash, with Zsh being the most popular, but I'm hoping to give fish a shot by the end of this article. Let's discuss why I'm using fish and you should too!"
type: blog
id: 35
category:
  - Shell-Scripting
tags:
  - fish
  - shell
post_format: []
_yoast_wpseo_title:
  - "Introducing the Fish Shell"
---

The first thing I do when I my hands on a new Macbook is install Homebrew. Then, I install Fish. What is fish? Well, that’s an excellent question. Fish is a command line shell that (in my workflow) replaces Bash — the shell most developers are used to. There are plenty of alternatives to Bash, with Zsh being the most popular, but I’m hoping to give fish a shot by the end of this article. Here’s what I like about it:

- Tab based completion on just about everything
- Tab suggestions based on parsed man pages
- Searchable history
- The prettiness of Zsh without the load time

Let’s talk a little more about each of these.

#### Tab Based Completion

Out of the box, Fish offers Tab based completion that just works. You can `cd` into a git repo and type `git checkout` + TAB and immediately see common things you may want to check out like other local branches, remote branches, and more. In fact, you can actually **search** this suggestion list simply by typing what you’re looking for. Have 90 branches and want to check out the one that begins with “i_think_this_one” ? `git checkout` + TAB + i_think_this_one + ENTER. Even if the branch is i_think_think_one_is_probably_the_right_one, it will select it for you. Nice!

#### Man Page Based Suggestions

Speaking of suggestions, Fish will parse the man pages and suggest flags based off the ones outlined in the man page for that function. You can try this with _`curl`._ Using fish, simply type `curl -` + TAB and notice not only the suggestions, but also the doc string for those suggestions.

```
bradcypert@Brads-Tome-of-Code api (master#3b048e9) = ✗ curl -sm 30 k.wdt.io/brad.cypert@gmail.com/bootstrap?c=5_4_*_*_*                                                                   [2h28m] M
-\#  --progress-bar                                                                                            (Make curl display progress as a simple progress bar instead of the standard, …)
--anyauth                                                                                                      ((HTTP) Tells curl to figure out authentication method by itself, and use the …)
--append  -a                                                                                                   ((FTP/SFTP) When used in an upload, this makes curl append to the target file …)
--basic                                                                                                              ((HTTP) Tells curl to use HTTP Basic authentication with the remote host.)

```

As someone who struggled when switching to Linux, this would have been a wonderful tool to have to help grok those damn (but helpful) man pages!

#### Searchable History

Earlier today, you wrote this wonderful `git` command. Perhaps it looked something like this

```
git for-each-ref --sort=-committerdate refs/heads/ --format='%(HEAD) %(color:yellow)%(refname:short)%(color:reset) - %(color:red)%(objectname:short)%(color:reset) - %(contents:subject) - %(authorname) (%(color:green)%(committerdate:relative)%(color:reset))'
```

Normally, if you didn’t save this to a script, it would be lost in the void that is the shell’s history. Thankfully, with fish, you can simply type `git for-each` and then proceed to press the up arrow to cycle through commands you have previously ran that start with this snippet until you find the masterpiece you’re looking for. For what it’s worth, that’s a badass `git` command. I do recommend saving it to a function.

#### Prettiness without Cruft

This one, despite making me sound like a shallow developer whom cant handle the green-lit screen from the early 70’s that still mocks us today as modern developers, is kind of important to me. I can’t stand default bash. I like to have information at the ready. When I first found Zsh (Zshell), I was dumbfounded. I didn’t realize I could have the current git repo status, today’s date, mother’s maiden name, and today’s weather forecast all in my terminal only to be updated on every line. Plus, you can install crazy fonts to create shapes in your terminal to customize it even more. Nowadays, that’s a bit much for me, but I do appreciate having the current git repo’s status illustrated via my terminal. It’s something that readily influences 50% of the commands I run so its nice to have on hand.

Thankfully, fish helps provide that just like Zsh. “What’s the difference?” you might be asking. If you’ve used Zshell before (and you probably used it with Oh-my-zsh!) you may have realized that its a bit slower to boot up when you open a new terminal. Fish still provides the prettiness and customizations that Zsh offers (conceptually; Zsh plugins wont work on Fish and vice versa) but doesn’t bog down your terminal. Fish boots cleanly and quickly when you create a new tab or terminal.

In fact, here’s what I see when I create a new terminal window.

```

          #######                      User: bradcypert
          ########                     Hostname: #############
              #####                    Distro: OS X 10.13
               #####                   Kernel: Darwin
               ######                  Uptime: 82 days
              ########                 Shell: /usr/local/bin/fish
            ###########                Terminal: xterm-256color Hyper
           #####   #####               Terminal Size: 50 x 195
          #####     #####              CPU: Intel Core i5-6267U CPU @ 2.90GHz
        #####        #####             Memory: 8 GB
       #####          #####   ##       Disk: 31%
     #####             ##########      Battery: 100%
    #####               #######        Date: Tue Feb 13 16:20:16 EST 2018


bradcypert@Brads-Tome-of-Code ~  ✗

```

Nice, huh?

#### Interested in Fish?

Awesome! Glad to have you onboard! [You can download fish from this website](https://fishshell.com/) (or via `brew install fish`, you savvy person) and if you’re interested in finding some of the fish scripts I use, I’ve [started a git repo and added them here](https://github.com/bradcypert/Pond).
