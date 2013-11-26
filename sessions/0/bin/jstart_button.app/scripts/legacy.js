function PopupMenu(json_menu, orientation, parentNode, __isNotRoot) {
    var holder = $('div', 'DOM2Popup');
    holder.orientation = orientation ? orientation : 'right same';
    holder.toElement = typeof(parentNode) != 'undefined' ? parentNode : false;
    
    holder.isRootMenu = typeof(__isNotRoot) == 'undefined' ? true : false;
    
    holder.show = function() {
        var xy = holder.toElement ? getXY(holder.toElement) : [0,0];
        var or = holder.orientation.split(' ');
        
        if (or.length != 2) { 
            or = ['right','same'];
        }
        
        document.body.appendChild(holder);
        
        switch (or[0]) {
            case 'right': var x = xy[0]+holder.toElement.offsetWidth;
                          if (x > getMaxX()) x = xy[0] - holder.offsetWidth;
                          break;
            case 'left' : var x = xy[0] - holder.offsetWidth;
                          if (x < 0) x = xy[0] + holder.toElement.offsetWidth;
                          break;
            default: var x = xy[0];
        }
        
        switch (or[1]) {
            case 'up': var y = xy[1] - holder.offsetHeight;
                       if (y < 0) y = xy[1] + holder.toElement.offsetHeight;
                       break;
            case 'down': var y = xy[1] + holder.toElement.offsetHeight;
                       if (y < 0) y = xy[1] - holder.offsetHeight;
                       break;
            default: var y = xy[1];
        }
        
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        
        holder.style.left = x+'px';
        holder.style.top  = y+'px';
        
    };
    
    holder.hide = function() {
        document.body.removeChild(holder);
    };
    
    holder.options = [];
    
    holder.closeChilds = function(exceptOption) {
        for (var i=0; i<this.options.length; i++) {
            if (this.options[i] != exceptOption) {
                removeStyle(this.options[i], 'expanded');
                if (this.options[i].child && this.options[i].child.visible) {
                    this.options[i].child.visible = false;
                }
            }
        }
    };


    holder._visible = false;
    
    holder.getVisible = function(){
        return holder._visible;
    };
    
    holder.setVisible = function(bool){
        if (bool && !holder._visible) {
            addStyle(holder.toElement, 'opened');
            holder.show();
            holder._visible = true;
            if (holder.options.length == 0) {
                holder.innerHTML = 'Empty';
            }
        } else
        if (!bool && holder._visible) {
            removeStyle(holder.toElement, 'opened');
            holder.closeChilds();
            holder.hide();
            holder._visible = false;
        }
    };
    
    
    holder.getRoot = function() {
        var d = holder;
        while (!d.isRootMenu) d = d.toElement.parentNode;
        return d;
    };
    
    if (holder.__defineGetter__) {
      holder.__defineGetter__('visible', holder.getVisible);
      holder.__defineSetter__('visible', holder.setVisible);
      holder.__defineGetter__('rootElement', holder.getRoot);
    } else
    if (Object.defineProperty) {
      Object.defineProperty(holder, 'visible', {'get': holder.getVisible, 'set': holder.setVisible});
      Object.defineProperty(holder, 'rootElement', { 'get': holder.getRoot });
    }

    
    holder.hideAllMenus = function() {
        holder.rootElement.visible = false;
    };
    
    for (var i=0; i<json_menu.length; i++) {
        var dv = holder.appendChild($('div', 'option'));
        disableSelection(dv);
            
        if (json_menu[i].icon) { 
            dv.appendChild($('img')).setAttr('src', json_menu[i].icon);
            addStyle(dv, 'iconoption');
        }
        dv.appendChild(document.createTextNode(json_menu[i].name));
        if (json_menu[i].childs) {
            dv.child = new PopupMenu(json_menu[i].childs, holder.orientation, dv, false);
            addStyle(dv, 'expandable');
        }
        if (json_menu[i].exec) dv.exec = json_menu[i].exec;

        dv.onmouseover = function(){
            holder.closeChilds(this);
            if (this.child) {
                this.child.visible = true;
                addStyle(this, 'expanded');
            }
        };

           
        dv.onclick = function(e) {
            if (this.exec) 
            try { 
                holder.hideAllMenus();
                var rm = holder.rootElement;
                if (rm.onmenupress) {
                    rm.onmenupress();
                }
                eval(this.exec); 
            } catch(ex) {
                KernelLog('Error executing a PopupMenu option: '+this.exec);
            }
        };
        
        try {
          document.body.addEventListener('click', holder.hideAllMenus, false);
        } catch(ex) {
          document.body.attachEvent('onclick', holder.hideAllMenus);
        }
        
        holder.options.push(dv);
    }
    
    holder.setParentOptionsIcon = function(src) {
        for (var i=0; i<holder.options.length; i++) {
            if (holder.options[i].child) {
                holder.options[i].appendChild($('img')).setAttr('src', src);
                addStyle(holder.options[i], 'iconoption');
                
                holder.options[i].child.setParentOptionsIcon(src);
            }
        }
    };
    
    return holder;
};
