---
title: "gRPC fundamentals with Go"
date: 2024-07-13
status: publish
permalink: /todo
author: "Brad Cypert"
type: blog
images:
  - coffeeshop_proto.png
tags:
  - go
  - grpc
description: "gRPC (Remote Procedure Call) is a powerful tool for building robust and scalable communication between server applications.  It offers several advantages over traditional REST APIs, including type safety, performance optimizations, and a cleaner development experience.  In this blog post, we'll explore how to leverage gRPC with Go to establish communication between servers. We'll build a simple coffee shop example where a coffee shop client communicates with a server to manage orders."
outline:
  what: "gRPC is an excellent tool for server-to-server communication"
  why: "gRPC is a remote procedure call over the internet, granting it typesafety and allowing you to make changes to the interface without breaking the existing contract."
  how: "Golang examples will be provided for a simple coffee shop server + client."
  when: "gRPC should be considered when working with server to server communication, or server and client communication provided the client is not a web app (at this time, at least)"
---

gRPC (Remote Procedure Call) is a powerful tool for building robust and scalable communication between server applications.  It offers several advantages over traditional REST APIs, including type safety, performance optimizations, and a cleaner development experience.  In this blog post, we'll explore how to leverage gRPC with Go to establish communication between servers. We'll build a simple coffee shop example where a coffee shop client communicates with a server to manage orders.

## Why gRPC?

There are several compelling reasons to consider gRPC for server-to-server communication:

- Type Safety: gRPC enforces message structures defined in Protocol Buffers (Protobuf). This ensures compatibility between services and prevents unexpected data types from causing errors.
- Performance: gRPC utilizes a compact binary encoding format for messages, leading to faster transmission and lower resource consumption compared to JSON-based APIs.
- Efficiency: gRPC offers features like streaming RPCs, allowing for efficient handling of large data transfers or real-time updates.

## Building a Coffee Shop with gRPC and Go

Let's dive into building a practical example using gRPC and Go.  We'll create a coffee shop server that offers functionalities like retrieving menus, placing orders, and checking order status. A separate client server will interact with the coffee shop server to simulate these actions.

### Defining Messages with Protocol Buffers

Protocol Buffers (Protobuf) plays a crucial role in gRPC communication. It's a language-neutral mechanism for defining message structures used to exchange data between services.  Our project utilizes a .proto file to define messages like MenuRequest, Order, Receipt, and OrderStatus. This file is called **coffee_shop.proto**.

```proto
syntax = "proto3";
package coffeeshop;

option go_package = "github.com/bradcypert/proto_example/coffeeshop_protos";

service CoffeeShop {
  rpc GetMenu(MenuRequest) returns (stream Menu) {}
  rpc PlaceOrder(Order) returns (Receipt) {}
  rpc GetOrderStatus(Receipt) returns (OrderStatus) {}
}

message MenuRequest {}

message Order {
  repeated Item items = 1;
}

message Receipt {
  string id = 1;
}

message OrderStatus {
  string orderId = 1;
  string status = 2;
}

message Menu {
  repeated Item items = 1;
}


message Item {
  string id = 1;
  string name = 2;
}
```

There's quite a lot going on in this little proto file! First, we're specifying that we're using the proto3 syntax. Second, we define a package. This is to help with naming collisions and is essentially a namespace. Third, we define a service called CoffeeShop. This service has three remote procedure calls (rpcs). We'll get into these in just a moment. Lastly, we have a slew of messages. Messages are the communication format for gRPC. We _send_ messages and _recieve_ messages when communicating over gRPC. You'll notice something interesting about these messages though. The types appear to be wrong (1 is not a string). With gRPC, we assign a number to each property of a message. That number is the field identifier. When we serialize or deserialize a gRPC message (our libraries do this for us), we use those indices to determine what value belongs in what space of the (de)serialized object. 

The short and sweet is this: all fields have a number assigned to them, and once you have assigned a number to a field for a message you **DO NOT** change it. When you want to add new data a message, you add a new fields and give it a new number, even if it is replacing an old field. The last call out for messages is that if we want to work with a list of objects, we use the `repeated` keyword like I did above in the menu message.

Now, back to that service definition! This is definitely the most interesting part (to me, at least) of the proto file. We define three methods on our service, `GetMenu` which takes in a `MenuRequest` (which is empty) and _streams_ a `Menu` back to the caller, `PlaceOrder` which takes in an `Order` and returns a `Receipt`, and `GetOrderStatus` which takes in a `Receipt` and returns an `OrderStatus`. Two special callouts here: The MenuRequest message is empty. gRPC always uses messages to communicate, so we can't have a service that takes in 0 arguments, so in our case, we use a message with no properties. The second thing is that this method _streams_ the response back. The coffee shop piece here is a bit of a weird example, but we're able to stream multiple items back to the client with this approach, and with some changes to our proto file, clients can also stream data to our server! How neat!

### Generating Code

We need to convert this protobuf file into something more usable. In our case, that's going to be Go code. You can run the following to do just that:

```bash
protoc --go_out=./coffeeshop_proto --go_opt=paths=source_relative \
    --go-grpc_out=./coffeeshop_proto --go-grpc_opt=paths=source_relative \
    coffee_shop.proto
```

That being said, you do need to install the protobuf compiler (`brew install protobuf` on mac, [other OS instructions here](https://grpc.io/docs/protoc-installation/)) to run the above code. Let's take this a step further and throw it in a Makefile so we don't have to remember all of that.

```Makefile
build_proto:
	protoc --go_out=./coffeeshop_proto --go_opt=paths=source_relative \
    --go-grpc_out=./coffeeshop_proto --go-grpc_opt=paths=source_relative \
    coffee_shop.proto
```

Sweet, now we can just run `make build_proto` to regenerate our code from the protocol file.


### Implementing the Coffee Shop Server in Go

The coffee shop server is a Go application responsible for handling gRPC requests from the client server.  Here's a breakdown of the key functionalities:

- Registering the Service: The server creates a gRPC server object and registers our CoffeeShop service with it. This service definition is generated from our .proto file using Go's protocol buffer tools.

- Handling Requests: The server implements the gRPC methods defined in the .proto file. These methods handle incoming requests from the client, potentially interact with a database or perform calculations, and return appropriate responses.

Here's an example of how the server might handle the GetMenu request:

```go
func (s *server) GetMenu(menuRequest *pb.MenuRequest, srv pb.CoffeeShop_GetMenuServer) error {
  items := []*pb.Item{
    &pb.Item{Id: "1", Name: "Black Coffee"},
    &pb.Item{Id: "2", Name: "Americano"},
    &pb.Item{Id: "3", Name: "Vanilla Soy Chai Latte"},
  }

  for _, item := range items {
    srv.Send(&pb.Menu{Items: []*pb.Item{item}})
  }

  return nil
}
```

This code snippet demonstrates server-side streaming for the `GetMenu` method. It iterates over a predefined slice of `pb.Item` and sends them one by one using `srv.Send`. In a real-world scenario, the server would likely retrieve menu items from a database, separate network calls, or even call out to IoT devices to get stock levels.

**NOTE: `pb` is a package alias for our generated code from our protocol file. You'll be able to see that in the full server code in just a moment.**

When you're not working with streams (as is our two other methods), things get even simpler. Our place order method will look like the following:

```go
func (s *server) PlaceOrder(context.Context, *pb.Order) (*pb.Receipt, error) {
	return &pb.Receipt{
		Id: "ABC123",
	}, nil
}
```

This receiver function exists on the server struct and receives a context and an Order from our generated code (`pb`), and returns a `pb.Receipt` and an error. In the case of an actual coffee shop, we wouldn't hardcode the values here and would likely interface with a POS api, but I don't have one of those on hand and my local coffee shop was _not_ thrilled when I suggested they let me interface with theirs 🙃.

With this in mind, here's the entirity of server.go:

```go
package main

import (
	"context"
	"log"
	"net"

	pb "github.com/bradcypert/proto_example/coffeeshop_proto"
	"google.golang.org/grpc"
)

// Create a struct and embed our UnimplementCofeeShopServer
// We provide a full implementation to the methods that this embedded struct specifies down below
type server struct {
	pb.UnimplementedCoffeeShopServer
}

// Get a menu, stream the response back to the client
func (s *server) GetMenu(menuRequest *pb.MenuRequest, srv pb.CoffeeShop_GetMenuServer) error {
	items := []*pb.Item{
		&pb.Item{
			Id:   "1",
			Name: "Black Coffee",
		},
		&pb.Item{
			Id:   "2",
			Name: "Americano",
		},
		&pb.Item{
			Id:   "3",
			Name: "Vanilla Soy Chai Latte",
		},
	}

  // weird little gimmicky way to "simulate" streaming data back to the client
  // ideally this is representing sending the pieces of data we have back as we get them
	for i, _ := range items {
		srv.Send(&pb.Menu{
			Items: items[0 : i+1],
		})
	}

	return nil
}

// Place an order
func (s *server) PlaceOrder(context.Context, *pb.Order) (*pb.Receipt, error) {
	return &pb.Receipt{
		Id: "ABC123",
	}, nil
}

// Get order status
func (s *server) GetOrderStatus(context context.Context, receipt *pb.Receipt) (*pb.OrderStatus, error) {
	return &pb.OrderStatus{
		OrderId: receipt.Id,
		Status:  "IN PROGRESS",
	}, nil
}

func main() {

  // setup a listener on port 9001
	lis, err := net.Listen("tcp", ":9001")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

  // create a new grpc server
	grpcServer := grpc.NewServer()

  // register our server struct as a handle for the CoffeeShopService rpc calls that come in through grpcServer
	pb.RegisterCoffeeShopServer(grpcServer, &server{})

  // Serve traffic
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %s", err)
	}
}

```

The few pieces we haven't covered yet are our struct and the main function. For our struct, we're simply embedding `UnimplementedCoffeeShopServer` which is generated by our codegen process. The functions we're defining on our struct help us adhere to the `UnimplementedCoffeeShopServer` interface.

Our main function is fairly strightforward, too, barring one magical piece. We're creating a net listener on port 9001, then creating a new grpcServer, and then calling `RegisterCoffeeShopServer` from our generated code, providing it our newly created `grpcServer` and an instance of our `server` struct. This "magical" piece handles binding the server so that it will handle gRPC invocations that it supports. Finally, we call `Serve` on our grpcServer, passing in the listener that it should listen on.

We should be able to run our server now, although it doesn't seem to do anything at this point:
```bash
go run server.go
```

### Creating a Client in Go

This is all well and good, but a server does nothing if a client can't communicate with it, and while gRPC is nice, it doesn't have the discovery of something like REST or HATEOAS (it wasn't designed to, though!). We need a client to communicate with our server.

Now, one of the nice things about gRPC is that these calls are treated like remote procedure calls and they're type-safe, but we can generate a client in any language that gRPC supports and call into our server, even if the two languages aren't the same. So, while we could write our client in Node, Dart, Python, Ruby, Java, or several others, I'm a gopher and we're going to write it in Go.

The client will interact with the coffee shop server using gRPC. Here's a breakdown of the key functionalities:

1. Connecting to the Server: The client establishes a gRPC connection to the coffee shop server at a specified address (e.g., localhost:9001). It's important to use secure communication channels with appropriate TLS certificates in production environments.

2. Creating a Client Stub: The client creates a client stub for the CoffeeShop service using the generated Go code from the .proto file. This stub provides methods that correspond to the gRPC service definitions.

3. Calling Service Methods: The client uses the stub to call service methods on the coffee shop server. These calls can involve sending requests and receiving responses.

```go
package main

import (
	"context"
	"io"
	"log"
	"time"

	pb "github.com/bradcypert/proto_example/coffeeshop_proto"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func main() {
  // Create a new grpc client
	conn, err := grpc.NewClient("localhost:9001", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("failed to connect to gRPC server at localhost:9001: %v", err)
	}
  // dont forget to close it
	defer conn.Close()

  // create a new coffee shop client from our generated code and pass in the connection created above
	c := pb.NewCoffeeShopClient(conn)

  // give us a context that we can cancel, but also a timeout just to illustrate a point
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	// stream the menu
	menuStream, err := c.GetMenu(ctx, &pb.MenuRequest{})
	if err != nil {
		log.Fatalf("error calling function SayHello: %v", err)
	}

  // this next bit is some channel manipulation to let a go routine run with recieving messages from the stream.
  // there are other ways to handle this, but this is how I choose to handle it.
	done := make(chan bool)

  // We'll store the items here so that we can refer to them after streaming
	var items []*pb.Item

  // start a go routine that runs until we get an EOF from the stream.
  // We use this because our server sends us a partial menu as it builds up a menu in memory.
  // When we get an EOF, the stream is finished and we have the most up to date menu.
	go func() {
		for {
			resp, err := menuStream.Recv()
			if err == io.EOF {
				done <- true
				return
			}
			if err != nil {
				log.Fatalf("can not receive %v", err)
			}
      // Store the last message's items for use later
			items = resp.Items
			log.Printf("Resp received: %v", resp.Items)
		}
	}()

  // Wait until that done channel has a message.
	<-done

  // Make a simple call to order all the items on the menu
	receipt, err := c.PlaceOrder(ctx, &pb.Order{Items: items})
	log.Printf("%v", receipt)

  // Make a simple call to get the order status.
	status, err := c.GetOrderStatus(ctx, receipt)
	log.Printf("%v", status)
}
```

I took the liberty of adding additional comments to the code here to help explain the pieces as you read through it, but I'll recap it once more, too. We're creating a new gRPC client and pointing it to the port that our gRPC server (so the two can talk together). We're then getting some typesafety by passing that connection to our generated code which ultimately creates a CoffeeShopClient for us. This client is for our `CoffeeShopService` defined in our Protobuf file and provides the methods that we have specified on that service in our Protobuf file.

Over the next chunk of code, we call all three methods. The first streams the menu to us until it's finished streaming, and we store the menu items in a slice to use in the next block of code. That block of code calls the `PlaceOrder` method, passing in all the items on the Menu (🤑). That method returns a receipt, which we then use to get the order status of that receipt, which returns us the status.

Let's go ahead and (in a new terminal) run our client, too. Make sure your server is still running before running your client!

```bash
➜ go run client/client.go
2024/07/13 21:46:06 Resp received: [id:"1" name:"Black Coffee"]
2024/07/13 21:46:06 Resp received: [id:"1" name:"Black Coffee" id:"2" name:"Americano"]
2024/07/13 21:46:06 Resp received: [id:"1" name:"Black Coffee" id:"2" name:"Americano" id:"3" name:"Vanilla Soy Chai Latte"]
2024/07/13 21:46:06 id:"ABC123"
2024/07/13 21:46:06 orderId:"ABC123" status:"IN PROGRESS"
```

Now we're cookin' with oil! 

#### Additional Considerations

This client code has a couple of bad practices and I want to call those out. I choose to follow these practices in an effort to keep this tutorial simple and maintain some brevity with the code, but you should always consider these items when writing Go (or code in general, really):

- Error Handling: It's crucial to implement proper error handling mechanisms in both the server and client code to gracefully handle potential issues during communication or internal operations. These are remote calls and they can fail just like any other remote call.
- Context Objects: While I did not get into this with my code, context objects (context.Context) offer valuable functionalities in gRPC. You can use them to manage deadlines, cancellation of RPCs, and propagate context information throughout the request-response cycle.
- Security: For production environments, ensure secure communication channels using TLS certificates and appropriate authentication mechanisms. Don't be insecure.

## That's all folks!

At this point, you've got a working client and server communicating together over grpc. If you want to make changes to the schema, you'll do that in the proto file, and you WILL NOT remove fields or re-number the indexes. Then, you'll be able to run `make build_proto` and get the newly generated messages and schema. I hope you found this help, and if so, connect with me on [X](https://x.com/bradcypert/) or [Linkedin](https://www.linkedin.com/in/bradcypert)!
