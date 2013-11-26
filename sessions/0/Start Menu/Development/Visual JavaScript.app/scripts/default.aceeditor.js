window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "source",
    "name"  : "Source Code Editor",
    "order" : 6,
    "group" : "Inputs",
    "requires": "placeable",
    "provides": "event,customevent,dom,chain",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAK3RFWHRDcmVhdGlvbiBUaW1lAEZyIDIxIEZlYiAyMDAzIDExOjE3OjMyICswMTAwvynnCQAAAAd0SU1FB9MCGA0PADhTZ60AAAAJcEhZcwAACvAAAArwAUKsNJgAAAAEZ0FNQQAAsY8L/GEFAAABVElEQVR42mNgoBAwwhgTdr87w8bNbfzvzx8GQvjV1atnJ3WGmcBNmXzg85mrL/7+Jxacu/Xuf175qjMgvSwggpmNzVhLnIlh510GBg6gCDsIM0PYLExAeUYIDQPa8twMAvLyxnADQM5iYGADa9i1chYDC1AzE1ATKxNEI4jNDKTjktLghvz/+5cBzQCIzREJaRBXMEP4IANAbGQXMP5nhOtBNQCqcO3iWWAa5IL09DQwG9mAv3+ZsBsAszkxBegKqAs4WDCjjokJhwEgW2ABt2TBLLALsIG0tDSGf9jCgBkaWCBXpKeloTgbHaC44O/v33AXgPDCeQjbQbZhA3A9yBwYSE5Jw+p3FBcgG/APyYBFQNvZmCExgMt2DC8AOWfP335vDEph2akJDIyMjOCQBqZaMBsdHD1xB0SdBacJmGD9jNNn/v/7R1RmAmme0hdtwkANAADDrNnW9mt5aAAAAABJRU5ErkJggg==",
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
            "name": "value",
            "label": "Value",
            "type": "textarea",
            "value": ""
        },
        {
            "name": "syntax",
            "label": "Highlighting",
            "type": "dropdown",
            "value": "",
            "values": [
                {
                    "id": "",
                    "name": "None"
                },
                {
                    "id": "javascript",
                    "name": "JavaScript"
                },
                {
                    "id":"php",
                    "name": "PHP"
                },
                {
                    "id": "html",
                    "name": "HTML"
                },
                {
                    "id": "css",
                    "name": "CSS"
                }
            ]
        },
        {
            "name": "style",
            "label": "Style",
            "type": "DOMStyle",
            "value": "top: 10px; left: 10px; right: 10px; bottom: 10px; width: auto; height: auto; position: absolute;"
        }
    ],
    "init": function( cfg, app ) {
        var ed = new AceEditor( );
        
        ed.value = cfg.value || '';
        
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            ed.setAttr('style', css );
        
        if ( anchors )
            ed.setAnchors( anchors );
        
        if ( cfg.syntax )
            ed.syntax = cfg.syntax;
        
        return ed;
    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a textbox!";
    },
    "compile": function( cfg, globalName, items ) {
        var out = '( new AceEditor() )';
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;

        if ( css.trim() )
            out = out.concat( '.setAttr("style", ' + JSON.stringify( css ) + ')' );

        if ( anchors )
            out = out.concat( '.setAnchors(' + anchors + ')' );
        
        out = out + ".chain(function() {";
        out = out + "this.value = " + JSON.stringify( cfg.value ) + ";";
        if ( cfg.syntax )
            out = out + "this.syntax = " + JSON.stringify( cfg.syntax ) + ";";
        out = out + "})";

        return new JSIde_StringObject( out, cfg );
    }
}));