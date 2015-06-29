function Modal() {
    this.$el = $('[data-remodal-id=modal]');
        
    var options = {
        hashTracking: false
    };
    
    this.remodal = this.$el.remodal(options);
};

Modal.prototype = {
    $el: null,
    remodal: null,

    constructor: Modal,
    // message: message to display in the modal, callback: function to call when the modal is closed
    show: function(message, buttonText, callback) {
        this.$el.find('#message').text(message);
        
        if(buttonText) this.$el.find('.remodal-confirm').text(buttonText);
        
        $(document).off('closing', '.remodal');
        if(callback) $(document).on('closing', '.remodal', callback);
        
        this.remodal.open();
    }
};