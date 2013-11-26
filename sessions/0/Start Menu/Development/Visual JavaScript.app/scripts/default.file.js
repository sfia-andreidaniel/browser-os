window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "file",
    "name"  : "File",
    "group" : "Inputs",
    "order" : 7,
    "requires": "placeable",
    "provides": "dom,event,customevent,chain",
    "icon": "data:image/gif;base64,R0lGODlhEAAQAOZtAOHj7ZDrJNXZ4lHWFFHWFeTn8HR4hs7S3efp84/rJXR4hfj5++Pm7t7h7Ojr8+ns8+bo8v3+/vv8/XN3hNfa5vf5+9fa49rd6Nba5NDS3fLz+8LH0oiMl7O5yO7v89jc5vf3+3R5hpDrJeHi7eDi7Ofp8nR5iYqNlsbL2KCnuMTJ18XJ1cfL1+Lk7oqNmP39/fDy/MvQ3s/S3uLk65qfsomNl4mMmNve6Pn7/Ozt9pugsvL1/LW5yMzQ3G90gePn7vX3+9vd57/DznN3hb7C0sXH0IyPmrW5ytPY4ufp8fP2/PX3/fP1+a6xwOPn8vP3+LC1w9DT4PP2+8zQ3XJ2hMXJ0bu+yVLWFdHV4nByf9ve6cnO2YmNmOzu9/j4++bo7e7y+dHV4ODj7t3g64iLlvn7/f///736MCTHCc7R3QCIAP7+/v//zP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAG0ALAAAAAAQABAAAAfEgFsWAoRIPSwdRx5tjIxpa5BrL0AaMkFEX41tj5FrFUxhUl4qM42ckBELZVBWVUI0RY6dETgSKzxNOikmsp0SIEpdFygxPr1ramoLTwwUUVNYVL1qAQRqSQBjHxhaE7JqZwEDaGoMAA03YkOMB+BnIuPkZi0NTgaM7uEEaPxqPyQQFLBLxibAFXJqHBQAgOBemwPI2CTYp+aBQoYOM0RMMK5iiQIjAn5jQ5KNmiU7wOSAEYLRhhNGkiVzUYMLBzI2sjAKBAA7",
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
            "name": "destination",
            "label": "Destination",
            "type": "dropdown",
            "value": "memory",
            "values": [
                {
                    "id": "memory",
                    "name": "Memory"
                },
                {
                    "id": "server",
                    "name": "Server (requires binary dataType)"
                }
            ]
        },
        {
            "name": "dataType",
            "label": "Data Type",
            "type": "dropdown",
            "value": "text",
            "values": [
                {
                    "id": "text",
                    "name": "Text"
                },
                {
                    "id": "base64",
                    "name": "Base 64"
                },
                {
                    "id": "binary",
                    "name": "Binary (for server destination)"
                }
            ]
        },
        {
            "name": "maxSize",
            "label": "Maximum Size (bytes)",
            "type": "int",
            "minValue": 1,
            "value": 2 * 1024 * 1024
        },
        {
            "name": "mime",
            "label": "Mime (RegExp)",
            "type": "varchar",
            "value": "",
            "placeholder": "^text(\/|$)"
        },
        {
            "name": "fileNameRegex",
            "label": "FileName (RegExp)",
            "type": "varchar",
            "value": "",
            "placeholder": "\.(gif|jpeg|jpg|png)$"
        },
        {
            "name": "style",
            "label": "Style",
            "type": "DOMStyle",
            "value": "top: 10px; left: 10px; position: absolute; right: 10px; margin: 0;"
        }
    ],
    "init": function( cfg, app ) {
        var btn = new DOMFile( cfg.fields([ 'disabled', 'destination', 'dataType', 'maxSize', 'mime', 'fileNameRegex' ]) );
        
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
        throw "Cannot add something inside a DOMFile!";
    },
    "compile": function( cfg, globalName, items ) {
        var out = '( new DOMFile(' + JSON.stringify( cfg.fields([ 'disabled', 'destination', 'dataType', 'maxSize', 'mime', 'fileNameRegex' ]) ) +  ') )';

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