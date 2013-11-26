window.CSSDefs = window.CSSDefs || {};

window.CSSDefs.styleAttributeParser = function( styleString ){
    
    var str = ( (styleString || '') + ';' ).toString().trim(),
        matches,
        rules = [],
        current = '',
        quoteMode = '',
        chr = '',
        selector, rule;
    
    for ( var i=0, len=str.length; i<len; i++ ) {
        
        switch ( chr = str.charAt(i) ) {
            
            case '"':
                if ( quoteMode != "'" ) {
                    if ( quoteMode == '' )
                        quoteMode = '"';
                    else
                        quoteMode = '';
                }
                current += chr;
                break;
            case "'":
                if ( quoteMode != '"' ) {
                    if ( quoteMode == "" )
                        quoteMode = "'";
                    else
                        quoteMode = '';
                }
                current += chr;
                break;
            case ";":
                if ( quoteMode == '' ) {
                    if ( current = current.trim() ) {
                        
                        if ( ( current = current.split( ':', 2 ) ).length == 2 ) {
                            //console.log( current );
                            selector = current[0].trim().replace(/^\-(webkit|moz|o|ms)\-/, '').toLowerCase();
                            rule = current[1].trim().replace(/, /g, ',');
                            rules.push({
                                "selector": selector,
                                "value": rule
                            });
                        }
                    }
                    current = '';
                } else {
                    current += chr;
                }
                break;
            default:
                current += chr;
                break;
        }
        
    }
    
    rules.sort( function( a, b ) {
        if ( a.selector.length != b.selector.length )
            return a.selector.length - b.selector.length;
        else
            return a.selector.strcmp( b.selector );
    } );
    
    var out = {};
    
    for ( var i=0, len=rules.length; i<len; i++ ) {
        out[ rules[i].selector ] = rules[i].value;
    }
    
    return out;
}