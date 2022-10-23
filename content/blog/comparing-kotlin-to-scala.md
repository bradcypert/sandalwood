---
title: "Comparing Kotlin to Scala"
date: 2019-03-05
status: publish
permalink: /comparing-kotlin-to-scala
author: "Brad Cypert"
excerpt: ""
type: blog
id: 1000
thumbnail: /arm-wrestling-bar-bet-4417.jpg
category:
  - kotlin
  - Scala
tags:
  - kotlin
  - meta
  - Scala
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_primary_category:
  - "104"
_yoast_wpseo_content_score:
  - "30"
_yoast_wpseo_focuskw:
  - "Kotlin to Scala"
_yoast_wpseo_linkdex:
  - "69"
description:
  - "Comparing Kotlin to Scala is a tricky challenge. They both are alternatives to Java, however, both have unique advantages."
---



Kotlin to Scala. Scala to Kotlin. Two contenders for my heart. In the left corner, we have the new comer! Weighing in at just over 1.2MB — The Ambassador of Android: Kotlin! And in the right corner, we have the long-time favorite, weighing in at just over 5.3MB — The Archduke of Akka, The Sultan of Spark: Scala!

If you’ve made it this far through my silliness, you’re likely comparing Kotlin to Scala for your next project. There’s definitely some key takeaways from the above paragraph that may influence your decision. However there’s more to each language than I could dare try to squeeze into an introductory paragraph. The rest of this post will cover each of these languages in comparison to:

- General Use Case for Each Language
- Impact on the shippable .jar
- Ease of Learning
- Idiomatic Code
- Community
- Libraries & Frameworks
- Build Tools & Other Tooling
- Job Postings (Maybe you’re looking to get a job, or will want to hire more people to work on this project)

Let’s get to it!

## General Use Case

Both Kotlin and Scala provide an alternative to Java on the JVM. However, both of these languages have a unique use-case that the other does not. Kotlin is an officially supported language for Android Development. Scala is considered a first-class citizen for Apache Spark.

<HeadsUp title="What's Apache Spark?">
  I talk about Android a lot, and it’s relatively popular. So much that you
  probably already know what it is. You may not be as familiar with Apache
  Spark, however. Apache Spark is a unified analytics engine for large-scale
  data processing. [You can find more about Apache Spark on their website
  here.](https://spark.apache.org/)
</HeadsUp>

Despite these unique advantages for each language, you can use the competitor
language in that domain as well! Apache Spark supports Java (and you can use
Kotlin anywhere that you would normally use Java) and Android Apps can be
developed (albeit painfully, in my experience) using Scala through a different
build-chain. That being said, these are called out as advantages due to the
first-class or official support for these languages.

Both Kotlin and Scala have “JavaScript” presence as well. Kotlin has the ability to compile down to JavaScript directly, and the Scala community has put together [Scala.js](https://www.scala-js.org/).

While Scala and Kotlin both run on the JVM, both languages are also pushing towards “native” support. When this is achieved, you’ll be able to compile either of these languages to run without the JVM. While I haven’t invested a ton of time in either of these languages as a native solution (I actually like the JVM), It seems to me that Kotlin may have a more difficult time with this than Scala. This is due to the fact that Kotlin’s standard library is mostly extension functions built on top of existing Java interfaces (but we’ll get more into that in a moment).

## Impact on the .jar

One of the benefits of Kotlin being built on top of Java is that it’s standard library is extremely lightweight. As mentioned above, the .jar on my MacBook weighed in at only 1.2MB. Scala, on the other hand, doesn’t extend Java the way that Kotlin does. It offers it’s own solution to the constraints imposed by the JVM and is a much bigger .jar (albeit still relatively small in the grand scheme of things).

At the end of the day, I’ve ran both a Kotlin API and a Scala API on the \$5/month
Digital Ocean droplet with no issues. The size of the .jar seems to be negligible
for most developers, but is definitely worth mentioning if you’re targeting older
or lower-performing devices.

## Ease of Learning

Arguably one of the most important parts of learning any new language — How easy is it? Are there resources available to make this easier?

Kotlin is a relatively new language (in terms of popularity), but does have a few great resources already available to it. [Big Nerd Ranch’s: Kotlin Programming Book](https://www.bignerdranch.com/books/kotlin-programming/) by [Josh Skeen](http://joshskeen.com/) is a fantastic introductory into Kotlin. If you’re into Android Development, [Google has started offering Android tutorials and documentation in Kotlin](https://developer.android.com/kotlin) as well. Finally, and arguably the best way to learn Kotlin (if you already know Java) is to [use Intellij’s “Convert Java to Kotlin” feature](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html). You can use this feature with a few lines of code or class files that span thousands of lines. It’s a great way to take something you’re familiar with in Java, and relearn it in Kotlin since only the syntax is changing.

Scala, on the other hand, has been around for quite a while. If video tutorials are your sort of thing, Coursera has a [free course on Scala by Martin Odersky](https://www.coursera.org/learn/progfun1) (the lead designer of Scala). He’s also published a book titled [Programming in Scala](https://www.artima.com/shop/programming_in_scala_3ed) which has received great praise. Additionally, [scala-exercises.org](https://www.scala-exercises.org/) provides interactive tutorials where you can progress through learning not only the Scala standard library, but several other popular libraries (we’ll touch more on those for both languages later!)

Also, I regularly blog about both [Kotlin](/tags/kotlin/) and [Scala](/tags/scala/) on BradCypert.com!

#### Bonus: Katas

If you’re not familiar with Katas, they are bite-sized exercises in programming which helps programmers hone their skills through practice and repetition. [Codewars.com](https://www.codewars.com) is a site built for Katas. You can sign up for free to practice and learn a language while comparing your solutions with other developers around the world.

[Exercism.io](https://exercism.io/) is similar to CodeWars, except you download their toolchain and use it to download a starter project, usually with failing tests. You then make the tests pass and then use their toolchain to upload your solution. They offer a “course” style where you work with a mentor or a “free-range” style, where you can select any problem and try to solve it.

Both Codewars and Exercism offer support for Scala and Kotlin.

## Idiomatic Code

Personally, I feel like a good way to compare the syntax of two languages is to see them solve the same problem. The problem we’re going to look at is Credit Card Detection (the [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm)). The examples we’ll see are both from [Rosetta Code](http://www.rosettacode.org/wiki/Rosetta_Code) (slightly edited).

<HeadsUp title="This isn't idiomatic! This could be written in 1 line!">
  My apologies if you don’t feel that these examples are very idiomatic. Every
  time I write code that has the word “idiomatic” near it someone calls me out
  on it and shows me how it could be written in seven characters or less.
  Personally, I find these fascinating in an academic sense but revolting in an
  “if someone submitted this for code review at work” sense. If you have a
  better way to do things, I’m all ears!
</HeadsUp>

In Kotlin, we can write the Luhn algorithm like so:

```kotlin
object Luhn {
  fun luhn(s: String): Boolean {
    fun sumDigits(n : Int) =  n / 10 + n % 10
    val  t = s.reversed()
    val s1 = t.filterIndexed { i, _ -> i % 2 == 0 }.sumBy { it - '0' }
    val s2 = t.filterIndexed { i, _ -> i % 2 == 1 }.map { sumDigits((it - '0') * 2) }.sum()
    return (s1 + s2) % 10 == 0
  }
}
```

In Scala, we can write the Luhn algorithm like so:

```scala
object Luhn {
  def validate(number: String): Boolean = validate(number.map(_.asDigit))
  def validate(digits: Seq[Int]): Boolean = {
    digits.reverse.zipWithIndex.foldLeft(0) { case (sum, (digit, i)) =>
      if (i % 2 == 0) sum + digit
      else sum + (digit * 2) / 10 + (digit * 2) % 10
    } % 10 == 0
  }
}
```

Both tackle the algorithm differently, so they’re not exact matches, but I like to think that this is a consequence of the problem-solving patterns of Scala and Kotlin developers.

#### Null vs Options

Arguably, one of the best reasons to work with either of these languages as opposed to Java is because they offer better alternatives on how to handle `null`.

Kotlin handles the [Billion Dollar Mistake](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare) (null pointers) by using nullable and non-nullable types. With nullable types, you have to handle the possibility of null explicitly, but with the non-nullable types — it’s business as usual. For example:

```kotlin
var name: String = "Brad"
name = null // wont compile!
```

However, we can use a nullable String type instead, but to consume the string, we have to check nullability (or we can use some idiomatic Kotlin features to handle the null check differently).

```kotlin
var name: String? = "Brad"
name = null // A-Okay!
if (name != null) {
  println(name.replace("B", "Super "))
}

// Alternatively
name?.let {
  println(it.replace("B", "Super "))
}
```

Scala handles null differently, although it’s somewhat similarly.

```scala
val name: String = null
name.replace("B", "Super ") // BOOM! Null pointer exception!
```

And this is totally legal in Scala. Part of the reason that it is legal is because of how [Java interop](https://docs.scala-lang.org/tutorials/scala-for-java-programmers.html#interaction-with-java) works, but that’s a story for another time. Thankfully  
Scala solves this problem for us by providing us with the [Option type](https://www.scala-lang.org/api/current/scala/Option.html).

```scala
val name: Option[String] = None
if (name.isDefined) {
  println(name.get.replace("B", "Super "))
}

val name: Option[String] = Some("Brad")
if (name.isDefined) {
  println(name.get.replace("B", "Super "))
}
```

Better, however this feels clunky for Scala. With idiomatic code, we can do better.

```scala
val name: Option[String] = Some("Brad")
name.map(_.replace("B", "Super ")).foreach(println)
```

This pattern is a lot simpler, but also showcases how Scala’s options work can be represented as Collections. This means that you also have access to `map`, `flatmap`, and for-comprehensions with Options as well!

#### Asynchronous Code

On my first pass at this article, I had left this section out. Feedback from Reddit said this was a bad idea so I’m adding this section in!

You can spin up threads in both Scala and Kotlin and manage asynchronous tasks just like you would in Java. However, both language communities have developed very opinionated ways as to how asynchronous code should act. It’s important to note that neither of these are a part of their language’s standard library, hence why they were originally left out.

#### Asynchronous Code – Scala

Scala has a community library (sponsored by [LightBend](https://www.lightbend.com/)) called Akka. While we’re cover Akka a little more in depth later, it’s important to know that it uses the Actor Model. When using Akka, you’ll code Actors and pass messages between the Actors. An actor can be implemented like so:

```scala
class MyActor extends Actor {
  override def receive = Actor.emptyBehavior
}
```

Although this doesn’t really accomplish anything on it’s own, it is the shell of what makes an Actor and Akka Actor. We extend Actor and implement the required `receive` method. To make Actors work, however, they need to exist in a system (Actors need Actors to communicate with). I won’t go too in-depth on Actors here as it definitely warrants a post on it’s own, but I will[ link you to a great tutorial on Actors](https://blog.codecentric.de/en/2015/08/introduction-to-akka-actors/) as well as [some inspiration as to why they should be used](https://doc.akka.io/docs/akka/2.5/guide/actors-intro.html)!

#### Asynchronous Code – Kotlin

Kotlin, on the other hand, has [Kotlinx.Coroutines](https://github.com/Kotlin/kotlinx.coroutines), developed by Jetbrains (the developers behind Kotlin itself, incase you had forgotten by this point). Coroutines have had a weird past, but thankfully that’s behind them. For a while, they were a part of the standard library, but locked behind an experimental flag. As of today, however, they are considered an extension to the Kotlin language and act as an accompaniment to the standard library.

Essentially, coroutines are light-weight threads. You can write `suspend` functions that allow the coroutines to suspend while not blocking a thread. This means that, as long as the coroutines don’t lock themselves, you can spawn 40 coroutines to run across 8 threads with no issues. If I were to write a suspend function that does heavy IO for example, it could be suspended to allow other functions to use up that thread.

Of course, you can control what does and doesn’t suspend via the `suspend` keyword.

Personally, I feel like Coroutines really shine when heavily composing suspend functions, but in an effort to keep this light (and still show off their awesomeness), I’m borrowing this example from the Kotlin Coroutines documentation:

```kotlin
val c = AtomicLong()

for (i in 1..1_000_000L)
    thread(start = true) {
        c.addAndGet(i)
    }

println(c.get())
```

**Disclaimer: There are no coroutines in that at all**. This simply spins up one-million threads that each adds to an atomic long. This also takes a very long amount of time to complete. However, we can rewrite _roughly_ the same thing using coroutines and it will take significantly less time.

```kotlin
val deferred = (1..1_000_000).map { n ->
    GlobalScope.async { n }
}
```

This example ended up running much faster than the thread example (so much that I didn’t kill it, like I did the thread example). You’ll notice above the example that I called this _roughly_ the same thing. It’s a slightly more idiomatic example, but it also shows that you can return values from your coroutines. If you’d like to dig into coroutines even more, you can [find great examples in the Kotlin Coroutines documentation](https://kotlinlang.org/docs/tutorials/coroutines/coroutines-basic-jvm.html).

## Community

I’ve mentioned the lifespan of Kotlin and Scala both already (at least in regards to popularity) but we’ll dive into each more in-depth. Scala has been around since January 2004. Kotlin’s first appearance was made in 2011. It’s only logical that Scala has more resources as it had less competition in it’s earlier years and has had longer to build a community.

However, there have been some key events that have helped Kotlin gain a lot of traction. The biggest event being [Google adopting Kotlin for the Android Operating system](https://techcrunch.com/2017-05-17/google-makes-kotlin-a-first-class-language-for-writing-android-apps/). We can leverage search data from Google Trends to get a general idea as to the interest of both of the languages over time.

![](/Screen-Shot-2019-03-04-at-10.52.00-AM.png)
Scala starts off strongest in the comparison, and seems to be slowly growing over time. However, Kotlin is picking up speed very fast. I’m sure you can see the change in the trend from when Google adopted Kotlin for Android.

Both of these languages are Java alternatives (although there are now benefits for those other than Java refugees). It could be useful to get a bigger picture as to how these language trends compare over time to Java.

If we add Java into the Google trend, you can see that Scala and Kotlin are barely distinguishable compared to vast amount of interest in Java. Interestingly enough, however, is that Java seems to be on a downward trend, where Scala and Kotlin (more so than Scala) seem to be on an upward trend.

![](/Screen-Shot-2019-03-04-at-10.51.45-AM.png)

#### Metablogs

Both the Scala and Kotlin community is active with bloggers covering the languages, frameworks, libraries and platforms. Many people prefer to leverage their own tools to consolidate these blogs and filter out ones that may not be particularly interesting to them. However, if you would like a consolidation of blogs from authors on either language, you can try a metablog.

<HeadsUp title="What's a Metablog?">
  A Metablog is simply a blog aggregator, usually around a specific theme. A
  good metablog links back to the original post and helps users find new
  publishers related to the metablog’s niche by regularly adding new blogs to
  the feed.
</HeadsUp>

Unfortunately, PlanetScala seems to have lost steam and been taken down, but I recently
launched [KotlinToday.com](http://www.kotlintoday.com/) to provide a metablog that
Kotlin developers can follow.

Edit: Unfortunately, KotlinToday has also gone the way of PlanetScala. I tried hard to spread news about KotlinToday but it just did not catch on. Fortunately, there’s [a weekly news letter for Scala](https://scalatimes.com/)and [one for Kotlin](http://www.kotlinweekly.net/) you can use instead.

#### How to Get Help

A large part of picking a language with a strong community is knowing there is a support system to help fix defects in libraries, contribute to the ongoing health of the language, and help work past issues you may run into while coding that language. Both Scala and Kotlin offer a means to allow users to communicate with one another.

Scala offers (to new just a few key community resources):

- [Gitter chat](https://gitter.im/scala/scala)
- [Scala Users Group](https://users.scala-lang.org/?_ga=2.148483127.1081702090.1551726309-2057424321.1551713602)
- [The Scala Subreddit](https://www.reddit.com/r/scala)

Kotlin offers (yet again, just naming a few key community resources):

- A page to find upcoming [Kotlin Talks](https://kotlinlang.org/community/talks.html)
- [The Kotlin Discuss](https://discuss.kotlinlang.org/)
- The Kotlin Slack Channels ([sign up here](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up))
- [The Kotlin Subreddit](https://www.reddit.com/r/Kotlin/)
- [TalkingKotlin](http://talkingkotlin.com/), A Podcast by Jetbrains about Kotlin

Let’s compare the population of /r/Scala and /r/Kotlin (the two respective subreddits). As of time of publication, the Scala subreddit has more subscribers than the Kotlin subreddit, although not too many more. Also, my apologies for the graph. The plugin I’m using for the graph makes /r/Kotlin look extremely small compared to /r/Scala when in reality, there’s only about a five-thousand subscriber difference.

I did have a reddit user point out that comparing the two subjects might not
be the best example due to the fact that the Scala subreddit is “basically dead.”
So feel free to take this comparison with a grain of salt.

## <figure class="wp-block-embed-reddit wp-block-embed is-type-rich is-provider-reddit"><div class="wp-block-embed__wrapper"><div class="reddit-embed" data-embed-created="2020-10-26T02:19:18.727249+00:00" data-embed-live="false" data-embed-media="www.redditmedia.com" data-embed-parent="false" data-embed-uuid="a6fb9a56-1731-11eb-9a6e-0eb040e3f047">[Comment](https://www.reddit.com/r/Kotlin/comments/axg282/comparing_kotlin_to_scala_brad_cypert/ehtvr87/) from discussion [hpernpeintner’s comment from discussion "Comparing Kotlin to Scala – Brad Cypert"](https://www.reddit.com/r/Kotlin/comments/axg282/comparing_kotlin_to_scala_brad_cypert/).</div><script async="" src="https://www.redditstatic.com/comment-embed.js"></script></div></figure>Libraries & Frameworks

It feels strange to say this: But a language just wouldn’t feel viable without libraries and frameworks written by the community. Thats a huge part as to what makes them worth picking up!

Take, for example, Ruby. Ruby would not be where it’s at today without Rails. I could argue the same thing for Java and Spring, I believe. Even the same for Python and Django!

However, that’s not what we’re here to learn about. We’re learning about the popular libraries available to Kotlin and Scala Developers. And we’ll get right into that after I mention one thing: As long as you’re targeting the JVM, you can use existing Java libraries and frameworks in both Scala and Kotlin. [In fact, Kotlin has a great tutorial on using it with Spring Boot here](https://kotlinlang.org/docs/tutorials/spring-boot-restful.html).

#### Scala Libraries & Frameworks

Scala has built up quite a list of prominent libraries over the years. There’s far more out there than will make this list, but I wanted to mention some of the most prominent and practical libraries.

**[Cats](https://typelevel.org/cats/)** is a library which provides abstractions for functional programming in Scala. The name is a playful shortening of the word _category_. Adding a dependency on Cats does not add a ton of value directly to the developer, however, many libraries are built on top of cats. One such example is [Cats-Retry](https://cb372.github.io/cats-retry/docs/index.html) which adds functionality on top of Cats that allows any Cats Monad to retry it’s action when failed.

[**Shapeless**](https://github.com/milessabin/shapeless) is a type class and dependent type based generic programming library for Scala. While I can’t go into details on Shapeless here (because it warrants many posts on it’s own), I can tell you that the main idea behind Shapeless is to help reduce boilerplate by helping make types less specific. If you’d like to l[earn more about Shapeless, this guide by Underscore.io is fantastic.](https://books.underscore.io/shapeless-guide/shapeless-guide.html)

[**Slick**](http://slick.lightbend.com/) is a library for database operations in Scala. It can leverage many different drivers to connect to many types of databases. Slick does not function like an ORM (and for good reason!) but instead gives you the control you need to perform operations and queries via a power DSL.

<HeadsUp title="What's a DSL?">
  DSL is an acronym for Domain Specific Language. SQL is a DSL for example,
  because it’s a language specifically for working with databases. Slick is a
  DSL for the same reason, however, to be comfortable for Scala users, it feels
  a lot like Scala!
</HeadsUp>

[**Akka**](https://akka.io/) is a toolkit for building highly concurrent,
distributed, and resilient message-driven applications for Java and Scala. Akka
is huge in the Scala ecosystem. It brings the actor system and streams to Scala
as first class citizens. This allows to write extremely scalable programs that
focus on asynchronously running code.

The [**Play Framework**](https://www.playframework.com/) is a framework built on top of Akka! Play is based on a lightweight, stateless, web-friendly architecture. It’s a delightful framework to use when working with web applications or web apis.

#### Kotlin Libraries & Frameworks

Kotlin is still a newer language, but has quickly built up and offered a lot in terms of community libraries. Let’s dig into them!

[**Ktor**](https://ktor.io/) is a framework for building asynchronous servers and clients in connected systems using Kotlin. You can use Ktor to build an API or a simple rest client. The documentation for Ktor is pretty great, and the community seems to be producing a fair amount of tutorials for it too. In fact, I’ve got a [few blog posts on using Ktor here](/tags/ktor/). Ktor gives you full control over your API at the application level and supports third party plugins to enable things like Type-Safe routing, JWT, and Status Pages. You can enable what you need and remove what you don’t.

**[Exposed](https://github.com/jetbrains/Exposed)** is a prototype for a lightweight SQL library written over JDBC driver for Kotlin. It’s extremely comparable to Scala’s Slick in that it provides a DSL for interacting with databases. While not 1-for-1 on features or structure, it’s quite likely that Exposed took a lot of influence from Scala’s Slick and works very similarly to Slick.

**[Arrow](https://arrow-kt.io/)** is a library for Typed Functional Programming in Kotlin. Arrow aims to provide a common languages of interfaces and abstractions across Kotlin libraries. For this, it includes the most popular data types, type classes and abstractions such as `Option`, `Try`, `Either`, `IO`, `Functor`, `Applicative`, `Monad` to empower users to write pure FP apps and libraries built atop higher order abstractions. Arrow is similar to the Cats library for Scala, although still different in quite a few ways.

## Build Tools & Other Tooling

Kotlin’s tooling is still rather young, but has found a lot of success in working with Gradle. In fact, you can even write your Gradle files in Kotlin! Scala is also capable of using Gradle as a build tool, however, the community seems to gravitate to [SBT](https://www.scala-sbt.org/), or Scala Build Tool. In fact, the Play Framework mentioned above ships with SBT for Scala Projects.

Both work well, although I personally find Gradle files easier to work with. SBT has felt rather cryptic in the past. That being said, SBT works rather well for small projects that don’t need a lot of configuration. SBT ships with a lot of things that would require plugins in gradle. That’s not to say that plugins are bad — The gradle build system was built with plugins in mind. Just something to be aware of.

Both SBT and Gradle are capable of building our shippable .jar files, so both solve that need.

#### Editor Tooling

When it comes to editor tooling, Intellij offers a great debugger for both Scala and Kotlin, as well as plethora of other tools (such as a code formatter). Kotlin does shine through as a first class citizen in Intellij, and while Scala does have niceties such as autocomplete, my Intellij setup has struggled a bit with the Play Framework in the past (namely due to `.conf` files that reference Scala controllers). Kotlin and Intellij are both the brainchild of Jetbrains, so naturally, Jetbrains is focused on making sure the two work well together.

#### Community Tooling

As for community tooling, I’ve simply decided to compare support for a few of the tools I’ve used in the past. Namely:

- [CodeClimate](https://codeclimate.com/)
- [Codacy](https://www.codacy.com/)
- [Travis CI](https://travis-ci.org/)
- [Sentry](https://sentry.io/welcome/)
- [Coveralls](https://coveralls.io/)

<table>
  <tbody>
    <tr>
      <th></th>
      <th>Scala</th>
      <th>Kotlin</th>
    </tr>
    <tr>
      <td>Codacy</td>
      <td>YES</td>
      <td>YES</td>
    </tr>
    <tr>
      <td>CodeClimate</td>
      <td>YES</td>
      <td>YES</td>
    </tr>
    <tr>
      <td>Travis CI</td>
      <td>YES</td>
      <td>YES</td>
    </tr>
    <tr>
      <td>Sentry</td>
      <td>YES</td>
      <td>YES</td>
    </tr>
    <tr>
      <td>Coveralls</td>
      <td>YES</td>
      <td>NO</td>
    </tr>
  </tbody>
</table>

Yet again, I’d like to reiterate that Scala has been mainstream for a significantly longer time than Kotlin, however, Tooling is a boolean value. It either exists or it doesn‘t. Thankfully, most of the tools I use support Kotlin as well!

## Job Postings

Unfortunately, neither Kotlin or Scala have dedicated job boards. However, I was able to get a decent sense of the current job postings available on [StackOverflow Jobs](https://stackoverflow.com/jobs). At time of publication, Scala comes in at 142 job postings and Kotlin at 75. Yet again, this is just a rough idea, as there was no clear source for job postings for either language.

I also attempted to calculate salaries for Scala Developers and Kotlin Developers. The Scala developer salary (According to StackOverflow) is roughly as follows:

<div class="wp-block-image">
  <figure class="aligncenter">
    ![](/c1.png)
    <figcaption>
      Salary ideas for a Scala Backend Developer in San Francisco, CA with 5
      years experience{" "}
    </figcaption>
  </figure>
</div>
Unfortunately, the Salary calculation for Kotlin Developers on StackOverflow is as
follows:

<div class="wp-block-image">
  <figure class="aligncenter">
    ![](/c2.png)
    <figcaption>No results match Kotlin</figcaption>
  </figure>
</div>
Of course, this doesn’t mean those salaries are low or that the jobs don’t exist,
it’s just that StackOverflow doesn’t have enough information to give us an idea as
to what a Kotlin Developer’s salary could be.

## Conclusion

Scala and Kotlin are both, in my opinion, fantastic languages. Scala offers way more of a paradigm shift than Kotlin, but also requires, in my opinion, more effort to learn. That being said, the type system and paradigm shift of writing/learning Scala is extremely rewarding, even if you later decide that Scala isn’t for you.

The future for Kotlin looks extremely bright, especially as the Android ecosystem continues to grow even more. While I wasn’t able to get the same information regarding careers in Kotlin, Kotlin as a language seems to be growing a lot. I can easily see how especially with Android and Project Fuchsia Kotlin will be growing over the next few years.

Regardless of whether you choose Kotlin or Scala for your next project, I’d be thrilled to help you on that journey. You can [find my tutorials and blog posts on Kotlin here](/tags/kotlin) and [my Scala tutorials and blog posts here](/tags/scala)! If you’ve found this comparison of Kotlin Vs. Scala useful, let me know below!
