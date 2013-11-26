function $(tagName, className) {
    var ret = document.createElement(tagName);
    if (typeof className != 'undefined') ret.className = className;
    return ret;
}

function $text(str) {
    return document.createTextNode(str);
}

function ID(elementID) {
    return document.getElementById(elementID);
}

/* Adds a style to className of an object */
function addStyle(obj, styleName) {
    var arr = (obj && obj.className && (obj.className.length > 0)) ? obj.className.split(' ') : [];
    for (var i=0; i<arr.length; i++) { if (arr[i] == styleName) { return; } }
    arr.push(styleName);
    obj.className = arr.join(' ');
    return obj;
}

/* Removes a style from className of an object */
function removeStyle(obj, styleName) {
    var arr = (obj.className && (obj.className.length > 0)) ? obj.className.split(' ') : [];
    var found = false;
    for (var i=0; i<arr.length; i++) { if (arr[i] == styleName) { found = i; } }
    if (found === false) { return; }
    arr.splice(found, 1);
    obj.className = (arr.length > 0) ? arr.join(' ') : '';
    return obj;
}

function hasStyle(obj, styleName) {
    var arr = (obj.className && (obj.className.length > 0)) ? obj.className.split(' ') : [];
    for (var i=0; i<arr.length; i++) if (arr[i] == styleName) { return true; }
    return false;
}

function cancelEvent(e) {
    e = e || window.event;
    if (!e) return;
    e.cancelBubble = true;
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
}

function getXY(o) {
//     var trace = [];
    var x = y = 0;
    
    obj = o;
    
    var ydiff = 0;
    var xdiff = 0;
    
    while (obj.parentNode !== null) {
        xdiff += obj.scrollLeft;
        ydiff += obj.scrollTop;
        obj = obj.parentNode;
    }
    
    obj = o;
    
    if (obj.offsetParent) {
        do {
            x += obj.offsetLeft;
            y += obj.offsetTop;
//             trace.push(obj.tagName+' ['+obj.scrollTop+']: x = '+x+', y = '+y);
        } while (obj = obj.offsetParent);
    }
    
//     alert(trace.join('\n'));
    
    return [x - xdiff, y - ydiff];
}

function getMaxX() {
    var x = 
            document.body.innerWidth ? document.body.innerWidth : 
           (document.documentElement ? document.documentElement.clientWidth : document.getElementsByTagName('body')[0].clientWidth);
    return x;
}

/* Returns the desktop height */
function getMaxY() {
    var y = 
            document.body.innerHeight ? document.body.innerHeight : 
           (document.documentElement ? document.documentElement.clientHeight : document.getElementsByTagName('body')[0].clientHeight);
    return y;
    //return parseInt(document.body.innerHeight);
}

function disableSelection(target) {
    target.style.webkitUserSelect = 
    target.style.userSelect = 'none';
}

//since mouseenter & mouseleave are only supported in IE, this object helps to
// determine if the mouse is entering or leaving an element
//landmark: did the mouse enter or leave this "landmark" element? Was the event fired from within this element?
//usage:   var mbc = new MouseBoundaryCrossing(mouse_event, landmark);


function MouseBoundaryCrossing(evt, landmark)
{
    evt = evt || window.event;
    
    var eventType = evt.type;
    
    this.inLandmark = false;
    this.leftLandmark = false;
    this.enteredLandmark = false;
    
    if(eventType == "mouseout")
    {
        this.toElement = evt.relatedTarget || evt.toElement;
        this.fromElement = evt.target || evt.srcElement;
    }
    else if(eventType == "mouseover")
    {
        this.toElement = evt.target || evt.srcElement;
        this.fromElement = evt.relatedTarget || evt.fromElement;
    }
    else throw (new Error("Event type \""+eventType+"\" is irrelevant"));   //irrelevant event type
    
    //target is unknown
    //this seems to happen on the mouseover event when the mouse is already inside the element when the page loads and
    // the mouse is moved: fromElement is undefined
    if(!this.toElement || !this.fromElement) throw (new Error("Event target(s) undefined"));
    
    //determine whether from-element is inside or outside of landmark (i.e., does tmpFrom == the landmark or the document?)
    var tmpFrom = this.fromElement;
    while(tmpFrom.nodeType == 1)    //while tmpFrom is an element node
    {
        if(tmpFrom == landmark) break;
        tmpFrom = tmpFrom.parentNode;
    }
    
    //determine whether to-element is inside or outside of landmark (i.e., does tmpTo == the landmark or the document?)
    var tmpTo = this.toElement;
    while(tmpTo.nodeType == 1)  //while tmpTo is an element node
    {
        if(tmpTo == landmark) break;
        tmpTo = tmpTo.parentNode;
    }
    
    if(tmpFrom == landmark && tmpTo == landmark) this.inLandmark = true;    //mouse is inside landmark; didn't enter or leave
    else if(tmpFrom == landmark && tmpTo != landmark)   //mouse left landmark
    {
        this.leftLandmark = true;
        this.inLandmark = (eventType == "mouseout");    //mouseout: currently inside landmark, but leaving now
                                                        //mouseover: currently outside of landmark; just left
    }
    else if(tmpFrom != landmark && tmpTo == landmark)   //mouse entered landmark
    {
        this.enteredLandmark = true;
        this.inLandmark = (eventType == "mouseover");   //mouseover: currently inside landmark; just entered
                                                        //mouseout: currently outside of landmark, but entering now
    }
    //else  //mouse is outside of landmark; didn't enter or leave
}

//much more like a scrollIntoView, but restricted only to scroll the parentNode only
function assureVisibility(element) {
    if (!element.parentNode) return;
    xp = element.parentNode.scrollLeft;
    yp = element.parentNode.scrollTop;
    
    xd = element.offsetLeft;
    yd = element.offsetTop;
    
    switch (true) {
        case yp > yd: {
            element.parentNode.scrollTop = yd - 10;
            break;
        }
        case yd + element.offsetHeight > element.parentNode.offsetHeight + yp : {
            element.parentNode.scrollTop =
            yd + element.offsetHeight - element.parentNode.offsetHeight + 10;
            break;
        }
    }
    
    switch (true) {
        case xp > xd: {
            element.parentNode.scrollLeft = xd - 10;
            break;
        }
        
        case xd + element.offsetWidth > element.parentNode.offsetWidth + xp: {
            element.parentNode.scrollLeft =
            xd + element.offsetWidth - element.parentNode.offsetWidth + 10;
            break;
        }
    }
};

/* Set opacity of (obj) object of (int) percent */
function alpha(object, percent) {
    if ((typeof(object) == 'undefined') || (!object)) { return false; }
    var style = object.style;
    try {
       style.opacity = (percent / 100);
       style.MozOpacity = (percent / 100);
       style.KhtmlOpacity = (percent / 100);
       style.filter = "alpha(opacity=" + percent + ")";
    } catch (ex) {
    }
}

function winMouseX(evt) {
    if (evt.pageX) return evt.pageX;
    else if (evt.clientX)
        return evt.clientX + (document.documentElement.scrollLeft ?
            document.documentElement.scrollLeft :
            document.body.scrollLeft);
    else return null;
}

function winMouseY(evt) {
    if (evt.pageY) return evt.pageY;
    else if (evt.clientY)
        return evt.clientY + (document.documentElement.scrollTop ?
            document.documentElement.scrollTop :
            document.body.scrollTop);
    else return null;
}

function relMousePos(DomObject, e) {
    var xy = getXY(DomObject);
    
    var xym = [winMouseX(e), winMouseY(e)];
    return [xym[0] - xy[0] - (document.body.scrollLeft || (window.pageXOffset || (document.body.parentElement ? document.body.parentElement.scrollLeft  : 0) )), 
            xym[1] - xy[1] - (document.body.scrollTop || (window.pageYOffset || (document.body.parentElement ? document.body.parentElement.scrollTop  : 0)) )];
}

function HighlightElement(DOMElement, focusAfter) {
    
    focusAfter = typeof focusAfter == 'undefined' ? true : focusAfter;
    
    DOMElement.style.outline = '4px solid red';
    setTimeout(function() {DOMElement.style.outline = 'none'; }, 1000);
    if (DOMElement.focus && focusAfter) DOMElement.focus();
}

function isChildOf(testNode, parentNode) {
    return !!(parentNode.compareDocumentPosition(testNode) & 16);
}

(function() {
    
    var uniqid = 0;
    
    window.uniqueID = function() {
        uniqid++;
        return uniqid;
    };
    
})();

function var_dump(x, max, sep, l) {
    l = l || 0;
    max = max || 10;
    sep = sep || ' ';
    if (l > max)
        return "[WARNING: Too much recursion]\n";
    var
        i,
        r = '',
        t = typeof x,
        tab = '';
    
    if (x === null) {
        r += "(null)\n";
    } else if (t == 'object') {
        l++;
        for (i = 0; i < l; i++) {
            tab += sep;
        }
        if (x && x.length) {
            t = 'array';
        }
        r += '(' + t + ") :\n";
        for (i in x) {
            if (!x.propertyIsEnumerable(i)) continue;
            try {
                r += tab + ( t == 'array' ? ( '[' + i + ']' ) : ('"' + i + '"' ) )+' : ' + var_dump(x[i], max, sep, (l + 1));
            } catch(e) {
                return "[ERROR: " + e + "]\n";
            }
        }
    } else {
        if (t == 'string') {
            if (x == '') {
                x = '(empty)';
            }
        }
        r += '(' + t + ') ' + x + "\n";
    }
    return r;
}

Node.prototype.overlapsWith = function( otherDOMNode ){
    var x1 = this.offsetLeft,
        y1 = this.offsetTop,

        x2 = x1 + this.offsetWidth,
        y2 = y1 + this.offsetHeight,

        x3 = otherDOMNode.offsetLeft,
        y3 = otherDOMNode.offsetTop,

        x4 = x3 + otherDOMNode.offsetWidth,
        y4 = y3 + otherDOMNode.offsetHeight;

    return !( x2 < x3 || x1 > x4 || y2 < y3 || y1 > y4 );
}

Object.defineProperty(window, 'scrollbarWidth', {'get': function() {
    if (!window.__scrollbarWidth) {
        
        if (navigator.appName.indexOf('Microsoft Internet Explorer') != -1) {
            var textarea1 = $('textarea');
            textarea1.setAttribute('cols', 10);
            textarea1.setAttribute('rows', 2);
            textarea1.style.position = 'absolute';
            textarea1.style.left = '-1000px';
            textarea1.style.top  = '-1000px';
            document.body.appendChild(textarea1);
            var textarea2 = $('textarea');
            textarea2.setAttribute('cols', 10);
            textarea2.setAttribute('rows', 2);
            textarea2.style.overflow = 'hidden';
            textarea2.style.position = 'absolute';
            textarea2.style.top = '-1000px';
            textarea2.style.left = '-1000px';
            document.body.appendChild(textarea2);
            window.__scrollbarWidth = textarea1.offsetWidth - textarea2.offsetWidth;
            document.body.removeChild(textarea1);
            document.body.removeChild(textarea2);
        } else {
            var div = document.body.appendChild($('div').setAttr('style', 'width: 100px; height: 100px; overflow: auto; position: absolute; left: -1000px; top: -1000px'));
            var div2 = div.appendChild($('div').setAttr('style', 'width: 100%; height: 200px'));
            window.__scrollbarWidth = 100 - div2.offsetWidth;
            document.body.removeChild(div);
        }
        
    }
    return window.__scrollbarWidth;
}});