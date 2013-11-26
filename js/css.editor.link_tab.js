function CSSNodeEditor_init_link_tab( app, tabs, opts ) {
    
    var dlg = tabs.getTabById( 'link' ).getSheet();
    
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

    if ( opts.href ) {
        $export("0001-lbl", (new DOMLabel("Hyperlink:")).setAttr("style", "top: 10px; left: 10px; width: 65px; position: absolute; text-overflow: ellipsis"));
        $export("0001-text", (new CSSSourceInput(attributes['href'], ({}).chain( function() {
            this.allowBrowse = opts.integration.allowBrowse;
            this.browseCallback = opts.integration.browseCallback;
        } ))).setAttr("style", "top: 5px; left: 90px; position: absolute; margin: 0; width: auto; right: 10px"));
        dlg.insertTop($import("0001-lbl"), 10);
        dlg.insertTop($import("0001-text"), -5, 20);
        
        $import('0001-text').addCustomEventListener('change', function() {
            attributes.href = this.value;
            return true;
        });
    }
    
    if ( opts.target ) {
        $export("0002-lbl", (new DOMLabel("Target:")).setAttr("style", "top: 40px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
        $export("0002-text", (new DropDown([{
                "id": "",
                "name": "Not Specified"
            } , {
                "id": "_blank",
                "name": "Blank Page ( New Tab )"
            } , {
                "id": "_self",
                "name": "Same Frame"
            } , {
                "id": "_parent",
                "name": "Parent Frame"
            } , {
                "id": "_top",
                "name": "Main Page"
            }]).setProperty('value', [ '_blank', '_self', '_parent', '_top' ].indexOf( attributes.target ) >= 0 ? attributes.target : '' )
               .setAttr("style", "top: 35px; left: 90px; position: absolute; margin: 0; width: auto; right: 10px; padding: 0; margin: 0;")
               .chain( function() {
                    this.addEventListener('change', function() {
                        attributes['target'] = this['value'];
                    });
               }))
        );
        dlg.insertTop($import("0002-lbl"), 10);
        dlg.insertTop($import("0002-text"), -5, 20);
    }
    
    if ( opts.anchor ) {
        $export("0003-lbl", (new DOMLabel("Anchor Text:")).setAttr("style", "top: 70px; left: 10px; width: 70px; position: absolute; text-overflow: ellipsis"));
        $export("0003-text", (new TextBox(attributes['anchor'])).setAttr("style", "top: 65px; left: 90px; position: absolute; margin: 0; width: auto; right: 10px"));
        dlg.insertTop($import("0003-lbl"), 10);
        dlg.insertTop($import("0003-text"), -5, 20);
        
        $import('0003-text').addCustomEventListener('change', function() {
            attributes['anchor'] = this.value;
        });
    }

}