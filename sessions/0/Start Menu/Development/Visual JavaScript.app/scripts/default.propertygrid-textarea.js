window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "texta",
    "name"  : "textarea",
    "group" : "PropertyGrids",
    "order" : 3,
    "requires": "propertygrid,propertygridgroup",
    "provides": "event,customevent,chain",
    "compilable": true,
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACIklEQVQ4jaWTz0vTYRzHX5/5zemUtbnc3JxaWYR2UIJJUFCHiu51iwhD7cc95qEi6DDoH0gtpI4dq0NCggdvEQjSWChtYrQUqcTmLL57nk+HuZkSJPjcnufheT2f9/v9+YiqspclyWRyRkR6ASowEWGX4FUH6E2lUrv6bXh4mK5QK7q4Qk3fUdLpdMCpXN699wBEEMBaCwJqFWsNgodU6iF1bMB0hvaDHXx5O4u0OlQBN28MUCwWKZVKABhjsNaiqhhjWMt/4GzsB+65ayw8f4Mzl0dj7VuAkdEnAFgte6FqUWtR4NaVi8w+u0N9cD+N31/gXjqDO38Evi3giAgAgwPXKRaLqCrWWqy1GGNwC0t8fnkf74EgteFmVueyLNZGaevug+kFnIrbo2PjiIC1iqoiAmJ/kah5T2tbkH3hZlYyc3wNXOB3qYGWlhaALQlDg/2sr69X9bsbaxSmH1HXGMAJN/PzU46JxRjdkTBt0SYCgcB2wOjYOIiiCqgSdTMc9ixTH+pgbT6LL3GbwvwE8Xgcj8dDRXrVg0oFxhhEhNfjj3mVWeaydwnTc5Wu46doanqH4zgYY6q9UfVgZOwpHhF0M4WPuTwne07gPX2e2KFjRCIRACYnJwGYmpra4cFmCpUEgv5+vL4GXNfd1tZ+v59sNksikSCXy20BOjs7/9PI5RmJx+OEQiF8Pl/5LJlMzgC95ejkn4/+rmDHflX2Os5/AIWW+lpKVb08AAAAAElFTkSuQmCC",
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
            "value": "textarea"
        },
        {
            "name": "label",
            "label": "Label",
            "type": "varchar",
            "value": "var Textarea"
        },
        {
            "name": "value",
            "label": "Value",
            "value": "",
            "type": "textarea"
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