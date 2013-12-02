function MMC2_SnapIn( app ) {
    
    var snapIn = {
        "name": "",
        "interface": null
    };
    
    Object.defineProperty( app, 'snapIn', {
        
        "get": function() {
            return snapIn.name
        },
        "set": function( snapIn_Name ) {
            
            if ( snapIn.name == snapIn_Name )
                return;
            
            if ( snapIn.interface ) {
                snapIn.interface.closeable = true;
                snapIn.interface.close();
                snapIn.interface.purge();
                snapIn.interface = null;
            }
            
            for ( var i=0,len=MMC2_Snapins.length; i<len; i++ ) {
                if ( MMC2_Snapins[i].name == snapIn_Name ) {
                    snapIn.interface = MMC2_Snapins[i].create( app.split.cells(1) );
                    snapIn.name = snapIn_Name;
                    break;
                }
            }
        }
    } );
    
    Object.defineProperty( app, 'snapInInterface', {
        "get": function() {
            return snapIn.interface;
        }
    });
    
}