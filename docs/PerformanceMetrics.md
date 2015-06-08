Performance Metrics
===================

# Terms
_**As we discuss metrics below, the following terms will be used to provide clarity**_.  
Controller - the device owned by the user that faciliates interactions via a browser  
PI - the computer that facilitates communication and control on the device  
Arduino - the computer that recieves communication from the PI and controls the motors and servos  
Device - the robot, and robot systems (PI+Arduino) that our game runs on  
Server - the azure service that is responsible for hosting the ui, and establishing a connection between the controller and the device

# Max transfer rate

Our max transfer rate is currently __not applicable__, as it is miles above what is needed to
transfer simple control messages.  

A [websocket](http://www.html5rocks.com/en/tutorials/websockets/basics/) is used
for all communications, but as we're only sending simple opcodes, we get nowhere near the max transfer rate.

# Latency

> Note: real numbers coming soon! As we get our system up and running, these metrics will stabilize.

Latency within our entire system will be quite low. As we're designing a realtime
game, it's important for the user that our system be fast. To facilitate this, we'll
be using websockets to establish control and communication from the controller,
to the server, to the raspberry pi on the device.

# Hardware cost

> Note: minimal load will be placed on the hardware, as we're using parts that are designed for what we're doing.  

The raspberry pi will be used to communicate with an azure
service over a usb wifi adapter, and to control the arduino (to control servos)
via gpio pins. These uses are all well within the bounds of a pi, and should
put minimal additional load on the system.

The arduino will be used to control servos and motors in order to trigger
ping pong ball release, tilt, and speed. The arduino will recieve control
signals via gpio pins, which are written to via the raspberry pi gpio pins.
Again, this will be a low-moderate load, as it's the intented use of the system.

The server load will be moderate, as we're using websockets to facilitate
device communication, which can be a fairly costly thing to maintain, server-side.

The controller load will be low, as all that is required is a browser on the device,
that is capable of connecting to our server in azure.