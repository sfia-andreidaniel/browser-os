function Notepad_cmd_word_wrap( app ) {

    app.handlers.cmd_word_wrap = function( value ) {
        if ( app.currentFile )
            app.currentFile.wordWrap = !!value;
    }
    
}