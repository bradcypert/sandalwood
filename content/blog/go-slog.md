---
title: "Log is dead, long live slog"
date: 2023-09-06
status: publish
permalink: /go-slog
author: "Brad Cypert"
type: blog
images:
  - pexels-khari-hayden-923167.jpg
category:
  - go
tags:
  - go
  - logging
  - slog
description: "Discover the power of structured logging in Go with log/slog. Learn how to log with context, format your logs, and leverage key-value pairs for efficient troubleshooting and analysis. Upgrade your logging game today!"
versions:
  go: 1.21
outline:
  what: "You should use log/slog in Go"
  why: "log/slog provides structured logging similar to tools like logrus."
  how: "log/slog is provided by the standard library"
  when: "log/slog should be used as a foundational layer for logging. Ideally tools will build ontop of log/slog instead of the standard logger."
---

In the world of Go programming, logging is an essential aspect of any application. It helps us track down issues, monitor the behavior of our code, and gain insights into how our software is performing. While the standard library provides a basic logging package, it's time to step up our logging game with `log/slog`. In this blog post, we'll explore why you should embrace [log/slog](https://pkg.go.dev/log/slog) in your Go projects.

## Why Use log/slog in Go?

### Structured Logging

Traditional logging often involves dumping text messages into files or console outputs. While this can work for simple scenarios, it falls short when you need to extract meaningful information from logs. This is where structured logging shines, and `log/slog` delivers.

`log/slog` provides structured logging, which means you can log key-value pairs instead of plain text messages. This makes it much easier to search, filter, and analyze your logs. Imagine being able to query logs based on specific fields, such as timestamps, error codes, or user IDs, without having to parse through messy log files manually. Structured logs make this a breeze.

### Familiarity with logrus

If you're coming from the Go ecosystem, you might be familiar with the popular logging library `logrus`. `log/slog` shares a lot of similar ideas with `logrus` and offers a similar experience. If you've enjoyed using `logrus`, you'll feel right at home with `log/slog`, and transitioning to it should be quite smooth.

## How to Use log/slog

The best part about `log/slog` is that it comes straight from the standard library. You don't need to install any third-party packages or worry about compatibility issues. Just import it and start using it in your Go code:

```go
import (
    "log/slog"
)
```

With log/slog, you can create structured log entries using the `slog.Info`, `slog.Warn`, and `slog.Error` functions, among others. Here's a quick example:

```go

package main

import (
    "log/slog"
)

func main() {
    slog.Info("This is an informational log entry", "key1", "value1", "key2", "value2")
    slog.Error("This is an error log entry", "error_code", 500)
}
```

By using key-value pairs, you're adding valuable context to your log entries, making troubleshooting and analysis more efficient.

### Formatting Your Logs with log/slog

One of the great features of log/slog is its flexibility when it comes to log formatting. By default, it uses a simple text format for log entries, which is quite similar to the standard library's log package. However, log/slog offers an alternative JSON formatter that can be incredibly useful for structured logging.

### JSON Formatting

JSON formatting is a popular choice for structured logs because it aligns perfectly with the key-value pairs used in structured logging. It's easy to parse and analyze, and it's also human-readable. Additionally, JSON is a standard format for communicating between applications and tools like Splunk, Logstash, Grafana, Dynatrace, Datadog (and so on). There's a good chance you're ultimately sending logs there, so JSON as a standard format usually works well! To switch to JSON formatting in log/slog, you can do the following:

```go

slog.New(slog.NewJSONHandler(os.Stdout, nil))
```

With JSON formatting, your log entries will look something like this:

```json

{"level":"info","msg":"This is an informational log entry","key1":"value1","key2":"value2"}
{"level":"error","msg":"This is an error log entry","error_code":500}
```

Again, this format can be particularly handy when you're dealing with log aggregation systems like Elasticsearch, Logstash, or fluentd, as they can easily parse and index JSON log entries.

### Using slog.WithGroup for Log Context

log/slog provides the slog.WithGroup function, which allows you to create a new logger with additional key-value pairs that will be included in all log entries produced by that logger. This is incredibly useful for adding context to your logs without having to repeat the same information in every log call.

Here's an example of how you can use slog.WithGroup:

```go

package main

import (
    "log/slog"
)

func main() {
    // Create a base logger
    baseLogger := slog.New()

    // Create a grouped logger with additional context
    groupedLogger := baseLogger.withGroup(baseLogger, "module", "app")

    // Log with the grouped logger
    groupedLogger.Info("This log entry includes module information.")
    groupedLogger.Warn("This log entry also includes module information.")
}
```

In this example, both log entries produced by groupedLogger will include the "module" field set to "app". This can be especially helpful when you want to attach common context to logs, such as the module or component generating the log entry.

### Logging a Context

It's no secret that Context's are extremely powerful in Go. When logging, there's even a good chance that you'd want to log a context as part of the log. While this has been possible with the standard logger for a while, log/slog makes this easier than ever.

```go
slog.InfoContext(ctx, "message")
```
 

### When to Use log/slog

log/slog should be your go-to choice for logging in Go applications, especially if you're building something that might be used by others. It provides structured logging out of the box, and you can easily integrate it into your existing codebase. Consider it a foundational layer for logging in your projects.

Moreover, when creating tools or libraries in Go, consider using log/slog as the default logger. By doing this, you enable users of your tools to easily switch to their preferred logging solutions without rewriting a lot of code.

In conclusion, the days of basic, unstructured logging in Go are likely over. With log/slog, you can embrace the power of structured logging, making your applications more robust and easier to maintain.

So, if you're still using the old log package in your Go projects, it's time to make the switch. Give log/slog a try, and you'll wonder how you ever lived without it.

Happy logging!
