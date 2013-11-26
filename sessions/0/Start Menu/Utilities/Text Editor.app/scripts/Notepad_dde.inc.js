function Notepad_dde( app ) {
    
    console.log( "Notepad_DDE" );
    
    app.addCustomEventListener( 'dde-open', function( inodeFilePath ) {
        
        console.log( "Notepad: Open: ", inodeFilePath );

        // If file is allready opened, activate it
        for ( var i=0, len=app.files.length; i<len; i++ ) {
            if ( app.files[i]._ddePath_ == inodeFilePath ) {
                app.files[i].activate();
                return true;
            }
        }
        
        requireFS().stat( inodeFilePath, function( inodeFile ) {
        
            var fName = requireFS().getFileName( inodeFilePath );
            
            // If we cannot determine the file name, we quit
            if ( !fName ) {
                return false;
            }
            
            // Create the file...
            var file = app.createFile( fName, '' );
            
            file._ddePath_ = inodeFilePath;
            
            /* Create properties for the listener */
            ( function() {
                
                var lastWarned = ( new Date() ).getTime();
                
                Object.defineProperty( file, "lasWarned", {
                    
                    "get": function() {
                        return lastWarned;
                    },
                    
                    "set": function( dateObj ) {
                        lastWarned = dateObj.getTime();
                    }
                    
                } );
                
                file.updateWarn = function() {
                    // console.log( 'updatewarn' );
                    lastWarned = ( new Date() ).getTime();
                    file.canWarnUpdate();
                }
                
                file.canWarnUpdate = function() {
                    
                    var diff;
                    var ret = ( diff = ( new Date() ).getTime() - lastWarned ) > 500;
                    
                    // console.log( 'canwarnupdate: ', ret, diff );
                    
                    return ret;
                }
                
            } )();
            
            file.save = function() {
            
                file.updateWarn();
                
                // console.log( 'begin file save' );
                
                inodeFile.setRawData( 'utf-8', file.editor.value, function() {
                    
                    file.modified = false;
                    
                }, function( err ) {
                    
                    DialogBox("Failed to save file: " + inodeFile.name, {
                        "details": err || 'unknown error',
                        "childOf": app,
                        "modal": true,
                        "type": "error",
                        "caption": "Error saving file"
                    } );
                    
                } );

            }
            
            file.reload = function() {
            
                inodeFile.getRawData( 'utf-8', function( fileContents ) {
                    file.editor.value = fileContents;
                    file._ddeInode_   = inodeFile;
                    
                    file.updateWarn();
                    file.modified = false;
                    
                }, function( error ) {
                    file.close();
                    DialogBox("Failed to read file: " + inodeFilePath, {
                        "type": "error",
                        "childOf": app
                    } );
                    
                    file.updateWarn();
                    
                } );
            
            }
            
            file.inode = inodeFile;
            
            file.reload();
            
            /* Load file ... */
            
        }, function( error ) {
            
            DialogBox("Notepad: Failed to open file '" + inodeFilePath + "'", {
                "childOf": dlg,
                "type": "error",
                "details": error || "Unknown fs error"
            } );
            
        } );
    
        return true;
        
    } );
    
    /* Add a listener to filesystem in order to update the files in editor
       if they are modified somewhere else in the filesystem */
    
    var listener = function( fsentry ) {
        
        console.log("Notepad.fsNotifier: ", fsentry );
        
        var ef = null;
                
        for ( var i=0, len=app.files.length; i<len; i++ ) {
            
            if ( app.files[i]._ddePath_ == fsentry.path ) {
                ef = app.files[i];
                break;
            }
            
        }
            
        if ( !ef )
            return true;
        
        switch ( fsentry.type ) {
            
            case 'remove':
                
                if ( ef.deleteWarningOpened )
                    return;
                
                ef.deleteWarningOpened = true;
                
                DialogBox("File " + fsentry.path + "\nhas been removed by another process or user", {
                    "type": "warning",
                    "buttons": {
                        "Save file": function() {
                            ef.deleteWarningOpened = false;
                            ef.save();
                        },
                        "Close file": function() {
                            ef.deleteWarningOpened = false;
                            ef.close();
                        },
                        "Ignore": function() {
                            ef.deleteWarningOpened = false;
                        }
                    },
                    "childOf": app,
                    "caption": "Notepad - file deleted"
                });
            
                break;
            
            case 'update':
            
                if ( !ef.canWarnUpdate() || ef.updateWarningOpened ) {
                    return;
                }
            
                ef.updateWarningOpened = true;
            
                DialogBox("File " + fsentry.path + "\nhas ben updated by another process or user", {
                    "type": "warning",
                    "buttons": {
                        "Reload file": function() {
                            ef.updateWarningOpened = false;
                            ef.reload();
                        },
                        "Save file": function() {
                            ef.updateWarningOpened = false;
                            ef.save();
                        },
                        "Ignore": function() {
                            ef.updateWarningOpened = false;
                            ef.updateWarn();
                        }
                    },
                    "childOf": app,
                    "caption": "Notepad - file changed"
                } );
            
                break;
            
        }
        
    }
    
    requireFS().addFSNotifier( listener );
    
    app.addCustomEventListener( 'destroy', function( ) {
    
        requireFS().removeFSNotifier( listener );
    
        return true;
    } );
}