---
title: "Migrating from Wordpress to Gatsby"
date: 2020-11-21
status: publish
permalink: /migrating-from-wordpress-to-gatsby
description: "I recent migrated BradCypert.com from Wordpress to Gatsby. Here's how I did it."
author: "Brad Cypert"
excerpt: ""
type: blog
id: 27
category:
  - meta
tags:
  - gatsby
  - meta
  - wordpress
---



Well, It's been a long time coming, but I've finally migrated off of wordpress and onto something I'm a
a little more comfortable regularly working with. What did I choose (Spoiler: It's Gatsby)? How did I migrate
everything? Read on to find out more.

<HeadsUp>
  This is a early revision of a living document. I am still working on pieces of
  my Gatsby migration and will update this document as I do. This means that the
  quality of this document may be subpar compared to others, but will eventually
  be brought into the fold.
</HeadsUp>

As spoiled above, I decided to migrate off of Wordpress onto Gatsby. Gatsby is a static site generator that
has a huge plugin ecosystem and exposes your content via a GraphQL api. Due to Gatsby's flexibility, I actually
had a lot of options with how I wanted to manage my content. For example, there is a Wordpress plugin that helps
expose your existing Wordpress content via GraphQL. Gatsby can plug right into that and I could still manage
all of my content in Wordpress, while still having a Gatsby site. I see how this could be valuable for
someone who is only comfortable with Wordpress (or a team that agreed upon Wordpress), but that is definitely
not the scenario that I'm in. In fact, I'd actually prefer to retire my Wordpress server
(and save on hosting costs) For this reason, I opted to keep all of my content as MDX in my project repo.

I was able to log in to my wordpress instance and export all of my posts and pages. I also found a plugin
for exporting my Media into a zip file and used that to download my images. Once I exported everything,
I started a new Gatsby project with the Gatsby CLI:

```
gatsby new tulip https://github.com/gatsbyjs/gatsby-starter-hello-world
```

I chose the name Tulip because I like fun project names and I think it embodies the goal of my
personal sites/blog's redesign. In my source directory, I created a `components` folder, a `pages` folder, and a `posts` folder.
My posts are MDX, components are TSX and my pages are a mix of MDX or TSX (depending on how complicated they are).

I also decided to use [Semantic UI](https://semantic-ui.com/) for this project. I had not used Semantic UI for anything before and opted to use the [Semantic UI React](https://react.semantic-ui.com/) package. Additionally, I wanted to configure the Semantic UI theme, so I had to install [Semantic UI LESS](https://github.com/Semantic-Org/Semantic-UI-LESS) as well. This lead to me creating a `semantic` folder that lives alongside `posts` and `pages`. Additionally, I had to copy the `site` folder and theme.config from Semantic UI LESS and point webpack to them. This lead to my `gatsby-node.js` looking like this:

```js
const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "../../theme.config$": path.join(
          __dirname,
          "src/semantic/theme.config"
        ),
      },
    },
  });
};
```

Additionally, in `gatsby-node.js`, I setup three different additional page creation strategies. I created one to list
posts by Tags, one to display a paginated list of posts (the blog), and the detailed blog post view.
Here's my full `gatsby-node.js` file:

```js
const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "../../theme.config$": path.join(
          __dirname,
          "src/semantic/theme.config"
        ),
      },
    },
  });
};

function createBlogPosts(graphql, actions) {
  const { createPage } = actions;

  const blogPost = path.resolve(`./src/components/blog-layout.tsx`);
  return graphql(
    `
      {
        allMdx(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              id
              fields {
                slug
              }
              frontmatter {
                title
              }
              body
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    // Create blog posts pages.
    const posts = result.data.allMdx.edges;

    posts.forEach((post, index) => {
      const previous =
        index === posts.length - 1 ? null : posts[index + 1].node;
      const next = index === 0 ? null : posts[index - 1].node;

      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      });
    });
  });
}

function createTagPages(graphql, actions) {
  const { createPage } = actions;
  const tagLayout = path.resolve(`./src/components/tag-page.tsx`);
  return graphql(
    `
      {
        allMdx {
          edges {
            node {
              id
              frontmatter {
                tag
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    // Create blog posts pages.
    const edges = result.data.allMdx.edges;
    const tags = [
      ...new Set(
        edges
          .map(e => e.node.frontmatter.tag)
          .reduce((acc, cur) => acc.concat(...cur), [])
          .map(e => e.toLowerCase())
      ),
    ];

    tags.forEach((tag, index) => {
      createPage({
        path: "/tags/" + tag,
        component: tagLayout,
        context: {
          tag: `/^${tag}$/i`,
          cleanTag: tag,
        },
      });
    });
  });
}

function createBlogPage(graphql, actions) {
  const { createPage } = actions;

  const blogPost = path.resolve(`./src/components/blog-list.tsx`);
  return graphql(
    `
      {
        allMdx(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              id
              fields {
                slug
              }
              frontmatter {
                title
                date
              }
              body
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    // Create blog posts pages.
    const posts = result.data.allMdx.edges;
    const postsPerPage = 6;
    const numPages = Math.ceil(posts.length / postsPerPage);

    posts.forEach((post, index) => {
      const previous =
        index === posts.length - 1 ? null : posts[index + 1].node;
      const next = index === 0 ? null : posts[index - 1].node;

      createPage({
        path: index === 0 ? "/blog" : `/blog/${index + 1}`,
        component: blogPost,
        context: {
          limit: postsPerPage,
          skip: index * postsPerPage,
          numPages,
          currentPage: index + 1,
        },
      });
    });
  });
}

exports.createPages = ({ graphql, actions }) => {
  return createBlogPosts(graphql, actions)
    .then(() => {
      return createTagPages(graphql, actions);
    })
    .then(() => {
      return createBlogPage(graphql, actions);
    });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
```

There's a lot going on here and I have a few plans to refactor/cleanup that file at some point.
When I do, I'll update it here.

Overall, Gatsby has been great to work with and when Im modifying the markup of my pages, I feel
WAY more confident than trying to mangle my existing Wordpress Theme.
