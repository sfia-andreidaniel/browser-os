function CSSNodeEditor_init_web_tab( app, tabs, opts ) {
    
    var dlg = tabs.getTabById( 'web' ).getSheet();
    
    dlg.style.overflow = 'hidden';

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

    var attributes = app.nodeAttributes;

    if ( opts.id ) {
        $export("0001-lbl", (new DOMLabel("Id:")).setAttr("style", "top: 10px; left: 10px; width: 65px; position: absolute; text-overflow: ellipsis"));
        $export("0001-text", (new TextBox(attributes['id']))
            .setAttr("style", "top: 5px; left: 90px; position: absolute; margin: 0; width: auto; right: 10px")
        );
        dlg.insertTop($import("0001-lbl"), 10);
        var id = dlg.insertTop($import("0001-text"), -5, 20);
        
        $import('0001-text').addCustomEventListener('change', function() {
            attributes.id = this.value;
            return true;
        });
    }
    
    if ( opts['class'] ) {
        $export("0002-lbl", (new DOMLabel("Class:")).setAttr("style", "top: 40px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
        var className = $export("0002-text", (new TextBox( attributes['class'] ))
               .setAttr("style", "top: 35px; left: 90px; position: absolute; width: auto; right: 10px; margin: 0;")
               .chain( function() {
                    this.addCustomEventListener('change', function() {
                        attributes['class'] = this['value'];
                    });
               })
        );
        dlg.insertTop($import("0002-lbl"), 10);
        dlg.insertTop($import("0002-text"), -5, 20);
    }
    
    if ( opts.title ) {
        $export("0003-lbl", (new DOMLabel("Title:")).setAttr("style", "top: 70px; left: 10px; width: 70px; position: absolute; text-overflow: ellipsis"));
        $export("0003-text", (new TextBox(attributes['title'])).setAttr("style", "top: 65px; left: 90px; position: absolute; margin: 0; width: auto; right: 10px"));
        dlg.insertTop($import("0003-lbl"), 10);
        var title = dlg.insertTop($import("0003-text"), -5, 20);
        
        $import('0003-text').addCustomEventListener('change', function() {
            attributes['title'] = this.value;
        });
    }
    
    app.addCustomEventListener('attribute-changed', function(data) {
        if ( data.which == 'id' && opts.id ) {
            id.value = data.value;
        }
        
        else
        
        if ( data.which == 'class' && opts['class'] ) {
            className.value = data.value;
        }
        
        else
        
        if ( data.which == 'title' && opts.title ) {
            title.value = data.value;
        }
        
        return true;
    });

}