function JSIde_cmd_run( app ) {

    app.handlers.cmd_run = function() {
        try {
            eval( app.code + '()' );
        } catch (e) {}
    }
    
}