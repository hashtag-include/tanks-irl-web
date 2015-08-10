function Game(player, opponent, modal) {
    this.setPlayer(player);
    if(opponent) {
        this.setOpponent(opponent);
        this.setActivePlayer(opponent);
    } else {
        this.setActivePlayer(player);
    }
    this.modal = modal;
    
    this.socket = io(document.location.origin);
    this.socket.emit('client-connect', { 'id': this.getPlayer().getId(), 'type': 'controller' });
    
    this.setMode(Game.prototype.CONSTANTS.MODES.MOVE);
    this.bindEvents();
};

Game.prototype = {
    player: null,
    opponent: null,
    activePlayer: null,
    socket: null,
    mode: null,
    modal: null,

    constructor: Game,
    bindEvents: function() {
        document.addEventListener(Controller.prototype.CONSTANTS.EVENTS.DPAD.UP, this.onDpadUp.bind(this), false);
        document.addEventListener(Controller.prototype.CONSTANTS.EVENTS.DPAD.RIGHT, this.onDpadRight.bind(this), false);
        document.addEventListener(Controller.prototype.CONSTANTS.EVENTS.DPAD.DOWN, this.onDpadDown.bind(this), false);
        document.addEventListener(Controller.prototype.CONSTANTS.EVENTS.DPAD.LEFT, this.onDpadLeft.bind(this), false);
        document.addEventListener(Controller.prototype.CONSTANTS.EVENTS.BUTTONS.SELECT, this.onSelect.bind(this), false);
        document.addEventListener(Controller.prototype.CONSTANTS.EVENTS.BUTTONS.START, this.onStart.bind(this), false);
        document.addEventListener(Controller.prototype.CONSTANTS.EVENTS.BUTTONS.PRIMARY, this.onPrimary.bind(this), false);
        document.addEventListener(Controller.prototype.CONSTANTS.EVENTS.BUTTONS.SECONDARY, this.onSecondary.bind(this), false);

        this.socket.on(Game.prototype.CONSTANTS.SOCKET.EVENTS.UPDATE, this.onUpdate.bind(this));
        this.socket.on(Game.prototype.CONSTANTS.SOCKET.EVENTS.DISCONNECT, this.onClientDisconnect.bind(this));
        this.socket.on(Game.prototype.CONSTANTS.SOCKET.EVENTS.COMMAND, this.onCommand.bind(this));
    },
    isTurn: function() {
        return this.getActivePlayer().getId() === this.getPlayer().getId() && this.getOpponent() !== null;
    },
    toggleMode: function() {
        this.setMode(this.getMode() === Game.prototype.CONSTANTS.MODES.MOVE ? Game.prototype.CONSTANTS.MODES.AIM : Game.prototype.CONSTANTS.MODES.MOVE);
    },
    toggleTurn: function() {
        if(this.isTurn()) {
            this.setActivePlayer(this.getOpponent());
            this.emitCommand(Game.prototype.CONSTANTS.SOCKET.COMMANDS.TURN_END);
        } else {
            this.setActivePlayer(this.getPlayer());
            this.getPlayer().setFuel(100);
        }
    },
    end: function(isWinner) {
        this.modal.show(isWinner ? 'You Win!' : 'You Lose!', '', 'Main Menu', this.onModalClose.bind(this))
    },
    emitCommand: function(command) {
        this.socket.emit(Game.prototype.CONSTANTS.SOCKET.EVENTS.COMMAND, { 'command': command, 'player': this.getPlayer().serialize() });
    },
    updateOpponentFromGameList: function(gameList) {
        for(var i = 0; i < gameList.sessions.length; i++) {
            if(gameList.sessions[i].host && gameList.sessions[i].host.id) {
                if(gameList.sessions[i].host.id == this.getPlayer().getId()) {
                    if(gameList.sessions[i].opponent && gameList.sessions[i].opponent.id) {
                        this.setOpponent(new Player(gameList.sessions[i].opponent.id, null));
                        return this.getOpponent();
                    }
                }
            }
        }
    },
    
    // Getters and Setters
    getMode: function() {
        return this.mode;
    },
    setMode: function(mode) {
        return this.mode = mode;
    },
    getPlayer: function() {
        return this.player;
    },
    setPlayer: function(player) {
        return this.player = player;
    },
    getOpponent: function() {
        return this.opponent;
    },
    setOpponent: function(opponent) {
        return this.opponent = opponent;
    },
    getActivePlayer: function() {
        return this.activePlayer;
    },
    setActivePlayer: function(activePlayer) {
        return this.activePlayer = activePlayer;
    },
    
    // Events
    onDpadUp: function() {
        if(!this.isTurn()) return;

        if(this.getMode() === Game.prototype.CONSTANTS.MODES.MOVE) {
            if(this.getPlayer().getFuel() >= Game.prototype.CONSTANTS.MODIFIERS.FUEL_DEPLETION_PERCENT) {
                this.getPlayer().setFuel(this.getPlayer().getFuel() - Game.prototype.CONSTANTS.MODIFIERS.FUEL_DEPLETION_PERCENT);
            } else {
                return;
            }
        }
        this.emitCommand(this.getMode() === Game.prototype.CONSTANTS.MODES.MOVE ? 'MOVE_UP' : 'TILT_UP');
    },
    onDpadRight: function() {
        if(!this.isTurn()) return;

        this.emitCommand(this.getMode() === Game.prototype.CONSTANTS.MODES.MOVE ? 'MOVE_RIGHT' : 'PAN_RIGHT');
    },
    onDpadDown: function() {
        if(!this.isTurn()) return;

        if(this.getMode() === Game.prototype.CONSTANTS.MODES.MOVE) {
            if(this.getPlayer().getFuel() >= Game.prototype.CONSTANTS.MODIFIERS.FUEL_DEPLETION_PERCENT) {
                this.getPlayer().setFuel(this.getPlayer().getFuel() - Game.prototype.CONSTANTS.MODIFIERS.FUEL_DEPLETION_PERCENT);
            } else {
                return;
            }
        }
        this.emitCommand(this.getMode() === Game.prototype.CONSTANTS.MODES.MOVE ? 'MOVE_DOWN' : 'TILT_DOWN');
    },
    onDpadLeft: function() {
        if(!this.isTurn()) return;

        this.emitCommand(this.getMode() === Game.prototype.CONSTANTS.MODES.MOVE ? 'MOVE_LEFT' : 'PAN_LEFT');
    },
    onSelect: function() {
        this.modal.show('Exit', 'Are you sure you would like to exit the game?', 'Yes', this.onExit.bind(this), 'No', null);
    },
    onStart: function() {
        if(this.getOpponent() === null) return;

        this.modal.show('Confirm Hit', 'Are you sure you hit the other player?', 'Yes', this.onLogHit.bind(this), 'No', null);
    },
    onPrimary: function() {
        if(!this.isTurn()) return;

        this.emitCommand('FIRE');
        this.toggleTurn();
    },
    onSecondary: function() {
        if(!this.isTurn()) return;

        this.toggleMode();
    },
    onUpdate: function(data) {
        this.updateOpponentFromGameList(data);
    },
    onClientDisconnect: function(data) {
        if(data.id == this.player.getId()) {
            this.modal.show('Oops!', 'Your ' + data.type + ' was disconnected', 'Main Menu', this.onModalClose);
        } else if(data.id == this.opponent.getId()) {
            this.modal.show('Oops!', 'Your opponent\'s ' + data.type + ' was disconnected', 'Main Menu', this.onModalClose);
        }
    },
    onCommand: function(data) {
        switch(data.command) {
            case Game.prototype.CONSTANTS.SOCKET.COMMANDS.TURN_END:
                this.onTurnEnd(data);
                break;
            case Game.prototype.CONSTANTS.SOCKET.COMMANDS.HIT:
                this.onHit(data);
                break;
            case Game.prototype.CONSTANTS.SOCKET.COMMANDS.GAME_OVER:
                this.onGameOver(data);
                break;
        }
    },
    onTurnEnd: function(data) {
        if(!this.isTurn() && data.player.id === this.getOpponent().getId()) {
            this.toggleTurn();
        }
    },
    onLogHit: function() {
        this.emitCommand(Game.prototype.CONSTANTS.SOCKET.COMMANDS.HIT);
    },
    onHit: function(data) {
        if(data.player.id === this.getOpponent().getId()) {
            if(this.getPlayer().getHealth() >= Game.prototype.CONSTANTS.MODIFIERS.HEALTH_DEPLETION_PERCENT) {
                this.getPlayer().setHealth(this.getPlayer().getHealth() - Game.prototype.CONSTANTS.MODIFIERS.HEALTH_DEPLETION_PERCENT);
            } else {
                this.getPlayer().setHealth(0);
            }
            
            if(this.getPlayer().getHealth() === 0) {
                window.setTimeout(function() {
                    this.emitCommand(Game.prototype.CONSTANTS.SOCKET.COMMANDS.GAME_OVER);
                    this.end(false);
                }.bind(this), 1000); // using the same modal object for hit confirmation and game dialog can pose issues when opened simultaneously
                
            }
        }
    },
    onGameOver: function(data) {
        if(data.player.id === this.getOpponent().getId()) this.end(true);
    },
    onExit: function() {
        this.emitCommand(Game.prototype.CONSTANTS.SOCKET.COMMANDS.EXIT);
        window.setTimeout(this.onModalClose, 1000); // allow exit command to be sent before calling onModalClose
    },
    onModalClose: function() {
        window.location.reload();
    },
    
    // Constants
    CONSTANTS: {
        MODES: {
            MOVE: 'MOVE',
            AIM: 'AIM'
        },
        SOCKET: {
            EVENTS: {
                UPDATE: 'update',
                DISCONNECT: 'client-disconnect',
                COMMAND: 'command'
            },
            COMMANDS: {
                TURN_END: 'TURN_END',
                HIT: 'HIT',
                GAME_OVER: 'GAME_OVER',
                EXIT: 'EXIT'
            }
        },
        MODIFIERS: {
            FUEL_DEPLETION_PERCENT: 5,
            HEALTH_DEPLETION_PERCENT: 25
        }
    }
};