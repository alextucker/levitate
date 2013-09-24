// levitate.js
// version 1.0.0
// Author: Alex Tucker    Twitter: @_AlexTucker    GitHub: alextucker   Web: http://tucker.io
// Levitate may be freely distributed under the MIT license.

var LevitateHand = (function() {
    var LevitateHand = function(handFrame) {
        this.frame = handFrame;
        this.id = handFrame.id;
    }

    LevitateHand.prototype = {
        side: function() {
            return (this.frame.palmPosition[0] >= 0) ? 'right' : 'left';
        },

        getExtendedFinger: function() {
            var longest = {length:0}
            for (var i=0; i < this.frame.fingers.length; i++) {
                if (this.frame.fingers[i].length > longest.length) {
                    longest = this.frame.fingers[i];
                }
            }
            return longest;
        }
    };

    return LevitateHand;
})();


var Levitate = (function(EventEmitter){
    var Levitate = function() {
        this.left = false;
        this.right = false;
        this.hands = {}
        this.hasHand = false;
    };


    Levitate.prototype = {
        handleFrame: function(frame) {
            this.currentFrame = frame;
            if(frame.hands.length > 0 && ! this.hasHand) {
                this.hasHand = true;
                this.emitEvent('hand:enter');
            } if (frame.hands.length === 0 && this.hasHand){
                this.hasHand = false;
                this.emitEvent('hand:leave');
            }

            this.processHands(frame.hands);
        },

        processHands: function(hands) {
            var foundHands = {}
            for(var i = 0; i < hands.length; i++) {
                var handId = hands[i].id;
                foundHands[hands[i].id] = new LevitateHand(hands[i]);
                if( ! this.hands[handId]) {
                    // New Hands
                    var side = foundHands[handId].side();
                    this.emitEvent("hand:new", [handId, foundHands[handId]]);
                    this.emitEvent("hand:new:" + side, [handId, foundHands[handId]]);

                } else {
                    // Existing Hand
                    this.emitEvent("hand:" + handId + ":frame", [foundHands[handId]]);
                }
            }

            // Removed Hands
            for(id in this.hands) {
                if( ! foundHands[id]) {
                    this.emitEvent("hand:" + id + ":remove", [id]);
                }
            }

            // Save Reference for processing next frame.
            this.hands = foundHands;
        }
    };

    _.extend(Levitate.prototype, EventEmitter.prototype);
    return Levitate;
})(EventEmitter);
