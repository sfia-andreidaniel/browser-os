function MMC2_Users_cmd_refresh( app ) {

    app.grid.add = function( user ) {
        var row = app.grid.tr( [ user.id, user.name, user.enabled ? 'Yes' : 'No', user.memberOf ] );
        row.primaryKey = user.id;
        
        row.addEventListener('click', row.click = function(e) {
            getOwnerWindow( app.parentNode ).onCustomEvent('focusItem', 'cmd_users:' + row.primaryKey );
        });
        
        row.addEventListener('dblclick', function(e) {
            app.appHandler('cmd_user_edit', row.primaryKey );
        });
        
        disableSelection( row );
    };

    app.addCustomEventListener('focusItem', function( userID ) {
        //console.log("Focus item: ", policyID );
        for ( var i=0,len=app.grid.tbody.rows.length; i<len; i++ )
            if ( app.grid.tbody.rows[i].primaryKey == userID ) {
                app.grid.tbody.rows[i].selected = true;
                return true;
            }
        return true;
    } );

    app.handlers.cmd_refresh = function() {
    
        var focusUserId = -1;
    
        if ( app.grid.tbody.rows.length && app.grid.selectedIndex >= 0 )
            focusUserId = app.grid.tbody.rows[ app.grid.selectedIndex ].primaryKey;
            
        var req = [];
        req.addPOST('do', 'enum-users');
        var rsp = $_JSON_POST( app.handler, req );
        rsp = rsp || [];
        app.grid.clear();

        var addNodes = [];
        
        for ( var i=0,len=rsp.length; i<len; i++ ) {
            app.grid.add( rsp[i] );
            addNodes.push({
                "id": "cmd_users:" + rsp[i].id,
                "name": rsp[i].name,
                "icon": "img/mmc2/u" + ( rsp[i].enabled ? 1 : 0 ) + ".png"
            });
        }
        app.grid.render();
        
        getOwnerWindow( app.childOf ).onCustomEvent('setNodes', { "nodes": addNodes, "target": "cmd_users" } );
        
        // Refocus previous policy if possible
        if ( focusUserId != -1 )
            for ( var i=0,len=app.grid.tbody.rows.length; i<len; i++ ) {
                if ( app.grid.tbody.rows[i].primaryKey == focusUserId ) {
                    app.grid.tbody.rows[i].click();
                    app.grid.selectedIndex = i;
                    getOwnerWindow( app.childOf ).getMenu('cmd_users:' + focusUserId );
                    break;
                }
            }
    };
    
}