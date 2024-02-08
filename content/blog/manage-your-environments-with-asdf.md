---
title: "Manage your Environments with ASDF"
date: 2023-03-15
status: publish
permalink: /manage-your-environments-with-asdf
author: "Brad Cypert"
type: blog
id: 39
category:
  - development
tags:
  - asdf
  - versioning
  - dev-tools
images:
  - pexels-tools.jpg
description: "ASDF is a version management syste for tools, which ensures different versions of programming languages, libraries and other tools are used in the right places."
---

The use of ASDF can be an incredibly useful tool for managing your development environment. ASDF is a version management syste for tools, which ensures different versions of programming languages, libraries and other tools are used in the right places. Ultimately, ASDF makes it easier to develop and deploy applications and helps keep everyone on your team developing against the same tool versions.

ASDF can help you keep track of the various versions that are needed for different projects, as well as ensuring that all components get updated as needed. ASDF does this by hooking into your shell configuration and calls plugins in place of normal shell commands where applicable. For example, installing the nodejs plugin for asdf will create a shim for `node`. When you call `node`, it will be delegate to the shim (which uses asdf to select the correct version of node).

ASDF manages your tool versions using the titularly named file `.tool-versions`. This file helps ensure that, when you're working in a directory that is contained in a folder with a .tool-versions file, the correct version of the tool is used. ASDF also allows you to manage your global versions for tools which is accomplished via a `.tool-versions` file in your home directory.

## Adding Plugins

Adding a new plugin to ASDF is really easy! You'll find a plugin from a trusted source and simply run:

```bash
asdf plugin add $pluginName $pluginGitUrl
```

For example, installing the Dart plugin would look like this:

```bash
asdf plugin-add dart https://github.com/patoconnor43/asdf-dart.git
```

If you're ever unsure of which plugins you have installed, you can simply run:

```bash
asdf plugin list

# also show the git urls
asdf plugin list --urls
```

Updating a plugin is very easy:

```bash
asdf plugin dart update
```

But you can also update all plugins with a simple command (Note: Updating is not getting the latest version of the tool, its updating the plugin itself).

```bash
asdf plugin update --all
```

And if you find the need to remove a plugin, you can do so with:

```bash
asdf plugin remove $name
```

You can find plugins for any popular tool choice, but some common examples are NodeJS, Bun, Dart, Go, and more.

## Using Plugins to Manage Tools

Once you have your plugins setup, you can use them to manage tool versions. Let's continue with our Dart example by installing the latest version of Dart.

```bash
asdf install dart latest
```

Dart is the plugin here, so if we wanted to install Node instead (provided you installed the node plugin), you would write:

```bash
asdf install nodejs latest
```

If we need to, we can install a specific version, too!

```bash
asdf install dart 2.16
```

You can list your installed versions with the `list` subcommand.

```bash
asdf list dart
```

Once your tools are installed properly, you can set specific versions for different scopes like so:

```bash
asdf global dart latest
asdf shell dart 2.16
asdf local dart latest
```

The global scope writes to `$HOME/.tool-versions` and specifies the version of a tool that will be used when you run the command anywhere in your system, provided there's not a more contextually relevant version override.

The shell scope sets an environment variable for the current shell session. While this variable is set, it is preferred over other ASDF versions.

The local scope writes to your present working directory's .tool-versions file, creating it if needed. Generally, you'll use the local scope in the root of your project to capture and manage your project's specific tool versions.

If you'd like to fall back to a system version, you can tell ASDF to do so with the following command:

```bash
asdf local dart system
```

Lastly, you can uninstall a tool at a specific version via the uninstall command.

```bash
asdf uninstall dart 2.16
```

## .tool-versions

As mentioned above, .tool-versions is the file that stores version specific tool information for ASDF to use. You can have many different .tool-versions files on your machine at any given time, and they're contextually relevant -- ASDF will find the closest tool-versions file when executing commands and use those versions. The tool-versions file is actually really simple and looks like this:

```
dart 2.16.0
nodejs 10.12.0
```

Versions can be either actual versions, git references, a custom path, or the "system" keyword.

## Configuration

ASDF has configuration options for the tool itself managed via an .asdfrc file. This is probably out of the scope of this blog post, but here's a link to the configuration options that are supported: https://asdf-vm.com/manage/configuration.html

## Tool Version Manager, Not Package Manager

ASDF is not a package manager. It's not intended to be one and it would likely be in your best interest to avoid trying to turn it into one. Given it's plugin based nature, you can effectively manage anything with asdf, but you likely shouldn't. Instead, use a package manage for your system packages and keep asdf for managing tool versions.
