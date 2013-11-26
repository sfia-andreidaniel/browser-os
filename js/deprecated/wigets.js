function Widget(config) {
    var holder = $('div', 'DomWidget');
    holder.config = config || {};
    
    holder.config.caption      = typeof holder.config.caption != 'undefined' ? holder.config.caption : 'No Title';
    holder.config.closeable    = typeof holder.config.closeable != 'undefined' ? holder.config.closeable : false;
    holder.config.minimizeable = typeof holder.config.minimizeable != 'undefined' ? holder.config.minimizeable : false;
    holder.config.minimized    = typeof holder.config.minimized != 'undefined' ? holder.config.minimized : false;
    holder.config.height       = typeof holder.config.height != 'undefined' ? holder.config.height : false;
    holder.config.resizeable   = typeof holder.config.resizeable != 'undefined' ? holder.config.resizeable : false;
    
    holder._titleHolder = holder.appendChild($('div', 'DomWidgetTitlebar'));
    holder._caption     = holder._titleHolder.appendChild($('div', 'DomWidgetCaptionHolder'));
    holder._buttons     = holder._titleHolder.appendChild($('div', 'DomWidgetButtons'));
    holder._body        = holder.appendChild($('div', 'DomWidgetBody'));
    holder._resizer     = holder.appendChild($('div', 'DomWidgetResizer'));
    
    holder._close       = holder._buttons.appendChild($('div', 'DomWidgetButton close'));
    holder._minimize    = holder._buttons.appendChild($('div', 'DomWidgetButton collapse'));
    
    holder.getCaption = function() {
        return holder.config.caption;
    };
    
    holder.setCaption = function(str) {
        holder.config.caption = str;
        holder._caption.innerHTML = '';
        holder._caption.appendChild($text(str));
    };
    
    holder.getCloseable = function() {
        return holder.config.closeable;
    };
    
    holder.setCloseable = function(bool) {
        holder.config.closeable = bool ? true : false;
        (holder.config.closeable ? addStyle : removeStyle)(holder, 'closeable');
    };
    
    holder.getMinimizeable = function() {
        return holder.config.minimizeable;
    };
    
    holder.setMinimizeable = function(bool) {
        holder.config.minimizeable = bool ? true : false;
        (holder.config.minimizeable ? addStyle : removeStyle)(holder, 'minimizeable');
    };
    
    holder.getMinimized = function() {
        return holder.config.minimized;
    };
    
    holder.setMinimized = function(bool) {
        (bool ? addStyle : removeStyle)(holder, 'minimized');
        holder.config.minimized = bool ? true : false;
        
        try {
            holder.parentNode._widgetGroup.onLayoutChanged();
        } catch(ex) {
            
        }
    };
    
    holder.close = function() {
        var nxSibling = holder.nextSibling;
        var parentBack= holder.parentNode;
        holder.parentNode.removeChild(holder);
        
        alert('removed');
        
        try {
            if (parentBack._widgetGroup.onCustomEvent('layoutChanged', true)) {
                parentBack.removeWidget(holder);
            } else {
                if (nxSibling) parentBack.insertBefore(holder, nxSibling); else parentBack.appendChild(holder);
            }
        } catch(ex) {
            alert(ex);
        }
    };
    
    holder.getHeight = function() {
        return holder.config.height;
    };
    
    holder.setHeight = function(intBool) {
        intBool = (intBool === false ? false : ( intBool < 0 ? 0 : intBool ));
        if (intBool === false) {
            holder.config.height = false;
            holder._body.style.height = '';
            holder._resizer.style.top = '';
            holder._resizer.style.position = 'relative';
        } else {
            holder.config.height = intBool;
            if (intBool == 0) holder._body.style.display = 'none'; else {
                holder._body.style.height = intBool + 'px';
                holder._body.style.display = '';
            }
            holder._resizer.style.bottom = '0px';
            holder._resizer.style.position = 'absolute';
        }
    };
    
    holder.getResizeable = function() {
        return holder.config.resizeable;
    };
    
    holder.setResizeable = function(bool) {
        (bool ? addStyle : removeStyle)(holder, 'resizeable');
        holder.config.resizeable = bool ? true : false;
    };
    
    holder.onResizeStart = function() {
    
        holder.___oHeight = holder.config.height;
    
        holder._resizer.style.top = holder._resizer.offsetTop + 'px';
        holder._resizer.style.bottom = '';
    };
    
    holder.onResizeRun = function() {
        if (holder._resizer.offsetTop < 
            holder._titleHolder.offsetHeight + holder._titleHolder.offsetTop) 
        holder._resizer.style.top = holder._titleHolder.offsetHeight + 'px';
        
        holder.setHeight(holder._resizer.offsetTop - holder._titleHolder.offsetHeight - holder._resizer.offsetHeight);
        
        holder._resizer.style.bottom = '';
    };
    
    holder.onResizeStop = function() {
        holder._resizer.style.top = '';
        holder._resizer.style.bottom = '0px';
        
        if (!holder.parentNode._widgetGroup.onCustomEvent('layoutChanged'))
            holder.setHeight(holder.___oHeight);
        
    };
    
    holder._resizer.setAttribute('dragable', '1');
    
    holder.resizeListener = 
        new dragObject(holder._resizer, null, new Position(0, 0), new Position(0, 5000), 
                       holder.onResizeStart, holder.onResizeRun, holder.onResizeStop, null, true);
    
    holder.setCaption(holder.config.caption);
    holder.setCloseable(holder.config.closeable);
    holder.setMinimizeable(holder.config.minimizeable);
    holder.setHeight(holder.config.height);
    holder.setResizeable(holder.config.resizeable);
    holder.setMinimized(holder.config.minimized);
    
    holder._close.onmousedown = function(e) {
        e = e || window.event;
        cancelEvent(e);
        
        if (holder.parentNode._widgetGroup.onCustomEvent('closeWidget', holder)) holder.close();
        
        return false;
    };
    
    holder.toggleCollapse = function() {
        holder.setMinimized(!holder.getMinimized());
    };
    
    holder._minimize.onmousedown = function(e) {
        e = e || window.event;
        cancelEvent(e);
        holder.toggleCollapse();
        return false;
    };
    
    holder.getBody = function() {
        return holder._body;
    };
    
    holder.absolutize = function() {
        holder._rootElement  = holder.parentNode;
        
        holder.style.width = holder.offsetWidth + 'px';
        holder.style.height= holder.offsetHeight+ 'px';
        
        var xy = getXY(holder);
        xy[0] += document.body.scrollLeft || (window.pageXOffset || (document.body.parentElement ? document.body.parentElement.scrollLeft  : 0) );
        xy[1] += document.body.scrollTop || (window.pageYOffset || (document.body.parentElement ? document.body.parentElement.scrollTop  : 0) );
        
        holder.style.top = xy[1] + 'px';
        holder.style.left= xy[0] + 'px';
        
        holder.style.position = 'absolute';
        holder.style.zIndex = 1000000;
        
        document.body.appendChild(holder);
    };
    
    holder.reblock = function(goBack) {
    
        holder.style.width = '';
        holder.style.height= '';
        holder.style.position = '';
        holder.style.top = '';
        holder.style.left= '';
        
        if (goBack && holder._rootElement) {
            for (var i=0, len = holder._rootElement._widgets.length; i<len; i++) {
                if (holder == holder._rootElement._widgets[i]) {
                    
                    if (i >= holder._rootElement._widgets.length) {
                        holder.rootElement.appendChild(holder);
                    }
                    
                    else 
                    
                    if (i == 0) {
                        if (holder._rootElement._widgets.length > 1) {
                            holder._rootElement.insertBefore(holder, holder._rootElement._widgets[i + 1]);
                        } else
                        holder._rootElement.appendChild(holder);
                    } else
                    
                    if (i < holder._rootElement._widgets.length) {
                        holder._rootElement.insertBefore( holder, holder._rootElement._widgets[i + 1] );
                    }
                }
            }
        } else {
            if (!goBack && holder._rootElement) {
                holder._rootElement.removeWidget(holder);
            }
        }
    };
    
    holder.bodyMouseMoveEventListener = function( e ) {
        e = e || window.event;
        
        xm = winMouseX(e);
        ym = winMouseY(e);
        
        holder.style.left = xm + 10 + 'px';
        holder.style.top  = ym + 'px';
    };
    
    holder.clearBodyListeners = function( ) {
        try {
            document.body.removeEventListener('mousemove', holder.bodyMouseMoveEventListener, true);
            document.body.removeEventListener('mouseup', holder.clearBodyListeners, true);
        } catch(ex) {
            document.body.detachEvent('onmousemove', holder.bodyMouseMoveEventListener);
            document.body.detachEvent('onmouseup', holder.clearBodyListeners);
        }
        
        holder._rootElement._widgetGroup.stopAccepting();
        
        var __dropTo = holder._rootElement._widgetGroup.getDropWidgetHolder();
        
        if (__dropTo && __dropTo.__dropZone) {
            __dropTo.insertBefore(holder, __dropTo.__dropZone);
        }
        
        if (!__dropTo || !holder._rootElement._widgetGroup.onCustomEvent('layoutChanged')) { 
            if (__dropTo) {
                __dropTo.removeChild(__dropTo.__dropZone);
                __dropTo.__dropZone = null;
            }
            holder.reblock(true);
        }
        else {
            holder._rootElement.removeWidget(holder);
            __dropTo.insertBefore(holder, __dropTo.__dropZone);
            __dropTo._widgets.push(holder);
            __dropTo.removeChild(__dropTo.__dropZone);
            __dropTo.__dropZone = null;
            
            holder.style.width = '';
            holder.style.height= '';
            holder.style.display = '';
            holder.style.position= '';
            holder.style.left = '';
            holder.style.top = '';
        }
        
        removeStyle(holder, 'WidgetOnDrag');
    };
    
    holder._titleHolder.onmousedown = function( e ) {
        e = e || window.event;
        
        holder.parentNode._widgetGroup.startAccepting(holder);
        
        holder.absolutize();
        
        try {
            document.body.addEventListener('mousemove', holder.bodyMouseMoveEventListener, true);
            document.body.addEventListener('mouseup', holder.clearBodyListeners, true);
        } catch(ex) {
            document.body.attachEvent('onmousemove', holder.bodyMouseMoveEventListener);
            document.body.attachEvent('onmouseup', holder.clearBodyListeners);
        }
        
        addStyle(holder, 'WidgetOnDrag');
        
        cancelEvent(e);
        return false;
    };
    
    return holder;
}

function WidgetColumn(createFromElement) {
    var holder = createFromElement || $('div', 'DomWidgetColumn');
    holder._widgets = [];
    holder._widgetGroup = null;
    
    holder.addWidget = function(widget) {
        holder._widgets.push(widget);
        holder.appendChild(widget);
        
        if (widget.config.minimized) widget.setMinimized(true);
        
        return widget;
    };
    
    holder.removeWidget = function(widget) {
        for (var i=0, len=holder._widgets.length; i<len; i++) {
            if (holder._widgets[i] == widget) {
                holder._widgets.splice(i, 1);
                try { holder.removeChild(widget); } catch(ex) {}
                return widget;
            }
        }
        return null;
    };
    
    return holder;
}

function ___addAcceptDropFunction(holder) {

    holder.__dropZone = holder.__dropZone || null;

    holder.__placeDropAt = function(y) {
        //find the element "before" we can actually place the dropper
        fChild = holder.firstChild;
        
        if (fChild) {
        
            if (fChild == holder.__dropZone) fChild = fChild.nextSibling;
            
            var increments = 0;
            
            while (fChild && fChild.nextSibling && fChild.nextSibling.offsetTop < y) { 
                fChild = fChild.nextSibling;
                if (fChild == holder.__dropZone) fChild = fChild.nextSibling;
                increments++;
            }
            
            if (fChild && y > fChild.offsetTop + fChild.offsetHeight) increments++;
        } else increments = 0;
        
        //in increments, we find out the node "before" which we want to place the widget
        var ch = holder.firstChild;
        var childs = [];
        
        if (ch) {
            do {
                if (ch != holder.__dropZone) childs.push(ch);
                ch = ch.nextSibling;
            } while (ch);
        }
        
        //if the drop zone should be placed in exactly the same place, we return
        if (holder.__dropZone && holder.__dropZone.placeIndex == increments) { 
            return;
        }
        
        if (!holder.__dropZone) { 
            holder.__dropZone = $('div', 'DomWidgetDropZone');
            holder.__dropZone.style.height = holder.__dropWidgetHeight + 'px';
            holder._widgetGroup.dropWidget.style.width = holder.offsetWidth + 'px';
        }
        
        if (increments >= childs.length) {
            //we insert the drop zone at the end of the holder
            holder.appendChild(holder.__dropZone);
//             console.log('place at end');
        } else {
            //we insert the drop before holder.childNodes[increments]
            holder.insertBefore(holder.__dropZone, childs[increments]);
//             console.log('place before #'+increments);
        }
        
//         console.log(increments);
        
        holder.__dropZone.placeIndex = increments;
    };

    holder.__onMouseMove = function(e) {
        e = e || window.event;
        var xy = relMousePos(holder, e);
        holder.__placeDropAt(xy[1]);
    };
    
    holder.__onMouseOutHandler = function(e) {
        e = e || window.event;
        try {
            var mbc = new MouseBoundaryCrossing(e, holder);
        } catch(ex) {  return; }
        
        if (mbc.leftLandmark) {
//             console.log('leftLandmark');
            holder.removeChild(holder.__dropZone);
            holder.__dropZone = null;
        }
    };
    
}

function WidgetColumnGroup() {
    this.accepters = [];
    var _self = this;
    
    for (var i=0, len=arguments.length; i<len; i++) {
        this.accepters.push(arguments[i]);
    }
    
    EnableCustomEventListeners(this);
    
    this.startAccepting = function(dropWidget) {
        for (var i=0, len=this.accepters.length; i<len; i++) {
            
            this.accepters[i].__dropWidgetHeight = dropWidget.offsetHeight;
            ___addAcceptDropFunction(this.accepters[i]);
            
            try {
                this.accepters[i].addEventListener('mousemove', this.accepters[i].__onMouseMove, false);
                this.accepters[i].addEventListener('mouseout',  this.accepters[i].__onMouseOutHandler, false);
            } catch(ex) {
                this.accepters[i].attachEvent('onmousemove', this.accepters[i].__onMouseMove);
                this.accepters[i].attachEvent('onmouseout', this.accepters[i].__onMouseOutHandler);
            }
        }
        _self.dropWidget = dropWidget;
    };
    
    this.stopAccepting = function() {
        for (var i=0; i<this.accepters.length; i++) {
            try {
                this.accepters[i].removeEventListener('mousemove', this.accepters[i].__onMouseMove, false);
                this.accepters[i].removeEventListener('mouseout', this.accepters[i].__onMouseOutHandler, false);
            } catch(ex) {
                this.accepters[i].detachEvent('onmousemove', this.accepters[i].__onMouseMove);
                this.accepters[i].detachEvent('onmouseout', this.accepters[i].__onMouseOutHandler);
            }
        }
    };
    
    this.getDropWidgetHolder = function() {
        for (var i=0; i<this.accepters.length; i++) {
            if (this.accepters[i].__dropZone) return this.accepters[i];
        }
        return false;
    };
    
    this.onCloseWidget = function(widget) {
        if (widget && widget.onclose) return widget.onclose();
        else return confirm('Close this widget?');
    };
    
    this.onLayoutChanged = function() {
//         if (!confirm('allow?')) return false;
        return true;
    };
    
    this.addCustomEventListener('closeWidget', 
        function(widget) { 
            return _self.onCloseWidget(widget); 
        }
    );
    
    this.addCustomEventListener('layoutChanged',
        function() {
            return _self.onLayoutChanged();
        }
    );
    
    this.getLayoutAsArray = function() {
        var out = [];
        for (var i=0; i<_self.accepters.length; i++) {
            var l = [];
            
            var cNodes = _self.accepters[i].childNodes;
            
            for (var n=0; n<cNodes.length; n++) {
                if (hasStyle(cNodes[n], 'DomWidget')) { 
                    l.push(cNodes[n].config);
                }
            }
            
            out.push(l);
        }
        return out;
    };
    
    this.getLayoutAsObject = function() {
        var arr = _self.getLayoutAsArray();
        var out = {};
        for (var i=0; i<_self.accepters.length; i++) {
            out[_self.accepters[i].id] = arr[i];
        }
        return out;
    };
    
    for (var i=0; i<arguments.length; i++) {
        arguments[i]._widgetGroup = this;
    }
    return this;
};