function CSSNodeEditor_init_image_tab( app, tabs, opts ) {
    
    console.log( "Image: ", opts );
    
    var dlg = tabs.getTabById( 'image' ).getSheet();
    
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

    $export("0001-lbl", (new DOMLabel("Source:")).setAttr("style", "top: 25px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
    $export("0002-lbl", (new DOMLabel("Alternate text:")).setAttr("style", "top: 58px; left: 10px; width: 80px; position: absolute; text-overflow: ellipsis"));

    var source = $export("0001-text", (new CSSSourceInput(attributes['src'], ( function( integrationSettings ) {

        var cfg = {
            "contentType": /^image(\/|$)/i
        };

        for ( var key in integrationSettings ) {
            if ( integrationSettings.propertyIsEnumerable( key ) )
                cfg[ key ] = integrationSettings[ key ];
        }

        return cfg;

    } )( opts.integration || {} ))).setAttr("style", "top: 20px; left: 95px; position: absolute; margin: 0; width: auto; right: 10px"));

    source.addCustomEventListener('change', function() {
        attributes['src'] = source.value;
        return true;
    });
    
    var alt = $export("0002-text", (new TextBox(attributes['alt'])).setAttr("style", "top: 55px; left: 95px; position: absolute; margin: 0; width: auto; right: 10px").setProperty("placeholder", "Used for describing image")).chain( function() {
        this.addCustomEventListener('change', function() {
            attributes['alt'] = alt.value;
        });
    });

    var preview = $export("0001-img", (new DOMImage({
        "src": attributes['src'],
        "displayMode": "best"
    })).setAttr("style", "top: 100px; left: 10px; width: auto; height: auto; position: absolute; right: 10px; bottom: 10px"));
    
    preview.style.visibility = attributes['src'] ? 'visible' : 'hidden';

    app.addCustomEventListener('attribute-changed', function(data) {
        if ( data.which == 'src' ) {
            if ( data.value )
                preview.src = data.value;
            preview.style.visibility = data.value ? 'visible' : 'hidden';
        }
        return true;
    } );
    
    app.addCustomEventListener('attribute-changed', function(data){
        if ( data.which == 'src' && data.value != source.value)
            source.value = data.value;
        
        else
        
        if ( data.which == 'alt' && data.value != alt.value )
            alt.value = data.value;
        
        return true;
    });


    dlg.insert($import("0001-lbl"));
    dlg.insert($import("0002-lbl"));
    dlg.insert($import("0001-text"));
    dlg.insert($import("0002-text"));
    dlg.insert($import("0001-img"));

}