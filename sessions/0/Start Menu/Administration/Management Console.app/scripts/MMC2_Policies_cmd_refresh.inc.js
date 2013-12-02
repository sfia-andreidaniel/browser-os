function MMC2_Policies_cmd_refresh( app ) {

    app.grid.add = function( policy ) {
        var row = app.grid.tr( [ policy.id, policy.name, policy.code, policy.enabled ? 'Yes' : 'No', policy.description ] );
        row.primaryKey = policy.id;
        row.addEventListener('click', row.click = function(e) {
            getOwnerWindow( app.parentNode ).onCustomEvent('focusItem', 'grp_policies:' + row.primaryKey );
        });
        row.addEventListener('dblclick', function(e) {
            app.appHandler('cmd_policy_edit', row.primaryKey );
        });
        disableSelection( row );
    };

    app.addCustomEventListener('focusItem', function( policyID ) {
        //console.log("Focus item: ", policyID );
        for ( var i=0,len=app.grid.tbody.rows.length; i<len; i++ )
            if ( app.grid.tbody.rows[i].primaryKey == policyID ) {
                app.grid.tbody.rows[i].selected = true;
                return true;
            }
        return true;
    } );

    app.handlers.cmd_refresh = function() {
    
        var focusPolicyId = -1;
    
        if ( app.grid.tbody.rows.length && app.grid.selectedIndex >= 0 )
            focusPolicyId = app.grid.tbody.rows[ app.grid.selectedIndex ].primaryKey;
            
        var req = [];
        req.addPOST('do', 'enum-policies');
        var rsp = $_JSON_POST( app.handler, req );
        rsp = rsp || [];
        app.grid.clear();

        var addNodes = [];
        
        for ( var i=0,len=rsp.length; i<len; i++ ) {
            app.grid.add( rsp[i] );
            addNodes.push({
                "id": "grp_policies:" + rsp[i].id,
                "name": rsp[i].name,
                "icon": "img/mmc2/p" + rsp[i].enabled + ".png"
            });
        }
        app.grid.render();
        
        getOwnerWindow( app.childOf ).onCustomEvent('setNodes', { "nodes": addNodes, "target": "grp_policies" } );
        
        // Refocus previous policy if possible
        if ( focusPolicyId != -1 )
            for ( var i=0,len=app.grid.tbody.rows.length; i<len; i++ ) {
                if ( app.grid.tbody.rows[i].primaryKey == focusPolicyId ) {
                    app.grid.tbody.rows[i].click();
                    app.grid.selectedIndex = i;
                    getOwnerWindow( app.childOf ).getMenu('grp_policies:' + focusPolicyId );
                    break;
                }
            }
    };
    
}