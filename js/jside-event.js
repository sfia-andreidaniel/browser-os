function JSIde_EventHandler( eventName, eventCode, eventPhase ) {
    
    this.attach = function( DOMNode ) {
        DOMNode.chain( function() {
            try {
                eval( "DOMNode.chain( function(){ this.addEventListener(" + JSON.stringify( eventName ) + ", " + eventCode.toString() + ", " + JSON.stringify( eventPhase ) + "); } )" );
            } catch (e) {
                console.warn("Could not bind event " + eventName + " on ", DOMNode)
            }
        } );
    }
    
    this.setAttribute = function( dummy ) {}
    
    this.toString = function() {
        return "(new JSIde_EventHandler(" + JSON.stringify( eventName ) + ", " + eventCode.toString() + ", " + JSON.stringify( eventPhase ) + "))";
    };
    
    return this;
}