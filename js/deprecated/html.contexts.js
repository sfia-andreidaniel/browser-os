/* HTML Rich text editor contexts implementation */

/* Abstract 
    
    A context is a DOM node in the rich text editor, which is treated, together
    with it's all child nodes as a whole.
    
    The context is recognized via a CSS selector, e.g. if you want to implement
    a context called video player, which is living inside of a root div element,
    you should recognize it via a for example div.video-player css selector
    
    A context should implement these properties:
    
    - isReadOnly - if, when the carret is inside of it should put the rich text editor
      in a temporary read-only mode

    - parserPriority. We'll need the parser order priority in order to avoid
      false context interpretations of the child nodes from this context. For example,
      if you implement a video player with a div element as a root node, you wouldn't want
      that the buttons inside of it to be implemented as stand alone buttons.
    
    - parserDetector - a function which should receive as parameters a DOM node and return true
      if that node is the context root node.
    
    - an optional context editor function, which should receive the context DOM node as input (optionally),
      and an editor instance as the second argument
    
    - a context name ( e.g.: Video Player )
     
    - optional, a whenEnterContext(DOMNode) function that will be executed on the DOM node
      when the node is entering in specified context

    - optional, a whenExitContext(DOMNode) function that will be executed on the DOM node
      when the node is exiting from the specified context
 */

function HTMLEditor_contexts( editor ) {
    
    return editor.chain( function() {
        
        var contexts = [],
            editorInstance = this,
            XPath = [],
            focusedContexts = [];
        
        
        Object.defineProperty( this, "contexts", {
            
            "get": function() {
                return contexts;
            }
            
        } );
        
        this.addContext = function( contextObject ) {
            
            if ( !( contextObject instanceof Object ) )
                throw "the addContext method should receive an object as it's first argument!";
            
            if ( typeof contextObject.parserDetector != 'function' )
                throw "the contextObject should implement a parserDetector function!";
            
            if ( typeof contextObject.name == 'undefined' )
                throw "please provide a context name";
            else
                contextObject.name = contextObject.name + ''; // cast always as string
            
            if ( typeof contextObject.icon != 'undefined' )
                contextObject.icon = contextObject.icon + ''; // cast always as string
            
            contextObject.isReadOnly = typeof contextObject.isReadOnly == 'undefined' 
                ? false 
                : !!contextObject.isReadOnly;

            contextObject.parserPriority = typeof contextObject.parserPriority == 'undefined'
                ? 100
                : (
                    ( isNaN( parseInt( contextObject.parserPriority ) ) ||
                      parseInt( contextObject.parserPriority ) < 0 ||
                      parseInt( contextObject.parserPriority ) > 100 )
                            ? ( function() { throw "The context parserPriority should be an int >= 0 <= 100"; } )()
                            : parseInt( contextObject.parserPriority )
                );
            
            contextObject.objectTypeID = !!!contextObject.objectTypeID ? 'context-' + getUID() : contextObject.objectTypeID.toString();
            
            contextObject.addToObjectsToolbar = typeof contextObject.addToObjectsToolbar == 'undefined' 
                ? false
                : !!contextObject.addToObjectsToolbar
            
            for ( var i=0,len=contexts.length; i<len; i++ )
                if ( contexts[i].objectTypeID == contextObject.objectTypeID ) {
                    console.warn( "Cannot add a context more than once ( duplicate objectTypeID: ", contextObject.objectTypeID , ")" );
                    return;
                }
            
            if ( contextObject.addToObjectsToolbar && contextObject.icon ) {
                
                this.toolbars.Objects.toolbar.addButton("Create a new " + contextObject.name, "", contextObject.icon ).chain( function() {
                    this.onclick = function() {
                        editorInstance.runHandler( "edit_object", contextObject.objectTypeID );
                    };
                } );
            
            }
            
            contexts.push( contextObject );
            
            contexts.sort( function(a,b) {
                return a.parserPriority - b.parserPriority;
            } );
            
            console.log( "Added context: ", contextObject.objectTypeID );
        
        }
    
        this.addCommand( 'edit_object', function( objectTypeID, forceCreateNew, optionalArguments ) {
        
            forceCreateNew = typeof forceCreateNew == 'undefined' ? false : !!forceCreateNew;

            var tryEdit = null, 
                ctx = this.getContextByID( objectTypeID );
            
            if ( !ctx )
                throw "A context with id=" + objectTypeID + " is not registered!";

            if ( typeof ctx.contextEditor != 'function' )
                return false;

            if ( focusedContexts.length && !forceCreateNew ) {
                // try to detect the top-most context node which 
                // has a context id matching with the object type id
                for ( var i=focusedContexts.length-1; i>=0; i-- ) {
                    
                    if ( focusedContexts[i].recognizedContexts.indexOf( objectTypeID ) ) {
                        tryEdit = focusedContexts[i];
                        break;
                    }
                    
                }
            }
            
            ctx.contextEditor( tryEdit ? tryEdit : undefined, forceCreateNew, editorInstance, optionalArguments );
        });
    
        this.getContextByID = function( contextID ) {
            // console.log( "get context: ", contextID, " from ", contexts.length, " contexts" );
            // console.log( contexts );
            for ( var i=0,len=contexts.length; i<len; i++ ) {
                if ( contexts[i].objectTypeID == contextID ) {
                    return contexts[i];
                }
            }
            return null;
        }
    
        Object.defineProperty( this, "xPath", {
            "get": function() {
                return XPath;
            }
        } );
    
        var lastPathNode = null;
    
        var onSelectionChange = function( event, optionalNode ) {
        
            if ( !editorInstance.isFocused || !editorInstance.selection.isCollapsed )
                return;
            
            editorInstance.chain( function() {
                
                // create XPath
                XPath = [];
                
                var cursor = ( optionalNode || ( this.selection.otherNodes || [] )[0] || this.selection.anchorNode );
                
                console.log( "Cursor: ", cursor );
                
                if ( cursor == lastPathNode )
                    return;
                
                lastPathNode = cursor;
                
                while ( cursor && cursor.parentNode ) {
                    if ( cursor.parentNode == this.body.parentNode )
                        break;
                    XPath.push( cursor );
                    cursor = cursor.parentNode;
                }
                
                XPath = XPath.reverse();
                
                this.onCustomEvent( "path-changed" );
                
            } );
            
        }
    
        this.addCustomEventListener( 'rescan-selection', function() {
            onSelectionChange();
        } );
        
        this.addCustomEventListener( "path-changed", function() {
            console.log( this.xPath );

            // when the path changes, we automatically determine the active contexts
            
            var currentContexts = [], 
                breakChain = false,
                ctx = null;
            
            for ( var i=0, n=contexts.length; i<n; i++ ) {
                
                for ( var j=0, m = XPath.length; j<m; j++ ) {

                    // context recognized
                    if ( contexts[i].parserDetector( XPath[ j ] ) ) {
                        currentContexts.push( XPath[ j ].chain( function() {
                            this.recognizedContexts = this.recognizedContexts || [];
                            this.recognizedContexts.push( contexts[i].objectTypeID );
                            this.recognizedContexts = this.recognizedContexts.unique();
                        }));
                    }
                    
                    if ( breakChain )
                        break;
                }
                
                if ( breakChain )
                    break;
            }
            
            // console.log("Current contexts: ", currentContexts, focusedContexts );
            
            // console.log("intersect: ", currentContexts.intersect( focusedContexts ), currentContexts.length );
            
            // detect contexts changing
            if ( currentContexts.intersect( focusedContexts ).length != currentContexts.length ||
                 focusedContexts.length != currentContexts.length
               ) {
            
                // console.log( "contexts changed!");
                // Execute the whenExitContext for nodes that exited their contexts
                
                for ( var i=0, len = focusedContexts.length; i<len; i++ ) {
                    if ( currentContexts.indexOf( focusedContexts[i] ) == -1 ) {
                        // console.log( "Node: ", focusedContexts[i], " has left context mode" );
                        // console.log( "recognized contexts: ", focusedContexts[i].recognizedContexts );
                        
                        // execute the whenExitContext hook of the registered contexts of the node
                        
                        for ( var x=0, n = focusedContexts[i].recognizedContexts.length; x<n; x++ ) {
                            // console.log( "<", focusedContexts[i].recognizedContexts[x] );
                            if ( ctx = this.getContextByID( focusedContexts[i].recognizedContexts[x] ) ) {
                                if ( typeof ctx.whenExitContext == 'function' ) {
                                    ctx.whenExitContext( focusedContexts[i] );
                                }
                            }
                        }
                        
                    }
                }
                
                for ( var i=0, len = currentContexts.length; i<len; i++ ) {
                    if ( focusedContexts.indexOf( currentContexts[i] ) == -1 ) {
                        // console.log( "Node: ", currentContexts[i], " has entered context mode" );
                        // console.log( "recognized contexts: ", currentContexts[i].recognizedContexts );
                        
                        // execute the whenEnterContext hook of the registered contexts of the node
                        for ( var x=0, n = currentContexts[i].recognizedContexts.length; x<n; x++ ) {
                            // console.log( ">", currentContexts[i].recognizedContexts[x] );
                            if ( ctx = this.getContextByID( currentContexts[i].recognizedContexts[x] ) ) {
                                if ( typeof ctx.whenEnterContext == 'function' ) {
                                    ctx.whenEnterContext( currentContexts[i] );
                                }
                            }
                        }
                    }
                }
                
                focusedContexts = currentContexts;
                
                //console.log( "Context affected nodes: ", this.contextAffectedNodes );
                
                this.onCustomEvent( "contexts-changed");
            }
            
            return true;
        } );
        
        Object.defineProperty( this, "contextAffectedNodes", {
            "get": function( ) {
                return focusedContexts;
            }
        } );
    
        window.addEventListener('selectionchange', onSelectionChange, true );

        var contextMouseDownActivator = function(e) {
            if ( e.which ) {
                onSelectionChange( e, e.target );
            }
        };
        
        var contextMouseDoubleClickExecuter = function(e) {
            console.log("Context double click executer!");
            
            if (!focusedContexts.length) {
                console.log( "No focused contexts!");
                return;
            }
            
            // Execute the edit handler of the top-mode context
            focusedContexts.last().chain(function(){
                var ctx;
                for ( var i=0, len=this.recognizedContexts.length; i<len; i++ ) {
                    if ( ctx = editorInstance.getContextByID( this.recognizedContexts[i] ) ) {
                        if ( typeof ctx.contextEditor == 'function' ) {
                            ctx.contextEditor( this, editorInstance, e );
                            
                            e.preventDefault();
                            e.stopPropagation();
                            
                            return;
                        }
                    }
                }
            });
            
        }

        this.body.addEventListener( 'mouseup', contextMouseDownActivator, true );
        this.body.addEventListener( 'dblclick', contextMouseDoubleClickExecuter, false );
        
        this.addCustomEventListener( 'destroy', function() {
            window.removeEventListener( 'selectionchange', onSelectionChange, true );
            editorInstance.body.removeEventListener( 'mouseup', contextMouseDownActivator, true );
            editorInstance.body.removeEventListener( 'doubleclick', contextMouseDoubleClickExecuter, false );
        } );
        
        this.addEventListener('mousedown', function() {
            this.focus();
        }, true );
    
    } );
    
}