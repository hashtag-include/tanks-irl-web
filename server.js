var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(process.env.PORT || 1337);

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
    });
}

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