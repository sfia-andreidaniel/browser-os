function JTaskbar(childOf) {
    var taskbar = $('div', 'jtaskbar');

    taskbar.getTop = function() { return taskbar.offsetTop(); };
    taskbar.setTop = function(int) { taskbar.style.top = int+'px'; };
    taskbar.getLeft = function() { return taskbar.offsetLeft(); };
    taskbar.setLeft = function(int) { taskbar.style.left = int+'px'; };
    taskbar.getBottom = function() { return taskbar.style.bottom ? parseInt(taskbar.style.bottom) : 0; };
    taskbar.setBottom = function(int) { taskbar.style.bottom = int+'px'; };
    taskbar.getRight = function() { return taskbar.style.right ? parseInt(taskbar.style.right) : 0; };
    taskbar.setRight = function(int) { taskbar.style.right = int+'px'; };
    taskbar.getWidth = function() { return typeof(taskbar._width == 'undefined') ? taskbar.offsetWidth : taskbar._width; };
    taskbar.getHeight = function() { return taskbar.offsetHeight; };

    taskbar.addContextMenu([
        {
            "caption": "Minimize all Windows",
            "handler": function() {
                if (document.body.windows) {
                    for (var i=0; i<document.body.windows.length; i++) {
                        if (document.body.windows[i].minimizeable)
                            document.body.windows[i].minimized = true;
                    }
                }
            }
        },
        {
            "caption": "Close all Windows",
            "handler": function() {
                if (document.body.windows) {
                    for (var i=document.body.windows.length-1; i>=0; i--) {
                        if (document.body.windows[i].closeable) {
                            document.body.windows[i].close();
                        }
                    }
                }
            }
        },
        {
            "caption": "Arrange all Windows",
            "handler": function() {
                var j = 20;
                
                if (document.body.windows) {
                    for (var i=0; i < document.body.windows.length; i++) {
                    
                        if (!document.body.windows[i].minimized) {
                        
                            if (document.body.windows[i].maximized)
                                document.body.windows[i].maximized = false;
                        
                        
                            document.body.windows[i].x =
                            document.body.windows[i].y = j;
                            
                            j += 25;
                        }
                    }
                }
            }
        }
    ]);

    if (taskbar.__defineSetter__) {
      taskbar.__defineGetter__('top', taskbar.getTop);
      taskbar.__defineSetter__('top', taskbar.setTop);
      taskbar.__defineGetter__('left', taskbar.getLeft);
      taskbar.__defineSetter__('left', taskbar.setLeft);
      taskbar.__defineGetter__('bottom', taskbar.getBottom);
      taskbar.__defineSetter__('bottom', taskbar.setBottom);
      taskbar.__defineGetter__('right', taskbar.getRight);
      taskbar.__defineSetter__('right', taskbar.setRight);
      taskbar.__defineGetter__('width', taskbar.getWidth);
      taskbar.__defineGetter__('height',taskbar.getHeight);
    } else
    if (Object.defineProperty) {
      Object.defineProperty(taskbar, 'top',    {'get': taskbar.getTop, 'set': taskbar.setTop});
      Object.defineProperty(taskbar, 'left',   {'get': taskbar.getLeft, 'set': taskbar.setLeft});
      Object.defineProperty(taskbar, 'bottom', {'get': taskbar.getBottom, 'set': taskbar.setBottom});
      Object.defineProperty(taskbar, 'right',  {'get': taskbar.getRight, 'set': taskbar.setRight});
      Object.defineProperty(taskbar, 'width',  {'get': taskbar.getWidth });
      Object.defineProperty(taskbar, 'height', {'get': taskbar.getHeight });
    }
    
    (typeof(childOf) == 'undefined' ? document.body : childOf).appendChild(taskbar);
    
    if ((typeof(window.desktop) != 'undefined') && (typeof(childOf) == 'undefined')) { 
        window.desktop.bottom += (taskbar.height);
    }
    
    
    taskbar.mainHolder = $('table', 'jTMainTable');
    taskbar.mainHolder.setAttr('cellpadding','0').setAttr('cellspacing', '0');
    taskbar.appendChild(taskbar.mainHolder);
    
    taskbar.mainHolder = taskbar.mainHolder.insertRow(0);
    
    taskbar.cellLeft = taskbar.mainHolder.insertCell(0); taskbar.cellLeft.className = 'jtcell';
    
    taskbar.cellLeft._width = 1;
    
    taskbar.cellLeft.getWidth = function() { return taskbar.cellLeft._width; };
    taskbar.cellLeft.setWidth = function(int) {
        document.body.taskbar.cellLeft._width = int;
        document.body.taskbar.cellLeft.style.width = int+'px';
        document.body.taskbar.redraw();
    };
    
    if (taskbar.cellLeft.__defineGetter__) {
      taskbar.cellLeft.__defineGetter__('width', taskbar.cellLeft.getWidth);
      taskbar.cellLeft.__defineSetter__('width', taskbar.cellLeft.setWidth);
    } else
    if (Object.defineProperty) {
      Object.defineProperty(taskbar.cellLeft, 'width', {'get': taskbar.cellLeft.getWidth, 'set': taskbar.cellLeft.setWidth });
    }
    
    taskbar.cellMiddle = taskbar.mainHolder.insertCell(1); taskbar.cellMiddle.className = 'jtcell';
    taskbar.cellRight = taskbar.mainHolder.insertCell(2); taskbar.cellRight.className = 'jtcell';
    
    taskbar.cellRight._width = 1;

    taskbar.cellRight.getWidth = function() { 
      return taskbar.cellRight._width; 
    };
    taskbar.cellRight.setWidth = function(int) {
        document.body.taskbar.cellRight._width = int;
        document.body.taskbar.cellRight.style.width = int+'px';
        document.body.taskbar.redraw();
    };

    if (taskbar.cellRight.__defineGetter__) {
      taskbar.cellRight.__defineGetter__('width', taskbar.cellRight.getWidth);
      taskbar.cellRight.__defineSetter__('width', taskbar.cellRight.setWidth);
    } else
    if (Object.defineProperty) {
      Object.defineProperty(taskbar.cellRight, 'width', {'get': taskbar.cellRight.getWidth, 'set': taskbar.cellRight.setWidth });
    }
    
    taskbar.cellLeft.setAttribute('style', 'width: 1%; height: 39px');
    taskbar.cellMiddle.setAttribute('style', 'width: auto; height: 39px;');
    taskbar.cellRight.setAttribute('style', 'width: 1%; height: 39px');
    
    /* Try to embed the System Tray inside Taskbar */
    
    try {
    
        taskbar.cellRight.appendChild(
            window.Notifier
        );

    } catch(e) {
        
        KernelLog(e, 'error');
        alert(e);
        
    }
    
    taskbar.appHolder = taskbar.applicationHolder = $('div', 'jt_tabs_holder');
    taskbar.appContainer = taskbar.appHolder;
    
    taskbar.redraw = function() {
        document.body.taskbar.appContainer.style.width = 
            document.body.taskbar.width - 
                document.body.taskbar.cellLeft.width - 
                window.Notifier.offsetWidth - 
                document.body.taskbar.cellRight.width - 20 + 'px';
        taskbar.cellRight.style.width = window.Notifier.offsetWidth + 10 + 'px';
//         KernelLog('redrawing taskbar... ('+document.body.taskbar.appHolder.style.width+')');
//         KernelLog('total width: '+document.body.taskbar._width+', left: '+document.body.taskbar.cellLeft.width+', right: '+document.body.taskbar.cellRight.width+', midd: '+document.body.taskbar.appHolder.style.width);
//         document.body.taskbar.appHolder.style.backgroundColor = 'red';
    };
    
    taskbar.setWidth = function(int) {
        document.body.taskbar._width = int;
        document.body.taskbar.redraw();
    };
    
    if (taskbar.__defineSetter__) {
      taskbar.__defineSetter__('width', taskbar.setWidth);
    } else
    if (Object.defineProperty) {
      Object.defineProperty(taskbar, 'width', {'set': taskbar.setWidth });
    }
    
    taskbar._width = getMaxX();
    
    taskbar.cellMiddle.appendChild(taskbar.appHolder);
    taskbar.appHolder = taskbar.appHolder.appendChild($('table', 'jTAppTable'));
    taskbar.appHolder.setAttr('cellpadding', '0').setAttr('cellspacing', '0');
    
    taskbar.appHolder = taskbar.appHolder.insertRow(0);
    var _last_cell = taskbar.appHolder.insertCell(0); _last_cell.className = 'jtcell';
    _last_cell.style.width = 'auto';
    _last_cell.innerHTML = '&nbsp;';
    
    taskbar.onwinresize = function() {
        taskbar.setWidth( getMaxX() );
    };
    
    try {
      window.addEventListener('resize', taskbar.onwinresize, false);
    } catch(ex) {
      window.attachEvent('resize', taskbar.onwinresize);
    }
    
    taskbar.createAppEntry = function(settings) {
        var cell = document.body.taskbar.appHolder.insertCell(document.body.taskbar.appHolder.cells.length-1); 
        cell.className = 'jtcell';
        cell.style.width = '1px';
        var tab = cell.appendChild($('div','jtaskbar_tab jtab_inactive'));
        tab._cell = cell;
        
        tab._app_icon = tab.appendChild($('img','icon'));
        
        tab.getIcon = function() { return tab._app_icon.src; };
        tab.setIcon = function(str) {
            if (!str) {tab._app_icon.src = ''; tab._app_icon.style.display = 'none';}
            else { tab._app_icon.style.display = ''; tab._app_icon.src = str; }
        };
        
        if (tab.__defineGetter__) {
          tab.__defineGetter__('icon', tab.getIcon);
          tab.__defineSetter__('icon', tab.setIcon);
        } else
        if (Object.defineProperty) {
          Object.defineProperty(tab, 'icon', {'get': tab.getIcon, 'set': tab.setIcon });
        }
        
        tab.setIcon (settings && settings.icon ? settings.icon : '' );
        
        tab._app_icon.onerror = function() {
            tab._app_icon.style.display = 'none';
        };
        
        tab.close = function() {
            try {
              tab._cell.parentNode.deleteCell(tab._cell.cellIndex);
            } catch(e) {}
        };
        
        tab._caption = tab.appendChild($('span'));
        
        tab.__caption = '';
        
        tab.getCaption = function() { return tab.__caption; };
        tab.setCaption = function(str) {
            tab.__caption = str;
            tab._caption.innerHTML = '';
            tab._caption.appendChild(document.createTextNode(str));
            tab.title = str;
        };
        
        if (tab.__defineSetter__) {
          tab.__defineGetter__('caption', tab.getCaption);
          tab.__defineSetter__('caption', tab.setCaption);
        } else
        if (Object.defineProperty) {
          Object.defineProperty('tab', 'caption', {'get': tab.getCaption, 'set': tab.setCaption});
        }
        
        tab.setCaption( settings && settings.caption ? settings.caption : ' ' );
        
        tab._active = false;
        
        tab.getActive = function() { return tab._active; };
        tab.setActive = function(bool) {
            tab._active = bool;
            if (bool) {
                if (hasStyle(tab, 'jtab_inactive')) removeStyle(tab, 'jtab_inactive');
                addStyle(tab, 'jtab_active');
                tab.scrollIntoView(false);
            } else {
                if (hasStyle(tab, 'jtab_active')) removeStyle(tab, 'jtab_active');
                addStyle(tab, 'jtab_inactive');
            }
        };
        
        if (tab.__defineSetter__) {
          tab.__defineGetter__('active', tab.getActive);
          tab.__defineSetter__('active', tab.setActive);
        } else
        if (Object.defineProperty) {
          Object.defineProperty(tab, 'active', {'get': tab.getActive, 'set': tab.setActive});
        }
        
        tab.setActive (settings && settings.active ? true : false );
        
        disableSelection(tab);
        
        return tab;
    };
    
    document.body.appendChild(taskbar);
    document.body.taskbar = taskbar;
    
    
    if (document.body.windows) {
        for (var i=0; i<document.body.windows.length; i++) {
            document.body.windows[i].setTaskbarTab();
        }
    }
    
    var allt = taskbar.getElementsByTagName('*');
    for ( var i=0; i<allt.length; i++) {
        disableSelection(allt[i]);
    }
    
    return taskbar;
}

function TaskbarLoader() {
    try {
        new JTaskbar();
    } catch(ex) {
        console.log(ex);
    }
}