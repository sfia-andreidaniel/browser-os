function JSIde_Chain( implementFunction ) {

    this.implementFunction = implementFunction || function(){};

    this.register = function( provider ) {
        return provider.chain( eval( '(' + this.implementFunction + ')' ) );
    }
    
    this.toString = function() {
        return '(' + this.implementFunction.toString() + ')';
    }
    
    this.setAttribute = function() {
        // dummy function
    }
    
    return this;
}