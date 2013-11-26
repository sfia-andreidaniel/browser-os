function Notepad_cmd_print_margins( app ) {

    var printMargins = false;
    
    Object.defineProperty( app, "printMargins", {
        
        "get": function() {
            return printMargins;
        },
        
        "set": function( b ) {
            b = !!b;
            
            if ( b == printMargins )
                return;
            
            printMargins = b;
            
            for ( var i=0, len=app.files.length; i<len; i++ ) {
                app.files[i].editor.editor.renderer.setShowPrintMargin( b );
            }
        }
        
    } );

    app.handlers.cmd_print_margins = function( value ) {
        app.printMargins = value;
    }
    
}