/* MAP:

    {
        "edges": {
            "top": {
                "height": <int>,
                "columnShift": <int>, <private>
            },
            "left": {
                "width": <int>
            }
        },
        "scrollbars": {
            "horizontal": {
                "pos": <int>,
                "much: <int>
            },
            "vertical": {
                "pos": <int>,
                "much": <int>
            }
        },
        "viewport": {
            "top": <int>,
            "left": <int>,
            "width": <int>,
            "height": <int>,
            "contains": function(row)
        },
        "settings": {
            "defaultColumnWidth": <int>
            "defaultRowHeight": <int>
        },
        "columns": [
            "dragable": <bool> DEFAULT FALSE //Weather columns are arrangeable by mouse drag,
            
            {
                "name": <str>,
                "caption": <str>,
                "width": <int>,
                "left": <int>
                "type": <str>
                "align": <str> { left, right, center }
                "resizeable": <bool>,
                "sortable": <bool>
                @@ IF("sortable=true")
                   "sortOrder": <int> {-1, 0, 1},
                   "sortFunc": <function>
                @@ ENDIF
                "selectable": <bool>
                @@ IF("selectable=true")
                    "selected": <bool>
                @@ ENDIF
            },
            ...
        ],
        "columnsByName: {
            "name1": <Dynamic binding to columns array, by the 'name' attribute>,
            ...
        },
        "rows": [
            {|[
                "property1" || index1 : <value1>,
                "property2" || index2 : <value2>,
                "_bind_"              : {
                    "row": {
                        "height":   <int>,
                        "selected": <int>,
                        "top":      <int>,
                        "left":     <int>
                    },
                    "cells": {
                        index1,
                        index2,
                        index3,
                        ...,
                        
                        "length": <getter>
                        
                        "byName": {
                            "cellName1",
                            "cellName2",
                            "cellName3"
                        }
                    },
                    "binding": <grid row binder>
                }
            ]|},
            ...
            
            resizeable: bool
        ],
        "bindings": [
            ... //< Here we store visible rows of the grid >
        ],
        "selection": {
       @R: "byColumns": [
                ColumnObject1,
                ColumnObject2,
                ...
                ColumnObjectN
            ],
     @R/W: "byColumnsIndexes": [
                indexSelectedColumn1,
                indexSelectedColumn2,
                ...
                indexSelectedColumnN
            ],
     @R/W: "byColumnsNames": [
                'selectedColumnName1',
                'selectedColumnName2',
                ...
                'selectedColumnNameN
            ],
        @R: "byRows": [
                RowObject1,
                RowObject2,
                ...
                RowObjectN
            ],
      @R/W: "byRowsIndexes": [
                indexSelectedRow1,
                indexSelectedRow2,
                ...
                indexSelectedRow3
            ],
      @R/W: "byRowsPrimaryKeys": [
                primaryKeySelectedRow1,
                primaryKeySelectedRow2,
                ...
                primaryKeySelectedRowN
            ]
        }
        "primaryKey": null //The name of the column that's considered primary key. Otherwise, the row-index,
        "selectable": bool,
        
        @@IF selectable = TRUE:
        
        "multiple": bool,
        "selectedIndex": int,
        "readOnly": bool,
        
        END @@IF selectable,
        
        "sortFilters": [ //Note that grid supports multiple columns sorters
            {
               "name": <column_name>,
               "order": -1 | 1
               
            },
            ...
        ]
    }


 **/

function HyperDataGrid(initSettings) {
    
    initSettings = initSettings || {};
    initSettings.settings = initSettings.settings || {};
    
    var holder             = $('div', 'DOM_HyperDataGrid');
        holder._bodyHolder = holder.appendChild($('div'));

        holder['.body']    = holder._bodyHolder.appendChild($('div', 'DOM_HyperDataGrid_Body'));
        holder.__defineGetter__('body', function() {
            return holder['.body'];
        });
        
        holder['.edges'] = {
            '.top': holder._bodyHolder.appendChild(
                $('div', 'DOM_HyperDataGrid_TopEdge')
            ),
            '.left': holder._bodyHolder.appendChild(
                $('div', 'DOM_HyperDataGrid_LeftEdge').
                    setAttr('style', 'bottom: '+(scrollbarWidth + 1) +'px')
            )
        };
        
        holder['.edges']['.left'].
            addContextMenu([
                {
                    'caption': 'Hide',
                    'handler': function() {
                        var sel = holder.selection.byRows;
                        if (!sel.length) {
                            if (holder.focusedRowIndex >= 0) {
                                holder['.rows'][holder.focusedRowIndex].$.row.visible = false;
                                holder.onViewportChange();
                            }
                        } else {
                            for (var i=0, len = sel.length; i<len; i++)
                                sel[i].$.row.visible = false;
                            
                            holder.onViewportChange();
                        }
                    }
                },
                {
                    'caption': 'Show',
                    'handler': function() {
                        var sel = holder.selection.byRowsIndexes;
                        if (sel.length < 2) {
                            alert('At least two rows have to be selected for this operation');
                        } else {
                            for (var i = sel[0], len = sel[ sel.length - 1]; i<= len; i++) {
                                holder['.rows'][i].$.row.visible = true;
                            }
                            holder.onViewportChange();
                        }
                    }
                }
            ])
        
        holder.__defineGetter__('edges', function() {
            return holder['.edges'];
        });
        

        holder['.edges']['.top']._inner =
            holder['.edges']['.top'].appendChild(
                $('div')
            );
        
        holder['.edges']['.left']._inner =
            holder['.edges']['.left'].appendChild(
                $('div')
            );
        
        holder['.scrollbars'] = {
            '.vertical': holder._bodyHolder.appendChild(
                $('div', 'DOM_HyperDataGrid_VerticalScrollbar').
                setAttr('style', 'width: '+(scrollbarWidth + 1) + 'px;')
            ),
            '.horizontal': holder._bodyHolder.appendChild(
                $('div', 'DOM_HyperDataGrid_HorizontalScrollbar').
                setAttr('style', 'height: '+(Math.max(scrollbarWidth, 20) + 1) + 'px')
            )
        };
        
        holder['.scrollbars']['.vertical']['.height'] = 
            holder['.scrollbars']['.vertical'].appendChild(
                $('div','DOM_HyperDataGrid_ScrollbarSize')
            );
        
        holder['.scrollbars']['.horizontal']['.width'] =
            holder['.scrollbars']['.horizontal'].appendChild(
                $('div', 'DOM_HyperDataGrid_ScrollbarSize')
            );
    
        holder['.topLeftCorner'] =
            holder._bodyHolder.appendChild(
                $('div', 'DOM_HyperDataGrid_TopLeftCorner')
            );
        
        holder['.viewport'] = {
            '.top'   : 0,
            '.left'  : 0,
            '.width' : 0,
            '.height': 0
        };
        
        holder['.settings'] = initSettings.settings || {};
        
        holder['.settings'].defaultRowHeight = initSettings.settings.defaultRowHeight || 20;
        holder['.settings'].defaultColumnWidth = initSettings.settings.defaultColumnWidth || 100;
        
        holder.__defineGetter__('settings', function() {
            return holder['.settings'];
        });
        
        holder['.selection'] = {};
        
        holder.__defineGetter__('selection', function() {
            return holder['.selection'];
        });
        
        //BEGIN: DATASOURCES
        (function() {
            
            var dataSources = {};
            
            dataSources.add = function(name, values) {
                if (!/^[a-z_]([0-9a-z_]+)?$/i.test(name))
                    throw "HyperDataGrid.dataSources.add: Invalid dataSource name. Please use variable-like names!";
                
                if (typeof dataSources[name] != 'undefined' && typeof dataSources['.'.concat(name)] == 'undefined')
                        throw "HyperDataGrid.dataSources.add: Illegal dataSource name!";
                
                if (typeof dataSources['.'.concat(name)] != 'undefined') {
                    console.warn("HyperDataGrid.dataSources.add: Warning: Tried to add more than one time the dataSource '"+name+"', updating it instead. Please use created setter '"+name+"' instead!");
                    dataSources[name] = values;
                    return;
                }
                
                dataSources['.'.concat(name)] = {};
                
                dataSources.__defineGetter__(name, function() {
                    var newOb;
                    
                    newOb = dataSources['.'.concat(name)];
                    
                    newOb.__defineGetter__('toArray', function() {
                        var out = [];
                        for (var i in newOb) {
                            if (i != 'toArray' && newOb.propertyIsEnumerable(i)) {
                                out.push({
                                    'id': i,
                                    'name': newOb[i]
                                });
                            }
                        }
                        return out.sort(function(a,b) {
                            var aName = a.name.toLowerCase();
                            var bName = b.name.toLowerCase();
                            switch(true) {
                                case aName == bName: return 0;
                                    break;
                                case aName < bName: return -1;
                                    break;
                                default: return 1;
                                    break;
                            }
                        });
                    });
                    
                    return newOb;
                });
                
                dataSources.__defineSetter__(name, function(values) {
                    var typeData;
                    var outie = {};
                    var i, len;
                    
                    switch (typeData = typeOf(values)) {
                        case 'object.array':
                            for (i=0, len = values.length; i<len; i++) {
                                if (values[i] && values[i].id && values[i].name)
                                    outie[values[i].toString()] = name.toString();
                                else 
                                    throw "HyperDataGrid.dataSources: Invalid array index found while assigning dataSource '"+name+"'";
                            }
                            
                            break;
                        case 'object':
                            
                            for (i in values) {
                                if (values.propertyIsEnumerable(i.toString()))
                                    outie[i.toString()] = values[i.toString()].toString();
                            }
                            
                            break;
                        default:
                            throw "Illegal data assigned to dataSource '"+name+"': got <"+typeData+">, but expected a [{id:...,name...}, ...], or a {key:value,...} pattern";
                    }
                    
                    dataSources['.'.concat(name)] = outie;
                    
                    setTimeout(function() {
                        holder.onCustomEvent('dataSourceUpdate', name);
                    }, 1);
                });
                
                try {
                    dataSources[name] = values;
                } catch(ex) {
                    delete dataSources['.'.concat(name)];
                    delete dataSources[name];
                    throw ex;
                }
                
                holder.onCustomEvent('dataSourceAdd', 'name');
            };
            
            dataSources.remove = function(name) {
                if (typeof dataSources['.'.concat(name)] == 'undefined')
                    throw "HyperDataGrid.dataSources.remove: Tried to remove a non-existent dataSource called '"+name+"'";
                delete dataSources['.'.concat(name)];
                delete dataSources[name];
                holder.onCustomEvent('dataSourceDelete', name);
            }

            holder.__defineGetter__('dataSources', function() {
                return dataSources;
            });
        
        })();
        
        //END: DATASOURCES
        
        //BEGIN: RENDERS
        holder['.renders'] = {
            "string": function(cell, value) {
                cell.className = 'DOM_HyperDataGrid_Cell string';
                cell.innerHTML = '';
                cell.appendChild(
                    $text(
                        value === null ? '[null]' : (
                            value == undefined ? '[undefined]' : 
                                value
                        )
                    )
                );
            },
            "int": function(cell, value) {
                cell.className = 'DOM_HyperDataGrid_Cell number';
                cell.innerHTML = '';
                cell.appendChild(
                    $text(
                        value === null ? '[null]' : (
                            value == undefined ? '[undefined]' :
                                (isNaN(value) ? '[NaN]' : Math.round(value))
                        )
                     )
                );
            },
            "float": function(cell, value, intPartLength, decimalsPartLength) {
                cell.className = 'DOM_HyperDataGrid_Cell number';
                cell.innerHTML = '';
                cell.appendChild(
                    $text(
                        value === null ? '[null]' : (
                            value == undefined ? '[undefined]' :
                                (isNaN(value) ? '[NaN]' : (function() {
                                    
                                    var parts = value.toString().split('.');
                                    
                                    if (intPartLength)
                                        parts[0] = parts[0].lPad(parseInt(intPartLength), '0');
                                    
                                    if (decimalsPartLength) {
                                        parts[1] = parts[1] || '0';
                                        parts[1] = parts[1].rPad(parseInt(decimalsPartLength || 0), '0').substr(0, parseInt(decimalsPartLength))
                                    }
                                    
                                    return decimalsPartLength ? [parts[0],parts[1]].join('.') : parts[0];
                                })())
                        )
                     )
                );
            },
            "boolean": function(cell, value) {
                cell.className = 'DOM_HyperDataGrid_Cell boolean';
                cell.innerHTML = '';
                
                switch (true) {
                    case value === null:
                        cell.innerHTML = '[null]';
                        removeStyle(cell, 'true');
                        break;
                    default:
                        !!value ? addStyle(cell, 'true') : removeStyle (cell, 'true');
                        break;
                }
            },
            "text": function(cell, value, maxRenderStringLength) {
                cell.className = 'DOM_HyperDataGrid_Cell text';
                cell.innerHTML = '';
                maxRenderStringLength = maxRenderStringLength || 50;
                cell.appendChild($text(value === null ? '[null]' : value.toString().substr(0, maxRenderStringLength) .concat(value.toString().length > maxRenderStringLength ? '...' : '')));
                cell.appendChild($('b', 'text'));
            },
            "multiple": function(cell, value, dataSourceName) {
                cell.className = 'DOM_HyperDataGrid_Cell multiple';
                cell.innerHTML = '';
                
                if (value === null) {
                    cell.innerHTML = '[null]';
                    cell.appendChild($('b', 'warning'));
                    return;
                }
                
                if (!holder.dataSources[dataSourceName]) {
                    cell.appendChild($text(value));
                    cell.appendChild($('b', 'warning'));
                    return;
                }
                
                var dt = holder.dataSources[dataSourceName];
                
                cell.appendChild($text(
                    typeof dt[value.toString()] == 'undefined' ? 
                    '[not set]' : dt[value.toString()]
                ));
            },
            "date": function(cell, value, inputFormat, outputFormat) {
                cell.className = 'DOM_HyperDataGrid_Cell date';
                cell.innerHTML = '';
                if (value === null) {
                    cell.innerHTML = '[null]';
                    cell.appendChild($('b', 'warning'));
                    return;
                } else {
                    try {
                        cell.appendChild($text(
                            (new Date()).fromString(value, inputFormat || '%Y-%m-%d')
                            .toString(outputFormat || '%Y-%m-%d') 
                        ));
                        
                    } catch(ex) {
                        cell.appendChild($text('[date error]'));
                        console.error(ex);
                    }
                }
            }
        };
        
        
        holder.__defineGetter__('renders', function() {
            return holder['.renders'];
        });
        
        //END: RENDERS
        
        //BEGIN: EDITORS
        var dummy;
        
        holder['.editors'] = {
            
            /** STRING CELL EDITOR **/
            'string': function(cellDiv, rowObject, validateFunction) {
                cellDiv.innerHTML = '';
                cellDiv.editor = cellDiv.appendChild(
                    (new TextBox('')).
                    setAttr('style', 'position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px; display: block; padding: 0px; margin: 0px; border: none; width: 100%; height: 100%')
                );
                cellDiv.editor.value = rowObject.$.cells.byName[cellDiv.name];
                cellDiv.editor.select();
                cellDiv.editor.focus();
                
                cellDiv.isEditing = true;
                
                cellDiv.doneEditing = function(newValue) {
                    if (!cellDiv.isEditing) return;
                    cellDiv.innerHTML = '';
                    rowObject.$.cells.byName[cellDiv.name] = newValue;
                    if (!holder.onCustomEvent('rowChange', rowObject)) {
                        cellDiv.cancelEditing();
                        return;
                    } else {
                        delete cellDiv.editor;
                        delete cellDiv.doneEditing;
                        delete cellDiv.cancelEditing;
                    }
                    cellDiv.isEditing = false;
                };
                
                cellDiv.cancelEditing = function() {
                    cellDiv.innerHTML = '';
                    cellDiv.revert();
                    delete cellDiv.editor;
                    delete cellDiv.cancelEditing;
                    delete cellDiv.doneEditing;
                }
                
                cellDiv.editor.addEventListener('blur', cellDiv.editor.done = function() {
                    if (!cellDiv.isEditing) return;
//                     console.warn('blur');
                    cellDiv.editor.value == rowObject.$.cells.byName[cellDiv.name] ? 
                        cellDiv.cancelEditing() : (
                            validateFunction(cellDiv.editor.value, rowObject) &&
                            holder.onCustomEvent('rowChange', rowObject) ? 
                                cellDiv.doneEditing(cellDiv.editor.value) :
                                cellDiv.cancelEditing()
                        );
                    cellDiv.isEditing = false;
                }, true);
                
                Keyboard.bindKeyboardHandler(cellDiv.editor, 'enter', function() {
                    cellDiv.editor.done();
                });
                Keyboard.bindKeyboardHandler(cellDiv.editor, 'esc',   cellDiv.cancelEditing);
            },
            
            /** TEXT CELL EDITOR **/
            'text': function(cellDiv, rowObject, validateFunction) {
                cellDiv.innerHTML = '';
                cellDiv.editor = cellDiv.appendChild(
                    (new TextArea('')).
                    setAttr('style', 'position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px; display: block; padding: 0px; margin: 0px; border: none; width: 100%; height: 100%')
                );
                cellDiv.editor.value = rowObject.$.cells.byName[cellDiv.name];
                cellDiv.editor.select();
                cellDiv.editor.focus();
                
                cellDiv.isEditing = true;
                
                cellDiv.doneEditing = function(newValue) {
                    if (!cellDiv.isEditing)
                        return;
                    cellDiv.innerHTML = '';
                    rowObject.$.cells.byName[cellDiv.name] = newValue;
                    if (!holder.onCustomEvent('rowChange', rowObject)) {
                        cellDiv.cancelEditing();
                        return;
                    }
                    else {
                        delete cellDiv.editor;
                        delete cellDiv.doneEditing;
                        delete cellDiv.cancelEditing;
                    }
                    cellDiv.isEditing = false;
                };
                
                cellDiv.cancelEditing = function() {
                    cellDiv.innerHTML = '';
                    cellDiv.revert();
                    delete cellDiv.editor;
                    delete cellDiv.cancelEditing;
                    delete cellDiv.doneEditing;
                }
                
                cellDiv.editor.addEventListener('blur', cellDiv.editor.done = function() {
                    if (!cellDiv.isEditing) return;
                    cellDiv.editor.value == rowObject.$.cells.byName[cellDiv.name] ? 
                        cellDiv.cancelEditing() : (
                            validateFunction(cellDiv.editor.value, rowObject) &&
                            holder.onCustomEvent('rowChange', rowObject) ? 
                                cellDiv.doneEditing(cellDiv.editor.value) :
                                cellDiv.cancelEditing()
                        );
                    cellDiv.isEditing = false;
                }, true);
                
                Keyboard.bindKeyboardHandler(cellDiv.editor, 'ctrl enter', function() {
                    cellDiv.editor.done();
                });
                Keyboard.bindKeyboardHandler(cellDiv.editor, 'esc',   cellDiv.cancelEditing);
            },
            
            
            /** INTEGER CELL EDITOR **/
            "int": dummy = function(cellDiv, rowObject, validateFunction) {
                cellDiv.innerHTML = '';
                cellDiv.editor = cellDiv.appendChild(
                    (new Spinner({
                        'value': rowObject.$.cells.byName[
                            cellDiv.name
                        ]
                    })).
                    setAttr('style', 'position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px; display: block; padding: 0px; margin: 0px; border: none; width: 100%; height: 100%')
                );
                cellDiv.editor.value = rowObject.$.cells.byName[cellDiv.name];
                cellDiv.editor.ctl.select();
                cellDiv.editor.ctl.focus();
                
                cellDiv.isEditing = true;
                
                cellDiv.doneEditing = function(newValue) {
                    if (!cellDiv.isEditing)
                        return;
                    cellDiv.innerHTML = '';
                    rowObject.$.cells.byName[cellDiv.name] = newValue;
                    if (!holder.onCustomEvent('rowChange', rowObject)) {
                        cellDiv.cancelEditing();
                        return;
                    } else {
                        cellDiv.isEditing = false;
                        delete cellDiv.editor;
                        delete cellDiv.doneEditing;
                        delete cellDiv.cancelEditing;
                    }
                };
                
                cellDiv.cancelEditing = function() {
                    cellDiv.innerHTML = '';
                    cellDiv.revert();
                    delete cellDiv.editor;
                    delete cellDiv.cancelEditing;
                    delete cellDiv.doneEditing;
                };
                
                cellDiv.editor.ctl.addEventListener('blur', cellDiv.editor.ctl.done = function() {
                    if (!cellDiv.isEditing) return;
                                                    
                    cellDiv.editor.value == rowObject.$.cells.byName[cellDiv.name] ? 
                        cellDiv.cancelEditing() : (
                            validateFunction(cellDiv.editor.value, rowObject) &&
                            holder.onCustomEvent('rowChange', rowObject) ? 
                                cellDiv.doneEditing(cellDiv.editor.value) :
                                cellDiv.cancelEditing()
                        );
                    cellDiv.isEditing = false;
                }, true);
                
                Keyboard.bindKeyboardHandler(cellDiv.editor.ctl, 'enter', cellDiv.editor.ctl.done);
                Keyboard.bindKeyboardHandler(cellDiv.editor.ctl, 'esc',   cellDiv.cancelEditing);
            },
            
            /* THE FLOAT CELL EDITOR IS THE SAME AS THE INT CELL EDITOR */
            "float": dummy,
            
            /* BOOLEANN CELL EDITOR */
            "boolean": function(cell, rowObject, validateFunction) {
                cell.innerHTML = '';
                removeStyle(cell,'true');
                cell.isEditing = true;
                cell.editor = cell.appendChild(
                    $('input').setAttr('type', 'checkbox')
                );
                cell.editor.checked = rowObject.$.cells.byName[cell.name];
                cell.editor.tabIndex = 0;
                cell.editor.focus();
                
                cell.cancelEditing = function() {
                    if (!cell.isEditing)
                        return;
                    cell.removeChild(cell.editor);
                    cell.revert();
                    delete cell.editor;
                    delete cell.cancelEditing;
                    delete cell.doneEditing;
                    delete cell.onEditReady;
                };
                
                cell.doneEditing = function(newValue) {
                    if (!cell.isEditing)
                        return;
                    
                    cell.removeChild(cell.editor);
                    rowObject.$.cells.byName[cell.name] = newValue;
                    if (!holder.onCustomEvent('rowChange', rowObject)) {
                        cell.cancelEditing();
                        return;
                    } else {
                        delete cell.editor;
                        delete cell.doneEditing;
                        delete cell.cancelEditing;
                        delete cell.onEditReady;
                        cell.isEditing = false;
                    }
                };
                
                cell.onEditReady = function(){
                    if (!cell.isEditing) return;
                    cell.editor.checked == rowObject.$.cells.byName[cell.name] ? 
                        cell.cancelEditing() : (
                            validateFunction(cell.editor.checked, rowObject) &&
                            holder.onCustomEvent('rowChange', rowObject) ? 
                                cell.doneEditing(cell.editor.checked) :
                                cell.cancelEditing()
                        );
                    cell.isEditing = false;
                };
                
                cell.editor.addEventListener('blur', cell.onEditReady, false);
                
                cell.editor.addEventListener('mousedown', function(e){
                    cancelEvent(e || window.event);
                }, true);
                
                Keyboard.bindKeyboardHandler(
                    cell.editor,
                    'enter',
                    cell.onEditReady
                );
                
            },
            
            "multiple": function(cell, rowObject, validateFunction) {
                var cellType = holder['.columnsByName'][cell.name].type.split('|')[1];
                if (typeof cellType == 'undefined')
                    throw "HyperDataGrid.editCell: No dataSource specified, please use type 'multiple:<data_source_name>', after you add the dataSource with this.dataSources.add() method";
                
                if (typeof holder.dataSources[cellType] == 'undefined')
                    throw "HyperDataGrid.editCell: dataSource '"+cellType+"' is not added (add it with this.dataSources.add() first)!";
                
                var source = holder.dataSources[cellType].toArray;
                
                source.splice(0, 0, {'id': '', 'name': '▾ UnSelected'});
                var cellValue = rowObject.$.cells.byName[cell.name];
                
                cell.innerHTML = '';
                
                cell.editor = cell.appendChild(
                    (new DropDown()).
                    setItems(source)
                );
                
                if (cellValue)
                    cell.editor.value = cellValue.toString();
                
                cell.cancelEditing = function() {
                    if (!cell.isEditing)
                        return;
                    cell.revert();
                    delete cell.editor;
                    delete cell.cancelEditing;
                    delete cell.doneEditing;
                    delete cell.onEditReady;
                };
                
                cell.doneEditing = function(newValue) {
                    if (!cell.isEditing)
                        return;
                    
                    cell.innerHTML = '';
                    
                    rowObject.$.cells.byName[cell.name] = newValue;
                    
                    if (!holder.onCustomEvent('rowChange', rowObject)) {
                        cell.cancelEditing();
                        return;
                    } else {
                        delete cell.editor;
                        delete cell.doneEditing;
                        delete cell.cancelEditing;
                        delete cell.onEditReady;
                        cell.isEditing = false;
                    }
                };
                
                cell.onEditReady = function(){
                    if (!cell.isEditing) return;
                                                
                    cell.editor.value == rowObject.$.cells.byName[cell.name] ? 
                        cell.cancelEditing() : (
                            validateFunction(cell.editor.value, rowObject) &&
                            holder.onCustomEvent('rowChange', rowObject) ? 
                                cell.doneEditing(cell.editor.value) :
                                cell.cancelEditing()
                        );

                    cell.isEditing = false;
                };
                
                cell.editor.addEventListener('change', cell.onEditReady, false);
                cell.editor.addEventListener('blur', cell.onEditReady, true);
                
                Keyboard.bindKeyboardHandler(cell.editor, 'enter', cell.onEditReady);
                
                cell.editor.focus();
               
                cell.isEditing = true;
            },
            "date": function(cell, rowObject, validateFunction) {
                var editorParams = holder['.columnsByName'][cell.name].type.split('|');
                var inputFormat  = editorParams[1] || '%Y-%m-%d';
                var outputFormat = editorParams[2] || '%Y-%m-%d';
                var cellValue    = rowObject.$.cells.byName[cell.name];
                cell.innerHTML   = '';
                
                cell.editor      = cell.appendChild(new TextBox((new Date).fromString(cellValue, inputFormat).toString(outputFormat)));
                cell.isEditing   = true;
                cell.editor.focus();
                cell.editor.noEnter = true;
                cell.editor.select();
                
                cell.editor.overlay = document.body.appendChild(
                    (new DatePicker(null, holder.inputFormat, cellValue))
                );
                
                cell.editor.pinner  = new Pinner(
                    cell.editor,
                    cell.editor.overlay,
                    'top'
                );
                
                if (cell.editor.overlay.offsetTop < 0)
                    cell.editor.pinner.setPinMode('bottom');
                
                cell.onBodyScrollFunc = function() {
                    try {
                        
                    if (cell.parentNode.offsetTop + cell.parentNode.offsetHeight < 0 ||
                        cell.parentNode.offsetTop > holder['.body'].offsetHeight) {
                        cell.editor.overlay.style.display = 'none';
                    } else {
                        cell.editor.overlay.style.display = 'block';
                        
                        cell.editor.pinner.setPinMode(
                            'top', true
                        );
                        if (cell.editor.overlay.offsetTop < 0)
                            cell.editor.pinner.setPinMode('bottom', true);
                    }
                    
                    } catch(ex) {
                    }
                };
                
                holder.addCustomEventListener('viewportChange', cell.onBodyScrollFunc);
                
                cell.editor.overlay.addCustomEventListener('change', function(dtPicker) {
                    cell.editor.value = dtPicker.DT.toString(outputFormat);
                    cell.editor.onCustomEvent('change');
                    cell.doneEditing();
                })
                
                cell.cancelEditing = function() {
                    if (!cell.isEditing) return;
                    
                    holder.removeCustomEventListener('viewportChange', cell.onBodyScrollFunc);

                    try {
                        cell.removeChild(cell.editor);
                        document.body.removeChild( cell.editor.overlay );
                    } catch(ex) {}

                    try { 
                        delete cell.editor;
                        delete cell.cancelEditing;
                        delete cell.doneEditing;
                    } catch(ex) {}
                        
                    cell.revert();
                };
                
                cell.doneEditing = function() {
                    if (!cell.isEditing || !cell.deFocuseable)
                        return false;
                    
                    try {
                        rowObject.$.cells.byName[cell.name] = (new Date()).fromString(cell.editor.value, outputFormat).toString(inputFormat);
                    } catch(ex) {
//                         console.log('could not defocus: '+ex);
                        return false;
                    }
                    
                    if (!holder.onCustomEvent('rowChange', rowObject)) {
                        cell.cancelEditing();
                        return false;
                    } else {
                        try {
                            document.body.removeChild(cell.editor.overlay);
                            cell.isEditing = false;
                        } catch(ex) {}
                        
                        try {
                            delete cell.editor;
                            delete cell.cancelEditing;
                            delete cell.doneEditing;
                        } catch(ex) {}
                    }
                    
                    return true;
                };
                
                
                (function() {
                    
                    var defocuseable = true;
                    
                    cell.editor.__defineGetter__('deFocuseable', function() {
                        return defocuseable;
                    });
                    
                    cell.editor.__defineSetter__('deFocuseable', function(boolVal) {
                        if (!!boolVal != defocuseable) {
                            defocuseable = !!boolVal;
                            
                            switch (defocuseable) {
                                case true:
                                    removeStyle(cell.editor, 'disable-focus');
                                    break;
                                case false:
                                    addStyle(cell.editor, 'disable-focus');
                                    break;
                            }
                        }
                    });
                    
                })();
                
                cell.editor.addCustomEventListener('change', function() {
                    try {
                        var dt = (new Date()).fromString(cell.editor.value, inputFormat);
                        cell.editor.deFocuseable = true;
                    } catch(ex) {
                        cell.editor.deFocuseable = false;
                    }
                });
                
                cell.editor.addEventListener('blur', function() {
                    if (cell.isEditing)
                        cell.cancelEditing();
                }, true);
                
                Keyboard.bindKeyboardHandler(
                    cell.editor,
                    'esc',
                    cell.cancelEditing
                );
                
                var t;
                
                Keyboard.bindKeyboardHandler(
                    cell.editor,
                    'enter',
                    t = function() {
                        try {
                            if (!cell.doneEditing())
                                cancelEvent(e);
                            holder.focusedRowIndex++;
                        } catch(ex) {
                        }
                    }
                );
                
                Keyboard.bindKeyboardHandler(
                    cell.editor,
                    'f4',
                    t
                );

            }
        };
        
        holder.__defineGetter__('editors', function() {
            return holder['.editors'];
        });

        //END: EDITORS
        
        //BEGIN: CELLPARSERS
        (function() {
            var cellParsers = {};
            
            holder.__defineGetter__('cellParsers', function() {
                return cellParsers;
            })
            
            cellParsers.addCellParser = function(dataType, func) {
                if (typeof func != 'function')
                    throw "HyperDataGrid: Could not add cellParser '"+dataType+"': Provided parameter is not a function!";
                cellParsers[dataType] = func;
            };
        })();
        
        holder.cellParsers.addCellParser("int", function(intVal) {
            return isNaN(intVal) || !intVal ? 0 : intVal;
        });
        
        holder.cellParsers.addCellParser("float", function(floatVal) {
            return isNaN(floatVal) || !floatVal ? 0 : floatVal;
        });
        
        holder.cellParsers.addCellParser("boolean", function(boolVal) {
            return !!boolVal ? 0 : 1;
        });
        
        holder.cellParsers.addCellParser("string", function(strVal) {
            return !strVal ? '' : strVal.toString().toLowerCase();
        });
        
        holder.cellParsers.addCellParser("text", function(strVal) {
            return !strVal ? '' : strVal.toString().toLowerCase();
        });
        
        holder.cellParsers.addCellParser("date", function(dateStrVal, inputFormat) {
            try {
                return (new Date()).fromString(dateStrVal, inputFormat).getTime();
            } catch(ex) {
                return 0;
            }
        });
        
        holder.cellParsers.addCellParser("multiple", function(mulVal, dataSourceName) {
            try {
                return !holder.dataSources[dataSourceName][mulVal] ? '' : holder.dataSources[dataSourceName][mulVal].toString().toLowerCase();
            } catch(ex) {
                return '';
            }
        });
        
        //END: CELLPARSERS
        
        //BEGIN: PRIMARY KEY
        
        (function() {
            holder['.primaryKey'] = null;
            
            holder.__defineGetter__('primaryKey', function() {
                return holder['.primaryKey'];
            });
            
            holder.__defineSetter__('primaryKey', function(str) {
                holder['.primaryKey'] = str;
                for (var i=0, len = holder['.bindings'].length; i<len; i++)
                    holder['.bindings'][i].primaryKey = str;
            });
        })();
        
        //END: PRIMARY KEY
        
        holder['.columns'      ] = [];
        holder.__defineGetter__('columns', function() {
            return holder['.columns'];
        });

        (function() {
            
            var dragable = false;
            
            holder['.columns'].__defineGetter__('dragable', function() {
                return dragable;
            });
            
            holder['.columns'].__defineSetter__('dragable', function(bool) {
                bool = !!bool;
                if (bool == dragable)
                    return;
                for (var i=0, len = holder['.columns'].length; i<len; i++) {
                    holder['.columns'][i].dragable = bool;
                }
                dragable = bool;
            });
        })();
        
        holder['.columnsByName'] = {};
        holder.__defineGetter__('columnsByName', function() {
            return holder['.columnsByName'];
        });

        holder['.rows'] = [];
        holder.__defineGetter__('rows', function() {
            return holder['.rows'];
        });

        holder['.bindings'     ] = [];
        holder.__defineGetter__('bindings', function() {
            return holder['.bindings'];
        });

        
        holder.__defineGetter__('scrollbars', function() {
            return holder['.scrollbars'];
        });

        holder.__defineGetter__('viewport', function() {
            return holder['.viewport'];
        });

        
        holder['.edges'].__defineGetter__('top', function() {
            return holder['.edges']['.top'];
        });
        
        holder['.edges'].__defineGetter__('left', function() {
            return holder['.edges']['.left'];
        });
        
        holder.__defineGetter__('topLeftCorner', function() {
            return holder['.topLeftCorner'];
        });
    
        holder['.topLeftCorner'].appendChild(
            holder['.topLeftCorner'].rowsSelector = $('div')
        ).appendChild(
            $text('▾')
        );
        
        setupTooltip( holder['.topLeftCorner'].rowsSelector,
            '<b style="color: orange">Select or Invert all Rows</b><br />'+
            'To Invert Selection, hold down<br />'+
            'the Ctrl key while clicking'
        );
        
        holder['.topLeftCorner'].appendChild(
            holder['.topLeftCorner'].colsSelector = $('div')
        ).appendChild(
            $text('▸')
        );
        
        setupTooltip( holder['.topLeftCorner'].colsSelector, 
            '<b style="color: orange">Select / Invert all selectable Columns</b><br />'+
            'To Invert Selection, hold down<br />'+
            'the Ctrl key while clicking'
        );
        
        holder['.topLeftCorner'].appendChild(
            holder['.topLeftCorner'].nullSelector = $('div')
        ).appendChild(
            $text('☒')
        );
        
        setupTooltip( holder['.topLeftCorner'].nullSelector,
            '<b style="color: orange">Deleselect All</b><br />Rows and Columns'
        );
        
        holder['.topLeftCorner'].rowsSelector.addEventListener('click', function(e) {
            e = e || window.event;
            
            if (holder.selectable) {
                for (var i = 0, len = holder['.rows'].length; i<len; i++) {
                    holder['.rows'][i].$.row.selected = !e.ctrlKey ? true : !holder['.rows'][i].$.row.selected;
                }
            }
        }, false);
        
        holder['.topLeftCorner'].colsSelector.addEventListener('click', function(e) {
            e = e || window.event;
            
            if (holder.selectable) {
                for (var i=0, len=holder['.columns'].length; i<len; i++) {
                    if (holder['.columns'][i].selectable)
                        holder['.columns'][i].selected = !e.ctrlKey ? true : !holder['.columns'][i].selected;
                }
            }
        }, false);
        
        holder['.topLeftCorner'].nullSelector.addEventListener('click', function() {
            for (var i=0, len = holder['.columns'].length; i<len; i++)
                if (holder['.columns'][i].selectable)
                    holder['.columns'][i].selected = false;
                
            for (var i=0, len = holder['.rows'].length; i<len; i++)
                holder['.rows'][i].$.row.selected = false;
            
        }, false);
        
        holder['.scrollbars'].__defineGetter__('horizontal', function() {
            return holder['.scrollbars']['.horizontal'];
        });
        
        holder['.scrollbars'].__defineGetter__('vertical', function() {
            return holder['.scrollbars']['.vertical'];
        });
        
        /* TOP EDGE PROPERTIES */
        holder['.edges']['.top']['.height'] = 20;
        
        holder['.edges']['.top'].__defineGetter__('height', function() {
            return holder['.edges']['.top']['.height'];
        });
        
        holder['.edges']['.top'].__defineSetter__('height', function(intVal) {
            intVal = intVal || 0;
            intVal = intVal >= 0 ? intVal : 0;
            
            holder['.edges']['.top']['.height'] = intVal;
            
            holder['.edges']['.top'].style.height = intVal + 'px'; //1px is the border itself
            holder['.edges']['.left'].style.top   = intVal  + 'px';
            holder['.topLeftCorner'].style.height = intVal + 'px'; //alter the top left-s corner height
            
            holder['.menuHolder'].style.height = intVal + 3 + 'px';
            
            holder.body.style.top = intVal + 1 + 'px';
            
            holder['.edges']['.top'].onDOMresize(0, 0);
            
            for (var i=0; i<holder['.columns'].length; i++) {
                if (typeof holder['.columns'][i]._resizeHandle != 'undefined') {
                    holder['.columns'][i]._resizeHandle.style.height = intVal + 'px';
                }
            }
            
            holder['.scrollbars']['.vertical'].style.top = intVal + 1 + 'px';
            holder['.body'].onDOMresize(holder.offsetWidth, holder.offsetHeight);
        });

        /* LEFT EDGE PROPERTIES */
        holder['.edges']['.left']['.width'] = 50;
        holder['.edges']['.left'].__defineGetter__('width', function() {
            return holder['.edges']['.left']['.width'];
        })
        holder['.edges']['.left'].__defineSetter__('width', function(intVal) {
            intVal = intVal || 0;
            intVal = intVal >= 0 ? intVal : 0;
            holder['.edges']['.left']['.width'] = intVal;
            holder['.edges']['.left'].style.width = intVal + 'px';
            holder['.edges']['.top'].style.left = intVal + 1 + 'px'; //1px is for the border itself
            holder['.topLeftCorner'].style.width = intVal + 'px'; //alter the top left's corner width
            holder['.scrollbars']['.horizontal'].style.left = intVal + 1 + 'px'; //alter the left coor for the horizontal scrollbar
            holder.body.style.left = intVal + 2 + 'px';
            if (holder['.lazyInsert'].progress)
                holder['.lazyInsert'].progress.style.width = intVal - 6 + 'px';
        });
        
        holder['.edges']['.top']['.columnShift'] = 0;
        
        holder['.edges']['.top'].__defineGetter__('columnShift', function() {
            return holder['.edges']['.top']['.columnShift'];
        });
        
        holder['.edges']['.top'].__defineSetter__('columnShift', function(intVal) {
            intVal = intVal || 0;
            if (intVal == holder['.edges']['.top']['.columnShift']) return;
            holder['.edges']['.top']['.columnShift'] = intVal;
            for (var i=0; i<holder['.columns'].length; i++) {
                holder['.columns'][i].columnShift = intVal;
            }
        });
        
        /* TOP LEFT CORNER Properties */
        holder['.topLeftCorner'].__defineGetter__('width', function() {
            return holder['.edges']['.left']['.width'];
        });
        
        holder['.topLeftCorner'].__defineSetter__('width', function(intVal) {
            holder['.edges']['.left'].width = intVal;
        });
        
        holder['.topLeftCorner'].__defineGetter__('height', function() {
            return holder['.edges']['.top']['.height'];
        });
        
        holder['.topLeftCorner'].__defineSetter__('height', function(intVal) {
            holder['.edges']['.top'].height = intVal;
        });
        
        /* SCROLLBARS */
        holder['.scrollbars']['.vertical']['.height'].scSize = 0;
        
        holder['.scrollbars']['.horizontal']['.width'].scSize = 0;
        
        holder['.scrollbars']['.vertical'].__defineGetter__('much', function() {
            return holder['.scrollbars']['.vertical']['.height'].scSize;
        });
        
        holder['.scrollbars']['.vertical'].__defineSetter__('much', function(intVal) {
            intVal = intVal || 0;
            intVal = intVal >= 0 ? intVal : 0;
            
            holder['.scrollbars']['.vertical']['.height'].scSize = intVal;
            holder['.scrollbars']['.vertical']['.height'].style.height = intVal + 'px';
            
        });
        
        holder['.scrollbars']['.vertical'].__defineGetter__('pos', function() {
            return holder['.scrollbars']['.vertical'].scrollTop;
        });
        
        holder['.scrollbars']['.vertical'].__defineSetter__('pos', function(intVal) {
            holder['.scrollbars']['.vertical'].scrollTop = (intVal || 0);
            holder.viewport.top = holder['.scrollbars']['.vertical'].scrollTop;
        });
        
        holder['.scrollbars']['.horizontal'].__defineGetter__('much', function() {
            return holder['.scrollbars']['.horizontal']['.width'].scSize;
        });
        
        holder['.scrollbars']['.horizontal'].__defineSetter__('much', function(intVal) {
            intVal = intVal || 0;
            intVal = intVal >= 0 ? intVal : 0;
            
            holder['.scrollbars']['.horizontal']['.width'].scSize = intVal;
            holder['.scrollbars']['.horizontal']['.width'].style.width = intVal + 'px';
            
            //Update visible rows width
            for (var i=0; i<holder['.bindings'].length; i++) {
                holder['.bindings'][i].width = intVal;
            }
        });
        
        holder['.scrollbars']['.horizontal'].__defineGetter__('pos', function() {
            return holder['.scrollbars']['.horizontal'].scrollLeft;
        });
        
        holder['.scrollbars']['.horizontal'].__defineSetter__('pos', function(intVal) {
            holder['.scrollbars']['.horizontal'].scrollLeft = (intVal || 0);
            holder.viewport.left = holder['.scrollbars']['.horizontal'].scrollLeft;
        });
        
        holder['.scrollbars']['.horizontal'].addEventListener('scroll', function() {
            holder.viewport.left = holder['.scrollbars']['.horizontal'].scrollLeft;
        }, false);
        holder['.scrollbars']['.vertical'].addEventListener('scroll', function() {
            holder.viewport.top  = holder['.scrollbars']['.vertical'].scrollTop;
        }, false);
        
        holder.body.scrollFunction = function(e) {
            
            e = e || window.event;
            
            switch (true) {
                case typeof window.opera != 'undefined': //Presto
                    var lines = e.wheelDelta / 40; //Opera has 2 lines / scroll
                    break;
                case typeof e.wheelDelta != 'undefined': //Webkit
                    var lines = e.wheelDelta / 40; //Chrome has 3 lines / scroll
                    break;
                case typeof e.detail != 'undefined': //Gecko
                    var lines = - e.detail / 3;
                    break;
                default: 
                    var lines = 0;
                    break;
            }
            lines *= 5;
            
            if (e.shiftKey)
                holder.scrollbars.horizontal.pos -= lines;
            else
                holder.scrollbars.vertical.pos -= lines;

//             cancelEvent(e);

        };

        try {
            holder.body.addEventListener('mousewheel', holder.body.scrollFunction, false);
            holder.body.addEventListener('DOMMouseScroll', holder.body.scrollFunction, false);
            holder['.edges'].left.addEventListener('mousewheel', holder.body.scrollFunction, false);
            holder['.edges'].left.addEventListener('DOMMouseScroll', holder.body.scrollFunction, false);
        } catch(ex) {
            holder.body.attachEvent('onmousewheel', holder.body.scrollFunction);
            holder['.edges'].left.attachEvent('onmousewheel', holder.body.scrollFunction);
        }
        
        /* VIEWPORT */
        
        holder.onViewportChange = function() {
            holder.onCustomEvent('viewportChange', {
                'top': holder['.viewport']['.top'],
                'left':holder['.viewport']['.left'],
                'width': holder['.viewport']['.width'],
                'height': holder['.viewport']['.height']
            });
        };
        
        holder['.viewport'].contains = function(DataObject) {
            return DataObject.$.row['.top'] + DataObject.$.row['.height'] >= holder['.viewport']['.top']
                  && DataObject.$.row['.top'] <= ( holder['.viewport']['.top'] + holder['.viewport']['.height'] );
        }
        
        holder['.viewport'].__defineGetter__('top', function(intVal) {
            return holder['.viewport']['.top'];
        });
        
        holder['.viewport'].__defineSetter__('top', function(intVal) {
            intVal = intVal || 0;
            intVal = intVal >= 0 ? intVal : 0;
            
            if (intVal != holder['.viewport']['.top']) {
                //Fire viewport change ...
                holder['.viewport']['.top'] = intVal;
                holder['.viewport']['.bottom'] = holder['.viewport']['.top'] + holder['.viewport']['.height'];
                
                //Shift bindings ...
                for (var i=0; i<holder['.bindings'].length; i++) {
                    holder['.bindings'][i].top = holder['.bindings'][i].display.top;
                }
                
                holder.onViewportChange();
            }
        });
        
        holder['.viewport'].__defineGetter__('left', function() {
            return holder['.viewport']['.left'];
        });
        
        holder['.viewport'].__defineSetter__('left', function(intVal) {
            intVal = intVal || 0;
            intVal = intVal >= 0 ? intVal : 0;
            
            if (intVal != holder['.viewport']['.left']) {
                holder['.viewport']['.left'] = intVal;
                
                /* Propagate change to visible rows */
                for (var i=0; i<holder['.bindings'].length; i++) {
                    holder['.bindings'][i].left = intVal;
                }
                
                holder.onViewportChange();
            }
        });
        
        holder['.viewport'].__defineGetter__('width', function() {
            return holder['.viewport']['.width'];
        });
        
        holder['.viewport'].__defineSetter__('width', function(intVal) {
            intVal = intVal || 0;
            intVal = intVal >= 0 ? intVal : 0;
            
            if (intVal != holder['.viewport']['.width']) {
                holder['.viewport']['.width'] = intVal;
                holder.onViewportChange();
            }
        });
        
        holder['.viewport'].__defineGetter__('height', function() {
            return holder['.viewport']['.height'];
        });
        
        holder['.viewport'].__defineSetter__('height', function(intVal) {
            intVal = intVal || 0;
            intVal = intVal >= 0 ? intVal : 0;
            
            if (intVal != holder['.viewport']['.height']) {
                holder['.viewport']['.height'] = intVal;
                holder['.viewport']['.bottom'] = holder['.viewport']['.top'] + holder['.viewport']['.height'];
                holder.onViewportChange();
            }
        });
        
        /* CUSTOM EVENT LISTENERS ... */
        
        EnableCustomEventListeners(holder);
        
        holder['.isRendering'] = false;
        
        (function() {
            
            holder.addCustomEventListener(
                'viewportChange',
                function(viewportSize) {
                    
                    holder['.isRendering'] = true;
                    
                    holder['.edges']['.top'].columnShift = viewportSize.left;
                    
                    var firstIndex  = 0;
                    var lastIndex = holder['.rows'].length - 1;
                    
                    //determine how to scan, up or down
                    if (holder['.bindings'].length) {
                        firstIndex = holder['.bindings'][0].row.$.row['.index'];
                        lastIndex = holder['.bindings'][0].row.$.row['.top'] >= holder['.scrollbars']['.vertical'].pos ? 0 : holder['.rows'].length - 1;
                    }
                    
                    //Remove rows no needed in viewport ...
                    for (var i=holder['.bindings'].length - 1; i >= 0; i--) {
                        if (!holder['.viewport'].contains(
                            holder['.bindings'][i].row
                        )) holder.unbindRow(i);
                    }
                    
                    var indexes = holder.findViewportDisplayIndexes(firstIndex, lastIndex);
                    
                    //console.log(indexes);
                    
                    if (indexes != null)
                    
                    for (var i=indexes.start; i<=indexes.stop; i++) {
                        try {
                            holder.bindRow(holder['.rows'][i]);
                        } catch (e) {}
                    }
                        
    //                 console.warn('HyperDataGrid: Debug: viewport-change to: '+
    //                     'TOP: '+viewportSize.top +', LEFT: '+ viewportSize.left +
    //                     ', WIDTH: '+viewportSize.width + ', HEIGHT: '+ viewportSize.height
    //                 );
                        
                    holder['.isRendering'] = false;
                    
                    return true;
                    
                }
            );
        
        })();
        
        holder.body.__defineGetter__('width', function() {
            return holder.scrollbars.horizontal.much;
        });
        
        holder.body.__defineGetter__('height', function() {
            return holder.scrollbars.vertical.much;
        });
        
        holder.body.__defineSetter__('width', function(intVal) {
            holder.scrollbars.horizontal.much = intVal;
        });
        
        holder.body.__defineSetter__('height', function(intVal) {
            holder.scrollbars.vertical.much = intVal;
        });
        
        holder.body.__defineGetter__('top', function() {
            return holder.scrollbars.vertical.pos;
        });
        
        holder.body.__defineGetter__('left', function(){
            return holder.scrollbars.horizontal.pos;
        });
        
        holder.body.__defineSetter__('top', function(intVal){
            holder.scrollbars.vertical.pos = intVal;
        });
        
        holder.body.__defineSetter__('left', function(intVal) {
            holder.scrollbars.horizontal.pos = intVal;
        });
        
        holder.body.DOManchors = {
            'height': function(w,h) {
                return h - holder.edges.top.height - Math.max(scrollbarWidth, 20) - 3 + 'px';
            },
            '_dummy': function(w,h) {
                if (holder.viewport.width != holder.body.offsetWidth ||
                    holder.viewport.height!= holder.body.offsetHeight
                ) {
                    holder.viewport.height = holder.body.offsetHeight; //In order to force a viewport-change
                    holder.viewport.width = holder.body.offsetWidth;
                }
            }
        };
        
        
        holder['.columns'].paint = function(startByIndex) {
            XStart = 0;
            
            for (var i=0; i<holder['.columns'].length; i++) {
                holder['.columns'][i].left = XStart;
                XStart += holder['.columns'][i].visible ? (holder['.columns'][i]._config.width + 2) : 0;
            }
            
            return XStart;
        };

        
        holder.createColumn = function(columnConfig, columnIndex) {
            
            columnIndex = typeof columnIndex != 'undefined' ? parseInt(columnIndex) : holder['.columns'].length;
            
            if (isNaN(columnIndex)) 
                throw "HyperDataGrid.createColumn: columnIndex is NaN!";
            
            if (columnIndex < 0 || columnIndex > holder['.columns'].length)
                throw "HyperDataGrid.createColumn: columnIndex outside of bounds!";
            
            var columnObject = holder['.edges']['.top']['_inner'].appendChild(
                $('div', 'HyperDataGrid_Column')
            );
            
            columnObject._inner = columnObject.appendChild(
                $('div')
            );
            
            columnObject._config = {
                "name"       : null,
                "caption"    : null,
                "width"      : holder['.settings']['.defaultColumnWidth'],
                "align"      : 'left',
                "sortable"   : false,
                    //"sortFunc"   : null,  // -> these two properties depends if sortable is true or false
                    //"sortOrder"  : 0,     // -> 0 -> unsorted, -1 -> sorted Descending, 1 -> sorted Ascending
                "selectable" : false,
                    //"selected"   : false  // -> this property depends if selectable is true or false
                "visible"    : true,
                "type"       : "string",
                "resizeable" : false,
                "left"       : 0,
                "editable"   : false
                   //"validator"  : false  // -> this property depends if editable is true
            };
            
            columnObject['.columnShift'] = holder['.edges']['.top']['.columnShift'];
            
            columnObject.__defineGetter__('columnShift', function() {
                return columnObject['.columnShift'];
            });
            
            columnObject.__defineSetter__('columnShift', function(intVal) {
                intVal = intVal || 0;
                if (intVal != columnObject['.columnShift']) {
                    columnObject['.columnShift'] = intVal;
                    columnObject.style.left = columnObject._config.left - intVal + 'px';
                    if (typeof columnObject._selectOverlay != 'undefined')
                        columnObject._selectOverlay.style.left = columnObject.style.left;
                    if (typeof columnObject._resizeHandle != 'undefined')
                        columnObject._resizeHandle.style.left =
                            columnObject._config.left +
                            columnObject._config.width -
                            columnObject['.columnShift'] + 1 + 'px';
                }
            });
            
            columnObject.__defineGetter__('editable', function() {
                return columnObject._config.editable;
            });
            
            columnObject.__defineSetter__('editable', function(bool) {
                bool = !!bool;
                if (bool != columnObject._config.editable) {
                    columnObject._config.editable = bool;
                    
                    switch (bool) {
                        case true:
                            columnObject._config.validator = (columnObject._config.validator || columnConfig.validator || function(newValue) {
                                console.info('HyperDataGrid.columns['+columnObject.columnIndex+'].validator: Returning TRUE');
                                return true;
                            });
                            
                            columnObject.__defineGetter__('validator', function() {
                                return columnObject._config.validator;
                            });
                            
                            columnObject.__defineSetter__('validator', function(func) {
                                columnObject._config.validator = func;
                            });
                            
                            break;
                        case false:
                            delete columnObject.validator;
                            break;
                    }
                }
            });
            
            holder['.columns'].splice(columnIndex, 0, columnObject);
            
            if (columnObject._config.visible)
                holder.body.width += (columnObject._config.width + 2);
            
            columnObject['.columnIndex'] = columnIndex;
            
            for (var i= columnIndex; i < holder['.columns'].length; i++) {
                holder['.columns'][i]['.columnIndex'] = i;
            }
            
            columnObject.__defineGetter__('columnIndex', function() {
                return columnObject['.columnIndex'];
            });
            
            columnObject.__defineSetter__('columnIndex', function(intVal) {
                intVal = intVal || 0;
                if (intVal < 0 || intVal > holder['.columns'].length - 1)
                    throw "HyperDataGrid.column.columnIndex: Index outside bounds!";
                
                if (intVal == columnObject['.columnIndex'])
                    return;

                var index1 = columnObject['.columnIndex'];
                var index2 = intVal;
                
                //Swap columns ...
                holder['.columns'].swap(
                    index1,
                    index2
                );
                
                holder['.columns'][index1]['.columnIndex'] = index1;
                holder['.columns'][index2]['.columnIndex'] = index2;
                
                holder['.columns'].paint();
                
                try {
                    //Unbind all rows ...
                    for (var i = holder['.bindings'].length-1; i>=0; i--) {
                        try {
                            holder['.bindings'][i].cells[
                                holder.focusedColumnIndex
                            ].cancelEditing();
                        } catch(ex2) {
                            
                        }
                        holder.unbindRow(i, true);
                    }
                    
                    holder.onCustomEvent('viewportChange', holder.viewport);
                } catch(ex) {
                }
                
                holder['.updateMenu']();
            });

            columnObject._caption = columnObject._inner.appendChild(
                $('div', 'HyperDataGrid_ColumnCaption')
            );
            
            columnObject.__defineGetter__('name', function() {
                return columnObject._config.name;
            });
            
            columnObject.__defineSetter__('name', function(str) {
                if (typeof str != 'string')
                    throw "HyperDataGrid.column.name[setter]: expected string but provided "+(typeof str);
                if (!str.length)
                    throw "HyperDataGrid.column.name[setter]: cannot set an empty name!";
                
                if (!/^[a-z0-9_\.]+$/i.test(str))
                    throw "HyperDataGrid.column.name[setter]: property \"name\" should express a standard programming variable name";
                
                //If getter was allready defined in holder.columnsByName, then delete old name
                
                if (columnObject._config.name !== null) {
                    delete holder['.columnsByName'][
                        columnObject._config.name
                    ];
                    
                    //Rename the DataObject binding property name ;)
                    for (var i = 0; i<holder['.rows'].length; i++) {
                        holder.renameDataBindingProperty(
                            holder['.rows'][i],
                            columnObject._config.name,
                            str
                        );
                    }
                }
                    
                columnObject._config.name = str;
                
                holder['.columnsByName'].__defineGetter__(
                    str, function() {
                        return columnObject;
                    }
                );
                
            });
            
            columnObject.__defineGetter__('align', function() {
                return columnObject._config.align;
            });
            
            columnObject.__defineSetter__('align', function(str) {
                if (['', 'left', 'center', 'right'].indexOf(str) == -1)
                    throw "HyperDataGrid.column.align[setter]: invalid alignment value!";
                columnObject._config.align = str;
                
                columnObject._caption.style.textAlign = str;
                
                //update text alignment to visible grid rows
                for (var i=0; i<holder['.bindings'].length; i++) {
                    holder['.bindings'][i].cells[
                        columnObject['.columnIndex']
                    ].align = str;
                }
            });
            
            columnObject.__defineGetter__('caption', function() {
                return columnObject._config.caption;
            });
            
            columnObject.__defineSetter__('caption', function(str) {
                if (typeof str != 'string')
                    throw "HyperDataGrid.column.caption[setter]: expected string bud provided "+(typeof str);
                columnObject._caption.innerHTML = '';
                columnObject._caption.appendChild(
                    $text(str)
                );
                columnObject._config.caption = str;
            });
            
            columnObject.__defineGetter__('width', function() {
                return columnObject._config.width;
            });
            
            columnObject.__defineSetter__('width', function(intVal) {
                intVal = intVal || 0;
                intVal = intVal >= 0 ? intVal : 0;
                
                columnObject.style.width = intVal + 'px';
                columnObject._config.width = intVal;
                
                if (typeof columnObject._selectOverlay != 'undefined')
                    columnObject._selectOverlay.style.width = intVal + 2 + 'px';
                
                if (typeof columnObject._resizeHandle != 'undefined')
                    columnObject._resizeHandle.style.left =
                        columnObject._config.left +
                        columnObject._config.width -
                        columnObject['.columnShift'] + 1 + 'px';

                var width =
                    holder['.columns'].paint(
                        columnObject['.columnIndex']
                    );
                
                holder['.body'].width = width;
                
                //propagate width to grid rows
                for (var i=0; i<holder['.bindings'].length; i++) {
                    holder['.bindings'][i].width = holder.body.width;
                    holder['.bindings'][i].cells[ columnObject['.columnIndex'] ].width = intVal;
                }
                
            });
            
            columnObject.__defineGetter__('sortable', function(bool) {
                return columnObject._config.sortable;
            });
            
            columnObject.__defineSetter__('sortable', function(bool) {
                bool = !!bool;
                
                if (bool == columnObject._config.sortable) return;
                    
                columnObject._config.sortable = bool;
                
                switch (bool) {
                    case true:
                        columnObject._caption.style.right = '16px';
                        columnObject._sortSign = columnObject._inner.appendChild(
                            $('div', 'HyperDataGrid_SortSign')
                        );
                        
                        columnObject._config.sortFunc = null;
                        columnObject._config.sortOrder= 0; //unsorted
                        
                        columnObject.__defineGetter__('sortFunc', function() {
                            return columnObject._config.sortFunc;
                        });
                        
                        columnObject.__defineSetter__('sortFunc', function(sorterFunction) {
                            columnObject._config.sortFunc = sorterFunction;
                        });
                        
                        columnObject.__defineGetter__('sortOrder', function() {
                            return columnObject._config.sortOrder;
                        });
                        
                        
                        columnObject.__defineSetter__('sortOrder', function(sortOrderValue) {
                            if ([-1, 0, 1].indexOf(sortOrderValue) == -1) 
                                throw "HyperGrid.column.sortOrder[setter]: invalid sortOrderValue: expected -1, 0 or 1";

                            columnObject._config.sortOrder = sortOrderValue;
                            
                            holder.sortColumnByName(
                                columnObject._config.name,
                                sortOrderValue
                            );
                        });
                        
                        columnObject.clickFunction = function(e) {
                            e = e || window.event;
                            if (e.ctrlKey) return;
                            switch (columnObject.sortOrder) {
                                case 0:
                                case -1:
                                    columnObject.sortOrder = 1;
                                    break;
                                case 1:
                                    columnObject.sortOrder = -1;
                                    break;
                            }
                            cancelEvent(e);
                        };
                        
                        columnObject.addEventListener('click', columnObject.clickFunction, false);
                        
                        break;
                        
                    case false:
                        columnObject._caption.style.right = '0px';
                        
                        columnObject._inner.removeChild(
                            columnObject._sortSign
                        );
                        
                        delete columnObject._sortSign;
                        
                        delete columnObject._config.sortOrder;
                        delete columnObject.sortOrder;
                        
                        delete columnObject._config.sortFunc;
                        delete columnObject.sortFunc;
                        
                        columnObject.removeEventListener('click', columnObject.clickFunction, false);
                        delete columnObject.clickFunction;
                        
                        break;
                }
            });
            
            columnObject.__defineGetter__('selectable', function() {
                return columnObject._config.selectable;
            });
            
            columnObject.__defineSetter__('selectable', function(bool) {
                bool = !!bool;
                if (bool == columnObject._config.selectable)
                    return;
                
                columnObject._config.selectable = bool;
                
                switch (bool) {
                    case true:
                        columnObject._config.selected = false;
                        
                        columnObject.__defineGetter__('selected', function() {
                            return columnObject._config.selected;
                        });
                        
                        columnObject.__defineSetter__('selected', function(bool) {
                            bool = !!bool;
                            if (bool == columnObject._config.selected)
                                return;
                            //console.warn('NOT_IMPLEMENTED: columnObject.selected[setter]: NOT_IMPLEMENTED_VISUALLY');
                            
                            switch (bool) {
                                case true:
                                    columnObject._selectOverlay =
                                        holder['.edges']['.top']._inner.appendChild(
                                            $('div', 'HyperDataGrid_ColumnSelector').
                                            setAnchors({
                                                'left': function(w,h) {
                                                    return columnObject.left - columnObject['.columnShift'] + 'px';
                                                },
                                                'height': function(w,h) {
                                                    return holder.body.offsetHeight +'px';
                                                },
                                                'top': function(w,h) {
                                                    return holder['.edges']['.top'].height + 1 + 'px';
                                                }
                                            })
                                        );
                                        
                                        columnObject._selectOverlay.style.height = holder.body.offsetHeight + 'px';
                                        columnObject._selectOverlay.style.width  = columnObject.width + 2 + 'px';
                                        columnObject._selectOverlay.style.left   = columnObject.left - columnObject['.columnShift'] + 'px';
                                        columnObject._selectOverlay.style.top    = holder['.edges']['.top'].height + 1 + 'px';
                                        
                                        columnObject._selectOverlay.style.zIndex = 0;
                                        
                                        try {
                                            columnObject._selectOverlay.addEventListener('mousewheel', holder.body.scrollFunction, false);
                                            columnObject._selectOverlay.addEventListener('DOMMouseScroll', holder.body.scrollFunction, false);
                                        } catch(ex) {
                                            columnObject._selectOverlay.attachEvent('onmousewheel', holder.body.scrollFunction);
                                        }

                                        
                                     break;
                                case false:
                                    holder['.edges']['.top']._inner.removeChild(
                                        columnObject._selectOverlay
                                    );
                                    delete columnObject._selectOverlay;
                                    break;
                            };
                                    
                            columnObject._config.selected = bool;
                            
                            holder.onCustomEvent('columnsSelectionChanged', columnObject);
                        });
                        
                        columnObject.toggleSelectClickFunction = function(e) {
                            e = e || window.event;
                            if (e.ctrlKey) {
                                columnObject.selected = !columnObject.selected;
                            } else {
                                for (var i=0; i<holder.columns.length; i++) {
                                    holder.columns[i].selected = 
                                        holder.columns[i] == columnObject ? true : false;
                                }
                            }
                        };
                        
                        columnObject.addEventListener('click', columnObject.toggleSelectClickFunction, true);
                        
                        break;
                    case false:
                        columnObject.selected = false;

                        delete columnObject._config.selected;
                        delete columnObject.selected;
                        columnObject.removeEventListener('click', columnObject.toggleSelectClickFunction, true);
                        delete columnObject.toggleSelectClickFunction;
                        
                        break;
                }
                
            });
            
            columnObject.__defineGetter__('visible', function() {
                return columnObject._config.visible;
            });
            
            columnObject.__defineSetter__('visible', function(bool) {
                bool = !!bool;
                if (bool == columnObject._config.visible)
                    return;
                
                holder['.body'].width += (
                    (bool ? 1 : -1) * (columnObject._config.width + 2)
                );
                
                columnObject._config.visible = bool;
                columnObject.style.display = bool ? '' : 'none';
                
                if (typeof columnObject._selectOverlay != 'undefined')
                    columnObject._selectOverlay.style.display =
                        columnObject.style.display;
                
                if (typeof columnObject._resizeHandle != 'undefined')
                    columnObject._resizeHandle.style.display = 
                        columnObject.style.display;

                
                holder['.columns'].paint(columnObject['.columnIndex']);
                
                //update visible property to visible grid rows
                for (var i=0; i<holder['.bindings'].length; i++) {
                    holder['.bindings'][i].cells[
                        columnObject['.columnIndex']
                    ].visible = bool;
                }
            });
            
            columnObject.__defineGetter__('type', function() {
                return columnObject._config.type;
            });
            
            columnObject.__defineSetter__('type', function(str) {
                columnObject._config.type = str;
                
                //update type property to visible grid rows
                for (var i=0; i<holder['.bindings'].length; i++) {
                    holder['.bindings'][i].cells[
                        columnObject['.columnIndex']
                    ].type = str;
                }
            });
            
            
            columnObject.__defineGetter__('left', function() {
                return columnObject._config.left;
            });
            
            columnObject.__defineSetter__('left', function(intVal) {
                intVal = intVal || 0;
                columnObject.style.left = intVal - columnObject['.columnShift'] + 'px';
                
                if (typeof columnObject._selectOverlay != 'undefined')
                    columnObject._selectOverlay.style.left = columnObject.style.left;
                
                columnObject._config.left = intVal;
                
                if (typeof columnObject._resizeHandle != 'undefined')
                    columnObject._resizeHandle.style.left =
                        columnObject._config.left +
                        columnObject._config.width -
                        columnObject['.columnShift'] + 1 + 'px';

            });
            
            columnObject.__defineGetter__('resizeable', function() {
                return columnObject._config.resizeable;
            });
            
            columnObject.__defineSetter__('resizeable', function(bool) {
                bool = !!bool;
                
                if (bool == columnObject._config.resizeable)
                    return;
                
                columnObject._config.resizeable = bool;
                
                switch (bool) {
                    
                    case true:
                        columnObject._resizeHandle =
                            holder['.edges']['.top']._inner.appendChild(
                                $('div', 'HyperDataGrid_Resizer')
                            );
                            
                        (function(d) {
                            
                            d.style.left =
                                columnObject._config.left +
                                columnObject._config.width -
                                columnObject['.columnShift'] + 1 + 'px';
                            
                            d.setAttr('dragable', '1');
                            
                            var tooltip;
                            
                            d.onDragBegin = function() {
                                d.style.height = holder.offsetHeight - scrollbarWidth + 'px';
                                addStyle(d, 'onDrag');
                                tooltip = d.parentNode.appendChild(
                                    $('div', 'HyperDataGrid_Resizer_Tooltip_TopHeader')
                                );
                                tooltip.style.left = d.offsetLeft + 10 + 'px';
                                tooltip.innerHTML = columnObject.width + ' px';
                            };
                            
                            d.onDragStop = function() {
                                d.style.height = holder['.edges']['.top'].height + 'px';
                                removeStyle(d, 'onDrag');
                                
                                columnObject.width = 
                                    d.offsetLeft -
                                    columnObject._config.left +
                                    columnObject['.columnShift'] + 1;
                                
                                //Propagate width to other selected columns ...
                                for (var i=0; i<holder['.columns'].length; i++) {
                                    if (holder['.columns'][i] != columnObject && 
                                        holder['.columns'][i].selected
                                    ) holder['.columns'][i].width = columnObject.width;
                                }
                                tooltip.parentNode.removeChild(tooltip);
                            };
                            
                            d.onDragRun = function(dummy, dummy1, e) {
    //                             console.log('onDragRun: '+d.offsetLeft);
                                
                                e = e || window.event;
                                
                                if (e.shiftKey) {
                                    columnObject.width = 
                                        d.offsetLeft -
                                        columnObject._config.left +
                                        columnObject['.columnShift'] + 1;
                                    
                                    tooltip.innerHTML = columnObject.width + ' px';
                                        
                                    //propagate width to visible grid rows
                                    for (var i=0; i<holder['.bindings'].length; i++)
                                        holder['.bindings'][i].cells[ columnObject['.columnIndex'] ].width = columnObject._config.width;
                                        
                                } else {
                                    var w = d.offsetLeft -
                                        columnObject._config.left +
                                        columnObject['.columnShift'] + 1;
                                    
                                    w = w > 0 ? w : 1;
                                    tooltip.innerHTML = w + ' px';
                                }
                                
                                tooltip.style.left = d.offsetLeft + 10 + 'px';

                            };
                            
                            d.dragger = 
                                new dragObject(
                                    d,
                                    null,
                                    new Position(0, 0),
                                    new Position(1000000, 0),
                                    d.onDragBegin,
                                    d.onDragRun,
                                    d.onDragStop,
                                    null,
                                    true
                                );
                        })(columnObject._resizeHandle);
                        
                            
                        break;
                    case false:
                        holder['.edges']['.top']._inner.removeChild(
                            columnObject._resizeHandle
                        );
                        
                        columnObject._resizeHandle.dragger.Dispose();
                        delete columnObject._resizeHandle.dragger;
                        
                        delete columnObject._resizeHandle;
                        break;
                    
                }
            });
            
            (function() {
                
                var dragable = false;
                var mirrorNode;
                var lastSwapAfter = null;
                
                columnObject.__defineGetter__('dragable', function() {
                    return dragable;
                });
                
                columnObject.__defineSetter__('dragable', function(bool) {
                    bool = !!bool;
                    if (bool == dragable) return;
                    switch (bool) {
                        case true:
                            
                            columnObject._caption.setAttr('dragable', '1');
                            
                            columnObject['.onDragStart'] = function() {
                                
                                mirrorNode = columnObject.parentNode.appendChild(
                                    columnObject.cloneNode(true)
                                );
                                
                                alpha(columnObject, 50);
                                
                                columnObject.style.zIndex = 10000;
                                columnObject.style.cursor = 'col-resize';
                                
                                lastSwapAfter = columnObject.columnIndex;
                                
                                document.activeElement.blur();
                            };
                            
                            columnObject['.onDragRun'] = function() {
                                
                                if (Math.abs(columnObject.offsetLeft - mirrorNode.offsetLeft) < 5) {
                                    index = columnObject.columnIndex;
                                    addStyle(mirrorNode, 'DOM_HyperDataGrid_SwapCandidate')
                                } else {
                                
                                    var nowLeft = columnObject.offsetLeft;
                                    
                                    var index = 0;
                                    
                                    if (nowLeft > mirrorNode.offsetLeft &&
                                        nowLeft <= mirrorNode.offsetLeft + mirrorNode.offsetWidth
                                    ) {
                                        index = columnObject.columnIndex;
                                        addStyle(mirrorNode, 'DOM_HyperDataGrid_SwapCandidate')
                                    } else {
                                        removeStyle(mirrorNode, 'DOM_HyperDataGrid_SwapCandidate');
                                        while (nowLeft > holder['.columns'][index].offsetLeft + holder['.columns'][index].offsetWidth || index == columnObject.columnIndex) {
                                            index++;
                                            if (index >= holder['.columns'].length - 1) 
                                                break;
                                        }
                                    }
                                
                                }
                                
                                if (index > holder['.columns'].length - 1)
                                    index = holder['.columns'].length - 1;
                                
                                if (index != lastSwapAfter) {
                                    removeStyle(holder['.columns'][lastSwapAfter], 'DOM_HyperDataGrid_SwapCandidate');
                                    lastSwapAfter = index;
                                    addStyle(holder['.columns'][lastSwapAfter], 'DOM_HyperDataGrid_SwapCandidate');
                                }
                                
                            };
                            
                            columnObject['.onDragStop'] = function() {
                                
                                mirrorNode.parentNode.removeChild(mirrorNode);
                                mirrorNode = null;
                                
                                alpha(columnObject, 100);

                                columnObject.style.cursor = '';
                                columnObject.style.zIndex = '';
                                columnObject.left = columnObject.left;
                                
                                removeStyle(holder['.columns'][lastSwapAfter], 'DOM_HyperDataGrid_SwapCandidate');
                                
                                columnObject.columnIndex = lastSwapAfter;
                            };
                            
                            columnObject.setAttr('dragable', '1');
                            columnObject['.dragger'] = new dragObject(
                                columnObject,
                                null,
                                new Position(0, 0),
                                new Position(50000, 0),
                                columnObject['.onDragStart'],
                                columnObject['.onDragRun'],
                                columnObject['.onDragStop'],
                                null,
                                true
                            );
                            break;
                        case false:
                            
                            columnObject._caption.removeAttribute('dragable');
                            
                            columnObject['.dragger'].Dispose();
                            delete columnObject['.onDragStart'];
                            delete columnObject['.onDragRun'];
                            delete columnObject['.onDragStop'];
                            delete columnObject['.dragger'];
                            break;
                    }
                    dragable = bool;
                });
                
            })();
            
            /* BEGIN: INIT COLUMN FROM GIVEN CONFIGURATION */
            
            columnObject.name = columnConfig.name;
            
            columnObject.caption = 
                columnConfig.caption || columnConfig.name;
            
            columnObject.width = 
                typeof columnConfig.width != 'undefined' ? 
                columnConfig.width : 100;

            columnObject.align = 
                typeof columnConfig.align != 'undefined' ? 
                columnConfig.align : 'left';
            
            columnObject.sortable = 
                typeof columnConfig.sortable != 'undefined' ? 
                columnConfig.sortable : false;
            
            if (columnObject.sortable) {
                columnObject.sortFunc = 
                    columnConfig.sortFunc || null;
                
                columnObject.sortOrder = 
                    columnConfig.sortOrder || 0;
            }
            
            columnObject.selectable = 
                typeof columnConfig.selectable != 'undefined' ? 
                columnConfig.selectable : true;
            
            if (columnObject.selectable)
                columnObject.selected= 
                    typeof columnConfig.selected != 'undefined' ? 
                    columnConfig.selected : false;
            
            columnObject.visible = 
                typeof columnConfig.visible != 'undefined' ? 
                columnConfig.visible : true;
            
            columnObject.type = 
                typeof columnConfig.type != 'undefined' ? 
                columnConfig.type : 'string';
            
            columnObject.resizeable = 
                typeof columnConfig.resizeable != 'undefined' ? 
                columnConfig.resizeable : false;
            
            columnObject.editable =
                typeof columnConfig.editable != 'undefined' ? (columnConfig.editable ? true : false) : false;
                
            /* END: INIT FROM PROVIDED CONFIGURATION */
                
            holder['.columns'].paint(columnIndex);
            
            columnObject.dragable = holder['.columns'].dragable;
            
            columnObject.addContextMenu([
                {
                    'caption': 'Hide',
                    'icon'   : 'jsplatform/img/hyperdatagrid/table_column_visible-16x16.png',
                    'handler': function() {
                        columnObject.visible = false;
                        holder['.updateMenu']();
                    }
                }
            ]);
            
            holder['.updateMenu']();
        };
        
        (function() {
            var sortSelection = [];
            
            holder.__defineGetter__('sortFilters', function() {
                return sortSelection;
            });
            
            holder.__defineSetter__('sortFilters', function(arr) {
            
                holder.onCustomEvent('beforeSort');
            
/*                console.log(columnsSorted);
                console.log(arr);*/
                
                //Compile the sortSelection
                var isNotDefined;
                
                for (var i=0; i<arr.length; i++) {
                    isNotDefined = false;
                    
                    if (!arr[i] instanceof Object)
                        throw "Sort Item #"+(i+1)+" is not an object!";
                    
                    if (!arr[i].name)
                        throw "Sort Item #"+(i+1)+" does not have the name configured!";
                    
                    if (typeof holder.columnsByName[arr[i].name] == 'undefined')
                        throw "Sort Item #"+(i+1)+" column '" + arr[i].name + "' is not defined";
                    
                    if (![-1, 0, 1].indexOf(arr[i].order) == -1)
                        throw "Sort Item #"+(i+1)+" column '" + arr[i].name+ "': Invalid sort order value!";
                    
                    /*
                    
                    if (!arr[i] || 
                        !(arr[i] instanceof Object) ||
                        !arr[i].name || 
                        (typeof arr[i].order == 'undefined') || 
                        ![-1, 0, 1].indexOf(arr[i].order) ||
                        (isNotDefined = typeof holder.columnsByName[arr[i].name] == 'undefined')
                    ) throw "HyperDataGrid.sortFilters: Invalid sort filter: "+ (!isNotDefined ? "Expected [{name:...,order:[-1|1]},{name:...,order:[-1|1]},...]" : "Column '"+arr[i].name+"' was not found!");
                    
                    if (!holder.columns[arr[i].name].sortable)
                        throw "HyperDataGrid.sortFilters: Column "+arr[i].name+" is not sortable!";*/
                }
                
                var columnsSorted = [];
                sortSelection = []
                
                for (var i=0; i<arr.length; i++) {
                    var item = arr[i];
                    item.order = item.order || 1;
                    
                    if (item.order != 0) {
                        sortSelection.push(item);
                    
                        holder['.columnsByName'][item.name]._sortSign.className =
                            'HyperDataGrid_SortSign'.concat(
                                item.order == 1 ? ' SortAscending' : ' SortDescending'
                            );
                        
                        columnsSorted.push(item.name);
                    }
                }
                
//                 console.log(sortSelection);
                
                //Reset other columns sort signs ...
                for (var i=0; i<holder.columns.length; i++) {
                    if (columnsSorted.indexOf(
                            holder.columns[i].name
                        ) == -1 &&
                        holder.columns[i]._sortSign
                    ) holder.columns[i]._sortSign.className = 'HyperDataGrid_SortSign';
                }
                
                //Do effective searching ...
                
                var doSortJobByIndex = function(jobIndex, previousSortValues) {
                    var nowSplits = [];
                    
                    previousSortValues = previousSortValues || [[
                        0,
                        holder['.rows'].length - 1
                    ]];
                    
                    var colName = sortSelection[jobIndex].name;
                    var sOrder  = sortSelection[jobIndex].order;
                    var subSets;
                    
                    for (var i=0; i<previousSortValues.length; i++) {
                        subSets = holder.arraySubSortByKey(
                            colName, sOrder, previousSortValues[i][0], previousSortValues[i][1]
                        );
                        
                        for (var sub=0; sub<subSets.length; sub++) {
                            if (subSets[sub][0] != subSets[sub][1])
                                nowSplits.push(subSets[sub]);
                        }
                    }
                    
                    return nowSplits;
                };
                
                var prevSorts = null;
                
                if (sortSelection.length) {
                
                    for (var i = holder['.bindings'].length - 1; i >= 0; i--) {
                       holder.unbindRow(i);
                    }
                    
//                     console.log('unbinded...');
                    
                    for (var i=0; i<sortSelection.length; i++) {
//                         console.log('doing job sort: '+i + ', key = '+sortSelection[i].name);
                        prevSorts = doSortJobByIndex(i, prevSorts);
//                         console.log(prevSorts);
                        if (!prevSorts.length)
                            break;
                    }
                
//                     console.log('updateAfter 0...');
                    holder['.rows'].__updateAfter__(0, true);
                
//                     console.log('viewport change');
                    holder.onViewportChange(holder.viewport);
                
                }
                
                holder.onCustomEvent('afterSort');
            });
        })();
        
        
        holder.arraySubSortByKey = function(key, order, start, stop) {
//             console.log('SubSortBykey "'+key+'('+order+')": FROM '+start+' TO '+stop);
            
            if (stop <= start) {
                return [
                    [
                        start,
                        start
                    ] 
                ]; //Not Sortable
            }
            
            var out = [];
            for (var i=start; i<=stop; i++) {
/*                console.log('grid[\'.rows\']['+i+'].$.cells.toString['+key+'] = '+
                    holder['.rows'][i].$.cells.toString[key]
                );
*/
                out.push(
                    {
                        'index': i,
                         'value': holder['.rows'][i].$.cells.toString[key]
                    }
                );
            }
            
            holder._currentSortOrder = order;
            
            out.sort(
                
                holder.columnsByName[ key ].sortFunc ||
                
                function(a,b) {
                    return a.value == b.value ? 0 : order * ( a.value < b.value ? -1 : 1 );
                }
            );
            
            var cValue = out[0].value;
            
            var cDataSet = [
                start, start
            ];
            
            var sets = [];
            
            var rebuildIndex = [ holder['.rows'][ out[0].index ] ];
            
            for (var i=1; i<out.length; i++) {
                
                rebuildIndex.push(
                    holder['.rows'][ out[i].index ]
                );
                
                if (cValue == out[i].value) {
                    cDataSet[1]++;
                } else {
                    cValue = out[i].value;
                    sets.push(cDataSet);
                    cDataSet = [
                        cDataSet[1] + 1,
                        cDataSet[1] + 1
                    ];
                }
            }
            
            sets.push(cDataSet);

            for (var i=0; i < rebuildIndex.length; i++) {
                holder['.rows'][i + start] = rebuildIndex[i];
            }
            
            return sets;
            
        }
        
        holder.sortColumnByName = function(columnName, sortOrder, additionalAdd) {
            
//             console.log('scbn: '+columnName+', '+sortOrder);
            
            if (!sortOrder && holder.columns[columnName]) {
                holder.columns[columnName]._sortSign.className = 'HyperDataGrid_SortSign';
                return;
            }
            
            additionalAdd = additionalAdd || false;
            
            if (additionalAdd) {
                var filters = holder.sortFilters;
                filters.push({'name': columnName, 'order': sortOrder});
                holder.sortFilters = filters;
            } else
                holder.sortFilters = [{'name': columnName, 'order': sortOrder}];
        };
        
        holder.addDataBindingProperty = function(DataObject, propertyName) {
            DataObject.$.cells.byName.__defineSetter__(propertyName, function(mixedValue) {
                DataObject[propertyName] = mixedValue;
                if (DataObject.$.binding)
                    DataObject.$.binding.cells[
                        holder.columnsByName[propertyName].columnIndex
                    ].type = holder.columnsByName[propertyName].type;
            });
            
            DataObject.$.cells.byName.__defineGetter__(propertyName, function() {
                return typeof DataObject[propertyName] == 'undefined' ? null : DataObject[propertyName];
            });
            
            DataObject.$.cells.toString.__defineGetter__(propertyName, function() {
                var tp = holder['.columnsByName'][propertyName]._config.type.split('|');
                
                try {
                
                return typeof DataObject[propertyName] == 'undefined' ? '' : holder.cellParsers[tp[0]](
                    DataObject[propertyName],
                    tp[1],
                    tp[2]
                );
                
                } catch (e) { return ''; }
            });
        };
        
        holder.removeDataBindingProperty = function(DataObject, propertyName) {
            delete DataObject.$.cells.byName[propertyName];
            delete DataObject.$.cells.toString[propertyName];
        };
        
        holder.renameDataBindingProperty = function(DataObject, oldPropertyName, newPropertyName) {
            var mixed = typeof DataObject[oldPropertyName] == 'undefined' ? null : DataObject[oldPropertyName];
            delete DataObject[oldPropertyName];
            holder.removeDataBindingProperty(DataObject, oldPropertyName);
            DataObject[newPropertyName] = mixed;
            holder.addDataBindingProperty(DataObject, newPropertyName);
        };
        
        holder['.rows'].enableRowTag = function(DataObject, tagName) {
            if (typeof DataObject.$.tags[tagName] == 'undefined') {
                (function() {
                    
                    var TagValue = null;
                    
                    DataObject.$.tags.__defineGetter__(tagName, function() {
                        return TagValue;
                    });
                    
                    DataObject.$.tags.__defineSetter__(tagName, function(strOrNull) {
                        TagValue = !!strOrNull ? strOrNull : null;
                        if (DataObject.$.binding) {
                            (!!strOrNull ? DataObject.$.binding.handle.setTag(tagName, strOrNull) : DataObject.$.binding.handle.setTag(tagName));
                        }
                    });
                    
                })();
            }
        };
        
        holder['.rows'].setPossibleRowTags = function(DataObject, tagsListObject, keepOldEntries) {
            var tagName;
            
            if (keepOldEntries) {
                for (tagName in DataObject.$.tags) {
                    if (DataObject.$.tags.propertyIsEnumerable(tagName) && !tagsListObject[tagName])
                        delete DataObject.$.tags[tagName];
                }
            } else DataObject.$.tags = {};
            
            for (tagName in tagsListObject) {
                if (tagsListObject.propertyIsEnumerable(tagName) && !DataObject.$.tags[tagName])
                    holder['.rows'].enableRowTag(DataObject, tagName);
            }
        };
        
        holder.getDataBinding = function(DataObject, UseTemplate) {
            if (typeof DataObject.$ != 'undefined') return DataObject;
            
            DataObject.$ = {
                "row": {
                    ".height"  : UseTemplate.height || holder['.settings']['defaultRowHeight'],
                    ".selected": UseTemplate.selected || false,
                    ".visible" : typeof UseTemplate.visible != 'undefined' ? !!UseTemplate.visible : true,
                    ".top"     : null, //TOP is inited from previous row top + previous row height,
                    ".index"   : UseTemplate.index,
                    ".selectable": typeof UseTemplate.selectable != 'undefined' ? !!UseTemplate.selectable : holder['.selectable'],
                    ".resizeable": typeof UseTemplate.resizeable != 'undefined' ? !!UseTemplate.resizeable : holder['.rows']['.resizeable']
                },
                "cells": {
                    "byName": {
                        
                    },
                    "toString": {
                        
                    }
                }
            };
            
            holder['.rows'].setPossibleRowTags(DataObject, holder.tags);
            
            /* BIND BASICS */
            
            DataObject.$.row.__defineGetter__('resizeable', function() {
                return DataObject.$.row['.resizeable'];
            });
            
            DataObject.$.row.__defineSetter__('resizeable', function(bool) {
                bool = !!bool;
                if (bool == DataObject.$.row['.resizeable']) return;
                DataObject.$.row['.resizeable'] = bool;
                //Propagate to binding if any ...
                if (DataObject.$.binding)
                    DataObject.$.binding.resizeable = bool;
            });
            
            DataObject.$.row.__defineGetter__('height', function() {
                return DataObject.$.row['.visible'] ? DataObject.$.row['.height'] + 1 : 0;
            });
            
            DataObject.$.row.__defineSetter__('height', function(intVal) {
                intVal = intVal || 0;
                
                if (intVal != DataObject.$.row['.height']) {
                    holder.body.height += (intVal - DataObject.$.row['.height']);
                    
                    DataObject.$.row['.height'] = intVal;
                    
                    if (DataObject.$.binding) {
                        DataObject.$.binding.height = intVal;
                        setTimeout(holder.onViewportChange, 1);
                    }

                    if (DataObject.$.row['.visible']) {
                        holder['.rows'].__updateAfter__(
                            DataObject.$.row['.index']
                        );
                    }
                }
            });
            
            DataObject.$.row.__defineGetter__('top', function() {
                return DataObject.$.row['.top'];
            });
            
            DataObject.$.row.__defineSetter__('top', function(intVal) {
                intVal = intVal || 0;
                intVal != DataObject.$.row['.top'] ? (function() {
                    DataObject.$.row['.top'] = intVal;
                    if (DataObject.$.binding)
                        DataObject.$.binding.top = intVal;
                    holder['.rows'].__updateAfter__( DataObject.$.row['.index'] + 1 );
                })() : false;
            });
            
            DataObject.$.row.top =
                UseTemplate.index == 0 ? 0 : 
                    holder['.rows'][ UseTemplate.index - 1 ].$.row['.top'] + 
                    holder['.rows'][ UseTemplate.index - 1 ].$.row.height;
            
            DataObject.$.row.__defineGetter__('selected', function() {
                return DataObject.$.row['.selected'];
            });
            
            DataObject.$.row.__defineSetter__('selected', function(bool) {
                bool = !!bool;
                if (bool != DataObject.$.row['.selected']) {
                    DataObject.$.row['.selected'] = bool;
                    if (DataObject.$.binding)
                        DataObject.$.binding.selected = bool;
                }
            });
            
            DataObject.$.row.__defineGetter__('visible', function() {
                return DataObject.$.row['.visible'];
            });
            
            DataObject.$.row.__defineSetter__('visible', function(bool) {
                bool = !!bool;
                if (bool != DataObject.$.row['.visible']) {
                    DataObject.$.row['.visible'] = bool;
                    
                    if (DataObject.$.binding)
                        DataObject.$.binding.visible = bool;
                    
                    holder.body.height += ((bool ? 1 : -1) * (DataObject.$.row['.height'] + 1));
                    
                    holder['.rows'].__updateAfter__( DataObject.$.row['.index'] + 1 );
                }
            });
            
            DataObject.$.row.__defineSetter__('selectable',function(bool) {
                if ((bool == !!bool) == DataObject.$.row['.selectable']) return;
                DataObject.$.row['.selectable'] = bool;
                if (DataObject.$.binding)
                    DataObject.$.binding.selectable = bool;
            });
            
            /* BIND CELLS GETTERS AND SETTERS */
            
            for (var i=0; i<holder['.columns'].length; i++) {
                (function(methodIndex) {
                    DataObject.$.cells.__defineGetter__(
                        methodIndex, function() {
                                return typeof DataObject[
                                    holder['.columns'][methodIndex]._config.name
                                ] != 'undefined' ?  DataObject[
                                    holder['.columns'][methodIndex]._config.name
                                ] : null;
                        }
                    );
                    DataObject.$.cells.__defineSetter__(
                        methodIndex, function(mixedValue) {
                                DataObject[
                                    holder['.columns'][methodIndex]._config.name
                                ] = mixedValue;
                                
                                if (DataObject.$.binding) {
                                    DataObject.$.binding.cells[methodIndex].type =
                                        holder['.columns'][methodIndex]._config.type
                                }
                                
                        }
                    );
                    holder.addDataBindingProperty(
                        DataObject, holder['.columns'][methodIndex]._config.name
                    );
                })(i);
            }
            
            DataObject.$.cells.__defineGetter__('length',
                function() {
                    return holder['.columns'].length
                }
            );
            
            DataObject.$.__defineGetter__('primaryKey', function() {
                return holder['.primaryKey'] === null ? 
                    DataObject.$.row['.index'] + 1 : DataObject.$.cells.byName[holder['.primaryKey']];
            });
            
            return DataObject;
        }
        
        holder['.rows']['.updateAfterEnabled'] = true;
        
        holder['.rows'].__defineGetter__('rowUpdatesEnabled', function() {
            return holder['.rows']['.updateAfterEnabled'];
        });
        
        holder['.rows'].__defineSetter__('rowUpdatesEnabled', function(bool) {
            bool = !!bool;
            if (bool != holder['.rows']['.updateAfterEnabled']) {
                    holder['.rows']['.updateAfterEnabled'] = bool;
                    if (bool) holder['.rows'].__updateAfter__(0, true);
            }
        });
        
        //@ Updates the DataObject.$.row.top && DataObject.$.row.index to all rows starting from startIndex
        holder['.rows'].__updateAfter__ = function(startIndex, recalculateIndexes) {
            if (startIndex >= holder['.rows'].length || !holder['.rows']['.updateAfterEnabled']) return;
            
            var startTop = startIndex == 0 ? 0 : 
                holder['.rows'][startIndex - 1].$.row['.top'] +
                holder['.rows'][startIndex - 1].$.row.height;
            
            for (var i = startIndex; i<holder['.rows'].length; i++) {
                if (recalculateIndexes) {
                    holder['.rows'][i].$.row['.index'] = i;
                    if (holder['.primaryKey'] === null && holder['.rows'][i].$.binding)
                        holder['.rows'][i].$.binding.primaryKey = null;
                }
                holder['.rows'][i].$.row['.top'] = startTop;
                if (holder['.rows'][i].$.binding)
                    holder['.rows'][i].$.binding.top = startTop;
                holder['.rows'][i].$.row['.index'] = i;
                startTop += holder['.rows'][i].$.row.height; 
            }
        }
        
        var resort = (function() {
            var dde    = null;
            return (function() {
                if ( !dde )
                    dde = throttle( function() {
                        var filters = holder.sortFilters;
                        if ( filters && filters.length ) {
                            holder.sortFilters = filters;
                        }
                    }, 50 );
                dde.run();
            });
        })();
        
        holder['.lazyInsert'] = {
            'threadID': null,
            'progress': null,
            'stack'   : null,
            'insertPos': 0,
            'thread'  : function() {
                
                try {
                    
                    var i = 0;
                    
                    while (i < 50 && holder['.lazyInsert'].insertPos < holder['.lazyInsert'].stack.length) {
//                          console.log(i);
                        holder['.rows'].add(
                            holder['.lazyInsert'].stack[holder['.lazyInsert'].insertPos].o,
                            holder['.lazyInsert'].stack[holder['.lazyInsert'].insertPos].i,
                            holder['.lazyInsert'].stack[holder['.lazyInsert'].insertPos].c,
                            true
                        )
                        holder['.lazyInsert'].insertPos++;
                        i++;
                    }
                    
                    if (holder['.lazyInsert'].stack.length == holder['.lazyInsert'].insertPos) {
                        holder['.lazyInsert'].stack = [];
                        holder['.lazyInsert'].insertPos = 0;
                        holder.lazyInsert = false;
                    } else {
                        holder['.lazyInsert'].progress.maxValue = holder['.lazyInsert'].stack.length;
                        holder['.lazyInsert'].progress.value = holder['.lazyInsert'].insertPos;
                        //holder.rows.length;
                    }
                    
                    resort();
                
                } catch (Exception) {
                    
                }
                
            }
        };
        
        holder.__defineGetter__('lazyInsert', function() {
            return holder['.lazyInsert'].stack !== null
        });
        
        
        holder.abortLoading = function() {
            try {
                if ( holder['.lazyInsert'].threadID ) {
                    window.clearInterval( holder['.lazyInsert'].threadID );
                    holder['.lazyInsert'].threadID = null;
                }
                holder['.lazyInsert'].stack = [];
                holder['.lazyInsert'].insertPos = 0;
                try {
                    holder._bodyHolder.removeChild(
                        holder['.lazyInsert'].progress
                    );
                } catch (e) {}
                try {
                    holder['.lazyInsert'].progress = null;
                } catch (e){}
            } catch (f) {
                
            }
            holder.clear();
        }
        
        holder.__defineSetter__('lazyInsert', function(bool) {
            bool = !!bool;

            if (bool == (holder['.lazyInsert'].stack !== null))
                return;
            
            switch (bool) {
                case true:
                    holder['.lazyInsert'].stack = [];
                    
                    holder['.lazyInsert'].threadID = window.setInterval(
                        holder['.lazyInsert'].thread, 50
                    );
                    holder['.lazyInsert'].progress = holder._bodyHolder.appendChild(
                        (new ProgressBar({'value': 0, 'minValue': 0, 'maxValue': 0})).setAttr(
                            'style', 'position: absolute; left: 2px; width: '+(holder['.edges']['.left'].width - 6)+'px; bottom: 2px; height: 10px; z-index: 1000; display: block;'
                        )
                    );
                    
                    holder['.lazyInsert']['.startTime'] = (new Date()).getTime();
//                     console.error(holder['.lazyInsert'].progress.style.width);
                    
                    break;
                case false:
                    
                    if (holder['.lazyInsert'].stack.length) {
                        setTimeout(function() {
                            holder.lazyInsert = false;
                        }, 1000);
                        return;
                    }
                    
                    window.clearInterval(holder['.lazyInsert'].threadID);
                    holder['.lazyInsert'].threadID = null;
                    
                    try {
                    holder._bodyHolder.removeChild(
                        holder['.lazyInsert'].progress
                    );
                    } catch( e ){}
                    holder['.lazyInsert'].stack = null;
                   
                    try {
                        holder.onViewportChange();
                    } catch(ex) {}
                    
                    holder.onCustomEvent('ready', {
                        'time': (new Date()).getTime() - holder['.lazyInsert']['.startTime'],
                        'rows': holder['.lazyInsert'].progress.value
                    });
                    
                    holder['.lazyInsert'].progress = null;
                    
                   break;
            }
        });
        
        holder['.rows']['.resizeable'] = false;
        holder['.rows'].__defineGetter__('resizeable', function() {
            return holder['.rows']['.resizeable'];
        });
        
        holder['.rows'].__defineSetter__('resizeable', function(bool) {
            bool = !!bool;
            if (bool == holder['.rows']['.resizeable'])
                return;
            holder['.rows']['.resizeable'] = bool;
            //Propagate to existing rows ...
            for (var i=0; i<holder['.rows'].length; i++) {
                holder['.rows'][i].$.row.resizeable = bool;
            }
        });
        
        holder['.rows'].deleteRow = function(RowObject) {
            if (!holder.onCustomEvent('delete', RowObject))
                return false;
            
            holder.body.height -= RowObject.$.row['.height'];
            
            if (holder.selectable && holder.selectedIndex == RowObject.$.row['.index']) {
                holder.selectedIndex = -1;
                holder.onCustomEvent('change');
            } else {
                
                holder['.selectedIndex'] = holder['.selectedIndex'] > RowObject.$.row['.index'] ? (function() { 
                    holder['.selectedIndex']--;
                    holder.onCustomEvent('change');
                    return holder['.selectedIndex'];
                })() : holder['.selectedIndex'];
                
            }
            
            var needRedraw = false;
            
            if (RowObject.$.binding) {
                holder.unbindRow(RowObject.$.row['.index'], true);
                needRedraw = true;
            }
            holder['.rows'].splice(
                RowObject.$.row['.index'], 1
            );
            
            holder['.rows'].__updateAfter__(RowObject.$.row['.index'], true);
            if (needRedraw)
                holder.onViewportChange();
            
        };
        
        holder['.rows'].clear = function() {
            if (!holder.onCustomEvent('clear'))
                return;
            
            if (holder.selectable) {
                holder.selectedIndex = -1;
                holder.onCustomEvent('change');
            }
            
            holder.body.height = 0;
            holder['.rows'].splice(0, holder['.rows'].length);
            
            while (holder['.bindings'].length)
                holder.unbindRow(0, true);
            
            holder['.lazyInsert'].stack = holder['.lazyInsert'].stack === null ? null : (function() {
                    window.clearInterval(holder['.lazyInsert'].threadID);
                    holder['.lazyInsert'].threadID = null;
                    try {
                    holder._bodyHolder.removeChild(
                        holder['.lazyInsert'].progress
                    );
                    } catch(e) {}
                    holder['.lazyInsert'].progress = null;
                    return null;
            })();
        }
        
        // Adds a row to the Grid
        holder['.rows'].add = function(RowObject, RowIndex, OptionalConf, noCache) {
            
            noCache = noCache || false;
            
            if (!noCache && holder['.lazyInsert'].stack == null)
                holder.lazyInsert = true;
            
            if (!noCache && holder['.lazyInsert'].stack) {
                return holder['.lazyInsert'].stack.push({
                    'o': RowObject,
                    'i': RowIndex,
                    'c': OptionalConf
                });
            }
            
            OptionalConf = OptionalConf || {
               //"height":
               //"selected":
               //"visible":
               //@auto "top":
               //@auto "index":
            };
            
            holder['.scrollbars']['.vertical'].much +=
                OptionalConf.height || holder['.settings']['defaultRowHeight'] + 1;
                
            if (holder['.scrollbars']['.vertical']['.height'].scSize <= holder['.body'].offsetHeight + 100)
                holder.onViewportChange();

            
            OptionalConf.index = RowIndex ? (function() {
                if (RowIndex > holder['.rows'].length - 1 || RowIndex < 0)
                    throw "HyperDataGrid.add: Index out of bounds!";
                return RowIndex;
            })() : holder['.rows'].length;
            
            RowObject = holder.getDataBinding(RowObject, OptionalConf);
            
            holder['.rows'].splice(OptionalConf.index, 0, RowObject);
            
            resort();
            
            holder.onCustomEvent('rowInserted', RowObject);
        };
        
        // Finds the minimum and the maximum index of the rows that should be visible
        holder.findViewportDisplayIndexes = function(searchStart, searchStop) {
        
            searchStart = searchStart < 0 ? 0 : searchStart;
            searchStart = searchStart >= holder['.rows'].length ? holder['.rows'].length - 1 : searchStart;
            
            searchStop = searchStop < 0 ? 0 : searchStop;
            searchStop = searchStop >= holder['.rows'].length ? holder['.rows'].length - 1 : searchStop;
            
            var searchDirection = searchStart <= searchStop ? 1 : -1;
            
            searchStop += (searchDirection * 300);
            searchStart -= (searchDirection * 300);
            
            searchStart = searchStart < 0 ? 0 : searchStart;
            searchStart = searchStart >= holder['.rows'].length ? holder['.rows'].length - 1 : searchStart;
            
            searchStop = searchStop < 0 ? 0 : searchStop;
            searchStop = searchStop >= holder['.rows'].length ? holder['.rows'].length - 1 : searchStop;
            
            if (searchStart >= 0 && searchStart == searchStop) {
                return {
                    'start': searchStart,
                    'stop' : searchStop
                };
            }
            
            for (var i = searchStart; i != searchStop; i += searchDirection) {
                if (holder['.viewport'].contains(holder['.rows'][i])) {
                    var start = i;
                    var stop = i;
                    
                    do {
                        if (stop == searchStop) break;
                        else {
                            stop += searchDirection;
                            if (!holder['.viewport'].contains(
                                holder['.rows'][stop]
                                )
                            ) break;
                        }
                    } while (stop != searchStop);
                    
                    start1 = Math.min(start, stop) - 1;
                    stop1  = Math.max(start, stop) + 1;
                    
                    start = start1 >= 0 ? start1 : 0;
                    stop  = stop1 < holder['.rows'].length ? stop1 : holder['.rows'].length;
                    
                    return {
                        'start': start,
                        'stop' : stop
                    };
                }
            }

            return null;

        };
        
        // Removes a visible row from visible viewport
        holder.unbindRow = function(bindingIndex, forceUnbind) {
            
            if (!forceUnbind) {
                for (var i=0; i<holder['.columns'].length; i++) {
                    if (holder['.bindings'][bindingIndex].cells[i].isEditing) {
                        return;
                    }
                }
            }
            
            holder['.edges']['.left']._inner.removeChild(holder['.bindings'][bindingIndex].handle);
            if (holder['.bindings'][bindingIndex].resizer)
                holder['.edges']['.left']._inner.removeChild(holder['.bindings'][bindingIndex].resizer);
                
            delete holder['.body'].removeChild(
                holder['.bindings'].splice(bindingIndex, 1)[0]
            ).row.$.binding;
        };
        
        // Adds a row to visible viewport
        holder.bindRow = function(row) {
            if (row.$.binding)
                return;

            row.$.binding = $('div', 'DOM_HyperDataGrid_Row');
//             disableSelection(row.$.binding);
            
            row.$.binding.addEventListener('dblclick', function(e) {
                holder.onCustomEvent('dblclick', row);
            }, true);
            
            if (holder.focusedRowIndex == row.$.row['.index'])
                addStyle(row.$.binding, 'focused');
            
            row.$.binding.display = {
                'width': 0,
                'height': 0,
                'top': 0,
                'visible': true,
                'left': holder['.scrollbars']['.horizontal'].offsetLeft,
                'selectable': false,
                'selectClickFunction': function(e) {
                    e = e || window.event;
                    
                    if (!(e.which == 1)) {
                        cancelEvent(e);
                        return;
                    }
                    
                    //console.log('selectable');
                    var needFireChange = false;
                    switch (true) {
                        case e.ctrlKey:
                            row.$.row.selected = !row.$.row.selected;
                            needFireChange = true;
                            break;
                        case !e.ctrlKey:
                            needFireChange = holder.selectedIndex != row.$.row['.index'] || holder.selection.byRows.length != 1;
                            holder.selectedIndex = row.$.row['.index'];
                            break;
                    }
                    if (e.shiftKey && holder['.selectedIndex'] != -1) {
                        needFireChange = true;
                        for (var i=Math.min(holder['.selectedIndex'], row.$.row['.index']); i<=Math.max(holder['.selectedIndex'], row.$.row['.index']); i++)
                            if (i != row.$.row['.index'])
                                holder['.rows'][i].$.row.selected = row.$.row.selected;
                    }
                    holder['.selectedIndex'] = row.$.row['.selected'] ? row.$.row['.index'] : (function() {
                        var allRows = holder.selection.byRowsIndexes;
                        needFireChange = true;
                        return allRows.length ? allRows[allRows.length - 1] : -1;
                    })();
                    
                    if (needFireChange)
                    holder.onCustomEvent('change');
                },
                'resizeable': false
            };
            
            row.$.binding.handle = holder['.edges']['.left']._inner.appendChild(
                (function() {
                    var hdl = $('div', 'DOM_HyperDataGrid_RowHandle');
                    
                    hdl.tagsHolder = hdl.appendChild($('div'));
                    hdl.tagsHolder.style.width = (holder.tags.length * 20) + 'px';
                    hdl.b = hdl.appendChild($('b'));
                    
                    hdl.tags = {};
                    
                    hdl.setTag = function(tagName, tagValue){ 
                        
                        if ((typeof tagValue == 'undefined') && hdl.tags[tagName]) {
                            hdl.tagsHolder.removeChild(
                                hdl.tags[tagName]
                            );
                            delete hdl.tags[tagName];
                        } else {
                            if (tagValue) {
                                (hdl.tags[tagName] = 
                                  (hdl.tags[tagName] || 
                                        hdl.tagsHolder.appendChild(
                                            $('div', 'DOM_HyperDataGrid_TAG '.concat(holder.tags[tagName].className))
                                        )
                                  ).setAttr('title', tagValue)
                                ).style.left = holder.tags[tagName].left;
                                
                                hdl.tags[tagName].style.display = 'block';
                            }
                        }
                    }
                    
                                
                    return hdl;
                })()
            );
            
            row.$.binding.onFocusEvent = function( ev ) {
                if ( holder.selection.byRowsIndexes.indexOf( row.$.row['.index'] ) == -1 && !ev.ctrlKey)
                    holder.selection.byRowsIndexes = [];
                holder.focusedRowIndex = row.$.row['.index'];
            };
            
            row.$.binding.handle.addEventListener('mousedown', row.$.binding.onFocusEvent, true);
            row.$.binding.addEventListener('focus', row.$.binding.onFocusEvent, true);
            
            row.$.binding.__defineSetter__('selectable', function(bool) {
                row.$.binding.display.selectable = !!bool;
                switch (row.$.binding.display.selectable) {
                    case false:
//                         row.$.binding.removeEventListener('mousedown', row.$.binding.display.selectClickFunction, true);
                        row.$.binding.handle.removeEventListener('mousedown', row.$.binding.display.selectClickFunction, true);
                        break;
                    case true:
//                         row.$.binding.addEventListener('mousedown', row.$.binding.display.selectClickFunction, true);
                        row.$.binding.handle.addEventListener('mousedown', row.$.binding.display.selectClickFunction, true);
                        break;
                }
            });
            
            row.$.binding.__defineSetter__('width', function(intVal) {
                row.$.binding.style.width = (row.$.binding.display.width = (intVal || 0)) + 'px';
            });

            row.$.binding.__defineSetter__('top', function(intVal) {
                var scTop = holder['.scrollbars']['.vertical'].scrollTop;
                
                row.$.binding.style.top = row.$.binding.handle.style.top = 
                    (row.$.binding.display.top = (intVal || 0)) - scTop + 'px';
                
                if (row.$.binding.resizer)
                    row.$.binding.resizer.style.top = row.$.binding.display.top - scTop + row.$.binding.display.height + 'px';
            });

            row.$.binding.__defineSetter__('visible', function(bool) {
                row.$.binding.style.display = row.$.binding.handle.style.display =(row.$.binding.display.visible = !!bool) ? '' : 'none';
                if (row.$.binding.resizer) 
                    row.$.binding.resizer.style.display = bool ? '' : 'none';
            });

            row.$.binding.__defineSetter__('height', function(intVal) {
                row.$.binding.style.height = row.$.binding.handle.style.height = (row.$.binding.display.height = (function(heightInt){
                    for (var i=0; i<holder['.columns'].length; i++)
                        row.$.binding.cells[i].style.height = heightInt - 4 + 'px';
                    return heightInt;
                }) ((intVal || 0))) + 'px';
                
                if (row.$.binding.resizer)
                    row.$.binding.resizer.style.top = row.$.binding.display.top - holder['.scrollbars']['.vertical'].scrollTop + row.$.binding.display.height + 'px';
            });

            row.$.binding.__defineSetter__('left', function(intVal) {
                row.$.binding.style.left = -(row.$.binding.display.left = (intVal || 0 )) + 'px';
            });
            
            row.$.binding.__defineSetter__('selected', function(bool) {
                switch (!!bool) {
                    case true:
                        addStyle(row.$.binding, 'selected');
                        addStyle(row.$.binding.handle, 'selected');
                        break;
                    case false:
                        removeStyle(row.$.binding, 'selected');
                        removeStyle(row.$.binding.handle, 'selected');
                        break;
                }
            });
            
            row.$.binding.__defineSetter__('primaryKey', function(str) {
                row.$.binding.handle.b.innerHTML = '';
                row.$.binding.handle.b.appendChild(
                    $text( (str === null || initSettings.forceNumberedRows) ? (row.$['row']['.index'] + 1) : row.$.cells.byName[str] )
                );
            });
            
            row.$.binding.editCell = function(e) {
                e = e || window.event;
                
                if (e && e.ctrlKey) return;
                
                var targetCell = e.target || e.srcElement;
                if (!targetCell || targetCell.parentNode != row.$.binding)
                    return;
                
                targetCell.editCell();
            };
            
//             row.$.binding.addEventListener('dblclick', row.$.binding.editCell, false);
            
            row.$.binding.cells = {};
            for (var i = 0; i<row.$.cells.length; i++) {
                
                (function(cellIndex) {
                    row.$.binding.cells[cellIndex] =
                        row.$.binding.appendChild(
                            $('div', 'DOM_HyperDataGrid_Cell')
                        );
                    
                    (function(cellIndex) {
                        var isEditing = false;
                        
                        row.$.binding.cells[cellIndex].__defineGetter__('isEditing', function() {
                            return isEditing;
                        });
                        
                        row.$.binding.cells[cellIndex].__defineSetter__('isEditing', function(bool) {
                            
                            if ((isEditing == !!bool) && isEditing)
                                throw "Warning: Attempted to assign the isEditing the same value!";
                            
                            ((isEditing = !!bool) ? addStyle : removeStyle)(row.$.binding.cells[cellIndex], 'editing');
                            
                            switch (isEditing) {
                                case true:
                                    row.$.binding.cells[cellIndex]['.previousValue'] =
                                        row.$.cells[cellIndex];
                                        
                                    row.$.binding.cells[cellIndex].revert = function() {
                                        row.$.cells[cellIndex] = row.$.binding.cells[cellIndex]['.previousValue'];
                                        row.$.binding.cells[cellIndex].isEditing = false;
                                    };
                                    
                                    row.$.lastEditedRowName = row.$.binding.cells[cellIndex].name;
                                    
                                    break;
                                case false:
                                    setTimeout(function() {
                                        if (!isChildOf(document.activeElement, holder)) {
                                            holder.focus();
//                                             HighlightElement(holder);
                                        }
                                    }, 4);

                                    break;
                            }
                        });
                    })(cellIndex);
                        
                    row.$.binding.cells[cellIndex].__defineGetter__('name', function() {
                        return holder['.columns'][cellIndex].name;
                    });
                    
                    row.$.binding.cells[cellIndex].__defineGetter__('editable', function() {
                        return holder['.columns'][cellIndex].editable;
                    });
                    
                    row.$.binding.cells[cellIndex].__defineSetter__('width', function(intVal) {
                        row.$.binding.cells[cellIndex].style.width = (intVal || 0) + 'px';
                    });
                    
                    row.$.binding.cells[cellIndex].__defineSetter__('height', function(intVal) {
                        row.$.binding.cells[cellIndex].style.height = (intVal || 0) - 4 + 'px';
                    });
                    
                    row.$.binding.cells[cellIndex].__defineGetter__('type', function() {
                        return holder['.columns'][cellIndex].type.split('|')[0];
                    });
                    
                    row.$.binding.cells[cellIndex].__defineSetter__('type', function(str) {
                        var params = str.split('|');
                        holder['.renders'][params[0]]( row.$.binding.cells[cellIndex], row.$.cells[cellIndex], params[1], params[2] );
                    });
                    
                    row.$.binding.cells[cellIndex].__defineSetter__('align', function(str) {
                        row.$.binding.cells[cellIndex].style.textAlign = str;
                    });
                    
                    row.$.binding.cells[cellIndex].__defineSetter__('visible', function(bool) {
                        var state = !!bool;
                        row.$.binding.cells[cellIndex].style.display = state ? '' : 'none';
                    });
                    
                    row.$.binding.cells[cellIndex].tabIndex = 0;
                    
                    row.$.binding.cells[cellIndex].style.display = 
                        holder['.columns'][i].visible ? '' : 'none';
                    
                    (function(targetCell) {
                        
                        var isInfiniteRecursive = null;
                        
                        targetCell.editCell = function() {
                            
                            if (isInfiniteRecursive) return;
                            isInfiniteRecursive = true;
                            
                            if (!targetCell.editable)
                                return;
                            
                            if (typeof holder['.editors'][targetCell.type] == 'undefined')
                                throw "No editor is configured for cell type '"+targetCell.type+"', at column "+targetCell.name;
                            
                            new holder['.editors'][
                                targetCell.type
                                ](targetCell, row, holder.columnsByName[targetCell.name].validator);
                            
                            isInfiniteRecursive = false;
                        }; 
                     
                        targetCell.addEventListener(
                            'mousedown',
                            function(e) {
                                holder.focusedCellIndex = holder['.columnsByName'][targetCell.name].columnIndex;
                            },
                            true
                        );
                        
                    })(row.$.binding.cells[cellIndex]);
                })(i);
                
                row.$.binding.cells[i].width = holder['.columns'][i]._config.width;
                row.$.binding.cells[i].height= row.$.row['.height'];
                row.$.binding.cells[i].type = holder['.columns'][i]._config.type;
                row.$.binding.cells[i].align = holder['.columns'][i]._config.align;
            }
            
            row.$.binding.__defineSetter__('focusedCellIndex', function(intVal) {
                if (holder.activeCell)
                    removeStyle(holder.activeCell, 'focused');
                holder.activeCell = addStyle(row.$.binding.cells[intVal], 'focused');
                
                /* If cell is editable, we edit it ... */
                holder.activeCell.editCell();
            });
            
            row.$.binding.width   = holder['.scrollbars']['.horizontal']['.width'].scSize;
            row.$.binding.visible = row.$.row['.visible']
            row.$.binding.height  = row.$.row['.height'];
            row.$.binding.top     = row.$.row['.top'];
            row.$.binding.style.left = -holder.body.left + 'px';
            row.$.binding.primaryKey = holder['.primaryKey'];
            row.$.binding.row = row;
            row.$.binding.selectable = row.$.row['.selectable'];
            row.$.binding.selected = row.$.row['.selected'];
            
            row.$.binding.__defineSetter__('resizeable', function(bool) {
                bool = !!bool;
                if (bool == row.$.binding.display.resizeable) return;
                switch (bool) {
                    case true:
                        
                        row.$.binding.resizer = holder['.edges']['.left']._inner.appendChild(
                            $('div', 'DOM_HyperDataGrid_Row_Resizer').
                            setAttr('style', row.$.binding.display.visible ? '' : 'none')
                        );
                        
                        row.$.binding.resizer.addEventListener('mousedown', function(e){ cancelEvent(e); }, true);
                        
                        (function(d) {
                            
                            var dragDiv;
                            
                            d.onDragBegin = function() {
                                d.style.right = 'auto';
                                d.style.width = holder.offsetWidth + 'px';
                                dragDiv = holder['.edges']['.left']._inner.appendChild(
                                    $('div', 'HyperDataGrid_Resizer_Tooltip_VerticalColumn')
                                );
                                dragDiv.style.top = d.offsetTop + 10 + 'px';
                                dragDiv.innerHTML = row.$.row.top + 'px';
                            };
                            
                            d.onDragRun = function() {
                                var h = d.offsetTop - row.$.binding.handle.offsetTop;
                                row.$.row.height = h >= 0 ? h : 0;
                                dragDiv.style.top = d.offsetTop + 10 + 'px'
                                dragDiv.innerHTML = row.$.row.height+' px';
                            };
                            
                            d.onDragStop  = function() {
                                dragDiv.parentNode.removeChild(dragDiv);
                                //delete dragDiv;
                                dragDiv = undefined;
                                
                                d.style.right = '';
                                d.style.width = '';
                                
                                holder['.rows'].rowUpdatesEnabled = false;
                                
                                //Propagate the height to all selected rows ...
                                for (var i=0; i<holder['.rows'].length; i++) {
                                    if (holder['.rows'][i].$.row.selected)
                                        holder['.rows'][i].$.row.height =
                                            row.$.row.height;
                                }
                                
                                holder['.rows'].rowUpdatesEnabled = true;
                            };
                            
                            d.setAttr('dragable', '1');
                            
                            d.dragger = new dragObject(
                                d,
                                null,
                                new Position(0, 0),
                                new Position(0, 100000000),
                                d.onDragBegin,
                                d.onDragRun,
                                d.onDragStop,
                                null,
                                true
                            );

                            
                        })(row.$.binding.resizer);
                        
                        row.$.binding.resizer.style.top = 
                            row.$.binding.display.top - 
                            holder['.scrollbars']['.vertical'].scrollTop +
                            row.$.binding.display.height + 'px';
                        
                        
                        break;
                    case false:
                        
                        holder['.edges']['.left']._inner.removeChild(
                            row.$.binding.resizer
                        );
                        
                        delete row.$.binding.resizer;
                        
                        break;
                }
            });
            
            row.$.binding.resizeable = row.$.row['.resizeable'];
            
            var tagName;
            
            for (tagName in row.$.tags)
                if (row.$.tags.propertyIsEnumerable(tagName) && row.$.tags[tagName])
                    row.$.binding.handle.setTag(tagName, row.$.tags[tagName]);
            
            holder['.body'].appendChild(row.$.binding);
            holder['.bindings'].push(row.$.binding);
            
//             if (row.$.row['.index'] == holder.focusedRowIndex)
//                 row.$.binding.focusedCellIndex = holder.focusedCellIndex;
            
            return row.$.binding;
        };
        
        holder['.selection'].__defineGetter__('byColumns', function() {
            var out = [];
            for (var i=0; i<holder['.columns'].length; i++)
                if (holder['.columns'][i]._config.selected)
                    out.push(holder['.columns'][i]);
            return out;
        });
        
        holder['.selection'].__defineGetter__('byColumnsIndexes', function(){
            var out = [];
            for (var i=0; i<holder['.columns'].length; i++) {
                if (holder['.columns'][i]._config.selected)
                    out.push(i);
            }
            return out;
        });
        
        holder['.selection'].__defineSetter__('byColumnsIndexes', function(arr) {
            for (var i=0; i<holder['.columns'].length; i++)
                holder['.columns'][i].selected =
                    arr.indexOf(i) != -1;
        });
        
        holder['.selection'].__defineGetter__('byColumnsNames', function() {
            var out = [];
            for (var i=0; i<holder['.columns'].length; i++)
                if (holder['.columns'][i]._config.selected)
                    out.push(holder['.columns'][i]._config.name);
            return out;
        });
        
        holder['.selection'].__defineSetter__('byColumnsNames', function(arr) {
            for (var i=0; i<holder['.columns'].length; i++)
                holder['.columns'][i].selected =
                    arr.indexOf(holder['.columns'][i]._config.name) != -1;
        });
        
        holder['.selection'].__defineGetter__('byRows', function() {
            var out = [];
            for (var i=0; i<holder['.rows'].length; i++)
                if (holder['.rows'][i].$.row['.selected'])
                    out.push(holder['.rows'][i]);
            return out;
        });
        
        holder['.selection'].invertByRows = function() {
            for ( var i=0, len = holder['.rows'].length; i<len; i++) {
                holder['.rows'][i].$.row.selected = !holder['.rows'][i].$.row['.selected'];
            }
        }
        
        holder['.selection'].__defineGetter__('byRowsIndexes', function() {
            var out = [];
            for (var i=0; i<holder['.rows'].length; i++)
                if (holder['.rows'][i].$.row['.selected'])
                    out.push(i);
            return out;
        });
        
        holder['.selection'].__defineSetter__('byRowsIndexes', function(arr) {
            for (var i=0; i<holder['.rows'].length; i++)
                holder['.rows'][i].$.row.selected =
                    arr.indexOf(i) != -1;
        });
        
        holder['.selection'].__defineGetter__('byRowsPrimaryKeys', function() {
            var out = [];
            for (var i=0; i<holder['.rows'].length; i++)
                if (holder['.rows'][i].$.row['.selected'])
                    out.push(holder['.rows'][i].$.primaryKey);
            return out.unique();
        });
        
        holder['.selection'].__defineSetter__('byRowsPrimaryKeys', function(arr) {
            for (var i=0; i<holder['.rows'].length; i++) {
                holder['.rows'][i].$.row.selected =
                    arr.indexOf(holder['.rows'][i].$.primaryKey) != -1;
            }
        });
        
        holder['.selectable'] = false;
        
        holder.__defineGetter__('selectable', function() {
            return holder['.selectable'];
        });
        
        holder.__defineSetter__('selectable', function(bool) {
            bool = !!bool;
            if (bool === holder['.selectable'])
                return;
            holder['.selectable'] = bool;
            switch (bool) {
                case true:
                    holder['.selectedIndex'] = -1;
                    holder.__defineSetter__('selectedIndex', function(intVal) {
                        intVal = intVal || 0;
                        if (intVal < -1 || intVal >= holder['.rows'].length) 
                            throw "HyperDataGrid.selectedIndex: index out of range!";
                        holder['.selectedIndex'] = intVal;
                        holder.selection.byRowsIndexes = [ intVal ];
                        holder.onCustomEvent('selectedIndexChange');
                    });
                    holder.__defineGetter__('selectedIndex', function() {
                        return holder['.selectedIndex'];
                    });
                    break;
                case false:
                    
                    if (holder.selectedIndex != -1) {
                        holder.selectedIndex = -1;
                        holder.onCustomEvent('change');
                    }
                    
                    delete holder['.selectedIndex'];
                    delete holder.selectedIndex;
                    break;
            };
            //Propagate the selectable property to all rows...
            for (var i=0; i<holder['.rows'].length; i++)
                holder['.rows'][i].$.row.selectable = bool;
        });
        
        //BEGIN: FOCUSED CELL INDEX
        (function() {
            var focusedCellIndex = 0;
            
            holder.__defineGetter__('focusedCellIndex', function() {
                return focusedCellIndex = !holder['.columns'].length ? -1 : (
                    focusedCellIndex < 0 ? 0 : (
                        focusedCellIndex > holder['.columns'].length - 1 ? holder['.columns'].length :
                        focusedCellIndex
                    )
                );
            });
            
            holder.__defineSetter__('focusedCellIndex', function(intVal) {
                if (!holder['.columns'].length) 
                    return;
                
                var purposedCellIndex = isNaN(intVal) ? 0 : (
                    intVal < 0 ? 0 : (
                        intVal > holder['.columns'].length - 1 ?
                            holder['.columns'].length - 1 : Math.floor(intVal)
                    )
                );
                
                if (purposedCellIndex == focusedCellIndex) return;
                else focusedCellIndex = purposedCellIndex;
                    
                try {
                    holder['.rows'][
                        holder.focusedRowIndex
                    ].$.binding.focusedCellIndex = focusedCellIndex;
                } catch(e) {
                    console.warn("HyperDataGrid.focusedCellIndex: Error while applying visual cell index: "+e);
                }
            });
            
        })();
        
        //END: FOCUSED CELL INDEX
        
        //BEGIN: FOCUSED ROW INDEX
        (function() {
            var focusedRowIndex = 0;
            
            holder.__defineGetter__('focusedRowIndex', function() {
                return focusedRowIndex = !holder['.rows'].length ? -1 : (
                    focusedRowIndex < 0 ? 0 : ( 
                        focusedRowIndex > holder['.rows'].length - 1 ? holder['.rows'].length : 
                        focusedRowIndex
                    )
                );
            });
            
            holder.__defineSetter__('focusedRowIndex', function(intVal) {
                if (!holder['.rows'].length) return;
                                    
                focusedRowIndex = isNaN(intVal) ? 0 : (
                    intVal < 0 ? 0 : (
                        intVal > holder['.rows'].length - 1 ? 
                                holder['.rows'].length - 1 : Math.floor(intVal)
                    )
                );
                
                holder.onCustomEvent('change', holder['.rows'][focusedRowIndex]);

                if (!holder['.rows'][focusedRowIndex].$.binding) {
                    
                    //We scroll the viewport in order to make the row visible
                    //1) Bind Row
                    holder.bindRow(holder['.rows'][focusedRowIndex]);
                    //2) Scroll baby, scroll :)
                    if (holder['.rows'][focusedRowIndex].$.row.top < holder['.body'].top) {
                        holder['.body'].top = holder['.rows'][focusedRowIndex].$.row.top;
                    } else {
                        holder['.body'].top = holder['.rows'][focusedRowIndex].$.row.top + 
                        holder['.rows'][focusedRowIndex].$.row.height - holder['.viewport'].height;
                    }
                } else {
                    if (holder['.rows'][focusedRowIndex].$.row.top < holder.body.top)
                        holder.body.top = holder['.rows'][focusedRowIndex].$.row.top - (
                            holder['.rows'][focusedRowIndex].$.row.height < holder['.body'].offsetHeight ? 
                                ((holder.body.offsetHeight - holder['.rows'][focusedRowIndex].$.row.height) / 2) : 0
                        );
                    else
                    if (holder['.rows'][focusedRowIndex].$.row.top > holder.viewport.top + 
                            holder.viewport.height - holder['.rows'][focusedRowIndex].$.row.height)
                        holder['.body'].top = holder['.rows'][focusedRowIndex].$.row.top + 
                        holder['.rows'][focusedRowIndex].$.row.height - holder['.viewport'].height + (
                            holder['.rows'][focusedRowIndex].$.row.height < holder['.body'].offsetHeight ? 
                                ((holder.body.offsetHeight - holder['.rows'][focusedRowIndex].$.row.height) / 2) : 0
                        );
                }
                
                try {
                    removeStyle(holder['.body'].querySelectorAll('div.DOM_HyperDataGrid_Row.focused')[0], 'focused');
                } catch(ex) {}
                
                addStyle(holder['.rows'][focusedRowIndex].$.binding, 'focused');
                holder['.rows'][focusedRowIndex].$.binding.focusedCellIndex = holder.focusedCellIndex;
                
                
            });
        })();
        //END: FOCUSED ROW INDEX        
        
        //BEGIN: Keyboard module
        (function() {
            var keyboardNavigation = false;
            
            var keyboardLed = holder._bodyHolder.appendChild(
                $('div', 'DOM_HyperDataGrid_Keyboard')
            );
            
            holder.__defineGetter__('keyboardNavigation', function() {
                return keyboardNavigation;
            });
            
            holder.__defineSetter__('keyboardNavigation', function(bool) {
                if (!!bool == keyboardNavigation) return;
                keyboardNavigation = !!bool;
                (keyboardNavigation ? addStyle : removeStyle)(
                    keyboardLed, 'on'
                );
                
                switch (keyboardNavigation) {
                case true:
                    
                    Keyboard.bindKeyboardHandler(holder, 'down', function() {
                        holder.selection.byRowsIndexes = [];
                        if (!holder['.isRendering']) {
                            holder.focus();
                            holder.focusedRowIndex++;
                        }
                    });
                    
                    Keyboard.bindKeyboardHandler(holder, 'enter', function() {
                        if (!typeof(document.activeElement.noEnter)) {
                            holder.focus();
                            holder.focusedRowIndex++;
                        }
                    });
                    
                    Keyboard.bindKeyboardHandler(holder, 'up', function() {
                        holder.selection.byRowsIndexes = [];
                        if (!holder['.isRendering']) {
                            holder.focus();
                            holder.focusedRowIndex--;
                        }
                    });
                    
                    Keyboard.bindKeyboardHandler(holder, 'home', function() {
                        holder.selection.byRowsIndexes = [];
                        holder.focus();
                        holder.focusedRowIndex = 0;
                    });
                    
                    Keyboard.bindKeyboardHandler(holder, 'end', function() {
                        holder.selection.byRowsIndexes = [];
                        holder.focus();
                        holder.focusedRowIndex = holder['.rows'].length - 1;
                    });
                    
                    Keyboard.bindKeyboardHandler(holder, 'page_up', function() {
                        holder.selection.byRowsIndexes = [];
                        holder.focus();
                        holder.focusedRowIndex -= 10;
                    });
                    
                    Keyboard.bindKeyboardHandler(holder, 'page_down', function() {
                        holder.selection.byRowsIndexes = [];
                        holder.focus();
                        holder.focusedRowIndex += 10;
                    });
                    
                    Keyboard.bindKeyboardHandler(holder, 'left', function() {
                        holder.selection.byRowsIndexes = [];
                        holder.focus();
                        do {
                            holder.focusedCellIndex--;
                        } while (holder.focusedCellIndex > 0 && !holder['.columns'][holder.focusedCellIndex].visible);
                    });
                    
                    Keyboard.bindKeyboardHandler(holder, 'right', function() {
                        holder.selection.byRowsIndexes = [];
                        holder.focus();
                        do {
                            holder.focusedCellIndex++;
                        } while (!holder['.columns'][holder.focusedCellIndex].visible && 
                                 holder['.columns'].length - 1 > holder.focusedCellIndex
                        );
                    });
                    
                    break;
                    
                default:
                    Keyboard.unbindKeyboardHandlers(holder, [
                        'down', 'enter', 'up', 'home', 'end', 'page_up', 'page_down', 'left', 'right'
                    ]);
                    break;
                }
            });
            
            keyboardLed.addEventListener('click', function() {
                holder.keyboardNavigation = !holder.keyboardNavigation;
            }, false);
            
            setupTooltip(keyboardLed, 
                '<b>Keyboard Navigation (F2)</b><br />'+
                'Enables or disables navigation<br />'+
                'with the help of arrowkeys<br />'+
                'through this grid.'
            );
            
            Keyboard.bindKeyboardHandler(holder, 'tab', function() {
                //Tab does nothing ...
            });
            
        })();
        
        (function() {
            Keyboard.bindKeyboardHandler(holder, 'f2', function() {
                holder.keyboardNavigation = !holder.keyboardNavigation;
                console.warn('HyperDataGrid: Keyboard navigation is now: '+holder.keyboardNavigation);
            });

            holder.keyboardNavigation = true;
        })();
       
        disableSelection(holder);
        holder.tabIndex = 0;
        
        //END: Keyboard
        
        //BEGIN: Right-Top menu functionality
        (function() {
            holder['.menuHolder'] = holder._bodyHolder.appendChild(
                $('div', 'DOM_HyperDataGrid_Menu')
            );
            
            holder['.updateMenu'] = function() {
                holder['.menuHolder'].innerHTML = '';
                var bar = [
                    {
                        'caption': ' ',
                        'items': [
                            
                        ]
                    }
                ];
                
                for (var i=0; i<holder['.columns'].length; i++) {
                    bar[0].items.push({
                        'caption': holder['.columns'][i].caption,
                        'icon': 'jsplatform/img/hyperdatagrid/table_column-16x16.png',
                        'items': (function(name) {
                            return [
                                {
                                    'caption': 'Visible',
                                    'input'  : 'checkbox',
                                    'icon'   : 'jsplatform/img/hyperdatagrid/table_column_visible-16x16.png',
                                    'checked': holder.columnsByName[name].visible,
                                    'id'     : 'dummy',
                                    'handler': function(value) {
                                        holder.columnsByName[name].visible = value;
                                    }
                                }
                            ];
                        })(holder['.columns'][i].name)
                    });
                }
                
                bar[0].items.push(null);
                bar[0].items.push({
                    'caption': 'Sort...',
                    'icon'   : 'jsplatform/img/hyperdatagrid/table_sort-16x16.png',
                    'handler' : function() {
                        new DOM__HyperDataGrid__Sorter(holder);
                    }
                });
                
                bar[0].items.push(null);
                bar[0].items.push({
                    'caption': 'Export',
                    'icon': 'jsplatform/img/hyperdatagrid/TAG_saved-16x16.png',
                    'handler': function() {
                        new DOM__HyperDataGrid__Exporter(holder);
                    }
                });
                
                holder['.menuHolder'].appendChild(
                    new MenuBar(bar)
                );
            };

            holder['.updateMenu']();

        })();
        
        //END: Right-Top menu functionality
        
        //BEGIN GRID TAGS
        
        (function() {
            var tags = {};
            
            holder.__defineGetter__('tags', function() {
                return tags;
            });
            
            holder.__defineSetter__('tags', function(arr) {
                
                if (!(arr instanceof Array))
                    throw "HyperDataGrid.tags: Expected an array as value";
                
                var out = {};
                
                for (var i=0; i<arr.length; i++) {
                    if (typeof arr[i] != 'string')
                        throw "HyperDataGrid.tags["+i+"]: expected string!";
                    
                    if (!/^[a-z0-9\-\_\.]+$/.test(arr[i]))
                        throw "HyperDataGrid.tags["+i+"]: Invalid tag name!";
                    
                    
                    out[arr[i]] = true;
                }
                
                tags = {};
                
                var index = 0;
                
                for (var i in out) {
                    if (out.propertyIsEnumerable(i))
                        tags[i] = {
                            'className': 'HyperDataGrid_TAG_'+i,
                            'left'     : (20 * index++).toString() + 'px'
                        };
                }
                
                holder['.edges']['.left'].width = 50 + index * 20;
                
                //Propagate newly created tags to all existing rows ...
                
                for (var i = 0; i<holder['.rows'].length; i++)
                    holder['.rows'].setPossibleRowTags(holder['.rows'][i], tags, true);
                
                //Refresh viewport ...
                for (var i=holder['.bindings'].length - 1; i>=0; i--)
                    holder.unbindRow(i, true);
                
                holder.onViewportChange();
            });
        })();
        
        //END GRID TAGS

        setTimeout(function() { holder.focus(); }, 2);
        return holder;
}