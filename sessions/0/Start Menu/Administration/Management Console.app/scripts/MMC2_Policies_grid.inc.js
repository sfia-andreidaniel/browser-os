function MMC2_Policies_grid( app ) {
    
    app.grid.delrow = function( primaryKey ) {

        var row = null;
        
        for ( var i=0,len=app.grid.tbody.rows.length; i<len; i++ )
            if ( app.grid.tbody.rows[i].primaryKey == primaryKey ) {
                row = app.grid.tbody.rows[i];
                break;
            }

        if ( !row )
            return false;

        DialogBox("Are you sure you want to delete policy:\n\n" + row.cells[2].value, {
            "childOf": getOwnerWindow( app.parentNode ),
            "type": "warning",
            "caption": "Confirm policy deletion",
            "modal": true,
            "buttons": {
                "Yes": function() {
                
                    var req = [];
                    req.addPOST('do', 'delete-policy' );
                    req.addPOST('id', row.primaryKey );
                    var rsp = $_JSON_POST( app.handler, req );

                    if ( rsp == 'ok' ) {
                        getOwnerWindow( app.parentNode ).onCustomEvent("deleteItem", "grp_policies:" + row.primaryKey );
                        app.grid.deleteRow( row.rowIndex );
                    }
                    
                },
                "No": function() {}
            }
        });

        return false;
    }
    
}