function DOM__HyperDataGrid__Sorter(grid) {
    if (typeof grid['.hgSorter'] != 'undefined') {
        grid['.hgSorter'].childOf = grid._bodyHolder;
        return grid['.hgSorter'];
    }
    
    grid['.hgSorter'] = dlg = new Dialog({
        'width': 350,
        'height': grid.offsetHeight - 100 < 200 ? 200 : grid.offsetHeight - 100,
        'childOf': grid._bodyHolder,
        'caption': 'Sort Grid',
        'minimizeable': false,
        'maximizeable': false,
        'minHeight': 150,
        'appIcon': 'jsplatform/img/hyperdatagrid/table_sort-16x16.png'
    });
    
    dlg.ovr = dlg.insert(
        $('div', 'HyperDataGrid_TSortableHolder')
    );
    
    dlg.insert($('div').setHTML(
        'Use the following sort options to customise your view'
    ).setAttr(
        'style', 'position: absolute; left: 5px; top: 5px; right: 5px; height: 30px; overflow: hidden; display: block'
    ));
    
    dlg.sortOptions = [];
    
    dlg.getAvailableColumns = function() {
        var out = [];
        
        for (var i=0; i<grid.columns.length; i++) {
            out.push({
                'id': grid.columns[i].name,
                'name': grid.columns[i].caption
            });
        }
//         console.log(out);
        return out;
    };
    
    dlg.createSortOption = function(columnsList) {
        var d = $('div');
        
        d.cmbColumnName = d.appendChild(
            (new DropDown()).
            setItems(columnsList)
        );
        
        d.cmbSortOrder  = d.appendChild(
            (new DropDown()).setItems([
                {
                    'id': '1',
                    'name': 'ASC'
                },
                {
                    'id': '-1',
                    'name': 'DESC'
                }
            ])
        );
        
        addStyle(d.cmbColumnName, 'columnName');
        addStyle(d.cmbSortOrder,  'sortOrder');
        
        d.__defineGetter__('columnName', function() {
            return d.cmbColumnName.selectedIndex <= 0 ? null: d.cmbColumnName.value;
        })
        
        d.__defineGetter__('sortOrder', function() {
            return d.cmbSortOrder.value;
        });
        
        d.prevValue = '';
        
        d.cmbColumnName.addEventListener('change', function(e) {
            if (d.columnName) {
                for (var i=0; i<dlg.sortOptions.length; i++) {
                    if (dlg.sortOptions[i] != d &&
                        d.columnName &&
                        d.columnName == dlg.sortOptions[i].columnName
                    ) {
                        HighlightElement(dlg.sortOptions[i]);
                        HighlightElement(d);
                        d.cmbColumnName.value = d.prevValue;
                        return;
                    }
                }
                d.prevValue = d.columnName;
            }
        }, true);
        
        d.deleteMyself = function() {
            for (var i=0; i<dlg.sortOptions.length; i++) {
                if (dlg.sortOptions[i] == d) {
                    dlg.sortOptions.splice(i, 1);
                    d.parentNode.removeChild(d);
                    return;
                }
            }
        };
        
        d.appendChild(
            $('img').
            setAttr('src', 'jsplatform/img/hyperdatagrid/remove-16x16.png')
        ).addEventListener('click', d.deleteMyself, true);
        
        return d;
    };
    
    dlg.more = dlg.insert(
        (new Button('<img src="jsplatform/img/hyperdatagrid/add-16x16.png" style="border: none" />', function() {
            dlg.addMore();
        })).
        setAttr(
            'style', 'display: block; bottom: 5px; left: 5px; height: 25px; position: absolute;'
        )
    );
        
    
    dlg.addMore = function() {
        var opts = dlg.getAvailableColumns();
        opts.splice(0, 0, {
            'id': '',
            'name': '- Choose -'
        });
        dlg.sortOptions.push(
            opts = dlg.ovr.appendChild(
                dlg.createSortOption(
                    opts
                ),
                dlg.more
            )
        );
        
        dlg.ovr.scrollTop = 100000;
        
        return opts;
    };
    
    dlg.getSortFilters = function() {
        var out = [];
        for (var i=0; i<dlg.sortOptions.length; i++) {
            if (dlg.sortOptions[i].columnName) {
                out.push({
                    'name': dlg.sortOptions[i].columnName,
                    'order': parseInt(dlg.sortOptions[i].sortOrder)
                });
            }
        }
        return out;
    }
    
    dlg.insert(
        (new Button('Ok', function() {
            grid.sortFilters = dlg.getSortFilters();
            dlg.close();
        })).setAttr(
            'style', 'position: absolute; right: 5px; bottom: 5px; height: 25px; width: 90px;'
        )
    );
    
    dlg.closeCallback = function() {
        delete grid['.hgSorter'];
        //delete dlg;
        dlg = undefined;
        return true;
    }
    
    var added = false;
    
    (function() {
        var more;
        for (var i=0; i<grid.sortFilters.length; i++) {
            more = dlg.addMore();
            more.cmbColumnName.value = grid.sortFilters[i].name;
            more.cmbSortOrder.value = grid.sortFilters[i].order.toString();
            added = true;
        }
    })();
    
    if (!added)
        dlg.addMore();
}

