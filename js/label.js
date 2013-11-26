function DOMLabel(strText, settings) {

    settings = settings || {};

    var holder = $('div', 'DOMLabel'.concat( settings.x || settings.y ?  ' placement' : '' ));
    
    if (strText)
        holder.appendChild($text( strText ));
    
    (function() {
        var lbl = strText || '';
    
        Object.defineProperty(
            holder, "label", {
                "get": function( ) {
                    return lbl;
                },
                "set": function( strValue ) {
                    holder.innerHTML = '';
                    holder.appendChild( $text( lbl = strValue.toString()) );
                }
            }
        );
    })();
    
    if (settings.x)
        holder.style.left = settings.x + 'px';
    
    if (settings.y)
        holder.style.top  = settings.y + 'px';
    
    if (settings.align)
        holder.style.textAlign = settings.align;
    
    if (settings.w)
        holder.style.width = settings.w + 'px';
    
    if (settings.width)
        holder.style.width = settings.width + 'px';
    
    if (settings.r) {
        holder.style.right = settings.r + 'px';
    }
    
    if (settings['for']) {
        holder.tabIndex = 0;
        holder.addEventListener('focus', function() {
            try {
                settings['for'].focus();
            } catch(e) {}
        }, false);
        
        if (typeof settings['for'].checked != 'undefined') {
            holder.addEventListener('click', function() {
                try {
                    settings['for'].click();
                } catch (e) {
                    settings['for'].checked = !settings['for'].checked;
                }
            }, false);
        }
    }
    
    holder.insert = function(DOMElement) {
        holder.appendChild( DOMElement );
        return DOMElement;
    }
    
    return holder;
}