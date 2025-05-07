---
title: "Building a Soil Moisture Sensor in TinyGo with Arduino"
date: 2025-05-06
status: publish
permalink: /building-a-soil-moisture-sensor-in-tinygo-with-arduino
author: "Brad Cypert"
type: blog
tags:
  - tinygo
  - golang
  - arduino
  - microcontrollers
  - project
images:
  - IMG_3290.JPG
description: "Programming a Microcontroller in Go is easy. Here's how I programmed my Arduino to read soil moisture and display it on an LCD."
versions:
  go: tinygo 0.37.0
outline:
  what: "You can build cool shit with TinyGo and Arduino"
  why: "TinyGo makes microcontroller programming accessible via Go"
  how: "Flashing TinyGo programs to a microcontroller via AVRDude or similar"
  when: "When you want to do hardware programming but want to stick with Go instead of C or C++"
---

# Building a Soil Moisture Sensor in TinyGo with Arduino

If you're a Go developer and want to dip your toes into the world of hardware, I’ve got good news: you can absolutely build cool stuff—like a soil moisture sensor—without switching to C or C++. Thanks to [TinyGo](https://tinygo.org), you can write Go code for microcontrollers like the Arduino. And yes, it’s as fun and straightforward as it sounds.

In this post, I’ll walk you through building a soil moisture sensor that reads data and displays it on an LCD screen—all written in Go using TinyGo.

## Why TinyGo?

Microcontroller development is traditionally done in C or C++, but for many of us who love Go, this can feel like stepping back in time. TinyGo changes the game by compiling Go programs to run on small devices. It supports a growing number of microcontrollers and comes with a solid standard library for embedded development.

If you're already familiar with Go, this gives you a huge head start. You get familiar syntax, strong typing, and tooling you already know how to use.

## What You’ll Need

Here’s the hardware setup I used:

- [Inventr.io HERO board (Any Arduino-like will work, though you may need to find a second 5v)](https://craftingtable.com/products/hero-board-usb-cable?_pos=3&_psq=hero&_ss=e&_v=1.0)
- [Capacitive Soil Moisture Sensor](https://www.amazon.com/dp/B07H3P1NRM?ref=ppx_yo2ov_dt_b_fed_asin_title)
- [I2C 16x2 LCD display](https://www.amazon.com/Hosyond-Display-Module-Arduino-Raspberry/dp/B0BWTFN9WF?crid=2POAK5T7LIIOO&dib=eyJ2IjoiMSJ9.xYzwoFjr-84e6rWaV3cwEF2jmcqH8DdSFmFppcF8N9iKioyTCB-ppR8U7MhFJa88yi1TS5q5ALmEaJ2pKxhDIDa8wnsLsiR8kmNNelhu-zS4qzyQvZSyGAJr7o2wCVg4P6ee4CB4fQAgEXA8-n0AYD3LfMGleIhjKSAV3mpJjTgrlLYxITQZLqHZBeCxT032i-ZTG3qKzvI4aOq46xOMt2BzHSdU5nx0v5MpSWHPOUM.iGYw18HnaWv5wyPpcx0JioSI02UajN2Cduzr1RWu3xo&dib_tag=se&keywords=I2C%2B16x2%2BLCD%2Bdisplay&qid=1746051351&sprefix=i2c%2B16x2%2Blcd%2Bdisplay%2Caps%2C143&sr=8-3&th=1)
- jumper wires
- USB cable for flashing

**Software:**

- [TinyGo v0.37.0](https://tinygo.org/getting-started/)
- [avrdude](https://github.com/avrdudes/avrdude) for flashing your compiled binary
- [Go](https://go.dev/) toolchain (TinyGo uses parts of it)

## Wiring It Up

![Arduino wired up to sensor and LCD display](/IMG_3290.JPG)

To help you visualize the connections, here's an overview:

```
Arduino <=> LCD
GND <----> GND
+5V <----> VCC
SDA <----> A4
SCL <----> A5

Arduino <=> Soil Moisture Sensor
AOUT <----> A0
VCC <-----> 5V
GND <-----> GND
```

## Project Setup

Create a new directory to hold your code. In that directory, run `go mod init` and `go get tinygo.org/x/drivers/hd44780i2c`.
I'm going to shar eall the source code here, but I'll highlight some key pieces in just a second. For now, read through it all.

## Source Code

```go
package main

import (
	"machine"
	"strconv"
	"time"

	"tinygo.org/x/drivers/hd44780i2c"
)

const led = machine.LED

func main() {
	println("Hello, TinyGo")
	machine.InitADC()

	i2c := machine.I2C0
	err := i2c.Configure(machine.I2CConfig{})
	if err != nil {
		println("could not configure I2C:", err)
		return
	}

	lcd := hd44780i2c.New(machine.I2C0, 0x27)
	lcd.Configure(hd44780i2c.Config{
		Width:  16,
		Height: 2,
	})

	sensor := machine.ADC{machine.ADC0}
	sensor.Configure(machine.ADCConfig{})

	for {
		val := sensor.Get()
		lcd.ClearDisplay()
		if val < 16500 {
			lcd.Print([]byte("Soil is fine\n" + strconv.Itoa(int(val))))
		} else {
			lcd.Print([]byte("Soil needs water\n" + strconv.Itoa(int(val))))
		}
		time.Sleep(time.Millisecond * 1000)
	}
}
```

## Breaking the Code Apart

We're going to use this section to step through the interesting blocks of code piece by piece.

```go
machine.InitADC()
```

This line initializes the analog to digital converter. If you're using Analog pins, you're going to want to initialize this.

```go
  i2c := machine.I2C0
	err := i2c.Configure(machine.I2CConfig{})
	if err != nil {
		println("could not configure I2C:", err)
		return
	}

	lcd := hd44780i2c.New(machine.I2C0, 0x27)
	lcd.Configure(hd44780i2c.Config{
		Width:  16,
		Height: 2,
	})
```

This block of code gets a handle on the I2C0 layer, configures that layer using default values and then passes the I2C0 to our hd44780i2c library. I2C is short for "Inter-integrated circuit" and includes the SDA and SCL ports. SDA is short for Serial Data and SCL is short for Serial Clock. [You can find more information on I2C, SDA, and SCL here](https://www.circuitbasics.com/basics-of-the-i2c-communication-protocol/), but for now, you know everything you need to continue this tutorial.

```go
sensor := machine.ADC{machine.ADC0}
sensor.Configure(machine.ADCConfig{})
```

These lines configure a reference to our sensor, which is plugged into the ADC0 PIN. We'll recieve data over this pin on an interval and act on this data in just a moment.

```go
  for {
		val := sensor.Get()
		lcd.ClearDisplay()
		if val < 16500 {
			lcd.Print([]byte("Soil is fine\n" + strconv.Itoa(int(val))))
		} else {
			lcd.Print([]byte("Soil needs water\n" + strconv.Itoa(int(val))))
		}
		time.Sleep(time.Millisecond * 1000)
	}
```

And here's that moment! We're setting up a for loop that runs indefinitely (as long as the machine is powered on). In this loop, we're getting a reading from our sensor and then we're clearing the connected LCD display. Again, the hd44780i2c library makes short work of this for us. Then, we check if the value is lower than 16500 (an arbitrary number that I picked based on a sensor reading after dipping my sensor partially in a cup of water) -- if it is lower, than we print to the LCD screen including the current sensor value. The line break ensures that the sensor reading is placed on the second line of our LCD.

The else condition is more-or-less the same, we just change the message that is printed. Finally, we sleep for 1 second and then let the for loop repeat.
