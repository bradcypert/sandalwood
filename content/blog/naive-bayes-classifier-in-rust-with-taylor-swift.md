---
title: "Naive Bayes Classifier in Rust trained on Taylor Swift lyrics"
date: 2023-01-22
status: publish
permalink: /naive-bayes-classifier-in-rust-with-taylor-swift
author: "Brad Cypert"
type: blog
id: 39
images:
  - pexels-markus-spiske-92083.jpg
tags:
  - bayes
  - classifier
  - rust
  - nlp
description: "I wrote a Naive Bayes Classifier in Rust and trained it on Taylor Swift Lyrics which allows us to feed our program a set of lyrics (ideally not from Taylor Swift) and classify those lyrics as more likely to be featured in a song by Country Taylor Swift (circa 1989 album) or more likely to be featured in a song by Pop Taylor Swift (post 1989 album). The classifier features ideas such as Laplace Smoothing, tokenization, reading from files and more. Let's talk through building it!"
---

A few years back [I wrote a Naive Bayes classifier in Clojure](https://www.bradcypert.com/something-nlp-ish-in-clojure/) and haven't done much with any form of machine learning (regardless of how rudimentary) since. To be honest, I was struggling to see practical applications for machine learning outside of things requiring massive neural networks. I've been able to spend some time digging deeper into machine learning and am finally starting to get a bigger picture on how a lot of things work (thanks to [While True: learn()](https://store.steampowered.com/app/619150/while_True_learn/) and a plethora [LinkedIn Learning](https://www.linkedin.com/learning/artificial-intelligence-foundations-neural-networks) and [Udemy courses on Machine Learning](https://www.udemy.com/course/tensorflow-developer-certificate-machine-learning-zero-to-mastery/)). I've also been learning Rust and thought now would be a good time to build something slightly out of my comfort zone in Rust and a small statistics project seemed to fit the bill.

So I wrote a [Naive Bayes Classifer](https://en.wikipedia.org/wiki/Naive_Bayes_classifier) in Rust and trained it on [Taylor Swift](https://www.taylorswift.com/) Lyrics which allows us to feed our program a set of lyrics (ideally not from Taylor Swift) and classify those lyrics as more likely to be featured in a song by Country Taylor Swift (circa 1989 album) or more likely to be featured in a song by Pop Taylor Swift (post 1989 album). The classifier features ideas such as Laplace Smoothing, tokenization, reading from files and more. Let's talk through building it!

## Let's build the API

[Redhat has a wonderful definition for API](https://www.redhat.com/en/topics/api/what-are-application-programming-interfaces) which states "API stands for application programming interface, which is a set of definitions and protocols for building and integrating application software." APIs are generally considered good things to think about when designing software, so we're going to start by thinking through our API.

We know that we need to train our classifier on data, and we need to feed that classifier data for it to classify. With this in mind, it makes sense that we should have two public methods for our classifier. Rust provides the trait keyword for defining groups of method signatures that encapsulate particular functionality -- the functionality of our classifier, for example. Let's go ahead and define a trait for our classifier.

```rust
pub trait Classifier {
  fn train(&mut self, file_name: &str) -> String,
  fn classify(&self, input: &str) -> String,
}
```

In Rust, we can use a `struct` to define a data structure and implement methods on that via the `impl` keyword. We'll end up using the impl keyword twice here -- once to implement the above trait and once more to implement a static `new` method as well as a helper. But before we can start implementing, we need to define our actual data structure. We'll store three fields here, a hashset of all of our ["tokens"](https://neptune.ai/blog/tokenization-in-nlp), a hashmap of occurances for each of our country tokens, and a hashmap of occurances our pop tokens.

```rust
struct NaiveBayesClassifier {
    pub tokens: HashSet<String>,
    pub tokens_country: HashMap<String, i32>,
    pub tokens_pop: HashMap<String, i32>,
}
```

Now we can implement a few methods on our Classifier! (Disclaimer: this works but im sure it can be better written by someone more experienced with Rust).

```rust
impl NaiveBayesClassifier {
    pub fn new() -> NaiveBayesClassifier {
        NaiveBayesClassifier {
            tokens: HashSet::new(),
            tokens_country: HashMap::new(),
            tokens_pop: HashMap::new(),
        }                               
    }

    fn prob_of_tokens(&self, tokens: Vec<String>) -> (f64, f64) {    
        let total_words_pop = self.tokens_pop.iter().count() as f64;
        let total_words_country = self.tokens_country.iter().count() as f64;
        let total_unique_words = total_words_country + total_words_pop;

        let mut word_is_pop = 1f64;
        let mut word_is_country = 1f64;

        for token in tokens.iter() {
            let token_pop_count = self.tokens_pop.get(token).unwrap_or(&0);
            let token_country_count = self.tokens_country.get(token).unwrap_or(&0);

            word_is_pop *= (token_pop_count+1) as f64 / (total_words_pop + total_unique_words);
            word_is_country *= (token_country_count+1) as f64 / (total_words_country + total_unique_words);
        }

        (word_is_pop, word_is_country)
    }
}
```

Our `new` function is pretty simple -- we're just creating a new instance of our NaiveBayesClassifier and allocating space for our tokens hashsets and hashmaps. Our `prob_of_tokens` method is quite a bit more complicated. We're getting the number of distinct words in our pop song dataset and the same for our country dataset. We're adding those together to get our total unique words (there can be duplicates across both sets of data, this is ok). Then we're assigning two mutable variables to 1. These will hold a number representing the "weight" of whether a series of tokens are more likely to be country or pop.

We're then iterating over the tokens provided in the method signature. For each of those tokens, we're getting the number of occurances for that token in our pop data set and country dataset (or 0 if the key doesn't exist). Then we're multiplying our mutable variables mentioned above by the token count + 1 (more on the +1 in a second) and then dividing that by the total words in that category ( + total unique words for some more smoothing). Finally, we return the values we've built up through our mathematics.

## Laplace Smoothing (or the Curse of the +1)

What happens if `token_pop_count` or `token_country_count` is 0? Well, we know that 0 / anything = 0 which completely ruins our probability calculation. In most cases you won't want to give things a 0% probability if a word is not included in training set. For example, if Skyscraper isn't in our country set but we ask our classifier to classify Demi Lovato's Skyscraper (which includes the word "Skyscraper"), our probability would be 0 for country simply because Skyscraper wasn't included. Pierre-Simon Laplace ran into a similar problem when trying to find the probability that the sun would rise tomorrow. He believed that even given a large sample size of days where the sun did rise, we couldnt be certain it would rise tomorrow.

I won't go too in depth into [Laplace Smoothing](https://en.wikipedia.org/wiki/Additive_smoothing), but it involves a Pseudocount which in our case was set to 1. Again this helps avoid scenarios where we'd be working with fractions with a 0 in the numerator.

## Implementing Classifier

With these steps out of the way, we can implement our Classifier trait for our NaiveBayesClassifier struct! In doing so, we will create implementations for the two public methods defined in our trait. Let's get to it!

```rust
impl Classifier for NaiveBayesClassifier {
    fn train(&mut self, file_name: &str) -> std::io::Result<()> {
        let file = File::open(file_name);

        match file {
            Ok(mut file) => {
                let mut contents = String::new();
                file.read_to_string(&mut contents)?;

                for token in tokenize(&contents) {
                    self.tokens.insert(token.to_string());

                    if file_name.ends_with("swift_country.txt") {
                        *self.tokens_country.entry(token.to_string()).or_insert(0) += 1;
                    } else {
                        *self.tokens_pop.entry(token.to_string()).or_insert(0) += 1;
                    }
                }
                Ok(())

        },
            Err(_) => panic!("Unable to open file")
        }
    }

    fn classify(&self, input: &str) -> String {
        let lower_input = input.to_lowercase();
        let input_tokens = tokenize(&lower_input);
        let (prob_pop, prob_country) = self.prob_of_tokens(input_tokens);
        
        let country_likeliness = prob_country / (prob_country + prob_pop);
        let pop_likeliness = prob_pop / (prob_pop + prob_country);

        println!("country: {:?} || pop: {:?}", country_likeliness, pop_likeliness);

        if pop_likeliness < country_likeliness {
            "Country".to_string()
        } else {
            "Pop".to_string()
        }
    }
}
```

Both of these methods are fairly simple  (the heavy lifting was done in `prob_of_tokens`). `train` takes in a file name and reads the contents of that file to a string, then calls tokenize on that string and iterates through the response of tokenize (we havent written tokenize yet, but we will in a moment). For each of those tokens, we'll insert it into our tokens hashset and if we're working with the country dataset, we'll add them to the country hashmap and the same goes for pop when working with the pop dataset. We're returning a std::io::Result so that we can use the `?` operator to unwrap values or return errors. This means that we need to return a Result so when we finish parsing our tokens, we return `Ok(())`. If we weren't able to open the file by the provided filepath, we panic instead.

`classify` takes in an input string and uses the `prob_of_tokens` method we wrote earlier to get the probability of those tokens belonging in the pop or country dataset. Finally we divide the probability of each by the probabilities provided by both of the categories added together. We have a println! here for debugging purposes, but it was helpful to see the numbers we were generating. Lastly if the likeness of pop is less than country, we return "Country" else we return "Pop".

## Tokenize and Main

We still need to write our tokenize method, but thankfully its very simple.

```rust
fn tokenize(input: &str) -> Vec<String> {
    let lowercase = &input.to_lowercase()[..];
    Regex::new(r"[a-z]+")
        .unwrap()
        .find_iter(lowercase)
        .map(|e| e.as_str().to_owned())
        .collect()
}
```

This function simply takes in our input string, lowercase it, and then use a regex to filter out non lowercase-alpha values. Our main method will ultimately look something like this:

```rust
fn main() -> std::io::Result<()> {
    let mut classifier = NaiveBayesClassifier::new(); 
    classifier.train("./src/swift_country.txt")?;
    classifier.train("./src/swift_pop.txt")?;

    // Garth Brooks
    println!("{}", classifier.classify("Blame it all on my roots, I showed up in boots And ruined your black tie affair. The last one to know, the last one to show. I was the last one you thought you'd see there"));

    // Taylor Swift
    println!("{}", classifier.classify("I wanna be your end game. I wanna be your first string. I wanna be your A-Team. I wanna be your end game, end game"));

    println!("{}", classifier.classify("When I was a young boy, my father took me into the city to see a marching band. He said son when you grow up will you be the savior of the broken, the beaten and the damned."));

    println!("{}", classifier.classify("Oh say can you see by the dawns early light what so proudly we hailed at the twilight's last gleaming. Who's broad stripes and bright stars."));

    Ok(())
}
```

Here we're defining our program's main method which returns a std::io::Result. The body of this method news up a classifier and then trains it against our dataset. Then, we take some lyrics and run those through the classification engine and print out the results.

## Cleaning our Data

Arguably the most painful part of this project was sourcing the lyrics for our data set and then cleaning data so that it was useful (and truth be told, I _still_ didn't clean it all). As with any machine learning project, you'll ideally want clean data in a standard format. My dataset originally looked like a mangled Git diff (there were >>>'s to denote album names and >> for song names), and the dataset still has some oddities like square-brackets used to signify backup vocals, specific musical transitions, etc. Theres not a ton to add here but I wanted to take some space to remind you to try to clean and standardize your data before starting your next machine learning project.

## Putting it all together

We've scattered a lot of code throughout this post, so I'm just going to go ahead and put it all together into one snippet. Feel free to copy/paste/remix as you'd like!

```rust
use std::{collections::{HashMap, HashSet}, fs::File};
use std::io::Read;

extern crate regex;
use regex::Regex;

pub trait Classifier {
  fn train(&mut self, file_name: &str) -> std::io::Result<()>;
  fn classify(&self, input: &str) -> String;
}

struct NaiveBayesClassifier {
    pub tokens: HashSet<String>,
    pub tokens_country: HashMap<String, i32>,
    pub tokens_pop: HashMap<String, i32>,
}

impl NaiveBayesClassifier {
    pub fn new() -> NaiveBayesClassifier {
        NaiveBayesClassifier {
            tokens: HashSet::new(),
            tokens_country: HashMap::new(),
            tokens_pop: HashMap::new(),
        }                               
    }

    fn prob_of_tokens(&self, tokens: Vec<String>) -> (f64, f64) {    
        let total_words_pop = self.tokens_pop.iter().count() as f64;
        let total_words_country = self.tokens_country.iter().count() as f64;
        let total_unique_words = total_words_country + total_words_pop;

        let mut word_is_pop = 1f64;
        let mut word_is_country = 1f64;

        for token in tokens.iter() {
            let token_pop_count = self.tokens_pop.get(token).unwrap_or(&0);
            let token_country_count = self.tokens_country.get(token).unwrap_or(&0);

            word_is_pop *= (token_pop_count+1) as f64 / (total_words_pop + total_unique_words);
            word_is_country *= (token_country_count+1) as f64 / (total_words_country + total_unique_words);
        }

        (word_is_pop, word_is_country)
    }

}

impl Classifier for NaiveBayesClassifier {
    fn train(&mut self, file_name: &str) -> std::io::Result<()> {
        let file = File::open(file_name);

        match file {
            Ok(mut file) => {
                let mut contents = String::new();
                file.read_to_string(&mut contents)?;

                for token in tokenize(&contents) {
                    self.tokens.insert(token.to_string());

                    if file_name.ends_with("swift_country.txt") {
                        *self.tokens_country.entry(token.to_string()).or_insert(0) += 1;
                    } else {
                        *self.tokens_pop.entry(token.to_string()).or_insert(0) += 1;
                    }
                }
                Ok(())

        },
            Err(_) => panic!("Unable to open file")
        }
    }

    fn classify(&self, input: &str) -> String {
        let lower_input = input.to_lowercase();
        let input_tokens = tokenize(&lower_input);
        let (prob_pop, prob_country) = self.prob_of_tokens(input_tokens);
        
        let country_likeliness = prob_country / (prob_country + prob_pop);
        let pop_likeliness = prob_pop / (prob_pop + prob_country);

        println!("country: {:?} || pop: {:?}", country_likeliness, pop_likeliness);

        if pop_likeliness < country_likeliness {
            "Country".to_string()
        } else {
            "Pop".to_string()
        }
    }
}

fn tokenize(input: &str) -> Vec<String> {
    let lowercase = &input.to_lowercase()[..];
    Regex::new(r"[a-z]+")
        .unwrap()
        .find_iter(lowercase)
        .map(|e| e.as_str().to_owned())
        .collect()
}

fn main() -> std::io::Result<()> {
    let mut classifier = NaiveBayesClassifier::new(); 
    classifier.train("./src/swift_country.txt")?;
    classifier.train("./src/swift_pop.txt")?;

    // Garth Brooks
    println!("{}", classifier.classify("Blame it all on my roots, I showed up in boots And ruined your black tie affair. The last one to know, the last one to show. I was the last one you thought you'd see there"));

    // Taylor Swift
    println!("{}", classifier.classify("I wanna be your end game. I wanna be your first string. I wanna be your A-Team. I wanna be your end game, end game"));

    println!("{}", classifier.classify("When I was a young boy, my father took me into the city to see a marching band. He said son when you grow up will you be the savior of the broken, the beaten and the damned."));

    println!("{}", classifier.classify("Oh say can you see by the dawns early light what so proudly we hailed at the twilight's last gleaming. Who's broad stripes and bright stars."));

    Ok(())
}
```
