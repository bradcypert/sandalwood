---
title: "Testing a Cobra CLI in Go"
date: 2019-07-18
status: publish
permalink: /testing-a-cobra-cli-in-go
author: "Brad Cypert"
excerpt: ""
type: blog
id: 1703
thumbnail: /cropped-action-plan-brainstorming-complex-212286-e1563490331368.jpg
category:
  - Go
tags:
  - cobra
  - go
  - testing
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_primary_category:
  - "209"
_yoast_wpseo_focuskw:
  - "Testing Cobra CLI"
_yoast_wpseo_linkdex:
  - "76"
_yoast_wpseo_content_score:
  - "90"
description:
  - "Testing a Cobra CLI is easy if you take the time to refactor your command function out into function with an identifier. It can then be tested as normal."
---

Go has a [fantastic library for writing CLI’s (Command Line Interfaces) called Cobra](https://github.com/spf13/cobra). I’ve been working on a [CLI named Deckard](https://github.com/bradcypert/deckard) for a few months now. Being new to Go, I had (lazily) shied away from writing tests. However, after thinking about my test plan and doing a little refactoring, I’ve found a great way to handle testing your Cobra CLI application.

The idea behind Cobra is that you simply write “Command” functions. These command functions are then called by the Cobra library when it parses a valid command. This means that Cobra handles a lot of the heavy lifting here, and because of that, has a pretty opinionated project structure. Thankfully, Cobra also has a CLI that makes starting a new cobra project a breeze.

## Our Cobra Command

Here’s an example of an extremely simple Cobra command from Deckard (commented for clarity):

```go
package cmd

// Import cobra and other dependencies
import (
	"fmt"
	"github.com/spf13/cobra"
)

// caneCmd represents our command
var caneCmd = &cobra.Command{
	Use:   "cane",
	Short: "Ponder mysteries of the Horadrim", // short description
	Long:  `Ponder mysteries of the Horadrim`, // long description
	Run: func(cmd *cobra.Command, args []string) { // the function we want to run
                // Any code here is difficult to test!
		fmt.Println("Stay a while and listen...")
	},
}

// Our init function adds this command as a subcommand of our root command
// which is generated by the Cobra CLI when starting a new project).
func init() {
	rootCmd.AddCommand(caneCmd)
}
```

## Testing our Cobra CLI Command

You’ll notice that we don’t exactly control an entry point into our code. This can make testing rather difficult, since Cobra is responsible for calling our command. However, with a small abstraction, we can make testing our command even easier. There are two similar paths to take with this refactor.

1. Create a local function and have the anonymous cobra function call the local function.
2. Create a local function and use a function reference in place of the anonymous function.

The first example can be accomplished like so.

```go
package cmd

import (
	"fmt"
	"github.com/spf13/cobra"
)

func doSomething(cmd *cobra.Command, args []string) {
  fmt.Println("Stay a while and listen...")
}

// caneCmd represents the cane command
var caneCmd = &cobra.Command{
  Use: "cane",
  Short: "Ponder mysteries of the Horadrim",
  Long: `Ponder mysteries of the Horadrim`,
  Run: func(cmd *cobra.Command, args []string) {
  doSomething(cmd, args)
  },
}

func init() {
  rootCmd.AddCommand(caneCmd)
}

```

With this pattern, we can easily test the `doSomething` function and since the command function simply calls that function, that gives us pretty great coverage. The other pattern, however, is even cleaner.

```go
package cmd

import (
	"fmt"
	"github.com/spf13/cobra"
)

func doSomething(cmd *cobra.Command, args []string) {
	fmt.Println("Stay a while and listen...")
}

// caneCmd represents the cane command
var caneCmd = &cobra.Command{
	Use:   "cane",
	Short: "Ponder mysteries of the Horadrim",
	Long:  `Ponder mysteries of the Horadrim`,
	Run: doSomething,
}

func init() {
	rootCmd.AddCommand(caneCmd)
}
```

With this pattern, we simply use the function reference instead of a pass-through function. We can still write tests for `doSomething`, but this code might look a bit more foreign to developers who haven’t seen it before. A trade-off for everything, I suppose.

Which do you prefer? Let me know in the comments below!

If you’d like to [learn more about Go, you can find my posts on Google’s programming language here](/tags/go)!