function DocumentEditor_cmd_select_all( app ) {

    app.handlers.cmd_select_all = function( ) {

        var ed = app.activeDocument;

        if ( !ed )
            return;
        else
            ed = ed.editor;
        
        ed.execCommand( 'selectAll' );
    }
    
}