---
title: "A brief summary on Automated Testing"
date: 2016-08-20
status: publish
permalink: /a-brief-summary-on-automated-testing
author: "Brad Cypert"
excerpt: ""
type: blog
id: 28
category:
  - javascript
  - Testing
tags:
  - javascript
  - testing
post_format: []
description: "There are many ways to handle automated testing via unit tests, but these tips are some of my favorite."
---

I recently read this [amazing article](https://www.toptal.com/javascript/writing-testable-code-in-javascript) by [Josh Mock](https://twitter.com/joshmock) and felt the need to share it. In fact, the tools he uses in his examples – JavaScript, Mocha+Chai, and Phantom are the tools I use daily to do the same thing.

I can’t stress enough how great his article is, especially if you’ve written some tests before but you’re not sure how to write a **good** test. That being said, there’s a few more things I’d like to cover and add to it.

In summary, Josh covers the following things:

- Keep Business and Display Logic Separate
- Run async code in a stub-able manner. Such as a callback or promise.
- Avoid side effects (this makes every part of development easier, not just testing).
- Use dependency injection
- Give each function a single-purpose (but all of your functions are already that way anyways, right?)
- Avoid mutations and side effects
- Write your tests before you code (practice TDD)

Overall, I agree with these things, but I’d like to add a few extra points that I think can really drive some of Josh’s principles home.

#### Don’t Test External Libraries

You probably depend on JQuery. You may depend on underscore, or React, or AngularJS. These all have extremely extensive test suites to make sure they work. If you’re using a stable release, 99% of the library probably works as expected. You don’t need to test that JQuery’s element.onClick adds an onclick listener to an element. They have a test suite that already checks this for you and is ran before each build.

#### Coverage

Test coverage is often a wash. It’s a weird metric that can provide some insight into how your code is tested, but there’s not really a “good” or “bad” when it comes to coverage. Generally, I try to aim for ~80% coverage. Why? There are some things that aren’t worth covering.

Sometimes we create a function that wraps something like `window.location`, sometimes we create a function to interface with local storage. If these are simple enough, we don’t necessarily need to test them. Why? Let’s get to that right now.

#### Testing Behavior

If you’re writing small, composable functions, then you’ll easily understand why testing each function can be an undertaking. That being said, don’t make a bigger function just to make it easier to test. Instead, test function chains to ensure that they result in the behavior or value that you want.

While on that subject, I can’t stress enough – Don’t test that a function calls another function.

**When A() is called, I’m expecting B() to be called with these parameters.**

Why does this matter? No one cares that B() is called with those parameters. What they care about is the end result. Try this instead.

**When A() is called, I’m expecting to be returned an object with the `name` property set.**

Hopefully the difference is obvious. Testing for values lends itself towards tests that do not break when you refactor code. If you write tests that prevent you from easily refactoring, one of two things will happen – You’ll remove the tests or you won’t refactor.


#### Spies, Stubs, Mocks

Testing isn’t always easy. Engineers who can confidently test know how to prevent certain code from being ran in their tests. Why would you want to do this? Well, you don’t want to make an actual XHR request when you call `$.ajax()`. Perhaps your test machine cant actually create another thread to run your tests. There’s a lot of reasons to do this, and you have a few options – Stubs or Mocks. I heavily try to avoid mocks.

First, let’s talk about Spies. For the sake of simplicity, I’ll assume we’re using the **Sinon.js** library – a very common test helper for JavaScript. A spy is exactly what it sounds like. If you have a function called `moveAcrossTheBattlefield()`, and you spy on it, and then call it in test – You will call the function as expected, but also get extra information about it. Some of the information available with Sinon is `callCount` or `called`.

Stubs are spies, but they prevent the underlying function from executing. These are the bread and butter of testing boundaries. If you’re delegating to JQuery, Underscore, multithreading or making an XHR request, you probably want to leverage the support of stubs. Let’s talk the following example.

```javascript
function fetch() {
  return $.GET("/foo");
}
```

We don’t actually want to make an XHR request during test – it could slow down the tests, network failures can cause intermittent test failures (flaky tests), or maybe we don’t want to make a **POST** or **DELETE** against an actual server. How we do we handle this in our tests?

```javascript
describe("fetch", function(){
  it("should return a promise", function() {
    Sinon.stub($, "GET", function() {return new Promise(...);});
    var result = fetch();
    //hacky expectation, but you get the point
    expect(result.toString() === "[object Promise]")
  });
});

```

What is a mock? A mock is a total replacement for certain objects. In the sinon world, they have built in expectations as well. I try my best to avoid them, as stubs usually handle what I need without distancing me from my code as far as mocks do. If you’re interested in learning more about Mocks, you should check out the docs as they can explain them better than I do. [You can find the docs here](http://sinonjs.org/).

#### Test your actual code

I’ve seen this far too much. Someone comes in, write some code, and tries to test it but has a hard time, so they mock **everything** in sight. This means your tests aren’t running against your code, or even your code with mocked dependencies, but you’re testing against your mocks only. This means that your tests actually provide no real coverage.

This isn’t just in unit testing, either. If you’re wanting to test that your code, feature, or app works as expected, you need to mock as little as possible. Stub as little as possible as well. These are tools to help you get around the difficulties of layers of dependencies, but abusing them can ruin your tests.

#### Test for the User

If you’re doing automated tests with Selenium, or Casper.js, or something similar, keep in mind that the real user uses the real application. You can mock a TON of data or even entire features but that’s not what your users will see.

In fact, I use a metric called “Code confidence” when I’m evaluating tests. It basically represents “how confident do I feel that if these tests run, they accurately represent that the application will work for a user?”. As you add more and more abstractions inbetween your tests and your code, this number decreases. If it’s anything below 90% (I don’t have a real formula for calculating this), I don’t feel comfortable telling someone that my code, feature, or app works as expected.

#### Conclusion

Josh has some amazing points about testing. You’ve seen my additions to his article above. What do you think? Are there any things that I’ve missed that you think deserve attention when testing?
