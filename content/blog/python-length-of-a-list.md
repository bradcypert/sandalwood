---
title: "Python Length of a List"
date: 2020-02-17
status: publish
permalink: /python-length-of-a-list
author: "Brad Cypert"
excerpt: ""
type: blog
id: 2533
images:
  - woman-programming-on-a-notebook-1181359.jpg
category:
  - Python
tags:
  - Python
post_format: []
wp_last_modified_info:
  - "February 17, 2020 @ 4:15 am"
wplmi_shortcode:
  - "[lmt-post-modified-info]"
_yoast_wpseo_content_score:
  - "60"
_yoast_wpseo_primary_category:
  - "86"
_yoast_wpseo_focuskw:
  - "python length of list"
_yoast_wpseo_title:
  - "%%title%% | Python 3 Tips %%page%% %%sep%% %%sitename%%"
description:
  - "Finding the length of a list in Python is easy via the len() function. Python's len() function also works on collections and all sequences!"
_yoast_wpseo_linkdex:
  - "64"
---

When writing Python, it’s fairly common to find yourself working with lists of data. Usually, you’ll also find yourself trying to figure out just how my items are in that list. Thankfully, in Python, finding the length of a list is fairly easy.

```python
my_list = [1,2,3,4,5]
print("The length of this list is:", len(my_list))
```

The key takeaway here is [the `len` function](https://docs.python.org/3/library/functions.html#len) [that’s built into Python](https://docs.python.org/3/library/functions.html). No external library required! The `len` function takes in a sequence or a collection and returns the number of items contained within. This means that the length function has an [arity](https://en.wikipedia.org/wiki/Arity) of 1 and should only be passed one argument. The return value is always an number representing the count of items contained within the parameter that’s provided to the function.

It’s worth mentioning that `len` works on **any** sequence or collection in
Python. This means you can also use it on Strings, Dictionaries, and Sets too!

```python
name = "Brad"
print("My name is ", len(name), " characters long.")
```

Hopefully now you’re able to successfully find the length of a list with Python! If you like to learn more about Python, [you can find my posts on the language here!](/tags/python)
