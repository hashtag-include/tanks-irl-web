(function() {
    var Controller = {
        $el: $('.controller'),
        fuel: 0,
        health: 0,
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

        init: function() {
            // TODO: Abstract these two calls to game or player module
            this.setFuel(100);
            this.setHealth(100);

            this.EVENT_DPAD_UP.initEvent('DPAD_UP', true, true);
            this.EVENT_DPAD_RIGHT.initEvent('DPAD_RIGHT', true, true);
            this.EVENT_DPAD_DOWN.initEvent('DPAD_DOWN', true, true);
            this.EVENT_DPAD_LEFT.initEvent('DPAD_LEFT', true, true);
            this.EVENT_BUTTON_SELECT.initEvent('BUTTON_SELECT', true, true);
            this.EVENT_BUTTON_START.initEvent('BUTTON_START', true, true);
            this.EVENT_BUTTON_PRIMARY.initEvent('BUTTON_PRIMARY', true, true);
            this.EVENT_BUTTON_SECONDARY.initEvent('BUTTON_SECONDARY', true, true);

            this.bindEvents();
        },
        bindEvents: function() {
            //touchstart / MSPointerDown
            this.$el.find('.dpad .up').on('touchstart mousedown MSPointerDown', this.onDpadUp.bind(this));
            this.$el.find('.dpad .right').on('touchstart mousedown MSPointerDown', this.onDpadRight.bind(this));
            this.$el.find('.dpad .down').on('touchstart mousedown MSPointerDown', this.onDpadDown.bind(this));
            this.$el.find('.dpad .left').on('touchstart mousedown MSPointerDown', this.onDpadLeft.bind(this));
            this.$el.find('.select').on('click', this.onButtonSelect.bind(this));
            this.$el.find('.start').on('click', this.onButtonStart.bind(this));
            this.$el.find('.primary').on('click', this.onButtonPrimary.bind(this));
            this.$el.find('.secondary').on('click', this.onButtonSecondary.bind(this));
            
            $(document).on('touchstop mouseup MSPointerUp', this.onMouseUp.bind(this));
        },
        
        // Getters and Setters
        getFuel: function() {
            return this.fuel;
        },
        setFuel: function(fuel) {
            if(fuel < 0 || fuel > 100) throw "Error: Fuel out of bounds (must be 0-100)";
            
            this.$el.find('.fuel .bar').width(fuel + '%');
            return this.fuel = fuel;
        },
        getHealth: function() {
            return this.health;
        },
        setHealth: function(health) {
            if(health < 0 || health > 100) throw "Error: Health out of bounds (must be 0-100)";

            this.$el.find('.health .bar').width(health + '%');
            return this.health = health;
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
        }
    };

    Controller.init();
})();