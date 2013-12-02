function MMC2_Sessions_cmd_session_del( app ) {
    
    app.handlers.cmd_session_del = function() {
        
        if ( app.grid.selectedIndex == -1 )
            return;
        
        var row = app.grid.tbody.rows[ app.grid.selectedIndex ];

        app.grid.delrow( row.primaryKey );
        
    };
    
}