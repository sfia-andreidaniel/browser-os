function DocumentEditor_cmd_back_color( app ) {

    app.handlers.cmd_back_color = function( color ) {
        
        color = color || '';

        var ed = app.activeDocument;

        if ( !ed )
            return;
        else
            ed = ed.editor;
        
        ed.execCommand( 'backcolor', false, color );
    }
    
}