var express = require('express'),
    app = module.exports = express.createServer(express.logger()),
    io = require('socket.io').listen(app);
    Counter = require('./models/counter'),
    routes = require('./routes');

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

// Routes


// Use the port that Heroku provides or default to 5000
var port = process.env.PORT || 5000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(port, function() {
  console.log("Express server listening on port %d", app.address().port);
});

app.get('/', routes.index);

var counter = new Counter();
counter.on('tick:counter', function(value) {
  io.sockets.emit('value', { value: value });
});

counter.on('reset:counter', function(value) {
  io.sockets.emit('value', { value: value });
});

//stopwatch.start();

io.sockets.on('connection', function (socket) {
  io.sockets.emit('value', { value: counter.getTime() });

  socket.on('click:start', function () {
    counter.start();
  });
  
  socket.on('click:stop', function () {
    counter.stop();
  });

  socket.on('click:reset', function () {
    counter.reset();
  });
});