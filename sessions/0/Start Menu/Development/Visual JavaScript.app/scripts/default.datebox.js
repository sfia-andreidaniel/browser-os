window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "dateBox",
    "name"  : "DateBox",
    "group" : "Inputs",
    "order" : 5,
    "requires": "placeable",
    "provides": "event,customevent,dom,chain",
    "icon": "data:image/gif;base64,R0lGODlhEAAQAOZZAP///zBIYICYwICg0ODo//D4/yAoIICo8JCo8PDw//Dw8ICAgICg8LDA0HCIsP/4/1CA4EBw0KC40ICgwOA4ECAgIGBgYHCY4ICg4HCQ4NDg/6Cw0MA4EP+AYJCQkKSkpNze4UA4QGBYYPBgMMDI0GCI4GCQ4KCwwOBAEEB44HCg8KC44ODw/zBo0LDI/0tSS+fn5zBIUPHy8VB40ICo/3BwcDA4MI+Pj4CQoDxp0tDY4NXV1WB4kOHe4cDI4KCowP+YgJCw/1BYYMDQ/5CYoLG0t7DI8EBw4EBQYMfHx9DQ0KCgoNDo/zAwMLAwAJCw0JCowFCA0MPDw9DY0JCIkNDQ4Dxpw5CYkJCo0P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFkALAAAAAAQABAAAAfcgFkGIIMGMAZJBjsGMgY9Hx8AHgA3AAuWADUAFgAiUwgIBxgYFxkmJRBRMxGsLQgEsLFBNAcHDLcqOaC1DCqlpxAQKSlHVhIAAAPIyskADwMFCQHHAALI1tUPBQIJOkgbTwIOA+LkQB0jKOQBJ8vuDx0ABRQEJOwKV1QLSgLaIwUFOBBoEOCHBwUKqojgQQ4FBQ5O1hFRACBEgQZCog2ANUADwSUADVRwUSFBAgGwJngMsIAECyZDoDRZMcGBhJpYBATAYcGHkQ0hYgQYSpRoFikvDNgokqWp06eBAAA7",
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
            "type": "varchar",
            "value": ""
        },
        {
            "name": "disabled",
            "label": "Disabled",
            "type": "bool",
            "value": false
        },
        {
            "name": "readOnly",
            "label": "Read-Only",
            "type": "bool",
            "value": false
        },
        {
            "name": "editable",
            "label": "Editable",
            "type": "bool",
            "value": true
        },
        {
            "name": "icon",
            "label": "Icon",
            "type": "image",
            "widthHeight": "16x16",
            "value": ""
        },
        {
            "name": "placeholder",
            "label": "Placeholder",
            "type": "varchar",
            "value": ""
        },
        {
            "name": "displayFormat",
            "label": "Display Format",
            "type": "varchar",
            "value": "",
            "placeholder": "%a, %d %b, %Y"
        },
        {
            "name": "valueFormat",
            "label": "Value Format",
            "type": "varchar",
            "value": "",
            "placeholder": "%Y-%m-%d"
        },
        {
            "name": "style",
            "label": "Style",
            "type": "DOMStyle",
            "value": "top: 10px; left: 10px; position: absolute; margin: 0;"
        }
    ],
    "init": function( cfg, app ) {
        var btn = new DateBox( cfg );
        
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            btn.setAttribute('style', css );
        
        if ( anchors )
            btn.setAnchors( anchors );
        
        if ( cfg.disabled )
            btn.disabled = true;
        
        if ( cfg.readOnly)
            btn.readOnly = true;
        
        if ( cfg.placeholder)
            btn.placeholder = cfg.placeholder;
        
        btn.editable = cfg.editable;
        
        return btn;
    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a textbox!";
    },
    "compile": function( cfg, globalName, items ) {
        var out = '( new DateBox(' + JSON.stringify( cfg ) + ') )';
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;

        if ( css.trim() )
            out = out.concat( '.setAttr("style", ' + JSON.stringify( css ) + ')' );

        if ( cfg.disabled )
            out = out.concat( '.setProperty("disabled", true)' );

        if ( cfg.readOnly )
            out = out.concat( '.setProperty("readOnly", true)' );

        if ( cfg.placeholder )
            out = out.concat( '.setProperty("placeholder", ' + JSON.stringify( cfg.placeholder ) + ')' );
        
        if ( !cfg.editable )
            out = out.concat( '.setProperty("editable", false )' );

        if ( anchors )
            out = out.concat( '.setAnchors(' + anchors + ')' );

        return new JSIde_StringObject( out, cfg );
    }

}));