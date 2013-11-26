var __ACE_SYNTAXES = {}
var __ACE_BAD_SYNTAXES = {};

var __ACE_THEMES = {};
var __ACE_BAD_THEMES = {};

function AceEditor() {
    var holder = $('div', 'ACE_EDITOR');
    
    try {
    
    holder.editor = ace.edit(holder);
    
    holder.getWidth = function() {
        return holder.offsetWidth;
    }
    
    holder.setWidth = function(cssDimension) {
        holder.style.width = cssDimension;
        holder.editor.resize();
    }
    
    holder.getHeight = function() {
        return holder.offsetHeight;
    }
    
    holder.setHeight = function(cssDimension) {
        holder.style.height = cssDimension;
        holder.editor.resize();
    }
    
    
    holder.syntaxLoaded = function(syntaxName) {
        return typeof __ACE_SYNTAXES[syntaxName] != 'undefined';
    };
    
    holder.themeLoaded = function(themeName) {
        return typeof __ACE_THEMES[themeName] != 'undefined';
    };
    
    holder.loadSyntax = function(syntaxName, onLoad) {
        if (typeof __ACE_BAD_SYNTAXES[syntaxName] != 'undefined') {
            throw "AceEditor: Could not load syntax '"+syntaxName+"'";
        }
        if (!holder.syntaxLoaded(syntaxName)) {
            
            var script = $('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', 'contrib/ace-editor/mode-'.concat(syntaxName).concat('.js'));

            script.onload = function() {
                __ACE_SYNTAXES[syntaxName] = true;
                script.parentNode.removeChild(script);
                onLoad();
                console.log('AceEditor: Loaded Syntax Mode: "'+syntaxName+'"');
            };
            
            script.onerror = function() {
                __ACE_BAD_SYNTAXES[syntaxName] = true;
                throw "AceEditor: Could not load syntax '"+syntaxName+"'";
            }
            
            console.log('AceEditor: LoadSyntaxBegin: '+syntaxName);
            document.getElementsByTagName('head')[0].appendChild(script);
            
        } else {
            onLoad();
        }
    };

    holder.loadTheme = function(themeName, onLoad) {
        if (typeof __ACE_BAD_THEMES[themeName] != 'undefined') {
            throw "AceEditor: Could not load theme '"+themeName+"'";
        }
        
        if (!holder.themeLoaded(themeName)) {
            
            var script = $('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', 'contrib/ace-editor/theme-'.concat(themeName).concat('.js'));

            script.onload = function() {
                __ACE_THEMES[themeName] = true;
                script.parentNode.removeChild(script);
                onLoad();
                console.log('AceEditor: Loaded Theme: "'+themeName+'"');
            };
            
            script.onerror = function() {
                __ACE_BAD_THEMES[themeName] = true;
                throw "AceEditor: Could not load theme '"+themeName+"'";
            }
            
            console.log('AceEditor: LoadThemeBegin: '+themeName);
            document.getElementsByTagName('head')[0].appendChild(script);
            
        } else {
            onLoad();
        }
    };
    
    holder._syntax = null;
    holder._theme  = null;
    
    holder.getSyntax = function() {
        return holder._syntax;
    };
    
    holder.setSyntax = function(str) {
        if (!str) {
            var SynObj = require('ace/mode/text').Mode;
            holder.editor.getSession().setMode( new SynObj() );
            holder._syntax = null;
        } else
        holder.loadSyntax(str, function() {
            var SynObj = require('ace/mode/'.concat(str)).Mode;
            holder.editor.getSession().setMode(new SynObj());
            holder._syntax = str;
        });
        
    };
    
    holder.getTheme = function() {
        return holder._theme;
    };
    
    holder.setTheme = function(str) {
        if (!str) throw "Expected theme name!";
        
        holder.loadTheme(str, function() {
            holder.editor.setTheme('ace/theme/'+str);
            holder._theme = str;
        });
        
        localStorage.ACE_EDITOR_THEME = str;
    };
    
    holder.getValue = function() {
        return holder.editor.getSession().getValue();
    };
    
    holder.setValue = function(str) {
        holder.editor.getSession().setValue(str);
    };
    
    holder.getTabSize = function() {
        return holder.editor.getSession().getTabSize();
    }
    
    holder.setTabSize = function(intVal) {
        holder.editor.getSession().setTabSize(intVal);
    };
    
    holder.getSelection = function() {
        return holder.editor.getSession().doc.getTextRange(holder.editor.getSelectionRange());
    }
    
    holder.__defineGetter__('value', holder.getValue);
    holder.__defineSetter__('value', holder.setValue);
    
    holder.__defineGetter__('width', holder.getWidth);
    holder.__defineSetter__('width', holder.setWidth);
    
    holder.__defineGetter__('height', holder.getHeight);
    holder.__defineSetter__('height', holder.setHeight);
    
    holder.__defineGetter__('syntax', holder.getSyntax);
    holder.__defineSetter__('syntax', holder.setSyntax);
    
    holder.__defineGetter__('theme', holder.getTheme);
    holder.__defineSetter__('theme', holder.setTheme);
    
    holder.__defineGetter__('tabSize', holder.getTabSize);
    holder.__defineSetter__('tabSize', holder.setTabSize);
    
    holder.__defineGetter__('selection', holder.getSelection);
    holder.__defineSetter__('selection', function() { throw "ReadOnly property!"; });
    
    holder.cmdHandler = function(str) {
        var arr;
        
        switch (true) {
            case (arr = /^theme\-([a-z0-9_\-]+)$/i.exec(str)) != null:
                holder.theme = arr[1];
                break;
            case (arr = /^syntax\-([a-z0-9_\-]+)$/i.exec(str)) != null:
                holder.syntax = arr[1];
                break;
            default:
                alert("Unknown command: "+str);
                console.log(arr);
                break;
        }
    }
    
    holder.getClipboard = function() {
        
    };
    
    holder.__defineGetter__('clipboard', holder.getClipboard);
    holder.__defineSetter__('clipboard', function() { throw "AceEditor: Property .clipboard is readOnly!"; });
    
    holder.__contextMenu = [
        {
            'caption': 'Edit',
            'items': [
                {
                    'caption': 'Cut',
                    'id': 'cmd_cut',
                    'disabled': true,
                    'shortcut': 'Ctrl + X'
                },
                {
                    'caption': 'Copy',
                    'id': 'cmd_copy',
                    'disabled': true,
                    'shortcut': 'Ctrl + C'
                },
                {
                    'caption': 'Paste',
                    'id': 'cmd_paste',
                    'disabled': true,
                    'shortcut': 'Ctrl + V'
                },
                null,
                {
                    'caption': 'Find',
                    'id': 'cmd_find',
                    'shortcut': 'Ctrl + F'
                }
            ]
        },
        {
            'caption': 'Options',
            'items': [
                {
                    'caption': 'Theme',
                    'items': [
                        {
                            'caption': 'Clouds',
                            'input': 'radio',
                            'id': 'theme-clouds',
                            'handler': holder.cmdHandler,
                            'checked': function() { return holder.theme == 'clouds'; }
                        },
                        {
                            'caption': 'Clouds Midnight',
                            'input': 'radio',
                            'id': 'theme-clouds_midnight',
                            'handler': holder.cmdHandler,
                            'checked': function() { return holder.theme == 'clouds_midnight'; }
                        },
                        {
                            'caption': 'Cobalt',
                            'input': 'radio',
                            'id': 'theme-cobalt',
                            'handler': holder.cmdHandler,
                            'checked': function() { return holder.theme == 'cobalt'; }
                        },
                        {
                            'caption': 'Dawn',
                            'input': 'radio',
                            'id': 'theme-dawn',
                            'handler': holder.cmdHandler,
                            'checked': function() { return holder.theme == 'dawn'; }
                        },
                        {
                            'caption': 'Eclipse',
                            'input': 'radio',
                            'id': 'theme-eclipse',
                            'handler': holder.cmdHandler,
                            'checked': function() { return holder.theme == 'eclipse'; }
                        },
                        {
                            'caption': 'Idle Fingers',
                            'input': 'radio',
                            'id': 'theme-idle_fingers',
                            'handler': holder.cmdHandler,
                            'checked': function() { return holder.theme == 'idle_fingers'; }
                        },
                        {
                            'caption': 'Kr-Theme',
                            'input': 'radio',
                            'id': 'theme-kr_theme',
                            'handler': holder.cmdHandler,
                            'checked': function() { return holder.theme == 'kr_theme'; }
                        },
                        {
                            'caption': 'Mono Industrial',
                            'input': 'radio',
                            'id': 'theme-mono_industrial',
                            'handler': holder.cmdHandler,
                            'checked': function() { return holder.theme == 'mono_industrial'; }
                        },
                        {
                            'caption': 'Monokai',
                            'input': 'radio',
                            'id': 'theme-monokai',
                            'handler': holder.cmdHandler,
                            'checked': function() { return holder.theme == 'monokai'; }
                        },
                        {
                            'caption': 'Pastel on Dark',
                            'input': 'radio',
                            'id': 'theme-pastel_on_dark',
                            'handler': holder.cmdHandler,
                            'checked': function() { return holder.theme == 'pastel_on_dark'; }
                        },
                        {
                            'caption': 'Twilight',
                            'input': 'radio',
                            'id': 'theme-twilight',
                            'handler': holder.cmdHandler,
                            'checked': function() { return holder.theme == 'twilight'; }
                        }
                    ]
                }
            ]
        }, 
        {
            'caption': 'Syntax Highlight',
            'items': [
                {
                    'caption': 'C / C++',
                    'id': 'syntax-c_cpp',
                    'input': 'radio',
                    'handler': holder.cmdHandler,
                    'checked': function() { return holder.syntax == 'c_cpp'; }
                },
                {
                    'caption': 'Coffee',
                    'id': 'syntax-coffee',
                    'input': 'radio',
                    'handler': holder.cmdHandler,
                    'checked': function() { return holder.syntax == 'coffee'; }
                },
                {
                    'caption': 'CSS',
                    'id': 'syntax-css',
                    'input': 'radio',
                    'handler': holder.cmdHandler,
                    'checked': function() { return holder.syntax == 'css'; }
                },
                {
                    'caption': 'HTML',
                    'id': 'syntax-html',
                    'input': 'radio',
                    'handler': holder.cmdHandler,
                    'checked': function() { return holder.syntax == 'html'; }
                },
                {
                    'caption': 'Java',
                    'id': 'syntax-java',
                    'input': 'radio',
                    'handler': holder.cmdHandler,
                    'checked': function() { return holder.syntax == 'java'; }
                },
                {
                    'caption': 'JavaScript',
                    'id': 'syntax-javascript',
                    'input': 'radio',
                    'handler': holder.cmdHandler,
                    'checked': function() { return holder.syntax == 'javascript'; }
                },
                {
                    'caption': 'PHP',
                    'id': 'syntax-php',
                    'input': 'radio',
                    'handler': holder.cmdHandler,
                    'checked': function() { return holder.syntax == 'php'; }
                },
                {
                    'caption': 'Python',
                    'id': 'syntax-python',
                    'input': 'radio',
                    'handler': holder.cmdHandler,
                    'checked': function() { return holder.syntax == 'python'; }
                },
                {
                    'caption': 'Ruby',
                    'id': 'syntax-ruby',
                    'input': 'radio',
                    'handler': holder.cmdHandler,
                    'checked': function() { return holder.syntax == 'ruby'; }
                },
                {
                    'caption': 'XML',
                    'id': 'syntax-xml',
                    'input': 'radio',
                    'handler': holder.cmdHandler,
                    'checked': function() { return holder.syntax == 'xml'; }
                }
            ]
        }
    ];
    
    holder.addContextMenu(holder.__contextMenu, function(e) {
        if (!e.shiftKey){ 
            //console.log("Canceled");
            return false;
        }
        return true;
    });
    
    /* OVERRIDE DOMAnchors object, as a property! */
    holder._DOManchors = {};
    
    holder.__getDOMAnchors = function() {
        return holder._DOManchors;
    };
    
    holder.__setDOMAnchors = function(obj) {
        holder._DOManchors = obj;
        
        holder._DOManchors.__internal = function(w,h) {
            holder.editor.resize();
            //console.log('exec. internal domanchors!');
        }
    }
    
    delete holder.DOManchors;
    holder.__defineGetter__('DOManchors', holder.__getDOMAnchors);
    holder.__defineSetter__('DOManchors', holder.__setDOMAnchors);
    
    holder.tabIndex = 0;
    holder.addEventListener('focus', function() {
        holder.editor.focus();
    }, false);
    
    if (localStorage.ACE_EDITOR_THEME)
        holder.theme = localStorage.ACE_EDITOR_THEME;
    
    } catch (AceEditorException) {}
    
    return holder;
}