var socket = io.connect(window.location.hostname);

socket.on('value', function (data) {
    $('#count').html(data.value);
});

$('#start').click(function() {
    socket.emit('click:start');
});

$('#stop').click(function() {
    socket.emit('click:stop');
});

$('#reset').click(function() {
    socket.emit('click:reset');
});