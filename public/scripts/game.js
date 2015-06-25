function Game(player, opponent) {
    this.player = player;
    this.opponent = opponent;
    this.socket = io(document.location.origin);
};

Game.prototype = {
    player: null,
    opponent: null,
    socket: null,
    MODE_TYPE: ['MOVE', 'AIM'],
    mode: null,

    constructor: Game,
    init: function() {
        this.player.init();
        this.opponent.init();

        this.player.setFuel(100);
        this.player.setHealth(100);

        this.setMode(Game.prototype.MODE_TYPE.MOVE);
        
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
        this.setMode(this.getMode() === this.MODE_TYPE.MOVE ? this.MODE_TYPE.AIM : this.MODE_TYPE.MOVE);
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
        this.emitCommand(this.getMode() === this.MODE_TYPE.MOVE ? 'MOVE_UP' : 'TILT_UP');
    },
    onDpadRight: function() {
        this.emitCommand(this.getMode() === this.MODE_TYPE.MOVE ? 'MOVE_RIGHT' : 'PAN_RIGHT');
    },
    onDpadDown: function() {
        this.emitCommand(this.getMode() === this.MODE_TYPE.MOVE ? 'MOVE_DOWN' : 'TILT_DOWN');
    },
    onDpadLeft: function() {
        this.emitCommand(this.getMode() === this.MODE_TYPE.MOVE ? 'MOVE_LEFT' : 'PAN_LEFT');
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
    }
};