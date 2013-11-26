function TagsEditor( initialValue, settings ) {

    /* Initial editor value */
    initialValue = initialValue || [];
    if (!initialValue.length)
        initialValue = [ initialValue.toString() ];

    /* Settings ... */
    
    settings = settings || {};

    var holder = $('div', 'DOMTagsEditor');
    holder.tabIndex = 0;
    
    var body = holder.appendChild($('div').setAnchors({
        "width": function(w,h) {
            return w + 'px';
        },
        "height": function(w,h) {
            return h + 'px';
        }
    }));
    
    var writer = body.appendChild(
        $('input').setAttr('type', 'text')
    );
    
    writer.style.fontSize = '12px';
    
    EnableCustomEventListeners( writer );
    
    var lastValue = ' ';

    var values = [];
    
    writer.setWidth = function( e ) {
    
        if (e) {
            /* Ignore the up, down, and enter keys */
            var code = e.keyCode || e.charCode;
            
            if ([40, 38, 37, 39, 13].indexOf( code ) >= 0 && holder.overlay) {
                return;
            }
        
        }
    
        if (lastValue == writer.value)
            return;
        lastValue = writer.value;
        writer.style.width = writer.value.toString().visualWidth('12px') + 10 + 'px';
        body.style.width = body.offsetWidth + 1  + 'px';
        body.style.width = body.offsetWidth - 1  + 'px';
        writer.onCustomEvent('change', lastValue);
    };
    
    /* The textbox should change it's width as-we-type */
    writer.addEventListener('keydown', writer.setWidth, true );
    writer.addEventListener('keyup', writer.setWidth, true );
    writer.addEventListener('keypress', writer.setWidth, true);
    writer.setWidth();
    
    var anchors = {};
    
    Object.defineProperty(holder, 'DOManchors', {
        "get": function() {
            return anchors;
        },
        "set": function(o) {
            o = o || {};
            /* Delete previous anchors */
            for (var old in anchors)
                if (old != 'native' && anchors.propertyIsEnumerable( old ))
                    delete anchors[ old ];
            /* Add new properties */
            for (var p in o) {
                if (o.propertyIsEnumerable( p )) {
                    if (p == 'native')
                        throw "Invalid anchor (used internally): 'native'";
                    anchors[ p ] = o[p];
                }
            }
        }
    });
    
    holder.createLabel = function(str) {
        var div = $('div', 'keyword');
        div.appendChild( $text( str ) );
        
        div.toString = function() {
            return str;
        };
        
        div.closeB = div.appendChild( $('div') );
        div.closeB.onclick = function() {
            holder.remove( str );
        }
        
        div.value = str;
        
        Object.defineProperty(
            div, "label", {
                "get": function() {
                    return str;
                }
            }
        );
        
        div.typeOf = 'string';
        
        return div;
    };
    
    holder.createCheckedLabel = function( str, value ) {
        var div = $('div', 'keyword check');
        var input = div.appendChild( new DOMCheckBox() );
        
        input.addCustomEventListener('change', function(){
            holder.onCustomEvent('change');
            return true;
        });
        
        div.appendChild( $text( str ) );
        
        Object.defineProperty(
            div, "value", {
                "get": function() {
                    return input.checked ? str : null;
                },
                "set": function( bool ) {
                    input.checked = !!bool;
                }
            }
        );
        
        div.value = !!value;
        
        Object.defineProperty(
            div, "label", {
                "get": function() {
                    return str;
                }
            }
        );
        
        div.typeOf = 'checkbox';
        
        div.onclick = function( e ) {
            if ( (e.srcElement || e.target ) != input && !input.disabled && !input.readOnly ) {
                input.checked = !input.checked;
                holder.onCustomEvent('change');
            }
        };
        
        return div;
    }
    
    holder.push = function( str ) {
        if (!str)
            return false;

        str = str.trim();
        
        if (str.length > 256)
            return false;
        
        str = settings.lowerCase ? str.toString().toLowerCase() : str;
        
        for (var i=0, len = values.length; i<len; i++) {
            if (values[i].label == str) {
                if ( values[i].typeOf == 'checkbox' )
                    values[i].value = true;
                return true;
            }
        }
        values.push(
            body.insertBefore(
                new holder.createLabel( str ),
                writer
            )
        );
        
        return true;
    };
    
    holder.remove = function( str ) {
        if (!str) return;
        str = settings.lowerCase ? str.toString() : str;
        for (var i=0; i<values.length; i++) {
            if (values[i].label == str) {
                if ( values[i].typeOf == 'checkbox' ) {
                    holder.onCustomEvent('change');
                    values[i].value = false;
                } else {
                    values[i].parentNode.removeChild( values[i] );
                    values.splice(i, 1);
                    holder.onCustomEvent('change');
                }
                return;
            }
        }
    }
    
    Object.defineProperty( holder, 'value', {
        "get": function() {
            var out = [], value = false;
            for (var i=0; i<values.length; i++) {
                if ( values[i].typeOf == 'string' ) {
                    out.push( values[i].value );
                } else {
                    if ( value = values[i].value )
                        out.push( value );
                }
            }
            return out;
        },
        "set": function( anArray ) {
            if (!(anArray instanceof Array) && typeof anArray != 'string')
                throw "Must set an array or a string!";
            
            anArray = typeof anArray != 'string' ? anArray : (function(s) {
                var s = s.split(',');
                var out = [];
                for (var i=0; i<s.length; i++) {
                    if (s[i].trim())
                        out.push( s[i] );
                }
                return out;
            })( anArray );
            
            /*
            while (values.length) {
                body.removeChild( values[ 0 ] );
                values = values.slice( 1 );
            }
            */
            
            // remove the values[typeOf=string] and set to false the values[typeOf=checkbox]
            for ( var i=values.length-1; i>=0; i-- ) {
                if ( values[i].typeOf == 'checkbox' ) {
                    values[i].value = false;
                } else {
                    body.removeChild( values[ i ] );
                    values.splice( i, 1 );
                }
            }
            
            for (var i=0; i<anArray.length; i++)
                holder.push( anArray[ i ] );
        }
    });
    
    Object.defineProperty( holder, 'length', {
        "get": function() {
            var len = 0;
            for ( var i=0, len = values.length; i<len; i++ ) {
                if ( values[i].typeOf == 'string' ||
                     ( values[i].typeOf == 'checkbox' && values[i].value )
                ) len++;
            }
            return len;
        }
    } );
    
    Keyboard.bindKeyboardHandler( writer, 'enter', function() {
        if ( writer.value.toString().trim() != '') {
            if ( holder.push( writer.value ) )
                holder.onCustomEvent('change');
            writer.value = '';
            writer.setWidth();
        }
    });
    
    settings.sticky = settings.sticky || [];
    
    settings.sticky.sort( function( a, b ) {
        var i1 = a.toString().toLowerCase().trim();
        var i2 = b.toString().toLowerCase().trim();
        return i1 == i2 ? 0 : ( i1 < i2 ? -1 : 1 );
    } );
    
    for ( var i=0, len = settings.sticky.length; i<len; i++ ) {
        (function( str ) {
            var s;
            if ( str && ( s = str.toString().trim() ) ) {
                var item = new holder.createCheckedLabel( settings.lowerCase ? str.toLowerCase() : str, false );
                body.insertBefore(
                    item,
                    writer
                );
                values.push( item );
            }
        } )( settings.sticky[i] );
    }
    
    for (var i=0; i<initialValue.length; i++)
        holder.push( initialValue[i] );
    
    // window.tags = holder;
    
    holder.addEventListener('focus', function() {
        var cScroll = body.scrollTop;
        setTimeout(function() { writer.focus(); body.scrollTop = cScroll; }, 100 );
    }, true);
    
    var overlay = null;
    
    var showOverlay = holder.showOverlay = function() {
        if (!overlay)
            overlay = $('div', 'DOMTagsEditorOverlay');
        if (!overlay.parentNode)
            document.body.appendChild( overlay );
        var xy = getXY( writer );

        overlay.style.left= xy[0] + 'px';
        overlay.style.bottom = '';
        overlay.style.top = xy[1] + writer.offsetHeight + 'px';
        if (overlay.offsetTop + overlay.offsetHeight > getMaxY()) {
            overlay.style.top = '';
            overlay.style.bottom = xy[0] + 'px';
        }
        overlay.style.minWidth = writer.offsetWidth + 30 + 'px';
    };
    
    var hideOverlay = holder.hideOverlay = function() {
        if (!overlay || !overlay.parentNode)
            return;
        document.body.removeChild( overlay );
    }
    
    Object.defineProperty( holder, "overlay", {
        "get": function() {
            return overlay && overlay.parentNode ? true : false;
        },
        "set": function( boolVal ) {
            !!boolVal ? showOverlay() : hideOverlay();
        }
    });
    
    var searchText = null;
    
    holder.getSearchText = function() {
        if (!searchText)
            throw "Search aborted";
        else
            return searchText;
    }
    
    var autoSuggest = function( str ) {
        
        if (!str.trim()) {
            //Hide the overlay;
            holder.overlay = false; //close overlay
            searchText = null;      //also abort autoSuggestions
            return;
        }
        
        if (searchText === null) {
            setTimeout( function() { try { settings.onSearch( holder.getSearchText() ); searchText = null; } catch (e) { if (settings.debug) console.log( "Exception:", e ); } }, settings.latency || 500 );
        }
        
        searchText = str;
    }
    
    if (settings.onSearch) {
        writer.addCustomEventListener('change', function(str) {
            if (holder.overlay)
                holder.overlay = true; //synchronize the overlay position with writer position on screen only if overlay is visible
            autoSuggest( str );
        });
        
        Keyboard.bindKeyboardHandler( writer, 'down', function() {
            if (!holder.overlay || !overlay.firstChild) return;
            var cFocus = overlay.querySelector('div.focus,div:focus');
            if (cFocus) {
                if (cFocus.nextSibling)
                    cFocus.nextSibling.focus();
                else
                    overlay.firstChild.focus();
            } else
                overlay.firstChild.focus();
            searchText = null; //cancel next search;
        });

        Keyboard.bindKeyboardHandler( writer, 'up', function() {
            if (!holder.overlay || !overlay.firstChild) return;
            var cFocus = overlay.querySelector('div.focus,div:focus');
            if (cFocus) {
                if (cFocus.previousSibling)
                    cFocus.previousSibling.focus();
                else
                    overlay.lastChild.focus();
            } else
                overlay.lastChild.focus();
            searchText = null; //cancel next search;
        });
        Keyboard.bindKeyboardHandler( writer, 'esc', function() {
            writer.value = '';
            autoSuggest('');
        }); 
    }
    
    holder.setSuggestions = function( suggestions, highlightStr ) {
        holder.overlay = true;
        overlay.innerHTML = '';
        for (var i=0; i<suggestions.length; i++) {
            (function( str ) {
                
                var opt = $('div');

                opt.appendChild( $text( str ) );
                if (highlightStr) {
                    var ent = highlightStr.htmlEntities();
                    opt.innerHTML = opt.innerHTML.replace( ent, '<b>' + ent + '</b>' );
                }
                
                overlay.appendChild( opt );
                
                opt.clickStr = str;
                
                opt.tabIndex = 0;
                
                opt.onclick = function() {
                    holder.overlay = false;
                    holder.push( opt.clickStr );
                    writer.value = '';
                    writer.setWidth();
                    writer.onCustomEvent('change', '');
                    writer.focus();
                }
                
                opt.onfocus = function() {
                    opt.scrollIntoViewIfNeeded();
                    var opts = overlay.querySelectorAll('div');
                    for (var i=0; i<opts.length; i++)
                        opts[i].className = '';
                    opt.className = 'focus';
                    writer.value = opt.clickStr;
                    writer.setWidth();
                    writer.focus();
                }
                
            })( suggestions[i] );
        }
    };
    
    var readOnly = false;
    
    Object.defineProperty( holder, 'readOnly', {
        "get": function() {
            return readOnly;
        },
        "set": function( boolValue ) {
            boolValue = !!boolValue;
            (boolValue ? addStyle : removeStyle)( holder, 'readOnly' );
            readOnly = boolValue;
            for ( var i=0, inputs = holder.querySelectorAll('input[type=checkbox]'), len = inputs ? inputs.length : 0; i<len; i++ ) {
                inputs[i].readOnly = !!boolValue;
            }
        }
    });
    
    var disabled = false;
    
    Object.defineProperty( holder, 'disabled', {
        "get": function() {
            return disabled;
        },
        "set": function( boolValue ) {
            boolValue = !!boolValue;
            (boolValue ? addStyle : removeStyle)( holder, 'disabled' );
            disabled = boolValue;
            for ( var i=0, inputs = holder.querySelectorAll('input[type=checkbox]'), len = inputs ? inputs.length : 0; i<len; i++ ) {
                inputs[i].disabled = !!boolValue;
            }
        }
    } );
    
    return holder;
}

function PropertyGrid__strTags(div, settings) {
    div.innerHTML = '';
    div.input = div.appendChild(new TagsEditor([], settings.settings || {}));
    
    addStyle(div.input, 'DOMPropertyGrid__textArea');
    
    div.__defineGetter__('value', function() {
        return div.input.value;
    });
    div.__defineSetter__('value', function(o) {
        div.input.value = o;
    });
    
    div.parentNode.verticalResize = typeof settings.resizeable != 'undefined' ? settings.resizeable : true;
    
    if (typeof settings.value != 'undefined')
        div.value = settings.value;
    
    div.parentNode.height = typeof settings.height != 'undefined' ? settings.height : 50;
}