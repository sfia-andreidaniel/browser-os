window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "lbl",
    "name"  : "Label",
    "group" : "Inputs",
    "order" : 1,
    "requires": "placeable",
    "provides": "dom,event,chain",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJZJREFUeNpi/P//PwMlgImBQjDwBjAyMUHMAIUFNDykgdgXh/rNQPyUkZGRAYRRXIAkCBJjB+IZQHwbimdAxZiQNaO4ABkgucYLKrQNXSMMsABxBYa/GBmPACkQZoO5DghsoBh7GGBzBRBEQLkrsNkOcwE+IEwoFpjRTUZKmbVAbATEckCsBcSHkLyD8MJoUqbcAIAAAwA5aiOE7oa8JQAAAABJRU5ErkJggg==",
    "renderProperty": "caption",
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
            "name": "caption",
            "label": "Caption",
            "type": "varchar",
            "value": "Label"
        },
        {
            "name": "style",
            "label": "Style",
            "type": "DOMStyle",
            "value": "top: 10px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis;"
        }
    ],
    "init": function( cfg, app ) {
        var lbl = new DOMLabel( cfg.caption || 'Caption', {} );
        
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            lbl.setAttribute('style', css );
        
        if ( anchors )
            lbl.setAnchors( anchors );
        
        return lbl;
    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a label!";
    },
    "compile": function( cfg, globalName, items ) {
        var out = '( new DOMLabel(' + JSON.stringify( cfg.caption ) +  ') )';
        var parser = new CSSParser( cfg.style );
        var css = parser.css;

        if ( css.trim() )
            out = out + '.setAttr("style", ' + JSON.stringify( css ) + ' )';

        var anchors = parser.anchors;
        if ( anchors )
            out = out + '.setAnchors(' + anchors + ')';

        return new JSIde_StringObject( out, cfg );
    }

}));