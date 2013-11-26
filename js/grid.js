
function RenderText(htmlElement, value) {
    htmlElement.innerHTML = '';
    htmlElement.appendChild(document.createTextNode(value === null ? '[NULL]' : (value == '' ? ' ' : value)));
}

function DataRow() {
    var row = $('div');
    row.cells = [];
    
    row._selected = false;
    row._selectable = false;
    row._top = 0;
    row._parent = false;
    row._visible= false;
    
    row.__defineGetter__('selected', function() {
        return row._selected;
    });
    
    row.__defineSetter__('selected', function(bool) {
        switch (bool) {
            case true:
            case 1: {
                row._selected = true;
                addStyle(row, 'DOMRowSelected');
                
                try { 
                    row._parent.parentNode.parentNode.selectedIndex = row.rowIndex;
                } catch(e) {
                    //console.log(e);
                }
                
                break;
            }
            case false:
            case 0: {
                row._selected = false;
                removeStyle(row, 'DOMRowSelected');
                break;
            }
            default: throw 'DOMRow.property.selected: Invalid value ('+bool+')';
        }
    });
    
    row._selectHandler = function(e) {
        if (!row._parent.parentNode.parentNode.multiple) row.selected = true;
        else {
            if (e.ctrlKey) row.selected = !row.selected;
            else { 
                row._parent.parentNode.parentNode.multiple = false;
                row.selected = true;
                row._parent.parentNode.parentNode.multiple = true;
            }
        }
    };
    
    row.__defineGetter__('selectable', function() { return row._selectable; });
    row.__defineSetter__('selectable', function(bool) {
        switch (bool) {
            case true:
            case 1: {
                //console.log('attach_event');
                if (!row._selectable) row.addEventListener('click', row._selectHandler, true);
                row._selectable = true;
                break;
            }
            case false:
            case 0: {
                if (row._selectable) row.removeEventListener('click', row._selectHandler, true);
                row._selectable = false;
                break;
            }
            default: throw 'DataGridRow: invalid value for selectable property ('+bool+')';
                     break;
        }
    });
    
    row.insertCell = function(cellIndex) {
        var cell = $('div');
        cell.className = 'DOMCell';
        
        if ((typeof(cellIndex) == 'undefined') || (row.cells.length == 0) || (cellIndex >= row.cells.length)) { 
            
            cell.cellIndex = this.cells.length;
            row.cells.push(cell); 
        } else {
            
            row.cells.splice(cellIndex, 0, cell);
            for (var i=cellIndex; i<row.cells[cellIndex].length; i++) {
                row.cells[i].cellIndex = i;
            }
        }
        
        cell._renderer = RenderText;
        
        cell._value = null;
        cell._visible = true;
        
        cell.html = $('div');
        cell.html.className = 'DOMCellHTML';
        cell.appendChild(cell.html);
        cell.isEditing = false;
        cell.editor = false;
        cell._editable = false;
        
        cell.__defineGetter__('value',   function() { return this._value; });
        cell.__defineSetter__('value',   function(v){ this._value = v; this._renderer(this.html, v); });
        cell.__defineGetter__('visible', function() { return this._visible; });
        cell.__defineSetter__('visible', function(bool) { this._visible = bool; this.style.display = bool ? '' : 'none'; } );
        cell.__defineGetter__('render',  function(){ return this._renderer; });
        cell.__defineSetter__('render',  function(r){ this._renderer = r; this._renderer(this.html,this._value) });
        cell.__defineSetter__('width',   function(w){ this.html.style.width = w; });
        cell.__defineGetter__('grid',    function() { return this.parentNode.parentNode.parentNode.parentNode; });
        cell.__defineGetter__('row',     function() { return this.parentNode; });
        cell.__defineSetter__('editable',function(v) { this._editable = v; if (this._editable === true) this.tabIndex = 0; });
        cell.__defineGetter__('editable',function()  { return this._editable; });
        
        cell.refresh = function() {
            this.isEditing = false;
            this._renderer(this.html, this._value);
        };
        
        cell.onfocus = function() {
        
            if (this._editable === false) return;
        
            try {
            var xy;
            if (this.parentNode.rowIndex === null) xy = ''; else
            xy = (this.cellIndex+1) + ','+(this.parentNode.rowIndex + 1);
            this.grid.cellXY.innerHTML = '';
            this.grid.cellXY.appendChild(document.createTextNode(xy));
            } catch(ex) {}
        };
        
        cell.onblur = function() {
            try {
            this.grid.cellXY.innerHTML = '';
            } catch(ex) {}
        };
        
        cell.edit = function() {
            if (this._editable === false) return;
            if (this.row.primaryKey === null) return;
            if (this.editor = this.grid.createEditor(this)) this.isEditing = true;
        };
        
        cell.ondblclick = function(e) {
            if (!this.isEditing && this._editable && this.row.primaryKey) { 
                this.edit();
                cancelEvent(e);
            }
        };
        
        cell.validate = function(aValue) {
            return this.grid.update(this.grid.getColumnName(this.cellIndex), this.row.primaryKey, aValue);
        };
        
        return cell;
    };
    
    row.className = 'DOMRow';
    
    row.enableResizing = function(colIndex, targetGrid) {
        var hdl;
        hdl = $('div');
        hdl.className = 'DOMCellResize';
        hdl.setAttribute('dragable', '1');
        row.cells[colIndex].resizer = hdl;
        row.cells[colIndex].targetGrid = targetGrid;
        row.cells[colIndex].html.appendChild(hdl);
        row.cells[colIndex].resizer.cellIndex = colIndex;
        
        cell = row.cells[colIndex];
        
        hdl.onclick = function(e) {
            cancelEvent(e);
        };
        
        hdl.ondblclick = function(e) {
            cancelEvent(e);
            this.parentNode.parentNode.targetGrid.setAutoColumnWidth(this.cellIndex);
        };
        
        cell.onColResize = function(evt, resizer) {
            if (resizer.offsetLeft < 2) {
                resizer.style.left = '2px';
                return;
            }
            resizer.parentNode.parentNode.targetGrid.setColumnWidth(
                resizer.cellIndex, resizer.offsetLeft+3
            );
        };
        
        row.cells[colIndex].resizeObject = new dragObject(
            row.cells[colIndex].resizer, null, new Position(0, 0), new Position(1000, 0), null, 
            row.cells[colIndex].onColResize, null, null, true
        );
    };

    row.rowIndex = null;
    row.primaryKey = null;

    row.deleteRow = function() {
        if (row.parentNode.parentNode.parentNode.delrow(row.primaryKey ? row.primaryKey : row.rowIndex))
        row.parentNode.parentNode.parentNode.deleteRow(row.rowIndex);
    };
    
    row.addContextMenu([
        {'caption': 'Delete', 'handler': row.deleteRow}
    ], function(e) {
        if (!!row.parentNode.parentNode.hasContextMenu ) {
            if ( row.parentNode.parentNode.parentNode.selectable )
                row.parentNode.parentNode.parentNode.selectedIndex = row.rowIndex;
            return true;
        } else return false;
    });
    
    row.__defineSetter__('top',   function(w){ this._top = w; this.style.top = w+'px'; });
    row.__defineGetter__('top',    function() { return this._top; });
    
    row.__defineSetter__('parent',  function(div) { 
        this._parent = div; 
    });
    row.__defineSetter__('visible', function(bool) { 
       
       if (bool === true) {
        if (this._visible === true) return;
        for (var i=0; i<this.cells.length; i++) {
            this.appendChild(this.cells[i]);
        }
        this._parent.appendChild(this); 
        this._visible = true; 
       } else 
       
       
       if (this._visible === true) {
        for (var i=0; i<this.cells.length; i++) {
            this.removeChild(this.cells[i]);
        }
        try {
        this._parent.removeChild(this);
        } catch(e) {}

        this._visible = false; 
       }
       
    });
    
    row.__defineGetter__('visible', function() { return this._visible; });
    
    row.__defineGetter__('value', function() {
        var arr = [];
        for (var i=0; i<row.cells.length; i++) {
            arr.push(row.cells[i].value);
        }
        return arr;
    });

    return row;
};

function CellTextEditor(cell) {
    var ctl = $('input');
    ctl.style.backgroundColor = 'white';
    ctl.style.color = 'black';
    cell.style.backgroundColor = '#668';
    
    ctl.className = 'TextEditor';
    cell.html.innerHTML = ' ';
    cell.html.appendChild(ctl);
    
    ctl.value = cell.value === null ? '' : cell.value;
    ctl.focus();
    
    ctl.cell = cell;
    
    ctl.cellBlur = cell.onblur;
    
    ctl.onblur = function() {
        this.cell.isEditing = false;
        if (this.value != this.cell.value) {
            if (!this.cell.validate(this.value)) this.cell.refresh();
            else this.cell.value = this.value;
        } else this.cell.refresh();
        this.cell.onblur = this.cellBlur;
        this.cell.style.backgroundColor = '';
        this.cell.style.color = '';
        if (this.cellBlur) this.cell.onblur();
    };
    
    return this;
}

function DataGrid() {
    var holder = $('div'); holder.className = 'DOMGrid';
    
    var thead   = $('div'); thead.className   = 'DOMThead';
    var tbody   = $('div'); tbody.className   = 'DOMTbody';
    var tfoot   = $('div'); tfoot.className   = 'DOMTfoot';
    var tholder = $('div'); tholder.className = 'DOMRowsHolder';
    
    tbody.hasContextMenu = true;
    
    holder._selectable = false;
    holder._multiple = false;
    
    holder.__defineGetter__('selectable', function() { return holder._selectable; });
    holder.__defineSetter__('selectable', function(bool) {
        for (var i=0; i<holder.tbody.rows.length; i++) {
            holder.tbody.rows[i].selectable = bool;
        }
        holder._selectable = bool;
    });
    
    holder.__defineGetter__('multiple', function() { return holder._multiple; });
    holder.__defineSetter__('multiple', function(bool) { holder._multiple = bool ? true : false; });
    
    holder._selectedIndex = -1;
    holder._inLoop = false;
    
    holder.__defineGetter__('selectedIndex', function() { return holder._selectedIndex; });
    holder.__defineSetter__('selectedIndex', function(intVal) {
        if (holder._inLoop == true) return;
        if (intVal<-1 || intVal>holder.tbody.rows.length-1) throw 'DataGrid: invalid selectedIndex ('+intVal+')';
        holder._inLoop = true;
        for (var i=0; i<holder.tbody.rows.length; i++) {
            if (i == intVal) {
                if (!holder._multiple) holder.tbody.rows[i].selected = true;
            } else {
                if (!holder._multiple) holder.tbody.rows[i].selected = false;
            }
        }
        holder._inLoop = false;
        holder._selectedIndex = intVal;
    });
    
    holder.__defineGetter__('options', function() {
        return holder.tbody.rows;
    });
    
    holder.__defineSetter__('options', function(s) {
        throw 'You tried to modify a read-only property!';
    });
    
    holder.cellXY = $('div', 'DOMGridStatusXY');  holder.cellXY.title = 'Current focused cell';
    tfoot.appendChild(holder.cellXY);
    
    holder.colWidths = false;
    holder.sortFuncs = [];
    
    holder.currentSortOrder = 1;
    holder.currentSortColumn = false;
    
    thead.rows = [];
    tbody.rows = [];
    
    holder.appendChild(thead);
    holder.appendChild(tbody);
    holder.appendChild(tfoot);
    
    holder.thead = thead;
    holder.tbody = tbody;
    holder.tfoot = tfoot;
    holder.tholder= tholder;
    holder.tbody.appendChild(tholder);
    
    holder.tholder.noResize = true;
    
    
    holder.StringSorter = function(a, b) {
        if (a.value == b.value) return 0;
        if (a.value > b.value) return 1;
        return -1;
    };

    holder.NumericSorter = function(a,b) {
        if (a.value === b.value) return 0;
        if (a.value === null) return 1;
        if (b.value === null) return -1;
        aa = parseFloat(a.value.replace(/[^0-9.-]/g,''));
        if (isNaN(aa)) aa = 0;
        bb = parseFloat(b.value.replace(/[^0-9.-]/g,'')); 
        if (isNaN(bb)) bb = 0;
        return aa - bb;
    };
    
    holder.BoolSorter = function(a,b) {
        return (a.value && b.value) ? 0 : ( a.value ? 1 : -1 );
    };
    
    holder.th = function() {
        var row = new DataRow();
        row.parent = thead;
        
        if (arguments.length > 0) {
            if (arguments[0] instanceof Array) {
                for (var i=0; i<arguments[0].length; i++) {
                    row.insertCell().setAttr('title', arguments[0][i]).value = arguments[0][i];
                }
            } else {
                for (var i=0; i<arguments.length; i++) {
                    row.insertCell().setAttr('title', arguments[i]).value = arguments[i];
                }
            }
            
            row.visible = true;
            row.appendChild($('div')).setAttr('class', 'DOMHeaderPreserveScroll').innerHTML = '&nbsp;';

            if (holder.colWidths !== false) {
                try {
                    for (var i=0; i<row.cells.length; i++) {
                        row.cells[i].width = holder.colWidths[i]+'px';
                    }
                } catch(ex) { throw 'DataGrid: Error setting columns widths: '+ex; }
            }

        }

        thead.rows.push(row);
        
        thead.appendChild(row);

        if (holder.sortFuncs.length < row.cells.length) {
            for (var i=0; i<row.cells.length; i++) {
                holder.sortFuncs.push(false);
            }
        }
        
        return row;
    };
    
    holder.insertRow = function(rowIndex) {
        var row = new DataRow();
        row.parent = tholder;
        if ((typeof(rowIndex) == 'undefined') || (tbody.rows.length == 0) || (rowIndex >= tbody.rows.length)) { 
            row.rowIndex = tbody.rows.length;
            row.top = tbody.rows.length * 21;
            tbody.rows.push(row);
        } else {
            tbody.rows.splice(rowIndex, 0, row);
            for (var i=rowIndex; i<tbody.rows.length; i++) {
                tbody.rows[i].rowIndex = i;
                tbody.rows[i].top = i * 21;
            }
        }
        
        tholder.style.height = tbody.rows.length * 21 + 'px';
        
        return row;
    };
    
    holder.deleteRow = function(rowIndex) {
        if ((rowIndex < 0) || (rowIndex > tbody.rows.length - 1))
            throw 'DataGrid::deleteRow('+rowIndex+'):: Index out of bounds';
        tbody.rows[rowIndex].visible = false;
        tbody.rows.splice(rowIndex,1);
        for (var i=rowIndex; i < tbody.rows.length; i++) {
            tbody.rows[i].rowIndex = i;
            tbody.rows[i].top = i * 21;
        }
        holder.selectedIndex = -1;
        holder.render();
    };
    
    holder.render = function() {
    
        var rstart = tbody.scrollTop;
        var rstop  = rstart + tbody.offsetHeight;
        var show_start = Math.floor(rstart / 21);
        var show_stop  = Math.ceil((rstop - rstart) / 21) + show_start;
        
        //var odd = true;
        
        for (var i=show_start; i<Math.min(show_stop, tbody.rows.length); i++) {
            tbody.rows[i].visible = true;
            //(odd ? addStyle : removeStyle)(tbody.rows[i], 'gridOddRow');
            //odd = !odd;
        }
        
        for (var i=0; i < show_start; i++) if (tbody.rows[i]._visible) tbody.rows[i].visible = false;
        for (var i= show_stop+1; i<tbody.rows.length; i++) if (tbody.rows[i]._visible) tbody.rows[i].visible = false;
        
    };
    
    tbody.onscroll = function() {
        thead.scrollLeft = this.scrollLeft;
        holder.render();
    };
    
    holder.tr = function() {
        var row = holder.insertRow();
        row.selectable = holder.selectable;
        //console.log('send '+holder.selectable);
        
        if (arguments.length > 0) {
            if (arguments[0] instanceof Array) {
                for (var i=0; i<arguments[0].length; i++) {
                    row.insertCell().value = arguments[0][i];
                }
            } else {
                for (var i=0; i<arguments.length; i++) {
                    row.insertCell().value = arguments[i];
                }
            }
            
            if (holder.colWidths !== false) {
                try {
                    for (var i=0; i<row.cells.length; i++) {
                        row.cells[i].width = holder.colWidths[i]+'px';
                    }
                } catch(ex) { throw 'DataGrid: Error setting columns widths: '+ex; }
            }
        }
        return row;
    };
    
    holder.orderRows = function(rowsOrder) {
        var nrows = []
        for (var i=0; i<tbody.rows.length; i++) {
            tbody.rows[rowsOrder[i]].top = i*21;
            nrows.push(tbody.rows[rowsOrder[i]]);
            nrows[i].rowIndex = i;
        }
        tbody.rows = nrows;
        this.render();
    };
    
    holder.sortColumn = function(colIndex, sortOrder) {
    
        var sorder;
    
        if (typeof(sortOrder) == 'undefined') {
            if (colIndex == holder.currentSortColumn) {
                sorder = 1 - holder.currentSortOrder;
            } else sorder = 0;
        } else sorder = sortOrder;
        
        holder.currentSortColumn = colIndex;
        holder.currentSortOrder  = sorder;
        
        for (var i=0; i < holder.thead.rows[0].cells.length; i++) {
            thead.rows[0].cells[i].sort_sign.className = 
            (i != colIndex ? 'sorter' : (sorder == 0 ? 'sorter DOMSortAscending' : 'sorter DOMSortDescending') )
        }
        
        if (tbody.rows.length < 2) return;
        
        var autoGuessSorter = false;
        var guessSorterType = holder.NumericSorter;
        
        if (!holder.sortFuncs[colIndex]) {
//             alert('I will guess the column type!');
            autoGuessSorter = true;
        }
        
        var values = []; 
        var v;
        
        for (var i=0; i<tbody.rows.length; i++) {
            v = tbody.rows[i].cells[colIndex].value;
            
            if (autoGuessSorter && v !== null && !v.toString().isDecimal()) {
                autoGuessSorter = false;
                holder.sortFuncs[colIndex] = holder.StringSorter;
            }
            
            values.push({
                ind: i,
                value: (v === null ? '' : v.toString().toUpperCase())
            });
        }
        
        if (autoGuessSorter) holder.sortFuncs[colIndex] = guessSorterType;
        
        values.sort(holder.sortFuncs[colIndex]);
        
        if (sorder == 1) values = values.reverse();
        
        var orders = [];
        
        for (var i=0; i<values.length; i++) { orders.push(values[i].ind); }
        
        holder.orderRows(orders);
        
    };
    
    holder.enableSorting = function() {
        var sorter;
        for (var i=0; i<thead.rows[0].cells.length; i++) {
            sorter = $('div');
            sorter.className = 'sorter';
            disableSelection(thead.rows[0].cells[i]);
            thead.rows[0].cells[i].html.appendChild(sorter);
            thead.rows[0].cells[i].sort_sign = sorter;
            thead.rows[0].cells[i].onclick = function() {
                holder.sortColumn(this.cellIndex);
            };
        }
    };
    
    holder.updateColumnWidths = function() {
        holder.colWidths = [];
        for (var i=0; i<thead.rows[0].cells.length; i++) {
            holder.colWidths.push(thead.rows[0].cells[i].html.offsetWidth);
        }
    };
    
    holder.setColumnWidth = function(colIndex, width) {
        for (var i=0; i<thead.rows.length; i++) {
            thead.rows[i].cells[colIndex].width = width+'px';
        }
        for (var i=0; i<tbody.rows.length; i++) {
            tbody.rows[i].cells[colIndex].width = width+'px';
        }
        holder.updateColumnWidths();
    };
    
    holder.setAutoColumnWidth = function(colIndex) {
        var maxWidth = 10;
        for (var i=0; i<tbody.rows.length; i++) {
            tbody.rows[i].cells[colIndex].width = 'auto';
            if (maxWidth < tbody.rows[i].cells[colIndex].html.offsetWidth) {
                maxWidth = tbody.rows[i].cells[colIndex].html.offsetWidth;
            }
        }
        holder.setColumnWidth(colIndex, maxWidth);
        for (var i=0; i<thead.rows[0].cells.length; i++) {
            thead.rows[0].cells[i].resizer.style.left = '';
        }
    };
    
    holder.enableResizing = function() {
        if (this.thead.rows.length == 0) return;
        for (var i=0; i<holder.thead.rows[0].cells.length; i++) {
            holder.thead.rows[0].enableResizing(i, this);
        }
    };
    
    holder.clear = function() {
        tholder.innerHTML = '';
        tbody.rows = [];
        tholder.style.height = '0px';
        holder.render();
        holder.selectedIndex = -1;
    };
    
    holder.getColumnName = function(colIndex) {
        return thead.rows[0].cells[colIndex].value;
    };
    
    holder.createEditor = function(cell) {
        return new CellTextEditor(cell);
    };
    
    holder.delrow = function(rowIndex) {
        try { console.log('Debug: DataGrid.delrow - You should define the DataGrid.delrow property of this grid!'); } catch(ex) {}
        return true;
    };
    
    holder.update = function(colName, primaryKey, newValue) {
        try { console.log('Debug: DataGrid.update - You should define the DataGrid.update property of this grid!'); } catch(ex) {}
        return false;
    };
    
    holder.thead.noResize = true;
    holder.tbody.noResize = true;
    holder.tfoot.noResize = true;
    
    holder.tbody.DOManchors = {
		'__dummy': function(w,h) {
			holder.render();
			return '';
		}
	};
    
    
    return holder;
}
