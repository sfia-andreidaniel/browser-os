window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "hSlider",
    "name"  : "HSlider",
    "group" : "Inputs",
    "order" : 300,
    "requires": "placeable",
    "provides": "dom,event,customevent,chain",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKNJREFUeNrcUjsKAyEUfP4ut4ew3y29go2VZWysvIG384vxLQQSSOGyVfJAhhFm3shIxhhwZyjcnD8w4CGEx8T97c5JKY9lB+/9aK2NWuuJyLGZ1cNLKZBzht47MMYA+Uy12q3jKJ6bYSYAIcRptm3bkjrGuPOU0kck5PMZsJzgm4HWmizXOAXOGAOUUkBEfqVGgluVUq8qnbX2uGzw21/5KcAALEOPljlbhmsAAAAASUVORK5CYII=",
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
            "name": "step",
            "label": "Step",
            "type": "int",
            "value": 1,
            "minValue": 1
        },
        {
            "name": "disabled",
            "label": "Disabled",
            "type": "bool",
            "value": false
        },
        {
            "name": "readOnly",
            "label": "Read-Only",
            "type": "bool",
            "value": false
        },
        {
            "name": "style",
            "label": "Style",
            "type": "DOMStyle",
            "value": "top: 10px; left: 10px; position: absolute;"
        }
    ],
    "init": function( cfg, app ) {
        var btn = new HSlider( {
            "value": cfg.value,
            "minValue": cfg.minValue,
            "maxValue": cfg.maxValue,
            "step": cfg.step
        } );
        
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            btn.setAttribute('style', css );
        
        if ( anchors )
            btn.setAnchors( anchors );
        
        if ( cfg.disabled )
            btn.disabled = true;
        
        if ( cfg.readOnly)
            btn.readOnly = true;
        
        btn.addCustomEventListener('change', function() {
            app.currentItemProperties.values.value = btn.value;
        } );
        
        return btn;
    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a spinner!";
    },
    "compile": function( cfg, globalName, items ) {
        var out = '( new HSlider(' + JSON.stringify( {
            "value": cfg.value,
            "minValue": cfg.minValue,
            "maxValue": cfg.maxValue,
            "step": cfg.step
            } ) +  ') )';

        if ( cfg.disabled )
            out = out + '.setProperty("disabled", true)';

        if ( cfg.readOnly)
            out = out + '.setProperty("readOnly", true)';

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