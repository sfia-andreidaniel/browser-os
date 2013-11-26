function DocumentEditor_cmd_redo( app ) {

    app.handlers.cmd_redo = function( ) {
        
        var ed = app.activeDocument;

        if ( !ed )
            return;
        else
            ed = ed.editor;

        ed.undoManager.redo();
    }
    
}