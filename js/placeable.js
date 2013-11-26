function DOMPlaceable( settings ) {

    var holder = $('div', 'DOMPlaceable appearence-opaque');
    
    var sh = holder.appendChild( $('div').setAnchors({
        "width": function(w,h) {
            return w  + "px";
        },
        "height": function(w,h) {
            return h + "px";
        }
    }) );
    
    holder.insert = function( element ) {
        if ( element && element instanceof Node )
            return sh.appendChild( element );
        else
            return null;
    };
    
    (function() {
        var appearence = 'opaque';
        Object.defineProperty( holder, 'appearence', {
            "get": function() {
                return appearence;
            },
            "set": function(str) {
                try {
                    this.removeClass( 'appearence-' + appearence );
                    this.addClass( 'appearence-' + ( appearence = str.toString() ) );
                } catch (e) {
                    console.error( str );
                }
            }
        } );
    })();
    
    ( function() {
        var caption = '';
        Object.defineProperty( holder, 'caption', {
            "get": function() {
                return caption;
            },
            "set": function( str ) {
                for ( var i=0,items=holder.querySelectorAll('legend'),n=items.length; i < Math.min( n, 1 ); i++)
                    items[i].parentNode.removeChild( items[i] );
                if ( caption = str.toString() )
                    holder.appendChild( $('legend') ).appendChild( $text( caption ) );
            }
        } );
    } )();
    
    settings = settings || {};
    
    if ( typeof settings.appearence != 'undefined' )
        holder.appearence = settings.appearence;
    
    if ( typeof settings.caption != 'undefined' )
        holder.caption = settings.caption;
    
    return holder;
}