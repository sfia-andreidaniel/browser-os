function isJSVariable( str ) {
    return /^[a-z\$\_]([a-z\d\$\_]+)?$/.test( str );
}

function JSIde_TypeOf( str ) {
    for ( var i=0,len=JSIde_Components.length; i<len; i++ )
        if ( JSIde_Components[i].type == str )
            return JSIde_Components[i].name;
    return "Unknown";
}

function JSIde_GetMatchingRequirements( requirements ) {
    console.log( requirements );
    
    if ( requirements.length == 1 && requirements[0] == ['application'] )
        return ['Application'];
    
    var items = [], provides = '';
    
    for ( var i=0,len=JSIde_Components.length; i<len; i++ ) {
        provides = JSIde_Components[i].provides.split(',');
        
        if ( provides.intersect( requirements ).length )
            items.push( JSIde_Components[i].name );
    }
    
    return items;
}

function JSIde_WhatCanWeAddIn( nodeID, app ) {
    nodeID = nodeID || null;
    var nodeType = nodeID == null ? 'application' : /^[\d]+\-(.*)$/.exec( nodeID )[1];
    var requires;
    var provides = nodeType == 'application' ? [ 'application' ] : JSIde_ComponentMappings[ nodeType ].provides.split(',');
    
    var items = [];
    
    for ( var i=0,len=JSIde_Components.length; i<len; i++ ){
        requires = JSIde_Components[i].requires.split(',');
        if ( provides.intersect( requires ).length ) {
            ( function( component ) {
                var o = {
                    "caption": component.name,
                    "handler": function() {
                        app.appHandler('cmd_add', component.type );
                    },
                    "group": component.group
                };
                if ( component.icon )
                    o.icon = component.icon;
                items.push( o );
            } )( JSIde_Components[i] );
        }
    }
    
    items.sort( function( a,b ) {
        return a.group == b.group ? a.caption.strcmp( b.caption ) : a.group.strcmp( b.group );
    } );
    
    var groups = {};
    for ( var i=0,len=items.length; i<len; i++ ) {
        groups[ items[i].group ] = groups[ items[i].group ] || [];
        groups[ items[i].group ].push( items[i] );
    }
    
    items = ( function() {
        var out = [];
        for ( var key in groups ) {
            if ( groups.propertyIsEnumerable( key ) ) {
                out.push( {
                    "caption": key,
                    "items" : groups[ key ]
                } );
            }
        }
        return out;
    } )();
    
    if ( !items.length ) {
        items.push({
            "caption": "Nothing",
            "disabled": true
        });
    }
    
    return items;
}