function ApplicationLoader(file_name) {
    var ext = KExtension(file_name);
    
    switch (ext) {
        case 'app': if (AppExec(file_name) === null) alert('Error starting application!'); break;
        default: alert('Error: No file handlers registered for this type of file ('+ext+')'); break;
    }
}

function HideExtension(file_name) {
    var ext = KExtension(file_name);
    if (ext == '') return file_name;
    else return file_name.substr(0, file_name.length - 1 - ext.length);
}

function JIcon() {
    var icon = $('div', 'desktop_icon');
    
    icon.callback = function() {};
    icon._caption  = '';
    icon._parent   = null;
    icon.is_renaming = false;
    
    icon.tabIndex = 0;
    
    icon.img = $('img', 'icon_image'); icon.appendChild(icon.img);
    icon.img.setAttribute('dragable', '1');
    disableSelection(icon.img);
    icon.caption_span = $('span'); icon.appendChild(icon.caption_span);
    
    icon.appendChild($('br'));
    
    icon.caption_span.setAttribute('dragable', '1');
    
    icon.startMoveCallback = function(obj) {
        try { icon.drag_start_x = icon.style.left; icon.drag_start_y = icon.style.top; } catch(ex) { console.log('Icon.startMoveCallback Exception: '+ex) }
    };
    
    icon.runMoveCallback = function(obj) {
        if ((icon.offsetLeft + icon.offsetWidth) > icon.parentNode.offsetWidth) icon.style.left = icon.parentNode.offsetWidth - icon.offsetWidth+'px';
        if ((icon.offsetTop + icon.offsetHeight) > icon.parentNode.offsetHeight) icon.style.top = icon.parentNode.offsetHeight - icon.offsetHeight+'px';
    };
    
    disableSelection(icon.img);
    disableSelection(icon);
    
    icon.setX = function(int) { icon.style.left = int+'px'; };
    icon.getX = function()    { return parseInt(icon.style.left); };
    icon.setY = function(int) { icon.style.top = int+'px'; };
    icon.getY = function()    { return parseInt(icon.style.top); };
    icon.setCaption = function(str) { icon.caption_span.innerHTML = ''; icon.caption_span.appendChild(document.createTextNode(str)); icon._caption = str; };
    icon.getCaption = function()    { return icon._caption; };
    icon.setImage = function(str) { icon.img.src = str; };
    icon.getImage = function() { return icon.img.src; };
    
    icon.setDragable = function(bool) { if (bool === true) icon.dragger.StartListening(); else icon.dragger.StopListening(); };
    icon.setHolder   = function(htmlElement) { htmlElement.appendChild(icon); icon.dragger.StartListening(); };
    
    if (icon.__defineSetter__) {
      icon.__defineSetter__('x', icon.setX);
      icon.__defineGetter__('x', icon.getX);
      icon.__defineSetter__('y', icon.setY);
      icon.__defineGetter__('y', icon.getY);
      icon.__defineSetter__('caption', icon.setCaption);
      icon.__defineGetter__('caption', icon.getCaption);
      icon.__defineSetter__('image', icon.setImage);
      icon.__defineGetter__('image', icon.getImage);
      icon.__defineSetter__('dragable', icon.setDragable);
      icon.__defineSetter__('holder', icon.setHolder);
    } else
    if (Object.defineProperty) {
      Object.defineProperty(icon, 'x',        {'get': icon.getX, 'set': icon.setX});
      Object.defineProperty(icon, 'y',        {'get': icon.getY, 'set': icon.setY});
      Object.defineProperty(icon, 'caption',  {'get': icon.getCaption, 'set': icon.setCaption});
      Object.defineProperty(icon, 'image',    {'get': icon.getImage, 'set': icon.setImage});
      Object.defineProperty(icon, 'dragable', {'set': icon.setDragable});
      Object.defineProperty(icon, 'holder',   {'set': icon.setHolder});
    }
    
    icon.ondblclick = function(e) {
        if (icon.is_renaming === true) return;
        cancelEvent(e);
        icon.callback();
    };
    
    icon.Remove = function() {
        icon.parentNode.removeIcon(icon);
    };
    
    icon.loadIcon = function(file_name) {
        var ext = KExtension(file_name);
        
        switch (ext) {
            case 'app': {
                try {
                    var vfs_icon = $_JSON_GET('jfs/icon/'+file_name).icon;
                    icon.setImage( vfs_icon );
                } catch(ex) { 
                    icon.setImage( 'icons/48x48/exe.png' ); 
                    KernelLog('Icon.loadIcon:: Error loading icon from application: '+file_name+'\nLoaded default image instead!\nError was: '+ex); 
                }
                break;
            }
            case 'jpg': case 'jpeg': case 'gif': case 'html': case 'iso': case 'mp3': case 'nfo': case 'php': case 'png': case 'srt': case 'txt':
            case 'zip': icon.image = 'jsplatform/icons/48x48/'+ext+'.png'; break;
            default: icon.image = 'jsplatform/icons/48x48/file.png'; break;
        };
    };
    
    icon.settings = function() {
        for (var i=0; i<icon.parentNode.settings.icons.length; i++) { 
          if (icon.parentNode.settings.icons[i].file == icon.file) return icon.parentNode.settings.icons[i]; 
        }
        icon.parentNode.settings.icons.push({ 'file': icon.file, 'x': icon.getX(), 'y': icon.getY(), 'visible': 1 });
        return icon.parentNode.settings.icons[icon.parentNode.settings.icons.length - 1];
    };
    
    icon.stopMoveCallback  = function(obj) {
        try { 
          if ((icon.drag_start_x == obj.style.left) && (icon.drag_start_y == obj.style.top)) return; 
        } catch(ex) { 
          KernelLog('Icon.stopMoveCallback Exception: '+ex); 
          return; 
        }
        var sett = icon.settings();
        sett.x = icon.getX();
        sett.y = icon.getY();
        icon.parentNode.saveSettings();
    };
    
    icon.renameIcon = function() {
        var ctl = $('input');
        icon.renamer = ctl;
        ctl.value = icon.getCaption();
        icon.caption_span.style.display = 'none';
        icon.appendChild(icon.renamer);
        icon.is_renaming = true;
        
        icon.renamer.focus();
        
        icon.renamer.onblur = function() {
            if (this.value == '') {
                icon.removeChild(icon.renamer);
                icon.caption_span.style.display = '';
                void(icon.renamer);
            } else {
                icon.setCaption( this.value );
                
                icon.settings().renamed = this.value;
                
                icon.removeChild(icon.renamer);
                icon.caption_span.style.display = '';
            }
            icon.is_renaming = false;
            icon.parentNode.saveSettings();
        };
    };
    
    icon.addContextMenu([
      {'caption': 'Open',
       'handler': function() {icon.ondblclick();}
      },
      {'caption': 'Rename',
       'handler': icon.renameIcon
      },
      false,
      {'caption': 'Remove From Desktop',
       'handler': icon.Remove
      }
    ]);
    
/*    AddContextMenu(icon, [
        {'text': 'Open', 'callback': function() {icon.ondblclick();}, 'important': true },
        {'text': 'Rename', 'callback': icon.renameIcon },
        null,
        {'text': 'Remove from Desktop', 'callback': icon.Remove}
    ]);
*/ 
    
    icon.dragger = new dragObject(icon, null, new Position(0, 0), new Position(5000, 5000), icon.startMoveCallback, icon.runMoveCallback, icon.stopMoveCallback, null, true);
    
    return icon;
}

function JDesktop() {

	if ((typeof(window.desktop) != 'undefined') && (window.desktop !== null)) {
		KernelLog('Another instance of JDesktop is allready running. Returning that instance instead');
		return window.desktop;
	};

    var desktop = $('div', 'desktop');
    
    desktop.icons = [];
    desktop.settings = $_JSON_GET('vfs/bin/jdesktop.app/bin/loader.php');
    
    desktop.auto_icon_x = 0;
    desktop.auto_icon_y = 0;
    
    if (desktop.settings === null) {
        KernelLog('Error loading your desktop settings!');
        return null;
    }

	desktop.settings.icons = desktop.settings.icons || [];
    
    desktop.create_icon = function(caption) {
        var icon = new JIcon();
        icon.setHolder( desktop );
        icon.setCaption( caption );
        desktop.icons.push(icon);
        return icon;
    };
    
    desktop.getIconSettings = function(file_name) {
        for (var i=0; i<desktop.settings.icons.length; i++) {
            if (desktop.settings.icons[i].file == file_name) return desktop.settings.icons[i];
        }
        desktop.settings.icons.push({
            'x': 'auto',
            'y': 'auto',
            'file': file_name,
            'visible': '1'
        });
        return desktop.settings.icons[desktop.settings.icons.length-1];
    };
    
    desktop.autoX = function(objIcon) {
        var ret = desktop.auto_icon_x;
        if ((desktop.auto_icon_x+20+objIcon.offsetWidth) < desktop.offsetWidth) {
            desktop.auto_icon_x += objIcon.offsetWidth + 20;
        } else {
            ret = 0;
            desktop.auto_icon_x = 0;
            desktop.auto_icon_y += objIcon.offsetHeight + 20;
        }
        return ret;
    };
    
    desktop.autoY = function(objIcon) {
        return desktop.auto_icon_y;
    };
    
    desktop.addFileIcon = function(path, file) {
        s = desktop.getIconSettings(path+file);
        
        if (s.visible == '1') {
            
            icon = desktop.create_icon(!s.renamed ? HideExtension(file) : s.renamed);
            
            if (s.renamed && ( HideExtension(file) == s.renamed )) {
                s.renamed = null;
            }
            
            icon.setX( s.x == 'auto' ? desktop.autoX(icon) : s.x );
            icon.setY( s.y == 'auto' ? desktop.autoY(icon) : s.y );
            
            icon.file  = path + file ;
            
            icon.loadIcon(icon.file);
            
            icon.callback = function() {
                ApplicationLoader(this.file);
            };
        }
    
    };
    
    desktop.init = function() {
        var all_users = $_JSON_GET('vfs/Desktop');   //Load Entries for All Sessions
        var this_user = $_JSON_GET('vfs/~/Desktop'); //Load Entries for Current Session
        var s;
        
        desktop.auto_icon_x = 0;
        desktop.auto_icon_y = 0;
        
        var icon;
        
        if ((all_users !== null) && (all_users.__response_type__ == 'dir') && ((all_users.files) || (all_users.folders))) {
            if (all_users.files)
            for (var i=0; i<all_users.files.length; i++) {
                desktop.addFileIcon('/Desktop/', all_users.files[i]);
            }
            if (all_users.folders)
            for (var i=0; i<all_users.folders.length; i++) {
                desktop.addFileIcon('/Desktop/', all_users.folders[i]);
            }
        }
        
        if ((this_user !== null) && (this_user.__response_type__ == 'dir') && ((this_user.files) || (this_user.folders))) {
            if (this_user.files)
            for (var i=0; i<this_user.files.length; i++) {
                desktop.addFileIcon('~/Desktop/', this_user.files[i]);
            }
            if (this_user.folders)
            for (var i=0; i<this_user.folders.length; i++) {
                desktop.addFileIcon('~/Desktop/', this_user.folders[i]);
            }
        }
    };
    
    desktop.removeIcon = function(icon) {
        icon.settings().visible = '0';
        for (var i=0; i<desktop.icons.length; i++) {
            if (desktop.icons[i] == icon) {
                desktop.icons.splice(i,1);
                desktop.removeChild(icon);
            }
        }
        desktop.saveSettings();
    };
    
    desktop.arrangeIcons = function() {
        desktop.auto_icon_x = 0;
        desktop.auto_icon_y = 0;
        
        for (var i=0; i<desktop.icons.length; i++) {
            desktop.icons[i].setX( desktop.autoX( desktop.icons[i] ) );
            desktop.icons[i].setY( desktop.autoY( desktop.icons[i] ) );
            desktop.icons[i].stopMoveCallback(desktop.icons[i]);
        }
        desktop.saveSettings();
    };
    
    desktop.sortIcons = function() {
        var sorter = function(a,b) {
            var sa = a.getCaption().toLowerCase();
            var sb = b.getCaption().toLowerCase();
            
            return (sa == sb) ? 0 : ( sa < sb ? -1 : 1 );
        };
        desktop.icons.sort(sorter);
        desktop.arrangeIcons();
    };
    
    desktop.saveSettings = function() {
        var req = [];
        for (var i=0; i<desktop.settings.icons.length; i++) {
            req.addPOST('settings[icons]['+i+'][x]', desktop.settings.icons[i].x );
            req.addPOST('settings[icons]['+i+'][y]', desktop.settings.icons[i].y );
            req.addPOST('settings[icons]['+i+'][file]', desktop.settings.icons[i].file);
            req.addPOST('settings[icons]['+i+'][visible]', desktop.settings.icons[i].visible);
            if (desktop.settings.icons[i].renamed && (desktop.settings.icons[i].renamed !== null) )
            req.addPOST('settings[icons]['+i+'][renamed]', desktop.settings.icons[i].renamed);
        }
        
        req.addPOST('settings[appearence][bgcolor]', desktop.settings.appearence.bgcolor);
        req.addPOST('settings[appearence][bgpos]', desktop.settings.appearence.bgpos);
        req.addPOST('settings[appearence][bgurl]', desktop.settings.appearence.bgurl);
        req.addPOST('settings[appearence][bgrepeat]', desktop.settings.appearence.bgrepeat);
        
        /*KernelLog('Desktop Settings (POST format):\n'+
                  decodeURIComponent(req.join('\n'))
                 ); */
        
        if ($_JSON_POST('vfs/bin/jdesktop.app/bin/save_desktop.php', req) == 'ok') {
            KernelLog('Desktop settings were saved'); 
        };
        
        return req;
    };
    
    desktop.properties = function() {
        AppExec('/bin/jdesktop_settings.app');
    };
    
    desktop.clear = function() {
        for (var i=0; i<desktop.icons.length; i++) {
            desktop.removeChild(desktop.icons[i]);
        }
        desktop.icons = [];
    };
    
    desktop.refreshIcons = function() {
        desktop.clear();
        desktop.init();
    };
    
    desktop.resetIcons = function() {
        for (var i=0; i<desktop.settings.icons.length; i++) {
            desktop.settings.icons[i].visible = '1';
            desktop.settings.icons[i].renamed = null;
        }
        desktop.refreshIcons();
        desktop.saveSettings();
    };
    
    desktop.addContextMenu([
        {'caption': 'Icons',
         'items': [
            {
                'caption': 'Align to Grid', 
                'handler': desktop.arrangeIcons,
                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB9IMEQ02AD+zyFkAAADYSURBVHjavZG9DgFREIW/mb0h8TZKb6BSKDyAWqFQSSQoRSHx30goFQqVN1BSoNHYRLKJZL0CDRtckmUTJ7nFPXPnzJlzISIEoFopXXbbzVeN09ki6CeXTV+AX050yOMlk09ZqvPRUpKZgsWv5h0BMK+FermB57sA9IfdgG/XirjeGYDmYBLwloDnu+yPa8uq653ZHU6oPplGo2ZgPhVU1UrLGMfi9VOziPO7g3gsgb4IqAiqamVg3k1XcRB5ftjojcM5kNskedju/ufhBHjvILRAu9fir7gCN3g6rtgn2RQAAAAASUVORK5CYII="
            },
            {
                'caption': 'Sort by Name',
                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGeYUxB9wAAACBjSFJNAAB6JQAAgIMAAN5EAACBsAAAed8AANSAAAA6NAAAM5CNtHL/AAABAElEQVR42qTTsS6FQRAF4O/cKzc6JVHRkPAECg9xI1FpRDyEzhuoFNcT6HTUeh2dWiNKEUSswv7y+y8usclmdnZmT+acmU0pxX9Wr3uRZDvJU5KtbuwoKRMBsItBtX+rIMkq1nCA9SRLf6Wwg2dc4+VXVZRSVCGncYdLnOIKt5hqckaU5vzxrgWwiYLl6q9Uf+O3AD30PwXpIz8B9FpUXnGY5KXZeCgTBqUr4h4WMKwinrQ69MmOidgqex43OMd0697oXZOvKVT0GZzhHsNSymMTG3HRtt9ROMZinYdBkrkkTc5+x47NQWrbunu2RWHUpZC2yBlTqPbth5X/fue3AQC/4saPTSbbrQAAAABJRU5ErkJggg==",
                'handler': desktop.sortIcons
            }
          ]
        },
        
        false,
        {'caption': 'Desktop',
         "icon"   : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH1gobFRcpmMfgzAAAAmtJREFUOMulk0tIVGEYhp9zzn/mQpcx8Zam5SgtikYiUQIJ6UpJXrKiaRFBi8BqkzRqCW7SdNJV7QI3LYQMpDKkqCiNERUkRzLxWjapFamjU6hnzpwWSmhTK7/t+73P933/zwtrLGl7fl3Voqa5MAwFQAhlTEfLGH184+vKxsTcmngzUlcwqMcvOSXdpKpuyZ5Tvei6fEJVhIIeDHLv/jM2/uwmyjK3atLkfBTBCAfnzxxCXu51323SRMgwVANof/+Fni4vbTXp+L2DwIawdW2O3WSXv2Rn2g4cyZGEDEMVADP+AN0dPXjce6hv7iQwFxdmXm+zUEgDr286ySrtZmtkOgBCUZThB01vUjy1mfi9DQTm4ii5dj0MUOOuZKLtDgBvq51kl3UiyfKobBDab5v3hhn6B/oYGh5geHQQwzA43FuOoy6PiYYliDXQi26EDsojT0rHoi2zYQCL2YLVasVisfLunIyjLg9v8SM2O68AEGOeYuxp2Yj43/+azWZMJjMRrYXE/WVeWXLiUXfKdy0qTBBCxaSaSLo0BJ5pmrcUrdKntEjsx6uThMUkv/Bp9jBAdFQMAD6fD0mSMA1WAZN/9JEFO0KIV9K2Y7eMiquneNjsobE4lfqWdgIz82HAdREqJxM+Y3M4KXD3c7ZgHxW1jQiAvrEZ8o9kUOBup8m1F7+34Z/vYnM4yav+wIXT2Xg/Ti+dKiFpo+M/VP/sLw5kpbGr6DkJQifWtCoKTGubGF5opfhiDh393/g04UdC0qTU3NtVwaDugqUwSYo8rgTJHGop8a0EJOdWxsqG6NT1UNJyDnUhFPda08xv0LHniZO14hsAAAAASUVORK5CYII=",
         'items': [
            {
                'caption': 'Refresh',
                "icon"   : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJTSURBVHjahFNNaBNREJ733r7NpqmolVQpCqb0UK0gph4Ufy7puWJR8VIkpLERRU+CoCB48CBIaShG6x9YPKugggYVQj1VL1XRgvgDVRQkkmSTTfbnjW9fTWqFJgOzy9ud75uZb+YR+N9GYTPXtUSAs33lsh1BRMq5VtAYzVXGa4OEEBWmHaenXUdcIg3gQdCNdTwtEI/0RyN8W7Sb9fVtAE2jkM+bMPvmK2Sfzpols/rJcb3HwhVnfBipg4Nd/KVlOdv9o65rRc8TgYDBvb17NmmxgS060xnYrgvTuQ/i4f3XNHkyBtfTzxYI9BN8yvO8IUQ4J4S4BZNQUMQJ6NGD/LxhsKGRVKxt1ZoQ2J6niBzpYxceAfXjKAPXAxEVV8VYA+zbTfhoTzjDxUI1lZnIWkXTAttxlNckgcL6j+q4E4cMzMEyhpM4ZVXsoCM8BfTdJ1FiQguTUwAySjB5KgZIUJa/2MKiiM3sKGCz36RVgNSkaRLVwuH4LiAMwJEK+14qWfD83lspLr0oQEBLgo7OdkXgi2NVbXhwZ2YBnBFnW3WopuD+zazekkQ3tIrctFfLohLQQVNwewlB3f0vuwd727QAu0uP0TTEIbwEnIT9RCfv5Gy6GyIeGtkJuSfvyxt7w6GuntVqTKZZhbmZ77WfnwuyPfLDzyNcXI8CA/L8BW3sl4uWb0yBMXpD0g20rwyEI1vXhlZ0GiAoKrJf8yX4PW9C8ZtlI4UXcjcOwBUwGxXgNST1aypLHOYGS7q22CEDuQpipCwjs+jiZTnW6X87+iPAAJykJrlawes6AAAAAElFTkSuQmCC",
                'handler': desktop.refreshIcons
            },
            {'caption': 'Reset', 'handler': desktop.resetIcons},
            false,
            {
                'caption': 'Properties', 
                'handler': desktop.properties,
                "icon"   : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH1gobFRcpmMfgzAAAAmtJREFUOMulk0tIVGEYhp9zzn/mQpcx8Zam5SgtikYiUQIJ6UpJXrKiaRFBi8BqkzRqCW7SdNJV7QI3LYQMpDKkqCiNERUkRzLxWjapFamjU6hnzpwWSmhTK7/t+73P933/zwtrLGl7fl3Voqa5MAwFQAhlTEfLGH184+vKxsTcmngzUlcwqMcvOSXdpKpuyZ5Tvei6fEJVhIIeDHLv/jM2/uwmyjK3atLkfBTBCAfnzxxCXu51323SRMgwVANof/+Fni4vbTXp+L2DwIawdW2O3WSXv2Rn2g4cyZGEDEMVADP+AN0dPXjce6hv7iQwFxdmXm+zUEgDr286ySrtZmtkOgBCUZThB01vUjy1mfi9DQTm4ii5dj0MUOOuZKLtDgBvq51kl3UiyfKobBDab5v3hhn6B/oYGh5geHQQwzA43FuOoy6PiYYliDXQi26EDsojT0rHoi2zYQCL2YLVasVisfLunIyjLg9v8SM2O68AEGOeYuxp2Yj43/+azWZMJjMRrYXE/WVeWXLiUXfKdy0qTBBCxaSaSLo0BJ5pmrcUrdKntEjsx6uThMUkv/Bp9jBAdFQMAD6fD0mSMA1WAZN/9JEFO0KIV9K2Y7eMiquneNjsobE4lfqWdgIz82HAdREqJxM+Y3M4KXD3c7ZgHxW1jQiAvrEZ8o9kUOBup8m1F7+34Z/vYnM4yav+wIXT2Xg/Ti+dKiFpo+M/VP/sLw5kpbGr6DkJQifWtCoKTGubGF5opfhiDh393/g04UdC0qTU3NtVwaDugqUwSYo8rgTJHGop8a0EJOdWxsqG6NT1UNJyDnUhFPda08xv0LHniZO14hsAAAAASUVORK5CYII="
            }
         ]
        },
        {
            "caption": "Theme",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADTklEQVR4XqXMb0zUdQDH8ff97g8C5x0eIBzgsbtuBBrSIcINsjuodnpAwzmzuIbsYIRMnMPhFqNkbtWDdK2t2qgZoZtsZjlyZTBthQtDu0hxVjdiDJXq6AD5c8D97vjGA3tUPeq1fR58ts8+tFaZaXZv4uW9OTQ8k0GNI4W60gxqnUaqHenogUsNqaeOwJd1dp3ywG4b+9c2L2zTUGuPReI/rMoyshw1FRppmb/5u9cHJkVSavnSwmJBeGUlmYf+cRCNRFhaWijQJSa/YspM/+y1vYaTA0Pg9Dhznq7Y07u97MkbKSZzT0QOb0cIVDykUEiEZdmk0sR68222F1PSzY9kMkrwAx+fAC25R9hp/hGlLoNxa85TZz/lzH3/7UoVgEKSmJl54EpLN3fsKCmw+0Z13Pt+nDLjFxz9GWZi2xm5F8Ps2Dl0vSNkN3vZta/60dNvn2iVAEJL4edzbbbug/t32vPNsVzqGyZl4TojPRACul7XUmP7GmWiHo1ezfL9X7EadcTpdZXKQou2OHvzlp78rZsTB65+B+F5rBtDVER+oHMQyg/ZKHesRy8CRDYmM+jU841pCgvx+IbuKGh91tI38Xmb8JRmCUBUOzNF4K08cQZEcyIi0N8kAr114o8LXjFxvlpwGcFFxMe9JaLDbZ2X1m/Ql6QnqUnVyqiBBOUCk1dvMgjUtRdjWOuq1SDqlRnUi/OkTgOrEBfWsri0GJCWl5cjq6sKOrw2fup04tnzHJcH4HEXGDPimA1OsiE+Bo1hnHjrFXyKLGaVu1GNaZgMBbul6eDURxf6rhOcCxMTO8PoyEX8CRo0W/OGO7+Kdp0dEkO+0RWmDcOEt4RIy/OjiuZw5drwnRiVdIrWqk0JniLtS7VPGG6db0PUS2sxIzd5Xc31jS1F+6rcH75RmysmriGiMmLul23i3UbHXY99XWmjUwcAFqCheF3XQSfCAuJYpSHqrcq6VePO8b/X5li4O9AgxFi7mPzWK7rbSkcO7UoqO+xK5GhFCn/bUZPFtBX+TIL+d1rsy2P99WLixmEh+18Vc7ePidPHK6aKjOo3gUz+xWNAI+AC0pzZ0vsnmopmT7Y6Hxw/UPhbkZlzgBvQAkogBlAAKIQQ/B9/AQVbS45PvyYKAAAAAElFTkSuQmCC",
            "items": [
                {
                    "caption" : "Default",
                    "handler": function() {
                        desktop.theme = 'default';
                    }
                }
            ]
        }
    ]);
    
    document.body.appendChild(desktop);
    
    /* Properties ... */
    
    desktop.setBgcolor = function(str) {
        document.body.style.backgroundColor = str;
        desktop.settings.appearence.bgcolor = str;
    };
    
    desktop.getBgcolor = function() {
        return desktop.settings.appearence.bgcolor;
    }
    
    desktop.getBgpos = function() { 
      return desktop.settings.appearence.bgpos; 
    };
    
    desktop.setBgpos = function(str) { 
      document.body.style.backgroundPosition = str; 
      desktop.settings.appearence.bgpos = str; 
    };
    
    desktop.getBgurl = function() { 
      return desktop.settings.appearence.bgurl; 
    };
    
    desktop.setBgurl = function(str) { 
      document.body.style.backgroundImage = str.toString().length ? 'url('+str+')' : ''; 
      desktop.settings.appearence.bgurl = str; 
    };
    
    desktop.setBgrepeat = function(str) { 
      switch (true) {
        case str == 'stretch':
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundSize = '100% 100%';
            break;

        case str == 'fit-x':
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundSize = '100% auto';
            break;

        case str == 'fit-y':
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundSize = 'auto 100%';
            break;
        
        default:
            document.body.style.backgroundRepeat = str; 
            document.body.style.backgroundSize = '';
            break;
      }
      
      desktop.settings.appearence.bgrepeat = str; 
    };
    
    desktop.getTheme = function() {
        var req = [];
        req.addPOST('do', 'get-theme');
        return $_JSON_POST( 'vfs/bin/jdesktop.app/bin/save_desktop.php', req ) || 'default';
    };
    
    desktop.setTheme = function( themeName ) {
    
        var currentTheme = desktop.getTheme();
    
        themeName = themeName || 'default';
        var req = [];
        req.addPOST('do', 'set-theme');
        req.addPOST('theme', themeName);
        $_POST( 'vfs/bin/jdesktop.app/bin/save_desktop.php', req );
        
        var currentCSSPath = document.getElementById('theme-css').getAttribute('href');
        
        currentCSSPath = currentCSSPath.split('/');
        currentCSSPath[ 1 ] = themeName;
        
        document.getElementById( 'theme-css' ).href = currentCSSPath.join( '/' );
        
        var w = document.querySelectorAll('div.DOM2Window');
        for (var i=0; i<w.length; i++)
            w[i].paint();
    }
    
    desktop.getBgrepeat = function() { 
      return desktop.settings.appearence.bgrepeat; 
    };
    
    desktop.setTop = function(int) { 
      desktop.style.top = int+'px'; 
    };
    
    desktop.getTop = function() { 
      return desktop.offsetTop(); 
    };
    
    desktop.setLeft = function(int) { 
      desktop.style.left = int+'px'; 
    };
    
    desktop.getLeft = function() { 
      return desktop.offsetLeft(); 
    };
    
    desktop.getBottom = function() { 
      return desktop.style.bottom ? parseInt(desktop.style.bottom) : 0; 
    };
    
    desktop.setBottom = function(int) { 
      desktop.style.bottom = int+'px'; 
    };
    
    desktop.getRight = function() { 
      return desktop.style.right ? parseInt(desktop.style.right) : 0; 
    };
    
    desktop.setRight = function(int) { 
      desktop.style.right = int+'px'; 
    };
    
    desktop.getWidth  = function() { 
      return desktop.offsetWidth; 
    };
    
    desktop.getHeight = function() { 
      return desktop.offsetHeight; 
    };
    

    Object.defineProperty(desktop, 'bgcolor',  {'get': desktop.getBgcolor,  'set': desktop.setBgcolor});
    Object.defineProperty(desktop, 'bgpos',    {'get': desktop.getBgpos,    'set': desktop.setBgpos});
    Object.defineProperty(desktop, 'bgurl',    {'get': desktop.getBgurl,    'set': desktop.setBgurl});
    Object.defineProperty(desktop, 'bgrepeat', {'get': desktop.getBgrepeat, 'set': desktop.setBgrepeat});
    Object.defineProperty(desktop, 'top',      {'get': desktop.getTop,      'set': desktop.setTop });
    Object.defineProperty(desktop, 'left',     {'get': desktop.getLeft,     'set': desktop.setLeft });
    Object.defineProperty(desktop, 'bottom',   {'get': desktop.getBottom,   'set': desktop.setBottom });
    Object.defineProperty(desktop, 'right',    {'get': desktop.getRight,    'set': desktop.setRight });
    Object.defineProperty(desktop, 'width',    {'get': desktop.getWidth });
    Object.defineProperty(desktop, 'height',   {'get': desktop.getHeight });
    Object.defineProperty(desktop, 'theme',    {"get": desktop.getTheme,    "set": desktop.setTheme });

    desktop.setLeft( 0 );
    desktop.setTop( 0 );

    desktop.setRight( (typeof(document.body.sidebar) != 'undefined') ? document.body.sidebar.width  : 0 );
    desktop.setBottom( (typeof(document.body.taskbar) != 'undefined') ? document.body.taskbar.offsetHeight : 0 );
    
    desktop.loadAppearence = function() {
        desktop.setBgcolor ( desktop.settings.appearence.bgcolor );
        desktop.setBgpos   ( desktop.settings.appearence.bgpos );
        desktop.setBgrepeat( desktop.settings.appearence.bgrepeat );
        desktop.setBgurl   ( desktop.settings.appearence.bgurl );
    };
    
    desktop.loadAppearence();
    
    desktop.init();
    
    return desktop;
}

function DesktopLoader() {
    window.desktop = (window.desktop && (window.desktop !== null)) ? window.desktop : (new JDesktop());
    return window.desktop;
}