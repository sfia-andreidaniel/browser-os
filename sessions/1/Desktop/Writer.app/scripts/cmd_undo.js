function DocumentEditor_cmd_undo( app ) {

    app.handlers.cmd_undo = function( ) {
        
        var ed = app.activeDocument;

        if ( !ed )
            return;
        else
            ed = ed.editor;
        
        ed.undoManager.undo();
    }
    
}