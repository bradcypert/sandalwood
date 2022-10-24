---
title: "Creating a Java Bean from a Scala Class"
date: 2018-03-09
status: publish
permalink: /creating-a-java-bean-from-a-scala-class
author: "Brad Cypert"
excerpt: ""
type: blog
id: 275
category:
  - Scala
tags:
  - Scala
description: "Creating a Java Bean from a Scala Class is slightly tricky as Scala classes don't adhere to the Bean definition, but with a little work we can make Scala classes into Java beans."
---

Sometimes, you may find yourself in a situation (like using Scala with Spring) where you need to generate a Java bean but would like to do that in Scala. By default, Scala classes don’t adhere to the requirements of the Bean definition, namely autogenerating getters and setters. Thankfully, there is a **BeanProperty** decorator that can be used in conjunction with the constructor definition to help adhere to the Bean specification.

You can start using it by importing the BeanProperty like so:

```scala
import scala.reflect.BeanProperty
```

Then in your class definition, you can use the decorator on your member fields to autogenerate the appropriate getters and setters to adhere to the Bean specification.

```scala
case class Car(@BeanProperty var color: ColorDefinition,
               @BeanProperty var size: CarSize,
               @BeanProperty var owner: String) {}
```

Alternatively, you can annotate the class fields instead of the constructor fields.

```scala
class Car {
  @BeanProperty var color: ColorDefinition = null
  @BeanProperty var size: CarSize = CarSize.SEDAN
  @BeanProperty var owner: String = null
}
```

Either of theses styles of applying the decorators will work for you!
