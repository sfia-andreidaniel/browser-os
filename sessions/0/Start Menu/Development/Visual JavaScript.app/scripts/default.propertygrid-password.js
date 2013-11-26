window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "pwd",
    "name"  : "password",
    "group" : "PropertyGrids",
    "order" : 3,
    "requires": "propertygrid,propertygridgroup",
    "provides": "event,customevent,chain",
    "compilable": true,
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAI9JREFUeNrskz0KAyEUhMdFRG9p6wmsrKy8QLYVL+kfYjQQ2CIbWLdIk2kceMznY0TSe8cdbbip3wNoCOExTrWY32mtVUkpcbVMQgi894qWUjAgiDFeAgghMLM054zWGqy1r4HWGs65j/4oxhhmdkspLRc4s/QNON5w5r8COOdrG4widmPM8jOS/1/AU4ABAOZATLPXa1GAAAAAAElFTkSuQmCC",
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
            "value": "password"
        },
        {
            "name": "label",
            "label": "Label",
            "type": "varchar",
            "value": "var Password"
        },
        {
            "name": "value",
            "label": "Value",
            "value": "",
            "type": "varchar"
        },
        {
            "name": "placeholder",
            "label": "Placeholder",
            "value": "",
            "type": "varchar"
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