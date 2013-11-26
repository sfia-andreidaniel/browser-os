var ___TREE_DEBUG_MODE___         = false;
var ___TREE_ANIMATION___          = false;
var ___TREE_ANIMATION_SPEED___    = 5;   //lower = smoother, higher = faster
var ___TREE_ANIMATION_PRIORITY___ = 5;  //greater = less cpu, lower = higher cpu

function TreeConnector() {
    var con = $('div', 'DomTreeBranchConnector');
    con._ctype    = 'none';
    con._expanded = null;
    con._last     = false;
    
    con.getConnectorType = function() {
        return con._ctype;
    };
    
    con.setConnectorType = function(cType) {
        switch (cType) {
            case 'pipe':
                con.className = 'DomTreeBranchConnector pipe'; 
                break;
            case 'node':
                con.className = 'DomTreeBranchConnector node'; break;
            case 'none':
                con.className = 'DomTreeBranchConnector'; break;
            default:
                throw 'Invalid connector type "'+cType+'": allowed only "pipe", "node" or "none"';
                break;
        }
        con._ctype = cType;
    };
    
    con.getExpanded = function() {
        return con._expanded;
    };
    
    con.setExpanded = function(bool) {
        if (bool === null) {
                removeStyle(con, 'expanded');
                removeStyle(con, 'collapsed');
        } else
        if (bool === true) {
                removeStyle(con, 'collapsed');
                addStyle(con, 'expanded');
        } else
        if (bool === false) {
                removeStyle(con, 'expanded');
                addStyle(con, 'collapsed');
       } else { 
                throw 'Invalid setter ["'+bool+'"] expanded (allowed only null, true, or false)';
       }
        con._expanded = bool;
    };
    
    con.getLast = function() { 
        return con._last; 
    };
    
    con.setLast = function(bool) {
        if (bool == con._last) return;
        con._last = bool ? true : false;
        switch (con._last) {
            case true:
                addStyle(con, 'last');
                break;
            case false:
                removeStyle(con, 'last');
                break;
        }
    };
    
    try {
        con.__defineGetter__('connectorType', con.getConnectorType);
        con.__defineSetter__('connectorType', con.setConnectorType);
        con.__defineGetter__('expanded',      con.getExpanded);
        con.__defineSetter__('expanded',      con.setExpanded);
        con.__defineGetter__('last',          con.getLast);
        con.__defineSetter__('last',          con.setLast);
    } catch(ex) {
        if (Object.defineProperty) {
            Object.defineProperty(con, 'connectorType', { 'get': con.getConnectorType, 'set': con.setConnectorType });
            Object.defineProperty(con, 'expanded',      { 'get': con.getExpanded,      'set': con.setExpanded });
            Object.defineProperty(con, 'last',          { 'get': con.getLast,          'set': con.setLast });
        } else console.log('Setters and getters are not implemented in your browser!');
    }
    
    return con;
}

function TreeBranch(loadData) {
    
    if (loadData && loadData.node) { 
        var rootNode = loadData.node;
        
        try {
            rootNode.getConnector().removeEventListener('click', rootNode.toggleExpand, false);
            rootNode.removeEventListener('focus', rootNode.notifyFocus, false);
            rootNode.removeEventListener('click', rootNode.notifyActivate, false);
            rootNode.iconHolder.removeEventListener('dblclick', rootNode.toggleExpand, false);
        } catch(ex) {
            rootNode.getConnector().detachEvent('onclick', rootNode.toggleExpand);
            rootNode.detachEvent('onfocus', rootNode.notifyFocus);
            rootNode.detachEvent('onclick', rootNode.notifyActivate);
            rootNode.iconHolder.detachEvent('ondblclick', rootNode.toggleExpand);
        }
        
        rootNode.innerHTML = '';
        rootNode._expanded = null;
        rootNode.father = undefined;
        rootNode._visible = undefined;
        rootNode._firedReady = undefined;
        rootNode._items = undefined;
        rootNode.focus = rootNode.___saveFocusFunc;
        rootNode.connectorFootPrint = undefined;
    }
    else var rootNode = $('div', 'DomTreeBranch');
    
    rootNode.__saveData = (loadData && loadData.items && loadData.expanded) ? { 'expanded': loadData.expanded } : {};
    
    rootNode.inheritConnectors = rootNode.appendChild($('div', 'DomTreeBranchGuidesHolder'));
    rootNode.ownConnector      = rootNode.appendChild($('div', 'DomTreeBranchGuidesHolder'));
    rootNode.iconHolder        = rootNode.appendChild($('div', 'DomTreeBranchIcon'));
    rootNode.captionHolder     = rootNode.appendChild($('div', 'DomTreeBranchCaption'));
    rootNode.inputHolder       = null;
    
    rootNode._caption = '';
    rootNode._icon    = '';
    rootNode._lastNode= true;
    rootNode._expanded= false;
    rootNode._visible = false;
    rootNode._firedReady = false;
    rootNode._inputType = '';
    rootNode._disabled = false;
    rootNode._overlays = loadData.overlays || [];
    rootNode._badges = loadData.badges || [];
    
    if (typeof rootNode._checked == 'undefined') rootNode._checked = false;
    
    rootNode.style.display = 'none';
    
    rootNode.tabIndex = 0;
    
    rootNode.effectStack = [];
    rootNode.effectThreadId = false;
    
    rootNode.effectFunction = function() {
        //if nothing left reminded on effect stack and the thread is running, we stop the thread
        if (!rootNode.effectStack.length && rootNode.effectThreadId) {
            window.clearInterval(rootNode.effectThreadId);
            rootNode.effectThreadId = false;
            return;
        }
        if (!rootNode.effectStack.length) return;
        var command = rootNode.effectStack.shift();
        rootNode.style[command.property] = command.value;
    };
    
    rootNode.startEffect = function() {
        if (rootNode.effectThreadId) return;
        rootNode.effectThreadId = window.setInterval(rootNode.effectFunction, ___TREE_ANIMATION_PRIORITY___);
    };
    
    rootNode.addEffectStep = function(property, value) {
        rootNode.effectStack.push({'property': property, 'value': value});
    };
    
    rootNode.effectMaximize = function() {
        rootNode.addEffectStep('height', '1px');
        rootNode.addEffectStep('display','');
        for (var i=2; i<=20; i+=___TREE_ANIMATION_SPEED___) {
            rootNode.addEffectStep('height', i+'px');
        }
        rootNode.addEffectStep('height', '');
        rootNode.startEffect();
    };
    
    rootNode.effectMinimize = function() {
        for (var i=20; i>=1; i-=___TREE_ANIMATION_SPEED___) {
            rootNode.addEffectStep('height', i+'px');
        }
        rootNode.addEffectStep('display', 'none');
        rootNode.startEffect();
    };
    
    rootNode.updateMinWidth = function() {
        var w = 20;
        w += rootNode._caption.toString().visualWidth();
        w += parseInt( rootNode.ownConnector.style.width );
        w += parseInt( rootNode.inheritConnectors.style.width );
        w += rootNode._icon ? 16 : 0;
        w += rootNode.inputHolder ? 20 : 0;
        rootNode.style.minWidth = w + "px";
    };
    
    rootNode.setConnectors = function(div, num) {
        div.connectors = typeof div.connectors != 'undefined' ? div.connectors : [];
        var n = div.connectors.length;
        if (n > num) {
            do {
                n--;
                
                var dd = div.connectors[n];
                div.connectors.splice(n, 1);
                
                div.removeChild( dd );
                
            } while (n > num);
        } else
        if (n < num) {
            do {
                div.connectors.push(
                    div.appendChild(
                        new TreeConnector()
                    )
                );
                n++;
            } while (n < num);
        }
        
        div.style.width = (div.connectors.length * 16) + 1 + 'px';
        
        rootNode.updateMinWidth();
    };
    
    rootNode.getCaption = function() {
        return rootNode._caption;
    };
    
    rootNode.setCaption = function(str) {
    
        rootNode.captionHolder.innerHTML = '';
        
        if (typeof str == 'string') 
            rootNode.captionHolder.appendChild($text((rootNode._caption = str)));
        else {
            var a = $('a');
            a.appendChild($text(str.anchorText));
            a.setAttribute('href', str.href);
            rootNode.captionHolder.appendChild(a);
            rootNode._caption = str;
        }
        
        rootNode.updateMinWidth();
    };
    
    rootNode.getBadges = function() {
        return rootNode._badges;
    };
    
    rootNode.setBadges = function( arr ) {
        rootNode._badges = arr;
        rootNode.setIcon( rootNode.getIcon() );
        console.log( "set badges: ", arr );
    }
    
    rootNode.getOverlays = function() {
        return rootNode._overlays;
    };
    
    rootNode.setOverlays = function( arr ) {
        rootNode.iconHolder.innerHTML = '';
        for (var i=0; i<arr.length; i++) {
            (function(imgPath) {
                var img = document.createElement('img');
                img.addEventListener('load', function() {
                    rootNode.iconHolder.appendChild( img );
                });
                img.style.position = 'absolute';
                img.src = arr[i];
            })( arr[i] );
        }
    }
    
    rootNode.rename = function() {
        var oldCaption = rootNode._caption;
        
        rootNode.captionHolder.innerHTML = '';
        
        var textControl = rootNode.captionHolder.appendChild(
            (new TextBox(oldCaption)).setAttr(
                'style', 'display: block; position: absolute; left: '+rootNode.captionHolder.offsetLeft+'px; top: 0px; right: 2px; bottom: 0px; border: none; padding: none; margin: none; background-color: white'
            )
        );
        
        rootNode.parentNode.isRenaming = true;
        
        try {
            textControl.focus();
            textControl.select();
        } catch (ex) {
        }
        
        textControl.onRenameReady = function() {
            try {
            
            if (textControl.parentNode)
                textControl.parentNode.removeChild(textControl);

            var newCaption = textControl.value;
            if (newCaption != oldCaption) {
                if (!rootNode.parentNode.onCustomEvent('rename', {
                    'node': rootNode,
                    'oldCaption': oldCaption,
                    'newCaption': newCaption
                })) {
                    rootNode.setCaption(oldCaption);
                } else {
                    rootNode.setCaption(newCaption);
                }
            } else {
                rootNode.setCaption(oldCaption);
            }
            
            rootNode.isRenaming = false;
            delete rootNode.isRenaming;
            rootNode.parentNode.isRenaming = false;
            
            } catch (e) {}
        };
        
        textControl.onCancelRename = function() {
            rootNode.setCaption(oldCaption);
            rootNode.isRenaming = false;
            delete rootNode.isRenaming;
            rootNode.parentNode.isRenaming = false;
            rootNode.focus();
        }
        
        try {
            textControl.addEventListener('click', function() {
                textControl.focus();
                textControl.select();
            }, true);
            textControl.addEventListener('dblclick', function(e) {
                e = e || window.event;
                textControl.select();
                cancelEvent(e);
            }, true);
            
            
            textControl.addEventListener('blur', textControl.onRenameReady);
            textControl.addEventListener('keydown', function(e) {
                e = e || window.event;
                var code = e.keyCode || e.charCode;
                
                switch (code) {
                    case 13:
                        textControl.onRenameReady();
                        break;
                    case 27:
                        textControl.onCancelRename();
                        break;
                }
            }, true);
        } catch(ex) {}
        
        rootNode.isRenaming = true;
    };
    
    rootNode.getIcon = function() {
        return rootNode._icon;
    };
    
    rootNode.setIcon = function(str) {
    
        rootNode._icon = str;
        
        if (!rootNode._badges.length)
            rootNode.iconHolder.style.backgroundImage = str ? 'url("'+str+'")' : 'none';
        else {
            rootNode.iconHolder.style.backgroundImage = "none";
            thumbnailer.create(
                rootNode._icon,
                rootNode._badges,
                16, 16
            ).setUrl( rootNode.iconHolder );
        }

        rootNode.iconHolder.style.width = str ? '16px' : '';
    };
    
    rootNode.getConnector = function() {
        return rootNode.ownConnector.connectors[0];
    };
    
    rootNode.getExpanded = function() {
        return rootNode._expanded;
    };
    
    rootNode.setExpanded = function(bool) {
        if (typeof rootNode._items == 'undefined') return;
        
        if (bool) { if (!rootNode._expanded && !rootNode.parentNode.onCustomEvent('expand', rootNode)) return; } 
        else { if (rootNode._expanded && !rootNode.parentNode.onCustomEvent('collapse', rootNode)) return; }
        
        rootNode._expanded = bool ? true : false;
        
        rootNode.getConnector().setExpanded( !rootNode._items.length ? null : bool );
        
        if (bool && rootNode.father)
            rootNode.father.setExpanded( true );
        
        if (rootNode._items) {
            for (var i=0; i<rootNode._items.length; i++) {
                rootNode._items[i].setVisible( rootNode._expanded );
            }
        }
        
        switch (rootNode._expanded) {
            case false: rootNode.setIcon(rootNode._icon.toString().replace('opened','closed').replace('collapsed', 'expanded')); break;
            case true: 
                rootNode.setIcon(rootNode._icon.toString().replace('closed','opened').replace('expanded', 'collapsed')); 
                
                var me = rootNode;
                while (me.father) {
                    me = me.father;
                    if (!me.getExpanded()) me.setExpanded( true );
                }
                
                break;
        }
    };
    
    rootNode.getVisible = function() {
        return rootNode._visible;
    };
    
    rootNode.setVisible = function(bool) {
        if (rootNode._visible == bool) return;
        
        rootNode._visible = bool;
        
        if (rootNode._items) {
            if (!bool) {
                for (var i=0; i<rootNode._items.length; i++) {
                    rootNode._items[i].setVisible( false );
                }
            } else {
                if (rootNode.getExpanded()) {
                    for (var i=0; i<rootNode._items.length; i++) {
                        rootNode._items[i].setVisible( true );
                    }
                }
            }
        }
        
        if (___TREE_ANIMATION___) {
            if (bool) rootNode.effectMaximize(); else rootNode.effectMinimize();
        } else {
            rootNode.style.display = bool ? '' : 'none';
        }
    };
    
    rootNode.getIsFolder = function() {
        return typeof rootNode._items == 'undefined' ? false : true;
    };
    
    rootNode.getParentNodeOrder = function() {
        if (!rootNode.father) return 0;
        for (var i=0; i<rootNode.father._items.length; i++) {
            if (rootNode.father._items[i] == rootNode) return i;
        }
        return rootNode.father._items.length;
    };
    
    rootNode.getItems = function() {
        return typeof rootNode._items == 'undefined' ? null : rootNode._items;
    };
    
    rootNode.setItems = function(arr) {
        
        if ( typeof arr == 'undefined' ) {
            delete rootNode._items;
            return true;
        }
        
        rootNode._items = [];
        var nwItem;

        for (var i=0; i<arr.length; i++) {
            nwItem = rootNode.addSubItem(
                new TreeBranch(arr[i])
            );
            
            if (arr[i].type) {
                nwItem.setInputType ( arr[i].type )
                nwItem.setChecked( arr[i].checked || false );
            }
            
            if (typeof arr[i].items != 'undefined')
                nwItem.setItems( arr[i].items );
        }
        
        rootNode.setIcon(rootNode._icon || (rootNode.getExpanded() ? 'img/16x16/folder-online-16x16.png' : 'img/folder-online-16x16.png'));
        
        if (rootNode.__saveData && rootNode.__saveData.expanded ) {
            rootNode.setExpanded( rootNode.__saveData.expanded );
            rootNode.__saveData = null;
        }
    };
    
    rootNode.getLastNode = function() {
        return rootNode._lastNode;
    };
    
    rootNode.setLastNode = function(bool) {
        rootNode.getConnector().setLast( bool );
        rootNode._lastNode = bool;
    };
    
    rootNode.getToObject = function() {
        var out = {
            'id': rootNode.nodeID,
            'name': rootNode.getCaption(),
            'icon': rootNode.getIcon(),
            'expanded': rootNode.getExpanded(),
            'node': rootNode,
            'overlays': rootNode.getOverlays(),
            'badges': rootNode.getBadges()
        };
        
        if (rootNode.getInputType()) {
            out.type = rootNode.getInputType();
            out.checked = rootNode.getChecked();
        }
        
        if (rootNode._items) {
            out.items = [];
            for (var i=0; i<rootNode._items.length; i++) {
                out.items.push( rootNode._items[i].getToObject() );
            }
        }
        
        return out;
    };
    
    rootNode.getMoveMarker = function() {
        return rootNode.__moveMethod;
    };
    
    rootNode.setMoveMarker = function(str) {
        if (!rootNode.father) {
            if (rootNode.parentNode.___markerElement) {
                rootNode.parentNode.___markerElement.setMoveMarker( '' );
                rootNode.parentNode.___markerElement = false;
            }
            return;
        }
        if (rootNode.parentNode.___markerElement && (rootNode.parentNode.___markerElement != rootNode)) {
            rootNode.parentNode.___markerElement.setMoveMarker( '' );
            rootNode.parentNode.___markerElement = rootNode;
        }
        switch (str) {
            case 'before': 
                removeStyle(rootNode, 'markerAfter');
                addStyle(rootNode, 'markerBefore');
                rootNode.style.backgroundPosition = (rootNode.iconHolder.offsetLeft - 2) + 'px 0px';
                
                addStyle(rootNode.father, 'dropElement');
                
                break;
            case 'after':
                removeStyle(rootNode, 'markerBefore');
                addStyle(rootNode, 'markerAfter');

                rootNode.style.backgroundPosition = (rootNode.iconHolder.offsetLeft - 2) + 'px ' + (rootNode.offsetHeight - 6)+ 'px';
                
                addStyle(rootNode.father, 'dropElement');
                
                break;
            default:
                removeStyle(rootNode, 'markerAfter');
                removeStyle(rootNode, 'markerBefore');
                rootNode.style.backgroundPosition = '';
                
                removeStyle(rootNode.father, 'dropElement');
                
                break;
        }
        
        rootNode.parentNode.___markerElement = rootNode;
        
        rootNode.__moveMethod = str;
    };
    
    rootNode.getInputType = function() {
        return rootNode._inputType;
    };
    
    rootNode.inputTypeClickListener = function(e) {
        if (rootNode._disabled) { 
            cancelEvent(e || window.event);
            return;
        }
        
        //window.__lNode = rootNode;
        
        rootNode.setChecked( rootNode.inputHolder._input.checked );
        
        if (rootNode._items && (rootNode.inputHolder._input.getAttribute('type') == 'checkbox') && rootNode.parentNode.___clickPropagation.indexOf('children') != -1) {
            for (var i=0; i<rootNode._items.length; i++) {
                rootNode._items[i].setChecked(rootNode.getChecked(), true, true);
            }
        } else
        if (rootNode.father && (rootNode.inputHolder._input.getAttribute('type') == 'radio') &&
            rootNode.inputHolder._input.checked
           ) {
            for (var i=0; i<rootNode.father._items.length; i++)
                if (rootNode.father._items[i] != rootNode)
                    rootNode.father._items[i].setChecked( false );
        }
    };
    
    rootNode.setInputType = function(str) {
        if (str == rootNode._inputType) return;
        
        if (!str && rootNode._inputType) {
            rootNode.removeChild(rootNode.inputHolder);
            rootNode.inputHolder = null;
            rootNode._inputType = str;
        }
        
        switch (str) {
            case 'checkbox': {
                if (!rootNode.inputHolder) 
                    rootNode.inputHolder = $('div', 'DomTreeBranchInputHolder');
                    rootNode.insertBefore(
                        rootNode.inputHolder,
                        rootNode.captionHolder
                    );
                rootNode.inputHolder.innerHTML = '';
                var ckbox = $('input'); ckbox.setAttribute('type', 'checkbox');
                rootNode.inputHolder._input = rootNode.inputHolder.appendChild(ckbox);
                try {
                    rootNode.inputHolder._input.addEventListener('click', rootNode.inputTypeClickListener, true);
                    rootNode.inputHolder._input.addEventListener('dblclick', function(e) { cancelEvent(e); return false; }, true);
                } catch(ex) {
                    rootNode.inputHolder._input.attachEvent('onclick', rootNode.inputTypeClickListener);
                    rootNode.inputHolder._input.attachEvent('ondblclick', function(e) { cancelEvent(e); return false; }, true);
                }
                break;
            }
            case 'radio': {
                if (!rootNode.inputHolder) 
                    rootNode.inputHolder = $('div', 'DomTreeBranchInputHolder');
                    rootNode.insertBefore(
                        rootNode.inputHolder,
                        rootNode.captionHolder
                    );
                rootNode.inputHolder.innerHTML = '';
                var ckbox = $('input'); ckbox.setAttribute('type', 'radio');
                rootNode.inputHolder._input = rootNode.inputHolder.appendChild(ckbox);
                try {
                    rootNode.inputHolder._input.addEventListener('click', rootNode.inputTypeClickListener, true);
                    rootNode.inputHolder._input.addEventListener('dblclick', function(e) { cancelEvent(e); return false; }, true);
                } catch(ex) {
                    rootNode.inputHolder._input.attachEvent('onclick', rootNode.inputTypeClickListener);
                    rootNode.inputHolder._input.attachEvent('ondblclick', function(e) { cancelEvent(e); return false; }, true);
                }
                break;
            }
            default: 
                if (rootNode.inputHolder) {
                    rootNode.removeChild(rootNode.inputHolder);
                    rootNode.inputHolder = null;
                }
                break;
        }
        rootNode._inputType = str;
    };
    
    rootNode.getChecked = function() {
        return rootNode._checked;
    };
    
    rootNode.setChecked = function(bool, propagate, noRootCheck) {
        rootNode._checked = bool;
        
        //window.lrnode = rootNode;
        
        if (rootNode.inputHolder && rootNode.inputHolder._input)
            rootNode.inputHolder._input.checked = bool
         
        if (propagate && rootNode._items && rootNode.parentNode.___clickPropagation.indexOf('children') != -1) {
            for (var i=0; i<rootNode._items.length; i++) {
                rootNode._items[i].setChecked(bool, propagate, true);
            }
        }
        //also propagate to parents, if the input type is checkbox
        if (!noRootCheck && 
            rootNode._inputType == 'checkbox' && 
            rootNode.father && 
            rootNode.father._inputType == 'checkbox' &&
            rootNode.parentNode.___clickPropagation.indexOf('parent') != -1
        ) {
            
            var checkParent = false;
            
            if (bool) checkParent = true;
            else {
                for (var i=0; i<rootNode.father._items.length; i++) {
                    if (rootNode.father._items[i]._inputType == 'checkbox' &&
                        rootNode.father._items[i].getChecked()
                       ) {
                        checkParent = true;
                        break;
                    }
                }
            }
            
            rootNode.father.setChecked(checkParent, false, false);
        }
    };
    
    rootNode.getDisabled = function() {
        return rootNode._disabled;
    };
    
    rootNode.setDisabled = function(bool) {
        rootNode._disabled = bool;
        
        (bool ? addStyle : removeStyle)(rootNode, 'DomTreeBranchDisabled');
        
        try {
            rootNode.inputHolder._input.disabled = bool;
        } catch(ex) {}
    };
    
    try {
        rootNode.__defineGetter__('caption',         rootNode.getCaption  );
        rootNode.__defineSetter__('caption',         rootNode.setCaption  );
        rootNode.__defineGetter__('icon',            rootNode.getIcon     );
        rootNode.__defineSetter__('icon',            rootNode.setIcon     );
        rootNode.__defineGetter__('connector',       rootNode.getConnector);
        rootNode.__defineGetter__('expanded',        rootNode.getExpanded );
        rootNode.__defineSetter__('expanded',        rootNode.setExpanded );
        rootNode.__defineGetter__('visible',         rootNode.getVisible  );
        rootNode.__defineSetter__('visible',         rootNode.setVisible  );
        rootNode.__defineGetter__('isFolder',        rootNode.getIsFolder);
        rootNode.__defineGetter__('parentNodeOrder', rootNode.getParentNodeOrder);
        rootNode.__defineGetter__('items',           rootNode.getItems);
        rootNode.__defineSetter__('items',           rootNode.setItems);
        rootNode.__defineGetter__('lastNode',        rootNode.getLastNode);
        rootNode.__defineSetter__('lastNode',        rootNode.setLastNode);
        rootNode.__defineGetter__('toObject',        rootNode.getToObject);
        rootNode.__defineGetter__('moveMarker',      rootNode.getMoveMarker);
        rootNode.__defineSetter__('moveMarker',      rootNode.setMoveMarker);
        rootNode.__defineGetter__('inputType',       rootNode.getInputType);
        rootNode.__defineSetter__('inputType',       rootNode.setInputType);
        rootNode.__defineGetter__('checked',         rootNode.getChecked);
        rootNode.__defineSetter__('checked',         rootNode.setChecked);
        rootNode.__defineGetter__('disabled',        rootNode.getDisabled);
        rootNode.__defineSetter__('disabled',        rootNode.setDisabled);
        rootNode.__defineGetter__('overlays',        rootNode.getOverlays);
        rootNode.__defineSetter__('overlays',        rootNode.setOverlays);
        rootNode.__defineGetter__('badges',          rootNode.getBadges);
        rootNode.__defineSetter__('badges',          rootNode.setBadges);
    } catch(ex) {
    
        if (!Object.defineProperty) console.log( 'Getters and Setters functionality is not supported by your version of browser' ); 
        else {
            Object.defineProperty(rootNode, 'caption',         { 'get': rootNode.getCaption,        'set': rootNode.setCaption  });
            Object.defineProperty(rootNode, 'icon',            { 'get': rootNode.getIcon,           'set': rootNode.setIcon     });
            Object.defineProperty(rootNode, 'connector',       { 'get': rootNode.getConnector                                   });
            Object.defineProperty(rootNode, 'expanded',        { 'get': rootNode.getExpanded,       'set': rootNode.setExpanded });
            Object.defineProperty(rootNode, 'visible',         { 'get': rootNode.getVisible,        'set': rootNode.setVisible  });
            Object.defineProperty(rootNode, 'isFolder',        { 'get': rootNode.getIsFolder                                    });
            Object.defineProperty(rootNode, 'parentNodeOrder', { 'get': rootNode.getParentNodeOrder                             });
            Object.defineProperty(rootNode, 'items',           { 'get': rootNode.getItems,          'set': rootNode.setItems    });
            Object.defineProperty(rootNode, 'lastNode',        { 'get': rootNode.getLastNode,       'set': rootNode.setLastNode });
            Object.defineProperty(rootNode, 'toObject',        { 'get': rootNode.getToObject                                    });
            Object.defineProperty(rootNode, 'moveMarker',      { 'get': rootNode.getMoveMarker,     'set': rootNode.setMoveMarker });
            Object.defineProperty(rootNode, 'inputType',       { 'get': rootNode.getInputType,      'set': rootNode.setInputType });
            Object.defineProperty(rootNode, 'checked',         { 'get': rootNode.getChecked,        'set': rootNode.setChecked });
            Object.defineProperty(rootNode, 'disabled',        { 'get': rootNode.getDisabled,       'set': rootNode.setDisabled });
            Object.defineProperty(rootNode, 'overlays',        { 'get': rootNode.getOverlays,        'set': rootNode.setOverlays });
            Object.defineProperty(rootNode, 'badges',          { 'get': rootNode.getBadges,          'set': rootNode.setBadges });
        }
    }
    
    rootNode.setConnectors(rootNode.ownConnector, 1);
    rootNode.ownConnector.connectors[0].___expandConnector = true;
    rootNode.getConnector().setConnectorType('node');
    rootNode.setOverlays( rootNode._overlays );
    
    rootNode.getLastSibling = function() {
        if (rootNode._items && rootNode._items.length) {
            var lNode = rootNode._items[rootNode._items.length - 1];
            return lNode.getLastSibling();
        } else 
        return rootNode;
    };
    
    rootNode.addSubItem = function(branch) {
        
        rootNode._items = rootNode._items || [];
        
        if (rootNode._items.length)
            rootNode._items[rootNode._items.length - 1].setLastNode( false );
        
        if (!rootNode.nextSibling) rootNode.parentNode.appendChild(branch); else {
            var lastSibling = rootNode.getLastSibling();
            if (lastSibling.nextSibling) rootNode.parentNode.insertBefore(branch, lastSibling.nextSibling);
            else rootNode.parentNode.appendChild(branch);
        }
        
        rootNode._items.push(branch);
        
        if (rootNode.getConnector().getExpanded() === null)
            rootNode.getConnector().setExpanded( false );
        
        rootNode.setParentRelationship(branch);
        
        branch.setLastNode( true );
        
        try { rootNode.parentNode.onCustomEvent('ready', branch); } catch(ex) { }
        
        return branch;
    };
    
    //this function is used to insert a JSON structure at provided childs index
    rootNode.insertBranchDataAt = function(loadData, atIndex, paintConnectors) {
        rootNode._items = rootNode._items || []; //initialize items if allready not initialized
        
        var newBranch = new TreeBranch(loadData); //initialize branch
        
        if (atIndex > rootNode._items.length) {
            
            rootNode.addSubItem(newBranch);
            
            if (typeof loadData.items != 'undefined')
                newBranch.setItems(loadData.items);
            
            rootNode.setIcon(rootNode._icon || (rootNode.getExpanded() ? 'img/folder_opened.png' : 'img/folder_closed.png'));
            
            return newBranch;
        }
        
        atIndex = atIndex < 0 ? 0 : atIndex;
        
        if (atIndex == 0) {
            //if we insert this at beginning, we insert the branch before the nextSibling of the rootNode.
            //if root node does not have a nextSibling, we insert the branch at the end of the parent of rootNode
            if (rootNode.nextSibling)
                rootNode.parentNode.insertBefore(newBranch, rootNode.nextSibling);
            else
                rootNode.parentNode.appendChild(newBranch);
        } else {
            //we obtain the last sibling after which we should insert the branch
            var lastSibling = rootNode._items[atIndex-1].getLastSibling();
            
            //if lastSibling has a nextSibling, we insert the branch right before it,
            //otherwise we insert the branch at the end of the parent of rootNode
            if (lastSibling && lastSibling.nextSibling)
                rootNode.parentNode.insertBefore(newBranch, lastSibling.nextSibling);
            else
                rootNode.parentNode.appendChild(newBranch);
        }
        
        //after insertion occured, we insert the newBranch in the _items of rootNode
        rootNode._items.splice(atIndex, 0, newBranch);
        
        
        newBranch.setLastNode(atIndex == rootNode._items.length - 1 ? true : false);
        
        if (rootNode.getConnector().getExpanded() === null) 
            rootNode.getConnector().setExpanded( ( loadData.expanded ? loadData.expanded : false ) );
        
        rootNode.setParentRelationship(newBranch);
        
        rootNode.parentNode.onCustomEvent('ready', newBranch);
        
        if (typeof loadData.items != 'undefined') newBranch.setItems( loadData.items );
        
        newBranch.setVisible( rootNode.getExpanded() );
        
        //we maintain the input type and it's checked state
        if (typeof loadData.type != 'undefined' ) {
            newBranch.setInputType(loadData.type);
            newBranch.setChecked(loadData.checked);
        }

        for (var i=0; i<rootNode._items.length-1; i++)
            rootNode._items[i].setLastNode( false );
        
        if (rootNode._items.length > 1) {
            rootNode._items[rootNode._items.length - 1].setLastNode( true );
        }
        
        paintConnectors = (typeof paintConnectors == 'undefined') ? true : paintConnectors;
        
        if (paintConnectors) rootNode.repaintConnectors(rootNode.connectorFootPrint);
        
        return newBranch;
    };
    
    rootNode.swapChildBranches = function(childIndex1, childIndex2, paintConnectors) {
        var a = Math.min(childIndex1, childIndex2);
        var b = Math.max(childIndex1, childIndex2);
        
        var correctLastNode = (b == (rootNode._items.length - 1));
        
        var ch1 = rootNode._items[a].toObject;
        var ch2 = rootNode._items[b].toObject;
        
        rootNode.parentNode.deleteNode(rootNode._items[b], true);
        rootNode.parentNode.deleteNode(rootNode._items[a], true);
        
        paintConnectors = (typeof paintConnectors == 'undefined') ? true : paintConnectors;
        
        var b1 = rootNode.insertBranchDataAt(ch2, a, false);
        var b2 = rootNode.insertBranchDataAt(ch1, b, false);
        
        if (correctLastNode) {
            for (var i=0; i<rootNode._items.length-1; i++) {
                rootNode._items[i].setLastNode( false );
            }
            rootNode._items[rootNode._items.length-1].setLastNode( true );
        }
        
        if (paintConnectors) rootNode.repaintConnectors(rootNode.connectorFootPrint);
    };
    
    if (typeof(loadData) != 'undefined') {
        rootNode.setCaption( loadData.name || '' );
        rootNode.nodeID = loadData.id   || -1 ;
        rootNode.setIcon( typeof(loadData.icon) == 'undefined' ? (!loadData.items ? 'img/16x16/file.png' : 'img/16x16/folder-online-16x16.png') : loadData.icon );
        rootNode.setInputType( loadData.type || (rootNode.father ? rootNode.father.getInputType() : null));
        rootNode.setDisabled(loadData.disabled || false);
        if (typeof(loadData.expanded) != 'undefined') { 
            rootNode.setExpanded( loadData.expanded );
        }
    }
    
    rootNode.setParentRelationship = function (aChild) {
         aChild.father = rootNode;
         aChild.setInputType( rootNode.getInputType() );
         aChild.setChecked( aChild._checked );
         aChild.repaintConnectors();
    };
    
    rootNode.clearConnectors = function() {
        rootNode.setConnectors(rootNode.inheritConnectors, 0);
        if (rootNode._items && rootNode._items.length) {
            for (var i=0; i<rootNode._items.length; i++) {
                rootNode._items[i].clearConnectors();
            }
        }
    };
    
    rootNode.repaintConnectors = function( strstack ) {

         try {
            var myConnectors = rootNode.father.inheritConnectors.connectors || [];
            rootNode.setConnectors(rootNode.inheritConnectors, myConnectors.length + 1);
         } catch (ex) {
            rootNode.setConnectors(rootNode.inheritConnectors, 0);
         }
         
         rootNode.connectorFootPrint = strstack;
         
         if (typeof(strstack) != 'undefined') {
            for (var i=0; i<rootNode.inheritConnectors.connectors.length; i++) {
                if (strstack.charAt(i) == '0') 
                    rootNode.inheritConnectors.connectors[i].setConnectorType( 'none' );
                else 
                    rootNode.inheritConnectors.connectors[i].setConnectorType( 'pipe' );
            }
            if (typeof(rootNode._items) != 'undefined') {
                for (var i=0; i<rootNode._items.length; i++) {
                    rootNode._items[i].repaintConnectors( strstack.concat (
                        rootNode.getLastNode() ? '0' : '1'
                    ) );
                }
            }
         }
    };
    
    rootNode.setVisible( false );
    
    rootNode.toggleExpand = function(e) {
        cancelEvent(e);
        rootNode.setExpanded( !rootNode.getExpanded() );
        return false;
    };
    
    rootNode.toggleExpandClick = function(e) {
        cancelEvent(e);
        rootNode.setExpanded( !rootNode.getExpanded() );
        return false;
    };
    
    rootNode.___saveFocusFunc = rootNode.focus;
    
    rootNode.notifyFocus = function() {
        try {
            rootNode.parentNode.setFocusedNode( rootNode );
        } catch (e) {
            console.warn("Tree.Node.notifyFocus: Could not focus node: " + rootNode.nodeID );
        }
    };
    
    rootNode.focus = function() {
        if (rootNode.isRenaming) {
            return;
        }
        var me = rootNode;
        while (me.father) {
            me = me.father;
            me.setExpanded( true );
        }
        rootNode.___saveFocusFunc();
        rootNode.notifyFocus();
    };
    
    rootNode.notifyActivate = function(e) {
        rootNode.parentNode.setSelectedNode( rootNode );
    };
    
    rootNode.deleteNode = function() {
        //first, delete all sub nodes if any
        if (rootNode._items && rootNode._items.length) {
            while (rootNode._items.length) {
                rootNode._items[0].deleteNode();
                rootNode._items.splice(0,1);
            }
        }

        rootNode.parentNode.___deletedNodes.push(rootNode);
        
        //finally, delete myself
        rootNode.parentNode.removeChild(rootNode);
    };
    
    try {
        rootNode.getConnector().addEventListener('click', rootNode.toggleExpandClick, false);
        rootNode.addEventListener('focus',           rootNode.notifyFocus, false);
        rootNode.addEventListener('click',           rootNode.notifyActivate, false);
        rootNode.iconHolder.addEventListener('dblclick',        rootNode.toggleExpand, false);
    } catch(ex) {
        rootNode.getConnector().attachEvent('onclick', rootNode.toggleExpand);
        rootNode.attachEvent('onfocus', rootNode.notifyFocus);
        rootNode.attachEvent('onclick', rootNode.notifyActivate);
        rootNode.iconHolder.attachEvent('ondblclick', rootNode.toggleExpand);
    }
    
    rootNode.createClone = function(container) {
        
        var needNormalize = false;
        var normalizeLeft = 0;
        
        if (!container) { 
            needNormalize = true; 
            normalizeLeft = rootNode.inheritConnectors.connectors.length;
            container = $('div', 'DomTreeBranchClone');
            container.items = [];
            
            container.__StatusBar = container.appendChild($('div', 'CloneStatusBar'));
            
            container.setCaption = function(str) {
                this.__StatusBar.innerHTML = '';
                this.__StatusBar.appendChild( document.createTextNode(str) );
            };
            
            container.setOk = function(bool) {
                if (!bool) removeStyle(container.__StatusBar, 'ok');
                else addStyle(container.__StatusBar, 'ok');
            };
            
            try {
                container.__defineSetter__('caption', container.setCaption );
                container.__defineSetter__('ok',      container.setOk      );
            } catch(ex) {
                if (Object.defineProperty) {
                    Object.defineProperty(container, 'caption', { 'set': container.setCaption });
                    Object.defineProperty(container, 'ok',      { 'set': container.setOk });
                } else console.log('Your browser does not support getters and setters');
            }
        }
        
        //we don't add more than 5 items
        if (container.items.length > 10) return;
        
        //first insert myself
        var myClone = rootNode.cloneNode(true);
        removeStyle(myClone, 'selectedItem');
        container.appendChild(myClone);
        
        container.items.push(myClone);
        
        //if container is expanded, we insert the subnodes, otherwise it don't have sense
        if (rootNode.getExpanded()) { 
            //after that, insert the sub-nodes
            if (rootNode._items && rootNode._items.length) {
                for (var i=0; i<rootNode._items.length; i++) {
                    rootNode._items[i].createClone(container);
                }
            }
        }
        
        if (needNormalize) {
            var cHolder;
            
            for (var i=0; i<container.items.length; i++) {
                
                cHolder = container.items[i].firstChild;
                
                for (var j=0; j<normalizeLeft; j++) {
                    cHolder.removeChild(cHolder.firstChild);
                }
                
                if (cHolder.firstChild) {
                    cHolder.firstChild.className = 'DomTreeBranchConnector';
                }
                
                cHolder.style.width = parseInt(cHolder.style.width) - (16 * normalizeLeft) + 'px';
            }
            
            myClone.firstChild.nextSibling.firstChild.className = 'DomTreeBranchConnector';
            
        }
        
        return container;
    };
    
    rootNode.canAcceptElement = function(branchNode) {
        if (!rootNode._items || branchNode.father == rootNode || branchNode == rootNode) return false;
        
        var b = rootNode;
        if (b.father) {
            do {
                if (b.father == branchNode) return false;
                b = b.father;
            } while (b.father);
        }
        return true;
    };

    
    rootNode.isChildOf = function(anotherBranch) {
        var me = rootNode;
        if (me == anotherBranch) return true;
        while (me.father) {
            me = me.father;
            if (me == anotherBranch) return true;
        }
        return false;
    };
    
    rootNode.getMoveMethod = function(x,y) {
        var yS = rootNode.offsetTop;
        var yE = rootNode.offsetTop + rootNode.offsetHeight;
        var yM = Math.floor((yS + yE) / 2);
        return y < yM ? 'before' : 'after';
    };
    
    rootNode.__moveMethod = '';
    
    rootNode.addEventListener( 'dblclick', function(e) {
        try {
            rootNode.parentNode.onCustomEvent( 'node-doubleclick', rootNode );
        } catch (e) {
            console.warn( e );
        }
    }, true );

    return rootNode;
}

function Tree(loadData, plugin) {
    var holder = $('div', 'DomTree');
    
    if (typeof plugin != 'undefined') {
        loadData = plugin(loadData);
//         console.log(loadData);
    }
    
    try { holder.onselectstart = function(){return false}; } catch(ex) {}
    
    holder.addCustomEventListener('drop', function() {
        console.warn("Warning: tree.onCustomEvent('drop') has been changed to: tree.onCustomEvent('internal-drop'), in order to make room for MakeDragable() feature");
        return true;
    } );
    
    holder.tabIndex = 0;
    
    holder.rootNode           = holder.appendChild(new TreeBranch([]));
    
    holder.rootNode.setCaption( loadData.name );
    holder.rootNode.nodeID    = loadData.id;
    holder.rootNode._badges = loadData.badges || [];
    holder.rootNode.setIcon( loadData.icon || 'img/folder_closed.png');
    holder.rootNode.setInputType( loadData.type || null );
    
    if (loadData.items) holder.rootNode.setItems( loadData.items );
    
    holder.rootNode.getConnector().setConnectorType('none');
    holder.rootNode.setExpanded( false );
    holder.rootNode.setVisible( true );
    
    holder.rootNode.repaintConnectors('');

    holder.___activeNode = null;
    holder.___selectedNode = null;
    holder.___dropElement = null;
    holder.___deletedNodes = [];
    holder.___dropAfterElement = null;
    holder.___dropBeforeElement = null;
    holder.___dragAndDrop = false;
    holder.___kbDelete = false;
    holder.___clickPropagation = ['parent', 'children']; //may contain any combination of: parent, children, or be empty
    
    holder.___isDragging = false;
    holder.___originDragElement = false;
    holder.___dragClone  = false;
    holder.___firedDrag = false;
    holder.___markerElement = false;
    
    holder.getFocusedNode = function() {
        return holder.___activeNode;
    };
    
    holder.setFocusedNode = function(treeBranch) {
        if (holder.___activeNode != treeBranch) holder.onCustomEvent('focus', treeBranch);
        holder.___activeNode = treeBranch;
        if (holder.___selectedNode === null) holder.setSelectedNode( treeBranch );
    };
    
    holder.getSelectedNode = function() {
        return holder.___selectedNode;
    };
    
    holder.setSelectedNode = function(treeBranch) {
        
        if (holder.___selectedNode != treeBranch) holder.onCustomEvent('change', treeBranch);
        
        if (holder.___selectedNode) removeStyle(holder.___selectedNode, 'selectedItem');
        holder.___selectedNode = treeBranch;
        if (holder.___selectedNode) addStyle(holder.___selectedNode, 'selectedItem');
        holder.setFocusedNode( treeBranch );
        try { holder.___activeNode.focus(); } catch(ex) { /*console.log('warning: '+ex.stack);*/ }
        
    };
    
    holder.getDropElement = function() {
        return holder.___dropElement;
    };
    
    holder.setDropElement = function(treeBranch) {
        if (holder.___dropElement)
            removeStyle(holder.___dropElement, 'dropElement');
        holder.___dropElement = treeBranch ? treeBranch : null;
        if (holder.___dropElement) addStyle(holder.___dropElement, 'dropElement');
    };
    
    holder.getDragAndDrop = function() {
        return holder.___dragAndDrop;
    };
    
    holder.setDragAndDrop = function(bool) {
        holder.___dragAndDrop = bool ? true : false;
    };
    
    holder.getKbDelete = function() {
        return holder.___kbDelete;
    };
    
    holder.setKbDelete = function(bool) {
        holder.___kbDelete = bool ? true : false;
    };
    
    holder.getClickPropagation = function() {
        return holder.___clickPropagation;
    };
    
    holder.setClickPropagation = function(arr) {
        if (!arr || !arr.length)
            holder.___clickPropagation = [];
        else {
            var propag = [];
            for (var i=0; i<arr.length; i++) {
                if (!/^parent|children$/i.test( arr[i] ))
                    throw "Invalid clickPropagation value: " + arr[i];
                else {
                    var p = arr[i].toLowerCase();
                    if (propag.indexOf(p) == -1)
                        propag.push( p );
                }
            }
            holder.___clickPropagation = propag;
        }
    }
    
    Object.defineProperty(holder, 'focusedNode',        { 'get': holder.getFocusedNode, 'set': holder.setFocusedNode }  );
    Object.defineProperty(holder, 'selectedNode',       { 'get': holder.getSelectedNode,'set': holder.setSelectedNode} );
    Object.defineProperty(holder, 'dropElement',        { 'get': holder.getDropElement, 'set': holder.setDropElement }  );
    Object.defineProperty(holder, 'dragAndDrop',        { 'get': holder.getDragAndDrop, 'set': holder.setDragAndDrop } );
    Object.defineProperty(holder, 'kbDelete',           { 'get': holder.getKbDelete,    'set': holder.setKbDelete } );
    Object.defineProperty(holder, 'clickPropagation',   { 'get': holder.getClickPropagation, 'set': holder.setClickPropagation });

    (function() {
        var internalTooltip = true;
        
        Object.defineProperty( holder, "internalDragTooltipVisible", {
            "get": function() {
                return internalTooltip;
            },
            "set": function( boolValue ) {
                internalTooltip = !!boolValue;
            }
        } );
        
    } )();

    (function() {
        var acceptExternal = false;
        
        Object.defineProperty( holder, 'acceptExternalData', {
            
            "get": function() {
                return acceptExternal;
            },
            
            "set": function( boolValue ) {
            
                boolValue = !!boolValue;
            
                acceptExternal = boolValue;
            
                holder.internalTooltip = !boolValue;

                if (boolValue) {
                    MakeDropable( holder, {
                        "dragInElements": true
                    } );
                
                    holder.addCustomEventListener( 'dragenter', function() {
                        if (acceptExternal)
                            addStyle( holder, 'dragEnter' );
                    } );
            
                    holder.addCustomEventListener( 'dragleave', function() {
                        if (acceptExternal)
                            removeStyle( holder, 'dragEnter' );
                    } );
                    
                    holder.addCustomEventListener( 'dragmove-in', function( treeBranch ) {
                        holder.selectedNode = treeBranch;
                    } );
                    
                } else {
                    holder.isDropable = false;
                }
            }
            
        } );
    })();

    holder.focusNextNode = function() {
        var cNode = holder.___activeNode || holder.rootNode;
        while (cNode.nextSibling) {
            cNode = cNode.nextSibling;
            if (cNode.getVisible()) {
                cNode.focus();
                return;
            }
        }
    };
    
    holder.focusPreviousNode = function() {
        var cNode = holder.___activeNode || holder.rootNode;
        while (cNode.previousSibling) {
            cNode = cNode.previousSibling;
            if (cNode.getVisible()) {
                cNode.focus();
                return;
            }
        }
    };
    
    holder.expandNode = function() {
        if (holder.___activeNode && !holder.___activeNode._items) {
            holder.focusNextNode();
            return;
        }
        if (!holder.___activeNode || typeof holder.___activeNode._items == 'undefined') return;
        if (holder.___activeNode.getExpanded() != true) holder.___activeNode.setExpanded( true );
        else holder.focusNextNode();
    };
    
    holder.collapseNode= function() {
        if (holder.___activeNode && !holder.___activeNode._items) {
            holder.focusPreviousNode();
            return;
        }
        if (!holder.___activeNode || typeof holder.___activeNode._items == 'undefined') return;
        if (holder.___activeNode.getExpanded() != false) holder.___activeNode.setExpanded( false );
        else holder.focusPreviousNode();
    };
    
    holder.deleteNode = function(aNode, noTriggers) {

        aNode = aNode || holder.___selectedNode;
        
        if (!aNode) return;
        
        if (aNode == holder.rootNode) return;
        
        if (!noTriggers && !holder.onCustomEvent('delete', aNode)) return;

        var saveObj = aNode.getToObject();

        aNode.deleteNode();
        
        //now, delete aNode from it's parent _items stack
        if (aNode.father) {
            for (var i=0; i<aNode.father._items.length; i++) {
                if (aNode.father._items[i] == aNode) {
                    aNode.father._items.splice(i,1);
                    break;
                }
            }
        }
        
        //check through @.___deletedNodes to see if any node was focused or active
        for (var i=0; i<holder.___deletedNodes.length; i++) {
            if (holder.___activeNode == holder.___deletedNodes[i]) {
                holder.setFocusedNode( aNode.father ? aNode.father : holder.rootNode );
            }
            if (holder.___selectedNode == holder.___deletedNodes[i]) {
                holder.setSelectedNode(  aNode.father ? aNode.father : holder.rootNode );
            }
        }
        
        holder.___deletedNodes = [];
        
        if (aNode.getLastNode() && aNode.father._items.length) {
            var lNode = aNode.father._items [ aNode.father._items.length - 1 ];
            lNode.setLastNode( true );
            lNode.repaintConnectors( lNode.connectorFootPrint );
        }
        
        if (aNode.father._items.length == 1) {
            aNode.father._items[0].setLastNode( true );
        }
        
        return saveObj;
    };
    
    holder.keyDownListener = function(e) {
    
        if (holder.isRenaming) {
            //console.log('keyDown listener was canceled because isRenaming!');
            return;
        }
    
        e = e || window.event;
        
        charCode = Math.max(e.keyCode ? e.keyCode : 0, e.charCode ? e.charCode : 0);
        
        if (charCode == 0) return;
        
        //40 - down
        //38 - up
        //39 - right
        //37 - left
        //32 - space (toggle)
        //13 - enter
        //46 - delete
        
        //console.log(charCode);
        
        switch (charCode) {
            case 40: holder.focusNextNode();  cancelEvent(e); break;
            case 38: holder.focusPreviousNode(); cancelEvent(e); break;

            case 39: if (!holder.selectedNode.___isRenaming) { holder.expandNode(); cancelEvent(e); } break;
            case 37: if (!holder.selectedNode.___isRenaming) { holder.collapseNode(); cancelEvent(e); } break;

            case 32: holder.setSelectedNode( holder.getFocusedNode() ); cancelEvent(e); break;
            case 46: if (holder.getKbDelete()) { holder.deleteNode(); cancelEvent(e); } break;
            case 13: try { holder.setSelectedNode( holder.___activeNode ); holder.getSelectedNode().setExpanded (!holder.getSelectedNode().getExpanded()); } catch(ex) {} 
                     cancelEvent(e); 
                     break;
        }
        
        return false;
    };
    
    
    holder.getBranchElement = function(targetElement) {
        var targ = targetElement;
        do {
            if (hasStyle(targ, 'DomTreeBranch')) return targ;
            if (hasStyle(targ, 'DomTree')) return false;
            targ = targ.parentNode;
        } while (targ);
        return false;
    };
    
    holder.mouseDownListener = function(e) {
        
        if (holder.isRenaming) {
            //console.log('mouseDown listener was canceled because isRenaming');
            return;
        }
        
        if (!holder.___dragAndDrop) { return; }
        
        e = e || window.event;
        
//         console.log('x = '+e.clientX+', y = '+e.clientY+', which='+e.which);
        
//         for (var pr in e) console.log(pr);
        
        if ((e.which || e.button) > 1) return;
        
        
        holder.___eDragX = e.clientX;
        holder.___eDragY = e.clientY;
        
        holder.___isDragging = true;
        
        holder.___originDragElement = holder.getBranchElement(e.target ? e.target : e.srcElement);
        
        if (holder.___originDragElement == holder.rootNode) {
            holder.___isDragging = false;
            cancelEvent(e);
            return;
        }
        
        if (!holder.___originDragElement) holder.___isDragging = false;
        
        cancelEvent(e);
    };
    
    holder.getOwnLayerPosition = function(e) {
        var targetElement = holder.getBranchElement(e.target ? e.target : e.srcElement);
        var addX = e.layerX || e.x;
        var addY = e.layerY || e.y;
        while (targetElement && targetElement != holder) {
            addX += targetElement.offsetLeft;
            addY += targetElement.offsetTop;
            targetElement = targetElement.parentNode;
        }
        
        return { 'x': addX, 'y': addY };
        
    };
    
    holder.mouseMoveListener = function(e) {
    
        if (holder.isRenaming) {
            //console.log('mouseMove listener was canceled because isRenaming');
            return;
        }
    
        e = e || window.event;
    
        if (!holder.___isDragging) return;
        
        //we considerr that it's a drag only if the mouse moved around at least 3 px, otherwise we don't
        if (!holder.___firedDrag && 
            (Math.abs(e.clientX - holder.___eDragX) <= 3) && 
            (Math.abs(e.clientY - holder.___eDragY) <= 3)
           ) return;
        
        //if the customEvent 'drag' returns false, we cancel the drag
        if (!holder.___firedDrag && !holder.onCustomEvent('internal-drag', holder.___originDragElement)) {
            holder.___originDragElement = false;
            holder.___isDragging = false;
            return;
        }
        
        holder.___firedDrag = true;
        
        if (!holder.___dragClone) {
            holder.___dragClone = holder.___originDragElement.createClone();
            holder.___dragClone.style.visibility = holder.internalTooltipVisible ? 'visible' : 'hidden';
            holder.appendChild(holder.___dragClone);
        }
        
        var xy = holder.getOwnLayerPosition(e);
        
//         console.log('x = '+xy.x+ ', y='+xy.y);
        
        holder.___dragClone.style.left = xy.x + 5 + 'px';
        holder.___dragClone.style.top  = xy.y + 5 + 'px';
        
        var targetElement = holder.getBranchElement(e.target ? e.target : e.srcElement);
        
        var dropOnLabel = false;
        
        if (targetElement &&
            (hasStyle(e.target ? e.target : e.srcElement, 'DomTreeBranchCaption') || hasStyle(e.target ? e.target : e.srcElement, 'DomTreeBranchIcon'))
           ) dropOnLabel = true;
           
        if (targetElement &&
            (e.target ? e.target : e.srcElement).___expandConnector
           ) targetElement.setExpanded( true );
           
        if (targetElement && !targetElement.isChildOf(holder.___originDragElement)) {
            
            if (dropOnLabel && targetElement._items && targetElement != holder.___originDragElement.father) {
                holder.setDropElement(
                    targetElement.canAcceptElement(holder.___originDragElement) ? targetElement : null
                );
                
                holder.___dragClone.setCaption( 'Drop inside "'+targetElement.getCaption()+'"');
                
                if (holder.___markerElement) holder.___markerElement.setMoveMarker(  false );
                
                holder.___dragClone.setOk( true );
            } else {
                holder.setDropElement( null );
                
                if (targetElement != holder.rootNode) {
                    
                    holder.moveMethod = targetElement.getMoveMethod(xy.x, xy.y);
                    
                    holder.___dragClone.setCaption( 'Drop '+holder.moveMethod+' "'+targetElement.getCaption() + '"' );
                    
                    targetElement.setMoveMarker( holder.moveMethod );
                    
                    holder.___dragClone.setOk( true );
                } else {
                    holder.___dragClone.setOk( false );
                    holder.___dragClone.setCaption( 'Cannot move here' );
                    
                    if (holder.___markerElement) holder.___markerElement.setMoveMarker( false );
                }
            }
            
        } else {
            holder.___dragClone.setOk( false );
            holder.___dragClone.setCaption ('Cannot move here' );
            
            if (holder.___markerElement) holder.___markerElement.setMoveMarker( false );
            
        }
        
        cancelEvent(e);
    };
    
    holder.mouseUpListener = function(e) {
    
        if (holder.isRenaming) {
            //console.log('mouseUp listener canceled because isRenaming!');
            return;
        }
    
        e = e || window.event;
    
        if (holder.___isDragging) {
        
            if (holder.___dragClone) {
                holder.removeChild(holder.___dragClone);
                holder.___dragClone = false;
            }
            
            //here we make the move INSIDE of an element (add it at the end)
            if (holder.getDropElement() !== null && 
                holder.___originDragElement && 
                holder.onCustomEvent('internal-drop', 
                    { 'src': holder.___originDragElement, 
                      'dest': holder.getDropElement(),
                      'index': 0
                    })
               ) {
                
                var saveData = holder.___originDragElement.getToObject();
                
//                 console.log(saveData);
                
                //we delete the node from it's actual position
                holder.deleteNode(holder.___originDragElement, true);
                
                //we insert the node in the drop element at first position
                var newBranch = holder.getDropElement().insertBranchDataAt(saveData, 0);
                
                holder.setSelectedNode( newBranch );
            } else
            
            //Here we make the move Before or After a element
            if (holder.___markerElement && 
                holder.___originDragElement &&
                holder.___markerElement.getMoveMarker() &&
                
                holder.onCustomEvent('internal-drop', 
                    { 'src': holder.___originDragElement, 
                      'dest': holder.___markerElement.father,
                      'index': (holder.___markerElement.getMoveMarker() == 'before' ? 0 : 1) + holder.___markerElement.getParentNodeOrder()
                    })
            ) {
                var saveData = holder.___originDragElement.getToObject();
                
                //we delete the node from it's actual position
                holder.deleteNode(holder.___originDragElement, true);
                
                var markerIndex = holder.___markerElement.getParentNodeOrder();
                
                var newBranch = false;
                
                switch (holder.___markerElement.getMoveMarker()) {
                    case 'before':  
                        newBranch =
                        holder.___markerElement.father.insertBranchDataAt(
                            saveData, markerIndex, true
                        ); 
                        break;
                    case 'after':  
                        newBranch =
                        holder.___markerElement.father.insertBranchDataAt(
                            saveData, markerIndex+1, true
                        );
                        break;
                    default: { 
                        alert('Invalid moveMarker: '+holder.___markerElement.getMoveMarker());
                        throw 'Invalid moveMarker: '+holder.___markerElement.getMoveMarker();
                    }
                }
                
                if (newBranch) holder.setSelectedNode( newBranch );
            }
            
            holder.___firedDrag = false;
            holder.___originDragElement = false;
            holder.setDropElement( null );
        }
        
        if (holder.___markerElement) {
            try {
                holder.___markerElement.setMoveMarker( false );
            } catch(ex) {}
            holder.___markerElement = false;
        }
        
        holder.___isDragging = false;
    };
    

    try { 
        holder.addEventListener('keydown',   holder.keyDownListener,   false);
        holder.addEventListener('mousedown', holder.mouseDownListener, false);
        holder.addEventListener('mousemove', holder.mouseMoveListener, false);
        holder.addEventListener('mouseup',   holder.mouseUpListener,   false);
    } catch(ex) {
        holder.attachEvent('onkeydown', holder.keyDownListener);
        holder.attachEvent('onmousedown', holder.mouseDownListener);
        holder.attachEvent('onmousemove', holder.mouseMoveListener);
        holder.attachEvent('onmouseup', holder.mouseUpListener);
    }
    
    holder.findNode = function(searchValue, inProperty, startNode) {
        inProperty = inProperty || 'nodeID';
        startNode  = startNode || holder.rootNode;
        
        var found;
        
        if (startNode[inProperty] == searchValue) return startNode
        else {
            if (startNode._items) {
                for (var i=0; i<startNode._items.length; i++) {
                    found = holder.findNode(searchValue, inProperty, startNode._items[i]);
                    if (found != null) return found;
                }
            }
        }
        
        return null;
    };
    
    // Returns true if a property in given branchNode satisfies 
    // the relationship: branchNode[inProperty] operator searchValue
    holder.matchProperty = function(operator, searchValue, inProperty, branchNode) {
        switch (operator) {
            //equals
            case '=': return branchNode[inProperty] == searchValue; break;
            //less than
            case '<': return branchNode[inProperty] < searchValue; break;
            //greater than
            case '>': return branchNode[inProperty] > searchValue; break;
            //not equal with
            case '!': return branchNode[inProperty] != searchValue; break;
            //begins with
            case '[': return branchNode[inProperty].toString().indexOf(searchValue) == 0; break;
            //ends with
            case ']': var str = branchNode[inProperty].toString();
                      var needle = searchValue.toString();
                      if (str.length < needle.length) return false;
                      str = str.substr(str.length - needle.length);
                      return str == needle;
                      break;
            //contains
            case '[]': return branchNode[inProperty].toString().indexOf(searchValue) != -1; break;
            default: throw 'Tree.matchProperty: invalid operator "'+operator+'". Allowed only: =, <, >, !, [, ], [].';
                     break;
        }
    };
    
    holder.queryNodes = function(searchValue, inProperty, operator, startNode, resultStack) {
        inProperty = inProperty || 'nodeID';
        startNode = startNode || holder.rootNode;
        resultStack = resultStack || [];
        operator = operator || '=';
        
        if (holder.matchProperty(operator, searchValue, inProperty, startNode)) resultStack.push(startNode);
        if (startNode._items) {
            for (var i=0; i<startNode._items.length; i++) {
                holder.queryNodes(searchValue, inProperty, operator, startNode._items[i], resultStack);
            }
        }
        
        return resultStack;
    };
    
    holder.expandAll = function(startNode) {
        startNode = startNode || holder.rootNode;
        if (startNode._items) { 
            startNode.setExpanded(true);
            for (var i=0; i<startNode._items.length; i++) {
                holder.expandAll(startNode._items[i]);
            }
        }
    };
    
    holder.collapseAll = function(startNode) {
        startNode = startNode || holder.rootNode;
        if (startNode._items) {
            for (var i=0; i<startNode._items.length; i++) {
                holder.collapseAll(startNode._items[i]);
            }
            startNode.setExpanded(false);
        }
    };
    
    Keyboard.setFocusCycling(holder);
    
    holder.onCustomEvent('ready', holder.rootNode);
    
    if (typeof(loadData.expanded) != 'undefined' && loadData.expanded) 
        holder.rootNode.setExpanded( true );
    
    return holder;
}

function TreeLoaderUl(rootElement) {
    var items = rootElement.childNodes;
    var out   = {
        'name': "",
        'id': -1
    };
    
    var cNode;
    
    for (var i=0; i<items.length; i++) {
    
        switch (items[i].nodeName) {
            case 'A': { 
                out.name = { 'anchorText': items[i].innerText, 'href': items[i].getAttribute('href') }; 
                if (hasStyle(items[i], 'expanded')) out.expanded = true;
                break;
            }
            case 'UL': {
                out.items = [];
                var subItems = items[i].childNodes;
                for (var j=0; j < subItems.length; j++) {
                    if (subItems[j].nodeName == 'LI') {
                        cNode = TreeLoaderUl(subItems[j]);
                        out.items.push(cNode);
                    }
                    
                    if (cNode && cNode.expanded) out.expanded = true;
                }
                break;
            }
            case 'SPAN': {
                out.name = items[i].innerText;
                break;
            }
        }
    }
    
    return out;
}

