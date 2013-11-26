window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "grCol",
    "name"  : "Grid Column",
    "group" : "Grids",
    "order" : 2,
    "requires": "grid",
    "provides": "nothing",
    "compilable": false,
    "icon": "data:image/gif;base64,R0lGODlhEAAQAOYAAG56jvj7/3d/iHiAh/j8/+n3/+z4/+v3/u/5//f8/+/5/vv9/t/1/+v4/tTy/tPx/d71/+P3/+T3//f8/vr9/vv+/oGGgYKGgYKFgYKFgI2NeY2MeZiTcqGZbKCYbKCZbJiTc6ecaKGYbKGYbW9lPWpiP29lPvnGKfvLK3ZoPPfAJIhyNX9sOH9tOHdoO/e6IJh6MZB2MpB1M4hxNvWzG518L5h5MfOsF++eDvKlEu6YCeuOAu2SBqVlFaRjFqRiFqJfF6JcGIxZJ6FZGaBWGp5TG51QHZxNHptLH5pJH5pHIP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEsALAAAAAAQABAAAAeagEuCg4SFhoeGSklIR0ZFRENBQD8+PYNCOzw6ODk3NC8qJyiWgoqMjpCSlKRLNQ4PDyGwsbM1gzUPBQUhuru9toIwIh4ixSMeHx4dHTaDMhAGDSAHBgYc1AYxgysMCAgbCgoIGuEIM4MtFxjr6xYZFxcZLIMpERMEAgkJEwMB+i6DSEiosAAAhYMAKhw0MaiEw4cQHyKaSNFQIAA7",
    "renderProperty": "caption",
    "properties": [
        {
            "name": "name",
            "label": "Name",
            "type": "Generic",
            "value": ""
        },
        {
            "name": "declaration",
            "label": "Scope",
            "type": "Generic",
            "value": "private"
        },
        {
            "name": "caption",
            "label": "Caption",
            "type": "varchar",
            "value": "Column"
        },
        {
            "name": "width",
            "label": "Width",
            "type": "int",
            "value": 80,
            "min": 10
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
    "compile": function() {
        return new JSIde_StringObject('', {});
    }
}));