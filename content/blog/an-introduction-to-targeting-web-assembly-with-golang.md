---
title: "An Introduction to Targeting Web Assembly with Golang"
date: 2020-12-05
description: "Learn how to you can use Golang to target Web Assembly in this introductory tutorial"
status: publish
author: "Brad Cypert"
excerpt: ""
category:
  - Go
tags:
  - wasm
  - go
versions:
  go: 1.16
---
<div>
  <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/Jo7BbL7Xdms" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<a href="https://news.dartlang.org/2015/03/dart-for-entire-web.html" target="_blank" rel="noreferrer">In 2015, Google announced that the Dart VM would not be built into chrome</a>. This was an impactful day for me because from Dart's inception, I had hope that we'd have a first class alternative to JavaScript for web clients.

Don't get me wrong, I have written a ton of JavaScript, but that doesn't necessarily mean that I like the language. TypeScript, although not something a browser can simply execute as is, has done wonders for me but Im still left yearning for other alternatives to JavaScript.

Enter Web Assembly. When I had first heard of web assembly, my feelings weren't of excitement. I had written a tiny bit of assembly in college and the idea of shoving assembler instructions into chrome devtools sounded like a step backwards. Thankfully, Web Assembly is not simply shoving assembler instructions into chrome or firefox.

Web Assembly is a language that, similar to TypeScript compiling down to JavaScript, is targeted by another language as the build target. For this example, we'll use Golang and target Web Assembly as a platform and architecture, but there are other languages that can target web assembly, too (<a href="https://hacks.mozilla.org/2017/07/memory-in-webassembly-and-why-its-safer-than-you-think/" target="_blank" rel="noreferrer">Rust</a>, <a href="https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm" target="_blank" rel="noreferrer">C, C++</a> to name a few).

### Why use Web Assembly?

It's important to recognize that Web Assembly, just like JavaScript, is a tool to solve a problem. Web Assembly is _fast_ <sup><a href="https://www.smashingmagazine.com/2019/04/webassembly-speed-web-app/" target="_blank" rel="noreferrer">1</a></sup> <sup><a href="https://wasmboy.app/benchmark/" target="_blank" rel="noreferrer">2</a></sup>. Additionally, Web Assembly, when built correctly can actually produce [an extremely small, preoptimized binary](https://dl.acm.org/doi/abs/10.1145/3062341.3062363).

Its important to note that Web Assembly requires <a href="https://hacks.mozilla.org/2017/07/memory-in-webassembly-and-why-its-safer-than-you-think/" target="_blank" rel="noreferrer">manual memory management (but the language that you write your application in may help handle this)</a>.

### Can I intermingle?

This is an extremely relevant question, in my opinion. Maybe you want to continue building user interfaces in React, but have interest in migrating any business logic into WebAssembly for a possible performance gain. Maybe you just want to reuse some code from your server that's written in Rust, Go, C or C++ (or any other language that can target web assembly). There are a lot of use cases where it makes sense to intermingle (use both) JavaScript and Web Assembly. Thankfully, they're made to be interoperable.

### Our Simple Web Assembly Program

We're going to start by coding a very, very basic Go program that targets Web Assembly during the build process. Let's start out by printing "Hello World" to the console:

1. Create a new directory to house our project. I used `mkdir go-wasm`, but you can use whatever you'd like.

2. `cd` into your newly created directory and run `go mod init github.com/your-name-here/go-wasm`. Update your command to use your name or username and if you chose a different folder name then update that as well.

3. We'll create a new file named `main.go` and add the following to it:

```go
package main

import (
	"fmt"
)

func main() {
	fmt.Println("Hello World!")
}
```

You'll notice that there's nothing special going on in this Go file. That's not always the case, but for this example we have some extremely normal-looking Go code. In fact, feel free to `go run` this and make sure it works.

4. We'll have to add a Web Assembly Support file to run our code. Thankfully, Golang ships with one. We can just run `cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" .`

5. Next we'll need to setup an HTML file to be rendered to browser. Additionally, we'll include some JavaScript to load and execute our Web Assembly program.

```html
<html>
  <head>
    <meta charset="utf-8" />
    <script src="wasm_exec.js"></script>
    <script>
      const go = new Go();
      WebAssembly.instantiateStreaming(
        fetch("main.wasm"),
        go.importObject
      ).then(result => {
        go.run(result.instance);
      });
    </script>
  </head>
  <body></body>
</html>
```

Our scripts are the most interesting part of this HTML file. Our first script loads the wasm_exec.js file from step 4, while our second script fetches and executes our web assembly instructions.

6. Our last step is to build out `main.wasm` file. We can do that simply by setting a few flags before running our build command: `GOOS=js GOARCH=wasm go build -o main.wasm`. You'll also notice that we're specifing our output filename here, too!

With everything setup, you can serve this directory over an HTTP server however you see fit. If you need recommendations, You can use the `goexec` package to execute arbitrary go commands (like ListenAndServe). To install: ` go get -u github.com/shurcooL/goexec` and to run a simple HTTP server: `goexec 'http.ListenAndServe(`:8080`, http.FileServer(http.Dir(`.`)))'`

Now that our server is up and running, go to localhost:8080 (or whatever your server address is) and you should see a blank white screen (we'll do more with that in a moment). For now, open your devtools and search for "Hello World" in the console output. If it's there, you've successfully set up and ran a Go program using Web Assembly as a build target.

### Adding Elements with Golang/WASM

As far as demos go, this is one of the most underwhelming ones that I could offer. We're about to fix that (don't worry, its still nothing crazy). Our plan is to add a couple of elements to our webpage via Web Assembly and then set some properties on them as well. Let's start by modifying our Go code to look like this:

```go
 package main

import (
	"fmt"
	"syscall/js"
)

func main() {
	fmt.Println("Hello World!")
	document := js.Global().Get("document")
	p := document.Call("createElement", "p")
	p.Set("innerHTML", "Hello WASM from Go!")
	p.Set("className", "block")

	styles := document.Call("createElement", "style")
	styles.Set("innerHTML", `
		.block {
			border: 1px solid black; color: white; background: black;
		}
	`)

	document.Get("head").Call("appendChild", styles)
	document.Get("body").Call("appendChild", p)
}
```

Alright! Let's talk through our changes:

We've added a new import (syscall/js). This gives us access to functions that help us interface with JavaScript related tidbits, such as getting the browser document. In our main method, we do exactly that. We then leverage `document.Call` to create a new paragraph (p) element. Lastly, we set a few properties on our newly defined paragraph element.

We do the same thing shortly after but with a style Element. In this case, we want to set the innerHTML to apply a css class. Finally, we get the head and the body of the document and append the styles and paragraph elements respectively.

With our changes in place, we can rebuild our web assembly instructions via `GOOS=js GOARCH=wasm go build -o main.wasm` and relaunch our server via `goexec 'http.ListenAndServe(`:8080`, http.FileServer(http.Dir(`.`)))'` to see our changes. We should see "Hello WASM from Go" in a black box in the document. Tada 🎉!
