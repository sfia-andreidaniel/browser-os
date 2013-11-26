window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "string",
    "name"  : "varchar",
    "group" : "PropertyGrids",
    "order" : 3,
    "requires": "propertygrid,propertygridgroup",
    "provides": "event,customevent,chain",
    "compilable": true,
    "icon": "data:image/gif;base64,R0lGODlhEAAQAPcAAAAAAAQEBAgICAwMDBAQEBQUFCAgICQkJCgoKDAwMDQ0NDg4OEBAQHh4eHx8fAAzmYCAgJCQkJeXl5iYmJ6enoWQp5Whu6Wlpaampri4uLm5uaSyzcDAwMfHx8jIyNTU1Nzc3N/f3+Dg4OHh4ebm5ujo6Onp6ezs7PDw8PT09Pf39/j4+Pz8/P39/f7+/v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAEAAQAAAIrQAfPNggkODAggJHqHgggQKHCxceRoTIoQIGEhsodCgRIgRHjx1LPNBg4gGHEi5Sqlz54EKIliFevDggAMAABh9kbnC5M6ZMmSkgIJBpsiQHEz9/sgBA1CXMFyccMDBQAADTFz17vkjQwIOIFS+uFi36gkAGFi9ATBDr1OULDwsCBFAQ4WpWt0nzjj25sq8LmA8qIDxI2AKFECMuaKDIeKJDFCpIfJwcsiOKFgEBADs=",
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
            "value": "varchar"
        },
        {
            "name": "label",
            "label": "Label",
            "type": "varchar",
            "value": "var String"
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