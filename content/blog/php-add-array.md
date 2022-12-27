---
title: "PHP: Add to an Array"
date: 2019-02-01
status: publish
permalink: /php-add-array
author: "Brad Cypert"
excerpt: ""
type: blog
id: 872
images:
  - blur-business-close-up-270557.jpg
category:
  - PHP
tags:
  - PHP
description: "To add to an array in php, you can use an assignment operator or the array_push function. However, it's strongly advised to use the assignment operator."
versions:
  php: 7.2
---

It’s very common to find yourself working with Arrays in any language, and PHP is no exception. If you’re reading this, you probably want to find out how to add to an array in PHP but there’s one thing to cover first! Unlike most other languages, arrays in PHP are just an ordered map! Let’s declare an array to work with.

Arrays can be declared similarly to map, but you can freely omit the keys.

```php
$array = array(1,2,3,4);
```

Now that we have an array, we can see how easy it is to add to an array like so:

```php
\$array[] = 5;
```

Adding to an array in PHP really is as simple as assigning a new value to a blank index!

There’s some interesting information regarding the addition of an element into an array with PHP though. For one: during the scope of the addition, the array is treated like a stack (keep in mind that this is actually an ordered-map, remember?). Additionally, if an array does not yet exist and you use `$array[] = 5`, a new array will be created.

Theres an alternative solution as well, and that’s by calling the `array_push` function. If you have to use it, the `array_push` function’s definition looks like this:

```php
array_push ( array &$array [, mixed $... ] ) : int
```

Notice that it returns an `int`. That int represents the new size of the array. Generally, you won’t want to use this pattern and will instead favor the assignment pattern from before. The reason why is that use of `array_push` will introduce an additional function call and the overhead that comes with that.

It’s worth mentioning that, with this pattern, if you don’t provide an array as the first argument to this function, an error will be raised.

If you’re interested in learning more about PHP, [you can find more of my PHP related posts here](/tags/php/). Additionally, you can find more information about arrays in the [PHP manual](http://php.net/manual/en/language.types.array.php).
