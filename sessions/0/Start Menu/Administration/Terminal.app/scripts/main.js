function _VT101 ( command, machine, useKeyring, keepWindowOnFinish ) {

    //console.log( "Lunch arguments: ", Array.prototype.slice.call( arguments, 0 ) );

    command = argsplit( command || '/bin/bash' );
    
    var cmd = command[0];
    var args= command.slice( 1 );
    
    //console.log( "Command: ", cmd, args );
    
    machine = machine || null;
    
    useKeyring = useKeyring || false;
    keepWindowOnFinish = !!keepWindowOnFinish;

    if ( machine === null )
        machine = undefined;

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
        "appIcon": "",
        "caption": "Terminal",
        "closeable": true,
        "height": 383,
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
        "width": 730,
        "appIcon": "data:image/gif;base64,R0lGODlhEAAQAOZ6ADY2Nj8/Py8vLzo6OkJCQjk5OUZGRkFBQTs7OyYmJjg4ODc3N1dXVywsLC0tLTIyMiUlJSoqKjw8PE5OTkRERFpaWktLSz4+PjU1NaWstVVVVUNDQ0VFRVxcXCQkJFJSUrW6wSAgILrAxSgoKL/EyN7e3ouVoUhISJuhqGt1gKeutjAwMKKpsdNPSuKtF/bklJCZonF8h52iqLTlsniCj11dXefq7aCmroyUofL09Z2jq8DEyaioqKyyupKbpltbW7K3vquzvKGpskKwPn+JllRUVK2trSkpKVNTUyIiIllZWb7CyLu/w2lxfHV/i6uyua61vtDS1J+nsLzAxEdHR3yGk4WPnPG7uG93gyEhIc/Pz8XIzGdveUBAQL/Dx4SOmqSrtFhYWKiwuZigq5ykrlZWVn+Kl7m+w6uyvJObpKevuLG2vdHR0S4uLnR0dGxzfb/Dydfc4YeSnZafqTExMT09PTQ0NNbb4ebp7TMzM////wAAAAAAAAAAAAAAAAAAACH5BAEAAHoALAAAAAAQABAAAAfQgHqCg4SFeltTJEsiIGtPGVJjPiZWRF5MLS5Dd5ydnXE2QXBXLzN4p6ipOWIidA95dhgACwUIEnUBBxsZZ3YhWUkeEAkjEQ0OAnQGUCC+WjzCxMbIymhABcMlbtPJD7EWaj11R2xGbd12swoDE2AqBAIrdLAAAOsIdXUfLEJU9LQDbF0I0OWAhhtkLCgoMOBWgFwECFDgwEDHnAn5Bh4gsGGiAQMnKqCA8QFJEQ1lGDAIo6TCjw4dasjYkQaHnC9mqtBwEgNLiiZc3kQxRHRQIAA7"
    })).chain(function() {
        Object.defineProperty(this, "pid", {
            "get": function() {
                return $pid;
            }
        });
        this.addClass("PID-" + $pid);
    }));

    var terminal;

    dlg.insert( terminal = /* window.term = */ ( new VT100Application(
        
        cmd, 
        
        args, 
        
        {
            "host"        : ( window.location.host + '' ).replace(/\:[\d]+/, '') + ":10000",
            "autoConnect" : true,
            "forceRunAs"  : useKeyring
        },
        
        machine
    
    ) ).setAnchors({
        "width": function(w,h) {
            return w + "px";
        },
        "height": function(w,h) {
            return h - 5 + "px"
        }
    }).setAttr('style', 'margin-top: 5px') );
    
    terminal.addCustomEventListener('disconnect', function(){
        if ( !keepWindowOnFinish )
            setTimeout( function() {
                dlg.close();
            }, 50 );
    });
    
    terminal.addCustomEventListener('auth-canceled', function(){
        setTimeout( function() { dlg.close(); }, 50 );
    });
    
    dlg.closeCallback = function() {
        terminal.destroy();
        return true;
    }

    setTimeout(function() {
        dlg.paint();
        dlg.ready();
        
    }, 1);

    return dlg;
}