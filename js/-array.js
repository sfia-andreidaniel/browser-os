function ____ObjectToFeedPost(obj, name, prefix, root) {

    var stack = [];
    var response = [];
    
    prefix = prefix || '';
    
    switch (true) {
        case obj instanceof Array:
            for (var i=0; i<obj.length; i++) {
                response = ____ObjectToFeedPost(obj[i], '', prefix.
                                                    concat(typeof root != 'undefined' ? '[' : '').
                                                    concat(i).
                                                    concat(typeof root != 'undefined' ? ']' : ''), 
                                                    typeof root == 'undefined' ? true : false);
                
                for (var j=0; j<response.length; j++)
                    stack.push(response[j]);
            }
            break;
        case obj instanceof Object:
            for (var i in obj) {
                response = ____ObjectToFeedPost(obj[i], '',  prefix.
                                                    concat(typeof root != 'undefined' ? '[' : '').
                                                    concat(i).
                                                    concat(typeof root != 'undefined' ? ']' : ''), 
                                                    typeof root == 'undefined' ? true : false);
                
                for (var j=0; j<response.length; j++)
                    stack.push(response[j]);
            }
            break;
        default:
            if (typeof root == 'undefined') 
                stack.addPOST(name, obj); else 
                stack.addPOST(prefix, obj);
            break;
    }
    
    return stack;
}


//Substitutes values of format "%SOMETHING%" into an object with their corresponding javascript environment values
function ResolveObjectVars(obj) {
    switch (true) {
        case obj instanceof Array:
            var ret = [];
            for (var i=0; i<obj.length; i++) ret.push(ResolveObjectVars(obj[i]));
            return ret;
            break;
        case obj instanceof Object:
            var ret = {};
            for (var i in obj) ret[i] = ResolveObjectVars(obj[i]);
            return ret;
            break;
        default: { //assume is a string (or try to convert to a string)
            try {
                var objs = obj.toString();
            } catch(ex) {
                console.log('err');
                return obj;
                break;
            }
            
            var expr, m;
            var replaced = false;
            do {
                expr = /%[\w]+%/.exec(objs);
                if (expr !== null) {
                    m = expr[0];
                    m = m.substr(1, m.length-2);
                    objs = objs.replace(expr[0], window[m.toString()]);
                    replaced = true;
                }
            } while (expr !== null);
            
            //if any replacements were made, replace obj with it's modified version
            
            return objs;
            break;
        }
    }
}

//Converts an standard js object and it's values to a php POST format

Object.defineProperty( Array.prototype, "addObject", {
    "get": function() {
        return function(obj) {
            //while (this.length > 0) this.splice(0, 1);
            var objr = ResolveObjectVars(obj);
            var rsp = ____ObjectToFeedPost(objr);
            for (var i=0; i<rsp.length; i++) this.push(rsp[i]);
            return this;
        }
    }
} );

Object.defineProperty( Array.prototype, "first", {
    "get": function() {
        return function() {
            return typeof this[0] == 'undefined' ? undefined : this[0];
        }
    }
} );

Object.defineProperty( Array.prototype, "last", {
    "get": function() {
        return function() {
            return this.length ? this[ this.length - 1 ] : undefined;
        }
    }
} );

Object.defineProperty( Array.prototype, "intersect", {
    "get": function() {
        return function( array ) {
            var out = [];
            for ( var i=0,n=this.length; i<n; i++ ) {
                if ( array.indexOf( this[i] ) >= 0 )
                    out.push( this[i] );
            }
            return out;
        }
    }
} );

function ArrayRange( input, start, length ) {
    var len = input.length;
    
    if ( start < 0 ) {
        length += start;
        start = 0;
    }
    if ( start + length > len ) {
        length = len - start;
    }
    
    Object.defineProperty( this, "length", {
        "get": function() {
            return length;
        }
    } );
    
    Object.defineProperty( this, "offset", {
        "get": function() {
            return start;
        }
    } );
    
    this.get = function( index ) {
        if ( index < 0 || index >= length )
            return undefined;
        else
            return input[ start + index ];
    }
    
    this.set = function( index, value, defaultValue ) {
        if ( index >= 0 && index < length ) {
            input[ start + index ] = ( value == undefined ) 
                ? ( defaultValue || null ) 
                : value;
        }
    }
    
    this.shiftLeft = function( units, defaultValue ) {
        if ( units < length )
            for ( var i=0; i<units; i++ ) {
                this.set( i, this.get( i + units ), defaultValue );
            }
        for ( var i=0; i<units; i++ )
            this.set( length - i - 1, defaultValue );
    }
    
    this.shiftRight= function( units, defaultValue ) {
        if ( units < length ) {
            for ( var i=0; i<length; i++ )
                this.set( length - i, this.get( length - i - units ), defaultValue );
        }
        for ( var i=0; i<units; i++ )
            this.set( i, defaultValue );
    }
    
    this.shift = function( units, defaultValue ) {
        if ( units < 0 )
            this.shiftLeft( -units, defaultValue );
        else
            this.shiftRight( units, defaultValue );
        return this;
    }
    
    this.fill = function( values ) {
        for ( var i=0; i<length; i++ )
            this.set( i, values[i] );
    }
    
    this.at = function( index, callback ) {
        if ( index >= 0 && index < length ) {
            callback( input[ start + index ] );
        }
    }
    
    this.each = function( callback ) {
        for ( var i=0; i<length; i++ ) {
            callback( input[ start + i ], start + i );
        }
        return this;
    }
    
    return this;
}

Object.defineProperty( Array.prototype, "createRange", {
    "get": function() {
        return function( start, length ) {
            return new ArrayRange( this, start, length );
        }
    }
});