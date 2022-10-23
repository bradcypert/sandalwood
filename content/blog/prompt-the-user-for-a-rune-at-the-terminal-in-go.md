---
title: "Prompt the user for a rune at the terminal in Go"
date: 2019-06-13
status: publish
permalink: /prompt-the-user-for-a-rune-at-the-terminal-in-go
author: "Brad Cypert"
excerpt: ""
type: blog
id: 1558
thumbnail: /Gophercolor.jpg
category:
  - Go
tags:
  - go
post_format: []
hefo_before:
  - "0"
hefo_after:
  - "0"
_yoast_wpseo_primary_category:
  - "209"
_yoast_wpseo_focuskw:
  - "prompt the user for a rune"
description:
  - "You can prompt the user for a rune in Go simply by creating a buffered reader from Stdin and then calling ReadRune() on that reader."
_yoast_wpseo_linkdex:
  - "79"
_yoast_wpseo_content_score:
  - "90"
---

I’ve been spending a lot of my spare time working on a [Go](https://golang.org/) project called [Deckard](https://github.com/bradcypert/deckard). It’s a [command line interface (or CLI)](https://en.wikipedia.org/wiki/Command-line_interface) for handling database schema changes. Recently, I found myself wanting to prompt the user for a rune before running a command in that CLI.

Why would I do this? Deckard handles schema changes via the [migrations pattern](https://en.wikipedia.org/wiki/Schema_migration). This consists of having an up migration and a down migration. The up migration might be to add a new table or alter a column, while a down migration might be to drop that table or alter that column back to its previous form. This works great, but it’s worth making note that down migrations are often destructive.

The goal was simple. When the user tried to run down migrations, prompt them and ask them to make sure they’re really trying to run down migrations. I mean, I had just accidentally run down migrations while trying to test up migrations a few days! It could happen to anyone. It felt like a necessary feature.

Thankfully, a common pattern is to prompt the user for "\[Y/n\]". In this pattern, the uppercase letter is the default. However, for Deckard, I ended up swapping the two so that No was the default option. Anyways, Go made this very easy as I was able to simply prompt the user for a rune from the terminal before calling the function that ran the migration.

```go
// warn the user. Downs are usually destructive.
fmt.Printf("Heads up! You're about to run DOWN migrations. These migrations are likely destructive.\n")
fmt.Printf("Would you like to continue? y/N:")
reader := bufio.NewReader(os.Stdin)
char, _, err := reader.ReadRune()

if char == 'Y' || char == 'y' {
	database.RunDown(migration, cmdSteps)
} else {
	log.Fatal("Understood! Aborting...")
}
```

And that’s it! Simply create a new buffered IO reader from standard in and call
`.ReadRune()` on the reader! Then you can work with the rune like normal! Note:
It’s worth mentioning that the above code will hang when prompting for a rune.

If you’d like to [learn more about Go, you can find more of my articles on the language here](/tags/go)!
