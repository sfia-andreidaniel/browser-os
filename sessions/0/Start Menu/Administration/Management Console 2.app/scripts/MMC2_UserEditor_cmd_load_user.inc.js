function MMC2_UserEditor_cmd_load_user( app ) {

    app.handlers.cmd_load_user = function() {
        
        if (!app.properties.values.id)
            return;
        
        var req = [];
        req.addPOST('do', 'load-user' );
        req.addPOST('id', app.properties.values.id );
        var rsp = $_JSON_POST( app.handler, req );
        
        if ( rsp ) {
        
            // Load values into app.properties
            
            app.properties.values.name = rsp.name;
            app.properties.values.enabled = !!rsp.enabled;
            app.properties.values.email = rsp.email;
            app.properties.values.phone = rsp.phone;
            app.properties.values.description = rsp.description;
            app.properties.values.expireDate = rsp.expireDate;

            app.properties.inputs.name.editable = false;
            
            // Remove existing members
            for ( var members = app.groupsList.querySelectorAll('.member'), i = members.length-1; i>=0; i++ ) {
                members[i].parentNode.removeChild( members[i] ).purge();
            }
            
            var name;
            // Add members from current user's config
            for ( var i=0,len=rsp.members.length; i<len; i++ ) {
                
                // resolve entities names
                name = 'group-id-' + rsp.members[i].id;
                
                for ( var j=0,n=app.entities.length; j<n; j++ ) {
                    if ( app.entities[j].id == rsp.members[i] ) {
                        name = app.entities[j].name
                        break;
                    }
                }
                
                // ... and add entities
                try {
                    app.groupsList.appendChild( new app.createMember( { "entityId": rsp.members[i], "name": name } ) );
                } catch (e) {}
            }
        }
    }
    
    app.appHandler('cmd_load_user' );
    
}