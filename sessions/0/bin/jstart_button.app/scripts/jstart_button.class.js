/* Scans the Start Menu items for a "AutoStart" folder, and executes all programs from it */
function __JSPlatform__AutoStart__(StartMenuFiles) {
    if (!StartMenuFiles || !StartMenuFiles.length)
        return;
    for (var i=0; i<StartMenuFiles.length; i++) {
        if (StartMenuFiles[i].name &&
            StartMenuFiles[i].name.toString().toLowerCase().trim() == 'auto start' &&
            StartMenuFiles[i].childs &&
            StartMenuFiles[i].childs.length
        ) {
            
            
            for (var j = 0; j < StartMenuFiles[i].childs.length; j++) {
                
                (function (MenuEntry) {
                
                    if (MenuEntry.exec) {
                        try {
                            eval(MenuEntry.exec);
                            KernelLog("Started: "+(MenuEntry.name || '<Unknown Service>'), 'warn');
                        } catch (Ex) {
                            KernelLog("Error Executing AutoStart Program: "+(MenuEntry.name || '<Unknown Service>') + Ex,
                                'error'
                            );
                        }
                    }
                
                })(StartMenuFiles[i].childs[j]);
                
            }
            break;
        }
    }
}


function __JSPlatform__StartMenuLoader__(start_menu) {
    var bottom_left  = start_menu.bottomPane.appendChild($('div', 'bottom_left'));
    var bottom_right = start_menu.bottomPane.appendChild($('div', 'bottom_right'));
    
    bottom_right.appendChild(
        new Button(
            '<img src="data:image/png;base64,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" /><span>Log Off...</span>', 
            function(){
                start_menu.visible = false;
                AppExec('bin/logout.app');
            })
    ).className = 'LogOut';
    
    bottom_right.appendChild(
        new Button(
            '<img src="data:image/png;base64,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" /><span>Switch Session</span>',
            function(){
                start_menu.visible = false;
                window._enableSwitchSessionCancel = true;
                var sw_sess = AppExec('bin/jlogon.app','1');
            }
        )
    ).className = 'LogOut';
    
    var Search;
    
    start_menu.Search = (
        Search = bottom_left.appendChild($('input')).
        setAttr('placeholder', 'Search')
    );
    
    Search.onclick = function (e) { 
        cancelEvent(e); 
        start_menu.ignoreBodyClick = false;
    };
    
    Keyboard.bindKeyboardHandler(
        Search,
        'enter',
        function() {
            if (window.onSearch)
                window.onSearch(Search.value, Search);
            else
                KernelLog('Hint: define callback window.onSearch(str [,HTMLInputElement]) in order to display search results'); 
            Search.value = '';
        }
    );
    
    Keyboard.bindKeyboardHandler(
        Search,
        'esc',
        function() {
            start_menu.visible = false;
        }
    );
    
    Search.onKeyUpHandler = function(e) {
        e = e ? e : window.event;
        charcode = e.keyCode? e.keyCode : e.charCode;
        
        switch (charcode) {
            
            default: 
                if (((charcode >= 32) && (charcode <= 128)) || (charcode == 8)) {
                    if (typeof(window.onSearchPreview) != 'undefined') 
                        window.onSearchPreview(Search.value, Search); 
                    else KernelLog('Hint: define callback window.onSearchPreview(str [,HTMLInputElement]) in order to display search results preview');
                }
                break;
        }
    };
        
    try {
        Search.addEventListener('keyup', Search.onKeyUpHandler, false);
    } catch(ex) {
        Search.attachEvent('onkeyup', Search.onKeyUpHandler);
    }

    var items = $_JSON_POST('start_menu.php',[]);
    
    //  console.log(items);
    
    if (items !== null) {
        
        setTimeout(function() {
            
            __JSPlatform__AutoStart__(items);
            
        }, 100);
    
        for (var i=0; i<items.length; i++) {
    
            var btn = $('div', 'menu_option has_image'+ (items[i].childs ? ' expandable': ''));
                btn.appendChild($('img')).setAttr('src', !items[i].icon ? 'img/mime/folder-48x48.png' : items[i].icon );
            
            ( function( item ) {
    
        
                if (item.childs) {
                    try {
                        btn.menu = new PopupMenu(item.childs, 'right same', btn);
                    } catch(e) { }
            
                    btn.menu.toElement = btn;
                            
                    btn.onclick = function(e){
                        cancelEvent(e);
                    
                        for (var i=0; i<start_menu.closeHook.length; i++) {
                            start_menu.closeHook[i].visible = false;
                        }
                    
                        this.menu.visible = true;
                        start_menu.menu_auto = true;
                    };
                    
                    btn.onmouseover = function(e) {
                        if (start_menu.menu_auto == true) {
                            for (var i=0; i<start_menu.closeHook.length; i++) {
                                start_menu.closeHook[i].visible = false;
                            }
                            this.menu.visible = true;
                        }
                    }
            
                    btn.menu.onmenupress = function(){
                        start_menu.visible = false;
                            start_menu.menu_auto = false;
                    };
            
                    if (!start_menu.closeHook) start_menu.closeHook = [];
                    start_menu.closeHook.push(btn.menu);
            
                    btn.menu.setParentOptionsIcon('jsplatform/icons/48x48/folder.png');
            
                    btn.appendChild(document.createTextNode(item.name));
                } else {
                    btn.appendChild( document.createTextNode( item.name ) );
                    
                    btn.onmouseover = function(e) {
                        if ( start_menu.menu_auto == true ) {
                            for ( var i=0; i<start_menu.closeHook.length; i++ ) {
                                start_menu.closeHook[i].visible = false;
                            }
                        }
                    }
                    
                    btn.onclick = function() {
                        
                        start_menu.visible = false;
                        
                        if ( item.exec ) {
                            eval( item.exec );
                        }
                    };
                }
            })( items[i] );
            
            start_menu.rightPane.appendChild(btn);
        }
        
    } else KernelLog('Start Menu: There are no programs to be placed. The json_response is null!');
    
    return start_menu;
}

function __JSPlatform__StartButton__() {
    if (!document.body.taskbar) {
                alert('Error: This application should be executed after the taskbar is loaded!');
                return null;
        }
        
    var holder = $('div', 'jstart_button');
    var taskbar= document.body.taskbar;
        
    taskbar.cellLeft.width += 60;
    
    taskbar.cellLeft.appendChild(holder);

    var start_menu = $('div', 'start_menu');
        
    start_menu.inner = start_menu.appendChild($('div', 'start_menu_inner'));
    start_menu._height = 0;
    start_menu.inner.appendChild($('div', 'start_top'));
    start_menu.inner.appendChild($('div', 'start_bottom'));
        
    start_menu.overlay = start_menu.inner.appendChild($('div', 'start_surface'));

    start_menu.leftPane = start_menu.overlay.appendChild($('div', 'start_left'));
    start_menu.rightPane= start_menu.overlay.appendChild($('div', 'start_right'));
    start_menu.bottomPane= start_menu.overlay.appendChild($('div', 'start_bottom_bar'));

    start_menu.getWidth = function() { return 636; };
    start_menu.setWidth = function(int) { KernelLog('Start\'s menu width is readOnly. Ignoerd!'); };
    start_menu.getHeight= function() { return start_menu._height; };
    start_menu.setHeight= function(int) { 
                
        var opts = start_menu.querySelectorAll('div.menu_option');
        
        if (opts.length) {
            maxHeight = ( 35 ) * opts.length + 50;
            maxHeight = maxHeight > 400 ? 400 : maxHeight;
        } else maxHeight = 400;
        
        i = parseInt(int); 
        if (i <  100) i = 100;
        if (i > maxHeight) i = maxHeight;
        
        start_menu._height = parseInt(i); 
        start_menu.inner.style.height = i+'px';
        
        start_menu.leftPane.style.height = i - 60 + 'px';
        start_menu.rightPane.style.height= i - 60 + 'px';
        
    };
        start_menu._visible = false;
        
        start_menu.getVisible = function() { 
                return start_menu._visible;
        };
        
        start_menu.ignoreBodyClick = false;
        
        start_menu.monitor_body_listener = function() {
                if (start_menu.ignoreBodyClick == true) {
                        start_menu.ignoreBodyClick = false;
                        return;
                }
                start_menu.setVisible(false);
        };
        
        start_menu.setVisible = function(bool) {
                var b = bool ? true : false;
                
                if (b == start_menu._visible) { 
                        return;
                }
                
                if (b === false) {
                        try {
                            document.body.removeChild(start_menu);
                        } catch(ex) {}
                        removeStyle(holder, 'startmenu_on');
            
            try {
                            document.body.removeEventListener('click', start_menu.monitor_body_listener, false);
            } catch(ex) {
                try {
                document.body.detachEvent('onclick', start_menu.monitor_body_listener);
                } catch(ieEX) {
                    console.log('Error dettaching body mousedown event: ' + ieEX + "\n" + ex);
                }
            }
            
            if (start_menu.closeHook) {
                for (var i=0; i<start_menu.closeHook.length; i++) {
                    start_menu.closeHook[i].setVisible( false );
                }
            }
            
                } else {
                
                        
                        //unfocus all desktop windows...
                        if (document.body.windows)
                        for (var i=0; i<document.body.windows.length; i++) {
                            if (document.body.windows[i].getActive()) document.body.windows[i].setActive(false);
                        }
                
                        start_menu.ignoreBodyClick = false;
                
                        var xy = getXY(holder);
                        this.style.bottom = getMaxY() - (xy[1]) + 'px';
                        
                        this.height = getMaxY() - 100;
                        
                        document.body.appendChild(start_menu);
                        
                        addStyle(holder, 'startmenu_on');
                        
                        try {
                          document.body.addEventListener('click', start_menu.monitor_body_listener, false);
                        } catch(ex) {
                          document.body.attachEvent('onclick', start_menu.monitor_body_listener);
                        }
                        
                        start_menu.menu_auto = false;
                        
                        if (start_menu.Search) start_menu.Search.focus();
                }
                
                start_menu._visible = b;
        };

        if (start_menu.__defineSetter__) {
          start_menu.__defineGetter__('width', start_menu.getWidth );
          start_menu.__defineSetter__('width', start_menu.setWidth );
          start_menu.__defineGetter__('height', start_menu.getHeight);
          start_menu.__defineSetter__('height', start_menu.setHeight);
          start_menu.__defineGetter__('visible', start_menu.getVisible);
          start_menu.__defineSetter__('visible', start_menu.setVisible);
        } else
        if (Object.defineProperty) {
          Object.defineProperty(start_menu, 'width', {'get': start_menu.getWidth, 'set': start_menu.setWidth });
          Object.defineProperty(start_menu, 'height',{'get': start_menu.getHeight,'set': start_menu.setHeight});
          Object.defineProperty(start_menu, 'visible', {'get': start_menu.getVisible, 'set': start_menu.setVisible});
        }
        
        try {
          document.body.taskbar.addEventListener('click', function() { start_menu.setVisible(false); }, true);
        } catch(ex) {
          document.body.taskbar.attachEvent('onclick', function() { start_menu.setVisible(false); } );
        }
        
        try {
          start_menu.addEventListener('click', function(e){
                  start_menu.ignoreBodyClick = true;
          }, true);
        } catch(ex) {
          start_menu.attachEvent('onclick', function(e) {
            start_menu.ignoreBodyClick = true;
          });
        }
        
        holder.start_menu = start_menu;
        
        try {
          holder.addEventListener('click', function(){ 
            if (holder.start_menu.getVisible() == false) holder.start_menu.setVisible(true); 
            holder.start_menu.ignoreBodyClick = true; 
          }, true);
        } catch(ex) {
          holder.attachEvent('onclick', function(){ 
            if (holder.start_menu.getVisible() == false) holder.start_menu.setVisible(true); 
            holder.start_menu.ignoreBodyClick = true; }
          );
        }

        window.__StartMenu__ = start_menu;
        
        __JSPlatform__StartMenuLoader__(start_menu);
        
        return this;
};

function __JSPlatform__LoadStartButton__() {
    if (!document.body.taskbar) { 
        setTimeout(__JSPlatform__LoadStartButton__, 3000);
    } else window.__JSPlatform__StartButton__();
        return this;
}