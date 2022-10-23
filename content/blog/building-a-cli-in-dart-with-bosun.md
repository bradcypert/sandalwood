---
title: "Building a CLI in Dart with Bosun"
date: 2022-03-18
status: publish
permalink: /building-a-cli-in-dart-with-bosun
author: "Brad Cypert"
thumbnail: /art-assorted-background-1619844.jpg
excerpt: ""
type: blog
category:
  - dart
tags:
  - dart
  - cli
  - bosun

description: "Bosun is a library for writing expressive CLIs in Dart."
---



Command Line Interfaces (CLIs) are some of the simplest program interfaces to build, but some of the most difficult program interfaces to build well. CLIs have been around longer than I have and, over my career, I've really grown to love them. CLIs can be written in many different languages (I've recently written some in Go and Rust to name a few), but today I want to talk about writing CLIs in my favorite language -- Dart.

There are a lot of guides, books, and material on architecting a JavaScript application or a backend server, but there aren't many resources that guide you in how to structure your CLIs. I built [Bosun](https://www.github.com/pyrestudios/bosun) to help tackle this problem.

Bosun allows you to structure your CLI commands in a tree and takes advantage of type-safe classes to help you build out your CLI application. [The pub.dev page for Bosun can be found here](https://pub.dev/packages/bosun), but don't worry as we'll cover all you need to know in this post.

<HeadsUp title="A note on version numbers">
  This post is using Bosun 0.2.1. The Bosun library has not hit 1.0 yet. We're trying to follow semantic versioning as closely as possible, but most things pre-1.0 end up getting a bit hectic. If you're having issues running this on a newer version of Bosun, you may want to cross-reference the documentation in the repository.
</HeadsUp>

We're going to build a simple CLI that could be expanded upon to perform actions with containers. We'll stub out all of the actual program internals so we can just focus on the CLI. We'll go ahead and start by creating a new Dart project:

```bash
dart create containy
```

We can go ahead and open up our project in our editor of choice. Bosun has an example showing how a simple CLI would work, and we're going to go ahead and copy the main method [from that example](https://pub.dev/packages/bosun/example) and paste that as the main method in our `bin/contiainy.dart' file.

```dart
import 'package:bosun/bosun.dart';

void main(List<String> args) {
  execute(BosunCommand('donker', description: 'The donker CLI tool', subcommands: [RunCmd()]), args);
}
```

Let's go ahead and modify this file so that it captures what our project is meant to encompass.

```dart
import 'package:bosun/bosun.dart';

void main(List<String> args) {
  execute(
      BosunCommand('containy',
          description:
              'CLI for doing things with containers, kube clusters, storage buckets and more!',
          subcommands: []),
      args);
}
```

This sets up the shell of our CLI application. The first argument to BosunCommand is the CLI name. The description gives users more information about the CLI and subcommands is where we'll start nesting subcommands once we have them. For now, let's run our project and pass in `--help`.

```bash
dart run bin/containy.dart --help
containy
CLI for doing things with containers, kube clusters, storage buckets and more!

example:
  No example provided

supported flags:
```

You can see that there's also an area for examples and supported flags. These are not required but the more information that your CLI provides to Bosun, the better the user experience will generally be.

Let's go ahead and plan out our subcommands. We're going to add three new subcommands to this CLI. We want to be able to run `containy containers`, `containy containers list`, `containy containers logs $containerId`. Additionally, each of these commands should support an `env` flag.

We'll start by creating a new command called `ContainerCommand`. The pattern for this command will be slightly different than our BosunCommand but the same fields are supported.

```dart
import 'package:bosun/bosun.dart';

class ContainerCommand extends Command {
  ContainerCommand()
      : super(
            command: 'container',
            aliases: ['containers', 'c'],
            description:
                'used for scoping following commands to container functionality',
            example: 'containy container --env=prod',
            subcommands: [ContainerListCommand(), ContainerLogCommand()],
            supportedFlags: {
              'env': 'the environment to query containers against'
            });

  @override
  void run(List<String> args, Map<String, dynamic> flags) {
    print('Do something with containers in ${flags['env'] ?? 'local'}');
  }
}
```

You'll notice that we've chosen to structure this command as a class via inheritence. This isn't the only way to structure your commands, but I find that this is often the cleanest way. Additionally, you'll note that our command is called `container`, it has aliases of `containers` and `c`, a description, example, subcommands (which we'll build in a moment), and a list of supported flags.

Finally, we override the run method from Bosun's Command class. This is the method that gets called when Bosun parses the CLI input and finds that this command matches the CLI input. Ideally you'd do something that connects to the environment provided by the flag and tell the user something about containers, but for now we'll just print to the console.

Let's go ahead and make our ContainerListCommand.

```dart
class ContainerListCommand extends Command {
  ContainerListCommand()
      : super(command: 'list', description: 'list all containers', aliases: [
          'l'
        ], supportedFlags: {
          'env': 'the environment that you want search for containers'
        });

  @override
  void run(List<String> args, Map<String, dynamic> flags) {
    print('''Containers in ${flags['env'] ?? 'local'}:
  Container abc123
  Container def456
    ''');
  }
}
```

This is very similar to the Container command. The primary thing to remember here is that this command lives under the container command and will be called via `containy containers list --env=prod`. Again, we're stubbing out the actual function body to be ran as thats _way_ beyond the scope of this tutorial.

Let's knock out the ContainerLogCommand. 

```dart
class ContainerLogCommand extends Command {
  ContainerLogCommand()
      : super(
            command: 'log',
            aliases: ['logs'],
            description: 'show logs for a given container',
            supportedFlags: {
              'env': 'the environment that you want search for containers'
            });

  @override
  void run(List<String> args, Map<String, dynamic> flags) {
    if (args.isEmpty) {
      throw Exception('Must provide an argument to show logs');
    }
    print('''Logs for ${args[0]} in ${flags['env'] ?? 'local'}:
  incoming http request
  request failed with 401
    ''');
  }
}
```

This command is a bit more interesting. We want to require at least one argument to be passed in to this command. While Bosun doesnt have a way to validate arg count (yet), you can easily tackle that in your run method. Ideally you'll show something meainingful instead of (or before) throwing an exception, but I think the point is made here that this is an error state.

Finally, take our three new commands and wire them back up to the root bosun command. Back in our `bin/containy.dart`:

```dart
import 'package:bosun/bosun.dart';

import 'container.dart';

void main(List<String> args) {
  execute(
      BosunCommand('containy',
          description:
              'CLI for doing things with containers, kube clusters, storage buckets and more!',
          subcommands: [
            ContainerCommand(),
            // KubeCommand(),
            // StorageCommand(),
          ]),
      args);
}
```

I've added two commented out Commands that havent been built yet. The point that I'm trying to make here is that if you wanted a new grouping of command (such as one for Kube or Storage), you'd simply build them and add them to the root Bosun command.

Now that this is all put together, let's compile this as an exe.

```bash
➜ dart compile exe ./bin/containy.dart
Info: Compiling with sound null safety
Generated: /Users/bradcypert/Projects/containy/bin/containy.exe
```

Now we can run our CLI:

```bash
➜ ./containy.exe container list --env=prod
Containers in prod:
  Container abc123
  Container def456



# testing our error state
➜ ./containy.exe container log --env=prod
Unhandled exception:
Exception: Must provide an argument to show logs
#0      ContainerLogCommand.run (file:///Users/bradcypert/Projects/containy/bin/container.dart:52)
#1      CommandExecutor.execute (package:bosun/src/command_executor.dart:8)
#2      execute (package:bosun/bosun.dart:13)
#3      main (file:///Users/bradcypert/Projects/containy/bin/containy.dart:6)
#4      _delayEntrypointInvocation.<anonymous closure> (dart:isolate-patch/isolate_patch.dart:295)
#5      _RawReceivePortImpl._handleMessage (dart:isolate-patch/isolate_patch.dart:192)



➜ ./containy.exe container log abc123 --env=prod
Logs for abc123 in prod:
  incoming http request
  request failed with 401



➜ ./containy.exe container log --help
log  logs
show logs for a given container

example:
  No example provided

supported flags:
  env: the environment that you want search for containers



➜ ./containy.exe container list --help
list  l
list all containers

example:
  No example provided

supported flags:
  env: the environment that you want search for containers



➜ ./containy.exe cntn
    No command found that matches cntn. Did you mean:
    container?
```

Hopefully you're comfortable with creating simple CLIs in Bosun now! Additionally, Bosun is open source so please feel free to contribute or file issues as you see fit: [https://www.github.com/pyrestudios/bosun](https://www.github.com/pyrestudios/bosun).