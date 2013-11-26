function JSIde_resizer( app ) {
    
    var focusedID = null;
    
    Object.defineProperty( app, "focusedID", {
        "get": function( ) {
            return focusedID;
        },
        "set": function( str ) {
            focusedID = str;
        }
    } );
    
    app.tabs.getSheets(0).addEventListener('mousedown', function(e) {
        
        var sheet = app.tabs.getSheets(0);
        
        var src = e.srcElement || e.target;
        
        var focusID = null;
        
        while ( !!!( focusID = src.getAttribute('jside-id') ) && src != sheet ) {
            src = src.parentNode;
        }
        
        if ( !focusID )
            return;
        
        app.currentItemProperties.save();
        
        addStyle( src, 'jside-focus' );
        focusedID = focusID;
        
        app.tree.selectedNode = app.tree.findNode( focusID );
        
        for ( var i=0,items=app.querySelectorAll( '.jside-focus' ), len=items.length; i<len; i++ ) {
            if ( items[i] != src )
                removeStyle( items[i], 'jside-focus' );
        }
        
    }, true);

    app.tabs.getSheets(0).addEventListener('dblclick', function(e) {
        
        var sheet = app.tabs.getSheets(0);
        
        var src = e.srcElement || e.target;
        
        var focusID = null;
        
        while ( !!!( focusID = src.getAttribute('jside-id') ) && src != sheet ) {
            src = src.parentNode;
        }
        
        if ( !focusID )
            return;
        
        if ( typeof app.currentItemProperties.values.code != 'undefined' ){
            app.currentItemProperties.inputs.code.parentNode.browse();
        }

        if ( typeof app.currentItemProperties.values.action != 'undefined' ){
            app.currentItemProperties.inputs.action.parentNode.browse();
        }
        
    }, true);

    
}