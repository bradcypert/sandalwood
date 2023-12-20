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