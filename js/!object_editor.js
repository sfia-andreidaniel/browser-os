function ObjectEditor( sourceObject, objectName ) {
    var holder = $('div', 'DOMObjectEditor');
    
    EnableCustomEventListeners( holder );
    
    var inner = holder.appendChild( 
        $('div', 'inner').setAnchors({
            "width": function(w,h) {
                return w + "px";
            },
            "height": function(w,h) {
                return h + "px";
            }
        })
    );
    
    var split = inner.appendChild(
        ( new Splitter() ).setAnchors({
            "width": function(w,h) {
                return w + "px";
            },
            "height": function(w,h) {
                return h + "px";
            }
        }).setAttr(
            "style", "margin: 0; padding: 0; border: none"
        )
    )
    
    split.split( [ 150 ], 'H' );
    
    var PATH_SEPARATOR = '\t';
    
    Object.defineProperty( holder, 'pathSeparator', {
        "get": function(){
            return PATH_SEPARATOR + '';
        }
    });
    
    var hasNodes = function( o ) {
        if ( o instanceof Object ) {
            switch ( true ) {
                case typeof o == 'function':
                    return false;
                default:
                    return true;
            }
        }
        return false;
    }
    
    var getObjectIcon = function( o ) {
        switch (true) {
            case null === o:
                return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAE6gAABOoBCm256QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAF3SURBVDiNpZMxSyNRFIW/d+cxJhiGFcJAmiAEU5nGxpWFpEoRU4k/YEt/g2xhYWGpjcI2W9n4CyaVS7YJ7JJWUBBJEwiEKZJB3FnmPQujaBxdjQcevHs553Dvfe8qIDM5ivfBAjcK+DSD+MFEPiAGUPIBMQB62rHZbB4CS0mS/Gq1WrsAjUZjX0SWjTG/gyD49pqBjaLoh+d5gYis1Gq1n67r+lrrr8D1cDjcmq7AAbKPE71er18qlbIisua67qrWel0pNR/H8Xa73T79rwHAeDzuFAqFdREpK6XmrbWnQRBsp80gdYiDwSAGru7jJEnO03gvGtTr9U0RaQI3QKK13qpWq2tp3GctVCoVP5/PnwDZOI53jDFnjuN8zmQyX4wxx2EY/nu1gmKxeAAsWGv/dDqd791udw+4BBbL5fLuNP/JM/q+PxdF0RFwFIbhxWg0MsDffr+/kcvlFpVS1vM8meSBu2+8kNbbWyHcbdWssM7koplxnW8BQyB4zoJTvnoAAAAASUVORK5CYII=';
                break;
            case typeof o == 'array' || o instanceof Array:
                return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAE6gAABOoBCm256QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADpSURBVDiNzZE9CsJAEIW/2axY+UNqFcEL2Np5CRsrbyAW1m7OYOc10mhp5TFEEHvdRkWNxRBS+RPT+GDhzc5+D2ZHoohJkhABFfLJizAL+n1WQDUnDFAGeuZHOFXVAhwOcL2CMdBqvSf2e7jdwFpoNMACxDEcj3oxHL4P2Gxgt4NSCcZjMGmj2fwMAwwG0OlktXn99Dv9acB6Dc6B9/rjzsFy+SHg8YDzWX2tBu22rkpEfRhq73KB+z0LsABBANstzOcwnUK3qyfVaJT5xUJXXq9rLc6R5Bj59QhFAk4F+JMRwQH+B9iL4J7TvzpRXNf14QAAAABJRU5ErkJggg==';
                break;
            case typeof o == 'function':
                return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAE6gAABOoBCm256QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEKSURBVDiNpdO7SkNBEMbx3zmJNwSNWigErSxELRTstFJLX8BCEHwv7X0DtdIiYKNgp4VYKOKNiBaJIMTibMJySLzEDwZ2Pmb+7Ay7CfpDJP6mBuoJSl00tyDpP5ohSduYw1jGUMgXg1fCQr44D1jBJXYxjXkcoBd9OMJMJ8AgNvGODVxgGyd4wgOOsdMJsBoAYzjFONZQiWoqWO8EOMQ+bsM1XzCJm6jmDmUU2wE+UMcnHsPcafCaqoXmnnaAvN7wjKnIK8v2UfsNAM4wF+WzOM8XjUSxJFtSM99CVbbQCbzKFt3qKWAgglVxH+XXGMWV7DEl2JP9A4Ix8sMY3yqNaV2oUQiHoi6/8xcugzAyNOba9gAAAABJRU5ErkJggg==';
                break;
            case typeof o == 'number':
                return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAE6gAABOoBCm256QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAC7SURBVDiNY2RgYOCAYkYG0sB/BgaGH4wMDAwCZGiGG8JEgWYGBgYGRiYKNDMwMDAwYDEgmB2CpaFyWxQZGOaJ4zNEEIHTpRkY/v+H4DfVDAx/riH4n6aiqoVgPF4QbmRgYBRhYPj3FMLnzWJg2K9OhBdg4Pd5BoYsQwaGZW4IMVU9Egz4vI2BYeY3BobY5wwMDH8gYmwCJBjw5R6C/f8nLlW0iEY6G8DIAIlPilzwnwL9/5mhDBYGMrMzAFcEKETOfLW2AAAAAElFTkSuQmCC';
                break;
            case typeof o == 'string':
                return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAE6gAABOoBCm256QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEXSURBVDiNpdNBK4RhFAXg5/2+kaFmUCYls5AkO5b4BfIDbPwCK7OWjZQ/QDZ2srJRsrBTdkpY2SlJTRZqhgVNfZ/FIA2GGaduvffc95w6t25A9q2C1pDiOaC3DfGHSfQPMYToH2KQ+WmwyHQ3Y4Fswn2Z812u/2Swwm7M7Gcuhzz9VZKmBgsMx8ym1J4ovXDXzWgnc3+KUOExpRYIMf0vXG2wrV5fENDXSC6z1cH8e59wW2NvnbXGvzG6GskTDkc4yFINxDHjGabGODqj3DTCDLkJJnc4qbKaJyxxEVHsYRoXTQ2GyBfYL/GQchMYCAwiqXD6a4ReFClE5AJFhITLKiubHDcafLvEVhCpX1W7SOO3R0ab5/wKWBg9jHFT9+0AAAAASUVORK5CYII=';
                break;
            case typeof o == 'boolean':
                return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAE6gAABOoBCm256QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEDSURBVDiNndOhSoNhFMbx37tvqIM5JrJiEJmsWBSW1CAsGLwBEYvFvmqZXoDBbvEWLEbBsDA0eAMrC2IxKTiH22eZgtPN7/OBAwfe5/zPwwsnYGZYQTrF6EbIfw0XBLsqVs0r6OnoTQAEZDPfNq/IKWspa6mqJUgRMilj/9DfgH1l24rpAVMWNdyquLOu7UgjHSDnWDAQexQE0+rqdpID+m6c23CpKtYBeQfJAT3XHvTde/WuOXQvJwck1KRPrFkQWZOTtQkG2qO27FhAZMuhFmYFJfDiInmCrhOxnqAk1vfm1JmrUVvA3FgI7FnS8aTp+bfngKL0l/ipOBo22X9AYnQ/AF3ONKJ4QQfsAAAAAElFTkSuQmCC';
                break;
            case typeof o == 'object':
                return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAE6gAABOoBCm256QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFMSURBVDiNpZFPi0FRGIefc+YyyNyVjT+xRcnWLEiRfAoL32A+wVwfymImH0A2REoWSjaSEPmTLncWp+tO0xgxT9163/f2e3vOOaJW482yqAEv3MdGCN6f8nk+AP3OMMAz8CofDNvoml3t9zAYgKZBKgXbLVgWmCZ4POprtcDrhXgcXC6Vuyyo12E0glxO9Z0OHI+wWEAyCYkErFbQaMBsBoXCjwWTCaTTkMlc9y2VYLmE8diZaaBUDwelaROLwekEoRAEAs7c54P5/NuC3U5pmSZEo86PSOR3i1gM2m34/IRiEaRpqjNpGrjd1/VtPB4QAqZT1Utdh2oVzmd1ibcYDkHXoVIBKUGCKrxedQ+32O/B73d6aRfBIPT70OtdDzebyjIcdmaXZyyXodv92+JwgGxWPbeNMAys2+LXkcD6H/m1FAID2DwQ3giB8QUVk2FFtzHFnwAAAABJRU5ErkJggg==';
                break;
            case typeof o == 'undefined':
                return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAE6gAABOoBCm256QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAE+SURBVDiNpZOxSgNBEIb/uSxhhV3ROobAXRkbIXCNcJAujZXvIL6GaGFhFSx9Azu9F5DjwhEsNaCNEkh3YG6bgwsTCy8hhD1I4g8Ly/DPtzOzDAGQ5SFspzmAnAAc7JC8hIiqZN/3XaXUMRHV8zwfRVH0ZrERAThcj/Z6vRshxOVqjJkfwzC8KEtfyrG9TkT7zPw+m83umfkFABzHOe92u8G6V9gAaZr2kyT5BDB3XVe32+0vACSEONoIkCTJx+Lued4Z/uY0N8a8rnutLSwUBMGplPIOAIqi6A8Gg9HGgGazuae1fgBQZ+anOI6vbL5KQKvVcokoBzBO0/Q6yzK2+azfCABa61qj0VAAMJlMTBXAOkQA6HQ6vlLquYSdDIfD761a2FSVFUyn07GU8hYAjDE/Vb5/L1NtpZKd1vkXUg9k7IIMIuoAAAAASUVORK5CYII=';
                break;
            default:
                return o instanceof Object ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAE6gAABOoBCm256QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFMSURBVDiNpZFPi0FRGIefc+YyyNyVjT+xRcnWLEiRfAoL32A+wVwfymImH0A2REoWSjaSEPmTLncWp+tO0xgxT9163/f2e3vOOaJW482yqAEv3MdGCN6f8nk+AP3OMMAz8CofDNvoml3t9zAYgKZBKgXbLVgWmCZ4POprtcDrhXgcXC6Vuyyo12E0glxO9Z0OHI+wWEAyCYkErFbQaMBsBoXCjwWTCaTTkMlc9y2VYLmE8diZaaBUDwelaROLwekEoRAEAs7c54P5/NuC3U5pmSZEo86PSOR3i1gM2m34/IRiEaRpqjNpGrjd1/VtPB4QAqZT1Utdh2oVzmd1ibcYDkHXoVIBKUGCKrxedQ+32O/B73d6aRfBIPT70OtdDzebyjIcdmaXZyyXodv92+JwgGxWPbeNMAys2+LXkcD6H/m1FAID2DwQ3giB8QUVk2FFtzHFnwAAAABJRU5ErkJggg==' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAE6gAABOoBCm256QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABCSURBVDiN7dMhDsAwEAPBuTSgsP9/adiVROHNkYJYsmSyyxy4Z8O3JEbg2YCXpBVgiFaAwREcwX8EWeDzmqPbvPMLoZIHNO9z8/EAAAAASUVORK5CYII=';
                break;
        }
        
    }
    
    function getEvalPath( nodeID, fancy, maintainOriginal ) {
    
        try {
    
        fancy = !!fancy;
    
        if ( !nodeID )
            return !fancy ? "sourceObject" : ( objectName || "var" );
        
        var parts = nodeID.split( PATH_SEPARATOR );
        
        var node = sourceObject;
        var path = !fancy ? "sourceObject" : ( maintainOriginal ? 'sourceObject' : ( objectName || "var" ) );
        
        for ( var i=0, len = parts.length; i<len; i++) {
            path = path.concat( !fancy 
                ? ( '[' + JSON.stringify( parts[i], { "keep_array_indentation": true } ) + ']' ) 
                : (
                    node instanceof Array 
                        ? '[' + parts[i] + ']'
                        : /^[a-z_]+([a-z\d\_])?$/i.test( parts[i] ) ? '.' + parts[i] : '[' + JSON.stringify( parts[i] ) + ']'
                ) 
            );
            node = node[ parts[i] ];
        }
        
        return path;
        
        } catch (e) {
            return null;
        }
    }
    
    var nodeIdBinding = function( nodeID ) {
        return eval( getEvalPath( nodeID ) );
    }
    
    var getObjectItems = function( o, rootPath ) {
        if (!hasNodes( o ))
            return null;
        
        var out = [];
        
        if ( o instanceof Array ) {
            for( var i=0, len = o.length; i < len; i++ ) {
                out.push({
                    "name": '[' + i.toString() + ']',
                    "icon": getObjectIcon( o[i] ),
                    "id" : rootPath == '' ? i.toString() : ( rootPath + PATH_SEPARATOR + i )
                });
            }
        } else {
            var t;
            for ( var prop in o ) {
                if ( o.propertyIsEnumerable( prop ) ) {
                    out.push({
                        "name": prop,
                        "icon": getObjectIcon( o[prop] ),
                        "id"  : rootPath == '' ? prop : ( rootPath + PATH_SEPARATOR + prop ),
                        "type": ( t = typeof o[prop] ) == 'object' ? 'zobject' : (
                            t == 'function' ? 'zfunction' : t
                        )
                    });
                }
            }
            
            /* Sort object stuff */
            out.sort( function( a, b ) {
                var alower = a.name.toLowerCase();
                var blower = b.name.toLowerCase();
                
                return ( a instanceof Object && b instanceof Object )
                    ? ( a.type == b.type ? (
                              alower == blower
                                  ? 0
                                  : ( blower > alower ? -1 : 1 )
                          ) : ( b.type > a.type ? 1 : -1 )
                      )
                    : ( a instanceof Object ? -1 : 1 );
            } );
            
            for ( var i=0, len = out.length; i<len; i++) 
                delete out[i].type;
        }
        
        return out;
    }
    
    var tree = split.cells(0).insert(
        ( new Tree({
            "name": objectName || 'Object',
            "icon": getObjectIcon( sourceObject ),
            'id': ''
        }) ).setAnchors({
            "width": function(w,h) {
                return w + "px";
            },
            "height": function(w,h) {
                return h + "px";
            }
        })
    );
    
    var prop = split.cells(1).insert(
        ( new PropertyGrid([
            {
                "name": "name",
                "label": "Name",
                "type": "Generic",
                "value": ""
            },
            {
                "name": "type",
                "label": "Type",
                "type": "dropdown",
                "values": [
                    {
                        "id": "",
                        "name": "Auto"
                    },
                    {
                        "id": "number",
                        "name": "number"
                    },
                    {
                        "id": "string",
                        "name": "string"
                    },
                    {
                        "id": "boolean",
                        "name": "boolean"
                    },
                    {
                        "id": "array",
                        "name": "array"
                    },
                    {
                        "id": "object",
                        "name": "object"
                    },
                    {
                        "id": "null",
                        "name": "null"
                    },
                    {
                        "id": "undefined",
                        "name": "undefined"
                    },
                    {
                        "id": "function",
                        "name": "function"
                    }
                ],
                "value": ""
            },
            {
                "name": "value",
                "label": "Value",
                "type": "OneDB_AceEditor",
                "value": "",
                "height": 70
            }
        ])).setAnchors({
            "width": function( w,h ) {
                return w + "px";
            },
            "height": function(w,h) {
                return h - 40 + "px";
            }
        })
    );
    
    prop.splitPosition = 100;
    
    var setNodeDetails = function( nodeID ) {
        var root = nodeIdBinding( nodeID );
        prop.values.name = getEvalPath( nodeID, true );
        prop.values.type = ( function() {
            switch ( true ) {
                case root === null:
                    return 'null';
                    break;
                case typeof root == 'undefined':
                    return 'undefined';
                    break;
                case typeof root == 'object':
                    if( root instanceof Array )
                        return 'array';
                    if ( root instanceof Function )
                        return 'function';
                    return 'object';
                    break;
                default:
                    return typeof root;
                    break;
            }
        } )();
        try {
            if (typeof root != 'string' ) {
                var str = JSON.beautify( JSON.stringify( root ) );
            } else var str = root;
            prop.values.value = str;
        } catch (e) {
            prop.values.value = root + '';
        }
    };
    
    var deleteProperty = function( propertyID ) {
        var path = getEvalPath( propertyID, true, true );
        path = path.replace( /^sourceObject(\.)?/, '' );
        remove( path );
    }
    
    tree.addCustomEventListener('focus', function( node ) {
    
        setNodeDetails( node.nodeID );
        
        applyBtn.disabled = node == tree.rootNode;
    
        if (node.items && node.items.length )
            return true;

        //console.log( node.nodeID );

        var realMapping = nodeIdBinding( node.nodeID );

        if ( hasNodes( realMapping ) ) {
            node.items = getObjectItems( realMapping, node.nodeID );
            tree.rootNode.repaintConnectors('');
            holder.onCustomEvent('change');
            for ( var i=0, len = node.items.length; i<len; i++) {
                ( function( nodeItem ) {
                    nodeItem.addContextMenu([
                        {
                            "caption": "Delete",
                            "handler": function() {
                                deleteProperty( nodeItem.nodeID );
                            }
                        }
                    ]);
                })( node.items[i] );
            }
        }
        
        return true;
    });
    
    
    var applyValue = function( value, nodeId, leaveRest ) {
        
        var evald;
        
        if ( !leaveRest )
            eval( evald = ( getEvalPath( nodeId ) + '= value;' ) );
        else {

            var setter = getEvalPath( nodeId );
            //console.log( "Setter: ", setter, 'nodeID', nodeId );
            
            eval( evald = (
                  "switch (true) {"
                 +"    case " + setter + " instanceof Array:"
                 +"         " + setter + ".push( value );"
                 +"         break;"
                 +"    case typeof value == 'object' && typeof " + setter + " == 'object':"
                 +"         for ( var key in value ) {"
                 +"            if (value.propertyIsEnumerable(key)) {"
                 +"                " + setter + "[ key ] = value[key];"
                 +"            }"
                 +"         }"
                 +"         break;"
                 +"     default:"
                 +"         "+ setter + " = value;"
                 +"         break;"
                 +"}"
            ) );
        }
        
        //console.log( 'eval: ', evald );

        var parts = nodeId.split( PATH_SEPARATOR );
        parts = parts.length ? parts.slice( 0, parts.length - 1 ).join( PATH_SEPARATOR ) : '';
        
        var node = tree.findNode( parts, 'nodeID' );
        
        if (!node)
            node = tree.rootNode;
        
        if ( node.items && node.items.length ) {
            while ( node.items.length > 0 ){
                tree.deleteNode( node.items[0], true );
            }
        }

        node.items = getObjectItems( nodeIdBinding( node.nodeID ), node.nodeID );
        
        for ( var i=0, len = node.items.length; i<len; i++) {
            ( function( nodeItem ) {
                nodeItem.addContextMenu([
                    {
                        "caption": "Delete",
                        "handler": function() {
                            deleteProperty( nodeItem.nodeID );
                        }
                    }
                ]);
            })( node.items[i] );
        }

        
        
        try {
            ( tree.selectedNode = node ).focus();
            tree.selectedNode.expanded = !tree.selectedNode.expanded;
            tree.selectedNode.expanded = !tree.selectedNode.expanded;
        } catch (e) {
        }
        
        tree.rootNode.repaintConnectors( '' );
        
        holder.onCustomEvent( 'change' );
    };
    
    Object.defineProperty( holder, "set", {
        "get": function() { 
            return applyValue;
        }
    } );
    
    function getParentPath( path ) {
        var out = path.replace(/(\.[a-z_]([a-z0-9\_]+)?|\[(.*)\])$/i, '' );
        return out;
    }
    
    function getArrayKey( path ) {
        var match = /\[([\s]+)?([\d]+)([\s]+)?\]$/.exec( path );
        //console.log( path );
        if ( match )
            return parseInt( match[2] );
        else
            return null;
    }
    
    var remove = function( valuePath ) {
        
        setTimeout( function() {
            holder.onCustomEvent('change');
        }, 1 );
        
        var deleteName = '';
        
        try {
            var exists = !valuePath ? false : ( function() {
                return eval( "typeof " + ( deleteName = "sourceObject" + ( valuePath.charAt(0) == '[' ? '' : '.') + valuePath ) + " != 'undefined'" )
            } )();
        } catch (e) {
            return false;
        }
        
        try {
            var parentPath = getParentPath( deleteName );
            var isParentArray = eval( parentPath + " instanceof Array");
        } catch (e) {
            console.error( e );
            var isParentArray = false;
        }
        
        try {
            if (!isParentArray) {
                eval("if (!delete " + deleteName + ") throw 'error';");
            } else {
                var arrayKey = getArrayKey( deleteName );
                if ( arrayKey !== null ) {
                    eval( parentPath + ".splice(" + arrayKey + ", 1);" );
                }
            }
        } catch (e) {
            return false;
        }
        
        /* Delete unsetted nodes */
        var nodes = tree.queryNodes(undefined, 'nodeID', '!'), evalPath;
        var repaintNode = null;
        
        if ( parentPath == 'sourceObject')
            repaintNode = tree.rootNode;
        else {
        
            for ( var i=0, len=nodes.length; i<len; i++) {
                if ( ( evalPath = getEvalPath( nodes[i].nodeID, true, true ) ) == parentPath ) {
                    repaintNode = nodes[i];
                } else {
                    //console.log( evalPath + " != " + parentPath );
                }
            }
        }
        
        if ( repaintNode ) {
            if ( repaintNode.items ) {
                while (repaintNode.items.length) {
                    tree.deleteNode( repaintNode.items[0] );
                }
            }
            
            repaintNode.items = getObjectItems( nodeIdBinding( repaintNode.nodeID ), repaintNode.nodeID );
            repaintNode.expanded = !repaintNode.expanded;
            repaintNode.expanded = !repaintNode.expanded;

            for ( var i=0, len = repaintNode.items.length; i<len; i++) {
                ( function( nodeItem ) {
                    nodeItem.addContextMenu([
                        {
                            "caption": "Delete",
                            "handler": function() {
                                deleteProperty( nodeItem.nodeID );
                            }
                        }
                    ]);
                })( repaintNode.items[i] );
            }
        }
        
        tree.rootNode.repaintConnectors('');
        
        return true;
    }
    
    Object.defineProperty( holder, "remove", {
        "get": function() { return remove; }
    });
    
    var applyBtn = split.cells(1).insert(
        (new Button('Apply', function() {
            try{
            
            switch ( prop.values.type ) {
                case 'function':
                    DialogBox("Cannot apply function!", {
                        "type": "error",
                        "caption": "Not allowed",
                        "childOf": getOwnerWindow( holder ),
                        "details": "Because of security reasons,\nthis type of data cannot be modified!"
                    });
                    return;
                    break;
                case 'number':
                    var numberData = prop.values.value;
                    
                    if (!numberData.toString().isDecimal())
                        throw "Bad number format";
                        
                    applyValue( numberData.isInteger() ? parseInt( numberData ) : parseFloat( numberData ), tree.selectedNode.nodeID );
                    break;
                case 'string':
                    applyValue( prop.values.value, tree.selectedNode.nodeID );
                    break;
                case 'boolean':
                    var boolValue = prop.values.value;

                    if (!/^(true|false|0|1)?$/i.test( boolValue ))
                        throw "Bad boolean format. Use : true, false, 0, 1 or empty string only";
                        //break;
                    
                    applyValue( ['true', '1' ].indexOf( boolValue.toString().toLowerCase() ) == -1 ? false : true,
                                tree.selectedNode.nodeID );
                    break;
                case 'array':
                    try {
                        var arr = JSON.parse( prop.values.value );
                        if (!(arr instanceof Array ) )
                            throw "Not array!";
                        applyValue( arr, tree.selectedNode.nodeID );
                    } catch (e) {
                        throw "String could not be decoded as a JSON array";
                    }
                    break;
                case 'object':
                    try {
                        var obj = JSON.parse( prop.values.value );
                        if (!(obj instanceof Object))
                            throw "Not an object!";
                        applyValue( obj, tree.selectedNode.nodeID );
                    } catch (e) {
                        throw "String could not be decoded as a JSON object: " + e;
                    }
                    break;
                case 'null':
                    if (!/^(null)?$/i.test(prop.values.value))
                        throw "Bad NULL format. Use : null or empty string!";
                    applyValue( null, tree.selectedNode.nodeID );
                    break;
                case 'undefined':
                    if (!/^(undefined)?$/i.test( prop.values.value ))
                        throw "Bad Undefined format. Use : undefined or empty string!";
                    applyValue( undefined, tree.selectedNode.nodeID );
                    break;
                case '':
                default:
                    try {
                        var auto = JSON.parse( prop.values.value );
                        applyValue( auto, tree.selectedNode.nodeID );
                    } catch (e) {
                        applyValue( prop.values.value, tree.selectedNode.nodeID );
                    }
                    break;
            }
            
            } catch (Exception) {
                DialogBox( Exception.toString(), {
                    "type": "error",
                    "caption": "Error applying value",
                    "childOf": getOwnerWindow( holder )
                });
            }
        }))
            .setAttr(
                "style", "display: block; position: absolute; left: 5px; bottom: 5px"
            )
    );
    
    tree.selectedNode = tree.rootNode;
    
    Object.defineProperty( holder, 'tree', {
        "get": function( ) { return tree; }
    });
    
    Object.defineProperty( holder, 'split', {
        "get": function() {
            return split;
        }
    } );
    
    tree.rootNode.addContextMenu([{"caption": "Root"}]);
    
    return holder;
}