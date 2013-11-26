function DocumentEditor_cmd_font_color( app ) {

    app.handlers.cmd_font_color = function( color ) {
        
        color = color || '';

        var ed = app.activeDocument;

        if ( !ed )
            return;
        else
            ed = ed.editor;
        
        ed.execCommand( 'forecolor', false, color );
    }
    
}