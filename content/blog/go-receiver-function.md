---
title: "Golang: What is a receiver function?"
date: 2019-06-30
status: publish
permalink: /go-receiver-function
author: "Brad Cypert"
excerpt: ""
type: blog
id: 1619
images:
  - cell-tower-cellphone-masts-clouds-270286.jpg
category:
  - Go
tags:
  - go
description: "Go's receiver function allows you to define functions that belong to structs, similarly, but still quite different from instance methods in OOP."
versions:
  go: 1.16
---

Classes aren’t really a thing in Go, so you cant have instance methods ([like Java or similar](https://www.geeksforgeeks.org/static-methods-vs-instance-methods-java/)), however, you may have noticed some functions in Go that appear to be instance methods. These are [Go’s receiver functions](https://tour.golang.org/methods/4).

The way they work is quite simple. If you have a struct like so:

```go
type Database struct {
	Host     string
	Port     int
	User     string
	Password string
	Dbname   string
	Driver   string
}
```

You could write a function that takes the struct in as a parameter. For example:

```go
d := Database{...}

func getDatabaseRoot(db *Database) {
return db.Host + ":" + db.port
}

getDatabaseRoot(d)

```

## Go’s receiver function

However, Go gives us the ability to specify that getDatabaseRoot is a function that belongs to that Struct, via receiver functions. Instead of the above, we can write:

```go
d := Database{...}

func (d Database) getDatabaseRoot() {
    return d.Host + ":" + db.port
}

d.getDatabaseRoot();
```

And Voilà. That’s how you define and user a receiver function in Go!

It’s worth mentioning that there are some concerns with Go’s receiver functions in regards to testability. Namely, receiver functions are, as far as I know, something you can’t stub which can make testing functions that depend on those functions a real pain.

If you’re interested in learning more about Go, [you can check out more of my articles on Google’s awesome language here](/tags/go).
