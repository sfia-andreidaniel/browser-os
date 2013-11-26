function VT101Preferences( terminal ) {
    
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
        "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1QoSFSUbRvzYGQAAAilJREFUOMt9k89LVFEUxz93fDMqZEGG0cLAEgpXrly1qEXLNu2C0mqRuggXQWCtgja1DkqwRWKC/gG1LSUIwqI0UCOdsRgrHX2Ome/dX6fFG2dGLQ8c7r3ccz/3ew7nqKHngweNsf3W2u44jhuMMVTcYmz1OXFn3XoUx4+11g8CpdT9o03Hek62tKYztXWAgPBP896xXiySX8o3jk+8vp1bzKYD4PqJltb0la5Opj9Ns5+JJOTTbafo7enN5BazPYGI1CmV4svcHKMvH+HFISJ4cXjvEUnceUHE4b2j80I/qZRCRA4FFXnC1MdZwOG9lEDJ422QF8F5C4B1yVoF8DQ2NSTB3uOxeO/wJUBstgjXlwk3CwA453YCRISpDzP09d7l2cgTlgt5BME5SyH8SRRtJoFKJR/uAXihviHDqzcvuNHVR2FtmcGRh6wVfkGNpf5AbQlAKYVdAC+e2el5Vn/8oaP9HJmglveTnxHvy49Qle2eFBAgcNzsvsXw2ABvJycI0gqoKSlXOxS43UUE+Dr7jUtXL4IIKHg3PlO+0zrmzPn28tk5v6sGgPMuqZFKAdBxtq1KukKlUvsoECiubv2/Davy31EDpZQGqW8+3szCwkK5XfezxiOHieIIpdTvANRwNjd/bWxsNNjYKBKGIWG4RhRFGGuw1mK3J9FarDVoo1lZKWjgaSDi7+SXvpPNzV82xmS01pVRNqYM2R5lrTVGm9hYOyQi9/4C16KCF5hN9R0AAAAASUVORK5CYII=",
        "caption": "VT100 Terminal Preferences",
        "closeable": true,
        "height": 387,
        "maximizeable": true,
        "maximized": false,
        "minHeight": 387,
        "minWidth": 391,
        "minimizeable": false,
        "modal": false,
        "moveable": true,
        "resizeable": false,
        "scrollable": false,
        "visible": true,
        "width": 391,
        "childOf": getOwnerWindow( terminal )
    })).chain(function() {
        Object.defineProperty(this, "pid", {
            "get": function() {
                return $pid;
            }
        });
        this.addClass("PID-" + $pid);
    }));

    console.log( terminal.font );
    var oldPalette = CRTProto.palette;

    var properties = $export("0001-properties", (new PropertyGrid([{
        "name": "fonts",
        "label": "Fonts",
        "items": [{
            "name": "fontFace",
            "type": "dropdown",
            "label": "Font Face",
            "value": /^[\d]+px (.*)$/.exec( terminal.font )[1],
            "values": [{
                "id": "monospace",
                "name": "Monospace"
            }, {
                "id": "courier new",
                "name": "Courier New"
            }, {
                "id": "ubuntu mono",
                "name": "Ubuntu Mono"
            }]
        }, {
            "name": "fontSize",
            "type": "int",
            "label": "Font Size",
            "value": /^([\d]+)px/.exec( terminal.font )[1],
            "min": 10,
            "max": 18
        }, {
            "name": "charWidth",
            "type": "int",
            "label": "Font Width",
            "value": terminal.charWidth || 6,
            "min": 6,
            "max": 20
        }, {
            "name": "charHeight",
            "type": "int",
            "label": "Font Height",
            "value": terminal.charHeight || 6,
            "min": 6,
            "max": 20
        }]
    }, {
        "name": "colors",
        "label": "Colors",
        "items": [{
            "name": "palette",
            "type": "dropdown",
            "label": "Palette",
            "value": CRTProto.palette || "linux",
            "values": [{
                "id": "linux",
                "name": "Linux"
            }, {
                "id": "tango",
                "name": "Tango"
            }, {
                "id": "xterm",
                "name": "XTerm"
            }, {
                "id": "rxvt",
                "name": "Rxvt"
            }]
        }]
    }, {
        "name": "compat",
        "label": "Compatibility",
        "items": [{
            "name": "bs",
            "type": "dropdown",
            "label": "Backspace key",
            "value": "",
            "values": [{
                "id": "",
                "name": "Auto"
            }, {
                "id": "ctrlh",
                "name": "Control H"
            }, {
                "id": "del",
                "name": "Ascii DEL"
            }, {
                "id": "escape",
                "name": "Escape Sequence"
            }, {
                "id": "ttyerase",
                "name": "TTY Erase"
            }]
        }, {
            "name": "del",
            "type": "dropdown",
            "label": "Delete Key",
            "value": "",
            "values": [{
                "id": "",
                "name": "Auto"
            }, {
                "id": "ctrlh",
                "name": "Control H"
            }, {
                "id": "del",
                "name": "Ascii DEL"
            }, {
                "id": "escape",
                "name": "Escape Sequence"
            }, {
                "id": "ttyerase",
                "name": "TTY Erase"
            }]
        }]
    }])).chain(function() {
        this.hasToolbar = false;
        this.splitPosition = 140;
    }).setAttr("style", "top: 10px; left: 10px; position: absolute").setAnchors({
        "width": function(w, h) {
            return w - 20 + "px";
        },
        "height": function(w, h) {
            return h - 145 + "px";
        }
    }));

    var save = function() {
        terminal.font = frameBuffer.font;
        terminal.charWidth = frameBuffer.charWidth;
        terminal.charHeight= frameBuffer.charHeight;
        
        var storage = userStorage.getItem('VT101',{});
        storage.font = frameBuffer.font;
        storage.charWidth = frameBuffer.charWidth;
        storage.charHeight= frameBuffer.charHeight;
        storage.palette = properties.values.colors.palette;
        userStorage.setItem("VT101", storage );
    }

    $export("0001-btn", (new Button("Ok", (function() {
        save();
        dlg.close();
    }))).setAttr("style", "bottom: 10px; left: 10px; position: absolute"));

    $export("0003-btn", (new Button("Apply", (function() {
        save();
    }))).setAttr("style", "bottom: 10px; left: 50px; position: absolute"));

    $export("0002-btn", (new Button("Cancel", (function() {
        CRTProto.setPalette( oldPalette );
        dlg.close();
        dlg.purge();
    }))).setAttr("style", "bottom: 10px; right: 10px; position: absolute"));

    var holder = $export("0001-holder", (new DOMPlaceable({
        "caption": "Preview",
        "appearence": "groove"
    })).setAttr("style", "top: 255px; left: 10px; right: 10px; position: absolute; height: 60px"));

    var frameBuffer = window.frameBuffer = holder.insert( new VT101() .setAnchors({
        "width": function( w,h ) {
            return w - 4 + "px";
        },
        "height": function(w,h ){
            return h - 4 + "px";
        }
    }) );
    
    frameBuffer.addContextMenu(function(){ return [] });
    frameBuffer.cursorNeedsShowing = false;
    
    frameBuffer.update = throttle( function() {
        frameBuffer.font = properties.values.fonts.fontSize + "px " + properties.values.fonts.fontFace;
        frameBuffer.charWidth = properties.values.fonts.charWidth;
        frameBuffer.charHeight= properties.values.fonts.charHeight;
        frameBuffer.reset();
        setTimeout( function(){ 
            frameBuffer.receive( ("The quick brown fox jumps Over the lazy dog 0123456789").substr(0,frameBuffer.cols) + "\r\nColors: ");
            for ( var i=0; i<16; i++ ) {
                frameBuffer.attr = (frameBuffer.attr & ~0xF0) | ( i << 4 );
                frameBuffer.receive(' ');
            }
            frameBuffer.cursorNeedsShowing = false;
        }, 55 );
    }, 100);

    properties.inputs.fonts.fontFace.onchange = function() {
        properties.values.fonts.charWidth = CRTProto.getFontWidthHeight( properties.values.fonts.fontFace, properties.values.fonts.fontSize + "px" ).width;
        properties.values.fonts.charHeight = CRTProto.getFontWidthHeight( properties.values.fonts.fontFace, properties.values.fonts.fontSize + "px" ).height;
        frameBuffer.update.run();
    };
    
    properties.inputs.fonts.fontSize.addCustomEventListener('change', function() {
        properties.values.fonts.charWidth = CRTProto.getFontWidthHeight( properties.values.fonts.fontFace, properties.values.fonts.fontSize + "px" ).width;
        properties.values.fonts.charHeight = CRTProto.getFontWidthHeight( properties.values.fonts.fontFace, properties.values.fonts.fontSize + "px" ).height;
        frameBuffer.update.run();
    });
    
    properties.inputs.fonts.charWidth.addCustomEventListener('change', function() {
        frameBuffer.update.run();
    });

    properties.inputs.fonts.charHeight.addCustomEventListener('change', function() {
        frameBuffer.update.run();
    });
    
    properties.inputs.colors.palette.addCustomEventListener('change', function() {
        CRTProto.setPalette( properties.values.colors.palette );
    });
    
    $import("0001-dlg").insert($import("0001-properties"));
    $import("0001-dlg").insert($import("0001-btn"));
    $import("0001-dlg").insert($import("0002-btn"));
    $import("0001-dlg").insert($import("0003-btn"));
    $import("0001-dlg").insert($import("0001-holder"));

    dlg.paint();
    
    frameBuffer.update.run();
    
    dlg.closeCallback = function() {
        frameBuffer.destroy();
        return true;
    }
    
    return dlg;
    
};