---
title: "Writing a RESTful API in Flask & SQLAlchemy"
date: 2014-10-04
status: publish
permalink: /writing-a-restful-api-in-flask-sqlalchemy
author: "Brad Cypert"
type: blog
id: 11
category:
  - Python
tags:
  - flask
  - Python
description:
  - "Writing an API in Flask with SQLAlchemy is easy with the correct setup. Flask takes care of the server and routing while SQLAlchemy handles the database."
---

## First Thing’s First

Why would we write this in Python? There’s already rails, spring, and the mean stack which can do the same thing. Let’s consider what Python gives us out of the box. Out of all the languages I’ve touched, it definitely has the easiest learning curve. The syntax is beautiful, and the “batteries included” principle of python just helps you get your server up very quick. Install python, find your dependencies, get coding.

##### Heads up! This article is deprecated. It may not apply to the latest versions of Flask/SQLAlchemy.

**You all asked for it and I (finally) listened. I’ve updated this post to reflect Python 3.8.1 to the best of my knowledge.**

**I also recorded a video of me going in and rewriting this in Python 3. Find it below! Happy flasking, Pythonistas!**


<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/aHYv72bTRNk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Getting Started

For this tutorial, we’re going to use <s>Python 2.7</s> Python 3.8.1 and Flask. We’re also going to use a sqlite database and SQLAlchemy. Let’s get started. For simplicity’s sake, we’re just going to keep our code in two files.

#### config.py

```python
import os
basedir = os.path.abspath(os.path.dirname(__file__))

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.sqlite')
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')
```

`config.py` just sets up some basic necessities so we can connect to our database. Although this isn’t really doing much right away, we’re going to load this configuration into our app in just a moment.

#### server.py

```python
from flask import Flask, jsonify, abort, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(**name**)
app.config.from_pyfile('config.py')
db = SQLAlchemy(app)
migrate = Migrate(app, db)
```

This covers the basics of our app. We’re able to import our necessities (Flask, SQLAlchemy, and flask_migrate) and then instantiate our Flask application with `Flask(__name__)`. Our configuration from earlier is loaded into our application with `app.config.from_pyfile('config.py')` and lastly, we create our database by instantiating a SQLAlchemy instance with our app as the one parameter.

Flask is what is running our web application for us. It handles the routing as well as serving of our content. `jsonify` is a helper in flask that helps us produce valid JSON from common python data structures. `abort` and `request` are tools to help us control the flow and return type of our request/response.

`flask_sqlalchemy` is a binding layer that helps hook up SQLAlchemy to flask without much work on our ends. Finally, flask migrate helps us take care of migrating our data structures into table definitions in our database.

### Models

Staying in the same file (server.py), we’re going to create a model for our database. Our model will look like this.

```python
class Developer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20))

    def __init__(self, name):
        self.name = name

    def serialize(self):
        return {"id": self.id,
                "name": self.name}
```

`class Developer(db.Model):` creates a new class named Developer (this ties directly to a table in our database called “Developer”) and gives us an object to create/update/delete in our api. The code within the class just explains the properties on the class and how they map to the database, for example, **id** maps to a column in our database that is an integer and is also our primary_key while **name** maps to a string field.

#### server.py (Checkpoint)

Up to this point, our `server.py` should look like the following:

```python
from flask import Flask, jsonify, abort, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(**name**)
app.config.from_pyfile('config.py')
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Developer(db.Model):
id = db.Column(db.Integer, primary_key=True)
name = db.Column(db.String(20))

    def __init__(self, name):
        self.name = name

    def serialize(self):
        return {"id": self.id,
                "name": self.name}

```

With all of this code, we’re ready to start handling routes.

```python
@app.route('/dev/', methods=['GET'])
def index():
    return jsonify({'developers': list(map(lambda dev: dev.serialize(), Developer.query.all()))})

```

The above route simple says, if someone hits `http://ourserver/dev/` they’ll get back all of the developers in our database. `jsonify` simply converts the object into a pretty snazzy json object.

```python
@app.route('/dev/<int:id>/')
def get_dev(id):
    return jsonify({'developer': Developer.query.get(id).serialize()})

```

This route runs very similar to the main index route, but with a caveat. This one takes an id in the URL, and only returns a JSON object with the developer whose primary key matches the one passed in.

```python
@app.route('/dev/', methods=['POST'])
def create_dev():
    if not request.json or not 'name' in request.json:
        abort(400)
    dev = Developer(request.json['name'])
    db.session.add(dev)
    db.session.commit()
    return jsonify({'developer': dev.serialize()}), 201

```

This route lives on the same URL as the first. But… since won’t we just always call the first method since it comes first in the code? The difference here is that, although they live on the same URL, the first method only handles **GET** requests, while this one only handles **POST** requests. You can see this in the annotation – `methods = ['POST']`. Although we’re only using one method, you can list any number of HTTP Methods in that list, and if you do, the method following the annotation will handle any request with a matching request method. The first line in the method checks to make sure that the request is actually JSON, and that a name is passed to the method. If we don’t have a name, or it’s not JSON that we’re receiving, we return a 400 status code. If we make it past that step, we create a new developer object using the information passed in from the JSON, add it to the database, and commit the results. Lastly, we return the developer object as JSON and a 201 status code (HTTP Status Code: Created).

```python
@app.route('/dev/<int:id>/', methods=['DELETE'])
def delete_dev(id):
db.session.delete(Developer.query.get(id))
db.session.commit()
return jsonify({'result': True})

```

One of the first things you should notice about the above method is that it handles HTTP Delete methods. Simply enough, this method gets a User by ID and deletes them from the database and commits the database. Finally, it returns `{'result':True}` to let you know that it completed successfully.

```python
@app.route('/dev/<int:id>/', methods=['PUT'])
def update_dev(id):
    dev = Developer.query.get(id)
    dev.name = request.json.get('name', dev.name)
    db.session.commit()
    return jsonify({'dev': dev.serialize()})
```

This last route handles the PUT HTTP Method. Put is the method that is used for updating values, and likewise, our update_dev method is what is called after matching on this route. What this method does is get a developer by their id (primary key) and replaces their attributes with any JSON that is passed in. request.json.get(key, default) is an extremely helpful core-flask method here, that basically says, get the JSON value located in this key, but if there isn’t one, default to the 2nd parameter. In our case, we try to get a name, but we default to the current developer name if we can’t find one.

## Final Product

If you’ve been able to follow along up to this point, you should have a final product that looks something like this.

#### config.py

```python
import os
basedir = os.path.abspath(os.path.dirname(__file__))

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.sqlite')
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')

```

#### server.py

```python
from flask import Flask, jsonify, abort, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


app = Flask(__name__)
app.config.from_pyfile('config.py')
db = SQLAlchemy(app)
migrate = Migrate(app, db)


class Developer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20))

    def __init__(self, name):
        self.name = name

    def serialize(self):
        return {"id": self.id,
                "name": self.name}


@app.route('/dev/', methods=['GET'])
def index():
    return jsonify({'developers': list(map(lambda dev: dev.serialize(), Developer.query.all()))})


@app.route('/dev/<int:id>/')
def get_dev(id):
    return jsonify({'developer': Developer.query.get(id).serialize()})


@app.route('/dev/', methods=['POST'])
def create_dev():
    if not request.json or not 'name' in request.json:
        abort(400)
    dev = Developer(request.json['name'])
    db.session.add(dev)
    db.session.commit()
    return jsonify({'developer': dev.serialize()}), 201


@app.route('/dev/<int:id>/', methods=['DELETE'])
def delete_dev(id):
    db.session.delete(Developer.query.get(id))
    db.session.commit()
    return jsonify({'result': True})


@app.route('/dev/<int:id>/', methods=['PUT'])
def update_dev(id):
    dev = Developer.query.get(id)
    dev.name = request.json.get('name', dev.name)
    db.session.commit()
    return jsonify({'dev': dev.serialize()})

```
