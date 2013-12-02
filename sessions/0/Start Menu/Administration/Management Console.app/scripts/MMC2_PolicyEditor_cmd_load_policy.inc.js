function MMC2_PolicyEditor_cmd_load_policy( app ) {

    app.handlers.cmd_load_policy = function() {
        
        if (!app.properties.values.id)
            return;
        
        var req = [];
        req.addPOST('do', 'load-policy' );
        req.addPOST('id', app.properties.values.id );
        var rsp = $_JSON_POST( app.handler, req );
        
        if ( rsp ) {
            app.properties.values.name = rsp.name || '';
            app.properties.values.code = rsp.code || '';
            app.properties.values.description = rsp.description || '';
            app.properties.values.enabled = rsp.enabled || false;
            app.properties.values.defaultAction = rsp['default'] || 0;
            
            for ( var members = app.membersList.querySelectorAll('.member'), i = members.length-1; i>=0; i++ ) {
                members[i].parentNode.removeChild( members[i] ).purge();
            }
            
            for ( var i=0,len=rsp.members.length; i<len; i++ ) {
                
                // resolve entities names
                rsp.members[i].name = 'entity-id-' + rsp.members[i].entityId;
                
                for ( var j=0,n=app.entities[ rsp.members[i].entityType ].length; j<n; j++ ) {
                    if ( app.entities[ rsp.members[i].entityType ][j].id == rsp.members[i].entityId ) {
                        rsp.members[i].name = app.entities[ rsp.members[i].entityType ][j].name
                        break;
                    }
                }
                // ... and add entities
                try {
                    app.membersList.appendChild( new app.createMember( rsp.members[i] ) );
                } catch (e) {}
            }
        }
    }
    
    app.appHandler('cmd_load_policy' );
    
}