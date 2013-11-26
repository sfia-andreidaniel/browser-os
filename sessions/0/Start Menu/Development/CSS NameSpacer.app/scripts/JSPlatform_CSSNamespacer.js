function JSPlatform_CSSNamespacer() {

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
        "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90DBhIYAJ0GbxoAAAL8SURBVDjLtZLLa5x1GEbP+5tv7jdmJibpJBNNo4UGaluxSIONCwk2ECJiSzcqtOgiunEhCCYgcVH/AV0EpAvTFo0YdFYiJYUqjcRSXbSYmmoynVTayWTSuXUu33zf68JWxb1ndVZn8zzCA/RrkBf/8upPBwctb+9R03XkWN3xPJ6zPX+0atfOPJN67ivZdXJL6x8j4bf4m/Gj/7i9PvKFnTtStSvzWs8f05/XxnXs0gGduHxYF347XdTN2VGAlZUVAARAFe7deC0Wi9xaVrc5LJG36dyeV9O7LeVOmPc3K/gMLN27qx8NTZeejfYPy4G5AvksRnUSEYhFbs5LwB5WqwfJ76hvrSTG9ZMMGPYEosQ9IU4kR+RsyU79bpkPyWdRVYxIltaNQ+PiZxJjFNsHawuinSrmahTcNsOxFF3eQcrBw8yFX9bFSs8pLb6bFhEMgBW13sMyYFTweqDsIo6DVtaRK/fZF/JSYoiziVfB58hsLQGhp6cBTGN1NIHfZFyvQRGMcSD5CnxWQ5YsuD5AT2GK/Yk3cGoukUZTa47NtXb/iG6C5Qt2B6EQFn0wg2nDlQugQVTDuFteNpYGudiM0Zf2YiIh8aTKWAN2kMg7IYM/tU9aThdNB7FdaBfRyYOAhfj8FBITNAtpaEBmo02p4iN3uZdKMekh6vMYe6OAu9NCGq7ScFWaNp3YEu6pKVrBIa6uHqdegu6aS27Vx6PrHe0YZXf8bgNzum6++e6HC81q/AOtdxytO6ItVU9zC2fv91wanCXmszBe2GU52K7Q2DDyZl+druSPF0Vw5eEDy8tjL4X9O1+6riIgqoodfYo7xRl+PZ9hU9p8cj+g8QBybmaxXi1+nti9f8F+GAgAsbmZ9MkTLzwyHQl5omqD6zhoKIh3YILtrcfIl8LsHbp5O7t4Zvz1qcr1mnXH/XegG8jsyXifPP58dHTsUHz0iX5/OhLw0GjZFIrtW7/k6p9ml7fPn/vWXRfBVsXhv/T1hAXwA0EgAkQBi/+LPwFYfE4zAIlkfwAAAABJRU5ErkJggg==",
        "caption": "CSS Namespacer",
        "closeable": true,
        "height": 345,
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
        "width": 504,
    })).chain(function() {
        Object.defineProperty(this, "pid", {
            "get": function() {
                return $pid;
            }
        });
        this.addClass("PID-" + $pid);
    }));

    $export("0001-split", (new Splitter()).setAttr("style", "top: 65px; left: 0px; right: 0px; bottom: 35px; position: absolute; border: none").chain(function() {
        this.split([240], "V");
        $export("0001-cell", this.cells(0));
        $export("0002-cell", this.cells(1));
    }));

    $import("0001-dlg").insert($import("0001-split"));

    var original = $import("0001-cell").insert( $export("0001-source", (new AceEditor()).setAttr("style", "top: 2px; left: 10px; right: 10px; bottom: 2px; position: absolute").chain(function() {
        this.value = "";
        this.syntax = 'css';
    })).setAnchors( {
        "width": function(w,h) {
            return w - 20 + "px";
        },
        "height": function(w,h) {
            return h + "px";
        }
    } ) );

    var namespaced = $import("0002-cell").insert( $export("0002-source", (new AceEditor()).setAttr("style", "top: 2px; left: 10px; right: 10px; bottom: 2px; position: absolute").chain(function() {
        this.value = "";
        this.syntax = 'css';
    })).setAnchors( {
        "width": function(w,h) {
            return w + "px";
        },
        "height": function(w,h) {
            return h + "px";
        }
    } ) );

    dlg.paint();

    $export("0001-lbl", (new DOMLabel("Add the following text to all rules:")).setAttr("style", "top: 40px; left: 15px; width: 185px; position: absolute; text-overflow: ellipsis"));

    var namespace = $export("0001-text", (new TextBox("")).setAttr("style", "top: 38px; left: 210px; position: absolute; margin: 0; right: 60px").setProperty("placeholder", ".my-css-namespace"));

    $export("0001-btn", (new Button("Add", (function() {
        
        if ( !namespace.value.trim() ) {
            
            namespaced.value = original.value;
            
        } else {
            try {
                namespaced.value = ( new CSS_Modifier( original.value ) ).inject( namespace.value ) + '';
            } catch (e) {
                namespaced.value = '/* Cannot inject modifier: ' + e + ' */';
            }
        }
        
    }))).setAttr("style", "top: 38px; right: 10px; position: absolute; width: 45px"));

    $export("0002-lbl", (new DOMLabel("Load a css file:")).setAttr("style", "top: 10px; left: 15px; width: 160px; position: absolute; text-overflow: ellipsis"));

    var file = $export("0001-file", (new DOMFile({
        "disabled": false,
        "destination": "memory",
        "dataType": "text",
        "maxSize": 2097152,
        "mime": "",
        "fileNameRegex": /\.css$/i
    })).setAttr("style", "top: 10px; left: 210px; position: absolute; right: 10px; margin: 0").chain(function(){
        this.addCustomEventListener('change', function() {
            original.value = this.value;
        });
    }));

    $export("0002-btn", (new Button("Save Namespaced CSS", (function() {
        
        $_SAVE( namespaced.value, {
            "name": ( file.fileName || 'unnamed' ) . replace( /\.css$/i, '' ) + ".branded.css",
            "contentType": "text/css"
        } );
        
    }))).setAttr("style", "bottom: 10px; right: 10px; position: absolute"));

    //$import("0001-split").insert($import("0001-cell"));
    //$import("0001-cell").insert($import("0001-source"));
    //$import("0001-split").insert($import("0002-cell"));
    // $import("0002-cell").insert($import("0002-source"));
    $import("0001-dlg").insert($import("0001-lbl"));
    $import("0001-dlg").insert($import("0001-text"));
    $import("0001-dlg").insert($import("0001-btn"));
    $import("0001-dlg").insert($import("0002-lbl"));
    $import("0001-dlg").insert($import("0001-file"));
    $import("0001-dlg").insert($import("0002-btn"));

    setTimeout(function() {
        dlg.paint();
        dlg.ready();
    }, 1);

    return dlg;

}