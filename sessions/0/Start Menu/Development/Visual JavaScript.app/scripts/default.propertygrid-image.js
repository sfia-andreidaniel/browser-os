window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "image",
    "name"  : "image",
    "group" : "PropertyGrids",
    "order" : 3,
    "requires": "propertygrid,propertygridgroup",
    "provides": "event,customevent,chain",
    "compilable": true,
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGBQTFRF8vHtmpOGxOv9BFQk////G2Y+BVUlJm9Kv+f3BlYnlsfJpNLZLXRSEV4y0O/9wen6c6uhYp6Oveb1c6yi1fH+ib27u+Tzxev98Pr/dKyjodDWT495IGpDH2lD0/D+zO79G1OdlQAAAAF0Uk5TAEDm2GYAAABbSURBVHjaYmAgAzCiAJAAExTIsbCwoAiIoAuIS8AFpLiFwEJ88hABLllmYagqsIAALzMzsyA/kCsmChZgZQMKMEtzcEiysiMJsMnwMHMiC4AAVADdpYQAQIABAHZaAwgorvU8AAAAAElFTkSuQmCC",
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
            "value": "image"
        },
        {
            "name": "label",
            "label": "Label",
            "type": "varchar",
            "value": "var Image"
        },
        {
            "name": "value",
            "label": "Value",
            "value": "",
            "type": "varchar"
        },
        {
            "name": "widthHeight",
            "label": "Exact W x H",
            "value": "",
            "type": "varchar"
        },
        {
            "name": "minWidthHeight",
            "label": "Min W x H",
            "value": "16x16",
            "type": "varchar"
        },
        {
            "name": "maxWidthHeight",
            "label": "Max W x H",
            "value": "800x600",
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