function TagPicker( dataset ) {
    var holder = $('div', 'DOMTagPicker');
    var body = holder.appendChild( $('div') );
    
    var value = [];
    
    var display = body.appendChild( $('div', 'display') );
    var drop = $('div', 'DOMTagPickerOverlay');
    
    Keyboard.setFocusCycling( drop );
    
    body.setAnchors( {
        "width": function(w,h) {
            return w + 'px';
        },
        "height": function(w,h) {
            return h + 'px';
        }
    } );
    
    Object.defineProperty( holder, 'value', {
        "get": function() {
            return value.length ? '|' + value.join('|') + '|' : '';
        },
        "set": function(str) {
            display.innerHTML = '';
            
            if (str) {
                var s = str.toString().split('|');
                value = [];
                var outString = [];
                for (var i=0; i<s.length; i++) {
                    if (s[i].toString().length && typeof dataset[ s[i] ] != 'undefined') {
                        value.push( s[i] );
                        outString.push( dataset[ s[i] ] );
                    }
                }
                display.appendChild( $text( outString.join(', ') ) );
            } else { 
                value = []; 
            }
        }
    });
    
    holder.tabIndex = 0;
    
    function hide() {
        try {
            document.body.removeChild( drop );
        } catch (e) {}
        drop.style.display = 'none';
        drop.innerHTML = '';
        console.log('hide');
    }
    
    function show() {
        drop.style.width = holder.offsetWidth + 'px';
        var xy = getXY( holder );
        drop.style.top = xy[1]+holder.offsetHeight+1+'px';
        drop.style.left = xy[0]+'px';
        document.body.appendChild(drop);
        drop.style.display = 'block';
        console.log('show');
    }
    
    var bodyClickListener = function(e) {
        
        try {
        
        if (!isChildOf( e.target || e.srcElement, holder ) && !isChildOf( e.target || e.srcElement, drop) ) {
            document.body.removeEventListener( 'click', bodyClickListener, true);
            hide();
        }
        
        } catch (e) {}
        
    };
    
    var focusHolder = function( e ) {
    
        if (drop.style.display == 'block') 
            return;
    
        show();
        drop.innerHTML = '';
        
        document.body.addEventListener('click', bodyClickListener, true);
        
        for (var prop in dataset) {
            if (dataset.propertyIsEnumerable( prop )) {
                
                (function(id, name) {
                    var lbl = $('label');
                    var chk = lbl.appendChild( $('input').setAttr('type', 'checkbox') );
                    lbl.appendChild( $text( name ) );
                    chk.checked = value.indexOf( id ) != -1;
                    drop.appendChild( lbl );
                    
                    lbl.tabIndex = 0;
                    
                    chk.addEventListener("click", function(){
                        
                        console.log('c');
                        
                        switch (chk.checked) {
                            case true:
                                value.push( id.toString() );
                                holder.value = value.join('|');
                                break;
                            case false:
                                value.splice( value.indexOf( id.toString() ), 1 );
                                holder.value = value.join('|');
                                break;
                        }
                        
                    }, true);
                    
                })( prop, dataset[prop] );
                
            }
        }
    };
    
    holder.addEventListener('mousedown', focusHolder, true);
    Keyboard.bindKeyboardHandler( holder, 'esc', function() {
        bodyClickListener( {"target": document.body} );
    });
    
    return holder;
}

function PropertyGrid__tags(div, settings) {
    div.innerHTML = '';
    div.input = div.appendChild((new TagPicker(settings.values)));

    addStyle(div.input, 'DOMPropertyGrid__inputTags');

    if (typeof settings.placeholder != 'undefined')
        div.input.setAttr('placeholder', settings.placeholder);

    div.__defineGetter__('value', function() {
        return div.input.value;
    });

    div.__defineSetter__('value', function(str) {
        div.input.value = str;
    });

    div.value = typeof settings.value == 'undefined' ? '' : settings.value;
}