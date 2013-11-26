function TextDropDown(optionalItems) {
    
    var holder = $('div', 'DOMTextDropDown');
    
    var relative = holder.appendChild(
        $('div', 'relative')
    );
    
    var autoComplete = relative.appendChild(
        $('input', 'autoComplete').setAttr(
            'type', 'text'
        )
    );
    
    var ctl = relative.appendChild(
        $('input').setAttr(
            'type', 'text'
        )
    );
    
    var expanderButton = relative.appendChild(
        $('div', 'expander')
    );
    
    var selectedIndex = -1;
    var options = [];
    var optionsOverlay = null;
    var initialValue = null;
    var suggestIndex = -1;
    
    autoComplete.disabled = true;
    ctl.value = 'asd';
    
    window.drop = holder;
    
    Object.defineProperty(holder, 'disabled', {
        'get': function() {
            return ctl.disabled;
        },
        'set': function(boolValue) {
            ctl.disabled = !!boolValue;
        }
    });
    
    Object.defineProperty(holder, 'readOnly', {
        'get': function() {
            return ctl.readOnly;
        },
        'set': function(boolValue) {
            ctl.readOnly = !!boolValue;
        }
    });
    
    Object.defineProperty(holder, 'placeholder', {
        'get': function() {
            return ctl.placeHolder;
        },
        'set': function(stringValue) {
            ctl.placeholder = stringValue;
        }
    });
    
    Object.defineProperty(holder, 'hintText', {
        'get': function() {
            return autoComplete.value;
        },
        'set': function(stringValue) {
            autoComplete.value = stringValue;
        }
    });
    
    Object.defineProperty(holder, 'selectedIndex', {
        'get': function() {
            return selectedIndex;
        },
        'set': function(integerValue) {
        
            var oldValue = holder.value;
        
            if ( selectedIndex >= 0 && selectedIndex < options.length)
                options[selectedIndex].selected = false;
            
        
            if (typeof integerValue != 'number' || integerValue < -1 || integerValue >= options.length)
                throw "textDropDown.selectedIndex (setter): Bad selectedIndex value";
            
            ctl.value = integerValue != -1 ? options[integerValue].text : '';
            autoComplete.value = '';
            
            selectedIndex = integerValue;
            
            if (selectedIndex >= 0)
                options[selectedIndex].selected = true;
            
            if (options.length && (oldValue != holder.value)) {
                holder.onCustomEvent('change', options[selectedIndex].value);
            }
        }
    });
    
    Object.defineProperty(holder, 'options', {
        'get': function() {
            return options;
        }
    });
    
    holder.createOptionElement = function(optionElement) {
        
        var anOption = {};
        
        var sText  = null;
        var sValue = null;
        var sDiv   = null;
        var sFilter= null;
        var bVisible = true;
        var bSelected= false;
        
        anOption.onAttach = function() {
            if (sDiv === null) {
                sDiv = $('div');

                sDiv.style.display = bVisible ? '' : 'none';
                
                (bSelected ? addStyle : removeStyle)(sDiv, 'selected');

                if (sText !== null) {
                    sDiv.appendChild(
                        $text(sText)
                    );
                }
                
                Object.defineProperty(
                    sDiv,
                    'optionElement',
                    {
                        'get': function() {
                            return anOption;
                        }
                    }
                );
                
                sDiv.addEventListener('click', function(e) {
                    
                    for (var i=0; i<options.length; i++) {
                        if (options[i] == anOption) {
                            holder.selectedIndex = i;
                            holder.expanded = false;
                            break;
                        }
                    }
                    
                }, true);
            }
        };
        
        anOption.onDettach = function() {
            if (sDiv !== null) {
                if (sDiv.parentNode)
                    sDiv.parentNode.removeChild(sDiv);
                sDiv = null;
            }
        };
        
        Object.defineProperty(anOption, 'text', {
            'get': function() {
                return sText;
            },
            'set': function(strValue) {
                sText = strValue.toString();
                if (sDiv !== null) {
                    sDiv.innerHTML = '';
                    sDiv.appendChild($text(sText));
                }
            }
        });
        
        Object.defineProperty(anOption, 'value', {
            'get': function() {
                return sValue;
            },
            'set': function(strValue) {
                sValue = strValue.toString();
                if (sText === null) sText = sValue;
            }
        });
        
        Object.defineProperty(anOption, 'visible', {
            'get': function() {
                return bVisible;
            },
            'set': function(bool) {
                bVisible = !!bool;
                if (sDiv)
                    sDiv.style.display = bVisible ? '' : 'none';
            }
        });
        
        Object.defineProperty(anOption, 'textFilter', {
            'get': function() {
                return sFilter;
            },
            'set': function(strValue) {
                if (strValue == sFilter)
                    return;
                sFilter = strValue;
                if (sDiv !== null)
                    anOption.visible = (
                         strValue &&
                         sText.toString().toLowerCase().indexOf(strValue.toString().toLowerCase())
                    ) == 0;
            }
        });
        
        Object.defineProperty(anOption, 'DOMElement', {
            'get': function() {
                return sDiv;
            }
        });
        
        Object.defineProperty(anOption, 'selected', {
            'get': function() {
                return bSelected;
            },
            'set': function(boolValue) {
                bSelected = !!boolValue;
                if (sDiv)
                    (bSelected ? addStyle : removeStyle)(sDiv, 'selected');
            }
        });
        
        anOption.value = optionElement.value;
        
        if (optionElement.text)
            anOption.text = optionElement.text;
        
        return anOption;
    }
    
    holder.add = function(optionElementGenericObject, before) {
        before = typeof before == 'undefined' ? options.length : before;
        
        before = before < 0 ? 0 : ( before > options.length ? options.length : before );
        
        var justAdded = justAdded = holder.createOptionElement(
                optionElementGenericObject
        );
        
        
        if (optionsOverlay) {
        
            justAdded.onAttach();
            
            if (before < options.length && options.length > 1) {

                optionsOverlay.insertBefore(
                    justAdded.DOMElement,
                    options[before].DOMElement
                );
                
            } else {
                
                optionsOverlay.appendChild(
                    justAdded.DOMElement
                );
                
            }
        }
        
        options.splice(
            before, 0,
            justAdded
        );
        
        return justAdded
    };
    
    holder.remove = function(optionIndex) {
        if (typeof optionIndex != 'number')
            throw "textDropdown.remove(optionIndex): a 'number' should be provided @optionIndex param";
        if (optionIndex < 0 || optionIndex >= options.length)
            throw "textDropdown.remove(optionIndex): index out of range";
        options[optionIndex].onDettach();
        options.splice(
            optionIndex, 1
        );
        selectedIndex = selectedIndex == optionIndex ? -1 :
            ( selectedIndex > optionIndex ? selectedIndex - 1 : selectedIndex );
    };
    
    holder.clear = function(optionIndex) {
        options = [];
        if (optionsOverlay)
            optionsOverlay.innerHTML = '';
        
        holder.expanded = false;
        selectedIndex = -1;
        ctl.value = '';
        autoComplete.value = '';
    }
    
    Object.defineProperty(holder, 'multiple', {
        'get': function() { return false; }
    });
    
    Object.defineProperty(holder, 'size', {
        'get': function() { return 1; },
        'set': function(intValue) {
            throw "Property 'size' is not implemented yet!";
        }
    });
    
    var _DOMAnchors = {
        '_dummy': function(w,h) {
            if (optionsOverlay !== null) {
                optionsOverlay.style.width = holder.offsetWidth - 6 + 'px';
                var pin = new Pinner(holder, optionsOverlay, 'bottom');
                pin.setPinMode('bottom', true);
            }
        }
    };
    
    Object.defineProperty(
        holder, 'DOManchors', {
            'get': function() {
                return _DOMAnchors;
            },
            'set': function(JavascriptObject) {
                _DOMAnchors = {
                    '_dummy': _DOMAnchors._dummy
                };
                if (JavascriptObject) {
                    for (var key in JavascriptObject) {
                        if (JavascriptObject.propertyIsEnumerable(key)) {
                            _DOMAnchors[key] = JavascriptObject[key];
                        }
                    }
                }
            }
        }
    );
    
    Object.defineProperty(holder, 'expanded', {
        'get': function() {
            return optionsOverlay !== null;
        },
        'set': function(boolValue) {
            boolValue = !!boolValue;
            
            switch (boolValue) {
                case true:
                    if (!optionsOverlay) {
                        optionsOverlay = $('div', 'DOMTextDropDown_Overlay');
                    
                        addStyle(holder, 'expanded');
                    
                        for (var i=0; i<options.length; i++) {
                            options[i].onAttach();
                            optionsOverlay.appendChild(options[i].DOMElement);
                        }
                    
                        optionsOverlay.addEventListener('mousedown', function(e) {
                            cancelEvent(e);
                        }, true);
                    }
                    
                    document.body.appendChild(optionsOverlay);
                    optionsOverlay.style.width = holder.offsetWidth - 6 + 'px';
                    var pin = new Pinner(holder, optionsOverlay, 'bottom');
                    pin.setPinMode('bottom', true);
                    
                    break;
                case false:
                    if (optionsOverlay.parentNode)
                        optionsOverlay.parentNode.removeChild(optionsOverlay);
                    removeStyle(holder, 'expanded');
                    break;
            }
        }
    });
    
    holder.addEventListener('click', function(e) {
        if (options.length) {
            holder.expanded = true;
        }
    }, true);
    
    
    holder.addEventListener('blur', function(e) {
        holder.expanded = false;
        holder.onChangeKey();
    }, true);
    
    EnableCustomEventListeners(holder);
    
    ctl.addEventListener('keyup', function(e) {
        //console.log('press "'+ctl.value+'"');
        if (initialValue != ctl.value) {
            initialValue = ctl.value;
            holder.onCustomEvent('textChange', ctl.value);
        }
    }, true);
    
    var doAutoComplete = function(strValue, tabPressed) {
        
        var matches = [];
        
        //Find the best auto suggest item ...
        if (options.length && strValue != '') {
            for (var i=0; i<options.length; i++) {
                if (options[i].visible) 
                    matches.push(options[i].text);
            }
            
            var lowerCase = strValue.toLowerCase();
            var indexA    = -1;
            var indexB    = -1;
            
            //Sort matches ...
            matches.sort(function(a,b){
                aS = a.toLowerCase();
                bS = b.toLowerCase();
                
                indexA = aS.indexOf(lowerCase);
                indexB = bS.indexOf(lowerCase);
                
                switch (true) {
                    case aS == bS:
                        return 0;
                        break;
                    case aS == lowerCase:
                        return -1;
                        break;
                    case bS == lowerCase:
                        return -1;
                        break;
                    case indexA == 0 && indexB == 0:
                        return a.length < b.length ? -1 : 1;
                        break;
                    case indexA == 0:
                        return -1;
                        break;
                    case indexB == 0:
                        return 1;
                        break;
                    default:
                        return aS < bS ? -1 : 1;
                        break;
                }
            });
            
            if (!tabPressed) {
                holder.hintText = typeof matches[0] != 'undefined' ?  ctl.value.concat(matches[0].substr(ctl.value.length ) ) : '';
            } else {
                ctl.value = typeof matches[0] != 'undefined' ? matches[0] : (!tabPressed ? '' : ctl.value);
                autoComplete.value = '';
            }
        
        } else if (!tabPressed)
            autoComplete.value = '';
        
    }
    
    Keyboard.bindKeyboardHandler(ctl, 'tab', function() {
        if (ctl.value)
            doAutoComplete(ctl.value, true);
    });
    
    holder.onChangeKey =  function() {
        if (ctl.value) {
            for (var i=0; i<options.length; i++) {
                if (options[i].text.toLowerCase() == ctl.value.toLowerCase()) {
                    holder.selectedIndex = i;
                    ctl.value = options[i].text;
                    
                    holder.expanded = false;
                    
                    break;
                }
            }
        }
    };
    
    Keyboard.bindKeyboardHandler(ctl, 'enter', holder.onChangeKey);
    
    holder.addCustomEventListener('textChange', function(strValue) {
        var allHidden = true;
        
        for (var i=0; i<options.length; i++) {
            options[i].textFilter = strValue;
            if (options[i].visible)
                allHidden = false;
        }
        
        try {
            options[selectedIndex].selected = false;
            selectedIndex = -1;
        } catch(e) {}
        
        if (!allHidden) {
            doAutoComplete(strValue, false);
        } else
            autoComplete.value = '';
        
        if (optionsOverlay) {
            optionsOverlay.style.display = allHidden ? 'none' : '';
        }
    });

    drop.addItem = function(tValue, tText) {
        var opt = {};
        opt.value = tValue;
        opt.text = typeof tText != 'undefined' ? tText : tValue;
        return drop.add(opt);
    };

    drop.setItems = function(arr) {
        selectedIndex = -1;
        ctl.value = '';
        autoComplete.value = '';
        
        if (drop.options.length)
            while (drop.options.length > 0)
                drop.remove(0);
        for (var i=0; i<arr.length; i++)
            drop.addItem( (typeof arr[i].value != 'undefined' ? arr[i].value : arr[i].id).toString(),
                (arr[i].name || arr[i].text).toString()
            );
        return drop;
    };

    if (typeof optionalItems != 'undefined') {
        drop.setItems(optionalItems);
    }
    
    Object.defineProperty(holder, 'value', {
        'get': function() {
            if (selectedIndex != -1) {
                try {
                    return options[selectedIndex].value;
                } catch(ex) {
                    return null;
                }
            } else {
                return null;
            }
        },
        'set': function(optionValue) {
            for (var i=0; i<options.length; i++) {
                if (optionValue.toString() == options[i].value) {
                    holder.selectedIndex = i;
                    return;
                }
            }
            holder.selectedIndex = -1;
        }
    });
    
    Object.defineProperty(holder, 'textValue', {
        'get': function() {
            return ctl.value;
        },
        'set': function(strValue) {
            var found = false;
            
            for (var i=0; i<options.length; i++) {
                if (options[i].text == strValue) {
                    holder.selectedIndex = i;
                    found = true;
                    warn('found');
                    break;
                }
            }
            
            if (!found) holder.selectedIndex = -1;
            
            ctl.value = strValue;
        }
    });

    return holder;
}