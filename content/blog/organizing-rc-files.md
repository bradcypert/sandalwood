---
title: "Organizing your .rc files"
date: 2023-06-19
status: publish
permalink: /organizing-your-rc-files
author: "Brad Cypert"
type: blog
id: 39
images:
  - pexels-tom-fisk-3063470.jpg
category:
  - organization
  - rcfiles
tags:
  - environment
  - rcfiles
description: "Learn how to optimize your development environment by organizing .rc files and managing custom executables. Discover effective techniques for breaking out .rc files into separate categories, grouping similar items together, and installing custom executables in a designated folder. Enhance your workflow and productivity, regardless of the programming language you're using."
outline:
  what: "Dont just shove everything into your .zshrc"
  why: "Modularity helps organize environment configuration"
  how: "Separate .rc files that are sourced by a primary rc file"
  when: "When youre doing any major configuration in your zshrc file"
---

# Streamline Your Development Environment: Organizing .rc Files and Custom Executables

## Introduction
As a programmer, maintaining an organized and efficient development environment is crucial for productivity. In this article, we'll explore effective techniques to organize your `.rc` files, regardless of the programming language you're using. We'll cover breaking them out into separate rc files, grouping similar items together, and installing custom executables in a designated folder while adding it to the system's PATH. Let's dive in!

## Breaking Out Into Separate RC Files
When your `.rc` file becomes cluttered with various configurations and settings, breaking them out into separate files offers better organization and ease of maintenance. Follow these steps:

1. Create a folder specifically for your rc files, such as `~/.custom_rc`.
2. Categorize your configurations into logical groups, such as aliases, environment variables, and shell functions.
3. Create separate rc files for each group, e.g., `aliases.rc`, `env_vars.rc`, `functions.rc`.
4. Move the corresponding configurations from your main `.rc` file into the respective rc files.
5. In your main `.rc` file (e.g., `.zshrc`), use the `source` command to import the separate rc files, ensuring they are loaded when the shell starts.

## Grouping Similar Items Together
To further enhance organization, group similar items within each separate rc file. For example:

- In `aliases.rc`, collect all your alias configurations, regardless of the programming language.
- In `env_vars.rc`, store environment variables specific to your development environment.
- In `functions.rc`, place any shell functions related to your programming tasks.

By grouping related configurations together, you'll be able to locate and update them more easily, leading to a more coherent setup. As a tip, I'd even recommend taking the `env_vars.rc` and breaking it down further. Perhaps you've got specific env vars setup for JFrog servers, or specific env vars for the npm registry -- In this case, do a `jfrog.rc` and `node.rc` (.npmrc is used for configuring NPM, so dont use that name).

## Installing Executables in a Custom Folder
To avoid cluttering the standard executable directories like `/usr/bin` (and to have a much better experience trying to use your favorite tools after an OSX upgrade), you can install custom executables in a separate folder and add it to your system's PATH. Here's how:

1. Create a folder to host your custom executables, such as `~/bin`.
2. Configure your environment to install executables in this folder. Set the necessary environment variable (e.g., `GOBIN` for Go or `PYTHONPATH` for Python) to the full path of the folder.
3. Ensure the custom folder is added to your system's PATH variable, allowing easy access to the executables from any location. Add the following line to your `.rc` file: `export PATH="$PATH:$CUSTOM_FOLDER"`.

By adopting this approach, you'll have your custom executables in a designated location, accessible without explicitly providing the full path, simplifying your development workflow regardless of the programming language you're working with.

## Conclusion
Proper organization of your `.rc` files is crucial for maintaining a clean and efficient development environment, regardless of the programming language you're using. Breaking them out into separate rc files and grouping similar items together improves readability and eases maintenance. Additionally, installing custom executables in a designated folder and adding it to the system's PATH variable enhances accessibility. By following these practices, you can optimize your workflow and focus on what matters most: writing code. Happy coding!
