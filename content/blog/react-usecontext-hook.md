---
title: "Managing Authentication with React's useContext Hook"
date: 2020-02-11
status: publish
permalink: /react-usecontext-hook
author: "Brad Cypert"
excerpt: ""
type: blog
id: 2631
images:
  - pink-and-purple-wallpaper-1616403.jpg
category:
  - React
tags:
  - hooks
  - react
  - typescript
post_format: []
wp_last_modified_info:
  - "February 11, 2020 @ 3:41 pm"
wplmi_shortcode:
  - "[lmt-post-modified-info]"
_yoast_wpseo_focuskw:
  - "React's useContext Hook"
_yoast_wpseo_title:
  - "React's useContext Hook | Managing Authentication %%page%% %%sep%% %%sitename%%"
description:
  - "React's useContext hook can provide a lightweight alternative to global state management (like Redux) if used properly. However, it can also be unweildy if used improperly."
_yoast_wpseo_linkdex:
  - "69"
_yoast_wpseo_content_score:
  - "30"
_yoast_wpseo_primary_category:
  - "243"
---



Contexts are a commonly used tool when building React libraries, but are often overlooked when building an application in React. I don’t believe that should be the case, as useContext can provide you a powerful alternative (but lightweight) alternative to tools like Redux when managed carefully.

The [classic example of using a context is to declare an app theme](https://reactjs.org/docs/hooks-reference.html#usecontext) but we can use them for so much more than that. In fact, we’re going to leverage a context today to demonstrate how simple authentication can be handled with React’s useContext hook.

[If you want to jump straight to the codepen, you can find a link for it here!](https://codepen.io/bradcypert/pen/BaNNEdZ)

For our example, we’ll add this to an existing React project (using typescript). If you don’t have an existing React typescript project, you can run `create-react-app useContextDemo --typescript` from your terminal to create a new one with [Create React App](https://reactjs.org/docs/create-a-new-react-app.html).

This is such a lightweight example that we can just add everything to `App.tsx`.
No need for reducers, selectors, actions, or anything like that.

```typescript
const UserContext = React.createContext(null);
```

First things first, we’re going to create a new context to store our user in. In our case, it’s going to start as null (unauthenticated) but you could always load in a value from local storage (or wherever) to try and log your user in by default.

Next, we’re going to create a component that will leverage this context via use of the `useContext` hook provided by React.

```tsx
const UserInfo = () => {
  const user = React.useContext(UserContext);
  return <div>{user ? "Logged in as " + user.name : "Anonymous"}</div>;
};
```

This is a fairly simple component that simply gets the user from the UserContext and then returns `Logged in as \${user.name}` if the user is logged in or “Anonymous” if they are not.
Finally, we can modify our `App` function to wire up the context to our hierarchy. We’ll need a way to set the value provided to our context, so we’ll leverage `useState` to set and store a stateful variable.

```tsx
const App = () => {
  const [user, setUser] = React.useState(null);
  return (
    <UserContext.Provider value={user}>
      <div className="box">
        <button onClick={e => setUser({ name: "Brad" })}>Log me in</button>
        <UserInfo />
      </div>
    </UserContext.Provider>
  );
};
```

You’ll notice that we have wrapped our entire component in the `ContextProvider` (`UserContext.Provider`) that we created earlier. This gives all children (and grandchildren and so on) access to that context.
We then add in a button that simply sets the user state on click. You’d probably do an HTTP request here to authenticate, and probably pull some values from a form field for that matter, but this demo is aimed to be simple and focused on `useContext`.
Finally, we add in our `<UserInfo />` component, which, as we wrote above, reads the value of the `UserContext` to determine it’s return value. And that’s it! You should now have a working example of leveraging `useContext` to handle simple authentication.

If something’s not quite working, or you just want to see the code in action, [please check out the codepen demo](https://codepen.io/bradcypert/pen/BaNNEdZ)!

<HeadsUp title="A brief note on Redux vs Context">
  I will add that updating your context from deep within your hierarchy can be a
  bit more involved. In that case, you’d have to pass your update function down
  as a prop to the relevant child components. Additionally, Redux lives outside
  of your application where as the context is coupled tightly to React. That
  being said, I’ve seen people immediately jump to pulling in Redux when there’s
  really no need so hopefully this provides a simpler alternative.
</HeadsUp>

Want to learn more about React? You can [check out my other articles on React (including
more hooks examples) here](/javascript-resources/)!
