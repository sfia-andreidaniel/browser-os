Object.defineProperty( HTMLOptionElement.prototype, "icon", {
    "get": function() {
        return this.getAttribute("data-icon") || null;
    },
    "set": function( str ) {
        str = str || "";
        
        if ( !str ) {
            this.removeAttribute('data-icon');
        } else {
            this.setAttribute('data-icon', str );
        }
    }
} );

Object.defineProperty( HTMLSelectElement.prototype, "syncIcon", {
    "get": function() {
        return function() {
            if ( this.selectedIndex != -1 && !this.multiple )
            this.icon = this.options[ this.selectedIndex ].icon;
        }
    }
});

Object.defineProperty( HTMLSelectElement.prototype, "icon", {
    "get": function() {
        return this.getAttribute("data-icon") || null;
    },
    "set": function( str ) {
        str = str || "";
        
        if ( !str ) {
            this.removeAttribute('data-icon');
            this.removeClass('icon');
            this.style.backgroundImage = '';
        } else {
            this.setAttribute('data-icon', str );
            this.addClass( 'icon' );
            this.style.backgroundImage = 'url(' + str + ')';
        }
    }
} );


function DropDown(optionalItems) {
    var drop = $('select');
    
    drop.addItem = function( tValue, tText, tIcon ) {
        var opt = $('option');
        opt.value = tValue;
        opt.text = typeof tText != 'undefined' ? tText : tValue;
        try {
            drop.add(opt, null);
        } catch(ex) {
            drop.add(opt);
        }
        
        opt.icon = tIcon;
        
        return opt;
    };
    
    drop.setItems = function(arr) {
        if (drop.options.length) 
            while (drop.options.length > 0) 
                drop.remove(0);
        for (var i=0; i<arr.length; i++)
            drop.addItem( 
                (typeof arr[i].value != 'undefined' ? arr[i].value : arr[i].id).toString(), 
                (arr[i].name || arr[i].text).toString(),
                arr[i].icon || ''
            ).selected = 
                typeof arr[i].selected != 'undefined' ? arr[i].selected : false;
        
        drop.syncIcon();
        
        return drop;
    };
    
    drop.addEventListener('change', function(e) {
        drop.syncIcon();
    });
    
    if (typeof optionalItems != 'undefined')
        drop.setItems(optionalItems);
    
    return drop;
}

function ListBox(optionalItems) {
    var dr = new DropDown(optionalItems);
    dr.size = 2;
    return dr;
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

function DomDropDownBase() {
    var holder = $('div', 'DomDropDown');
    holder.__xPadding = 4;
    holder.__yPadding = 4;
    
    holder.inner = holder.appendChild($('div', 'DomDropDownInner'));
    holder.optionHolder = holder.inner.appendChild($('div', 'DomOptionHolder'));
    holder.expand = holder.inner.appendChild($('button', 'expand'));
    holder.tabIndex = 0;
    
    holder._expanded = false;
    
//     holder.__DEBUG_CUSTOM_EVENT_LISTENERS__ = true;
    
    EnableCustomEventListeners(holder);
    
    holder.getExpanded = function() {
        return holder._expanded;
    };
    
    holder.setExpanded = function(bool) {
        if (bool == holder._expanded) return;
        holder._expanded = bool ? true : false;
        (holder._expanded ? addStyle : removeStyle)(holder, 'expanded');
        holder.onCustomEvent('expand', { 'source': holder, 'value': holder._expanded });
    };
    
    if (holder.__defineGetter__) {
        holder.__defineGetter__('expanded', holder.getExpanded);
        holder.__defineSetter__('expanded', holder.setExpanded);
    } else
    if (Object.defineProperty) {
        Object.defineProperty(holder, 'expanded', { 'get': holder.getExpanded, 'set': holder.setExpanded });
    }
    
    try {
        holder.addEventListener('click', function() { holder.setExpanded(!holder.getExpanded()); }, false);
    } catch(ex) {
        holder.inner.attachEvent('onclick', function() { holder.setExpanded(!holder.getExpanded()); });
    }
    
    return holder;
}

function DomOption() {
    var d = $('div', 'DomOption');
    d._value = '';
    d._text  = '';
    d._selected = false;
    
    d.getValue = function() {
        return d._value;
    };
    
    d.setValue = function(obj) {
        d._value = obj;
    };
    
    d.getText = function() {
        return d._text;
    };
    
    d.setText = function(str) {
        d.innerHTML = '';
        d.appendChild($text(str));
        d._text = str;
    };
    
    d.getSelected = function() {
        return d._selected;
    };
    
    d.getIndex = function() {
        if (!d.parentNode || !d.parentNode._parentDropDown) return -1;
        for (var i=0; i<d.parentNode._parentDropDown._options.length; i++) {
            if (d == d.parentNode._parentDropDown._options[i]) return i;
        }
        return -1;
    };
    
    d.setSelected = function(bool, resetSelection) {
    
        resetSelection = (typeof resetSelection == 'undefined') ? 
            (d.parentNode && d.parentNode._parentDropDown ? !d.parentNode._parentDropDown._multiple : false)
         : resetSelection;
    
        if (d.parentNode && d.parentNode._parentDropDown && bool) {
           d.parentNode._parentDropDown.setSelectedIndex(d.getIndex(), resetSelection);
        }
        
        d._selected = bool ? true : false;
        
        (d._selected ? addStyle : removeStyle)(d, 'selected');
        
    };
    
    d.clickHandler = function(e) {
        e = e || window.event || { 'ctrlKey': false };
        
        if (d.parentNode._parentDropDown) 
            d.setSelected( e.ctrlKey && d.parentNode._parentDropDown._multiple ? !d.getSelected() : true, 
                           !e.ctrlKey || !d.parentNode._parentDropDown._multiple //reset selection ?
                         );
        
        try {
            d.parentNode._parentDropDown.onCustomEvent('change', { 'srcElement': d.parentNode._parentDropDown });
        } catch(ex) {}
        
        try {
            if (d.parentNode._parentDropDown.setExpanded)
            d.parentNode._parentDropDown.setExpanded(false);
        } catch(ex) {}
    }
    
    d.mouseOverHandler = function(e) {
        try {
            var mbc = new MouseBoundaryCrossing(e, d);
            switch (true) {
                case mbc.enteredLandmark:
                    if (d.parentNode && d.parentNode._parentDropDown)
                        d.parentNode._parentDropDown.setFocusedIndex(
                            d.getIndex()
                        );
                break;
            }
        } catch(ex) { return; }
    };
    
    d.getHtml = function() {
        return d.innerHTML;
    };
    
    d.setHTML = function(str) {
        d.innerHTML = str;
        if (d.parentNode && d.parentNode._parentDropDown && d.parentNode._parentDropDown._selectedIndex == d.getIndex()) {
            d.setSelected(true);
        }
    };
    
    try {
        d.addEventListener('click', d.clickHandler, true);
        d.addEventListener('mouseover', d.mouseOverHandler, true);
        d.addEventListener('mouseout', d.mouseOverHandler, true);
    } catch(ex) {
        d.attachEvent('onclick', d.clickHandler);
        d.attachEvent('onmouseover', d.mouseOverHandler);
        d.attachEvent('onmouseout', d.mouseOverHandler);
    }
    
    if (d.__defineGetter__) {
        d.__defineGetter__('value', d.getValue);
        d.__defineSetter__('value', d.setValue);
        d.__defineGetter__('text',  d.getText);
        d.__defineSetter__('text',  d.setText);
        d.__defineGetter__('index', d.getIndex);
        d.__defineGetter__('html',  d.getHtml);
        d.__defineSetter__('html',  d.setHTML);
        d.__defineGetter__('selected', d.getSelected);
        d.__defineSetter__('selected', d.setSelected);
    } else
    if (Object.defineProperty) {
        Object.defineProperty(d, 'value', { 'get': d.getValue, 'set': d.setValue });
        Object.defineProperty(d, 'text',  { 'get': d.getText,  'set': d.setText  });
        Object.defineProperty(d, 'index', { 'get': d.getIndex });
        Object.defineProperty(d, 'html',  { 'get': d.getHtml, 'set': d.setHtml });
        Object.defineProperty(d, 'selected', {'get': d.getSelected, 'set': d.setSelected });
    }
    
    return d;
};

function DomDropDown(items) {
    var holder = new DomDropDownBase();
    
    holder._options = [];
    holder._selectedIndex = -1;
    holder._focusedIndex  = -1;
    holder._expander = $('div', 'DomDropDownExpander');
    holder._expander._parentDropDown = holder;
    holder._pinner = new Pinner( holder, holder._expander, 'bottom-left' );
    
    holder._expander.tabIndex = 0;
    
    holder.getOptions = function() {
        return holder._options;
    };
    
    holder.setFocusedIndex = function(optionIndex) {
        for (var i=0; i<holder._options.length; i++) {
            (i == optionIndex ? addStyle : removeStyle)(holder._options[i], 'hover');
        }
        holder._focusedIndex = (optionIndex < -1 ? -1 : ( optionIndex > holder._options.length - 1 ? holder._options.length - 1 : optionIndex ));
    };
    
    holder.getFocusedIndex = function() {
        return holder._focusedIndex;
    };
    
    holder.getSelectedIndex = function() {
        return holder._selectedIndex;
    };
    
    holder.setSelectedIndex = function(optionIndex) {
        
        try {
            removeStyle(d._options[d._selectedIndex], 'selected');
        } catch(ex) {}
        
        holder.optionHolder.innerHTML = '';
        
        if (optionIndex >= 0 && optionIndex < holder._options.length) {
        
            for (var i=0; i<holder._options.length; i++) {
                if (i != optionIndex) holder._options[i].setSelected(false);
            }
        
            holder.optionHolder.innerHTML = '';
            
            var opt = holder._options[optionIndex].cloneNode(true);
            
            try {
                opt.detachEvent('onclick', opt.clickHandler);
            } catch(ex) {}
            
            holder.optionHolder.appendChild(
                opt
            );
            
            holder._selectedIndex = optionIndex;
            holder._focusedIndex  = optionIndex;
        
            addStyle(holder._options[optionIndex], 'selected');
        
        } else {
            if (optionIndex == -1) holder._selectedIndex = -1;
            else { 
                holder._selectedIndex = -1;
                throw 'DomDropDown.selectedIndex: invalid index!';
            }
        }
    };
    
    holder.add = function(DomOptionElement) {
        holder._options.push(DomOptionElement);
        holder._expander.appendChild(DomOptionElement);
        if (holder._options.length == 1 || DomOptionElement.getSelected()) 
            holder.setSelectedIndex(holder._options.length - 1);
    };
    
    holder.remove = function(optionIndex) {
        if (optionIndex >= 0 && optionIndex < holder._options.length) {
        
            if (holder._selectedIndex == optionIndex) {
                holder.setSelectedIndex(-1);
            } else
            if (holder._selectedIndex > optionIndex) {
                holder._selectedIndex--;
            }
        
            holder._expander.removeChild(
                holder._options.splice(optionIndex, 1)[0]
            );
        } else throw 'DomDropDown.remove: Invalid index "'+optionIndex+'"';
    };
    
    holder.outerBodyClickListener = function(e) {
        e = e || window.event;
        var targ = e.target || e.srcElement;
        
        while (targ) {
            if (targ == holder._expander || targ == holder) return;
            targ = targ.parentNode;
        }
        
        holder.setExpanded(false);
    };
    
    holder.onToggleExpand = function() {
       switch (holder.getExpanded()) {
            case false: 
                document.body.removeChild(holder._expander);
                try {
                    window.removeEventListener('mousedown', holder.outerBodyClickListener, true);
                } catch(ex) {
                    document.body.detachEvent('onmousedown', holder.outerBodyClickListener);
                }
                
                holder.focus();
                
                break; 

            case true: 
                document.body.appendChild(holder._expander);
                holder._expander.style.width = holder.offsetWidth - 2 + 'px';
                
                holder._expander.style.height = '';
                if (holder._expander.offsetHeight > 150) holder._expander.style.height = '150px';
                
                holder._pinner.setPinMode('bottom-left');
                
                if (holder._expander.offsetTop + holder._expander.offsetHeight > getMaxY())
                    holder._pinner.setPinMode('top-left');
                
                try {
                    window.addEventListener('mousedown', holder.outerBodyClickListener, true);
                } catch(ex) {
                    document.body.attachEvent('onmousedown', holder.outerBodyClickListener);
                }
                
                holder._expander.focus();
                
                try {
                    holder._options[holder._selectedIndex].scrollIntoView(false); 
                } catch(ex) {}
                
                break;
       }
    };
    
    holder.focusNextOption = function(e) {
        cancelEvent(e);
        if (holder._options.length == 0) return;
        holder.setFocusedIndex(holder._focusedIndex + 1 < holder._options.length ? holder._focusedIndex + 1 : 0);
        assureVisibility(holder._options[holder._focusedIndex]);/*.scrollIntoView(false);*/
    };
    
    holder.focusPrevOption = function(e) {
        cancelEvent(e);
        if (holder._options.length == 0) return;
        holder.setFocusedIndex(holder._focusedIndex - 1 >= 0 ? holder._focusedIndex - 1 : holder._options.length - 1);
        assureVisibility(holder._options[holder._focusedIndex]);/*.scrollIntoView(false);*/
    };
    
    holder.switchToFocusedOption = function(e) {
        cancelEvent(e);
        if (holder._options.length == 0) return;
        if (holder._focusedIndex < 0) return;
        holder._options[holder._focusedIndex].clickHandler();
    };
    
    holder._expander.keyboardHandler = function(e) {
        e = e || window.event;
        charCode = Math.max(e.keyCode ? e.keyCode : 0, e.charCode ? e.charCode : 0);
        if (charCode == 0) return;
        switch (charCode) {
            //40 - down
            //38 - up
            //39 - right
            //37 - left
            //32 - space (toggle)
            //13 - enter
            //46 - delete
            
            case 40: holder.focusNextOption(e); return false; break;
            case 38: holder.focusPrevOption(e); return false; break;
            case 13: holder.switchToFocusedOption(e); return false; break;
            case 27: holder.setExpanded(false); return false; break;
        }
    };
    
    holder.keyboardHandler = function(e) {
        e = e || window.event;
        charCode = Math.max(e.keyCode ? e.keyCode : 0, e.charCode ? e.charCode : 0);
        if (charCode == 0) return;
        switch (charCode) {
            case 40:
            case 13:
            case 32: holder.setExpanded(true); cancelEvent(e); return false; break;
        }
    };
    
    try {
        holder._expander.addEventListener('keydown', holder._expander.keyboardHandler, false);
        holder._expander.addEventListener('keypress', function(e) { cancelEvent(e); }, false);
        holder.addEventListener('keydown', holder.keyboardHandler, false);
    } catch(ex) {
        holder._expander.attachEvent('onkeydown', holder._expander.keyboardHandler);
        holder._expander.attachEvent('onkeypress', function(e) { window.event.cancelBubble = true; return false; });
        holder.attachEvent('onkeydown', holder.keyboardHandler);
    }
    
    holder.addCustomEventListener('expand', holder.onToggleExpand);
    
    holder.addItem = function(iValue, iText, iHtml) {
        var opt = new DomOption();
        opt.setValue(iValue); 
        
        if (typeof iHtml != 'undefined') opt.innerHTML = iHtml; else
            opt.setText( typeof iText != 'undefined' ? iText : iValue );
        
        holder.add(opt);
        
        return opt;
    };
    
    holder.setItems = function(arr) {
        while (holder._options.length) holder.remove(0);
        var opt;
        for (var i=0; i<arr.length; i++) {
            opt = holder.addItem(arr[i].value, arr[i].text, items[i].html);
            if (arr[i].selected) opt.setSelected(true);
        }
    };
    
    holder.getValue = function() {
        if (holder._selectedIndex >= 0 && holder._selectedIndex < holder._options.length) 
        return holder._options[holder._selectedIndex].getValue();
        else return '';
    };
    
    holder.setValue = function(something) {
        for (var i=0; i<holder._options.length; i++) {
            if (holder._options[i].getValue() == something) {
                holder.setSelectedIndex(i);
                return something;
            }
        }
        holder.setSelectedIndex(-1);
        return '';
    }
    
    if (holder.__defineGetter__) {
        holder.__defineGetter__('options', holder.getOptions);
        holder.__defineGetter__('items',   holder.getOptions);
        holder.__defineSetter__('items',   holder.setItems);
        holder.__defineGetter__('selectedIndex', holder.getSelectedIndex);
        holder.__defineSetter__('selectedIndex', holder.setSelectedIndex);
        holder.__defineGetter__('value', holder.getValue);
        holder.__defineSetter__('value', holder.setValue);
    } else 
    if (Object.defineProperty) {
        Object.defineProperty(holder, 'options', { 'get': holder.getOptions });
        Object.defineProperty(holder, 'items',   { 'get': holder.getOptions, 'set': holder.setItems });
        Object.defineProperty(holder, 'selectedIndex', { 'get': holder.getSelectedIndex, 'set': holder.setSelectedIndex });
        Object.defineProperty(holder, 'value', { 'get': holder.getValue, 'set': holder.setValue });
    }
    
    if (typeof items != 'undefined') {
        holder.setItems(items);
    }
    
    disableSelection(holder);
    disableSelection(holder._expander);
    
    return holder;
}

function DomListBox() {
    var holder = $('div', 'DomListBox');
    
    EnableCustomEventListeners(holder);
    
    holder._options = [];
    holder._selectedIndex = -1;
    holder._focusedIndex  = -1;
    holder._parentDropDown = holder;
    holder._multiple = false;
    
    holder.tabIndex = 0;
    
    holder.getOptions = function() {
        return holder._options;
    };
    
    holder.setFocusedIndex = function(optionIndex) {
        for (var i=0; i<holder._options.length; i++) {
            (i == optionIndex ? addStyle : removeStyle)(holder._options[i], 'hover');
        }
        holder._focusedIndex = (optionIndex < -1 ? -1 : ( optionIndex > holder._options.length - 1 ? holder._options.length - 1 : optionIndex ));
    };
    
    holder.getFocusedIndex = function() {
        return holder._focusedIndex;
    };
    
    holder.getSelectedIndex = function() {
        for (var i=0; i<holder._options.length; i++) {
            if (holder._options[i].getSelected()) return i;
        }
        return -1;
    };
    
    holder.setSelectedIndex = function(optionIndex, resetSelection) {
        
        resetSelection = typeof resetSelection != 'undefined' ? resetSelection : true;
        
//         console.log(resetSelection ? 'true' : 'false');
        
        if (optionIndex >= 0 && optionIndex < holder._options.length) {
            
            if (resetSelection)
            for (var i=0; i<holder._options.length; i++) {
                if (i != optionIndex) holder._options[i].setSelected(false, false);
            }
        
            holder._selectedIndex = optionIndex;
            holder._focusedIndex  = optionIndex;
        
            addStyle(holder._options[optionIndex], 'selected');
        
        } else {
            if (optionIndex == -1) {
                if (resetSelection && holder._selectedIndex >= 0 && holder._selectedIndex < holder._options.length)
                    holder._options[holder._selectedIndex].setSelected(false, false);
                holder._selectedIndex = -1;
            }
            else { 
                holder._selectedIndex = -1;
                throw 'DomDropDown.selectedIndex: invalid index!';
            }
        }
    };
    
    holder.getMultiple = function() { 
        return holder._multiple; 
    };
    
    holder.setMultiple = function(bool) { 
        holder._multiple = bool ? true : false; 
    };
    
    holder.add = function(DomOptionElement) {
        holder._options.push(DomOptionElement);
        holder.appendChild(DomOptionElement);
        if (holder._options.length == 1 || DomOptionElement.getSelected()) 
            holder.setSelectedIndex(holder._options.length - 1);
    };
    
    holder.remove = function(optionIndex) {
        if (optionIndex >= 0 && optionIndex < holder._options.length) {
        
            if (holder._selectedIndex == optionIndex) {
                holder.setSelectedIndex(-1);
            } else
            if (holder._selectedIndex > optionIndex) {
                holder._selectedIndex--;
            }
        
            holder.removeChild(
                holder._options.splice(optionIndex, 1)[0]
            );
        } else throw 'DomDropDown.remove: Invalid index "'+optionIndex+'"';
    };
    
    holder.focusNextOption = function(e) {
        cancelEvent(e);
        if (holder._options.length == 0) return;
        holder.setFocusedIndex(holder._focusedIndex + 1 < holder._options.length ? holder._focusedIndex + 1 : 0);
        assureVisibility(holder._options[holder._focusedIndex]);/*.scrollIntoView(false);*/
    };
    
    holder.focusPrevOption = function(e) {
        cancelEvent(e);
        if (holder._options.length == 0) return;
        holder.setFocusedIndex(holder._focusedIndex - 1 >= 0 ? holder._focusedIndex - 1 : holder._options.length - 1);
        assureVisibility(holder._options[holder._focusedIndex]);/*.scrollIntoView(false);*/
    };
    
    holder.switchToFocusedOption = function(e) {
        cancelEvent(e);
        if (holder._options.length == 0) return;
        if (holder._focusedIndex < 0) return;
        holder._options[holder._focusedIndex].clickHandler();
    };
    
    holder.keyboardHandler = function(e) {
        e = e || window.event;
        charCode = Math.max(e.keyCode ? e.keyCode : 0, e.charCode ? e.charCode : 0);
        if (charCode == 0) return;
        switch (charCode) {
            //40 - down
            //38 - up
            //39 - right
            //37 - left
            //32 - space (toggle)
            //13 - enter
            //46 - delete
            
            case 40: holder.focusNextOption(e); return false; break;
            case 38: holder.focusPrevOption(e); return false; break;
            case 13:
            case 32: holder.switchToFocusedOption(e); return false; break;
            
            case 27:
                if (holder._multiple) {
                    for (var i=0; i<holder._options.length; i++) {
                        holder._options[i]._selected = false;
                        removeStyle(holder._options[i], 'selected');
                    }
                }
                cancelEvent(e);
                holder.onCustomEvent('change', { 'srcElement': holder });
                return false;
                break;
            
            case 65: //ctrl+a
                if (holder._multiple && e.ctrlKey) {
                    for (var i=0; i<holder._options.length; i++) {
                        addStyle(holder._options[i], 'selected');
                        holder._options[i]._selected = true;
                        holder._selectedIndex = i;
                    }
                }
                cancelEvent(e); 
                holder.onCustomEvent('change', { 'srcElement': holder });
                return false;
                break;
        }
    };
    
    try {
        holder.addEventListener('keydown', holder.keyboardHandler, false);
        holder.addEventListener('keypress', function(e) { cancelEvent(e); }, false);
    } catch(ex) {
        holder.attachEvent('onkeydown', holder.keyboardHandler);
        holder.attachEvent('onkeypress', function(e) { window.event.cancelBubble = true; return false; });
    }
    
    holder.addItem = function(iValue, iText, iHtml) {
        var opt = new DomOption();
        opt.setValue(iValue); 
        
        if (typeof iHtml != 'undefined') opt.innerHTML = iHtml; else
            opt.setText( typeof iText != 'undefined' ? iText : iValue );
        
        holder.add(opt);
        
        return opt;
    };
    
    holder.setItems = function(arr) {
        while (holder._options.length) holder.remove(0);
        var opt;
        for (var i=0; i<arr.length; i++) {
            opt = holder.addItem(arr[i].value, arr[i].text, items[i].html);
            if (arr[i].selected) opt.setSelected(true);
        }
    };
    
    holder.getValue = function() {
        if (holder._multiple) {
            var out = [];
            for (var i=0; i<holder._options.length; i++) {
                if (holder._options[i].getSelected()) out.push(holder._options[i].getValue());
            }
            return out;
        } else {
            for (var i=0; i<holder._options.length; i++) {
                if (holder._options[i].getSelected()) return holder._options[i].getValue();
            }
            return '';
        }
    };
    
    holder.setValue = function(something) {
        if (!(something instanceof Array) || (holder._multiple == false)) {
            
            if ((holder._multiple == false) && (something instanceof Array)) 
                something = someting[0] || '';
        
            for (var i=0; i<holder._options.length; i++) {
                if (holder._options[i].getValue() == something) {
                    holder._options[i].setSelected(true, true);
                    return something;
                }
            }
            holder.setSelectedIndex(-1, true);
            return '';
        } else {
        
            holder.setSelectedIndex(-1, true);
        
            for (var s = 0; s<something.length; s++) {
            
                for (var i=0; i<holder._options.length; i++) {
                    if (holder._options[i].getValue() == something[s]) {
                        holder._options[i].setSelected(true, false);
                        break;
                    }
                }
            
            }
        
        }
    }
    
    if (holder.__defineGetter__) {
        holder.__defineGetter__('options', holder.getOptions);
        holder.__defineGetter__('items',   holder.getOptions);
        holder.__defineSetter__('items',   holder.setItems);
        holder.__defineGetter__('selectedIndex', holder.getSelectedIndex);
        holder.__defineSetter__('selectedIndex', holder.setSelectedIndex);
        holder.__defineGetter__('value', holder.getValue);
        holder.__defineSetter__('value', holder.setValue);
        holder.__defineGetter__('multiple', holder.getMultiple);
        holder.__defineSetter__('multiple', holder.setMultiple);
    } else 
    if (Object.defineProperty) {
        Object.defineProperty(holder, 'options', { 'get': holder.getOptions });
        Object.defineProperty(holder, 'items',   { 'get': holder.getOptions, 'set': holder.setItems });
        Object.defineProperty(holder, 'selectedIndex', { 'get': holder.getSelectedIndex, 'set': holder.setSelectedIndex });
        Object.defineProperty(holder, 'value', { 'get': holder.getValue, 'set': holder.setValue });
        Object.defineProperty(holder, 'multiple', {'get': holder.getMultiple, 'set': holder.setMultiple });
    }
    
    if (typeof items != 'undefined') {
        holder.setItems(items);
    }
    
    disableSelection(holder);
    
    return holder;
}