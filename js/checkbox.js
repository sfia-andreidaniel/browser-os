function DOMCheckBox( settings ) {
    var input = $('input').setAttr('type', 'checkbox').addClass('DOM2Checkbox');
    settings = settings || {};
    
    /* Possible checkbox set */
    
    // two-states
    // tri-states-mixed
    // tri-states-allow-deny
    
    var values     = [ false, true ];
    var set        = 'two-states';
    var index      = 0;
    
    Object.defineProperty( input, 'valuesSet', {
        "get": function() {
            return set;
        },
        "set": function(str) {
            switch (str) {
                case "tri-states-mixed":
                    values = [ false, true, '' ];
                    set = 'tri-states-mixed';
                    index = 0;
                    input.value = input.value;
                    break;
                case "tri-states-allow-deny":
                    values = [ "", "allow", "deny" ];
                    set = 'tri-states-allow-deny';
                    input.value = input.value;
                    break;
                default:
                    values = [ false, true ];
                    set = 'two-states';
                    input.value = input.value;
                    break;
            }
            
            input.setAttribute('itype', set.replace(/-/g,'_'));
        }
    } );
    
    Object.defineProperty( input, "index", {
        "get": function() {
            return index;
        },
        "set": function( intVal ) {
            intVal = !!!parseInt( intVal ) ? 0 : parseInt( intVal );

            if ( intVal < 0 ) {
                intVal = set.length;
            } else {
                if ( intVal >= values.length ) {
                    intVal = 0;
                }
            }
            index = intVal;
            input.setAttribute('ivalue', ( values[index] === '' ? 'none' : values[ index ] ) );
        }
    });
    
    Object.defineProperty( input, "checked", {
        
        "get": function() {
            switch ( set ) {
                case 'tri-states-mixed':
                    switch ( index ) {
                        case 1:
                            return true;
                            break;
                        case 0:
                            return false;
                            break;
                        default:
                            return '';
                            break;
                    }
                    break;
                case 'tri-states-allow-deny':
                    switch ( index ) {
                        case 1:
                            return 'allow';
                            break;
                        case 2:
                            return 'deny';
                            break;
                        default:
                            return '';
                            break;
                    }
                case 'two-states':
                default:
                    return !!index;
                    break;
            }
        },
        "set": function( cValue ) {
            switch ( set ) {

                case 'tri-states-mixed':
                    
                    switch ( cValue ) {
                        
                        case 'true':
                        case 1:
                        case true:
                            input.index = 1;
                            break;
                        
                        case 'false':
                        case false:
                        case 0:
                            input.index = 0;
                            break;
                        
                        default:
                            input.index = 2;
                            break;
                        
                    }
                    
                    break;
                
                case 'tri-states-allow-deny':
                
                    switch ( cValue ) {
                        
                        case 'true':
                        case 1:
                        case 'allow':
                        case true:
                            input.index = 1;
                            break;
                        
                        case 'false':
                        case 2:
                        case 'deny':
                        case false:
                            input.index = 2;
                            break;
                        
                        default:
                            input.index = 0;
                            break;

                    }
                
                    break;

                case 'two-states':
                default:
                
                    switch ( cValue ) {
                        case 'true':
                        case true:
                        case '1':
                        case 'on':
                        case 1:
                            input.index = 1;
                            break;
                        default:
                            input.index = 0;
                            break;
                    }
                    
                    break;
            }
        }
    } );
    
    Object.defineProperty( input, 'value', {
        "get": function() {
            return input.checked;
        },
        "set": function( v ) {
            input.checked = v;
        }
    } );
    
    input.addEventListener('click', function(e){
        setTimeout( function(){
            if (!e.defaultPrevented && !input.readOnly && !input.disabled) {
                input.index = input.index + 1;
                input.onCustomEvent('change', input.checked );
            }
        }, 1 );
    }, true );
    
    input.click = function() {
        input.index = input.index + 1;
        input.onCustomEvent('change', input.checked );
    };
    
    (function(){
        var disabled = false;
        Object.defineProperty( input, "disabled", {
            "get": function(){
                return disabled;
            },
            "set": function( boolVal ) {
                disabled = !!boolVal;
                if ( disabled )
                    input.setAttribute('disabled', 'disabled');
                else
                    input.removeAttribute('disabled');
            }
        } );
    })();

    (function(){
        var readOnly = false;
        Object.defineProperty( input, "readOnly", {
            "get": function(){
                return readOnly;
            },
            "set": function( boolVal ) {
                readOnly = !!boolVal;
                if ( readOnly )
                    input.setAttribute('readonly', 'readonly');
                else
                    input.removeAttribute('readonly');
            }
        } );
    })();
    
    input.valuesSet = settings.set || settings.valuesSet;
    input.checked = settings.checked || false;
    
    return input;
}