window.HTMLBase_CSS = ( function() {
    var css = ( $_GET( 'css/default/htmleditor-body.css' ) || '' );

    return function() {
        return css + '';
    }
    
} )();

function HTMLBase() {

    return $('div', 'HTMLEditor').chain(function(){
        
        var inner         = this.appendChild($('div', 'inner')),
            toolbar       = inner.appendChild( $('div', 'toolbar' ) ),
            body          = inner.appendChild( $('div', 'body') ),
            toolbarHeight = 0,
            bodyHeight    = 0,
            width         = 0,
            height        = 0,
            anchors       = {},
            selection     = window.getSelection(),
            range         = document.createRange(),
            css           = this.appendChild($('style')),
            editorID      = getUID(),
            editorInstance= this;
        
        var toolbars = ({}).chain( function() {

            this._registerToolbar = function( DOMNode, AsToolbarName, initialIsAttached ) {
                
                initialIsAttached = typeof initialIsAttached == 'undefined' ? true : !!initialIsAttached;

                var isVisible     = true;
                
                Object.defineProperty( this, AsToolbarName, {
                    
                    "get": function() {
                        
                        return ({}).chain( function() {
                            
                            Object.defineProperty( this, "visible", {
                                
                                "get": function() {
                                    return !!isVisible;
                                },
                                "set": function( b ) {
                                    DOMNode.style.display = !!b ? '' : 'none';
                                    editorInstance.onCustomEvent( 'resize' );
                                }

                            } );
                            
                            Object.defineProperty( this, "toolbar", {
                                "get": function() {
                                    return DOMNode;
                                }
                            } );
                            
                        } );
                        
                    },
                    "enumerable": true
                } );
            }
        });
        
        Object.defineProperty( this, "toolbars", {
            "get": function() {
                return toolbars;
            }
        } );
        
        body.undoManager = true;
        
        this.id = 'htmleditor_' + editorID;
        
        this.tabIndex = 0;
        
        var elements = {
            "block": [
                "DIV", "TD"
            ]
        }
        
        body.contentEditable = true;
        body.innerHTML = '';
        
        Object.defineProperty( this, 'isFocused', {
            "get": function() {
                return document.activeElement && ( document.activeElement == this || this.contains( document.activeElement ) );
            }
        } );
        
        Object.defineProperty( this, "toolbar", {
            "get": function() {
                return toolbar;
            },
            "set": function( x ) {
                // Ignore
            }
        } );
        
        Object.defineProperty( this, "body", {
            "get": function() {
                return body;
            },
            "set": function( x ) {
                // Ignore
            }
        } );
        
        Object.defineProperty( this, 'editorID', {
            "get": function() {
                return editorID;
            }
        } );
        
        Object.defineProperty( body, "height", {
            
            "get": function() {
                return bodyHeight;
            },
            "set": function(i) {
                if ( typeof i == 'number' ) {
                    toolbarHeight = height - ( bodyHeight = i );
                    anchors._intern( width, height );
                }
            }
            
        } );
        
        Object.defineProperty( toolbar, "height", {
            
            "get": function() {
                return toolbarHeight;
            },
            "set": function(i) {
                if ( typeof i == 'number' ) {
                    bodyHeight = height - ( toolbarHeight = i );
                    anchors._intern( width, height );
                }
            }
            
        } );
        
        Object.defineProperty( this, "selection", {
            
            "get": function() {
                return selection;
            },
            "set": function() {
                //Ignore
            }
            
        } );
        
        Object.defineProperty( this, "value", {
            "get": function() {
                return ( body.innerHTML + '' ).replace(
                    /<br>/g, '<br/>'
                );
            },
            "set": function( str ) {
                body.innerHTML = str || '<p><br /></p>';
                body.undoManager.clear();
                this.onCustomEvent('rescan-selection');
            }
        } );
        
        (function( ed ) {
            anchors._intern = function( w,h ) {
                setTimeout( function() {

                    var sizeChanged = width != ed.offsetWidth || height != ed.offsetHeight;
                    
                    width  = ed.offsetWidth || 0;
                    height = ed.offsetHeight || 0;
                    
                    bodyHeight = height - toolbarHeight;
                    
                    inner.style.height = height + "px";
                    body.style.height = bodyHeight - 10 + "px";
                    body.style.width  = width - 10 + "px";
                    toolbar.style.width = width + "px";
                    toolbar.style.height= toolbarHeight + "px";
                    
                    if ( sizeChanged )
                        ed.onCustomEvent( 'resize' );
                    
                }, 1 );
            }
        })( this );
        
        Object.defineProperty(this, "DOManchors", {
            "get": function() {
                return anchors;
            },
            "set": function(o) {
                o = o || {};
                for ( var key in anchors ) {
                    if ( key != "_intern" && anchors.propertyIsEnumerable( key ) ) {
                        delete anchors[ key ];
                    }
                }
                
                for ( var key in o ) {
                    if ( key != "_intern" && o.propertyIsEnumerable( key ) )
                        anchors[ key ] = o[ key ];
                }
            }
        });
        
        this.createDefaultElement = function( tagName ){
            return $( tagName || 'p' );
        }
        
        this.select = function( bool ) {
            if ( bool ) {
                if ( body.firstChild ) {
                    range.setStart( body.firstChild );
                    range.setEndAfter( body.lastChild );
                    selection.addRange( range );
                    return true;
                } else return false;
            } else {
                selection.collapseToEnd();
            }
        }
        
        
        Keyboard.bindKeyboardHandler( this, 'alt shift left', function() {
            selection.modify( 'extend', 'backward', 'word' );
        } );
        
        Keyboard.bindKeyboardHandler( this, 'alt shift right', function() {
            selection.modify( 'extend', 'forward', 'word' );
        });
        
        Keyboard.bindKeyboardHandler( this, 'ctrl up', function() {
            selection.modify( 'move', 'backward', 'paragraph' );
        } );
        
        Keyboard.bindKeyboardHandler( this, 'ctrl down', function() {
            selection.modify( 'move', 'forward', 'paragraph' );
        } );
        
        this.addEventListener( 'focus', function(e) {
            document.execCommand("DefaultParagraphSeparator", false, "p" );
        } );
        
        Keyboard.bindKeyboardHandler( this, 'enter', function() {
            document.execCommand( 'InsertParagraph', false, 'p' );
            if ( selection.focusNode && selection.focusNode.nodeName == 'DIV' 
                 && selection.focusNode.children.length == 1 
                 && selection.focusNode.children[0].nodeName == 'BR' 
            ) {
                var current = selection.focusNode;
                current.addAfter($('p')).nextSibling.appendChild($('br'));
                selection.modify( 'move', 'forward', 'paragraph' );
                current.parentNode.removeChild( current );
            }
        } );
        
        body.isRootElement = function( node ) {
            return node == body || ( elements.block.indexOf( node.nodeName ) >= 0 );
        }
        
        var handlers = {};
        
        this.addCommand = function( name, callback ) {
            console.log("Added command: ", name );
            handlers[ name ] = callback;
        }
        
        this.runHandler = function( commandName, args ) {
            if ( typeof handlers[ commandName ] == 'function' ) {
                return handlers[ commandName ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
            } else
                throw "Unknown editor command: " + commandName;
        }
        
        var editor = this;
        
        this.createToolbarGroupSeparator = function() {
            this.toolbar.appendChild( $('div', 'break' ) );
        }
        
        this.createToolbarGroup = function toolbarAdd( groupName ) {

                return toolbar.appendChild( $('div', 'group') ).chain( function() {

                    Object.defineProperty( this, "name", {
                        "get": function() {
                            return groupName;
                        }
                    } );
                    
                    Object.defineProperty( this, "visible", {
                        "get": function() {
                            return this.style.display == '';
                        },
                        "set": function( b ) {
                            b = !!b;
                            this.style.display = b ? '' : 'none';
                        }
                    } );
                    
                    this.addSeparator = function() {
                        return this.appendChild($('div', 'separator') );
                    }
                    
                    this.addPlaceholder = function( ) {
                        return this.appendChild( $('div', 'placeholder') );
                    }
                    
                    this.addButton = function butonAdd( buttonName, buttonCommand, buttonIcon ) {
                        
                        return ( function( group ) {
                            
                            return group.appendChild( $('div', 'button') ).chain( function() {
                                
                                var enabled = true;
                                
                                this.title = buttonName;
                                
                                Object.defineProperty( this, "enabled", {
                                    
                                    "get": function() {
                                        return enabled;
                                    },
                                    "set": function( b ) {
                                        ( !b ? addStyle : removeStyle )( b, 'disabled' );
                                        enabled = !!b;
                                    }
                                    
                                } );
                                
                                Object.defineProperty( this, "name", {
                                    
                                    "get": function() {
                                        return buttonName;
                                    }
                                    
                                } );
                                
                                Object.defineProperty( this, "command", {
                                    
                                    "get": function(){
                                        return buttonCommand;
                                    }
                                    
                                } );
                                
                                if ( buttonIcon )
                                    this.style.backgroundImage = 'url(' + buttonIcon + ')';
                                
                                if ( buttonCommand )
                                    this.onclick = function() {
                                        if ( enabled )
                                            editor.runHandler( buttonCommand );
                                    }
                                
                            } );
                            
                        } )( this );
                        
                    } 
                    
                } );
            };
    
        this.addCSS = function( cssText ) {
                
            if ( !cssText )
                return false;
            
            var cssID = getUID();
            
            try {
                var cssString = 
                    '/* CSS_BEGIN_' + cssID + ' */\n' +
                    ( new CSS_Modifier( cssText ) ).inject( '#htmleditor_' + editorID +' ' ) + 
                    '/* CSS_END_' + cssID + ' */';
            
            } catch( e ) {
                return false;
            }
            
            css.textContent += cssString;
            
            return cssID;
        }
        
        this.removeCSS = function( cssID ) {
            if ( cssID ) {
                var Reg = new RegExp( '\\/\\* CSS_BEGIN_' + cssID + ' \\*\\/([\\s\\S]+)\\/\\* CSS_END_' + cssID + ' \\*\\/', 'g' );
                css.textContent = (css.textContent + '').replace( Reg, '' );
            }
        }
        
        Object.defineProperty( this, "css", {
            "get": function() {
                return css.textContent;
            }
        });
        
        this.addCSS( HTMLBase_CSS() );
    });

}