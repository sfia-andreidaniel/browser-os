function DocumentEditor_cmd_insert_break( app ) {
    app.handlers.cmd_insert_break = function() {
        var ed = app.activeDocument;

        if ( !ed )
            return;
        else
            ed = ed.editor;

        ed.insertContent('<hr />');

    }
}