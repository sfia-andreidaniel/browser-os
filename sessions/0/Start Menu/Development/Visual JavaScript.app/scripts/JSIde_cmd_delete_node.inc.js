function JSIde_cmd_delete_node( app ) {
    app.handlers.cmd_delete_node = function( nodeID ) {
        // alert("Delete node: " + nodeID );
        var nodeIndex = app.findElementIndex( nodeID );
        
        if ( nodeIndex == -1 )
            return;
        
        var nodeType  = /^[\d]+\-(.*)$/.exec( nodeID );
        var nodeTypeName = JSIde_TypeOf( nodeType[1] );
        var nodeName  = app.application[ nodeIndex ].name;
        
        var nodes = [ nodeID ];
        
        var recursive = function( parentNodeID ) {
            for ( var i=0,len=app.application.length; i<len; i++ ) {
                if ( app.application[i].parent == parentNodeID ) {
                    recursive( app.application[i].id );
                    nodes.push( app.application[i].id );
                }
            }
        };
        
        recursive( nodeID );
        
        var focusAfterDelete = app.application[ nodeIndex ].parent;
        
        DialogBox("Are you sure you want to delete the ( <" + nodeTypeName + "> " + nodeName + " )" +
                  
                  (
                  nodes.length > 1 
                    ? "\ntogether with all it's " + ( nodes.length - 1 ) + " child nodes ?"
                    : " ?"
                  ) +
                  
                  "\n\nYou won't be able to undo that!",
                 {
                    "caption": "Confirm node deletion",
                    "buttons": {
                        "Delete": function() {
                            app.tree.focusedNode = app.tree.findNode( focusAfterDelete );
                            
                            if ( app.tree.focusedNode.items && app.tree.focusedNode.items.length ){
                                while ( app.tree.focusedNode.items.length )
                                    app.tree.deleteNode( app.tree.focusedNode.items[0], true );
                            }
                            
                            app.tree.focusedNode.items = undefined;
                            
                            for ( var n=app.application.length, i=n-1; i>=0; i-- ) {
                                if ( nodes.indexOf( app.application[i].id ) >= 0 ) {
                                    app.application[i] = null;
                                    app.application.splice( i, 1 );
                                }
                            }
                            app.tree.refresh( app.tree.findNode( focusAfterDelete ) );
                        },
                        "Cancel": function() {
                            //Nothing
                        }
                    },
                    "childOf": app,
                    "modal": true
                 }
        );
    }
}