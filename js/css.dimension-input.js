function CSSDimensionInput( value ) {
    
    return $('div', "CSSDimensionInput").chain(function() {
        
        ( function( holder ) {
            
            return holder.appendChild( $('div', 'inner') ).chain( function() {
                
                this.tabIndex = 0;
                
                holder.addEventListener( 'DOMFocusIn', function(e) {
                    holder.addClass( 'focused' );
                    holder.onCustomEvent( 'focus' );
                }, true );

                holder.addEventListener( 'DOMFocusOut', function(e) {
                    holder.removeClass( 'focused' );
                    holder.onCustomEvent( 'blur' );
                }, true );
                
                var unitClass = this.appendChild( new DropDown([{
                    "id": "",
                    "name": "Is"
                } , {
                    "id": "auto",
                    "name": "Automatic"
                } , {
                    "id": "inherit",
                    "name": "Inherited"
                }]) ).addClass('class');
        
                unitClass.onchange = function() {
                    holder.removeClass( 'size-auto' ).removeClass( 'size-inherit' );
                    if ( unitClass.value )
                        holder.addClass( 'size-' + unitClass.value );
                };
        
                var size = this.appendChild( new Spinner({
                    "value": 0
                }) );
        
                Object.defineProperty( this, "size", {
                    "get": function() {
                        return size.value;
                    },
                    "set": function( i ) {
                        size.value = isNaN( i ) ? 0 : parseInt( i );
                    }
                } );
        
                var unit = this.appendChild( new DropDown([{
                    "id": "px",
                    "name": "px"
                } , {
                    "id": "pt",
                    "name": "points"
                } , {
                    "id": "cm",
                    "name": "cm"
                } , {
                    "id": "mm",
                    "name": "mm"
                } , {
                    "id": "%",
                    "name": "%"
                } , {
                    "id": "em",
                    "name": "em"
                }]) ).addClass('unit');
        
                Object.defineProperty( this, "unit", {
                    "get": function() {
                        return unit.value;
                    },
                    "set": function( s ) {
                        s = ( s + '' ).toLowerCase();
                    
                        if ( !/^(px|pt|cm|mm|\%|em)$/.test( s ) )
                            s = 'px';
                
                        unit.value = s;
                    }
                } );
                
                unitClass.addEventListener('change', function() {
                    holder.onCustomEvent( 'change' );
                    return true;
                });
                
                unit.addEventListener("change", function() {
                    holder.onCustomEvent( 'change' );
                    return true;
                });
                
                size.addCustomEventListener('change', function() {
                    holder.onCustomEvent( 'change' );
                    return true;
                });
                
                Object.defineProperty( holder, "value", {
                    "get": function() {
                        return unitClass.value == ''
                            ? ( parseInt( size.value || '0' ) + unit.value )
                            : unitClass.value;
                    },
                    "set": function( cssSize ) {
                    
                        var matches;
                        
                        cssSize = ( cssSize || '' ).toString().trim().toLowerCase();
                        
                        switch ( cssSize ) {
                            case 'left':
                            case 'top':
                                cssSize = '0%';
                                break;
                            case 'right':
                            case 'bottom':
                                cssSize = '100%';
                                break;
                            case 'center':
                            case 'middle':
                                cssSize = '50%';
                                break;
                        }
                        
                        if ( ! (matches = /^(auto|inherit|((\-)?[\d\.]+)(px|pt|cm|mm|em|\%)?)$/.exec( (cssSize + '').toLowerCase() ) ) ) {
                            unitClass.value = 'auto';
                            unitClass.onchange();
                        } else {
                            
                            unitClass.value = ( /^auto|inherit$/.test( matches[1] ) ? matches[1] : '' );
                            //console.log( matches[1] );
                            
                            size.value = parseInt( matches[2] || '0' );
                            unit.value = ( matches[4] || 'px' );
                            
                        }
                        
                        unitClass.onchange();
                    }
                } );
                
                var disabled = false,
                    readOnly = false;
                
                Object.defineProperty( holder, "disabled", {
                    "get": function() {
                        return disabled;
                    },
                    "set": function( b ) {
                        b = !!b;
                        for ( var i=0, items = holder.querySelectorAll( 'input, select' ) || [], len=items.length; i<len; i++ )
                            items[i].disabled = b || readOnly;
                        disabled = b;
                    }
                } );
                
                Object.defineProperty( holder, "readOnly", {
                    "get": function() {
                        return readOnly;
                    },
                    "set": function( b ) {
                        b = !!b;
                        for ( var i=0, items = holder.querySelectorAll( 'input, select' ) || [], len=items.length; i<len; i++ )
                            items[i].disabled = b || disabled;
                        readOnly = b;
                    }
                } );

            } );
            
        } )( this );
        
    }).chain( function() {
        
        if ( value )
            this.value = value;
            
    } );
    
}