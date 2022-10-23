---
title: "Formatter Objects: Testable Fragments"
date: 2019-01-24
status: publish
permalink: /formatter-objects-testable-fragments
author: "Brad Cypert"
excerpt: ""
type: blog
id: 828
thumbnail: /boat-folding-origami-19678.jpg
category:
  - Android
tags:
  - android
  - kotlin
post_format: []
description:
  - "You can leverage formatter objects to help make view logic more testable. Simplify your views and prevent regressions using formatter objects."
  - "90"
---

Let’s face it — Fragments are a pain to test and it’s predominantly due to how the Android operating system works. Sometimes, you’ll find yourself writing business rules regarding how a view is displayed. Likely, some data will come back from a web server and you’ll have to format some text differently or color something differently. Nothing crazy, but all this code adds up and needs to be tested.

Ideally, you’ll have some form of automation coverage to help tackle this problem, but Espresso tests can be slow and environment dependent. But what If I told you that you could write unit tests for this logic and simplify your fragments all in one swoop? Hopefully you’re as excited about that as I am.

## Fragment Coverage

In regards to test coverage, A lot of people tend to sweep fragment logic under the rug. It’s difficult to test but doing this makes the fragment a nest of regressions waiting to happen. Instead, I’m proposing that you take all of your formatting logic and break it out into functions on a Formatter object. Let’s take the following example into account:

```kotlin
class PartyFragment : Fragment() {
  val partyName = "new years eve"
  override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
    val view = inflater.inflate(R.layout.fragment_party)
    val vm = ViewModelProviders.of(this).get(PartyViewModel::class.java)
    vm.pollPartyCountdown(partyName).observe(this, Observer {
      when (it.countdown) {
        0 -> {
          view.countdown_textfield.text = "🎆🎆🎆"
          view.countdown_textfield.textSize = 100F
        }
        1..10 -> {
          view.countdown_textfield.text = "Only ${it.countdown} more days"
          view.countdown_textfield.setTextColor(R.color.orange)
        }
        else -> {
          view.countdown_textfield.text = "Not yet ready to start counting down."
          view.countdown_textfield.setTextColor(R.color.blue)
        }
      }
    })
  }
}
```

Alright, it’s fair to say that this is already getting complicated, but we can easily see some “business” requirements:

1. When it’s the day of the party in question:
1. Set the text to firework emojis
1. Make the text size massive (product people, am I right? 😉)
1. When it’s less than 10 days away:
1. Set the text to say “Only N more days” where N is the number of days left.
1. Set the text color to orange.
1. When its anything not meeting the above criteria:
1. Set the text to say “Not yet ready to start counting down”
1. Set the text color to blue

Likely, if this is left in a fragment, this logic won’t get unit test coverage. That also means that it will probably cause a regression if we have to come back to this and refactor or add to it. Proper tests can really be quite helpful!

## Formatter Objects

A pattern that I’ve enjoyed using involves pulling the formatting out into a separate class/object. In this case, I’d make an object called `PartyFormatter` and it’d have a simple format method. This should encapsulate all of our logic in a very simple object that can be easily tested!

With that in mind, it feels like we should start by writing our tests first. We can leverage some of the awesome Androidx.test libraries to help make this easier, too (such as getting the application context).

```kotlin

class PartyFormatterTests {
val context = ApplicationProvider.getApplicationContext()

  @Test
  fun formatPartyTextWhenDayOf() {
    val target = TextView(context)
    val partyCountdownResponse = PartyCountdownResponse(countdown = 0)
    PartyFormatter.format(partyCountdownResponse, target)
    Assert.assertEquals(target.text, "🎆🎆🎆")
    Assert.assertEquals(target.textSize, 100F)
  }

  @Test
  fun formatPartyTextWhen1To10Days() {
    (1..10).forEach {
      val target = TextView(context)
      val partyCountdownResponse = PartyCountdownResponse(countdown = it)
      PartyFormatter.format(partyCountdownResponse, target)
      Assert.assertEquals(target.text, "Only \${it} days left")
      Assert.assertEquals(target.currentTextColor, context.getColor(R.color.orange))
    }
  }

  // final test omitted for brevity
  }

```

Running tests… and failed to compile. Good, thats because we haven’t written our formatter yet. Let’s do that now.

```kotlin
object PartyFormatter {
  fun format(response: PartyCountdownResponse, countdownText: TextView) {
    when (response.countdown) {
      0 -> {
        countdownText.text = "🎆🎆🎆"
        countdownText.textSize = 100F
      }
      1..10 -> {
        countdownText.text = "Only ${response.countdown} more days"
        countdownText.setTextColor(R.color.orange)
      }
      else -> {
        countdownText.text = "Not yet ready to start counting down."
        countdownText.setTextColor(R.color.blue)
      }
    }
  }
}
```

Now we can refactor our fragment to call our formatter:

```kotlin
class PartyFragment : Fragment() {
  val partyName = "new years eve"
  override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
    val view = inflater.inflate(R.layout.fragment_party)
    val vm = ViewModelProviders.of(this).get(PartyViewModel::class.java)
    vm.pollPartyCountdown(partyName).observe(this, Observer {
      PartyFormatter.format(it, view.countdown_textfield)
    })
  }
}
```

## Growing the Formatter

We feel pretty good about our code, but we get some user feedback about our product. They want us to add another text field that shows the current day that we get from our server. That’s simple, but your product team likes to A/B test, so they want you to create ANOTHER fragment that is basically the same thing, but with the title. Thankfully, we can reuse the same formatter and add our new text field to it, too! Yet again, let’s start by adding a new test:

```kotlin
@Test
fun showTheCurrentDateFromTheBackend() {
    val target = TextView(context)
    val partyCountdownResponse = PartyCountdownResponse(dateFromBackend = "1/24/19")
    PartyFormatter.format(response = partyCountdownResponse, currentDateText = target)
    Assert.assertEquals(target.text, "1/24/19")
}
```

Let’s modify our formatter to allow nullable views, and default them to null. That way, we can still use this formatter on the view we’ve already made.

```kotlin
object PartyFormatter {
  fun format(response: PartyCountdownResponse, countdownText: TextView? = null, currentDateText: TextView? = null) {
    countdownText?.let {
      when (response.countdown) {
        0 -> {
          countdownText.text = "🎆🎆🎆"
          countdownText.textSize = 100F
        }
        1..10 -> {
          countdownText.text = "Only ${response.countdown} more days"
          countdownText.setTextColor(R.color.orange)
        }
        else -> {
          countdownText.text = "Not yet ready to start counting down."
          countdownText.setTextColor(R.color.blue)
        }
      }
    }

    currentDateText?.let {
      it.text = response.dateFromBackend
    }
  }
}
```

Of course, you can break the format function out into private functions to help keep the public function as clean as possible, but I’ll leave that to you! Anyways, this pattern helps solve our issue of formatting business logic being hidden and untested within our fragments or activities.

Hopefully you’ve found this post helpful. If you’d like to check out more of my posts on Android Development, [you can find them here](http://www.bradcypert.com/tags/android/). If you’re interested in learning more about Kotlin, [click here](http://www.bradcypert.com/tags/kotlin)!
