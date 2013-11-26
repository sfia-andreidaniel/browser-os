function VerticalPanel(loadItems) {
    var holder = $('div', 'DomPanelHolder');
    
    holder.tbl = holder.appendChild($('table', 'DomPanelTable'));
    
    holder.add = function(DOMHtmlElement, atIndex) {
        var tr = holder.tbl.insertRow(typeof atIndex == 'undefined' ? holder.tbl.rows.length : atIndex);
        tr = tr.insertCell(0);
        tr.appendChild(DOMHtmlElement);
        return DOMHtmlElement;
    };
    
    holder.remove = function(atIndex) {
        if (typeof atIndex != 'undefined') holder.tbl.deleteRow(atIndex);
        else holder.tbl.deleteRow(holder.tbl.rows.length - 1);
    };
    
    holder.getItems = function() {
        var out = [];
        for (var i=0; i<holder.tbl.rows.length; i++) {
            if (holder.tbl.rows[i].cells[0].firstChild)
                out.push(holder.tbl.rows[i].cells[0].firstChild);
        }
        return out;
    };
    
    holder.setItems = function(arr) {
        if (holder.tbl.rows.length) {
            while (holder.tbl.rows.length) holder.tbl.deleteRow(0);
        }
        for (var i=0; i<arr.length; i++) holder.add(arr[i]);
    };
    
    if (typeof loadItems != 'undefined') holder.setItems(loadItems);
    
    try {
        holder.__defineGetter__('items', holder.getItems);
        holder.__defineSetter__('items', holder.setItems);
    } catch(ex) {
        if (Object.defineProperty) {
            Object.defineProperty(holder, 'items', { 'get': holder.getItems, 'set': holder.setItems });
        }
    }
    
    return holder;
}

function HorizontalPanel(loadItems) {
    var holder = $('div', 'DomPanelHolder');
    
    holder.tbl = holder.appendChild($('table', 'DomPanelTable'));
    holder.tbl.insertRow(0);
    
    holder.add = function(DOMHtmlElement, atIndex) {
        var td = holder.tbl.rows[0].insertCell(typeof atIndex == 'undefined' ? holder.tbl.rows[0].cells.length : atIndex);
        td.appendChild(DOMHtmlElement);
        return DOMHtmlElement;
    };
    
    holder.remove = function(atIndex) {
        if (typeof atIndex != 'undefined') holder.tbl.rows[0].deleteCell(atIndex);
        else holder.tbl.rows[0].deleteCell(holder.tbl.rows[0].cells.length - 1);
    };
    
    holder.getItems = function() {
        var out = [];
        for (var i=0; i<holder.tbl.rows[0].cells.length; i++) {
            if (holder.tbl.rows[0].cells[i].firstChild)
                out.push(holder.tbl.rows[0].cells[i].firstChild);
        }
        return out;
    };
    
    holder.setItems = function(arr) {
        if (holder.tbl.rows[0].cells.length) {
            while (holder.tbl.rows[0].cells.length) holder.tbl.rows[0].deleteCell(0);
        }
        for (var i=0; i<arr.length; i++) holder.add(arr[i]);
    };
    
    if (typeof loadItems != 'undefined') holder.setItems(loadItems);
    
    try {
        holder.__defineGetter__('items', holder.getItems);
        holder.__defineSetter__('items', holder.setItems);
    } catch(ex) {
        if (Object.defineProperty) {
            Object.defineProperty(holder, 'items', { 'get': holder.getItems, 'set': holder.setItems });
        }
    }
    
    return holder;
}

/** Toolbar Button

    Is used by the Toolbar object
    
    InitParams:
    ~~~~~~~~~~~~~~~~~~~~~~
    conf = Object {
        'icon': url to icon image file,
        
        'caption': string representing the button text,
        
        'pressed': null | true | false 
            - if null (or ommited), the button is not toggleable, otherwise the button is toggleable, and is
              set on a pressed state conforming to the bool value
        
        'tooltip': string representing the button's tooltip
        
        'disabled': weather the button is disabled or not
        
        'handler': a handler function for that button.
                   if button is toggleable, the handler function will be called with args: 
                        [0]: (bool) toggleState, [1]: typeof (buttonID) ? buttonID : undefined
                   if button is not toggleable, the handler function will be called with args:
                        [0]: typeof (buttonID) ? buttonID : undefined
    }
    
    Getters / Setters:
    ~~~~~~~~~~~~~~~~~~~~
    (str)              (get | set) Icon
    (str)              (get | set) Caption
    (bool)             (get | set) Disabled
    (null | bool)      (get | set) Pressed
    (func)             (get | set) Handler
    (null | anyData)   (get | set) ButtonID

*/

function ToolbarButton(conf, forceHorizontal) {
    var btn = $('div', 'DomToolbarButton');
    
    btn._icon = btn.appendChild($('img'));
    btn._caption = btn.appendChild($('span'));
    
    if (forceHorizontal) {
        var nobr = $('nobr');
        nobr.appendChild(btn._icon);
        nobr.appendChild(btn._caption);
        btn.appendChild(nobr);
    }
    
    btn._disabled = (conf && conf.disabled) ? conf.disabled : false;
    btn._pressed = (conf && (typeof conf.pressed != 'undefined')) ? conf.pressed : null;
    btn._handler = (conf && conf.handler) ? conf.handler : null;
    if (conf.id || conf.buttonID) btn._buttonID = (conf.id || conf.buttonID);
    btn._xicon = '';
    btn._xcaption = '';
    
    btn.getIcon = function() {
        return btn._xicon;
    };
    
    btn._icon.src = 'img/blank.gif';
    
    btn._icon.onerror = function() {
      this.src = 'img/blank.gif';
    };
    
    btn.setIcon = function(str) {
        btn._xicon = str;
        if (str) {
            btn._icon.src = str;
        } else {
            btn._icon.src = '';
        }
    }; 
    
    btn.getCaption = function() {
        return btn._xcaption;
    };
    
    btn.setCaption = function(str) {
        btn._caption.innerHTML = '';
        btn._xcaption = str;
        if (str) {
            btn._caption.appendChild(document.createTextNode(str));
            btn.title = str;
        } else
            btn.title = '';
    };
    
    btn.getDisabled = function() {
        return btn._disabled;
    };
    
    btn.setDisabled = function(bool) {
        btn._disabled = bool;
        (bool ? addStyle : removeStyle)(btn, 'disabled');
    };
    
    btn.getPressed = function() {
        return btn._pressed;
    };
    
    btn.setPressed = function(bool) {
        btn._pressed = bool ? true : false;
        (bool ? addStyle : removeStyle)(btn, 'pressed');
    };
    
    btn.getHandler = function() {
        return btn._handler;
    };
    
    btn.setHandler = function(func) {
        btn._handler = func;
    };
    
    btn.getButtonID = function() {
        return typeof btn._buttonID != 'undefined' ? btn._buttonID : null;
    };
    
    btn.setButtonID = function(something) {
        btn._buttonID = something;
    };
    
    //functionality needed for the ToolbarMultiButton
    btn._clickHandlerHookFunc = null;
    
    btn.clickHandler = function(e) {
        e = e || window.event;
        
        if ((e.which || e.button) > 1) return;
        
        var target = e.target || e.srcElement;
        
        //functionality needed for the ToolbarMultiButton
        if (btn._expanded && btn.setExpanded) btn.setExpanded(false);
        
        //disallow click event in div childs (needed for ToolbarMultiButton)
        if (target.tagName == 'DIV' && target != btn) return;
        
        if (btn._disabled) return;
        
        if (btn._pressed !== null) { 
            btn.setPressed(!btn.getPressed());
            if (btn._handler) {
                if ( btn._handler != '%appHandler%' ) {
                    btn._handler(btn._pressed, typeof btn._buttonID != 'undefined' ? btn._buttonID : null);
                }
            }
        } else {
            if (btn._handler) {
                if ( btn._handler != '%appHandler%' ) {
                    btn._handler( typeof btn._buttonID != 'undefined' ? btn._buttonID : null );
                }
            }
        }
        
        cancelEvent(e);
        
        if (btn._clickHandlerHookFunc) btn._clickHandlerHookFunc();
        
        return false;
    };
    
    try {
        btn.addEventListener('click', btn.clickHandler, false);
    } catch(ex) {
        btn.attachEvent('onclick', btn.clickHandler);
    }
    
    if (conf.icon) btn.setIcon(conf.icon);
    if (conf.caption) btn.setCaption(conf.caption);
    if (typeof conf.pressed != 'undefined') btn.setPressed(conf.pressed);
    if (conf.tooltip) btn.title = conf.tooltip;
    if (conf.disabled) btn.setDisabled(true);
    
    btn.tabIndex = 0;
    
    try {
        //ie7 css :active emu
    
        btn.attachEvent('onmousedown', function() {
          addStyle(btn, 'active');
        });
        
        btn.attachEvent('onmouseup', function() {
          removeStyle(btn, 'active');
        });
        btn.attachEvent('onmouseout', function() {
          removeStyle(btn, 'active');
        });

    } catch(ex) {}
    
    disableSelection(btn);
    
    return btn;
}

/** Toolbar MultiButton

    This button looks exactly like a Button, excepting the fact that is having an
    expandable sign, and it contains more sub-buttons (just like a drop-down).
    
    It's initialization is made from an ArrayOf(settings of Button)
    
    GETTERS / SETTERS:
    ~~~~~~~~~~~~~~~~~~~~
    ALL the getters and setters from ToolbarButton
    +
    (get      ) SelectedButton
    (get | set) SelectedIndex
    (get | set) Expanded
    
*/

function ToolbarMultiButton(subButtons) {
    var activeButton = null;
    var buttonIndex = 0;
    
    //loop through array subButtons, and find the first button with property 'selected'.
    //if not found, choose the first button in the array
    
    for (var i=0; i<subButtons.length; i++) {
        if (typeof subButtons[i].selected != 'undefined' && subButtons[i].selected) {
            activeButton = subButtons[i];
            buttonIndex = i;
            break; //we found it
        }
    }
    
    if (activeButton === null) activeButton = subButtons[0];
    
    var btn = new ToolbarButton(activeButton);
    
    //insert the expandable sign button
    
    btn._expandBtn = btn.appendChild($('div', 'DomToolbarButtonExpandBtn'));
    btn._buttonIndex = buttonIndex;
    
    addStyle(btn, 'DomToolbarMultiButton');
    
    btn._selectedButton = activeButton;
    btn._buttonsList    = subButtons;
    btn._expanded       = false;
    btn._expandMenu     = false;
    
    btn.getSelectedButton = function() {
        return btn._selectedButton;
    };
    
    btn.getSelectedIndex = function() {
        return btn._buttonIndex;
    };
    
    btn.setSelectedIndex = function(arraySelectedIndex) {
        
        var oldWidth = btn.offsetWidth;
        var oldHeight = btn.offsetHeight;
        
        btn._selectedButton = btn._buttonsList[arraySelectedIndex];
        btn._buttonIndex = arraySelectedIndex;
        
        btn._handler = (btn._selectedButton.handler || null);
        btn.setCaption(btn._selectedButton.caption || '');
        btn.setButtonID((btn._selectedButton.id || btn._selectedButton.buttonID) || null);
        btn.setIcon(btn._selectedButton.icon || '');
        
        btn.setExpanded(false);
        
        try {
            if (oldWidth != btn.offsetWidth) {
                var scan = btn.parentNode;
                while (scan) {
                    scan = scan.parentNode;
                    if (scan) {
                        if (hasStyle(scan, 'DomAppToolbarZone')) {
                            scan.onCustomEvent('resize', scan);
                            break;
                        }
                    } else break;
                }
            }
        } catch(ex) {}
        
    };
    
    btn.getExpanded = function() {
        return btn._expanded;
    };
    
    btn.setExpanded = function(bool) {
        btn._expanded = bool ? true : false;
        if (bool) {
            addStyle(btn, 'expanded');
            
            //create the ExpandMenu Panel
            
            btn._expandMenu = new VerticalPanel();
            addStyle(btn._expandMenu, 'DomToolbarMultiButtonMenu');
            
            //insert into panel the buttons of the menu
            
            for (var i=0; i<btn._buttonsList.length; i++) {
                if (i != btn._buttonIndex) {
                    var menuItem = 
                        btn._expandMenu.add(
                            new ToolbarButton( btn._buttonsList[i], true )
                        );
                        menuItem._buttonIndex = i;
                        menuItem._clickHandlerHookFunc = function() {
                        btn.setSelectedIndex(this._buttonIndex);
                     };
                }
            }
            
            var xy = getXY(btn);
            
            xy[0] += document.body.scrollLeft || (window.pageXOffset || (document.body.parentElement ? document.body.parentElement.scrollLeft  : 0) );
            xy[1] += document.body.scrollTop || (window.pageYOffset || (document.body.parentElement ? document.body.parentElement.scrollTop  : 0) );
            
            btn._expandMenu.style.left = xy[0]+'px';
            btn._expandMenu.style.top  = xy[1]+btn._expandBtn.offsetHeight+'px';
            
            document.body.appendChild(btn._expandMenu);
            
            btn._expandMenu.setTop = function() {
                var xy = getXY(btn);
                
                xy[0] += document.body.scrollLeft || (window.pageXOffset || (document.body.parentElement ? document.body.parentElement.scrollLeft  : 0) );
                xy[1] += document.body.scrollTop || (window.pageYOffset || (document.body.parentElement ? document.body.parentElement.scrollTop  : 0) );
                
                btn._expandMenu.style.left = xy[0]+'px';
                btn._expandMenu.style.top  = xy[1]+btn.offsetHeight+'px';
            };
            
            btn._expandMenu.setTop();
            
            //scan deep to levels UP, until we find the DomAppToolbarZone container
            var scan = btn.parentNode;
            while (scan) {
                scan = scan.parentNode;
                if (scan) {
                    if (hasStyle(scan, 'DomAppToolbarZone')) {
                        btn._expandMenu.appToolbarZoneParent = scan;
                        break;
                    }
                } else break;
            }
            
            if (btn._expandMenu.appToolbarZoneParent)
                btn._expandMenu.appToolbarZoneParent.addCustomEventListener('resize', btn._expandMenu.setTop);
            
            btn._expandMenu.bodyMouseDownListener = function(e) {
                e = e || window.event;
                
                var target = e.target || e.srcElement;
                
                while (target) {
                    if (target == btn._expandMenu) {
                        return true;
                    }
                    if (target.parentNode) target = target.parentNode;
                    else {
                        btn.setExpanded(false);
                        return;
                    }
                }
            };
            
            //we add a event listener to the window, in order to close the menu if a 
            //mouse down is detected outside the menu
            try {
                window.addEventListener('mousedown', btn._expandMenu.bodyMouseDownListener, true);
            } catch(ex) {
                document.attachEvent('onmousedown', btn._expandMenu.bodyMouseDownListener);
            }
            
        } else {
            removeStyle(btn, 'expanded');
            try {
                if (btn._expandMenu && btn._expandMenu.appToolbarZoneParent)
                    btn._expandMenu.appToolbarZoneParent.removeCustomEventListener('resize', btn._expandMenu.setTop);
            
                try {
                    window.removeEventListener('mousedown', btn._expandMenu.bodyMouseDownListener, true);
                } catch(exe) {
                    document.detachEvent('onmousedown', btn._expandMenu.bodyMouseDownListener);
                }
                
                document.body.removeChild( btn._expandMenu );
            } catch(ex) {}
            btn._expandMenu = false;
        }
    };
    
    btn._expandBtnClickHandler = function(e) {
        e = e || window.event;
        btn.setExpanded(!btn.getExpanded());
        cancelEvent(e);
        return false;
    };
    
    btn._expandBtn.onclick = btn._expandBtnClickHandler;
    
    return btn;
}


/** Basic Horizontal Toolbar 
    
    IMPORTANT: Should be inserted into a AppToolbarZone object
    
    optional:
    confInit: Array containing the buttons objects (Array of ToolbarButton)
    ~~~~~~~~~~~~~~~~~~
    
    getters / setters:
    ~~~~~~~~~~~~~~~~~~
    (get | set) IconSize ( string('none' | 'normal' | 'large') )
    (get | set) ButtonLabels ( bool )
    (get      ) Items ( returns an ArrayOf( ToolbarButton ) )
    (get | set) IsVisible ( bool )
    (get | set) ToolbarTitle ( string )
    (get | set) TitleVisibility (bool)
    
*/

function Toolbar(confInit, optionalCaption) {
    var holder = $('div', 'DomToolbar icons-normal');
    holder.toolbarTitle = holder.appendChild($('div', 'DomToolbarNoTitle'));
    
    disableSelection(holder.toolbarTitle);
    
    holder.pane = holder.appendChild(new HorizontalPanel());
    holder._iconSize = 'normal';
    holder._textVisible = false;
    
    holder._isVisible = true;
    
    holder._toolbarTitle = '';
    holder._visibleTitle = false;
    
    holder.add = function(btnConf) {
        return holder.pane.add(
            typeof btnConf.innerHTML != 'undefined' ? btnConf : (
                !btnConf.items ? new ToolbarButton(btnConf) : new ToolbarMultiButton(btnConf.items)
            )
        );
    };
    
    if (typeof confInit != 'undefined') {
        for (var i=0; i<confInit.length; i++) {
            if (confInit[i]) {
                holder.add(confInit[i]);
            }
        }
    }
    
    holder.getIconSize = function() {
        return holder._iconSize;
    };
    
    holder.setIconSize = function(str) {
        switch (str) {
            case 'medium':
            case 'normal': {
                removeStyle(holder, 'icons-large');
                removeStyle(holder, 'icons-none');
                addStyle(holder, 'icons-normal');
                holder._iconSize = 'normal';
                break;
            }
            
            case 'large': {
                removeStyle(holder, 'icons-none');
                removeStyle(holder, 'icons-normal');
                addStyle(holder, 'icons-large');
                holder._iconSize = 'large';
                break;
            }
            
            default: {
                addStyle(holder, 'icons-none');
                removeStyle(holder, 'icons-normal');
                removeStyle(holder, 'icons-large');
                holder._iconSize = 'none';
                break;
            }
        }
    };
    
    holder.getButtonLabels = function() {
        return holder._textVisible;
    };
    
    holder.setButtonLabels = function(bool) {
        switch (bool) {
            case true: {
                addStyle(holder, 'textVisible');
                holder._textVisible = true;
                break;
            }
            
            case false: {
                removeStyle(holder, 'textVisible');
                holder._textVisible = false;
                break;
            }
            
            default: {
                removeStyle(holder, 'textVisible');
                holder._textVisible = false;
                break;
            }
        }
    };
    
    holder.getItems = holder.pane.getItems;
    
    holder.getIsVisible = function() {
        return holder._isVisible;
    };
    
    holder.setIsVisible = function(bool) {
        holder.style.display = bool ? '' : 'none';
        holder._isVisible = bool ? true : false;
    };
    
    holder.getToolbarTitle = function() {
        return holder._toolbarTitle;
    };
    
    holder.setToolbarTitle = function(str) {
        if (str == holder._toolbarTitle) return;
        holder._toolbarTitle = str;
        holder.toolbarTitle.innerHTML = '';
        holder.toolbarTitle.appendChild(document.createTextNode(str));
    };
    
    holder.getTitleVisibility = function() {
        return holder._visibleTitle;
    };
    
    holder.setTitleVisibility = function(bool) {
        holder._visibleTitle = bool ? true : false;
        holder.toolbarTitle.className = bool ? 'DomToolbarTitle': 'DomToolbarNoTitle';
        if (bool) addStyle(holder,'DomToolbarCaptionVisible'); else removeStyle(holder, 'DomToolbarCaptionVisible');
    };
    
    if (typeof optionalCaption != 'undefined') holder.setToolbarTitle(optionalCaption);
    
    return holder;
}

/**
    optional:
    ~~~~~~~~~~~~~~
    defaultToolbarSettings = Object {
        'iconSize': 'none' || 'normal' || 'large',
        'ButtonLabels': true || false,
        'titles': true || false,
        'toolbarClass': string
    }
    
    optional:
    ~~~~~~~~~~~~~~
    initToolbars = Array of Toolbar class
    
    custom events:
    ~~~~~~~~~~~~~~
    * resize -- called whenever the toolbar it's mofiying it's dimensions
    * toggleToolbar -- whenever a toolbar is shown or hided
    
    getters / setters:
    ~~~~~~~~~~~~~~~~~
    (get|set)Titles         -- sets / gets weather to display or not the toolbar titles
    (get|set)IconSize       -- sets / gets the icon size
    (get|set)ButtonLabels   -- sets / gets weather to display the button caption below the button icon
    (get|set)ToolbarClass     -- sets / gets the toolbar unique ID, and if set, it tries to store / load settings from window.localStorage
    
*/

function AppToolbarZone(initToolbars, defaultToolbarSettings) {
    var holder = $('div', 'DomAppToolbarZone');
    
    EnableCustomEventListeners(holder);
    
    holder._toolbars = [];
    
    holder.__isIE7 = navigator.appName == 'Microsoft Internet Explorer' &&
                   (navigator.appVersion.indexOf('MSIE 7') != -1);
    
    holder._iconSize = (defaultToolbarSettings && defaultToolbarSettings.iconSize) ? 
        defaultToolbarSettings.iconSize : 'normal';
    holder._textVisible = (defaultToolbarSettings && defaultToolbarSettings.buttonLabels) ? 
        defaultToolbarSettings.buttonLabels : false;
    holder._titlesVisible = (defaultToolbarSettings && defaultToolbarSettings.titles) ? 
        defaultToolbarSettings.titles : false;
    holder._toolbarClass = (defaultToolbarSettings && defaultToolbarSettings.toolbarClass) ?
        defaultToolbarSettings.toolbarClass : false;

    //internal functions
    holder._isIconSizeNone = function() { return holder._iconSize == 'none' ? true : false; };
    holder._isIconSizeNormal = function() { return holder._iconSize == 'normal' ? true : false; };
    holder._isIconSizeLarge = function() { return holder._iconSize == 'large' ? true : false; };
    
    //titles property getter setter function
    holder.getTitles = function() { 
        return holder._titlesVisible; 
    };
    
    holder.setTitles = function(bool) {
        holder._titlesVisible = bool;
        for (var i=0; i<holder._toolbars.length; i++) {
            holder._toolbars[i].toolbar.setTitleVisibility(bool);
        }
        holder.onCustomEvent('resize', holder);
    };
    
    //iconSize getters / setters
    holder.getIconSize = function() {
        return holder._iconSize;
    };
    
    holder.setIconSize = function(size) {
        for (var i=0; i<holder._toolbars.length; i++) {
            holder._toolbars[i].toolbar.setIconSize(size);
        }
        holder._iconSize = size;
        if (size == 'none' && !holder.getButtonLabels())
            holder.setButtonLabels(true);
            
        holder.onCustomEvent('resize', holder);
    };
    
    //ButtonLabels setters getters
    holder.getButtonLabels = function() { 
        return holder._textVisible; 
    };
    
    holder.setButtonLabels = function(bool) {
        holder._textVisible = bool;
        for (var i=0; i<holder._toolbars.length; i++) {
            holder._toolbars[i].toolbar.setButtonLabels(bool);
        }
        if (!bool && holder._isIconSizeNone())
            holder.setIconSize('normal');
        
        holder.onCustomEvent('resize', holder);
    };
    
    holder.setToolbarVisibility = function(visible, toolbarIndex) {
        holder._toolbars[toolbarIndex].toolbar.setIsVisible(visible);
        holder.onCustomEvent('resize', holder);
        holder.onCustomEvent('toggleToolbar', { 'toolbar': holder._toolbars[toolbarIndex].toolbar, 'name': holder._toolbars[toolbarIndex].name, 'index': toolbarIndex, 'on': visible } );
    };
    
    holder.updateContextMenu = function() {
        var menu = [];
        for (var i=0; i<holder._toolbars.length; i++) {
            menu.push({
                'caption': holder._toolbars[i].name,
                'input': 'checkbox',
                'checked': holder._toolbars[i].toolbar.getIsVisible,
                'handler': holder.setToolbarVisibility,
                'id': i
            });
        }
        
        var rootMenu = [
            {'caption': 'Toolbars',
             'items': menu
            },
            false,
            {'caption': 'Settings',
             'items': [
                {'caption': 'Show Toolbars Titles',
                 'input': 'checkbox:aaa',
                 'checked': holder.getTitles,
                 'handler': holder.setTitles
                },
                {'caption': 'Show Text Labels',
                 'input': 'checkbox:aaa',
                 'checked': holder.getButtonLabels,
                 'handler': holder.setButtonLabels
                },
                false,
                {'caption': 'No Icons',
                 'input': 'radio:bbb',
                 'id': 'none',
                 'checked': holder._isIconSizeNone,
                 'handler': holder.setIconSize
                },
                {'caption': 'Medium Icons',
                 'input': 'radio:bbb',
                 'id': 'normal',
                 'checked': holder._isIconSizeNormal,
                 'handler': holder.setIconSize
                },
                {'caption': 'Large Icons',
                 'input': 'radio:bbb',
                 'id': 'large',
                 'checked': holder._isIconSizeLarge,
                 'handler': holder.setIconSize
                }
             ]
            }
        ]
        
        holder.addContextMenu(rootMenu);
    };
    
    holder.getToolbarClass = function() {
        return holder._toolbarClass;
    };
    
    holder.setToolbarClass = function(str) {
        holder._toolbarClass = str;
    };
    
    holder.addToolbar = function(aToolbar, toolbarName) {
        
        aToolbar.style.display = holder.__isIE7 ? 'inline': 'inline-block';
        
        holder._toolbars.push(
            {'toolbar': aToolbar, 
             'name': typeof(toolbarName) != 'undefined' ? toolbarName : aToolbar.getToolbarTitle()
            }
        );
        
        //set toolbar settings to toolbarZone defaults
        aToolbar.setIconSize(holder._iconSize);
        aToolbar.setToolbarTitle(toolbarName ? toolbarName : aToolbar.getToolbarTitle())
        aToolbar.setButtonLabels( holder._textVisible );
        aToolbar.setTitleVisibility( holder._titlesVisible );
        
        holder.appendChild(aToolbar);
        holder.updateContextMenu();
    };
    
    if (initToolbars && initToolbars.length) {
        for (var i=0; i<initToolbars.length; i++) {
            holder.addToolbar(initToolbars[i]);
        }
    }
    
    holder.addCustomEventListener( 'resize', function() {
        setTimeout( function() {
            try {
                getOwnerWindow( holder ).paint();
            } catch (e) { }
        }, 10 );
        return true;
    } );
    
    return holder;
}