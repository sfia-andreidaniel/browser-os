window.JSIde_Components = window.JSIde_Components || [];

var JSIde_PropertyGrid_Parser_$export = [];

var JSIde_PropertyGrid_Parser = function( arr, isFirst, namespace ) {

    isFirst = typeof isFirst == 'undefined' ? true : false;
    namespace = typeof namespace == 'undefined' ? '.inputs' : namespace;
    
    if ( isFirst ) {
        JSIde_PropertyGrid_Parser_$export = [];
    }
    
    var out = [], item;
    
    for ( var i=0, len = arr.length; i<len; i++ ) {
        item = JSON.parse( JSON.stringify( arr[i].cfg ) );
        
        if ( item.type && [ 'eventListener', 'customEventListener' ].indexOf( item.type ) >= 0 )
            continue;
        
        if ( typeof arr[i].items != 'undefined' ) {
            item.items = JSIde_PropertyGrid_Parser( arr[i].items || [], false, namespace + "." + arr[i].cfg.name );
        }
        
        if ( arr[i].type == '_grp' )
            item.items = item.items || [];
        
        if ( arr[i].type == 'select' && typeof arr[i].cfg.values != 'undefined' ) {

            item.values = ( function(str) {
                var lines = str.trim().split('\n');
                var items = [];
                var delimiterPos, id, name;

                for ( var i=0,len=lines.length; i<len; i++ ) {
                    ( function( line ) {

                        var delimiterPos = line.indexOf( ';' );
                    
                        if ( delimiterPos == -1 )
                            return;

                        var id = line.substr(0, delimiterPos);
                        var name= line.substr(delimiterPos+1);

                        items.push({
                            "id": id,
                            "name": name
                        });

                    } )( lines[i] );
                }
                
                return items.length ? items : [];
                
            } )( item.values );
            
        }
        
        if ( arr[i].type != '_grp' ) {

            JSIde_PropertyGrid_Parser_$export.push( {
                "namespace": namespace + "." + item.name,
                "id"      : arr[i].id
            } );

            if ( typeof item.items != 'undefined' )
                delete item.items;

        }
        
        out.push( item );
    }
    
    return out;
}

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "properties",
    "name"  : "PropertyGrid",
    "group" : "PropertyGrids",
    "order" : 1,
    "requires": "placeable",
    "provides": "propertygrid,event,customevent,dom,chain",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAkJJREFUeNqcU0toE0EY/rZOVo0aE6yhJUgFkR4kYCGICApp6cEiuTRaX4dgMV68eBNBhIqixVPEFi+2UguiQu3Bgw+C0kutryAIQoppi8UHmiabTbK7s7PrzOZR9RCxP3x8zDD/9//fPzNSPB4fCXd2xoi8GrppcbAqrD/Y+G1tcC6qCjLJiVEiknft78XkbB5qSUNfsAXJRxPo6olAhGUL2GAcFl/QKt5+11DUaIyIyh+zOm68/Aw1r+DYzgCmuMChaNQRkJsqcHFIWA6VWngir4V0LTFks1UuR5Xxaozz/FwGvmY/iCw7a7MKccbihwzbQrbMUKYmiNvrQ3s4gmfzBcdCf0crxsduI3rkuFOJ1ttGXUTgHbfwdOgiiBjKt6KJe++/OhYuh9swMzmOwTMn0ShKwoJnsxBgkCUbOzY2QXfJjl9d1/GvEB2Jm5EuXLpiu72bVjSDzE8FpMnXgiC/xqnFojODvVt9KMy8Rtu27XC510HnCQLGX6wUDNAHN0EKGsVcXsedVwt8BjkkurtxrucU0ul0QwuJVBYpZoHUNjr8a6Cv9+B/QrxI6cTZAbt9S+uKZjD9JgVCPM3w7utFXuMPQ6fYHdiA5NVBnD7Y71SpJZq2EEFd7MViCebsFxDRhkgenl6AsrSEH+e7cPTudfQNDzRsXzNtPBYzYGUVJS59OOiHZvhwP60gEInj1odcpQO7ZqFSvWbz4acCqJqDFAqFRvx7DsQY/xhG9dsabJmpw5UvTDnXwZOt52OjvwQYAAbuxpMntRjOAAAAAElFTkSuQmCC",
    "compilable": false,
    "properties": [
        {
            "name": "name",
            "label": "Name",
            "type": "varchar",
            "value": ""
        },
        {
            "name": "declaration",
            "label": "Scope",
            "type": "dropdown",
            "value": "private",
            "values": [
                {
                    "id": "public",
                    "name": "Public"
                },
                {
                    "id": "protected",
                    "name": "Protected"
                },
                {
                    "id": "private",
                    "name": "Private"
                }
            ]
        },
        {
            "name": "splitPosition",
            "label": "Split Position",
            "type": "int",
            "value": 100,
            "min": 30
        },
        {
            "name": "hasToolbar",
            "label":"Has Toolbar",
            "type": "bool",
            "value": false
        },
        {
            "name": "style",
            "label": "Style",
            "type": "DOMStyle",
            "value": "top: 10px; left: 10px; position: absolute; width: return w - 20 + \"px\";  height: return h - 20 + \"px\";"
        }
    ],
    "init": function( cfg, app, children, recursionLevel ) {
        
        //console.log("PropertyGrid: Init from: ", children );
        
        var grid = new PropertyGrid( JSIde_PropertyGrid_Parser( typeof children == 'undefined' ? [] : children ) );
        
        //console.log( JSIde_PropertyGrid_Parser_$export );
    
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            grid.setAttr('style', css );
        
        if ( anchors )
            grid.setAnchors( anchors );

        grid.hasToolbar = cfg.hasToolbar;

        grid.splitPosition = cfg.splitPosition;

        return grid;
    },
    "add": function( root, cfg ) {
    },
    "compile": function( cfg, globalName, items ) {
        var out = '( new PropertyGrid( ' + JSON.stringify( JSIde_PropertyGrid_Parser( items ) ) + ' ) )';
    
        out = out + '.chain( function() {';
        
        for ( var i=0,len=JSIde_PropertyGrid_Parser_$export.length; i<len; i++ ){
            out = out + '$export(' + JSON.stringify( JSIde_PropertyGrid_Parser_$export[i].id ) + ', this' + JSIde_PropertyGrid_Parser_$export[i].namespace + ');';
        }
        
        if (!cfg.hasToolbar)
        out = out + "this.hasToolbar = " + JSON.stringify( cfg.hasToolbar ) + ";";
        out = out + 'this.splitPosition = ' + JSON.stringify( cfg.splitPosition ) + ';';
        
        out = out + '})';

        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            out = out.concat( '.setAttr("style", ' + JSON.stringify( css ) + ')' );
        
        if ( anchors )
            out = out.concat( '.setAnchors(' + anchors + ')' );
        
        return new JSIde_StringObject( out, cfg );
    }
}));