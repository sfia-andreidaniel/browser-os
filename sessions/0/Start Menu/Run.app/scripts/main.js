function JLauncher() {

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
        "appIcon": "data:image/gif;base64,R0lGODlhEAAQAOZ6ADY2Nj8/Py8vLzo6OkJCQjk5OUZGRkFBQTs7OyYmJjg4ODc3N1dXVywsLC0tLTIyMiUlJSoqKjw8PE5OTkRERFpaWktLSz4+PjU1NaWstVVVVUNDQ0VFRVxcXCQkJFJSUrW6wSAgILrAxSgoKL/EyN7e3ouVoUhISJuhqGt1gKeutjAwMKKpsdNPSuKtF/bklJCZonF8h52iqLTlsniCj11dXefq7aCmroyUofL09Z2jq8DEyaioqKyyupKbpltbW7K3vquzvKGpskKwPn+JllRUVK2trSkpKVNTUyIiIllZWb7CyLu/w2lxfHV/i6uyua61vtDS1J+nsLzAxEdHR3yGk4WPnPG7uG93gyEhIc/Pz8XIzGdveUBAQL/Dx4SOmqSrtFhYWKiwuZigq5ykrlZWVn+Kl7m+w6uyvJObpKevuLG2vdHR0S4uLnR0dGxzfb/Dydfc4YeSnZafqTExMT09PTQ0NNbb4ebp7TMzM////wAAAAAAAAAAAAAAAAAAACH5BAEAAHoALAAAAAAQABAAAAfQgHqCg4SFeltTJEsiIGtPGVJjPiZWRF5MLS5Dd5ydnXE2QXBXLzN4p6ipOWIidA95dhgACwUIEnUBBxsZZ3YhWUkeEAkjEQ0OAnQGUCC+WjzCxMbIymhABcMlbtPJD7EWaj11R2xGbd12swoDE2AqBAIrdLAAAOsIdXUfLEJU9LQDbF0I0OWAhhtkLCgoMOBWgFwECFDgwEDHnAn5Bh4gsGGiAQMnKqCA8QFJEQ1lGDAIo6TCjw4dasjYkQaHnC9mqtBwEgNLiiZc3kQxRHRQIAA7",
        "caption": "Run Application",
        "closeable": true,
        "height": 296,
        "maximizeable": false,
        "maximized": false,
        "minHeight": 50,
        "minWidth": 50,
        "minimizeable": true,
        "modal": false,
        "moveable": true,
        "resizeable": false,
        "scrollable": false,
        "visible": true,
        "width": 451,
        "x": 20,
        "y": getMaxY() - 365
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
    })).setAttr("style", "top: 10px; left: 10px; width: 48px; height: 48px; position: absolute; border-color: transparent"));

    $export("0001-lbl", (new DOMLabel("Type a command here and JSPlatform will execute it for you.")).setAttr("style", "top: 25px; left: 65px; right: 10px; position: absolute; text-overflow: ellipsis; height: 20px; white-space: normal"))
        .chain( function() {
            disableSelection( this );
            this.onclick = function() {
                command.focus();
            };
        });

    var command = $export("0001-text", (new TextBox("")).setAttr("style", "top: 70px; left: 10px; position: absolute; margin: 0; right: 10px").setProperty("placeholder", "e.g.: mc"));
    command.addCustomEventListener('ready', function() {
        command.focus();
    });

    $export("0002-lbl", (new DOMLabel("Force authentication dialog to appear (RunAs)")).setAttr("style", "top: 113px; left: 35px; width: 260px; position: absolute; text-overflow: ellipsis"))
        .chain( function() {
            this.onclick = function() {
                forceKeyring.click();
            };
            disableSelection( this );
        });

    var forceKeyring = $export("0001-check", (new DOMCheckBox({
        "valuesSet": "two-states",
        "checked": "false"
    })).setAttr("style", "top: 110px; left: 10px; position: absolute"));

    var keepResults = dlg.insert(new DOMCheckBox({
        "valuesSet": "two-states",
        "checked": "true"
    })).setAttr("style", "top: 138px; left: 10px; position: absolute");
    
    dlg.insert(new DOMLabel("Close window when command ends")
        .setAttr("style", "top: 140px; left: 35px; width: 290px; position: absolute; text-overflow: ellipsis"))
        .chain( function() {
            this.onclick = function( ) {
                keepResults.click();
            };
            disableSelection( this );
        });

    var useSSH = $export("0002-check", (new DOMCheckBox({
        "valuesSet": "two-states",
        "checked": "false"
    })).setAttr("style", "top: 165px; left: 10px; position: absolute"));
    
    useSSH.addCustomEventListener('change', function() {
        if ( !this.checked ) {
            sshMachine.value = '';
        }
    });
    
    $export("0003-lbl", (new DOMLabel("Run this command on a different machine (via SSH)"))
        .setAttr("style", "top: 168px; left: 35px; width: 290px; position: absolute; text-overflow: ellipsis"))
        .chain( function() {
            this.onclick = function( ) {
                useSSH.click();
            };
            disableSelection( this );
        });

    var sshMachine = $export("0002-text", (new TextBox("")).setAttr("style", "top: 190px; left: 35px; position: absolute; margin: 0; right: 10px").setProperty("placeholder", "host[:port]"));
    sshMachine.addCustomEventListener('change', function() {
        useSSH.value = !!this.value.toString().trim();
    });

    $export("0001-btn", (new Button("Run", (function() {
        dlg.cmdok();
    }))).setAttr("style", "bottom: 10px; left: 10px; position: absolute; font-weight: bold; padding: 5px; height: 30px"));

    $export("0002-btn", (new Button("Cancel", (function() {
        dlg.cmdcancel();
    }))).setAttr("style", "bottom: 10px; left: 55px; position: absolute; padding: 5px; height: 30px"));

    $import("0001-dlg").insert($import("0001-img"));
    $import("0001-dlg").insert($import("0001-lbl"));
    $import("0001-dlg").insert($import("0001-text"));
    $import("0001-dlg").insert($import("0002-lbl"));
    $import("0001-dlg").insert($import("0001-check"));
    $import("0001-dlg").insert($import("0002-check"));
    $import("0001-dlg").insert($import("0003-lbl"));
    $import("0001-dlg").insert($import("0002-text"));
    $import("0001-dlg").insert($import("0001-btn"));
    $import("0001-dlg").insert($import("0002-btn"));

    dlg.cmdcancel = function() {
        setTimeout( function() {
            dlg.close();
            dlg = undefined;
        }, 10);
    };

    dlg.cmdok = function() {
    
        if ( !command.value.toString().trim() ) {
            HighlightElement( command );
            return;
        }
        
        if ( !sshMachine.value.toString().trim() && useSSH.value ) {
            HighlightElement( sshMachine );
            return;
        }
        
        dlg.cmdcancel();
        
        try {
            AppExec( 'Start Menu/Administration/Terminal.app', [ JSON.stringify( command.value.toString().trim() ), JSON.stringify( sshMachine.value.toString().trim() ), JSON.stringify( forceKeyring.value ? 'keyring' : false ), JSON.stringify( keepResults.value ? "": "keepResults" ) ] );
        } catch (e) {
            alert(e);
        }
    }

    Keyboard.bindKeyboardHandler( dlg, 'esc', function() {
        dlg.cmdcancel();
    } );

    Keyboard.bindKeyboardHandler( dlg, 'enter', function() {
        dlg.cmdok();
    } );

    setTimeout(function() {
        dlg.paint();
        dlg.ready();
    }, 1);

    return dlg;

}