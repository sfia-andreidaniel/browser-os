function CSSNodeEditor_init_video_tab_cmd_select_poster( app, attributes ) {
    
    app.handlers.cmd_select_poster = function() {
    
    if ( !attributes.posters.length ) {
        DialogBox("There are no posters available to choose from!\n\nTry adding a video first", {
            "type": "error",
            "childOf": app,
            "caption": "Error choosing poster"
        });
        return ;
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
        "appIcon": "",
        "caption": "Available video posters",
        "closeable": true,
        "height": 246,
        "maximizeable": false,
        "maximized": false,
        "minHeight": 50,
        "minWidth": 50,
        "minimizeable": false,
        "modal": false,
        "moveable": true,
        "resizeable": true,
        "scrollable": false,
        "visible": true,
        "width": 294,
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

    var sheet = null;

    $export("0001-holder", (new DOMPlaceable({
        "caption": "Click on a poster to select it:",
        "appearence": "opaque"
    })).setAttr("style", "top: 30px; left: 10px; right: 10px; position: absolute").setAnchors({
        "height": function(w, h) {
            return h - 70 + "px";
        }
    })).chain( function() {
        sheet = this.firstChild;
        sheet.style.overflowY = 'scroll';
    } );

    $export("0001-btn", (new Button("Ok", (function() {}))).setAttr("style", "bottom: 10px; right: 70px; position: absolute; font-weight: bold;"));

    $export("0002-btn", (new Button("Cancel", (function() {
        
        dlg.close();
        
    }))).setAttr("style", "bottom: 10px; right: 10px; position: absolute"));

    $export("0001-css", (new JSIde_ApplicationCSS("img { height: 64px; width: auto; border: none; padding: 0; margin: 5px; display: inline-block; } img.selected { outline: 3px solid orange; }")).toString("PID-" + $pid).chain(function() {
        dlg.addCss(this);
    }));

    $import("0001-dlg").insert($import("0001-holder"));
    $import("0001-dlg").insert($import("0001-btn"));
    $import("0001-dlg").insert($import("0002-btn"));

    setTimeout(function() {
        dlg.paint();
        dlg.ready();
    }, 1);
    
    dlg.closeCallback = function() {
        
        setTimeout( function() {
            dlg.purge();
            dlg = undefined;
        }, 30 );
        
        return true;
    }
    
    Keyboard.bindKeyboardHandler( dlg, "esc", function() {
        dlg.close();
    });
    
    for ( var i=0, len=attributes.posters.length; i<len; i++ ) {
        ( function( poster ) {
            
            var img = $('img').setAttr('src', poster );
            
            sheet.appendChild( img );
            
            img.onclick = function() {
                for ( var i=0, imgs = this.parentNode.querySelectorAll( 'img' ), len = imgs.length; i<len; i++ ) {
                    imgs[i].removeClass('selected');
                }
                img.addClass('selected');
            }
            
            img.ondblclick = function() {
                dlg.appHandler('cmd_ok');
            }
            
            if ( poster == attributes['poster'] )
                img.addClass('selected');
            
        } )( attributes.posters[i] );
    }
    
    dlg.handlers.cmd_ok = function() {
        var selected = sheet.querySelector('img.selected');
        
        if (!selected)
            return;
        
        attributes['poster'] = selected.getAttribute('src');
        
        dlg.close();
    }
    
    dlg.selectNext = function() {
        try {
            sheet.querySelector('img.selected').nextSibling.onclick();
        } catch (e){}
    }
    
    dlg.selectPrev = function() {
        try {
            sheet.querySelector('img.selected').previousSibling.onclick();
        } catch (e) {}
    }
    
    Keyboard.bindKeyboardHandler( dlg, 'left', dlg.selectPrev );
    Keyboard.bindKeyboardHandler( dlg, 'up', dlg.selectPrev );
    
    Keyboard.bindKeyboardHandler( dlg, 'right', dlg.selectNext );
    Keyboard.bindKeyboardHandler( dlg, 'down', dlg.selectNext );
    
    Keyboard.bindKeyboardHandler( dlg, 'enter', function() {
        dlg.appHandler('cmd_ok');
    });
    
    return dlg;
    
    }

}