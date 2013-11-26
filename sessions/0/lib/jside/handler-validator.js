function( code ) {
    try {
        var e = eval( '(' + code + ')' );
        return e && e instanceof Function;
    } catch ( e ) {
        return false;
    }
}