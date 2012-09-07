/* Created by Daniel Hood <hood.danielc@gmail.com>
 *
 * For more control over carousel, use startNow: false, and
 * use the tick(distance) method in Carousel class
 * Code dependencies : jQuery
 */

var Carousel = function(config) {
    this.container = config.container || $('body');
    this.speed = (config.speed || 1) + 1;
    this.rate = config.rate || 30;
    this.spaceOffset = config.spaceOffset || 0.5,
    this.minSize = config.minSize || 0;
    this.startNow = config.startNow || true;
    this.init();
}

Carousel.prototype = {
    children: null,
    defaultChildSize: null,
    containerHeight: null,
    containerMiddle: null,
    minDistance: null,
    maxDistance: null,

    init: function() {
        this.children = this.container.children();
        this.container.css('position', 'relative');
        this.containerMiddle = this.container.width() / 2;
        this.containerHeight = this.container.height();
        this.defaultChildSize = $(this.children[0]).width();
        this.maxDistance = ((this.children.length * this.spaceOffset) / 2);
        this.minDistance = this.maxDistance * -1;
        for (var i = 0; i < this.children.length; i++) {
            var child = $(this.children[i])
            child.css('position', 'absolute');
            this.setPosition(child, i * this.spaceOffset);
        }
        if (this.startNow) {
            this.start();
        }
    },

    /*
    * Calculate size of box according to position
    * * * */
    calculateSize: function(pos) {
        if (pos < 0) {
            pos *= -1;
        }
        size = (this.containerMiddle / (pos + this.containerMiddle)) * this.defaultChildSize;
        return size;
    },

    /*
    * Set item position in carousel. 
    * pos 0 is middle, negative for left and positive for right
    * * * */
    setPosition: function(child, pos) {
        var calculatedSize = this.calculateSize(pos);
        child.css('width', calculatedSize);
        child.css('height', calculatedSize);
        child.css('left', (pos + this.containerMiddle) - (parseInt(child.css('width')) / 2))
        child.css('top', (this.containerHeight / 2) - (parseInt(child.css('height')) / 2));
    },

    /*
    * Get middle pixel of child
    * * * */
    getChildMiddle: function(child) {
        var left = parseInt(child.css('left'));
        var width = parseInt(child.css('width'));
        return (left - this.containerMiddle) + (width / 2);
    },

    /*
    * negative distance for left, positive for right
    */
    tick: function(distance) {
        for (var i = 0; i < this.children.length; i++) {
            var child = $(this.children[i]);
            var newPos = this.getChildMiddle(child) + distance;
            if (newPos <= this.minDistance) {
                newPos += (this.minDistance * -2);
            } else if (newPos >= this.maxDistance) {
                newPos -= (this.maxDistance * 2);
            }
            this.setPosition(child, newPos);
        }
    },

    start: function() {
        setInterval($.proxy(function() {
            this.tick(this.speed * -1);
        }, this), this.rate);
    }
}

$(document).ready(function() {
    var carousel = new Carousel({
        container: $('#carousel_container'), // What holds the carousel items
        spaceOffset: 250, // how far they carousel children should be spaced
        speed: 1, // how many pixels per tick
        rate: 30, // how fast each frame is in milliseconds (frame rate)
        startNow: true
    });
});