---
title: "A Beginner's Guide to Java Enums"
date: 2019-08-05
status: publish
permalink: /a-beginners-guide-to-java-enums
author: "Brad Cypert"
excerpt: ""
type: blog
id: 34
images:
  - books-coding-couch-1181298.jpg
category:
  - Java
tags:
  - enums
  - java
description: "A Java Enum is a type that has a predefined set of constants, properties and methods that can be used to write expressive and clean code."
versions:
  java: jdk8
---



An Enum in Java is a special data type that encompasses a set of predefined constants. When setting a variable of that Enum type, you have to use one of the constants that you define for it. A great example is the compass:

```java
public enum Compass {
  NORTH, EAST, SOUTH, WEST;
}

Compass direction = Compass.NORTH;
```

In the above example, we create a new enum and it’s predefined set of constants. Then we create a variable of that enum type, and assign it to one of the constants. Keep in mind that we can only set our direction to `Compass.NORTH`, `Compass.SOUTH`, `Compass.EAST` , `Compass.WEST` or `null`. If we wanted to set our direction to an inter-cardinal direction, we’ll have to add them to our enum, like so:

```java
public enum Compass {
  NORTH, EAST, SOUTH, WEST, NORTHEAST, NORTHWEST, SOUTHEAST, SOUTHWEST;
}

```

<HeadsUp title="Why are the values uppercase?">
  Great question! It’s convention in Java to name all constants with an
  uppercase value. Enum values are just constants, so this is no exception!
</HeadsUp>

Why would you use enums? Aren’t strings more flexible? Sure. You could use a ton of different alternatives to enums, but enums help with two things:

1. Expressiveness
2. Expected values for people who consume your code

Let’s see an example of both in action.

```java
class Main {
  public enum Compass {
    NORTH, EAST, SOUTH, WEST;
  }

  public void decribeDirection(Compass direction) {
    switch(direction) {
      case Compass.NORTH:
        System.out.println("Moss grows this way.")
        break;
      case Compass.SOUTH:
        System.out.println("You feel the breeze of the ocean from this direction");
        break;
      case Compass.EAST:
        System.out.println("The sun rises from this direction");
        break;
      case Compass.WEST:
        System.out.println("The sun sets this direction");
        break;
    }
  }

  public static void main(string[] args) {
    Compass direction = Compass.NORTH;
    describeDirection(direction);
  }
}
```

The expressiveness can be seen clearly in the code via the switch statement. Because of Java’s compiler, the switch statement will expect us to define a behavior for each possible permutation of the Compass type, which can help prevent bugs. Creating expected values for consumers of our code can be seen here as well. By setting a specific list of constants in our enum, consumers know that we only support the four cardinal directions. If we were to use strings, it could seem as if we supported anything, which is certainly not true!

## Using a Java Enum as a Class

A Java Enum can also be an [entire class](https://docs.oracle.com/javase/8/docs/api/java/lang/Class.html). This means those enum can have properties and even methods associated with them. So the question becomes, when would I use this? And what a great question that is!

Let’s assume we’re working for a company that produces video-game controllers and you’re responsible for the two joysticks on the controller. You know that to keep up with the competition, JoyCo.co (thats the company you now fictionally work for) needs to have variable levels of sensitivity on those joysticks. You might default to a class for this, but you lean on your new found knowledge of enums and decide to create an enum instead.

```java
public enum Compass {
  NORTH(0), EAST(90), SOUTH(180), WEST(270);

  private final double degrees;
  Compass(double degrees) {
    this.degrees = degrees;
  }

  public double getDegrees() {
    return this.degrees;
  }

  public static fromDegrees(double degrees) {
    switch (degrees) {
      case 0:
      return Compass.NORTH;
      case 90:
      return Compass.EAST;
      case 180:
      return Compass.SOUTH;
      case 270:
      return Compass.WEST;
      default: // its not 0, 90, 180, or 270
      return Compass.NORTH; // reset the compass
    }
  }
}

  public enum Direction {
  LEFT, RIGHT;
  }

  public enum Joystick {
    LEFT(100), // 100 sensitivity turns 50% of the compass
    RIGHT(50); // 50 sensitivity turns 25% of the compass

    private final double sensitivity; // as a percent

    Joystick(double sensitivity) {
      this.sensitivity = sensitivity;
    }

  // rotate the compass by sensitivity rating, 100% is a 180deg turn.
  Compass rotate(Compass facing, Direction direction) {
    double degrees = facing.getDegrees();
    double maxDegrees = 360;
    double sensitivityMultiplier = this.sensitivity / 2;
    double newDegrees;
    if (direction == Direction.RIGHT) {
      newDegrees = facing.getDegrees() + (maxDegrees _ sensitivityMultiplier)
    } else {
      newDegrees = facing.getDegrees() - (maxDegrees _ sensitivityMultiplier)
    }

    if (newDegrees < 0) {
      return Compass.fromDegrees(newDegrees + maxDegrees);
    } else if (newDegrees > maxDegrees) {
      return Compass.fromDegrees(newDegrees - maxDegrees);
    }

  }
}

```

Alright! So that example is a little bigger than I hoped, but I didn’t want to come up with a contrived example. In fact, this example works out well simply because it shows several different ways to use Enums! Our simplest example is the `Direction` enum, with only two constant options. Our `Compass` uses some basic parameters and methods while our `Joystick` enum takes everything we’ve learned and throws it into all together. The `Joystick` has complex methods, a property and more! In fact, the `rotate` method even takes in and returns a completely different type of enum.

If you’d like to learn more about the Java programming language, [you can find more of my topics on Oracle’s language here](/tags/java).
