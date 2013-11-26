function DOMImage(cfg) {
    var holder = $('div', 'DOMImage');
    
    cfg = cfg || {};
    
    var img = $('img' );
    
    img.onload = function() {
        holder.addClass( 'state-loaded' ).removeClass('state-error').removeClass('state-loading');
        holder.style.backgroundImage = 'url(' + img.src + ')';
    };
    
    img.onerror = function() {
        holder.removeClass( 'state-loaded' ).removeClass('state-loading').addClass( 'state-error' );
    };
    
    ( function() {
        var display = display || 'normal';
        
        Object.defineProperty( holder, 'displayMode', {
            "get": function() {
                return display;
            },
            "set": function( strVal ) {
                var d = strVal.toString();
                var vals = [ 'normal', 'best', 'tiles', 'stretch' ];
                if ( vals.indexOf( d ) == -1 )
                    throw "Bad image display-mode: " + d;
                
                if ( d == 'best' )
                    holder.appendChild( img );
                else if ( img.parentNode )
                    img.parentNode.removeChild( img );
                
                holder.removeClass( display ).addClass( display = d );
            }
        } );
        
    } )();
    
    (function() {
        var src = cfg.src || '';
        Object.defineProperty( holder, 'src', {
            "get": function() {
                return src;
            },
            "set": function( str ) {
                holder.removeClass('state-error').removeClass('state-loaded').addClass('state-loading');
                img.src = src = str;
            }
        } );
    })();
    
    if ( cfg.src )
        holder.src = cfg.src;
    
    holder.displayMode = cfg.displayMode || 'normal';
    
    return holder;
}