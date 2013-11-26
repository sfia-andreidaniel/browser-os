
var __cDomPopup = 0;

function Popup(items, rootElement) {
    var holder = $('table', 'DomPopup');
    
    holder._icons  = 0;
    holder._inputs = 0;
    holder._shortcuts = 0;
    holder._childs = 0;
    holder._focusedRow = false;
    holder.rootElement = typeof rootElement != 'undefined' ? rootElement : null;
    
    holder._visible = false;
    
    holder.___dpName = ++__cDomPopup;
    
    holder.getIconsVisible = function() {
        return holder._icons;
    };
    
    holder.setIconsVisible = function(intVal) {
        for (var i=0; i<holder.rows.length; i++) {
//             if (!holder.rows[i]._isSeparator)
            holder.rows[i]._icon.style.display = intVal ? '' : 'none';
        }
        holder._icons = intVal;
    };
    
    holder.getInputsVisible = function() {
        return holder._inputs;
    };
    
    holder.setInputsVisible = function(intVal) {
        for (var i=0; i<holder.rows.length; i++) {
//             if (!holder.rows[i]._isSeparator)
            holder.rows[i]._input.style.display = intVal ? '' : 'none';
        }
        holder._inputs = intVal;
    };
    
    holder.getShortcutsVisible = function() {
        return holder._shortcuts;
    };
    
    holder.setShortcutsVisible = function(intVal) {
        for (var i=0; i<holder.rows.length; i++) {
//             if (!holder.rows[i]._isSeparator)
            holder.rows[i]._shortcut.style.display = intVal ? '' : 'none';
        }
        holder._shortcuts = intVal;
    };
    
    holder.getChildsVisible = function() {
        return holder._childs;
    };
    
    holder.setChildsVisible = function(intVal) {
        for (var i=0; i<holder.rows.length; i++) {
//             if (!holder.rows[i]._isSeparator)
            holder.rows[i]._child.style.display = intVal ? '' : 'none';
        }
        holder._childs = intVal;
    };
    
    holder.getVisible = function() {
        return holder._visible;
    };
    
    holder.getRootElement = function() {
        return holder.rootElement;
    };
    
    holder.setVisible = function(bool) {
        
        var stack = holder.getRootElement();
        
        holder.style.display = bool ? '' : 'none';
        
        if (!bool) {
            for (var i=0; i<holder.rows.length; i++) {
                if (holder.rows[i]._xchild) holder.rows[i]._xchild.setVisible(false);
            }
        }
        
        stack.___stack = stack.___stack || [];
        
        if (!bool) {
            for (var i=0; i<stack.___stack.length; i++) {
                if (stack.___stack[i] == holder) {
                    stack.___stack.splice(i, 1);
                }
            }
            
            if (holder.parentNode) holder.parentNode.removeChild(holder);
        } else stack.___stack.push(holder);
        
        if (!!bool) {
            for (var i=0; i<holder.rows.length; i++) {
            
                try {
                    if ( holder.rows[i] && holder.rows[i].setDisabled )
                        holder.rows[i].setDisabled( holder.rows[i]._disabled );
                    
                    if ( holder.rows[i] && typeof holder.rows[i]._checked == 'function' ) {
                        try {
                            holder.rows[i].querySelector('input').checked = holder.rows[i]._checked();
                        } catch (f) {}
                    }
                        
                } catch (e){
                    console.warn( e + "" );
                }
            }
        }
        
    };
    
    holder.getFocusedRow = function() {
        return holder._focusedRow;
    };
    
    holder.setFocusedRow = function(tr) {
        if (holder._focusedRow) removeStyle(holder._focusedRow, 'activeOption');
        holder._focusedRow = tr;
        if (holder._focusedRow) addStyle(holder._focusedRow, 'activeOption');
    };
    
    holder.matchProperty = function(propertyName, propertyValue) {
        var prop;
        for (var i=0; i<holder.rows.length; i++) {
            if (!holder.rows[i]._isSeparator) {
                prop = holder.rows[i].matchProperty(propertyName, propertyValue);
                if (prop) return prop;
            }
        }
        return false;
    };
    
    holder.addOption = function(optionInfo, optionalIndex) {
        var row = holder.insertRow(optionalIndex ? optionalIndex : holder.rows.length);
        
        (row._icon = row.insertCell(0)).className = 'DomPopupIconHolder';
        (row._input = row.insertCell(1)).className = 'DomPopupInputHolder';
        (row._caption = row.insertCell(2)).className = 'DomPopupCaptionHolder';
        (row._shortcut = row.insertCell(3)).className = 'DomPopupShortcutHolder';
        (row._child = row.insertCell(4)).className = 'DomPopupExpandHolder';
        
        row._icon.style.display = holder._icons == 0 ? 'none' : '';
        row._input.style.display = holder._inputs == 0 ? 'none' : '';
        row._shortcut.style.display = holder._shortcuts == 0 ? 'none' : '';
        row._child.style.display = holder._childs == 0 ? 'none' : '';
        
        optionInfo = optionInfo || {};
        
        row._xicon = false;
        row._xinput   = false;
        row._xcaption = false;
        row._xshortcut = false;
        row._xchild = false;
        row._expanded = false;
        row._xhandler = false;
        row._xmenuID = false;
        row._checked = typeof optionInfo.checked == 'undefined' ? false : optionInfo.checked;
        
        row._disabled = typeof optionInfo.disabled == 'undefined' ? false : optionInfo.disabled;
        
        row.matchProperty = function(propertyName, propertyValue) {
            try {
                if (row['_x'.concat(propertyName)] == propertyValue) return row;
            } catch(ex) {
                throw 'Invalid Property "'+propertyName+'"!';
            }
            if (row._xchild) return row._xchild.matchProperty(propertyName, propertyValue); 
            else return false;
        };
        
        row.getIcon = function() {
            return row._xicon;
        };
        
        row.setIcon = function(str) {
            if (str && !row._xicon) holder.setIconsVisible( holder.getIconsVisible() + 1);
            if (!str && row._xicon) holder.setIconsVisible( holder.getIconsVisible() - 1);
            row._icon.style.backgroundImage = (!str) ? 'none' : "url('"+str+"')";
            row._xicon = str ? str : false;
        };
        
        row.getChecked = function() {
            return row._checked;
        }
        
        row.setChecked = function( bool ) {
            row._checked = typeof bool == 'function' ? bool : !!bool;
        }
        
        row.getInput = function() {
            if (row._xinput) return row._xinput.getAttribute('type'); else return false;
        };
        
        //allows "checkbox", "radio", or a false value
        row.setInput = function(str, checked) {
            if (str && !row._xinput) holder.setInputsVisible( holder.getInputsVisible() + 1);
            if (!str && row._xinput) holder.setInputsVisible( holder.getInputsVisible() - 1);
            row._input.innerHTML = '';
            if (str) {
                row._xinput = $('input');
                
                var igr = str.split(':');
                
                row._input.innerHTML = '';
                
                row._xinput = row._input.appendChild(
                    igr[0] == 'checkbox' 
                        ? ( new DOMCheckBox() ).chain(function() {
                            if ( checked )
                                this.checked = true;
                            this.setAttribute( "name", "internal" + holder.___dpName + "_" + ( igr.length > 1 ? igr[1] : '0' ) );
                        })
                        : $('input').setAttr('type', igr[0] ).setAttr('name', 'internal' + holder.___dpName + '_' + ( igr.length > 1 ? igr[1] : 0 ) ).
                            chain( function() {
                                if ( checked )
                                    this.checked = true;
                            } )
                );
                
                /*
                var st = '<input type="'+igr[0]+'" name="internal'+holder.___dpName+'_'+(igr.length > 1 ? igr[1] : '0')+'" '+(
                  checked ? 'checked="checked"' : ''
                )+' />';
                
                row._input.innerHTML = st;
                
                row._xinput = row._input.firstChild;
                */
                
            } else row._xinput = false;
        };
        
        row.getCaption = function() {
            return row._xcaption;
        };
        
        row.setCaption = function(str) {
            row._xcaption = str;
            row._caption.innerHTML = '';
            if (str !== '') row._caption.appendChild(document.createTextNode(str));
        };
        
        row.getShortcut = function() {
            return row._xshortcut;
        }
        
        row.setShortcut = function(str) {
            if (str && !row._xshortcut) holder.setShortcutsVisible( holder.getShortcutsVisible() + 1);
            if (!str && row._xshortcut) holder.setShortcutsVisible( holder.getShortcutsVisible() - 1);
            row._shortcut.innerHTML = '';
            if (str) row._shortcut.appendChild(document.createTextNode(str));
        }
        
        row.getChild = function() {
            return row._xchild;
        };
        
        row.setChild = function(aDomPopup) {
            if (aDomPopup && !row._xchild) holder.setChildsVisible( holder.getChildsVisible() + 1);
            if (!aDomPopup && row._xchild) { 
                if (row._xchild.parentNode) row._xchild.parentNode.removeChild(row._xchild);
                holder.setChildsVisible( holder.getChildsVisible() - 1);
            }
            row._xchild = aDomPopup;
            if (row._xchild) addStyle(row._child, 'expandable');
            else removeStyle(row._child, 'expandable');
            
            aDomPopup.rootMenu = row;
        }
        
        row.getHandler = function() {
            return row._xhandler;
        };
        
        row.setHandler = function(func) {
            row._xhandler = func;
        };
        
        row.getMenuID = function() {
            return row._xmenuID;
        };
        
        row.setMenuID = function(param) {
            row._xmenuID = param;
        };
        
        row.getDisabled = function() {
            return ( row._disabled instanceof Function ) ? row._disabled() : row._disabled;
        };
        
        row.setDisabled = function(boolOrFunc) {
            row._disabled = boolOrFunc;
            ( row.getDisabled() ? addStyle : removeStyle )(row, 'disabled');
            if (row._xinput) row._xinput.disabled = row.getDisabled() ? true : false;
        };
        
        Object.defineProperty(row, 'icon', {'get': row.getIcon,'set': row.setIcon});
        Object.defineProperty(row, 'input', {'get': row.getInput,'set': row.setInput});
        Object.defineProperty(row, 'caption', {'get': row.getCaption,'set': row.setCaption});
        Object.defineProperty(row, 'shortcut', {'get': row.getShortcut,'set': row.setShortcut});
        Object.defineProperty(row, 'child', {'get': row.getChild,'set': row.setChild});
        Object.defineProperty(row, 'handler', {'get': row.getHandler,'set': row.setHandler});
        Object.defineProperty(row, 'menuID', {'get': row.getMenuID,'set': row.setMenuID});
        Object.defineProperty(row, 'disabled', {'get': row.getDisabled,'set': row.setDisabled});
        Object.defineProperty(row, 'checked', { "get": row.getChecked, 'set': row.setChecked } );
        
        if (typeof optionInfo != 'undefined') {
            row.setIcon(optionInfo.icon || false);
            row.setCaption(optionInfo.caption || false);
            row.setShortcut(optionInfo.shortcut || false);
            
            if (optionInfo.input && !optionInfo.checked) {
              row.setInput(optionInfo.input || false);
            } else
            if (optionInfo.input && optionInfo.checked) {
                try {
                    row.setInput(optionInfo.input, optionInfo.checked());
                } catch(ex) {
                    row.setInput(optionInfo.input, optionInfo.checked);
                }
            }
            if (typeof optionInfo.handler != 'undefined') row.setHandler(optionInfo.handler);
            if (typeof optionInfo.id != 'undefined') row.setMenuID(optionInfo.id);
            if (typeof optionInfo.disabled != 'undefined') row.setDisabled(optionInfo.disabled);
        }
        
        row.getExpanded = function() {
            return row._expanded;
        };
        
        row.setExpanded = function(bool) {
            if (!row._xchild) return;
            
            if (!bool) {
                try { document.body.removeChild(row._xchild); } catch(ex) {}
                row._xchild.setVisible(false);
            } else {
            
                holder.setFocusedRow( row );
                
                document.body.appendChild(row._xchild);
                row._xchild.setVisible(true);
                
                var w = row._xchild.offsetWidth;
                var h = row._xchild.offsetHeight;
                
                var xy = getXY(row);
                
                xy[0] += document.body.scrollLeft || (window.pageXOffset || (document.body.parentElement ? document.body.parentElement.scrollLeft  : 0) );
                xy[1] += document.body.scrollTop || (window.pageYOffset || (document.body.parentElement ? document.body.parentElement.scrollTop  : 0) );
                
                row._xchild.style.left = xy[0] + w + row.offsetWidth < getMaxX() ? (xy[0] + row.offsetWidth - 2 + 'px') : xy[0] - w + 'px';
                row._xchild.style.top  = xy[1] + h  < getMaxY() ? (xy[1] + 'px') : xy[1] - row._xchild.offsetHeight + row.offsetHeight + 'px';
                
                row._xchild.setFocusedRow(false);
                
                if (row._xchild) {
                    for (var i=0; i<row._xchild.rows.length; i++) {
                        try {
                            row._xchild.rows[i].setExpanded(false);
                        } catch(ex) {}
                    }
                }
            }
        };
        
        row.mouseHandler = function(evt) {
            if (row.getDisabled()) return;
            evt = evt || window.event;
            try {
                var mbc = new MouseBoundaryCrossing(evt, row);
            } catch(ex) { return; }
            
            switch (true) {
                case mbc.leftLandmark:
                    
                    try {
                        //try to see if the mouse pointer moved inside the child menu
                        var mbc2 = new MouseBoundaryCrossing(evt, row._xchild);
                        if (mbc2.enteredLandmark) return;
                    } catch(ex) {}
                    
                    row.setExpanded(false);
                    break;
                case mbc.enteredLandmark:
                    row.setExpanded(true);
                    
                    holder.setFocusedRow(row);
                    
                    for (var i=0; i<holder.rows.length; i++) {
                        if (row.rowIndex != i && !holder.rows[i]._isSeparator) holder.rows[i].setExpanded(false);
                    }
                    
                    break;
            }
        }
        
        row.onmouseover = row.onmouseout = row.mouseHandler;
        
        row.clickListener = function(e){
            e = e || window.event;
            if (row.getDisabled()) return;
            if (row._xinput) {
                switch (row._xinput.getAttribute('type')) {
                    case 'checkbox': 
                        if ((e.target || e.srcElement) != row._xinput) { 
                            row._xinput.checked = !row._xinput.checked;
                            cancelEvent(e);
                        } else {
                            if ( row._xinput.getAttribute('type') == 'checkbox' ) {
                                row._xinput.checked = !row._xinput.checked;
                                cancelEvent(e);
                            }
                        }
                        if (row.getHandler())
                            row.getHandler()( row._xinput.checked, row.getMenuID() );
                        break;
                    
                    case 'radio':
                        if ((e.target || e.srcElement) != row._xinput) { 
                            row._xinput.checked = true;
                            cancelEvent(e);
                        }
                        if (row.getHandler()) row.getHandler()(row.getMenuID());
                        break;
                }
            } else {
                if (row.getHandler()) {
                    if (holder.rootElement)
                        holder.rootElement.resetMenu();
                    row.getHandler()(row.getMenuID());
                }
            }
            return true;
        };
        
        row.addEventListener('click', row.clickListener, false);
        
        return row;
    };
    
    holder.addSeparator = function(optionalIndex) {
        var row = holder.insertRow( typeof optionalIndex == 'undefined' ? holder.rows.length : optionalIndex );
        
        (row._icon = row.insertCell(0)).className = 'DomPopupIconHolder';
        (row._input = row.insertCell(1)).className = 'DomPopupInputHolder';
        (row._caption = row.insertCell(2)).className = 'DomPopupCaptionHolder';
        (row._shortcut = row.insertCell(3)).className = 'DomPopupShortcutHolder';
        (row._child = row.insertCell(4)).className = 'DomPopupExpandHolder';
        
        row._icon.style.display = holder._icons == 0 ? 'none' : '';
        row._input.style.display = holder._inputs == 0 ? 'none' : '';
        row._shortcut.style.display = holder._shortcuts == 0 ? 'none' : '';
        row._child.style.display = holder._childs == 0 ? 'none' : '';
        
        row._isSeparator = true;
        row.className = 'DomPopupSeparator';

        addStyle( row, 'disabled' );
        
        return row;
    };
    
    for (var i=0; i<items.length; i++) {
        if (items[i]) {
            var opt = holder.addOption(items[i]);
            if (items[i].items) {
                opt.setChild( new Popup( items[i].items, holder.rootElement ) );
            }
        } else {
            var opt = holder.addSeparator();
        }
    }
    
    return holder;
}

function MenuBar(items) {
    var holder = $('div', 'DomMenuBar');
    holder.mnu = holder.appendChild($('table', 'DomMenuBarTable'));
    holder.mnu = holder.mnu.insertRow(0);
    holder.___stack = [ holder ];
    
    holder._focusedCell = false;
    holder._openOnHover = false;
    
    holder.getFocusedCell = function() {
        return holder._focusedCell;
    };
    
    holder.getRootElement = function() {
        return holder;
    };
    
    holder.setOpenOnHover = function(bool) {
        if (bool == holder._openOnHover) return;
        
        if (!bool) 
            window.removeEventListener('mousedown', holder.checkClickFunction, true);
        else
            window.addEventListener('mousedown', holder.checkClickFunction, true);
        
        holder._openOnHover = bool;
    };
    
    holder.setFocusedCell = function(td) {
        if (holder._focusedCell) removeStyle(holder._focusedCell, 'activeOption');
        holder._focusedCell = td;
        if (holder._focusedCell) addStyle(holder._focusedCell, 'activeOption');
    };
    
    holder.matchProperty = function(propertyName, propertyValue) {
        var prop;
        for (var i=0; i<holder.mnu.cells.length; i++) {
            prop = holder.mnu.cells[i].matchProperty(propertyName, propertyValue);
            if (prop) return prop;
        }
        return false;
    };
    
    holder.getItem = function(value, name) {
        name = name || 'caption';
        return holder.matchProperty(name, value);
    };
    
    holder.addOption = function(optionInfo, optionalIndex) {
        var cell = holder.mnu.insertCell(optionalIndex ? optionalIndex : holder.mnu.cells.length);
        
        (cell._icon = cell.appendChild($('div', 'DomPopupIconHolder')));
        (cell._caption = cell.appendChild($('div','DomPopupCaptionHolder')));
        
        cell._icon.style.display = 'none';
        
        cell._xhandler = false;
        cell._xmenuID  = false;
        
        cell._xicon = false;
        cell._xcaption = false;
        cell._xchild = false;
        cell._expanded = false;
        
        cell._disabled = false;
        
        cell.matchProperty = function(propertyName, propertyValue) {
            try {
                if (cell['_x'.concat(propertyName)] == propertyValue) return cell;
            } catch(ex) {
                throw 'Invalid Property "'+propertyName+'"!';
            }
            if (cell._xchild) return cell._xchild.matchProperty(propertyName, propertyValue); 
            else return false;
        };
        
        cell.getIcon = function() {
            return cell._xicon;
        };
        
        cell.setIcon = function(str) {
            cell._icon.style.backgroundImage = (!str) ? 'none' : "url('"+str+"')";
            cell._xicon = str ? str : false;
            cell._icon.style.display = str ? '' : 'none';
        };
        
        cell.getCaption = function() {
            return cell._xcaption;
        };
        
        cell.setCaption = function(str) {
            cell._xcaption = str;
            cell._caption.innerHTML = '';
            if (str !== '') cell._caption.appendChild(document.createTextNode(str));
        };
        
        cell.getChild = function() {
            return row._xchild;
        };
        
        cell.setChild = function(aDomPopup) {
            if (!aDomPopup && cell._xchild) { 
                if (cell._xchild.parentNode) cell._xchild.parentNode.removeChild(cell._xchild);
            }
            cell._xchild = aDomPopup;
            
            aDomPopup.rootMenu = cell;
        };
        
        cell.getHandler = function() {
            return cell._xhandler;
        };
        
        cell.setHandler = function(func) {
            cell._xhandler = func;
        };
        
        cell.getMenuID = function() {
            return cell._xmenuID;
        };
        
        cell.setMenuID = function(param) {
            cell._xmenuID = param;
        };
        
        cell.getDisabled = function(bool) {
            return ( cell._disabled instanceof Function ) ? !!cell._disabled() : !!cell._disabled;
        };
        
        cell.setDisabled = function(bool) {
            cell._disabled = bool;
            (cell.getDisabled() ? addStyle : removeStyle )( cell, 'disabled' );
        };
        
        Object.defineProperty(cell, 'icon', { 'get': cell.getIcon, 'set': cell.setIcon});
        Object.defineProperty(cell, 'caption', { 'get': cell.getCaption, 'set': cell.setCaption });
        Object.defineProperty(cell, 'child', { 'get': cell.getChild, 'set': cell.setChild });
        Object.defineProperty(cell, 'handler', { 'get': cell.getHandler, 'set': cell.setHandler });
        Object.defineProperty(cell, 'menuID', { 'get': cell.getMenuID, 'set': cell.setMenuID });
        Object.defineProperty(cell, 'disabled', { 'get': cell.getDisabled, 'set': cell.setDisabled });
        
        if (typeof optionInfo != 'undefined') {
            cell.setIcon(optionInfo.icon || false);
            cell.setCaption(optionInfo.caption || false);
            if (typeof optionInfo.id != 'undefined') cell.setMenuID(optionInfo.id);
            if (typeof optionInfo.handler != 'undefined') cell.setHandler(optionInfo.handler);
            if (typeof optionInfo.disabled != 'undefined') cell.setDisabled(optionInfo.disabled);
        }
        
        cell.getExpanded = function() {
            return cell._expanded;
        };
        
        cell.setExpanded = function(bool) {
        
	    if (cell._disabled) return;
        
            if (!cell._xchild) return;
            if (!bool) {
                try { document.body.removeChild(cell._xchild); } catch(ex) {}
                cell._xchild.setVisible(false);
            } else {
                
                holder.setFocusedCell( cell );
                
                document.body.appendChild(cell._xchild);
                cell._xchild.setVisible(true);
                
                var w = cell._xchild.offsetWidth;
                var h = cell._xchild.offsetHeight;
                
                var xy = getXY(cell);
                
                xy[0] += document.body.scrollLeft || (window.pageXOffset || (document.body.parentElement ? document.body.parentElement.scrollLeft  : 0) );
                xy[1] += document.body.scrollTop || (window.pageYOffset || (document.body.parentElement ? document.body.parentElement.scrollTop  : 0) );
                
                cell._xchild.style.left = xy[0] + 'px';
                cell._xchild.style.top  = xy[1] + cell.offsetHeight + h < getMaxY() ? xy[1] + cell.offsetHeight + 'px' : xy[1] - cell._xchild.offsetHeight + 'px';
                
                if ((cell._xchild.offsetLeft + cell._xchild.offsetWidth) > getMaxX())
                    cell._xchild.style.left = (xy[0] + cell.offsetWidth - cell._xchild.offsetWidth - 16) + 'px';
                
                cell._xchild.setFocusedRow(false);
                
                if (cell._xchild) {
                    for (var i=0; i<cell._xchild.rows.length; i++) {
                        if (!cell._xchild.rows[i]._isSeparator)
                        cell._xchild.rows[i].setExpanded(false);
                    }
                }
            }
        };
        
        cell.mouseHandler = function(evt) {
            evt = evt || window.event;
            try {
                var mbc = new MouseBoundaryCrossing(evt, cell);
            } catch(ex) { return; }
            
            switch (true) {
                case mbc.leftLandmark:
                    try {
                        //try to see if the mouse pointer moved inside the child menu
                        var mbc2 = new MouseBoundaryCrossing(evt, cell._xchild);
                        if (mbc2.enteredLandmark) return;
                    } catch(ex) {}
                    
                    cell.setExpanded(false);
                    break;
                case mbc.enteredLandmark:
                    if (!holder._openOnHover) return;
                    cell.setExpanded(true);
                    
                    holder.setFocusedCell(cell);
                    
                    for (var i=0; i<holder.mnu.cells.length; i++) {
                        if (cell.cellIndex != i) holder.mnu.cells[i].setExpanded(false);
                    }
                    
                    break;
            }
        }
        
        cell.mouseDownListener = function() {
            if (cell.getDisabled()) return;
            cell.setExpanded(true);
            holder.setFocusedCell(cell);
            for (var i=0; i<holder.mnu.cells.length; i++) {
                if (cell.cellIndex != i) holder.mnu.cells[i].setExpanded(false);
            }
            holder.setOpenOnHover( true );
        };
        
        try {
            cell.addEventListener('mousedown', cell.mouseDownListener, true);
        } catch(ex) {
            cell.attachEvent('onmousedown', cell.mouseDownListener);
        }
        
        cell.onmouseover = cell.onmouseout = cell.mouseHandler;
        
        cell.clickListener = function(e) {
            if (cell.getDisabled()) return;
            if (cell.getHandler()) {
                holder.resetMenu();
                cell.getHandler()(cell.getMenuID());
            }
        };
        
        try {
            cell.addEventListener('click', cell.clickListener, false);
        } catch(ex) {
            cell.attachEvent('onclick', cell.clickListener);
        }
        
        return cell;
    };
    
    for (var i=0; i<items.length; i++) {
        if (items[i]) {
            var opt = holder.addOption(items[i]);
            
            if (items[i].items) {
                opt.setChild( new Popup( items[i].items, holder ) );
            }
        }
    }
    
    holder.resetMenu = function() {
        for (var i=0; i<holder.mnu.cells.length; i++) {
            if (holder.mnu.cells[i]._xchild)
                holder.mnu.cells[i]._xchild.setVisible(false);
        }
        holder.setFocusedCell(false);
        holder.setOpenOnHover( false );
    };
    
    holder.checkClickFunction = function(e) {
    
        var targ =  e.target || window.event.srcElement;
        
        if (!targ) return;
        var increments = 0;
        if (targ == holder) { holder.resetMenu(); return; }
        while (increments <= 6 && targ.parentNode) {
            for (var i=0; i<holder.___stack.length; i++) {
                if (targ == holder.___stack[i]) { 
                    return;
                }
            }
            targ = targ.parentNode;
            increments++;
        }
        holder.resetMenu();
    };
    
    try {
        window.addEventListener('mousedown', holder.checkClickFunction, false);
    } catch(ex) {
        document.attachEvent('onmousedown', holder.checkClickFunction);
    }
    
    return holder;
}

Node.prototype.addContextMenu = function(items, evtFunc) {

    evtFunc = evtFunc || function(e) {
        return true;
    }

    if (typeof items == 'undefined' || ( !items.length && typeof items != 'function') ) return;
    
    if (typeof this._contextMenuConf == 'undefined') 
        this._contextMenuConf = items; 
    else {
        this._contextMenuConf = items;
        return this;
    }
    
    
    var _this = this;
    
    this._contextClickListener = function(e) {

        e = e || window.event;
        
        //console.log( e );
        
        if (!evtFunc( e )) {
            return true;
        }
        
        if (_this.resetMenu) _this.resetMenu();
        
        var xy = {'x': e.pageX || (e.clientX + (window.pageXOffset || (document.body.parentElement ? document.body.parentElement.scrollLeft : 0) ) ),
                  'y': e.pageY || (e.clientY + (window.pageYOffset || (document.body.parentElement ? document.body.parentElement.scrollTop  : 0) ) )
                 };
        
        _this._popup = new Popup( 
            typeof _this._contextMenuConf == 'function' 
                ? _this._contextMenuConf() 
                : _this._contextMenuConf, 
            _this
        );
        
        _this.___stack = [];
        
        document.body.appendChild(_this._popup);
        
        if (xy.y + _this._popup.offsetHeight > getMaxY()) xy.y -= _this._popup.offsetHeight;
        if (xy.x + _this._popup.offsetWidth > getMaxX()) xy.x -= _this._popup.offsetWidth;
        
        _this._popup.style.left = xy.x+'px';
        _this._popup.style.top  = xy.y+'px';
        
        _this._popup.setExpanded = function() {};
        
        _this._popup.setVisible(true);
    
        _this._checkClickFunction = function(e) {
        
            //console.log(" click!");
        
            var targ =  e.target || window.event.srcElement;
            
            if (!targ) return;
            
            if (targ === _this) { _this.resetMenu(); return; }
            
            var increments = 0;
            if (targ == _this) { return; }
            while (increments <= 6 && targ.parentNode) {
                for (var i=0; i<_this.___stack.length; i++) {
                    if (targ == _this.___stack[i]) { 
                        return;
                    }
                }
                targ = targ.parentNode;
                increments++;
            }
            _this.resetMenu();
        };
        
        
        _this.resetMenu = function() {
            _this._popup.setVisible(false);
            _this._popup = null;
            _this.resetMenu = null;
            _this.___stack = null;
            try {
                window.removeEventListener('mousedown', _this._checkClickFunction, true);
            } catch(ex) {
                document.detachEvent('onmousedown', _this._checkClickFunction);
            }
            _this._checkClickFunction = null;
        };
        
        try {
            window.addEventListener('mousedown', _this._checkClickFunction, true);
        } catch(ex) {
            document.attachEvent('onmousedown', _this._checkClickFunction);
        }
        
        cancelEvent(e);
        
        return false;
    };
    
    
    try {
        this.oncontextmenu = this._contextClickListener;
    } catch(ex) {
        this.setAttribute('oncontextmenu', 'return false;');
        this.onmousedown = this._contextClickListener;
    }
    
    return this;
};