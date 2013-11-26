function CSSEditor_cmd_edit_margins( app ) {
    
    app.handlers.cmd_edit_margins = function() {
    
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
        "caption": "Edit Box Margins",
        "closeable": true,
        "height": 227,
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
        "width": 237,
        "childOf": app,
        "y": 0,
        "x": app.width + 2
    })).chain(function() {
        Object.defineProperty(this, "pid", {
            "get": function() {
                return $pid;
            }
        });
        this.addClass("PID-" + $pid);
    }));

    $export("0001-lbl", (new DOMLabel("Top:")).setAttr("style", "top: 20px; left: 20px; width: 40px; position: absolute; text-overflow: ellipsis"));

    $export("0002-lbl", (new DOMLabel("Right:")).setAttr("style", "top: 50px; left: 20px; width: 50px; position: absolute; text-overflow: ellipsis"));

    $export("0003-lbl", (new DOMLabel("Bottom:")).setAttr("style", "top: 80px; left: 20px; width: 50px; position: absolute; text-overflow: ellipsis"));

    $export("0004-lbl", (new DOMLabel("Left:")).setAttr("style", "top: 110px; left: 20px; width: 50px; position: absolute; text-overflow: ellipsis"));

    var attributes = app.nodeAttributes;

    var top    = $export("0001-text", (new CSSDimensionInput()).setAttr("style", "top: 15px; left: 75px; position: absolute; margin: 0; right: 20px"));

    var right  = $export("0002-text", (new CSSDimensionInput()).setAttr("style", "top: 45px; left: 75px; position: absolute; margin: 0; right: 20px"));

    var bottom = $export("0003-text", (new CSSDimensionInput()).setAttr("style", "top: 75px; left: 75px; position: absolute; margin: 0; right: 20px"));

    var left   = $export("0004-text", (new CSSDimensionInput()).setAttr("style", "top: 105px; left: 75px; position: absolute; margin: 0; right: 20px"));

    top.value = attributes['margin-top'];
    right.value = attributes['margin-right'];
    bottom.value = attributes['margin-bottom'];
    left.value = attributes['margin-left'];

    var all = $export("0001-check", (new DOMCheckBox({
        "valuesSet": "two-states",
        "checked": "false"
    })).setAttr("style", "top: 140px; left: 15px; position: absolute"));

    all.addCustomEventListener('change', function(){
        if ( all.value ) {
            
            right.value =
            bottom.value =
            left.value = top.value;
            
            right.disabled =
            bottom.disabled =
            left.disabled = true;
            
        } else {
            
            right.disabled =
            bottom.disabled =
            left.disabled = false;
            
        }
    });

    if ( attributes['margin'].indexOf(' ') == -1 )
        all.click();

    top.addCustomEventListener('change', function() {
    
        if ( all.checked ) {
            left.value =
            right.value =
            bottom.value = 
                top.value;
        }
    
        return true;
    } );

    $export("0005-lbl", (new DOMLabel("Modify all margins", { "for": all })).setAttr("style", "top: 143px; left: 40px; width: auto; position: absolute; text-overflow: ellipsis; right: 20px"));

    $export("0001-btn", (new Button("Ok", (function() { dlg.ok(); }))).setAttr("style", "bottom: 10px; right: 80px; position: absolute; font-weight: bold"));

    $export("0002-btn", (new Button("Cancel", (function() {
        dlg.close();
    }))).setAttr("style", "bottom: 10px; right: 20px; position: absolute"));

    dlg.cancel = function() {
        setTimeout( function(){
            try {
                dlg.close();
                dlg.purge();
                dlg = undefined;
                attributes = undefined;
            } catch (e) {
                
            }
        }, 10 );
    }

    dlg.ok = function() {
        attributes['margin-left'] = left.value;
        attributes['margin-top'] = top.value;
        attributes['margin-bottom'] = bottom.value;
        attributes['margin-right'] = right.value;
        attributes = undefined;
        dlg.close();
    }

    Keyboard.bindKeyboardHandler( dlg, "esc", dlg.close );
    Keyboard.bindKeyboardHandler( dlg, "enter", dlg.ok );

    dlg.closeCallback = function() {
        dlg.cancel();
        return true;
    }

    $import("0001-dlg").insert($import("0001-lbl"));
    $import("0001-dlg").insert($import("0002-lbl"));
    $import("0001-dlg").insert($import("0003-lbl"));
    $import("0001-dlg").insert($import("0004-lbl"));
    $import("0001-dlg").insert($import("0005-lbl"));
    $import("0001-dlg").insert($import("0001-text"));
    $import("0001-dlg").insert($import("0002-text"));
    $import("0001-dlg").insert($import("0003-text"));
    $import("0001-dlg").insert($import("0004-text"));
    $import("0001-dlg").insert($import("0001-check"));
    $import("0001-dlg").insert($import("0001-btn"));
    $import("0001-dlg").insert($import("0002-btn"));

    setTimeout(function() {
        left.focus();
        dlg.paint();
        dlg.ready();
    }, 1);


    return dlg;
    
    };
}