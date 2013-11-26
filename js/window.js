( function() {
    var oldAddEventListener = Node.prototype.addEventListener;
    var oldRemoveEventListener = Node.prototype.removeEventListener;

    Node.prototype.addEventListener = function( evType, evCallback, evPhase ) {
        try {
            evPhase = !!evPhase;
            this._events = this._events || {};
            this._events[ evType ] = this._events[ evType ] || [];
            this._events[ evType ].push( { "phase": evPhase, "callback": evCallback } );
        } catch (e) {
            console.warn("Error adding event listener: ", evType, " from: ", this );
        }
        return oldAddEventListener.call(this, evType, evCallback, evPhase );
    }
    
    Node.prototype.removeEventListener = function( evType, evCallback, evPhase ) {
        try {
            evPhase = !!evPhase;
            var removed = false;
            if ( this._events && this._events[ evType ] ) {
                for ( var i=0,len=this._events[evType].length; i<len; i++ )
                    if ( this._events[evType][ i ].phase == evPhase &&
                         this._events[evType][ i ].callback == evCallback ) {
                         this._events[evType].splice(i,1);
                         removed = true;
                         if ( !this._events[evType].length )
                            delete this._events[evType];
                        break;
                    }
                if (!removed)
                    console.warn("Error removing event listener ", evType, " from ", this );
            }
        } catch (e) {
            console.warn("Error removing event listener ", evType, " from ", this, ": " + e );
        }
        return oldRemoveEventListener.call( this, evType, evCallback, evPhase );
    }
    
    Node.prototype.insertTop = function( something, topAdd, incrementAfter ) {
        if ( typeof this.topIncrement == 'undefined' )
            this.topIncrement = 0;
        
        this.topIncrement += ( topAdd || 0 );
        
        var main = this;
        
        return ( function( ) {

            if ( typeof main.insert == 'function' ) {
                return main.insert( something ).chain( function() {
                    this.style.top = main.topIncrement + "px";
                } );
            } else return something;
        
        })( ).chain( function() {
            if ( typeof incrementAfter != 'undefined' ) {
                main.topIncrement += incrementAfter;
            }
        } );
    }
    
    var templateNodes = {};
    
    Node.prototype.purge = function() {
        var nodes = this.querySelectorAll('*');
        var purged= 0;
        for ( var i=0,len=nodes.length; i<len; i++ ) {
            if ( nodes[i]._events ) {
                for ( var key in nodes[i]._events ) {
                    if ( nodes[i]._events.propertyIsEnumerable( key ) &&
                         nodes[i]._events.hasOwnProperty( key ) 
                    ) {
                        ( function( evt, node ){
                            
                            for ( var i=0,len=node._events[ evt ].length; i<len; i++ ) {
                                oldRemoveEventListener.call(node, evt, node._events[ evt ][i].callback, node._events[ evt ][i].phase );
                                purged++;
                            }
                            
                        } )( key, nodes[i] );
                    }
                }
                delete nodes[i]._events;
            }
            
            nodes[i].chain( function() {
            
                var tagName = this.nodeName.toString().toLowerCase();
                
                if ( typeof templateNodes[ tagName ] == 'undefined' ) {
                    templateNodes[ tagName ] = document.createElement( tagName );
                    //console.log("Allocated a template node <" + tagName + ">");
                }
                
                if ( this.parentNode )
                    this.parentNode.removeChild( this );
                
                if ( this.customEventListeners )
                    delete this.customEventListeners;
                
                try {
                    this.innerHTML = '';
                } catch (e){ }
                
                for ( var key in this ) {
                    try {
                        if ( typeof templateNodes[ tagName ][ key ] == 'undefined' ) {
                            
                            
                            try {
                                if (!delete this[key] )
                                    throw "Could not delete key " + key;
                            } catch (e){
                                console.log( "error: ", e );
                            }
                        }
                    } catch (f){ 
                        console.log( key + ": " + f );
                    }
                }
                
            } );

        }
        //console.log( purged );
    }
    
} )();

// console faking
(function() {
    if (!("console" in window) || (window.location.toString().indexOf('?') == -1)) {
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
    "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];

    window.console = {};
    for (var i = 0; i < names.length; ++i)
        window.console[names[i]] = function() {}
}})();

var __DEBUG_CUSTOM_EVENT_LISTENERS__ = false;

Object.defineProperty( Array.prototype, "swap", {
    "get": function() {
        return function(x,y) {
            this[y] = this.splice(x, 1, this[y])[0];
        };
    }
} );

Object.defineProperty( Array.prototype, "unique", {
    "get": function() {
        return function() {
            var a = [];
            for(var i=0, l=this.length; i<l; i++) {
                for(var j=i+1; j<l; j++)
                    if (this[i] === this[j]) j = ++i;
                        a.push(this[i]);
            }
            return a;
        }
    }
} );

Object.defineProperty( Array.prototype, "merge", {
    "get": function() {
        return function( arr ) {
            arr = arr || [];
            for (var i=0; i<arr.length; i++)
                this.push(arr[i]);
            return this;
        }
    }
} );

window.grep = function( o, what, incaseSensitive ) {
    var str = o.toString();
    if (incaseSensitive) {
        str = str.toLowerCase();
        what = what.toLowerCase();
    }
    var s = str.split("\n");
    for (var i=0; i<s.length; i++) {
        if (s[i].indexOf( what ) >= 0) {
            console.log(i, s[i] );
        }
    }
}

Node.prototype.setHTML = function(str) { 
    this.innerHTML = str; return this; 
}

Node.prototype.setAttr = function(name, value) { 
    if ( typeof this.setAttribute != 'undefined') 
        this.setAttribute(name, value); 
    return this; 
};
    
Node.prototype.onDOMresize = function (pWidth, pHeight) { 
            
            if (this.__DEBUG_ANCHORS__) console.log('onDOMresize: '+pWidth+','+pHeight);
            
            if (this.DOManchors) { 
                for (var a in this.DOManchors) { 
                    try { 
                        this.style[a] = this.DOManchors[a].apply( this, [pWidth, pHeight] ); 
                    } catch(ex) { 
                        console.log('Error on Anchor: '+a+'\n'+ex); 
                    } 
                } 
            } 
            if (!this.noResize && this.hasChildNodes()) { 
                var myWidth = this.innerWidth ? this.innerWidth : this.offsetWidth; 
                var myHeight= this.innerHeight ? this.innerHeight: this.offsetHeight;
                
                if (typeof this.__xPadding != 'undefined') myWidth -= this.__xPadding;
                if (typeof this.__yPadding != 'undefined') myHeight-= this.__yPadding;
                
                var firstN = this.firstChild; 
                do { 
                    if (firstN.nodeType == 1)
                        firstN.onDOMresize(myWidth, myHeight);
                    firstN = firstN.nextSibling; 
                } while (firstN != null); 
            } 
}


Node.prototype.setAnchors = function(obj) { 
    this.DOManchors = obj; 
    return this; 
};

Node.prototype.paint = function() {
    if (!this.parentNode) return this;
    this.onDOMresize( 
        this.parentNode.innerWidth 
            ? this.parentNode.innerWidth 
            : this.parentNode.offsetWidth - (typeof this.__xPadding == 'undefined' ? 0 : this.__xPadding),
        this.parentNode.innerHeight
            ? this.parentNode.innerHeight 
            : this.parentNode.offsetHeight - (typeof this.__yPadding == 'undefined' ? 0 : this.__yPadding)
    );
    return this;
};

Node.prototype.addBefore = function( DOMNode ) {
    
    if (!this.parentNode)
        throw "ERR_NOT_ATTACHED!";
    
    this.parentNode.insertBefore( DOMNode, this );
    
    return this;
}

Node.prototype.addAfter = function( DOMNode ) {
    if (!this.parentNode)
        throw "ERR_NOT_ATTACHED!";
    
    if (this.nextSibling)
        this.nextSibling.addBefore( DOMNode );
    else
        this.parentNode.appendChild( DOMNode );
    
    return this;
}

Node.prototype.removeFromParent = function() {
    if ( this.parentNode )
        this.parentNode.removeChild( this );
    return this;
}

Node.prototype.firstParent = function( tagNameExpression, stopAt ) {
    var me = this.parentNode;
    while ( !me.nodeName.match( tagNameExpression ) && me != stopAt ) {
        me = me.parentNode;
    }
    return me;
}

Node.prototype.swapWith = function( b ) {
    var aparent= this.parentNode;
    var asibling= this.nextSibling===b? this : this.nextSibling;
    b.parentNode.insertBefore(this, b);
    aparent.insertBefore(b, asibling);
    return this;
}

/* Get the type of a variable */
function typeOf(objVar, detail) {
    detail = detail || 2;
    
    var t = 'unknown';
    
    switch (true) {
        case objVar === Infinity:
            t = 'infinity';
            break;
        case typeof objVar == 'number' && isNaN( objVar ):
            t = 'nan';
            break;
        case typeof objVar != 'undefined' && objVar === undefined:
            t = 'undefined';
            break;
        case objVar === null:
            t = 'null';
            break;
        case objVar === false || objVar === true:
            t = 'boolean';
            break;
        case typeof NaN != 'undefined' && objVar === NaN:
            t = 'number.nan';
            break;
        case typeof Infinity != 'undefined' && objVar === Infinity:
            t = 'number.infinity';
            break;
        case typeof objVar == 'number':
            t = 'number.'+(objVar.toString().isInteger() ? 'int' : 'float');
            break;
        case objVar instanceof String:
            t = 'string';
            break;
        case objVar instanceof Array:
            t = 'object.array';
            break;
        case objVar instanceof Function:
            t = 'object.function.'+(objVar.toString().replace(/\{[^*]+$/, '').trim());
            break;
        case window.Node && objVar instanceof window.Node:
            t = 'object.node';
            break;
        case objVar instanceof Object:
            t = 'object';
            break;
        default:
            t = 'unknown.'+(typeof objVar);
            break;
    }
    
    return t.split('.').slice(0, detail).join('.');
}

try {
    if ( (typeof Node != 'undefined') && (typeof Node.prototype.innerText == 'undefined') ) {
        
        function getInnerText(o)
        {
            var txt='';
            for (var i=0; i<o.childNodes.length; i++) {
                switch(o.childNodes[i].nodeType) {
                    case 1 :    txt += getInnerText(o.childNodes[i]);   break
                    case 3 :    txt += o.childNodes[i].nodeValue;       break
                    case 8 :    txt += "\n";                            break
                }
        
            }
            return txt;
        }
    
        Node.prototype.__defineGetter__('innerText', function() { return window.getInnerText(this); });
    }
} catch(ex) { /* Non Firefox Browser might spit an error, but it's not important */ }


//MouseBoundaryCrossing is a crossBrowser function, took from: http://snipplr.com/view/8206/crossbrowser-mouseenterleave-solution/

/* fires an event to a element */

function fireEvent(element,event, bubbles, cancelable, optionalProperties){
    
    optionalProperties = optionalProperties || {};
    
    var e;
    
    switch (true) {
        //HTMLEvents
        case ['abort', 'blur', 'change', 'error', 'focus', 'load', 'reset', 'resize', 'scroll', 'select', 'submit', 'unload'].
            indexOf(event) != -1:
            e = document.createEvent('HTMLEvents');
            e.initEvent(event, bubbles || false, cancelable || false);
            break;
        case ['keydown', 'keypress', 'keyup'].
            indexOf(event) != -1:
            try {
                e = document.createEvent('KeyboardEvent');
                e.initKeyboardEvent(event, bubbles || false, cancelable || false, window,
                    optionalProperties.ctrlKey || false,
                    optionalProperties.altKey || false,
                    optionalProperties.shiftKey || false,
                    optionalProperties.metaKey || false,
                    optionalProperties.keyCode || 0,
                    optionalProperties.charCode || 0
                );
                break;
            } catch(ex) {
                console.error(ex.stack);
            }
        //UIEvents:
        case ['DOMActivate', 'DOMFocusIn', 'DOMFocusOut'].
            indexOf(event) != -1:
            e = document.createEvent('UIEvents');
            e.initUIEvent(event, bubbles || false, cancelable || false, window, 
                optionalProperties.detail || 1
            );
            break;
        //MouseEvents
        case ['click', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup'].
            indexOf(event) != -1:
            e = document.createEvent('MouseEvents');
            e.initMouseEvent(event, bubbles || false, cancelable || false, window, 
                optionalProperties.detail || 1, 
                optionalProperties.screenX || 0, 
                optionalProperties.screenY || 0, 
                optionalProperties.clientX || 0, 
                optionalProperties.clientY || 0, 
                optionalProperties.ctrlKey || false,
                optionalProperties.altKey || false,
                optionalProperties.shiftKey || false,
                optionalProperties.metaKey || false,
                optionalProperties.button || 1,
                optionalProperties.relatedTarget || element
            );
            break;
        //MutationEvents
        case ['DOMAttrModified', 'DOMNodeInserted', 'DOMNodeRemoved', 'DOMCharacterDataModified', 'DOMNodeInsertedIntoDocument',
              'DOMNodeRemovedFromDocument', 'DOMSubtreeModified'].
             indexOf(event) != -1:
            e = document.createEvent('MutationEvents');
            e.initMutationEvent(event, bubbles || false, cancelable || false,
                optionalProperties.relatedNode || element,
                optionalProperties.prevValue || null,
                optionalProperties.newValue || null,
                optionalProperties.attrName || null,
                optionalProperties.attrChange || 1
            );
                                
        default:
            throw "Event type '"+event+" is not implemented!";
    }
    
    for (var prop in optionalProperties)
        if (optionalProperties.propertyIsEnumerable(prop))
            e[prop] = optionalProperties[prop];
    
    return element.dispatchEvent(e);
}

Object.defineProperty( Object.prototype, "setProperty", {
    "get": function() {
        return function( methodName, methodValue ) {
            this[ methodName ] = methodValue;
            return this;
        }
    }
});

Object.defineProperty( Object.prototype, "chain", {
    "get": function() {
        return function( callbackFunc ) {
            callbackFunc.apply( this, Array.prototype.slice( arguments, 0 ) );
            return this;
        }
    }
} );

Object.defineProperty( Object.prototype, "fields", {
    "get": function() {
        return function( properties ) {
            var o = {}, propName;
            for ( var i=0,len=properties.length; i<len; i++ ) {
                if ( typeof this[ propName = properties[i] ] != 'undefined' )
                    o[ propName ] = this[ propName ];
            }
            return o;
        }
    }
} );

Node.prototype.insert = function( node ){ 
    return node; 
};

Node.prototype.addClass = function( className ) {
    addStyle( this, className );
    return this;
}

Node.prototype.removeClass = function( className ) {
    removeStyle( this, className );
    return this;
}

Node.prototype.hasClass = function( className ) {
    return hasStyle( this, className );
}

/* Implementation of a individual paralel event system */
function EnableCustomEventListeners(DOMElement) {
    //deprecated, there's no sense to call this right now
}


Object.defineProperty( Object.prototype, "addCustomEventListener", {
    "get": function() {
        return function( eventName, callbackFunc ) {
            this.customEventListeners = this.customEventListeners || {};
            if (!this.customEventListeners[eventName])
                this.customEventListeners[eventName] = [];
            this.customEventListeners[eventName].push(callbackFunc);
        }
    }
} );

Object.defineProperty( Object.prototype, "removeCustomEventListener", {
    "get": function() {
        return function( eventName, callbackFunc ) {
            if (this.customEventListeners && this.customEventListeners[eventName] ) {
                for (var i=0, len=this.customEventListeners.length; i<len; i++) {
                    if ( this.customEventListeners[eventName][i] == callbackFunc ) {
                        this.customEventListeners[eventName].splice(i,1);
                        break;
                    }
                }
            }
        };
    }
});

Object.defineProperty( Object.prototype, "onCustomEvent", {
    "get": function() {
        return function( eventName, eventData ) {
            
            if (!this.customEventListeners || !this.customEventListeners[eventName]) 
                return true;
            
            var isFalse = true;
        
            for (var i=0, len = this.customEventListeners[eventName].length; i<len; i++) {
                try {
                    if (!this.customEventListeners[eventName][i].apply( this, [eventData] )) 
                        isFalse = false;
                } catch(ex) {
                    isFalse = false;
                    console.error( ex );
                    console.log("Error was: " + ex );
                }
            }
            
            return isFalse;
        };
    }
});