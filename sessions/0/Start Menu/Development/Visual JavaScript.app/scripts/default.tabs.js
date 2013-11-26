window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "tabs",
    "name"  : "TabsPanel",
    "order" : 2,
    "group" : "Layout",
    "requires": "placeable",
    "provides": "tabs,event,customevent,dom,chain",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABpUlEQVQ4jZ1SvW3jYBSjDCWFAbdewEAWuDJZ4Xa4NLoV3F1S55INvEPiMQznUqkxXHoBG7L8J5Ipvh8l7X2NQOCRj+RTUVXVA4A/AGAJBtCRuL66yhgABoNBxpIeZ7PZAwCgqiqv12vbdtM03mw2/nV/7/l8/g0vl8tvGMAP2ygBYDKZYLFYwDYkwRJWqxXG43HGdV2j67qM0yutYDKRJUIUPv59YPn+DpGghNfXN0gEGWZu724rAL9LOQgEsiAZT3+fMBwOMRqN8qbtdovdbof9fo+2bTGdTquiKF5KO9ihBFOgibquIQoUQTK7oAR2DC5DjJvSFpqmgRXIifjVLiUwijiJxh5KyWjbNg73g1moi18SsnJUikGAIg6HQywvKAfLzKKSQCuLWYLp6IDC8Xjs7dI9mX2MEMUhahQMZ7RxOp5ibkPsootEdBa2CKZzMwqQwul8grN1xebDprQ5ndiKXTiXSJzPZ5BdLjC1HErte7AciDFKdnC5XAKZgWA7FtpvlpNA+Gtt9w6eX56D5S+b00lTaY5dCICtLFDYRlEUP/Gf7xPRWWGZOOP2xAAAAABJRU5ErkJggg==",
    "properties": [
        {
            "name": "name",
            "label": "Name",
            "type": "varchar",
            "value": ""
        },
        {
            "name": "_id",
            "label": "Tabs_ID",
            "type": "Generic",
            "value": null
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
            "name": "style",
            "label": "Style",
            "type": "DOMStyle",
            "value": "top: 10px; left: 10px; right: 10px; bottom: 10px; position: absolute"
        }
    ],
    "init": function( cfg, app, children, recursionLevel ) {
    
        var tabs = new TabPanel({"initTabs": (function() {
            
            if (!children)
                return [];
            
            var out = [];
            
            for ( var i=0,len=children.length; i<len; i++ ) {
                out.push( children[i].cfg );
            }
            
            return out;
            
        })()});
        
        for ( var i=0,len=tabs.sheets.length; i<len; i++ ) {
            ( function( sheet, index ) {
                sheet.setAttr('jside-id', children[ index ].cfg._id );
                
                sheet.parentNode.getTab().addEventListener('mouseup', function( e ) {
                    app.focusedID = children[ index ].cfg._id;
                    
                    for ( var i=0,len=app.application.length; i<len; i++ ) {
                        if ( app.application[i].id == cfg._id ) {
                            app.application[i].properties.focusedID = children[ index ].cfg._id;
                        }
                    }

                    setTimeout( function() {
                        app.tree.selectedNode = app.tree.findNode( children[ index ].cfg._id );
                    }, 30 );
                    
                    cancelEvent(e);
                    
                }, true );
            } )( tabs.getSheets(i), i );
        }
        
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            tabs.setAttr('style', css );
        
        if ( anchors )
            tabs.setAnchors( anchors );
        
        var restoreID = null;
        
        for ( var i=0, len=app.application.length; i<len; i++ )
            if ( app.application[i].id == cfg._id ) {
                if ( typeof app.application[i].properties.focusedID != 'undefined' ) {
                    restoreID = app.application[i].properties.focusedID;
                    break;
                }
            }
        
        if ( restoreID !== null ) {
            try {
                for ( var i=0, len=children.length; i<len; i++ ) {
                    if ( children[i].cfg._id == restoreID ) {
                        tabs.getSheets(i).parentNode.getTab().active = true;
                        break;
                    }
                }
            } catch (e) {}
        }
        
        return tabs;
    },
    "add": function( root, cfg, app ) {
    },
    "compile": function( cfg, globalName, items ) {
        
        var exportData = [];
        
        var strictlyTab = function(o) {
            return {
                "id": o.cfg._id,
                "caption": o.cfg.caption,
                "closeable": !!o.cfg.closeable
            };
        }
        
        var out = '( new TabPanel({"initTabs": ' + JSON.stringify(
            (function() {
            
            if (!items)
                return [];
            
            var out = [];
            
            for ( var i=0,len=items.length; i<len; i++ ) {
                out.push( strictlyTab( items[i] ) );
                exportData.push( '$export(' + JSON.stringify( items[i].cfg._id ) + ', this.getTabById(' + JSON.stringify( items[i].cfg._id ) + ').getSheet() );' );
            }
            
            return out;
            
        })() ) + '}) )';
        
        
        if ( exportData.length ) {
            out = out + '.chain( function() {';
            out = out + exportData.join(' ');
            out = out + '} )';
        }
        
        // console.log("ExportData: ", exportData );
        
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            out = out + '.setAttr("style", ' + JSON.stringify( css ) + ')';

        if ( anchors )
            out = out + '.setAnchors( ' + anchors + ' )';

        return new JSIde_StringObject( out, cfg );
    }
}));