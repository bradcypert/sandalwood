---
title: "Arrow Functions in PHP 7.4+"
date: 2020-03-31
status: publish
permalink: /arrow-functions-in-php-7-4
author: "Brad Cypert"
excerpt: ""
type: blog
id: 3293
images:
  - Untitled1.png
category:
  - PHP
tags:
  - "arrow functions"
  - PHP
description: "PHP 7.4 introduces arrow functions to our standard library. Arrow functions help reduce verbosity and enhance readability."
versions:
  php: 7.4
---

PHP is finally getting arrow functions (also known as Short Closures)! I know, I know. I’m just as excited as you are. Here’s everything you need to know about arrow functions in PHP.

First, arrow functions are an approved RFC for PHP 7.4. If you’re using a version of PHP that’s lower than 7.4, you won’t be able to use arrow functions.

Second, arrow functions can only contain one single expression. The goal with arrow functions ([as stated in the RFC](https://wiki.php.net/rfc/arrow_functions_v2)) is to help reduce verbosity and multi-line arrow functions are likely to cause more confusion than classic anonymous functions.

## Writing an Arrow Function

Now with that out of the way, let’s write our first arrow function by converting a classic function to arrow syntax. We’ll use this example as our classic function:

```php
var_dump(array_filter([1,2,3,4], function($value) {
  return $value % 2 === 0;
}));
```

If we run this, we’ll get some output like this:

```php

array(2) {
  [1]=>
  int(2)
  [3]=>
  int(4)
}

```

Now, let’s take this “classic” style anonymous function and convert it over to an arrow function.

```php
var_dump(array_filter([1,2,3,4], fn($value) => $value % 2 === 0));
```

Excellent. This feels way more concise and, in my opinion, readable. In PHP 7.4+, running this will yield:

```php
array(2) {
  [1]=>
  int(2)
  [3]=>
  int(4)
}
```

You’ll notice that we can omit the return keyword using arrow functions. In fact, we HAVE to omit the return keyword when using arrow functions — It’s not allowed.

## Using values from another scope

The BEST part about arrow functions, however, is that they have access to the scope that they’re being run within. This means that we can avoid the `use` keyword. Take this example which returns the elements in the first array that aren’t in the second:

```php
function arrayDiff($a, $b) {
  return array_values(array_filter($a, function ($x) use ($b) { return !in_array($x, $b); }));
}
```

You’ll notice we’re using the `use` keyword to make `$b` available to our anonymous function. I really, really dislike the `use` keyword. I, personally, don’t feel like we should have to declare every contextual dependency to our function, but I understand why we’ve had to do this. However, with arrow functions, we no longer have to use the `use` keyword to make scoped variables available to our function.

Instead, we can write something like this:

```php

function arrayDiff($a, $b) {
  return array_values(array_filter($a, fn($x) =>!in_array($x, $b)));
}
```

That’s so much better! Keep in mind that this feature also allows us to use `$this` in our arrow function!

[Check out more of my PHP tips and tricks here!](/tags/php)
