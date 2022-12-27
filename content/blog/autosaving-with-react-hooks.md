---
title: "Autosaving with React Hooks"
date: 2019-12-21
status: publish
permalink: /autosaving-with-react-hooks
author: "Brad Cypert"
excerpt: ""
type: blog
id: 2027
images:
  - photo-of-light-bulb-1495580.jpg
category:
  - React
tags:
  - autosave
  - hooks
  - react
description: "Autosaving with React hooks is fairly trivial once you understand React's useEffect hook. Autosaving can be accomplished with useEffect and useState."
versions:
  react: 17.0
  typescript: 3.4
---

React hooks have really changed the game for me when it comes to building react components. However, I’ve found that writing autosaving functionality is a little less obvious via hooks. Thankfully, it is still possible (and arguably a lot cleaner) when using hooks.

We can accomplish autosaving functionality through use of `useEffect`. You’ll also need a way to post the data to your server. In my case, I’m using Apollo’s useMutation hook as well. This allows me to post a graphql mutation from a hook-like interface.

## The `useEffect` hook

The `useEffect` hook effectively replaces `componentDidMount`, `componentWillUpdate`, and `componentWillUnmount`. Here’s how I remember the API for `useEffect`:

```typescript
useEffect(() => {
  doWhateverIsHereOnMountandUpdate();

  return () => {
    doWhateverIsHereOnWillUnmount();
  };
}, [skipUntilThisStateOrPropHaschanged]);
```

It’s worth mentioning that the `skipUntilThisStateOrPropHasChanged` is optional, and leaving it out will cause it to process the hook on every render.

## Implementing Autosave

Now that we understand our hook, the autosave functionality becomes fairly trivial. We’ll use a couple of state hooks as well to help us manage the text that a user types in as well as the last value we saved (we can skip network requests if they’re the same).

```typescript
const [lastText, setLastText] = React.useState("");
const [text, setText] = React.useState("");
```

You’ll see how we use `lastText` in our `useEffect` hook below, but for now, you just need to know that `text` represents the state of what the user has typed in. If you’d like more information on how this works, [React’s documentation for Controlled Components is a great place to start](https://reactjs.org/docs/forms.html#controlled-components).

Now, we need a function to trigger to persist our data to the server. In my case, I’ll use an Apollo mutation since the server API processes graphql.

```typescript
const [updateContent] = useMutation(UPDATE_CHAPTER_CONTENT.MUTATION);
```

Finally, we can write our `useEffect` hook:

```typescript
const AUTOSAVE_INTERVAL = 3000;
React.useEffect(() => {
  const timer = setTimeout(() => {
    if (lastText != text) {
      updateContent({ variables: { content: text, id: chapterId } });
      setLastText(text);
    }
  }, AUTOSAVE_INTERVAL);
  return () => clearTimeout(timer);
}, [text]);
```

We’re doing a couple of neat things here. First, we’re setting up our `useEffect` hook. It creates a timer via `setTimeout`, and when that hook unmounts, it removes that timer. That’s the “meat-and-potatoes” behind it. You’ll notice that our setTimeout function checks to see if the text has changed before posting our data, and then sets the last text if it has changed.
We’re also only triggering this `useEffect` when `text` has changed (as indicated by `[text]` as the second parameter. We probably could clean this up a bit by removing the `if` in the timeout function body, and updating the `useEffect` dependency array to be `[text != lastText]`.

And that should do it! Hopefully, this helps if you’re trying to build autosave functionality into React project.
If you’d like to [learn more about React, you can find my other post on Facebook’s awesome framework here.](/tags/react/)
