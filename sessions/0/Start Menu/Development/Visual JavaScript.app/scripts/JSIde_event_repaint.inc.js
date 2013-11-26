function JSIde_Build( cfg, app, isRoot, recursionLevel ) {
    
    var root = JSIde_ComponentMappings[ cfg.type ].init( 
        cfg.cfg.chain( function() {
            if ( !this._id )
                this._id = cfg.id;
        } ),
        app,
        cfg.items,
        recursionLevel
    );
    
    var rootAsCode = null;
    
    if ( JSIde_ComponentMappings[ cfg.type ].compile && ( typeof cfg.compilable == 'undefined' || !!cfg.compilable ) ) {
        try {
            rootAsCode = JSIde_ComponentMappings[ cfg.type ].compile(
                cfg.cfg,
                'dlg',
                (function(){
                    if ( typeof cfg.items == 'undefined' )
                        return [];
                    return cfg.items;
                })()
            );
            
            rootAsCode.isRoot = !!isRoot;
            
        } catch (e) { 
            console.warn("Failed to compile component: " + e);
        }
    }
    
    if ( isRoot ) {
        app.rootNode = root;
        app.rootNodeAsCode = rootAsCode;
    }
    
    root.setAttribute('jside-id', cfg.id );
    
    if ( cfg.id == app.tree.selectedNode.nodeID )
        addStyle( root, 'jside-focus' );
    
    if ( typeof cfg.items != 'undefined' && ( typeof cfg.compilable == 'undefined' || !!cfg.compilable )  ) {
    
        var component;
    
        for ( var i=0,len=cfg.items.length; i<len; i++ ) {
        
            if ( ['event','customevent', 'chain_'].indexOf( cfg.items[i].type ) == -1 ) {
            
                try {
                    JSIde_ComponentMappings[ cfg.type ].add( 
                        root, 
                        component = JSIde_Build( cfg.items[i], app, false, recursionLevel + 1 ),
                        app, 
                        recursionLevel 
                    );
                    if ( rootAsCode )
                        rootAsCode.insert( component.getCode(), cfg.items[i] );
                } catch (e) { 
                    alert(e); 
                }
            
            } else {
                
                /* Events and CustomEvents are not attached in design mode */
                
                /*
                
                try {
                    
                    if ( cfg.items[i].type == 'event' ) {
                        ( new JSIde_EventHandler( 
                            cfg.items[i].cfg.event, 
                            cfg.items[i].cfg.code, 
                            cfg.items[i].cfg.useCapture 
                        ) ).chain( function() {
                            this.attach( root );
                        } );
                    }
                
                } catch (e) {
                    alert(e);
                }
                
                */

                component = JSIde_Build( cfg.items[i], app, false, recursionLevel + 1 );
                
                switch ( cfg.items[i].type ) {
                    case 'event':
                        rootAsCode.addEventListener( component.getCode(), cfg.items[i] );
                        break;
                    case 'customevent':
                        rootAsCode.addCustomEventListener( component.getCode(), cfg.items[i] );
                        break;
                    case 'chain_':
                        rootAsCode.registerChain( component.getCode(), cfg.items[i] );
                        break;
                }
                
            }
        }
        
    }
    
    root.getCode = function() {
        if ( rootAsCode )
            return rootAsCode;
        else
            return new JSIde_StringObject('', {});
    }
    
    return root;
}

function JSIde_event_repaint( app ) {
    
    var lastRoot = null;
    
    var noBlur = function(e) {
        cancelEvent(e);
    };
    
    app.addCustomEventListener('redraw', function() {
    
        JSIde_Code = [];
    
        var wnd = app.currentWindow;
        
        try {
            app.tabs.getSheets(0).querySelector('.DOM2Window').chain(function(){
                this.parentNode.removeChild( this ).purge();
            })
        } catch (e) {
            app.tabs.getSheets(0).innerHTML = '';
        }
        
        if (lastRoot) {
            if ( lastRoot.parentNode )
                lastRoot.parentNode.removeChild( lastRoot );
            lastRoot = null;
        }
        
        app.rootNode = null;
        app.rootNodeAsCode = null;
        
        if ( !wnd ) {
            app.code = '/** Cannot generate code from the Application root\nclick on a window then try again **/\n\n(function(){ alert("The \'application\' context cannot be executed!"); })';
            return true;
        }
        
        var activeElement = document.activeElement;
        
        activeElement.addEventListener('blur', noBlur, true);
    
        try {
            var root = JSIde_Build( wnd, app, true, 1 );
        } catch (e) {
            console.warn("Build error: ", e );
        }
        
        root.designMode = true;
        
        root.childOf = app.tabs.getSheets(0);
        
        activeElement.removeEventListener('blur', noBlur, true );
        
        root.DOManchors = {
            "dummy": function(w,h) {
                this.x = this.x;
                this.y = this.y;
                return 'd';
            }
        };
        
        root = null;
        delete root;
    
        app.paint();
        
        var before = '( function( superApp ) { ' +
                     '   var $namespace = {};\n\n' +
                     '   var $export = function( objectID, objectData ) { ' +
                     '        $namespace[ objectID ] = objectData;' +
                     '        return objectData; '+
                     '   };\n' +
                     '   var $import = function( objectID ) { ' +
                     '      return $namespace[ objectID ] || ( function() { throw "Namespace " + objectID + " is not defined (yet?)"; } )(); ' +
                     '   };\n' + 
                     '   var $pid = getUID();\n'+
                     '\n';
        

        var linksLines = [];
        
        var recursiveInsert = function( cfg ) {
            if ( typeof cfg.items != 'undefined' && ( typeof cfg.compilable == 'undefined' || !!cfg.compilable )) {
                for ( var i=0,n=cfg.items.length; i<n; i++ ) {
                        if ( !JSIDE_NotInserable.test(cfg.items[i].id) && ([ 'event','customevent' ].indexOf( cfg.items[i].type ) == -1 ) ) {
                            linksLines.push('$import(' + JSON.stringify( cfg.id ) + ').insert( $import(' + JSON.stringify( cfg.items[i].id ) + '));' );
                            recursiveInsert( cfg.items[i] );
                        }
                }
            }
        };
        
        try {
        recursiveInsert( wnd );
        } catch (e) {
            alert(e);
        }
        
        var after  = '\n\nsetTimeout( function() { dlg.paint(); dlg.ready(); }, 1 );\n\nreturn dlg; })';
        
        wnd = null;

        app.code = before + app.rootNodeAsCode + '\n\n' + linksLines.join('\n') + '\n\n' + after;
        
        return true;
    } );
}