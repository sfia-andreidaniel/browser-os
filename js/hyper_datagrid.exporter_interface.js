function DOM__HyperDataGrid__Exporter(grid) {
    var dlg = new Dialog({
        'width': 500,
        'height': 400,
        'caption': 'Export Grid',
        'modal': true
    });
    
    dlg.props = dlg.insert(
        (new PropertyGrid([
            {
                'name': 'selection',
                'label': 'What to export',
                'type': 'dropdown',
                'values': [
                    {
                        'id': 'all',
                        'name': 'All Rows'
                    },
                    {
                        'id': 'selection',
                        'name': 'Selection'
                    },
                    {
                        'id': 'rows',
                        'name': 'Rows'
                    }
                ],
                'value': 'all'
            },
            {
                'name': 'rows',
                'type': 'varchar',
                'value': '',
                'label': 'Rows',
                'placeholder': "e.g.: 1, 2-4, 7, 9"
            },
            {
                'name': 'format',
                'label': 'Format',
                'type': 'dropdown',
                'values': [
                    {
                        'id': 'xls',
                        'name': 'XLS - Microsoft ® Excel'
                    },
                    {
                        'id': 'pdf',
                        'name': 'PDF - Portable Document Format'
                    },
                    {
                        'id': 'csv',
                        'name': 'CSV - Comma Sepparated Values'
                    }
                ],
                'value': 'xls'
            },
            {
                'name': 'name',
                'type': 'varchar',
                'value': '',
                'label': 'Document Name',
                'placeholder': "e.g.: My File (do not use extension)"
            },
            {
                'name': 'style',
                'expanded': false,
                'label': 'Formatting (only for XLS and PDF)',
                'items': [
                    {
                        'name': 'fontFamily',
                        'type': 'dropdown',
                        'label': 'Font Family',
                        'values': [
                            {
                                'id': 'arial',
                                'name': 'Arial'
                            },
                            {
                                'id': 'courier',
                                'name': 'Courier'
                            },
                            {
                                'id': 'times new roman',
                                'name': 'Times New Roman'
                            },
                            {
                                'id': 'verdana',
                                'name': 'Verdana'
                            }
                        ],
                        'value': 'arial'
                    },
                    {
                        'name': 'fontSize',
                        'label': 'Font Size',
                        'type': 'int',
                        'min': 4,
                        'max': 72,
                        'value': 12
                    }
                ]
            },
            {
                'name': 'pdf',
                'label': 'PDF Options',
                'expanded': false,
                'items': [
                    {
                        'name': 'pageSize',
                        'label': 'Page Size',
                        'type': 'dropdown',
                        'values': [
                            {
                                'id': 'A6',
                                'name': 'A6'
                            },
                            {
                                'id': 'A5',
                                'name': 'A5'
                            },
                            {
                                'id': 'A4',
                                'name': 'A4'
                            },
                            {
                                'id': 'A3',
                                'name': 'A3'
                            },
                            {
                                'id': 'A2',
                                'name': 'A2'
                            },
                            {
                                'id': 'A1',
                                'name': 'A1'
                            },
                            {
                                'id': 'A0',
                                'name': 'A0'
                            }
                        ],
                        'value': 'A4'
                    },
                    {
                        'name': 'pageOrientation',
                        'label': 'Page Orientation',
                        'type': 'dropdown',
                        'values': [
                            {
                                'id': 'portrait',
                                'name': 'Portrait'
                            },
                            {
                                'id': 'landscape',
                                'name': 'Landscape'
                            }
                        ],
                        'value': 'portrait'
                    },
                    {
                        'name': 'marginLeft',
                        'label': 'Margin Left',
                        'value': '',
                        'type': 'varchar',
                        'placeholder': 'e.g.: 1.5cm',
                        'regexp': /^([0-9]+(px|cm|mm|inch))?$/
                    },
                    {
                        'name': 'marginRight',
                        'label': 'Margin Right',
                        'value': '',
                        'type': 'varchar',
                        'placeholder': 'e.g.: 1.5cm',
                        'regexp': /^([0-9]+(px|cm|mm|inch))?$/
                    },
                    {
                        'name': 'marginTop',
                        'label': 'Margin Top',
                        'value': '',
                        'type': 'varchar',
                        'placeholder': 'e.g.: 1.5cm',
                        'regexp': /^([0-9]+(px|cm|mm|inch))?$/
                    },
                    {
                        'name': 'marginBottom',
                        'label': 'Margin Bottom',
                        'value': '',
                        'type': 'varchar',
                        'placeholder': 'e.g.: 1.5cm',
                        'regexp': /^([0-9]+(px|cm|mm|inch))?$/
                    }
                ]
            },
            {
                'name': 'csv',
                'expanded': false,
                'label': 'CSV Options',
                'items': [
                    {
                        'name': 'fieldDelimiter',
                        'type': 'varchar',
                        'value': '',
                        'placeholder': 'e.g.: "',
                        'label': 'Field Delimiter'
                    },
                    {
                        'name': 'fieldSeparator',
                        'type': 'varchar',
                        'value': '',
                        'placeholder': 'e.g.: \\t',
                        'label': 'Field Separator'
                    },
                    {
                        'name': 'lineSeparator',
                        'type': 'varchar',
                        'value': '',
                        'placeholder': 'e.g.: \\r\\n (windows), \\n (unix, default)',
                        'label': 'Line Separator'
                    },
                    {
                        'name': 'columnNames',
                        'type': 'dropdown',
                        'label': 'Column Options',
                        'values': [
                            {
                                'id': 'names',
                                'name': 'Export Names'
                            },
                            {
                                'id': 'captions',
                                'name': 'Export Caption'
                            },
                            {
                                'id': '',
                                'name': 'Do not export columns'
                            }
                        ],
                        'value': 'names'
                    },
                    {
                        'name': 'encoding',
                        'type': 'dropdown',
                        'label': 'Text Encoding',
                        'values': [
                            {
                                'id': 'utf8',
                                'name': 'UTF-8'
                            }
                        ],
                        'value': 'utf8'
                    }
                ]
            }
        ]))
        .setAnchors({
        'width': function(w,h) {
            return w + 'px';
        },
        'height': function(w,h) {
            return h - 45 + 'px';
        }
    }).setAttr(
        'style', 'display: block; margin-bottom: 5px; margin-top: 5px'
    ));
    
    dlg.insert((new Button('Export', function() {
        dlg.doExport();
    })));
    
    dlg.onFormatChange = function(strFormatValue) {
        dlg.props.groups[0].expanded = ['xls', 'pdf'].indexOf(strFormatValue) != -1;
        dlg.props.groups[1].expanded = ['pdf'].indexOf(strFormatValue) != -1;
        dlg.props.groups[2].expanded = ['csv'].indexOf(strFormatValue) != -1;
    }
    
    dlg.onFormatChange('xls');
    
    dlg.props.inputs.format.addEventListener('change', function(e) {
        dlg.onFormatChange(dlg.props.values.format);
        dlg.props.splitPosition = dlg.props.splitPosition;
    }, true);
    
    dlg.props.splitPosition = 150;
    
    dlg.doExport = function() {
        
    }
    
    dlg.paint();
    
    //window.ex = dlg;
    
    return dlg;
}