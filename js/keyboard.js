
window['.keyboard'] = {
    'keyBindings': {
        'backspace': 8,
        'tab'   : 9,
        'enter' : 13,
        'break' : 19,
        'capslock': 20,
        'esc'   : 27,
        'space' : 32,
        'page_up': 33,
        'page_down': 34,
        'home'  : 36,
        'end'   : 35,
        'left'  : 37,
        'up'    : 38,
        'right' : 39,
        'down'  : 40,
        'insert': 45,
        'delete': 46,
        '0'     : 48,
        '1'     : 49,
        '2'     : 50,
        '3'     : 51,
        '4'     : 52,
        '5'     : 53,
        '6'     : 54,
        '7'     : 55,
        '8'     : 56,
        '9'     : 57,
        'a'     : 65,
        'b'     : 66,
        'c'     : 67,
        'd'     : 68,
        'e'     : 69,
        'f'     : 70,
        'g'     : 71,
        'h'     : 72,
        'i'     : 73,
        'j'     : 74,
        'k'     : 75,
        'l'     : 76,
        'm'     : 77,
        'n'     : 78,
        'o'     : 79,
        'p'     : 80,
        'q'     : 81,
        'r'     : 82,
        's'     : 83,
        't'     : 84,
        'u'     : 85,
        'v'     : 86,
        'w'     : 87,
        'x'     : 88,
        'y'     : 89,
        'z'     : 90,
        'num_0' : 96,
        'num_1' : 97,
        'num_2' : 98,
        'num_3' : 99,
        'num_4' : 100,
        'num_5' : 101,
        'num_6' : 102,
        'num_7' : 103,
        'num_8' : 104,
        'num_9' : 105,
        'num_*' : 106,
        'num_+' : 107,
        'num_-' : 109,
        'num_.' : 110,
        'num_/' : 111,
        'f1'    : 112,
        'f2'    : 113,
        'f3'    : 114,
        'f4'    : 115,
        'f5'    : 116,
        'f6'    : 117,
        'f7'    : 118,
        'f8'    : 119,
        'f9'    : 120,
        'f10'   : 121,
        'f11'   : 122,
        'f12'   : 123,
        'numlock'   : 144,
        'scrolllock': 145,
        ';'     : 186,
        '='     : 187,
        ','     : 188,
        // '/'     : 189,
        '.'     : 190,
        '/'     : 191,
        '`'     : 192,
        '['     : 219,
        '\\'    : 220,
        ']'     : 221,
        '\''    : 222,
        '-'     : 189
    },
    
    'invisibleKeys': [
        //F1 .. F12
        112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
        //TAB, ENTER, ESC, etc.
        8, 9, 13, 19, 20, 27, 32, 37, 38, 39, 40, 45, 46, 35, 36, 33, 34, 144, 145
    ],

    'translateKeyboardEventString': function(e) {
        e = e || window.event;
        var charCode = e.keyCode || e.charCode;
        var arr = [];
        if (e.ctrlKey) arr.push('ctrl');
        if (e.altKey) arr.push('alt');
        if (e.shiftKey) arr.push('shift');
        for (var key in Keyboard.keyBindings) {
            if (Keyboard.keyBindings[key] === charCode) {
                arr.push(key);
                return arr.join(' ');
            }
        }
        
        return null;
    },
    'unbindKeyboardHandlers': function(obj, keysList) {
        if (!obj || !obj.__KEYBOARD_BINDINGS) return;
        for (var i = 0; i<keysList.length; i++) {
            if (typeof obj.__KEYBOARD_BINDINGS[keysList[i]] != 'undefined')
                delete obj.__KEYBOARD_BINDINGS[keysList[i]];
        }
    },
    'bindKeyboardHandler': function (obj, keyString, handlerFunc) {
        keyString = keyString.toString().trim().toLowerCase();
        
        var translate = /^(ctrl[\s]+?)?(alt[\s]+?)?(shift[\s]+?)?([^*]+)$/.exec(keyString);
        
        if (!translate) return false;
        
        var isCtrl = translate[1];
        var isAlt  = translate[2];
        var isShift= translate[3];
        
        var theKey = translate[4];
        var keyValid = false;
        var keyCode = false;
        
        for (var key in Keyboard.keyBindings) {
            if (theKey == key) {
                keyValid = true;
                keyCode = Keyboard.keyBindings[key];
                break;
            }
        }
        
        if (keyValid === false) {
            try {
                console.error("Keyboard.bindKeyboardHandler: Don't have a keybinding for key '"+theKey+"'");
            } catch(ex) {}
            return false;
        }
        
        if (!isCtrl && !isAlt && !isShift && (Keyboard.invisibleKeys.indexOf(keyCode) == -1)) {
            try {
                console.warn("Keyboard.bindKeyboardHandler: the shortcut key does not contain (ctrl | alt | shift | invKey). aborted!");
            } catch (ex) { }
            return false;
        }
        
        obj.__KEYBOARD_BINDINGS = obj.__KEYBOARD_BINDINGS || {};
        obj.__KEYBOARD_BINDINGS[keyString] = handlerFunc;
        
        if (typeof obj.__KEYBOARD_HANDLER == 'undefined') {
            obj.__KEYBOARD_HANDLER = function(e) {
                
                //console.log(e);
                
                var ownerWindow = getOwnerWindow( e.srcElement );
                
                if (ownerWindow != getOwnerWindow( obj ) && ownerWindow != obj && e.srcElement != obj) {
                    //console.log("Canceled event!");
                    return true;
                }
                
                if (typeof obj.active != 'undefined' && !obj.active) return;
                
                e = e || window.event;
                var c = e.keyCode || e.charCode;
                
                if (!e.ctrlKey && !e.altKey && !e.shiftKey && (Keyboard.invisibleKeys.indexOf(c) == -1))
                    return;
                
                var keyString = Keyboard.translateKeyboardEventString(e);
                //console.log(keyString);
                if (keyString === null) return;
                if (typeof obj.__KEYBOARD_BINDINGS[keyString] != 'undefined') {
                    obj.__KEYBOARD_BINDINGS[keyString]();
                    cancelEvent(e);
                }
            };
            
            try {
                obj.addEventListener('keydown', obj.__KEYBOARD_HANDLER, true);
            } catch(ex) {
                obj.attachEvent('onkeydown', obj.__KEYBOARD_HANDLER);
            }
        }
    },
    
    //Forces Tab and Shift+Tab policy inside a DOMElement container
    'setFocusCycling': function(DOMElement) {
        DOMElement.tabIndex = DOMElement.tabIndex || 0;
        
        DOMElement.__FocusFirst = function() {
            var items = DOMElement.getElementsByTagName('*');
            for (var i=0; i<items.length; i++) {
                if (items[i].offsetWidth || items[i].offsetHeight) {
                    items[i].focus();
                    if (items[i] == document.activeElement) return;
                }
            }
            DOMElement.focus();
        };
        
        DOMElement.__FocusLast = function() {
            var items = DOMElement.getElementsByTagName('*');
            for (var i=items.length - 1; i >= 0; i--) {
                if (items[i].offsetWidth || items[i].offsetHeight) {
                    items[i].focus();
                    if (items[i] == document.activeElement) return;
                }
            }
            DOMElement.focus();
        };
        
        DOMElement.__FocusNext = function(node) {
            var childs = DOMElement.getElementsByTagName('*');
            var i = 0;
            var next = null;
            while (childs[i] != document.activeElement && i<childs.length) {
                i++;
            }
            i++;
            if (i >= childs.length) {
                DOMElement.__FocusFirst();
                return;
            }
            while (i < childs.length) {
                if (childs[i].offsetWidth == 0 && childs[i].offsetHeight == 0) {
                    i++;
                    continue;
                }
                try {
                    childs[i].focus();
                } catch(ex) {
                    
                }
                if (childs[i] == document.activeElement)
                    return;
                i++;
            }
            DOMElement.__FocusFirst();
        };
        
        DOMElement.__FocusPrevious = function(node) {
            var childs = DOMElement.getElementsByTagName('*');
            var i = childs.length - 1;
            var next = null;
            while (childs[i] != document.activeElement && i>=0) {
                i--;
            }
            i--;
            if (i <0 ) {
                DOMElement.__FocusLast();
                return;
            }
            while (i >= 0) {
                if (childs[i].offsetWidth == 0 && childs[i].offsetHeight == 0) {
                    i--;
                    continue;
                }
                try {
                    childs[i].focus();
                } catch(ex) {
                    
                }
                if (childs[i] == document.activeElement)
                    return;
                i--;
            }
            DOMElement.__FocusLast();
        };
        
        DOMElement.__OnTabKey = function(evt) {
            evt = evt || window.event;
            var code = evt.keyCode || evt.charCode;
            if (code == 9 && isChildOf(document.activeElement, DOMElement)) {
//                 console.log(DOMElement);
                (evt.shiftKey ? DOMElement.__FocusPrevious : DOMElement.__FocusNext) (document.activeElement);
                cancelEvent(evt);
            }
        }
        
        if (DOMElement.addEventListener)
           DOMElement.addEventListener('keydown', DOMElement.__OnTabKey, false);
        else
           DOMElement.attachEvent('onkeydown', DOMElement.__OnTabKey);
    }
}

try {
    window.__defineGetter__('Keyboard', function() { return window['.keyboard']; });
} catch(ex) {
    window.Keyboard = window['.keyboard'];
    delete window['.keyboard'];
}

addOnload(function() {
    Keyboard.bindKeyboardHandler(
        window,
        'alt left',
        function() {
            if (confirm('Do you want to navigate away (back) from this page?'))
                window.history.back();
        }
    );
});