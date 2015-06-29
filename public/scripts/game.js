function Game(player, opponent, modal) {
    this.setPlayer(player);
    if(opponent) this.setOpponent(opponent);
    this.modal = modal;
    
    this.socket = io(document.location.origin);
    this.socket.emit('client-connect', { 'id': this.getPlayer().getId(), 'type': 'controller' });
    
    this.setMode(Game.prototype.CONSTANTS.MODES.MOVE);
    this.bindEvents();
};

Game.prototype = {
    player: null,
    opponent: null,
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

        this.socket.on('update', this.onUpdate.bind(this));
        this.socket.on('client-disconnect', this.onClientDisconnect.bind(this));
    },
    toggleMode: function() {
        this.setMode(this.getMode() === Game.prototype.CONSTANTS.MODES.MOVE ? Game.prototype.CONSTANTS.MODES.AIM : Game.prototype.CONSTANTS.MODES.MOVE);
    },
    emitCommand: function(command) {
        this.socket.emit('command', { 'command': command, 'player': this.getPlayer().serialize() });
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
    
    // Events
    onDpadUp: function() {
        this.emitCommand(this.getMode() === Game.prototype.CONSTANTS.MODES.MOVE ? 'MOVE_UP' : 'TILT_UP');
    },
    onDpadRight: function() {
        this.emitCommand(this.getMode() === Game.prototype.CONSTANTS.MODES.MOVE ? 'MOVE_RIGHT' : 'PAN_RIGHT');
    },
    onDpadDown: function() {
        this.emitCommand(this.getMode() === Game.prototype.CONSTANTS.MODES.MOVE ? 'MOVE_DOWN' : 'TILT_DOWN');
    },
    onDpadLeft: function() {
        this.emitCommand(this.getMode() === Game.prototype.CONSTANTS.MODES.MOVE ? 'MOVE_LEFT' : 'PAN_LEFT');
    },
    onSelect: function() {},
    onStart: function() {
        this.emitCommand('EXIT');
    },
    onPrimary: function() {
        this.emitCommand('FIRE');
    },
    onSecondary: function() {
        this.toggleMode();
    },
    onUpdate: function(data) {
        this.updateOpponentFromGameList(data);
    },
    onClientDisconnect: function(data) {
        console.log(data);
        if(data.id == this.player.getId()) {
            this.modal.show('Your ' + data.type + ' was disconnected', 'Main Menu', this.onModalClose);
        } else if(data.id == this.opponent.getId()) {
            this.modal.show('Your ' + data.type + ' was disconnected', 'Main Menu', this.onModalClose);
        }
    },
    onModalClose: function() {
        window.location.reload();
    },
    
    // Constants
    CONSTANTS: {
        MODES: {
            MOVE: 'MOVE',
            AIM: 'AIM'
        }
    }
};