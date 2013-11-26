function JSIde_StringObject( str, cfg ) {
    
    var children = [];
    var events   = [];
    var customEvents = [];
    var chains = [];
    
    this.isRoot = false;
    
    Object.defineProperty( this, 'insert', {
        "get": function() {
            return function( otherStringObject ) {
                children.push( otherStringObject );
            };
        }
    } );
    
    Object.defineProperty( this, 'addEventListener', {
        "get": function() {
            return function( otherStringObject ) {
                events.push( otherStringObject );
                //console.log("String.addEventListener: " + otherStringObject );
            }
        }
    } );

    Object.defineProperty( this, 'addCustomEventListener', {
        "get": function() {
            return function( otherStringObject ) {
                customEvents.push( otherStringObject );
            }
        }
    } );
    
    Object.defineProperty( this, 'registerChain', {
        "get": function() {
            return function( otherStringObject ) {
                chains.push( otherStringObject );
            }
        }
    } );
    
    Object.defineProperty( this, 'config', {
        "get": function() {
            return cfg;
        }
    } );
    
    this.toString = function() {
    
        if ( str != '' ) {
    
            var stack = [];
        
            var declaration = cfg.declaration || 'protected';
            
            switch (declaration) {
                case 'private':
                    if ( this.isRoot )
                        throw "Root components cannot be declared as private or public!";

                    stack.push( '$export(' + JSON.stringify( cfg._id ) + ',' + str + ');' );
                
                    break;
                case 'protected':
                    if ( this.isRoot )
                        stack.push( 'var dlg = $export(' + JSON.stringify( cfg._id ) + ', ' + str + ' );' );
                    else
                        stack.push( 'var ' + cfg.name + ' = $export(' + JSON.stringify( cfg._id ) + ', ' + str + ' );' );
                    break;
                case 'public':
                    if ( this.isRoot )
                        throw "Root components cannot be declared as private or public!";
                    
                    stack.push( 'dlg.' + cfg.name + ' = $export(' + JSON.stringify( cfg._id ) + ',' + str + ' );' );
                    
                    break;
                default:
                    return '\n\n/* error */\n\n';
            }
            
            /* Declare the other components */
            for ( var i=0, n=children.length; i<n; i++ ) {
                stack.push( children[i].toString() );
            }
            
            /* Declare customEventListeners */
            for ( var i=0,n=customEvents.length; i<n; i++ ) {
                stack.push( customEvents[i].toString().trim(';') + '.attach( $import(' + JSON.stringify( cfg._id ) + ') );' );
            }
            
            /* Declare eventListeners */
            for ( var i=0,n=events.length; i<n; i++ ) {
                stack.push( events[i].toString().trim(';') + '.attach( $import(' + JSON.stringify( cfg._id ) + ') );' );
            }
            
            /* Declare chains */
            for ( var i=0,n=chains.length; i<n; i++ ) {
                stack.push( '$import(' + JSON.stringify( cfg._id ) + ').chain(' + chains[i].toString().trim(';') + ');' );
            }
        
            var returnValue = '\n' + stack.join( '\n' );
        
        } else {
            var returnValue = '';
        }
        
        returnValue.trim = function() {
            return (returnValue + '').trim();
        };
        
        return returnValue;
    }
    
    this.trim = function() {
        return (this + '').trim();
    };
    
    return this;
};