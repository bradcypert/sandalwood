---
title: "Retro: Building an SMTP Server in Gleam - Part 1"
date: 
status: publish
permalink: /todo
author: "Brad Cypert"
type: blog
tags:
  - gleam
  - smtp
  - retrospective
description: "I started building an SMTP server in Gleam. Here's what I've learned so far (Part 1)"
outline:
  what: "What's the main goal I am trying to convey"
  why: "Why does anyone care?"
  how: "How is whatever Im teaching used?"
  when: "When should it be used?"
---
I've been building an SMTP server in Gleam lately. I won't say "From scratch" as I'm using Rawhat's wonderful [Glisten](https://github.com/rawhat/glisten) library, which providers the TCP transport layer,
but outside of that, I'm not (currently) using any other libraries. What I've actually implemented so far is rather small. I haven't touched IMAP or POP and have just focused
on reading TCP packets, parsing them as SMTP payloads, and responding to the client appropriately. I'm hoping to share my learnings and document my progress with this post and others.
Lets get into it!

## TCP is everywhere

For most of our run-of-the-mill software development, when we send requests we're sending them over TCP. Now, you might say "I have never sent a TCP request in my life. I always use HTTP(s)" and to be honest,
this would be a normal reaction. It's reasonable to lack the knowledge that HTTP is built ontop of TCP if the lowest level primitive you use is HTTP, but now that we've cleared the air, we can agree that
you've likely been doing your networking over TCP. There are alternatives to TCP (UDP being the primary and the differences are probably out of the scope of this blog post) but HTTP (and HTTPS) is built
ontop of TCP. Similarly, SMTP is also built on top of TCP.

Armed with this information, we know that we can build an SMTP server (or an HTTP server) simply by building ontop of a TCP layer. In fact, TCP is such a common protocol to build ontop of that most languages
ship a standard library that includes support for a TCP layer, however, Gleam does not. Thankfully, an open source library named "Glisten" fits the bill quite nicely for us!

## A bit about Glisten

Glisten's interface is actually quite simple. With Glisten, we call `glisten.new` and pass in two functions.
- The first function takes in the connection and is called when the connection is created. The return value here is the connection state that is used by the next function.
- The second function takes in the state, a user message, and a connection and is called when a new message comes across the TCP connection.

The signature for `new` looks like this:
```gleam
pub fn new(
  on_init: fn(Connection(user_message)) -> #(
    state,
    option.Option(process.Selector(user_message)),
  ),
  loop: fn(state, Message(user_message), Connection(user_message)) -> Next(
    state,
    Message(user_message),
  ),
) -> Builder(state, user_message)
```

With this in mind, our main function can look something like this:
```gleam
pub fn main() -> Nil {
  io.println("Hello from sheesh!")

  let assert Ok(_) =
    glisten.new(
      fn(conn) {
        let assert Ok(_) =
          conn_send_string(conn, "220 localhost ESMTP sheesh\r\n")
        #(session.new(), None)
      },
      loop,
    )
    |> glisten.start(3000)

  process.sleep_forever()
}
```

The loop function needs to look at the message and handle the case where it's a UserMessage vs a Packet. Packets are what we're interested in with regards to our SMTP server, so we'll design our loop function to look something like this:

```gleam
fn loop(state: session.SmtpSession, msg, conn) {
  case msg {
    Packet(bits) -> {
      session.print_session(state)
      let assert Ok(text) = bit_array.to_string(bits)
      io.println("recieved message: " <> text)
      process_lines(state.buffer <> text, state, conn)
    }
    _ -> glisten.continue(state)
  }
}
```

The TCP processing is interesting, but now that we're processing the lines and accumulating each line from the connection in a buffer, we can get onto the interesting part, which includes the parsing. For more information on how the TCP layer behaves, check the source here: https://github.com/bradcypert/sheesh/blob/main/src/sheesh.gleam

## Parsin' it

To be honest, this section alone is what made me want to write this blog post, so let's talk about parsing the payload (SMTP is actually _really_ simple) and some of the affordances that Gleam gives us to make parsing this _super_ easy! SMTP is essentially a series of commands and responses. Each command is 4 characters and _may_ have additional data associated with it. The first command is the HELO command, and this is essentially establishing the connection between the client and server. The next command is the EHLO command, which is essentially "Extended Hello". The server can respond to EHLO by responding with extended features that it supports. Besides these, the other commands are what you might expect: `Mail` (MailTo), `Rcpt` (Recipient), `Data` (Email content), and `Quit` (end the communication).

We are accepting arbitrary strings, so there's always a chance that something comes in that _doesnt_ meet one of the supported commands, so we should add an unknown state. Let's model our types:

```gleam
pub type SmtpCommand {
  Ehlo(domain: String)
  Helo(domain: String)
  MailFrom(address: String)
  RcptTo(address: String)
  Data
  Quit
  Unknown(raw: String)
}
```

Now we'll want to take input and map it to those types! This is actually pretty straight forward, too:

```gleam
pub fn parse(line: String) -> SmtpCommand {
  let cmd = string.uppercase(string.slice(line, 0, 4))
  let args = string.trim(string.drop_start(line, 4))
  case cmd {
    "EHLO" -> Ehlo(args)
    "HELO" -> Helo(args)
    "MAIL" -> MailFrom(clean_recipient(string.drop_start(args, 5)))
    "RCPT" -> RcptTo(clean_recipient(string.drop_start(args, 3)))
    "DATA" -> Data
    "QUIT" -> Quit
    _ -> Unknown(line)
  }
}

fn clean_recipient(recipient: String) {
  recipient
  |> string.replace("<", "")
  |> string.replace(">", "")
  |> string.trim()
}
```
We do add a small `clean_recipient` function that simply takes in an email string which may be something like `<hello@bradcypert.com>` and convert it to `hello@bradcypert.com`.

