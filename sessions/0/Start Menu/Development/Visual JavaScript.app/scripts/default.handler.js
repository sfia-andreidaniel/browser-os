window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "cmd_",
    "name"  : "Application Command",
    "group" : "Code",
    "order" : 1,
    "requires": "handler",
    "provides": "nothing",
    "icon": "data:image/gif;base64,R0lGODlhEAAQAKIAAAAAhD9/vwCEhISEAJ+fn4SEhAAAAP///yH5BAEAAAcALAAAAAAQABAAAANCeLrcvgOE54AxtBUAaLkgtnTLRhDWpRiFZhAGBwrPd51A+6AXQGe8WeZgOUREDEKhICgeNi6Z6oBqIBvV4YL30zYSADs=",
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
            "type": "Generic",
            "value": "private"
        },
        {
            "name": "code",
            "type": "code",
            "value": "",
            "label": "Code",
            "tabPanel": "(function() { return jside.tabs; })()",
            "syntax": "javascript",
            "template": "(function( ) {\n\t\n\t/* JSPlatform handler function */\n\t\n\t\n})",
            "compiler": "(function(code) { var req = []; req.addPOST('code', code ); req.addPOST('do', 'compile'); req.addPOST('language', 'javascript'); var rsp = $_JSON_POST('vfs/lib/jside/handler.php', req ); if ( !rsp ) return false; if ( rsp.message ) { DialogBox( rsp.message, { 'type': rsp.status == 'success' ? 'warning': 'error', 'caption': 'Compiler' } ); } return rsp.status == 'success'; })",
            "snippetName": "(function() { return 'Handler: ' + jside.currentItemProperties.values.name; })",
            "validator": $_POST('vfs/lib/jside/handler-validator.js', [])
        }
    ],
    "init": function( cfg, app ) {

        return new JSIde_ApplicationHandler(
            cfg.name
        );

    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a button!";
    },
    "compile": function( cfg, globalName, items ) {
    
        var handler = new JSIde_ApplicationHandler(cfg.name, null, cfg.code );
    
        return new JSIde_StringObject( handler + '', cfg );
    }
}));