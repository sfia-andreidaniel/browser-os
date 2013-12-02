/* Websocket terminal webserver module */

exports.upgradeWebserver = true;

var WebSocketServer = require('websocket').server;

var wsServer;

function originIsAllowed( origin ) {
    console.log("Request from origin: ", origin );
    return true;
}

function hexPad( s ) {
    return s.length == 2 ? s : '0'+s;
}

function buffHex( buffer ) {

    var out = '';

    for ( var i=0,len=buffer.length; i<len; i++ )
        out = out + hexPad( buffer.charCodeAt( i ).toString( 16 ) );

    return out;
}

function decodeHexString( str ) {
    var i = 0,
        n = str.length,
        len = n/2,
        buffer = new Buffer( len );

    for ( var i=0; i<len; i++ ) {
        buffer.writeUInt8(parseInt( str.substr( i * 2, 2 ), 16 ), i );
    }
    
    return buffer;
}

var url = require('url'),
    spawn = require('pty.js').spawn,
    fs = require('fs');

var onServerUpgrade = function() {
    
    wsServer.on('request', function(request) {
        
        if (!originIsAllowed( request.origin ) ) {
            request.reject();
            console.log("request rejected from origin: ", request.origin );
            return;
        }
        
        var connection = request.accept( 'terminal', request.origin );
        
        console.log( 'connection accepted!' );
        
        // request url information
        var urlinfo = url.parse( request.resourceURL.path, true );
        // spawn process binary path
        var pathName = require('base64').decode( urlinfo.pathname.replace(/^\//, '' ) ); /* ' mc bug */
        
        console.log( "Process: '" + pathName + "'" );
        
        // spawn process arguments
        var args = urlinfo.query ? ( urlinfo.query.args || '[]' ) : '[]';
        
        /* SSH Support. If we pass a ?remoteHost=... in websocket URL, the command will be executed
         * via SSH on that host instead on this host.
         **/
        var remoteHost          = urlinfo.query ? ( urlinfo.query.remoteHost || null ) : null;
        var remotePort          = 22;
        var remoteUser          = '';
        var remotePassword      = '';
        var remoteAuthenticated = false;
        var remotePasswordSent  = false;
        
        if ( remoteHost )
            (function() {
                // if the remote host is in format ...:<port>, we parse the port
                // and correct the remote host
                var matches;
                if ( !!( matches = /\:([\d]+)/.exec( remoteHost ) ) ) {
                    remoteHost = remoteHost.replace( /\:[\d]+$/, '' );
                    remotePort = parseInt( matches[1] );
                }
            })();
        
        var frameId       = 0;    //currently received frame id
        var tty           = null; // tty process pointer
        var securetty     = null; // secure tty.
        var cols          = 80;   // current terminal number of columns
        var lines         = 25;   // current terminal number of rows
        var user          = '';
        var password      = '';
        var authenticated = false;
        var cwd           = urlinfo.query ? ( urlinfo.query.cwd || '' ) : '';
        
        // try to parse arguments
        try {
            args = JSON.parse( args );
            
            if ( !args || !( args instanceof Array ) )
                throw "Bad process arguments!";
            
            for( var i=0,len=args.length; i<len; i++ )
                if ( typeof args[i] != 'string' )
                    throw "Invalid argument type detected!";
            
        } catch (e) {
            /* Could not parse process arguments */
            request.reject();
            return;
        }
        
        /* Test if process bin path exists */
        /*
        try {
            
            if ( !fs.lstatSync( pathName ).isFile() )
                throw "File not found!";
            
        } catch (e) {
            request.reject();
            return;
        }
        */
        
        /* Spawn process */
        
        var send = function( data ) {
            connection.sendUTF( JSON.stringify( data ) );
        }
        
        /* Bool ( ok - frame executed, false - frame not executed */
        var execFrame = function( frameData, frameType ) {

            frameType = frameType || null;

            if ( frameType !== null && frameData.type != frameType )
                return false;
            
            switch ( frameData.type ) {
                case 'connect':
                    
                    if ( typeof frameData.data.lines != 'number' ||
                         typeof frameData.data.cols != 'number' ||
                         frameData.data.lines < 0 ||
                         frameData.data.cols < 0 ||
                         !frameData.data.user ||
                         !frameData.data.password
                    ) return false;
                    
                    cols = frameData.data.cols  || null;
                    lines = frameData.data.lines  || null;
                    user = frameData.data.user;
                    password = frameData.data.password;
                    
                    if ( remoteHost !== null ) {
                        // If we're connecting to a remote host, we're also requiring
                        // in the connect packet two additional fields:
                        // - remoteUser
                        // - remotePassword
                        
                        if ( !frameData.data.sshUser ||
                             !frameData.data.sshPassword
                        ) return false;
                        
                        remoteUser = frameData.data.sshUser;
                        remotePassword = frameData.data.sshPassword;
                        
                    }
                    
                    //console.log( "Connect: cols=", cols, "lines=", lines );
                    //console.log( "Authenticating ( " + user + ")");
                    
                    require('authenticate-pam').authenticate( user, password, function( result ) {
                        //if ( !result )
                        console.log("LOCAL Authentication status: " + ( !result ? "OK" : "FAILED"));
                        
                        authenticated = !!!result;
                        
                        if ( remoteHost === null ) {
                            
                            // we're doing a local command execution
                            
                            if (authenticated) {
                                send({"type": "auth", "data": true });
                            } else {
                                send({"type": "auth", "data": false, "bad": "PAM"});
                            }

                            if ( authenticated ) 
                                spawnProcess(); 
                            else 
                                request.reject();
                        
                        } else {
                            // We're doing a ssh connect
                            spawnSSHProcess();
                        }
                    });
                    
                    return true;
                    break;

                case 'input':
                    if ( frameData.data && tty )
                        tty.write( decodeHexString( frameData.data ) );
                    break;
                
                case 'resize':
                    cols = frameData.data.cols;
                    lines= frameData.data.lines;
                    
                    if ( tty )
                        tty.resize( cols, lines );
                    // console.log("Resize: ", cols, lines, frameData.data );
                    break;

                default:
                    // unknown frame data type
                    return false;
            }
        }
        function escapeshellarg (arg) {
            var ret = '';
                    
            ret = arg.replace(/[^\\]'/g, function (m, i, s) {
                  return m.slice(0, 1) + '\\\'';
            });
            
            return "'" + ret + "'";
        }
        
        var spawnSSHProcess = function() {
            console.log("Initialize pty( cols=", cols, ", lines=", lines, ")" );

            var proc = JSON.parse( JSON.stringify( process.env ) );
            
            tty = spawn( '/usr/bin/ssh', ( function() {
                var o = [ 
                    '-o', 'UserKnownHostsFile=/dev/null',
                    '-o', 'StrictHostKeyChecking=no',
                    '-o', 'RequestTTY=yes',
                    '-o', 'ConnectTimeout=5'
                ];
                
                if ( remotePort != 22 ) {
                    o.push( '-p' );
                    o.push( remotePort + '' );
                }
                
                o.push( remoteUser + '@' + remoteHost );
                
                var command = [];
                
                // push command
                
                command.push( pathName );
                
                // push command arguments
                for ( var i=0,len=args.length; i<len; i++ ) 
                    command.push( args[i] );
                
                o.push( ( cwd ? 'cd ' + escapeshellarg( cwd ) + ' ; ' : '' ) +  escapeshellarg( command.join(' ') ) );
                
                console.log("SSH > command: ssh", o.join(' ') );
                
                return o;
            } )(), {
                "name": "xterm",
                "cols": cols,
                "rows": lines,
                "cwd" : process.env.HOME,
                "env" : process.env
            });
            
            tty.on( 'data', function( data ) {
                if (!remoteAuthenticated ) {
                    // we're waiting for the "password" line from the remote server
                    // console.log("SSH Data: '" + data + "'" );
                    
                    // Is server requesting the password ( and we did not allready sent the password? )
                    if ( !remotePasswordSent && /password\:([\s]+)?$/.test( data ) ) {
                        tty.write( remotePassword + "\r" );
                        console.log("SSH > Password sent!");
                        remotePasswordSent = true;
                        return;
                    }
                    
                    // Is ssh reporting an error?
                    if ( !remotePasswordSent && /ssh\: (.*)/.test( data ) ) {
                        console.log("SSH > Error: " + data.split("\n")[0] );
                        send( { "type": "auth", "data": false, "bad": "SSH@" + remoteHost, "hide": true });
                        send( { "type": "error", "data": data.split("\n")[0] } );
                    }
                    
                    // Is server rejecting the password?
                    if ( remotePasswordSent && /Permission denied\, please try again\./.test( data ) ) {
                        send( { "type": "auth", "data": false, "forget": 'SSH@' + remoteHost } );
                        tty.destroy();
                        tty = null;
                        console.log("SSH > Authentication FAILURE!");
                        return;
                    }
                    
                    if ( remotePasswordSent ) {
                        
                        remoteAuthenticated = true;
                        
                        // We're authenticated.
                        send( { "type": "auth", "data": true } );
                        send( { "type": "process",
                                "data": {
                                    "event": "output",
                                    "stream": "stdout",
                                    "data": data
                                }
                        });
                        
                        console.log("SSH > Handshake ok, switching to proxy mode");
                    }
                    
                } else {
                    // if we're allready authenticated, we're forwarding 
                    // the data to the vt100 terminal web endpoint
                    send({
                        "type": "process",
                        "data": {
                            "event": "output",
                            "stream": "stdout",
                            "data": data
                        }
                    });
                }
            } );
            
            tty.on('exit', function( data ) {
                
                if ( !remoteAuthenticated ) {
                    // if we were not authenticated, we're simply rejecting the request
                    request.reject();
                } else {
                    // we're sending the signal of authentication only after we're authenticated.
                    // otherwise we're just disconnecting the client
                    send({
                        "type": "process",
                        "data": {
                            "event": "exit",
                            "data": data
                        }
                    });
                }
            });
        }
        
        var spawnProcess = function() {
            console.log("Initialize pty( cols=", cols, ", lines=", lines, ")");
            
            var proc = JSON.parse( JSON.stringify( process.env ) );
            
            tty = spawn( '/usr/bin/sudo', ( function() { 
                var o = [ '-u', user, pathName ]; 
                for ( var i=0,len=args.length; i<len; i++ ) 
                    o.push( args[i] );
                console.log("exec: /usr/bin/sudo ", o.join(' ') );
                return o; 
            } )(), {
                "name": "xterm",
                "cols": cols,
                "rows": lines,
                "cwd" : cwd || process.env.HOME,
                "env" : process.env
            } );
            
            tty.on('data', function(data) {
            
                //console.log( 'sent: ', data.length, 'bytes' );
            
                send({
                    "type": "process",
                    "data": {
                        "event": "output",
                        "stream": "stdout",
                        "data": data
                    }
                });
            } );
            
            tty.on('exit', function( data ) {
                send({
                    "type": "process",
                    "data": {
                        "event": "exit",
                        "data": data
                    }
                });
            });
            
            //console.log( "Proces: ", tty.process );
            
        }
        
        connection.on( 'message', function( message ) {
            if ( message.type === 'utf8' ) {
            
                try {
                    
                    var frame = JSON.parse( message.utf8Data );
                    
                    if (!( frame instanceof Object ) )
                        throw "Frame not an object!";
                    
                    //console.log("Got: ", frame );
                    
                    if ( frameId == 0 ) {
                        /* This is the first frame, where we're expecting to initialize stuff
                           and spawn process if all things are ok
                         */
                        if ( !execFrame(frame,'connect' ) ) {
                            // first frame failed to execute. Abort
                            request.reject();
                            return;
                        }
                        
                    } else {
                        
                        execFrame(frame);
                        
                    }
                    
                    frameId++;
                    
                } catch (e) {
                    console.log( "frame ignored: ", message, "Exception: ", e );
                }
            
            } else {
                console.log( "Unsupported frame type: ", message.type );
            }
        } );
        
        connection.on( 'close', function( reasonCode, description ) {

            if ( tty ) {
                tty.destroy();
                tty = null;
            }
            
            console.log( '* Disconnected: ' + connection.remoteAddress );

        } );
        
    });
    
};

exports.upgrade  = function( httpServer ) {
    
    wsServer = new WebSocketServer( {
        "httpServer": httpServer,
        "autoAcceptConnection": false
    } );
    
    onServerUpgrade();
}