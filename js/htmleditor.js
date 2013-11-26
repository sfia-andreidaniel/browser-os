/* A TinyMCE 4.0.x wrapper for JSPlatform.

    options can contain {
        
        "plugins"*: [
            "plugin1, plugin2, ... ",
            "pluginn, pluginx, pluginy"
        ],
        
        "content_css": [
            "css_file_1",
            "css_file_2",
            ...
        ]
    }
    
    properties of the resulting htmleditor object:
    
    .value       read, write    returns the html contents of the editor
    .document    read           returns the document element of the editor if the editor is loaded
    .body        read           returns the <body> element of the editor if the editor is loaded
    .window      read           returns the window object corresponding to editor if the editor is loaded
    .selection   read           returns the TinyMCE.Selection instance if the editor is loaded, false otherwise
    .loaded      read           returns true if the editor has been loaded
    .convertURL  read write     if the editor is loaded it will read or write the value from the editor, otherwise returns false or does nothing
    .undoManager read           returns the TinyMCE.UndoManager instance if the editor is loaded, false otherwise
    .nativeEditor read          returns the TinyMCE editor instance // for complex operations which are not covered by this wrapper

    methods of the resulting htmleditor object:
    
    .destroy()            // Destroys the editor. This must be done when not using the editor anymore ( eg. application will be closed )
    .addQueryStateHandler // see tinymce docs
    .addQueryValueHandler // see tinymce docs
    .queryCommandState    ( command )
    .queryCommandValue    ( command )
    .insertContent        ( htmlStringContent )
    .execCommand          ( command, ui, value, a )
    .on                   ( eventName*, eventCallback* )
    .off                  ( eventName*, eventCallback* )
    .fire                 ( eventName, eventObject )
    .addCommand           ( commandName, commandCallback, scope );

    event list that can be called via .on and .off methods:
    
        AddUndo
            Fires after an undo level has been added to the editor
        BeforeAddUndo
            Fires before an undo level is added to the editor
        BeforeExecCommand
            Fires before a execCommand call is made
        BeforeRenderUI
            Fires before the UI gets rendered
        BeforeSetContent
            Fires before contents is inserted into the editor
        ExecCommand
            Fires after a execCommand call has been made
        GetContent
            Fires after contents has been extracted from the editor
        LoadContent
            Fires after contents has been loaded into the editor
        NodeChange
            Fires when the selection is moved to a new location or is the DOM is updated by some command
        ObjectResizeStart
            Fires when a resize of an object like an image is about to start
        ObjectResized
            Fires after an object like an image is resized
        ObjectSelected
            Fires when an object is selected such as an image
        PostProcess
            Fires after the contents has been processed
        PreInit
            Fires before the editor has been initialized
        PreProcess
            Fires before the contents is processed
        ProgressState
            Fires when a progress event is made
        SaveContent
            Fires after contents has been saved/extracted from the editor
        SetAttrib
            Fires when attributes are updated on DOM elements
        activate
            Fires when the focus is moved from one editor to another editor
        blur
            Fires when the editor is blurred
        change
            Fires when contents is modified in the editor
        deactivate
            Fires when the focus is moved from one editor to another editor
        focus
            Fires when the editor gets focused
        hide
            Fires when the editor is hidden
        init
            Fires after the editor has been initialized
        redo
            Fires when an redo operation is executed
        remove
            Fires when the editor instance is removed
        reset
            Fires when the form containing the editor is resetted
        show
            Fires when the editor is shown
        submit
            Fires when the form containing the editor is submitted
        undo
            Fires when an undo operation is executed

 */

function HTMLEditor( value, options ) {
    
    var holder = $('div', 'HTMLEditor'),
        inject = holder.appendChild( $('div').setAttr('id', 'htmled_' + getUID() ) ),
        loaded = false,
        editor = null;
    
    Object.defineProperty( holder, 'value', {
        
        "get": function() {
            return loaded ? editor.getContent() : value;
        },
        
        "set": function( str ) {
            if ( !loaded )
                value = str;
            else
                editor.setContent( str );
        }
        
    } );
    
    Object.defineProperty( holder, 'loaded', {
        "get": function() {
            return !!loaded;
        }
    });
    
    Object.defineProperty( holder, 'nativeEditor', {
        "get": function() {
            return editor;
        }
    } );
    
    options = options || {};
    
    options.plugins = options.plugins || [ "advlist autolink lists image print preview",
        "visualblocks code fullscreen",
        "insertdatetime media table paste tabfocus" ];
    
    holder.addContextMenu( function( e ) {

        console.log( 'on: ', e );

        return [ {
            "caption": "here"
        } ];

    }, function(e) {
        if ( !e.fake )
            return false;
        return true;
    } );
    
    options.setup = function( ed ) {
        editor = ed;
        
        editor.on('init', function() {
            
            editor.setContent( value );
            
            editor.dom.doc.addEventListener( 'contextmenu', function( e ) {
                e.preventDefault();
                e.stopPropagation();
                
                holder._contextClickListener( ( function( e ) {
                
                    var hxy = getXY( holder ),
                        f = {
                            "x": e.x + hxy[0],
                            "y": e.y + hxy[1],
                            "clientX": e.clientX + hxy[0],
                            "clientY": e.clientY + hxy[1],
                            "layerX" : e.layerX + hxy[0],
                            "layerY" : e.layerY + hxy[1],
                            "target" : holder,
                            "fake"   : true,
                            "originalEvent": e
                        };
                        
                    // console.log( e, f, hxy );
                    
                    return f;
                    
                } )( e ) );
                
                // console.log( e );
            } );
            
            editor.dom.doc.addEventListener( 'mousedown', function( e ) {
                try {
                    holder._checkClickFunction( e );
                } catch (e ){
                }
            } );
            
            try {
            getOwnerWindow( holder ).paint();
            } catch (e) {}
            
            loaded = true;
            
            if ( options.onload && options.onload instanceof Function )
                options.onload();
            
        } );
    }

    options.menubar = false;
    options.content_css = options.content_css || [];
    options.width = options.width || 100;
    options.height= options.height|| 100;
    options.selector = '#' + inject.getAttribute('id');
    options.toolbar = false;
    
    var _anchors = {
        "_dummy": function( w,h ) {
            var ifr = holder.querySelector('iframe');
            
            if ( ifr ) {
                ifr.style.width = w + "px";
                ifr.style.height= h + "px";
            }
        }
    };
    
    Object.defineProperty( holder, "DOManchors", {
        "get": function() {
            return _anchors;
        },
        "set": function( o ) {
            o = o || {};
            
            for ( var key in _anchors ) {
                if ( key == '_dummy' )
                    continue;
                
                if ( _anchors.propertyIsEnumerable( key ) ) {
                    _anchors[ key ] = undefined;
                    delete _anchors[ key ];
                }
            }
            
            for ( var key in o ) {
                if ( key == '_dummy' )
                    continue;
                if ( o.propertyIsEnumerable( key ) )
                    _anchors[ key ] = o[ key ];
            }
        }
    } );
    
    setTimeout( function() {
        tinymce.init( options );
    }, 10 );
    
    holder.destroy = function() {
        if ( loaded )
            editor.remove();
        inject.innerHTML = '';
    };
    
    holder.queryCommandState = function( command ) {
        return !loaded ? false : editor.queryCommandState( command );
    }
    
    holder.queryCommandValue = function( command ) {
        return !loaded ? false : editor.queryCommandValue( command );
    }
    
    holder.insertContent = function( stringValue ) {
        if ( !loaded )
            value += stringValue;
        else
            editor.insertContent( stringValue );
    }
    
    Object.defineProperty( holder, "document", {
        "get": function() {
            return !loaded ? false : editor.getDoc();
        }
    } );
    
    Object.defineProperty( holder, "body", {
        "get": function() {
            return !loaded ? false : editor.getDoc().body;
        }
    } );
    
    Object.defineProperty( holder, "window", {
        "get": function() {
            return !loaded ? false : editor.getWin();
        }
    } );
    
    var oldFF = holder.focus;
    
    holder.focus = function() {
        if ( !loaded )
            oldFF();
        else
            editor.focus();
    }
    
    Object.defineProperty( holder, "selection", {
        "get": function() {
                if ( !loaded )
                    return false;
                else
                    return editor.selection;
        }
    } );
    
    holder.execCommand = function( command, ui, value, a ) {
        if ( !loaded )
            return undefined;
        else
            return editor.execCommand( command, ui, value, a );
    }
    
    holder.on = function( evtName, callbackFunction ) {
        if ( !loaded )
            return false;
        else
            return editor.on( evtName, callbackFunction );
    }
    
    holder.off = function( evtName, callbackFunction ) {
        if ( !loaded )
            return false;
        else
            return editor.off( evtName, callbackFunction );
    }
    
    holder.addQueryStateHandler = function( name, callback, scope ) {
        if ( !loaded )
            return false;
        else
            return editor.addQueryStateHandler( name, callback, scope );
    }
    
    holder.addQueryValueHandler = function( name, callback, scope ) {
        if ( !loaded )
            return false;
        else
            return editor.addQueryValueHandler( name, callback, scope );
    }
    
    holder.fire = function( ) {
        if ( loaded )
            editor.fire.apply( editor, Array.prototype.slice.call( arguments, 0 ) );
        else return false;
    }
    
    holder.addCommand = function( command, commandCallback, scope ) {
        if ( loaded )
            editor.addCommand( command, commandCallback, scope );
        else
            return false;
    }
    
    Object.defineProperty( holder, 'undoManager', {
        "get": function() {
            return loaded ? editor.undoManager : false;
        }
    } );
    
    Object.defineProperty( holder, "convertURL", {
        "get": function( ) {
            return loaded ? editor.convertURL : false;
        },
        "set": function( convertURLFunction ) {
            if ( loaded )
                editor.convertURL = true;
            else
                return false;
        }
    } );
    
    return holder;
    
}