function JSIde_cmd_help( app ) {
    app.handlers.cmd_help = function() {
(function(superApp) {
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
        "appIcon": "data:image/gif;base64,R0lGODlhEAAQALMPAGiO2S5jzfz7+JOv4dLc8Nbj9J/S/mBhYcLI06CkrBVNweDh5OLp9fDy9P///////yH5BAEAAA8ALAAAAAAQABAAAAST8MnHiLWlzdkIE04oVIvAEWFhrEZIIOaDFsOwNMwAoK+TMQAAaOAQBAK4xAIFCACACoADEHUgEgXG8ahQIBxbAeFQIGwDCiL12CETFFvpAM4ukI1xLVeIOBAEc3FbXgwJBwwFU10JilV2jB4CawNoAwJ2BwsPDQgFAgs1CA0NmDASCwmdBasFfQcJGhyuB7S0pg8RADsK",
        "caption": "Help",
        "closeable": true,
        "height": 200,
        "maximizeable": true,
        "maximized": false,
        "minHeight": 50,
        "minWidth": 50,
        "minimizeable": true,
        "modal": false,
        "moveable": true,
        "resizeable": true,
        "scrollable": false,
        "visible": true,
        "width": 400,
        "childOf": superApp,
        "modal": true
    })).chain(function() {
        Object.defineProperty(this, "pid", {
            "get": function() {
                return $pid;
            }
        });
        this.addClass("PID-" + $pid);
    }));

    $export("0001-tabs", (new TabPanel({
        "initTabs": [{
            "id": "0001-sheet",
            "caption": "About",
            "closeable": false
        }, {
            "id": "0002-sheet",
            "caption": "Custom Event Listeners",
            "closeable": false
        }]
    })).chain(function() {
        $export("0001-sheet", this.getTabById("0001-sheet").getSheet());
        $export("0002-sheet", this.getTabById("0002-sheet").getSheet());
    }).setAttr("style", "top: 10px; left: 10px; right: 10px; bottom: 40px; position: absolute"));

    $export("0001-sheet", $import("0001-sheet"));

    $export("0001-textArea", (new TextArea("Loading ...")).setAttr("style", "top: 0px; left: 0px; position: absolute; border: none").setProperty("readOnly", true).setAnchors({
        "width": function(w, h) {
            return w - 5 + "px";
        },
        "height": function(w, h) {
            return h - 5 + "px";
        }
    }));

    $export("0001-customevent", (new JSIde_CustomEventHandler("ready", (function(eventData) {
        this.value = $_GET('vfs/lib/jside/about.txt');
        return true;
    })))).attach($import("0001-textArea"));

    $export("0002-sheet", $import("0002-sheet"));

    $export("0002-textArea", (new TextArea("Loading...")).setAttr("style", "top: 0px; left: 0px; position: absolute; border: none").setProperty("readOnly", true).setAnchors({
        "width": function(w, h) {
            return w - 5 + "px";
        },
        "height": function(w, h) {
            return h - 5 + "px";
        }
    }));

    $export("0002-customevent", (new JSIde_CustomEventHandler("ready", (function(eventData) {
        this.value = $_GET('vfs/lib/jside/customevents.txt');
        return true;
    })))).attach($import("0002-textArea"));

    $export("0001-btn", (new Button("Ok", (function() {
        dlg.close();
    }))).setAttr("style", "bottom: 10px; left: 10px; position: absolute"));

    $import("0001-dlg").insert($import("0001-tabs"));
    $import("0001-tabs").insert($import("0001-sheet"));
    $import("0001-sheet").insert($import("0001-textArea"));
    $import("0001-tabs").insert($import("0002-sheet"));
    $import("0002-sheet").insert($import("0002-textArea"));
    $import("0001-dlg").insert($import("0001-btn"));

    setTimeout(function() {
        dlg.paint();
        dlg.ready();
    }, 1);

    return dlg;
})( app );

} };