// Trying to convert css values from different measure units to another

function CSSUnitConvertor( initialValue ) {
    
    var value = "";
    var unit  = "";
    var convertible = false;
    
    Object.defineProperty( this, "value", {
        "get": function() {
            return value + unit;
        },
        "set": function( s ) {
            s = (s || '').toString().toLowerCase().trim();

            var matches;

            switch ( true ) {
                
                case s == '':
                    value = '';
                    unit  = '';
                    convertible = false;
                    break;
                
                case /^auto|inherit|none$/.test(s):
                    value = s;
                    unit = '';
                    convertible = false;
                    break;
                
                case !!( matches = /^([\d\.\-]+)(px|cm|mm|em|pt|\%|inch)$/.exec( s ) ):
                    value = matches[1];
                    unit = matches[2];
                    convertible = [ '%' ].indexOf( unit ) == -1;
                    break;
                
                default:
                    throw "Bad css dimension value";
                
            }
        }
    } );
    
    Object.defineProperty( this, "dimension", {
        "get": function() {
            return value;
        },
        "set": function(s) {
            if ( convertible ) {
                var iAuto;
                if ( !isNaN( s ) || ( iAuto = ( [ 'auto', 'inherit', 'none' ].indexOf( s ) >= 0 ) ) ) {
                    if (!iAuto)
                        value = parseFloat( s );
                    else {
                        value = s;
                        unit = '';
                        convertible = false;
                    }
                } else throw "Expected number!";
            } else throw "Read-Only dimension (not convertible)";
        }
    } );
    
    Object.defineProperty( this, "unit", {
        "get": function() {
            return unit;
        },
        "set": function(s) {
            if ( convertible ) {
                if ( ['px','cm','mm','em','pt','%','inch'].indexOf( s ) >= 0 )
                    unit = s;
                else throw "Expected css unit!";
            } else throw "Read-Only unit (not convertible)";
        }
    } );
    
    Object.defineProperty( this, "readOnly", {
        "get": function() {
            return !convertible;
        }
    } );
    
    Object.defineProperty( this, "convertible", {
        "get": function() {
            return convertible;
        }
    } );
    
    this.to = function( unitStr ) {
        unitStr = ( unitStr || '' ).toString().toLowerCase().trim();
        switch ( true ) {
            case !convertible:
                return null;
                break;
            case ['px', 'cm', 'mm', 'em', 'pt', 'inch' ].indexOf( unitStr ) >= 0:
                
                if ( unit == unitStr )
                    return value + unit;
                else {
                    
                    // convert the value in pixels first
                    var valuePx;
                    
                    switch ( unit ) {
                        
                        case 'px':
                            valuePx = parseFloat( value );
                            break;
                        case 'mm':
                            valuePx = parseFloat( value ) * 3.779527559;
                            break;
                        case 'cm':
                            valuePx = parseFloat( value ) * 37.795275591;
                            break;
                        case 'em':
                            valuePx = parseFloat( value ) * 16;
                            break;
                        case 'pt':
                            valuePx = parseFloat( value ) * 1.33375;
                            break;
                        case 'inch':
                            valuePx = parseFloat( value ) * 100;
                            break;
                    }
                        
                    switch ( unitStr ) {
                        case 'px':
                            return ( valuePx.toFixed(2) + "px" ).replace(/\.([0]+)([a-z])/i, '$2');
                            break;
                        case 'em':
                            return ( ( valuePx / 16 ).toFixed(2) + "em" ).replace(/\.([0]+)([a-z])/i, '$2');
                            break;
                        case 'cm':
                            return ( ( valuePx * 0.026458333 ).toFixed(2) + "cm" ).replace(/\.([0]+)([a-z])/i, '$2');
                            break;
                        case 'mm':
                            return ( ( valuePx * 26.458333 ).toFixed(2) + "mm" ).replace(/\.([0]+)([a-z])/i, '$2');
                            break;
                        case 'pt':
                            return ( ( valuePx * 0.75 ).toFixed(2) + "pt" ).replace(/\.([0]+)([a-z])/i, '$2');
                            break;
                        case 'inch':
                            return ( ( valuePx / 100 ).toFixed(2) + "inch" ).replace(/\.([0]+)([a-z])/i, '$2');
                            break;
                    }
                    
                }
                
                break;
            default:
                return null;
        }
    }
    
    if ( typeof initialValue != 'undefined' )
        this.value = initialValue;
    
    return this;
}