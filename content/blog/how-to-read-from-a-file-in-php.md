---
title: "How to read from a file in PHP"
date: 2020-03-09
status: publish
permalink: /how-to-read-from-a-file-in-php
author: "Brad Cypert"
excerpt: ""
type: blog
id: 3045
images:
  - binding-books-bound-colorful-272980.jpg
category:
  - PHP
tags:
  - PHP
post_format: []
description: "You can read from a file in PHP through the use of either the file funtion or the file_get_contents function. Each function has benefits and drawbacks."
versions:
  php: 7.4
---

Reading from a file in PHP is an extremely common problem to solve. You may keep configuration variables in an environment file, or perhaps you pull in HTML from another file. Either way, you need your PHP code to read the contents of those files. Good news: It’s actually a fairly simple task to perform!

What’s interesting is that there’s actually quite a few ways to read from a file in PHP. We’ll cover two common cases here and talk about why you’d use one over the other.

**Heads up: If performance is a concern, you’ll want to read through this entire post to really understand the implications of each option.**

## The file function

The first (and simplest) way to read a file is through the use of the `file` function. Let’s take a look at the function signature and break it down piece by piece.

```php
 file ( string $filename [, int $flags = 0 [, resource $context ]] ) : array
```

There are several arguments that this function signature accepts. First is the `$filename` which is a path to the file that you want to read. It’s worth mentioning that `$filename` can be a URL as well if you have `fopen wrappers` enabled in your PHP configuration — [More on that here](https://www.php.net/manual/en/filesystem.configuration.php#ini.allow-url-fopen).

The rest of the arguments for this function are optional, but we should still be aware of them. `$flags` is a binary representation of flags that can be passed to the function. Namely, **`FILE_USE_INCLUDE_PATH`**, **`FILE_IGNORE_NEW_LINES`** , and **`FILE_SKIP_EMPTY_LINES`** which searches for files in the include path, tells the function to ignore new lines at the end of the file, and skips empty lines respectively. You can use multiple flags with the bit-wise or operator: `file('myfile.rtf', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);`

The final argument is a `$context` created from `stream_context_create()`. I won’t get into streams here as they can a bit weird to wrap your head around, but if you find yourself needing to read your file in a linear fashion, [check out PHP’s documentation on streams](https://www.php.net/manual/en/intro.stream.php).

Lastly, the return value of this function is an array. Each element in the array contains a line of the file. If this function fails for any reason, the return value will be `false` instead of an array.

## The performant way to read a file

The second way to read a file is with the `file_get_contents` function. This should look pretty similar to `file`, except you’ll notice that the return type is a string instead of an array. There’s also quite a few additional options in the function signature.

```php
file_get_contents ( string $filename [, bool $use_include_path = FALSE [, resource $context [, int $offset = 0 [, int $maxlen ]]]] ) : string
```

Does this function look more intimidating or is that just me? There’s a lot more to this function signature than `file`, but the added complexity adds a lot of flexibility, too. `$filename` is the path to the file, similarly to the `$filename` parameter in the `file` function. You’ll notice, however, that we don’t have binary flags available for this function. Instead, we have `$use_include_path` which replaces one of the flags from `file`.

After our `$use_include_path` argument, we have another `$context`, just like in `file` and two more arguments. These arguments are where things start to feel different. `file_get_contents` takes in an `$offset` and a `$maxlen`. You can think of these variables as where to start and how much data to read. For example, if we had an `$offset` of 10 and a `$maxlen` of 5, we would read 5 characters from the file starting at character 11. Remember, 10 is the offset so you start at offset+1.

It’s also worth mentioning that `$offset` seeking does not work on remote files. You’ll need another way to handle that (perhaps downloading the file and seeking locally or just storing the entire file in memory).

## Which function should you use?

Both of these functions are available in PHP5+, so 99% of PHP developers will have either tool at their disposal. So how do we know which one to use and when? Our simplest answer could be: If you want a string that contains the file’s contents, use `file_get_contents`. If you want an array, use `file`. However, there’s a bit more to each of these functions besides the return types.

`file_get_contents` also works a bit differently under-the-hood. For example, `file_get_contents` returns the body as a string starting from the `$offset` (default of 0) and respects a `$maxlen` property. If you only wanted a subset of data from your file, this would clearly be the function to choose.

However, digging into the PHP documentation reveals additional information that you may find quite interesting. Quoting the PHP documentation ([link](https://www.php.net/manual/en/function.file-get-contents.php)):

> **file_get_contents()** is the preferred way to read the contents of a file into a string. It will use memory mapping techniques if supported by your OS to enhance performance.
>
> <cite>
>   [PHP Documentation for
>   **file\_get\_contents**](https://www.php.net/manual/en/function.file-get-contents.php)
> </cite>

Hopefully now you feel confident in your ability to read from a file in PHP. If you’d like to learn more tips for writing PHP, [you can find my super secret stash of tricks here](/tags/php)!
