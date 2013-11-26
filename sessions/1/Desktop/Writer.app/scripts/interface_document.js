function DocumentEditor_interface_document( app ) {
    
    app.split.cells(0).insert(
        app.tabs = new TabPanel()
    ).setAnchors({
        "width": function(w,h) {
            return w - 12 + "px";
        },
        "height": function(w,h) {
            return h - 14 + "px";
        }
    }).setAttr(
        'style', 'margin: 10px 4px 4px 4px'
    );
    
    app.tabs.addCustomEventListener('tab-close', function( tab ) {

        tab.editor.destroy();

        console.log("Close-tab: ", tab._id );

        return true;
    } );
    
    app.createDocument = function( ) {
    
        var tabID = 'doc-' + getUID();
        
        console.log( 'tabID: ', tabID );
        
        var tab = app.tabs.addTab({
            "caption": "New Document",
            "closeable": true,
            "id": tabID
        }).getTab();
        
        tab.active = true;
        
        tab.editor = tab.getSheet().insert(
            new HTMLEditor('', {
                "onload": function() {
                    
                    Keyboard.bindKeyboardHandler( tab.editor.body, "ctrl f", function() {
                        app.appHandler( 'cmd_find' );
                    } );
                    
                }
            })
        ).setAnchors({
            "width": function(w,h){
                return w + "px";
            },
            "height": function(w,h) {
                return h + "px";
            }
        });
        
        ( function() {
            
            var documentTitle  = '';
            var documentPath   = '';
            var documentAuthor = $_SESSION.UNAME || '';
            
            Object.defineProperty( tab, "docTitle", {
                "get": function() {
                    return documentTitle;
                },
                "set": function( str ) {
                    documentTitle = ( str || '' );
                    tab.caption = !documentTitle ? ( documentPath || 'Document' ) : ( documentTitle.length > 20 ? documentTitle.substr( 0, 20 ) + '...' : documentTitle );
                }
            } );
            
            Object.defineProperty( tab, "documentPath", {
                "get": function() {
                    return documentPath;
                },
                "set": function( str ) {
                    documentPath = str || '';
                }
            } );
            
            Object.defineProperty( tab, "documentAuthor", {
                "get": function() {
                    return documentAuthor;
                },
                "set": function( s ) {
                    documentAuthor = s || $_SESSION.UNAME;
                }
            } );
            
        })();
        
        return tab;
    
    }
    
    Object.defineProperty( app, "documents", {
        "get": function() {
            return app.tabs.tabs;
        }
    } );
    
    Object.defineProperty( app, "activeDocument", {
        "get": function() {
            for ( var i=0, len=app.tabs.tabs.length; i<len; i++ ) {
                if ( app.tabs.tabs[i].active )
                    return app.tabs.tabs[i];
            }
            return null;
        }
    } );
    
}