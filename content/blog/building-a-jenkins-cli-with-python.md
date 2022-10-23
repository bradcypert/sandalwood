---
title: "Building a Jenkins CLI with Python"
date: 2014-10-20
status: publish
permalink: /building-a-jenkins-cli-with-python
author: "Brad Cypert"
excerpt: ""
type: blog
id: 13
category:
  - Python
tag: []
post_format: []
_yoast_wpseo_title:
  - "Building a Jenkins CLI with Python"
---

# Jenkins, please.

For those of you who don’t know, Jenkins is a continuous-integration (often refered to as CI) server based heavily off of Hudson. In-fact, they were one in the same before Oracle purchased Hudson, but a community fork happened and now Jenkins is the open-source version. There’s other CI Servers out there, Codeship and Travis CI are two that come to mind, but I was introduced to Jenkins at work, and have been using it ever since.

# Setting Up

I’ll be writing this script in Python 2.7 and we’re actually going to use a wrapper for the calls to Jenkins. The wrapper is called ‘jenkinsapi’ and you’ll see it included in our script below. Besides that, you’ll want an instance of Jenkins to call. It’s relatively easy to setup and can be downloaded and found at [http://jenkins-ci.org/](http://jenkins-ci.org/). Follow the documentation there and get Jenkins set up and running and we’ll be good to go!

# Let’s Code

To stay with the Hudson/Jenkins butler theme, we’re going to call this guy Sinclair. So let’s create a file called Sinclair.py and download our dependencies into a virtual environment via `pip install jenkinsapi`. Before we get into the code, it’s important to note my jobs are set up like the following:  
Name = `BradCypert.com deploy`  
Parameters = `build-level; version;`  
So if I want to deploy the version 1.0.27 of my website to my alpha server, my CLI command would look like this `Sinclair bradcypert.com deploy alpha 1.0.27`

#### Sinclair.py

```py
##Lets start by declaring some variables dependent on your setup.
jenkinsServerUrl="http://localhost"
jenkinsServerPort=8080

##Import our dependencies
import jenkinsapi
import sys
from jenkinsapi.jenkins import Jenkins

##Define a function to connect to Jenkins
def connectToJenkins():
    server = Jenkins(jenkinsServerUrl+":"+jenkinsServerPort.__str__())
    return server

##Define a function to give us all of our Jobs on our server
def getJenkinsJobs(server):
    return server.keys()

##This next function has a LOT going on, so I'll comment as we go.
def runJenkinsJob(job, paramsMap): ##Define a function to handle running our job
    if(len(job.get_params_list()) != len(sys.argv)-3): ##If we don't pass in enough arguments...
        print "Error: Argument length mismatch. Please ensure that you're supplying enough arguments for the jenkins job."
        exit() ## ... exit the script.

    if(job.has_params()):   ## else, if that job has parameters
        builder = {}        ##we do some fancy magic to build our job.
        counter = 3         ##the first thing we want is arguement #3 from our command line
        for param in job.get_params_list(): #for each parameter the job has, set the command line arguement equal to it.
            builder[param] = sys.argv[counter]
            counter = counter + 1
        print "Starting job '" + job.name + "'." ##Let us know we're starting our job.
        job.invoke(None,False,False,3,15,builder,None,None) ##Invoke the job from our wrapper library.

    else:
        job.invoke() ##invoke the job with no parameters.


def blowup(): ##gives us some error output to help users the second time around.
    print "You need to specify a job name, task, and any arguements needed."
    print "If you're trying to deploy jenkinsTestApp (version 2.0.0) to beta."
    print "Try this: > Sinclair jenkinsTestApp deploy beta 2.0.0"
    exit()

def noJobs():
    print 'Could not find the job that was entered.'
    print 'Ensure the jenkins job is [name] [action] and that you're giving Sinclair the right parameters!'
    print 'For instance, you've entered '' + sys.argv[1] + ' ' + sys.argv[2] + '' for your name and action.'

def main(): ## Our main method is a little big, but it basically
    if(len(sys.argv) == 2):
        blowup()
    else:
        server = connectToJenkins()
        jobs = getJenkinsJobs(server)
        jobName = sys.argv[1] + " " + sys.argv[2] ## builds our job name out of our first 2 arguments.
        if(jobs.__contains__(jobName)): ##make sure the job exists on the server.
            job = server[jobName] ##select the job
            runJenkinsJob(job, sys.argv) ##run it
        else:
            noJobs()

main()       ## run this fella
```

# Final Notes

It’s important to remmeber that this script is catered around my job name and parameter setup (although it works with no parameters too!). If you’re running into issues, check and make sure your jobs are set up properly, that you’re able to connect to the server via the client, and if all-else fails, comment and let me help!

# Additional Information

[Download Jenkins](http://jenkins-ci.org/)  
[Jenkinsapi Python Library](https://pypi.python.org/pypi/jenkinsapi)
