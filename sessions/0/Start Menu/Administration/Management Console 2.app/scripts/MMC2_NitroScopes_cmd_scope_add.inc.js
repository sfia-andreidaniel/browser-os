function MMC2_NitroScopes_cmd_scope_add( app ) {
    
    app.handlers.cmd_scope_add = function() {
    
        var $namespace = {};
    
        var $export = function(objectID, objectData) {
            $namespace[objectID] = objectData;
            return objectData;
        };
        var $import = function(objectID) {
            return $namespace[objectID] || (function() {
                throw "Namespace " + objectID + " is not defined (yet?)";
            })();
        };
        var $pid = getUID();
    
        var dlg = $export("0001-dlg", (new Dialog({
            "alwaysOnTop": false,
            "appIcon": "data:image/png;base64,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",
            "caption": "Add new scope to your cloud",
            "closeable": true,
            "height": 183,
            "maximizeable": false,
            "maximized": false,
            "minHeight": 50,
            "minWidth": 50,
            "minimizeable": false,
            "modal": false,
            "moveable": true,
            "resizeable": true,
            "scrollable": false,
            "visible": true,
            "width": 352,
            "childOf": getOwnerWindow( app.parentNode )
        })).chain(function() {
            Object.defineProperty(this, "pid", {
                "get": function() {
                    return $pid;
                }
            });
            this.addClass("PID-" + $pid);
        }));
    
        $export("0001-img", (new DOMImage({
            "src": "data:image/png;base64,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",
            "displayMode": "best"
        })).setAttr("style", "top: 10px; left: 10px; width: 32px; height: 32px; position: absolute; border-color: transparent"));
    
        $export("0001-lbl", (new DOMLabel("Add new scope to your cloud")).setAttr("style", "top: 20px; left: 55px; right: 10px; position: absolute; text-overflow: ellipsis; font-weight: bold"));
    
        $export("0001-btn", (new Button("Create Scope", (function() {
            var scopeName = dlg.scopeName.value;
            if (!/^[a-z][a-z\d]+$/i.test(scopeName)) {
                DialogBox("Please input a valid scope name", {
                    "type": "error",
                    "details": "A valid scope name should be in the following format:\n" +
                               "- First character is a letter a-z\n"+
                               "- The rest of the characters can be only letters or numbers",
                    "caption": "Bad scope name",
                    "childOf": dlg
                });
                return;
            }
            var req = [];
            req.addPOST('do', 'create-scope');
            req.addPOST('name', scopeName);
            
            var rsp;
            
            if ( ( rsp = $_JSON_POST( app.handler, req ) ) != 'ok' ) {
                DialogBox('Could not create scope', {
                    'type': 'error',
                    'details': rsp === null
                        ? "The server encountered an error while creating your scope"
                        : rsp,
                    'caption': "Error creating scope",
                    "childOf": dlg
                });
                return;
            }
            
            dlg.close();
            dlg.purge();
            dlg = null;
        }))).setAttr("style", "bottom: 10px; left: 10px; position: absolute"));
    
        $export("0002-btn", (new Button("Cancel", (function() {
            dlg.close();
            dlg.purge();
        }))).setAttr("style", "bottom: 10px; left: 110px; position: absolute"));
    
        $export("0002-lbl", (new DOMLabel("Scope name:")).setAttr("style", "top: 50px; left: 10px; width: 75px; position: absolute; text-overflow: ellipsis"));
    
        dlg.scopeName = $export("0001-text", (new TextBox("")).setAttr("style", "top: 45px; left: 90px; position: absolute; margin: 0; right: 10px").setProperty("placeholder", "E.g: myCompanyWebsite. Only letters allowed"));
    
        $import("0001-dlg").insert($import("0001-img"));
        $import("0001-dlg").insert($import("0001-lbl"));
        $import("0001-dlg").insert($import("0001-btn"));
        $import("0001-dlg").insert($import("0002-btn"));
        $import("0001-dlg").insert($import("0002-lbl"));
        $import("0001-dlg").insert($import("0001-text"));
    
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);
    
        return dlg;
    };
}