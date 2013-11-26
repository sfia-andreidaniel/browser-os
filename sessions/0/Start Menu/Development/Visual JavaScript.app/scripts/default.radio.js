window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "radio",
    "name"  : "Radio",
    "group" : "Inputs",
    "order" : 2,
    "requires": "placeable",
    "provides": "event,customevent,dom,chain",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIxJREFUeNpiYMAECUC8H4j/o+H9UDmcQAGIz2PRiI7PQ9ViaH6PxTYHKEZ31Xt0Q5BtxufMBDSXYAji9SMu9fuRnA0DAmhO3g8VgwEUPdhsxxUL2FwBZzggKcAVAzDgABNjQhL8QIT/MaIP2QADJPYBLJpBYg+wGURxIFIcjRQnJKokZYozE9nZGSDAAESPcxkhrNRKAAAAAElFTkSuQmCC",
    "properties": [
        {
            "name": "name",
            "label": "Name",
            "type": "varchar",
            "value": ""
        },
        {
            "name": "groupName",
            "label": "GroupName",
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
            "name": "disabled",
            "label": "Disabled",
            "type": "bool",
            "value": false
        },
        {
            "name": "readOnly",
            "label": "Readonly",
            "type": "bool",
            "value": false
        },
        {
            "name": "checked",
            "label": "Checked",
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
        var btn = $('input').setAttr('type', 'radio').setAttr('name', cfg.groupName);

        btn.addEventListener('click', function(){
            app.currentItemProperties.values.checked = btn.checked;
        }, false);

        if ( cfg.readOnly )
            btn.readOnly = true;

        if ( cfg.disabled )
            btn.disabled = true;
        
        btn.checked = cfg.checked;
        
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
        throw "Cannot add something inside a checkbox!";
    },
    "compile": function( cfg, globalName, items ) {
        var out = '$("input").setAttr("type", "radio").setAttr("name", ' + JSON.stringify( cfg.groupName ) + ')';
        if ( cfg.readOnly )
            out = out + '.setProperty("readOnly", true)';
        if ( cfg.disabled )
            out = out + '.setProperty("disabled", true)';
        if ( cfg.checked )
            out = out + '.setProperty("checked", true)';

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