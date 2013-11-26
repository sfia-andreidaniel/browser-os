function CSSEditor_cmd_edit_colors( app ) {
    
    app.handlers.cmd_edit_colors = function( hasBackground, hasColor, integrationSettings ) {
    
        if (!hasBackground && !hasColor)
            return;
    
        integrationSettings = integrationSettings || {};
    
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

        var height = 70;
        
        height += hasColor ? 70 : 0;
        height += hasBackground ? 220 : 0;

        var colorTop = 0;
        var backgroundTop = 0;
        
        if ( hasColor )
            colorTop = 30;
        
        if ( hasBackground )
            backgroundTop = colorTop ? ( colorTop + 75 ) : 30;

        var dlg = $export("0001-dlg", (new Dialog({
            "alwaysOnTop": false,
            "appIcon": "",
            "caption": "Background and Color",
            "closeable": true,
            "height": height,
            "maximizeable": true,
            "maximized": false,
            "minHeight": height,
            "minWidth": 400,
            "minimizeable": true,
            "modal": false,
            "moveable": true,
            "resizeable": true,
            "scrollable": false,
            "visible": true,
            "width": 400,
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
    
        if ( hasColor ) {
        
            $export("0001-holder", (new DOMPlaceable({
                "caption": "Color",
                "appearence": "opaque"
            })).setAttr("style", "top: " + colorTop + "px; left: 10px; right: 10px; position: absolute; height: 45px"));
        
            $export("0002-lbl", (new DOMLabel("Color:")).setAttr("style", "top: 15px; left: 10px; width: 120px; position: absolute; text-overflow: ellipsis"));
        
            var color = $export("0001-text", (new CSSColorInput( attributes.color )).setAttr("style", "top: 10px; left: 140px; position: absolute; margin: 0; width: auto; right: 10px"));
        }
    
        if ( hasBackground ) {
        
            $export("0002-holder", (new DOMPlaceable({
                "caption": "Background",
                "appearence": "opaque"
            })).setAttr("style", "top: " + backgroundTop + "px; left: 10px; right: 10px; position: absolute; bottom: 40px"));
    
            $export("0003-lbl", (new DOMLabel("BG Color:")).setAttr("style", "top: 15px; left: 10px; width: 120px; position: absolute; text-overflow: ellipsis"));
            $export("0004-lbl", (new DOMLabel("BG Image:")).setAttr("style", "top: 50px; left: 10px; width: 120px; position: absolute; text-overflow: ellipsis"));
            $export("0005-lbl", (new DOMLabel("BG Position (X / Y):")).setAttr("style", "top: 85px; left: 10px; width: 120px; position: absolute; text-overflow: ellipsis"));
            $export("0006-lbl", (new DOMLabel("BG Repeat:")).setAttr("style", "top: 120px; left: 10px; width: 120px; position: absolute; text-overflow: ellipsis"));
            $export("0007-lbl", (new DOMLabel("BG Attachment:")).setAttr("style", "top: 155px; left: 10px; width: 120px; position: absolute; text-overflow: ellipsis"));

            var backgroundColor = $export("0002-text", (new CSSColorInput(attributes['background-color'])).setAttr("style", "top: 10px; left: 140px; position: absolute; margin: 0; width: auto; right: 10px"));

            var backgroundImage = $export("0003-text", (new CSSSourceInput(attributes['background-image'], ( function() {
                
                var cfg = {
                    "urlFormat": true,
                    "contentType": /^image(\/|$)/i
                };
                
                /*
                {
                "urlFormat": true,
                "allowBrowse": true,
                "browseCallback": function() {
                    console.log( "Browse: ", Array.prototype.slice.call( arguments, 0 ) );
                },
                "allowUpload": true,
                "uploadCallback": function() {
                    console.log("Upload: ", Array.prototype.slice.call( arguments, 0 ) );
                },
                "allowEmbed": true,
                "maxEmbedSize": 65534,
                "contentType": /^image(\/|$)/i
                }
                */
                
                for ( var key in integrationSettings ) {
                    if ( integrationSettings.propertyIsEnumerable( key ) )
                        cfg[ key ] = integrationSettings[ key ];
                }
                
                return cfg;
                
            } )())).setAttr("style", "top: 45px; left: 140px; position: absolute; margin: 0; width: auto; right: 10px") );

            var backgroundPositionX = $export("0004-text", (new CSSDimensionInput('')).setAttr("style", "top: 80px; left: 140px; position: absolute; margin: 0; width: auto;")
                .setAnchors({
                    "width": function(w,h) {
                        return (w - 160) / 2 + 5 + "px";
                    }
                })
                .setProperty('value', attributes['background-position-x'])
            );

            var backgroundPositionY = $export("0004a-text", (new CSSDimensionInput('')).setAttr("style", "top: 80px; position: absolute; margin: 0; width: auto;")
                .setAnchors({
                    "width": function(w,h) {
                        return (w - 160) / 2 + "px";
                    },
                    "left": function(w,h) {
                        return (w - 160) / 2 + 150 + "px";
                    }
                })
                .setProperty('value', attributes['background-position-y'])
            );
            
            
            var backgroundRepeat = $export("0005-text", (new DropDown([
                {
                    "id": "",
                    "name": "Unspecified"
                },
                {
                    "id": "inherit",
                    "name": "Inherited from parent"
                },
                {
                    "id": "repeat",
                    "name": "Tiles"
                },
                {
                    "id": "repeat-x",
                    "name": "Horizontal"
                },
                {
                    "id": "repeat-y",
                    "name": "Vertical"
                },
                {
                    "id": "no-repeat",
                    "name": "None"
                }
            ])).setAttr("style", "top: 115px; left: 140px; position: absolute; margin: 0; width: auto; right: 10px")
               .setProperty( "value", attributes['background-repeat'] ) );

            var backgroundAttachment = $export("0006-text", (new DropDown([
                {
                    "id": "",
                    "name": "Unspecified"
                },
                {
                    "id": "inherit",
                    "name": "Inherited from parent"
                },
                {
                    "id": "scroll",
                    "name": "Scroll"
                },
                {
                    "id": "fixed",
                    "name": "Fixed"
                }
            ])).setAttr("style", "top: 150px; left: 140px; position: absolute; margin: 0; width: auto; right: 10px")
               .setProperty( "value", attributes['background-attachment'] ));
        
        }
        
        $export("0001-btn", (new Button("Ok", (function() {
            
            dlg.appHandler( "cmd_ok" );
            
        }))).setAttr("style", "bottom: 10px; right: 75px; position: absolute; font-weight: bold"));
        
        $export("0002-btn", (new Button("Cancel", (function() {
            
            dlg.close();
            
        }))).setAttr("style", "bottom: 10px; right: 10px; position: absolute"));
    
        if ( hasColor ) {
            $import("0001-dlg").insert($import("0001-holder"));
            $import("0001-holder").insert($import("0002-lbl"));
            $import("0001-holder").insert($import("0001-text"));
        }
        
        if ( hasBackground ) {
            $import("0001-dlg").insert($import("0002-holder"));
            $import("0002-holder").insert($import("0003-lbl"));
            $import("0002-holder").insert($import("0002-text"));
            $import("0002-holder").insert($import("0004-lbl"));
            $import("0002-holder").insert($import("0005-lbl"));
            $import("0002-holder").insert($import("0006-lbl"));
            $import("0002-holder").insert($import("0007-lbl"));
            $import("0002-holder").insert($import("0003-text"));
            $import("0002-holder").insert($import("0004-text"));
            $import("0002-holder").insert($import("0004a-text"));
            $import("0002-holder").insert($import("0005-text"));
            $import("0002-holder").insert($import("0006-text"));
        }
        
        dlg.handlers.cmd_ok = function() {
            
            if ( hasColor ) {
                attributes['color'] = color.value;
            }
            
            if ( hasBackground ) {
                attributes['background-color'] = backgroundColor.value;
                attributes['background-image'] = backgroundImage.value;
                attributes['background-position-x'] = backgroundPositionX.value;
                attributes['background-position-y'] = backgroundPositionY.value;
                attributes['background-repeat'] = backgroundRepeat.value;
                attributes['background-attachment'] = backgroundAttachment.value;
            }
            
            dlg.close();
        };
        
        dlg.closeCallback = function() {
        
            setTimeout( function() {
                
                dlg.purge();
                dlg = undefined;
                attributes = undefined;
                
            }, 10 );
        
            return true;
        };
        
        Keyboard.bindKeyboardHandler( dlg, "enter", function() {
            dlg.appHandler( "cmd_ok" );
        } );
        
        Keyboard.bindKeyboardHandler( dlg, "esc", function() {
            dlg.close();
        } );
        
        $import("0001-dlg").insert($import("0001-btn"));
        $import("0001-dlg").insert($import("0002-btn"));
    
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);
    
        return dlg;
    
    };
}