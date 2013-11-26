window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "customevent",
    "name"  : "Custom Event Listener",
    "group" : "Code",
    "order" : 3,
    "requires": "customevent",
    "provides": "nothing",
    "icon": "data:image/gif;base64,R0lGODlhEAAQAIQYAP8AAf8CAf8CBP8EAf8HAf8QAv8QBP8WAv8cAv8kCf8kDf8kEv8tAf8tBP8tBv83Af83Bv83Cf9CAf9kAv9kHv99RP+kUv+kZv///////////////////////////////yH5BAEAAB8ALAAAAAAQABAAAAVD4CeOZGme6HdBbIMQCvpQk1MIAGo9lnTgqZkPiKrwGIJB6vOYTCIJA9FECAACkikqkc0tFd2lyKFFLRIB8YigbrtJIQA7",
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
            "value": "customEventListener",
            "type": "Generic"
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
            "name": "code",
            "type": "code",
            "value": "",
            "label": "Code",
            "tabPanel": "(function() { return jside.tabs; })()",
            "syntax": "javascript",
            "template": "(function( eventData ) { return true; })",
            "compiler": "(function(code) { var req = []; req.addPOST('code', code ); req.addPOST('do', 'compile'); req.addPOST('language', 'javascript'); var rsp = $_JSON_POST('vfs/lib/jside/handler.php', req ); if ( !rsp ) return false; if ( rsp.message ) { DialogBox( rsp.message, { 'type': rsp.status == 'success' ? 'warning': 'error', 'caption': 'Compiler' } ); } return rsp.status == 'success'; })",
            "snippetName": "(function() { return 'CustomEvent: ' + jside.currentItemProperties.values.event; })",
            "validator": $_POST('vfs/lib/jside/handler-validator.js', [])
        }
    ],
    "init": function( cfg, app ) {

        return new JSIde_CustomEventHandler(
            cfg.event || "dummy",
            cfg.code
        );

    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a button!";
    },
    "compile": function( cfg, globalName, items ) {
    
        var evt = new JSIde_CustomEventHandler(cfg.event || "dummy", cfg.code );
    
        return new JSIde_StringObject( evt.toString(), cfg );
    }
}));