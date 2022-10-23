---
title: "Android: ListView, RecyclerView, Adapters"
date: 2016-09-27
status: publish
permalink: /android-listview-recyclerview-adapters
author: "Brad Cypert"
excerpt: ""
type: blog
id: 33
category:
  - Android
tags:
  - android
  - "list adapter"
  - listview
  - recyclerview
post_format: []
description:
  - "Learn about when to use a RecyclerView and a ListView as well as how to build an Adapter for each!"
_yoast_wpseo_title:
  - "Android - ListView, RecyclerView, Adapters"
---

I recently started working on part three of my [**Zero-To-Hero**](http://www.bradcypert.com/tags/zero-to-hero/) series, which gives us a chance to leverage a RecyclerView and List Adapter for our Todo/Habit application. Though I cover them in that tutorial as well, I feel like they deserve a post to themselves to go a bit more in depth. Code examples are taken from the Turnip app that we build in the **Zero-To-Hero** series.

#### ListViews

So what is a ListView? It’s a very commonly used view group in the Android ecosystem and is used to display a list of scrollable items. It’s important to note that the content is automatically inserted into the ListView from an adapter, and we’ll talk about those in a second. A few examples of list views include the settings app on your phone or the songs in Spotify’s playlist view. With a list view, you define a view holder template which acts as the view that is used for each list item. This view holder is written just like any other template – standard XML with a container element.

#### Adapters

So how do you get content into your list view? With an adapter! The Android standard libraries provide you with a few adapters out of the box that solve very common scenarios. A few examples are the `SimpleCursorAdapter` which is used for iterating over a SQLite Cursor and the `ArrayAdapter` which is used for iterating over the values of an array. You can also write your own adapters by implementing `android.widget.ListAdapter`. Here’s an example of quickly using an array adapter:

```java
String[] groceryList = {"Milk", "Eggs", "Bacon"};
setListAdapter(new ArrayAdapter(this,  android.R.layout.simple_list_item_1, groceryList));
```

A more robust example of an adapter (taken from the **Zero-To-Hero** series) can leverage a SQLite cursor or even a non-iterable object to produce the list items.

```java
package com.bradcypert.turnip.adapters;

import android.content.Context;
import android.database.Cursor;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.bradcypert.turnip.R;
import com.bradcypert.turnip.contracts.TaskContract;

import co.dift.ui.SwipeToAction;

/**
 * Created by brad on 8/24/16.
 */
public class TaskListAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private Cursor taskCursor;
    private Context mContext;

    public class TaskViewHolder extends SwipeToAction.ViewHolder {
        public TextView nameView;
        public TextView frequencyView;
        public TextView timesCompletedView;
        public TextView timesRequiredPerFrequencyView;

        public TaskViewHolder(View v) {
            super(v);
            nameView = (TextView) v.findViewById(R.id.name);
            frequencyView = (TextView) v.findViewById(R.id.frequency);
            timesCompletedView = (TextView) v.findViewById(R.id.timesCompleted);
            timesRequiredPerFrequencyView = (TextView) v.findViewById(R.id.timesRequired);
        }
    }

    public TaskListAdapter(Context context, Cursor cursor) {
        taskCursor = cursor;
        mContext = context;
    }

    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.task_list_item, parent, false);

        return new TaskViewHolder(view);
    }

    public void setTaskCursor(Cursor cursor) {
        this.taskCursor = cursor;
        this.notifyDataSetChanged();
    }

    @Override
    public void onBindViewHolder(RecyclerView.ViewHolder holder, int position) {
        taskCursor.moveToPosition(position);
        TaskViewHolder vh = (TaskViewHolder) holder;

        int id = taskCursor.getInt(taskCursor.getColumnIndex(TaskContract.TaskTable._ID));
        String name = taskCursor.getString(taskCursor.getColumnIndex("name"));
        int frequency = taskCursor.getInt(taskCursor.getColumnIndex(TaskContract.TaskTable.COLUMN_FREQUENCY));
        String timesCompleted = taskCursor.getString(taskCursor.getColumnIndex(TaskContract.TaskTable.COLUMN_TIMES_COMPLETED_PER));
        String timesRequired = taskCursor.getString(taskCursor.getColumnIndex(TaskContract.TaskTable.COLUMN_TIMES_REQUIRED_PER));

        String freq = "";

        switch (frequency) {
            case 1:
                freq = mContext.getResources().getText(R.string.today).toString();
                break;
            case 2:
                freq = mContext.getResources().getText(R.string.this_week).toString();
                break;
            case 3:
                freq = mContext.getResources().getText(R.string.this_month).toString();
                break;
        }

        vh.nameView.setText(name);
        vh.frequencyView.setText(freq);
        vh.timesCompletedView.setText(timesCompleted);
        vh.timesRequiredPerFrequencyView.setText(timesRequired);
        vh.data = id;
    }

    @Override
    public int getItemCount() {
        return taskCursor.getCount();
    }
}
```

In the above example, you’ll notice that we’re writing this adapter for a RecyclerView instead of a ListView. You’ll also notice the ViewHolder internal class that I’ve written. Leveraging a ViewHolder is a very common practice when working with View Adapters.

It’s important to keep in mind that the adapter does very little on it’s own. In fact, you need to remember to attach the adapter to a list view for it to work as expected. You can do that like so:

```java
tasks = DBHelpers.getTasks(); //returns a cursor
taskListAdapter = new TaskListAdapter(this, tasks);
recyclerView.setAdapter(taskListAdapter);
```

#### RecyclerView

At first glance, a RecyclerView may look exactly like a ListView. That’s because, well, they look the exact same! The difference is in how they perform. A list view will make N number of items in the list, which can be problematic when you have a list of, say, ten-thousand items. A RecyclerView, however, will only create enough items to fill the height of the listview and when you scroll, it instead recycles old list items into new list items. This ends up being much more performant for big lists.

#### When to use which?

You often want to use a ListView which you have a set number of list items and that doesn’t change. For example, having ten settings in a list is light enough that a list view will actually be more performant that a RecyclerView (due to the overhead of setting up the recycler). However, you’ll want to use a RecyclerView if there’s an indefinite number of items that could show up in the list (for example, allowing users to add as many songs to a playlist as they’d like), or when you know the list is going to have a lot of list items.
