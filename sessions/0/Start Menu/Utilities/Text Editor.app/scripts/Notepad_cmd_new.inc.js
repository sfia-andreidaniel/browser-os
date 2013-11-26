function Notepad_cmd_new( app ) {

    app.handlers.cmd_new = function() {
        app.createFile( 'NewFile' );
    }
    
    Keyboard.bindKeyboardHandler( app, 'f7', app.handlers.cmd_new );
    
}