window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "color",
    "name"  : "color",
    "group" : "PropertyGrids",
    "order" : 3,
    "requires": "propertygrid,propertygridgroup",
    "provides": "customevent,event,chain",
    "compilable": true,
    "icon": "data:image/gif;base64,R0lGODlhEAAQAOYAAP///yczPoGOmn+MmP91JlNdaHiEkKMxyOMeAMhY7klTXm96hQBZzYiVoAAfk/+cFD4+kQB14wA+rD/II2ZxfACD93WBjV1ncW13ggBJvXqIk//3AGx2gl9ocv/NAPcVAP/kAACcAP+3AB8fYklJtHLuP80NAGFrdHSCjigzP3IAnGl0f3J+iWNud4OQm3yJlV1lcHrvSwCK+Mxi7wB/5XaAiwArmf+7AP98MtAbAPghAOUuACsrankAoQBMsgBi0ABTwf/mAP+jJalAzP/4AAOhAExMmf/PAE3MM1NTuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAAQABAAQAe6gA0uAoSFhgIuDQArACUxJQAVMhUAGUAZiwAWAB86HwAiNyIAG0QbmgAXACRJJAAJMwkAKC8oqQAaACY5JgAEOAQAHkceuAALACFFIQAMPwwADjYOxwAtACM8IwAqPSoABTAF1gAKKQHo6eoBKQoAAwDx8vPy8AYACDsIAA9CDwAggoAAcI8FvYPxDGIAMAHJBAARaEQAIMGHBAALKSA8qPEEAAhGIAA4MOQAAA41OADw2GEjvZYuEQYCADs=",
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
            "value": "color"
        },
        {
            "name": "label",
            "label": "Label",
            "type": "varchar",
            "value": "var Color"
        },
        {
            "name": "value",
            "label": "Value",
            "value": "#ff0000",
            "type": "color"
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