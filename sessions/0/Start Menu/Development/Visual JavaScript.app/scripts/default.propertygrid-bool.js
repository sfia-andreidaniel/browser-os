window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "bool",
    "name"  : "bool",
    "group" : "PropertyGrids",
    "order" : 3,
    "requires": "propertygrid,propertygridgroup",
    "provides": "customevent,event,chain",
    "compilable": true,
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAc9JREFUeNqkUz1IG2EYfu4uS+0gGS6iCZd0USqcZLND5+KQRZwaMrWLowXrIFUoVEUxIl3tmMHBOBk6OXXQxSG5//aSJiG4pFSQNrlL+l38voPEptU2kBeO++Ge93ne530+rtPpYJjiMWQFug+KogwkpVwrg+M4JOYSHHvnuiOwBrIs/xOsGios20T7Vxt20V59s7y2FRhUqmIosL4YiEUfwXEcNJvNzZX11/xAHhT0AnRLgyRFQTwCu2TDtEy0XDfda9BwGqh/q98LjkVj8DwPuqFD1TWm4MH+9nvHH+E4l30KasXVz++Qp2YQHg/74LyW74EJ8SirAcM0kFpIIR6PO/4asydHz1rt1mFIDCE4GsTH0xyqtapvmErnjkqUmTBmFTpl3n67A0EQbtdIwZ+otPD1j2uMiWN4PDmN84szCLwAKSJR2cSXzWbefZcG/4dt/PP5ZNN13Ye1yxoq1QqEgIDIRASiKNKpOtAoK5N9F7iXxBfJl43ZmScoV8uwbdt3umuYQa/0xt6d4L4osx+WFl+h9LUI67NJwZrfYG9r/17wX0lkd0IIMtkM2zFT1mfY70VTy/Wdhe4HVh8yByPUF0JX5f4vZNywx/lGgAEA4Qnsh8/UX+gAAAAASUVORK5CYII=",
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
            "value": "bool"
        },
        {
            "name": "label",
            "label": "Label",
            "type": "varchar",
            "value": "var Bool"
        },
        {
            "name": "value",
            "label": "Value",
            "value": false,
            "type": "bool"
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