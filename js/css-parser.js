function CSSParser( textContent ) {
    txt = textContent || '';
    
    var cssRules = {};
    var anchors  = {};
    
    var parse = function() {
        
        var lines = txt.split(';');
        var matches;
        
        cssRules = {};
        anchors  = {};
        
        for ( var i=0,n=lines.length; i<n; i++ ) {
            ( function(line) {
                
                line = line.trim();
                
                if (!line.length)
                    return;
                
                if ( ! ( matches = /^([\da-z\-]+)([\s]+)?\:([\s]+)?([^*]+)$/.exec( line ) ) )
                    return;
                
                var ruleName = matches[1];
                var ruleValue= matches[4];
                
                if ( /^return /.test( ruleValue ) ) {
                    // This is a DOM anchor
                    try {
                        var func = eval( "(function(w,h){" + ruleValue + ";})" );
                        
                        anchors[ ruleName ] = func;
                        
                    } catch (e) {
                        console.warn("Could not parse anchor: " + ruleValue + ";");
                    }
                } else {
                    cssRules[ ruleName ] = ruleValue;
                }
                
            })( lines[i] );
        }
    }
    
    Object.defineProperty( this, "textContent", {
        "get": function() {
            return txt.toString();
        },
        "set": function( strVal ) {
            txt = strVal.toString();
            parse();
        }
    });
    
    this.textContent = txt;
    
    this.toString = function() {
        var out = [];
        for ( var key in cssRules ) {
            if ( cssRules.propertyIsEnumerable( key ) ) {
                out.push( key + ': ' + cssRules[ key ] );
            }
        }
        return out.join('; ');
    };
    
    Object.defineProperty( this, "css", {
        "get": function() {
            return this.toString();
        }
    });
    
    Object.defineProperty( this, "anchors", {
        "get": function() {
            var out = {}, has = false;
            for ( var key in anchors ) {
                if ( anchors.propertyIsEnumerable( key ) ) {
                    out[ key ] = anchors[key];
                    has = true;
                }
            }
            
            Object.defineProperty( out, 'toString', {
                "get": function() {
                    return function() {
                        var str;
                        var rules = [];
                        for ( var key in out ) {
                            if ( out.propertyIsEnumerable( key ) ) {
                                rules.push( JSON.stringify( key ) + ':' + out[ key ].toString() );
                            }
                        }
                        str = '{' + rules.join(', ') + '}';
                        return str;
                    }
                }
            } );
            
            return has ? out : false;
        }
    });
    
    return this;
}