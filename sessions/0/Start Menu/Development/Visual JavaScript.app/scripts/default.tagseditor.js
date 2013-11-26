window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "tags",
    "name"  : "TagsEditor",
    "group" : "Inputs",
    "order" : 8,
    "requires": "placeable",
    "provides": "event,customevent,dom,chain",
    "icon": "data:image/gif;base64,R0lGODlhEAAQAMQAAP///zhrnlGEt1qNwGaZzG6h1HGk13yv4oK16I7B9JHE95TH+pnM/8Da88Pf+sjf9s/k+NPm+drr+97u/+Xy/u72//X6//7+/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAQABAAAAVhICCOZDkyaGqSzOVe1LKKy+UozjUls2IpAJ9FwjMlLI6Ew8KMIIwSJvMwqDhNiEiFciAcBBXIwXR4UATdQ4DyMJgM5gA1MGmv4JMAvVGYAQoNExN8fiKADQSFIwSJio6PIQA7",
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
            "type": "varchar",
            "value": ""
        },
        {
            "name": "sticky",
            "label": "Sticky Values",
            "type": "varchar",
            "value": ""
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
            "value": "top: 10px; left: 10px; right: 10px; position: absolute; margin: 0; height: 30px;"
        }
    ],
    "init": function( cfg, app ) {
        var btn = new TagsEditor( cfg.value.split(','), cfg.fields(['sticky']).chain( function(){ 
            this.sticky = this.sticky ? this.sticky.split(',') : []
        }) );
        
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
        
        return btn;
    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a textbox!";
    },
    "compile": function( cfg, globalName, items ) {
    
        var out = '( new TagsEditor(' + JSON.stringify( cfg.value.split(',') ) + ',' + JSON.stringify( cfg.fields(['sticky']).chain( function(){
            this.sticky = this.sticky ? this.sticky.split(',') : [];
        }) ) + ') )';
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;

        if ( css.trim() )
            out = out.concat( '.setAttr("style", ' + JSON.stringify( css ) + ')' );

        if ( cfg.disabled )
            out = out.concat( '.setProperty("disabled", true)' );

        if ( cfg.readOnly )
            out = out.concat( '.setProperty("readOnly", true)' );

        if ( anchors )
            out = out.concat( '.setAnchors(' + anchors + ')' );

        return new JSIde_StringObject( out, cfg );
    }

}));