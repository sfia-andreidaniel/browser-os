function JSIde_MenuBar( cfg, setupHandlers ) {

    setupHandlers = !!setupHandlers;

    var scan = function( items ) {
        if ( !items || !items.length )
            return undefined;
        
        var out = [], item;
        
        for ( var i=0,n=items.length; i<n; i++ ) {
            item = items[i].cfg;
            if ( typeof items[i].items != 'undefined' )
                item.items = scan( items[i].items );
            if ( setupHandlers && item.id )
                item.handler = "%appHandler%";
            out.push( item );
        }
        
        return out;
    };

    this.menu = scan( cfg.items || [] );
    
    Object.defineProperty( this, "setAttribute", {
        "get": function() {
            return function( dummy ) {
            };
        }
    } );
    
    this.toString = function() {
        if ( this.menu )
            return JSON.stringify( this.menu ).replace(/\"%appHandler%\"/g, 'dlg.appHandler');
        else
            return '[]';
    }
    
    this.objectType = 'menubar';
    
    return this;
}