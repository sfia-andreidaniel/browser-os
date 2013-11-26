/** Progress bar

    init: {
        'minValue': 0,
        'maxValue': 100,
        'value': 0,
        'captionFormat': '/v%',   //valid placeholders are: /v: currentValue, /min: minimValue, /max: maximValue, other characters are parsed as they are
        'caption': ''
    }

**/

function ProgressBar(conf) {
    var holder = $('div', 'DomProgressBar');
    
    holder.config = conf || {
        'minValue': 0,
        'maxValue': 100,
        'value': 0,
        'captionFormat': '',
        'caption': ''
    };
    
    holder['config'].minValue = typeof holder['config'].minValue != 'undefined' ? holder['config'].minValue : 0;
    holder['config'].maxValue = typeof holder['config'].maxValue != 'undefined' ? holder['config'].maxValue : 100;
    holder['config'].value    = typeof holder['config'].value    != 'undefined' ? holder['config'].value : 0;
    holder['config'].captionFormat = typeof holder['config'].captionFormat != 'undefined' ? holder['config'].captionFormat : '';
    holder['config'].caption  = typeof holder['config'].caption  != 'undefined' ? holder['config'].caption : '';
    
    holder.inner = holder.appendChild($('div', 'inner'));
    
    holder.bar   = holder.inner.appendChild($('div', 'ProgressBar'));
    holder._caption = holder.inner.appendChild($('div', 'ProgressBarCaption'));
    holder.bar.aDiv = holder.bar.appendChild($('div'));
    
    holder._caption.appendChild($text( holder['config'].caption ));
    
    holder.getValue = function() {
        return holder['config'].value;
    };
    
    holder.setValue = function(floatVal) {
        //truncate intervals
        floatVal = floatVal < holder['config'].minValue ? holder['config'].minValue : 
                ( floatVal > holder['config'].maxValue ? holder['config'].maxValue : floatVal );
        var numValues = holder['config'].maxValue - holder['config'].minValue;
        
        //we prefere to set the width in 'percents' instead of pixels
        var percWidth = (floatVal - holder['config'].minValue) / ( numValues / 100 );
        
        holder['config'].value = floatVal;
        holder.bar.style.width = percWidth + '%';
        holder.updateCaption();
    };
    
    holder.getCaption = function() {
        return holder['config'].caption;
    };
    
    holder.setCaption = function(str) {
        holder._caption.innerHTML = '';
        if (str) {
            var span;
            holder._caption.appendChild(span = $('span')).appendChild($text(holder['config'].caption = str));
        } else holder['config'].caption = '';
    };
    
    holder.updateCaption = function() {
        holder.setCaption(
            holder['config'].captionFormat ? 
            holder['config'].captionFormat.
                replace(/\/v/g, holder['config'].value).
                replace(/\/min/g, holder['config'].minValue).
                replace(/\/max/g, holder['config'].maxValue)
            : ''
        );
    };
    
    holder.getMinValue = function() { 
        return holder['config'].minValue;
    };
    
    holder.setMinValue = function(floatVal) {
        holder['config'].minValue = floatVal;
        holder.setValue(holder['config'].value);
    };
    
    holder.getMaxValue = function() {
        return holder['config'].maxValue;
    };
    
    holder.setMaxValue = function(floatVal) {
        holder['config'].maxValue = floatVal;
        holder.setValue(holder['config'].value);
    };
    
    holder.getCaptionFormat = function() {
        return holder['config'].captionFormat;
    };
    
    holder.setCaptionFormat = function(str) {
        holder['config'].captionFormat = str;
        holder.updateCaption();
    };
    
    if (holder.__defineGetter__) {
        holder.__defineGetter__('value', holder.getValue);
        holder.__defineSetter__('value', holder.setValue);
        holder.__defineGetter__('minValue', holder.getMinValue);
        holder.__defineSetter__('minValue', holder.setMinValue);
        holder.__defineGetter__('maxValue', holder.getMaxValue);
        holder.__defineSetter__('maxValue', holder.setMaxValue);
        holder.__defineGetter__('captionFormat', holder.getCaptionFormat);
        holder.__defineSetter__('captionFormat', holder.setCaptionFormat);
        holder.__defineGetter__('caption', holder.getCaption);
        holder.__defineSetter__('caption', holder.setCaption);
    } else
    if (Object.defineProperty) {
        Object.defineProperty(holder, 'value', { 'get': holder.getValue, 'set': holder.setValue });
        Object.defineProperty(holder, 'minValue', { 'get': holder.getMinValue, 'set': holder.setMinValue });
        Object.defineProperty(holder, 'maxValue', { 'get': holder.getMaxValue, 'set': holder.setMaxValue });
        Object.defineProperty(holder, 'captionFormat', { 'get': holder.getCaptionFormat, 'set': holder.setCaptionFormat });
        Object.defineProperty(holder, 'caption', { 'get': holder.getCaption, 'set': holder.setCaption });
    }
    
    saveVal = holder['config'].value; holder['config'].value = -1;
    holder.setValue(saveVal);
    //delete saveVal;
    saveVal = undefined;
    
    return holder;
}