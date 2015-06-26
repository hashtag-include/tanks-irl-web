function Controller() {
    this.$el = $('.controller');

    this.EVENT_DPAD_UP.initEvent(Controller.prototype.CONSTANTS.EVENTS.DPAD.UP, true, true);
    this.EVENT_DPAD_RIGHT.initEvent(Controller.prototype.CONSTANTS.EVENTS.DPAD.RIGHT, true, true);
    this.EVENT_DPAD_DOWN.initEvent(Controller.prototype.CONSTANTS.EVENTS.DPAD.DOWN, true, true);
    this.EVENT_DPAD_LEFT.initEvent(Controller.prototype.CONSTANTS.EVENTS.DPAD.LEFT, true, true);
    this.EVENT_BUTTON_SELECT.initEvent(Controller.prototype.CONSTANTS.EVENTS.BUTTONS.SELECT, true, true);
    this.EVENT_BUTTON_START.initEvent(Controller.prototype.CONSTANTS.EVENTS.BUTTONS.START, true, true);
    this.EVENT_BUTTON_PRIMARY.initEvent(Controller.prototype.CONSTANTS.EVENTS.BUTTONS.PRIMARY, true, true);
    this.EVENT_BUTTON_SECONDARY.initEvent(Controller.prototype.CONSTANTS.EVENTS.BUTTONS.SECONDARY, true, true);
    
    this.show();
    
    this.bindEvents();
};

Controller.prototype = {
    $el: null,
    mousedownTimeout: null,
    mousedownInterval: 200,
    EVENT_DPAD_UP: document.createEvent('Event'),
    EVENT_DPAD_RIGHT: document.createEvent('Event'),
    EVENT_DPAD_DOWN: document.createEvent('Event'),
    EVENT_DPAD_LEFT: document.createEvent('Event'),
    EVENT_BUTTON_SELECT: document.createEvent('Event'),
    EVENT_BUTTON_START: document.createEvent('Event'),
    EVENT_BUTTON_PRIMARY: document.createEvent('Event'),
    EVENT_BUTTON_SECONDARY: document.createEvent('Event'),

    constructor: Controller,
    bindEvents: function() {
        this.$el.find('.section-left .dpad').on('touchstart mousedown MSPointerDown', '.up', this.onDpadUp.bind(this));
        this.$el.find('.section-left .dpad').on('touchstart mousedown MSPointerDown', '.right', this.onDpadRight.bind(this));
        this.$el.find('.section-left .dpad').on('touchstart mousedown MSPointerDown', '.down', this.onDpadDown.bind(this));
        this.$el.find('.section-left .dpad').on('touchstart mousedown MSPointerDown', '.left', this.onDpadLeft.bind(this));
        this.$el.find('.section-middle').on('click', '.select', this.onButtonSelect.bind(this));
        this.$el.find('.section-middle').on('click', '.start', this.onButtonStart.bind(this));
        this.$el.find('.section-right').on('click', '.primary', this.onButtonPrimary.bind(this));
        this.$el.find('.section-right').on('click', '.secondary', this.onButtonSecondary.bind(this));
        
        $(document).on('touchstop mouseup MSPointerUp', this.onMouseUp.bind(this));
    },
    show: function() {
        this.$el.show();
    },
    hide: function() {
        this.$el.hide();
    },
    
    // Getters and Setters
    setFuelBarWidth: function(percent) {
        if(percent < 0 || percent > 100) throw "Error: Fuel percentage out of bounds (must be 0-100)";
        
        this.$el.find('.fuel .bar').width(percent + '%');
    },
    setHealthBarWidth: function(percent) {
        if(percent < 0 || percent > 100) throw "Error: Health percentage out of bounds (must be 0-100)";

        this.$el.find('.health .bar').width(percent + '%');
    },
    
    // Events
    onDpadUp: function() {
        if(typeof(this.mousedownTimeout) !== 'undefined') clearInterval(this.mousedownTimeout);
        
        document.dispatchEvent(this.EVENT_DPAD_UP);
        this.mousedownTimeout = setInterval(function() {
            document.dispatchEvent(this.EVENT_DPAD_UP);
        }.bind(this), this.mousedownInterval);
    },
    onDpadRight: function() {
        if(typeof(this.mousedownTimeout) !== 'undefined') clearInterval(this.mousedownTimeout);
        
        document.dispatchEvent(this.EVENT_DPAD_RIGHT);
        this.mousedownTimeout = setInterval(function() {
            document.dispatchEvent(this.EVENT_DPAD_RIGHT);
        }.bind(this), this.mousedownInterval);
    },
    onDpadDown: function() {
        if(typeof(this.mousedownTimeout) !== 'undefined') clearInterval(this.mousedownTimeout);
        
        document.dispatchEvent(this.EVENT_DPAD_DOWN);
        this.mousedownTimeout = setInterval(function() {
            document.dispatchEvent(this.EVENT_DPAD_DOWN);
        }.bind(this), this.mousedownInterval);
    },
    onDpadLeft: function() {
        if(typeof(this.mousedownTimeout) !== 'undefined') clearInterval(this.mousedownTimeout);
        
        document.dispatchEvent(this.EVENT_DPAD_LEFT);
        this.mousedownTimeout = setInterval(function() {
            document.dispatchEvent(this.EVENT_DPAD_LEFT);
        }.bind(this), this.mousedownInterval);
    },
    onButtonSelect: function() {
        document.dispatchEvent(this.EVENT_BUTTON_SELECT);
    },
    onButtonStart: function() {
        document.dispatchEvent(this.EVENT_BUTTON_START);
    },
    onButtonPrimary: function() {
        document.dispatchEvent(this.EVENT_BUTTON_PRIMARY);
    },
    onButtonSecondary: function() {
        document.dispatchEvent(this.EVENT_BUTTON_SECONDARY);
    },
    onMouseUp: function() {
        if(typeof(this.mousedownTimeout) !== 'undefined') clearInterval(this.mousedownTimeout);
    },
    
    // Constants
    CONSTANTS: {
        EVENTS: {
            DPAD: {
                UP: 'DPAD_UP',
                RIGHT: 'DPAD_RIGHT',
                DOWN: 'DPAD_DOWN',
                LEFT: 'DPAD_LEFT'
            },
            BUTTONS: {
                SELECT: 'BUTTON_SELECT',
                START: 'BUTTON_START',
                PRIMARY: 'BUTTON_PRIMARY',
                SECONDARY: 'BUTTON_SECONDARY'
            }
        }
    }
};