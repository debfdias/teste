var util    = require('util'),
    events  = require('events')
    _       = require('underscore');

var isPrime = require('prime-number');
var primeNumberList = require('prime-number/list');

function Counter() {
    if(false === (this instanceof Counter)) {
        return new Counter();
    }

    this.second = 1000;  //intervalo entre contagem - sera maior se os numeros primos forem longes um do outro
    this.time = 0;
    this.interval = undefined;

    events.EventEmitter.call(this);

    _.bindAll(this);
};

util.inherits(Counter, events.EventEmitter);

Counter.prototype.start = function() {
    if (this.interval) {
        return;
    }

    console.log('Starting!');

    this.interval = setInterval(this.onTick, this.second);
    this.emit('start:counter');
};

Counter.prototype.stop = function() {
    console.log('Stopping!');
    if (this.interval) {
        clearInterval(this.interval);
        this.interval = undefined;
        this.emit('stop:counter');
    }
};

Counter.prototype.reset = function() {
    console.log('Resetting!');
    this.time = 0;
    this.emit('reset:counter', this.formatTime(this.time));
};

Counter.prototype.onTick = function() {

    for(var i=1;i<2;i++)
    {
        this.time += this.second + i;

        var temp = parseInt(this.time / this.second, 10);

        if(isPrime(temp) && temp!= 1)
        {
            var formattedTime = this.formatTime(this.time);
            this.emit('tick:counter', formattedTime);
        }

        if (this.time === 0) {
            this.stop();
        }
    }
    
    
};

Counter.prototype.formatTime = function(time) {
    var remainder = time,
        numSeconds,
        output = "";

    numSeconds = String(parseInt(remainder / this.second, 10));
    
    output = _.map([numSeconds], function(str) {
        return str;
    }).join(":");

    return output;
};

Counter.prototype.getTime = function() {
    return this.formatTime(this.time);
};

module.exports = Counter;