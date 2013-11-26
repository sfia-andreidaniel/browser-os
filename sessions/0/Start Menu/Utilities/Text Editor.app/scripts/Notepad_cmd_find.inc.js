function Notepad_cmd_find( app ) {

    var finder = null;
    
    Object.defineProperty( app, "finder", {
        "get": function() {
            return finder;
        },
        "set": function( dlg ) {
            finder = dlg;
        }
    } );

    app.handlers.cmd_find = function() {

        if ( !app.finder ) {

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
    
        var dlg = app.finder = $export("0001-dlg", (new Dialog({
            "alwaysOnTop": false,
            "appIcon": "data:image/gif;base64,R0lGODlhEAAQAPcAAAAAAAgAAAgIAAgICBAICBAQABAQCBAQEBgYEOfn5+/v5/f37/f39//3//r29v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAA0ALAAAAAAQABAAAAh2ABsIHEiwoMGDCAEoHAjAAICDAhYIYLjgoUEBAAIMRABgYkGFAxYqxGiRYkgDDQAsCDmAYACFAEICODByYUqVIRFUDFCRo8gBFRVWBOpzIc2gDTMGdfgQZkeMKUlibKmyY0mBVQe05Dnyo0SRMD0yVEgTIcKAAAA7",
            "caption": "Find and Replace",
            "closeable": true,
            "height": 305,
            "maximizeable": false,
            "maximized": false,
            "minimizeable": false,
            "modal": false,
            "moveable": true,
            "resizeable": false,
            "scrollable": false,
            "visible": true,
            "width": 354,
            "childOf": app,
            "x": app.width - 100,
            "y": 40
        })).chain(function() {
            Object.defineProperty(this, "pid", {
                "get": function() {
                    return $pid;
                }
            });
            this.addClass("PID-" + $pid);
        }));
    
        ( function() {
            
            var mode = "search";
            
            Object.defineProperty( dlg, "searchMode", {
                "get": function() {
                    return mode;
                },
                "set": function(s){
                    if ( ['search', 'replace'].indexOf( mode ) == -1 )
                        throw "Invalid search mode";
                    
                    mode = s;
                    
                    dlg.focusDefault();
                    
                    dlg.btnReplace.disabled =
                    dlg.btnReplaceAll.disabled =
                        mode != 'replace';
                }
            } );
            
        } )();
    
        $export("0001-tabs", (new TabPanel({
            "initTabs": [{
                "id": "0001-sheet",
                "caption": "Find",
                "closeable": false
            }, {
                "id": "0002-sheet",
                "caption": "Replace",
                "closeable": false
            }]
        })).chain(function() {
            $export("0001-sheet", this.getTabById("0001-sheet").getSheet());
            $export("0002-sheet", this.getTabById("0002-sheet").getSheet());
            
            this.getTabById( '0001-sheet' ).addCustomEventListener( 'activate', function() {
                dlg.searchMode = 'search';
            } );

            this.getTabById( '0002-sheet' ).addCustomEventListener( 'activate', function() {
                dlg.searchMode = 'replace';
            } );
            
            
        }).setAttr("style", "top: 10px; left: 10px; right: 10px; height: 100px; position: absolute"));
    
        $export("0001-sheet", $import("0001-sheet"));
    
        $export("0001-lbl", (new DOMLabel("Find:")).setAttr("style", "top: 10px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
    
        var find1 = dlg.find1 = $export("0001-text", (new TextBox("")).setAttr("style", "top: 5px; left: 50px; position: absolute; margin: 0").setProperty("placeholder", "input search text here").setAnchors({
            "width": function(w, h) {
                return w - 65 + "px";
            }
        }));
    
        $export("0002-sheet", $import("0002-sheet"));
    
        $export("0002-lbl", (new DOMLabel("Find:")).setAttr("style", "top: 10px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
    
        $export("0003-lbl", (new DOMLabel("Replace with:")).setAttr("style", "top: 40px; left: 10px; width: 80px; position: absolute; text-overflow: ellipsis"));
    
        var find2 = dlg.find2 = $export("0002-text", (new TextBox("")).setAttr("style", "top: 5px; left: 95px; position: absolute; margin: 0").setProperty("placeholder", "input search string").setAnchors({
            "width": function(w, h) {
                return w - 110 + "px";
            }
        }));
    
        Object.defineProperty( dlg, "needle", {
            "get": function() {
                return find1.value;
            },
            "set": function(s) {
                find1.value = find2.value = s;
            }
        } );
        
        dlg.focusDefault = function() {
            setTimeout( function() {
                ( dlg.searchMode == 'search' ? find1 : find2 ).focus();
            }, 100 );
        }
    
        var replaceWith = $export("0003-text", (new TextBox("")).setAttr("style", "top: 35px; left: 95px; position: absolute; margin: 0").setProperty("placeholder", "input replacement string").setAnchors({
            "width": function(w, h) {
                return w - 110 + "px";
            }
        }));
    
        $export("0001-btn", (new Button("Find", (function() {
            dlg.appHandler( 'cmd_search' );
        }))).setAttr("style", "top: 125px; right: 10px; position: absolute; width: 95px"));

        dlg.btnReplace = $export("0002-btn", (new Button("Replace", (function() {
            dlg.appHandler( 'cmd_replace' );
        }))).setAttr("style", "top: 150px; right: 10px; position: absolute; width: 95px"));

        dlg.btnReplaceAll = $export("0003-btn", (new Button("Replace All", (function() {
            dlg.appHandler( 'cmd_replace_all' );
        }))).setAttr("style", "top: 175px; right: 10px; position: absolute; width: 95px"));
        
        $export("0004-btn", (new Button("Find Next", (function() {
            dlg.appHandler( 'cmd_find_next' );
        }))).setAttr("style", "top: 200px; right: 10px; position: absolute; width: 95px"));
        
        $export("0005-btn", (new Button("Find Previous", (function() {
            dlg.appHandler( 'cmd_find_previous' );
        }))).setAttr("style", "top: 225px; right: 10px; position: absolute; width: 95px"));
        
        dlg.btnReplace.disabled =
        dlg.btnReplaceAll.disabled = true;
        
        var backwards = $export("0001-check", (new DOMCheckBox({
            "valuesSet": "two-states",
            "checked": "false"
        })).setAttr("style", "top: 120px; left: 10px; position: absolute"));
    
        var wrap = $export("0002-check", (new DOMCheckBox({
            "valuesSet": "two-states",
            "checked": "false"
        })).setAttr("style", "top: 145px; left: 10px; position: absolute"));
    
        var caseSensitive = $export("0003-check", (new DOMCheckBox({
            "valuesSet": "two-states",
            "checked": "false"
        })).setAttr("style", "top: 170px; left: 10px; position: absolute"));
        
        var wholeWord = $export("0004-check", (new DOMCheckBox({
            "valuesSet": "two-states",
            "checked": "false"
        })).setAttr("style", "top: 195px; left: 10px; position: absolute"));
        
        var regExp = $export("0005-check", (new DOMCheckBox({
            "valuesSet": "two-states",
            "checked": "false"
        })).setAttr("style", "top: 220px; left: 10px; position: absolute"));
        
        var skipCurrent = $export("0006-check", (new DOMCheckBox({
            "valuesSet": "two-states",
            "checked": "false"
        })).setAttr("style", "top: 245px; left: 10px; position: absolute"));
        
        $export("0004-lbl", (new DOMLabel("Find Backwards", { "for": backwards })).setAttr("style", "top: 120px; left: 35px; width: 95px; position: absolute; text-overflow: ellipsis"));
        $export("0005-lbl", (new DOMLabel("Search from the start at end", { "for": wrap })).setAttr("style", "top: 145px; left: 35px; width: 190px; position: absolute; text-overflow: ellipsis"));
        $export("0006-lbl", (new DOMLabel("Case sensitive", { "for": caseSensitive })).setAttr("style", "top: 170px; left: 35px; width: 130px; position: absolute; text-overflow: ellipsis"));
        $export("0007-lbl", (new DOMLabel("Whole word", { "for": wholeWord })).setAttr("style", "top: 195px; left: 35px; width: 75px; position: absolute; text-overflow: ellipsis"));
        $export("0008-lbl", (new DOMLabel("Regular Expression", { "for": regExp })).setAttr("style", "top: 220px; left: 35px; width: 115px; position: absolute; text-overflow: ellipsis"));
        $export("0009-lbl", (new DOMLabel("Skip current line at start", { "for": skipCurrent })).setAttr("style", "top: 245px; left: 35px; width: 140px; position: absolute; text-overflow: ellipsis"));
    
        find1.addCustomEventListener('change', function() {
            find2.value = find1.value;
        } );
        
        find2.addCustomEventListener( 'change', function() {
            find1.value = find2.value;
        } );
    
        $import("0001-dlg").insert($import("0001-tabs"));
        $import("0001-tabs").insert($import("0001-sheet"));
        $import("0001-sheet").insert($import("0001-lbl"));
        $import("0001-sheet").insert($import("0001-text"));
        $import("0001-tabs").insert($import("0002-sheet"));
        $import("0002-sheet").insert($import("0002-lbl"));
        $import("0002-sheet").insert($import("0003-lbl"));
        $import("0002-sheet").insert($import("0002-text"));
        $import("0002-sheet").insert($import("0003-text"));
        $import("0001-dlg").insert($import("0001-btn"));
        $import("0001-dlg").insert($import("0002-btn"));
        $import("0001-dlg").insert($import("0003-btn"));
        $import("0001-dlg").insert($import("0004-btn"));
        $import("0001-dlg").insert($import("0005-btn"));
        $import("0001-dlg").insert($import("0004-lbl"));
        $import("0001-dlg").insert($import("0005-lbl"));
        $import("0001-dlg").insert($import("0006-lbl"));
        $import("0001-dlg").insert($import("0007-lbl"));
        $import("0001-dlg").insert($import("0008-lbl"));
        $import("0001-dlg").insert($import("0009-lbl"));
        $import("0001-dlg").insert($import("0001-check"));
        $import("0001-dlg").insert($import("0002-check"));
        $import("0001-dlg").insert($import("0003-check"));
        $import("0001-dlg").insert($import("0004-check"));
        $import("0001-dlg").insert($import("0005-check"));
        $import("0001-dlg").insert($import("0006-check"));
        
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);
        
        dlg.closeCallback = function() {
            dlg.visible = false;
            return false;
        }
        
        
        
        dlg.handlers.cmd_search = function() {
            
            if ( !app.currentFile )
                return;
            
            if ( !dlg.needle ) {
                HighlightElement( search1 );
                HighlightElement( search2 );
                return;
            }
            
            var searchObj = {
                "backwards": backwards.checked,
                "wrap"     : wrap.checked,
                "caseSensitive": caseSensitive.checked,
                "wholeWord": wholeWord.checked,
                "range": null,
                "regExp": regExp.checked,
                "skipCurrent": skipCurrent.checked
            };
            
            app.currentFile.editor.editor.find( dlg.needle, searchObj );

        }
        
        dlg.handlers.cmd_replace = function() {
            
            dlg.appHandler( 'cmd_search' );
            
            if ( !app.currentFile ) {
                return;
            }
            
            app.currentFile.editor.editor.replace( replaceWith.value );
        }
        
        dlg.handlers.cmd_replace_all = function() {
            
            dlg.appHandler( 'cmd_search' );
            
            if ( !app.currentFile ) {
                return;
            }
            
            app.currentFile.editor.editor.replaceAll( replaceWith.value );
        }
        
        dlg.handlers.cmd_find_next = function() {
            if ( !app.currentFile ) {
                return;
            }
            app.currentFile.editor.editor.findNext();
        }
        
        dlg.handlers.cmd_find_previous = function() {
            if ( !app.currentFile ) {
                return;
            }
            app.currentFile.editor.editor.findPrevious();
        }
        
        Keyboard.bindKeyboardHandler( dlg, "enter", dlg.handlers.cmd_search );
        
        } else {
            app.finder.visible = true;
        }
        
        app.finder.focusDefault();
        app.finder.focus();
        
        window.npSearch = app.finder;
        
        return app.finder;
        
    }
    
    Keyboard.bindKeyboardHandler( app, "ctrl f", app.handlers.cmd_find );
}