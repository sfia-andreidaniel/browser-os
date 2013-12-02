function MMC2_GroupEditor_cmd_save( app ) {
    
    app.handlers.cmd_save = function() {
        var data = JSON.parse( JSON.stringify( app.properties.values ) );
        
        if (!data.name.trim()) {
            DialogBox("The 'Group Name' field is mandatory!", {
                "type": "error",
                "childOf": getOwnerWindow( app.parentNode )
            } );
            return;
        }
        
        data.members = [];
        
        for ( var i=0,members=app.usersList.querySelectorAll( '.member' ), len=members.length; i<len; i++ ) {
            data.members.push( members[i].toObject() );
        }
        var request = [];
        request.addPOST('do', 'save-group');
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