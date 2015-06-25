var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 1337);

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));

var gameList = { sessions: [], unmatched: [] };

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

function generateGameList() {
    gameList.sessions = [];
    gameList.unmatched = [];
    
    gameList.sessions.push({ host: { id: 'VEFD', fuel: 100, health: 100 }, opponent: null });
    gameList.sessions.push({ host: { id: '1TA0', fuel: 100, health: 100 }, opponent: null });
    gameList.sessions.push({ host: { id: 'XWUP', fuel: 45, health: 70 }, opponent: { id: 'BKUL', fuel: 100, health: 20 } });

    gameList.unmatched.push('X02R', '1TA0', 'SSOE', 'WENV', 'KY8A');
}

generateGameList();
app.get('/generate', function (req, res) {
    generateGameList();
    
    res.status(200).send(gameList);
});

app.get('/game', function (req, res) {
    res.status(200).send(gameList);
});

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
                        response.message = 'Error: Tank not connected or already connected to another session';
                        res.status(409).send(response);
                        return;
                    }
                    
                    gameList.sessions[i].opponent = { id: req.body.playerId};
                } else {
                    response.message = 'Error: Requested session has been filled';
                    res.status(409).send(response);
                    return;
                }
            }
        }
    } else if(req.body.action == 'HOST') {
        
    }
    
    response.message = 'Error: Host has disconnected';
    res.status(409).send(response);
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