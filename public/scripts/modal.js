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
    show: function(title, message, confirmText, confirmCallback, cancelText, cancelCallback) {
        this.$el.find('#remodal-title').text(title);
        this.$el.find('#message').text(message);
        $(document).off('confirmation', '.remodal');
        $(document).off('cancellation', '.remodal');
        
        if(confirmText) {
            this.$el.find('.remodal-confirm').show();
            this.$el.find('.remodal-confirm').text(confirmText);
            if(confirmCallback) $(document).on('confirmation', '.remodal', confirmCallback);
        } else {
            this.$el.find('.remodal-confirm').hide();
        }
        
        if(cancelText) { 
            this.$el.find('.remodal-cancel').show();
            this.$el.find('.remodal-cancel').text(cancelText);
            if(cancelCallback) $(document).on('cancellation', '.remodal', cancelCallback);
        } else {
            this.$el.find('.remodal-cancel').hide();
        }

        this.remodal.open();
    }
};