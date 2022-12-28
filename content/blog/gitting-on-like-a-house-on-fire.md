---
title: "Gitting on like a house on fire"
date: 2017-09-26
status: publish
permalink: /gitting-on-like-a-house-on-fire
author: "Brad Cypert"
excerpt: ""
type: blog
id: 70
category:
  - Git
tags:
  - git
post_format: []
description: "Learn a few git tricks for free to improve your workflow and code like a git master!"
_yoast_wpseo_title:
  - "Gitting on like a house on fire"
---

As someone whose first job consisted of one codebase, production, and FTP deploys I can say that our developer tools have come a long way. Albeit there were version control tools when I started coding, I wasn’t introduced to them until I was introduced to Git. Still a phenomenal tool 7 years later, there’s so much to Git. I’m hoping to provide you with a few tips that you may not know to help your git workflow.

#### Discarding the last commit

Have you ever committed something to only realize that you’ve committed files that shouldn’t have committed?  
You can toss your latest commit with the following command.

```bash
git reset --hard HEAD~1

```

If you want to keep the changes but don’t want the commit (you might want to stash them and swap branches for example), you can instead run the following command.

```bash
git reset HEAD~1

```

#### Figuring out the commit hash

For a lot of the next tips, you’ll need a specific commit hash. The simplest way to find a commit hash is to use `git log` and manually copy the hash. There are other ways, but familiarizing yourself with `git log` is a good habit to build.

#### Checking out a previous commit

Sometimes, you’ll want to check out the exact state of the code at a given commit. Perhaps someone forked a branch off of a commit and their branch isn’t working. You might want to check their branch and see if it fails. If so, your next step might be to check out the last commit before the branch and try it. You can get your commit hash and use the following command. Let’s assume my commit hash is ABC123.

```bash
git checkout ABC123

```

#### Determining what commit broke the branch

Sometimes you’re in an environment where your git pushes are blocked by unit tests. And some of those times, people have failing tests but end up forcing a push (there are other cases that could get you in this state too). Ideally, it’d be great to find a way to determine if a commit was good or bad. For this example, I’ll be using an `npm` project with a script called `test` that determines if tests pass. If tests do not pass, we have a bad commit. Let’s assume that our current commit is broken and the last commit that I remember working was 10 commits ago when we branched off of master.

First, you’ll need to start a bisect. A bisect is a binary search that helps find the commit that caused issues based on the criteria you provide.

```bash
git bisect start

```

Since our current revision is bad, we’ll mark it as bad.

```bash
git bisect bad

```

Next, let’s check out our last known good commit. We will assume that it has a hash of “14a41bc”.

```bash
git checkout 14a41bc
```

Now, let’s mark this one as good.

```bash
git bisect good
```

At this point, you’ll see some messaging informing you of the bisect and the revision you switched too. We want a clean slate for the project so we’ll run:

```bash
rm -rf ./node_modules && rm package-lock.json && npm i && npm run test

```

If that passes, we’ll run `git bisect good` if that fails, we’ll run `git bisect bad`. Regardless of how we mark it, it’ll move on to the next commit. Run the above command again and mark it accordingly. Make note of the messaging that bisect returns. Eventually, you’ll be told which commit caused the issues (hint, it’ll be the last one too). From there, you can talk to the committer or take matters into your own hands and fix it.

#### Merging a branch into another as 1 single commit

When you work with branches you may find yourself in a situation where you want to make a bunch of commits (I make a ton of commits called “checkpoint” because I’m paranoid about my computer shitting itself when I go to lunch). However, I don’t really want all of those commits making it into master. When I go merge my commits into master, I can provide the `squash` flag to squash all of those commits into one commit. You can do it like so:

```bash
git merge --squash my_chatty_branch

```

#### Merging without a merge commit

If you’re OCD like me, you may like to get your branches into master without a merge commit (those tacky things that usually have a message like “merge of branch A into branch B”. Rebasing is a strategy that allows you to replay your branches commits on top of another branch. For example, if I branch off of master and create a branch `foo` and make 10 commits into foo but want to merge those back into master, I can do the following:

```bash
git checkout master
git rebase foo
```

There are more awesome features that come with rebasing, too, such as the interactive mode that lets you select, skip, or modify commits as you rebase them. The idea of replaying becomes important here as you’re making one commit at a time into the target branch.

#### Swapping to another branch in the middle of work

“Hey Brad, is master working for you?” Hang on, I’ll check. But wait, I’ve got 18 files that have been changed here and most of them aren’t complete. I don’t really want to commit this but I don’t want to lose it. Enter `git stash`. `git stash` is a tool that puts changes on a stack and can be applied at a later date.

```bash
git stash
git checkout master
./is_master_ok.sh # or whatever
git checkout my_branch
git stash apply
```

#### Moving a single (or a few) commits from one branch to another.

Sometimes you’ll find the need to move commits from branch B into Master. Perhaps there was a change to the dependencies or build file or something that should be migrated to master, but the rest of the code isn’t ready yet. Sure, you can simply make the same changes in master and commit them, but that’s working harder not smarter. Let’s assume we have a commit like so:

```bash
commit 09c29f4160685273bc64389a0161757d417123b1
Author: 👾 Brad 👾 <brad.cypert@gmail.com>
Date:   Mon Sep 25 22:09:44 2017 -0400

    Fix broken CI config
```

We want to move this single commit into master:

```bash
git cherry-pick 09c29f
```

Any chance these were helpful? Let me know below!
