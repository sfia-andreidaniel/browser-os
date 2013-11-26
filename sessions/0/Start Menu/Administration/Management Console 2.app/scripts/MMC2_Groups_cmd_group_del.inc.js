function MMC2_Groups_cmd_group_del( app ) {
    
    app.handlers.cmd_group_del = function() {
        
        if ( app.grid.selectedIndex == -1 )
            return;
        
        var row = app.grid.tbody.rows[ app.grid.selectedIndex ];

        app.grid.delrow( row.primaryKey );
        
    };
    
}