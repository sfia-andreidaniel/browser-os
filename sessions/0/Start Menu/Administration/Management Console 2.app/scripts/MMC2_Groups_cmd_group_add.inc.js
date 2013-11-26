function MMC2_Groups_cmd_group_add( app ) {

    app.handlers.cmd_group_add = function( ) {
        return app.handlers.cmd_group_edit( null );
    };
    
}