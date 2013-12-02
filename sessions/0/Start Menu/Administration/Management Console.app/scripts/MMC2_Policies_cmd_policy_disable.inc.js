function MMC2_Policies_cmd_policy_disable( app ) {
    
    app.handlers.cmd_policy_disable = function() {
        if ( app.grid.selectedIndex == -1 )
            return;
        var req = [];
        req.addPOST('do', 'set-enabled');
        req.addPOST('id', app.grid.tbody.rows[ app.grid.selectedIndex ].primaryKey );
        req.addPOST('enabled', 0 );
        $_JSON_POST( app.handler, req );
        app.appHandler('cmd_refresh');
    };
    
}