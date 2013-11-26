function Notepad_cmd_save( app ) {

    app.handlers.cmd_save = function() {
        if ( app.currentFile ) {
            app.currentFile.save();
        }
    }
    
    Keyboard.bindKeyboardHandler( app, 'ctrl s', app.handlers.cmd_save );
    
}