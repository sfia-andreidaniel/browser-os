function MMC2_Users_cmd_user_enable( app ) {
    
    app.handlers.cmd_user_enable = function() {
        if ( app.grid.selectedIndex == -1 )
            return;
        var req = [];
        req.addPOST('do', 'set-enabled');
        req.addPOST('id', app.grid.tbody.rows[ app.grid.selectedIndex ].primaryKey );
        req.addPOST('enabled', 1 );
        $_JSON_POST( app.handler, req );
        app.appHandler('cmd_refresh');
    };
    
}