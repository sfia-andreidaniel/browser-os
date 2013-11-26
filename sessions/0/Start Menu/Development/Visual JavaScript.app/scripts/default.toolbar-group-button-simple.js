window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "tlbutton",
    "name"  : "Toolbar Group Simple Button",
    "group" : "Menus",
    "order" : 4,
    "requires": "toolbargroup,toolbargroupbuttonmultiple",
    "provides": "toolbarbutton",
    "icon": "data:image/gif;base64,R0lGODlhEAAQAMIEAEVEPmFfV97byP//N////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAcALAAAAAAQABAAAAMrKLrcAjDKSauFI9+Y+wadtoXDB4pmqq4Q4QIEDL9T3EZ2fds5G/zAoDCQAAA7",
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
            "name": "caption",
            "label": "Caption",
            "type": "varchar",
            "value": "Button"
        },
        {
            "name": "id",
            "label": "Command",
            "type": "varchar",
            "value": ""
        },
        {
            "name": "icon",
            "label": "Icon",
            "type": "image",
            "minWidthHeight": "32x32",
            "value": ""
        }
    ],
    "init": function( cfg, app ) {
        return JSON.parse( JSON.stringify( cfg ) ).setProperty("setAttribute", function() {}).chain(function() {
            this.handler = function( ) {
                alert("Handler!");
            }
        });
    },
    "add": function( root, cfg ) {
    },
    "compile": function( cfg, globalName, items ) {
        return new JSIde_StringObject( '', {} );
    }

}, {
    
}));