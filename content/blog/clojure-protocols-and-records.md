---
title: "Clojure Protocols &#038; Records"
date: 2017-04-06
status: publish
permalink: /clojure-protocols-and-records
author: "Brad Cypert"
excerpt: ""
type: blog
id: 51
category:
  - clojure
tags:
  - protocols
  - records
post_format: []
_yoast_wpseo_title:
  - "Clojure Protocols & Records"
---

Deep diving back into Clojure! Damn, it feels good to be back! If you’re reading this, you probably don’t know much about Protocols or Records and the goal is simple – by the end of this post, you’ll feel comfortable understanding them, using them, and refactoring to them if you’re coming from a Java codebase.

#### Protocols

If you haven’t read the post [on multimethods yet](http://www.bradcypert.com/mighty-morphing-multimethods/), go ahead. I’ll wait. Protocols are conceptually similar to multimethods, although protocols dispatch on the type of parameter, while multimethods dispatch on the value. Although, technically, you can dispatch on a multimethod on type but it’s not a good practice.

```clojure
(ns demo.multimethods
  (:require [cheshire.core :as chesire
             clojure.xml :as xml]))

(def xml-response {:type :xml
                   :content "<xml></xml>"})

(def json-response {:type :json
                    :content "{javascript: "is cool"}"}

(defmulti parse-response (fn [response] (:type response)))

(defmethod parse-response :xml
    [response]
    (xml/parse (java.io.ByteArrayInputStream. (.getBytes (:content response)))))

(defmethod parse-response :json
    [response]
    (chesire/parse-string (:content response)))

```

If you struggled with that, this next part might be difficult. Let’s recap. We load some libraries into the namespace and define a dummy `xml-response` and a dummy `json-response`. Notice that the data structure that these symbols point to are the same. Then we define a multimethod named `parse-response` and a function that determines the value we dispatch off of – in this case, the `:type` of response. Finally, we define an implementation of the multimethod for `:xml` and for `:json`.

Alright, that’s cool, but we’re here to learn about Protocols, dangit! Calm down, padawan. One must understand the simpler forms of polymorphism before they can delve into the more complex ones. Oh, you understand it? We’ll let’s dig in!

Protocols are similar to multimethods in that they’re used for polymorphic operations. However, protocols are simply used to define the polymorphic operations available on a specific type of data (String, Vector, Map, List, whatever). The actual implementation is added via `extend-type` or by creating a record that implements that protocol, but we’ll get to that later. Let’s define a protocol!

```clojure
(ns demo.protocol)

(defprotocol Serializable
  "Allows a type to be serialized"
  (serialize [data] "implementation to serialize the data"))

```

We did it! Except this really doesn’t do anything. Let’s go ahead and use `extend-type` to define how to serialize something. We’ll add this behavior to a map. For the sake of not being able to use something out of the box in Clojure, let’s define the Serialization to look like this: `{:name "Brad" :language "Clojure"} => "Brad, Clojure"`.

```clojure
(extend-type clojure.lang.PersistentArrayMap
  Serializable
  (serialize [data] (apply str (interpose ", " (vals data)))))

```

Simple enough! Now, we should be able to call `serialize` on a map!

```clojure
(serialize {:name "Brad" :language "Clojure"})

```

It’s worth mentioning that if we defined our protocol with multiple methods, we have to implement them **all** when using `extend-type`. Additionally, you can extend a type with multiple protocols by simply calling `extend-type` again with a different protocol and implementation. Now, this is cool, but let’s talk about defining a User data structure.

#### Records

Indeed, we can define our user data structure simply as a map. But there’s another tool that Clojure gives to us and it’s called a Record. Let’s define a record to represent a user. The User record will have a username, password and location, and let’s assume we’re going to serialize this before displaying it as a response body in an HTTP request. That means that we’re definitely going to want to filter out the password field, which sounds like a great, simple task to demo serialize.

```clojure
(defrecord User [name password location]
  Serializable
  (serialize [this] (str name ", " location)))

```

You can create a User by using any of these three functions:

```clojure
(User. "Brad" "ABC123!@#" "San Francisco")

(->User "Brad" "ABC123!@#" "San Francisco")

(map->User {:name "Brad" :password "ABC123!@#" :location "San Francisco"})

```

You’ll notice the first is the same syntax you’d use to create a Java object. The next example shows creating a User record given the parameters. The last example creates User record given a map defining the properties of the record. For idiomatic reasons, I’d recommend the 2nd or the 3rd example.

It’s also worth mentioning that the record acts as a map. You can run key lookups on the record like so:

```clojure
(def brad (map->User {:name "Brad" :password "ABC123!@#" :location "San Francisco"}))

(:location brad)
;> San Francisco
```

In fact, any function that you can use on a map can be used on a record! How great is that?

#### Refactoring to Protocols and Records

I’ll keep this section short and preface it with this – I’m a firm believer in simple data structures. Protocols and Records aren’t always the right solution in my mind. However, you’ll have likely noticed by this point that protocols are similar to interfaces and can be used similarly. A really interesting difference is that you can actually extend a Protocol onto a type at any point, while interfaces must be declared on the class definition in Java. Records are similar to the concept of classes. They have constructor functions (`->User`, for example) and can implement Protocols or even Java Interfaces. Records really shine when writing code for interoperability with Java or when you need to define a rich DSL for working with data structures relevant to your business or needs!
