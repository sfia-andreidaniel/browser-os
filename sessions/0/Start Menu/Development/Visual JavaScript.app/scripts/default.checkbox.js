window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "check",
    "name"  : "Checkbox",
    "group" : "Inputs",
    "order" : 3,
    "requires": "placeable",
    "provides": "event,customevent,dom,chain",
    "icon": "data:image/gif;base64,R0lGODlhEAAQAMQAABxRgCGhIeLi3erq5ufn4+Xl4ePj3+/v7Ozs6fX18/Pz8fHx7/z8+/r6+fn5+Pf39v////7+/v39/f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABMALAAAAAAQABAAAAVe4CSOZCkCaKqmIyC8RkEMyLEoQAvLtK0kuZMgNqstAolHcAIg9o6Bh2MJkAWMgayjQZ1loYEtg0rLmsUSKlbbYEgiVF8i3H5DqLckOgK5t35SdXx9VCuGSyaJiosTIQA7",
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
            "name": "disabled",
            "label": "Disabled",
            "type": "bool",
            "value": false
        },
        {
            "name": "readOnly",
            "label": "Readonly",
            "type": "bool",
            "value": false
        },
        {
            "name": "valuesSet",
            "label": "Type",
            "type": "dropdown",
            "values": [
                {
                    "id": "two-states",
                    "name": "Two States"
                },
                {
                    "id": "tri-states-mixed",
                    "name": "Tri States"
                },
                {
                    "id": "tri-states-allow-deny",
                    "name": "Tri States Allow/Deny"
                }
            ],
            "value": "two-states"
        },
        {
            "name": "checked",
            "label": "Value",
            "type": "dropdown",
            "value": "false",
            "values": [
                {
                    "id": "",
                    "name": "Mixed (None)"
                },
                {
                    "id": "true",
                    "name": "True (Allow)"
                },
                {
                    "id": "false",
                    "name": "False (Deny)"
                }
            ]
        },
        {
            "name": "style",
            "label": "Style",
            "type": "DOMStyle",
            "value": "top: 10px; left: 10px; position: absolute;"
        }
    ],
    "init": function( cfg, app ) {
        var btn = new DOMCheckBox();

        btn.addCustomEventListener('change', function(){
            app.currentItemProperties.values.checked = btn.checked;
        }, false);

        if ( cfg.readOnly )
            btn.readOnly = true;

        if ( cfg.disabled )
            btn.disabled = true;
            
        if ( cfg.valuesSet != 'two-states')
            btn.valuesSet = cfg.valuesSet;
        
        btn.checked = cfg.checked;
        
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            btn.setAttribute('style', css );
        
        if ( anchors )
            btn.setAnchors( anchors );
        
        return btn;
    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a checkbox!";
    },
    "compile": function( cfg, globalName, items ) {
        var out = '( new DOMCheckBox( ' + JSON.stringify( cfg.fields( [ 'valuesSet', 'checked' ] ) ) + ' ) )';
        
        if ( cfg.readOnly )
            out = out + '.setProperty("readOnly", true)';
        if ( cfg.disabled )
            out = out + '.setProperty("disabled", true)';
            
        // if ( cfg.valuesSet != 'two-states' )
        //    out = out + '.setProperty("valuesSet", ' + JSON.stringify( cfg.valuesSet ) + ')';

        // out = out + '.setProperty("checked", ' + JSON.stringify( cfg.checked ) + ')';
            
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