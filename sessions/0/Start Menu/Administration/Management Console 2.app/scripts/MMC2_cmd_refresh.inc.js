function MMC2_cmd_refresh( app ) {
    
    app.handlers.cmd_refresh = function( focusNode ) {
        
        focusNode = focusNode || app.tree.selectedNode;
        if ( focusNode )
            focusNode = focusNode.nodeID;
        else
            focusNode = null;
        
        if ( app.tree.rootNode.items && app.tree.rootNode.items.length ) {
            for ( var i=app.tree.rootNode.items.length - 1; i>=0; i-- )
                app.tree.deleteNode( app.tree.rootNode.items[i] );
        }
        
        app.tree.rootNode.items = app.getTree();
        app.tree.rootNode.repaintConnectors('');
        
        app.tree.rootNode.expanded = !app.tree.rootNode.expanded;
        app.tree.rootNode.expanded = !app.tree.rootNode.expanded;
        
        if ( focusNode ) {
            var node = app.tree.findNode( focusNode );
            if ( node )
                app.tree.selectedNode = node;
        }
    }
    
}