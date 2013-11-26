function MMC2_Policies_cmd_policy_flush( app ) {

    app.handlers.cmd_policy_flush = function() {
        var req = [];
        req.addPOST('do', 'flush-policies');
        if ($_JSON_POST( app.handler, req ) != 'ok' )
            DialogBox("Error flushing policies!", {
                "type": "error",
                "childOf": app
            });
    };
    
}