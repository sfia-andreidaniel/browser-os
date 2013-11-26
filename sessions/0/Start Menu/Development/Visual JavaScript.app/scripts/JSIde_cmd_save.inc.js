function JSIde_cmd_save( app ) {

    app.getState = function() {
        return {
                "componentsState": (function() {
                    var out = {};
                    for ( var i=0,len=JSIde_Components.length; i<len; i++ ) {
                        out[ JSIde_Components[i].type ] = parseInt( JSIde_Components[i].componentID ) - 1;
                    }
                    return out;
                })(),
                "applicationData": app.application
            };
    };

    app.handlers.cmd_save = function() {

        var out = JSON.stringify(
            app.getState()
        );

        var req = [];
        req.addPOST('do', 'save');
        req.addPOST('data', out );
        $_FORM_POST(app.handler, req );
    }

}