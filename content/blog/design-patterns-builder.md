---
title: "The Builder Design Pattern"
date: 2018-04-24
status: publish
permalink: /design-patterns-builder
author: "Brad Cypert"
type: blog
id: 335
category:
  - "Design Patterns"
  - Java
tags:
  - Builder
  - "Design Patterns"
  - java
description:
  - "The Builder Design Pattern is a clean solution to the multiple constructor problem. As your code grows, optional constructor parameters clutter your classes."
---

Welcome back. I’m writing today to talk about something that I think is pretty cool — design patterns in code! Specifically, we’re going to cover the builder pattern, which I find myself using all the time when writing Android applications and sometimes when writing plain Java applications. Let’s setup a scenario: You have a class that has a constructor. You call it a `User` class. The constructor for this class takes in a `String firstName` and a `String lastName`. You write some awesome logic in this class and use it everywhere. You new it up all over your codebase because it’s just **that** good. You kick back and enjoy the good life, until you have another developer walk over to you and say _“Oh, hey. We need to add email address to the user class. And we’ll probably want to add phone number and mailing address, too.”_ Crap.

Hopefully you’ve found the problem. You’ve littered your codebase with `new User(...)`‘s and now you need to add new constructor parameters to the class. Let’s look at a couple of ways to solve this:

### Multi Constructor

Hold up, Brad. This isn’t that difficult. Here’s what we’ll do. We can modify our User class to look like this:

```java
class User {
  private String firstName;
  private String lastName;
  private String email;
  private String phoneNumber;
  private MailingAddress address;

  public User(String firstName, String lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = null;
    this.phoneNumber = null;
    this.address = null;
  }

  public User(String firstName, String lastName, String email, String phoneNumber, MailingAddress address) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
  }
}
```

Alright, that’s an option. You might even smugly drop an `@deprecated` on the lighter constructor there. Let’s lay out the pros and cons of this approach.

<table align="center" border="1">
  <thead>
    <tr>
      <th>Pros</th>
      <th>Cons</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">It works</td>
      <td align="center">We introduce null references</td>
    </tr>
    <tr>
      <td align="center"></td>
      <td align="center">We have to maintain multiple constructors</td>
    </tr>
    <tr>
      <td align="center"></td>
      <td align="center">
        There may be cases where we just need the first, last, and email.
      </td>
    </tr>
  </tbody>
</table>

As you can see, there’s not a lot going for this pattern. Let’s evaluate another pattern to see if there’s a better alternative.

### Empty Constructor Bean

If you’re familiar with the Bean pattern, bear with me. This is a slight deviation from the full definition. We’ll create a class using an empty constructor and an aggressive amount of getters and setters to handle setting up the instance properly. Once we’ve finished, you’ll be able to use it like so:

```java
User user = new User();
user.setFirstName("Brad")
user.setLastName("Cypert")
user.setEmailAddress("brad{.}cypert{@}gmail{.}com") // feel free to reach out
user.setPhoneNumber("111-111-1111")
user.setMailingAddress(new MailingAddress(...))
```

Let’s go ahead and define that class.

```java
class User {
  private String firstName;
  private String lastName;
  private String email;
  private String phoneNumber;
  private MailingAddress address;

  public User() {}

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public void setPhoneNumber(String phone) {
    this.phoneNumber = phone;
  }

  public void setMailingAddress(MailingAddress address) {
    this.address = address;
  }

  ... // all of the respective getters as well. Omitting for brevity.
}
```

This isn’t bad… I’d argue that I personally prefer it over the multi-constructor pattern, but I think the only reason I prefer it is that it reminds me of the builder pattern (which we’re finally about to cover). Let’s tackle the pros and cons of this approach.

<table align="center" border="1">
  <thead>
    <tr>
      <th>Pros</th>
      <th>Cons</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">It works</td>
      <td align="center">`new User()` doesn’t give us a useful object</td>
    </tr>
    <tr>
      <td align="center">
        We can generate users using only the properties we need.
      </td>
      <td align="center">
        You still need to call every setter\* to set the object up fully
      </td>
    </tr>
    <tr>
      <td align="center"></td>
      <td align="center">The user object is not thread-safe.</td>
    </tr>
  </tbody>
</table>

I put an asterisk next to _You still need to call every setter_ because you can modify the constructor to setup default values on construction. The main issue with this pattern is that, despite having a user object, it’s not setup for use and there’s no real way to determine how many properties any given user object actually has had assigned. Let’s talk about one more pattern.

### Builder Pattern

I’m personally a big fan of the builder pattern. The main reason that I enjoy it is that it encapsulates the logic for building an object away from the actual object, while still offering the flexibility of the Empty Constructor Bean pattern mentioned above. Without further ado, here’s how you’d use the builder pattern.

```java
new User.Builder()
 .setFirstName("Brad")
 .setLastName("Cypert")
 .setPhoneNumber("111-111-1111")
 .build(); //implied defaults for address and email
```

Here’s how we can implement the builder pattern in Java:

```java
class User {
  private String firstName;
  private String lastName;
  private String email;
  private String phoneNumber;
  private MailingAddress address;

  public User(String firstName, String lastName, String email, String phoneNumber, MailingAddress address) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
  }

  // This is static so we can call it without needing to create a user object, ie: User.Builder()
  public static class Builder {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private MailingAddress address;

    public Builder(String firstName, String lastName) {
      this.firstName = firstName;
      this.lastName = lastName;
      // We could provide an empty constructor, but (for us) every user
      // needs a first and last name so we make them a part of the builder constructor
    }

    public Builder setEmail(String email) {
      this.email = email;
      return this;
    }

    public Builder setPhoneNumber(String phone) {
      this.phoneNumber = phone;
      return this;
    }

    public Builder setEmail(String email) {
      this.email = email;
      return this;
    }

    public User build() {
      return new User(this.firstName,
                      this.lastName,
                      this.email,
                      this.phoneNumber,
                      this.address);
    }

  }
}
```

And we can use the above example, with our defaults like so:

```java
new User.Builder("Brad", "Cypert")
 .setPhoneNumber("111-111-1111")
 .build(); // implied defaults for address and email
```

Some things you’ll likely notice — The `Builder` class is nested within the `User` class. There’s no requirement for this, just a preference that I’ve found over the years. Additionally, all of our `set` methods on the builder are returning `this`. That allows us to chain the set methods as seen in the above code example of how to call the builder pattern. Let’s wrap up with Pros and Cons:

<table align="center" border="1">
  <thead>
    <tr>
      <th>Pros</th>
      <th>Cons</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">It works</td>
      <td align="center">It’s a lot of code.</td>
    </tr>
    <tr>
      <td align="center">The generated user objects are thread-safe</td>
      <td align="center">
        We have to change our ideology from newing up Users to building Users.
      </td>
    </tr>
    <tr>
      <td align="center">
        We can set just the properties we need and the build method can handle
        defaults.
      </td>
      <td align="center"></td>
    </tr>
  </tbody>
</table>

The builder pattern often is the target of a few maintainability concerns, but the most prevalent one that I’ve found is that developers often feel like someone might add properties to the class being built but not adding the appropriate logic to the builder. To help prevent this, I nest the builders so it’s obvious that this class has a builder associated with it. Additionally, if you’re not `new`ing up the object that should be built, you’ll quickly notice that the builder is missing the respective logic when you try to call `setMyFancyNewProperty()` and your IDE or Javac starts yelling at you.

Anyways, I hope you enjoyed the dive into the builder pattern. It’s a pattern I use a lot and hopefully you can too!
