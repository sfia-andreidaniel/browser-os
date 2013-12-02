function MMC2_SessionEditor_cmd_load_session( app, btnEditSecurity ) {

    app.handlers.cmd_load_session = function() {
    
        btnEditSecurity.disabled = false;
    
        if ( app.sessionID == null )
            return;
    
        var req = [];
        req.addPOST('do', 'load-session' );
        req.addPOST( 'id', app.sessionID );
        var rsp = $_JSON_POST( app.handler, req );
    
        if ( !rsp )
            return;
        
        app.properties.values.name = rsp.name;
        app.properties.values.id   = rsp.id;
        app.properties.values.policyId = rsp.policyId;
        app.mysqlDatabases.value = rsp.databaseName;
        app.mysqlDatabases.syncIcon();
        app.startup.value = rsp.startup;
        
        if ( parseInt( rsp.id ) == 0 ) {
            app.properties.inputs.name.editable = false;
        }
        
        app.variables.clear();
        
        for ( var i=0,len=rsp.variables.length; i<len; i++ )
            app.variables.add( rsp.variables[i].name, rsp.variables[i].value );
        
        app.variables.render();
        
    }
    
    app.appHandler('cmd_load_session');
}