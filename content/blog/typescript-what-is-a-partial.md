---
title: "Typescript: What is a Partial?"
date: 2020-01-10
status: publish
permalink: /typescript-what-is-a-partial
author: "Brad Cypert"
excerpt: ""
type: blog
id: 2237
thumbnail: /black-and-white-blank-challenge-connect-262488.jpg
category:
  - TypeScript
tags:
  - typescript
post_format: []
wp_last_modified_info:
  - "January 10, 2020 @ 3:37 am"
wplmi_shortcode:
  - "[lmt-post-modified-info]"
_yoast_wpseo_primary_category:
  - "258"
_yoast_wpseo_focuskw:
  - "typescript partial"
description:
  - "TypeScript's partial is a type that you provide and it is treated as a type that represents all subsets of a given type."
_yoast_wpseo_linkdex:
  - "57"
_yoast_wpseo_content_score:
  - "90"
---

A common theme in TypeScript is to define an interface for a data structure. Additionally, it’s fairly common to post data structures to an HTTP endpoint to create resources. You may even find yourself posting another structure with some of the same properties to update that data structure. Instead of creating another interface for the update, in this example, this is where the use of [Typescript’s Partial](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialt) comes in to play.

Imagine that we have the following interface.

```typescript
interface User {
  id: int;
  email: string;
  password: string;
  hairColor: string;
}
```

It’s safe to assume that there may be a time where we want something that looks like a `User` but maybe doesn’t have all of the keys. For example, this object:

```typescript
const baldMan = {
  id: 1,
  email: "bald@man.com",
  password: "iShaveMyHeadBecauseItsCool123",
};
```

This isn’t a valid `User` as it doesn’t have a `hairColor`. You may say, “Well, we can just add `hairColor` as an empty string” and you’re right, but that’s not the most accurate way to represent this structure. The most accurate way would be to make `hairColor` an optional parameter:

```typescript
interface User {
  id: int;
  email: string;
  password: string;
  hairColor?: string;
}
```

What do you do, however, if you have a function that expects all of those types to be optional (for example, a patch HTTP request)? Instead of going in and adding a `?` to all of the properties, which would lower the quality of our interface, we can leverage TypeScript’s `Partial` like so:

```typescript
function update(user: Partial<User>) {...}
```

TypeScript’s Partial uses [generics](http://www.typescriptlang.org/docs/handbook/type-compatibility.html#generics). The generic is a type that you provide and it is respected as a type that represents all subsets of a given type. In layman’s terms: It makes all the properties optional.

It’s worth mentioning that by using `Partial`, all of the properties become optional in the scope of that type. In the above example, this makes sense for an ID as we probably won’t generate an ID on the frontend and expect the database to autogenerate one.
