/** Tab Panel Overview:
    
    Any TabPanel must be instantiated by an optional structure:
    ~~~~~~~
    TabPanel (config) {
        'initTabs': Array Of TabConfig,
        'layout': 'top' || 'bottom'
    }
    
    
    Any tab must be instantiated by a TabConfig structure:
    ~~~~~~~
    TabConfig {
        str  'caption',
        bool 'closeable',
        any  'id',
        bool 'config'
    }
    
    Properties of a TabPanel:
    ~~~~~~~~~~~~~~~~~~~~~~~~
    (get) (array of Tabs)      tabs
    (get) (array of Sheets)    sheets
    (get | set) (str)          layout (can only be: 'top' or 'bottom')
    
    Properties of a Tab:
    ~~~~~~~~~~~~~~~~~~~~~~
    (get | set) str            caption
    (get | set) bool           active
    (get | set) any            tabId
    (get)       HTMLDivElement sheet
    (get | set) bool           closeable
    
**/

function TabPanel(config) {
    var holder = $('div', 'DomTabPanel');
    
    holder.inner = holder.appendChild($('div', 'DomTabPanelInner'));
    
    holder.inner.DOManchors = {
        'width': function(w,h) { return w + 'px'; },
        'height':function(w,h) { return h + 'px'; }
    };
    
    holder.toolbar = holder.inner.appendChild($('div', 'DomTabPanelToolbar'));
    
    holder.__tabs   = [];
    holder.__sheets =  [];
    holder.__settings = config || {};
    
    holder.__settings.layout = holder.__settings.layout || 'top';
    holder.__settings.initTabs = holder.__settings.initTabs || [];
    
    holder.__isIE7 = navigator.appName == 'Microsoft Internet Explorer' &&
                   (navigator.appVersion.indexOf('MSIE 7') != -1);
                   
    holder.getTabById = function(tabID) {
        for (var i=0; i<holder.__tabs.length; i++) {
            if (holder.__tabs[i]._id == tabID)
                return holder.__tabs[i];
        }
        return null;
    };
    
    EnableCustomEventListeners(holder);
    
    holder.toolbar.tabIndex = 0;
    
    Keyboard.bindKeyboardHandler( holder.toolbar, 'space', function() {
        try { holder.toolbar.querySelector('.DomTabPanelTab:focus').clickHandler(); } catch(e) { }
    } );
    
    Keyboard.bindKeyboardHandler( holder.toolbar, 'left', function() {
        try { var t = holder.toolbar.querySelector('.DomTabPanelTab.TabActive').previousSibling; t.focus(); t.clickHandler(); } catch (e) { } 
    } );

    Keyboard.bindKeyboardHandler( holder.toolbar, 'right', function() {
        try { var t = holder.toolbar.querySelector('.DomTabPanelTab.TabActive').nextSibling; t.focus(); t.clickHandler(); } catch (e) { }
    });
    
    holder.addTab = function(config, tabIndex) {
        
        if (typeof tabIndex == 'undefined') {
            var tab = holder.toolbar.appendChild($('div', 'DomTabPanelTab'));
            EnableCustomEventListeners(tab);
            var sheet = holder.inner.appendChild($('div', 'DomTabPanelSheet'));
            holder.__tabs.push(tab);
            holder.__sheets.push(sheet);
        } else {
            var tab = holder.toolbar.insertBefore($('div', 'DomTabPanelTab'), holder.__tabs[tabIndex]);
            EnableCustomEventListeners(tab);
            var sheet = holder.inner.insertBefore($('div', 'DomTabPanelSheet'), holder.__sheets[tabIndex]);
            holder.__tabs.splice(tabIndex, 0, tab);
            holder.__sheets.splice(tabIndex, 0, sheet);
        }
        
        tab.tabIndex = 0;
        
        sheet.__xPadding = 4;
        sheet.__yPadding = 4;
        
        sheet.inner = sheet.appendChild($('div', 'DomTabPanelSheetInner'));
        
        sheet.inner.DOManchors = {
            'width': function(w,h) { return w + 'px'; },
            'height':function(w,h) { return h + 'px'; }
        };
        
        sheet.inner.redraw = function() {
            sheet.onDOMresize(holder.inner.offsetWidth, holder.inner.offsetHeight);
        };
        
        sheet.inner.insert = function(DOMElement) {
          sheet.inner.appendChild(DOMElement).paint();
          return DOMElement;
        };
        
        sheet.insert = function(HTMLDomElement) {
            sheet.inner.appendChild(HTMLDomElement);
            HTMLDomElement.onDOMresize( sheet.inner.offsetWidth, 
                                        sheet.inner.offsetHeight 
            );
            return HTMLDomElement;
        };
        
        tab.__sheet = sheet;
        
        sheet.getTab = function() {
            return tab;
        }
        
        disableSelection(tab);
        
        tab.style.display = holder.__isIE7 ? 'inline' : 'inline-block';
        
        tab._left = tab.appendChild($('div', 'DomTabLeft'));
        tab._right= tab.appendChild($('div', 'DomTabRight'));
        tab._caption = tab.appendChild($('span'));
        tab._closeButton = tab.appendChild($('div', 'TabCloseButton'));
        
        tab._active = false;
        tab._captionStr = '';
        tab._closeable = typeof(config) != 'undefined' && config.closeable ? true : false;
        tab._id = typeof config != 'undefined' && config.id ? config.id : null;
        
        tab.getActive = function() {
            return tab._active;
        };
        
        tab.setActive = function(bool, noRecursion) {
        
            tab._active = !!bool;
            
            for (var i=0; i<holder.__tabs.length; i++) {
                if (holder.__tabs[i] == tab){ 
                    
                    addStyle(holder.__tabs[i], 'TabActive');
                    addStyle(holder.__sheets[i], 'active');
                    
                    holder.onCustomEvent('change', i);
                    holder.__tabs[i].onCustomEvent('activate');
                    
                } else {
                    
                    removeStyle(holder.__tabs[i], 'TabActive');
                    removeStyle(holder.__sheets[i], 'active');
                    
                    holder.__tabs[i]._active = !!bool ? false : holder.__tabs[i]._active;;
                    
                    holder.__tabs[i].onCustomEvent('deactivate');
                }
            }
            
            if (bool) tab.__sheet.inner.redraw();
            
            try {
                getOwnerWindow( holder ).paint();
            } catch( e ){}
        };
        
        tab.getCaption = function() {
            return tab._captionStr;
        };
        
        tab.setCaption = function(str) {
            tab._captionStr = str;
            tab._caption.innerHTML = '';
            tab._caption.appendChild(document.createTextNode(str));
        };
        
        tab.getCloseable = function() {
            return tab._closeable;
        };
        
        tab.setCloseable = function(bool) {
            tab._closeable = bool ? true : false;
            if (tab._closeable) addStyle(tab, 'closeable');
            else removeStyle(tab, 'closeable');
        };
        
        tab.close = function() {
            
            if (!holder.onCustomEvent('tab-close', tab))
                return false;
            
            var tbIndex = false;
            
            for (var i=0; i<holder.__tabs.length; i++) {
                if (holder.__tabs[i] == tab) {
                    tbIndex = i;
                    break;
                }
            }
            
            if (tab._active) {
                if (tbIndex !== false) {
                    if (tbIndex > 0) {
                        holder.__tabs[tbIndex-1].setActive(true);
                    } else {
                        if (tbIndex < holder.__tabs.length - 1) {
                            holder.__tabs[tbIndex+1].setActive(true);
                        }
                    }
                }
            }
            
            if (tbIndex !== false) {
                holder.toolbar.removeChild(holder.__tabs[tbIndex]);
                holder.inner.removeChild(holder.__sheets[tbIndex]);
                
                holder.__tabs.splice(tbIndex, 1);
                holder.__sheets.splice(tbIndex, 1);
            }
        };
        
        tab.getId = function() {
            return tab._id;
        };
        
        tab.setId = function(something) {
            tab._id = something;
        };
        
        tab.getSheet = function() {
            return tab.__sheet.inner;
        };
        
        if (holder.__tabs.length == 1) tab.setActive(true);
        
        tab.clickHandler = function(e) {
            tab.setActive(true);
            cancelEvent(e);
            return false;
        };
        
        tab.closeButtonClick = function(e) {
            cancelEvent(e);
            tab.close();
            return false;
        };
        
        if (tab.addEventListener) {
            tab.addEventListener('click', tab.clickHandler, false); 
            tab._closeButton.addEventListener('click', tab.closeButtonClick, false);
        } else {
            tab.attachEvent('onclick', tab.clickHandler);
            tab._closeButton.attachEvent('onclick', tab.closeButtonClick);
        }
        
        tab.setCaption(config.caption);
        if (tab._closeable) tab.setCloseable(true);
        
        Object.defineProperty(tab, 'caption', { 'get': tab.getCaption, 'set': tab.setCaption });
        Object.defineProperty(tab, 'active',  { 'get': tab.getActive,  'set': tab.setActive });
        Object.defineProperty(tab, 'tabId',   { 'get': tab.getId,      'set': tab.setId });
        Object.defineProperty(tab, 'sheet',   { 'get': tab.getSheet });
        Object.defineProperty(tab, 'closeable', {'get': tab.getCloseable, 'set': tab.setCloseable });
        
        if (typeof config != 'undefined' && config.active)
            tab.setActive(true);
        
        return sheet;
    };
    
    holder.getTabs = function(tabIndex) {
        return typeof tabIndex != 'undefined' ? holder.__tabs[tabIndex] : holder.__tabs;
    };
    
    holder.getSheets = function(sheetIndex) {
        if (typeof sheetIndex != 'undefined') return holder.__sheets[sheetIndex].inner;
        else {
            var out = [];
            for (var i=0; i<holder.__sheets.length; i++) {
                out.push(holder.__sheets[i].inner);
            }
            return out;
        }
    };
    
    holder.getLayout = function() {
        return holder.__settings.layout;
    };
    
    holder.setLayout = function(str) {
        switch (str) {
            case 'top': {
                holder.__settings.layout = 'top';
                removeStyle(holder, 'ToolbarBottom');
                break;
            }
            case 'bottom': {
                holder.__settings.layout = 'bottom';
                addStyle(holder, 'ToolbarBottom');
                break;
            }
            default: {
                throw 'TabPanel: Allowed layouts are "top" and "bottom"!';
                break;
            }
        }
    };
    
    holder.setLayout(holder.__settings.layout);
    
    for (var i=0; i<holder.__settings.initTabs.length; i++) {
        holder.addTab(holder.__settings.initTabs[i]);
    }
    
    if (holder.__defineGetter__) {
        holder.__defineGetter__('tabs', holder.getTabs);
        holder.__defineGetter__('sheets', holder.getSheets);
        holder.__defineGetter__('layout', holder.getLayout);
        holder.__defineSetter__('layout', holder.setLayout);
    }
    
    return holder;
}