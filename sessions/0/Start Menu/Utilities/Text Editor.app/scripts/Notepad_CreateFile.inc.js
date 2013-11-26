function Notepad_CreateFile( app ) {
    
    setTimeout( function( ) {
        app.tabs.addCustomEventListener( 'tab-close', function( tab ) {
        
            if ( app.closeNoWarn )
                return true;
            
            var file = tab.getSheet().parentNode;
            
            if ( !file.modified ){
                file.onClose();
                return true;
            }
            
            if ( file.closeNoWarn ) {
                file.onClose();
                return true;
            }
        
            DialogBox("Close file '" + file.name + "' without saving it first?", {
                "buttons": {
                    "Close without saving": function() {
                        file.closeNoWarn = true;
                        file.close();
                    },
                    "Cancel": function() {
                        // Do nothing
                    }
                },
                "caption": "Close unsaved file | Notepad",
                "childOf": app,
                "modal": true
            });
        
            return false;
        } );

    }, 100 );
    
    var currentFile = null;
    
    Object.defineProperty( app, "currentFile", {
        "get": function( ) {
            return currentFile;
        },
        "set": function( f ) {
            currentFile = f;
            
            if ( f ) {
                
                // console.log( 'syntax: "' + f.editor.syntax + '"' );
                
                switch ( f.editor.syntax ) {
                    case 'javascript':
                        app.menu.getItem( 'JavaScript' ).querySelector('input').checked = true;
                        break;

                    case 'css':
                        app.menu.getItem( 'Css' ).querySelector('input').checked = true;
                        break;

                    case 'php':
                        app.menu.getItem( 'Php' ).querySelector('input').checked = true;
                        break;

                    case 'html':
                        app.menu.getItem( 'Html' ).querySelector('input').checked = true;
                        break;
                    
                    default:
                        app.menu.getItem( 'No Syntax' ).querySelector('input').checked = true;
                        break;
                    
                }
                
            } else {
                app.menu.getItem( 'No Syntax' ).querySelector('input').checked = true;
                
            }

            if ( app.finder && !f ) {
                app.finder.close();
            }
        }
    } );
    
    app.createFile = function( fileName, contents ) {
    
        var file = app.tabs.addTab({"caption": fileName || "New file", "closeable": true });
        
        file.editor = file.insert(
            (new AceEditor()).setAttr("style", "position: absolute; left: 0px; top: 0px")
                .setAnchors({
                    "width": function(w,h) {
                        return w + "px";
                    },
                    "height": function(w,h) {
                        return h + "px";
                    }
                })
        );
        
        if ( typeof contents != 'undefined' )
            file.editor.value = contents;
        
        ( function() {
            
            Object.defineProperty( file, "tab", {
                "get": function() {
                    return file.getTab();
                }
            } );
            
            file.tab.addEventListener( 'focus', function() {
                file.editor.editor.focus();
            }, true );
            
        } )();
        
        ( function() {

            var modified = false;
            
            file.editor.editor.on('change', function() {
                modified = true;
            });
            
            Object.defineProperty( file, "modified", {
                "get": function() {
                    return modified;
                },
                "set": function( b ) {
                    modified = !!b;
                }
            } );
        
        } )();
        
        ( function() {
        
            var readOnly = false;
            
            Object.defineProperty( file, "readOnly", {
                "get": function() {
                    return readOnly;
                },
                
                "set": function(b) {
                    readOnly = !!b;
                    file.editor.editor.setReadOnly( readOnly );
                }
            } );
        
        } )();
        
        ( function() {
            
            var wordWrap = false;
            
            Object.defineProperty( file, "wordWrap", {
                "get": function() {
                    return wordWrap;
                },
                "set": function( b ) {
                    wordWrap = !!b;
                    file.editor.editor.getSession().setUseWrapMode( wordWrap );
                }
            } );
            
        } )();
        
        file.close = function() {
            file.tab.close();
        };
        
        file.activate = function() {
            file.tab.click();
            file.editor.editor.focus();
            app.currentFile = file;
        }
        
        Object.defineProperty( file, "name", {
            "get": function() {
                return fileName;
            },
            "set": function( s ) {
                fileName = s;
                file.getTab().caption = s;
            }
        } );
        
        file.getTab().addCustomEventListener( 'activate', function() {
            app.currentFile = file;
            return true;
        });
        
        file.onClose = function() {
            for ( var i=0, len=app.files.length; i<len; i++ ) {
                if ( app.files[i] == file ) {
                    app.files.splice( i, 1 );
                    setTimeout( function() {
                        
                        if ( !app.tabs.tabs.length ) {
                            app.currentFile = null;
                        } else {
                            app.currentFile.editor.focus();
                        }
                        
                    }, 100 );
            
                    break;
                }
            }
            
            //console.log( "On close" );
        }
        
        file.save = function() {
            
            var $namespace = {};
        
            var $export = function(objectID, objectData) {
                $namespace[objectID] = objectData;
                return objectData;
            };
            var $import = function(objectID) {
                return $namespace[objectID] || (function() {
                    throw "Namespace " + objectID + " is not defined (yet?)";
                })();
            };
            var $pid = getUID();
        
            var dlg = $export("0001-dlg", (new Dialog({
                "alwaysOnTop": false,
                "appIcon": "",
                "caption": "Save File to Your Computer",
                "closeable": true,
                "height": 115,
                "maximizeable": true,
                "maximized": false,
                "minHeight": 50,
                "minWidth": 50,
                "modal": true,
                "moveable": true,
                "resizeable": false,
                "scrollable": false,
                "visible": true,
                "width": 337,
                "childOf": app
            })).chain(function() {
                Object.defineProperty(this, "pid", {
                    "get": function() {
                        return $pid;
                    }
                });
                this.addClass("PID-" + $pid);
            }));
        
            $export("0001-lbl", (new DOMLabel("File Name:")).setAttr("style", "top: 20px; left: 10px; width: 70px; position: absolute; text-overflow: ellipsis"));
        
            var fileName = $export("0001-text", (new TextBox( file.name )).setAttr("style", "top: 15px; left: 80px; position: absolute; margin: 0").setProperty("placeholder", "My File").setAnchors({
                "width": function(w, h) {
                    return w - 95 + "px";
                }
            }));
        
            $export("0001-btn", (new Button("Cancel", (function() {
                dlg.close();
                dlg.purge();
            }))).setAttr("style", "right: 10px; bottom: 10px; position: absolute"));
        
            $export("0002-btn", (new Button("Save", (function() {
                dlg.appHandler( 'cmd_save' );
            }))).setAttr("style", "bottom: 10px; right: 70px; position: absolute"));
        
            $import("0001-dlg").insert($import("0001-lbl"));
            $import("0001-dlg").insert($import("0001-text"));
            $import("0001-dlg").insert($import("0001-btn"));
            $import("0001-dlg").insert($import("0002-btn"));
        
            Keyboard.bindKeyboardHandler( dlg, "esc", function() {
                dlg.close();
                dlg.purge();
            } );
        
            Keyboard.bindKeyboardHandler( dlg, "enter", function() {
                dlg.appHandler( 'cmd_save' );
            } );
        
            dlg.handlers.cmd_save = function() {
                if ( fileName.value == '' )
                    return;
                
                var request = [];
                
                request.addPOST( 'cfg', JSON.stringify({
                    "encType": "base64",
                    "contentType": ( function() {
                        switch ( file.editor.syntax ) {
                        
                            case 'javascript':
                                return "text/javascript";
                                break;
                            case 'css':
                                return "text/css";
                                break;
                            case 'php':
                                return "application/php";
                                break;
                            case 'html':
                                return "text/html";
                                break;

                            default:
                                return "text/plain";
                                break;
                        }
                    } )(),
                    "name": fileName.value
                }) );
                
                request.addPOST( "data", btoa( file.editor.value ) );
                
                $_FORM_POST( 'out/', request );
                
                file.name = fileName.value;
                
                dlg.close();
                dlg.purge();
                
                file.modified = false;
            }
        
            setTimeout(function() {
                dlg.paint();
                dlg.ready();
                
                fileName.focus();
                fileName.select();
            }, 1);
        
            return dlg;
        
        }
        
        file.editor.editor.renderer.setShowGutter( app.lineNumbers );
        file.editor.editor.renderer.setShowPrintMargin( app.printMargins );
        
        app.files.push( file );
        
        setTimeout( function( ) { file.activate(); }, 10 );
        
        window.f = file;
        
        return file;
    }
    
}