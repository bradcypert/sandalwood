---
title: "The Facade Pattern for Simple Dependency Injection"
date: 2019-01-16
status: publish
permalink: /the-facade-pattern-for-simple-dependency-injection
author: "Brad Cypert"
excerpt: ""
type: blog
id: 774
images:
  - abstract-architecture-art-227675.jpg
category:
  - kotlin
tags:
  - kotlin
  - ktor
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_primary_category:
  - "104"
_yoast_wpseo_content_score:
  - "60"
description:
  - "The Facade Pattern can be used as a simple solution to satisfy class dependencies in small dependency trees."
_yoast_wpseo_focuskw:
  - facade
_yoast_wpseo_linkdex:
  - "75"
saswp_custom_schema_field:
  - ""
itemlist_item_3050:
  - "a:0:{}"
music_composer_3050:
  - "a:0:{}"
movie_actor_3050:
  - "a:0:{}"
article_items_3050:
  - "a:0:{}"
image_object_exif_data_3050:
  - "a:0:{}"
blogposting_items_3050:
  - "a:0:{}"
newsarticle_items_3050:
  - "a:0:{}"
tech_article_items_3050:
  - "a:0:{}"
product_reviews_3050:
  - "a:0:{}"
feed_element_3050:
  - "a:0:{}"
faq_question_3050:
  - "a:0:{}"
performer_3050:
  - "a:0:{}"
accepted_answer_3050:
  - "a:0:{}"
suggested_answer_3050:
  - "a:0:{}"
howto_supply_3050:
  - "a:0:{}"
howto_tool_3050:
  - "a:0:{}"
howto_step_3050:
  - "a:0:{}"
announcement_location_3050:
  - "a:0:{}"
music_playlist_track_3050:
  - "a:0:{}"
music_album_track_3050:
  - "a:0:{}"
apartment_amenities_3050:
  - "a:0:{}"
additional_property_3050:
  - "a:0:{}"
mc_cause_3050:
  - "a:0:{}"
mc_symptom_3050:
  - "a:0:{}"
mc_risk_factor_3050:
  - "a:0:{}"
tvseries_actor_3050:
  - "a:0:{}"
tvseries_season_3050:
  - "a:0:{}"
trip_itinerary_3050:
  - "a:0:{}"
saswp_webpage_speakable_3050:
  - "0"
saswp_modify_this_schema_3049:
  - "0"
itemlist_item_3049:
  - "a:0:{}"
music_composer_3049:
  - "a:0:{}"
movie_actor_3049:
  - "a:0:{}"
article_items_3049:
  - "a:0:{}"
image_object_exif_data_3049:
  - "a:0:{}"
blogposting_items_3049:
  - "a:0:{}"
newsarticle_items_3049:
  - "a:0:{}"
tech_article_items_3049:
  - "a:0:{}"
product_reviews_3049:
  - "a:0:{}"
feed_element_3049:
  - "a:0:{}"
faq_question_3049:
  - "a:0:{}"
performer_3049:
  - "a:0:{}"
accepted_answer_3049:
  - "a:0:{}"
suggested_answer_3049:
  - "a:0:{}"
howto_supply_3049:
  - "a:0:{}"
howto_tool_3049:
  - "a:0:{}"
howto_step_3049:
  - "a:0:{}"
announcement_location_3049:
  - "a:0:{}"
music_playlist_track_3049:
  - "a:0:{}"
music_album_track_3049:
  - "a:0:{}"
apartment_amenities_3049:
  - "a:0:{}"
additional_property_3049:
  - "a:0:{}"
mc_cause_3049:
  - "a:0:{}"
mc_symptom_3049:
  - "a:0:{}"
mc_risk_factor_3049:
  - "a:0:{}"
tvseries_actor_3049:
  - "a:0:{}"
tvseries_season_3049:
  - "a:0:{}"
trip_itinerary_3049:
  - "a:0:{}"
saswp_blogposting_speakable_3049:
  - "0"
wp_last_modified_info:
  - "May 24, 2020 @ 3:23 pm"
wplmi_shortcode:
  - "[lmt-post-modified-info]"
---

I’ve been working on a [Ktor](https://ktor.io/) api for a while now and found myself needing to make sure my routes had access to my repositories. Naturally, I sought out the advice of anyone who’s implemented [Dagger](https://google.github.io/dagger/) with Ktor. After digging for a bit, I realized that it was completely unnecessary and likely overkill. Dagger works great on Android because you are tied to the constraints of the platform and lifecycles, but with Ktor I have control of the entire scope of my application.

So I considered trying [Koin](https://insert-koin.io/). I hadn’t used it yet but have heard people recommending it over Dagger for Android. With a sterling recommendation like that I figured it has to be good. And it probably is, but yet again, it felt like overkill. I **just need to get access to my repositories in my routes**.

I found myself creating a solution that felt weird at the time. I sat down and said “I’m just going to write my repos and I’ll figure this out later.” And I did just that. I ended up with 6 different repositories at the time, which isn’t a lot, but it is’t a negligible amount either. So, how do I get these into my routes?

If you read my [previous post on “Controllers in Ktor”](http://www.bradcypert.com/controllers-in-ktor/), you’re aware that I’m using extension functions to separate my routes into pseudo-controllers. Thankfully, extension functions are just that and I can pass in my repositories to those functions. Unfortunately, now I have to manage which routes need which repositories and maintain that going forward. If only there was a way to encapsulate the implementation of all these dependencies into a module with a simple interface like a Dagger Module. Wait… Dagger aside, isn’t that just a facade?

## The Facade

We’ll keep the implementation light, as I dont really want to ask you to read through hundreds of lines of code. Assume we have some repositories named `TicketRepo`, `UserRepo`, `OrgRepo`, `TaskRepo`, and`LabelRepo`. Assume that each of these support standard CRUD operations, too.

We can write an interface for a facade of repositories like so:

```kotlin
interface DataManager {
  fun getTicket(id: Int): Ticket
  fun getTickets(orgId: Int): List<Ticket>
  fun createTicket(ticket: Ticket): Int
  fun updateTicket(ticket: Ticket): Unit
  fun deleteTicket(ticket: Ticket): Unit
  fun getUser(id: Int): User
  ... // and so on,
      //I wont write all of these out here, but hopefully you get the idea.
}
```

Then, of course, you have to implement that interface somewhere.

```kotlin
class Database(private val TicketRepo,
private val UserRepo,
private val OrgRepo,
private val TaskRepo,
private val LabelRepo): DataManager {
fun getTicket(id: Int): Ticket {
return TicketRepo.getTicket(id)
}

...
// and so on. Implement all the required members of DataManager
}

```

## Passing The DataManager

Now that we’ve encapsulated all of our database-related functionality, we can simply pass the Database instance around to our extension functions in our routes. We can now structure our Ktor application like this:

```kotlin
fun Application.module(testing: Boolean = false) {
    // initialize each of the repos here...
    val ticketRepo = TicketRepo()
    val userRepo = UserRepo()
    val orgRepo = OrgRepo()
    val taskRepo = TaskRepo()
    val labelRepo = LabelRepo()

    val database = Database(ticketRepo, userRepo, orgRepo, taskRepo, labelRepo)
    routing {
        get("/") {
            call.respondText("Hello World", contentType = ContentType.Text.Plain)
        }

        userRoutes(database)
        organizationRoutes(database)
        ticketRoutes(database)
        labelRoutes(database)
        taskRoutes(database)
    }
}
```

## Updating our Route Extensions

Finally, we have our dependencies satisfied for our routes. We can now update our route extension functions to act like so:

```kotlin

fun Route.ticketRoutes(database: DataManager) {
  route("/tickets") {
    get("") {
      database.getTickets().let {
        // ideally serialize as JSON, but maybe another post.
        call.respond(it.toString())
      }
    }

    get("/{id}") {
        // this is sloppy but simple, try to avoid the `!!`
        database.getTicket(call.params["id"].toInt()!!).let {
          call.respond(it.toString())
        }
    }

    post("/") {
        // posts are more complicated, but the same idea remains.
    }

    delete("/{id}") {
        database.deleteTicket(call.params["id"].toInt()!!)
        call.respond("OK")
    }
  }
}

```

Pardon the non-glamorous routes, but I wanted to focus on using the Facade as a dependency injection strategy. This pattern works really well for simple dependency trees, however, if the tree gets more complicated it might not be a bad idea to invest in Dagger or Koin (or some other alternative). A fantastic thing about Ktor however, is that you certainly have a choice in how to furnish any dependencies that your classes may have.

If you’d like to read more about [my experiences with Ktor, you can do so here](http://www.bradcypert.com/tags/ktor/)! Additionally, I’ve started accumulating[ a ton of Kotlin posts that I’d recommend checking out!](http://www.bradcypert.com/tags/kotlin/)
