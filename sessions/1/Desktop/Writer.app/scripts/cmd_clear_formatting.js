function DocumentEditor_cmd_clear_formatting( app ) {

    app.handlers.cmd_clear_formatting = function( ) {
        var ed = app.activeDocument;

        if ( !ed )
            return;
        else
            ed = ed.editor;
        
        ed.execCommand('RemoveFormat');

    }
    
}