function HSlider(conf) {
    var holder = $('div', 'DomHSlider');
    
    EnableCustomEventListeners(holder);
    
    holder.config = conf || {
        'value': 0,
        'minValue': 0,
        'maxValue': 100,
        'step': 1
    };
    
    holder.config.value = typeof holder.config.value != 'undefined' ? holder.config.value : 0;
    holder.config.minValue = typeof holder.config.minValue != 'undefined' ? holder.config.minValue : 0;
    holder.config.maxValue = typeof holder.config.maxValue != 'undefined' ? holder.config.maxValue : 100;
    holder.config.step = typeof holder.config.step != 'undefined' ? holder.config.step : 1;
    
    holder.inner = holder.appendChild($('div','inner'));
    holder.handle= holder.inner.appendChild($('div', 'handle'));
    
    holder.getValue = function() {
        return holder.config.value;
    };
    
    holder.setValue = function(floatVal) {
        var truncVal;
        
        floatVal -= holder.config.minValue;
        floatVal -= (truncVal = (floatVal % holder.config.step));
        floatVal += holder.config.minValue;
        
        if (truncVal >= holder.config.step / 2) floatVal += holder.config.step;
        
        //truncate ...
        floatVal = (floatVal < holder.config.minValue) ? holder.config.minValue :
                (floatVal > holder.config.maxValue  ? holder.config.maxValue : floatVal );
                
        //calculate interval length ...
        var intLength = holder.config.maxValue - holder.config.minValue;
        var phisiPix = holder.inner.offsetWidth - holder.handle.offsetWidth;
        var floatUnit = phisiPix / intLength;
        
        holder.handle.style.left = ((floatVal - holder.config.minValue) * floatUnit) + 'px';
        
        if (holder.config.value == floatVal) return false;
        else { holder.config.value = floatVal; return true; }
    };
    
    holder.getStep = function() {
        return holder.config.step;
    };
    
    holder.setStep = function(floatVal) {
        holder.config.step = floatVal;
        holder.setValue(holder.config.value);
    };
    
    holder.getMinValue = function() {
        return holder.config.minValue;
    };
    
    holder.setMinValue = function(floatVal) {
        holder.config.minValue = floatVal;
        holder.setValue(holder.config.value);
    };
    
    holder.getMaxValue = function() {
        return holder.config.maxValue;
    };
    
    holder.setMaxValue = function(floatVal) {
        holder.config.maxValue = floatVal;
        holder.setValue(holder.config.value);
    };
    
    holder.getValueInPixels = function() {
        return holder.handle.offsetLeft;
    };
    
    holder.setValueInPixels = function(intVal) {
        var intLength = holder.config.maxValue - holder.config.minValue;
        var phisiPix = holder.inner.offsetWidth - holder.handle.offsetWidth;
        var floatUnit = phisiPix / intLength;
        
        if (intVal < 0) intVal = 0; else 
        if (intVal + holder.handle.offsetWidth > holder.inner.offsetWidth) intVal = holder.inner.offsetWidth - holder.handle.offsetWidth;
        
        holder.handle.style.left = intVal + 'px';
        
        return holder.setValue(holder.config.minValue + ( intVal / floatUnit ));
    };
    
    //crossBrowser scroll function
    holder.scrollFunction = function(e) {
        e = e || window.event;
        switch (true) {
            case typeof window.opera != 'undefined': //Presto
                var lines = e.wheelDelta / 40; //Opera has 2 lines / scroll
                break;
            case typeof e.wheelDelta != 'undefined': //Webkit
                var lines = e.wheelDelta / 40; //Chrome has 3 lines / scroll
                break;
            case typeof e.detail != 'undefined': //Gecko
                var lines = - e.detail / 3;
                break;
            default: 
                var lines = 0;
                break;
        }
        //force the num of lines to be eq with 1
        lines = lines < 0 ? -1 : 1;
        if (holder.setValue(lines * holder.config.step + holder.config.value))
            holder.onCustomEvent('change', { 'ctl': holder });
    };
    
    try {
        holder.addEventListener('mousewheel', holder.scrollFunction, true);
        holder.addEventListener('DOMMouseScroll', holder.scrollFunction, true);
    } catch(ex) {
        holder.attachEvent('onmousewheel', holder.scrollFunction);
    }
    
    
    holder.onDragStart = function() { };
    
    holder.onDragRun = function() {
        if (holder.setValueInPixels(holder.handle.offsetLeft))
            holder.onCustomEvent('change', { 'ctl': holder });
    };
    
    holder.onDragStop = function() { };
    
    holder.handle.setAttribute('dragable', '1');
    
    holder.__dragListener = 
          new dragObject(holder.handle, null, 
                         new Position(0, 0), 
                         new Position(5000, 0), 
                         holder.onDragStart, 
                         holder.onDragRun, 
                         holder.onDragStop
          );
        
        
    //
    
    /* Keyboard functionality */
    holder.kbThread = null;
    holder.kbDelta = 1; //we want to "accelerate" increments and decrements ...
    
    holder.decrementThreadFunc = function() {
        if (holder.kbDelta < 10) holder.kbDelta *= 1.1;
        if (holder.setValue(Math.floor(holder.kbDelta) * -holder.config.step + holder.config.value))
        holder.onCustomEvent('change', {'ctl': holder});
    };
    
    holder.incrementThreadFunc = function() {
        if (holder.kbDelta < 10) holder.kbDelta *= 1.1;
        if (holder.setValue(Math.floor(holder.kbDelta) * holder.config.step + holder.config.value))
        holder.onCustomEvent('change', {'ctl': holder});
    };
    
    holder.winKeyUpFunction = function() {
        try {
            window.removeEventListener('keyup', holder.winKeyUpFunction, true);
        } catch(ex) {
            window.detachEvent('onkeyup', holder.winKeyUpFunction);
        }
        window.clearInterval(holder.kbThread);
        holder.kbThread = null;
    };
    
    holder.startKeyDownThread = function( func ) {
    
        holder.kbDelta = 1;
        
        func();
    
        if (holder.kbThread !== null) holder.winKeyUpFunction();
        holder.kbThread = window.setInterval(func, 100);
        
        try {
            window.addEventListener('keyup', holder.winKeyUpFunction, true);
        } catch(ex) {
            window.attachEvent('onkeyup', holder.winKeyUpFunction);
        }
    };
    
    holder.keyboardHandler = function(e) {
        e = e || window.event;
        charCode = Math.max(e.keyCode ? e.keyCode : 0, e.charCode ? e.charCode : 0);
        if (charCode == 0) return;
        
            //40 - down
            //38 - up
            //39 - right
            //37 - left
            //32 - space (toggle)
            //13 - enter
            //46 - delete
         
         switch (charCode) {
            case 37:
                holder.startKeyDownThread(holder.decrementThreadFunc);
                cancelEvent(e);
                break;
            case 39:
                holder.startKeyDownThread(holder.incrementThreadFunc);
                cancelEvent(e);
                break;
         }
    };
    
    //Mouse functions (increment / decrement by clicking the up/down buttons)
    
    try {
        holder.addEventListener('keydown', holder.keyboardHandler, true);
    } catch(ex) {
        holder.attachEvent('onkeydown', holder.keyboardHandler);
    }
    //
        
        
    if (holder.__defineGetter__) {
        holder.__defineGetter__('value', holder.getValue);
        holder.__defineSetter__('value', holder.setValue);
        holder.__defineGetter__('step', holder.getStep);
        holder.__defineSetter__('step', holder.setStep);
        holder.__defineGetter__('minValue', holder.getMinValue);
        holder.__defineSetter__('minValue', holder.setMinValue);
        holder.__defineGetter__('maxValue', holder.getMaxValue);
        holder.__defineSetter__('maxValue', holder.setMaxValue);
        holder.__defineGetter__('valueInPixels', holder.getValueInPixels);
        holder.__defineSetter__('valueInPixels', holder.setValueInPixels);
    } else
    if (Object.defineProperty) {
        Object.defineProperty(holder, 'value', { 'get': holder.getValue, 'set': holder.setValue });
        Object.defineProperty(holder, 'step',  { 'get': holder.getStep,  'set': holder.setStep });
        Object.defineProperty(holder, 'minValue', {'get': holder.getMinValue, 'set': holder.setMinValue });
        Object.defineProperty(holder, 'maxValue', { 'get': holder.getMaxValue, 'set': holder.setMaxValue });
    }
    
    holder.tabIndex = 0;
    
    holder.DOManchors = {
        dummy: function(w,h) {
            holder.setValue(holder.getValue());
            return '';
        }
    };
    
    (function() {
        var _domAnchors = {
            "__dummy": function() {
                holder.setValue( holder.getValue() );
            }
        };
        
        Object.defineProperty(
            holder, 
            'DOManchors', {
                'get': function() {
                    return _domAnchors;
                },
                
                'set': function(obj) {
                    var out = {};
                    
                    for (var key in obj) {
                        if ( obj.propertyIsEnumerable (key) )
                            out[key] = obj[key];
                        out.__dummy = _domAnchors.__dummy;
                    }
                    
                    _domAnchors = out;
                }
            }
        );
        
    })();
    
    return holder;
}



function VSlider(conf) {
    var holder = $('div', 'DomVSlider');
    
    EnableCustomEventListeners(holder);
    
    holder.config = conf || {
        'value': 0,
        'minValue': 0,
        'maxValue': 100,
        'step': 1
    };
    
    holder.config.value = typeof holder.config.value != 'undefined' ? holder.config.value : 0;
    holder.config.minValue = typeof holder.config.minValue != 'undefined' ? holder.config.minValue : 0;
    holder.config.maxValue = typeof holder.config.maxValue != 'undefined' ? holder.config.maxValue : 100;
    holder.config.step = typeof holder.config.step != 'undefined' ? holder.config.step : 1;
    
    holder.inner = holder.appendChild($('div','inner'));
    holder.handle= holder.inner.appendChild($('div', 'handle'));
    
    holder.getValue = function() {
        return holder.config.value;
    };
    
    holder.setValue = function(floatVal) {
        var truncVal;
        
        floatVal -= holder.config.minValue;
        floatVal -= (truncVal = (floatVal % holder.config.step));
        floatVal += holder.config.minValue;
        
        if (truncVal >= holder.config.step / 2) floatVal += holder.config.step;
        
        //truncate ...
        floatVal = (floatVal < holder.config.minValue) ? holder.config.minValue :
                (floatVal > holder.config.maxValue  ? holder.config.maxValue : floatVal );
                
        //calculate interval length ...
        var intLength = holder.config.maxValue - holder.config.minValue;
        var phisiPix = holder.inner.offsetHeight - holder.handle.offsetHeight;
        var floatUnit = phisiPix / intLength;
        
        holder.handle.style.top = ((floatVal - holder.config.minValue) * floatUnit) + 'px';
        
        if (holder.config.value == floatVal) return false;
        else { holder.config.value = floatVal; return true; }
    };
    
    holder.getStep = function() {
        return holder.config.step;
    };
    
    holder.setStep = function(floatVal) {
        holder.config.step = floatVal;
        holder.setValue(holder.config.value);
    };
    
    holder.getMinValue = function() {
        return holder.config.minValue;
    };
    
    holder.setMinValue = function(floatVal) {
        holder.config.minValue = floatVal;
        holder.setValue(holder.config.value);
    };
    
    holder.getMaxValue = function() {
        return holder.config.maxValue;
    };
    
    holder.setMaxValue = function(floatVal) {
        holder.config.maxValue = floatVal;
        holder.setValue(holder.config.value);
    };
    
    holder.getValueInPixels = function() {
        return holder.handle.offsetTop;
    };
    
    holder.setValueInPixels = function(intVal) {
        var intLength = holder.config.maxValue - holder.config.minValue;
        var phisiPix = holder.inner.offsetHeight - holder.handle.offsetHeight;
        var floatUnit = phisiPix / intLength;
        
        if (intVal < 0) intVal   = 0; else 
        if (intVal + holder.handle.offsetHeight > holder.inner.offsetHeight) intVal = holder.inner.offsetHeight - holder.handle.offsetHeight;
        
        holder.handle.style.top = intVal + 'px';
        
        return holder.setValue(holder.config.minValue + ( intVal / floatUnit ));
    };
    
    //crossBrowser scroll function
    holder.scrollFunction = function(e) {
        e = e || window.event;
        switch (true) {
            case typeof window.opera != 'undefined': //Presto
                var lines = e.wheelDelta / 40; //Opera has 2 lines / scroll
                break;
            case typeof e.wheelDelta != 'undefined': //Webkit
                var lines = e.wheelDelta / 40; //Chrome has 3 lines / scroll
                break;
            case typeof e.detail != 'undefined': //Gecko
                var lines = - e.detail / 3;
                break;
            default: 
                var lines = 0;
                break;
        }
        //force the num of lines to be eq with 1
        lines = lines < 0 ? -1 : 1;
        
        if (holder.setValue(-lines * holder.config.step + holder.config.value))
            holder.onCustomEvent('change', { 'ctl': holder });
    };
    
    try {
        holder.addEventListener('mousewheel', holder.scrollFunction, true);
        holder.addEventListener('DOMMouseScroll', holder.scrollFunction, true);
    } catch(ex) {
        holder.attachEvent('onmousewheel', holder.scrollFunction);
    }
    
    
    holder.onDragStart = function() { };
    
    holder.onDragRun = function() {
        if (holder.setValueInPixels(holder.handle.offsetTop))
            holder.onCustomEvent('change', { 'ctl': holder });
    };
    
    holder.onDragStop = function() { };
    
    holder.handle.setAttribute('dragable', '1');
    
    holder.__dragListener = 
          new dragObject(holder.handle, null, 
                         new Position(0, 0), 
                         new Position(0, 5000), 
                         holder.onDragStart, 
                         holder.onDragRun, 
                         holder.onDragStop
          );
        
        
    //
    
    /* Keyboard functionality */
    holder.kbThread = null;
    holder.kbDelta = 1; //we want to "accelerate" increments and decrements ...
    
    holder.decrementThreadFunc = function() {
        if (holder.kbDelta < 10) holder.kbDelta *= 1.1;
        if (holder.setValue(Math.floor(holder.kbDelta) * -holder.config.step + holder.config.value))
        holder.onCustomEvent('change', {'ctl': holder});
    };
    
    holder.incrementThreadFunc = function() {
        if (holder.kbDelta < 10) holder.kbDelta *= 1.1;
        if (holder.setValue(Math.floor(holder.kbDelta) * holder.config.step + holder.config.value))
        holder.onCustomEvent('change', {'ctl': holder});
    };
    
    holder.winKeyUpFunction = function() {
        try {
            window.removeEventListener('keyup', holder.winKeyUpFunction, true);
        } catch(ex) {
            window.detachEvent('onkeyup', holder.winKeyUpFunction);
        }
        window.clearInterval(holder.kbThread);
        holder.kbThread = null;
    };
    
    holder.startKeyDownThread = function( func ) {
    
        holder.kbDelta = 1;
        
        func();
    
        if (holder.kbThread !== null) holder.winKeyUpFunction();
        holder.kbThread = window.setInterval(func, 100);
        
        try {
            window.addEventListener('keyup', holder.winKeyUpFunction, true);
        } catch(ex) {
            window.attachEvent('onkeyup', holder.winKeyUpFunction);
        }
    };
    
    holder.keyboardHandler = function(e) {
        e = e || window.event;
        charCode = Math.max(e.keyCode ? e.keyCode : 0, e.charCode ? e.charCode : 0);
        if (charCode == 0) return;
        
            //40 - down
            //38 - up
            //39 - right
            //37 - left
            //32 - space (toggle)
            //13 - enter
            //46 - delete
         
         switch (charCode) {
            case 38:
                holder.startKeyDownThread(holder.decrementThreadFunc);
                cancelEvent(e);
                break;
            case 40:
                holder.startKeyDownThread(holder.incrementThreadFunc);
                cancelEvent(e);
                break;
         }
    };
    
    //Mouse functions (increment / decrement by clicking the up/down buttons)
    
    try {
        holder.addEventListener('keydown', holder.keyboardHandler, true);
    } catch(ex) {
        holder.attachEvent('onkeydown', holder.keyboardHandler);
    }
    //
        
        
    if (holder.__defineGetter__) {
        holder.__defineGetter__('value', holder.getValue);
        holder.__defineSetter__('value', holder.setValue);
        holder.__defineGetter__('step', holder.getStep);
        holder.__defineSetter__('step', holder.setStep);
        holder.__defineGetter__('minValue', holder.getMinValue);
        holder.__defineSetter__('minValue', holder.setMinValue);
        holder.__defineGetter__('maxValue', holder.getMaxValue);
        holder.__defineSetter__('maxValue', holder.setMaxValue);
        holder.__defineGetter__('valueInPixels', holder.getValueInPixels);
        holder.__defineSetter__('valueInPixels', holder.setValueInPixels);
    } else
    if (Object.defineProperty) {
        Object.defineProperty(holder, 'value', { 'get': holder.getValue, 'set': holder.setValue });
        Object.defineProperty(holder, 'step',  { 'get': holder.getStep,  'set': holder.setStep });
        Object.defineProperty(holder, 'minValue', {'get': holder.getMinValue, 'set': holder.setMinValue });
        Object.defineProperty(holder, 'maxValue', { 'get': holder.getMaxValue, 'set': holder.setMaxValue });
    }
    
    holder.tabIndex = 0;
    
    (function() {
        var _domAnchors = {
            "__dummy": function() {
                holder.setValue( holder.getValue() );
            }
        };
        
        Object.defineProperty(
            holder, 
            'DOManchors', {
                'get': function() {
                    return _domAnchors;
                },
                
                'set': function(obj) {
                    var out = {};
                    
                    for (var key in obj) {
                        if ( obj.propertyIsEnumerable (key) )
                            out[key] = obj[key];
                        out.__dummy = _domAnchors.__dummy;
                    }
                    
                    _domAnchors = out;
                }
            }
        );
        
    })();
    
    return holder;
}