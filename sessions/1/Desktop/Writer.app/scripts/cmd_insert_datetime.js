function DocumentEditor_cmd_insert_datetime( app ) {

    app.handlers.cmd_insert_datetime = function( fmt ) {
        var ed = app.activeDocument;

        if ( !ed )
            return;
        else
            ed = ed.editor;
        
        if ( typeof fmt != 'undefined' ) {
            ed.insertContent( ( new Date() ).toString( fmt ) );
            return;
        }

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
            "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAK3RFWHRDcmVhdGlvbiBUaW1lAFNvIDI4IFNlcCAyMDAzIDIzOjUzOjIwICswMTAwXt1uVAAAAAd0SU1FB9QHBwgcNKNc6GAAAAAJcEhZcwAACvAAAArwAUKsNJgAAAAEZ0FNQQAAsY8L/GEFAAAC60lEQVR42nWTXUgUURTH/7M7O7u2H2qp4AeKVCZWKFpJhWWWPZSWD/ZSBlH0IkUvChFFQSSE+K4PPkSUFEKBSmDkQ+saSmkfuonF7qqIaTm2M/sxO7M7tzO1Skhd+HGHy/n/z7nnnuHwn9XWNiAwPdya6hLO2VK4/O/Ly/Ozc4Engy97On0+3wqFaEac+Z/iewOC08ENVjUcvlhSU5aZWbJDyCktz0hz2qsFDfunPr8f0TRNptD4Pw1qahquH6irujji6UNhQTYc6XbE4sCm/DwIsOSLCwEuEPBNU2jQ9JeOWyPVZTnnzNuM43X1uNp0Hn7fEm41ncKXd5PIrag2TI9SXCnh4isr99jKyyt6V1eDdlWNLTc3NxcHfHKRkgAcqem4fPs+Ht64gt2HTqJg5y4wRudORw6JtxGjfGPj/UG/fzJHFIfSLZa0b/PzK1ZJiupBWTdHVBMKd5Vh+4km7Ks9DbNONf/UIK6IiyR2EBaTy7VlT0fHpa21tQc35xemlthShK0ZWWmWxXEPIlSFFAb2kpinzBxdeMb9DBMfJ9+TOGS8BK8oMdhsdrS0tAI9N6FWl4JJS3jwfBRzERlZpUdg2ZQCWQ7B96YfnoFHY16vVyLxV8OE1/XEnxZ2XwO+vwAfPgW8eooLx+rxesiNt/5xBKUg5mZnZz5+8k5MkZgx9oEURhUS2tvdUTpgGqG3NbD4tIdF52YZO5vLlDE3U3XG3G6vMTS9xF3iDFFEWI28Jl2Prz8lSy8EnNkQHt+BnlUMU383VGrcsOcrTQGWiUFiiPATMUPDJxIJrK4CohiHWtMOlXZW3wkdJigRDdbhKWiyMblQkiaikWstKU+VQxBAjeRhZToSVjN4ngPHcZB5Mzg1SkGx9SI3Ti0fjYaDXV19dlGUQuFwKGIgSXIkFJKVSESOqVospijB8O+G0exvNDFGN484TRQQevIvU5P72rdR/gIxRvzYaGB0M5NISbrr/8G4h5ysYn39ArlAWEV3uTRTAAAAAElFTkSuQmCC",
            "caption": "Select Format",
            "closeable": true,
            "height": 221,
            "maximizeable": false,
            "maximized": false,
            "minHeight": 50,
            "minWidth": 50,
            "minimizeable": false,
            "modal": false,
            "moveable": true,
            "resizeable": false,
            "scrollable": false,
            "visible": true,
            "width": 180,
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
    
        $export("0001-drop", (new DropDown(undefined)).setProperty("size", 2).setItems([{
            "id": "%Y/%m/%d",
            "name": "YYYY/MM/DD"
        }, {
            "id": "%d/%m/%Y",
            "name": "DD/MM/YYYY"
        }, {
            "id": "%H:%i:%S",
            "name": "hh:mm:ss"
        }, {
            "id": "%H:%i",
            "name": "hh:mm"
        }, {
            "id": "%Y/%m/%d %H:%i",
            "name": "YYYY/MM/DD hh:mm"
        }, {
            "id": "%d/%m/%Y %H:%i",
            "name": "DD/MM/YY hh:mm"
        }]).setAttr("style", "top: 10px; left: 10px; position: absolute; margin: 0").setAnchors({
            "width": function(w, h) {
                return w - 20 + "px";
            },
            "height": function(w, h) {
                return h - 55 + "px";
            }
        }));
    
        $export("0001-btn", (new Button("Cancel", (function() {
            dlg.close();
            dlg.purge();
            
            ed.focus();
            
        }))).setAttr("style", "bottom: 10px; right: 10px; position: absolute"));
    
        $export("0002-btn", (new Button("Ok", (function() {
            dlg.appHandler( "cmd_insert" );
        }))).setAttr("style", "bottom: 10px; right: 70px; position: absolute"));
    
        var fmtList = $import("0001-dlg").insert($import("0001-drop"));
        $import("0001-dlg").insert($import("0001-btn"));
        $import("0001-dlg").insert($import("0002-btn"));
    
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);
    
        dlg.handlers.cmd_insert = function() {
            if ( !fmtList.value )
                return;
            
            ed.insertContent( ( new Date() ).toString( fmtList.value ) );
            
            dlg.close();
            dlg.purge();
            
            ed.focus();
        }
        
        Keyboard.bindKeyboardHandler( dlg, "enter", dlg.handlers.cmd_insert );
        Keyboard.bindKeyboardHandler( dlg, "esc", function() {
            dlg.close();
            dlg.purge();
            
            ed.focus();
        } );
    
        return dlg;

    }
}