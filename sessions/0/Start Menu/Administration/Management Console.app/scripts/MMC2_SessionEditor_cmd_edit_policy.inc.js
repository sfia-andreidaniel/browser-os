function MMC2_SessionEditor_cmd_edit_policy( app ) {
    
    app.handlers.cmd_edit_policy = function( ) {
        switch (true) {
            case app.properties.values.policyId === '0':
                DialogBox("This session does not have a configurable policy!", {
                    "type": "warning",
                    "childOf": getOwnerWindow( app.parentNode )
                });
                return;

            case app.properties.values.policyId === '':
                DialogBox("You must first save your session in order to be able to edit it's policy", {
                    "type": "warning",
                    "childOf": getOwnerWindow( app.parentNode )
                });
                return;
            default:
                app.appHandler('cmd_policy_edit', parseInt( app.properties.values.policyId ), false );
                break;
        }
    }
    
}