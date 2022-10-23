---
title: "Using Mongo's ObjectIDs with Go-Graphql"
date: 2019-10-20
status: publish
permalink: /using-mongos-objectids-with-go-graphql
author: "Brad Cypert"
type: blog
id: 1919
thumbnail: /blur-cartography-close-up-2678374-1.jpg
category:
  - Go
tags:
  - go
  - graphql
  - mongo
description:
  - "Serializing Mongo an ObjectID with Graphql in Go can be tricky, but with a custom scalar type, it's relatively painless."
---

I’ve been working on building a Graphql API in Go and recently ran into an issue serializing Mongo’s ObjectIDs. This doesn’t sound like a difficult task, and thankfully it’s not, but it wasn’t super obvious how to go about this.

First, we need to identify what an object ID really is. In the official Mongo driver, we can see that there is a type representation for ObjectID. Additionally, there are methods to convert an ObjectID to a hex value and vice-versa. This means that we could maintain two structs for our models, one with the hex value for an ID and the other with the ObjectID (for encoding/decoding directly to mongo). However, this means that we’d also have to maintain two different models and translate between the two manually.

```go
type GQLBook struct {
  ID string
}

type MongoBook struct {
  ID primitive.ObjectID
}

// No bueno!
```

Thankfully, [the GraphQL library that I’m using](https://github.com/graphql-go/graphql) allows us to define custom scalar types. This means that we’re able to use the MongoBook struct from above (and rename it to the simpler “Book”) and serialize/deserialize at the GraphQL layer.

This means that we’ll want to define a new Scalar type in GraphQL. I’ll call this one ObjectID.

```go

package gql

import (
	"github.com/graphql-go/graphql"
	"github.com/graphql-go/graphql/language/ast"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var ObjectID = graphql.NewScalar(graphql.ScalarConfig{
	Name: "BSON",
	Description: "The `bson` scalar type represents a BSON Object.",
	// Serialize serializes `bson.ObjectId` to string.
	Serialize: func(value interface{}) interface{} {
		switch value := value.(type) {
			case primitive.ObjectID:
				return value.Hex()
			case *primitive.ObjectID:
				v := *value
			return v.Hex()
			default:
				return nil
		}
	},
	// ParseValue parses GraphQL variables from `string` to `bson.ObjectId`.
	ParseValue: func(value interface{}) interface{} {
		switch value := value.(type) {
			case string:
				id, _ := primitive.ObjectIDFromHex(value)
				return id
			case \*string:
				id, _ := primitive.ObjectIDFromHex(*value)
				return id
			default:
				return nil
		}
		return nil
	},
	// ParseLiteral parses GraphQL AST to `bson.ObjectId`.
	ParseLiteral: func(valueAST ast.Value) interface{} {
		switch valueAST := valueAST.(type) {
			case *ast.StringValue:
				id, \_ := primitive.ObjectIDFromHex(valueAST.Value)
				return id
		}
		return nil
	},
})

```

Now, we have to tell our GraphQL schema to use the new ObjectID type that we just created.

```go
package gql

import "github.com/graphql-go/graphql"

var Book = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Book",
		Fields: graphql.Fields{
			"id": &graphql.Field{
				Type: ObjectID,
			},
			"title": &graphql.Field{
				Type: graphql.String,
			},
			"deleted": &graphql.Field{
				Type: graphql.Boolean,
			},
		},
	},
)
```

Awesome, now we’re able to return our new Book structure (the one with the objectID) via our GraphQL resolvers and everything works! Here’s an example of a resolver function.

```go

func (r \*Resolver) AddBook(p graphql.ResolveParams) (interface{}, error) {
title, titleOK := p.Args["title"].(string)

    if titleOK {
                // books is of type []Book{}
    	books, _ := r.db.CreateBook(title, r.mongoID)
    	return books, nil
    }

    return nil, nil

}

```

Hopefully, this quick tidbit was as helpful for you as it was for me. [If you’d like to learn more about Go, you can find more of my articles on the language here](/tags/go/)!
