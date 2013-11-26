function HTMLEditor( value ) {
    
    return ( new HTMLBase() ).chain( function() {
        
        var editorInstance = this,
            fixContainer = $('div'),
            caretPosition = 0,
            monitorCaret = true;
        
        HTMLEditor_toolbars( this );
        HTMLEditor_keyboard( this );
        
        this.undo = function() {
            return this.body.undoManager.undo();
        }
        
        this.redo = function() {
            return this.body.undoManager.redo();
        }
        
        this.execCommand = function( otherNodesCallback ) {
            if ( !this.isFocused || !arguments.length )
                return false;
            
            var execReturn = arguments.length > 1 
                ? document.execCommand.apply( document, Array.prototype.slice.call( arguments, 1 ) )
                : true;
            
            if ( !otherNodesCallback || !this.selection.otherNodes )
                return execReturn;
            
            try {
                var clonedRange = this.selection.getRangeAt(0).cloneRange();
            } catch (e) {
                clonedRange = null;
            }
            
            var all = [];
                
            for ( var i=0,len=this.selection.otherNodes.length; i<len; i++ )
                all.push( this.selection.otherNodes[i] );
                
            for ( var i=0, len=all.length; i<len; i++ )
                otherNodesCallback( all[i] );
            
            all = [];
            
            try {
                if ( clonedRange !== null )
                    this.selection.addRange( clonedRange );
            } catch (e) { }
            
            return execReturn;
        };
        
        // Bold
        this.addCommand( 'bold', function() {
            if ( this.isFocused ) {
                document.execCommand( 'styleWithCSS', false, 'false' );
                document.execCommand( 'bold' );
                this.body.undoManager.add( 'bold text' );
            }
        });
        
        // Italic
        this.addCommand( 'italic', function() {
            if ( this.isFocused ) {
                document.execCommand( 'styleWithCSS', false, 'false' );
                document.execCommand( 'italic' );
                this.body.undoManager.add( 'italic text' );
            }
        } );
        
        // Underline
        this.addCommand( 'underline', function() {
            if ( this.isFocused ) {
                document.execCommand( 'styleWithCSS', false, 'false' );
                document.execCommand( 'underline' );
                this.body.undoManager.add( 'underline text' );
            }
        });
        
        this.addCommand( 'justify-left', function() {
            if ( this.isFocused ) {
                document.execCommand( 'justifyleft' );
                this.body.undoManager.add( 'justify left' );
            }
        });
        
        this.addCommand( 'justify-center', function() {
            if ( this.isFocused ) {
                document.execCommand( 'justifycenter' );
                this.body.undoManager.add( 'justify center' );
            }
        });
        
        this.addCommand( 'justify-right', function() {
            if ( this.isFocused ) {
                document.execCommand( 'justifyright' );
                this.body.undoManager.add( 'justify right' );
            }
        } );
        
        this.addCommand( 'justify-full', function() {
            if ( this.isFocused ) {
                document.execCommand( 'justifyfull' );
                this.body.undoManager.add( 'justify full' );
            }
        });
        
        this.addCommand( 'indent', function() {
            if ( this.isFocused ) {
                document.execCommand( 'indent' );
                this.htmlFix();
                this.body.undoManager.add( 'indent' );
            }
        } );
        
        this.addCommand( 'outdent', function() {
            if ( this.isFocused ) {
                document.execCommand( 'outdent' );
                this.htmlFix();
                this.body.undoManager.add( 'outdent' );
            }
        } );
        
        this.addCommand( 'undo', function() {
            this.undo();
        });
        
        this.addCommand( 'redo', function() {
            this.redo();
        } );
        
        this.addCommand( 'list-bull', function() {
            if ( this.isFocused ) {
                document.execCommand( 'insertUnorderedList' );
                this.htmlFix();
                this.body.undoManager.add( 'toggle list bull' );
            }
        });
        
        this.addCommand( 'list-num', function() {
            if ( this.isFocused ) {
                document.execCommand( 'insertOrderedList' );
                this.htmlFix();
                this.body.undoManager.add( 'toggle list num' );
            }
        });
        
        this.addCommand( 'color', function( color ) {
            if ( this.isFocused ) {
                document.execCommand( 'styleWithCSS', false, 'true' );
                document.execCommand( 'foreColor', false, color ? color : 'inherit' );
                this.htmlFix();
                this.body.undoManager.add( 'set text color' );
            }
        } );
        
        this.addCommand( 'bgcolor', function( color ) {
            if ( this.isFocused ) {
                document.execCommand( 'styleWithCSS', false, 'true' );
                document.execCommand( 'backColor', false, color ? color : 'inherit' );
                this.htmlFix();
                this.body.undoManager.add( 'set background color' );
            }
        } );
        
        this.addCommand( 'font-size', function( size ) {
            if ( this.isFocused ) {
                this.body.undoManager.add( 'font size' );
                document.execCommand( 'styleWithCSS', false, 'true' );
                document.execCommand( 'fontSize', false, size ? size : '2' );
                this.htmlFix();
            }
        } );
        
        this.addCommand( 'increase-font', function( ) {
            this.runHandler( 'font-size', '+1' );
        } );

        this.addCommand( 'decrease-font', function( ) {
            this.runHandler( 'font-size', '-1' );
        } );
        
        this.addCommand( 'font-family', function( fontFamily ) {
            if ( this.isFocused ) {
                document.execCommand( 'styleWithCSS', false, 'true' );
                document.execCommand( 'fontName', false, fontFamily ? fontFamily : 'inherit' );
                this.htmlFix();
                this.body.undoManager.add( 'font family' );
            }
        } );
        
        this.addCommand( 'format-block', function( blockTagName ) {
            if ( this.isFocused ) {
                document.execCommand( 'formatBlock', false, blockTagName || 'p' );
                this.htmlFix();
                this.body.undoManager.add( 'format block' );
            }
        } );
        
        this.addCommand( 'superscript', function() {
            if ( this.isFocused ) {
                document.execCommand( 'styleWithCSS', false, 'false' );
                document.execCommand( 'superscript' );
                this.body.undoManager.add( 'superscript' );
            }
        });
        
        this.addCommand( 'subscript', function() {
            if ( this.isFocused ) {
                document.execCommand( 'styleWithCSS', false, 'false' );
                document.execCommand( 'subscript' );
                this.body.undoManager.add( 'subscript' );
            }
        } );
        
        this.addCommand( 'insert-table', function( cols, rows ) {
        
            cols = parseInt( cols || '1');
            rows = parseInt( rows || '1');
            
            if ( cols < 1 )
                cols = 1;
            
            if ( rows < 1 )
                rows = 1;
            
            if ( !this.isFocused )
                this.body.focus();
            
            var theTable = $('table').chain( function() {
                
                for ( var i=0; i<rows; i++ ) {
                    this.insertRow(-1).chain( function() {
                        for ( var j=0; j<cols; j++ ) {
                            this.insertCell( -1 ).setHTML('<p><br /></p>');
                        }
                    } );
                }
                
                this.setAttribute('data-editing','yes');

                ( function( tbl ) {
                    setTimeout( function() {
                        tbl.editable = true;
                    }, 100 );
                })( this );
                
            } );
            
            var insertAfter = this.selection.anchorNode;
            
            if ( insertAfter != this.body && this.body.contains( insertAfter ) ) {
            
                while ( ! /^div|p|td|ul|ol$/i.test( insertAfter.nodeName ) ) {
                    if ( insertAfter.parentNode == this.body )
                        break;
                    insertAfter = insertAfter.parentNode;
                }
            
                insertAfter.addAfter( theTable );
            } else {
                this.body.appendChild( theTable );
            }
            
            this.body.undoManager.add( 'insert table' );
        } );
        
        this.addCommand( 'td-bgcolor', function( color ) {
            
            this.execCommand( function( td ) {
                
                if ( td.nodeName == 'TD' ) {
                    td.style.backgroundColor = color ? color : '';
                }
                
            } );
            
        } );
        
        this.addCommand( 'table_align_top', function() {
            
            this.execCommand( function( node ) {
                if ( node.nodeName == 'TD' )
                    node.style.verticalAlign = 'top';
            } );
            
            this.body.undoManager.add( 'vertical text align' );
            
        } );

        this.addCommand( 'table_align_middle', function() {
            
            this.execCommand( function( node ) {
                
                if ( node.nodeName == 'TD' ) {
                    node.style.verticalAlign = 'middle';
                }
            } );
            
            this.body.undoManager.add( 'vertical text align' );
                
        } );

        this.addCommand( 'table_align_bottom', function() {
            
            
            this.execCommand( function( node ) {
                if ( node.nodeName == 'TD' ) {
                    node.style.verticalAlign = 'bottom';
                }
            } );
            
            this.body.undoManager.add( 'vertical text align' );
        } );
        
        this.addCommand( 'table_insert_row_above', function() {
            
            var row;
            
            if ( row = this.carretInsideOfA(/^tr$/i) ) {
                row.addSiblingRow('before');
                this.body.undoManager.add( 'table insert row above' );
            } /* else {
                // inform user that he should be in the context of a row to execute this command
            } */
            
        } );
        
        this.addCommand( 'table_insert_row_below', function() {
            
            var row;
            
            if ( row = this.carretInsideOfA( /^tr$/i ) ) {
                row.addSiblingRow( 'after' );
                this.body.undoManager.add( 'table insert row below' );
            } /* else {
                // inform user that he should be in the context of a row to execute this command
            } */
            
        } );
        
        this.addCommand( 'table_delete_row', function() {
            
            var row, table;
            
            if ( table = this.carretInsideOfA( /^table$/i ) ) {
                if ( row = this.carretInsideOfA( /^tr$/i ) ) {

                    if ( table.rows.length > 1 ) {

                        var focusRow;

                        if ( focusRow = row.nextSibling || row.previousSibling ) {
                            // try to focus a sibling row
                            focusRow.setCaretPosition( 0 );
                        }
                        
                        row.removeFromParent();
                        this.body.undoManager.add( 'table insert row below' );
                    } else {
                        
                        var focusItem;
                        
                        if ( focusItem = table.nextSibling || table.previousSibling ) {
                            focusItem.setCaretPosition( 0 );
                        }
                        
                        table.removeFromParent();
                        this.body.undoManager.add( 'table insert row below' );
                    }
                }
            }
        
        } );
        
        this.addCommand( 'table_distribute_rows_evenly', function() {
            
            if (!this.isFocused)
                return;
            
            var rows = [];
            
            this.execCommand( function( node ) {
                if ( node.nodeName == 'TR' )
                    rows.push( node );
            } );
            
            if ( !rows.length )
                return;

            var heightSum = 0;
            
            for ( var i=0,len=rows.length; i<len; i++ ) {
                heightSum += rows[i].offsetHeight;
            }
            
            heightSum /= rows.length;
            
            var targetTable = null,
                cursor = rows[0].parentNode;
            
            while ( cursor.nodeName != 'TABLE' && cursor.nodeName != 'BODY' )
                cursor = cursor.parentNode;
            
            if ( cursor.nodeName != 'TABLE' )
                return;
            
            var tableRowHeights = cursor.getRowHeights();
            
            for ( var i=0, len=tableRowHeights.length; i<len; i++ ) {
                for ( var j=0, n = rows.length; j<n; j++ ) {
                    if ( cursor.rows[ i ] == rows[j] ) {
                        tableRowHeights[i] = heightSum >> 0;
                        break;
                    }
                }
            }
            
            cursor.setRowHeights( tableRowHeights );
            
            this.body.undoManager.add( 'table distribute rows evenly' );
            
        } );
        
        this.carretInsideOfA = function( tagNameRegularExpression ) {
            if ( !this.isFocused )
                return false;
                
            var currentNode = this.selection.anchorNode;
                
            while ( currentNode != this.body ) {
                if ( currentNode.nodeName.match( tagNameRegularExpression ) ) {
                    return currentNode;
                }
                currentNode = currentNode.parentNode;
            }
            
            return false;
        }
        
        this.htmlFix = function() {
            
            this.body.normalize();
            
            if ( !this.body.innerHTML.trim() ) {
                var p = this.body.appendChild( $('p').setHTML('<br />') ),
                    range = document.createRange();

                range.setStartBefore( p.firstChild );
                range.setStartAfter( p.firstChild );
                this.selection.addRange( range );
                this.selection.collapseToStart();
                return;
            }
        
            // a root element ( td, li, ol, div ) can contain a direct text element only if
            // the direct parent element of the root element is another root element
            
            var p, k, numChilds, wasSelected, node, restart, style;
            
            for ( var items = ( this.body.querySelectorAll( 'p h1, p h2, p h3, p h4, p h5, p h6, p div, p table' ) || [] ), len = items.length, i = len - 1; i>=0; i-- ) {
                items[i].firstParent( /^p$/i ).addAfter( items[i] );
            }
                
            while ( true ) {
                restart = false;
            
                for ( var i=0, items = [ this.body ].merge( this.body.getElementsByTagName( '*' ) || [] ), n = items.length; i<n; i++ ) {
                    
                    // Paragraphs that are not direct child of root elements are discarded
                    if ( items[ i ].nodeName.match( /^p$/i ) && 
                         items[i].parentNode
                        ) {
                        if ( items[i].childNodes.length == 0 )
                            items[i].parentNode.removeChild( items[i] );
                        else
                        if ( !items[i].parentNode.nodeName.match( /^(td|li|ol|div)$/i ) ) {
                            // p2 in p1 <=> p2 after p1
                            if ( items[i].parentNode && items[i].parentNode.nodeName.match( /^p$/i ) ) {
                                items[i].parentNode.addAfter( items[i] );
                                restart = true;
                            } else {
                                // p2 in !p <=> p ... [ p2 content without p2 tag ] ... /p
                                while ( numChilds = items[i].childNodes.length ) {
                                    items[i].addBefore( items[i].childNodes[0] );
                                    items[i].addBefore( $text(' ') );
                                }
                                items[i].parentNode.removeChild( items[i] );
                                restart = true;
                                continue;
                            }
                        }
                    }
                        
                    // Span elements that have only the style attribute, are discarded
                    else 
                    
                    if ( items[ i ].nodeName.match( /^span$/i ) && 
                         ( ( items[i].attributes.length == 1 &&
                         items[i].attributes[0].name == 'style' ) ||
                         !items[i].attributes.length ) 
                    ) {
                        var preserveBG = items[i].style.backgroundColor,
                            preserveFG = items[i].style.color,
                            preserveFont = items[i].style.fontFamily,
                            preserveFontSize = items[i].style.fontSize,
                            needed = false;
                                
                        if ( [ 'transparent', 'auto', 'inherit' ].indexOf( preserveBG ) >= 0 ||
                             /^rgb/i.test( preserveBG ) 
                        ) {
                            preserveBG = '';
                            items[i].style.backgroundColor = '';
                        }
                        
                        if ( [ 'transparent', 'auto', 'inherit' ].indexOf( preserveFG ) >= 0 ) {
                            preserveFG = '';
                            items[i].style.color = '';
                        }
                        
                        if ( [ 'inherit' ].indexOf( preserveFont ) >= 0 ) {
                            preserveFont = '';
                            items[i].style.fontFamily = '';
                        }
                        
                        if ( [ 'inherit', 'small' ].indexOf( preserveFontSize ) >= 0 ) {
                            preserveFontSize = '';
                            items[i].style.fontSize = '';
                        }
                            
                        switch ( true ) {
                            case /^([a-z]+|\#[\da-f]+)$/i.test( preserveBG ):
                                needed = true;
                                break;
                            case /^([a-z]+|\#[\da-f]+)$/i.test( preserveFG ):
                                needed = true;
                                break;
                            case /^[\S]/.test( preserveFont ):
                                needed = true;
                                break;
                            case /^[a-z\d]/.test( preserveFontSize ):
                                needed = true;
                                break;
                        }
                        
                        if ( !needed ) {
                            while ( numChilds = items[i].childNodes.length )
                                items[i].addBefore( items[i].childNodes[0] );
                            
                            items[i].parentNode.removeChild( items[i] );
                            restart = true;
                            continue;
                        }
                    }               

                    
                    else
                    
                    // text nodes that are direct children of root elements are wrapped in paragraphs
                    if ( items[i].nodeName.match( /td|li|ol|div/i ) && 
                         items[i].parentNode && 
                         this.body.parentNode.contains( items[i].parentNode )/* && 
                             ( /* items[i].parentNode.nodeName != 'DIV' && items[i] ||  items[i] == editor.body ) */
                    ) {
                        for ( var j=0, numChilds = items[i].childNodes.length; j<numChilds; j++ ) {
                            if ( items[i].childNodes[j].nodeName.match( /^(pre|code|span|strong|\#text|img|video)$/i ) ) {
                                p = items[i].childNodes[j].addBefore( $('p') ).previousSibling;
                            
                                while ( j < numChilds && items[i].childNodes[ j + 1 ].nodeName.match( /^(pre|code|span|strong|\#text|img|video)$/i ) ) {
                                    wasSelected = this.selection.extentNode == items[i].childNodes[ j + 1 ];
                                    node = p.appendChild( items[i].childNodes[j+1] );
                                    if ( wasSelected )
                                        this.selection.modify( "move", "forward", "paragraph" );
                                    k++;
                                    numChilds --;
                                }
                                
                                restart = true;
                                continue;
                            }
                        }
                    }
                    
                    else

                    // breaks ...
                    if ( items[i].nodeName.match( /br/i ) && items[i].parentNode && items[i].parentNode.nodeName.match(/(li|ol)/i) ) {
                        if ( !items[i].nextSibling ) {
                            items[i].parentNode.removeChild( items[i] );
                            restart = true;
                        }
                    }
                        
                    if ( style = items[i].getAttribute('style') || '' ) {
                        if ( style.indexOf( 'background-color: rgb(' ) >= 0  )
                            items[i].style.backgroundColor = '';

                        if ( style.indexOf( 'font-size: 12px' ) >= 0 )
                                items[i].style.fontSize = '';
                    }
                        
                    // divs in divs
                    if ( items[i].parentNode ) {
                        for ( k=items[i].childNodes.length - 1; k>=0; k-- )
                            if ( items[i].childNodes[k].nodeName == '#comment') {
                                items[i].removeChild( items[i].childNodes[k] );
                                restart = true;
                            }
                    }
                
                } // end big for
                    
                if ( !restart )
                    break;
            } // end big while
                
        };
        
        this.addCommand( 'insertHTML', function( htmlString, safeInsert ) {
            
            this.focus();
            
            safeInsert = typeof safeInsert == 'undefined' ? true : !!safeInsert;

            fixContainer.innerHTML = htmlString;
                
            if ( safeInsert ) {
                
                var nodeName;
                
                // Remove scripts, styles, 
                for ( var i=0, nodes = fixContainer.querySelectorAll('*'), len = nodes.length; i<len; i++ ) {
                    
                    nodeName = nodes[i].nodeName.toUpperCase();
                    
                    if ( [ 'SCRIPT', 'STYLE', 'LINK', 'HEAD', 'OBJECT', 'EMBED', 'META' ].indexOf( nodeName ) >= 0 ) {
                        if ( nodes[i].parentNode )
                            nodes[i].parentNode.removeChild( nodes[i] );
                    } else
                    if ( nodeName != '#TEXT' ) {
                        // Remove all nodes attributes
                        var attrs = nodes[i].attributes;
                        for ( var a = attrs.length - 1; a >= 0; a-- ) {
                            if ( /^(on|style|color|font|bg|data|id|class|title)/i.test( attrs[a].name ) )
                                nodes[i].removeAttribute( attrs[a].name );
                        }
                    }
                }
            }
            
            this.pasteHTMLAtCaret( fixContainer.innerHTML );
        });
        
        this.body.onpaste = function(e) {
            try {
                var str = e.clipboardData.getData('text/html') || '';
                if ( str )
                    editorInstance.runHandler( 'insertHTML', str, true );
            } catch (e) { console.log("Can't paste: " + e ); }
                
            editorInstance.body.undoManager.add( 'paste' );
            
            e.preventDefault();
        };
        
        HTMLEditor_contexts( this );
        
        /* Register selection monitor */
        
        var selectionMonitor = function() {
            
            if (!monitorCaret )
                return true;
            
            try {
                if ( editorInstance.body.contains( editorInstance.selection.anchorNode ) ||
                     editorInstance.body == editorInstance.selection.anchorNode 
                ) caretPosition = editorInstance.selection.getCaretOffsetRelativeTo( editorInstance.body );
            } catch (e) {}
            
            return true;
        }
        
        document.body.addCustomEventListener( 'selection-changed', selectionMonitor );
        
        /* Register generic contexts */
        HTMLEditor_context_picture( this );
        HTMLEditor_context_video( this );
        
        
        this.destroy = function() {
            this.onCustomEvent('destroy');
            document.body.removeCustomEventListener( 'selection-changed', selectionMonitor );
        }
        
        this.pasteHTMLAtCaret = function(html) {
            
            editorInstance.body.focus();
                
            setTimeout( function() {
            
                var sel = editorInstance.selection, range;
                    
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    
                    var savedRange = range.cloneRange();
                    
                    var frag = range.createContextualFragment( html );
                    
                    range.insertNode( frag );
                    
                    sel.addRange( range );
                    
                    sel.collapseToEnd();
                }
                
            }, 50 );
        }
        
        if ( value )
            this.value = value;
        
        setTimeout( function() {
            editorInstance.htmlFix();
        }, 20 );
        
    });
    
}


