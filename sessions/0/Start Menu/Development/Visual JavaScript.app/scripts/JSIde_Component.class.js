var JSIde_ComponentMappings = {};

function JSIde_setupComponent( component ) {
    var componentType = /^[\d]+\-([^*]+)$/.exec( component.id );
    JSIde_ComponentMappings[ componentType[1] ].setupObject( component );
}

var JSIde_Index = 0;

function JSIde_Component( componentConfig, settings ) {
    
    settings = settings || {};
    
    settings.autoIncrement = typeof settings.autoIncrement == 'undefined' ? true : !!settings.autoIncrement;
    
    var o = componentConfig;
    
    var uid = 0;
    
    Object.defineProperty( o, 'componentID', {
        "get": function() { 
            uid++;
            var s = uid.toString();
            while (s.length < 4)
                s = '0'.concat(s);
            return s;
        },
        "set": function( val ) {
            uid = val;
        }
    } );
    
    
    Object.defineProperty( o, 'setupObject', {
        "get": function() {
            return function( d ) {
                var renderProperty = o.renderProperty || 'name';

                for ( var j=0,len=d.properties.length; j<len; j++ ) {
                    if ( d.properties[j].name == '_id' )
                        d.properties[j].value = d.id;
                }
                
                Object.defineProperty( d, "treeCaption", {
                    "get": function() {
                        for ( var i=0,len=d.properties.length; i<len; i++ ) {
                            if ( d.properties[i].name == renderProperty ) {
                                var value = d.properties[i].value;
                                if (!value)
                                    return d[renderProperty] || o[renderProperty] || d.name;
                                return value;
                            }
                        }
                        return 'Unnamed';
                    }
                } );

                Object.defineProperty( d, "rootComponent", {
                    "get": function() {
                        return o;
                    }
                } );
                
                if ( typeof d.index == 'undefined' )
                    d.index = JSIde_Index + 1;
                
                JSIde_Index = Math.max( JSIde_Index, d.index );
                
                return d;
            }
        }
    } );
    
    Object.defineProperty( o, 'create', {
        "get": function() {
            return function( app ) {
                var d = {};
                var id = 0;
                d.id         = ( id = o.componentID ) + '-' + o.type;
                d.parent     = app.tree.selectedNode.nodeID;
                d.properties = JSON.parse( JSON.stringify( o.properties ) );
                d.name       = o.type + ( settings.autoIncrement ? parseInt( id ) : '');
                if ( typeof o.icon != 'undefined')
                    d.icon = o.icon;
                
                d = o.setupObject( d );
                
                return d;
            }
        }
    } );
    
    Object.defineProperty( o, 'requirements', {
        "get": function() {
            return o.requires.split(',');
        }
    } );
    
    if ( typeof JSIde_ComponentMappings[ o.type ] != 'undefined' && JSIde_ComponentMappings.hasOwnProperty( o.type ) ) {
        throw "Component conflict: Another component with type '" + o.type + "' is allready defined!";
    }
    JSIde_ComponentMappings[ o.type ] = o;
    
    return o;
}