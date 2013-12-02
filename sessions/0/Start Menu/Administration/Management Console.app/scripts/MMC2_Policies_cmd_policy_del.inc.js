function MMC2_Policies_cmd_policy_del( app ) {
    
    app.handlers.cmd_policy_del = function() {
        
        if ( app.grid.selectedIndex == -1 )
            return;
        
        var row = app.grid.tbody.rows[ app.grid.selectedIndex ];

        app.grid.delrow( row.primaryKey );
        
    };
    
}