window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "int",
    "name"  : "int",
    "group" : "PropertyGrids",
    "order" : 3,
    "requires": "propertygrid,propertygridgroup",
    "provides": "event,customevent,chain",
    "compilable": true,
    "icon": "data:image/gif;base64,R0lGODlhEAAQAPcAAAAAAAwMDBAQEBoaGhwcHCAgICMjIyQkJCwsLDAwMDg4ODw8PEBAQEhISExMTFBQUFhYWFxcXGBgYGxsbHBwcAAzmYiIiJSUlJeXl56enoWQp5Whu6CgoKWlpaampqenp6ioqLCwsLm5uaSyzcDAwMTExMfHx9DQ0Nzc3N/f3+Hh4ebm5ujo6Onp6fDw8Pf39/j4+Pz8/P39/f7+/v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAEAAQAAAIvQArVBghkODAggJVvKiAIQOJDh0eRoRIQoOHFSMymGCRIgWLCSJYlDDAooKIFhVIsKDB0kUElg4uzKjQIQXNFCxpWEBBI8SBGDRG1BSKkwYMBBIkEODAMiVKEi0QAJhKlYAAGjdv0mCxYGWCBzmJEqVBgQQNEABO5HSacgBVqgEUNK158wRYGgzUhh1aE4LaEg1yNoWakkWBGTMofEDMOKsGhAcjb8iQQkUHERQzT3To4sUKjh47ggbtQkZAAAA7",
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
            "value": "int"
        },
        {
            "name": "label",
            "label": "Label",
            "type": "varchar",
            "value": "var Int"
        },
        {
            "name": "value",
            "label": "Value",
            "value": 0,
            "type": "int"
        },
        {
            "name": "min",
            "label": "Min Value",
            "value": 0,
            "type": "int"
        },
        {
            "name": "max",
            "label": "Max Value",
            "value": 32767,
            "type": "int"
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