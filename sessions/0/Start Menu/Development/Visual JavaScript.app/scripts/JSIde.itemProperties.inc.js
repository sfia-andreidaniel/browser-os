function JSIde_ItemProperties( node, app ) {

    var out = [];
    
    var nodeID = null;
    var entry = null;

    if ( !node || !node.nodeID ) {
        
    } else {
        nodeID = node.nodeID;
        
        for ( var i=0,n=app.application.length; i<n; i++ ) {
            
            if ( app.application[i].id == node.nodeID ) {
                out = app.application[i].properties;
                entry = app.application[i];
                break;
            }
        }
    }
    
    
    var grid = new PropertyGrid( out ).setAnchors({
        "width": function(w,h) {
            return w + "px";
        },
        "height": function(w,h) {
            return h + "px";
        }
    });
    
    grid.nodeID = nodeID;
    
    grid.save = function() {

        for ( var i=0,len=app.application.length; i<n; i++ ) {
        
            if ( app.application[i].id == grid.nodeID ) {
                    
                    for ( var i1=0, len1 = app.application[i].properties.length; i1<len1; i1++ ) {
                            app.application[i].properties[i1].value = 
                                grid.values[ app.application[i].properties[i1].name ];
                    }
                    
                    break;
            }
            
        }
    };

    return grid;
};