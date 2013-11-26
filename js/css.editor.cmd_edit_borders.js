function CSSEditor_cmd_edit_borders( app ) {
    
    app.handlers.cmd_edit_borders = function( ) {
    
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
            "caption": "Border properties",
            "closeable": true,
            "height": 278,
            "maximizeable": false,
            "maximized": false,
            "minHeight": 278,
            "minWidth": 292,
            "minimizeable": false,
            "modal": false,
            "moveable": true,
            "resizeable": true,
            "scrollable": false,
            "visible": true,
            "width": 292,
            "x": app.width + 4,
            "y": 0,
            "childOf": app
        })).chain(function() {
            Object.defineProperty(this, "pid", {
                "get": function() {
                    return $pid;
                }
            });
            this.addClass("PID-" + $pid);
        }));
    
        var attributes = app.nodeAttributes;
    
        $export("0001-tabs", (new TabPanel({
            "initTabs": [{
                "id": "0001-sheet",
                "caption": "Width",
                "closeable": false
            }, {
                "id": "0002-sheet",
                "caption": "Style",
                "closeable": false
            }, {
                "id": "0003-sheet",
                "caption": "Color",
                "closeable": false
            }, {
                "id": "0004-sheet",
                "caption": "Corners Radius",
                "closeable": false
            }]
        })).chain(function() {
            $export("0001-sheet", this.getTabById("0001-sheet").getSheet());
            $export("0002-sheet", this.getTabById("0002-sheet").getSheet());
            $export("0003-sheet", this.getTabById("0003-sheet").getSheet());
            $export("0004-sheet", this.getTabById("0004-sheet").getSheet());
        }).setAttr("style", "top: 10px; left: 10px; right: 10px; bottom: 40px; position: absolute"));
    
        $export("0001-sheet", $import("0001-sheet"));

        var borderTopWidth    = $export("border-top-width",           ( new CSSDimensionInput( attributes['border-top-width'] ) ).setAttr("style", "top: 10px; left: 80px; position: absolute; width: auto; right: 10px;") );
        var borderRightWidth  = $export("border-right-width",         ( new CSSDimensionInput( attributes['border-right-width'] ) ).setAttr("style", "top: 40px; left: 80px; position: absolute; width: auto; right: 10px;") );
        var borderBottomWidth = $export("border-bottom-width",        ( new CSSDimensionInput( attributes['border-bottom-width'] ) ).setAttr("style", "top: 70px; left: 80px; position: absolute; width: auto; right: 10px;") );
        var borderLeftWidth   = $export("border-left-width",          ( new CSSDimensionInput( attributes['border-left-width'] ) ).setAttr("style", "top: 100px; left: 80px; position: absolute; width: auto; right: 10px;") );
        var autoWidth         = $export("border-width-same",          ( new DOMCheckBox() ).setAttr("style", "left: 6px; bottom: 8px; position: absolute") );
        $export("0001-lbl", (new DOMLabel("Top:")).setAttr("style", "top: 10px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
        $export("0002-lbl", (new DOMLabel("Right:")).setAttr("style", "top: 40px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
        $export("0003-lbl", (new DOMLabel("Bottom:")).setAttr("style", "top: 70px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
        $export("0004-lbl", (new DOMLabel("Left:")).setAttr("style", "top: 100px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
        $export("0005-lbl", (new DOMLabel("All border-widths are the same", { "for": $import( 'border-width-same' ) })).setAttr("style", "bottom: 10px; left: 30px; width: auto; position: absolute; text-overflow: ellipsis"));

        autoWidth.addCustomEventListener('change', function() {
            if ( autoWidth.checked ) {
                borderRightWidth.value =
                borderBottomWidth.value =
                borderLeftWidth.value =
                borderTopWidth.value;
                
                borderRightWidth.disabled =
                borderBottomWidth.disabled =
                borderLeftWidth.disabled = true;
            } else {
                borderRightWidth.disabled =
                borderBottomWidth.disabled =
                borderLeftWidth.disabled = false;
            }
            
            return true;
        });

        borderTopWidth.addCustomEventListener('change', function() {
            if ( autoWidth.checked){
                borderRightWidth.value =
                borderBottomWidth.value =
                borderLeftWidth.value =
                borderTopWidth.value;
            }
            return true;
        });

        $export("0002-sheet", $import("0002-sheet"));

        var borderTopStyle    = $export("border-top-style",           ( new CSSBorderStyleInput( attributes['border-top-style'] ) ).setAttr("style", "top: 10px; left: 80px; position: absolute; width: auto; right: 10px;") );
        var borderRightStyle  = $export("border-right-style",         ( new CSSBorderStyleInput( attributes['border-right-style'] ) ).setAttr("style", "top: 40px; left: 80px; position: absolute; width: auto; right: 10px;") );
        var borderBottomStyle = $export("border-bottom-style",        ( new CSSBorderStyleInput( attributes['border-bottom-style'] ) ).setAttr("style", "top: 70px; left: 80px; position: absolute; width: auto; right: 10px;") );
        var borderLeftStyle   = $export("border-left-style",          ( new CSSBorderStyleInput( attributes['border-left-style'] ) ).setAttr("style", "top: 100px; left: 80px; position: absolute; width: auto; right: 10px;") );
        var autoStyle         = $export("border-style-same",          ( new DOMCheckBox() ).setAttr("style", "left: 6px; bottom: 8px; position: absolute") );
        $export("0006-lbl", (new DOMLabel("Top:")).setAttr("style", "top: 10px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
        $export("0007-lbl", (new DOMLabel("Right:")).setAttr("style", "top: 40px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
        $export("0008-lbl", (new DOMLabel("Bottom:")).setAttr("style", "top: 70px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
        $export("0009-lbl", (new DOMLabel("Left:")).setAttr("style", "top: 100px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
        $export("0010-lbl", (new DOMLabel("All border-styles are the same", { "for": $import('border-style-same') })).setAttr("style", "bottom: 10px; left: 30px; width: auto; position: absolute; text-overflow: ellipsis; right: 10px"));

        autoStyle.addCustomEventListener('change', function() {
            if ( autoStyle.checked ) {
                borderRightStyle.value =
                borderBottomStyle.value =
                borderLeftStyle.value =
                borderTopStyle.value;
                
                borderRightStyle.disabled =
                borderBottomStyle.disabled =
                borderLeftStyle.disabled = true;
            } else {
                borderRightStyle.disabled =
                borderBottomStyle.disabled =
                borderLeftStyle.disabled = false;
            }
            
            return true;
        });

        borderTopStyle.addCustomEventListener('change', function() {
            if ( autoStyle.checked ) {
                borderRightStyle.value =
                borderBottomStyle.value =
                borderLeftStyle.value =
                borderTopStyle.value;
            }
            
            return true;
        });

        $export("0003-sheet", $import("0003-sheet"));
        
        var borderTopColor    = $export("border-top-color",           ( new CSSColorInput( attributes['border-top-color'] ) ).setAttr("style", "top: 10px; left: 80px; position: absolute; width: auto; right: 10px;") );
        var borderRightColor  = $export("border-right-color",         ( new CSSColorInput( attributes['border-right-color'] ) ).setAttr("style", "top: 40px; left: 80px; position: absolute; width: auto; right: 10px;") );
        var borderBottomColor = $export("border-bottom-color",        ( new CSSColorInput( attributes['border-bottom-color'] ) ).setAttr("style", "top: 70px; left: 80px; position: absolute; width: auto; right: 10px;") );
        var borderLeftColor   = $export("border-left-color",          ( new CSSColorInput( attributes['border-left-color'] ) ).setAttr("style", "top: 100px; left: 80px; position: absolute; width: auto; right: 10px;") );
        var autoColor         = $export("border-color-same",          ( new DOMCheckBox() ).setAttr("style", "left: 6px; bottom: 8px; position: absolute") );
        $export("0011-lbl", (new DOMLabel("Top:")).setAttr("style", "top: 10px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
        $export("0012-lbl", (new DOMLabel("Right:")).setAttr("style", "top: 40px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
        $export("0013-lbl", (new DOMLabel("Bottom:")).setAttr("style", "top: 70px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
        $export("0014-lbl", (new DOMLabel("Left:")).setAttr("style", "top: 100px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
        $export("0015-lbl", (new DOMLabel("All border-colors are the same", { "for": $import('border-color-same') })).setAttr("style", "bottom: 10px; left: 30px; width: auto; position: absolute; text-overflow: ellipsis; right: 10px"));

        autoColor.addCustomEventListener('change', function() {
            if ( autoColor.checked ) {
                borderRightColor.value =
                borderBottomColor.value =
                borderLeftColor.value =
                borderTopColor.value;
                
                borderRightColor.disabled =
                borderBottomColor.disabled =
                borderLeftColor.disabled = true;
            } else {
                borderRightColor.disabled = 
                borderBottomColor.disabled =
                borderLeftColor.disabled = false;
            }
            
            return true;
        });

        borderTopColor.addCustomEventListener('change', function() {
            if ( autoColor.checked ) {
                borderRightColor.value =
                borderBottomColor.value =
                borderLeftColor.value =
                borderTopColor.value;
            }
            return true;
        });

        $export("0004-sheet", $import("0004-sheet"));
        
        var borderTopLeftRadius     = $export("border-top-left-radius",     ( new CSSDimensionInput( attributes['border-top-left-radius'] ) ).setAttr("style", "top: 10px; left: 80px; position: absolute; width: auto; right: 10px;") );
        var borderTopRightRadius    = $export("border-top-right-radius",    ( new CSSDimensionInput( attributes['border-top-right-radius'] ) ).setAttr("style", "top: 40px; left: 80px; position: absolute; width: auto; right: 10px;") );
        var borderBottomRightRadius = $export("border-bottom-right-radius", ( new CSSDimensionInput( attributes['border-bottom-right-radius'] ) ).setAttr("style", "top: 70px; left: 80px; position: absolute; width: auto; right: 10px;") );
        var borderBottomLeftRadius  = $export("border-bottom-left-radius",  ( new CSSDimensionInput( attributes['border-bottom-left-radius'] ) ).setAttr("style", "top: 100px; left: 80px; position: absolute; width: auto; right: 10px;") );
        var autoRadius              = $export("border-radius-same",         ( new DOMCheckBox() ).setAttr("style", "left: 6px; bottom: 8px; position: absolute") );

        autoRadius.addCustomEventListener('change', function() {
            if ( autoRadius.checked ) {
                borderTopRightRadius.value =
                borderBottomRightRadius.value =
                borderBottomLeftRadius.value =
                borderTopLeftRadius.value;
                
                borderTopRightRadius.disabled =
                borderBottomRightRadius.disabled =
                borderBottomLeftRadius.disabled = true;
            } else {
                borderTopRightRadius.disabled =
                borderBottomRightRadius.disabled =
                borderBottomLeftRadius.disabled = false;
            }
            
            return true;
        });
        
        borderTopLeftRadius.addCustomEventListener('change', function() {
            if ( autoRadius.checked ) {
                borderTopRightRadius.value =
                borderBottomRightRadius.value =
                borderBottomLeftRadius.value =
                borderTopLeftRadius.value;
            }
            return true;
        });

        $export("0016-lbl", (new DOMLabel("Top-Left:")).setAttr("style", "top: 10px; left: 10px; width: 60px; position: absolute; text-overflow: ellipsis"));
        $export("0017-lbl", (new DOMLabel("Top-Right:")).setAttr("style", "top: 40px; left: 10px; width: 60px; position: absolute; text-overflow: ellipsis"));
        $export("0018-lbl", (new DOMLabel("Btm-Right:")).setAttr("style", "top: 70px; left: 10px; width: 60px; position: absolute; text-overflow: ellipsis"));
        $export("0019-lbl", (new DOMLabel("Btm-Left:")).setAttr("style", "top: 100px; left: 10px; width: 60px; position: absolute; text-overflow: ellipsis"));
        $export("0020-lbl", (new DOMLabel("All border-radiuses are the same", { "for": $import("border-radius-same") })).setAttr("style", "bottom: 10px; left: 30px; width: auto; position: absolute; text-overflow: ellipsis; right: 10px"));

        $export("0001-btn", (new Button("Ok", (function() {
            dlg.appHandler('cmd_ok');
        }))).setAttr("style", "bottom: 10px; right: 70px; position: absolute; font-weight: bold"));
        $export("0002-btn", (new Button("Cancel", (function() {
            dlg.close();
        }))).setAttr("style", "bottom: 10px; right: 10px; position: absolute"));

        $import("0001-dlg").insert($import("0001-tabs"));

        $import("0001-tabs").insert($import("0001-sheet"));
        
        $import("0001-sheet").insert($import("0001-lbl"));
        $import("0001-sheet").insert($import("border-top-width"));
        $import("0001-sheet").insert($import("border-right-width"));
        $import("0001-sheet").insert($import("border-bottom-width"));
        $import("0001-sheet").insert($import("border-left-width"));
        $import("0001-sheet").insert($import("border-width-same"));
        $import("0001-sheet").insert($import("0002-lbl"));
        $import("0001-sheet").insert($import("0003-lbl"));
        $import("0001-sheet").insert($import("0004-lbl"));
        $import("0001-sheet").insert($import("0005-lbl"));

        $import("0001-tabs").insert($import("0002-sheet"));
        
        $import("0002-sheet").insert($import("0006-lbl"));
        $import("0002-sheet").insert($import("0007-lbl"));
        $import("0002-sheet").insert($import("0008-lbl"));
        $import("0002-sheet").insert($import("0009-lbl"));
        $import("0002-sheet").insert($import("0010-lbl"));
        $import("0002-sheet").insert($import("border-top-style"));
        $import("0002-sheet").insert($import("border-right-style"));
        $import("0002-sheet").insert($import("border-bottom-style"));
        $import("0002-sheet").insert($import("border-left-style"));
        $import("0002-sheet").insert($import("border-style-same"));

        $import("0001-tabs").insert($import("0003-sheet"));
        
        $import("0003-sheet").insert($import("0011-lbl"));
        $import("0003-sheet").insert($import("0012-lbl"));
        $import("0003-sheet").insert($import("0013-lbl"));
        $import("0003-sheet").insert($import("0014-lbl"));
        $import("0003-sheet").insert($import("0015-lbl"));
        $import("0003-sheet").insert($import("border-top-color"));
        $import("0003-sheet").insert($import("border-right-color"));
        $import("0003-sheet").insert($import("border-bottom-color"));
        $import("0003-sheet").insert($import("border-left-color"));
        $import("0003-sheet").insert($import("border-color-same"));

        $import("0001-tabs").insert($import("0004-sheet"));
        
        $import("0004-sheet").insert($import("0016-lbl"));
        $import("0004-sheet").insert($import("0017-lbl"));
        $import("0004-sheet").insert($import("0018-lbl"));
        $import("0004-sheet").insert($import("0019-lbl"));
        $import("0004-sheet").insert($import("0020-lbl"));
        $import("0004-sheet").insert($import("border-top-left-radius"));
        $import("0004-sheet").insert($import("border-top-right-radius"));
        $import("0004-sheet").insert($import("border-bottom-left-radius"));
        $import("0004-sheet").insert($import("border-bottom-right-radius"));
        $import("0004-sheet").insert($import("border-radius-same"));


        $import("0001-dlg").insert($import("0001-btn"));
        
        $import("0001-dlg").insert($import("0002-btn"));
    
        autoWidth.checked = attributes['border-width'].indexOf( ' ' ) == -1;
        autoStyle.checked = attributes['border-style'].indexOf( ' ' ) == -1;
        autoColor.checked = attributes['border-color'].indexOf( ' ' ) == -1;
        autoRadius.checked = attributes['border-radius'].indexOf( ' ' ) == -1;
        
        autoWidth.onCustomEvent('change');
        autoStyle.onCustomEvent('change');
        autoColor.onCustomEvent('change');
        autoRadius.onCustomEvent('change');
        
        dlg.handlers.cmd_ok = function( ) {
            
            attributes['border-top-width'] = borderTopWidth.value;
            attributes['border-right-width'] = borderRightWidth.value;
            attributes['border-bottom-width'] = borderBottomWidth.value;
            attributes['border-left-width'] = borderLeftWidth.value;
            
            attributes['border-top-style'] = borderTopStyle.value;
            attributes['border-right-style'] = borderRightStyle.value;
            attributes['border-bottom-style'] = borderBottomStyle.value;
            attributes['border-left-style'] = borderLeftStyle.value;
            
            attributes['border-top-color'] = borderTopColor.value;
            attributes['border-right-color'] = borderRightColor.value;
            attributes['border-bottom-color'] = borderBottomColor.value;
            attributes['border-left-color'] = borderLeftColor.value;
            
            attributes['border-top-left-radius'] = borderTopLeftRadius.value;
            attributes['border-top-right-radius'] = borderTopRightRadius.value;
            attributes['border-bottom-left-radius'] = borderBottomLeftRadius.value;
            attributes['border-bottom-right-radius'] = borderBottomRightRadius.value;
            
            dlg.close();
        }
        
        dlg.closeCallback = function() {
            
            setTimeout( function() {
                dlg.purge();
                dlg = undefined;
                attributes = undefined;
            }, 10 );
            
            return true;
        }
    
        Keyboard.bindKeyboardHandler( dlg, 'enter', function() {
            dlg.appHandler('cmd_ok');
        });
        Keyboard.bindKeyboardHandler( dlg, 'esc',   function() {
            dlg.close();
        });
    
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);
    
        return dlg;
    
    };
}