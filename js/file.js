function StringRegexParser( str, asString ) {
    if (!str)
        return asString ? '/^/' : /^/;
    
    asString = typeof asString == 'undefined' ? true : !!asString;
    
    if ( str instanceof RegExp )
        return asString ? str.toString() : str;
    
    var s = str.toString(), matches;
    
    if ( matches = /\/([^*]+)?\/([gi]+)?/.exec( s ) ) {
        try {
            var r = new RegExp( matches[1] || '', matches[2] || '' );
            return asString ? r.toString() : r;
        } catch (e) {
            console.warn("String: " + str + " is not a valid regex!");
            return asString ? '' : /^/;
        }
    } else {
        try {
            var r = new RegExp( s );
            return asString ? s : r;
        } catch (e) {
            console.warn("String: " + str + " is not a valid regex!");
            return asString ? '' : /^/;
        }
    }
}

/* param: settings: Object {
        "maxSize"       : integer
        "mime"          : string( regularExpression ) or regularExpression
        "fileNameRegex" : string( regularExpression ) or regularExpression
        "dataType"      : string( binary | base64 | text )
        "destination"   : string( server | memory )
        "disabled"      : boolean
   } 
*/

function DOMFile( settings ) {
    var holder = $('div', 'DOMFile'),
        settings = settings || {},
        handler = 'sessions/0/lib/file-uploader/handler.php';
    
    EnableCustomEventListeners( holder );
    
    var input;
    
    var label = holder.appendChild(
        $('div', 'label')
    );
    
    var loadPercent;
    
    ( function() {
        var disabled = false;
        
        Object.defineProperty( holder, 'disabled', {
            "get": function() {
                return disabled;
            },
            "set": function( boolVal ) {
                ( ( disabled = !!boolVal ) ? addStyle : removeStyle )( holder, 'disabled' );
            }
        } );
    } )();
    
    var controller = {
        "chunks": [],
        "chunkIndex": 0,
        "aborted": false,
        "isReading": false,
        "serverID": false,
        "setChunks": function( chunks ) {
            controller.chunks = chunks;
            controller.chunkIndex = 0;
            controller.serverID = false;
            
            //console.log("Set chunks: ", controller.chunks );
            
            controller.isReading = true;

            holder.addClass( 'is-reading' );
            
            if ( chunks.length )
                controller.readNext();
            else {
                if ( holder.destination == 'memory' )
                    value = '';
                controller.ready();
            }
            
            controller.serverID = fopen( holder.file.name );
        },
        "abort": function( reason ) {
            controller.aborted = true;
            
            controller.isReading = false;
            holder.removeClass( 'is-reading' );
            
            holder.caption = reason || 'unknown error';
            label.appendChild( $('a').setHTML('ok').setAttr('src', 'javascript: ;').setAttr('style', 'position: absolute; color: red; cursor: pointer; display: block; right: 10px; top: 0px; background-color: white;') ).onclick = function() {
                controller.ready();
                progress.value = 0;
                holder.caption = '';
            };
            
            holder.onCustomEvent('error', {
                "reason": reason || 'unknown error'
            } );
            
        },
        "ready": function() {
            controller.isReading = false;
            holder.removeClass( 'is-reading' );
            controller.aborted = false;
            progress.maxValue = 100;
            progress.value = 100;
            
            if ( holder.file )
                holder.caption = holder.file.name + ' (' + holder.file.size + ' bytes)';
            
            if ( input && input.parentNode )
                input.parentNode.removeChild( input );
            
            input = holder.appendChild( $('input').setAttr('type', 'file').setAttr('title', 'Load a single file') );

            input.addEventListener('change', function(e) {
                if (!window.File || !window.FileReader || !window.FileList || !window.Blob ) {
                    holder.caption = "HTML5 File support not detected!";
                    return;
                }
        
                var files = e.target.files;
                if (!files.length)
                    return;
        
                holder.file = files[0];
                
            }, true );
            
        },
        "readNext": function() {
            
            if ( controller.aborted )
                return;
            
            if ( controller.chunkIndex == 0 ) {
                value = null;
                input.disabled = true;
            }
        
            ( new FileReader() ).chain( function() {

                this.addEventListener('load', function(e) {
                //console.log( "Loaded chunk: ", controller.chunks[ controller.chunkIndex ] );

                    if (!controller.aborted )
                        controller.onCustomEvent('receive', e.target.result );

                    progress.value = controller.chunks[ controller.chunkIndex ].stop;
                    loadPercent = ( controller.chunks[ controller.chunkIndex ].stop / ( holder.file.size / 100 ) ) >> 0;
                
                    holder.onCustomEvent( 'progress', {
                        "total": holder.file.size,
                        "current": controller.chunks[ controller.chunkIndex ].stop,
                        "percent": loadPercent
                    } );
                
                    holder.caption = holder.file.name + ' (' + loadPercent + '%)';
                
                    label.appendChild( $('a').setHTML('cancel').setAttr('src', 'javascript: ;').setAttr('style', 'position: absolute; color: red; cursor: pointer; display: block; right: 10px; top: 0px; background-color: white;') ).onclick = function() {
                        controller.abort('Transfer canceled!');
                        progress.value = 0;
                    };
                
                    write( e.target.result, function() {
                        setTimeout( function() {
                            if ( controller.chunkIndex < controller.chunks.length - 1 ) {
                                if ( !controller.aborted ) {
                                    controller.chunkIndex++;
                                    controller.readNext();
                                }
                            } else {
                            
                                if ( !controller.aborted ) {
                            
                                    if ( holder.destination == 'memory' && holder.dataType == 'base64' ) {
                                        value = 'data:' + ( holder.file ? holder.file.type : '' ) + ';base64,' + value;
                                    }
                                    
                                    if ( holder.destination == 'memory' && holder.dataType == 'binary' )
                                        value = atob( value );
                                
                                    controller.isReading = false;
                                
                                    if (!holder.onCustomEvent('change'))
                                        controller.abort("File could not be processed");
                                    else 
                                        controller.ready();
                                }
                            }
                        }, 50 );
                    } );
                }, true);

                switch (holder.dataType) {
                    case 'text':
                        this.readAsText( holder.file.slice( controller.chunks[ controller.chunkIndex ].start, controller.chunks[ controller.chunkIndex ].stop ) );
                        break;
                    case 'binary':
                        this.readAsDataURL( holder.file.slice( controller.chunks[ controller.chunkIndex ].start, controller.chunks[ controller.chunkIndex ].stop ) );
                        break;
                    case 'base64':
                        this.readAsDataURL( holder.file.slice( controller.chunks[ controller.chunkIndex ].start, controller.chunks[ controller.chunkIndex ].stop ) );
                        break;
                }
            } );
            
            return true;
        }
    };
    
    var fopen = function( fileName ) {
    
        if ( holder.destination == 'memory' )
            return null;
    
        var req = [];
        req.addPOST( 'do', 'fopen');
        req.addPOST( 'name', fileName || '' );
        var data = $_POST( handler, req );
        
        if (!data) {
            controller.abort("NULL webservice response");
            return null;
        }
        
        try {
            data = JSON.parse( data );
        } catch (e) {
            controller.abort("Unparseable webservice response: " + data);
            return null;
        }
        
        if ( !data ) {
            controller.abort("Bad webservice fopen file id!");
            return null;
        }
        
        // console.log( "Webservice: ", data );
        return data;
    }
    
    EnableCustomEventListeners( controller );
    
    ( function(){
        
        var caption = '';
        Object.defineProperty( holder, 'caption', {
            "get": function() {
                return caption;
            },
            "set": function( str ) {
                label.innerHTML = '';
                label.appendChild( $text( str ) );
            }
        });
        
    })();
    
    var progress = holder.appendChild(
        new ProgressBar({
            "value": 0,
            "minValue": 0,
            "maxValue": 100
        })
    );
    
    ( function() {
        var mime = false;
        
        Object.defineProperty( holder, "mime", {
            "get": function() {
                return !!mime ? mime.toString() : '';
            },
            "set": function( mimeStringRegularExpression ) {
                if ( controller.isReading )
                    controller.abort( "Input properties changed!" );
                mime = StringRegexParser( mimeStringRegularExpression );
            }
        });
    } )();
    
    ( function() {
        var fileNameRegex = false;
        
        Object.defineProperty( holder, "fileNameRegex", {
            "get": function() {
                return !!fileNameRegex ? fileNameRegex.toString() : '';
            },
            "set": function( str ) {
                if ( controller.isReading )
                    controller.abort( "Input properties changed!" );
                fileNameRegex = StringRegexParser( str );
            }
        } );
        
    } )();
    
    ( function() {
        var maxSize = 8 * 1024 * 1024;
        
        Object.defineProperty( holder, "maxSize", {
            "get": function() {
                return maxSize;
            },
            "set": function( intVal ) {
                if ( controller.isReading )
                    controller.abort( "Input properties changed!" );
                var v = parseInt( intVal );
                maxSize = isNaN( v ) || ( v < 0 ) ? 0 : v;
            }
        } );
    } )();
    
    ( function() {
        var dataType = 'text';
        
        Object.defineProperty( holder, "dataType", {
            "get": function() {
                return dataType;
            },
            "set": function( str ) {
                if ( controller.isReading )
                    controller.abort( "Input properties changed!" );
                switch (str) {
                    case 'text':
                    case 'binary':
                    case 'base64':
                        dataType = str;
                        break;
                    default:
                        throw "Bad file dataType: " + str + ". Allowed only: text, binary, dataURI!";
                        break;
                }
            }
        } );
    } )();
    
    ( function(){
        var destination = 'memory';
        
        Object.defineProperty( holder, "destination", {
            "get": function() {
                return destination;
            },
            "set": function( str ) {
                if ( controller.isReading )
                    controller.abort( "Input properties changed!" );
                var s = str.toString();
                if ( [ 'memory', 'server' ].indexOf( str ) == -1 )
                    throw "Invalid destination: '" + str + "' !";
                destination = s;
                if ( destination == 'server' )
                    holder.dataType = 'binary';
            }
        } );
    } )();
    
    var value = null;
    
    var write = function( data, readyCallback ) {
        
        if ( [ 'binary', 'base64' ].indexOf( holder.dataType ) >= 0 )
            data = data.split( 'base64,' ).last();
        
        if ( holder.destination == 'memory' ) {
            value = ( null == value ) ? data : value + data;
            readyCallback();
        } else {
            var req = [];
            req.addPOST( 'do', 'fwrite');
            req.addPOST( 'data', data );
            req.addPOST( 'file', controller.serverID );
            
            data = '';
            
            $_POST( handler, req, function( rsp ) {
                if ( rsp != 'ok' ) {
                    controller.abort( rsp || 'could not write to server' );
                    return;
                } else {
                    readyCallback();
                }
            } );
        }
    };
    
    Object.defineProperty( holder, 'value', {
        "get": function() {
            if ( controller.isReading )
                return null;
            else
                return value;
        },
        "set": function() {
            throw "ReadOnly property";
        }
    } );
    
    ( function() {
        var file = null;
        
        Object.defineProperty( holder, "file", {
            "get": function() {
                return file;
            },
            "set": function( fileObj ) {
            
                if ( controller.isReading )
                    controller.abort( "Input properties changed!" );

            
                if ( !fileObj || !( fileObj instanceof File ) ) {
                    holder.onCustomEvent('error', { "reason": "File is too big" } );
                    throw "Bad file object!";
                }
                
                /* Check file size */
                
                if ( holder.maxSize && fileObj.size > holder.maxSize ) {
                    holder.caption = "File too large ( max = " + holder.maxSize.toSize() + ' )';
                    holder.onCustomEvent('error', { "reason": "File is too big" } );
                    return;
                }
                
                if ( !StringRegexParser( holder.mime, false ).test(( fileObj.type || '' )) ) {
                    holder.caption = "Bad file type!";
                    holder.onCustomEvent('error', { "reason": "The mime-type of the file did not matched a filter" } );
                    return;
                }
                
                if ( holder.destination == 'server' && holder.dataType != 'binary' ) {
                    holder.caption = "Data type mismatch (server needs binary dataType)";
                    holder.onCustomEvent('error', { "reason": "When uploading to server, you need a binary data type" } );
                    return;
                }
                
                if ( !StringRegexParser( holder.fileNameRegex, false ).test(( fileObj.name || '' ) ) ) {
                    holder.caption = "Bad file name or extension!";
                    holder.onCustomEvent('error', { "reason": "The name of the file did not matched a filter" } );
                    return;
                }
                
                file = fileObj;
                
                holder.caption = file.name + ' (0%)';
                progress.value = 0;
                progress.maxValue = file.size;
                
                // Read file in chunks of 4 MB
                var chunks = [];
                var chunkSize = ( 1024 * 1024 * ( holder.destination == 'memory' ? 32 : 0.1 ) ) >> 0;
                var chunkRead = 0;
                
                while ( chunkRead < file.size - 1 ) {
                    chunks.push( {
                        "start": chunkRead,
                        "stop" : Math.min( ( function() { chunkRead += chunkSize; return chunkRead; } )(), file.size )
                    } );
                }
                
                controller.setChunks( chunks );
                
                //delete chunks;
                chunks = undefined;
                
                //console.log("Send : " + chunks.length + " chunks to server");
                
            }
        } );
        
    } )();
    
    Object.defineProperty( holder, "fileName", {
        "get": function() {
            if ( holder.file )
                return holder.file.name;
            else
                return null;
        }
    } );
    
    Object.defineProperty( holder, "fileSize", {
        "get": function() {
            if ( holder.file )
                return holder.file.size;
            else
                return null;
        }
    } );
    
    Object.defineProperty( holder, "fileMime", {
        "get": function() {
            if ( holder.file )
                return holder.file.type || 'unknown';
            else
                return null;
        }
    } );
    
    Object.defineProperty( holder, "serverPath", {
        "get": function( ) {
             if ( controller.isReading )
                return null;
            return JSON.parse( JSON.stringify( controller.serverID ) );
        }
    } );
    
    holder.abort = function( reason ) {
        if ( controller.isReading )
            controller.abort( reason || 'Aborted at user request' );
    }
    
    controller.ready();
    progress.value = 0;
    
    if ( typeof settings.maxSize != 'undefined' )
        holder.maxSize = settings.maxSize;
    
    if ( typeof settings.mime != 'undefined' )
        holder.mime = settings.mime;
    
    if ( typeof settings.fileNameRegex != 'undefined' )
        holder.fileNameRegex = settings.fileNameRegex;
    
    if ( typeof settings.dataType != 'undefined' )
        holder.dataType = settings.dataType;
    
    if ( typeof settings.destination != 'undefined' )
        holder.destination = settings.destination;
    
    if ( typeof settings.disabled != 'undefined' )
        holder.disabled = !!settings.disabled;
    
    holder.oncontextmenu = function(e) {
        cancelEvent(e);
    }
    
    return holder;
}

function DOMMultipleFile( settings ) {
    
    var holder = $('div', 'DOMMultipleFile' );
    
    EnableCustomEventListeners( holder );
    
    var input1 = holder.appendChild( $('input').setAttr('type', 'file').setAttr('multiple', 'multiple').addClass('btn-file').setAttr('title', 'Upload file(s)') );
    var input2 = holder.appendChild( $('input').setAttr('type', 'file').setAttr('multiple', 'multiple').addClass('btn-dir').setAttr('webkitdirectory', '').setAttr('mozdirectory', '').setAttr('directory','').setAttr('title', 'Upload a Folder') );
    
    var list = holder.appendChild( $('div', 'filesList' ) );
    
    var filesStack = [];
    
    Object.defineProperty( holder, 'files', {
        "get": function( ) {
            return filesStack;
        },
        "set": function( arr ) {
            for ( var i=0, len = arr.length; i<len; i++ ) {
                if ( ['.', '..'].indexOf( arr[i].name ) == -1 )
                    filesStack.push( arr[i] );
                //console.log( "Added file: ", arr[i] );
            }
            next();
        }
    } );
    
    holder.addEventListener( 'dragover', function( e ) {
        cancelEvent( e );
        e.dataTransfer.dropEffect = 'copy';
    }, false );
    
    holder.addEventListener( 'drop', function(e) {
        cancelEvent( e );
        var files = e.dataTransfer.files;
        if ( !files || !files.length )
            return;
        holder.files = files;
    }, false );
    
    input1.addEventListener('change', function( e ) {
        holder.files = e.target.files || [];
        input1.value = null;
    }, false );

    input2.addEventListener('change', function( e ) {
        var i = e.target.files || [];
        var buttons = {};
        
        var totalSize = 0;
        
        for ( var j=0,len=i.length; j<len; j++ )
            totalSize += ( i[j].size || 0 );
        
        totalSize = totalSize.toSize();
        
        buttons[ "<b>Add " + i.length + " file" + (i.length > 1 ? "s" : "") + " (" + totalSize + ")</b> " ] = function() {
                    holder.files = i;
                    input2.value = null;
        };
        
        
        buttons[ "Ooops, cancel that!" ] = function() {
                    
        }
        
        DialogBox("You are about to add the whole contents of a folder from your\ncomputer, containing " + i.length + " files.", {
            "type": "warning",
            "childOf": getOwnerWindow( holder ),
            "buttons": buttons,
            "caption": "Warning"
        });
    }, false );
    
    var running = false;
    
    var timestamp = function() {
        return '[' + ( new Date() ).toString('%H:%i:%s') + ']';
    }
    
    var caption = holder.appendChild( $('div', 'label' ).setHTML('Click on "Choose files" or drop files in this box' ) );

    var bytesTotal = 0;
    var bytesUploaded = 0;
    var bytesRejected = 0;
    var filesAdded = 0;
    var filesGood = 0;
    var filesBad = 0;
    var filesRemaining = 0;
    var bytesCurrent = 0;
    
    var updateStatus = function() {
        caption.innerHTML = '<div><b title="Total transfered size" style="color: black">Total</b>: ' + ( bytesTotal + bytesCurrent ).toSize() + '</div>' +
                            '<div><b title="USEFULL UPLOAD SIZE" style="color: green">Ok</b>: ' + bytesUploaded.toSize() + '</div>' +
                            '<div><b title="GARBAGE UPLOAD SIZE" style="color: red">Fail</b>: ' + bytesRejected.toSize() + '</div>';
    }
    
    var next = function() {
    
        updateStatus();
    
        if ( running )
            return;
    
        if (!filesStack.length) {
            running = false;
            return;
        }
        
        running = true;
        
        var f = filesStack.shift(), 
            current = new DOMFile( settings );
        
        console.log("File settings: ", settings );
        
        list.appendChild( current );
        
        current.scrollIntoViewIfNeeded();
        
        current.addCustomEventListener( 'progress', function( data ) {
            bytesCurrent = data.current;
            updateStatus();
            return true;
        } );
        
        current.addCustomEventListener( 'change', function() {
            
            if (!holder.onCustomEvent( 'change', {
                "file": current
            } ) ) return false;
            
            bytesUploaded += f.size;
            bytesTotal += f.size;
            filesGood ++;
            bytesCurrent = 0;
            
            updateStatus();
            
            current.addAfter( $('p', 'succes').setHTML( timestamp() + ' <b>' + f.name.htmlEntities() + '</b> (' + f.size.toSize() + ')' ) );
            
            current.parentNode.removeChild( current );
            //delete current;
            current = undefined;
            
            running = false;
            
            if ( !filesStack.length )
                list.appendChild( $('p', 'info').setHTML( timestamp() + ' All transfers are complete!' ) ).scrollIntoViewIfNeeded();
            
            next();
            
            return true;
            
        } );
        
        current.addCustomEventListener( 'error', function( data ) {
            current.addAfter( $('p', 'error').setHTML(timestamp() + ' <b>' + f.name.htmlEntities() + '</b>: ' + data.reason.htmlEntities() ) );
            current.parentNode.removeChild( current );
            
            bytesRejected += f.size;
            bytesTotal += f.size;
            filesBad ++;
            bytesCurrent = 0;

            updateStatus();
            
            holder.onCustomEvent( 'error', {
                "file": f,
                "reason": data.reason
            } );
            
            //delete current;
            current = undefined;

            running = false;

            if ( !filesStack.length )
                list.appendChild( $('p', 'info').setHTML( timestamp() + ' All transfers are complete!' ) ).scrollIntoViewIfNeeded();

            next();

            return true;
        } );
        
        current.disabled = true;
        current.file = f;
    };
    
    list.addContextMenu([
        {
            "caption": "Clear",
            "handler": function() {
            
                bytesTotal = 0;
                bytesUploaded = 0;
                bytesRejected = 0;
                filesAdded = 0;
                filesGood = 0;
                filesBad = 0;
                filesRemaining = 0;
                bytesCurrent = 0;
            
                updateStatus();
            
                for ( var i=0,items=list.querySelectorAll('p'),n=items.length; i<n; i++ )
                    items[i].parentNode.removeChild( items[i] );
            }
        },
        {
            "caption": "Abort all transfers",
            "handler": function() {
                
                if (!filesStack.length && !list.querySelectorAll('.DOMFile').length) {
                    DialogBox("No transfers are currently in progress!", {
                        "type": "info",
                        "childOf": getOwnerWindow( holder )
                    });
                    return;
                }
                
                DialogBox("Are you sure you want to cancel all operations?", {
                    "type": "question",
                    "childOf": getOwnerWindow( holder ),
                    "modal": true,
                    "buttons": {
                        "Abort All": function() {
                            running = false;
                            
                            while ( filesStack.length > 0 ) {
                                list.appendChild( $('p', 'error' ) ).setHTML( timestamp() + ' File <b>' + filesStack[0].name.htmlEntities() + '</b> was aborted' );
                                filesStack.splice(0,1);
                                bytesRejected += filesStack.size;
                                bytesTotal += fileStack.size;
                            }
                
                            /* Place an abort for each file remained in stack */
                            for ( var i=0,items=list.querySelectorAll('.DOMFile'),n=items.length; i<n; i++ ) {
                                items[i].abort(timestamp() + " Aborted by user!");
                                
                            }
                
                            updateStatus();
                            
                        },
                        "No, I'll wait": function() {
                            
                        }
                    }
                });
                
                
            }
        }
    ]);
    
    return holder;

}