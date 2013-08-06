Levitate - LeapMotion Frame Processing
======================================

## Motivation

The [LeapMotion JS library](https://github.com/leapmotion/leapjs) is a nice interface into a stream of frames, but often you need to keep track of the state of hands. Instead of rolling my own everytime, I wrote Levitate to provide a new Evented abstraction to managing the state of hands in my applications.

## Dependencies

* [Underscore](https://github.com/jashkenas/underscore)
* [EventEmitter](https://github.com/Wolfy87/EventEmitter)

## Usage

Wire up Levitate to capture the frames from the Leap.js `loop`

```javascript
var lev = new Levitate();
Leap.loop(function(frame) {
    lev.handleFrame(frame);
});
```

### Detect Incoming Hands

Instead of manually parsing the frames from Leap.js and keeping the state of hands, let Levitate do it for you.

```javascript
lev.on('hand:new', function(id, hand){
    // id - id of incoming hand
    // hand - LevitateHand object (contains frame data for that hand)
});
```

Now that you have the ID of a new hand, register events to listen track just that hand alone.

```javascript
lev.on('hand:new', function(id, hand){
    // id - id of incoming hand
    // hand - LevitateHand object (contains frame data for that hand)
    lev.on('hand:' + id + ':frame', function(hand) {
        // hand - LevitateHand object (contains frame data for that hand)
    });

    lev.on('hand:' + id + ':remove', function() {
        // Hand has left and will no longer be tracked.
        // Probably a good time to unbind some events
    });

});
```

Levitate will also let you know about what side of the LeapMotion the hand comes in on. Helpful for multihand applications. Here is an example of tracking new right hands.

```javascript
lev.on('hand:new:right', function(id, hand){
    // id - id of incoming hand
    // hand - LevitateHand object (contains frame data for that hand)
    lev.on('hand:' + id + ':frame', function(hand) {
        // hand - LevitateHand object (contains frame data for that hand)
    });

    lev.on('hand:' + id + ':remove', function() {
        // Hand has left and will no longer be tracked.
        // Probably a good time to unbind some events
    });

});
```

## TODO

* Add tests
* Pointer support without hands
* Gesture support
