---
title: "Multithreading in Zig with Thread Pools, Mutexes, and Waitgroups"
date: 2025-06-23
status: publish
author: "Brad Cypert"
type: blog
category:
  - zig
  - multithreading
  - threading
  - threadpool
  - waitgroup
versions:
  zig: 0.14.0
images:
  - zig-multithreading.jpeg
description: "Learn how to accelerate your Zig code using multi-threading. This guide covers thread pools, mutex synchronization, and wait groups to run tests in parallel safely and efficiently."
---

In this article, we’ll explore how to implement zig multi-threading to speed up an integration test runner by leveraging thread pools, mutexes, and wait groups. If you’re looking to enhance your Zig projects with efficient parallel processing, this step-by-step guide will walk you through the entire process—from refactoring your code for thread safety to running tests concurrently. If you'd just like to see all of the changes to support this, [check out this PR](https://github.com/bradcypert/httpspec/pull/13).

## Step 1: Understanding the Project and Its Current Limitations

We start with my open-source Zig project called [HTTPspec](https://github.com/bradcypert/httpspec). The project parses HTTP test files, makes HTTP requests based on that parsing, and then runs assertions on the HTTP responses. Currently, the test runner processes each HTTP test file sequentially, which can be slow when scaling up to many tests.

Each HTTP test file can contain multiple requests, which allows for sequencing scenarios like setup, assertion, and teardown within a single file. However, the test files themselves run serially, which is a bottleneck.

The goal is to parallelize the execution of independent test files using Zig's multi-threading capabilities. This means running multiple HTTP requests concurrently, improving test throughput without sacrificing the linear execution of dependent requests within the same file.

## Step 2: Refactoring the Test Reporting Logic with a Mutex

To safely manage test results across multiple threads, shared state such as `testCount`, `testPass`, `testFail`, and `testInvalid` must be synchronized. The simplest approach is to use a mutex, which prevents race conditions by locking shared data during updates.

```zig
const std = @import("std");

pub const BasicReporter = struct {
    test_count: usize,
    test_pass: usize,
    test_fail: usize,
    test_invalid: usize,
    m: std.Thread.Mutex,

    pub fn init() BasicReporter {
        return .{
            .test_count = 0,
            .test_pass = 0,
            .test_fail = 0,
            .test_invalid = 0,
            .m = std.Thread.Mutex{},
        };
    }

    pub fn report(self: *BasicReporter, writer: anytype) void {
        writer.print(
            \\
            \\All {d} tests ran successfully!
            \\
            \\Pass: {d}
            \\Fail: {d}
            \\Invalid: {d}
            \\
        , .{ self.test_count, self.test_pass, self.test_fail, self.test_invalid }) catch |err| {
            std.debug.print("Error writing to stdout: {}\n", .{err});
        };
    }

    pub fn incTestCount(self: *BasicReporter) void {
        self.m.lock();
        defer self.m.unlock();
        self.test_count += 1;
    }
    pub fn incTestPass(self: *BasicReporter) void {
        self.m.lock();
        defer self.m.unlock();
        self.test_pass += 1;
    }
    pub fn incTestFail(self: *BasicReporter) void {
        self.m.lock();
        defer self.m.unlock();
        self.test_fail += 1;
    }
    pub fn incTestInvalid(self: *BasicReporter) void {
        self.m.lock();
        defer self.m.unlock();
        self.test_invalid += 1;
    }
};
```

We encapsulate the reporting logic into a new struct called `BasicReporter`. This struct holds the counters and a `std.Thread.Mutex` for synchronization. It also provides thread-safe increment methods for each counter:

- `incTestCount()`
- `incTestPass()`
- `incTestFail()`
- `incTestInvalid()`

Each method locks the mutex, updates the counter, and unlocks the mutex, ensuring safe concurrent access. Additionally, a `report()` method prints the aggregated test results in a thread-safe manner.

## Step 3: Integrating the Reporter into the Main Test Runner

With the reporter struct in place, we swap out the old global counters for calls to the reporter's increment methods. This cleans up the main code and centralizes test result handling.

```zig
var reporter = TestReporter.BasicReporter.init();
```

After making these changes, the test runner still executes serially, but it is now ready for multi-threading since shared state is protected.

## Step 4: Extracting the Test Execution into a Separate Function

To run tests concurrently, the logic for running a single test must be isolated into its own function. We create a `runTest()` function that takes in the allocator, reporter, and the file path of the test to execute.

```zig
fn runTest(
    allocator: std.mem.Allocator,
    reporter: *TestReporter.BasicReporter,
    path: []const u8,
) void {
    var has_failure = false;
    reporter.incTestCount();

    var items = HttpParser.parseFile(allocator, path) catch |err| {
        reporter.incTestInvalid();
        std.debug.print("Failed to parse file {s}: {s}\n", .{ path, @errorName(err) });
        return;
    };
    const owned_items = items.toOwnedSlice() catch |err| {
        reporter.incTestInvalid();
        std.debug.print("Failed to convert items to owned slice in file {s}: {s}\n", .{ path, @errorName(err) });
        return;
    };
    defer allocator.free(owned_items);

    var client = Client.HttpClient.init(allocator);
    defer client.deinit();

    for (owned_items) |*owned_item| {
        defer owned_item.deinit(allocator);
        var responses = client.execute(owned_item) catch |err| {
            reporter.incTestInvalid();
            std.debug.print("Failed to execute request in file {s}: {s}\n", .{ path, @errorName(err) });
            return;
        };
        defer responses.deinit();
        AssertionChecker.check(owned_item, responses) catch {
            has_failure = true;
            break;
        };
    }
    if (!has_failure) {
        reporter.incTestPass();
    } else {
        reporter.incTestFail();
    }
}
```

Because thread pool jobs cannot return errors directly, `runTest()` handles all errors internally. If any step fails—like parsing the file or executing the HTTP request—the function increments the `testInvalid` counter and returns early.

## Step 5: Adding a Thread Pool and Wait Group for Parallel Execution

Next, we initialize a `std.Thread.Pool` with a configurable number of worker threads (initially hardcoded to 4). This pool manages the execution of jobs across multiple threads.

We also create a `std.Thread.WaitGroup` to keep track of running jobs and wait for all of them to complete before printing the final report.

```zig
var pool: std.Thread.Pool = undefined;
try pool.init(.{
    .allocator = allocator,
    .n_jobs = threads,
});
defer pool.deinit();

var wg: std.Thread.WaitGroup = .{};
var reporter = TestReporter.BasicReporter.init();

// Run all tests in parallel.
for (files.items) |path| {
    pool.spawnWg(&wg, runTest, .{ allocator, &reporter, path });
}
wg.wait();

// Print summary.
reporter.report(std.io.getStdOut().writer());
```

For each test file, we spawn a job in the thread pool using `pool.spawn(&wg, runTest, allocator, &reporter, path)`. The wait group ensures the main thread blocks until all test runs finish, preserving synchronization.

## Step 6: Running the Parallelized Tests and Debugging

After setting up the thread pool and wait group, running the test suite shows a dramatic improvement in speed. Tests execute concurrently, reducing total runtime.

Initially, there was a bug where the wait group wasn't being used properly, causing the report to show zero tests run. Adding the missing `wg.wait()` call fixed this, ensuring accurate reporting.

By tweaking the test cases, you can verify that passing and failing tests are tracked correctly even under concurrency.

## Step 7: Configuring Thread Count via Environment Variable

Hardcoding the thread count isn't ideal. To make the thread pool size configurable, we read an environment variable (e.g., `HTTP_THREAD_COUNT`) at runtime.

```zig
const threads = std.process.parseEnvVarInt("HTTP_THREAD_COUNT", usize, 10) catch 1;
```

Using `std.process.parseEnv()`, we attempt to parse the thread count as a `usize`. If parsing fails or the variable is not set, we default to a single thread to maintain compatibility.

This allows flexible adjustment of concurrency without changing code, adapting to different hardware or testing needs.

## Conclusion

This tutorial has demonstrated how to implement Zig multi-threading using a thread pool, mutex, and wait group. By refactoring the test runner to use a thread-safe reporter struct and isolating test execution logic, we enabled parallel execution of HTTP integration tests.

Zig's standard library provides straightforward primitives for multi-threading, making it accessible even if you're new to concurrent programming. You can now run multiple independent tests simultaneously, greatly improving performance.

If you're working with Zig and want to make your applications more efficient, I highly recommend exploring these concurrency constructs. They're powerful tools that will help you scale your projects seamlessly.

Feel free to experiment with the environment variable to find the ideal number of threads for your system, and consider how you might extend this pattern to other parts of your Zig applications.
