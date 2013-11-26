function DocumentEditor_interface_panel( app ) {
    
    var panelVisible = false;
    
    app.split = app.insert( new Splitter() ).setAnchors({
        "width": function(w,h) {
            return w + "px";
        },
        "height": function(w,h) {
            return h - app.toolbar.offsetHeight - 4 + "px";
        },
        "dummy": function(w,h) {
            if ( panelVisible ) {
                app.split.setSplitAt( [ app.width - 200 ] );
            } else
                app.split.setSplitAt( [ app.width - 8 ] );
        }
    }).setAttr(
        "style", "border-color: transparent"
    );
    
    app.split.addCustomEventListener( 'resize', function() {
        app.paint();
        return false;
    } );
    
    app.split.split( [ app.width ], 'V' );
    
    Object.defineProperty( app, "panelVisible", {
        "get": function() {
            return panelVisible;
        },
        "set": function( b ) {
            panelVisible = !!b;
            app.paint();
        }
    } );
    
    app.split.querySelector('.VSplitHandle').addEventListener('click', function() {
        app.panelVisible = !app.panelVisible;
    });
    
    window.word = app;
    
    app.paint();
    
}