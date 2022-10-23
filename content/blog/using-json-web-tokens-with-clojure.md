---
title: "Using JSON Web Tokens with Clojure"
date: 2016-06-23
status: publish
permalink: /using-json-web-tokens-with-clojure
author: "Brad Cypert"
type: blog
id: 22
category:
  - clojure
tags:
  - buddy
  - clojure
  - "json web tokens"
  - jwt
description:
  - "JWT are used as the authorization header on incoming requests. Clojure has a wonderful JWT library named Buddy that makes working with JSON Web tokens easy."
---

Authentication is easy. Good authentication is difficult. We’re at a point in the world where our users expect to be able to sign up for your service or app, and receive a more personalized experience. If you can’t validate who the user is, you can’t achieve this.

In the past, people have leveraged sessions, cookies, sending the user’s email and password on each request (**please don’t ever do this**), and many other techniques to validate that a user is who they say they are. A lot of these techniques worked relatively well for the time, but they all have their flaws – Cookies expire and are tied the browser, Sessions don’t scale well, sending email/password on every request violates your user’s trust in you to keep their information secure.

Enter JSON Web Tokens (JWT). After doing much research on them, I believe they provide a very interested take on user authentication, and want to share with you how you can leverage Buddy to authenticate a user via JWT in Clojure.

## What are JSON Web Tokens?

JSON Web Tokens are used to send information that can be verified and trusted by means of a digital signature. They are built from a URL-safe JSON object, which is then cryptographically signed to verify its authenticity. Most tokens are also encrypted if the payload contains sensitive information.

## At a High Level

Generally, JWT are used as the authorization header on incoming requests. The flow for this could look like the following:

1. A user goes to your webapp, and finds the login form.
2. That user provides the correct details to the login form.
3. A request is made to the backend service, and that service validates that the user is who they claim to be (generally though checking the database for a username/password match)
4. If the user is who they claim to be, we generate a JWT and send it back to the client.
5. The client then passes this JWT token in as an authorization header on all subsequent requests.

## In Clojure

Let’s get started implementing this in Clojure. We’re going to depend on the Buddy library – a best-practices library on security, signing, and authentication. In fact, [Buddy is a library of libraries](https://github.com/funcool/buddy), and we’re only going to add the `buddy-sign` library to our project, as that’s all we need for this.

**Note:** This tutorial assumes you’re using the latest version of Clojure at the time of writing (1.8), Leiningen (v2) and have an existing project that you’re adding JWT into.

In your `project.clj` file, add the following dependency:

```clojure
[buddy/buddy-sign "1.1.0"]
```

Next, in our source folder, we can create a new file for user-auth.

```bash

touch /src/modules/auth.clj

```

In your favorite text editor (don’t worry, I won’t try to sell you on Vim in this tutorial), open the file we just created. Let’s go ahead and define a namespace and the imports for that namespace.

```clojure
(ns app.modules.auth
  (:require [buddy.sign.jwt :as jwt]))
```

For the sake of simplicity, we’re going to assume there is only one user of this app, and we’re hard-coding it into the auth module (so we can focus on JWT, and not reading/writing to the db, encrypted passwords, etc.), so let’s go ahead and define that too.

```clojure
(defonce user {:email "foo@bar.com" :password "abc123"})
```

## Generating A Secret via Python

Before we can write the function to generate the signature, we need to generate a secret key and bind that in Clojure. There are many ways to generate a secret key, but for simplicity’s sake, we’re just going to generate a quick key via Python. If you have python installed, you can type `python` into your terminal to be taken into Python’s REPL and then type the following lines.

```python
import os
os.urandom(24).encode('hex')
```

The string that was generated for me is `86bae26023208e57a5880d5ad644143c567fc57baaf5a942`, but your’s will be different. Regardless, copy this value to the clipboard and let’s add it to our Clojure file. It’s worth mentioning you can also leverage other buddy libraries to help you generate your secret key.

````clojure

(defonce secret "86bae26023208e57a5880d5ad644143c567fc57baaf5a942")

```clojure

Now, we can finally write the function to generate the signature. First, we we want to only generate a signature if the user credentials match the ones that we provided above. If it doesn’t match, we’ll just return an empty string.

```clojure
(defn generate-signature [email password]
  (let [credentials {:email email :password password}]
    (cond
      (= user credentials) (jwt/sign {:user email} secret)
      :else "")))
```

Next, we can write a function to validate that the signature is a real signature.

```clojure
(defn unsign-token [token]
  (jwt/unsign token secret))
```

When we call `generate-signature` with `foo@bar.com` and `abc123`, we’ll get a token back that looks something like this – `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoyfQ.lj6O4Na78SkhZbBSKZktT0Mufqg_L5ZmRe6aRa1bG5U`.

When we call `unsign-token` and pass in that token, you’ll be given back a map like so `{:user "foo@bar.com"}`.

Congratulations! You’ve got the basics for working with JWT!

## Next Steps

There’s plenty of places to go from here, such as integrating this into a web service, or encrypting the token as well (you **really should** do this). Additionally, consider what other information you can load into your json web token – expiration time, for example.

Want to learn about other ways to use Clojure? You can [find more of my posts on the language here](/tags/clojure/)!
```
````
