function HTMLEditor_keyboard( editorInstance ) {

    Keyboard.bindKeyboardHandler( editorInstance.body, 'enter', function() {
        document.execCommand( 'InsertParagraph', false, 'p' );
        
        var moveBack = false;
        
        if ( editorInstance.selection.anchorNode.nodeName == 'DIV' && editorInstance.selection.anchorNode != editorInstance.body ) {
        
            // memorize selection pos
            var oldSelPos = editorInstance.selection.getCaretOffsetRelativeTo( editorInstance.body );
            
            var originalNode = editorInstance.selection.anchorNode;
            var p = $('p');
            moveBack = !!(p.innerHTML = originalNode.innerHTML);
            originalNode.addBefore(p);
            originalNode.removeFromParent();
            
            editorInstance.body.setCaretPosition( oldSelPos );
        }
        
        editorInstance.body.undoManager.add( 'insert paragraph' );
    });

    editorInstance.addEventListener( "keyup", function(e) {
        editorInstance.htmlFix();
    }, true );
    
    Keyboard.bindKeyboardHandler( editorInstance.body, "ctrl b", function() {
        editorInstance.runHandler( 'bold' );
    } );
    
    Keyboard.bindKeyboardHandler( editorInstance.body, "ctrl i", function() {
        editorInstance.runHandler( 'italic' );
    } );
    
    Keyboard.bindKeyboardHandler( editorInstance.body, "ctrl u", function() {
        editorInstance.runHandler( 'underline' );
    });
    
    Keyboard.bindKeyboardHandler( editorInstance.body, 'ctrl l', function() {
        editorInstance.runHandler( 'justify-left');
    });

    Keyboard.bindKeyboardHandler( editorInstance.body, 'ctrl r', function() {
        editorInstance.runHandler( 'justify-right');
    });

    Keyboard.bindKeyboardHandler( editorInstance.body, 'ctrl e', function() {
        editorInstance.runHandler( 'justify-center');
    });

    Keyboard.bindKeyboardHandler( editorInstance.body, 'ctrl j', function() {
        editorInstance.runHandler( 'justify-full');
    });
        
    Keyboard.bindKeyboardHandler( editorInstance.body, 'ctrl 1', function() {
        editorInstance.runHandler( 'format-block', 'h1');
    });

    Keyboard.bindKeyboardHandler( editorInstance.body, 'ctrl 2', function() {
        editorInstance.runHandler( 'format-block', 'h2');
    });

    Keyboard.bindKeyboardHandler( editorInstance.body, 'ctrl 3', function() {
        editorInstance.runHandler( 'format-block', 'h3');
    });

    Keyboard.bindKeyboardHandler( editorInstance.body, 'ctrl 4', function() {
        editorInstance.runHandler( 'format-block', 'h4');
    });

    Keyboard.bindKeyboardHandler( editorInstance.body, 'ctrl 5', function() {
        editorInstance.runHandler( 'format-block', 'h5');
    });

    Keyboard.bindKeyboardHandler( editorInstance.body, 'ctrl 6', function() {
        editorInstance.runHandler( 'format-block', 'h6');
    });

    Keyboard.bindKeyboardHandler( editorInstance.body, 'ctrl 0', function() {
        editorInstance.runHandler( 'format-block', '');
    });

    Keyboard.bindKeyboardHandler( editorInstance.body, 'ctrl [', function() {
        editorInstance.runHandler( 'decrease-font' );
    });

    Keyboard.bindKeyboardHandler( editorInstance.body, 'ctrl ]', function() {
        editorInstance.runHandler( 'increase-font' );
    });

    /*
        Keyboard.bindKeyboardHandler( editorInstance.body, "tab", function() {
            editorInstance.runCommand( 'indent' );
        } );
    */

    Keyboard.bindKeyboardHandler( editorInstance.body, "shift tab", function() {
        editorInstance.runHandler( 'outdent' );
    } );

    Keyboard.bindKeyboardHandler( editorInstance.body, "ctrl z", function() {
        editorInstance.undo();
    } );

    Keyboard.bindKeyboardHandler( editorInstance.body, "ctrl shift z", function() {
        editorInstance.redo();
    } );

    Keyboard.bindKeyboardHandler( editorInstance.body, "ctrl y", function() {
        editorInstance.redo();
    } );

}