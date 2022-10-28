---
title: "Auth Guarding React Router Routes"
date: 2019-10-27
status: publish
permalink: /auth-guarding-react-router-routes
author: "Brad Cypert"
excerpt: ""
type: blog
id: 1906
images:
  - /Screen-Shot-2019-10-27-at-5.01.05-PM.png
category:
  - React
tags:
  - react
  - react-router
  - typescript
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_primary_category:
  - ""
_yoast_wpseo_focuskw:
  - "admin guard react routes"
description:
  - "React Routes can be configured to easily admin guard specific components through the use of higher order function components."
_yoast_wpseo_linkdex:
  - "63"
_yoast_wpseo_content_score:
  - "90"
---

A common theme in web applications is to serve specific content to authenticated users while serving other content to everyone else. I’ve heard this referred to in the past as “auth guarding” specific content. In this case of our example today, we want to auth guard react-router routes.

There are a couple of different ways to do this, but I’ve found a pattern that I really like that uses higher-order function components to help create the functionality that would be expected of an auth guarded route. Namely, we show them an unauthorized screen if they’re not authorized and, if they are authorized to view that content, we show them the content.

We can run through this pretty quickly via <a href="https://github.com/facebook/create-react-app">create-react-app</a>, so we’re going to do just that! If you’d like to follow along, be sure to run the commands that are formatted like `create-react-app` above!

Let’s start by creating a new react project. You can do so simply by running `create-react-app authguard --typescript`. Oh yeah, we’re definitely using [typescript](https://www.typescriptlang.org/) for this demo 😉.

Now we need to add react-router — This post is about auth-guarding react-router routes after all! Run the following in your project directory: `yarn add react-router-dom @types/react-router-dom`. Excellent, let that install and then we can jump into writing code.

## Modifying App.tsx to include routes

To leverage react-router, we’ll need to add some routes. We can do this in our `App.tsx` file. For simplicity’s sake, let’s remove everything from this file and put this code in place (it’s the same as what’s generated but removing a bunch of cruft).

```typescript
import React from "react";
import "./App.css";

const App: React.FC = () => {
  return <div className="App"></div>;
};

export default App;
```

Now we’re going to want to add three components. The first component will be the un-guarded route, the second the guarded route, and the last will be a “not authorized” page that we’ll show when an unauthorized user tries to hit the guarded route.

Let’s modify `App.tsx` so that it has the three new components added (we’ll keep them simple)!

```typescript
import React from "react";
import "./App.css";

const LandingPage: React.FC = () => {
  return <h1>Welcome to my react project</h1>;
};

const LoggedIn: React.FC = () => {
  return <h1>Thanks For Logging In</h1>;
};

const Unauthorized: React.FC = () => {
  return <h1> Whoa there, partner. You don't have access to that page.</h1>;
};

const App: React.FC = () => {
  return <div className="App"></div>;
};

export default App;
```

## Adding Routes

Excellent, with this in place, we can start on our routes. If you need help with the react-router portion of this, [their documentation is fantastic](https://reacttraining.com/react-router/web/guides/quick-start) and I strongly recommend cross-referencing it.

We’ll want to start by adding a route for the main landing page. Let’s modify the `App` function in our `App.tsx` file to leverage the router and add our first route:

```typescript
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";

const LandingPage: React.FC = () => {
  return <h1>Welcome to my react project</h1>;
};

const LoggedIn: React.FC = () => {
  return <h1>Thanks For Logging In</h1>;
};

const Unauthorized: React.FC = () => {
  return <h1> Whoa there, partner. You don't have access to that page.</h1>;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Route path="/" exact component={LandingPage} />
      </div>
    </Router>
  );
};

export default App;
```

With this in place, we should be able to fire up our application and see our landing page.

![App landing Page](/Screen-Shot-2019-10-27-at-4.51.36-PM.png)

Great! Now we can add our next set of routes, but we’ll want to add some custom logic
for those.

For the sake of our application, we can store our user in a nullable object. If that variable is null, we’ll assume the user isn’t logged in. If it isn’t null, we can use the data to represent the user. How you get that data into the variable is up to you (I use apollo for a project I’m working on, but you can handle that via Redux, Mobx, plain-react, however). Let’s start by adding a new function:

```typescript
function AdminGuardedRoute(user: { id: number } | null) {
  return function ({ component: Component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props => (!!user ? <Component {...props} /> : <Unauthorized />)}
      />
    );
  };
}
```

Excellent. Since that function returns a function (a pattern called currying), we’ll actually need to call our function and use the return value from that as our route component. A great place to do that is in our `App` function.

```typescript
const App: React.FC = () => {
  const user = null;
  const AdminRoute = AdminGuardedRoute(user);
  return (
    <Router>
      <div className="App">
        <Route path="/" exact component={LandingPage} />
      </div>
    </Router>
  );
};
```

Great! Now we can leverage our logic to create guarded routes the same way that we’d create non-guarded routes. This should leave us with something like the following:

```typescript
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";

function AdminGuardedRoute(user: { id: number } | null) {
  return function ({ component: Component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props => (!!user ? <Component {...props} /> : <Unauthorized />)}
      />
    );
  };
}

const LandingPage: React.FC = () => {
  return <h1>Welcome to my react project</h1>;
};

const LoggedIn: React.FC = () => {
  return <h1>Thanks For Logging In</h1>;
};

const Unauthorized: React.FC = () => {
  return <h1> Whoa there, partner. You don't have access to that page.</h1>;
};

const App: React.FC = () => {
  const user = null;
  const AdminRoute = AdminGuardedRoute(user);
  return (
    <Router>
      <div className="App">
        <Route path="/" exact component={LandingPage} />
        <AdminRoute path="/loggedIn" exact component={LoggedIn} />
      </div>
    </Router>
  );
};

export default App;
```

Now, if we run our app (`yarn start`) and hit localhost:3000/loggedIn, we should see the following:

![](/Screen-Shot-2019-10-27-at-5.01.05-PM.png)

If we set our user variable to an object, then we should see our logged-in page.

```typescript
const App: React.FC = () => {
  const user = { id: 1 };
  const AdminRoute = AdminGuardedRoute(user);
  return (
    <Router>
      <div className="App">
        <Route path="/" exact component={LandingPage} />
        <AdminRoute path="/loggedIn" exact component={LoggedIn} />
      </div>
    </Router>
  );
};
```

<div class="wp-block-image">
  ![](/Screen-Shot-2019-10-27-at-5.01.17-PM.png)
</div>
Once again, this doesn’t take care of all the intricacies behind logging in (and
storing the login response so it’s readily available) but it should help you setup
components behind an auth-guard.

If you’d like to learn more about React, [you can find more of my writings on Facebook’s awesome framework here](/tags/react). Thanks for taking the time to read my post!
