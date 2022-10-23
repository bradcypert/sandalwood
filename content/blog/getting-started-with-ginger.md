---
title: "Building RESTful APIs with Ginger, H2, and Java 8"
date: 2015-10-01
status: publish
permalink: /getting-started-with-ginger
author: "Brad Cypert"
excerpt: ""
type: blog
id: 20
category:
  - Java
tags:
  - api
  - ginger
  - h2
  - java
  - microservice
  - rest
  - restful
post_format: []
description:
  - "Learn how to build an API in 25 minutes with Ginger, H2, and Java 8!"
_yoast_wpseo_title:
  - "Building RESTful APIs with Ginger, H2, and Java 8"
---

Recently, I started writing a few RESTful services in Java Spark. I found a few recurring themes and decided to extract them out into a layer ontop of Spark to make it even easier to build a RESTful service from the ground up. This project is called Ginger and I’ll show you how to create a RESTful service using the Ginger framework.

If you get stuck, the completed source code can be found [here](https://github.com/bradcypert/GingerSampleApp).

#### Things to know

Ginger is built heavily ontop of Spark. As of recently, Spark only runs on Java 1.8+, therefore Ginger also runs on Java 1.8+.

This tutorial assumes you’re building with Gradle. If you’re building with Maven, you’re still able to use Ginger, you’ll just have to transcode the Gradle files to the appropriate Maven definitions.

This tutorial also uses H2 database as it’s a bit simpler than setting up Postgres or MySQL and that piece isn’t relevant to Ginger.

#### Let’s start

First – Let’s add Ginger to our dependencies in build.gradle.

**build.gradle**

```gradle
group 'com.bradcypert'
version '1.0-SNAPSHOT'

apply plugin: 'java'

sourceCompatibility = 1.8

repositories {
    mavenCentral()
}

dependencies {
    compile 'com.bradcypert:Ginger:1.1.2'
    compile 'com.h2database:h2:1.4.189'
}

```

Nothing crazy here, especially if you’re familiar with Gradle. Just notice that we’ve added `compile 'com.bradcypert:Ginger:1.1.2'` to the `dependencies` map.

You can pull down the dependency with `gradle build`, so if you’re using an IDE like Intellij or Eclipse, it should recognize the library on the classpath and not throw a fit when you use Ginger classes.

#### The Ginger Way

Awesome. We’ve got our dependency downloaded, and we’re ready to quickly build a RESTful service. To make a simple `Todo` service, we’re going to need to create a few classes.

Since we’re using H2, we’re going to make a very basic helper class to create our DB and execute queries (_this is **NOT** Ginger specific. Just a very generic class that executes queries and returns results_).  
**src/main/java/H2Sample.java**

```java
import java.sql.*;

  import org.h2.tools.DeleteDbFiles;

  public class H2Sample {
     static Connection conn;
     static Statement statement;

      public static void createDB() throws ClassNotFoundException, SQLException {
          dropDB();
          createConnection();
          addTestDataToDB();
       }

    /*
            SQL Methods below. Not Ginger Related. Remember, none of this file is Ginger related.
     */

      public static String fetchById(String id) {
          ResultSet rs;
          String json = "{";
          try{
              rs = H2Sample.statement.executeQuery("select * from test where id = " + id);
              while (rs.next()) {
                  json+=""id":""+rs.getString("id")+""";
                  json+=""name":""+rs.getString("name")+""";
                  json+=","completed":"+rs.getBoolean("completed");
              }
              json+="}";
              return json;
          } catch (Exception e) {
              return "{"error": "Fetch By ID Failed."}";
          }
      }

      public static String fetchAll() {
          ResultSet rs;
          String json = "[";
          try{
              rs = H2Sample.statement.executeQuery("select * from test");
              while (rs.next()) {
                  json+="{";
                  json+=""id":""+rs.getString("id")+""";
                  json+=""name":""+rs.getString("name")+""";
                  json+=","completed":"+rs.getBoolean("completed");
                  json+="},";
              }
              json = json.substring(0, json.length()-1);
              json+="]";
              return json;
          } catch (Exception e) {
              return "{"error": "Fetch All Failed."}";
          }
      }

      public static String save(String name, boolean completed) {
          try {
              String query = "insert into test (name, completed) values('"+name+"', "+completed+")";
              System.out.println(query);
              H2Sample.statement.execute(query);
              return "{"save": true}";
          } catch (Exception e) {
              e.printStackTrace();
              return "{"error": "Save Failed."}";
          }
      }

      public static String deleteById(String id) {
          try{
              H2Sample.statement.execute("delete from test where id = " + id);
              return "{"delete": true}";
          } catch (Exception e) {
              return "{"error": "Fetch By ID Failed."}";
          }
      }






  /*
       Functions to create connection, add some sample data, close connection, and drop the DB.
  */
      private static void closeConnection() throws SQLException {
          statement.close();
          conn.close();
      }

      private static void addTestDataToDB() throws SQLException {
          statement.execute("create table test(id int auto_increment, name varchar(255), completed boolean)");
          statement.execute("insert into test values(1, 'Work Out', false)");
      }

      private static void createConnection() throws ClassNotFoundException, SQLException {
          Class.forName("org.h2.Driver");
          conn = DriverManager.getConnection("jdbc:h2:~/test");
          statement = conn.createStatement();
      }

      private static void dropDB() {
          DeleteDbFiles.execute("~", "test", true);
      }
  }

```

Just want to mention again, this is all database related (Non-Ginger related) code. Our Ginger service is going to call this class to read and update db records.

That being said, let’s define our `Model` and make it reach out to our H2Sample class.

**src/main/java/Todo.java**

```java
  import com.bradcypert.ginger.*;

  @Methods
  public class Todo implements Model {
      @Exposed public String name;
      @Exposed public boolean completed;

      @Override
      public String save(PropertyMap map) {
          boolean completed = map.get("completed").toString().toLowerCase().equals("true");
          String name = map.get("name").toString();
          return H2Sample.save(name, completed);
      }

      @Override
      public String fetch(String id) {
          return H2Sample.fetchById(id);
      }

      @Override
      public String fetchAll() {
          return H2Sample.fetchAll();
      }

      @Override
      public String remove(String id) {
          return H2Sample.deleteById(id);
      }
  }

```

Let’s go over this line by line.  
1\. This line simply imports all the Ginger classes. As Ginger is very small, you basically need to import them all.  
3\. `@Methods` is an annotation used to specify the HTTP verbs you want to support. `@Methods` will support `GET`, `POST`, and `DELETE`. If you’d only like to support `GET` and `POST`, you can use `@Methods={GET, POST}`  
4\. Creating a class that implements `Ginger.Model`. Your class name maps directly to your api URL. For example, `Todo` maps to `/todo/`. The Model is an interface that helps you implemented required Ginger methods.  
5\. We define a member variable with `@Exposed`. This annotation requires a variable with this name to be passed in on a `POST` request.  
9-13. We define a method to override the `save` method from the Model. This method returns a String (json output) and is what is rendered as the response. Save is mapped to a `POST` request. Save is passed in a propertyMap, which is just a hashmap representation of parameters passed in on the request.

The next 3 methods are the same concept as `save`, only that they call different H2 methods, and map to different routes. A full mapping of routes are as follows:

```
  GET    /todo/             => fetchAll()
  GET    /todo/1            => fetch(1)
  POST   /todo/?name=foo    => save({name: foo})
  DELETE /todo/1            => remove(1);

```

**NOTE:** You can also use body parameters instead of query params in the `POST`.

There is one final thing that we need to do to run our application. We need a main method to run.

Let’s create a new class, and I’ll call it Handler.java. Make note – This is where Ginger shines.

**src/main/java/Handler.java**

```java
import com.bradcypert.ginger.Resource;

  public class Handler {
      static Resource todos; //define Ginger Resource
      public static void main(String... args) {

          //Some H2 jazz.
          try{
              H2Sample.createDB();
          } catch (Exception e) {
              System.out.println("DONT YOU DIE ON ME, H2!");
          }

          //Heres where the Ginger starts.
          todos = new Resource(Todo.class); //builds Resource
          todos.setBasePath("/api/v1");  // /api/v1/todo/ instead of /todo/
          todos.generateRoutes(); //creates all of our routes
      }
  }

```

And that’s it. By default, the server runs on localhost:4567, so if you’ve copied the code verbatim, you can go to localhost:/4567/api/v1/todo/ and you should see `{id:1, name: "Work Out", completed: false}`.

Congratulations! You just built your first Ginger api.
