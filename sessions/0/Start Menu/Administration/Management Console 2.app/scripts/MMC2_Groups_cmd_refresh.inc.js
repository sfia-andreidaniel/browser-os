function MMC2_Groups_cmd_refresh( app ) {

    app.grid.add = function( group ) {
        var row = app.grid.tr( [ group.id, group.name, group.members ] );
        row.primaryKey = group.id;
        
        row.addEventListener('click', row.click = function(e) {
            getOwnerWindow( app.parentNode ).onCustomEvent('focusItem', 'cmd_groups:' + row.primaryKey );
        });
        
        row.addEventListener('dblclick', function(e) {
            app.appHandler('cmd_group_edit', row.primaryKey );
        });
        
        disableSelection( row );
    };

    app.addCustomEventListener('focusItem', function( groupID ) {
        for ( var i=0,len=app.grid.tbody.rows.length; i<len; i++ )
            if ( app.grid.tbody.rows[i].primaryKey == groupID ) {
                app.grid.tbody.rows[i].selected = true;
                return true;
            }
        return true;
    } );

    app.handlers.cmd_refresh = function() {
    
        var focusGroupId = -1;
    
        if ( app.grid.tbody.rows.length && app.grid.selectedIndex >= 0 )
            focusGroupId = app.grid.tbody.rows[ app.grid.selectedIndex ].primaryKey;
            
        var req = [];
        req.addPOST('do', 'enum-groups');
        var rsp = $_JSON_POST( app.handler, req );
        rsp = rsp || [];
        app.grid.clear();

        var addNodes = [];
        
        for ( var i=0,len=rsp.length; i<len; i++ ) {
            app.grid.add( rsp[i] );
            addNodes.push({
                "id": "cmd_groups:" + rsp[i].id,
                "name": rsp[i].name,
                "icon": "img/mmc2/g.gif"
            });
        }
        app.grid.render();
        
        getOwnerWindow( app.childOf ).onCustomEvent('setNodes', { "nodes": addNodes, "target": "cmd_groups" } );
        
        // Refocus previous policy if possible
        if ( focusGroupId != -1 )
            for ( var i=0,len=app.grid.tbody.rows.length; i<len; i++ ) {
                if ( app.grid.tbody.rows[i].primaryKey == focusGroupId ) {
                    app.grid.tbody.rows[i].click();
                    app.grid.selectedIndex = i;
                    getOwnerWindow( app.childOf ).getMenu('cmd_groups:' + focusGroupId );
                    break;
                }
            }
    };
    
}