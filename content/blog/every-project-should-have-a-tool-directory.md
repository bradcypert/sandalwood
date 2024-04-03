---
title: "Every Project Should Have a Tool Directory"
date: 2023-12-20
status: publish
permalink: /every-project-should-have-a-tool-directory
author: "Brad Cypert"
type: blog
images:
  - tools-in-a-chest.jpg
tags:
  - tooling
  - devops
description: "Tool directory: The secret weapon for developers to automate tasks, maintain code, & boost productivity."
outline:
  what: "Tool directories provide a home for commonly used scripts that help manage the repository, it's code or other items belonging to the codebase. They help ensure that developers use consistent scripting and patterns for doing common tasks."
  why: "Scripts in the tool directory help speed up development, avoid mistakes, and create consistency."
  how: "Examples include the tool directory in this project, several of my flutter projects and more. I'll add those examples to this post."
  when: "As soon as you write a string of bash or scripting commands to do something to a repository. IE: Almost every repo."
---
**Welcome back to the blog!** I'm excited to share a tip that I've found incredibly valuable for managing my projects, both personal and professional: the **tool directory**.

## What is a tool directory?

It's a dedicated space within your project repository that houses commonly used scripts and utilities. These scripts automate repetitive tasks, manage the codebase, and ensure consistency in development practices. Think of it as your own personal toolbox, readily accessible and organized for maximum efficiency.

## Why should you have one?

There are several compelling reasons to embrace the tool directory approach:

* **Speed up development:** Frequently used scripts are readily available, eliminating the need to rewrite them from scratch or hunt for them elsewhere. This saves you valuable time and keeps you focused on the core tasks at hand.
* **Avoid mistakes:** Consistent scripting patterns within the tool directory minimize the risk of errors and typos. Standardizing common tasks reduces the potential for unexpected outcomes and ensures reliable results.
* **Promote consistency:** By sharing your tool directory with collaborators, you establish a common set of practices for handling repetitive tasks. This fosters a unified development workflow and reduces confusion, especially for larger projects.
* **Improve maintainability:** Well-organized and documented scripts within the tool directory make it easier for future developers to understand and contribute to the project. It acts as a central repository of knowledge and automation, benefiting the project's long-term health.

## How to implement a tool directory:

The beauty of the tool directory lies in its simplicity. Here's how to get started:

1. **Create a dedicated directory:** Within your project repository, designate a folder specifically for your tools. 
2. **Start small:** Begin by adding the scripts you use most frequently. This could be anything from code formatting and linting to deployment automation or project setup routines.
3. **Document your scripts:** Clearly document each script's purpose, usage instructions, and any relevant inputs or outputs. This ensures clarity and prevents confusion for future users.
4. **Share with your team:** Encourage your collaborators to contribute their own scripts and utilize the existing ones. This fosters a collaborative environment and expands the toolbox for everyone's benefit.

### Examples of tool directories in action:

For further inspiration, I'd like to showcase some examples of how I leverage tool directories:

* **This very blog post!** The scripts that automate blog post generation and deployment reside in a dedicated tool directory within this project's repository.

For example, in the repository for my blog, there is a script that resides at ./tool/make_post.sh that looks like this:

```bash
#!/usr/bin/env bash
lowercaseName=`echo "$1" | awk '{ print tolower($0) }'`
echo "---
title: \"$1\"
date: ${date+'%Y/%m/%d'}
status: publish
permalink: /todo
author: \"Brad Cypert\"
type: blog
tags:
  - TODO
description: \"\"
outline:
  what: \"What's the main goal I am trying to convey\"
  why: \"Why does anyone care?\"
  how: \"How is whatever Im teaching used?\"
  when: \"When should it be used?\"
---
" >> "./content/blog/${lowercaseName// /-}.md"
```

This script helps me ensure that I am generating consistent frontmatter for my blog posts as well as the outline template that I use to ensure Im conveying the correct ideas. I can simply run `./tool/make_post.sh "Every Project Should Have a Tool Directory"` and it will generate the boilerplate for this post!

* **My Flutter projects:** Many of my Flutter projects utilize tool directories for tasks like code formatting, asset generation, and deployment to various platforms.

Another example comes from my [Christmas Flutter Project that I've been recording](https://www.youtube.com/playlist?list=PLYA3HD4nElQl7oWjIbG8OlGTnW0VRhYU1). The project has a CSV of quotes and shows a different quote each day. The CSV has all of the quotes by the same person together, but we want to shuffle those so in [Day 16's video](https://www.youtube.com/watch?v=T5_AkEemO-0&list=PLYA3HD4nElQl7oWjIbG8OlGTnW0VRhYU1&index=16), we create a script in our tool directory to shuffle our CSV for us. We even write this one in dart, simply because if you're following along with the Flutter tutorial, I know that you have Flutter and Dart installed (more on this in a moment). Here's the script (`./tool/shuffle_csv.dart`):

```dart
import 'dart:io';

void main(List<String> args) {
  final file = File('../assets/quotes.csv');
  final contents = file.readAsStringSync();
  final lines = contents.split("\n");
  final header = lines.first;
  final quotes = lines.sublist(1);

  quotes.shuffle();

  final finished = [header, ...quotes].join("\n");
  file.writeAsStringSync(finished);
  print("shuffled csv successfully!");
}

```

* **Open-source contributions:** When contributing to open-source projects, I often suggest or implement tool directories to streamline common tasks and improve contribution workflows.

### Languages for Tools

Language selection for the tool scripts is important. You want to use languages that are good for scripting purposes, but you also want to choose something that the development team has installed on their machine and that they're comfortable maintaining code in. For example, in the Flutter video where we add the CSV shuffling, I mention that we could write this in Go but that the people following along would also have to install Go just for this one thing, plus, its a Flutter video series -- there's a good chance they don't know Go and may not even want to learn it!

Bash is a fantastic choice for small scripts. It's readily available on most development machines and is fairly easy to write. However, bash can get complicated fast and it's not something most developers have a ton of experience with. For longer scripts, consider using the primary language that the repository is built with, or reach for something fairly easy to pick up like Python or JavaScript.

### Conclusion

Incorporating a tool directory into your project workflow is a simple yet powerful way to boost your development efficiency, consistency, and overall project health. It's a practice that scales with your projects and fosters a collaborative and organized development environment. So, why not give it a try and see how your own personal toolbox can empower your coding journey?

**Happy coding & Happy holidays!**

**- Brad Cypert**

**P.S.** Don't forget to check out BradCypert.com for more examples of my work and insights on software development.

**P.P.S.** Remember, this is just a starting point. Feel free to adapt and customize the tool directory approach to fit your specific needs and preferences. The key is to find a system that works for you and empowers your development process.


