function Notepad_cmd_close( app ) {

    app.handlers.cmd_close = function() {
        if ( app.currentFile ) {
            app.currentFile.close();
        }
        app.focus();
    }
    
    Keyboard.bindKeyboardHandler( app, 'f8', app.handlers.cmd_close );
    
}