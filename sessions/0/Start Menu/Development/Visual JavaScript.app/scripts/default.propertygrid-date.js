window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "datetime",
    "name"  : "datetime",
    "group" : "PropertyGrids",
    "order" : 3,
    "requires": "propertygrid,propertygridgroup",
    "provides": "customevent,event,chain",
    "compilable": true,
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB90CDhQiES5G7HwAAAGtSURBVDjLpVNNSxtRFD1TgjJb011mY6mZjVZcVm2lGggJSYQWTAwlIoqmf6BQ6K5QcOEH+QOC4weMHws1YbZmH8WZbPQ/qLt50QSOi/jGTEwWrQcu79x77oV773tPIQkA2Ds0CQCz32YUtEFqX5PTSm9Pr08LSHJ1fYVukFp7MQAoP3//Iv4RK3/+el0GhBB4DQLCdTsKwb4gxj6OQg+HfXG3LT8ghMD25hYA4Pt8zuOucFE5r2D/6MBX8Hn8k89/I9znEVr5abGIjUIBtzd3uK894L72gNubO2wUCjAP9p/3FkvE2Wqr62u0HZuxRJzbuzsk6Z2SxxJx2o5NksDE1BdPlHxhaZHpbOZFXCKdzXBhaZEkO4/gOFVEJiMdRwOAyGQEjlOVS3TxYWTYlyCEi3qj7vNljn1xiXqjDiGebuN9eMBrTfJkKsVkKsVuaNGBkKZ5guSWZTGkaTRN80WxaZoMaRotyyLJ5gjBt0Gv3f53/SiflTGXyyH/I4/jk2MMDQ41d1N1UCqVkF/OIxqNNp8zya5mGAZ1XaeqqlRVlbqu0zAMtuYo8jv/Lx4B3rFoGNVHrrAAAAAASUVORK5CYII=",
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
            "value": "date"
        },
        {
            "name": "label",
            "label": "Label",
            "type": "varchar",
            "value": "var Date"
        },
        {
            "name": "value",
            "label": "Value",
            "value": '',
            "type": "varchar"
        },
        {
            "name": "valueFormat",
            "label": "Value Format",
            "value": "%Y/%m/%d",
            "type": "varchar"
        },
        {
            "name": "displayFormat",
            "label": "Display Format",
            "value": "%Y/%m/%d",
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