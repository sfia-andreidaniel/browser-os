function DocumentEditor_cmd_justify( app ) {

    app.handlers.cmd_justify = function( direction ) {
        
        direction = direction || 'left';

        var ed = app.activeDocument;

        if ( !ed )
            return;
        else
            ed = ed.editor;
        
        switch ( direction ) {
            case 'left':
                ed.execCommand('justifyleft');
                break;
            case 'right':
                ed.execCommand('justifyright');
                break;
            case 'center':
                ed.execCommand('justifycenter');
                break;
            case 'full':
                ed.execCommand('justifyfull');
                break;
        }
        
        //ed.execCommand( 'backcolor', false, color );
    }
    
}