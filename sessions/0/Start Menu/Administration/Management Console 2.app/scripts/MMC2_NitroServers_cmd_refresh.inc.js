function MMC2_NitroServers_cmd_refresh( app ) {

    app.grid.add = function( server ) {
        var svrId;
        var row = app.grid.tr( [
            svrId = server.id.replace(/^cmd_nitro_server\:/, '') ,
            server.name,
            server.status ? 'Online' : 'Offline',
            'Not Implemented',
            'Not Implemented'
        ] );
        
        row.primaryKey = svrId;
        
        row.addEventListener('click', row.click = function(e) {
            getOwnerWindow( app.parentNode ).onCustomEvent('focusItem', server.id );
        });
        
        row.addEventListener('dblclick', function(e) {
            alert("Configure server: " + row.primaryKey );
        });
        
        disableSelection( row );
    };

    app.addCustomEventListener('focusItem', function( serverID ) {
        for ( var i=0,len=app.grid.tbody.rows.length; i<len; i++ )
            if ( app.grid.tbody.rows[i].primaryKey == serverID ) {
                app.grid.tbody.rows[i].selected = true;
                return true;
            }
        return true;
    } );

    app.handlers.cmd_refresh = function() {
    
        var focusServerId = -1;
    
        if ( app.grid.tbody.rows.length && app.grid.selectedIndex >= 0 )
            focusServerId = app.grid.tbody.rows[ app.grid.selectedIndex ].primaryKey;
            
        var req = [];
        req.addPOST('do', 'get-servers-list');
        var rsp = $_JSON_POST( app.handler, req );
        rsp = rsp || [];
        app.grid.clear();

        var addNodes = [];
        
        for ( var i=0,len=rsp.length; i<len; i++ ) {
            app.grid.add( rsp[i] );
            
            addNodes.push({
                "id": rsp[i].id,
                "name": rsp[i].name,
                "icon": rsp[i].icon
            });
        }
        app.grid.render();
        
        getOwnerWindow( app.childOf ).onCustomEvent('setNodes', { "nodes": addNodes, "target": "cmd_nitro_server" } );
        
        // Refocus previous policy if possible
        if ( focusServerId != -1 )
            for ( var i=0,len=app.grid.tbody.rows.length; i<len; i++ ) {
                if ( app.grid.tbody.rows[i].primaryKey == focusServerId ) {
                    app.grid.tbody.rows[i].click();
                    app.grid.selectedIndex = i;
                    getOwnerWindow( app.childOf ).getMenu('cmd_nitro_server:' + focusServerId );
                    break;
                }
            }
    };
    
}