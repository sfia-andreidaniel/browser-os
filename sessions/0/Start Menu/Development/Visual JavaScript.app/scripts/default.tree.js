window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "tree",
    "name"  : "Tree",
    "order" : 6,
    "group" : "Inputs",
    "requires": "placeable",
    "provides": "event,customevent,dom,chain",
    "icon": "data:image/gif;base64,R0lGODlhEAAQALMPAH+dsdLf6ExJSqmtsU9PUt3n7tbV1ePj4/Xdy+u7liMfIMjHx1pXWE2Ao9d3Lv///yH5BAEAAA8ALAAAAAAQABAAAARK8MlJ62s4AzuzfkwoDpfXbEqqbub5LHB8PEFADHXBUcyyW71KYkicBCmOpNKoUimXkuPkmTT6frzrBMHtWitUh1EgCoUnhljsHAEAOw==",
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
            "label": "Root Caption",
            "type": "varchar",
            "value": "Tree"
        },
        {
            "name": "icon",
            "label": "Root Icon",
            "type": "image",
            "widthHeight": "16x16",
            "value": ""
        },
        {
            "name": "value",
            "label": "Root Node ID",
            "type": "dropdown",
            "value": '""',
            "values": [
                {
                    "id": '""',
                    "name": "'' (empty string)"
                },
                {
                    "id": "null",
                    "name": "null"
                },
                {
                    "id": "false",
                    "name": "false"
                },
                {
                    "id": "0",
                    "name": "0 (int zero)"
                }
            ]
        },
        {
            "name": "style",
            "label": "Style",
            "type": "DOMStyle",
            "value": "top: 10px; left: 10px; bottom: 10px; width: return w - 20 + 'px'; position: absolute;"
        }
    ],
    "init": function( cfg, app ) {
        var btn = new Tree( {
            "name": cfg.caption,
            "id"  : JSON.parse( cfg.value ),
            "icon": cfg.icon || 'img/folder_opened.png',
            "items": []
        } );
        
        btn.setAttribute('jside-id', cfg.id );
        
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            btn.setAttr('style', css );
        
        if ( anchors )
            btn.setAnchors( anchors );
        
        return btn;
    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a tree!";
    },
    "compile": function( cfg, globalName, items ) {
        var out = '( new Tree(' + JSON.stringify( {
            "name": cfg.caption,
            "id"  : JSON.parse( cfg.value ),
            "icon": cfg.icon || 'img/folder_opened.png',
            "items": []
        } ) + ') )';
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