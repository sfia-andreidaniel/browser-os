function JSIde_tree( app ) {
    
    var currentNode = null;
    
    Object.defineProperty( app.tree, "provides", {
        
        "get": function() {
            
            if ( app.tree.selectedNode.nodeID == null )
                return [ 'application' ];
            
            var node = app.tree.selectedNode;
            
            var matches = /^([\d]+)\-([^*]+)$/.exec( node.nodeID );
            
            if (!matches)
                return ['unknown'];
            
            for ( var i=0, n=JSIde_Components.length; i<n; i++ ) {
                if ( JSIde_Components[i].type == matches[2] )
                    return JSIde_Components[i].provides.split(',');
            }
        }
        
    } );
    
    ( function() {
        
        var currentItemProperties = null;
        
        Object.defineProperty( app, 'currentItemProperties', {
            "get": function() {
                return currentItemProperties;
            },
            "set": function( propertyGrid ) {

                if ( currentItemProperties )
                    currentItemProperties.save();
                    
                app.panel.cells(2).innerHTML = '';
                
                currentItemProperties = app.panel.cells(2).insert( propertyGrid );
                currentItemProperties.splitPosition = 100;
                
                app.paint();
            }
        } );
        
    } )();
    
    var currentDialogNode = null;
    
    Object.defineProperty( app, 'currentWindow', {
        
        "get": function() {
            if ( currentDialogNode )
                return app.tree.toObject( currentDialogNode );
            else
                return null;
        }
        
    } );
    
    app.tree.rootNode.addContextMenu([
        {
            "caption": "Application",
            "disabled": true
        },
        null,
        {
            "caption": "Add",
            "icon": "data:image/gif;base64,R0lGODlhEAAQAKL/AP///8DAwAD/AADMAACZMwBmMwAAAAAAACH5BAEAAAEALAAAAAAQABAAAAM+GLrc/jCASaMkmAALiBjF5lDdF1ZLl5mZqJTCN8yD4V50TthMV/yzgsEQ6lEIMxuq0RnsbqMdEcokUS1YSwIAOw==",
            "items": JSIde_WhatCanWeAddIn( null, app )
        }
    ])
    
    app.tree.addCustomEventListener( 'internal-drop', function( data ) {
    
        if (!data || !data.dest || !data.src )
            return false;
    
        if ( data.dest != data.src.father )
            return false;
    
        /* Make a reindexation */
        
        var node = data.src;
        var id   = node.nodeID;
        
        setTimeout( function() {
            app.onCustomEvent('reorder', { "target": node.nodeID, "index": ( data.index || 0 ) });
        }, 1 );
        
        return false;
    } );
    
    app.tree.addCustomEventListener( 'focus', function( node ) {
    
        var currentItemProperties;
        
        setTimeout( function() {
            app.tree.selectedNode = node;
        }, 10 );
        
        app.currentItemProperties 
            = currentItemProperties 
            = new JSIde_ItemProperties( node, app );
        
        if ( node && node.nodeID ) {
            
            var cursor = node;
            
            while ( !/^([\d]+)\-dlg$/.test( cursor.nodeID ) ) {
                cursor = cursor.father;
                if (!cursor)
                    return false;
            }
            
            currentDialogNode = cursor;
            
        } else {
            currentDialogNode = null;
        }
        
        app.onCustomEvent('redraw');
        
        var throttler = throttle( function() {
            try {
                currentItemProperties.save();
                app.onCustomEvent('redraw');
            } catch (e){
                console.log("Could not save: " + e );
                console.error(e);
            }
        }, 100, false );
        
        var rows = currentItemProperties.rows;
        
        for ( var i=0,n=rows.length; i<n; i++ ) {
            ( function(row) {
                var input = row.input;
                if ( input )
                    input.addCustomEventListener('change', function() {
                        throttler.run();
                        input.focus();
                        return true;
                    });
                
            })( rows[i] );
        }
        
        ( function() {
        
            var componentIndex = app.findElementIndex( node.nodeID );
            if ( componentIndex == -1 )
                return;
            
            var item = app.application[ componentIndex ];
            var global = item.rootComponent;
            var treeNodeNameSyncProperty = global.renderProperty || 'name';
            
            try {
                currentItemProperties.inputs[ treeNodeNameSyncProperty ].addCustomEventListener(
                    'change', function() {
                        app.tree.findNode( node.nodeID ).caption = currentItemProperties.values[ treeNodeNameSyncProperty ];
                        
                        if ( treeNodeNameSyncProperty == 'name' )
                            item.name = currentItemProperties.values.name;
                        
                        return true;
                    }
                );
            } catch (e) {}
            
            currentItemProperties.values.name = item.name;
            
            return true;
        })();
        
        setTimeout( function() {
            if (!node.items || !node.items.length )
                app.tree.refresh( node );
        }, 10 );

        return true;
    } );
    
    app.tree.refresh = function( node ) {
        node = node || app.tree.rootNode;
        var id = node.nodeID;
        
        function getItems( parentNode ) {
            var out = [], item;

            for ( var i=0,n=app.application.length;i<n;i++ ) {
                if ( app.application[i].parent == parentNode ) {
                    item = JSON.parse( JSON.stringify( app.application[i] ) );
                    item.name = app.application[i].treeCaption;
                    out.push( item );
                }
            }
            
            /* Sort items by type asc, name asc */
            out.sort( function( a,b ) {
                return a.index - b.index;
            } );
            
            if ( node.items )
                for ( var i=node.items.length-1;i>=0;i-- ) {
                    app.tree.deleteNode( node.items[i] );
                }
            
            node.items = out;
            
            for ( var i=0,len=node.items.length; i<len; i++ ) {
                app.tree.refresh( node.items[i] );
            }
            
            node.expanded = !node.expanded;
            node.expanded = !node.expanded;
            
            app.tree.rootNode.repaintConnectors('');
            
            /* Assign the context menu */
            for ( var i=0,items=node.items,len=items.length; i<len; i++ ) {
                ( function( node ){
                    
                    JSIde_NodeContext( app, node );
                    
                })( items[i] );
            }

            node.expanded = true;
        }
        
        getItems( id );
    }
    
    app.tree.toObject = function( node ) {
        node = node || app.tree.rootNode;
        var id = node.nodeID || null;
        
        var out = {
            "id"       : node.nodeID,
            "name"     : ( function() { 
                var ind = app.findElementIndex( node.nodeID ); 
                if (ind == -1) 
                    return 'Application'; 
                return app.application[ ind ].name;
            })(),
            "items"    : [
            
            ],
            "type"     : node.nodeID ? /^([\d]+)\-([^*]+)$/.exec( node.nodeID )[2] : 'application',
            "cfg"      : ( function() {
                if ( id ) {
                    for ( var i=0,n=app.application.length; i<n; i++ ) {
                        if ( app.application[i].id == id ) {
                            var o = {};
                            for ( var j=0,len=app.application[i].properties.length; j<len; j++ ) {
                                o[ app.application[i].properties[j].name ] = 
                                    app.application[i].properties[j].value;
                            }
                            return o;
                        }
                    }
                }
                return {};
            } )()
        };
        
        if ( node.items && node.items.length )
            for( var i=0,n=node.items.length; i<n; i++ )
                out.items.push( app.tree.toObject( node.items[i] ) );
        
        if ( !out.items.length )
            delete out.items;
        
        return out;
    }
    
    app.tree.addCustomEventListener( 'doubleclick', function( node ) {
        console.log(node);
    } );
}