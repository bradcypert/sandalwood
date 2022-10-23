---
title: "5 Programming Languages You Should Really Try"
date: 2017-06-28
status: publish
permalink: /5-programming-languages-you-could-learn-from
author: "Brad Cypert"
excerpt: ""
type: blog
id: 62
category:
  - Meta
tags:
  - clojure
  - "f#"
  - go
  - meta
  - nim
  - rust
post_format: []
_yoast_wpseo_title:
  - "5 Programming Languages You Should Really Try"
---

For some strange reason, the vast majority of my blog readers are Python Developers. I wrote two articles on Python a long time ago and honestly try to avoid python when I can. So here’s an article for you purveyors of Python — you sultans of snakes.

**Note: This article is still likely relevant even if you’re not a Pythonista**.

For those who aren’t aware, Linguistics and Grammars are particularly interesting to me. I really, really enjoy looking into new languages and comparing them to what I already know. Originally, this started as a purely syntactic thing, but as I learned more about compilers, virtual machines, and performance I started to compare those as well. We’ll cover a little bit of everything in this post as I suggest a few great languages that you’ve probably not tried yet. I’ll count down in terms of favorites:

#### 5. Nim

> Efficient and expressive programming.  
>  Nim is a systems and applications programming language. Statically typed and compiled, it provides unparalleled performance in an elegant package.

[Nim](https://nim-lang.org/) is a language near and dear to my heart, although I’ll be honest and admit that I haven’t had as much time with it as I wish. The little I have toyed with the language was a delightful experience. Nim is interesting as it compiles down to C, C++, or JavaScript. This allows you to tackle systems programming in Nim with (almost) the gusto that you’d expect in C or C++. Nim also takes a page from Clojure’s book in that it allows you to compile to JavaScript. The build process for Nim is what any systems developer would expect. It’s compiled, so you produce a nice portable (dependency-free) binary. Just target your build and run!

Nim is also high extensible via templates and macros. These are processed as compiler time transformations. That’s pretty cool, but what if I told you the compiler was extensible too? Well great news, in nim, it is!

**Python Developers**: Nim takes a ton of concepts from Python’s book. Specifically several of the constructs in Nim’s standard library are pretty Pythonic.

**C, C++, Java Developers**: Nim should syntactically look comfortable, but one interesting benefit you’ll get with Nim is a configurable garbage collector. You can choose to use a deferring garbage collector or something real-time and deterministic. Pretty neat!

To give you some syntax to compare, here’s quicksort in Nim, courtesy of Rosetta Code:

```nim
proc quickSort[T](a: var openarray[T], inl = 0, inr = -1) =
  var r = if inr >= 0: inr else: a.high
  var l = inl
  let n = r - l + 1
  if n < 2: return
  let p = a[l + 3 * n div 4]
  while l <= r:
    if a[l] < p:
      inc l
      continue
    if a[r] > p:
      dec r
      continue
    if l <= r:
      swap a[l], a[r]
      inc l
      dec r
  quickSort(a, inl, r)
  quickSort(a, l, inr)

var a = @[4, 65, 2, -31, 0, 99, 2, 83, 782]
quickSort a
echo a
```

#### 4. Go

> Go is an open source programming language that makes it easy to build simple, reliable, and efficient software.

[Google’s Go](https://golang.org/) is an interesting language. In fact, Python used to be what I would recommend to people getting into development, but I think I’m at the point that I would recommend go instead now. For those unaware, Go has been around since 2007 although it has only recently caught fire with it’s popularity and wasn’t announce by Google until 2009. I really like how simple and straightforward Go is. It’s easy to accomplish a lot in a relatively small amount of time — one of my initial selling points on Python many years ago. The build process for Go is similar to Nim’s. You get a nice portable binary and can run with that!

Async in go is simplified into the concept of channels which are a breeze to work with. You’ll see these in async code alongside of goroutines which simplify the concept of multithreading.

**Python Developers**: Go clearly emanates from C, but with an interesting twist focused on brevity, simplicity and safety. Similarly to Python’s “Batteries Included” go ships with a really great package manager to help you get started as quickly as possible.

**C, C++, Java Developers**: Syntactically, Go is really similar to this suite of languages. Go is (almost certainly) going to be slightly less performant than C, but still very fast. Another great selling point for Go is it’s focus on types and interfaces (if you’re not using interfaces you really should be).

To give you some syntax to compare, here’s quicksort in Go, courtesy of Rosetta Code:

```go
package main

import "fmt"

func main() {
    list := []int{31, 41, 59, 26, 53, 58, 97, 93, 23, 84}
    fmt.Println("unsorted:", list)

    quicksort(list)
    fmt.Println("sorted!  ", list)
}

func quicksort(a []int) {
    var pex func(int, int)
    pex = func(lower, upper int) {
        for {
            switch upper - lower {
            case -1, 0: // 0 or 1 item in segment.  nothing to do here!
                return
            case 1: // 2 items in segment
                // < operator respects strict weak order
                if a[upper] < a[lower] {
                    // a quick exchange and we're done.
                    a[upper], a[lower] = a[lower], a[upper]
                }
                return
            // Hoare suggests optimized sort-3 or sort-4 algorithms here,
            // but does not provide an algorithm.
            }

            // Hoare stresses picking a bound in a way to avoid worst case
            // behavior, but offers no suggestions other than picking a
            // random element.  A function call to get a random number is
            // relatively expensive, so the method used here is to simply
            // choose the middle element.  This at least avoids worst case
            // behavior for the obvious common case of an already sorted list.
            bx := (upper + lower) / 2
            b := a[bx]  // b = Hoare's "bound" (aka "pivot")
            lp := lower // lp = Hoare's "lower pointer"
            up := upper // up = Hoare's "upper pointer"
        outer:
            for {
                // use < operator to respect strict weak order
                for lp < upper && !(b < a[lp]) {
                    lp++
                }
                for {
                    if lp > up {
                        // "pointers crossed!"
                        break outer
                    }
                    // < operator for strict weak order
                    if a[up] < b {
                        break // inner
                    }
                    up--
                }
                // exchange
                a[lp], a[up] = a[up], a[lp]
                lp++
                up--
            }
            // segment boundary is between up and lp, but lp-up might be
            // 1 or 2, so just call segment boundary between lp-1 and lp.
            if bx < lp {
                // bound was in lower segment
                if bx < lp-1 {
                    // exchange bx with lp-1
                    a[bx], a[lp-1] = a[lp-1], b
                }
                up = lp - 2
            } else {
                // bound was in upper segment
                if bx > lp {
                    // exchange
                    a[bx], a[lp] = a[lp], b
                }
                up = lp - 1
                lp++
            }
            // "postpone the larger of the two segments" = recurse on
            // the smaller segment, then iterate on the remaining one.
            if up-lower < upper-lp {
                pex(lower, up)
                lower = lp
            } else {
                pex(lp, upper)
                upper = up
            }
        }
    }
    pex(0, len(a)-1)
}

```

#### 3. F#

> F# is a mature, open source, cross-platform, functional-first programming language. It empowers users and organizations to tackle complex computing problems with simple, maintainable and robust code.

Let’s get into my favorite territory – functional programming languages. Have you had the chance to check out [F#](http://fsharp.org/) yet? No? Well you’re missing out on a lot. Let’s clear the air about the negatives – It was created as a Microsoft language. You’re going to get the most from the language if you can leverage the .NET framework. You don’t HAVE to do this, however, and can build F# against Mono, too.

I was first exposed to Metalanguages in college and they <del>blew my mind</del> really frustrated me. During the final weeks of my course on Functional Programming (with PolyML), it all kind of clicked and I really started to dig the language family. That being said, after doing a little bit of research, I felt that Metalanguage’s like PolyML and F# (wasn’t aware of F# at the time) just weren’t practical. Later in my life I found F# and fell in love. If I ever end up working in a .NET shop, you can bet your ass I’m working with F#.

The language is syntactically extremely different from everything you’ve seen above. Functional languages often take a very declarative approach on problem solving and leverage recursion and pattern matching to make the most of their toolkit. F# is no exception to this paradigm.

**.NET Developers**: A functional approach on your standard toolkit. If you want to try F# and need help introducing it to your team consider building a CLI with the language. It’s an excellent tool for this and really showcases its strengths.

**Python Developers**: Python is an outstanding tool for writing CLIs. F#, too, is an outstanding tool for writing CLIs. The language feels like a strong scripting language but provides so much more. In fact, tools like Pattern Matching make writing a CLI tool such an ease!

**C, C++, Java Developers**: Take a walk on the wild side. In my opinion, the biggest growth moment in my career as an engineer was the day I committed to learning functional programming. I still write Java a lot but you can see functional influence in a lot of ways. F# provides a great opportunity to help teach you these functional programming skills that can be applied in any language. It will also make you want to file an RFC for pattern matching in Java.

To give you some syntax to compare, here’s quicksort in F#, courtesy of Rosetta Code:

Some things to keep in mind – `rec` defines a function as recursive so that the function has access to a binding of itself. The line under the function definition is a base-case pattern matcher against an empty list. The one below that matches on a list with a head element and a tail.

```f#
let rec qsort = function
    [] -> []
    | hd :: tl ->
        let less, greater = List.partition ((>=) hd) tl
        List.concat [qsort less; [hd]; qsort greater]

```

#### 2. Rust

> Rust is a systems programming language that runs blazingly fast, prevents segfaults, and guarantees thread safety.

Above is a quote from the [Rust website](https://www.rust-lang.org/en-US/). I couldn’t give a better quick summary of this language if I tried. Rust is fantastic. I first got into Rust with hardware hacking on the Arduino and just fell in love with the language. Rust focuses on the things that I love about Clojure but provides them in a systems language. The language itself focuses on immutability and thread-safety. The community is wonderful, supportive, and very responsive and open to feedback.

The difficult and sometimes discouraging part of writing Rust is “fighting” the compiler. The reason that the compiler seems so aggressive is because it’s helping you prevent issues and write safe code. Mainly, new Rustaceans fight the borrow checker as the idea of borrowing is usually a very new concept. For those who are unaware, the way Rust maintains its ability to stay threadsafe is by “borrowing” references from one scope into another. This can be really difficult at first but once you learn how borrowing works (as well as the object lifecycle) Rust becomes a delightful experience. Plus, it runs blazingly fast!

**Python Developers**: If you want a new experience that will focus on teaching you the values of immutability and the merits of a compiler (you may already know these things), look no further. The community is one of the few communities that I feel is better (that’s right, better) than the Python community. If you’ve ever wanted to get into systems programming but have had fear of SegFaults or memory management, try Rust.

**C, C++, Java Developers:** Another language in a style that should be syntactically familiar to you, but Rust is a completely different paradigm on memory management. The Lifecycles cause heap values to drop once they leave scope which helps maintain a manageable set of memory addresses. Rust also supports the `unsafe` keyword, should you feel the need to get down and dirty with C like code, however writing `unsafe` always makes me feel guilty and usually leads to refactoring.

To give you some syntax to compare, here’s quicksort in Rust, courtesy of Rosetta Code:

```rust
fn main() {
    println!("Sort numbers in descending order");
    let mut numbers = [4, 65, 2, -31, 0, 99, 2, 83, 782, 1];
    println!("Before: {:?}", numbers);

    quick_sort(&mut numbers, &|x,y| x > y);
    println!("After:  {:?}n", numbers);

    println!("Sort strings alphabetically");
    let mut strings = ["beach", "hotel", "airplane", "car", "house", "art"];
    println!("Before: {:?}", strings);

    quick_sort(&mut strings, &|x,y| x < y);
    println!("After:  {:?}n", strings);

    println!("Sort strings by length");
    println!("Before: {:?}", strings);

    quick_sort(&mut strings, &|x,y| x.len() < y.len());
    println!("After:  {:?}", strings);
}

fn quick_sort<T,F>(v: &mut [T], f: &F)
    where F: Fn(&T,&T) -> bool
{
    let len = v.len();
    if len >= 2 {
        let pivot_index = partition(v, f);
        quick_sort(&mut v[0..pivot_index], f);
        quick_sort(&mut v[pivot_index + 1..len], f);
    }
}

fn partition<T,F>(v: &mut [T], f: &F) -> usize
    where F: Fn(&T,&T) -> bool
{
    let len = v.len();
    let pivot_index = len / 2;

    v.swap(pivot_index, len - 1);

    let mut store_index = 0;
    for i in 0..len - 1 {
        if f(&v[i], &v[len - 1]) {
            v.swap(i, store_index);
            store_index += 1;
        }
    }

    v.swap(store_index, len - 1);
    store_index
}

```

#### 1. Clojure

> Clojure is a robust, practical, and fast programming language with a set of useful features that together form a simple, coherent, and powerful tool.

If you didn’t see this coming, then thanks for checking out my blog for the first time! [Clojure](https://clojure.org/) is a Lisp that (often) runs on the JVM. It’s a symbiotic language which means that I can be ran anywhere that it has a host for. In fact, another common use-case for Clojure is compiliation down to JavaScript, called ClojureScript. If you’re in the web development community, you’ve probably heard of ClojureScript as it’s really caught on in regards to it’s popularity lately thanks to Om and Om Next.

Clojure is the brainchild of the wizard known as Rich Hickey. The community as a whole provides a refreshing perspective on software development and having Rich at the helm is nothing to discount. There’s a database written with Clojure in mind (Datomic) and the tooling for the language is fantastic.

The structure of lisp and the paradigms behind it are nothing short of liberating. When functions dictate your code everything becomes easier to reason with. In fact, it allows you to easily write and reason about macros and I’ve struggled with these concepts historically in other languages that support them.

Speaking of tools, on the JVM, you can leverage any and all Java libraries in your Clojure code. This interoperability gives Clojure a massive collection of libraries despite the community being smaller than the Java community. A downside of Clojure is that it’s limitation is often the same that confines the JVM (no tail call recursion), but Clojure makes a strong effort to abstract these concerns or provide alternatives.

In my opinion, Clojure is a tool that can be used for almost any job and I love the idea of that. There’s even a library for writing Android applications in Clojure (and a pretty notable app called Swiftkey written in Clojure) and a ton of libraries for graphics processing.

I’ll try to avoid ranting for hours about clojure, but if you’re interested in learning more about it, you can find my articles on the language [here](http://www.bradcypert.com/tags/clojure/).

**Python Developers**: If you’re one of the python developers that keep coming back to my blog for some reason, you’ll see most of my new articles are in Clojure. I am so very happy to teach you or work with you to help you learn about this language. As for everyone else, Clojure gives you an exciting approach on new paradigms in programming that you won’t ever find in Python.

**C, C++ Developers**: Clojure probably won’t be much of a help if you’re looking for systems development, however, if you’ve never touched Lisp you can learn a ton from writing the language. And if you’ve never written Lisp, I can’t recommend a better Lisp than Clojure. C and C++ developers will likely love the power behind Macros so be sure to give that a shot!

**Java Developers**: You can try Clojure without ever leaving your JVM. Clojure is catching on quickly in the financial tech industry and makes for excellent DSLs that interop with Java in an immaculate fashion.

To give you some syntax to compare, here’s quicksort in Clojure, courtesy of Rosetta Code:

```clojure
(defn qsort [[pivot :as coll]]
  (when pivot
    (lazy-cat (qsort (filter #(< % pivot) coll))
              (filter #{pivot} coll)
              (qsort (filter #(> % pivot) coll)))))

```
