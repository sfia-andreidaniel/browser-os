function JSPlatform_Base64Encoder() {

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
        "appIcon": "data:image/gif;base64,R0lGODlhEAAQAOehAAAAAAEBAQICAgMDAwUFBQYGBgcHBwkJCQsLCw8PDxAQEBERERISEhQUFBYWFhcXFxgYGBkZGRoaGhsbGxwcHB4eHh8fHyAgICEhISMjIyQkJCYmJikpKSoqKisrKywsLC4uLjAwMDIyMjU1NTc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+PkJCQkREREVFRUpKSkxMTE1NTVBQUFFRUVJSUlRUVFVVVVdXV1paWlxcXF1dXWBgYGRkZGVlZWhoaGtra21tbXBwcHV1dXZ2dnd3d3l5eXp6ent7e319fX5+foCAgIKCgoSEhIqKiouLi46OjpGRkZKSkpSUlJWVlZmZmZqampubm5ycnJ6enqCgoKKioqOjo6enp6mpqa2tra6urq+vr7CwsLGxsbOzs7S0tLW1tbe3t7i4uLm5ubq6uru7u729vb6+vr+/v8DAwMHBwcPDw8XFxcfHx8rKysvLy83Nzc7Ozs/Pz9DQ0NPT09TU1NXV1dbW1tjY2Nra2tvb293d3d7e3t/f3+Dg4OHh4eLi4uTk5OXl5ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAAEAAQAAAIigBDCRxIsKDBgwgTIgQFSqHATV0SKIg0kM0KSAQ3PSgQZYgkgZQGADBEsAoBR50GgmJxIADJgQp4HDAwp+GhAH8EvAwFCgGALl0CROqEYMSiAIMIeuDwaROBP48ASAVgIKVAQALSYAHQ6FOlRkgARPk08BMVBAjeNAxVCcICEZ4KfiLrsK7duwcDAgA7",
        "caption": "Base64 Encoder / Decoder",
        "closeable": true,
        "height": 335,
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
        "width": 459
    })).chain(function() {
        Object.defineProperty(this, "pid", {
            "get": function() {
                return $pid;
            }
        });
        this.addClass("PID-" + $pid);
    }));

    $export("0001-lbl", (new DOMLabel("Load file:")).setAttr("style", "top: 25px; left: 23px; width: 55px; position: absolute; text-overflow: ellipsis"));

    var iFile = $export("0001-file", (new DOMFile({
        "disabled": false,
        "destination": "memory",
        "dataType": "binary",
        "maxSize": 8097152,
        "mime": "",
        "fileNameRegex": ""
    })).setAttr("style", "top: 20px; left: 85px; position: absolute; right: 115px; margin: 0").chain( function() {
        
        this.addCustomEventListener('change', function() {
            bDataUri.onCustomEvent('change');
            return true;
        });
        
    } ));

    var bDataUri = $export("0001-check", (new DOMCheckBox({
        "valuesSet": "two-states",
        "checked": "true"
    })).setAttr("style", "top: 22px; right: 85px; position: absolute").chain( function() {
        this.addCustomEventListener('change', function() {
            if ( iFile.value ) {
                
                var base64;
                
                var dataURI = 'data:' + iFile.fileMime+';base64,' + ( base64 = btoa( iFile.value ) );
                
                if ( this.checked ) {
                    iBase64.value = dataURI;
                } else {
                    iBase64.value = base64;
                }
                
                hPreview.firstChild.innerHTML = '';
                
                switch (true) {
                    
                    case /^image(\/|$)/.test( iFile.fileMime ):
                        hPreview.firstChild.appendChild( $('img').setProperty( 'src', dataURI ).setAttr('style', 'margin: 10px auto; max-width: 90%; max-height: 90%; height: auto; display: block;') );
                        break;
                    
                    case /^text(\/|$)/.test( iFile.fileMime ):
                        hPreview.firstChild.appendChild( new TextArea( ) ).setProperty('value', atob( base64 ) ).setAnchors( {
                            "width": function(w,h) {
                                return w - 10 + "px";
                            },
                            "height": function(w,h) {
                                return h - 10 + "px";
                            }
                        } ).setAttr('style', 'margin: 5px; border: none; padding: 0;');
                        break;
                }
                
                dlg.paint();
            }
        });
    }));

    $export("0002-lbl", (new DOMLabel("URI Encode", {
    })).setAttr("style", "top: 25px; right: 10px; width: 70px; position: absolute; text-overflow: ellipsis"));

    $export("0001-split", (new Splitter()).setAttr("style", "top: 55px; left: 10px; right: 10px; bottom: 15px; position: absolute; border-color: transparent").chain(function() {
        this.split([202], "V");
        $export("0001-cell", this.cells(0));
        $export("0002-cell", this.cells(1));
    }));

    $export("0001-cell", $import("0001-cell"));

    $export("0003-lbl", (new DOMLabel("Base 64")).setAttr("style", "top: 10px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));

    var iBase64 = $export("0001-text", (new TextBox("")).setAttr("style", "top: 30px; left: 10px; position: absolute; margin: 0; right: 10px"));

    $export("0004-lbl", (new DOMLabel("Convert to Base64")).setAttr("style", "top: 70px; left: 10px; width: 120px; position: absolute; text-overflow: ellipsis"));

    var iText = $export("0002-text", (new TextBox("")).setAttr("style", "top: 90px; left: 10px; position: absolute; margin: 0; right: 10px"));

    iText.addCustomEventListener('change', function() {
        try {
            iBase64.value = btoa( iText.value );
            iBase64.onCustomEvent('change');
        } catch ( e ) {
            iBase64.value = btoa('Input data is not convertable with atob function');
            iBase64.onCustomEvent('change');
        }
    } );
    

    iBase64.addEventListener('focus', function() {
        this.select();
    });

    iBase64.addEventListener('click', function() {
        this.select();
    });

    iBase64.addCustomEventListener('change', function() {
        
        console.log("change");
        
        var value = iBase64.value.replace(/^data:(.*)?;base64,/, '');
        
        var hPreview = $import('0001-holder');
        
        hPreview.firstChild.innerHTML = '';
        
        try {
            
            var unbuffer = atob( value );
            
            if ( !unbuffer )
                throw "null data";
            
            var isBinary = false;
            
            for ( var i=0,len=unbuffer.length; i<len; i++ ) {
                if ( unbuffer.charCodeAt( i ) > 127 ) {
                    isBinary = true;
                }
            }
            
            switch ( isBinary ) {
                
                case false:

                    hPreview.firstChild.appendChild( new TextArea( ) ).setProperty('value', unbuffer ).setAnchors( {
                        "width": function(w,h) {
                            return w - 10 + "px";
                        },
                        "height": function(w,h) {
                            return h - 10 + "px";
                        }
                    } ).setAttr('style', 'margin: 5px; border: none; padding: 0;');
                    break;
                
                case true:
                    hPreview.firstChild.appendChild( $('p').setAttr('style', 'padding: 10px; text-align: center') )
                        .setHTML("Binary data (" + unbuffer.length + " bytes)<br /><br />" )
                        .appendChild( new Button('Save', function() {
                            $_SAVE( value, { 'contentType': "application/octet-stream", "name": "data.bin", "encType": "base64" } );
                        } ) );
                    break;
                
            }
            
        } catch (e) {
            
            hPreview.firstChild.appendChild( $('p').setAttr('style', 'color: red; padding: 10px; text-align: center')
                .setHTML("Bad base64 data!") );
            
        }
        
        dlg.paint();
        
    });

    $export("0002-cell", $import("0002-cell"));

    var hPreview = $export("0001-holder", (new DOMPlaceable({
        "caption": "Preview",
        "appearence": "opaque"
    })).setAttr("style", "top: 20px; left: 10px; right: 4px; position: absolute; bottom: 2px"));

    $import("0001-dlg").insert($import("0001-lbl"));
    $import("0001-dlg").insert($import("0001-file"));
    $import("0001-dlg").insert($import("0002-lbl"));
    $import("0001-dlg").insert($import("0001-check"));
    $import("0001-dlg").insert($import("0001-split"));
    $import("0001-split").insert($import("0001-cell"));
    $import("0001-cell").insert($import("0003-lbl"));
    $import("0001-cell").insert($import("0004-lbl"));
    $import("0001-cell").insert($import("0001-text"));
    $import("0001-cell").insert($import("0002-text"));
    $import("0001-split").insert($import("0002-cell"));
    $import("0002-cell").insert($import("0001-holder"));

    setTimeout(function() {
        dlg.paint();
        dlg.ready();
    }, 1);

    return dlg;

}