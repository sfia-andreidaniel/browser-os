function JSIde_CustomEventHandler( eventName, eventCode ) {
    
    this.attach = function( DOMNode ) {
        DOMNode.chain( function() {
            try {
                eval( "DOMNode.chain( function(){ if ( !this.customEventListeners ) EnableCustomEventListeners(this); this.addCustomEventListener(" + JSON.stringify( eventName ) + ", " + eventCode.toString() + "); } )" );
            } catch (e) {
                console.warn("Could not bind event " + eventName + " on ", DOMNode)
            }
        } );
    }
    
    this.setAttribute = function( dummy ) {}
    
    this.toString = function() {
        return "(new JSIde_CustomEventHandler(" + JSON.stringify( eventName ) + ", " + eventCode.toString()  + "))";
    };
    
    return this;
}