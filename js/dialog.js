/** A dialog sorter stack, implemented for preventing removing and adding again the window to DOM
**/

var _winZIndexOrder = 100;

function _winZIndexSorter(w1, w2) {
    switch (true) {
        case w1.alwaysOnTop && w2.alwaysOnTop: return 0; break;
        case w1.alwaysOnTop: return 1; break;
        case w1.active: return 1; break;
        default: return w1.__zIndexSort - w2.__zIndexSort; break;
    }
}

/** The ultimate DomWindow dialog. 
    It is intended to provide all the functionality an OS GUI can provide
    
    Params: {
        int     'width':
        int     'height':
        int     'x':
        int     'y':
    DOMElement  'childOf':
        bool    'attached' ??? (maybe used in another module???)
        bool    'minimizeable':
        bool    'minimized':
        bool    'maximizeable':
        bool    'maximized':
        bool    'closeable':
        bool    'resizeable':
        bool    'moveable':
        bool    'visible':
        str     'caption':
        bool    'appIcon':
        bool    'active':
        bool    'alwaysOnTop':
        bool    'scrollable':
        
        //LAYTOUT SETTINGS
    }
    
    Getters / Setters
    ~~~~~~~~~~~~~~~~~~~~~
    (get | set) width
    (      set) __width
    (get | set) height
    (      set) __height
    (get | set) x
    (get | set) y
    (get | set) minimizeable
    (get | set) minimized
    (get | set) closeable
    (get | set) resizeable
    (get | set) moveable
    (get | set) visible
    (get | set) childOf
    (get | set) caption
    (get | set) appIcon
    (get | set) scrollable
    (get | set) active
    (get | set) alwaysOnTop
    (get | set) maximized
    (get | set) maximizeable

    //new in v2.0
    (get | set) titlebar
    (get | set) menu
    (get | set) menuVisible
    (get | set) toolbarsSettings
    (get | set) toolbars
    (get | set) toolbarsVisible
    (get | set) statusBar
    (get | set) statusBarVisible
    (get | set) modal
*/


function Dialog(settings, editMode) {
    var _w = $('div', 'DOM2Window');
    
    _w.designMode = typeof editMode == 'undefined' ? false : true;
    if ( _w.designMode )
        addStyle(_w, 'design-mode' );
    
    _w.___uniqueID = uniqueID();
    
    _w.getUniqueID = function() {
        return _w.___uniqueID;
    };
    
    try {
        _w.__defineGetter__('uniqueID', _w.getUniqueID);
    } catch(ex) {
        Object.defineProperty(_w, 'uniqueID', { 'get': _w.getUniqueID });
    }
    
//     _w.__DEBUG_CUSTOM_EVENT_LISTENERS__ = true;
    
    _w.__zIndexSort = _winZIndexOrder;
    
    _w.settings = settings || {};
    
    //We enable our event listener mechanism
    EnableCustomEventListeners(_w);
    
    //LOAD WINDOW PARAMETERS || DEFAULTS
    
    _w.settings.width         = typeof(_w.settings.width) != 'undefined' ? _w.settings.width : 
        (_w.settings.childOf ? _w.settings.childOf.offsetWidth : getMaxX());
        
    _w.settings.height        = typeof(_w.settings.height)!= 'undefined' ? _w.settings.height: 
        (_w.settings.childOf ? _w.settings.childOf.offsetHeight : getMaxY());
        
    _w.settings.x             = typeof(_w.settings.x) != 'undefined' ? _w.settings.x : 
        Math.ceil((_w.settings.childOf ? _w.settings.childOf.offsetWidth : getMaxX())/2 - _w.settings.width/2);
        
    _w.settings.y             = typeof(_w.settings.y) != 'undefined' ? _w.settings.y : 
        Math.ceil((_w.settings.childOf ? _w.settings.childOf.offsetHeight : getMaxY())/2 - _w.settings.height/2);
    
    _w.settings.childOf       = typeof(_w.settings.childOf) != 'undefined' ? _w.settings.childOf : null;
    _w.settings.attached      = typeof(_w.settings.attached) != 'undefined' ? _w.settings.attached : false;
    
    _w.settings.minimizeable  = typeof(_w.settings.minimizeable) != 'undefined' ? _w.settings.minimizeable : true;
    _w.settings.minimized     = typeof(_w.settings.minimized) != 'undefined' ? _w.settings.minimized : false;
    _w.settings.maximizeable  = typeof(_w.settings.maximizeable) != 'undefined' ? _w.settings.maximizeable : true;
    _w.settings.maximized     = typeof(_w.settings.maximized) != 'undefined' ? _w.settings.maximized : false;
    _w.settings.closeable     = typeof(_w.settings.closeable) != 'undefined' ? _w.settings.closeable : true;
    _w.settings.resizeable    = typeof(_w.settings.resizeable) != 'undefined' ? _w.settings.resizeable : true;
    _w.settings.moveable      = typeof(_w.settings.moveable) != 'undefined' ? _w.settings.moveable : true;
    _w.settings.visible       = typeof(_w.settings.visible) != 'undefined' ? _w.settings.visible : true;
    _w.settings.caption       = typeof(_w.settings.caption) != 'undefined' ? _w.settings.caption : 'No Title';
    
    _w.settings.appIcon       = typeof(_w.settings.appIcon) != 'undefined' ? _w.settings.appIcon : '';
    
    _w.settings.active        = typeof(_w.settings.active) != 'undefined' ? _w.settings.active : true;
    _w.settings.alwaysOnTop   = typeof(_w.settings.alwaysOnTop) != 'undefined' ? _w.settings.alwaysOnTop : false;
    
    _w.settings.scrollable    = typeof(_w.settings.scrollable) != 'undefined' ? _w.settings.scrollable : false;
    
    _w.settings.modal         = typeof(_w.settings.modal) != 'undefined' ? _w.settings.modal : false;
    
        //BEGIN: Important!
        
    _w.settings.minWidth         = typeof _w.settings.minWidth != 'undefined' ? _w.settings.minWidth : 10;
    _w.settings.minHeight        = typeof _w.settings.minHeight!= 'undefined' ? _w.settings.minHeight: 10;
        
    _w.settings.titlebar         = typeof(_w.settings.titlebar) != 'undefined' ? _w.settings.titlebar : true;
    
    _w.settings.menuVisible      = typeof(_w.settings.menuVisible) != 'undefined' ? _w.settings.menuVisible : true;
    _w.settings.menu             = typeof(_w.settings.menu) != 'undefined' ? _w.settings.menu : false;
    
    _w.settings.toolbarsVisible  = typeof(_w.settings.toolbarsVisible) != 'undefined' ? _w.settings.toolbarsVisible : true;
    _w.settings.toolBars         = typeof(_w.settings.toolbars) != 'undefined' ? _w.settings.toolbars : false;
    
    _w.settings.statusBarVisible = typeof(_w.settings.statusBarVisible) != 'undefined' ? _w.settings.statusBarVisible : true;
    _w.settings.statusBar        = typeof(_w.settings.statusBar) != 'undefined' ? _w.settings.statusBar : false;
    
    _w.settings.toolbarsSettings = _w.settings.toolbarsSettings || {
                        'iconSize': 'normal',
                        'titles'  : false,
                        'buttonLabels': false
                };
        
        //END: Important
    
    //BEGIN: WINDOW INTERNAL OBJECTS
    
    _w.inner = $('div', 'DOM2WindowInner');
    _w.appendChild(_w.inner);
    
    _w._titlebarHolder = $('div', 'DOM2WindowTitle');
    _w._titlebarHolder.setAttribute('dragable', '1');
    
    _w._titlebarHolder.addContextMenu([
        {
            "caption": "Always On Top",
            "checked": function() {
                return _w.alwaysOnTop
            },
            "input": "checkbox",
            "handler": function(bool) {
                _w.alwaysOnTop = !!bool;
            }
        },
        null,
        {
            "caption": "Maximized",
            "disabled": function() {
                return !_w.maximizeable;
            },
            "handler": function(bool) {
                _w.maximized = !!bool;
            },
            "input": "checkbox",
            "checked": function() {
                return _w.maximized;
            }
        },
        {
            "caption": "Minimize",
            "disabled": function() {
                return !_w.minimizeable;
            },
            "handler": function() {
                _w.minimized = true;
            }
        },
        {
            "caption": "Close",
            "disabled": function() {
                return !_w.closeable;
            },
            "handler": function() {
                _w.close();
            }
        }
    ]);
    
    _w._titlebarHolderMouseDown = function(e) {
        _w._titlebarHolder.activeElement = document.activeElement;
    };
    
    _w._titlebarHolderMouseUp = function(e) {
        if (_w.windows) {
            for (var i=0; i<_w.windows.length; i++) {
                if (_w.windows[i].active && _w.windows[i].modal) {
                    
                    if (!_w.designMode)
                        _w._titlebarHolder.activeElement.focus();
                    document.body.scrollTop = 0;
                    document.body.scrollLeft = 0;
                }
            }
        }
    };
    
    try {
        _w._titlebarHolder.addEventListener('mousedown', _w.titlebarHolderMouseDown, true)
        _w._titlebarHolder.addEventListener('mouseup', _w.titlebarHolderMouseUp, false);
    } catch(ex) {
        _w._titlebarHolder.attachEvent('onmousedown', _w.titlebarHolderMouseDown);
        _w._titlebarHolder.attachEvent('onmouseup', _w.titlebarHolderMouseUp);
    }
    
    _w._titlebarHolder.style.display = _w.settings.titlebar ? '' : 'none';
    
    _w.inner.appendChild(_w._titlebarHolder);
    
    _w._titlebarHolderInner = _w._titlebarHolder.appendChild($('div', 'DOM2WindowTitleInner'));
    _w._titlebarHolderInner.setAttribute('dragable', '1');
    
    _w.modalIconHolder = _w._titlebarHolderInner.appendChild($('div', 'DOM2WindowModalIcon'));
    _w.modalIconHolder.setAttribute('dragable', '1');
    
    _w._titlebarHolder._caption = _w._titlebarHolderInner.appendChild($('div', 'DOM2WindowCaption'));
    _w._titlebarHolder._caption.setAttribute('dragable', '1');
    
    disableSelection(_w._titlebarHolder._caption);
    
    _w.modalButtonsHolder = _w._titlebarHolderInner.appendChild($('div', 'DOM2WindowModalButtonsHolder'));
    _w.modalButtonsHolder.setAttribute('dragable', '1');
    
    //NOW insert in modalButtonsHolder the window buttons
    _w._close_button = _w.modalButtonsHolder.appendChild($('div', 'DOM2WindowClose'));
    _w._maximize_button = _w.modalButtonsHolder.appendChild($('div', 'DOM2WindowMaximize'));
    _w._minimize_button = _w.modalButtonsHolder.appendChild($('div', 'DOM2WindowMinimize'));
    
    _w._close_button.style.display = _w.settings.closeable ? '' : 'none';
    _w._maximize_button.style.display = _w.settings.maximizeable ? '' : 'none';
    _w._minimize_button.style.display = _w.settings.minimizeable ? '' : 'none';
    
    _w._menuHolder      = _w.inner.appendChild($('div', 'DomDialogMenuBar'));
    _w._toolbarHolder   = _w.inner.appendChild($('div', 'DomDialogToolbar'));
    _w._statusBarHolder = _w.inner.appendChild($('div', 'DomDialogStatusBar'));
    
    if (!_w.settings.statusBar || !_w.settings.statusBarVisible) _w._statusBarHolder.style.display = 'none';
    if (!_w.settings.menuBar   || !_w.settings.menuBarVisible)   _w._menuHolder.style.display = 'none';
    
    _w.body   = $('div', 'DOM2WindowBody');
    _w.inner.appendChild(_w.body);

    //if we setup a menu on window, then in the above var it is initialized
    _w._hMenu = false;
    _w._hToolbar = false;

    
    //END: WINDOW INTERNAL OBJECTS
    
    //BEGIN: TO_PORT
    
    
    //_w.onLooseFocus will become: looseFocus
    _w.onLooseFocus = function() {
    
    };
    
    //_w.onGetFocus will become: getFocus
    _w.onGetFocus = function() {
    
    };
    
    //END: TO_PORT
    
    
    //BEGIN WINDOW METHODS
    
    
    //BEGIN: NEW WINDOW METHODS
    
    
    _w.___toolbarsRedrawEventListener = function() {
//         _w._toolbarHolder.style.height = _w._hToolbar.offsetHeight + 'px';
        _w.onCustomEvent('redraw', {'wnd': _w});
    };
    
    _w.___onLayoutChange = function() {
        var i = 0;
        
        if (_w.getTitlebar()) { 
            _w._titlebarHolder.style.top = i+'px';
            i += (_w._titlebarHolder.offsetHeight);
        }
        
        if (_w._hMenu && _w.getMenuVisible()) {
            _w._menuHolder.style.top = i + 'px';
            i += (_w._menuHolder.offsetHeight );
        }
        
        if (_w._hToolbar && _w.getToolbarsVisible()) {
            _w._toolbarHolder.style.height = _w._hToolbar.offsetHeight + 'px';
            _w._toolbarHolder.style.top = i + 'px';
            i += (_w._toolbarHolder.offsetHeight );
        }
        
//         _w.body.style.bottom = (_w.settings.statusBar && _w.settings.statusBarVisible ? _w.statusBarHolder.offsetHeight + 4 : 0) + 'px';
        
        
        _w.body.style.height = _w.getHeight() - i  + 'px';
        
    };
    
    _w.addCustomEventListener('redraw', _w.___onLayoutChange);
    
    
    _w.getMinWidth = function() {
        return _w.settings.minWidth;
    };
    
    _w.setMinWidth = function(intVal) {
        var i = parseInt(intVal);
        i = (isNaN(i) || !i || (i < 10)) ? 10 : i;
        if (_w.getWidth() < i) _w.setWidth(i);
        _w.settings.minWidth = i;
    };
    
    _w.getMinHeight = function() {
        return _w.settings.minHeight;
    };
    
    _w.setMinHeight = function(intVal) {
        var i = parseInt(intVal);
        i = (isNaN(i) || !i || (i < 10)) ? 10 : i;
        if (_w.getHeight() < i) _w.setHeight(i);
        _w.settings.minHeight = i;
    };
    
    _w.getToolbarsSettings = function() {
        return _w.settings.toolbarsSettings;
    };
    
    _w.setToolbarsSettings = function(obj) {
        _w.settings.toolbarsSettings = obj;
    };
    
    _w.getTitlebar = function() {
        return _w.settings.titlebar;
    };
    
    _w.setTitlebar = function(bool) {
        _w.settings.titlebar = bool ? true : false;
        _w._titlebarHolder.style.display = _w.settings.titlebar ? '' : 'none';
        _w.onCustomEvent('redraw', { 'wnd': _w });
    };
    
    _w.getMenuVisible = function() {
        return _w.settings.menu && _w.settings.menuVisible;
    };
    
    _w.setMenuVisible = function(bool) {
        _w.settings.menuVisible = bool ? true : false;
        _w._menuHolder.style.display = (_w.settings.menuVisible && _w.settings.menu) ? '' : 'none';
        if (_w.settings.menu) _w.onCustomEvent('redraw', { 'wnd':_w});
    };
    
    _w.getMenu = function() {
        return _w.settings.menu ? _w._hMenu : false;
    };
    
    _w.setMenu = function(menuConfig) {
        if (menuConfig == _w.settings.menu) { 
//             console.log('same menu!');
            return;
        }
        
        if (!menuConfig) {
            _w.settings.menu = false;
            _w._menuHolder.innerHTML = '';
            _w._hMenu = false;
            if (_w.settings.menuVisible)
                _w.onCustomEvent('redraw', {'wnd': _w});
        } else {
            _w.settings.menu = menuConfig;
            _w._menuHolder.innerHTML = '';
            try {
                _w._hMenu = new MenuBar(_w.settings.menu);
            } catch(ex) {
                console.log('Attempted to setup a menu on a window, but the following error occured:\n   - '+ex+'\n'+ex.stack);
                _w.setMenu(false);
                return;
            }
            _w._menuHolder.appendChild(_w._hMenu);
            _w._menuHolder.style.display = 
                _w.settings.menuVisible ? '' : 'none';
            if (_w.settings.menuVisible)
                _w.onCustomEvent('redraw', {'wnd': _w});
                
            //console.log('menu setup');
        }
    };
    
    _w.getToolbarsVisible = function() {
        return _w.settings.toolbars && _w.settings.toolbarsVisible;
    };
    
    _w.setToolbarsVisible = function(bool) {
        _w.settings.toolbarVisible = bool ? true : false;
        _w._toolbarHolder.style.display = (_w.settings.toolbarVisible && _w.settings.toolbars) ? '' : 'none';
        if (_w.settings.toolbars) _w.onCustomEvent('redraw', { 'wnd':_w});
    };
    
    _w.getToolbars = function() {
        return _w.settings.toolbars ? _w._hToolbar : false;
    };
    
    _w.setToolbars = function(toolbarsConfig) {
        if (toolbarsConfig == _w.settings.toolbars) { 
//             console.log('same toolbars!');
            return;
        }
        
        if (!toolbarsConfig) {
            _w.settings.toolbars = false;
            _w._toolbarHolder.innerHTML = '';
            _w._hToolbar = false;
            if (_w.settings.toolbarsVisible) {
                _w.setToolbarsVisible(false);
                _w.onCustomEvent('redraw', {'wnd': _w});
            }
        } else {
            _w.settings.toolbars = toolbarsConfig;
            try {
                
                var tmp = [];
                
                for (var i=0; i<_w.settings.toolbars.length; i++) {
                    tmp.push(new Toolbar( _w.settings.toolbars[i].items, _w.settings.toolbars[i].name ));
                }
                
                _w._hToolbar = new AppToolbarZone(tmp, _w.settings.toolbarsSettings);
                    
                _w._hToolbar.addCustomEventListener('resize', _w.___toolbarsRedrawEventListener);
            
            } catch(ex) {
//                 console.log('Attempted to setup a toolbar zone on a window, but the following error occured:\n   - '+ex);
                _w.setToolbars(false);
                return;
            }
            _w._toolbarHolder.innerHTML = '';
            _w._toolbarHolder.appendChild(_w._hToolbar);
            
            _w._toolbarHolder.style.display = 
                _w.settings.toolbarsVisible ? '' : 'none';
                
            if (_w.settings.toolbarsVisible)
                _w.onCustomEvent('redraw', {'wnd': _w});
            
//             console.log('toolbar setup');
        }
    };
    
    _w.getStatusBarVisible = function() {
        return _w.settings.statusBar && _w.settings.statusBarVisible;
    };
    
    _w.setStatusBarVisible = function(bool) {
        _w.settings.statusBarVisible = bool ? true : false;
        _w._statusBarHolder.style.display = (_w.settings.statusBarVisible && _w.settings.statusBar) ? '' : 'none';
        if (_w.settings.statusBar) _w.onCustomEvent('redraw', { 'wnd':_w});
    };
    
    _w.getStatusBar = function() {
        return _w.settings.statusBar ? _w.statusBarHolder : false;
    };
    
    _w.setStatusBar = function(bool) {
        if (bool == _w.settings.statusBar) { 
//             console.log('same statusBar!');
            return;
        }
        
        if (!bool) {
            _w.settings.statusBar = false;
            _w._statusBarHolder.innerHTML = '';
            
            _w._statusBarHolder.style.display = 'none';
            
            if (_w.settings.statusBarVisible)
                _w.onCustomEvent('redraw', {'wnd': _w});
        } else {
            _w.settings.statusBar = bool;;
            _w._statusBarHolder.style.display = 
            _w.settings.statusBarVisible ? '' : 'none';
            
        if (_w.settings.statusBarVisible)
            _w.onCustomEvent('redraw', {'wnd': _w});
           
        }
    };
    
    _w.getModal = function() {
        return _w.settings.modal;
    };
    
    _w.setModal = function(bool){
        bool = bool ? true : false;
        
        if (bool == _w.settings.modal) 
            return;
        
        switch (bool) {
            case true:
                    _w.__MODAL_FRAME = $('div', 'DOM2DialogModalOverlay');
                    
                    if (_w.settings.childOf) {
                        
                        var modalParent = getOwnerWindow(_w.settings.childOf);
                        if (modalParent === null) modalParent = _w.settings.childOf;
                        modalParent.appendChild(_w.__MODAL_FRAME);
                    }
                    
                break;
            case false:
                if (typeof _w.__MODAL_FRAME != 'undefined') {
                    if (_w.__MODAL_FRAME.parentNode)
                        _w.__MODAL_FRAME.parentNode.removeChild(_w.__MODAL_FRAME);
                    delete _w.__MODAL_FRAME;
                }
                break;
        }
        _w.settings.modal = bool;
    }
    
    //END: NEW WINDOW METHODS
    
    
    _w.getWidth = function() { 
        return _w.settings.width; 
    };
    
    _w.setWidth = function(intVal) {
        var nw = parseInt(intVal);
        nw = (isNaN(nw) || (nw < _w.settings.minWidth)) ? _w.settings.minWidth : nw;
        
        var checksum = (_w.getToolbarsVisible() ? _w._hToolbar.offsetHeight : 0) + 
                       (_w.getMenuVisible() ? _w._menuHolder.offsetHeight: 0);
        
        _w.style.width = nw + 'px';
        _w.inner.style.width = nw + 'px';
        _w.settings.width = nw;
        _w._titlebarHolderInner.style.width = nw + 'px';
        
        if ((typeof(_w._resize_handle) != 'undefined') && (_w._resize_handle !== null))
            _w._resize_handle.style.left = nw - 10 + 'px';;
        
        var checksum2 = (_w.getToolbarsVisible() ? _w._hToolbar.offsetHeight : 0) + 
                       (_w.getMenuVisible() ? _w._menuHolder.offsetHeight: 0);
        
        if (checksum != checksum2) {
            _w.onCustomEvent('redraw', { 'wnd': _w });
            _w.skipRepaint = false;
        } else {
            if (!_w.skipRepaint) _w.__repaint(); else _w.skipRepaint = false;
        }
    }
    
    _w.set__width =  function(intVal) {
        _w.skipRepaint = true;
        _w.setWidth(intVal);
    };
    
    _w.getHeight = function() { 
        return _w.settings.height;
    };
    
    _w.setHeight = function(intVal) {
        var checksum = (_w.getToolbarsVisible() ? _w._toolbarHolder.offsetHeight : 0) + 
                       (_w.getMenuVisible() ? _w._menuHolder.offsetHeight: 0);
        
        var nw = parseInt(intVal);
        nw = (isNaN(nw) || (nw < _w.settings.minHeight)) ? _w.settings.minHeight : nw;
        _w.style.height = nw + 'px';
        
        _w.inner.style.height = nw + 'px';
        _w.settings.height = nw;
        
        _w._titlebarHolderInner.style.height = _w._titlebarHolder.offsetHeight+'px';

        if ((typeof(_w._resize_handle) != 'undefined') && (_w._resize_handle !== null))
            _w._resize_handle.style.top = nw - 10 + 'px';
        if (!_w.skipRepaint) _w.__repaint(); else _w.skipRepaint = false;
        
        var checksum2 = (_w.getToolbarsVisible() ? _w._toolbarHolder.offsetHeight : 0) + 
                       (_w.getMenuVisible() ? _w._menuHolder.offsetHeight: 0);
        
        if (checksum != checksum2) {
            _w.onCustomEvent('redraw', { 'wnd': _w });
            _w.skipRepaint = false;
        } else {
            if (!_w.skipRepaint) _w.__repaint(); else _w.skipRepaint = false;
        }
    };
    
    _w.set__height =  function(intVal) {
        _w.skipRepaint = true;
        _w.setHeight(intVal);
    };
    
    
    _w.getX = function() { 
        return _w.settings.x; 
    };
    
    _w.setX = function(intVal) {
        var nw = parseInt(intVal);
        nw = (isNaN(nw)) ? 0 : nw;
        _w.style.left = nw + 'px';
        _w.settings.x = nw;
    };
    
    _w.getY = function() { 
        return _w.settings.y; 
    };
    
    _w.setY = function(intVal) {
        var nw = parseInt(intVal);
        nw = (isNaN(nw)) ? 0 : nw;
        _w.style.top = nw + 'px';
        _w.settings.y = nw;
    };
    
    _w.getMinimizeable = function() { 
        return _w.settings.minimizeable; 
    };
    
    _w.setMinimizeable = function(bool) {
        if (bool) {
            _w.settings.minimizeable = true;
            _w._minimize_button.style.display = '';
        } else {
            _w.settings.minimizeable = false;
            _w._minimize_button.style.display = 'none';
        }
    };
    
    _w.getMinimized = function() { 
        return _w.settings.minimized; 
    };
    
    _w.setMinimized = function(bool) {
    
        if (_w.modal) return;
    
//         alert('bool: '+bool+', settings.minimized = '+_w.settings.minimized);
        
        if (bool) {
            if (!_w.settings.minimizeable) { 
//                 console.log('Error minimizing window: NOT_MINIMIZEABLE'); 
                return false; 
            }
        
            _w.settings.minimized = true;
            _w.setActive( false );
            
            addStyle(_w, 'DOM2MinimizedWindow');
            
            if (typeof(_w._minimizeHandle) == 'undefined') 
                _w._minimizeHandle = $('div', 'DOM2MinimizeHandle');
            
            if (_w.getChildOf() !== null) {
                
                if (!_w.getChildOf()._minimize_holder) {
//                     console.log('creating minimize holder');
                    _w.getChildOf()._minimize_holder = $('div', 'DOM2MinimizeHolder');
                    _w.getChildOf().appendChild(_w.getChildOf()._minimize_holder);
                }
                
                _w.getChildOf()._minimize_holder.appendChild(_w._minimizeHandle);
                
                _w._minimizeHandle.innerHTML = '';
                _w._minimizeHandle.appendChild(document.createTextNode(_w.settings.caption));
                
                _w._minimizeHandle.onclick = function() {
                    _w.setMinimized( false );
                };
            }
            
        } else {
            _w.settings.minimized = false;
            
            _w.setActive( true );
            
            if (_w._minimizeHandle) {
                try {
                    _w._minimizeHandle.parentNode.removeChild(_w._minimizeHandle);
                } catch(ex) {}
//                 console.log('removed from minimize holder');
            }
            removeStyle(_w, 'DOM2MinimizedWindow');
            
            _w.__repaint();
        }
    };
    
    _w.getMaximizeable = function() { 
        return !!_w.settings.maximizeable; 
    };
    
    _w.setMaximizeable = function(bool) {
        if (bool) {
            _w.settings.maximizeable = true;
            _w._maximize_button.style.display = '';
        } else {
            _w._maximize_button.style.display = 'none';
            _w.settings.maximizeable = false;
        }
    };
    
    _w.getMaximized = function() { 
        return (typeof(_w.settings.is_maximized) && (_w.settings.is_maximized == true)) ? true : false; 
    };
    
    _w.setMaximized = function(bool) {
    
        if (!_w.getResizeable()) return;
    
        if (!_w.settings.maximizeable) {
//             console.log('Error maximizing / restoring window (title="'+_w.settings.title+'"): resizing is not allowed!');
            return;
        }
    
        if (bool && !_w.getMaximized()) _w.maximize();
        if (!bool && _w.getMaximized()) _w.restore();
        _w.settings.maximized = bool;
        _w.paint();
    };
    
    _w.maximize = function() {
        if (_w.settings.is_maximized) return;
        _w.settings.is_maximized = true;
        
        _w.settings.beforeMaximizeWidth = _w.getWidth();
        _w.settings.beforeMaximizeHeight= _w.getHeight();
        _w.settings.beforeMaximizeX = _w.getX();
        _w.settings.beforeMaximizeY = _w.getY();
        _w.settings.beforeMaximizeMoveable = _w.getMoveable();
        
        
        _w.setX(0);
        _w.setY(0);
        
//         console.log(_w.getChildOf().offsetWidth+','+_w.getChildOf().offsetHeight+','+_w.getChildOf());
        
        _w.set__width( _w.getChildOf().offsetWidth );
        _w.setHeight( _w.getChildOf().offsetHeight -
                      //if the parent element has a taskbar, we take account of it's height too
                      (typeof(_w.settings.childOf.taskbar) != 'undefined' ? _w.settings.childOf.taskbar.offsetHeight : 0) 
                    );
        _w.setMoveable(false);
        
        _w.body.paint();
    };
    
    _w.restore = function() {
        if (!_w.settings.is_maximized) return;
        
        _w.settings.is_maximized = false;
        _w.setX( _w.settings.beforeMaximizeX );
        _w.setY( _w.settings.beforeMaximizeY );
        _w.setWidth( _w.settings.beforeMaximizeWidth );
        _w.setHeight( _w.settings.beforeMaximizeHeight );
        _w.setMoveable( _w.settings.beforeMaximizeMoveable );
    };
    
    _w.getCloseable = function() { 
        return _w.settings.closeable; 
    };
    
    _w.__closeButtonClick = function() { _w.close(); };
    
    
    _w.setCloseable = function(bool) {
        if (bool) {
            _w.settings.closeable = true;
            _w._close_button.style.display = '';
        } else {
            _w._close_button.style.display = 'none';
            _w.settings.closeable = false;
        }
    };
    
    _w.close = function() {

        if (!_w.settings.closeable) {
            console.log('Attempting to close the window (title="'+_w.caption+'") failed (window is not closeable)');
            return;
        }
    
        var canClose = (typeof(_w.closeCallback) != 'undefined') ? _w.closeCallback() : true;
        
        if (canClose) {
        
            /* Trigger a close event */
            
            if (_w.settings.childOf) {
                
                var tryActivateWindowByIndex = _w.settings.childOf.windows.length - 1;
                var oldChildOf = _w.settings.childOf;
                
                for (var i=0; i<_w.settings.childOf.windows.length; i++) {
                    if (_w.settings.childOf.windows[i] == _w) {
                        tryActivateWindowByIndex = i;
                        break;
                    }
                }
            }

            _w.onCustomEvent( 'destroy' );
        
            _w.setChildOf( null );

            /*
            
            //Removed, what seemed to be a good feature is still an annoying bug
            
            if (typeof tryActivateWindowByIndex != 'undefined') {
                if (!oldChildOf.windows.length)
                    return;
                
                if (tryActivateWindowByIndex >= oldChildOf.windows.length)
                    tryActivateWindowByIndex = oldChildOf.windows.length - 1;
                
                var i = tryActivateWindowByIndex;
                
                do {
                    i--;
                    if (i < 0)
                        i = oldChildOf.windows.length - 1;
                    
                    if (!oldChildOf.windows[i].getMinimized()) {
                        oldChildOf.windows[i].setActive(true);
                        return;
                    }
                    
                } while (i != tryActivateWindowByIndex);
            }
            */
        }
        
    };

    
    _w.getResizeable = function() { 
        return _w.settings.resizeable; 
    };
    
    _w.setResizeable = function(bool) {
        if (bool) {
            if ((!_w.resizeListener) || (_w.resizeListener === null)) {
                _w._resize_handle = $('div', 'DOM2WindowResize');
                _w.inner.appendChild(_w._resize_handle);
                
                _w._resize_handle.style.left = _w.getWidth() - 10 + 'px';
                _w._resize_handle.style.top = _w.getHeight() - 10 + 'px';
                
                var oldCaption;
                
                _w._onResizeStart = function() {
                    
                    oldCaption = _w.getCaption();
                    
                    if (_w.maximized) {
                        _w.settings.is_maximized = null;
                        if (_w.settings.beforeMaximizeMoveable) _w.moveable = _w.settings.beforeMaximizeMoveable;
                    }
                    
                    _w.onCustomEvent('resizeStart', { 'width': _w.settings.width, 'height': _w.settings.height, 'wnd': _w } );
                };
                
                _w._onResizeRun = function() {
                
                    var nW = parseInt(_w._resize_handle.style.left) + 10;
                    var nH = parseInt(_w._resize_handle.style.top)  + 10;
                

                    _w.set__width( nW );
                    _w.set__height( nH  );
                    
                    _w.setCaption( nW + " x " + nH );
                    
                    _w.onCustomEvent('resizeRun', { 'width': _w.settings.width, 'height': _w.settings.height, 'wnd': _w });
                    
                    _w.__repaint();
                };
                
                _w._onResizeStop = function() {
                
                    _w.setCaption( oldCaption );
                
                    _w.set__width( parseInt(_w._resize_handle.style.left) + 10 );
                    _w.set__height( parseInt(_w._resize_handle.style.top)  + 10 );
                    
                    _w.onCustomEvent('resizeStop', { 'width': _w.settings.width, 'height': _w.settings.height, 'wnd': _w } );
                    
                    _w.__repaint();
                };
                
                _w._resize_handle.setAttribute('dragable', '1');
                
                _w.resizeListener = 
                    new dragObject(_w._resize_handle, null, new Position(50, (_w._titlebarHolder ? _w._titlebarHolder.offsetHeight - 10 : 14)), new Position(5000, 5000), _w._onResizeStart, _w._onResizeRun, _w._onResizeStop);
            }
            _w.settings.resizeable = true;
        } else {
            if (_w.resizeListener && (_w.resizeListener !== null)) {
                _w.resizeListener.StopListening();
                _w.resizeListener = null;
                
                _w._onResizeStart = null;
                _w._onResizeRun = null;
                _w._onResizeStop = null;
                
                _w.inner.removeChild(_w._resize_handle);
                _w._resize_handle = null;
            }
            _w.settings.resizeable = false;
        }
    };
    
    _w.getMoveable = function() {
        return _w.settings.moveable;
    };
    
    _w.setMoveable = function(bool) {
        if (bool) {
        
            if (!_w._dragListener) {
                
                _w._moveStart = function() { 
                    _w.onCustomEvent('dragStart', { 'x': _w.x, 'y': _w.y, 'wnd': _w });
                };
                
                _w._moveRun   = function() { 
                    _w.settings.x = parseInt(_w.style.left);
                    _w.settings.y = parseInt(_w.style.top);
                    _w.onCustomEvent('dragRun', { 'x': _w.settings.x, 'y': _w.settings.y, 'wnd': _w });
                };
                
                _w._moveStop  = function() { 
                    _w.settings.x = parseInt(_w.style.left); 
                    _w.settings.y = parseInt(_w.style.top); 
                    _w.onCustomEvent('dragStop', {'x': _w.settings.x, 'y': _w.settings.y, 'wnd': _w });
                };
                
                _w._dragListener = 
                    new dragObject(_w, null, new Position(-5000, -5000), new Position(5000, 5000), _w._moveStart, _w._moveRun, _w._moveStop, null, true);
            }
            _w.settings.moveable = true;
            
        } else {
        
            if ((_w._dragListener) && (_w._dragListener !== null)) {
                _w._dragListener.StopListening();
                _w._dragListener = false;
                
                //clear the move callbacks
                _w._moveStart = null;
                _w._moveRun   = null;
                _w._moveStop  = null;
            }
            
            _w.settings.moveable = false;
        }
    };
    
    _w.getVisible = function() { 
        return _w.settings.visible; 
    };
    
    _w.setVisible = function(bool) {
        _w.settings.visible = bool;
        if (bool) removeStyle(_w, 'DOM2InvisibleWindow'); else
                  addStyle(_w, 'DOM2InvisibleWindow');
    };
    
    _w.getChildOf = function() { 
        return _w.settings.childOf; 
    };
    
    _w.setChildOf = function(htmlObjectElement) {
        
        if (htmlObjectElement !== null) {
            if (_w.settings.childOf !== null) {
                try {
                    // If I allready had a parent, then I will deattach first
                    for (var i=0; i<_w.settings.childOf.windows.length; i++) {
                        if (_w.settings.childOf.windows[i] == _w) {
                            _w.settings.childOf.windows.splice(i, 1);
                            break;
                        }
                    }
                    _w.settings.childOf.removeChild(_w);
                } catch(ex) {}
            }
            
            _w.settings.childOf = htmlObjectElement;
            
            if (typeof _w.__MODAL_FRAME != 'undefined') {
                var modalOwner = getOwnerWindow(htmlObjectElement);
                
                if (modalOwner == null) 
                    modalOwner = htmlObjectElement;
                
                modalOwner.appendChild(
                    _w.__MODAL_FRAME
                );
            }
            
            _w.setTaskbarTab();
            
            htmlObjectElement.appendChild(_w);
            
            if (typeof(htmlObjectElement.windows) == 'undefined')
                //if the holder element don't have a ".windows" stack, we create it
                htmlObjectElement.windows = [];
            
            htmlObjectElement.windows.push(_w);
            
        } else {
        
            if ( _w.parentNode ) {
                try {
                    getOwnerWindow( _w.parentNode ).focus();
                } catch (e) {};
            }
        
            if (typeof _w.__MODAL_FRAME != 'undefined') {
                if (_w.__MODAL_FRAME.parentNode) {
                        _w.__MODAL_FRAME.parentNode.removeChild(
                            _w.__MODAL_FRAME
                        );
                }
            }
        
            if (_w.taskbar_tab && (_w.taskbar_tab !== null)) {
                _w.taskbar_tab.close();
                _w.taskbar_tab = null;
            }
            
            if (_w.settings.childOf !== null) {
                //remove myself from my parent stack
                for (var i=0; i < _w.settings.childOf.windows.length; i++) {
                    if (_w.settings.childOf.windows[i] == _w) {
                        _w.settings.childOf.windows.splice(i, 1);
                        break;
                    }
                }
                _w.settings.childOf.removeChild(_w);
                _w.settings.childOf = null;
                
            }
        }
    };
    
    _w.getCaption = function() { 
        return _w.settings.caption; 
    };
    
    _w.setCaption = function(str) {
        if (typeof _w._titlebarHolder._caption == 'undefined') {
            _w._titlebarHolder._caption = $('span', 'DOM2WindowCaption');
            _w._titlebarHolder.appendChild(_w._titlebarHolder._caption);
            _w._titlebarHolder._caption.setAttribute('dragable', '1');
        }
        
        _w._titlebarHolder._caption.innerHTML = '';
        _w._titlebarHolder._caption.appendChild(document.createTextNode(str));
        _w.settings.caption = str;
        
        //also update the caption on the taskbar, if any
        if (_w.taskbar_tab && (_w.taskbar_tab !== null)) _w.taskbar_tab.caption = str;
    };
    
    _w.getAppIcon = function() { 
        return _w.settings.appIcon; 
    };
    
    _w.setAppIcon = function(str) {
        if (!str) { 
            _w.modalIconHolder.style.backgroundImage = 'none';
            str = ''; 
        } else {
            _w.modalIconHolder.style.backgroundImage = 'url("'+str+'")';
            _w.settings.appIcon = str;
        }
        
        //TODO? Taskbar porting related stuff
        if (_w.taskbar_tab && (_w.taskbar_tab !== null)) 
            _w.taskbar_tab.icon = str;
    };
    
    _w.getScrollable = function() { 
        return _w.settings.scrollable; 
    };
    
    _w.setScrollable = function(bool){
        if (bool) addStyle(_w, 'DOM2WindowScrollable');
        else removeStyle(_w, 'DOM2WindowScrollable');
        _w.settings.scrollable = bool ? true : false;
    };
    
    _w.getActive = function() { 
        return _w.settings.active; 
    };
    
    _w.setActive = function(bool) {

        if (_w.designMode)
            return;

        if (bool && !_w.designMode) 
            _w.focus();
        
        if (!bool && _w.settings.active) {
            _w.onCustomEvent('blur', { 'wnd': _w });
            removeStyle(_w, 'DOM2WindowFocused');
        } else 
        
        if (bool && !_w.settings.active) {
            
            addStyle(_w, 'DOM2WindowFocused');
            
            _w.__zIndexSort = ++_winZIndexOrder;
            
            if (_w.getChildOf() !== null) {
                
                for (var i=0; i<_w.getChildOf().windows.length; i++) {
                    if (_w.getChildOf().windows[i] != _w) {
                        _w.getChildOf().windows[i].active = false;
                    }
                }
                
                //now try to move at the end this window in the parent ...
                _w.getChildOf().windows.sort(_winZIndexSorter);
                
                for (var i=0; i<_w.getChildOf().windows.length; i++) {
                    _w.getChildOf().windows[i].style.zIndex = 100 + i;
                }
            }
            _w.onCustomEvent('focus', {'wnd': _w });
            
            //apply zIndexes ...
        }
        _w.settings.active = bool;
        if (_w.taskbar_tab && (_w.taskbar_tab != null)) 
            //TODO ???
            _w.taskbar_tab.active = bool;
    };
    
    _w.setTaskbarTab = function() {
        //if the window is allready a member of some taskbar, we unlink it
        if (_w.taskbar_tab && (_w.taskbar_tab != null)) {
            _w.taskbar_tab.close(); 
            _w.taskbar_tab = null;
        }
        
        //if the parent of the window allready has a taskbar defined,
        if (_w.getChildOf().taskbar) {
            _w.taskbar_tab = _w.getChildOf().taskbar.createAppEntry({
                'caption': _w.getCaption(),
                'icon':    _w.getAppIcon(),
                'active':  _w.getActive()
            });
            
            //TODO: Implement this as a DOM Level 2 event
            _w.taskbar_tab.onclick = function() { 
                if (_w.getMinimized()) {
                    _w.setMinimized(false);
                    _w.setActive(true);
                } else {
                    if (_w.getMinimized() == false) {
                        if (_w.getActive()) { 
                            _w.setMinimized(true); 
                        } else {
                            if (!_w.getActive()) 
                                _w.active = true;
                        }
                    } else {
//                         console.log('focusing...');
                        _w.setActive(true);
                    }
                }
            };
            
            _w.taskbar_tab.active = _w.active;
            _w.taskbar_tab.icon = _w.settings.appIcon;
            
            MakeDropable( _w.taskbar_tab );
            _w.taskbar_tab.addCustomEventListener('dragenter', function() {
                if (_w.minimized)
                    _w.minimized = false;
                _w.active = true;
            });
            
            _w.taskbar_tab.addContextMenu([
                {
                    "caption": "Always OnTop",
                    "handler": function( value ) {
                        _w.alwaysOnTop = !!value;
                    },
                    "input": "checkbox",
                    "checked": function() {
                        return _w.alwaysOnTop;
                    }
                },
                null,
                {
                    "caption": "Maximized",
                    "disabled": function() {
                        return !_w.maximizeable;
                    },
                    "handler": function( bool ) {
                        _w.maximized = !!bool;
                    },
                    "input": "checkbox",
                    "checked": function() {
                        return _w.maximized;
                    }
                },
                {
                    "caption": "Minimized",
                    "input": "checkbox",
                    "checked": function() {
                        return _w.minimized;
                    },
                    "disabled": function() {
                        return !_w.minimizeable;
                    },
                    "handler": function( bool ) {
                        _w.minimized = !!bool;
                    }
                },
                {
                    "caption": "Close",
                    "disabled": function() {
                        return !_w.closeable;
                    },
                    "handler": function() {
                        _w.close();
                    }
                }
            ]);
        };
    };
    
    _w.getAlwaysOnTop = function() { 
        return _w.settings.alwaysOnTop; 
    };
    
    _w.setAlwaysOnTop = function(bool) { 
        _w.settings.alwaysOnTop = bool;
        if (bool) addStyle(_w, 'DOM2WindowAlwaysOnTop');
        else removeStyle(_w, 'DOM2WindowAlwaysOnTop');
    };
    
    //END WINDOW METHODS
    
    //BEGIN: GETTERS AND SETTERS:
    
/*
    try {
    
    _w.__defineGetter__('minWidth', _w.getMinWidth);
    _w.__defineSetter__('minWidth', _w.setMinWidth);
    
    _w.__defineGetter__('minHeight', _w.getMinHeight);
    _w.__defineSetter__('minHeight', _w.setMinHeight);
    
    _w.__defineGetter__('toolbarsSettings', _w.getToolbarsSettings);
    _w.__defineSetter__('toolbarsSettings', _w.setToolbarsSettings);
    
    _w.__defineGetter__('titlebar', _w.getTitlebar);
    _w.__defineSetter__('titlebar', _w.setTitlebar);
    
    _w.__defineGetter__('menu', _w.getMenu);
    _w.__defineSetter__('menu', _w.setMenu)
    
    _w.__defineGetter__('menuVisible', _w.getMenuVisible);
    _w.__defineSetter__('menuVisible', _w.setMenuVisible);
    
    _w.__defineGetter__('toolbars', _w.getToolbars);
    _w.__defineSetter__('toolbars', _w.setToolbars);
    
    _w.__defineGetter__('toolbarsVisible', _w.getToolbarsVisible);
    _w.__defineSetter__('toolbarsVisible', _w.setToolbarsVisible);
    
    _w.__defineGetter__('statusBar', _w.getStatusBar);
    _w.__defineSetter__('statusBar', _w.setStatusBar);
    
    _w.__defineGetter__('statusBarVisible', _w.setStatusBarVisible);
    _w.__defineSetter__('statusBarVisible', _w.setStatusBarVisible);
    
    _w.__defineGetter__('width',        _w.getWidth);
    _w.__defineSetter__('width',         _w.setWidth);
    _w.__defineSetter__('__width',       _w.set__width);
    
    _w.__defineGetter__('height',       _w.getHeight);
    _w.__defineSetter__('height',        _w.setHeight);
    _w.__defineSetter__('__height',      _w.set__height);
    
    _w.__defineGetter__('x',             _w.getX);
    _w.__defineSetter__('x',             _w.setX);
    
    _w.__defineGetter__('y',             _w.getY);
    _w.__defineSetter__('y',             _w.setY);
    
    _w.__defineGetter__('minimizeable',  _w.getMinimizeable);
    _w.__defineSetter__('minimizeable',  _w.setMinimizeable);
    
    _w.__defineGetter__('minimized',     _w.getMinimized);
    _w.__defineSetter__('minimized',     _w.setMinimized);
    
    _w.__defineGetter__('closeable',     _w.getCloseable);
    _w.__defineSetter__('closeable',     _w.setCloseable);
    
    _w.__defineGetter__('resizeable',    _w.getResizeable);
    _w.__defineSetter__('resizeable',    _w.setResizeable);
    
    _w.__defineGetter__('moveable',      _w.getMoveable);
    _w.__defineSetter__('moveable',      _w.setMoveable);
    
    _w.__defineGetter__('visible',       _w.getVisible);
    _w.__defineSetter__('visible',       _w.setVisible);
    
    _w.__defineGetter__('childOf',       _w.getChildOf);
    _w.__defineSetter__('childOf',       _w.setChildOf);
    
    _w.__defineGetter__('caption',       _w.getCaption);
    _w.__defineSetter__('caption',       _w.setCaption);
    
    _w.__defineGetter__('appIcon',       _w.getAppIcon);
    _w.__defineSetter__('appIcon',       _w.setAppIcon);
    
    _w.__defineGetter__('scrollable',    _w.getScrollable);
    _w.__defineSetter__('scrollable',    _w.setScrollable);
    
    _w.__defineGetter__('active',        _w.getActive);
    _w.__defineSetter__('active',        _w.setActive);
    
    _w.__defineGetter__('alwaysOnTop',   _w.getAlwaysOnTop);
    _w.__defineSetter__('alwaysOnTop',   _w.setAlwaysOnTop);
    
    _w.__defineGetter__('maximized',     _w.getMaximized);
    _w.__defineSetter__('maximized',     _w.setMaximized);
    
    _w.__defineSetter__('maximizeable',  _w.getMaximizeable);
    _w.__defineSetter__('maximizeable',  _w.setMaximizeable);
    
    _w.__defineGetter__('modal',         _w.getModal);
    _w.__defineSetter__('modal',         _w.setModal);
    
    } catch(ex) {
        if (Object.defineProperty) {
*/        
            //New in v.2.0
            
            Object.defineProperty(_w, 'minWidth',         {'get': _w.getMinWidth,         'set': _w.setMinWidth});
            Object.defineProperty(_w, 'minHeight',        {'get': _w.getMinHeight,        'set': _w.setMinHeight});
            
            Object.defineProperty(_w, 'titlebar',         {'get': _w.getTitlebar,         'set': _w.setTitlebar});
            Object.defineProperty(_w, 'menu',             {'get': _w.getMenu,             'set': _w.setMenu});
            Object.defineProperty(_w, 'menuVisible',      {'get': _w.getMenuVisible,      'set': _w.setMenuVisible});
            Object.defineProperty(_w, 'toolbars',         {'get': _w.getToolbars,         'set': _w.setToolbars});
            Object.defineProperty(_w, 'toolbarsVisible',  {'get': _w.getToolbarsVisible,  'set': _w.setToolbarsVisible});
            Object.defineProperty(_w, 'toolbarsSettings', {'get': _w.getToolbarsSettings, 'set': _w.setToolbarsSettings});
            
            Object.defineProperty(_w, 'statusBar',        {'get': _w.getStatusBar,        'set': _w.setStatusBar});
            Object.defineProperty(_w, 'statusBarVisible', {'get': _w.setStatusBarVisible, 'set': _w.setStatusBarVisible});
            
            
            Object.defineProperty(_w, 'width',        { 'get': _w.getWidth ,         'set': _w.setWidth });
            Object.defineProperty(_w, '__width',      {                              'set': _w.set__width });
            Object.defineProperty(_w, 'height',       { 'get': _w.getHeight ,        'set': _w.setHeight });
            Object.defineProperty(_w, '__height',     {                              'set': _w.set__height });
            Object.defineProperty(_w, 'x',            { 'get': _w.getX ,             'set': _w.setX });
            Object.defineProperty(_w, 'y',            { 'get': _w.getY ,             'set': _w.setY });
            Object.defineProperty(_w, 'minimizeable', { 'get': _w.getMinimizeable ,  'set': _w.setMinimizeable });
            Object.defineProperty(_w, 'minimized',    { 'get': _w.getMinimized ,     'set': _w.setMinimized });
            Object.defineProperty(_w, 'closeable',    { 'get': _w.getCloseable ,     'set': _w.setCloseable });
            Object.defineProperty(_w, 'resizeable',   { 'get': _w.getResizeable ,    'set': _w.setResizeable });
            Object.defineProperty(_w, 'moveable',     { 'get': _w.getMoveable ,      'set': _w.setMoveable });
            Object.defineProperty(_w, 'visible',      { 'get': _w.getVisible ,       'set': _w.setVisible });
            Object.defineProperty(_w, 'childOf',      { 'get': _w.getChildOf ,       'set': _w.setChildOf });
            Object.defineProperty(_w, 'caption',      { 'get': _w.getCaption ,       'set': _w.setCaption });
            Object.defineProperty(_w, 'appIcon',      { 'get': _w.getAppIcon ,       'set': _w.setAppIcon });
            Object.defineProperty(_w, 'scrollable',   { 'get': _w.getScrollable ,    'set': _w.setScrollable });
            Object.defineProperty(_w, 'active',       { 'get': _w.getActive ,        'set': _w.setActive });
            Object.defineProperty(_w, 'alwaysOnTop',  { 'get': _w.getAlwaysOnTop ,   'set': _w.setAlwaysOnTop });
            Object.defineProperty(_w, 'maximized',    { 'get': _w.getMaximized ,     'set': _w.setMaximized });
            Object.defineProperty(_w, 'maximizeable', { 'get': _w.getMaximizeable ,  'set': _w.setMaximizeable });
            Object.defineProperty(_w, 'modal',        { 'get': _w.getModal,          'set': _w.setModal});
/*        
        }
    }
*/
    
    _w.center = function() {
        if ( !_w.parentNode )
            return;
        
        var parHeight = _w.parentNode.offsetHeight - ( _w.parentNode.taskbar ? ( _w.parentNode.taskbar.offsetHeight || 0 ) : 0 );
        var parWidth  = _w.parentNode.offsetWidth;
        
        var winWidth  = _w.offsetWidth;
        var winHeight = _w.offsetHeight;
        
        _w.x = ~~(( parWidth / 2 ) - ( winWidth / 2 ));
        _w.y = ~~(( parHeight/ 2 ) - ( winHeight/ 2 ));
    }
    
    //END: GETTERS AND SETTERS:
    
    _w.__repaint = function() {
        //console.log('__repaint: '+(_w.body.offsetWidth - 4)+','+(_w.body.offsetHeight - 4));
        
        _w.___onLayoutChange();
        
        var fc = _w.body.firstChild;
        
        var bWidth = _w.body.offsetWidth;
        var bHeight= _w.body.offsetHeight;
        
        //console.log(bHeight);
        
        _w.onCustomEvent( 'paint', _w );
        
        while (fc) {
            try{
                fc.paint();
            } catch(e){ 
                console.log('exception: '+e); 
            }
            fc = fc.nextSibling;
        }
        
        //console.log(_w.body.offsetHeight);
    };
    
    _w.insert = function() {
        if (arguments.length == 0) return null;
        else {
            var lastArg = null;
            for (var i=0; i<arguments.length; i++) {
                lastArg = arguments[i];
                _w.body.appendChild(lastArg);
                if (lastArg.DOManchors)
                    lastArg.paint();
                
            }
            return lastArg;
        }
    };
    
    //BEGIN: CONSTRUCT SETTINGS
    
    if (_w.settings.childOf !== null) _w.setChildOf( _w.settings.childOf ); 
    else _w.setChildOf( document.body );
    
    _w.setX( _w.settings.x );
    _w.setY( _w.settings.y );
    _w.set__width( _w.settings.width );
    _w.set__height( _w.settings.height );
    
    _w.setVisible( _w.settings.visible );
    _w.setCaption( _w.settings.caption );
    _w.setMoveable( _w.settings.moveable );
    
    if (_w.settings.minimizeable) _w.setMinimizeable( true );
    if (_w.settings.maximizeable) _w.setMaximizeable( true );
    if (_w.settings.closeable) _w.setCloseable( true );
    if (_w.settings.resizeable) _w.setResizeable( true );
    if (_w.settings.maximized) _w.setMaximized( true );
    if (_w.settings.scrollable) _w.setScrollable( true );
    if (!_w.settings.titlebar) _w.setTitlebar(false);
    
    var tmp;
    
    if (_w.settings.menu) {
        tmp = _w.settings.menu;
        _w.settings.menu = false;
        _w.setMenu(tmp);
    }
    
    if (_w.settings.toolbars) {
        tmp = _w.settings.toolbars;
        _w.settings.toolbars = false;
        _w.setToolbars(tmp);
    }
    
    if (_w.settings.statusBar) {
        tmp = _w.settings.statusBar;
        _w.settings.statusBar = false;
        _w.setStatusBar(tmp);
    }
    
    _w.setAppIcon( _w.settings.appIcon );
    _w.setMinimized( _w.settings.minimized );
    _w.setActive( _w.settings.active );
    
    _w.setMinWidth(_w.settings.minWidth);
    _w.setMinHeight(_w.settings.minHeight);
    
    _w.tabIndex = 0;
    
    _w.setAlwaysOnTop( _w.settings.alwaysOnTop );
    
    
    try {
        _w._close_button.addEventListener('mouseup', _w.__closeButtonClick, false);
    } catch(ex) {
        _w._close_button.attachEvent('onmouseup', _w.__closeButtonClick);
    }
    
    try {
        _w._maximize_button.addEventListener('click', function(e) {
            cancelEvent(e);
            _w.setMaximized(!_w.getMaximized());
        }, false);
    } catch(ex) {
        _w._maximize_button.attachEvent('click', function() {
            cancelEvent(window.event);
            _w.setMaximized(!_w.getMaximized());
        });
    }
    
    _w._titlebarHolder.ondblclick = function(e) {
        if (!_w.getResizeable()) return;
        cancelEvent(e);
        _w.setMaximized(!_w.getMaximized());
    };
    
    _w._minimize_button.onclick = function() {
        _w.setMinimized(true);
    };
    
    _w.onFocusHandler = function() {
        if (!_w.getActive()) { 
            _w.setActive( true );
            _w.onCustomEvent('focus', {'wnd': _w });
        }
    };
    
    _w._titlebarHolder.onmousedown = _w.onFocusHandler;
    
    _w.onmousedown = _w.onFocusHandler;
    
    //why?
    _w.setActive( false );
    _w.setActive( true );
    
    disableSelection(_w._titlebarHolder);
    
    Keyboard.setFocusCycling(_w);
    
    if (_w.settings.modal) {
        _w.settings.modal = false;
        _w.modal = true;
    }
    
    /* Application state : */
    
    (function() {
        
        var appState = '';
        
        Object.defineProperty(_w, 'applicationState', {
            "get": function() {
                return appState;
            },
            "set": function(str) {
                if (appState == str)
                    return;
                if (appState != '')
                    removeStyle( _w.body, 'DOMWindow_AppState_' + appState );
                appState = str;
                if (appState != '')
                    addStyle( _w.body, 'DOMWindow_AppState_' + appState );
            }
        });
        
    })();
    
    /* End of application state */
    
    Keyboard.bindKeyboardHandler( _w, 'ctrl shift up', function() { if (document.activeElement == _w) _w.setY(_w.getY() - 10); } );
    Keyboard.bindKeyboardHandler( _w, 'ctrl shift down', function() { if (document.activeElement == _w) _w.setY(_w.getY() + 10); } );
    Keyboard.bindKeyboardHandler( _w, 'ctrl shift left', function() { if (document.activeElement == _w) _w.setX(_w.getX() - 10); });
    Keyboard.bindKeyboardHandler( _w, 'ctrl shift right', function() { if (document.activeElement == _w) _w.setX(_w.getX() + 10); });
    
    _w.dialog = function( message, config ) {
        config = config || {};
        config.childOf = _w;
        return new DialogBox( message, config );
    };
    
    _w.addCustomEventListener('redraw', function() {
        _w.onCustomEvent('resizeRun', {
            "width": _w.width,
            "height": _w.height,
            "wnd": _w
        });
    });
    
    Object.defineProperty(_w, "nextWindow", {
        "get": function() {
            if ( !_w.childOf || !_w.childOf.windows )
                return null;
            
            var childOf = _w.childOf;
            var len = childOf.windows.length;
            
            
            for (var i=0; i<len; i++) {
                if (childOf.windows[i] == _w &&
                    i < len - 1
                ) return childOf.windows[ i + 1 ];
            }
            
            switch (true) {
                case (!!(getOwnerWindow(childOf.parentNode) && getOwnerWindow( childOf ).childOf)):
                    return getOwnerWindow( childOf ).childOf.nextWindow;
                    break;
                default:
                    return childOf.windows[0];
            }
        } 
    });
    
    Object.defineProperty(_w, "previousWindow", {
        "get": function() {
            if ( !_w.childOf || !_w.childOf.windows )
                return null;
            
            var childOf = _w.childOf;
            var len = childOf.windows.length;
            
            for ( var i=0; i<len; i++) {
                if (childOf.windows[i] == _w &&
                    i > 0
                ) return childOf.windows[ i - 1 ];
            }
            
            switch (true) {
                case (!!(getOwnerWindow(childOf.parentNode) && getOwnerWindow( childOf ).childOf )):
                    return getOwnerWindow( childOf ).childOf.previousWindow;
                    break;
                default:
                    return childOf.windows[ len - 1 ];
                    break;
            }
        }
    });
    
    /* New in v3.0 */
    
    _w.handlers = {};
    
    _w.appHandler = function (cmd) {
        if (typeof _w.handlers[ cmd ] != 'undefined' )
            return _w.handlers[ cmd ].apply( _w, Array.prototype.slice.call( arguments, 1 ));
        else {
            DialogBox("Handler '" + cmd + "' is not implemented!", {
                "type": "error",
                "childOf": _w,
                "caption": "OneDB"
            });
        }
    }
    
    Object.defineProperty( _w, 'addCss', {
        "get": function() { 
            return function( str ) {
                if ( str && str.length ) {
                    var s = $('style');
                    s.textContent = str;
                    _w.appendChild( s );
                }
                return _w;
            }
        }
    } );
    
    _w.ready = function() {
        try {
            var items = _w.body.querySelectorAll('div,input,textarea,select');
            for ( var i=0,len=items.length; i<len; i++ ) {
                if ( items[i].customEventListeners )
                    items[i].onCustomEvent('ready', {
                        "app": _w
                    });
            }
        } catch (e) {
            
        }
        
    };
    
    return _w;
}

Object.defineProperty(window, "activeWindow", {
    "get": function() {
        var sel = document.querySelectorAll("div.DOM2Window.DOM2WindowFocused");
        
        if (sel.length)
            return sel[ 0 ];
        
        if (document.body.windows && document.body.windows.length)
            return document.body.windows[0];
        
        return null;
    }
});

function activateWindow( _w ) {
    _w.minimized = false;
    _w.active = true;
    
    var p = _w.childOf;
    
    while (p) {
        activateWindow( p );
        p = p.childOf;
    }
}

function DOM2Window(settings) {
  return new Dialog(settings);
}

function getOwnerWindow(DOMElement) {
    var p = DOMElement;
    while (p) {
        if (hasStyle(p, 'DOM2Window'))
            return p;
        p = p.parentNode;
    }
    return null;
}

//Add handler to window.resize, in order to re-resize the maximizedWindows ...
addOnload(function() {
    
    //Made on 18 May 2011
    
    var rearrange = function() {
        
        for (var i=0; i<document.body.windows.length; i++) {
            if (document.body.windows[i].maximized) {
                document.body.windows[i].width  = getMaxX();
                document.body.windows[i].height = getMaxY() -
                    (typeof(document.body.taskbar) != 'undefined' ? document.body.taskbar.offsetHeight : 0) 
                document.body.windows[i].paint();
            }
        }
        
    }
    
    try {
        if (window.addEventListener) 
            window.addEventListener('resize', rearrange, true);
        else 
            window.attachEvent('onresize', rearrange);
    } catch(ex) {
        try {
            console.error("Could not attach window.resize handler: "+ex);
        } catch(e) {
            console.log("Could not attach window,resize handler: "+ex);
        }
    }
    
});

window.getWindowsList = function(node, returnIcons) {
    node = typeof node != 'undefined' ? node : document.body;
    
    returnIcons = typeof returnIcons == 'undefined' ? false : !!returnIcons;
    
    var out = [];
    var wnd;
    
    if (typeof node.windows != 'undefined' && node.windows && node.windows.length) {
        
        for (var i=0; i<node.windows.length; i++) {
            wnd = {
                'uniqueID'     : node.windows[i].getUniqueID(),
                'caption'      : node.windows[i].getCaption(),
                'width'        : node.windows[i].getWidth(),
                'height'       : node.windows[i].getHeight(),
                'x'            : node.windows[i].getX(),
                'y'            : node.windows[i].getY(),
                'active'       : node.windows[i].getActive(),
                'minimized'    : node.windows[i].getMinimized(),
                'minimizeable' : node.windows[i].getMinimizeable(),
                'maximized'    : node.windows[i].getMaximized(),
                'maximizeable' : node.windows[i].getMaximizeable(),
                'modal'        : node.windows[i].getModal(),
                'resizeable'   : node.windows[i].getResizeable(),
                'closeable'    : node.windows[i].getCloseable()
            };
            
            if ( returnIcons )
                wnd.appIcon = node.windows[i].getAppIcon();
            
            if (typeof node.windows[i].windows != 'undefined') {
                wnd.windows = getWindowsList(
                    node.windows[i],
                    returnIcons
                );
            }
            
            out.push(wnd);
        }
    }
    
    return out;
};

window.addEventListener('keydown', function(e) {
    if (e.altKey) {
        var code = e.keyCode || e.charCode;
        
        try {
        
            if (code == 81) {
                // switch to next window
                activateWindow( activeWindow.nextWindow );
            }

            if (code == 87) {
                // switch to next window
                activateWindow( activeWindow.previousWindow );
            }
        
        } catch (e) {}
    }
}, true);