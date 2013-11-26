window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "tlmbutton",
    "name"  : "Toolbar Group Multiple Button",
    "group" : "Menus",
    "order" : 4,
    "requires": "toolbargroup",
    "provides": "toolbargroupbuttonmultiple",
    "icon": "data:image/gif;base64,R0lGODlhEAAQAMIEAEVEPmFfV97byP//N////////////////yH5BAEKAAcALAAAAAAQABAAAAMvKLrcAjDKSasd2ErMAfkgEXGZF25kBFKdJGpwLGuraH/U66nVa0O62SRALBqPgQQAOw==",
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