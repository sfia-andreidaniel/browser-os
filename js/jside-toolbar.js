function JSIde_Toolbar( cfg, setupHandlers ) {

    setupHandlers = !!setupHandlers;
    
    var scan = function( items, deep ) {
    
        deep = typeof deep == 'undefined' ? 1 : deep;
    
        if ( !items || !items.length )
            return undefined;
        
        var out = [], item;
        
        for ( var i=0,n=items.length; i<n; i++ ) {
            item = items[i].cfg;

            if ( typeof items[i].items != 'undefined' )
                item.items = scan( items[i].items, deep + 1 );

            if ( setupHandlers && item.id )
                item.handler = "%appHandler%";

            if ( deep == 1 ) {
                item.renameProperty( "caption", "name" );
            }

            out.push( item );
        }
        
        return out;
    };

    this.toolbar = scan( cfg.items || [] );
    
    Object.defineProperty( this, "setAttribute", {
        "get": function() {
            return function( dummy ) {
            };
        }
    } );
    
    Object.defineProperty( this, 'settings', {
        "get": function() {
            return cfg.cfg;
        }
    } );
    
    this.toString = function( what ) {
        
        what = what || 'toolbar';
        
        switch( what ) {
            case 'toolbar':
                if ( this.toolbar )
                    return JSON.stringify( this.toolbar ).replace(/\"%appHandler%\"/g, 'dlg.appHandler');
                else
                    return '[]';
                break;
            case 'settings':
                return JSON.stringify( cfg.cfg );
                break;
            default:
                throw 'Don\'t know how to convert to a string the \'' + what + '\'';
                break;
        }
    };
    
    this.objectType = 'toolbar';
    
    return this;
}