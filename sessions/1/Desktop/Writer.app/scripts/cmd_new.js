function DocumentEditor_cmd_new( app ) {
    app.handlers.cmd_new = function() {
        app.createDocument();
    }
}