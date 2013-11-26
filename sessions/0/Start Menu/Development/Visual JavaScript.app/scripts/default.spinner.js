window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "spinner",
    "name"  : "Spinner",
    "group" : "Inputs",
    "order" : 5.1,
    "requires": "placeable",
    "provides": "event,customevent,dom,chain",
    "icon": "data:image/gif;base64,R0lGODlhEAAQANUjALDI4JSlzu/3/+fv/yI6UitDW1pyioujuy5GXpStzvv4//Hy/+jq/+fu9u/4//n8/zJJYbjByeHe57C/y6Wzv+Tk8v/4/2N3ipqowXucvbXG9zBIYISlxoScvbXO/4SlvbXO9wAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACMALAAAAAAQABAAAAaEwJFwSCyOPh3OB6lcJp2cjmhKnYI8msA1w6lWPaBAKAH6ZKYbC2ADEGlAIU8I1PmIIhvF4XIQgf8gUSIQGw4FDQUiV29bXRIbCwgVCCICA5aWZmgPBAwEbiCLdHYTGxQGGAZ+V6yCG69rbVdzcVxeVGBiZJq3oGFvdU9MS8NMRsfIyUJBADs=",
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
            "type": "int",
            "value": 0
        },
        {
            "name": "minValue",
            "label": "Min Value",
            "type": "int",
            "value": 0
        },
        {
            "name": "maxValue",
            "label": "Max Value",
            "type": "int",
            "value": 65535
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
            "name": "style",
            "label": "Style",
            "type": "DOMStyle",
            "value": "top: 10px; left: 10px; position: absolute;"
        }
    ],
    "init": function( cfg, app ) {
        var btn = new Spinner( {
            "value": cfg.value,
            "minValue": cfg.minValue,
            "maxValue": cfg.maxValue
        } );
        
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
        
        btn.addCustomEventListener('change', function() {
            app.currentItemProperties.values.value = btn.value;
        } );
        
        return btn;
    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a spinner!";
    },
    "compile": function( cfg, globalName, items ) {
        var out = '( new Spinner(' + JSON.stringify( {
            "value": cfg.value,
            "minValue": cfg.minValue,
            "maxValue": cfg.maxValue
        } ) + ') )';
        
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

        if ( anchors )
            out = out.concat( '.setAnchors(' + anchors + ')' );

        return new JSIde_StringObject( out, cfg );
    }

}));