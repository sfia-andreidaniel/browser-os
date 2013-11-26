function Notepad_cmd_readonly( app ) {

    app.handlers.cmd_readonly = function( value ) {
        if ( app.currentFile )
            app.currentFile.readOnly = !!value;
    }
    
}