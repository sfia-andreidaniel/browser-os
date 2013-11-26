function CSSEditor_cmd_edit_size( app ) {
    
    app.handlers.cmd_edit_size = function( hasWidth, hasHeight) {
    
        if (!hasWidth && !hasHeight)
            return;
    
        var attributes = app.nodeAttributes;
    
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
            "caption": "Edit Box Size",
            "closeable": true,
            "height": 182,
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
            "width": 201,
            "x": app.width + 2,
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
    
        $export("0001-btn", (new Button("Ok", (function() {
            dlg.appHandler( 'cmd_ok' );
        }))).setAttr("style", "bottom: 10px; right: 75px; position: absolute; font-weight: bold"));
    
        $export("0002-btn", (new Button("Cancel", (function() {
            dlg.close();
        }))).setAttr("style", "bottom: 10px; right: 10px; position: absolute"));
    
        if ( hasWidth ) {
            $export("0001-lbl", (new DOMLabel("Width:")).setAttr("style", "top: 20px; left: 20px; width: 50px; position: absolute; text-overflow: ellipsis"));
            var width = $export("0001-text", (new CSSDimensionInput("")).setAttr("style", "top: 15px; left: 70px; position: absolute; margin: 0; width: auto; right: 20px"));
        }
        
        if ( hasHeight ) {
            $export("0002-lbl", (new DOMLabel("Height:")).setAttr("style", "top: 50px; left: 20px; width: 50px; position: absolute; text-overflow: ellipsis"));
            var height = $export("0002-text", (new CSSDimensionInput("")).setAttr("style", "top: 45px; left: 70px; position: absolute; margin: 0; width: auto; right: 20px"));
        }
    
        var allowAspect = false;
    
        if ( hasWidth && hasHeight ) {
        
            var aspect = $export("0001-check", (new DOMCheckBox({
                "valuesSet": "two-states",
                "checked": "false"
            })).setAttr("style", "top: 80px; left: 17px; position: absolute"));
    
            $export("0003-lbl", (new DOMLabel("Lock aspect ratio", { "for": $import('0001-check') })).setAttr("style", "top: 83px; left: 45px; width: 100px; position: absolute; text-overflow: ellipsis"));
            
            var aspectRatio = null;
            
            width.addCustomEventListener('change', function() {
                try {
                
                    var uw = new CSSUnitConvertor( width.value );
                    var uh = new CSSUnitConvertor( height.value );
                
                    if ( aspectRatio && aspect.checked ) {
                        try {
                        
                            uh.dimension = uw.dimension / aspectRatio;
                            
                            height.value = uh.value;
                            
                        } catch (f) {
                            console.warn("Failed to setup aspect ratio!");
                        }
                    }
                    
                    if ( uw.unit == uh.unit && !uw.readOnly && uw.dimension != 0 && uh.dimension != 0 ) {
                        // Display the aspect ratio
                        aspect.style.display = '';
                        $import('0003-lbl').style.display = '';
                        
                        if (!allowAspect) {
                            
                            try {
                                aspectRatio = uw.dimension / uh.dimension;
                                allowAspect = true;
                                // console.log("Aspect ratio is: ", aspectRatio );
                            } catch (e) {
                                aspect.style.display = 'none';
                                $import('0003-lbl').style.display = 'none';
                                aspect.checked = false;
                            }
                        }
                        
                    } else {
                        // Hide the aspect ratio
                        aspect.style.display = 'none';
                        $import('0003-lbl').style.display = 'none';
                        aspect.checked = false;
                    }

                
                } catch (e) {
                    
                }
                
                return true;
            });

            height.addCustomEventListener('change', function() {
                try {
                
                    var uw = new CSSUnitConvertor( width.value );
                    var uh = new CSSUnitConvertor( height.value );
                    
                    if ( aspectRatio && aspect.checked ) {
                        try {
                        
                            uw.dimension = uh.dimension * aspectRatio;
                            
                            width.value = uw.value;
                            
                        } catch (f) {
                            console.warn("Failed to setup aspect ratio!");
                        }
                    }
                
                    if ( uw.unit == uh.unit && !uw.readOnly && uw.dimension != 0 && uh.dimension != 0 ) {
                        // Display the aspect ratio
                        aspect.style.display = '';
                        $import('0003-lbl').style.display = '';

                        if (!allowAspect) {
                            
                            try {
                                aspectRatio = uw.dimension / uh.dimension;
                                allowAspect = true;
                                // console.log("Aspect ratio is: ", aspectRatio );
                            } catch (e) {
                                aspect.style.display = 'none';
                                $import('0003-lbl').style.display = 'none';
                                aspect.checked = false;
                            }
                        }

                        
                    } else {
                        // Hide the aspect ratio
                        aspect.style.display = 'none';
                        $import('0003-lbl').style.display = 'none';
                        aspect.checked = false;
                    }

                
                } catch (e) {
                    
                }
                
                return true;
            });
            
            aspect.addCustomEventListener('change', function() {
                //console.log("clicked!");
                return true;
            } );
            
        }
        
        if ( hasWidth )
            width.value = attributes['width'];
        
        if ( hasHeight )
            height.value= attributes['height'];
        
        if ( hasWidth )
            width.onCustomEvent('change');
        
        if ( hasHeight )
            height.onCustomEvent('change');
        
        if ( allowAspect ) {
            aspect.click();
        }
        
        dlg.handlers.cmd_ok = function() {
            if ( hasWidth )
                attributes['width'] = width.value;
            if ( hasHeight)
                attributes['height'] = height.value;
            dlg.close();
        }
        
        dlg.closeCallback = function() {
        
            if ( dlg.parentNode ) {
                setTimeout( function() {
                    dlg.purge();
                    dlg = undefined;
                    attributes = undefined;
                }, 10 );
            }
        
            return true;
        }
        
        Keyboard.bindKeyboardHandler( dlg, 'enter', function() {
            dlg.appHandler('cmd_ok');
        } );
        
        Keyboard.bindKeyboardHandler( dlg, 'esc', function() {
            dlg.close();
        });
        
        $import("0001-dlg").insert($import("0001-lbl"));
        $import("0001-dlg").insert($import("0002-lbl"));
        $import("0001-dlg").insert($import("0003-lbl"));
        $import("0001-dlg").insert($import("0001-btn"));
        $import("0001-dlg").insert($import("0002-btn"));
        $import("0001-dlg").insert($import("0001-text"));
        $import("0001-dlg").insert($import("0002-text"));
        $import("0001-dlg").insert($import("0001-check"));
    
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);
    
        return dlg;
    
    };
}