function Game(player) {
    this.player = player;
    this.socket = io(document.location.origin);
};

Game.prototype = {
    player: null,
    socket: null,
    mode: null,

    constructor: Game,
    init: function() {
        this.player.init();

        this.player.setFuel(100);
        this.player.setHealth(100);

        this.setMode(Game.prototype.CONSTANTS.MODES.MOVE);
        
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener(Controller.prototype.CONSTANTS.EVENTS.DPAD.UP, this.onDpadUp.bind(this), false);
        document.addEventListener(Controller.prototype.CONSTANTS.EVENTS.DPAD.RIGHT, this.onDpadRight.bind(this), false);
        document.addEventListener(Controller.prototype.CONSTANTS.EVENTS.DPAD.DOWN, this.onDpadDown.bind(this), false);
        document.addEventListener(Controller.prototype.CONSTANTS.EVENTS.DPAD.LEFT, this.onDpadLeft.bind(this), false);
        document.addEventListener(Controller.prototype.CONSTANTS.EVENTS.BUTTONS.SELECT, this.onSelect.bind(this), false);
        document.addEventListener(Controller.prototype.CONSTANTS.EVENTS.BUTTONS.START, this.onStart.bind(this), false);
        document.addEventListener(Controller.prototype.CONSTANTS.EVENTS.BUTTONS.PRIMARY, this.onPrimary.bind(this), false);
        document.addEventListener(Controller.prototype.CONSTANTS.EVENTS.BUTTONS.SECONDARY, this.onSecondary.bind(this), false);
    },
    toggleMode: function() {
        this.setMode(this.getMode() === Game.prototype.CONSTANTS.MODES.MOVE ? Game.prototype.CONSTANTS.MODES.AIM : Game.prototype.CONSTANTS.MODES.MOVE);
    },
    emitCommand: function(command) {
        this.socket.emit('COMMAND', { 'command': command, 'player': this.player.serialize() });
    },
    
    // Getters and Setters
    getMode: function() {
        return this.mode;
    },
    setMode: function(mode) {
        return this.mode = mode;
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
    
    // Constants
    CONSTANTS: {
        MODES: {
            MOVE: 'MOVE',
            AIM: 'AIM'
        }
    }
};