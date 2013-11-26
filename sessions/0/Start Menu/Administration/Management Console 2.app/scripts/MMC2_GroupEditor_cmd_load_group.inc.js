function MMC2_GroupEditor_cmd_load_group( app ) {

    app.handlers.cmd_load_group = function() {
        
        if (!app.properties.values.id)
            return;
        
        var req = [];
        req.addPOST('do', 'load-group' );
        req.addPOST('id', app.properties.values.id );
        var rsp = $_JSON_POST( app.handler, req );
        
        if ( rsp ) {
        
            // Load values into app.properties
            
            app.properties.values.name = rsp.name;
            app.properties.values.description = rsp.description;
            app.properties.inputs.name.editable = false;
            
            // Remove existing members
            for ( var members = app.usersList.querySelectorAll('.member'), i = members.length-1; i>=0; i++ ) {
                members[i].parentNode.removeChild( members[i] ).purge();
            }
            
            var name;
            // Add members from current user's config
            for ( var i=0,len=rsp.members.length; i<len; i++ ) {
                
                // resolve entities names
                name = 'user-id-' + rsp.members[i].id;
                
                for ( var j=0,n=app.entities.length; j<n; j++ ) {
                    if ( app.entities[j].id == rsp.members[i] ) {
                        name = app.entities[j].name
                        break;
                    }
                }
                
                // ... and add entities
                app.usersList.appendChild( new app.createMember( { "entityId": rsp.members[i], "name": name } ) );
            }
        }
    }
    
    app.appHandler('cmd_load_group' );
    
}