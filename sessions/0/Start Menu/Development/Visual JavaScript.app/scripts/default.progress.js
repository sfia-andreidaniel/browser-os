window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "progress",
    "name"  : "ProgressBar",
    "group" : "Inputs",
    "order" : 4,
    "requires": "placeable",
    "provides": "dom,event,customevent,chain",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABl0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuODc7gF0AAABdSURBVDhPY2AYBQzv378vbGho+E8OBullAGm8d+/ef1IBUDPYUrABIMAwBYLlF/7/b7/u///43f//15/8/3/+tf//9z/BbvxwMuD58+ekhuF/kB5wGFAcjaNZgQEAPlSf6bKgMy8AAAAASUVORK5CYII=",
    "properties": [
        {
            "name": "name",
            "label": "Name",
            "type": "varchar",
            "value": ""
        },
        {
            "name": "declaration",
            "label": "Scope",
            "type": "dropdown",
            "value": "private",
            "values": [
                {
                    "id": "public",
                    "name": "Public"
                },
                {
                    "id": "protected",
                    "name": "Protected"
                },
                {
                    "id": "private",
                    "name": "Private"
                }
            ]
        },
        {
            "name": "value",
            "label": "Value",
            "type": "int",
            "value": 0
        },
        {
            "name": "minValue",
            "label": "Min Value",
            "type": "int",
            "value": 0
        },
        {
            "name": "maxValue",
            "label": "Max Value",
            "type": "int",
            "value": 100
        },
        {
            "name": "captionFormat",
            "label": "Caption Format",
            "type": "varchar",
            "value": "/v (min: /min, max: /max)"
        },
        {
            "name": "style",
            "label": "Style",
            "type": "DOMStyle",
            "value": "top: 10px; left: 10px; position: absolute; height: 16px;"
        }
    ],
    "init": function( cfg, app ) {
        var btn = new ProgressBar( {
            "value": cfg.value,
            "minValue": cfg.minValue,
            "maxValue": cfg.maxValue,
            "captionFormat": cfg.captionFormat
        } );
        
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            btn.setAttribute('style', css );
        
        if ( anchors )
            btn.setAnchors( anchors );
        
        return btn;
    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a spinner!";
    },
    "compile": function( cfg, globalName, items ) {
        var out = '( new ProgressBar(' + JSON.stringify( {
            "value": cfg.value,
            "minValue": cfg.minValue,
            "maxValue": cfg.maxValue,
            "captionFormat": cfg.captionFormat
            } ) +  ') )';

        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        if ( css.trim() )
            out = out + '.setAttr("style", ' + JSON.stringify( css ) + ' )';
        var anchors = parser.anchors;
        if ( anchors )
            out = out + '.setAnchors(' + anchors + ')';

        return new JSIde_StringObject( out, cfg );
    }

}));