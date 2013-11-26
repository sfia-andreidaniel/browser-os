function MMC2_Packages_cmd_package_install( app ) {
    
    app.handlers.cmd_package_install = function( ) {
        
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
    
        var serverInfo = app.serverInfo();

        if ( !serverInfo )
            return;
    
        var dlg = $export("0001-dlg", (new Dialog({
            "alwaysOnTop": false,
            "appIcon": "",
            "caption": "Install a package in JSPlatform",
            "closeable": true,
            "height": 350,
            "maximizeable": true,
            "maximized": false,
            "minHeight": 350,
            "minWidth": 481,
            "minimizeable": false,
            "modal": false,
            "moveable": true,
            "resizeable": true,
            "scrollable": false,
            "visible": true,
            "width": 481,
            "childOf": getOwnerWindow( app.parentNode )
        })).chain(function() {
            Object.defineProperty(this, "pid", {
                "get": function() {
                    return $pid;
                }
            });
            this.addClass("PID-" + $pid);
        }));
    
        dlg.app = app;
    
        $export("0001-lbl", (new DOMLabel("Package installation wizard")).setAttr("style", "top: 20px; left: 55px; position: absolute; text-overflow: ellipsis; font-size: 1.3em; font-weight: bold").setAnchors({
            "width": function(w, h) {
                return w - 70 + "px";
            }
        }));
    
        $export("0001-img", (new DOMImage({
            "src": "data:image/png;base64,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",
            "displayMode": "best"
        })).setAttr("style", "top: 10px; left: 10px; width: 32px; height: 32px; position: absolute; border-color: transparent"));
    
        $export("0002-lbl", (new DOMLabel("Type of install:")).setAttr("style", "top: 70px; left: 10px; width: 85px; position: absolute; text-overflow: ellipsis"));
    
        dlg.installType = $export("0001-drop", (new DropDown(undefined)).setItems([{
            "id": "upgrade",
            "name": "Upgrade ( If you previously installed this package )"
        }, {
            "id": "install",
            "name": "Install ( If you are first-time installing this package )"
        }]).setAttr("style", "top: 65px; left: 110px; position: absolute; margin: 0").setAnchors({
            "width": function(w, h) {
                return w - 120 + "px";
            }
        }));
    
        $export("0003-lbl", (new DOMLabel("Installation file:")).setAttr("style", "top: 105px; left: 10px; width: 95px; position: absolute; text-overflow: ellipsis"));
    
        dlg.file = $export("0001-file", (new DOMFile({
            "disabled": false,
            "destination": "server",
            "dataType": "binary",
            "maxSize": 200097152,
            "mime": "",
            "fileNameRegex": ".package$"
        })).setAttr("style", "top: 100px; left: 110px; position: absolute; right: 10px; margin: 0"));
    
        dlg.consoleHolder = $export("0001-holder", (new DOMPlaceable({
            "caption": "",
            "appearence": "transparent"
        })).setAttr("style", "top: 155px; left: 10px; right: 10px; position: absolute; bottom: 10px; visibility: hidden;"));
    
        $import("0001-dlg").insert($import("0001-lbl"));
        $import("0001-dlg").insert($import("0001-img"));
        $import("0001-dlg").insert($import("0002-lbl"));
        $import("0001-dlg").insert($import("0001-drop"));
        $import("0001-dlg").insert($import("0003-lbl"));
        $import("0001-dlg").insert($import("0001-file"));
        $import("0001-dlg").insert($import("0001-holder"));
    
        var theConsole = null;
    
        dlg.file.addCustomEventListener('change', function() {
            
            /* A file has been uploaded to the server ... */
            
            dlg.consoleHolder.style.visibility = 'visible';
            
            if ( theConsole ) {
                if ( theConsole.parentNode )
                    theConsole.parentNode.removeChild( theConsole );
                theConsole.purge();
                theConsole = null;
            }
            
            var theCommand = 'cd ' + app.escapeshellarg( serverInfo.root ) 
                      + ' && sudo ./install-package ' + app.escapeshellarg( dlg.file.serverPath )
                                   + ' --' + dlg.installType.value + ' .'
                      + ' && sudo chown ' + app.escapeshellarg( serverInfo.user + ':' + serverInfo.group ) + ' -R . && exit';
            
            
            dlg.paint();
            
            theConsole = dlg.consoleHolder.insert(
                ( new Terminal({
                    "autoLogin": true,
                    "exec": theCommand
                }) ).setAnchors({
                    "width": function(w,h) {
                        return w + "px";
                    },
                    "height": function(w,h) {
                        return h + "px";
                    }
                })
            );
            
            dlg.paint();
            
            setTimeout( function() { dlg.paint() }, 500 );
            setTimeout( function() { dlg.paint() }, 1500 );
            
            return true;
            
        } );
    
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);
    
        dlg.closeCallback = function() {
            dlg.app.appHandler('cmd_refresh');
            return true;
        }
    
        return dlg;
    
    }
    
}