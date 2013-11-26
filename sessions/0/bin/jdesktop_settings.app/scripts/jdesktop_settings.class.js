function DesktopSettings() {

    if (!window.desktop) {
        alert("Error: This application needs the 'jdesktop.app' module to be loaded first");
        return;
    }
    
    var dlg = new Dialog({
        'width': 400,
        'height': 400,
        'caption': 'Customize Desktop',
        'appIcon': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH1gobFRcpmMfgzAAAAmtJREFUOMulk0tIVGEYhp9zzn/mQpcx8Zam5SgtikYiUQIJ6UpJXrKiaRFBi8BqkzRqCW7SdNJV7QI3LYQMpDKkqCiNERUkRzLxWjapFamjU6hnzpwWSmhTK7/t+73P933/zwtrLGl7fl3Voqa5MAwFQAhlTEfLGH184+vKxsTcmngzUlcwqMcvOSXdpKpuyZ5Tvei6fEJVhIIeDHLv/jM2/uwmyjK3atLkfBTBCAfnzxxCXu51323SRMgwVANof/+Fni4vbTXp+L2DwIawdW2O3WSXv2Rn2g4cyZGEDEMVADP+AN0dPXjce6hv7iQwFxdmXm+zUEgDr286ySrtZmtkOgBCUZThB01vUjy1mfi9DQTm4ii5dj0MUOOuZKLtDgBvq51kl3UiyfKobBDab5v3hhn6B/oYGh5geHQQwzA43FuOoy6PiYYliDXQi26EDsojT0rHoi2zYQCL2YLVasVisfLunIyjLg9v8SM2O68AEGOeYuxp2Yj43/+azWZMJjMRrYXE/WVeWXLiUXfKdy0qTBBCxaSaSLo0BJ5pmrcUrdKntEjsx6uThMUkv/Bp9jBAdFQMAD6fD0mSMA1WAZN/9JEFO0KIV9K2Y7eMiquneNjsobE4lfqWdgIz82HAdREqJxM+Y3M4KXD3c7ZgHxW1jQiAvrEZ8o9kUOBup8m1F7+34Z/vYnM4yav+wIXT2Xg/Ti+dKiFpo+M/VP/sLw5kpbGr6DkJQifWtCoKTGubGF5opfhiDh393/g04UdC0qTU3NtVwaDugqUwSYo8rgTJHGop8a0EJOdWxsqG6NT1UNJyDnUhFPda08xv0LHniZO14hsAAAAASUVORK5CYII="
    });
    
    dlg.tabs = dlg.insert(
        (new TabPanel({
            'initTabs': [
                {
                    'caption': 'Appearence'
                }
            ]
        })).setAnchors({
            "width": function(w,h) {
                return w  + 'px';
            },
            "height": function(w,h) {
                return h - 50 + 'px';
            }
        }).setAttr(
            'style', 'margin-top: 10px'
        )
    )
    
    desktop.props = dlg;
    
    dlg.tabs.getSheets(0).insert(
        dlg.grid = (new PropertyGrid([
            {
                "label": "Desktop Color",
                "name": "bgcolor",
                "value": desktop.bgcolor || '#000',
                "type": "color"
            },
            {
                "label": "Desktop Wallpaper",
                "name": "wallpaper",
                "items": [
                    {
                        "label": "Image URL",
                        "name": "bgurl",
                        "type": "varchar",
                        "value": desktop.bgurl
                    },
                    {
                        "label": "Position",
                        "name": "bgpos",
                        "type": "dropdown",
                        "value": desktop.bgpos,
                        "values": [
                            { "id": '0px 0px',  "name": 'Top Left' },
                            { "id": '50% 0px',  "name": 'Top Center' },
                            { "id": '100% 0px', "name": 'Top Right' },
                            { "id": '0px 50%',  "name": 'Middle Left' },
                            { "id": '50% 50%',  "name": 'Centered' },
                            { "id": '100% 50%', "name": 'Middle Right' },
                            { "id": '0px 100%', "name": 'Bottom Left' },
                            { "id": '50% 100%', "name": 'Bottom Center' },
                            { "id": '100% 100%',"name": 'Bottom Right' }
                        ]
                    },
                    {
                        "label": "Display Mode",
                        "name": "bgrepeat",
                        "type": "dropdown",
                        "value": desktop.bgrepeat,
                        "values": [
                            { "id": "no-repeat", "name": "No Repeat" },
                            { "id": "repeat-x",  "name": "Repeat Horizontally" },
                            { "id": "repeat-y",  "name": "Repeat Vertically" },
                            { "id": "repeat",    "name": "Repeat" },
                            { "id": "stretch",   "name": "Stretched" },
                            { "id": "fit-x",     "name": "Max Width" },
                            { "id": "fit-y",     "name": "Max Height" }
                        ]
                    }
                ]
            },
            {
                "name": "theme",
                "label": "Theme",
                "type": "dropdown",
                "value": desktop.theme,
                "values": [
                    {
                        "id": "default",
                        "name": "Default JSPlatform Theme"
                    }
                ]
            }
        ])).setAnchors({
            "width": function(w,h) {
                return w - 10 + 'px';
            },
            "height": function(w,h) {
                return h - 10 + 'px';
            }
        }).setAttr(
            "style", "margin: 3px"
        )
    );
    
    dlg.grid.splitPosition = 100;
    
    dlg.grid.querySelectorAll('div.DOMPropertyGridToolbarHolder')[0].style.display = 'none';
    dlg.grid.querySelectorAll('div.DOMPropertyGridBody')[0].style.top = '0px';
    
    dlg.insert(
        (new Button('Apply', function() {
            desktop.bgcolor = dlg.grid.values.bgcolor;
            desktop.bgurl   = dlg.grid.values.wallpaper.bgurl;
            desktop.bgpos   = dlg.grid.values.wallpaper.bgpos;
            desktop.bgrepeat= dlg.grid.values.wallpaper.bgrepeat;
            
            desktop.theme   = dlg.grid.values.theme;
            
            desktop.saveSettings();
        })).setAttr(
            "style", "position: absolute; left: 5px; bottom: 5px"
        )
    );
    
}