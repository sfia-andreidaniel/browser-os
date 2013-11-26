function MMC2_Packages_cmd_package_download( app ) {
    
    app.handlers.cmd_package_download = function( whichPackage ) {
        
        if ( typeof whichPackage == 'undefined' ) {

            var whichPackage = app.grid.selectedIndex == -1
                ? null
                : ( function() { 
                        var row = app.grid.tbody.rows[ app.grid.selectedIndex ];
                        
                        var matches;
                        
                        if ( ! ( matches = /^Yes( \((.*)\))?$/.exec(row.cells[3].value) ) ) {
                            
                            DialogBox("Cannot download this package because\nit is not downloadable or installed.", {
                                "childOf": getOwnerWindow( app.parentNode ),
                                "type": "error"
                            });
                            
                            return false;
                        }
                        
                        return ( matches[2] ? matches[2].replace( /\.package$/, '' ) : '' ) || row.primaryKey;

                    } )()

            if ( !whichPackage )
                return;
        }
        
        // check if package exists on server
        var req = [];
        req.addPOST('do', 'package-info');
        req.addPOST('name', whichPackage );
        var rsp = $_JSON_POST( app.handler, req );
        
        if ( !rsp ) {
            
            DialogBox("Error obtaining pkg_info for package: " + whichPackage, {
                "type": "error",
                "childOf": getOwnerWindow( app.parentNode )
            });
            
            return;
        }
        
        window.location = whichPackage + ".package";
    }
    
}