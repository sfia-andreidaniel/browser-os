/** A fully customisable ToolTip object:
    
    Initialization:
    ~~~~~~~~~~~~~~
        optional param (str) pinPosition ( 'top', 'left', 'right', 'bottom' )
        optional param (DOMElement) pinElement -- element where the tooltip should be pinned
    
    Properties:
    ~~~~~~~~~~~
        (get | set) (align str)   alignment
        (get | set) (bool)        visible
        (get      ) (DOMElement)  body
        (get | set) (htmlString)  htmlContent
**/

function Tooltip(pinPosition, pinElement) {
    var holder = $('div', 'DomTooltipOuter');
    
    holder._align = pinPosition || '';
    holder._pinElement = pinElement || null;
    holder._visible = false;
    holder._pinner = new Pinner(holder._pinElement, holder);
    
    holder.inner = holder.appendChild($('div', 'DomTooltipInner'));
    
    holder.inner.appendChild($('div', 'lt'));
    holder.inner.appendChild($('div', 't'));
    holder.inner.appendChild($('div', 'rt'));
    holder.inner.appendChild($('div', 'l'));
    holder.inner.appendChild($('div', 'r'));
    holder.inner.appendChild($('div', 'lb'));
    holder.inner.appendChild($('div', 'b'));
    holder.inner.appendChild($('div', 'rb'));
    holder.inner.appendChild($('div', 'bg'));
    
    holder.container = holder.inner.appendChild($('div', 'content'));
    
    holder.getBody = function() {
        return holder.container;
    };
    
    holder.getAlignment = function() {
        return holder._align;
    };
    
    holder.setAlignment = function(str) {
        switch (str) {
            case '':
                holder.className = 'DomTooltipOuter';
                holder._pinner.setPinMode('bottom');
                
                if (holder.offsetTop + holder.offsetHeight > getMaxY()) {
                    holder._pinner.setPinMode('top');
                }
                
                break;
            case 'top':
                holder.className = 'DomTooltipOuter bottom';
                holder._pinner.setPinMode('top');
                
                if (holder.offsetTop < 0) {
                    holder.className = 'DomTooltipOuter top';
                    holder._pinner.setPinMode('bottom');
                }
                
                break;
            case 'bottom':
                holder.className = 'DomTooltipOuter top';
                holder._pinner.setPinMode('bottom');
                
                if (holder.offsetTop + holder.offsetHeight > getMaxY()) {
                    holder.className = 'DomTooltipOuter bottom';
                    holder._pinner.setPinMode('top');
                }
                
                break;
            case 'left':
                holder.className = 'DomTooltipOuter right';
                holder._pinner.setPinMode('left');
                
                if (holder.offsetLeft < 0) {
                    holder.className = 'DomTooltipOuter left';
                    holder._pinner.setPinMode('right');
                }
                
                break;
            case 'right':
                holder.className = 'DomTooltipOuter left';
                holder._pinner.setPinMode('right');
                
                if (holder.offsetLeft + holder.offsetWidth > getMaxX()) {
                    holder.className = 'DomTooltipOuter right';
                    holder._pinner.setPinMode('left');
                }
                
                break;
            default:
                throw 'Invalid tooltip alignment "'+str+'", allowed only: "", "top", "left", "right", "bottom"';
                break;
        }
        holder._align = str;
    };
    
    holder.getVisible = function() {
        return holder._visible;
    };
    
    holder.setVisible = function(bool) {
        if (!bool) {
            if (holder.parentNode) holder.parentNode.removeChild(holder);
            holder._visible = false;
        } else {
            document.body.appendChild(holder);
            holder.setAlignment(holder._align);
            holder._visible = true;
        }
    };
    
    holder.setAlignment(holder._align);
    
    holder.getHtmlContent = function(str) {
        return holder.container.innerHTML;
    };
    
    holder.setHtmlContent = function(str) {
        holder.container.innerHTML = str;
        if (holder._visible) holder.setVisible(true);
    };
    
    holder.redraw = function() {
        if (holder._visible) holder.setVisible(true);
    };
    
    
    if (Object.defineProperty) {
        Object.defineProperty(holder, 'alignment',   { 'get': holder.getAlignment, 'set': holder.setAlignment });
        Object.defineProperty(holder, 'visible',     { 'get': holder.getVisible,   'set': holder.setVisible   });
        Object.defineProperty(holder, 'body',        { 'get': holder.getBody });
        Object.defineProperty(holder, 'htmlContent', { 'get': holder.getHtmlContent, 'set': holder.setHtmlContent });
    } else {
        if (holder.__defineGetter__) {
            holder.__defineGetter__('alignment', holder.getAlignment);
            holder.__defineSetter__('alignment', holder.setAlignment);
            holder.__defineGetter__('visible',   holder.getVisible);
            holder.__defineSetter__('visible',   holder.setVisible);
            holder.__defineGetter__('body',      holder.getBody);
            holder.__defineGetter__('htmlContent', holder.getHtmlContent);
            holder.__defineSetter__('htmlContent', holder.setHtmlContent);
        }
    }
    
    return holder;
}



function setupTooltip(DOMObject, optionalHTMLString) {

    if (typeof optionalHTMLString == 'undefined') {
        var nodeTitle = DOMObject.getAttribute('title');
        if (nodeTitle) { 
            optionalHTMLString = nodeTitle;
            DOMObject.title = '';
        }
    }

    if (typeof DOMObject.___toolTip == 'undefined') {
        DOMObject.___toolTip = new Tooltip('top', DOMObject);
    
        DOMObject.___mouseMooveHandler = function(evt) {
            try {
                var mbc = new MouseBoundaryCrossing(evt, DOMObject);
            } catch(ex) {
                return;
            }
            
            switch(true) {
                case mbc.leftLandmark: {
                    DOMObject.___toolTip.setVisible(false);
                    break;
                }
                case mbc.enteredLandmark: {
                    DOMObject.___toolTip.setVisible(true);
                    break;
                }
            }
        };
        
        try {
            DOMObject.addEventListener('mouseover', function(evt) { DOMObject.___mouseMooveHandler(evt); }, false);
            DOMObject.addEventListener('mouseout', function(evt) { DOMObject.___mouseMooveHandler(evt); }, false);
        } catch(exd) {
            DOMObject.attachEvent('onmouseover', function() { DOMObject.___mouseMooveHandler(); } );
            DOMObject.attachEvent('onmouseout', function() { DOMObject.___mouseMooveHandler(); } );
        }
    }
    
    if (typeof optionalHTMLString != 'undefined')
        DOMObject.___toolTip.setHtmlContent(optionalHTMLString);
        
    return DOMObject.___toolTip;
}

function setupHint(DOMObject, optionalHTMLString) {

    if (typeof DOMObject.___hintTip == 'undefined') {
        DOMObject.___hintTip = new Tooltip('right', DOMObject);
    
        DOMObject.___focusHandler = function(evt) {
            DOMObject.___hintTip.setVisible(true);
        };
        
        DOMObject.___blurHandler = function(evt) {
            DOMObject.___hintTip.setVisible(false);
        }
        
        try {
            DOMObject.addEventListener('focus', function(evt) { DOMObject.___focusHandler(evt); }, false);
            DOMObject.addEventListener('blur', function(evt) { DOMObject.___blurHandler(evt); }, false);
        } catch(exd) {
            DOMObject.attachEvent('onfocus', function() { DOMObject.___focusHandler(); } );
            DOMObject.attachEvent('onblur', function() { DOMObject.___blurHandler(); } );
        }
    }
    
    if (typeof optionalHTMLString != 'undefined')
        DOMObject.___hintTip.setHtmlContent(optionalHTMLString);
}