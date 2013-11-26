function ScrollArea() {
    var d = $('div', 'DomScrollArea');
    d.inner = d.appendChild($('div', 'inner'));
    
    d.insert = function(htmlElement) {
        d.inner.appendChild(htmlElement).paint();
        return htmlElement;
    };
    
    d.getHtml = function() {
        return d.inner.innerHTML;
    };
    
    d.setHtml = function(str) {
        d.inner.innerHTML = str;
    };
    
    if (d.__defineGetter__) {
        d.__defineGetter__('html', d.getHtml);
        d.__defineSetter__('html', d.setHtml);
    } else
    if (Object.defineProperty) {
        Object.defineProperty(d, 'html', { 'get': d.getHtml, 'set': d.setHtml });
    }
    
    return d;
}

function VScrollArea() {
    var d = new ScrollArea();
    d.className = 'DomVScrollArea';
    return d;
};

function HScrollArea() {
    var d = new ScrollArea();
    d.className = 'DomHScrollArea';
    return d;
};