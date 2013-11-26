function DocumentEditor_cmd_font_style( app ) {

    app.handlers.cmd_font_style = function( style ) {

        if ( !style )
            return false;

        var ed = app.activeDocument;

        if ( !ed )
            return;
        else
            ed = ed.editor;
        
        switch ( style ) {
            
            case 'bold':
            case 'italic':
            case 'underline':
            case 'superscript':
            case 'subscript':
            case 'strikethrough':
                ed.execCommand( style );
                break;
            
            case 'p':
            case 'pre':
            case 'blockquote':
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                ed.execCommand( 'formatBlock', false, style || 'p' );
                break;
            
            default:
                alert( 'Font style: ' + style );
                break;
        }
    }
    
}