/** Spinner Control
    
    constructor params: {
        'value': 
        'minValue':
        'maxValue':
        'step':
    }
    
    properties:
    (get | set) value
    (get | set) minValue
    (get | set) maxValue
    (get | set) step

*/

function Spinner(config) {
    var holder = $('div', 'DomSpinner');
    
    EnableCustomEventListeners(holder);
//     holder.__DEBUG_CUSTOM_EVENT_LISTENERS__ = true;
    
    holder.config = config || {
        'value': 0,
        'minValue': 0,
        'maxValue': 100,
        'step': 1
    };
    
    holder.config.value    = typeof holder.config.value != 'undefined'    ? holder.config.value    : 0;
    holder.config.minValue = typeof holder.config.minValue != 'undefined' ? holder.config.minValue : 0;
    holder.config.maxValue = typeof holder.config.maxValue != 'undefined' ? holder.config.maxValue : Number.MAX_VALUE;
    holder.config.step     = typeof holder.config.step != 'undefined'     ? holder.config.step     : 1;
    
    holder.inner = holder.appendChild($('div', 'DomSpinnerInner'));
    
    holder.up   = holder.inner.appendChild($('div', 'up'));
    holder.down = holder.inner.appendChild($('div', 'down'));
    holder.drag = holder.inner.appendChild($('div', 'drag'));
    
    holder.ctl = $('input', 'DomSpinnerCtl');
    holder.inner.appendChild(holder.ctl);
    
    
    holder.getValue = function() {
        return holder.config.value;
    };
    
    holder.setValue = function(floatVal) {
    
        floatVal = (floatVal < holder.config.minValue) ? holder.config.minValue : (
            ( floatVal > holder.config.maxValue ) ? holder.config.maxValue : floatVal
        );
    
        if (floatVal != holder.config.value) { 
//             console.log(float+'!='+holder.config.value);
            holder.config.value = floatVal;
            holder.ctl.value = floatVal;
            return true;
        } else {
//             console.log(float+'=='+holder.config.value);
            holder.ctl.value = floatVal;
            return false;
        }
    };
    
    holder.getMinValue = function() {
        return holder.config.minValue;
    };
    
    holder.setMinValue = function(floatVal) {
        holder.config.minValue = floatVal;
        if (holder.getValue() < floatVal) holder.setValue(floatVal);
    };
    
    holder.getMaxValue = function() {
        return holder.config.maxValue;
    };
    
    holder.setMaxValue = function(floatVal) {
        holder.config.maxValue = floatVal;
        if (holder.getValue() > floatVal) holder.setValue(floatVal);
    };
    
    holder.getStep = function() {
        return holder.config.step;
    };
    
    holder.setStep = function(floatVal) {
        holder.config.step = floatVal;
    };
    
    holder.setValue(holder.config.value);
    
    holder.drag.setAttribute('dragable', '1');
    
    holder.__oDragY = 0;
    holder.__oDragX = 0;
    holder.__oNowValue = 0;
    
    holder.onHandleDragStart = function() {
        holder.__oDragY = holder.drag.offsetTop;  //save the top position and the value of the drag handle
        holder.__oDragX = holder.drag.offsetLeft;
        holder.__oNowValue = holder.getValue();
        //and convert the drag handler to absolute position (in px)
        holder.drag.style.top = holder.__oDragY + 'px';
        holder.drag.style.backgroundColor = 'transparent';
    };
    
    holder.onHandleDragRun   = function() {
        holder.drag.style.left = '';
        
        var numSteps = holder.drag.offsetTop - holder.__oDragY;
//         console.log(numSteps);
        
        if (holder.setValue((numSteps * holder.config.step) + holder.__oNowValue))
            holder.onCustomEvent('change', { 'ctl': holder });
        
    };
    
    holder.onHandleDragStop  = function() {
        holder.drag.style.top = ''; //fallback to css
        holder.drag.style.backgroundColor = '';
    };
    
    holder.__dragListener = 
          new dragObject(holder.drag, null, 
                         new Position(0, -5000), 
                         new Position(0, 5000), 
                         holder.onHandleDragStart, 
                         holder.onHandleDragRun, 
                         holder.onHandleDragStop
          );
    
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

        cancelEvent(e);
    };
    
    try {
        holder.addEventListener('mousewheel', holder.scrollFunction, true);
        holder.addEventListener('DOMMouseScroll', holder.scrollFunction, true);
    } catch(ex) {
        holder.attachEvent('onmousewheel', holder.scrollFunction);
    }
    
    
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
            window.removeEventListener('mouseup', holder.winKeyUpFunction, true);
            holder.removeEventListener('mouseout', holder.winKeyUpFunction, true);
        } catch(ex) {
            document.body.detachEvent('onkeyup', holder.winKeyUpFunction);
            document.body.detachEvent('onmouseup', holder.winKeyUpFunction);
            holder.detachEvent('onmouseout', holder.winKeyUpFunction);
        }
        window.clearInterval(holder.kbThread);
        holder.kbThread = null;
                
        removeStyle(holder.up, 'active');
        removeStyle(holder.down, 'active');
    };
    
    holder.startKeyDownThread = function( func ) {
    
        holder.kbDelta = 1;
        
        switch (func) {
            case holder.decrementThreadFunc:
                addStyle(holder.up, 'active');
                break;
            case holder.incrementThreadFunc:
                addStyle(holder.down, 'active');
                break;
        }
        
        func();
    
        if (holder.kbThread !== null) holder.winKeyUpFunction();
        holder.kbThread = window.setInterval(func, 100);
        
        try {
            window.addEventListener('keyup', holder.winKeyUpFunction, true);
            window.addEventListener('mouseup', holder.winKeyUpFunction, true);
            holder.addEventListener('mouseout', holder.winKeyUpFunction, true);
        } catch(ex) {
            document.body.attachEvent('onkeyup', holder.winKeyUpFunction);
            document.body.attachEvent('onmouseup', holder.winKeyUpFunction);
            holder.attachEvent('mouseout', holder.winKeyUpFunction);
        }
    };
    
    holder.ctl.keyboardHandler = function(e) {
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
                if (e.ctrlKey)
                holder.startKeyDownThread(holder.decrementThreadFunc);
                cancelEvent(e);
                break;
            case 40:
                if (e.ctrlKey)
                holder.startKeyDownThread(holder.incrementThreadFunc);
                cancelEvent(e);
                break;
            case 13:
                var v = holder.ctl.value.toString().trim();
                var val = parseFloat(v);
                
                if (isNaN(val)) {
                    console.log('Spinner: value "'+holder.ctl.value+'" is NAN');
                    val = holder.config.value;
                }
                
                if (val != holder.config.value) {
                    holder.setValue(val);
                    holder.onCustomEvent('change', {'ctl': holder});
                } else holder.setValue(val);
                
                cancelEvent(e);
                break;
         }
    };
    
    //Mouse functions (increment / decrement by clicking the up/down buttons)
    
    try {
        holder.up.addEventListener('mousedown', function(e) { holder.startKeyDownThread(holder.decrementThreadFunc); e = e || window.event; cancelEvent(e); }, true);
        holder.down.addEventListener('mousedown', function(e) { holder.startKeyDownThread(holder.incrementThreadFunc); e = e || window.event; cancelEvent(e); }, true);
    } catch(ex) {
        holder.up.attachEvent('onmousedown', function(e) { holder.startKeyDownThread(holder.decrementThreadFunc); cancelEvent(window.event); });
        holder.down.attachEvent('onmousedown', function(e) { holder.startKeyDownThread(holder.incrementThreadFunc); cancelEvent(window.event); });
    }
    
    try {
        holder.ctl.addEventListener('keydown', holder.ctl.keyboardHandler, true);
        holder.ctl.addEventListener('blur', function() { holder.ctl.keyboardHandler({'keyCode': 13}); }, true);
    } catch(ex) {
        holder.ctl.attachEvent('onkeydown', holder.ctl.keyboardHandler);
        holder.ctl.attachEvent('onblur', function() { holder.ctl.keyboardHandler({'keyCode': 13}); });
    }
    
    if (holder.__defineGetter__) {
        holder.__defineGetter__('value', holder.getValue);
        holder.__defineSetter__('value', holder.setValue);
        holder.__defineGetter__('minValue', holder.getMinValue);
        holder.__defineSetter__('minValue', holder.setMinValue);
        holder.__defineGetter__('maxValue', holder.getMaxValue);
        holder.__defineSetter__('maxValue', holder.setMaxValue);
        holder.__defineGetter__('step', holder.getStep);
        holder.__defineSetter__('step', holder.setStep);
    } else
    if (Object.defineProperty){
        Object.defineProperty(holder, 'value',      { 'get': holder.getValue,    'set': holder.setValue });
        Object.defineProperty(holder, 'minValue',   { 'get': holder.getMinValue, 'set': holder.setMinValue });
        Object.defineProperty(holder, 'maxValue',   { 'get': holder.getMaxValue, 'set': holder.setMaxValue });
        Object.defineProperty(holder, 'step',       { 'get': holder.getStep,     'set': holder.setStep });
    } 
    
    disableSelection(holder);
    
    return holder;
}