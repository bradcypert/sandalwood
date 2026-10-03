---
title: "JavaScript Resources"
description: "The language(s) of the web. TypeScript as well as JavaScript library and framework articles can be found here, too!"
date: 2020-01-09
lastmod: 2026-10-03
status: publish
permalink: /javascript-resources
author: "Brad Cypert"
excerpt: ""
type: page
id: 2232
---

The language(s) of the web. TypeScript as well as JavaScript library and framework articles can be found here, too.

I've written a lot of JavaScript. Some of it was vanilla because that was the right call. A lot of it was React, because that's where the work was. TypeScript showed up when I got tired of guessing what an object contained at 2am.

## Vanilla JavaScript

Sometimes vanilla is best. No extra libraries required.

- [How to use Generators](/javascript-generators/) — Lazy evaluation for large ranges and work you don't want to do all at once.

## React

React is a library for writing components in JavaScript and JSX. Most of what I wrote about it is hooks, because that's where I got stuck.

- [How to fetch data when a component mounts with Hooks.](/fetching-data-with-react-hooks/) — `useEffect` plus a fetch, without turning the component into a mess.
- [Preventing access to React Router Routes](/auth-guarding-react-router-routes/) — Guarding routes so unauthenticated users don't wander into pages they shouldn't see.
- [Autosaving Data via HTTP with React Hooks](/autosaving-with-react-hooks/) — `useEffect` and `useState` as a boring, reliable autosave.
- [Setup React with TypeScript](/how-do-i-use-typescript-with-react/) — Getting TypeScript into a React project without a ceremony.
- [Lifecycle Methods and Hooks](/understanding-react-lifecycle-methods/) — The class lifecycle mapped onto hooks, which is the mental model I use.

## TypeScript

TypeScript is JavaScript plus types, plus a few utilities that save you from duplicating interfaces.

- [What is a Partial in TypeScript?](/typescript-what-is-a-partial/) — A type for "some of these fields," which is most update payloads.
- [Tupels in TypeScript](/typescript-tuples/) — Arrays with a fixed shape. Yes, the filename still says tupels.

## Web Components

This site is a Hugo blog with a few web components bolted on.

- [Adding Web Components to a Hugo Blog](/adding-web-components-to-a-hugo-blog/) — Custom elements in a static site, without turning Hugo into a JavaScript framework.

## Tooling

A hodgepodge. The JavaScript community has too many tools. I'll try to make the link say which one you're getting.

- [Quickly update NPM dependencies](/a-quick-script-to-update-all-of-your-npm-dependencies/) — A pipe I kept writing by hand. Don't commit the result without tests.
