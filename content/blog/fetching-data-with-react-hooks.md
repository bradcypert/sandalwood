---
title: "Fetching Data with React Hooks"
date: 2020-01-09
status: publish
permalink: /fetching-data-with-react-hooks
author: "Brad Cypert"
excerpt: ""
type: blog
id: 2208
thumbnail: /silhouette-photography-of-banana-hook-decor-706138.jpg
category:
  - React
tags:
  - javascript
  - react
  - typescript
post_format: []
wp_last_modified_info:
  - "January 9, 2020 @ 2:42 am"
wplmi_shortcode:
  - "[lmt-post-modified-info]"
_yoast_wpseo_primary_category:
  - "243"
_yoast_wpseo_content_score:
  - "90"
_yoast_wpseo_focuskw:
  - "data react hooks"
description:
  - "Fetching data with React has historically been accomplished via `componentDidMount`, however, we can accomplish similar effects via useState and useEffect."
_yoast_wpseo_linkdex:
  - "69"
---

[React hooks have changed the way that I (and arguably the React Community) prefer to build components](https://reactjs.org/docs/hooks-intro.html). I’ve been working on a GraphQL project for a while, and when we migrated to functional components and hooks, I was able to use[ Apollo’s hooks](https://www.apollographql.com/docs/react/api/react-hooks/) for my data fetching needs. However, I find myself now working on a new project that doesn’t use GraphQL. Consequentially, I find myself wondering “How do I fetch data with React Hooks?”

[If you’d just like to see a codepen example of the code, you can find it here.](https://jsfiddle.net/bradcypert/jhrt40yv/6/)

In Apollo, I’m able to use the `useQuery` hook, which exposes the status of the request, data, error state and more. I’m not consuming a Graphql API for this new project, so Apollo’s hooks won’t work for me. Thankfully, I can leverage a few hooks provided by React to satisfy my request-y requirements.

**Note: This post and example use [Axios](https://github.com/axios/axios), but you can use whatever request library/pattern that you’d like. The lessons learned here work with Axios or an alternative.**

## The useState hook

For this example, we’ll build a simple component that queries github for the repos for a specific user. First, we want to leverage[ the `useState` hook](https://reactjs.org/docs/hooks-state.html) to statefully store our response data (the repos) in our component. Let’s set up our functional component like so:

```typescript
import axios from "axios";
import * as React from "react";

const Repos: React.FunctionComponent<{}> = () => {
  const [repos, setRepos] = React.useState([]);
  return (
    <div>
      {repos.map(repo => (
        <div key={repo.id}>{repo.name}</div>
      ))}
    </div>
  );
};
```

## The useEffect hook

Since we default our state to an empty array, our map function won’t execute and there won’t be anything rendered but the container `<div>`. Our next step, then, is to add in the Axois request. In a class component,[ you could make your request in `componentDidMount`, but, with hooks, we don’t have access to that lifecycle method](https://reactjs.org/docs/hooks-overview.html#effect-hook). Instead, we can [leverage `useEffect`](https://reactjs.org/docs/hooks-effect.html) to define an effect that should run when the component mounts. Through a few other parameters, we can even make it so this effect reruns when we change props, which we’ll do later.

```typescript
React.useEffect(() => {
  const fetchData = async () => {
    const response = await axios.get(
      "https://api.github.com/users/bradcypert/repos"
    );
    setRepos(response.data);
  };

  fetchData();
}, []);
```

This effect does a couple of interesting things. First, let’s note the second parameter to the `useEffect` invocation. It’s `[]` or an empty array. This indicates that there are no dependencies for this `useEffect` hook, which means it will only run once. The second thing to note is that the `useEffect` callback cannot be asynchronous. Instead, React recommends declaring an async function in your callback and executing it immediately. This is exactly what we’re doing above. Let’s add this snippet to our component.

```typescript
const Repos = () => {
  const [repos, setRepos] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://api.github.com/users/bradcypert/repos"
      );
      setRepos(response.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      {repos.map(repo => (
        <div key={repo.id}>{repo.name}</div>
      ))}
    </div>
  );
};
```

That should do it! But what if we want our users to be configured by a prop? And what if we want to refetch the repos for that user whenever that prop changes? Actually, its a fairly simple change. Let’s do that now.

```typescript
const Repos = ({ user }) => {
  const [repos, setRepos] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://api.github.com/users/${user}/repos`
      );
      setRepos(response.data);
    };

    fetchData();
  }, [user]);

  return (
    <div>
      {repos.map(repo => (
        <div key={repo.id} user="bradcypert">
          {repo.name}
        </div>
      ))}
    </div>
  );
};
```

The only thing that we changed from the original full implementation is that we’ve changed our URL to be backticks. That URL also now interpolates the user into the new URL. That user comes from our props, which is destructured in our component declaration. Finally, we added `user` to our `useHook` dependency array. This will make our hook execute every time that the `user` prop is changed.

Hopefully this post helps explain how to fetch data using react hooks. If you’d like to learn more about React, [you can find my posts on React here](/tags/react).
