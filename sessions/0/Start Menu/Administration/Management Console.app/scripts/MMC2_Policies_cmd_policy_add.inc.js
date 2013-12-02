function MMC2_Policies_cmd_policy_add( app ) {

    app.handlers.cmd_policy_add = function( ) {
        return app.handlers.cmd_policy_edit( null );
    };
    
}