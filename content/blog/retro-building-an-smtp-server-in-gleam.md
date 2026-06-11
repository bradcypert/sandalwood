---
title: "Retro: Building an SMTP Server in Gleam - Part 1"
date: 2026-06-10 
status: publish
permalink: /todo
author: "Brad Cypert"
type: blog
images:
  - synthwave-email.png
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
I've been building an SMTP server in Gleam lately. I won't say "From scratch" as I'm using Rawhat's wonderful [Glisten](https://github.com/rawhat/glisten) library, which provides the TCP transport layer,
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

The TCP processing is interesting, but now that we're processing the lines and accumulating each line from the connection in a buffer, we can get onto the interesting part, which includes the parsing. For more information on how the TCP layer behaves, check the source here: <https://github.com/bradcypert/sheesh/blob/main/src/sheesh.gleam>

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

## Back to main

Hopefully this feels like it's starting to come together, but if it's not then no worries! We have a little bit of glue to write to connect our parsing logic to our TCP listener. Let's do that now! (refer to our previous implementation of our TCP listener if necessary):

```gleam
fn process_lines(buffer: String, state: session.SmtpSession, conn) {
  io.println("\n" <> buffer <> "\n")
  case state.state {
    session.Quit -> glisten.stop()
    _ -> process_lines_inner(buffer, state, conn)
  }
}

fn process_lines_inner(buffer: String, state: session.SmtpSession, conn) {
  case string.split_once(buffer, "\r\n") {
    Error(_) -> {
      // No complete line, keep buffering
      glisten.continue(session.SmtpSession(..state, buffer: buffer))
    }
    Ok(#(line, rest)) -> {
      let next_state =
        handle_line(line, session.SmtpSession(..state, buffer: rest), conn)
      process_lines(rest, next_state, conn)
    }
  }
}
```

In short, process lines is logging (hey, who left that in there 😅) and then switching on the state to determine what it should do! If the state is a Quit state, we indicate to our TCPConnection handler that
it should stop listening. If the state is _not_ a Quit state, then we move on to another private function that is effectively acting as an [inner function](https://en.wikipedia.org/wiki/Nested_function). This inner function looks at the buffer that we're building up in our _buffer_, and splits on carriage-return-line-feed (\\r\\n). If we can't split (this is our error state), we just tell our TCP listener to continue doin' what it's gonna do. If we _are_ able to split successfully, we handle that individual line and then call back into process_lines, because we're only splitting _once_ (the _pre_-split becomes `line` while the _post_-split becomes `rest`). There's a chance we have more carriage-return-line-feeds so we need to process the remaining lines!

## Home Stretch

Armed with this knowledge, we're actually really close to having a minimally viable SMTP server! So here's what's left:

```gleam
fn handle_line(
  line: String,
  state: session.SmtpSession,
  conn,
) -> session.SmtpSession {
  case state.state {
    session.Data -> handle_data_line(line, state, conn)
    session.Greeting -> {
      case command.parse(line) {
        command.Ehlo(_domain) | command.Helo(_domain) -> {
          let assert Ok(_) = conn_send_string(conn, "250 OK\r\n")
          session.SmtpSession(..state, state: session.Ready)
        }
        _ -> {
          let assert Ok(_) =
            conn_send_string(conn, "503 Bad sequence of commands\r\n")
          state
        }
      }
    }
    _ -> {
      case command.parse(line) {
        command.Ehlo(_domain) | command.Helo(_domain) -> {
          let assert Ok(_) = conn_send_string(conn, "250 OK\r\n")
          session.SmtpSession(..state, state: session.Ready)
        }
        command.MailFrom(address:) -> {
          let assert Ok(_) = conn_send_string(conn, "250 OK\r\n")
          session.SmtpSession(
            ..state,
            state: session.MailFrom,
            from: option.Some(address),
          )
        }
        command.RcptTo(address:) -> {
          let assert Ok(_) = conn_send_string(conn, "250 OK\r\n")
          session.SmtpSession(..state, state: session.RcptTo, to: [
            address,
            ..state.to
          ])
        }
        command.Data -> {
          let assert Ok(_) =
            conn_send_string(conn, "354 End data with <CR><LF>.<CR><LF>\r\n")
          session.SmtpSession(..state, state: session.Data)
        }
        command.Quit -> {
          let assert Ok(_) = conn_send_string(conn, "221 Bye\r\n")
          session.SmtpSession(..state, state: session.Quit)
        }
        _ -> {
          let assert Ok(_) = conn_send_string(conn, "500 Unknown Command\r\n")
          state
        }
      }
    }
  }
}

fn handle_data_line(
  line: String,
  state: session.SmtpSession,
  conn: glisten.Connection(a),
) -> session.SmtpSession {
  case line {
    "." -> {
      // end of message, deliver it!
      let assert Ok(_) = conn_send_string(conn, "250 OK: queued\r\n")
      session.SmtpSession(..state, state: session.Ready, data_lines: [])
    }
    _ -> {
      session.SmtpSession(..state, data_lines: list.append(state.data_lines, [line]))
    }
  }
}
```

Here's where we're going to wire up our parsing logic from earlier! At this point, the code should hopefully be pretty clear to follow, but lets go through it. Data Lines are effectively the exception to the rest of this flow,
so we detect those early and handle them separately. Similarly, greetings need to be handled differently and dont particularly need parsing, so we handle that here as well. Once we're through those two, we fall into our catch-all
which is where we parse our commands. Keep in mind that the last item of each branch is the return statement as you read through that code. Ultimately, we're just parsing and sending a response back at this point... which leads to a fantastic question.

## WHERE ARE MY EMAILS, BRAD

A fun rhetorical question since I'm typing this to myself. At this point, we have (more-or-less) a fully functioning SMTP server at the TCP Layer. So... when I use TELNET to test and send an email to myself... why does it not show up in my gmail? That's a fair question. Ultimately, this is because we're only supporting base-level SMTP and not including anything like SMTP-Forwarding (yet). Once we implement this, we'll be able to forward to another mail server (and then subsequently be flagged as spam).

So the next reasonable question should be "can our mail server query the mail in the remote GMAIL server that I use?" to which I would also reply "No." No, indeed. To do this, we'd need to support IMAP which we do not support (yet).

"Okay, so we cant query the remote gmail SMTP servers, but _surely_ we can download the emails from GMAIL even if it were to delete them from the GMAIL servers and store them on our local server, right?". My reply to this would most likely be "Wow, you're leading with some very informed questions -- but no." This would be POP (Post Office Protocol), which we do not support (yet).

So... if we try to send an email using our server, where DO they go? They disappear. This is ultimately a decision that can be made by the implementer. Maybe you'll store them in the filesystem. Maybe you'll even store them under user-specific, properly-permissioned directories so that users can SSH into your mail-server box and read their own emails. Maybe you'll store them in a database. Maybe it'll be SQLite. Maybe It'll be Dynamodb. Maybe you'll make a SaaS built on this SMTP server -- and this is all possible because you understand how it works.

| Protocol | Description | Supported |
|---------|-------------|-------------|
| **SMTP** | Foundational, communication layer between client and server.| Yes |
| **POP** | Download data from other mail servers | No |
| **IMAP** | A client that queries other SMTP servers but does not own the data that it provides | No |

## The End Game

Learning is the end game. I hope you've enjoyed this little learning journey that we've been on together. Keep an eye out for more as I continue to build this out. Track the [repo here](https://github.com/bradcypert/sheesh), find live streams of building this on [my channel](https://www.youtube.com/bradcypert) and check back here for the next set of blog posts as we implement some of the "not yets" from above.  
