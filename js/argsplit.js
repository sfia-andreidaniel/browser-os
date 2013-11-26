function argsplit( str ) {
    
    str = str.trim();
    var args = [], arg = '', quoteType = null, prevChar = null, nextChar = null, nowChar = '';
    
    for ( var i=0, len = str.length; i<len; i++ ) {
        
        nowChar = str.charAt( i );
        
        switch ( true ) {
            
            case nowChar == '\\':

                i++;
                
                nowChar = str.charAt( i ) || '';
                
                switch ( nowChar ) {
                    case 'r':
                        arg += '\r';
                        break;
                    case 'n':
                        arg += '\n';
                        break;
                    case 'e':
                        arg += '\u001b';
                        break;
                    case 't':
                        arg += '\t';
                        break;
                    default:
                        arg += nowChar;
                        break;
                }
                
                break;
            
            case nowChar == '"':
            case nowChar == "'":
                if ( ( prevChar === null || /[\s]/.test( prevChar ) ) && quoteType === null ) {
                    quoteType = nowChar;
                    break;
                } else
                if ( ( quoteType == nowChar ) && ( i == str.length - 1 || /[\s]/.test( str.charAt( i + 1 ) ) ) ) {
                    quoteType = null;
                    args.push( arg );
                    arg = '';
                    break;
                } else
                arg += nowChar;
                
                break;
            
            case /[\s]/.test( nowChar ) ? true : false:
                
                if ( quoteType === null ) {
                    
                    if ( i == str.length - 1 || /[\s]/.test( str.charAt( i + 1 ) ) )
                        break;
                        
                    args.push( arg );
                    arg = '';
                    
                } else arg += nowChar;
                
                break;
            
            default:
                arg += nowChar;
                if ( i == str.length - 1 )
                    args.push( arg );
                break;
        }
        
        oldChar = nowChar;
        nowChar = '';
    }
    
    return args;
}