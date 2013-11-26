function ColorPicker( value ) {
    var holder = $('div', 'DOMColorPicker');
    
    EnableCustomEventListeners( holder );
    
    var lastChangedColor = '';
    
    holder.addCustomEventListener('internal_change', function(c) {
        if (c == lastChangedColor) {
            return false;
        }
        lastChangedColor = c;
        
        newColor.style.backgroundColor = c;

        return true;
    });
    
    holder.tabIndex = 0;
    
    var body = holder.appendChild($('div'));
    
    var preview = body.appendChild( $('div', 'preview') );
    
    var expanded= body.appendChild( $('div', 'state') );
    
    var overlay = $('div', "DOMColorPickerOverlay");
    overlay.body = overlay.appendChild($('div'));
    
    /* Insert controls */
    overlay.body.appendChild(
        new DOMLabel("R", {
            "x": 10,
            "y": 120
        })
    );
    
    var redValue = overlay.body.appendChild(
        (new Spinner({
            "minValue": 0,
            "maxValue": 255
        })).setAttr(
            "style", "position: absolute; left: 25px; top: 115px"
        )
    );
    
    overlay.body.appendChild(
        new DOMLabel("G", {
            "x": 10,
            "y": 145
        })
    );

    var greenValue = overlay.body.appendChild(
        (new Spinner({
            "minValue": 0,
            "maxValue": 255
        })).setAttr(
            "style", "position: absolute; left: 25px; top: 140px"
        )
    );

    overlay.body.appendChild(
        new DOMLabel("B", {
            "x": 10,
            "y": 170
        })
    );
    
    var blueValue = overlay.body.appendChild(
        (new Spinner({
            "minValue": 0,
            "maxValue": 255
        })).setAttr(
            "style", "position: absolute; left: 25px; top: 165px"
        )
    );

    overlay.body.appendChild(
        new DOMLabel("H", {
            "x": 90,
            "y": 120
        })
    );
    
    var hueValue = overlay.body.appendChild(
        (new Spinner({
            "minValue": 0,
            "maxValue": 360
        })).setAttr(
            "style", "position: absolute; left: 105px; top: 115px"
        )
    );
    
    overlay.body.appendChild(
        new DOMLabel("S", {
            "x": 90,
            "y": 145
        })
    );

    var saturationValue = overlay.body.appendChild(
        (new Spinner({
            "minValue": 0,
            "maxValue": 100
        })).setAttr(
            "style", "position: absolute; left: 105px; top: 140px"
        )
    );

    overlay.body.appendChild(
        new DOMLabel("L", {
            "x": 90,
            "y": 170
        })
    );
    
    var lightValue = overlay.body.appendChild(
        (new Spinner({
            "minValue": 0,
            "maxValue": 100
        })).setAttr(
            "style", "position: absolute; left: 105px; top: 165px"
        )
    );
    
    var oldColor = overlay.body.appendChild($('div', 'oldColor').setHTML('Cancel'));
    var newColor = overlay.body.appendChild($('div', 'newColor').setHTML('Set'));
    
    var basicColors = overlay.body.appendChild($('div', 'basicColorsHolder'));
    
    overlay.hsHolder = overlay.body.appendChild($('div', 'HS'));
    
    overlay.lHolder  = overlay.body.appendChild($('div', 'L'));
    
    var hsHolderBody;
    
    var canvas = overlay.hsHolder.appendChild( 
        hsHolderBody = $('div')
    ).appendChild( 
        $('canvas', 'HS').
        setAttr('width', 359).
        setAttr('height', 99) 
    );
    
    var hsCross = hsHolderBody.appendChild($('div'));
    
    canvas.tabIndex = 0;
    disableSelection(canvas);
    
    var canvasLight = overlay.lHolder.appendChild($('div')).appendChild(
        $('canvas', 'L').
        setAttr('height', 100).
        setAttr('width', 1)
    );
    
    var isExpanded = false;
    
    var checkClick = function(e) {
        if (!isChildOf( e.src || e.target, overlay) ) {
            holder.expanded = false;
            holder.value = oldColor.style.backgroundColor;
        }
    }
    
    var setPixel = function(imageData, x, y, r, g, b, a) {
        index = (x + y * imageData.width) * 4;
        imageData.data[index+0] = r;
        imageData.data[index+1] = g;
        imageData.data[index+2] = b;
        imageData.data[index+3] = a;
    }

    
    var paint = window.paint = function( ) {
        var ctx = canvas.getContext( '2d' );
        var imgData = ctx.createImageData( canvas.width, canvas.height );
        
        var hue, sat = 0;
        var px;
        for (hue = 0; hue<360; hue++) {
            for (sat = 0; sat < 100; sat++) {
                px = HSL2RGB( hue, sat * 0.01, 0.5 );
                setPixel( imgData, hue, 100 - sat, px.r, px.g, px.b, 255 );
            }
        }
        
        ctx.putImageData( imgData, 0, 0 );
    };
    
    var paintLight = window.paintLight = function( hue, saturation ) {
        var ctx = canvasLight.getContext( '2d' );
        var imgData = ctx.createImageData( canvasLight.width, canvasLight.height );
        var light = 0, px={}, i=0;
        
        for (light=0;light<100; light++) {
            px = HSL2RGB( hue, saturation * 0.01, light * 0.01 );
                setPixel( imgData, 0, 100 - light, px.r, px.g, px.b, 255 );
        }
        
        ctx.putImageData( imgData, 0, 0 );
    };
    

    var HSL2RGB = function(
        a,  // hue
        b,  // saturation
        c   // lightness
    ){
      a *= (6 / 360);
      b = [
        c += b *= c < .5 ?
          c :
          1 - c,
        c - a % 1 * b * 2,
        c -= b *= 2,
        c,
        c + a % 1 * b,
        c + b
      ];
      
      return {
        r: Math.floor((b[ ~~a    % 6 ] * 255)),  // red
        g: Math.floor((b[ (a|16) % 6 ] * 255)),  // green
        b: Math.floor((b[ (a|8)  % 6 ] * 255))   // blue
      };
    };
    
    window.hsl2rgb = HSL2RGB;
        
    var RGB2HEX = window.RGB2HEX = function(rgb) {
        return '#'.concat( (1*rgb.r).toString( 16 ) ).concat( (1*rgb.g).toString(16) ).concat( (1*rgb.b).toString(16) );
    };
    
    var RGB2HSL = function(red, green, blue) {
        var r = red, g = green, b = blue;
        var h, s, l;
        var min, max;
        var delta;

        if (r > g){
           max = Math.max (r, b);
           min = Math.min (g, b);
        }else{
           max = Math.max (g, b);
           min = Math.min (r, b);
        }

        l = (max + min) / 2.0;

        if (max == min){
           s = 0.0;
           h = 0.0;
        }else{
           delta = (max - min);
     
           if (l < 128){
              s = 255 * delta / (max + min);
           }else{
              s = 255 * delta / (511 - max - min);
           }
           if (r == max){
              h = (g - b) / delta;
           }else if (g == max){
              h = 2 + (b - r) / delta;
           }else{
              h = 4 + (r - g) / delta;
           }
     
           h = h * 42.5;
     
           if (h < 0){ h += 255; }
           else if (h > 255){ h -= 255; }
        }
     
        red   = ~~ h;
        green = ~~ s;
        blue  = ~~ l;
        return {h:red % 256,s:green % 256,l:blue % 256};
     };
    
    Object.defineProperty(holder, 'expanded', {
        "get": function() {
            return isExpanded;
        },
        "set": function(bool) {
            bool = !!bool;
            if (bool == isExpanded)
                return;
            switch (bool) {
                case false:
                    if (overlay.parentNode)
                        overlay.parentNode.removeChild( overlay );
                    document.body.removeEventListener('mousedown', checkClick, true);
                    break;
                case true:
                
                    oldColor.style.backgroundColor = holder.value;
                
                    document.body.appendChild( overlay );
                    paint( );
                    var p = new Pinner( holder, overlay, 'bottom-left' );
                    if (overlay.offsetTop + overlay.offsetHeight > document.body.offsetHeight)
                        p.setPinMode( 'top-left', 'bottom-left' );
                        
                    document.body.addEventListener('mousedown', checkClick, true);
                    
                    break;
            }
            isExpanded = bool;
        }
    });
    
    var colors = {
        h: 0,
        s: 0,
        l: 0,
        r: 0,
        g: 0,
        b: 0
    };
    
    Object.defineProperty(holder, 'hue', {
        "get": function() {
            return colors.h;
        },
        "set": function( intVal ) {
            intVal = parseInt(intVal || 0);
            intVal = intVal < 0 ? 0 : ( intVal > 360 ? 360 : intVal );
            colors.h = intVal;
            
            hsCross.style.left = intVal - 8 + 'px';
            hsCross.style.top = 100-holder.saturation-8 + 'px';
            
            paintLight( holder.hue, holder.saturation );
            
            syncRGBByHSL();
        }
    });
    
    Object.defineProperty(holder, 'saturation', {
        "get": function() {
            return colors.s;
        },
        "set": function( intVal ) {
            intVal = parseInt(intVal || 0);
            intVal = intVal < 0 ? 0 : ( intVal > 100 ? 100 : intVal );
            colors.s = intVal;
            
            hsCross.style.top = (100 - intVal) - 8 + 'px';
            hsCross.style.left = holder.hue - 8 + 'px';
            
            paintLight( holder.hue, holder.saturation );

            syncRGBByHSL();
        }
    });
    
    Object.defineProperty(holder, 'light', {
        "get": function() {
            return colors.l;
        },
        "set": function( intVal ) {
            intVal = parseInt(intVal || 0);
            intVal = intVal < 0 ? 0 : ( intVal > 100 ? 100 : intVal );
            overlay.lHolder.style.backgroundPosition = '100% ' + (100 - intVal - 3) +'px';
            colors.l = intVal;

            syncRGBByHSL();
        }
    });
    
    Object.defineProperty(holder, 'HSL', {
        "get": function() {
            return 'hsl(' + holder.hue+','+holder.saturation+','+holder.light + ')';
        }
    });
    
    Object.defineProperty(holder, 'red', {
        "get": function() {
            return colors.r;
        },
        "set": function(intVal) {
            intVal = intVal || 0;
            
            intVal = intVal < 0 ? 0 : ( intVal > 255 ? 255 : intVal );
            
            colors.r = intVal;

            syncHSLByRGB( false );
        }
    });
    
    Object.defineProperty(holder, 'green', {
        "get": function() {
            return colors.g;
        },
        "set": function(intVal) {
            intVal = intVal || 0;

            intVal = intVal < 0 ? intVal : ( intVal > 255 ? 255 : intVal );
            
            colors.g = intVal;

            syncHSLByRGB();
        }
    });
    
    Object.defineProperty(holder, 'blue', {
        "get": function() {
            return colors.b;
        },
        "set": function(intVal) {
            intVal = intVal || 0;
            
            intVal = intVal < 0 ? intVal : ( intVal > 255 ? 255 : intVal );
            
            colors.b = intVal;

            syncHSLByRGB();
        }
    });
    
    var syncHSLByRGB = function() {
        var hsl = RGB2HSL( colors.r, colors.g, colors.b );
        
        hsl.h = ((3.6 * hsl.h / 2.55) + 0.5) << 0;
        hsl.s = ((hsl.s / 2.55) + 0.5) << 0;
        hsl.l = ((hsl.l / 2.55) + 0.5) << 0;
        
        colors.h = hsl.h;
        colors.s = hsl.s;
        colors.l = hsl.l;
        
        paintLight( colors.h, colors.s );
        
        overlay.lHolder.style.backgroundPosition = '100% ' + (100 - holder.light - 3) +'px';

        hsCross.style.left = holder.hue - 8 + 'px';
        hsCross.style.top = 100 - holder.saturation - 8 + 'px';
        

        preview.style.backgroundColor = holder.value;
    };
    
    Object.defineProperty(holder, 'RGB', {
        "get": function() {
            return 'rgb(' + holder.red+','+holder.green+','+holder.blue+')';
        }
    });
    
    var hexPad = function(s) {
        return s.toString().length == 1 ? '0' + s : s;
    };
    
    Object.defineProperty(holder, 'value', {
        "get": function() {
            return '#' + hexPad(holder.red.toString(16)) + hexPad(holder.green.toString(16)) + hexPad(holder.blue.toString(16));
        },
        "set": function( str ) {
            var test;
            if ( test = /^rgb\(([\s]+)?([\d]+)([\s]+)?,([\s]+)?([\d]+)([\s]+)?,([\s]+)?([\d]+)([\s]+)?\)$/i.exec( str )) {
            
                colors.r = parseInt(test[2]);
                colors.g = parseInt(test[5]);
                colors.b = parseInt(test[8]);
                
                syncHSLByRGB();
                
                preview.style.backgroundColor = holder.value;

                holder.onCustomEvent('internal_change', holder.value );
                
                return;
            }
            
            if ( test = /^(\#)?([\da-f]{1})([\da-f]{1})([\da-f]{1})$/i.exec( str )) {
            
                colors.r = parseInt( test[2].concat(test[2]), 16 );
                colors.g = parseInt( test[3].concat(test[3]), 16 );
                colors.b = parseInt( test[4].concat(test[4]), 16 );
                
                syncHSLByRGB();

                preview.style.backgroundColor = holder.value;

                holder.onCustomEvent('internal_change', holder.value );
                
                return;
            }

            if ( test = /^(\#)?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec( str )) {
            
                colors.r = parseInt( test[2], 16 );
                colors.g = parseInt( test[3], 16 );
                colors.b = parseInt( test[4], 16 );
                
                syncHSLByRGB();

                preview.style.backgroundColor = holder.value;

                holder.onCustomEvent('internal_change', holder.value );
                
                return;
            }
            
            throw "Invalid color: " + str;
        }
    });
    
    var syncRGBByHSL = function() {
        var rgb = HSL2RGB( holder.hue, holder.saturation * 0.01, holder.light * 0.01 );

        colors.r = rgb.r;
        colors.g = rgb.g;
        colors.b = rgb.b;

        preview.style.backgroundColor = holder.value;
        
        holder.onCustomEvent('internal_change', holder.value );
    };
    
    holder.addEventListener('mousedown', function(e) {
        if (!holder.expanded && e.which == 1) {
            holder.expanded = true;
            e.stopPropagation();
            e.preventDefault();
        }
    }, true);
    
    /* HS canvas button down function */
    
    var canvasBtnDownFunc = function(e) {
        
        var target = e.target || e.srcElement;
        
        var x = 0, y = 0;
        x = e.offsetX;
        y = e.offsetY;

        if (target == hsCross) {
            x += hsCross.offsetLeft;
            y += hsCross.offsetTop;
        }
        
        colors.h = x;
        holder.saturation = 100 - y;
        
        syncRGBByHSL();
        
        canvas.btnDown = true;
    };
    
    /* HS Canvas mouse move function */
    
    var canvasMouseMoveFunc = function(e) {
        if (!canvas.btnDown) return;

        var target = e.target || e.srcElement;
        
        var x = 0, y = 0;
        x = e.offsetX;
        y = e.offsetY;

        if (target == hsCross) {
            x += hsCross.offsetLeft;
            y += hsCross.offsetTop;
        }
        
        colors.h = x;
        holder.saturation = 100 - y;
        
        syncRGBByHSL();
    };
    
    var canvasMouseUpFunc = function(e) {
        if (isChildOf( e.srcElement || e.target, hsHolderBody ) && e.type == 'mouseout') {
            return;
        }
        canvas.btnDown = false;
    }
    
    /* Main canvas (Hue / Sat) mouse events */
    canvas.addEventListener('mousedown', canvasBtnDownFunc, true);
    hsCross.addEventListener('mousedown', canvasBtnDownFunc, true);
    canvas.addEventListener('mousemove', canvasMouseMoveFunc, true);
    hsCross.addEventListener('mousemove', canvasMouseMoveFunc, true);
    canvas.addEventListener('mouseup', canvasMouseUpFunc, true);
    hsCross.addEventListener('mouseup', canvasMouseUpFunc, true);
    canvas.addEventListener('mouseout', canvasMouseUpFunc, true);
    hsCross.addEventListener('mouseout', canvasMouseUpFunc, true);
    
    var LightButtonDownFunction = function(e) {
        canvasLight.btnDown = true;
        holder.light = 100 - e.offsetY;
    };
    
    var LightButtonUpFunction = function(e) {
        canvasLight.btnDown = false;
    }
    
    var LightMouseMoveFunction = function(e) {
        if (!canvasLight.btnDown)
            return;
        holder.light = 100 - e.offsetY;
    };
    
    /* Secondary canvas (Light) mouse events */
    
    canvasLight.addEventListener('mousedown', LightButtonDownFunction, true);
    canvasLight.addEventListener('mouseup', LightButtonUpFunction, true);
    canvasLight.addEventListener('mousemove', LightMouseMoveFunction, true);
    canvasLight.addEventListener('mouseout', LightMouseMoveFunction, true);
    
    
    Keyboard.bindKeyboardHandler( holder, 'space', function() { holder.expanded = true; });
    Keyboard.bindKeyboardHandler( holder, 'enter', function() { holder.expanded = true; });
    Keyboard.bindKeyboardHandler( holder, 'esc',   function() { holder.expanded = false; } );
    
    holder.addCustomEventListener('internal_change', function() {
        redValue.value = holder.red;
        greenValue.value = holder.green;
        blueValue.value = holder.blue;
        hueValue.value = holder.hue;
        saturationValue.value = holder.saturation;
        lightValue.value = holder.light;
    });
    
    redValue.addCustomEventListener(        'change', function() { holder.red = redValue.value; });
    greenValue.addCustomEventListener(      'change', function() { holder.green = greenValue.value; });
    blueValue.addCustomEventListener(       'change', function() { holder.blue = blueValue.value; });
    hueValue.addCustomEventListener(        'change', function() { holder.hue = hueValue.value; });
    saturationValue.addCustomEventListener( 'change', function() { holder.saturation = saturationValue.value; });
    lightValue.addCustomEventListener(      'change', function() { holder.light = lightValue.value; });
    
    holder.value = value;
    
    oldColor.addEventListener('click', function() {
        holder.value = oldColor.style.backgroundColor;
        holder.expanded = false;

        holder.onCustomEvent('change', holder.value );
    }, true);

    newColor.addEventListener('click', function() {
        holder.value = newColor.style.backgroundColor;
        holder.expanded = false;
        holder.onCustomEvent('change', holder.value );
    }, true);
    
    newColor.title = "Current Color";
    oldColor.title = "Previous Color";
    
    var cl = [
        {
            "name": "White",
            "value": "#ffffff"
        },
        {
            "name": "Silver",
            "value": "#c0c0c0"
        },
        {
            "name": "Gray",
            "value": "#808080"
        },
        {
            "name": "Black",
            "value": "#000000"
        },
        {
            "name": "Red",
            "value": "#ff0000"
        },
        {
            "name": "Maroon",
            "value": "#800000"
        },
        {
            "name": "Yellow",
            "value": "#ffff00"
        },
        {
            "name": "Olive",
            "value": "#808000"
        },
        {
            "name": "Lime",
            "value": "#00ff00"
        },
        {
            "name": "Green",
            "value": "#008000"
        },
        {
            "name": "Aqua",
            "value": "#00ffff"
        },
        {
            "name": "Teal",
            "value": "#008080"
        },
        {
            "name": "Blue",
            "value": "#0000ff"
        },
        {
            "name": "Navy",
            "value": "#000080"
        },
        {
            "name": "Fuchsia",
            "value": "#ff00ff"
        },
        {
            "name": "Purple",
            "value": "#800080"
        }
    ];
    
    var d;
    
    for (var i=0; i<cl.length; i++) {
        
        (d = basicColors.appendChild( $('div').setAttr('style', "background-color: " + cl[i].value).setAttr('title', cl[i].name) )).onclick = function() {
            holder.value = this.style.backgroundColor;
        };
        
        d.ondblclick = function() {
            holder.expanded = false;
            holder.onCustomEvent('change', holder.value);
        }
    }
    
    return holder;
}