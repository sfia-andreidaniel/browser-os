function JSIde_cmd_add( app ) {
    app.handlers.cmd_add = function( componentType ) {

        app.currentItemProperties.save();
        
        for ( var i=0, len = JSIde_Components.length; i<len; i++ ) {
            if ( JSIde_Components[i].type == componentType ) {
                if ( !JSIde_Components[i].requirements.intersect( app.tree.provides ).length ) {
                    DialogBox( "A '" + JSIde_TypeOf( componentType ) + "' can be added inside of the following component(s):\n\n- " + JSIde_GetMatchingRequirements( JSIde_Components[i].requirements ).join( '\n- ' ), {
                        "type": "error"
                    } );
                } else {
                
                    var item;
                
                    app.application.push( item = new JSIde_Components[i].create( app ) );
                    app.tree.refresh( app.tree.selectedNode );
                    
                    app.tree.selectedNode = app.tree.findNode( item.id );
                }
            }
        }
        
        app.onCustomEvent('redraw');
    }
}