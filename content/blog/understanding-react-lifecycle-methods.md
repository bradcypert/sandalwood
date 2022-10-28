---
title: "Understanding React Lifecycle Methods"
date: 2020-02-05
status: publish
permalink: /understanding-react-lifecycle-methods
author: "Brad Cypert"
excerpt: ""
type: blog
id: 2541
images:
  - /two-yellow-flowers-surrounded-by-rocks-1028930.jpg
category:
  - React
tags:
  - javascript
  - react
post_format: []
wp_last_modified_info:
  - "February 10, 2020 @ 3:45 pm"
wplmi_shortcode:
  - "[lmt-post-modified-info]"
_yoast_wpseo_primary_category:
  - "243"
_yoast_wpseo_content_score:
  - "90"
_yoast_wpseo_focuskw:
  - "React Lifecycle Methods"
description:
  - "React Lifecycle Methods can be tricky, but powerful. If you're using function components instead, most lifecycle methods have hook counterparts."
_yoast_wpseo_linkdex:
  - "73"
---

React Lifecycle Methods are one tricky piece of business, especially if you’re coming from a framework that doesn’t have their own. Thankfully, they’re fairly similar to Android’s lifecycle methods and it wasn’t long before I was able to grasp them.

React has changed a lot over the past few years and it’s lifecycle methods are no exceptions. In fact, with the release of hooks, the idea of lifecycles were shaken once more!

React hooks can often be seen as a way to simplify the lifecycle process. While I prefer functional components and hooks, I also understand the need to be comfortable with class lifecycle methods, so we’ll cover each.

Let’s start with this diagram that shows how lifecycle methods can be classified.

![Diagram showing React's Lifecycle Methods](/react-lifecycle1.png)
You’ll see above that there are three main categories: Mounting, Updating and Unmounting.

## Mounting Lifecycle Methods

Mounting covers the adding the element to the tree, getting any derived state that it may have, and ultimately the first-pass rendering of the component.

You have access to 4 methods (well, 3 methods and a constructor) that effect the mounting process.

### The constructor

Typically, in React constructors are only used for two purposes:

- Initializing [local state](https://reactjs.org/docs/state-and-lifecycle.html) by assigning an object to `this.state`.
- Binding [event handlers](https://reactjs.org/docs/handling-events.html) to a component instance.

You **should not call `setState()`** in the `constructor()`. Instead, if your component needs to use local state, **assign the initial state to `this.state`** directly in the constructor.

```typescript
class Component {
  constructor(props) {
    super(props); //always call this
    setState({ foo: "bar" }); //never do this
    this.state = { foo: "bar" }; //do this instead
  }
}
```

Like almost all other lifecycle methods (excluding Render), the constructor is optional. If you don’t need to set initial state or bind event listeners, don’t define a constructor.

### getDerivedStateFromProps

`getDerivedStateFromProps` is a static method that is invoked right before calling Render. This method is intended to be used when you want to set state based off of the value of some props. You may be asking, can’t I just do that in the constructor? You can, however, the constructor is only called once. In the chart above, you’ll see that getDerivedStateFromProps is also called in the Updating category as well.

This lifecycle method is optional, but if you define it, the method should return an object that represents state or null if there are no updates to the state before render.

```typescript
class Component {
  static getDerivedStateFromProps(props, state) {
    if (props.animating) {
      return { ...state, x: state.x + 50 };
    } else {
      return null;
    }
  }
}
```

The react documentation will tell you that `getDerivedStateFromProps` is designed for rare use cases and [that you probably don’t need it](https://reactjs.org/blog/2018-06-07/you-probably-dont-need-derived-state.html#when-to-use-derived-state). I’d recommend reading [this post](https://reactjs.org/blog/2018-06-07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) if you find yourself writing this method.

### Render

Ah, Render. The bread and butter of a react component. Every component needs to have this lifecycle method defined. `render` is the function that returns what the component displays, and can actually return quite a few types of objects.

For example, `render` can return React Elements (typically created with JSX). It can return Arrays or Fragments (multiple elements from one render). Lastly, it can return strings and numbers (rendered as text nodes) or booleans and nulls (render nothing).

The `render()` function should be pure, meaning that it does not modify component state. Additionally, it should return the same result each time it’s invoked, and it does not directly interact with the browser (or window).

```typescript
class Component {
  render() {
    return <h1>Hello! 👋</h1>;
  }
}
```

In the “Updating” category, it’s worth noting that `render` won’t be invoked if `shouldComponentUpdate` returns `false`.

Once the `render` call succeeds, React will update the DOM and any [refs](https://reactjs.org/docs/refs-and-the-dom.html) that you’ve defined.

### componentDidMount

`componentDidMount` is the last method in our “Mounting” category. This lifecycle method is simply called whenever that component has successfully mounted.

The most common use case for this lifecycle method is to load data from a remote endpoint (make an HTTP request). Additionally, if you’re using react programming like RxJS, `componentDidMount` is where you’d setup any subscriptions.

```typescript
class Component {
  componentDidMount() {
    fetch("http://example.com/movies.json").then(response => {
      this.setState({ movies: response.json() });
    });
  }
}
```

It’s worth mentioning that you can call setState immediately in `componentDidMount`. This will trigger a second render, but the user won’t see the intermediate state.

## Updating

We’ve covered some of the lifecycle methods that also trigger during an update (`render`, `getDerivedStateFromProps`), but there’s a lot we haven’t yet. This is definitely where the lifecycle gets complicated, so buckle up!

An update can be triggered by a couple of different scenarios. Most notably, when the props to the component change, when the state changes, or when `forceUpdate()` is called. The props and state changes are fairly similar, but `forceUpdate()` circumvents some lifecycle methods.

When an update happens, `getDerivedStateFromProps` is triggered once more. We won’t dive into that again, so scroll up (or flip backwards) if you need to reference what that method is used for.

### shouldComponentUpdate

`shouldComponentUpdate` is our next lifecycle method. If you don’t need this check, you can omit this method entirely. If you do decide to include it, however, it simply needs to return `true` or `false`. `true` indicates a re-render needs to occur, `false` indicates that no re-render is required by the component.

This function receives two parameters, the next props and the next state.

If you choose to omit this, you then opt in to the default behavior. The default behavior is to re-render on every state change, and most of the time you should rely on the default behavior.

However, if you have props or state that may change but might not necessarily trigger a re-render, this is where you would add your logic to decide if a re-render should occur.

```typescript
class Component {
  componentShouldUpdate(newProps, newState) {
    if (state.hash == newState.hash) {
      return false;
    }
    return true;
  }
}
```

### getSnapshotBeforeUpdate

This lifecycle method enables your component to capture some information from the DOM before it is potentially changed. Any value returned by this lifecycle will be passed as a parameter to `componentDidUpdate()`.

A somewhat common example might be scroll position in a chat application. As new state (messages) come in, we want to be able to retain the current scroll position.

```typescript
class Component {
  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (prevState.list.length < this.state.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }
}
```

### componentDidUpdate

Last in our “Update” category, we have `componentDidUpdate`. This lifecycle method triggers whenever a component has successfully updated.

You may call `setState()` immediately in `componentDidUpdate()` but note that it must be wrapped in a condition, or you’ll cause an infinite loop.

```typescript
class Component {
  componentDidUpdate(prevProps) {
    if (prevProps.user.id != this.props.user.id) {
      loadUserData(this.props.user.id).then(user => {
        this.setState({ userData: user });
      });
    }
  }
}
```

## Unmounting

Unmounting is the final step in our component lifecycle process and this process contains only one lifecycle method.

### componentWillUnmount

This method triggers before a component is unmounted and destroyed. This is where you’ll cancel any timers, cancel any HTTP requests, remove any subscriptions in RxJS or similar. If you have an asynchronous operation that set’s state and that isn’t canceled by the componentWillUnmount method, you will see development warnings about setting state on an unmounted component (warning you that its an indicator of a memory leak).

```
class Component {
  private subscription;

  componentWillUnmount() {
    subscription.unsubscribe();
  }
}
```

## How hooks changed React’s Lifecycle Methods

<div class="wp-block-image">
  ![Venn diagram showing how useEffect shares the responsibility of Lifecycle
  Methods](/hook-ven.png)
</div>
Hooks are used with functional components (non-class-based components). Often times,
functional components are simpler than the class counter-parts and promote composition
rather that inheritance to manage lifecycle methods.

We still have three main categories for our lifecycles: Mounting, Updating, and Unmounting, but our access to the direct lifecycle methods has been removed. Instead, we manage similar operations through the use of hooks!

### useEffect

`useEffect` is our solution to most of the lifecycle methods. Different configurations for that hook determine how and when it should run.

`useEffect` simply takes in a function that should run and a dependency array that determines how often to run that function. This configuration can map directly to lifecycle methods.

Here’s a simple hook as an example.

```typescript
const Component = () => {
  useEffect(() => {
    console.log("Here's an effect function");
  });
  return null; // return null to render nothing in this case
};
```

## Replacing `componentDidUpdate`

We can add a depedency array to the hook as a second parameter to determine how often that hook’s function should be called. Since there’s no dependency array provided in the above example, this function will run on every render. In another example, if we want to call our function every time the prop `user` has changed, we can write something like this.

```typescript
const Component = ({ user }) => {
  useEffect(() => {
    console.log("user has changed");
  }, [user]);
  return null;
};
```

This most recent example should sound a lot like `componentDidUpdate`. Let’s take our `componentDidUpdate` method from above and translate that into hooks. Here’s the class syntax one more for context:

```typescript
class Component {
  componentDidUpdate(prevProps) {
    if (prevProps.user.id != this.props.user.id) {
      loadUserData(this.props.user.id).then(user => {
        this.setState({ userData: user });
      });
    }
  }
}
```

It’s worth mentioning that our above example sets state, too! We’ll have to use a new hook for that since `this.state` and `this.setState` aren’t available to function components. Here’s how we can port that logic over to a functional component and a hook.

```typescript
const Component = ({ user }) => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    loadUserData(user.id).then(user => setUserData(user));
  }, [user.id]);
};
```

There we go! This will only run once the `user` prop’s `id` is changed.

If you’re the inquisitive type, you might be thinking “Well, no array runs always, an array with the `user.id` runs when the user’s id changes… what about an empty array?”

### Replacing `componentDidMount`

To that I’d say – “Great question!” An empty array will run once. This can be used as a replacement for `componentDidMount`. Here’s our `componentDidMount` example from above:

```typescript
class Component {
  componentDidMount() {
    fetch("http://example.com/movies.json").then(response => {
      this.setState({ movies: response.json() });
    });
  }
}
```

And converting that over to a hook is as simple as…

```typescript
const Component = () => {
  const [movies, setMovies] = useState(null);

  useEffect(() => {
    fetch("http://example.com/movies.json").then(response => {
      setMovies(response.json);
    });
  }, []);
};
```

Since our dependency array is empty, our diff will never change (an empty list’s contents will always be an empty list!) which means our function will only run once.

So, in the hooks graphic from before, you can see that `useEffect` helps us cover the ground that `componentDidMount`, `componentDidUpdate` and `componentWillUnmount` normally would take care of. Yet, we haven’t tried tackling `componentWillUnmount`.

### Replacing `componentDidMount` and `componentWillUnmount`

Let’s use a full example for this one. Imagine we have some RxJS observable that our component subscribes to.

```typescript
const Component = () => {
  [sub, setSub] = useState(null);
  useEffect(() => {
    const obs = httpClient.get("bradcypert.com/feed.xml").asPolledObservable();
    setSub(obs.subscribe());

    return () => {
      sub.unsubscribe();
    };
  }, []);
};
```

Without a doubt, this is our most complicated hook yet. If you’re unfamiliar with RxJS (or my made up httpClient library), you just need to know that a polled observable is a long-lived object that keeps emitting every time a poll interval takes place. You’ll notice above that we have an empty dependency array. That’s because we only want to initialize this subscription once.

You’ll also notice that our hook function returns another function. I refer to this as a `tearDown` function. The return function from useEffect is called when `componentWillUnmount` would normally be called. This means that the `tearDown` function should handle canceling timers, http requests, or unsubscribing from observables just like it would in `componentWillUnmount`.

### Replacing the constructor

If, for some reason, you find yourself needing to port over constructor logic, you can simply do so in the function component body. If, for example, we were to take the following component:

```typescript
class Component {
  constructor() {
    this.state = { food: "tacos" };
  }
}
```

We can port it over to function components and hooks like so:

```typescript
const Component = () => {
  [food, setFood] = useState("tacos");
};
```

### A case for hooks

React has been moving towards composition over inheritance in regards to how lifecycles should be handled. Unlike lifecycle methods, you can have more than one of each type of hook (and should where it makes sense).

Instead of having one giant state hook (similar to `this.state`), you should opt to have several smaller and more controlled state hooks. Perhaps one for `food`, `user`, and `company` instead of `this.state={food: "tacos", user: "brad", company: "Pyre Studios"}`. The same can be said for `useEffect` hooks. By using several smaller `useEffects`, you can keep your `setup` and `tearDown` logic alongside each other. As a bonus, your hooks become a way to compose functionality instead of trying to inherit it.

[As always, you can find my catalogue of JavaScript and React resources here if you’d like to learn more. ](/javascript-resources/)
