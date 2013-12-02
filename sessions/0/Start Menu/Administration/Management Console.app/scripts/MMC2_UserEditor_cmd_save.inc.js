function MMC2_UserEditor_cmd_save( app ) {
    
    app.handlers.cmd_save = function() {
        var data = JSON.parse( JSON.stringify( app.properties.values ) );
        
        if (!data.name.trim()) {
            DialogBox("The 'User Name' field is mandatory!", {
                "type": "error",
                "childOf": getOwnerWindow( app.parentNode )
            } );
            return;
        }
        
        if ( data.password ) {
            if ( data.confirm != data.password ) {
                DialogBox("Password and Confirm Password don't match!", {
                    "type": "error",
                    "childOf": getOwnerWindow( app.parentNode )
                });
                return;
            }
            delete data.confirm;
        } else {
            delete data.confirm;
            delete data.password;
        }
        
        data.members = [];
        
        for ( var i=0,members=app.groupsList.querySelectorAll( '.member' ), len=members.length; i<len; i++ ) {
            data.members.push( members[i].toObject() );
        }
        var request = [];
        request.addPOST('do', 'save-user');
        request.addPOST( 'data', JSON.stringify( data ) );
        var response = $_JSON_POST( app.handler, request );
        
        /* Data has been saved */
        if ( response && response > 0 ) {
            app.close();
            try {
                app.app.appHandler('cmd_refresh');
            } catch (e) {}
            app.purge();
        }
    }
    
}