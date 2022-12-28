---
title: "A Brief Introduction to Tries"
date: 2017-06-30
status: publish
permalink: /a-brief-introduction-to-tries
author: "Brad Cypert"
excerpt: ""
type: blog
id: 63
category:
  - Algorithms
  - Java
tags:
  - data-structures
  - java
  - trie
description: "Tries are a type of search tree commonly used for storing and searching single characters that make up one or more strings. Learn to create them in Java!"
---

Hello there! Welcome back! Today I’m talking about Tries (pronounced “trys”). Tries are a type of search tree commonly used for storing and searching single characters that make up one or more strings. What make a trie interesting is that the first node contains an empty value and the descendants of a node have a common prefix associated with that node.

Like most data structures, tries are easier to reason about when you have a picture to help explain it. Let’s take the word “propane” break it apart into a trie. Each character will be represented as a node.

![A Trie with nodes that create the word "Propane"](/propane.png)

Simple enough, right? Let’s add “butane” (the devil’s gas) to the Trie as well!

![A Trie with nodes that create the words "Propane" and "Butane"](/propanebutane.png)

Notice that the new word branches from the root with a new character.

Here’s where it gets interesting. Let’s add “bobby” and “protein” to the tree. Bare with me and I’ll explain in a moment.

![A Trie with nodes that create the words "Propane", "Butane", "Bobby", and "Protein"](/fulltrie-2.png)

Notice that “bobby” branches off of the “b” used in “butane” and “protein” branches off of the “pro” from “propane”. Considering these concepts, you might realize that given “pro” and this data structure, we can do things like suggest words in an auto-complete fashion or even if a word is a valid word (compared against our trie). You could even use it to help you find the best word at scrabble!

You might be thinking “Brad, wait. ‘pro’ is a real word too.” You’re right. So we’d mark “pro” as a word in our data structure even though there are nodes coming off of it. Let’s move over to code so you can see how this is done.

#### The data structure in Java

Here’s how we can implement a node in our trie:

```java
class Trie {
    char c;
    Trie[] children;
    boolean word;

    public Trie() {
        this.c = 0;
        children = new Trie[26];
        this.word = false;
    }
}

```

We can use the `word` boolean to determine if a node is a word. We’re using `c` to store the current character and `children` is initialized to 26 because there are 26 letters in the English alphabet. We’ll set this when we build our trie from preset strings. In fact, let’s write that add method now.

#### Adding a word to the trie

```java
 /**
     * Adds a word to the trie
     * @param toAdd
     */
    public void add(String toAdd) {
        if (toAdd.length() == 0) {
            return;
        }
        //convert array index down to 0th indexing
        int index = toAdd.charAt(0) - 'a';

        if (this.children[index] == null) {
            this.children[index] = new Trie();
        }

        if (toAdd.length() == 1) {
            this.children[index].word = true;
        }

        this.children[index].c = toAdd.charAt(0);

        this.children[index].add(toAdd.substring(1));
    }

```

The `add` method takes in the string that we’d like to add to our trie. This method completes the following steps for us:

1. It converts the first character of the string to an array-based index. In Java, you can subtract one char from another to get the charcode. Since lowercase “a” is our base, we can subtract that from our character to bring us to 0th indexing.
2. If a child at that index is not already present, we create a trie to and store it as a child at that index. Then, we set the the current node’s character to the current character.
3. Finally, we call add using the tail of the string and the child node.

#### Check to see if a word exists in the trie

Let’s go ahead and implement the isWord method as well. This method will take our current trie and search for a word in it to see if it exists. This functional will also be recursive.

```java
/**
 * Checks to see if a word exists in the trie
 * @param search
 * @return
 */
public boolean isWord(String search) {
    int index = search.charAt(0) - 'a';

    if (this.children[index] == null) {
        return false;
    }

    if (search.length() == 1) {
        return this.children[index].word;
    }

    return this.children[index].isWord(search.substring(1));
}
```

This function does the following:

1. We do the same character to index conversion mentioned above (sounds like we should refactor!)
2. This time if the index is null that means that the current character is not a child of the parent node. This means that we’ll return `false` because our word is not in the trie.
3. If there is an index, we call `isWord` with the tail of the string on the child node.

We now have a fun, usable data structure. We can add words to trie and then check to see if words exist in the trie! But we need to go deeper!

#### Autocompletion (simple text prediction)

Let’s add a method to give us the words that exist branched off of a given string. For example “pr” would give us “propane” and “protein”. For this, we’ll store things in an ArrayList so please don’t forget to import `java.util.ArrayList`. We’ll write two methods. The public method will do the following:

1. Traverse the trie to the most relevant node given a string. For example if the string is “pr”, we’ll traverse from root-&gt;”p”-&gt;”r”.
2. Initialize an ArrayList to hold the words that we find.
3. Set the current node to itself.
4. Call the private method with the values mentioned above.
5. Convert the arraylist into a String array.

The private function will do the following:

1. Check to see if the current node has the word flag set to true. If so, we add that word to the ArrayList.
2. Iterate through the current node’s children and recurse.
3. If our node is null, we can just return and skip this call.

```java
/**
 * Traverses to the node that represents the string
 * then calls the private helper below
 * @param search
 * @return
 */
public String[] predict(String search) {
    ArrayList<String> words = new ArrayList<>();
    Trie node = this;

    //traverse the trie
    for (int i = 0; i < search.length(); i++) {
        //convert array index down to 0th indexing
        int index = search.charAt(i) - 'a';

        if (node.children[index] == null) {
            return new String[0];
        }


        node = node.children[index];
    }
    predict(search, node, words);

    return words.toArray(new String[0]);
}

/**
 * This populates the provided arraylist with word suggestions
 * @param search - String you're predicting against
 * @param node - node to predict from
 * @param words - reference to an arraylist to hold word suggestions
 */
private void predict(String search, Trie node, ArrayList<String> words) {
    if (node.word) {
        words.add(search);
    }

    Trie[] childNodes = node.children;
    for (Trie childNode : childNodes) {
        if (childNode != null) {
            char childChar = childNode.c;
            predict(search + Character.toString(childChar), childNode, words);
        }
    }
}

```

#### A main method to test against

Great, so this should allow us to enter a key to autocomplete. Let’s go ahead and write a main method to give it a shot!

```java
public class Main {

    public static void main(String[] args) {
        Trie root = new Trie();
        root.add("car");
        root.add("carbon");
        root.add("carriage");
        root.add("cartoon");
        root.add("butane");
        root.add("propane");
        root.add("arlington");

        System.out.println(root.isWord("cartoon"));
        System.out.println(root.isWord("bobby"));
        System.out.println(root.isWord("cotton"));

        String[] s = root.predict("ca");
        for (int i = 0; i < s.length; i++) {
            System.out.println(s[i]);
        }
    }
}

```

#### Test it out

Running this gives us output like so:

```
true
false
false
car
carbon
carriage
cartoon

Process finished with exit code 0
```

#### TLDR: Here’s the source code

```java
package com.bradcypert;

import java.util.ArrayList;

class Trie {
    char c;
    Trie[] children;
    boolean word;

    public Trie() {
        this.c = 0;
        children = new Trie[26];
        this.word = false;
    }

    /**
     * Adds a word to the trie
     * @param toAdd
     */
    public void add(String toAdd) {
        if (toAdd.length() == 0) {
            return;
        }
        //convert array index down to 0th indexing
        int index = toAdd.charAt(0) - 'a';

        if (this.children[index] == null) {
            this.children[index] = new Trie();
        }

        if (toAdd.length() == 1) {
            this.children[index].word = true;
        }

        this.children[index].c = toAdd.charAt(0);

        this.children[index].add(toAdd.substring(1));
    }

    /**
     * Checks to see if a word exists in the trie
     * @param search
     * @return
     */
    public boolean isWord(String search) {
        int index = search.charAt(0) - 'a';

        if (this.children[index] == null) {
            return false;
        }

        if (search.length() == 1) {
            return this.children[index].word;
        }

        return this.children[index].isWord(search.substring(1));
    }

    /**
     * Traverses to the node that represents the string
     * then calls the private helper below
     * @param search
     * @return
     */
    public String[] predict(String search) {
        ArrayList<String> words = new ArrayList<>();
        Trie node = this;

        //traverse the trie
        for (int i = 0; i < search.length(); i++) {
            //convert array index down to 0th indexing
            int index = search.charAt(i) - 'a';

            if (node.children[index] == null) {
                return new String[0];
            }


            node = node.children[index];
        }
        predict(search, node, words);

        return words.toArray(new String[0]);
    }

    /**
     * This populates the provided ArrayList with word suggestions
     * @param search - String you're predicting against
     * @param node - node to predict from
     * @param words - reference to an arraylist to hold word suggestions
     */
    private void predict(String search, Trie node, ArrayList<String> words) {
        if (node.word) {
            words.add(search);
        }

        Trie[] childNodes = node.children;
        for (Trie childNode : childNodes) {
            if (childNode != null) {
                char childChar = childNode.c;
                predict(search + Character.toString(childChar), childNode, words);
            }
        }
    }

}

public class Main {

    public static void main(String[] args) {
        Trie root = new Trie();
        root.add("car");
        root.add("carbon");
        root.add("carriage");
        root.add("cartoon");
        root.add("butane");
        root.add("propane");
        root.add("arlington");

        System.out.println(root.isWord("cartoon"));
        System.out.println(root.isWord("bobby"));
        System.out.println(root.isWord("cotton"));

        String[] s = root.predict("ca");
        for (int i = 0; i < s.length; i++) {
            System.out.println(s[i]);
        }
    }
}
```
