function JSIde_ApplicationExtender( implementFunction ) {

    this.implementation = implementFunction || function( ) {
    }
    
    this.register = function( app ) {
        eval( '(' + this.implementation.toString() + ')' ).call( app, app );
    }
    
    this.toString = function() {
        return 'dlg.chain( function() { ' + this.implementation + '( this ); } )';
    }
    
    this.setAttribute = function() {
        // dummy function
    }
    
    return this;
}