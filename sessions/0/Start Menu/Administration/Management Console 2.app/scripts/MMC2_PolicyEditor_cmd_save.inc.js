function MMC2_PolicyEditor_cmd_save( app, nativeApp ) {
    
    app.handlers.cmd_save = function() {
        var data = JSON.parse( JSON.stringify( app.properties.values ) );
        data.members = [];
        for ( var i=0,members=app.membersList.querySelectorAll( '.member' ), len=members.length; i<len; i++ ) {
            data.members.push( members[i].toObject() );
        }
        var request = [];
        request.addPOST('do', 'save-policy');
        request.addPOST( 'data', JSON.stringify( data ) );
        var response = $_JSON_POST( app.handler, request );
        
        /* Data has been saved */
        if ( response && response > 0 ) {
            app.close();
            if ( nativeApp ) {
                try {
                    app.app.appHandler('cmd_refresh');
                } catch (e) {}
            }
            app.purge();
        }
    }
    
}