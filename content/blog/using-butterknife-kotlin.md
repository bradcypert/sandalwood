---
title: "Using ButterKnife with Kotlin"
date: 2018-05-16
status: publish
permalink: /using-butterknife-kotlin
author: "Brad Cypert"
excerpt: ""
type: blog
id: 537
category:
  - Android
  - kotlin
tags:
  - android
  - ButterKnife
  - kotlin
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_title:
  - "Using ButterKnife View Bindings with Kotlin"
_yoast_wpseo_primary_category:
  - ""
_yoast_wpseo_content_score:
  - "90"
_yoast_wpseo_focuskw:
  - butterknife
description:
  - "Butterknife is a fantastic library for Android Development. Originally written for Java, this library helps you reference your views in code."
_yoast_wpseo_linkdex:
  - "44"
---

Butterknife is a simple but fantastic tool for Android development. When this was introduced, it really simplified my thought process regarding view bindings in my activities, fragments, or view holders. As Kotlin adoption grew,[ Jake Wharton (creator of ButterKnife)](https://jakewharton.com/) also created [KotterKnife](https://github.com/JakeWharton/kotterknife), for _kotlin-esque_ view bindings. KotterKnife isn’t bad, but I prefer the annotation syntax of ButterKnife instead! Implementing ButterKnife with Kotlin has a few gotcha’s however, that may be a bit difficult to get setup with. Let’s talk through those.

## Including ButterKnife in your project

To use ButterKnife, you need to include both the library and the butterknife compiler. If you pull this from ButterKnife’s github, you’ll see that the gradle changes look like the following:

```gradle
implementation 'com.jakewharton:butterknife:8.8.1'
annotationProcessor 'com.jakewharton:butterknife-compiler:8.8.1'
```

Actually, if you’re using Kotlin, you’ll need to use the following instead:

```gradle
implementation 'com.jakewharton:butterknife:8.8.1'
kapt 'com.jakewharton:butterknife-compiler:8.8.1'

```

Kapt is simply Kotlin’s annotation processor and should be used in place of `annotationProcessor`. This includes using Dagger with Kotlin as well.

## Binding Views

The whole selling point for ButterKnife is the ability to bind your views for you. Look over this simple activity for context and we’ll cover binding with ButterKnife below.

```kotlin
class SettingsActivity : AppCompatActivity() {

    @BindView(R.id.rebuild_db) lateinit var sendButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(ThemeService.getSelectedTheme(this, true))
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)
        ButterKnife.bind(this)

        this.sendButton.setOnClickListener {
            val setupObs = SetupDB(applicationContext).run()

            DestroyDB().run().concatMap { setupObs }.subscribe {
                Toast.makeText(applicationContext, "DB rebuilt - $it", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
```

Simply by calling `ButterKnife.bind(this)`, we can build our view bindings all at once, provided we used ButterKnife’s `@BindView()` annotation.

You’ll notice that we used Kotlin’s `lateinit` modifier on our view binding. You’ll need to either use `lateinit` or `@JvmField` to work with Butterknife properly. Otherwise, application will throw an error when attempting to call `ButterKnife.bind(this)`.

And that’s all you need to do to get setup with ButterKnife on Android with Kotlin. Happy coding!

Interested in learning more about Kotlin? You can [check out my other Kotlin articles here](http://www.bradcypert.com/category/kotlin/)!

```

```
