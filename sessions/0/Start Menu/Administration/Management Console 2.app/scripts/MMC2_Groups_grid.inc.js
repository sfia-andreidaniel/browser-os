function MMC2_Groups_grid( app ) {
    
    app.grid.delrow = function( primaryKey ) {

        var row = null;
        
        for ( var i=0,len=app.grid.tbody.rows.length; i<len; i++ )
            if ( app.grid.tbody.rows[i].primaryKey == primaryKey ) {
                row = app.grid.tbody.rows[i];
                break;
            }

        if ( !row )
            return false;

        DialogBox("Are you sure you want to delete group:\n\n" + row.cells[1].value, {
            "childOf": getOwnerWindow( app.parentNode ),
            "type": "warning",
            "caption": "Confirm group deletion",
            "modal": true,
            "buttons": {
                "Yes": function() {
                
                    var req = [];
                    req.addPOST('do', 'delete-group' );
                    req.addPOST('id', row.primaryKey );
                    var rsp = $_JSON_POST( app.handler, req );

                    if ( rsp == 'ok' ) {
                        getOwnerWindow( app.parentNode ).onCustomEvent("deleteItem", "cmd_groups:" + row.primaryKey );
                        app.grid.deleteRow( row.rowIndex );
                    }
                    
                },
                "No": function() {}
            }
        });

        return false;
    }
    
}