window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "select",
    "name"  : "select",
    "group" : "PropertyGrids",
    "order" : 3,
    "requires": "propertygrid,propertygridgroup",
    "provides": "event,customevent,chain",
    "compilable": true,
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4UlEQVR4XqXPu2oCQRQG4H9lnieVhc8geYFg5SNIXsDaJ0iXwkKwEZIgKRQ7lRRpgpcUKknAXAob0V0ve/7sgeyChbth5oPDYWbgzH+80k3/HsAlUry8znDGA6IBjB3DkOtNwJ/Vmu/LFafzbz6PPnhRqTNffWTz6Y1Ku5713uBPKAI/OMDfHRBEfavl77GJKlZrT5Ie0xUIZbOCum31aKMzGLFYvmYOjowIoRrtIf7jqlg4HUBh8mDDkJkJUj8w4pxAJCVBZhr3BDmScGFIojscOwwQonHXw+fXAjY81xV+AZIOxfeaU+1iAAAAAElFTkSuQmCC",
    "renderProperty": "label",
    "properties": [
        {
            "name": "name",
            "label": "Name",
            "type": "varchar",
            "value": ""
        },
        {
            "name": "type",
            "label": "Type",
            "type": "Generic",
            "value": "dropdown"
        },
        {
            "name": "label",
            "label": "Label",
            "type": "varchar",
            "value": "var Select"
        },
        {
            "name": "value",
            "label": "Value",
            "value": "",
            "type": "varchar"
        },
        {
            "name" : "values",
            "label": "Possible Values",
            "value": "1;Option 1\n2;Option 2",
            "type" : "textarea"
        }
    ],
    "init": function( cfg, app, children, recursionLevel ) {
        return JSON.parse( JSON.stringify( cfg ) ).chain(function() {
            this.setAttribute = function() {
            }
        });
    },
    "add": function( root, cfg ) {
    },
    "compile": function( cfg ) {
        cfg.declaration = 'private';
        return new JSIde_StringObject('$import(' + JSON.stringify( cfg._id ) + ')', cfg );
    }
}));