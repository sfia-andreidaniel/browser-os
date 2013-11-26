window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "img",
    "name"  : "Image",
    "order" : 6,
    "group" : "Inputs",
    "requires": "placeable",
    "provides": "event,customevent,dom,chain",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGBQTFRF8vHtmpOGxOv9BFQk////G2Y+BVUlJm9Kv+f3BlYnlsfJpNLZLXRSEV4y0O/9wen6c6uhYp6Oveb1c6yi1fH+ib27u+Tzxev98Pr/dKyjodDWT495IGpDH2lD0/D+zO79G1OdlQAAAAF0Uk5TAEDm2GYAAABbSURBVHjaYmAgAzCiAJAAExTIsbCwoAiIoAuIS8AFpLiFwEJ88hABLllmYagqsIAALzMzsyA/kCsmChZgZQMKMEtzcEiysiMJsMnwMHMiC4AAVADdpYQAQIABAHZaAwgorvU8AAAAAElFTkSuQmCC",
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
            "name": "src",
            "label": "Source",
            "type": "image",
            "value": ""
        },
        {
            "name": "displayMode",
            "label": "Display Mode",
            "type": "dropdown",
            "values": [
                {
                    "id": "normal",
                    "name": "Normal"
                },
                {
                    "id": "best",
                    "name": "Best Fit"
                },
                {
                    "id": "tiles",
                    "name": "Tiled"
                },
                {
                    "id": "stretch",
                    "name": "Stretch"
                }
            ],
            "value": "best"
        },
        {
            "name": "style",
            "label": "Style",
            "type": "DOMStyle",
            "value": "top: 10px; left: 10px; width: 32px; height: 32px; position: absolute;"
        }
    ],
    "init": function( cfg, app ) {
        var btn = new DOMImage( { "src": cfg.src, "displayMode": cfg.displayMode } );
        
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            btn.setAttr('style', css );
        
        if ( anchors )
            btn.setAnchors( anchors );
        
        return btn;
    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a textbox!";
    },
    "compile": function( cfg, globalName, items ) {
        var out = '( new DOMImage(' + JSON.stringify( { "src": cfg.src, "displayMode": cfg.displayMode } ) + ') )';
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;

        if ( css.trim() )
            out = out.concat( '.setAttr("style", ' + JSON.stringify( css ) + ')' );

        if ( anchors )
            out = out.concat( '.setAnchors(' + anchors + ')' );

        return new JSIde_StringObject( out, cfg );
    }
}));