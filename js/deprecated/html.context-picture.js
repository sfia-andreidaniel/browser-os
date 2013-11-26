function HTMLEditor_context_picture( editor ) {
    
    editor.addContext({
        "name": "Picture",
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAOCAYAAADwikbvAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAcYaAAHGGgBcvBr/QAAAAd0SU1FB90EEQkEKVZeVYwAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAACt0lEQVQozz3HT2iTdxyA8ef95X2T903eNGlaYzebxKrTbUyFiYiePHgaQu1BBEEm1qOt1U6dY+y0g7fV0Wqt6EGLUnZQ2GGDnUVhKOhhdGjXxrd/UtO3iWnT/Hvf97uD4OHhw6OFDSTQAAXKh5CCwIeQ/kEVAs8HOwHrVfAFtAAsE/QggLn5SdoSAcXlCtnuHpw5h0xmCyvFRex4kvmlMtncdhwnz6fdOVbdKrs+60UBWJbP+8osmaxifv4ZuZzB4uILkskGjZrL5J1HpJNH+Hp3Pz//NEoylsFvgYoYUK2tkEppvHVesXVrirn8S7I9KSprDratMTb2JydPfMOZ00e5/stjyu460TCoVgsSSZO16grdmU3M5v8hm+uisDRLZ9qk8O41TQ/CZotA1kCD9OYEng86GrirBdKfxFlacEl1bKFS8Yi3pXBLC+S27eTy1X1cu/YXAOeHD+GWZ/AEtLCBVJsTTL95ylc7DrO87BKPduCWHNJdPgvLDm2JHoIgjGVZlN/XScYzpDtOoAINZt8usWvHAaZfr2Dbn9PZ+S279/xI3lknm9nDxkaAbkRxVyu0d2yiWCziCRAykNXqQ/lvYUyajb8lrJArwyfl0vBRibcj/86MiB5BwhGk1ngq0zMPpVp7ImYU0QlgY90kHtuOZe1neOg89XqL0RsP+O5qL19+McQfv09SLtWwowfxvDzPXzyn1QBNU0ip8pL25F5+uPw9lRJEIhF0w6feKiA0+fX6PR4/+g3R6vT1naJeLxCLdqEIIJXYy9DgWaprHqM3b+AHikYTRkbuYhgpBs8NcuzYcSyzjcn7t7FjXfgeaIBcuHgOEVCaie/B+Pg4/f1nUKGAW7duMjAwQLNVZ2JigqmpKZSm09vbB7FYTADRdV2Aj5mmKUqpjx+zIwKIUohSuuh6WP4HySIwOqE/svsAAAAASUVORK5CYII=",
        "objectTypeID": 'Image',
        "isReadOnly": true,
        "isNotSelectable": false,
        "isAutoSelectable": true,
        "parserPriority": 100,
        "parserDetector": function( DOMNode ) {
            return DOMNode && DOMNode.nodeName == 'IMG';
        },
        "contextEditor": function( optionalDOMNode, forceCreateNew, editorInstance, optionalArguments ) {
        
            var 
                needCreateNode = false;
        
            new CSSNodeEditor(optionalDOMNode, {
                "dialog": {
                    "caption": "Edit Picture",
                    "childOf": getOwnerWindow( editorInstance )
                },
                "styles": {
                    "image": true,
                    "align": true,
                    "clear": true,
                    "border": true,
                    "margin": true,
                    "width": true,
                    "height": true,
                    "alt": true,
                    "id": true,
                    "class": true
                },
                "init": function( node, attributes ) {
                    
                    // console.log("Init: ", node );
                    
                    if ( node ) {
                        
                        console.log("Import node: ", node );
                        
                        attributes['width'] = node.getAttribute('width') || '';
                        attributes['height'] = node.getAttribute('height') || '';
                        attributes['align'] = node.getAttribute('align') || '';
                        attributes['alt'] = node.getAttribute('alt') || '';
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
                    
                    node = node || $('img');
                    
                    if ( attributes['src'] == '' && node.parentNode ) {
                        node.removeFromParent();
                        return;
                    }
                    
                    node.removeAttribute('width');
                    node.removeAttribute('height');
                    node.removeAttribute('align');
                    node.removeAttribute('alt');
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
        
            console.log("When enter context: ", DOMNode );
        
            var range = document.createRange();
            range.setStartAfter( DOMNode );
            range.setEndAfter( DOMNode );
            editor.selection.removeAllRanges();
            editor.selection.addRange( range );
            
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