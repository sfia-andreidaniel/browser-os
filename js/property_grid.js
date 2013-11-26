Node.prototype.evaluate = function( code ) {
    eval( code );
};

function PropertyGridRow(ownerGrid, nameSpace, inputSpace, rowSettings) {

    var row = $('div', 'DOMPropertyGridRow');
    
    row._settings = rowSettings;
    
    if (typeof rowSettings == 'undefined' ||
        !(rowSettings instanceof Object)
       ) throw "PropertyGridRow: Third function should be an Object-based variable";
    
    if (typeof rowSettings.items == 'undefined') {
        if (typeof rowSettings.name == 'undefined')
            throw "PropertyGridRow Arguments[3]: name property required!";
        if (typeof rowSettings.type == 'undefined')
            throw "PropertyGridRow Arguments[3]: .type property required on variable ("+rowSettings.name+")";
        if (typeof rowSettings.label == 'undefined')
            throw "PropertyGridRow Arguments[3]: .label property required!";
    }
    
    row._labelHolder = row.appendChild($('div', 'GridRowLabel'));
    row._labelStr    = rowSettings.label || 'Label';
    
    row._valueHolder = row.appendChild($('div', 'GridRowValue'));
    
    row.__defineSetter__('height', function(intVal) {
        row.style.height = intVal+'px';
        row.onDOMresize( row.offsetWidth, row.offsetHeight );
    });
    
    row.__defineGetter__('height', function() {
        return row.offsetHeight;
    });
    
    row.__defineGetter__('name', function() {
        return rowSettings.name;
    });
    
    row._isResizeable = false;
    row.getVerticalResize = function() {
        return row._isResizeable;
    };
    row.setVerticalResize = function(bool) {
        var b = bool ? true : false;
        if (b == row._isResizeable)
            return;
        if (b) {
            row.resizeHandler = row.appendChild($('div', 'DOMPropertyGridVerticalResize')).setAttr('dragable', '1');
            
            row.resizeHandler.moveStart = function() {};
            row.resizeHandler.moveStop = function() { row.resizeHandler.style.top = null; /* fallback to css... :) */ };
            row.resizeHandler.moveRun = function() {
                row.height = row.resizeHandler.offsetTop;
            };
            
            //Implement move left-right for the splitter...
            row._dragListener_ = new dragObject(
                row.resizeHandler,
                null,
                new Position(0, 20),
                new Position(0, 5000),
                row.resizeHandler.moveStart,
                row.resizeHandler.moveRun,
                row.resizeHandler.moveStop,
                null, 
                true
            );

        } else {
            try {
                row.removeChild(row.resizeHandler);
                delete row.resizeHandler;
            } catch (ex) {
            }
        }
        row._isResizeable = b;
    };
    
    row.__defineGetter__('verticalResize', row.getVerticalResize);
    row.__defineSetter__('verticalResize', row.setVerticalResize);
    
    row._nullRow     = row.appendChild($('div', 'GridNullValue').setAttr('style', 'display: none').setHTML('<b style="color: #666">[NULL]</b>'));

    row.__defineGetter__('label', function() {
        return row._labelStr;
    });
    
    row.__defineSetter__('label', function(str) {
        row._labelHolder.innerHTML = '';
        row._labelHolder.appendChild($text(str));
        row._labelStr = str;
    });
    
    row.label = row.label;
    
    if (typeof (rowSettings.items) == 'undefined') {
        addStyle(row, 'multi');
        
        //make row focuseable
        row.tabIndex = 0;
    
        //Not, init the cell handler function ...
        if (typeof window['PropertyGrid__'+rowSettings.type] == 'undefined') {
            throw "PropertyGrid: No plugin found to handle type "+rowSettings.type+"!";
        } else {
            window["PropertyGrid__"+rowSettings.type](row._valueHolder, rowSettings);
            
            //Now get all inputs from the row._valueHolder, and add two event listeners for updating
            //the row focus state
            
            var inputs = row.__inputs = row._valueHolder.querySelectorAll('input,select,textarea');
            for (var i=0; i<inputs.length; i++) {
                (function(input) {
                    input.addEventListener('focus', function() {
                        addStyle(row, 'focused');
                    }, true);
                    input.addEventListener('blur', function() {
                        removeStyle(row, 'focused');
                    }, true);
                })(inputs[i]);
            }
            row._valueHolder.addEventListener('focus', function() {
                addStyle(row, 'focused');
            }, true);
            row._valueHolder.addEventListener('blur', function() {
                removeStyle(row, 'focused');
            }, true);
            
            row.addEventListener('focus', function(e) {
		e = e || window.event;
// 		cancelEvent(e);
                if (typeof row.__inputs != 'undefined' && row.__inputs.length) {
                    row.__inputs[ row.__inputs.length - 1 ].focus();
		    try {row.__inputs[ row.__inputs.length - 1 ].select(); } catch(ex) {}
                }
            }, true);
            
            row.validate = function() {
                if (!row._settings) return true;
                var inputs = row._valueHolder.querySelectorAll('input[type="text"],textarea');
                if (!inputs.length) return true;

                switch (true) {

                    case typeof row._settings.minLength != 'undefined':
                        var len = parseInt(row._settings.minLength);
                        if (isNaN(len) || len < 0) 
                            return true;
                        if (inputs[0].value.toString().length < len)
                            throw 'Field length must be at least '+len+' chars!';
                    
                    case typeof row._settings.maxLength != 'undefined':
                        var len = parseInt(row._settings.maxLength);
                        if (isNaN(len) || len < 1)
                            return true;
                        if (inputs[0].value.toString().length > len)
                            throw 'Field length must not exceed '+len+' chars!';
                        
                    case typeof row._settings.regexp != 'undefined':
                        var expr =  row._settings.regexp instanceof RegExp ? row._settings.regexp : new RegExp(row._settings.regexp);
/*                        if (row._settings.regexp instanceof RegExp) {
                            console.log("Using native Regular Expression: ");
                            console.log(row._settings.regexp);
                        } else {
                            console.log("Building regular expression from string: '"+row._settings.regexp+"':");
                            console.log(expr);
                        }
                        window.lastExpr = expr;*/
                        if (!expr) throw "Invalid regular expression: '"+row._settings.regexp+"'";
                        if (!expr.test(inputs[0].value.toString())) {
                        throw typeof row._settings.regexpError == 'undefined' ? ("Value '"+inputs[0].value.toString()+"' does not match regular expression '"+row._settings.regexp+"'") : row._settings.regexpError;
                    }
                }
                return true;
            };
            
            row.addEventListener('blur', function(e) {
                if (row._isNull) return;
                
                    try {
                        var valid = row.validate();
                        if (!valid) throw 'Error validate row!';
                    } catch (ex) {
                        cancelEvent(e);
                        alert(ex);
                        try {
                            var inp = row.querySelectorAll('input[type=text],textarea')[0].focus();
                            inp.select();
                        } catch(ex) {
                        };
                    
                    }
            }, true);
        }
        
        row._isNull = false;
        
        row.getValue = function() {
            return row._isNull ? null : row._valueHolder.value;
        };
        
        row.getInput = function() {
            if (typeof row._valueHolder.input != 'undefined')
                return row._valueHolder.input;
            var inps = row._valueHolder.querySelectorAll('input,select,textarea');
            return inps.length ? inps[0] : null;
        };
    
        row.setValue = function(value) {
            if (value === null) {
                row._isNull = true;
                try {
                    row.removeChild(row._valueHolder);
                } catch(ex) {}
            } else {
                row._isNull = false;
                row.appendChild(row._valueHolder);
                row._valueHolder.value = value;
            }
            row._nullRow.style.display = row._isNull ? 'block' : 'none';
        };
        
        row.setInput = function(inp) {
            throw "Property 'input' is readOnly";
        };
    
        row.__defineGetter__('value', row.getValue);
        row.__defineSetter__('value', row.setValue);
        
        row.__defineGetter__('input', row.getInput);
        row.__defineSetter__('input', row.setInput);
        
        if (typeof rowSettings.value != 'undefined') row.value = rowSettings.value; else row.value = null;
        
        row._defaultValue = row.value;

        //Define my value in my parent's namespace
        nameSpace.__defineGetter__(rowSettings.name, row.getValue);
        nameSpace.__defineSetter__(rowSettings.name, row.setValue);
        
        inputSpace.__defineGetter__(rowSettings.name, row.getInput);
        inputSpace.__defineSetter__(rowSettings.name, row.setInput);
        
    } else {
        addStyle(row, 'single');
        
        row._nameSpace = {};
        row._inputSpace = {};
        
        row.__defineGetter__('data', function() {
            return row._nameSpace;
        });
        
        row.__defineSetter__('data', function(v) {
            throw "Property 'data' is readOnly";
        });
        
        row.__defineGetter__('inputSpace', function() {
            return row._inputSpace;
        });
        
        row.__defineSetter__('inputSpace', function(v) {
            throw "Property 'inputSpace' is readOnly";
        });
        
        //Register my nameSpace in my parent's namespace ...
        
        nameSpace.__defineGetter__(rowSettings.name, function() {
            return row.data;
        });
        
        nameSpace.__defineSetter__(rowSettings.name, function(v) {
            throw "Property "+rowSettings.name+" is readOnly!";
        });
        
        //Register my inputSpace in my parent's inputspace ...
        
        inputSpace.__defineGetter__(rowSettings.name, function() {
            return row.inputSpace;
        });
        
        inputSpace.__defineSetter__(rowSettings.name, function(v) {
            throw "Property "+rowSettings.name+" is readOnly!";
        });
        
        row._rows = [];
        
        
        for (var i=0; i<rowSettings.items.length; i++) {
            row._rows.push(
                    new PropertyGridRow(ownerGrid, row._nameSpace, row._inputSpace, rowSettings.items[i])
            );
        }
        
        row._dumpChilds = function() {
            var nextSibling = row.nextSibling ? row.nextSibling : null;
            for (var i=0; i<row._rows.length; i++) {
                
                if (!nextSibling) row.parentNode.appendChild(row._rows[i]);
                else row.parentNode.insertBefore(row._rows[i], nextSibling);
            }
        };
        
        row._isExpanded = false;
        
        row._expandHolder = row.appendChild(
            $('div', 'DOMPropertyGridExpand')
        );
        
        row.__defineGetter__('expanded', function() {
            return row._isExpanded;
        });
        
        row.__defineSetter__('expanded', function(bool) {
            (bool ? addStyle : removeStyle)(row._expandHolder, 'expanded');
            for (var i=0; i<row._rows.length; i++) {
                row._rows[i].style.display = bool ? 'block' : 'none';
            }
            row._isExpanded = bool ? true : false;
            
            try {
                if (bool)
                    getOwnerWindow( row ).paint();
            } catch (e) {}
        });
        
        row.onclick = function() {
            row.expanded = !row.expanded;
            ownerGrid.splitPosition = ownerGrid.splitPosition;
        };
        
        disableSelection(row);
        
        row.expanded = typeof rowSettings.expanded == 'undefined' ? true : rowSettings.expanded;
    }
    
    row.splitAt = function(intValue) {
        if (hasStyle(row, 'multi')) {
            row._labelHolder.style.width = intValue - 20 +'px';
            row._valueHolder.style.width = row.offsetWidth - intValue - 2 +'px';
            row._nullRow.style.width = row.offsetWidth - intValue - 2 + 'px';
        }
        if (typeof row._rows != 'undefined') {
            for (var i=0; i<row._rows.length; i++) {
                row._rows[i].splitAt(intValue);
            }
        }
    };
    
    row.reset = function() {
        if (typeof rowSettings.items == 'undefined') 
            row.value = row._defaultValue;
        else for (var i=0; i<row._rows.length; i++)
            row._rows[i].reset();
    };
    
    return row;
}

function PropertyGrid(initDefs) {
    var holder = $('div', 'DOMPropertyGrid');
    
    holder.inner = holder.appendChild($('div', 'DOMPropertyGridInner'));
    holder.inner.DOManchors = {
        'width': function(w,h) { return w + 'px'; },
        'height':function(w,h) { return h + 'px'; }
    }
    
    holder.toolbarHolder = holder.inner.appendChild($('div', 'DOMPropertyGridToolbarHolder'));
    holder.body          = holder.inner.appendChild($('div', 'DOMPropertyGridBody'));
    
    ( function() {
        var hasToolbar = true;
        
        Object.defineProperty( holder, "hasToolbar", {
            "get": function() {
                return hasToolbar;
            },
            "set": function( boolVal ) {
                hasToolbar = !!boolVal;
                ( !hasToolbar ? addStyle : removeStyle )(holder, 'no-toolbar' );
            }
        } );
    } )();
    
    holder.resizeBar     = holder.appendChild($('div', 'DOMPropertyGridResizeHandle').setAttr('dragable', '1'));
    holder._lastSplitPosition = 0;
    holder._rows         = [];
    holder._nameSpace    = {};
    holder._inputs       = {};
    
    
    holder.getSplitPosition = function() {
        return holder.resizeBar.offsetLeft;
    };
    
    holder.setSplitPosition = function(intValue) {
        holder.resizeBar.style.left = intValue + 'px';
        for (var i=0; i<holder._rows.length; i++) {
            holder._rows[i].splitAt(intValue);
        }
    };
    
    EnableCustomEventListeners(holder);
    
    holder.resizeBar.moveStart = function() {
    };
    
    holder.resizeBar.moveStop = function() {
    };
    
    holder.resizeBar.moveRun = function() {
        var nowSplitPosition;
        if (holder._lastSplitPosition != (nowSplitPosition = holder.getSplitPosition())) {
            holder._lastSplitPosition = nowSplitPosition;
            holder.onCustomEvent('resize', holder.getSplitPosition());
        }
    };
    
    holder.addCustomEventListener('resize', function(intVal) {
        holder.splitPosition = intVal;
    });
    
    //holder.setSplitPosition(0);
    
    //Implement move left-right for the splitter...
    holder._dragListener_ = new dragObject(
        holder.resizeBar,
        null,
        new Position(1, 33),
        new Position(5000, 33),
        holder.resizeBar.moveStart,
        holder.resizeBar.moveRun,
        holder.resizeBar.moveStop,
        null, 
        true
    );
    
    holder.__defineGetter__('splitPosition', holder.getSplitPosition);
    holder.__defineSetter__('splitPosition', holder.setSplitPosition);
    
    holder.insertRow = function(rowSettings) {
        var row;
        holder._rows.push(
            holder.body.appendChild(
                row = new PropertyGridRow(
                    holder, holder._nameSpace, holder._inputs, rowSettings
                )
            )
        );
        if (row._dumpChilds) row._dumpChilds();
    }
    
    for (var i=0; i<initDefs.length; i++) {
        holder.insertRow(initDefs[i]);
    }
    
    holder.body.DOManchors = {
        'dummy': function() {
            //console.log('dummy');
            holder.splitPosition = holder.splitPosition;
            return '';
        }
    };
    
    holder.__defineGetter__('values', function() {
        return holder._nameSpace;
    });
    
    holder.__defineSetter__('values', function(v) {
        throw "Property 'values' is readOnly";
    });
    
    holder.__defineGetter__('inputs', function() {
        return holder._inputs;
    });
    
    holder.__defineSetter__('inputs', function(v) {
        throw "Property 'inputs' is readOnly";
    });
    
    holder.bind = function(eventName, inputPath, functionVar, propagationTime) {
        var pathParts = inputPath.split('.');
        var node = holder._inputs;
        for (var i=0; i<pathParts.length; i++) {
            if (typeof node[pathParts[i]] == 'undefined') {
                throw "PropertyGrid.bind: invalid input path: \""+inputPath+"\"";
            }
            node = node[pathParts[i]];
        }
        node.addEventListener(eventName, functionVar, typeof propagationType == 'undefined' ? false : propagationTime);
    };

    holder.bindCustom = function(eventName, inputPath, functionVar, propagationTime) {
        var pathParts = inputPath.split('.');
        var node = holder._inputs;
        for (var i=0; i<pathParts.length; i++) {
            if (typeof node[pathParts[i]] == 'undefined') {
                throw "PropertyGrid.bind: invalid input path: \""+inputPath+"\"";
            }
            node = node[pathParts[i]];
        }
        if (!node.addCustomEventListener)
            throw "Input '"+inputPath+"' does not support custom event listeners!";
        node.addCustomEventListener(eventName, functionVar);
    };
    
    holder.views = [];
    
    holder.__defineGetter__('rows', function() {
        var out = [];
        for (var i=0; i<holder._rows.length; i++) {
            if (hasStyle(holder._rows[i], 'multi')) {
                out.push(holder._rows[i]);
            } else {
                if (holder._rows[i]._rows) {
                    for (var j=0; j<holder._rows[i]._rows.length; j++) {
                        if (hasStyle(holder._rows[i]._rows[j], 'multi'))
                        out.push(holder._rows[i]._rows[j]);
                    }
                }
            }
        }
        return out;
    });
    
    holder.__defineSetter__('rows', function(arg) {
        throw "Property 'rows' is readOnly!";
    });
    
    holder.__defineGetter__('groups', function() {
        var out = [];
        for (var i=0; i<holder._rows.length; i++) {
            if (hasStyle(holder._rows[i], 'single')) {
                out.push(holder._rows[i]);
            } else {
                if (holder._rows[i]._rows) {
                    for (var j=0; j<holder._rows[i]._rows.length; j++) {
                        if (hasStyle(holder._rows[i]._rows[j], 'single'))
                        out.push(holder._rows[i]._rows[j]);
                    }
                }
            }
        }
        return out;
    });
    
    holder.__defineSetter__('groups', function(arg) {
        throw "Property 'groups' is readOnly!";
    });
    
    holder.__defineGetter__('all', function() {
        var out = [];
        var r = holder.rows;
        var g = holder.groups;
        for (var i=0; i<r.length; i++) out.push(r[i]);
        for (var i=0; i<g.length; i++) out.push(g[i]);
        return out;
    });
    
    holder.__defineSetter__('all', function(arg) {
        throw "Property 'all' is readOnly!";
    });
    
    holder.views.push(
        {'mode': 'groupped',
         'button': holder.toolbarHolder.appendChild(
            $('div', 'DOMPropertyGridButton ViewGroupped pressed')
         ),
         'func': function() {
            //console.log('I am groupped now!');
            var all = holder.all;
            for (var i=0; i<all.length; i++) {
                try {
                    all[i].parentNode.removeChild(all[i]);
                } catch(ex) {}
            }
            for (var i=0; i<holder._rows.length; i++) {
                holder.body.appendChild(holder._rows[i]);
            }
            for (var i=0; i<holder._rows.length; i++) {
                if (holder._rows[i]._dumpChilds) {
                    //console.log('dump childs!');
                    holder._rows[i]._dumpChilds();
                }
            }
            for (var i=0; i<all.length; i++) {
                removeStyle(all[i], 'forceShow');
            }
         }
        }
    );
    
    holder.views.push(
        {'mode': 'sorted',
         'button': holder.toolbarHolder.appendChild(
            $('div', 'DOMPropertyGridButton ViewSorted')
         ),
         'func': function() {
            //console.log('I am sorted now!');
            var all = holder.all;
            for (var i=0; i<all.length; i++) {
                try {
                    all[i].parentNode.removeChild(all[i]);
                } catch(ex) {}
            }
            var r = holder.rows;
            var srtTmp = [];
            for (var i=0; i<r.length; i++) {
                srtTmp.push({'label': r[i].label.toString().trim(), 'row': r[i]});
            }
            var funcCompareStr = function(a,b) {
                return a.label == b.label ? 0 : (
                    a.label > b.label ? 1 : -1
                )
            }
            srtTmp.sort(funcCompareStr);
            for (var i=0; i<srtTmp.length; i++) {
                holder.body.appendChild(srtTmp[i].row);
                addStyle(srtTmp[i].row, 'forceShow');
            }
         }
        }
    );
    
    holder._viewMode = null;
    
    holder.getViewMode = function() {
        return holder._viewMode;
    };
    
    holder.setViewMode = function(str) {
        var ok = false;
        for (var i=0; i<holder.views.length; i++) {
            if (holder.views[i].mode == str) {
                ok = true;
                addStyle(holder.views[i].button, 'pressed');
                holder.views[i].func();
            } else {
                removeStyle(holder.views[i].button, 'pressed');
            }
        }
        if (ok === false)
            throw "Invalid viewMode value! (hint: 'groupped' or 'sorted' should work";
        holder._viewMode = str;
    };
    
    for (var i=0; i<holder.views.length; i++) {
        (function(btn, func, mode) { //code isolation :)
            btn.onclick = function() {
                holder.setViewMode(mode);
            };
        })(holder.views[i].button, holder.views[i].func, holder.views[i].mode);
    }
    
    Object.defineProperty( holder, 'viewMode', {
        "get": holder.getViewMode,
        "set": holder.setViewMode
    });
    
    holder.reset = function() {
        for (var i=0; i<holder._rows.length; i++) {
            holder._rows[i].reset();
        }
    };
    
    holder.applyValue = function( path, value ) {
        var parts = path.split('.');
        for (var i=0; i<parts.length; i++) {
            parts[i] = JSON.stringify( parts[i] );
        }
        try {
            var code = "this.values[" + parts.join('][') + "] = " + JSON.stringify( value );
            holder.evaluate( code );
        } catch (e) {
            alert(e);
        }
    }
    
    return holder;
}

function PropertyGrid__Generic(div, settings) {
    div.__value = null;
    div.__defineGetter__('value', function() {
        return div.__value;
    });
    
    div.__defineSetter__('value', function(foreignDataType) {
        div.__value = foreignDataType;
        div.innerHTML = '';
        div.appendChild($text(foreignDataType === null ? 'null' : (typeof foreignDataType == 'undefined' ? 'undefined' : foreignDataType.toString())));
    });
    
    div.value = settings.value;
    addStyle( div, "DOMPropertyGrid__Generic" );
}

function PropertyGrid__FORCE_INT_CAST(variable) {
    var Int = parseInt(variable);
    if (isNaN(Int)) return 0; else return Int;
}

function PropertyGrid__FORCE_FLOAT_CAST(variable) {
    var Int = parseFloat(variable);
    if (isNaN(Int)) return 0; else return Int;
}

function PropertyGrid__int(div, settings) {

    settings = settings || {};

    var initInput = {};

    initInput.value = typeof settings.value != 'undefined' ? PropertyGrid__FORCE_INT_CAST(settings.value) : (
        typeof settings.defaultValue != 'undefined' ? PropertyGrid__FORCE_INT_CAST(settings.defaultValue) : 0
    );
    
    if (typeof settings.min != 'undefined') {
        initInput.minValue = PropertyGrid__FORCE_INT_CAST(settings.min);
    } else initInput.minValue = -10000000000;
    
    if (typeof settings.max != 'undefined') {
        initInput.maxValue = PropertyGrid__FORCE_INT_CAST(settings.max);
    } else initInput.maxValue = 10000000000;
    
    div.input = div.appendChild(new Spinner(initInput));

    addStyle(div.input, 'DOMPropertyGrid__inputSpinner');
    
    div.__defineGetter__('value', function() {
        return div.input.value;
    });
    
    div.__defineSetter__('value', function(intVal) {
        div.input.value = intVal;
    });

    //PropertyGrid__Generic(div, settings);
}

function PropertyGrid__float(div, settings) {
    settings = settings || {};

    var initInput = {};

    initInput.value = typeof settings.value != 'undefined' ? PropertyGrid__FORCE_FLOAT_CAST(settings.value) : (
        typeof settings.defaultValue != 'undefined' ? PropertyGrid__FORCE_FLOAT_CAST(settings.defaultValue) : 0
    );
    
    if (typeof settings.minValue != 'undefined') {
        initInput.minValue = PropertyGrid__FORCE_FLOAT_CAST(settings.minValue);
    }
    
    if (typeof settings.maxValue != 'undefined') {
        initInput.maxValue = PropertyGrid__FORCE_FLOAT_CAST(settings.maxValue);
    }
    
    div.input = div.appendChild(new Spinner(initInput));
    
    addStyle(div.input, 'DOMPropertyGrid__inputSpinner');
    
    div.__defineGetter__('value', function() {
        return div.input.value;
    });
    
    div.__defineSetter__('value', function(intV) {
        div.input.value = intV;
    });

    //PropertyGrid__Generic(div, settings);
}

function PropertyGrid__date(div, settings) {

    settings = settings || '';

    var ctlSettings = {};
    
    if (typeof settings.valueFormat != 'undefined') {
        ctlSettings.valueFormat  = settings.valueFormat;
        ctlSettings.displayFormat  = settings.valueFormat || settings.displayFormat;
    } else {
        ctlSettings.valueFormat = '%Y/%m/%d';
        ctlSettings.displayFormat = '%Y/%m/%d';
    }
    
    div.innerHTML = '';
    div.appendChild(div.input = new DateBox(ctlSettings));
    addStyle(div.input, 'DOMPropertyGrid__inputDate');
    
    div.__defineGetter__('value', function() {
        return div.input.value;
    });
    
    div.__defineSetter__('value', function(dateStr) {
        try {
        div.input.value = dateStr;
        } catch (e) {}
    });
    
    Keyboard.bindKeyboardHandler(div.input, 'backspace', function() {
        div.value = '';
    });
    
    Keyboard.bindKeyboardHandler(div.input, 'delete', function() {
        div.value = '';
    });
    
    if (typeof settings.value != 'undefined') {
        div.value = settings.value;
    }
}

function PropertyGrid__bool(div, settings) {
    div.innerHTML = '';
    div.input = div.appendChild( new DOMCheckBox() );
    
    addStyle(div.input, 'DOMPropertyGrid__inputCheckBox');
    
    div.__defineGetter__('value', function() {
        return div.input.checked;
    });
    
    div.__defineSetter__('value', function(bool) {
        var nState = div.input.checked;
        div.input.checked = bool ? true : false;
        if (nState != div.input.checked)
            div.input.onCustomEvent('change', div.input.checked);
    });
    
    div.value = typeof settings.value == 'undefined' ? false : true;
    
    div.addEventListener('click', function(e) {
        if (e.target == div || e.srcElement == div) {
            div.value = !div.value;
        }
    }, true);
    
    div.input.addEventListener('click', function() {
        div.input.onCustomEvent('change', div.input.checked);
    }, false);
    
    div.tabIndex = 0;
}

function PropertyGrid__varchar(div, settings) {
    div.innerHTML = '';
    div.input = div.appendChild((new TextBox('')).setAttr('type', 'text'));
    
    addStyle(div.input, 'DOMPropertyGrid__inputTextBox');
    
    if (typeof settings.placeholder != 'undefined')
        div.input.setAttr('placeholder', settings.placeholder);
    
    div.__defineGetter__('value', function() {
        return div.input.value;
    });
    
    div.__defineSetter__('value', function(str) {
        div.input.value = str;
    });
    
    div.value = typeof settings.value == 'undefined' ? '' : settings.value;
    
}

function PropertyGrid__password(div, settings) {
    div.innerHTML = '';
    div.input = div.appendChild((new TextBox('')).setAttr('type', 'password'));
    
    addStyle(div.input, 'DOMPropertyGrid__inputTextBox');
    
    if (typeof settings.placeholder != 'undefined')
        div.input.setAttr('placeholder', settings.placeholder);
    
    div.__defineGetter__('value', function() {
        return div.input.value;
    });
    
    div.__defineSetter__('value', function(str) {
        div.input.value = str;
    });
    
    div.value = typeof settings.value == 'undefined' ? '' : settings.value;
    
}

function PropertyGrid__dropdown(div, settings) {
    div.innerHTML = '';
    div.input = div.appendChild(new DropDown());
    
    addStyle(div.input, 'DOMPropertyGrid__inputSelect');
    
    div.__defineGetter__('value', function() {
        return div.input.value;
    });
    
    div.__defineSetter__('value', function(str) {
        div.input.value = str;
    });
    
    div.__defineSetter__('values', function(arr) {
        for (var i=0; i<arr.length; i++) {
            if (typeof arr[i].id != 'undefined' && typeof arr[i].name != 'undefined') {
                arr[i].value = arr[i].id;
                arr[i].text  = arr[i].name;
            }
        }
        div.input.setItems(arr);
    });
    
    div.input.__defineSetter__('values', function(arr) {
        div.values = arr;
    });
    
    if (typeof settings.values != 'undefined')
        div.values = settings.values;
    
    div.input.addEventListener('change', function(e){
        div.input.onCustomEvent('change');
    }, true );
    
    EnableCustomEventListeners( div.input );
}

function PropertyGrid__textarea(div, settings) {
    div.innerHTML = '';
    div.input = div.appendChild(new TextArea(''));
    div.input.style.resize = 'none';
    
    addStyle(div.input, 'DOMPropertyGrid__textArea');
    div.__defineGetter__('value', function() {
        return div.input.value;
    });
    div.__defineSetter__('value', function(str) {
        div.input.value = str;
    });
    
    div.parentNode.verticalResize = typeof settings.resizeable != 'undefined' ? settings.resizeable : true;
    
    div.input.placeholder = settings.placeholder || '';
    
    if (typeof settings.value != 'undefined')
        div.value = settings.value;
    
    div.parentNode.height = typeof settings.height != 'undefined' ? settings.height : 50;
}

function PropertyGrid__DOMStyle(div, settings) {
    div.innerHTML = '';
    div.input = div.appendChild(new TextArea(''));
    div.input.style.resize = 'none';
    
    addStyle(div.input, 'DOMPropertyGrid__textArea');

    Object.defineProperty( div, 'value', {
        "get": function() {
            return div.input.value;
        },
        "set": function(str) {
            var s = str.replace(/;/g, ';\n');
            s = s.replace(/\n[\s]+/g, '\n');
            div.input.value = s;
            var numLines = s.split('\n').length;
            try {
                div.parentNode.height = numLines * 16;
            } catch(e){}
        }
    });

    div.input.addCustomEventListener('change', function() {
        var numLines = div.input.value.split('\n').length;
        div.parentNode.height = numLines * 16;
        return true;
    });

    div.parentNode.verticalResize = typeof settings.resizeable != 'undefined' ? settings.resizeable : true;
    
    if (typeof settings.value != 'undefined')
        div.value = settings.value;
    
    div.input.addEventListener('mousewheel', function(e) {
        var start = div.input.selectionStart;
        start = start || 0;
        var str = div.input.value;
        while ( start >= 0 && !/[\s\:\;\,\)]/.test( str.charAt( start ) ) )
            start--;

        start++;
        
        var stop = start;
        while ( stop < str.length && /[\-\da-z\%]/.test( str.charAt(stop) ) )
            stop++;
        
        var incVal = str.substr( start, stop-start );
        
        var matches;
        
        if (! (matches = /^([\-\d]+)(px|\%)?$/.exec( incVal ) ) )
            return;
        
        var intPart = parseInt( matches[1] );
        var unitPart= matches[2] || '';
        
        if ( typeof e.wheelDelta == 'undefined' )
            return;
        
        var delta = e.wheelDelta;
        
        if ( delta > 0 )
            intPart += ( e.shiftKey ? 20 : ( e.altKey ? 1 : 5 ) );
        else
            intPart -= ( e.shiftKey ? 20 : ( e.altKey ? 1 : 5 ) );
        
        var replaceWith = intPart + '' + unitPart;
        
        var newValue = str.substr( 0, start ) + replaceWith + str.substr( stop );
        
        div.input.value = newValue;
        
        div.input.onCustomEvent( 'change' );
        div.input.selectionStart = start;
        div.input.selectionEnd = start + replaceWith.length;
        
    }, true);
    
    div.parentNode.height = typeof settings.height != 'undefined' ? settings.height : 50;
}

function PropertyGrid__color( div, settings ) {
    div.innerHTML = '';
    div.input = div.appendChild(
        new ColorPicker( settings.value || '#000')
    );
    div.input.style.width = '100%';
    
    addStyle( div.input, 'DOMPropertyGrid__color' );
    
    div.__defineGetter__('value', function() {
        return div.input.value;
    });
    
    div.__defineSetter__('value', function(str) {
        div.input.value = str;
    });
    
    div.parentNode.height = 20;
    div.input.style.borderColor = 'transparent';
}

function PropertyGrid__image( div, settings ) {
    
    div.input = div.appendChild( $('img') );
    div.input.loaded = false;
    div.input.ok = false;
    EnableCustomEventListeners( div.input );
    
    Object.defineProperty(
        div, 'value', {
            "get": function() {
                return div.input.ok ? div.input.src : '';
            },
            "set": function( src ) {
                div.input.ok = false;
                div.input.src = src;
                div.input.style.height = '';
                div.input.style.maxHeight = '';
                div.input.style.maxWidth = '';
                div.input.style.display = 'none';
            }
        }
    );
    
    div.input.style.height = 'auto';
    div.input.style.maxHeight = '32px';
    div.input.style.maxWidth = '32px';
    div.input.style.display = 'none';
    
    div.info = div.appendChild( $('span') );
    div.info.style.whiteSpace = 'nowrap';
    
    div.input.style.verticalAlign = 'middle';
    
    var browse = div.appendChild(
        $('input').setAttr('type', 'file').setAttr(
            "style", "padding: 0; float: right; display: block; width: 83px;"
        )
    );
    
    browse.addEventListener('click', function() {
        browse.parentNode.scrollTop = 0;
        div.scrollTop = 0;
    }, true );
    
    div.input.onload = function() {
        var matches;
        
        div.input.style.display = 'inline-block';
        
        if ( typeof settings.widthHeight != 'undefined' && ( matches = /^([\d]+)x([\d]+)$/.exec( settings.widthHeight ) ) ) {
            if ( parseInt( matches[1] ) != div.input.width ||
                 parseInt( matches[2] ) != div.input.height
            ) {
                DialogBox("Image size should be of " + settings.widthHeight + " pixels, \nbut yours is " + div.input.width + "x" + div.input.height + " pixels, \nplease select other image!", {
                    "caption": "Bad image size",
                    "type": "error"
                });
                div.value = '';
                div.info.innerHTML = 'none';
                return;
            }
        }

        if ( typeof settings.maxWidthHeight != 'undefined' && ( matches = /^([\d]+)x([\d]+)$/.exec( settings.maxWidthHeight ) ) ) {
            if ( parseInt( matches[1] ) < div.input.width ||
                 parseInt( matches[2] ) < div.input.height
            ) {
                DialogBox("Image size should be maximum " + settings.maxWidthHeight + " pixels, \nbut yours is " + div.input.width + "x" + div.input.height + " pixels, \nplease select other image!", {
                    "caption": "Bad image size",
                    "type": "error"
                });
                div.value = '';
                div.info.innerHTML = 'none';
                return;
            }
        }
    
        div.input.style.maxHeight = '32px';
        div.input.style.maxWidth = '32px';
        
        div.info.innerHTML = '';
        div.input.style.visibility = 'visible';
        div.input.ok = true;
        div.input.onCustomEvent( 'change', div.input.src );
        var suggestHeight = Math.min( 64, div.input.offsetHeight );
        
        if ( suggestHeight < 20 )
            suggestHeight = 20;
        
        div.parentNode.height = suggestHeight;
        
        browse.style.marginTop =  ( ( ( suggestHeight - 20 ) / 2 ) ) + "px";
    };
    
    div.input.onerror = function() {
        div.input.style.display = 'none';
        div.info.innerHTML = 'none';
        div.input.ok = false;
        div.input.onCustomEvent( 'change', '' );
        div.input.style.visibility = 'hidden';
        div.parentNode.height = 20;
    };
    
    div.value = settings.value || '';
    
    browse.addEventListener( 'change', function( e ) {
        
        if (!window.File && window.FileReader && window.FileList && window.Blob) {
            DialogBox("Error: HTML5 File Api's not supported!", {
                "type": "error",
                "caption": "Error browsing file",
                "childOf": getOwnerWindow( div ),
                "modal": true
            });
            return;
        }
        
        /* Check for file-size and file-mime */
        var files = e.target.files;
        
        if ( !files.length )
            return;
        
        var f = files[0];
        
        if ( f.size && settings.maxFileSize && f.size > settings.maxFileSize ) {
            DialogBox("Error: File too large. Please select a file of maximum " + settings.maxFileSize + " bytes", {
                "type": "error",
                "caption": "Error browsing file",
                "childOf": getOwnerWindow( div ),
                "modal": true
            });
            return;
        }
        
        if ( !/^image(\/|$)/.test( f.type ) ) {
            DialogBox("Error: File is not an image!", {
                "type": "error",
                "caption": "Error browsing file",
                "childOf": getOwnerWindow( div ),
                "modal": true
            });
        }
        
        var reader = new FileReader();
        
        reader.onload = ( function( theFile ) {
            return function( e ) {
                div.value = e.target.result;
            };
        } )( f );
        
        reader.readAsDataURL( f );
        
    }, true );
}

function PropertyGrid__code( div, settings ) {
    
    /* Settings contains:
       "syntax": "code language"
       "template": "template default code"
       "evaluator": "string javascript function that evaluates code when fetching the value"
       "compiler": "string javascript function that tells if the code is correct written"
       "validator": "string javascript funciton that validates the code"
       "tabPanel": "string that when it's evaluated returns an instance of a JSPlatform.TabPanel"
     */
    
    div.input = div.appendChild( $('div', 'PropertyGrid_Code') );
    
    var editorInstance = "editor_" + getUID();
    
    try {
        var tabPanel = eval( settings.tabPanel );
        if ( !(tabPanel instanceof Node ) || !(tabPanel.addTab instanceof Function) )
            throw "Not evaluated as a tabPanel!";
    } catch (e) {
        settings.tabPanel = 'function() { alert("No tab panel defined. Code editing is disabled!"); throw "ERR_NO_TAB_PANEL"; }';
    }
    
    EnableCustomEventListeners( div.input );
    
    ( function() {
        var value = '';

        try {
            settings.evaluator = settings.evaluator ? eval( '(' + settings.evaluator.toString() + ')' ) : function( s ) { return s; };

            if ( !( settings.evaluator instanceof Function ) )
                throw 'PropertyGrid.input[type=code]: using default evaluator';
            
            settings.evaluator = settings.evaluator.toString();

        } catch (e) {
            settings.evaluator = 'function( s ) { return s; }'
        }
        
        value.evaluate = function() {
            return eval('(' + settings.evaluator + ')' )( value );
        }
        
        Object.defineProperty( div.input, 'value', {
            "get": function() {
                return value;
            },
            "set": function( strVal ) {
                value = ( strVal || settings.template || '' ).toString();
                div.input.innerHTML = '';
                div.input.appendChild(
                    $text( div.title = value.toString().substr(0,256) )
                );
            }
        } );
    } )();
    
    Object.defineProperty(
        div, 'value', {
            "get": function() {
                return div.input.value;
            },
            "set": function( src ) {
                if ( settings.syntax == 'javascript' )
                    div.input.value = js_beautify( src )
                else
                    div.input.value = src;
            }
        }
    );
    
    var browse = div.appendChild(
        ( new Button('...', div.browse = function() {
        
            var panel = eval( settings.tabPanel );

            /* See if there is allready opened a tab. If there is, we make it active */
            var tabs = panel.getTabs();
            
            for ( var i=0,n=tabs.length; i<n; i++ )
                if ( tabs[i] && tabs[i].editor == div ) {
                    tabs[i].active = true;
                    return;
                }
            
            var theTab = panel.addTab({
                "caption": ( function() {
                    
                    if ( settings.snippetName )
                        return eval( '(' + settings.snippetName + ')' )();
                    else
                        return 'snippet';
                    
                } )(),
                "id": editorInstance
            });
            
            theTab.getTab().editor = div;
            theTab.getTab().active = true;
            
            var editor = new AceEditor();
            
            editor.value = div.input.value || settings.template || '';
            
            if ( settings.syntax )
                editor.syntax = settings.syntax;
            
            theTab.insert( editor.setAnchors({
                "width": function(w,h) {
                    return w + "px";
                },
                "height": function(w,h) {
                    return h - 40 + "px";
                }
            }).setAttr("style", "margin-top: 40px") );
            
            var saveFunc = function() {
            
                /* If a compiler is defined, we try to compile the code before saving it */
            
                if ( settings.compiler ) {
                    var compiler = eval( '(' + settings.compiler + ')' );
                    if ( compiler && compiler instanceof Function ) {
                        if (!compiler( editor.value ) )
                            return false;
                    }
                }
                
                if ( settings.validator ) {
                    var validator = eval( '(' + settings.validator + ')' );
                    if ( validator && validator instanceof Function ) {
                        if (!validator( editor.value ) )
                            return false;
                    }
                }
            
                div.input.value = editor.value;
                
                div.input.onCustomEvent('change');
            
                return true;
            }
            
            var btnSave = theTab.insert( ( new Button('Save', function() {
                if ( saveFunc() ) {
                    theTab.getTab().close();
                }
            } ) ).setAttr("style", "position: absolute; left: 5px; top: 5px"));

            var btnCancel = theTab.insert( ( new Button('Cancel', function() {
                theTab.getTab().close();
            } ) ).setAttr("style", "position: absolute; left: 60px; top: 5px"));

            Keyboard.bindKeyboardHandler( editor, 'ctrl s', function() {
                if ( saveFunc() )
                    theTab.getTab().close();
            } );
            
        } ) ).addClass( 'PropertyGrid_Code_Browse' )
    );
    
    div.value = settings.value || '';
}

function PropertyGrid__imageList( div, settings ) {
    
    settings.value = settings.value || null;
    
    if ( typeof settings.values == 'undefined' ||
         !( settings.values instanceof Array )
    ) settings.values = [ settings.value ];
    
    div.input = div.appendChild( $('div') );
    
    EnableCustomEventListeners( div.input );
    
    var value = settings.value;
    var values = settings.values;
    
    Object.defineProperty( div.input, 'value', {
        "get": function() {
            return value;
        },
        "set": function( str ) {
            value = str;
            
            for ( var i=0, imgs = div.input.querySelectorAll('img'), len=imgs.length; i<len; i++ ) {
                
                ( str == imgs[i].getAttribute('src') ? addStyle : removeStyle )( imgs[i], 'selected' );
            }
            
        }
    } );
    
    Object.defineProperty( div.input, 'values', {
        "get": function() {
            return values;
        },
        "set": function( arr ) {
            arr = arr || [];
        
            if ( !(arr instanceof Array ) )
                arr = [];
        
            values = arr;
        
            div.input.innerHTML = '';
        
            for ( var i=0, len = arr.length; i<len; i++ ) {
            
                if (!arr[i])
                    continue;
            
                var img = $('img');
        
                img.onerror = function() {
                    if ( this.parentNode )
                        this.parentNode.removeChild( this );
                };
        
                img.setAttribute('src', arr[i] );
                
                div.input.appendChild( img );
            }
        
        }
    } );
    
    addStyle( div, 'DOMPropertyGrid__ImageList' );
    
    div.parentNode.height = settings.height || 70;
    div.parentNode.verticalResize = typeof settings.resizeable != 'undefined' ? !!settings.resizeable : true;
    
    div.input.addEventListener( 'click', function(e){
        
        var img = e.srcElement || e.target;
        
        if (!img || img.nodeName.toString().toLowerCase() != 'img' )
            return;
        
        div.input.value = img.getAttribute('src');

        div.input.onCustomEvent('change');
        
    }, true );
    
    div.input.values = values;
    div.input.value = value;
    
    Object.defineProperty( div, 'value', {
        "get": function() {
            return div.input.value;
        },
        "set": function( str ) {
            div.input.value = str;
        }
    });
    
}