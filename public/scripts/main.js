var Controller = function(el, socket) {
    this.$el = $(el);
    this.$dpad = this.$el.find('.dpad');
    this.$start = this.$el.find('.button.start');
    this.socket = socket;
    this.timeout;
    var self = this;

    this.$dpad.mousedown(function(e) {
        var parentOffset = self.$dpad.offset();
        var dX = e.pageX - parentOffset.left - (self.$dpad.width() / 2);
        var dY = e.pageY - parentOffset.top - (self.$dpad.height() / 2);

        var direction = Math.abs(dX) > Math.abs(dY) ? 
                            (dX < 0 ? 'LEFT' : 'RIGHT')
                            : (dY < 0 ? 'UP' : 'DOWN');

        self.timeout = setInterval(function() {
            console.log( { 'MOVE' : direction } );
            self.socket.emit('MOVE', direction);
        }, 200);

        return false;
    });
    this.$start.click(function() {
        console.log( { 'EXIT' : true } );
        self.socket.emit('EXIT', true);
    });
    $(document).mouseup(function() {
        if(typeof(self.timeout) !== 'undefined') clearInterval(self.timeout);
        return false;
    });
}

$(document).ready(function() {
    var socket = io(document.location.origin);
    socket.on('connect', function() {
        console.log('[Connection Established]');
    });

    new Controller('.controller', socket);
});