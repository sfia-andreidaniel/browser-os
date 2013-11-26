function JSIde_ApplicationHandler( handlerName, targetApplication, implementFunction ) {

    targetApplication = ( targetApplication && targetApplication.handlers ) ? targetApplication : null;

    if ( typeof handlerName == 'undefined' )
        throw "Must specify a handler name!";
    
    this.handlerName = handlerName;
    this.targetApplication = targetApplication;

    this.implementation = implementFunction || function( ) {
        alert("You must specify the code for this handler");
        return null;
    }
    
    this.register = function( app ) {
        if ( !app || !app.handlers )
            throw "Could not register application handler to application!";
        app.handlers[ this.handlerName ] = this.implementation;
    }
    
    this.toString = function() {
        return '(' + this.implementation.toString() + ').chain(function() { ' + 
            '/* Application handler: ' + this.handlerName + ' */\n\n' +
        'dlg.handlers[' + JSON.stringify( this.handlerName ) + '] = this; })';
    }
    
    this.setAttribute = function() {
        // dummy function
    }
    
    return this;
}