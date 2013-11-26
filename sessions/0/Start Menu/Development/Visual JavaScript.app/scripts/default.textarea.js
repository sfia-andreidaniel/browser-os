window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "textArea",
    "name"  : "TextArea",
    "order" : 6,
    "group" : "Inputs",
    "requires": "placeable",
    "provides": "event,customevent,dom,chain",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAPNJREFUeNqskj0OgkAQhQd2+WmhIyb29HYcgEpq4gUsDK01nYfgAlyBA3AOEgs8Aj8x4L41a0yMcVFf8phhs+/LZHcZ3bUR3gobqgq1pmmieWvLsohs2ya1UeiAin8dI2u4rrubpmmN9DiOvVh0SVMCcuae563quj5hoSxLStNUN09RFB15EARXjAN1XUeq1xGy3Pf9SYX6vl8EQJY7jjMzxh4A1esI2f8ChmFYDDDxaZqGsiyjOI5lraqKOOcfLScQ9z6HYUhFUUhqkiTaEyArAUvGfgGI9/w1AFkA6AcAzoLPSx7Ps5AFoM3zfP8l4HITYACmx0doHfAIkgAAAABJRU5ErkJggg==",
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
            "name": "placeholder",
            "label": "Placeholder",
            "type": "varchar",
            "value": ""
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
            "value": "",
            "widthHeight": "16x16"
        },
        {
            "name": "style",
            "label": "Style",
            "type": "DOMStyle",
            "value": "top: 10px; left: 10px; position: absolute;"
        }
    ],
    "init": function( cfg, app ) {
        var btn = new TextArea( cfg.value );
        
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            btn.setAttr('style', css );
        
        if ( anchors )
            btn.setAnchors( anchors );
        
        if ( cfg.disabled )
            btn.disabled = true;
        
        if ( cfg.readOnly)
            btn.readOnly = true;
        
        if ( cfg.placeholder)
            btn.placeholder = cfg.placeholder;
        
        if (!cfg.editable)
            btn.editable = false;
        
        if ( cfg.icon )
            btn.icon = cfg.icon;
        
        setTimeout( function() {
            btn.value = cfg.value;
        }, 1 );
        
        return btn;
    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a textbox!";
    },
    "compile": function( cfg, globalName, items ) {
        var out = '( new TextArea(' + JSON.stringify( cfg.value ) + ') )';
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
        
        if (!cfg.editable)
            out = out.concat( '.setProperty("editable", false)' );

        if (cfg.icon)
            out = out.concat( '.setProperty("icon", ' + JSON.stringify( cfg.icon ) + ')' );

        if ( anchors )
            out = out.concat( '.setAnchors(' + anchors + ')' );

        return new JSIde_StringObject( out, cfg );
    }
}));