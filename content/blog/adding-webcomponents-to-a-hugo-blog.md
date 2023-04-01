---
title: "Adding webcomponents to a hugo blog"
date: 2023-04-01
status: publish
permalink: /adding-webcomponents-hugo-blog
author: "Brad Cypert"
type: blog
id: 39
category:
  - webcomponents
  - hugo
tags:
  - webcomponents
  - hugo
  - typescript
images:
  - pexels-tima-miroshnichenko-6755080.jpg
description: "If you're looking to add some reactive frontend elements to your simple blog without having to resort to more complex frameworks like React or Vue, web components might just be the answer you're looking for. In this blog post, I'll walk you through how I added web components to my Hugo blog using Lit components and Vite as a simple build system."
outline:
  what: "Explain how I added web components to my hugo blog"
  why: "Web components provided a lightweight alternative to React or Vue for adding reactive frontend elements to simple blogs"
  how: "Showcase LIT components and using Vite as a simple build system"
  when: "Show examples of when?"
---

If you're looking to add some reactive frontend elements to your simple blog without having to resort to more complex frameworks like React or Vue, web components might just be the answer you're looking for. In this blog post, I'll walk you through how I added web components to my Hugo blog using Lit components and Vite as a simple build system.

## What are web components?

Web components are a set of web platform APIs that allow developers to create reusable custom elements for their web pages and web applications. These custom elements can be created using a combination of HTML, CSS, and JavaScript, and can be used and reused across different pages or applications, making code more modular and easier to maintain.

Web components consist of three main technologies: Custom Elements, Shadow DOM, and HTML Templates. Custom Elements allow developers to create new HTML elements that behave like standard HTML elements but with custom functionality. Shadow DOM allows developers to encapsulate the styling and behavior of their custom elements so that they don't interfere with other parts of the page or application. HTML Templates provide a way to define the structure and content of a custom element using HTML and JavaScript templates.

Web components provide several benefits to developers. They promote code reusability, reducing the amount of code that needs to be written and making it easier to maintain. They also allow developers to create custom elements with native-like behavior that can interact with other parts of the page or application. Furthermore, web components are based on web standards, which means that they are compatible with all modern web browsers and don't require any external libraries or dependencies.

## Why Web Components

There are several reasons why someone might choose to use web components in their web development projects. One of the main advantages of web components is that they promote modularity and reusability, allowing developers to create custom elements that can be used across different pages or applications. This reduces the amount of code that needs to be written and makes it easier to maintain, as changes made to a web component are automatically propagated across all instances of that component.

Another advantage of web components is that they provide a native-like development experience, allowing developers to create custom elements with behavior that is consistent with other native HTML elements. This is because web components are based on web standards, and their behavior is defined by the same set of rules that govern native HTML elements.

In addition, web components can help reduce bundle size and improve performance by allowing developers to selectively load only the custom elements that are needed for a particular page or application. This is because web components are self-contained and can be loaded independently of other code, reducing the amount of code that needs to be loaded on the client-side.

Furthermore, web components can help promote code maintainability by providing a clear separation between the structure, behavior, and styling of a custom element. This makes it easier for developers to make changes to a web component without affecting other parts of the page or application.

Overall, web components provide a powerful and flexible tool for developers looking to create modular, reusable, and performant custom elements for their web development projects.

## Adding web components to an existing site vs building something entirely out of web components

Adding web components to an existing site can be a great way to enhance the functionality of a site without having to rewrite it entirely. This approach allows developers to add custom elements to specific parts of the site, improving the user experience and adding new functionality without disrupting the existing structure and design of the site. For example, a developer might add a custom element that displays a calendar widget on a specific page of the site, without having to change the underlying structure or styling of the page.

On the other hand, building a new app entirely out of web components can be a powerful approach for creating highly modular and reusable applications. This approach allows developers to create a set of custom elements that can be combined and reused across different pages or applications, reducing the amount of code that needs to be written and making it easier to maintain. For example, a developer might create a custom element for a product card that can be used across different pages of an e-commerce site, allowing them to reuse the same code and styling for all product listings.

Both approaches have their advantages and disadvantages, and the best approach depends on the specific needs of the project. Adding web components to an existing site can be a good choice if the site has already been built and the developer wants to add new functionality without disrupting the existing structure and design. Building a new app entirely out of web components can be a good choice if the developer wants to create a highly modular and reusable application that can be easily maintained and scaled over time.

## My Code-Block web component

When I first built BradCypert.com, it was a completely custom build written in Python. Over the years, it's evolved jumping from a bespoke Python project to a Wordpress Site then to a Gatsby site and finally down to a Hugo site. The decision to move from Gatsby to Hugo was one that made perfect sense, but I knew I'd be trading a way a few things that I wanted (though I could live without). I'm very happy with Hugo overall, but I miss some of the interactive elements that I had built into my Gatsby blog with React. Part of moving away from Gatsby was to ditch React (it was overkill for me) and I didn't want to have to pull some meaty library in like Vue, React, Angular, etc for my hugo blog. I also really dislike writing vanilla javascript.

<div align="center">
<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:6998787691744026624" allowfullscreen="" title="Embedded post" width="504" height="569" frameborder="0"></iframe>
</div>

All of these constraints ultimately lead to me choosing to use [Lit](https://lit.dev/) with [TypeScript](https://www.typescriptlang.org/) for my web components. My code-block web component takes in all child codeblocks and converts those to a tabbed view so that the user can toggle between different languages (provided I have examples in those languages). Here's a live example of the component:

<code-block>

```dart
void main() {
  print("Hello World!");
}
```

```clojure
(ns clojuredemo.hello
   (:gen-class))

(println "Hello World"))
```

```java
class JavaDemo {
    public static void main(String[] args) {
        System.out.println("Hello, World!"); 
    }
}
```

</code-block>

One of my goals here was to keep the actual DOM fully-in-tact for server-side rendering. I'm not 100% sure if Google or Bing cares much about the contents of code blocks, but I figured keeping the DOM in tact would be the right thing to do anyways. Plus, it can still provide value for people consuming my blog posts via an RSS Reader.

The web component code itself is fairly simple and all contained in one file. I'll go ahead and paste it here and then we can walk through it.

```typescript
import {html, css, LitElement} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

import {customElement, state} from 'lit/decorators.js';


@customElement('code-block')
export class CodeBlock extends LitElement {
  static styles = css`
  pre {
    overflow-x: auto;
    font-size: 0.875em;
    line-height: 1.7142857;
    margin-top: 0;
    margin-bottom: 1.7142857em;
    border-radius: 0.375rem;
    border-top-left-radius: 0;
    padding-top: 0.8571429em;
    padding-right: 1.1428571em;
    padding-bottom: 0.8571429em;
    padding-left: 1.1428571em;
  }
  
  button {
    background: none;
    background-color: #686a76;
    color: #f8f8f2;
    border: none;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    border: 1px solid black;
    padding: 8px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    opacity: 0.6;
  }

  button.selected {
    background: #282a36;
    opacity: 1.0;
    border-bottom: 1px solid transparent;
  }
  `;

  @state()
  private selected: number = 0;

  @state()
  private originalChildren: Array<Element>;

  
  connectedCallback() {
    super.connectedCallback();
    this.originalChildren = [...this.shadowRoot.host.children];
  }

  render() {
    const tabs = this.originalChildren.map((e) => (e.firstChild.firstChild as HTMLElement).dataset['lang']);
    
    return html`<div>
        <div class="tabs">
            ${tabs.map((tab, index) => html`
                <button class="${this.selected == index ? "selected" : ""}" @click=${() => this.selected = index}>
                    <span>
                        ${tab}
                    </span>
                </button>
            `)}
        </div>
        ${this.originalChildren[this.selected]}
    </div>`;
  }
}
```

Lit gives us a [customElement decorator](https://lit.dev/docs/api/decorators/#customElement) to help reduce the boilerplate around registering a web component with the browser. We wrap our web component with this and we dont have to worry about manually registering it.

Our web component is a class and it extends LitElement. Next we have our styles, but we're going to skip over those for now as they deserve a larger callout which we'll get to in a moment. We're using another decorator, this time `@state`. The state decorator declares a private or protected reactive property that still triggers updates to the element when it changes. The state decorator is meant to be used with internal state, while `@property` (not used in this example) is meant to reflect properties passed to the component. Both trigger updates to the element when changed.

Next we're overriding `connectedCallback()` which is one of the lifecycle methods exposed by LitElement. ConnectedCallback is the earliest that we can access the shadowRoot on the LitElement, so we're getting the shadowRoot's host's children -- which is the HTML elements that are contained within the web component on initial render. We're storing those in `originalChildren` so we can access them later.

Lastly, we have our `render` method. Every Lit webcomponent should have a render method, and this is where the component creates it's markup and decides how it should be represented to the browser. My code here is not very complex, but I can run through it. The original children has some markup that is nested like so `div > pre > code`. Since these are div elements, we get the first child (the pre element), then we get that element's child (the code element). That code element has a data attribute for it's programming language, so we map those elements to that language for our tab names. Then, we use the `html` template function to return some HTML, interpolating our tab data where appropriate and looking at the selected tab to determine which child to show to the user.

Circling back to styles, styles in a shadow DOM are a bit tricky. Our web component is very limited in the styles that they inherit from the root DOM and provide a static property called `styles` where we can declare our styles for our web component. We're using another template function here, `css` and specifying some CSS for the styles. The CSS is nothing too interesting, but you can [learn more about styling in the shadow DOM on mozilla's MDN docs here](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

## Compiling with Vite

You can compile your Lit component with just about any modern compilation stack, but I'm a big fan of Vite for it's out of the box support for TypeScript and general simplicity. If you're compiling TypeScript, you'll need a standard TSConfig, but your vite config can look something like so:

```javascript
import { defineConfig } from 'vite'
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  base: '/static/js',
  publicDir: false,
  build: {
    outDir: 'static/js',
    lib: {
      entry: path.resolve(__dirname, 'web-components/code-block.ts'),
      formats: ['es'],
      name: 'web-components',
      fileName: (format) => `web-components.${format}.js`
    },
    rollupOptions: {
      output: {
      },
    },
    manifest: false,
  },
})
```

Additionally, we can build our code-block web component via `npx vite build`.

## Using Our Web Component

Hugo takes my markdown and converts it to HTML Markup automatically. Hugo also has a concept of "themes." Adding our web component simply means adding a script tag and pointing our compiled web component in our theme, which is compiled in the previous section "Compiling with Vite."

```html
<script type="module" src="/js/web-components.es.js"></script>
```

Then we can leverage our web component in any of our markdown files simply by defining the HTML element and adding our code as the children of that web component's DOM element. Here's an example from my post [Autosaving With React Hooks](/autosaving-with-react-hooks/):

```md
  <code-block>

    ```typescript
    const AUTOSAVE_INTERVAL: number = 3000;
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
    
    ```javascript
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

    </code-block>
```

## When to use Web Components

Web components can be a good choice for a wide range of use cases, and are particularly useful for creating custom elements that need to be reused across different pages or applications. Here are a few examples of when web components might be a good choice:

- Creating custom UI elements: Web components can be used to create custom UI elements that have behavior that is consistent with other native HTML elements. This makes them a good choice for creating elements such as buttons, form inputs, and dropdown menus that need to be styled and behave in a specific way.

- Creating custom data visualizations: Web components can also be used to create custom data visualizations such as charts and graphs. This allows developers to create highly customizable and interactive visualizations that can be easily embedded into different pages or applications.

- Creating reusable components for a design system: Web components can be used to create reusable components for a design system, allowing developers to create a set of consistent and reusable components that can be used across different projects.

- Creating dynamic and reactive UI elements: Web components can be used to create dynamic and reactive UI elements that respond to user input or changes in the application state. This makes them a good choice for creating elements such as modals, dropdown menus, and tooltips that need to be responsive and interactive.

Overall, web components can be a powerful tool for creating reusable and customizable elements that can be used across different pages or applications. By encapsulating behavior and styling into a self-contained custom element, web components can help promote modularity, maintainability, and performance in web development projects.