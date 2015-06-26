function Player(id, controller) {
    this.controller = controller;
    this.setId(id);
    this.setFuel(100);
    this.setHealth(100);
};

Player.prototype = {
    id: null,
    fuel: null,
    health: null,
    controller: null,

    constructor: Player,
    serialize: function() {
        var serialized = {};
        serialized.id = this.getId();
        serialized.fuel = this.getFuel();
        serialized.health = this.getHealth();
        
        return serialized;
    },
    
    // Getters and Setters
    getId: function() {
        return this.id;
    },
    setId: function(id) {
        return this.id = id;
    },
    getFuel: function() {
        return this.fuel;
    },
    setFuel: function(fuel) {
        if(fuel < 0 || fuel > 100) throw "Error: Fuel out of bounds (must be 0-100)";
        
        if(this.controller) this.controller.setFuelBarWidth(fuel);
        return this.fuel = fuel;
    },
    getHealth: function() {
        return this.health;
    },
    setHealth: function(health) {
        if(health < 0 || health > 100) throw "Error: Health out of bounds (must be 0-100)";

        if(this.controller) this.controller.setHealthBarWidth(health);
        return this.health = health;
    },
};