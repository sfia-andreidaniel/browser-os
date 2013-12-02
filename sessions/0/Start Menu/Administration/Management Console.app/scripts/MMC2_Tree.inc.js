function MMC2_Tree( app ) {
    
    var menu = [];
    
    app.getTree = function() {
    
        console.log("Get Tree");
    
        var root = [];
        
        for ( var i=0,len=MMC2_ConfigRoot.length; i<len; i++ ) {
            root.push( MMC2_ConfigRoot[i] );
        }

        /* We repopulate the node. First of all, we retrieve the method getItems of the node */
        function recursive( rootNode ) {
            //console.log( "recursive: ", rootNode );
            for ( var i=0,len=rootNode.length; i<len; i++ ) {
                if ( rootNode[i].create ) {
                    rootNode[i].items = rootNode[i].create( app );
                    recursive( rootNode[i].items );
                }
            }
        }
        
        recursive( root );
        
        return menu = root;
    }
    
    app.tree.addCustomEventListener( 'expand', function(node) {
        try {
            app.tree.focusedNode = app.tree.selectedNode = node;
        } catch (e) {}
        return true;
    } );

    app.tree.addCustomEventListener( 'collapse', function(node) {
        try {
        app.tree.focusedNode = app.tree.selectedNode = node;
        } catch (e) {}
        return true;
    } );
    
    app.addCustomEventListener('deleteItem', function( nodeID ) {

        var node = app.tree.findNode( nodeID );
        
        if ( !node )
            return false;
        
        app.tree.selectedNode = app.tree.focusedNode = node.father;
        app.tree.deleteNode( node );
        
        return true;
    } );
    
    var selfCommand = false;
    
    app.tree.addCustomEventListener('focus', function(node) {
    
        if ( selfCommand == true ) {
            selfCommand = false;
            return true;
        }
    
        var nodeID = node && node.nodeID ? node.nodeID : '';

        app.getMenu( nodeID );
        
        /* Loop through snapins activators */
        var activated = false;
        
        for ( var i=0,len=MMC2_Snapins.length; i<len; i++ ) {
            if ( MMC2_Snapins[i].name != 'generic' && MMC2_Snapins[i].activateContext.test(nodeID) ) {
                app.snapIn = MMC2_Snapins[i].name;
                activated = true;
            }
        }
        
        if (!activated)
            app.snapIn = 'generic';
        
        /* if the ID of the tree node is in format ...:[\d]+, we send a custom event listener
        // to the current snapin interface */
        
        var matches;
        
        if ( matches = /\:(.*)$/.exec( nodeID ) ) {
            if ( app.snapInInterface.onCustomEvent( 'focusItem', isNaN( matches[1] ) ? matches[1] : parseInt( matches[1] ) ) )
                activated = matches[ 1 ];
            else
                console.error("Not activated!");
        }
        
        if ( app.tree.selectedNode != node ) {
            selfCommand = true;
            try {
            app.tree.selectedNode = node;
            } catch (e) {}
        }
        
        return true;
    });
    
    app.addCustomEventListener('focusItem', function( treeNodeID ) {
        var node = app.tree.findNode( treeNodeID );
        if ( node )
            app.tree.selectedNode = node;
    });
    
    app.addCustomEventListener('setNodes', function( obj ) {
        var node = app.tree.findNode( obj.target );

        if (!node) {
            console.warn("Node: ", obj.target, " was not found in ", app.tree );
            return false;
        }
        
        if ( node.items && node.items.length ) {
            for ( var nodes = node.items, i = nodes.length - 1; i>=0; i-- ) {
                app.tree.deleteNode( nodes[i] );
            }
        }
        
        node.items = obj.nodes;
        
        app.tree.rootNode.repaintConnectors('');
        
        selfCommand = true;
        app.tree.focusedNode = app.tree.selectedNode = node;
        node.expanded = !node.expanded;
        node.expanded = !node.expanded;
        
        app.getMenu( node.nodeID );
        
        return true;
        
    } );
    
    app.appHandler( 'cmd_refresh' );
    
    app.tree.rootNode.expanded = true;
}