---
title: "JavaScript Resources"
description: "JavaScript, TypeScript, React, and the web-platform notes I still point people at."
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

I have written a lot of JavaScript. Some of it was vanilla because that was the right call. A lot of it was React, because that is where the work was. TypeScript showed up when I got tired of guessing what an object contained at 2am.

These posts are older than the Zig and Gleam writing, and the ecosystem has moved. Hooks are still hooks. Generators still exist. The ideas hold even if a given library version does not.

If you just want the language, start with generators. If you are in React, start with lifecycle methods and then the hooks posts.

## Vanilla JavaScript

Sometimes vanilla is best. The posts in this section are plain JavaScript with no extra libraries required.

- [How to use Generators](/javascript-generators/) — Lazy evaluation for large ranges and work you do not want to do all at once.

## React

React is a library for writing components in JavaScript and JSX. Most of these posts are about hooks, because that is where people get stuck.

- [How to fetch data when a component mounts with Hooks.](/fetching-data-with-react-hooks/) — `useEffect` plus a fetch, without turning the component into a mess.
- [Preventing access to React Router Routes](/auth-guarding-react-router-routes/) — Guarding routes so unauthenticated users do not wander into pages they should not see.
- [Autosaving Data via HTTP with React Hooks](/autosaving-with-react-hooks/) — `useEffect` and `useState` as a boring, reliable autosave.
- [Setup React with TypeScript](/how-do-i-use-typescript-with-react/) — Getting TypeScript into a React project without a ceremony.
- [Lifecycle Methods and Hooks](/understanding-react-lifecycle-methods/) — The class lifecycle mapped onto hooks, which is still the mental model I use.

## TypeScript

TypeScript is JavaScript plus types, plus a few utilities that save you from duplicating interfaces.

- [What is a Partial in TypeScript?](/typescript-what-is-a-partial/) — A type for "some of these fields," which is most update payloads.
- [Tupels in TypeScript](/typescript-tuples/) — Arrays with a fixed shape. Yes, the filename still says tupels.

## Web Components

This site is a Hugo blog with a few web components bolted on. That post is how I did it.

- [Adding Web Components to a Hugo Blog](/adding-web-components-to-a-hugo-blog/) — Custom elements in a static site, without turning Hugo into a JavaScript framework.

## Tooling

A hodgepodge. The JavaScript community has too many tools. I will try to make the link say which one you are getting.

- [Quickly update NPM dependencies](/a-quick-script-to-update-all-of-your-npm-dependencies/) — A pipe I kept writing by hand. Do not commit the result without tests.
