function ExpandableSection() {

    var holder = $('div', 'expandableSection collapsed');

    EnableCustomEventListeners(holder);
    
    holder.isCollapsed   = true;
    holder.captionHolder = holder.appendChild($('div', 'caption'));
    holder.bodyHolder    = holder.appendChild($('div', 'body'));
    
    holder.getCollapsed  = function() {
        return holder.isCollapsed;
    };
    
    holder.setCollapsed  = function(bool) {
        (!bool ? addStyle : removeStyle)(holder, 'expanded');
        (bool ? addStyle : removeStyle)(holder, 'collapsed');
        holder.isCollapsed = bool ? true : false;
        
        holder.onCustomEvent(bool ? 'collapse' : 'expand', holder);
    };
    
    holder.getExpanded = function() {
        return !holder.isCollapsed;
    };
    
    holder.setExpanded = function(bool) {
        holder.setCollapsed(!bool);
    };
    
    holder.getCaption = function() {
        return holder.captionHolder;
    };
    
    holder.getBody = function() {
        return holder.bodyHolder;
    };
    
    holder.bodyHolder.insert = function(domElement) {
        return holder.bodyHolder.appendChild(domElement.getHandle ? domElement.getHandle() : domElement);
    };
    
    holder.captionHolder.insert = function(domElement) {
        return holder.captionHolder.appendChild(domElement.getHandle ? domElement.getHandle() : domElement);
    };
    
    if (holder.__defineGetter__) {
        holder.__defineGetter__('caption', holder.getCaption);
        holder.__defineGetter__('body', holder.getBody);
        holder.__defineGetter__('collapsed', holder.getCollapsed);
        holder.__defineSetter__('collapsed', holder.setCollapsed);
        holder.__defineGetter__('expanded', holder.getExpanded);
        holder.__defineSetter__('expanded', holder.setExpanded);
    } else
    if (Object.defineProperty) {
        Object.defineProperty(holder, 'caption',   { 'get': holder.getCaption });
        Object.defineProperty(holder, 'body',      { 'get': holder.getBody });
        Object.defineProperty(holder, 'collapsed', { 'get': holder.getCollapsed,  'set': holder.setCollapsed });
        Object.defineProperty(holder, 'expanded',  { 'get': holder.getExpanded,   'set': holder.setExpanded });
    }
    
    if (holder.addEventListener)
        holder.caption.addEventListener('click', function() { holder.collapsed = !holder.collapsed; }, false);
    else
        holder.caption.attachEvent('onclick', function() { holder.collapsed = !holder.collapsed; });
    
    return holder;
}