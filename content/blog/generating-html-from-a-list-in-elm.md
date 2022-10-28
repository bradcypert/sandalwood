---
title: "Generating HTML from a List in Elm"
date: 2019-06-27
status: publish
permalink: /generating-html-from-a-list-in-elm
author: "Brad Cypert"
excerpt: ""
type: blog
id: 1613
images:
  - /acrylic-art-artistic-1289899.jpg
category:
  - Elm
tags:
  - elm
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_primary_category:
  - "211"
_yoast_wpseo_focuskw:
  - "html list elm"
description:
  - "To generate HTML from a list in Elm, you can leverage List.map with a mapping function to produce HTML elements."
_yoast_wpseo_linkdex:
  - "73"
_yoast_wpseo_content_score:
  - "60"
---

Elm is a fantastic language for building web applications. It provides a rich DSL for writing HTML that functions in a similar way to JSX (but still quite different). Overall, I enjoy writing it, however, I often forget how to generate HTML from a list of data in Elm.

Indeed, the problem is not that difficult, and once you approach it from a functional mindset, it’s easy to see how it works. A simple, yet somewhat contrived example, can be found below:

```elm
module Main exposing (main)

import Browser
import Html exposing (Html, div, text)

type alias Model =
    { rows : List String }


initialModel : Model
initialModel =
    { rows =
    [ "Row #1"
    , "Row #2"
    , "Here's Row #3"
    , "Here comes row #4"
    , "Final Row"] }

rowItem: String -> Html Msg
rowItem id =
    div []
        [ text id ]

view : Model -> Html Msg
view model =
    div []
        (List.map rowItem model.rows)
```

You’ll notice a couple of things:

1. Our Model is a structure that holds a list of strings in the property “rows”.
2. Our view is light and focuses on our element generation.

It’s worth mentioning that the HTML package in Elm allows you to create HTML elements and it’s API is rather simple. You import whatever element you’d like to create and then follow the pattern of `elementType [metadata] [children]`. In the example above, we’re writing

```elm
div [] (List.map rowItem model.rows)
```

This looks different than the pattern just mentioned, however, if you consider that the result of our `List.map` call returns a list of HTML elements and the pattern’s 3rd argument is a list of children (also HTML elements), then this should work fine!

So how does the `List.map` bit work? `List.map` takes in a list of data and “maps” the items (that is, applies a function to each item in the list) to create a new list. If we look at the [documentation for ](https://package.elm-lang.org/packages/elm/core/latest/List#map)`<a href="https://package.elm-lang.org/packages/elm/core/latest/List#map">List.map</a>` we can see that it takes in a function that describes the transformation of type `a` to type `b` (`(a -> b)`) as well as a List of type `a` and returns a list of the type `b`.

Reiterating from above, the third argument in our HTML element pattern is a list of children, so it stands to reason that if we convert our list of strings to a list of HTML elements, we can use that in place of the third argument. And we’ve just shown how `List.map` can convert a list of `a` (or `string`) into a list of `b` or (`Html msg`). So the only part that we have to worry about is our function that defines the `a -> b` transformation, or in our case `String -> Html msg`.

We simply define a function like so:

```elm
rowItem: String -> Html Msg
rowItem id =
    div []
        [ text id ]
```

From the function’s definition, you can see the `String -> Html Msg` transformation that I’ve mentioned above. Now, we plug this into our `List.map` call like so `(List.map rowItem model.rows)`. Lastly, we can plug that into our root element in the view: `div [] (List.map rowItem model.rows)`. And that’s how you generate HTML from a list of items in Elm!

If you’d like to learn more about Elm, [you find more posts of mine on Elm here](/tags/elm)!

PS: Elm has an awesome online Editor called Ellie. If you want,[ follow this link to load the above example into Ellie](https://ellie-app.com/5VWjfmpMfLGa1) and you can play with the code and follow along!
