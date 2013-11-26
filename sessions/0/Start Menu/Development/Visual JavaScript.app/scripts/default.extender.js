window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "extender",
    "name"  : "Application Extender",
    "group" : "Code",
    "order" : 2,
    "requires": "extender",
    "provides": "nothing",
    "icon": "data:image/gif;base64,R0lGODlhEAAQALMAAMDAwMbDxpyanAAA/wBhlAAwMQD/AACWAABRAGNlY///AP+qAP///8DAwAAAAMDAwCH5BAEAAA0ALAAAAAAQABAAAAQ3sMlJq704T8d5CE7TjQ5jmqF4oqVHMh1crul8cnKtxjgt2SwZaJSTrWC/I8nxCS1Tmqh0SpVEAAA7",
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
            "type": "Generic",
            "value": "private"
        },
        {
            "name": "caption",
            "label": "Implements",
            "type": "varchar",
            "value": ""
        },
        {
            "name": "code",
            "type": "code",
            "value": "",
            "label": "Code",
            "tabPanel": "(function() { return jside.tabs; })()",
            "syntax": "javascript",
            "template": "(function(app) {})",
            "compiler": "(function(code) { var req = []; req.addPOST('code', code ); req.addPOST('do', 'compile'); req.addPOST('language', 'javascript'); var rsp = $_JSON_POST('vfs/lib/jside/handler.php', req ); if ( !rsp ) return false; if ( rsp.message ) { DialogBox( rsp.message, { 'type': rsp.status == 'success' ? 'warning': 'error', 'caption': 'Compiler' } ); } return rsp.status == 'success'; })",
            "snippetName": "(function() { return 'Extender: ' + jside.currentItemProperties.values.name; })",
            "validator": $_POST('vfs/lib/jside/handler-validator.js', [])
        }
    ],
    "init": function( cfg, app ) {

        return new JSIde_ApplicationExtender(
            cfg.code
        );

    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a button!";
    },
    "compile": function( cfg, globalName, items ) {
    
        var handler = new JSIde_ApplicationExtender(cfg.code );
    
        return new JSIde_StringObject( handler + '', cfg );
    }
}));