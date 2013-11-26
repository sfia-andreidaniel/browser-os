function MMC2_Sessions_cmd_session_add( app ) {

    app.handlers.cmd_session_add = function( ) {
        return app.appHandler('cmd_session_edit', null );
    };
    
}