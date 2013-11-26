window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "btn",
    "name"  : "Button",
    "group" : "Inputs",
    "order" : 4,
    "requires": "placeable",
    "provides": "event,customevent,dom,chain",
    "icon": "data:image/gif;base64,R0lGODlhEAAQANUAAJKAiol7jn10k3x0km5rmG1smF1jn11jnunq9OPk7uPk7ZGWuZygwJygv6uvyn6AkL3A1r3A1dDS4tDS4U1apZugwJyhwKuvyUxapJuhwKqvyqqvyZKWq73B1r3B1dDT4tDT4eLk7j1SquLk7ShGszFLsDFLr+Ll7ebo7jxFWaOquv///////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACwALAAAAAAQABAAAAZ1QJZwSCwaj8gkcQFoOp/OBSuAWFmvWJQqwBKsKhlLZZxhmBucAauwcjg0jot7E3dwCKzDyhOBQDoRHhCCERwGLBQrEh8TEiAfix8fIBwYLCIrI5ojJwohIwmaHCIsJioPqKmqDyklLAsksbKzslJKt7i5ukNBADs=",
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
            "value": "Button"
        },
        {
            "name": "disabled",
            "label": "Disabled",
            "type": "bool",
            "value": false
        },
        {
            "name": "style",
            "label": "Style",
            "type": "DOMStyle",
            "value": "top: 10px; left: 10px; position: absolute"
        },
        {
            "name": "action",
            "label": "onClick",
            "type": "code",
            "value": "",
            "tabPanel": "(function() { return jside.tabs; })()",
            "syntax": "javascript",
            "template": "(function( ) { })",
            "compiler": "(function(code) { var req = []; req.addPOST('code', code ); req.addPOST('do', 'compile'); req.addPOST('language', 'javascript'); var rsp = $_JSON_POST('vfs/lib/jside/handler.php', req ); if ( !rsp ) return false; if ( rsp.message ) { DialogBox( rsp.message, { 'type': rsp.status == 'success' ? 'warning': 'error', 'caption': 'Compiler' } ); } return rsp.status == 'success'; })",
            "snippetName": "(function() { return 'BtnClick: ' + jside.currentItemProperties.values.name + '_onclick'; })",
            "validator": $_POST('vfs/lib/jside/handler-validator.js', [])
        }
    ],
    "init": function( cfg, app ) {
        var btn = new Button( cfg.caption || 'Caption', function(){} );
        
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            btn.setAttr('style', css );
        
        if ( anchors )
            btn.setAnchors( anchors );
        
        if ( cfg.disabled )
            btn.disabled = true;
        
        return btn;
    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a button!";
    },
    "compile": function( cfg, globalName, items ) {
        var out = '( new Button(' + JSON.stringify( cfg.caption ) + ', ' + cfg.action + ') )';
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            out = out.concat( '.setAttr("style", ' + JSON.stringify( css ) + ')' );
        
        if ( cfg.disabled )
            out = out.concat( '.setProperty("disabled", true)' );
        
        if ( anchors )
            out = out.concat( '.setAnchors(' + anchors + ')' );

        return new JSIde_StringObject( out, cfg );
    }
}));