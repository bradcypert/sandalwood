---
title: "Provisioning a remote server with Ansible"
date: 2017-11-22
status: publish
permalink: /provisioning-a-remote-server-with-ansible
author: "Brad Cypert"
excerpt: "If you've ever manually provisioned a server before, you know the feeling of excitement that you receive once you're finished and your application is running on a remote machine. If you've ever provisioned two servers identically, you know the feeling of dread from getting it exactly right the second time. Thankfully, tools like Ansible exist to help us provision multiple servers exactly the same way."
type: blog
id: 75
category:
  - Ansible
tags:
  - Ansible
post_format: []
_yoast_wpseo_title:
  - "Provisioning a remote server with Ansible"
---

If you’ve ever manually provisioned a server before, you know the feeling of excitement that you receive once you’re finished and your application is running on a remote machine. If you’ve ever provisioned two servers identically, you know the feeling of dread from getting it exactly right the second time. Thankfully, tools like Ansible exist to help us provision multiple servers exactly the same way. Today, I’ll talk to you about provisioning a remote machine using Ansible.

#### Install Ansible

If you haven’t yet, you’ll want to install Ansible on the non-remote machine. Ansible is installed via `Pip` so if you don’t have `Pip` installed, you’ll want to install that as well. And `Pip` is installed via easy_install so we should probably just start there:

- If necessary, run `easy_install pip`.
- If necessary, run `pip install ansible`.

If that ran successfully, then you should know have Ansible installed! This will give us access to `ansible` and `ansible-playbook` which we’ll use later on in this tutorial.

#### Getting access to a remote server

We’ll be provisioning a Ubuntu 16.04LTS server today and to do that, we’ll create one using Digital Ocean. For those who have never used it, Digital Ocean is a great way to get access to cheap-costing Virtual Machines that you have full control over! That being said, if you have another provider that you’d prefer to use then you can. This tutorial should be relatively provider agnostic.

With Digital Ocean, you’ll want to start by creating an account. Then, you’ll be able to create a Droplet, which is what we want to do. Once clicking “Create a Droplet”, you should see something like this:

![Digital Ocean Virtual Machine Image Selection](/Screen-Shot-2017-11-22-at-4.18.18-PM.png)

Like I said before, we’ll be creating a Ubuntu 16.04 server, so be sure to choose that. Once you’ll scroll down you’ll see more options for your droplet.

![Digital Ocean Server Size Selection](/Screen-Shot-2017-11-22-at-4.18.26-PM.png)

Here you can choose the standard specs of your VM. Feel free to pick whatever is cost effective for you. For this tutorial, the $5/mo or the $640/mo won’t make a difference.

Finally, you’ll want to scroll down and hit “Create.” Great! Now we can get to start on our Ansible work! **Just make sure you grab your IP address from your new droplet!**

#### Our First Ansible Playbook

Ansible uses an idea of “Playbooks”. Playbooks are essentially the policy that you want your provisioned servers to follow. We’ll cover a few common scenarios with our playbook. Namely, we’ll write our own role, use a user-created role, and set up an inventory (or a target to provision).

Lets start with the folder structure though:

You’ll want to create the following files (in your project or elsewhere):

- `./provisioning/inventories/prod/hosts`
- `./provisioning/roles/common/tasks/main.yml`
- `./provisioning/requirements.yml`
- `./provisioning/setup.yml`

`./provisioning/inventories/prod/hosts` defines a target for our servers. We’ll specify a few defaults and do a quick inventory. It’s worth mentioning that we won’t go in depth on this part as we’re simply configuring just one server.

- `./provisioning/roles/common/tasks/main.yml` will be where we write our custom task called `common`. You can put whatever you want here or even name the role a better name (and probably should!).
- `./provisioning/requirements.yml` is our Ansible dependencies file. Think of this as a `package.json`, `project.clj` or any other file that manages dependencies.
- `./provisioning/setup.yml` is our playbook. This is our entry point for Ansible and will be where we orchestrate our roles against inventories as well as define config values.

#### Building an Inventory

We’ll start by building our inventory so we don’t lose that IP address that’s hanging out in our copy/paste buffer. Let’s open `./provisioning/inventories/prod/hosts` and add the following lines:

```yml
default ansible_ssh_host=192.168.1.101 ansible_ssh_user=root

[webservers]
default
```

This will setup our inventory for prod with defaults of our IP and the user to run these commands as. Basically, after creating those defaults we’re setting up a target called `webservers` and we’re applying the defaults to that server. There are better ways to build inventories when you’re provisioning multiple machines at once, but for now, this works for us!

#### Building a Task

Ansible tasks can do quite a lot of things in one go. For simplicity, we have all of our tasks in `./provisioning/roles/common/tasks/main.yml`. We’ll accomplish a lot with just a little in this task, namely, we’ll install Java8, set our Java Environment Variables, add wget, vim, and curl, and finally download and install leinengen and clj-boot. Here’s what our task looks like:

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

Ansible ships with a lot of configurable tasks that you can leverage and a lot of commands such as `get_url` or `shell` as shown in the example above but the real power of ansible comes from leverage community-built tasks to ensure you dont reinvent the wheel.

#### Leveraging Community-Built Tasks

Realistically, if you want Postgres installed on a server, there’s only so many possible permutations of an installation you could want. This is where well-built community tasks come into play. Add the following to your `./provisioning/requirements.yml` file and I’ll explain them in a moment:

```yml
---
- src: ANXS.postgresql
- src: geerlingguy.nodejs
```

Alright, this is is pretty straight-forward. We’re defining a few requirements from [Ansible Galaxy](https://galaxy.ansible.com/). We can download these requirements and run them as if we had written the tasks themselves. In this case, we’re depending on a Postgres role and a NodeJS role. You can find these roles and more like them on [Ansible Galaxy](https://galaxy.ansible.com/).

Let’s go ahead and run `ansible-galaxy install -r provisioning/requirements.yml`. This will pull down the roles from ansible’s galaxy and make them available to use.

#### Writing our Playbook

Finally, its time to wire all of this together with our Playbook. I generally dont have many playbooks for an application so I call mine `setup.yml`, but you could call yours `dev.yml` or `prod.yml` or what have you. Let’s open `./provisioning/setup.yml` and add the following:

```yml
---
# This playbook handles setting up Clojure and Postgres

- name: install java, clojure, and devtools
  hosts: all
  remote_user: root
  become: yes
  become_method: sudo
  vars:
    database_name: "dev"
    database_user: "dev_user"
    database_password: "dev_pass"
    database_hostname: "localhost"

  roles:
    - common

    - role: ANXS.postgresql
      postgresql_version: 9.6
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

Now, we’ve defined out playbook as well as declared some vars. We’ve also mentioned `hosts: all` saying that this applies to all hosts, here we could have `webservers` as we’ve defined before, but for our sakes we’re just provisioning a single host. Then, we have our roles declared below that. We use our common role that we’ve defined, plus the two from Ansible Galaxy. You’ll notice that we’re providing a lot of config options to the Postgres role, but none to the NodeJS role. That’s due to the way that the roles are built and the defaults being acceptable.

#### Running our playbook against our Server

**A note about Ansible on Ubuntu 16.04LTS**: You’ll need to SSH into your server and run `sudo apt install python-minimal` because the `python` command that is required by Ansible is ambiguous.

To run our newly built playbook against our server, we’ll simply run `ansible-playbook --inventory=provisioning/inventories/prod provisioning/setup.yml`. That should do it! After ansible runs, you’ll have a new server with Postgres, Node, Java8 and Leinengen installed! If you ssh into the machine, you can check that everything is running as well.
