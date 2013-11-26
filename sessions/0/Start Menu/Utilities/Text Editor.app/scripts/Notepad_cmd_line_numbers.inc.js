function Notepad_cmd_line_numbers( app ) {

    var lineNumbers = false;
    
    Object.defineProperty( app, "lineNumbers", {
        
        "get": function() {
            return lineNumbers;
        },
        
        "set": function( b ) {
            b = !!b;
            
            if ( b == lineNumbers )
                return;
            
            lineNumbers = b;
            
            for ( var i=0, len=app.files.length; i<len; i++ ) {
                app.files[i].editor.editor.renderer.setShowGutter( b );
            }
        }
        
    } );

    app.handlers.cmd_line_numbers = function( value ) {
        app.lineNumbers = value;
    }
    
}