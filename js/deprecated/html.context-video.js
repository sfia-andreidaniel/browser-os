function HTMLEditor_context_video( editor ) {
    
    editor.addContext({
        "name": "Video",
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALawAAC2sBAA3gSgAAAAd0SU1FB90FFwokGIhJuSEAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA2UlEQVQ4y52TwU7DMBBE30aV4IYKlXrjH7jyc5n8ISfoF/TApRIScBwOsY2dJiV0pWi80cx41paDxVIH3KVmL/GW1u+S9pm1mRFu0+JR4iX/7fsegIj4rNkxEd9KfM+IToUhHSQ9Twx+hZUoc07APRdm3UqyjW0MGPhifekBaAwk/YXH2mA3JrBHo3WYRqPL5xAR2F6Fksr2XfoYjddjbdBeZSy3McTZCZYEhW0X1aSdrTZBZpe4TbtocDHBzFRNbc4SVDjd2b2XDYZh4JrKb+EG9PpP7Qfw9APV9Jvgm9qjqAAAAABJRU5ErkJggg==",
        "objectTypeID": 'Video',
        "isReadOnly": true,
        "isNotSelectable": false,
        "isAutoSelectable": true,
        "parserPriority": 100,
        "parserDetector": function( DOMNode ) {
            return DOMNode && DOMNode.nodeName == 'VIDEO';
        },
        "contextEditor": function( optionalDOMNode, forceCreateNew, editorInstance, optionalArguments ) {
        
            var 
                needCreateNode = false;
        
            new CSSNodeEditor(optionalDOMNode, {
                "dialog": {
                    "caption": "Edit Video",
                    "childOf": getOwnerWindow( editorInstance )
                },
                "styles": {
                    "video": true,
                    "border": true,
                    "margin": true,
                    "width": true,
                    "height": true,
                    "id": true,
                    "class": true
                },
                "init": function( node, attributes ) {
                    
                    // console.log("Init: ", node );
                    
                    if ( node ) {
                        
                        console.log("Import node: ", node );
                        
                        attributes['width'] = node.getAttribute('width') || '';
                        attributes['height'] = node.getAttribute('height') || '';
                        attributes['id'] = node.getAttribute('id') || '';
                        attributes['class'] = node.getAttribute('class') || '';
                        attributes['src'] = node.getAttribute('src') || '';
                        
                        CSSDefs.styleAttributeParser( node.getAttribute('style') || '' ).chain( function() {
                            for ( var selector in this ) {
                                if ( this.propertyIsEnumerable( selector ) )
                                    attributes[ selector ] = this[ selector ];
                            }
                        } );
                        
                        needCreateNode = false;
                    } else {
                        needCreateNode = true;
                    }
                },
                "done": function( node, attributes ) {
                    
                    node = node || $('video');
                    
                    if ( attributes['src'] == '' && node.parentNode ) {
                        node.removeFromParent();
                        return;
                    }
                    
                    node.removeAttribute('width');
                    node.removeAttribute('height');
                    node.removeAttribute('id');
                    node.removeAttribute('class');
                    // node.removeAttribute('style');
                    
                    CSSDefs.setupAttributes( node, attributes.alteredAttributes, 'node' );
                    
                    if ( needCreateNode ) {
                        editorInstance.pasteHTMLAtCaret( node.outerHTML );
                    }
                    
                    //console.log( attributes.alteredAttributes );
                }
            });
        
        },
        "addToObjectsToolbar": true,
        "whenEnterContext": function( DOMNode ) {
        
            console.log( "When enter context : ", DOMNode );
        
            var range = document.createRange();
            range.setStartAfter( DOMNode );
            range.setEndAfter( DOMNode );
            editor.selection.removeAllRanges();
            editor.selection.addRange( range );
            
            DOMNode.tabIndex = 0;
            
            setTimeout( function() {
                editor.selection.forceAddNode( DOMNode );
            }, 0 );
        },
        "whenExitContext": function( DOMNode ) {
            console.log( "When exit context: ", DOMNode );
            
            editor.selection.forceRemoveNode( DOMNode );
        }
    });
    
}