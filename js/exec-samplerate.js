( function() {
    
    function delayed( callback, millis, firstRun ) {
        var pendings = 0;
        firstRun = typeof firstRun == 'undefined' ? true : !!firstRun;
        
        this.run = function() {
            if ( pendings )
                pendings++;
            else {
                pendings = 1;
                setTimeout( function() {
                    pendings = 0;
                    callback();
                }, millis );
            }
            
            return this;
        }
        
        if ( firstRun )
            this.run();
        
        return this;
    };
    
    Object.defineProperty(
        window,
        "throttle",
        {
            "get": function() {
                
                return (
                    function( callback, millis ) {
                        return new delayed( callback, millis );
                    }
                );
            }
        }
    );
    
} )();