---
title: "Zero to Hero: Android App - Part 2 - Database"
date: 2016-09-26
status: publish
permalink: /zero-to-hero-android-app-part-2-database
author: "Brad Cypert"
excerpt: ""
type: blog
id: 38
category:
  - Android
  - Zero-To-Hero
tags:
  - android
  - zero-to-hero
post_format: []
description:
  - "Learn to add a Database to your android application! This guide covers adding, deleting, updating and reading data while using cursors and contracts."
_yoast_wpseo_title:
  - "Zero to Hero - Android App - Part 2 - Database"
---

Oh, hey, didn’t see you there. Glad that you’ve came back for the next part of my **Zero to Hero** series! Let’s get right into it!

Last time, we created an Android app from Android Studio and manually created the View (or the visual representation of one of our screens) for our application. If you’ve missed out on that piece, you probably want to go back and start there, as all of the other posts in this series build off of that one. [You can find it here](http://www.bradcypert.com/zero-to-hero-android-app-part-1/).

In this post, we’re going to talk about how your application stores data on Android phones, some alternatives, and how to setup a robust data storage solution using SQLite (pronounced “Sequel-lite”). Let’s get started!

#### Storing Data

Storing Data is an essential piece of almost any application. Facebook stores all of your status updates in their DB, LinkedIn stores all of your picture upload on their file system and even the DMV stores your picture and license information in their databases. Data is everywhere and building a maintainable data solution is imperative for applications everywhere.

There are a lot of patterns for storing data for mobile applications, although we’re going to talk about three patterns briefly, and then pick one and use that one for our application. These three common patterns are the following:

- Storing data as a File on the Android phone
- Storing data on a remote server via a web API
- Storing data on the phone via a database

Storing the data as a file is the simplest. It takes all of the stress of storing and retrieving the data out of the equation and instead, trusts the app to read the file and get the data in a meaningful structure. Storing the data via a remote web API is probably the most complicated, as this includes making remote requests over the cellular (or WiFi) network to persist and retrieve data from a remote server. That being said, it’s also the most interactive data storage solution and allows data to persist across devices. A common symptom of this storage solution is requiring the user to create an account.

Lastly, and the method we’re going to use, is storing the data on the phone via a database. This method allows you to have a very simple and straightforward set of code used to interact with your database, and SQL statements offer the flexibility of something more structured and modular than the file-approach. For us, it’s the best of the three solutions as we don’t want to (and I don’t want this series to last for years explaining how to) build an API server, too.

SQLite uses a concept of tables (as almost all databases do), so we’ll need to define what our table structure looks like. This is actually really easy to do so we’ll start our coding today with this.

#### Coding Time

Alright, let’s use a common pattern to define our structure called a “contract” pattern. In Android Studio, in the left-most pane, Expand the `Java` folder and right click on `com.yournamehere.turnip.` Click `new`, click `package`, and lastly type `contracts`. This is where we’ll store our contracts for our database. You should see a new folder labeled “contracts” and yes, we’re finally writing Java.

In our last example, we created a view that takes in data for the following things: task name, task frequency, and if the user would like notifications for this task. Our contract needs to illustrate these things, but we’ll add a few more entries to our contract as well. Specifically, we want to add the total times completed, and the total times completed per each interval (each day, week, whatever the user selects for frequency). Our database will basically be structured with columns like so:

```
| name | frequency | times completed per freq | total times completed | notify | times required |
=================================================================================================

```

Right click the `contracts` folder and click `new` then click `Java class`. Enter the name `TaskContract` and hit enter. You’ll be take to a new file in the rightmost pane and this is where we’ll add our contract code. If you’ve never seen Java code before, this part will likely be pretty confusing, but hang in there. It does get easier. As per usual, I’ll dump the code for this file and then we’ll talk about it and as always, I recommend coding this yourself and not copy/paste.

```java
package com.bradcypert.turnip.contracts;

import android.provider.BaseColumns;

public final class TaskContract {
    public TaskContract() {}

    public static abstract class TaskTable implements BaseColumns {
        public static final String TABLE_NAME = "tasks";
        public static final String COLUMN_NAME = "name";
        public static final String COLUMN_FREQUENCY = "frequency";
        public static final String COLUMN_NOTIFY = "notify";
        public static final String COLUMN_TOTAL_TIMES_COMPLETED = "total_times_completed";
        public static final String COLUMN_TIMES_COMPLETED_PER = "times_completed_per_frequency";
        public static final String COLUMN_TIMES_REQUIRED_PER = "times_required_per_frequency";
    }

    public enum Frequency {
        ONCE(0), DAILY(1), WEEKLY(2), MONTHLY(3);
        public int value;

        Frequency(int value) {
            this.value = value;
        }
    }

    public enum Notify {
        False(0), True(1);
        public int value;

        Notify(int value) {
            this.value = value;
        }
    }
}

```

If you have written Java before, you’ll notice that this is actually really simple and doesn’t really do anything. We’re simply creating a modularized contract to establish some values we can use elsewhere in our code. Notice that our package name is set to `com.yournamehere.turnip.contracts` and that we’re importing the `BaseColumns` package from `android.provider`. Next, we’re creating a TaskContract class with a shallow constructor. This means that we shouldn’t try to create an instance of this class. We store our table column names as public strings on an internal abstract class and create a few enums to allow us to easily refer to frequency and notification options throughout the rest of our application.

So we have a contract that illustrates what our DB looks like and gives us some code to help translate Frequency and Notification choices into integers, which are easier to store in the database than the choice names themselves. Like I mentioned above, however, this doesn’t actually do anything. We’ll create a set of helpers to interface with SQLite that leverages this contract now.

In the leftmost pane, right click on `com.yournamehere.turnip` and add a new package named `helpers`. Now, right click that package and add a new Java class called `DBHelper`. This will be where we add all of our code to save and retrieve data from the database. Now’s a good time to mention that SQLite comes standard on Android phones and is the recommended data storage solution by the Android development team at Google. This means that the setup for this is actually quite easy.

Don’t get overwhelmed by this next file, it’s the “meat & potatoes” of this session and we’ll cover it more in depth than we did the contract.

```java
package com.bradcypert.turnip.helpers;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import com.bradcypert.turnip.contracts.TaskContract;

public class DBHelper extends SQLiteOpenHelper {
    public static final int DATABASE_VERSION = 1;
    public static final String DATABASE_NAME = "Turnip.db";

    private static final String SQL_CREATE_TASKS=
            "CREATE TABLE " + TaskContract.TaskTable.TABLE_NAME
                    + "("
                    + TaskContract.TaskTable._ID + " INTEGER PRIMARY KEY, "
                    + TaskContract.TaskTable.COLUMN_NAME + " TEXT NOT NULL, "
                    + TaskContract.TaskTable.COLUMN_FREQUENCY + " INT NOT NULL DEFAULT 0, "
                    + TaskContract.TaskTable.COLUMN_NOTIFY + " INT NOT NULL DEFAULT 0, "
                    + TaskContract.TaskTable.COLUMN_TIMES_COMPLETED_PER + " INT NOT NULL DEFAULT 0, "
                    + TaskContract.TaskTable.COLUMN_TOTAL_TIMES_COMPLETED + " INT NOT NULL DEFAULT 0, "
                    + TaskContract.TaskTable.COLUMN_TIMES_REQUIRED_PER + " INT NOT NULL DEFAULT 1"
                    + ")";

    private static final String SQL_INITIAL_TASK=
            "INSERT INTO " + TaskContract.TaskTable.TABLE_NAME
            + "(" + TaskContract.TaskTable.COLUMN_NAME+")"
            + " VALUES ('Explore Turnip')";

    public DBHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    public long addTask(String name, TaskContract.Frequency frequency, TaskContract.Notify notify) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues values = new ContentValues();

        values.put(TaskContract.TaskTable.COLUMN_NAME, name);
        values.put(TaskContract.TaskTable.COLUMN_FREQUENCY, frequency.value);
        values.put(TaskContract.TaskTable.COLUMN_NOTIFY, notify.value);

        long newRowId;

        newRowId = db.insert(TaskContract.TaskTable.TABLE_NAME, null, values);

        return newRowId;
    }

    public boolean removeTask(int id) {
        SQLiteDatabase db = getWritableDatabase();
        try {
            db.delete(TaskContract.TaskTable.TABLE_NAME, TaskContract.TaskTable._ID+"="+id, null);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean bumpTask(int id) {
        SQLiteDatabase db = getWritableDatabase();
        try {
            db.execSQL("UPDATE " + TaskContract.TaskTable.TABLE_NAME + " SET "
                    + TaskContract.TaskTable.COLUMN_TOTAL_TIMES_COMPLETED + " = "
                    + TaskContract.TaskTable.COLUMN_TOTAL_TIMES_COMPLETED + "+1"
                    + " WHERE " + TaskContract.TaskTable._ID + " = " + id);

            db.execSQL("UPDATE " + TaskContract.TaskTable.TABLE_NAME + " SET "
                    + TaskContract.TaskTable.COLUMN_TIMES_COMPLETED_PER + " = "
                    + TaskContract.TaskTable.COLUMN_TIMES_COMPLETED_PER + "+1"
                    + " WHERE " + TaskContract.TaskTable._ID + " = " + id);

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Cursor getTasks() {
        SQLiteDatabase db = getReadableDatabase();
        String[] projection = {
                TaskContract.TaskTable._ID,
                TaskContract.TaskTable.COLUMN_NAME,
                TaskContract.TaskTable.COLUMN_NOTIFY,
                TaskContract.TaskTable.COLUMN_FREQUENCY,
                TaskContract.TaskTable.COLUMN_TIMES_REQUIRED_PER,
                TaskContract.TaskTable.COLUMN_TIMES_COMPLETED_PER,
                TaskContract.TaskTable.COLUMN_TOTAL_TIMES_COMPLETED
        };

        String sortOrder = TaskContract.TaskTable.COLUMN_FREQUENCY + " DESC";

        return db.query(
                TaskContract.TaskTable.TABLE_NAME,
                projection,
                null,
                null,
                null,
                null,
                sortOrder
                );
    }

    @Override
    public void onCreate(SQLiteDatabase sqLiteDatabase) {
        sqLiteDatabase.execSQL(SQL_CREATE_TASKS);
        sqLiteDatabase.execSQL(SQL_INITIAL_TASK);

    }

    @Override
    public void onUpgrade(SQLiteDatabase sqLiteDatabase, int i, int i1) {

    }
}

```

Wow, that’s a lot of code! First thing first – take note of the package name and import declarations. `ContentValues` gives a simple way to insert new values into our database, `Context` is used everywhere in your application, and it provides information about the context the application is running in. In the future, I’ll do a separate post explaining concepts, but for now, just know that it’s sometimes needed and is passed in from activities. `Cursor` is an interesting import. When we retrieve data from our database, we actually don’t get the back – we get a cursor pointing to the data in our database. This is an extremely flexible way to interface with our data and we’ll use this Cursor a lot in the next post. `SQLiteOpenDatabase` and `SQLiteOpenHelpers` will allow us to easily leverage SQLite in our application.

Now is a good time to mention that you probably have more than 1 application on your Android phone. Several of these applications probably use SQLite as well. Each application gets it’s own SQLite instance so you don’t have to worry about some other application overwriting your data. SQLiteOpenDatabase takes care of all of this for us.

After our imports, we create a new class called DBHelper that extends SQLiteOpenHelper. It’s extremely important to make sure that you extend SQLiteOpenHelper as this is what makes sure that `onCreate` is called when we don’t have a database and `onUpgrade` is called when we want to upgrade our database’s structure. The next part is rather straightforward, we set the initial database version number to `1` and give it the name `Turnip.db`.

We then create a string (or block of text) called `SQL_CREATE_TASKS` that leverages our contract to create a string of SQL commands. This string of SQL commands is specifically used to create the main table for us in our database. Remember: Tables are used to organize data within a database. `SQL_INITIAL_TASK` is similar, but this string is actually used later to create our first entry in the table. This entry simply creates a task called “Explore Turnip” with a frequency of “Once”.

Next, we have our constructor for DBHelper. Notice that this takes a context that we mentioned earlier – this context is used to ensure that all of our DB actions are in the scope of our application. We’re also calling the super constructor with the context, database name, and database version as well. This super constructor will decide if we need to call `onCreate` or `onUpgrade` as well. Finally, we get into the fun stuff in the rest of this file.

#### Adding a Task

```java
    public long addTask(String name, TaskContract.Frequency frequency, TaskContract.Notify notify) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues values = new ContentValues();

        values.put(TaskContract.TaskTable.COLUMN_NAME, name);
        values.put(TaskContract.TaskTable.COLUMN_FREQUENCY, frequency.value);
        values.put(TaskContract.TaskTable.COLUMN_NOTIFY, notify.value);

        long newRowId;

        newRowId = db.insert(TaskContract.TaskTable.TABLE_NAME, null, values);

        return newRowId;
    }

```

We create a method named `addTask` that takes in a name, frequency, and notification setting and is used to create a task within our database. In that method, `getWritableDatabase` is provided by the SQLiteOpenHelper class that we extended and provides us with an interface to the database. We then create a `ContentValues` object and and pair the values with the appropriate column names via the `put` method. Finally, we can use the database that we got from `getWritibleDatabase` to write those content values into a row in the database! At the end of this method, we return the row id to let our code have access to which row was updated.

#### Deleting a Task

```java
    public boolean removeTask(int id) {
        SQLiteDatabase db = getWritableDatabase();
        try {
            db.delete(TaskContract.TaskTable.TABLE_NAME, TaskContract.TaskTable._ID+"="+id, null);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

```

Next, we do something similar, except we’re setting up a delete this time. Like before, we get the writable database but we run a delete used the table name against the ID of the row to be deleted. There’s a risk that the row ID may not exist, so we have to handle that exception via a catch block.

#### “Bumping” a Task

```java
    public boolean bumpTask(int id) {
        SQLiteDatabase db = getWritableDatabase();
        try {
            db.execSQL("UPDATE " + TaskContract.TaskTable.TABLE_NAME + " SET "
                    + TaskContract.TaskTable.COLUMN_TOTAL_TIMES_COMPLETED + " = "
                    + TaskContract.TaskTable.COLUMN_TOTAL_TIMES_COMPLETED + "+1"
                    + " WHERE " + TaskContract.TaskTable._ID + " = " + id);

            db.execSQL("UPDATE " + TaskContract.TaskTable.TABLE_NAME + " SET "
                    + TaskContract.TaskTable.COLUMN_TIMES_COMPLETED_PER + " = "
                    + TaskContract.TaskTable.COLUMN_TIMES_COMPLETED_PER + "+1"
                    + " WHERE " + TaskContract.TaskTable._ID + " = " + id);

            return true;
        } catch (Exception e) {
            return false;
        }
    }

```

In the above example, we’re updating a task’s total number of times completed and the number of times completed per frequency. This is effectively how a user will “Check” a task as complete for the day/week/month. Yet again, we’re getting the writeable database, and building a SQL statement (leveraging the contract we wrote earlier) to update the entry in the task table. Just like the delete, there’s a chance that the row may not exist so we have to catch that exception and handle it. For now, we’ll just return false.

#### Getting all the Tasks

```java
    public Cursor getTasks() {
        SQLiteDatabase db = getReadableDatabase();
        String[] projection = {
                TaskContract.TaskTable._ID,
                TaskContract.TaskTable.COLUMN_NAME,
                TaskContract.TaskTable.COLUMN_NOTIFY,
                TaskContract.TaskTable.COLUMN_FREQUENCY,
                TaskContract.TaskTable.COLUMN_TIMES_REQUIRED_PER,
                TaskContract.TaskTable.COLUMN_TIMES_COMPLETED_PER,
                TaskContract.TaskTable.COLUMN_TOTAL_TIMES_COMPLETED
        };

        String sortOrder = TaskContract.TaskTable.COLUMN_FREQUENCY + " DESC";

        return db.query(
                TaskContract.TaskTable.TABLE_NAME,
                projection,
                null,
                null,
                null,
                null,
                sortOrder
               );
    }

```

This method is particularly cool. It may look a little overwhelming, but we’re essentially just querying the database for all the tasks. You’ll notice this time we’re only getting a readable database, instead of a writeable one. That’s because we don’t need to add or modify any data in the database and care only to read what’s been stored. We also setup something called a “Projection”, which allows us to decide which columns of data should be returned. Remember: **It’s important to note that this method actually doesn’t return data.** Instead, it returns an iterable cursor that points to the data.

#### OnCreate & OnUpgrade

```java
    @Override
    public void onCreate(SQLiteDatabase sqLiteDatabase) {
        sqLiteDatabase.execSQL(SQL_CREATE_TASKS);
        sqLiteDatabase.execSQL(SQL_INITIAL_TASK);
    }

    @Override
    public void onUpgrade(SQLiteDatabase sqLiteDatabase, int i, int i1) {}

```

Both of these methods are very straightforward. First, we’re overriding the implementation provided by `SQLiteOpenHelper` (remember we’re extending that in our class). Secondly, `onCreate` simply uses some of the SQL we created at the top of our class to create the `tasks` table in our database, then add our first task (“Explore Turnip”). `onUpgrade` is called anytime that the version number of the database is changed and the database is accessed. Although we’re not doing anything in our `onUpgrade`, I wanted to add it to this example to show you how you would use it as it’s a very powerful method. You would add your own SQL to restructure your database, drop your entire database (start from scratch), or add new tasks to inform people of new features. It’s very powerful and solves a very difficult problem that developers often have.

#### Conclusion

And that’s it! You’ve added a database to your application, and although it’s not doing anything yet, it’s the foundation we’ll need to get our views to store data and show that data back to the user. In the next post, we’ll cover the RecyclerView, ListView, List Adapters and Activities. The next post will be a big one, so be sure that you’ve done all the previous steps to stay on track!

Has this post been helpful to you? Let me know below!
