function MMC2_Users_cmd_user_del( app ) {
    
    app.handlers.cmd_user_del = function() {
        
        if ( app.grid.selectedIndex == -1 )
            return;
        
        var row = app.grid.tbody.rows[ app.grid.selectedIndex ];

        app.grid.delrow( row.primaryKey );
        
    };
    
}