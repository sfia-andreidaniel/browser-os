function MMC2_SessionEditor_cmd_cancel( app ) {

    app.closeCallback = function() {
        setTimeout( function() {
            app.purge();
            delete app;
        }, 1 );
        return true;
    }
    
    app.handlers.cmd_cancel = function() {
        app.close();
    }
}