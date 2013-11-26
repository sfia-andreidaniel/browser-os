window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "grid",
    "name"  : "Grid",
    "group" : "Grids",
    "order" : 1,
    "requires": "placeable",
    "provides": "grid,event,customevent,dom,chain",
    "icon": "data:image/gif;base64,R0lGODlhEAAQAOYAAG56jvj7/3d/iHiAh/j8/+n3/+z4/+v3/u/5//f8/+/5/vv9/t/1/+v4/tTy/tPx/d71/+P3/+T3//f8/vr9/vv+/oGGgYKGgYKFgYKFgI2NeY2MeZiTcqGZbKCYbKCZbJiTc6ecaKGYbKGYbW9lPWpiP29lPvnGKfvLK3ZoPPfAJIhyNX9sOH9tOHdoO/e6IJh6MZB2MpB1M4hxNvWzG518L5h5MfOsF++eDvKlEu6YCeuOAu2SBqVlFaRjFqRiFqJfF6JcGIxZJ6FZGaBWGp5TG51QHZxNHptLH5pJH5pHIP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEsALAAAAAAQABAAAAeagEuCg4SFhoeGSklIR0ZFRENBQD8+PYNCOzw6ODk3NC8qJyiWgoqMjpCSlKRLNQ4PDyGwsbM1gzUPBQUhuru9toIwIh4ixSMeHx4dHTaDMhAGDSAHBgYc1AYxgysMCAgbCgoIGuEIM4MtFxjr6xYZFxcZLIMpERMEAgkJEwMB+i6DSEiosAAAhYMAKhw0MaiEw4cQHyKaSNFQIAA7",
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
            "name": "selectable",
            "label": "Selectable",
            "type": "bool",
            "value": true
        },
        {
            "name": "multiple",
            "label": "Multiple",
            "type": "bool",
            "value": false
        },
        {
            "name": "resizeable",
            "label": "Column Resizeable",
            "type": "bool",
            "value": false
        },
        {
            "name": "sortable",
            "label": "Column Sortable",
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
        
        var grid = new DataGrid();
    
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            grid.setAttr('style', css );
        
        if ( anchors )
            grid.setAnchors( anchors );
        
        if ( cfg.selectable )
            grid.selectable = true;
        
        if ( cfg.multiple )
            grid.multiple = true;
        
        try {
        ( function() {
            if ( !children || !children.length )
                return;
            
            var sizes = [];
            var names = [];
            
            for ( var i=0,len=children.length; i<len; i++ ) {
                sizes.push( children[i].cfg.width );
                names.push( children[i].cfg.caption );
            }
            
            grid.colWidths = sizes;
            grid.th( names );
            
        } )();
        } catch (e) {
            alert(e);
        }
        
        try {
            if ( cfg.resizeable )
                grid.enableResizing();
        } catch (e) {}
        
        try {
            if ( cfg.sortable )
                grid.enableSorting();
        } catch (e) {}
        
        return grid;
    },
    "add": function( root, cfg ) {
    },
    "compile": function( cfg, globalName, items ) {
        var out = '( new DataGrid() )';

        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            out = out.concat( '.setAttr("style", ' + JSON.stringify( css ) + ')' );
        
        if ( anchors )
            out = out.concat( '.setAnchors(' + anchors + ')' );
        
        if ( cfg.selectable )
            out = out.concat( '.setProperty("selectable", true)' );
        
        if ( cfg.multiple )
            out = out.concat( '.setProperty("multiple", true )' );
        
        var chains = [];
        
        try {
        ( function() {
            if ( !items || !items.length )
                return;
            
            var sizes = [];
            var names = [];
            
            for ( var i=0,len=items.length; i<len; i++ ) {
                sizes.push( items[i].cfg.width );
                names.push( items[i].cfg.caption );
            }
            
            chains.push( "this.colWidths = " + JSON.stringify( sizes ) + ';' );
            chains.push( "this.th(" + JSON.stringify( names ) + ");" );
            
            chains.push( "this.setProperty(\"delrow\", function( row ) {\n //What to do when deleting a row\nreturn false;});" );
            
        } )();
        } catch (e) {
            alert(e);
        }
        
        if ( cfg.resizeable )
            chains.push( "this.enableResizing();" );
        
        if ( cfg.sortable )
            chains.push( "this.enableSorting();" );
        
        if ( chains.length )
            out = out.concat(".chain( function() {" + chains.join('') + "} )");

        return new JSIde_StringObject( out, cfg );
    }
}));