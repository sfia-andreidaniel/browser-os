window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "chain_",
    "name"  : "Chain Sequence",
    "group" : "Code",
    "order" : 4,
    "requires": "chain",
    "provides": "nothing,chain",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArtJREFUeNqMU+9LU2EUfu7dnbq5m6V5bYYVzso0SruWJlKwIDCIAkU/2Q+I7EOf+iop+Kk/INARQQgSRB+KhRIjBRMUYjiqoWb6oV9sbrq53f28d/d23rX5MTzwcC7nvOd5n3POe7ne4WEw4zjuOjk7/m8zuq5/13M5GIaBlfl5COyDGfnaiZGR8SwlVQZdR45yxbzP58OEx/OA3UVYY7HGri7wjK0AjtgxtpjAkCeFufU0UokEFEVBPB7P+9ejo+N07grVHi9K4r9ZehEUryJHBIx6JZhGW1slplez+PSHg8DzrD1sb2/j6eQknE1NY1+Xlvr9pIhBoBo5yR90/agcwN2XP/Os3rUQWjvseDu7AU0txcWjApxOZ74dURTx3ueLFBUIaibjOt3VcFKqEW06BXRqOZkDFraAuvZ6vJr5gsuOWkDToOl6vkgjtbsEiVgMmX2izffRDz4WzwfD9Q40HKuG172IO512lJnN/04TCWsnp2m7BHySCOb8IUU2B+B5dAEJGpxeVY3f7g8YaJdwo6UaZpMpT1IiCDAxAmudXT33WM60DIFXs9nBpHtq9d3swgtG23TIAm7KjfuX6tB3vhY8FTAUSZgXDzvYFlxsfsKRxkZvdHNzsCy61MfkPbvXnh+WzlDouWis2ERbOdt6pneZq1B+fQ64BNqra78kybp0Cz3PV7EXS1rLoTpKbDvhMIRoKCT3PLwmazR9jS5kXtGAGCGSBaKEBG1FLeREWnwFzXRtOawcCATAWfsnXCRVZsyO+ip5LwrWN7a8zJdZrYMQmm+ivPM2TnR3DxkFI0KDdm3QP2FkNM1Iq6qRzGYNJZ02kvTNzrIaU80pCJr/jYXUijsdHaXFG7jC5NkwuYLn2SNjz5qwE4mUJhanJQrF2VO2EKRYMBi1NTc/2UsLeioVZTXsaf0VYAAAiVu8G6BSQQAAAABJRU5ErkJggg==",
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
            "template": "(function( ) { })",
            "compiler": "(function(code) { var req = []; req.addPOST('code', code ); req.addPOST('do', 'compile'); req.addPOST('language', 'javascript'); var rsp = $_JSON_POST('vfs/lib/jside/handler.php', req ); if ( !rsp ) return false; if ( rsp.message ) { DialogBox( rsp.message, { 'type': rsp.status == 'success' ? 'warning': 'error', 'caption': 'Compiler' } ); } return rsp.status == 'success'; })",
            "snippetName": "(function() { return jside.currentItemProperties.values.name; })",
            "validator": $_POST('vfs/lib/jside/handler-validator.js', [])
        }
    ],
    "init": function( cfg, app ) {

        return new JSIde_Chain();

    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a chain!";
    },
    "compile": function( cfg, globalName, items ) {
        var handler = new JSIde_Chain(cfg.code );
        return new JSIde_StringObject( handler + '', cfg );
    }
}));