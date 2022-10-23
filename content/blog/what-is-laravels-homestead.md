---
title: "What is Laravel's Homestead?"
date: 2020-02-29
status: publish
permalink: /what-is-laravels-homestead
author: "Brad Cypert"
type: blog
id: 2923
thumbnail: /gray-house-with-fireplace-surrounded-by-grass-under-white-731082.jpg
category:
  - PHP
tags:
  - homestead
  - laravel
  - PHP
description: "Laravel's homestead is a development environment to aid in building Laravel applications in PHP."
---

[Laravel](https://laravel.com/) is, as far as PHP frameworks go, extremely popular. In their guide, the Laravel community recommends you use Homestead as your local development environment. But what is Laravel’s homestead and why use it?

## Laravel’s Homestead

Homestead is Laravel’s suggested development environment for building Laravel applications in PHP. Homestead is packaged as a vagrant box (a virtual machine) and is aimed to simply the initial setup of your Laravel project.

## Why use Homestead?

Laravel actually has a fairly specific set of requirements that need to be met if you are to develop for it. Homestead bundles all of these requirements and has them already set up for you in an easy to use [Vagrant](https://www.vagrantup.com/) box. This takes away the uncertainty of setting up multiple development environments the same way, as the box can be shared across your development team.

## Do I have to use Homestead while building my Laravel application?

You don’t have to use Homestead while building your Laravel application, however, you will need to put some effort into setting up your development environment correctly. As of Laravel version 6.x, your local environment needs access to the following:

- PHP &gt;= 7.2.0
- [BCMath PHP Extension](https://www.php.net/manual/en/book.bc.php)
- [Ctype PHP Extension](https://www.php.net/manual/en/book.ctype.php)
- [JSON PHP Extension](https://www.php.net/manual/en/book.json.php) (this should be included in your PHP standard library if using the required PHP version mentioned above)
- [Mbstring PHP Extension](https://www.php.net/manual/en/mbstring.installation.php)
- [OpenSSL PHP Extension](https://www.php.net/manual/en/book.openssl.php)
- [PDO PHP Extension](https://www.php.net/manual/en/pdo.installation.php)
- [Tokenizer PHP Extension](https://www.php.net/manual/en/book.tokenizer.php)
- [XML PHP Extension](https://www.php.net/manual/en/xml.installation.php)

With this in mind, I would definitely recommend using Homestead instead of manually managing each of these extensions on every dev-team member’s machines. That being said, the choice is yours!

Hopefully this helps explain what Laravel’s homestead is and why you would use it.[ If you’d like to learn about other interesting topics in PHP, you can find the topic on my site here](/tags/php)! [Additionally, the documentation for Homestead can be found here if you’d like to dig deeper into it](https://laravel.com/docs/6.x/installation)!
