function MMC2_Users_cmd_user_add( app ) {

    app.handlers.cmd_user_add = function( ) {
        return app.handlers.cmd_user_edit( null );
    };
    
}