---
title: "Working with JSON in Dart"
date: 2020-09-27
status: publish
permalink: /working-with-json-in-dart
author: "Brad Cypert"
description: "JSON is a common communication specification for web apps. In this post, you'll learn how to work with JSON data in Dart."
type: blog
id: 3581
images:
  - Untitled.png
category:
  - dart
tags:
  - dart
versions:
  dart: 2.16.2
---

[JSON](https://www.json.org/json-en.html) is, as of 2020, the communication standard for most web applications (comon [gRPC](https://grpc.io/)! You can do it!). Naturally, if you’re building a Dart application, you’ll likely want to work with JSON. [Dart’s built-in `dart:convert` package](https://api.dart.dev/stable/2.9.3/dart-convert/dart-convert-library.html) is just the tool that you need!

## Creating a Model

One of the first things that you’ll probably want to do is to create a model for your JSON data. In this example, we’ll use a simplified version of the [Github API’s repository request](https://docs.github.com/en/free-pro-team@latest/rest/reference/repos). If you’d like to inspect the response that we’ll be parsing, here’s the URL : [https://api.github.com/users/bradcypert/repos](https://api.github.com/users/bradcypert/repos)

We’ll start by creating a simple Dart class to model this response. I say “simple” because I generally prefer that the class doesn’t do much except model the data. Additionally, we’re not going to model all of the fields in that response — we don’t need all that data and it’d be a lot of code that might dilute the quality of this demonstration. We’ll also override the `toString` method for ease of printing our new model.

```dart
class Repository {
  final int id;
  final String name;
  final String description;
  final String url;

  Repository({this.id, this.name, this.description, this.url});

  String toString() {
    return '[${this.id}, ${this.name}, ${this.description}, ${this.url}]';
  }
}
```

That’ll work. We’ll just capture the `id`, `name`, `description`, and `url` for our repositories. Now that we have something to store our decoded JSON into, the next step is to actually decode the JSON. We’ll leverage a few Dart packages for these steps. Here’s the breakdown of what we’re going to do:

1. We need to make an HTTP request to the github repository list endpoint.
2. We need to decode the response body into a `dynamic` type for our JSON.
3. We need to use that `dynamic` JSON type to create instances of our `Repository` Model.

Let’s get to it!

```dart
import 'package:http/http.dart' as http;
import 'dart:convert'; // give us the global jsonDecode

class Repository {
  final int id;
  final String name;
  final String description;
  final String url;

  Repository({this.id, this.name, this.description, this.url});

  String toString() {
    return '[${this.id}, ${this.name}, ${this.description}, ${this.url}]';
    }
  }

  void main() {
    http.get("https://api.github.com/users/bradcypert/repos")
    .then((response) => jsonDecode(response.body)).then((jsonBody) {
      var repos = jsonBody.map((repo) => Repository(
        id: repo['id'],
        name: repo['name'],
        description: repo['description'],
        url: repo['url'])
      );
      repos.forEach((repo) => print(repo.toString() + "\n"));
    });
  }
}

```

`jsonDecode` is doing all of the heavy lifting in regards to the parsing. We request the data from github, parse it, and then used the parsed JSON to create our model. Finally, for the sake of proving it works, we print our model to the console. Truncated for brevity, you should see something like this in your console:

```
[199228305, async-http, A channel-based HTTP client built around Golang's net/http package., https://api.github.com/repos/bradcypert/async-http]

[290240968, bradcypert.com, WordPress theme for BradCypert.com, https://api.github.com/repos/bradcypert/bradcypert.com]

[44900977, clojchimp, A small MailChimp client written in Clojure, https://api.github.com/repos/bradcypert/clojchimp]
...
```

First, pat yourself on the back. You’re parsing JSON with Dart. Second, don’t you think we could make this a little cleaner? Me too. Let’s create a new constructor for our Model.

## Refactoring our Model

We’re going to add[ redirecting constructor](/the-many-constructors-of-dart/) to our model here. This allows us to maintain our primary constructor, but specify a new constructor specifically for dealing with `dynamic` json types of data.

```dart

class Repository {
  final int id;
  final String name;
  final String description;
  final String url;

  Repository({this.id, this.name, this.description, this.url});

  Repository.fromJSON(dynamic json) {
    this(
      id: repo['id'],
      name: repo['name'],
      description: repo['description'],
      url: repo['url']
    )
  }

  String toString() {
    return '[${this.id}, ${this.name}, ${this.description}, ${this.url}]';
  }
}

```

Now, with our new redirecting constructor, we can simplify our main method as well!

```dart
import 'package:http/http.dart' as http;
import 'dart:convert'; // give us the global jsonDecode

class Repository {
  final int id;
  final String name;
  final String description;
  final String url;

  Repository({this.id, this.name, this.description, this.url});

  Repository.fromJSON(dynamic json) : this(
    id: json['id'],
    name: json['name'],
    description: json['description'],
    url: json['url']
  );


  String toString() {
    return '[${this.id}, ${this.name}, ${this.description}, ${this.url}]';
  }
}

void main() {
  http.get("https://api.github.com/users/bradcypert/repos")
    .then((response) => jsonDecode(response.body)).then((jsonBody) {
      var repos = jsonBody.map((jsonRepo) =>
        Repository.fromJSON(jsonRepo)
      );
      repos.forEach((repo) => print(repo.toString() + "\n"));
    });
}
```

How about that? Same output, but cleaner. **Note: I know that you can simplify this even further by removing the `map` call and just creating the `Repository` in the `forEach` instead. Most real world applications don’t just print to the console each of the items they have, and I find that proper use of `.map` tends to lead towards cleaner code. For demo purposes, you can simplify it, but follow I suggest following the patterns with `.map` in your own application!**

## Generating JSON from Models

Now that we know how to decode JSON and generate class instances from that JSON, it’s time that we flip-the-script and do the opposite. We’ll take our Repository class and modify it so that it can generate a Map that we can parse via `jsonEncode`. So, our steps for this change are as follows:

1. Add a new method to our model called `.toJson`
2. Write the code to return a map containing key-value pairs to represent our model’s data.
3. Call `jsonEncode` passing in our `Repository` instance (`toJson` method is called be `jsonEncode` under the hood).

```dart
class Repository {
  final int id;
  final String name;
  final String description;
  final String url;

  Repository({this.id, this.name, this.description, this.url});

  Repository.fromJSON(dynamic json) : this(
    id: json['id'],
    name: json['name'],
    description: json['description'],
    url: json['url']
  );


  Map<String, dynamic> toJson() => {
    'id': this.id,
    'name': this.name,
    'description': this.description,
    'url': this.url
  };

  String toString() {
    return '[${this.id}, ${this.name}, ${this.description}, ${this.url}]';
  }
}
```

So now that we’ve added our `toJson` method, we can call `jsonEncode` on a repository object like so:

```dart
import 'package:http/http.dart' as http;
import 'dart:convert'; // give us the global jsonDecode

class Repository {
  final int id;
  final String name;
  final String description;
  final String url;

  Repository({this.id, this.name, this.description, this.url});

  Repository.fromJSON(dynamic json) : this(
    id: json['id'],
    name: json['name'],
    description: json['description'],
    url: json['url']
  );


  Map<String, dynamic> toJson() => {
    'id': this.id,
    'name': this.name,
    'description': this.description,
    'url': this.url
  };

  String toString() {
    return '[${this.id}, ${this.name}, ${this.description}, ${this.url}]';
  }
}

void main() {
  // create a new Repository instance in our application
  Repository repo = Repository(id: 0, name: "test repo", description: "No thanks.", url: "github.com/nextawesomeproject");

  // print the repo as is (calling toString under the hood)
  print(repo);
  // print the repo as valid JSON
  print(jsonEncode(repo));
}
```

And that’ll do it! You’re now encoding and decoding JSON in Dart! Best of luck!

**_PS: You can TOTALLY make this a tiny bit simpler (or maybe a lot simpler when working with big data structures) by using reflection. Dart’s runtime reflection package (called Mirrors) is actually pretty rad, however it can not be used with Flutter (due to it breaking Flutter’s tree-shaking mechanisms). If you’re using Dart with something other than Flutter please let me know what you’re working on! [see the reflection package here](https://api.dart.dev/stable/2.9.3/dart-mirrors/dart-mirrors-library.html)._**
