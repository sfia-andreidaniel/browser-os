function Notepad_cmd_open( app ) {

    app.handlers.cmd_open = function() {
    
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
            "caption": "Open File",
            "closeable": true,
            "height": 119,
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
            "width": 255,
            "childOf": app,
            "modal": true
        })).chain(function() {
            Object.defineProperty(this, "pid", {
                "get": function() {
                    return $pid;
                }
            });
            this.addClass("PID-" + $pid);
        }));
    
        $export("0001-lbl", (new DOMLabel("Select file:")).setAttr("style", "top: 20px; left: 10px; width: 65px; position: absolute; text-overflow: ellipsis"));
    
        var file = $export("0001-file", (new DOMFile({
            "disabled": false,
            "destination": "memory",
            "dataType": "text",
            "maxSize": 2097152,
            "mime": "",
            "fileNameRegex": ""
        })).setAttr("style", "top: 15px; left: 80px; position: absolute; right: 10px; margin: 0")).chain( function() {
            
            this.addCustomEventListener( 'change', function() {
                
                var fileName = file.fileName;
                var contents = file.value;
                
                var f = app.createFile( fileName, contents );
                
                switch ( true ) {
                    
                    case /\.js$/i.test( fileName ):
                        f.editor.syntax = 'javascript';
                        break;
                    case /\.css$/i.test( fileName ):
                        f.editor.syntax = 'css';
                        break;
                    case /\.htm(l)?$/i.test( fileName ):
                        f.editor.syntax = 'html';
                        break;
                    case /\.php(s|3|4|5|6)$/i.test( fileName ):
                        f.editor.syntax = 'php';
                        break;
                    
                }
                
                setTimeout( function() {
                    dlg.close();
                    dlg.purge();
                }, 5 );
                
                return true;
                
            } );
            
        } );
    
        $export("0001-btn", (new Button("Cancel", (function() {
            dlg.close();
            dlg.purge();
        }))).setAttr("style", "right: 10px; bottom: 10px; position: absolute"));
    
        Keyboard.bindKeyboardHandler( dlg, "esc", function() {
            dlg.close();
            dlg.purge();
        } );
    
        file.focus();
    
        $import("0001-dlg").insert($import("0001-lbl"));
        $import("0001-dlg").insert($import("0001-file"));
        $import("0001-dlg").insert($import("0001-btn"));
    
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);
    
        return dlg;
    
    }
    
    Keyboard.bindKeyboardHandler( app, "ctrl o", app.handlers.cmd_open );
}