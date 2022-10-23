---
title: "How to upload coverage to CodeCov for Dart and Flutter"
date: 2022-05-19
lastUpdated: 2022-05-20
description: "Learn how to upload coverate to codecov for the Dart programming language!"
status: publish
author: "Brad Cypert"
type: blog
thumbnail: /pexels-multi-tennant-units.jpg
category:
  - dart
tags:
  - dart
  - flutter
  - testing
  - code_coverage
---

Code Coverage helps you identify how much of your code is covered via test cases. Coverage itself is an interesting idea. People are largely divided on it but coverage can be a useful metric if used for objective information and not used to measure success. In this post, we'll cover generating coverage for flutter and dart (each individually), formatting that coverage if needed, and then uploading it to CodeCov via Github actions.

<div style="display: flex; justify-content: center">
<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">I understand where you&#39;re coming from. Code coverage should be an informative metric, not a success metric.</p>&mdash; Brad Cypert (@bradcypert) <a href="https://twitter.com/bradcypert/status/1526983128576843776?ref_src=twsrc%5Etfw">May 18, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
</div>

Dart and Flutter both ship with testing tools that are capable of producing coverage reports. Flutter generates a nice `.lcov` file for you and Dart... does not ☹️. If you're unaware, LCOV is the graphical frontend to GCOV, which is GCC's coverage testing tool. A lot of work has gone into LCOV so being able to leverage that file spec can be really beneficial. In Flutter, to get an lcov report, all we have to do is run `flutter test --coverage` and that will generate a file at `./coverage/lcov.info`. If you'd like to display that in the browser, you can use the `genhtml` command from `lcov`. Try `genhtml coverage/lcov.info -o coverage/html`.

<HeadsUp title="Installing LCOV and Genhtml">
  The <a href="http://ltp.sourceforge.net/coverage/lcov/genhtml.1.php" target="_blank">`genhtml` command</a> comes from LCOV, so to use `genhtml`, you'll need to install `lcov`. You can find the <a href="http://ltp.sourceforge.net/coverage/lcov.php" target="_blank">install instructions for LCOV here</a>, but if you're able to use homebrew, `brew install lcov` should get you what you need, too!
</HeadsUp>

Dart, however, does not give us a nice lcov coverage file. To generate our coverage files, we can run `dart run test --coverage="coverage"`. This will generate a `coverage` folder with `.json` files for our coverage report. These, unfortunately, aren't lcov files (which CodeCov wants), but thankfully there's a tool we can use to format our coverage as an lcov file. You can run `dart pub global activate coverage` to add the coverage binaries to your pub_cache path. Running `$HOME/.pub-cache/bin/format_coverage --lcov --in=coverage --out=coverage.lcov --packages=.packages --report-on=lib` will convert your Dart coverage files to a single lcov file.

<HeadsUp title="pubcache and the path">
  When you install coverage, you may see something like:

    Warning: Pub installs executables into $HOME/.pub-cache/bin, which is not on your path.
    You can fix that by adding this to your shell's config file (.bashrc, .bash_profile, etc.):
    export PATH="$PATH":"$HOME/.pub-cache/bin"

  Following the above instructions can help you turn `$HOME/.pub-cache/bin/format_coverage` into `format_coverage`, which is nice but our github actions container has a small issue with the pub cache not being on the path, so we'll reference it directly through the rest of this post.
</HeadsUp>

Now that we have a path to standardize our Dart and Flutter coverage reports around lcov, we can shove all of this into a github actions workflow and get things uploading. To do this, we'll use the CodeCov action ([codecov/codecov-action@v2](https://github.com/codecov/codecov-action)). Creating our Github workflow should be relatively easy now that we've gone through the steps up to this point. You can define whatever `name` and `on` hooks that suit your needs, but the important part for now is the `jobs` section.

```yaml
name: Dart CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:

    runs-on: ubuntu-latest

    container:
      image:  dart:latest

    steps:
    - uses: actions/checkout@v2
    - name: Install dependencies
      run: dart pub get
    - name: Run tests
      run: dart pub run test --coverage="coverage"
    - name: Install coverage tools
      run: dart pub global activate coverage
    - name: format coverage
      run: $HOME/.pub-cache/bin/format_coverage --lcov --in=coverage --out=coverage.lcov --packages=.packages --report-on=lib
    - uses: codecov/codecov-action@v2
      with:
        files: coverage.lcov
        verbose: true # optional (default = false)
```

This action will run your tests and generate a coverage report, then upload that to CodeCov. If you're using Flutter, you can swap out the `Run tests` step and remove the `Install coverage tools` and `format coverage` steps -- It's a lot simpler with just Flutter!

Just a heads up, Codecov works really easily with public repos, but there are a few more steps required to set up a private repo. The steps required (its mostly just generating and setting a token) can be found here: [https://github.com/codecov/codecov-action#usage](https://github.com/codecov/codecov-action#usage).