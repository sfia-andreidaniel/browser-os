function MMC2_Sessions_cmd_refresh( app ) {

    app.grid.add = function( session ) {
        var row = app.grid.tr( [ session.id, session.name  ] );
        row.primaryKey = session.id;
        row.addEventListener('click', row.click = function(e) {
            getOwnerWindow( app.parentNode ).onCustomEvent('focusItem', 'grp_sessions:' + row.primaryKey );
        });
        row.addEventListener('dblclick', function(e) {
            app.appHandler('cmd_session_edit', row.primaryKey );
        });
        disableSelection( row );
    };

    app.addCustomEventListener('focusItem', function( sessionID ) {
        //console.log("Focus item: ", policyID );
        for ( var i=0,len=app.grid.tbody.rows.length; i<len; i++ )
            if ( app.grid.tbody.rows[i].primaryKey == sessionID ) {
                app.grid.tbody.rows[i].selected = true;
                return true;
            }
        return true;
    } );

    app.handlers.cmd_refresh = function() {
    
        var focusSessionId = -1;
    
        if ( app.grid.tbody.rows.length && app.grid.selectedIndex >= 0 )
            focusSessionId = app.grid.tbody.rows[ app.grid.selectedIndex ].primaryKey;
            
        var req = [];
        req.addPOST('do', 'enum-sessions');
        var rsp = $_JSON_POST( app.handler, req );
        rsp = rsp || [];
        app.grid.clear();

        var addNodes = [];
        
        for ( var i=0,len=rsp.length; i<len; i++ ) {
            app.grid.add( rsp[i] );
            addNodes.push({
                "id": "grp_sessions:" + rsp[i].id,
                "name": rsp[i].name,
                "icon": "img/mmc2/s" + ( rsp[i].id == 0 ? 0 : '' ) + ".gif"
            });
        }
        app.grid.render();
        
        getOwnerWindow( app.childOf ).onCustomEvent('setNodes', { "nodes": addNodes, "target": "grp_sessions" } );
        
        // Refocus previous session if possible
        if ( focusSessionId != -1 )
            for ( var i=0,len=app.grid.tbody.rows.length; i<len; i++ ) {
                if ( app.grid.tbody.rows[i].primaryKey == focusSessionId ) {
                    app.grid.tbody.rows[i].click();
                    app.grid.selectedIndex = i;
                    getOwnerWindow( app.childOf ).getMenu('grp_sessions:' + focusSessionId );
                    break;
                }
            }
    };
    
}