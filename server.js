var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 1337);

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('[Connection Established]');

    socket.on('MOVE', function (direction) {
        console.log( { 'MOVE' : direction } );
        io.emit('MOVE', direction);
    });
    socket.on('EXIT', function (direction) {
        console.log( { 'EXIT' : true } );
        io.emit('EXIT', true);
    });
});