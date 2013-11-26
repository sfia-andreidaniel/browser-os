function CSSNodeEditor_init_video_tab( app, tabs, opts ) {
    
    var dlg = tabs.getTabById( 'video' ).getSheet();
    
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
    
    var videoSources = $export("0001-grid", (new DataGrid()).setAttr("style", "top: 115px; left: 10px; position: absolute;").setAnchors({
        "width": function(w, h) {
            return w - 20 + "px";
        },
        "height": function(w,h) {
            return h - 210 + "px";
        }
    }).setProperty("selectable", true).setProperty("multiple", true).chain(function() {
        this.colWidths = [170, 60, 60];
        this.th(["Source", "Type", "Quality"]);
        this.setProperty("delrow", function(row) {
            //What to do when deleting a row
            return false;
        });
        this.enableResizing();
        this.enableSorting();
        this.selectable = true;
        
    }).chain( function() {
        
        var grid = this;
        
        app.addCustomEventListener('attribute-changed', function(data) {
            
            console.log("changed!");
            
            if ( data.which != 'sources' )
                return true;
            
            grid.clear();
            
            for ( var i=0, sources = attributes.sources, len=sources.length; i<len; i++ ) {
                ( function( source ) {
                    
                    var row = grid.tr([
                        source.src,
                        source.type,
                        source.quality || '-'
                    ]);
                    
                    row.primaryKey = source.src;
                    
                } )( sources[i] );
            }
            
            grid.render();
            
            return true;
        });
        
    }));

    $export("0001-check", (new DOMCheckBox({
        "valuesSet": "two-states",
        "checked": !!attributes['controls']
    })).setAttr("style", "top: 53px; left: 10px; position: absolute").chain(function(){
        this.addCustomEventListener('change', function() {
            attributes['controls'] = this.checked;
            return true;
        });
    }));

    $export("0002-check", (new DOMCheckBox({
        "valuesSet": "two-states",
        "checked": !!attributes['autostart']
    })).setAttr("style", "top: 53px; left: 95px; position: absolute").chain(function(){
        this.addCustomEventListener('change', function(){
            attributes['autostart'] = this.checked;
            return true;
        });
    }));

    $export("0001-btn",  (new Button("Remove", (function() {
        if ( videoSources.selectedIndex >= 0 ) {
            var source = videoSources.tbody.rows[ videoSources.selectedIndex ].primaryKey;
            attributes['sources'].remove( source );
        }
    }))).setAttr("style", "bottom: 65px; right: 10px; position: absolute"));
    
    $export("0002-btn",  (new Button("Add", (function() {
        if ( !addSource.value )
            return;
        
        /* If we have integration.getVideoInfo function defined, we use it.
           Otherwise, based on file extension, we try to determine the media type.
         */
         
        var info = null;
         
        if ( typeof opts.integration.getVideoInfo == 'function' ) {
            
            try {
                info = opts.integration.getVideoInfo( addSource.value );
            } catch (e) {
                info = null;
            }
            
        }
        
        var fileMime = 'video';
        
        if ( info !== null && info['versions'] && info['versions'].length ) {
            // Add all the video file versions from the videoInfo result
            for ( var i=0, versions = info.versions || [], len=versions.length; i<len; i++ ) {
                if ( versions[i].src && versions[i].type )
                    attributes['sources'].add( versions[i].src, versions[i].type, versions[i].quality || '' );
            }
            
            if ( info.posters && info.posters.length ) {
                for ( var i=0, len=info.posters.length; i<len; i++ ) {
                    attributes['posters'].add( info.posters[i] );
                }
            }
            
        } else {
            
            // No video info provided. Try to determine the mime of the source, and add the source
            
            var src = addSource.value,
                matches;
            
            switch ( true ) {
                
                case !!( matches = /\.(mp4|webm|ogv|flv)$/i.exec( src ) ):
                    fileMime = 'video/' + matches[1];
                    break;
                
                default:
                    DialogBox("Sorry, you can add only '.mp4', '.webm', '.ogv' and\n'.flv' video files!\n\nTo support more video file types, your\napplication should implement video integration", {
                        "type": "error"
                    });
                    return false;
            }
            
            attributes['sources'].add( src, fileMime );
        }
        
    }))).setAttr("style", "bottom: 65px; right: 75px; position: absolute"));

    var btnChooseFrom = $export("0003-btn",  (new Button("Choose From...", (function() {
        app.appHandler('cmd_select_poster');
    }))).setAttr("style", "top: 20px; right: 10px; position: absolute"));

    var addSource = $export("0001-text", (new CSSSourceInput("")).setAttr("style", "bottom: 65px; left: 60px; right: 120px; position: absolute; margin: 0; width: auto"));

    var addPoster = $export("0002-text", (new CSSSourceInput(attributes['poster'])).setAttr("style", "top: 20px; left: 60px; position: absolute; margin: 0; width: auto; right: 120px").chain(function(){
        this.addCustomEventListener('change', function(){
            attributes['poster'] = this.value;
            return true;
        });
        
        app.addCustomEventListener('attribute-changed', function(data) {
            if ( data.which == 'poster' )
                addPoster.value = data.value;
            return true;
        });
        
    }));

    $export("0001-lbl",  (new DOMLabel("Poster:")).setAttr("style", "top: 23px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
    $export("0002-lbl",  (new DOMLabel("Controls", { "for": $import('0001-check') })).setAttr("style", "top: 55px; left: 35px; width: 50px; position: absolute; text-overflow: ellipsis"));
    $export("0003-lbl",  (new DOMLabel("AutoStart",{ "for": $import('0002-check') })).setAttr("style", "top: 55px; left: 120px; width: 60px; position: absolute; text-overflow: ellipsis"));
    $export("0004-lbl",  (new DOMLabel("Sources:")).setAttr("style", "top: 90px; left: 10px; width: 60px; position: absolute; text-overflow: ellipsis"));
    $export("0005-lbl",  (new DOMLabel("Source:")).setAttr("style", "bottom: 69px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));
    $export("0006-lbl",  (new DOMLabel("Tip: You might even specify a YouTube url")).setAttr("style", "bottom: 48px; left: 60px; width: auto; right: 10px; position: absolute; text-overflow: ellipsis"));


    dlg.insert($import("0001-lbl"));
    dlg.insert($import("0002-lbl"));
    dlg.insert($import("0003-lbl"));
    dlg.insert($import("0004-lbl"));
    dlg.insert($import("0001-grid"));
    dlg.insert($import("0001-btn"));
    dlg.insert($import("0002-btn"));
    dlg.insert($import("0005-lbl"));
    dlg.insert($import("0001-text"));
    dlg.insert($import("0006-lbl"));
    dlg.insert($import("0002-text"));
    dlg.insert($import("0003-btn"));
    dlg.insert($import("0001-check"));
    dlg.insert($import("0002-check"));

    CSSNodeEditor_init_video_tab_cmd_select_poster( app, attributes );

}