function MMC2_SessionEditor_cmd_save( app ) {
    
    app.handlers.cmd_save = function( dontCloseAfterSave ) {
        
        if (!app.properties.values.name.trim()) {
            DialogBox("Please provide a session name!", {
                "type": "error",
                "childOf": getOwnerWindow( app.parentNode )
            });
            return;
        }
        
        var data = {
            "name": app.properties.values.name,
            "id": app.properties.values.id,
            "variables": ( function() {
                var out = [];
                for ( var i=0,len=app.variables.tbody.rows.length; i<len; i++ )
                    out.push( {
                        "name": app.variables.tbody.rows[i].cells[0].value,
                        "value": app.variables.tbody.rows[i].cells[1].value
                    } );
                return out;
            } )(),
            "databaseName": app.mysqlDatabases.value,
            "startup": app.startup.value
        };

        var request = [];
        request.addPOST('do', 'save-session');
        request.addPOST( 'data', JSON.stringify( data ) );
        var response = $_JSON_POST( app.handler, request );
        
        /* Data has been saved */
        if ( typeof response == 'number' ) {

            try {
                app.app.appHandler('cmd_refresh');
            } catch (e) {}
            
            if ( !!!dontCloseAfterSave ) {
                app.close();
                app.purge();
            } else {
                app.sessionID = app.properties.values.id = response;
                app.appHandler('cmd_load_session');
            }
        }
    }
    
}