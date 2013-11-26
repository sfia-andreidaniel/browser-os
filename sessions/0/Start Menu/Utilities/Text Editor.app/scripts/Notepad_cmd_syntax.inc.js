function Notepad_cmd_syntax( app ) {

    app.createSyntaxMonitor = function( syntaxName ) {
        
        return function() {
            
            // console.log( "Check if syntax is: " + syntaxName );
            
            switch ( true ) {
    
                case app.currentFile === null:
                case syntaxName == 'none':
                case syntaxName == '':
                    
                    return syntaxName == 'none' || syntaxName == '';
                    break;
                
                default:
                    return app.currentFile.editor.syntax == syntaxName;
                    break;
            }
        }
        
    }

    app.handlers.syntax_handler = function( syntax ) {
        
        if ( app.currentFile ) {
            app.currentFile.editor.syntax = ( syntax == 'none' ? '' : syntax );
        }

    }
    
}