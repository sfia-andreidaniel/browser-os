window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "drop",
    "name"  : "DropDown",
    "group" : "Inputs",
    "order" : 7,
    "requires": "placeable",
    "provides": "dom,event,customevent,chain",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXZJREFUeNqcU71Ow0AMdpITqtSFgQUhXoMlb1BAYsjIwBDxs3Tr1lZ5g04IlfIICCG16p4Bqex9gGwBhUqoUZvkkjbYphkS0RCw9MXn88X+bN8plmWdAsA+VJD1ep2z0zR1od1uX6UVZTKZpBgkXa1WrFut1qWKBkWCfr/PGbaBzsRxDEEQwGAwYO37PgjcVMhpmiYfKhMpJcMwDNbz+RxEcKifXI8+OUuSJECMftLkl9PXUWxZwyygEMIVWWMezvbg4vGtlAHRlsvlvaqqbNdqNaAeKGSYzx9VBgFhGOamIeR0PL69OW4UR1QUynp09zTMglB23sdmKFRjt9uFKIq2gs4UmVBJAp1cQqfTgb8KByAGtm3Df8TzvG8Guq7zuMpE07Sc7TgOLBYLUPHDPWg2m0xpGzZ3QaFmZz/zFFzXFdThXq/36xTw5onZbMYNzESp1+vn6DyoUjOyeEc2L7j0NwhoAjuIXWJT5UUjYkRET4PWXwIMAE+xV4wf+YY0AAAAAElFTkSuQmCC",
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
            "name": "disabled",
            "label": "Disabled",
            "type": "bool",
            "value": false
        },
        {
            "name": "size",
            "label": "Size",
            "type": "int",
            "min": 0,
            "value": 0
        },
        {
            "name": "multiple",
            "label": "Multiple",
            "type": "bool",
            "value": false
        },
        {
            "name": "items",
            "label": "Options",
            "type": "textarea",
            "value": "1;Option 1\n2;Option 2"
        },
        {
            "name": "style",
            "label": "Style",
            "type": "DOMStyle",
            "value": "top: 10px; left: 10px; position: absolute; margin: 0;"
        }
    ],
    "init": function( cfg, app ) {
        var btn = new DropDown( );
        
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            btn.setAttribute('style', css );
        
        if ( anchors )
            btn.setAnchors( anchors );
        
        if ( cfg.disabled )
            btn.disabled = true;
        
        if ( cfg.size )
            btn.size = cfg.size;
        
        if ( cfg.multiple )
            btn.multiple = cfg.multiple;
        
        if ( cfg.items ) {
            try {
            ( function( str ) {
                
                var lines = str.trim().split('\n');
                var items = [];

                for ( var i=0,len=lines.length; i<len; i++ ) {
                    ( function( line ) {

                        var delimiterPos = line.indexOf( ';' );

                        if ( delimiterPos == -1 )
                            return;

                        var id = line.substr(0, delimiterPos);
                        var name= line.substr(delimiterPos+1);

                        items.push({
                            "id": id,
                            "name": name
                        });

                    } )( lines[i] );
                }

                if ( items.length )
                    btn.setItems( items );

            } )( cfg.items );
            } catch (e){}
        }
        
        if ( cfg.value )
            btn.value = cfg.value;
        
        btn.addEventListener('change', function(e){
            app.currentItemProperties.values.value = btn.value;
        }, true);
        
        return btn;
    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a textbox!";
    },
    "compile": function( cfg, globalName, items ) {
        var out = '( new DropDown(' + JSON.stringify( cfg.caption ) +  ') )';

        if ( cfg.disabled )
            out = out + '.setProperty("disabled", true)';
        
        if ( cfg.size )
            out = out + '.setProperty("size", ' + JSON.stringify( cfg.size ) + ')';
        
        if ( cfg.multiple )
            out = out + '.setProperty("multiple", true)';

        if ( cfg.items ) {
            try {
            ( function( str ) {
                
                var lines = str.trim().split('\n');
                var items = [];
                
                for ( var i=0,len=lines.length; i<len; i++ ) {
                    ( function( line ) {
                        
                        var delimiterPos = line.indexOf( ';' );

                        if ( delimiterPos == -1 )
                            return;
                        
                        var id = line.substr(0, delimiterPos);
                        var name= line.substr(delimiterPos+1);
                        
                        items.push({
                            "id": id,
                            "name": name
                        });
                        
                    } )( lines[i] );
                }
                
                if ( items.length )
                    out = out + '.setItems(' + JSON.stringify( items ) + ')';
            } )( cfg.items );
            } catch (e){}
        }

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