function DocumentEditor_cmd_hyperlink( app ) {

    app.handlers.cmd_hyperlink = function( ) {
        
        var ed = app.activeDocument;

        if ( !ed )
            return;
        else
            ed = ed.editor;
        
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
            "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB90ICQkrB8jJ8l8AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABNElEQVQ4y52STYrCQBCFv4iCdzG6CHiMyr6uEXATXEo2Ax5jep9rCEJMC5F4FnsWmU5ifhyYgqaT6tevXr3qoK4KfFyud8dE7KNNwEwshpcNsN1u2Ucb9tEGgyE5HN0cQVBXBZfr3akq1lrCMOT5uJFcj+9IA+ev00jJ0leOY8jzEGstaboD8g6lMWijctjOAsAYJcssz8eN9erVlNO4WX0RxoxaWPqP9erVyVZ/Q0FNt38yMTnsOEen91M1v7YqmPwzgSeZBM5U7xHMA9pWMKjq9BibOfcrx0MJoyLtSOuqoK4KRMSJfDsRcWVZOudcu4vI239Zlk5EXF0VjYLOg6PLsow0TfkrPG4xPAjDsBGtGnigX/28xy2HBNZa/2gcMFLj8x7XetD34t8e9L0YOj6VA/gBWOzfdfqCxAUAAAAASUVORK5CYII=",
            "caption": "Insert or edit link",
            "closeable": true,
            "height": 201,
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
            "width": 346,
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
    
        $export("0001-lbl", (new DOMLabel("Url:")).setAttr("style", "top: 25px; left: 10px; width: 85px; position: absolute; text-overflow: ellipsis"));
        $export("0002-lbl", (new DOMLabel("Text to display:")).setAttr("style", "top: 60px; left: 10px; width: 85px; position: absolute; text-overflow: ellipsis"));
        $export("0003-lbl", (new DOMLabel("Open in:")).setAttr("style", "top: 100px; left: 10px; width: 85px; position: absolute; text-overflow: ellipsis"));
    
        var textURL = $export("0001-text", (new TextBox("")).setAttr("style", "top: 20px; left: 100px; position: absolute; margin: 0").setProperty("placeholder", "http://www.google.com").setAnchors({
            "width": function(w, h) {
                return w - 180 + "px";
            }
        }));
    
        var textAnchor = $export("0002-text", (new TextBox("")).setAttr("style", "top: 55px; left: 100px; position: absolute; margin: 0").setProperty("placeholder", "Google").setAnchors({
            "width": function(w, h) {
                return w - 115 + "px";
            }
        }));
    
        var dropFrame = $export("0001-drop", (new DropDown(undefined)).setItems([{
            "id": "",
            "name": "Same window"
        }, {
            "id": "_blank",
            "name": "New window"
        }]).setAttr("style", "top: 95px; left: 100px; position: absolute; margin: 0").setAnchors({
            "width": function(w, h) {
                return w - 107 + "px";
            }
        }));
    
        $export("0001-btn", (new Button("Browse", (function() {}))).setAttr("style", "top: 20px; right: 10px; position: absolute"));
        
        $export("0002-btn", (new Button("Cancel", (function() {
            dlg.close();
            dlg.purge();
            ed.focus();
        }))).setAttr("style", "bottom: 10px; right: 10px; position: absolute"));
        
        $export("0003-btn", (new Button("Ok", (function() {
            dlg.appHandler( 'cmd_ok' );
        }))).setAttr("style", "bottom: 10px; right: 70px; position: absolute"));
    
        Keyboard.bindKeyboardHandler( dlg, 'esc', function() {
            dlg.close();
            dlg.purge();
            ed.focus();
        } );
    
        $import("0001-dlg").insert($import("0001-lbl"));
        $import("0001-dlg").insert($import("0002-lbl"));
        $import("0001-dlg").insert($import("0003-lbl"));
        $import("0001-dlg").insert($import("0001-text"));
        $import("0001-dlg").insert($import("0002-text"));
        $import("0001-dlg").insert($import("0001-drop"));
        $import("0001-dlg").insert($import("0001-btn"));
        $import("0001-dlg").insert($import("0002-btn"));
        $import("0001-dlg").insert($import("0003-btn"));
    
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
            
            textURL.focus();
            
        }, 1);
    
        /* Get current node from editor. If the node is an <A> element, we
           populate the values in the dialog */
        
        var nodes = ed.selection.getSelectedBlocks(),
            editHREF = null;
        
        for ( var i=0,len=nodes.length; i<len; i++ ) {
            if ( nodes[i].tagName == 'A' ) {
                editHREF = nodes[i];
                break;
            } else
            if ( editHREF = nodes[i].querySelector('a') )
                break;
        }
        
        if ( editHREF ) {
            textURL.value = editHREF.getAttribute('href');
            textAnchor.value = ( ed.selection.getContent({"format": "text"}) || editHREF.textContent );
            if ( editHREF.target == '_blank' )
                dropFrame.value = '_blank';
        } else {
            textAnchor.value = ed.selection.getContent({"type": "text/plain"});
        }
        
        dlg.handlers.cmd_ok = function() {
            
            if ( !textURL.value ) {
                DialogBox("Please provide a non-empty url!", {
                    "type": "error",
                    "childOf": dlg,
                    "modal": true,
                    "caption": "Provide URL!"
                });
                return;
            }
            
            if ( !textAnchor.value ) {
                DialogBox("Please provide a non-empty anchor text!", {
                    "type": "error",
                    "childOf": dlg,
                    "modal": true,
                    "caption": "Provide anchor!"
                });
                return;
            }
            
            if ( editHREF ) {
            
                editHREF = $('a');
            
                editHREF.setAttribute('href', textURL.value );
                editHREF.appendChild( $text( textAnchor.value ) );
                editHREF.setAttribute('target', dropFrame.value );
                
                ed.selection.setContent( editHREF.outerHTML );
                
            } else {
                
                editHREF = $('a');
                editHREF.setAttribute('href', textURL.value );
                editHREF.appendChild( $text( textAnchor.value ) );
                editHREF.setAttribute('target', dropFrame.value );
                
                ed.selection.setContent( editHREF.outerHTML );
                
            }
            
            dlg.close();
            dlg.purge();
            ed.focus();
            
        }

        Keyboard.bindKeyboardHandler( dlg, 'enter', dlg.handlers.cmd_ok );
        Keyboard.bindKeyboardHandler( dlg, 'esc', function() {
            dlg.close();
            dlg.purge();
            ed.focus();
        } );
    
        return dlg;

    }
    
    app.handlers.cmd_hyperlink_unlink = function() {
        var ed = app.activeDocument;

        if ( !ed )
            return;
        else
            ed = ed.editor;
        
        ed.execCommand('unlink');
    }
    
}