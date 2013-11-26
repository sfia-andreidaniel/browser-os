var SERIALIZER = {
    
    "stringify": function( value, recursionLevel ) {
        
        recursionLevel = typeof recursionLevel == 'undefined' ? 100 : recursionLevel;

        if ( recursionLevel <= 0 )
            throw "Recursion detected!";
        
        switch ( typeOf( value, 2 ) ) {
            case 'number.int':
                return 'int:' + value.toString().length + ':' + value.toString();
                break;
            case 'number.float':
                return 'float:' + value.toString().length + ':' + value.toString();
                break;
            case 'boolean':
                return 'boolean:1:' + ( value ? '1' : '0' );
                break;
            case 'null':
                return 'null:0:';
                break;
            case 'unknown.undefined':
                return 'undefined:0:';
                break;
            case 'infinity':
                return 'infinity:0:';
                break;
            case 'nan':
                return 'nan:0:';
                break;
            case 'unknown.string':
                return 'string:' + value.length + ':' + value;
                break;
            case 'object.function':
                return 'function:' + value.toString().length + ':' + value.toString();
                break;
            case 'object.array':
                var items = [];
                for ( var i=0,n=value.length; i<n; i++ ) {
                    items.push( SERIALIZER.stringify( value[i], recursionLevel - 1 ) );
                }
                items = items.join('');
                return 'array:' + items.length + ':' + items;
                break;
            case 'object':
                var items = [];
                for ( var key in value ) {
                    if ( value.propertyIsEnumerable( key ) && value.hasOwnProperty( key ) ) {
                        ( function(k) {
                            items.push( '[' + k.length + ':' + k + ']' + SERIALIZER.stringify( value[k], recursionLevel - 1 ) );
                        })( key );
                    }
                }
                items = items.join('');
                return 'object:' + items.length + ':' + items;
                break;
            default:
                return 'null:0:';
                break;
        }
        
    },
    "parse": function( strValue ) {
        if ( typeof strValue != 'string' )
            throw "SERIALIZER.parse: Expected string";
        
        var arraySplit = function(str) {
            var out = [];
            var matches;
            var element;
            while ( matches = /^([a-z]+)\:([\d]+)\:([^*]+)?/.exec( str ) ) {
                var dLen = parseInt( matches[ 2 ] );
                var dVal = ( matches[3] || '' ).substr( 0, dLen );
                if ( dLen < dVal.length )
                    throw "SERIALIZER: failed to parse array!";
                out.push( element = matches[1] + ':' + matches[2] + ':' + dVal );
                str = str.substr( element.length );
            }
            if ( str.length )
                throw "Expected end of string!";
            return out;
        }
        
        var objectSplit = function(str) {
            var out = [];
            var matches, matches1;
            var element;
            var keyLen;
            var keyName;
            var keyValue;
            var keyValueLen;
            while ( matches = /^\[([\d]+)\:/.exec( str ) ) {
                keyLen = matches[1];
                keyName= str.substr(keyLen.length + 2, parseInt( keyLen ) );
                str = str.substr( keyName.length + keyLen.length + 2 );

                if ( str.charAt(0) != ']' )
                    throw "Expected ']' character!" + str;

                str = str.substr( 1 );
                
                matches1 = /^([a-z]+)\:([\d]+)\:/.exec(str);
                
                if (!matches[1])
                    throw "Unexpected sequence!";
                
                str = str.substr( matches1[0].length );
                
                element = {
                    "key": keyName,
                    "value": matches1[1] + ':' + matches1[2] + ':' + ( keyValue =  str.substr(0, parseInt( matches1[2] ) ) )
                };
                str = str.substr( keyValue.length );
                out.push( element );
            }
            if ( str.length )
                throw "Expected end of string! " + str;
            return out;
        }
        
        var parse = function() {
            var matches = /^([a-z]+)\:([\d]+)\:([^*]+)?$/.exec( strValue );
            if (!matches)
                throw "SERIALIZER.parse: unserializeable string!";
            
            var dataType = matches[1];
            var dataLen  = matches[2];
            var dataValue= matches[3];
            
            dataLen = parseInt( dataLen );
            dataValue = dataValue || '';
            
            if ( dataLen != dataValue.length )
                throw "SERIALIZER.parse: corrupted data (len != dataLen)";
            
            switch ( dataType ) {
                case 'int':
                    return parseInt( dataValue );
                    break;
                case 'float':
                    return parseFloat( dataValue );
                    break;
                case 'boolean':
                    return dataValue.charAt(0) == '1';
                    break;
                case 'null':
                    if ( dataLen > 0 )
                        throw "SERIALIZER.parse: unexpected data length!";
                    return null;
                    break;
                case 'undefined':
                    if ( dataLen > 0 )
                        throw "SERIALIZER.parse: unexpected data length!";
                    return undefined;
                    break;
                case 'infinity':
                    if ( dataLen > 0 )
                        throw "SERIALIZER.parse: unexpected data length!";
                    return Infinity;
                    break;
                case 'nan':
                    if ( dataLen > 0 )
                        throw "SERIALIZER.parse: unexpected data length!";
                    return NaN;
                    break;
                case 'string':
                    return dataValue;
                    break;
                case 'function':
                    return eval( '(' + dataValue + ')' );
                    break;
                case 'array':
                    var data = arraySplit( dataValue );
                    for ( var i=0,n=data.length; i<n; i++ ) {
                        data[i] = SERIALIZER.parse( data[i] );
                    }
                    return data;
                    break;
                case 'object':
                    var data = objectSplit( dataValue );
                    var out = {};
                    for ( var i=0,n=data.length; i<n; i++ ) {
                        out[ data[i].key ] = SERIALIZER.parse( data[i].value );
                    }
                    return out;
                    break;
                default:
                    throw "SERIALIZER.parse: unimplemented parser( " + dataType + ")";
                    break;
            }
        }
        
        return parse();
    }
    
};