---
title: "The Complete Guide to Dimensions in Android"
date: 2019-02-08
status: publish
permalink: /the-complete-guide-to-dimensions-in-android
author: "Brad Cypert"
excerpt: ""
type: blog
id: 910
images:
  - art-assorted-background-1619844.jpg
category:
  - Android
tags:
  - android
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_primary_category:
  - "80"
_yoast_wpseo_content_score:
  - "60"
_yoast_wpseo_focuskw:
  - dimensions
_yoast_wpseo_linkdex:
  - "93"
description:
  - "Dimensions in Android should be used any time that you need to reuse the value, to support multiple device parameters, or to convert dp to pixels."
---



Figuring out when to use dimensions in Android can be a tricky time. Should all values be a dimension? How about none of them? You could argue that both of these are valid, but I’d like to clear the air with the statement “sometimes you should use dimension values.” But how do you know when?

<HeadsUp title="What are dimensions?">
  If you’re not sure what a dimensions value is, it’s an XML value that lives in
  your project’s res/values folder, under dimens.xml. They’re intended to be
  used for styling dimensions (hence the name) such as width, height, etc.
</HeadsUp>

## Dimensions for Reusability

The simplest reason to use a dimension value is when you know that value needs to be reused. If you were to change this value in one place, you would want to change it elsewhere — that’s a perfect case for a dimension value. A great example of this involves a grid that I was working with. We put the grid item width and height into a dimension and then leveraged that for the headers as well.

```xml
<dimen name="grid_item_width">40dp</dimen>
<dimen name="grid_item_height">40dp</dimen>
<dimen name="grid_column_height">25dp</dimen>
<dimen name="grid_row_width">15dp</dimen>
```

Here we’re setting up 4 dimension values, two for the grid item, and one for the column width and row height. We’ll use the item width and height for the missing values of the column and row to keep our grid uniform. To keep things, simple, we’ll avoid the recylerview and viewholder and simply do a 1×1 grid.

```xml
<androidx.constraintlayout.widget.ConstraintLayout
  xmlns:android="http://schemas.android.com/apk/res/android"
  xmlns:app="http://schemas.android.com/apk/res-auto"
  android:padding="15dp"
  android:layout_width="match_parent"
  android:layout_height="match_parent">

<TextView
  android:id="@+id/column"
  android:layout_width="@dimen/grid_item_width"
  android:lyout_height="@dimen/grid_column_height"
  android:background="#f00"
  app:layout_constraintStart_toEndOf="@+id/row"
  app:layout_constraintTop_toTopOf="parent"
/>

<TextView
  android:id="@+id/row"
  android:layout_width="@dimen/grid_row_width"
  android:layout_height="@dimen/grid_item_height"
  android:background="#0f0"
  app:layout_constraintStart_toStartOf="parent"
  app:layout_constraintTop_toBottomOf="@+id/column"
/>

<TextView
  android:id="@+id/grid_item"
  android:layout_width="@dimen/grid_item_width"
  android:layout_height="@dimen/grid_item_height"
  android:background="#00f"
  android:text="my item"
  app:layout_constraintStart_toEndOf="@+id/row"
  app:layout_constraintTop_toBottomOf="@+id/column"
/>

</androidx.constraintlayout.widget.ConstraintLayout>
```

If we look at the design view in Android studio, we should see something like this:

<div class="wp-block-image">
  ![A grid showing small value
  dimensions.](/Screen-Shot-2019-02-08-at-2.07.54-PM.png)
</div>

While this isn’t particularly interesting on it’s own, what is neat is that we can
update the value of `@dimen/grid_item_width` and `@dimen/grid_item_height` to change
the size of the grid item, while still maintaining an appropriate looking grid.

Let’s update that value to be `200dp`. Here’s our new `dimens.xml`

```xml
<dimen name="grid_item_width">200dp</dimen>
<dimen name="grid_item_height">200dp</dimen>
<dimen name="grid_column_height">25dp</dimen>
<dimen name="grid_row_width">15dp</dimen>
```

<div class="wp-block-image">
  <figure class="aligncenter">
    ![A grid showing large value
    dimensions.](/Screen-Shot-2019-02-08-at-2.14.02-PM.png)
    <figcaption>
      After modifying our dimensions, our grid still maintains it’s proper form.
    </figcaption>
  </figure>
</div>

That alone seems like a great reason to use dimensions in Android, but it’s certainly
not the only reason!

## Dimensions for Screen Density

Given how popular ConstraintLayout is, it’s sometimes easy to forget that screen density is even a thing. However, like all resource files, you can build a `dimens.xml` for different screen densities or other device properties (such as Locale). Perhaps you want different measurements on high density devices or you may even want to remove extra margins on small density devices. The `dimens.xml` file can be qualified to a screen density to allow customization on different devices.

Let’s take the same example from above and set a goal: We want to remove the padding on the constraint layout on low density screens. On a high density screen, the padding may be appreciated as it helps move our “grid” away from the edge of the screen. However, with low density, we may not have enough screen space to add that padding. We can use `dimens.xml` to help.

<HeadsUp title="Heads Up!">
  It’s worth noting that all resource files default to their plain name (in this
  case dimens.xml for dimensions). If I’m on a medium density screen but no
  medium density dimens.xml is found, it’ll fall back to the next in line,
  likely, the default dimens.xml.
</HeadsUp>
To create a qualified `dimens.xml` you can simply create a new resource file in Android
Studio and add the density qualifier to it.

![The wizard for creating a new resource in Android Studio.](/Screen-Shot-2019-02-08-at-2.22.59-PM.png)

Alternatively, you can create a new folder in your resource directory called `values-ldpi`
and add a `dimens.xml` file to that.

Once you’ve done either of these steps, you should see the new file in Android Studio.

<div class="wp-block-image">
  <figure class="aligncenter">
    ![An image showing multiple qualified dimensions
    files.](/Screen-Shot-2019-02-08-at-2.24.48-PM.png)
    <figcaption>
      The old dimens becomes a folder in the Project view of Android Studio
    </figcaption>
  </figure>
</div>
Now we can add our new padding dimension to our `ldpi` file.

```xml

<dimen name="grid_padding">0dp</dimen>
```

Of course, we’ll want to use this property on devices that aren’t low density, so we’ll need to add it to our regular `dimens.xml` as well.

```xml

<dimen name="grid_padding">15dp</dimen>
```

Finally, we can update our view to use the new dimension value.

```xml
<!-- Updating padding to use @dimens/grid_padding -->
<androidx.constraintlayout.widget.ConstraintLayout
  xmlns:android="http://schemas.android.com/apk/res/android"
  xmlns:app="http://schemas.android.com/apk/res-auto"
  android:padding="@dimens/grid_padding"
  android:layout_width="match_parent"
  android:layout_height="match_parent">
<!-- End Update -->

  <TextView android:id="@+id/column"
    android:layout_width="@dimen/grid_item_width"
    android:layout_height="@dimen/grid_column_height"
    android:background="#f00"
    app:layout_constraintStart_toEndOf="@+id/row"
    app:layout_constraintTop_toTopOf="parent" />

  <TextView android:id="@+id/row"
    android:layout_width="@dimen/grid_row_width"
    android:layout_height="@dimen/grid_item_height"
    android:background="#0f0"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintTop_toBottomOf="@+id/column" />

  <TextView android:id="@+id/grid_item"
    android:layout_width="@dimen/grid_item_width"
    android:layout_height="@dimen/grid_item_height"
    android:background="#00f"
    android:text="my item"
    app:layout_constraintStart_toEndOf="@+id/row"
    app:layout_constraintTop_toBottomOf="@+id/column" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

If we set our project to use the 2.7″ QVGA Slider (a low density device) you can see that our padding has been removed!

## Converting Dimensions to Pixels

The third reason to use dimensions in Android makes it easy to convert dp values or dip values into to pixels. This is somewhat of an odd use-case, but definitely has it’s practicalities. We can take any of our existing dimensions in our `dimens.xml` file and, in our code, convert a `dp` or `dip` value into pixels like so:

```kotlin
val dimenAsInt: Int = resources.getDimensionPixelSize(R.dimen.grid_item_width)
```

Additionally, you can get them as a float, like so:

```kotlin
val dimenAsFloat: Float = resources.getDimension(R.dimen.grid_item_width)
```

## When Not to Use Dimensions

Likely, dimensions seem to be the correct way to store your `dp` or `dip` related values. However, there are some cases where dimensions may not make the most sense. Values that don’t fit any of the three recommendations above, should generally be left out of the dimensions file, as it can make those values more difficult to maintain and change.

Instead of simply adjusting the value in your layout, you must now locate the dimensions file for it and adjust the value there. While you could still make the case for keeping all values in `dimens.xml`, I personally feel that this is overkill.

If you’d like to learn more about more about Android development, you can find [more of my posts on the subject here](/category/android/)! Additionally, you can [find the documentation for Dimensions here!](https://developer.android.com/guide/topics/resources/more-resources#Dimension) Thanks for reading!

```

```

```

```
