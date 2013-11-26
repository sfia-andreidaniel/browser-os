window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "event",
    "name"  : "Event Listener",
    "group" : "Code",
    "order" : 3,
    "requires": "event",
    "provides": "nothing",
    "icon": "data:image/gif;base64,R0lGODlhEAAQAPcAAFpCMVpSSmtKKWtjSntrQoxrIYx7SoyEWpRrGJSEUpx7GKWMQqWUY62EIa2UY62Ua8a9lMa9pc61e869nM7Gpd7GhN7OjOeEhOfOWufOjOfWjO+le++lhO+te++1e++9lO/GjPfGa/fGlPfOlPfv1v/Wc//ne//ntf/33v/35////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAACoALAAAAAAQABAAAAhlAFUIHEiwoMGDCFWksJAhQwUJDyYgxHDCBIgNFwIgRIEBRYkOFwYkpPjxgoGEJDqGuLAgoQoMJkyM+MDhAgCEDhIQOFDiggCXKiD0LAB0Qk8EQFWAuKAgaYQPDZIKZCC1qlUVAQEAOw==",
    "renderProperty": "event",
    "properties": [
        {
            "name": "name",
            "label": "Name",
            "type": "Generic",
            "value": ""
        },
        {
            "name": "type",
            "label": "Type",
            "type": "Generic",
            "value": "eventListener"
        },
        {
            "name": "declaration",
            "label": "Scope",
            "type": "Generic",
            "value": "private"
        },
        {
            "name": "event",
            "label": "Event",
            "type": "varchar",
            "value": "",
            "placeholder": "E.g: click"
        },
        {
            "name": "useCapture",
            "label": "Use Capture",
            "type": "bool",
            "value": "true"
        },
        {
            "name": "code",
            "type": "code",
            "value": "",
            "label": "Code",
            "tabPanel": "(function() { return jside.tabs; })()",
            "syntax": "javascript",
            "template": "(function( e ) {})",
            "compiler": "(function(code) { var req = []; req.addPOST('code', code ); req.addPOST('do', 'compile'); req.addPOST('language', 'javascript'); var rsp = $_JSON_POST('vfs/lib/jside/handler.php', req ); if ( !rsp ) return false; if ( rsp.message ) { DialogBox( rsp.message, { 'type': rsp.status == 'success' ? 'warning': 'error', 'caption': 'Compiler' } ); } return rsp.status == 'success'; })",
            "snippetName": "(function() { return 'Event: ' + jside.currentItemProperties.values.event; })",
            "validator": $_POST('vfs/lib/jside/handler-validator.js', [])
        }
    ],
    "init": function( cfg, app ) {

        return new JSIde_EventHandler(
            cfg.event || "dummy",
            cfg.code,
            cfg.useCapture
        );

    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a button!";
    },
    "compile": function( cfg, globalName, items ) {
    
        var evt = new JSIde_EventHandler(cfg.event || "dummy", cfg.code, cfg.useCapture );
    
        return new JSIde_StringObject( evt.toString(), cfg );
    }
}));