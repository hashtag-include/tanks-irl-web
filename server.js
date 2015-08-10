var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 1337);

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));

var gameList = { sessions: [], unmatched: ["5208", "9102", "2138"] };

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/reset', function (req, res) {
    gameList = { sessions: [], unmatched: [] };

    res.status(200).send(gameList);
});

app.get('/game', function (req, res) {
    res.status(200).send(gameList);
});

/**
 * We could remove all this logic and instead do it over websockets,
 * but I didn't want to create a ws connection for each user until they're
 * validated as legitimate (ie, valid unmatched tank requested)
 */
app.post('/game', function (req, res) {
    var response = { message: null, gameList: gameList };
    
    if(req.body.action == 'JOIN') {
        // Find the requested host, ensure there is no opponent and the requested opponent is in the list of unmatched 
        for(var i = 0; i < gameList.sessions.length; i++) {
            if(gameList.sessions[i].host.id == req.body.hostId) {
                if(gameList.sessions[i].opponent == null) {
                    if(gameList.unmatched.indexOf(req.body.playerId) !== -1) {
                        gameList.sessions[i].opponent = { id: req.body.playerId, fuel: 100, health: 100 };
                        gameList.unmatched.splice(gameList.unmatched.indexOf(req.body.playerId), 1);
    
                        response.message = 'OK';
                        response.gameList = gameList;
                        res.status(200).send(response);
                        return;
                    } else {
                        response.message = 'Tank not connected or already connected to another session';
                        res.status(409).send(response);
                        return;
                    }
                    
                    gameList.sessions[i].opponent = { id: req.body.playerId};
                } else {
                    response.message = 'Requested session has been filled';
                    res.status(409).send(response);
                    return;
                }
            }
        }
    } else if(req.body.action == 'HOST') {
        if(gameList.unmatched.indexOf(req.body.hostId) !== -1) {
            gameList.sessions.push({ host: { id: req.body.hostId, fuel: 100, health: 100 }, opponent: null });
            gameList.unmatched.splice(gameList.unmatched.indexOf(req.body.hostId), 1);

            response.message = 'OK';
            response.gameList = gameList;
            res.status(200).send(response);
            return;
        } else {
            response.message = 'Tank not connected or already connected to another session';
            res.status(409).send(response);
            return;
        }
    }
    
    response.message = 'Host has disconnected';
    res.status(409).send(response);
});

function removeTankFromGameList(socket) {
    if(gameList.unmatched.indexOf(socket.clientId) === -1) {
        for(var i = 0; i < gameList.sessions.length; i++) {
            if(gameList.sessions[i].host && gameList.sessions[i].host.id) {
                if(gameList.sessions[i].host.id == socket.clientId) {
                    if(gameList.sessions[i].opponent && gameList.sessions[i].opponent.id) {
                        gameList.unmatched.push(gameList.sessions[i].opponent.id);
                    }
                    gameList.sessions.splice(i, 1);
                    return;
                }
            }

            if(gameList.sessions[i].opponent && gameList.sessions[i].opponent.id) {
                if(gameList.sessions[i].opponent.id == socket.clientId) {
                    if(gameList.sessions[i].host && gameList.sessions[i].host.id) {
                        gameList.unmatched.push(gameList.sessions[i].host.id);
                    }
                    gameList.sessions.splice(i, 1);
                    return;
                }
            }
        }
    } else {
        gameList.unmatched.splice(gameList.unmatched.indexOf(socket.clientId), 1);
    }
}

io.on('connection', function (socket) {
    console.log('[Connection Opened]');
    io.emit('update', gameList);

    socket.on('disconnect', function() {
        removeTankFromGameList(socket);
        io.emit('client-disconnect', { 'id': socket.clientId, 'type': socket.clientType });
    });

    socket.on('client-connect', function(clientInfo) {
        socket.clientType = clientInfo.type;
        socket.clientId = clientInfo.id;
        console.log('Client Type: ' + socket.clientType +'   |   Client ID: ' + socket.clientId);

        if(socket.clientType == 'tank') {
            removeTankFromGameList(socket);
            gameList.unmatched.push(socket.clientId);
        }

        io.emit('update', gameList);
    });

    socket.on('command', function (command) {
        console.log( { 'command' : command } );
        io.emit('command', command);
    });
});