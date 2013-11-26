function DocumentEditor_cmd_font_size( app ) {

    app.handlers.cmd_font_size = function( size ) {

        if ( !size )
            return false;

        var ed = app.activeDocument;

        if ( !ed )
            return;
        else
            ed = ed.editor;
        
        ed.execCommand( 'fontSize', false, size );
    }
    
}