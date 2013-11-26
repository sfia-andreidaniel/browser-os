window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "menuitem",
    "name"  : "Menu Item",
    "group" : "Menus",
    "order" : 2,
    "requires": "menugroup,menuitem",
    "provides": "menuitem",
    "icon": "data:image/gif;base64,R0lGODlhEAAQAMIDAICAgP9mZmuE9////////////////////yH5BAEKAAQALAAAAAAQABAAAAM3SLrcBDBK0MC4GFNmc96LJYykMIBK513oE7ww3AKBJ1d1dnNxP6+ayqBEOgmBRg4yGZpMHNBoAgA7",
    "compilable": false,
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
            "label": "Caption",
            "type": "varchar",
            "value": "Menu Item"
        },
        {
            "name": "id",
            "label": "Command",
            "value": "",
            "placeholder": "e.g: \"cmd_quit\"",
            "type": "varchar"
        },
        {
            "name": "icon",
            "label": "Icon",
            "value": "",
            "type": "image",
            "widthHeight": "16x16"
        },
        {
            "name": "shortcut",
            "label": "Shortcut Display",
            "value": "",
            "type": "varchar",
            "placeholder": "e.g: \"Alt + F\""
        },
        {
            "name": "input",
            "label": "Input Type",
            "value": "",
            "values": [
                {
                    "id": "",
                    "name": "None"
                },
                {
                    "id": "checkbox",
                    "name": "Checkbox"
                },
                {
                    "id": "radio",
                    "name": "Radio"
                }
            ],
            "type": "dropdown"
        },
        {
            "name": "enabled",
            "label": "Enabled",
            "type": "bool",
            "value": true
        }
    ],
    "init": function( cfg, app ) {
        return JSON.parse( JSON.stringify( cfg ) ).setProperty("setAttribute", function() {});
    },
    "add": function( root, cfg ) {
    },
    "compile": function( cfg, globalName, items ) {
        return new JSIde_StringObject( '', {} );
    }

}, {
    
}));