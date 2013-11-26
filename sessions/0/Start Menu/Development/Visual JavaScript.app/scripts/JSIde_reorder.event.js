function JSIde_reorder( app ) {
    app.addCustomEventListener( 'reorder', function( data ) {
        //console.log( "EVENT[type=reporder]: ", data );
        
        // get the target element
        var targetIndex = app.findElementIndex( data.target );
        if ( targetIndex == -1 )
            return false;
        
        var item = app.application[ targetIndex ];
        
        var siblings = [];
        
        for ( var i=0,n=app.application.length; i<n; i++ )
            if ( app.application[i].parent == item.parent && app.application[i].id != item.id ) {
                siblings.push( app.application[i] );
            }
        
        item.index = data.index;
        
        /* Sort the other siblings based by their index */
        
        siblings.sort( function( a,b ) {
            return a.index - b.index;
        } );
        
        /* Renumber indexes ... */
        for ( var i=0,n=siblings.length; i<n; i++ ) {
            siblings[i].index = i >= app.application[ targetIndex ].index ? i + 1 : i;
        }
        
        if ( siblings.length ) {
            if ( item.index > siblings[ siblings.length - 1 ].index )
                item.index = siblings[ siblings.length - 1 ].index + 1;
        }
        
        var parentIndex = app.findElementIndex( item.parent );
        var refreshNodeID = parentIndex == -1 ? null : app.application[ parentIndex ].id;
        
        app.tree.refresh( !refreshNodeID ? app.tree.rootNode : app.tree.findNode( refreshNodeID ) );
        
        setTimeout( function() {
            app.tree.selectedNode = app.tree.findNode( app.application[ targetIndex ].id );
        }, 100 );
        
        return true;
    });
}