---
title: "Provisioning a Development Environment for Clojure Web Services via Ansible and Vagrant"
date: 2017-04-12
status: publish
permalink: /provisioning-a-development-environment-for-clojure-web-services-via-ansible-and-vagrant
author: "Brad Cypert"
excerpt: ""
type: blog
id: 52
category:
  - Ansible
  - clojure
  - DevOps
tags:
  - Ansible
  - clojure
  - DevOps
  - Vagrant
post_format: []
description: "Sandboxed developer environments are extremely helpful for local development and ensuring projects work across machines. In this post, we'll learn how to provision a development environment for Clojure web services with Ansible and Vagrant."
---

Welcome back! DevOps has always been an area of interest for me, however I’ve not really had much of a reason to get into it. At CARFAX and LinkedIn, there were teams dedicated to the DevOps side of things. However, I’m picking up steam with a couple of projects that have me at the helm, and I’m seeing a more and more prevalent need for DevOps in these projects.

#### What problems does DevOps solve?

Lots of them! Copious amounts of problems, in fact. Here are a few examples:

- Ensuring Developers can just sit down and write code
- Automating building applications
- Automating deploying applications to production
- Ensuring that fallback plans are in place if something breaks or a deploy goes wrong

The problems they try to solve are often rather ambiguous, but with good cause. These problems differ from business to business, platform to platform, and tech stack to tech stack. A problem that I’m dealing with right now is that I’m working with a developer who is an awesome frontend developer, but (at least on this project) would prefer to not worry about the backend at all. In theory, I could just handle writing the Clojure API and pushing updates to a Heroku or Digital Ocean instance and have him test against that, but that’s not my style. I’m writing this blog post on a plane, and I like to be able to work from a plane. Heroku or Digital Ocean isn’t the best option.

#### What are we trying to solve?

We want to be able to allow anyone to pick up this project and just start coding without worrying about the parts they don’t know or care about. In fact, my friend (Michael) and I often talk in terms of endpoints. What data am I sending him and what data can he expect? This works great for us, but I need to make sure that he doesn’t have to worry about installing the tools needed to run the API or the database or anything like that. He should be able to just **clone and go™**.

#### Ideation

The first thing that comes to mind is simply writing a hardcore, meaty, full-of-pizzazz shell script to install everything on his machine, but that’s not very considerate of me. What if Michael is working on other projects that use different versions of Postgres or he can’t make JDK8 his primary JDK? Plus, how do I help debug issues for him if they arise? Well, just a shell script isn’t going to work. We need a way to sandbox our environment.

A virtual machine! That’s exactly what a sandboxed environment is! So, in theory, I could tell him:

1. Install [VirtualBox](https://www.virtualbox.org/) (or [VMWare Fusion](https://www.vmware.com/go/downloadfusion), if you’re one of **those** people).
2. Download a Ubuntu iso
3. Boot the Ubuntu iso within the VM
4. Mount the files on your local machine to the VM (or clone the files on the VM and use remote desktop or Vim)
5. SSH into the VM
6. Run my shell script mentioned above (would take care of installing Postgres, Leiningen, etc)

This… works. But it’s not really **clone and go™**. So how do we reduce the number of steps needed? Perhaps we can leverage [Vagrant](https://www.vagrantup.com/) to reduce steps two, three, and four into one single step. For those unacquainted, Vagrant is a tool for provisioning development environments. I won’t say it’s similar to Docker because I’ll get yelled at by people who do DevOps for a living, but when someone thinks about one of these tools, they often think about trying to solve the same problem with the other as well.

A thing to note: Michael and I will both have to install Vagrant to get this to work, but that’s not too bad considering we’re both on Unix systems. However, our new setup instructions will be:

1. Install Virtualbox
2. Install Vagrant
3. Clone Repo
4. `vagrant up`
5. SSH via `vagrant ssh`
6. Run the Install Script

There’s actually a way to reduce this to even fewer steps, in fact. For that bit, we’re going to leverage [Ansible](https://www.ansible.com/) and it’s wonderful integration with Vagrant.

Since I’m setting up the Vagrant environment, I’ll detail the steps needed here as well as an extremely brief introduction to Vagrant. Once you’ve installed Vagrant on your operating system you’ve got one command to run to enable Vagrant for your project: `vagrant init`. `vagrant init` will create a new `Vagrantfile` in your current directory with some defaults provided by Hashicorp. Go ahead and open your Vagrant file in your favorite text editor. If you’re familiar with Ruby, this file should be a pretty easy read. If you have no ruby experience, you’ll see that the entire file is heavily commented.

There’s a lot you can do with this, but Im going to set it up for my project and walk you through that. Here’s what Im going to modify my Vagrantfile to look like.

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "hashicorp/precise64"

  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 9000, host: 9000

  config.vm.provision "ansible_local" do |ansible|
    ansible.playbook = "provisioning/setup.yml"
    ansible.galaxy_role_file = "provisioning/requirements.yml"
  end
end

```

We’re setting the “box” (a custom image setup for Vagrant) to hashicorp’s own precise64 box. You can find a list of boxes available on their website as well as create and upload your own. Next, we’re forwarding two ports, 3000 and 9000. These ports will be forwarded on the host machine to the virtual machine while it’s running.

Lastly, we’re going to toss that idea of a shell script for provisioning the virtual machine and use a tool called Ansible. This is the configuration that I’m using for Ansible. We set a playbook (more on that in a moment) and a requirements.yml (dependencies).

So what is Ansible? It’s a tool used for provisioning machines (virtual or otherwise). It’s in the same realm of business as Puppet, Chef, or Salt – merely a different tool. The main concept behind Ansible is simple, you write a `.yml` file called a playbook that describes the provisioned state of the server. Then, you can run Ansible to provision a server to meet that end state. In fact, Vagrant has a provisioner for Ansible that comes with it, which is part of the reason we’ve decided to use it.

You’ll likely have noticed that in our Vagrant file, we’ve added two filepaths to the Ansible section. We’re going to need to go ahead and create those file paths now.

###### requirements.yml

```yml
---
- src: ANXS.postgresql
- src: geerlingguy.nodejs
```

The `requirements.yml` file allows us to download “roles” (a piece of reusable provisioning code) from Ansible’s “Galaxy”. Think of it as Maven, but for sensible roles. So instead of writing the Postgres role from scratch, we can use ANXS’s Postgres role. Same with GeerlingGuy’s NodeJS role. We’re going to write our own role for the JDK, Leiningen, and Boot (just in case you want to use boot instead) in just a moment. But first, let’s create our playbook.

###### setup.yml

```yml
---
- name: install java, clojure, and devtools
  hosts: all
  remote_user: root
  become: yes
  become_method: sudo
  vars:
    database_name: ‘your_db_name’
    database_user: ‘my_user’
    database_password: ‘my_password’
    database_hostname: "localhost"

  roles:
    - clojure

    - role: ANXS.postgresql
      postgresql_databases:
        - name: "{{database_name}}"
      postgresql_users:
        - name: "{{database_user}}"
          pass: "{{database_password}}"
          encrypted: no
      postgresql_user_privileges:
        - name: "{{database_user}}"
          db: "{{database_name}}"
          priv: "ALL"

    - role: geerlingguy.nodejs
```

If you don’t have experience with `.yml` files, fret not! It takes 20 minutes to learn the formatting and is quite similar to JSON. Ansible allows you to specify which “hosts” you’d like to run this on. You can specify whatever you want here (perhaps you only want to run this playbook on DB servers?) but we’re just going to use “all” for now. We’re telling Ansible to use the root user on the machine its provisioning. `become` is a flag that’s needed when you’re telling Ansible to act as a user different than whomever is currently logged in when the command runs. `become method` is used to specify how the user should become the targeted user. We’re simply setting this to sudo. Then, we define some variables to be used in our roles below.

Now, the roles section. The first role is called `clojure`, but we haven’t created that yet. We’ll get to it soon. For now, take a look at the Postgres section. These are all parameters to the roll specified by ANXS when writing his Postgres role. We’re simply passing in variables, and the rest is taken care of for us. As for Geerlingguy’s NodeJS, we’re just running the role as is.

Let’s write our Clojure role! We’re going to create a file in `my_project_path/roles/clojure/tasks/main.yml`. Indeed, that’s a deep file path. The reason behind it is that we only need to run tasks for this role, but Ansible roles allow you to define things other than tasks in them.

###### main.yml

```yml
---
- name: Add Java8 repo to apt
  apt_repository: repo='ppa:openjdk-r/ppa'
  tags:
    - install
  become: yes
  become_method: sudo

- name: Add WebUpd8 apt repo
  apt_repository: repo='ppa:webupd8team/java'

- name: Accept Java license
  debconf: name=oracle-java8-installer question='shared/accepted-oracle-license-v1-1' value=true vtype=select

- name: Update apt cache
  apt: update_cache=yes

- name: Install Java 8
  apt: name=oracle-java8-installer state=latest

- name: Set Java environment variables
  apt: name=oracle-java8-set-default state=latest

- name: System Setup
  apt: pkg="{{ item }}" state=installed update-cache=yes
  with_items:
    - wget
    - vim
    - curl
  tags:
    - install
  become: yes
  become_method: sudo

- name: set user bin directory
  set_fact:
    user_bin_dir: /usr/bin

- name: download leiningen
  get_url:
    url: https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein
    dest: "{{ user_bin_dir }}"

- name: add executable permission for lein script
  file:
    path: "{{ user_bin_dir }}/lein"
    mode: "a+x"
  become: yes
  become_method: sudo

- name: Install Clj-Boot
  shell: bash -c "cd /usr/local/bin && curl -fsSLo boot https://github.com/boot-clj/boot-bin/releases/download/latest/boot.sh && chmod 755 boot"
  become: yes
  become_method: sudo
```

Alright, there’s quite a bit here, and technically the Lein install could be dropped down to a shell-script similar to Clj-boot, but I wanted to showcase some Ansible goodies to you. Let’s tackle it block by block.

```yml
- name: Add Java8 repo to apt
  apt_repository: repo='ppa:openjdk-r/ppa'
  tags:
    - install
  become: yes
  become_method: sudo_
```

This block of code simply adds the OpenJDK repo to our APT (remember, we’re using Ubuntu for our VM) installation.

```yml
 name: Accept Java license
  debconf: name=oracle-java8-installer question='shared/accepted-oracle-license-v1-1' value=true vtype=select

```

This was a pain to figure out. You have to accept some terms when installing the JDK, but this config option sets them to auto accept. It’s not like anyone reads those anyways, right?

```yml
- name: Update apt cache
  apt: update_cache=yes

- name: Install Java 8
  apt: name=oracle-java8-installer state=latest

- name: Set Java environment variables
  apt: name=oracle-java8-set-default state=latest
```

This block of code updates the apt repository for us, allowing us make sure we’re using the latest and greatest packages. Then, we install Java8, and finally, we’re setting the Java8 environment variables for our VM (`JAVA_HOME`, etc.).

```yml
- name: System Setup
  apt: pkg="{{ item }}" state=installed update-cache=yes
  with_items:
    - wget
    - vim
    - curl
  tags:
    - install
  become: yes
  become_method: sudo
```

This block of code ensures that we have some basic things on our system. Namely, `wget`, `vim`, and `curl`. Tools that are often used. We needed to install these as sudo, so naturally we use `become`.

```yml
- name: set user bin directory
  set_fact:
    user_bin_dir: /usr/bin
```

This block simply sets a local `fact` (kind of like a variable for Ansible) that we can use in the rest of our task. In this case, it points to the `/usr/bin` directory. This is where we’ll install Leiningen.

```yml
  get_url:
    url:  https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein
    dest: "{{ user_bin_dir }}"

- name: add executable permission for lein script
  file:
    path: "{{ user_bin_dir }}/lein"
    mode: "a+x"
  become: yes
  become_method: sudo

```

This block here fetches the Leiningen binary from github and plops it into `/usr/bin` (because we set `user_bin_dir` to that path). Then, we make the `lein` script executable via chmod. Remember, that with Ansible, we’re describing what we want the end goal to look like. Ansible takes care of the rest.

#### An Extra bonus, Clj-Boot

Perhaps you’ve explored using `Boot` with your clojure projects. In fact, you may even have a few projects using `Boot` like I do. For simplicity reasons, it’d be great if our VM had boot on it too. You can actually write this Ansible task similar to the Leiningen one above, but I wanted to show you that you can also simply leverage a shell script via Ansible.

```yml
- name: Install Clj-Boot
  shell: bash -c "cd /usr/local/bin && curl -fsSLo boot https://github.com/boot-clj/boot-bin/releases/download/latest/boot.sh && chmod 755 boot"
  become: yes
  become_method: sudo
```

This simply executes the shell command above, which changes into the `bin` directory, and then makes a `curl` request for the boot shell script, and finally makes it executable.

#### Putting it all together

With the Ansible playbook that we’ve written, the Vagrant file, and the roles we’ve written or leveraged, you now have a way to boot up a brand new VM provisioned for Clojure and Node applications. In fact, you can go into your project folder now and try it!

```yml
vagrant up
vagrant ssh
node —version
java -version
lein repl
```

Huzzah! We’ve successfully provisioned a VM for a new project using Clojure, JDK8, Postgres, and NodeJS!

_Note: It’s possible that your VM may fail during provisioning due to a flaky connection. If so, you can `vagrant destroy` the VM and rebuild it using `vagrant up` or simply run `vagrant provision` and it will attempt to rerun the provisioning step._

When you’re done with your vagrant instance, don’t forget to shut it down or destroy it so you can reclaim the system specs that you’ve leant to your virtual machine!

Now, our final steps look like this:

1. Install Virtualbox
2. Install Vagrant
3. Clone the Repo
4. `vagrant up`

Remember, that vagrant takes care of the SSH steps for you, so you can simply run `vagrant ssh` to get inside the box, and then start your server or repl or what-have-you.
