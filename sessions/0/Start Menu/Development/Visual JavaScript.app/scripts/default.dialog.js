window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "dlg",
    "name"  : "Window",
    "group" : "Application",
    "order" : 1,
    "requires": "application",
    "provides": "dialog,placeable,dom,menubar,toolbar,handler,css,event,customevent,chain,extender",
    "icon": "data:image/gif;base64,R0lGODlhEAAQAKUoAACF6wCR9wCZ/z2t/7a21rq61r+/1pnM/8PD1sfH1svL1s7O1szM/9PT1s/P/9bW1tHR/9LS/9TU/9bW/9fX/9nZ/9vb/9zc/97e/+Dg/+Hh/+Pj/+Xl/+bm/+jo/+rq/+zs/+7u//Dw//Pz//X1//n5//v7//39/////////////////////////////////////////////////////////////////////////////////////////////////yH+FUNyZWF0ZWQgd2l0aCBUaGUgR0lNUAAh+QQBCgA/ACwAAAAAEAAQAAAGgcCfcEgsDgXIpBJ5PDif0MNAIEQCrthsgPoTPL6PxkKRQBgKBK4AxUaZSKIPJ2OZqNtuuJxur+LfcXN1d2wnJSMhe4NVJo0lcCAdGxgVEmokmCMiIR5zFxQRaiKjISCdGpQTEGofrR8dHKh1EQ5qHLccGxkYFhQSDgxcXUvERsZFQQA7",
    "properties": [
        {
            "name": "name",
            "label": "Name",
            "type": "varchar",
            "value": ""
        },
        {
            "name": "caption",
            "label": "Caption",
            "type": "varchar",
            "value": "Dialog"
        },
        {
            "name": "declaration",
            "label": "Scope",
            "type": "Generic",
            "value": "protected"
        },
        {
            "name": "appIcon",
            "label": "Icon",
            "type": "image",
            "widthHeight": "16x16",
            "value": ""
        },
        {
            "name": "x",
            "label": "Left",
            "type": "int",
            "value": 10
        },
        {
            "name": "y",
            "label": "Top",
            "type": "int",
            "value": 10
        },
        {
            "name": "width",
            "label": "Width",
            "type": "int",
            "value": 400
        },
        {
            "name": "minWidth",
            "label": "Min Width",
            "type": "int",
            "value": 50
        },
        {
            "name": "height",
            "label": "Height",
            "type": "int",
            "value": 200
        },
        {
            "name": "minHeight",
            "label": "Min Height",
            "type": "int",
            "value": 50
        },
        {
            "name": "moveable",
            "label": "Moveable",
            "type": "bool",
            "value": true
        },
        {
            "name": "resizeable",
            "label": "Resizeable",
            "type": "bool",
            "value": true
        },
        {
            "name": "minimizeable",
            "label": "Minimizeable",
            "type": "bool",
            "value": true
        },
        {
            "name": "maximizeable",
            "label": "Maximizeable",
            "type": "bool",
            "value": true
        },
        {
            "name": "closeable",
            "label": "Closeable",
            "type": "bool",
            "value": true
        }
    ],
    "init": function( cfg, app ) {
        var dlg = new Dialog( cfg.setProperty('childOf', app.tabs.getSheets(0) ), true );
        
        dlg.addCustomEventListener('resizeRun', function() {
            
            app.currentItemProperties.values.width = dlg.width;
            app.currentItemProperties.values.height= dlg.height;
            
            return true;
        });
        
        dlg.addCustomEventListener('dragRun', function() {
            app.currentItemProperties.values.x = dlg.x;
            app.currentItemProperties.values.y = dlg.y;
            
            return true;
        });
        
        return dlg;
    },
    "add": function(root, o ) {
        
        switch (true) {
            case o instanceof Node:
                return root.insert( o );
                break;
            case o instanceof JSIde_MenuBar:
                root.menu = o.menu;
                break;
            case o instanceof JSIde_Toolbar:
                var settings = o.settings;
                root.toolbars = o.toolbar;

                var toolbar = root.toolbars;
                if ( toolbar ) {
                    toolbar.setIconSize( settings.iconSize );
                    toolbar.setButtonLabels( settings.buttonLabels );
                    toolbar.setTitles( settings.toolbarTitles );
                }
                
                break;
            case o instanceof JSIde_ApplicationHandler:
                o.register( root );
                break;
            
            case o instanceof JSIde_ApplicationCSS:
                root.addCss( o.toString('') );
                break;
            
            case o instanceof JSIde_Chain:
                o.register( root );
                break;
            
            case o instanceof JSIde_ApplicationExtender:
                o.register( root );
                break;
            
            default:
                throw "Dont't know how to add a " + typeof o + " inside a Dialog";
                break;
        }

    },
    
    "compile": function( cfg, globalName, items ) {
        // console.log( cfg );
        var out = '( new Dialog(' + 
            JSON.stringify( 
                cfg.fields([ 
                    'alwaysOnTop', 
                    'appIcon', 
                    'caption', 
                    'closeable', 
                    'height', 
                    'maximizeable', 
                    'maximized', 
                    'minHeight', 
                    'minWidth', 
                    'minimizeable',
                    'modal',
                    'moveable',
                    'resizeable',
                    'scrollable',
                    'visible',
                    'width',
                    'x',
                    'y'
                ]) ) + ') )';
        
        out = out + '.chain( function() { Object.defineProperty(this, "pid", { "get": function() { return $pid; } }); this.addClass("PID-" + $pid); } )';
        
        return new JSIde_StringObject( out, cfg );
    }
}));