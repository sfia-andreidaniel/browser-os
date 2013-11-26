function DocumentEditor_interface_css( app ) {

    var pid;

    ( new JSIde_ApplicationCSS( [
        
        '.DomDialogToolbar {',
        '    overflow: visible; clear: both;',
        '}',

        
        '.DomDialogToolbar > div.group {',
        '    float: left;',
        '    height: 20px;',
        '    display: none;',
        '    background-color: #353535;',
        '    padding: 2px;',
        '    margin: 2px 6px 2px -2px;',
        '    position: relative;',
        '    white-space: nowrap',
        '}',

        '.DomDialogToolbar > div.group:hover {',
        '    z-index: 20000000 !important;',
        '}',
        
        '.DomDialogToolbar > div.group.visible {',
        '    display: block;',
        '}',
        
        '.DomDialogToolbar > div.group > div.item {',
        '    display: inline-block; height: 16px; padding: 2px 0px 2px 0px; margin-right: 1px; vertical-align: middle; cursor: default;',
        '}',

        '.DomDialogToolbar > div.group > div.item.simple {',
        '    padding-left: 2px; padding-right: 2px; color: white;',
        '',
        '}',

        '.DomDialogToolbar > div.group > div.item.simple:hover {',
        '    background-color: white; color: black;',
        '',
        '}',

        '.DomDialogToolbar > div.group > div.item.simple:active {',
        '    background-color: #ddd; color: black;',
        '',
        '}',
        
        '.DomDialogToolbar > div.group > div.item.separator {',
        '   padding-left: 2px; padding-right: 2px; vertical-align: middle; background-color: #111;',
        '}',
        '',
        '.DomDialogToolbar > div.group > div.item.dropdown {',
        '    color: white; padding-left: 4px; padding-right: 14px; position: relative; background-position: 100% 50%; background-repeat: no-repeat; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAADCAYAAACuyE5IAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQgIHP3HJuUAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAKElEQVQI12P8////fwY08OHdfUYYmwmZgy7JwMDAwIQsiC7JwMDAAAAG+xG4B10TVwAAAABJRU5ErkJggg==);',
        '}',
        '',
        '.DomDialogToolbar > div.group > div.item.dropdown > .overlay {',
        '    display: none; position: absolute; left: 0px; top: 20px;',
        '}',
        '',
        '.DomDialogToolbar > div.group > div.item.dropdown:hover {',
        '    background-color: white; color: #333; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAADCAYAAACuyE5IAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQgIJaLCru0AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAJ0lEQVQI12NkYGD4z4AG3r+9xwhjMyFz0CUZGBgYmJAF0SUZGBgYAOI/DqzzZfuOAAAAAElFTkSuQmCC)',
        '}',
        '',
        '.DomDialogToolbar > div.group > div.item.dropdown:hover > .overlay {',
        '    display: block; background-color: white; z-index: 20000000 !important;',
        '}',
        '.DomDialogToolbar > div.group > div.item.dropdown.clicked > .overlay {',
        '    display: none !important;',
        '}',
        '',
        '.DomDialogToolbar > div.group > div.item.dropdown:hover .option {',
        '    color: black; padding: 0px 5px; cursor: pointer;',
        '}',
        '',
        '.DomDialogToolbar > div.group > div.item.dropdown:hover .option:hover {',
        '    color: white; background-color: #333;',
        '}',
        '.DomDialogToolbar > div.group > div.item.dropdown:hover .option.color {',
        '    width: 10px; height: 10px; float: left; padding: 0; margin: 2px;',
        '}',
        ''

        
    ].join('\n')
    
    
    )).toString( pid = "PID-" + getUID()).chain(function() {
        app.addCss(this);
    });
    
    app.addClass( pid );
}