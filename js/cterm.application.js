/* 
    @param `command`   : string, defaults to "/bin/bash" - command to be executed
    @param `args`      : array( of string), default []   - command arguments
    @param `settings`  : { // object, which has the following keys:
        "host"         : // string, default <window.location.host>":10000"
        "autoConnect"  : // bool    default true
        "forceRunAs"   : // bool, weather to force the showing of the keyring dialog or not
        "secure"       : // bool, default is: If you're using HTTPS, default is TRUE, otherwise default is FALSE
        "pamUser"      : // varchar, if you want to force local authentication to use a specific user
        "pamPassword"  : // varchar, if you want to force local authentication to use a specific password
        "sshUser"      : // varchar, if you want to force SSH authentication to use a specific user
        "sshPassword"  : // varchar, if you want to force SSH authentication to use a specific password
        "cwd"          : // varchar, if you want to specify current working directory. Default: "" (empty string, current folder)
    }
    @param `sshMachine`: execute command on another machine instead of executing it locally.
                         - this parameter is optional
                         - this parameter can have a :<port> specified
                         - if you specify this parameter, two authentication screens 
                           will appear: one for the local server machine, and the other for the
                           ssh machine.
 */
function VT100Application( command, args, settings, sshMachine ) {
    
    var machine = sshMachine || null;
    
    return ( new VT101() ).chain( function() {
        
        settings = settings || {};
        
        settings.pamUser = settings.pamUser || '';
        settings.sshUser = settings.sshUser || '';
        settings.pamPassword = settings.pamPassword || '';
        settings.sshPassword = settings.sshPassword || '';
        settings.cwd = settings.cwd || '';
        
        command = command || '/bin/bash';

        args = args || [];
        
        settings.secure = typeof( settings.secure ) == 'undefined' ? ( window.location.protocol == 'https:' ? true : false ) : !!settings.secure;
        
        var host = settings.host || ( window.location.host + ':10000' ),  // host address ( ws://... is automatically added! )
            connected = false,                          // connection flag
            socket    = null,                           // websocket!
            service   = 'terminal',                     // do not change this
            sshMachine = machine
        ;
        
        // command
        Object.defineProperty( this, "command", {
            "get": function() {
                return command;
            }
        });
    
        // command arguments
        Object.defineProperty( this, "args", {
            "get": function() {
                return args;
            }
        });
        
        // host address
        Object.defineProperty( this, "host", {
            "get": function() {
                return host;
            }
        });
        
        // websocket url used to connect
        Object.defineProperty( this, "url", {
            "get": function() {
                return 'ws' + ( settings.secure  ? 's' : '' ) + '://' + host + '/' + btoa(command) + 
                       '?args=' + encodeURIComponent( JSON.stringify( args ) ) + 
                       ( sshMachine ? '&remoteHost=' + encodeURIComponent( sshMachine ): '' ) +
                       ( settings.cwd ? '&cwd=' + encodeURIComponent( settings.cwd ) : '' );
            }
        });
    
        this.sendFrame = function( frameType, frameData ) {
            //console.log( "SendFrame: ", frameType, frameData );
            if ( connected ) {
                socket.send( JSON.stringify( {
                    "type": frameType,
                    "data": frameData
                } ) );
            }
            // drop frame if not connected
            else return;
        }
    
        // connects to server
        this.connect = function() {
            if ( connected )
                return;
            
            if ( typeof window.keyRing == 'undefined' ) {
                DialogBox("The terminal component is depending on\n"+
                          "the KeyRing service provided by JSPlatform,\n"+
                          "which seems to not be started.\n\n"+
                          "Please start the service first",{
                    "type": "error",
                    "childOf": getOwnerWindow( this ),
                    "caption": "Terminal connecting error"
                });
                return;
            }
            
            //console.log( "Connecting..." );
            
            if ( this.state != 'closed' ) {
                console.error("Cannot connect, socket is allready in state: ", this.state );
                return;
            }
            
            this.reset();
            
            ( function( vt100 ) {
            
                if (!sshMachine ) {
                    
                    vt100.receive("authenticating: ");
                    
                    // execute the command on local machine
                    var auth = window.keyRing.requestAuth( 'PAM', 'Terminal', function( userPass ) {

                        vt100.receive(userPass.user + "\r\n");
                
                        socket = new WebSocket( vt100.url, service );
                        
                        vt100.receive("connecting: ");
                    
                        socket.onopen = function() {
                        
                            vt100.onCustomEvent('connect');
                        
                            // console.log("Connected");
                            // init connection state flags
                            connected   = true;
                            // send terminal geometry to server 
                            
                            vt100.receive("connected\r\n");
                            
                            vt100.sendFrame( "connect", {
                                "lines": vt100.lines,
                                "cols": vt100.cols,
                                "user": userPass.user,
                                "password": userPass.password
                            } );
                        };
                    
                        socket.onmessage = function(e) {
                            // console.log("Host 2 VT100: ", e );
                            var data = e.data, 
                                frame;
                            try {
                                frame = JSON.parse( data );
                                
                                if ( typeof frame != 'object' )
                                    throw "FrameData not an object!";
                                vt100.onCustomEvent( "hostPacket", frame );
                            } catch ( e ) {
                                console.error("Could not parse frame: ", data, "\nReason: ", e );
                            }
                        };
                        
                        socket.onerror = function(e) {
                            console.log("Error");
                            vt100.onCustomEvent('connectionError', e );
                            vt100.receive("connection error!\r\n");
                        };
                        
                        socket.onclose = function(e) {
                            //console.log("Close!");
                            vt100.onCustomEvent('disconnect', 'socket is closing');
                        };
                    }, 
                    
                    function() {
                        vt100.onCustomEvent('auth-canceled');
                        vt100.receive("Authentication canceled by user\r\n");
                    }, 
                    
                    !!settings.forceRunAs,
                    
                    settings.pamUser,
                    settings.pamPassword);
                    
                    if ( auth instanceof Node ) {
                        auth.childOf = getOwnerWindow( vt100 );
                        auth.x = 30;
                        auth.y = 50;
                    }
                    
                } else {
                    
                    // Execute the command on another machine
                    
                    vt100.receive("authenticating: ");
                    
                    // request authentication for local machine
                    var localAuthDialog = window.keyRing.requestAuth( 'PAM', 'Terminal', function( localUserPass ) {
                            vt100.receive( localUserPass.user + "\r\n");
                            vt100.receive( "authenticating (SSH): ");
                            // request authentication for remote machine
                            var remoteAuthDialog = window.keyRing.requestAuth( 'SSH@' + sshMachine, 'Terminal', function( remoteUserPass ) {
                                
                                vt100.receive( remoteUserPass.user + "\r\n" );
                                
                                vt100.receive( "connecting: " );
                                
                                socket = new WebSocket( vt100.url, service );
                        
                                socket.onopen = function() {
                                    //console.log("Connected (SSH, ", sshMachine, ")" );
                                    
                                    vt100.receive("connected via SSH on " + sshMachine + "\r\n");
                                    
                                    // init connection state flags
                                    connected   = true;
                                    // send terminal geometry to server
                                    
                                    var packet = {
                                        "lines"      : vt100.lines,
                                        "cols"       : vt100.cols,
                                        "user"       : localUserPass.user,
                                        "password"   : localUserPass.password,
                                        "sshUser"    : remoteUserPass.user,
                                        "sshPassword": remoteUserPass.password,
                                        "sshHost"    : sshMachine
                                    };

                                    vt100.sendFrame( "connect", packet );
                                    
                                };
                            
                                socket.onmessage = function(e) {
                                    // console.log("Host 2 VT100: ", e );
                                    var data = e.data, 
                                        frame;
                                    try {
                                        frame = JSON.parse( data );
                                        
                                        if ( typeof frame != 'object' )
                                            throw "FrameData not an object!";
                                        vt100.onCustomEvent( "hostPacket", frame );
                                    } catch ( e ) {
                                        console.error("Could not parse frame: ", data, "\nReason: ", e );
                                    }
                                };
                                
                                socket.onerror = function(e) {
                                    console.log("Error");
                                    vt100.onCustomEvent('connectionError', e );
                                    vt100.receive("connection error!\r\n");
                                };
                                
                                socket.onclose = function(e) {
                                    //console.log("Close!");
                                    vt100.onCustomEvent('disconnect', 'socket is closing');
                                };

                            },
                            function() {
                                    vt100.onCustomEvent('auth-canceled');
                                    vt100.receive("Auth canceled by user, aborting...\r\n");
                            },
                            
                            !!settings.forceRunAs,
                            
                            settings.sshUser,
                            settings.sshPassword
                            
                            );
                            
                            if ( remoteAuthDialog instanceof Node ) {
                                remoteAuthDialog.childOf = getOwnerWindow( vt100 );
                                remoteAuthDialog.x = 30;
                                remoteAuthDialog.y = 50;
                            }
                            
                        }, 
                        function( ) {
                            vt100.onCustomEvent('auth-canceled');
                            vt100.receive("Auth canceled by user, aborting...\r\n");
                        },
                        !!settings.forceRunAs,
                        
                        settings.pamUser,
                        settings.pamPassword
                    );
                    
                    if ( localAuthDialog instanceof Node ) {
                        localAuthDialog.childOf = getOwnerWindow( vt100 );
                        localAuthDialog.x = 30;
                        localAuthDialog.y = 80;
                    }
                    
                }
            })( this );
        };
            
            // connection state
        Object.defineProperty( this, "state", {
            "get": function() {
                if (!socket)
                    return "closed";
                
                switch ( socket.readyState ) {
                    case socket.CLOSED:
                        return 'closed';
                        break;
                    case socket.CLOSING:
                        return 'closing';
                        break;
                    case socket.CONNECTING:
                        return 'connecting';
                        break;
                    case socket.OPEN:
                        return 'connected';
                        break;
                }
            }
        } );
        
        // connection error custom event listener
        this.addCustomEventListener( "connectionError", function( reason ) {
            console.error( "Socket Error: " + ( reason || 'Unknown reason' ) );
            this.disconnect();
            return true;
        } );
        
        // host packet event listener
        this.addCustomEventListener( "hostPacket", function( packet ) {
            var data;
            switch ( packet.type ) {
                case "process":
                    // this is a frame yeld by the process. in "data" field we
                    // find the frame details
                    
                    data = packet.data || {};
                    
                    switch ( data.event ) {
                        case "output":
                            this.receive( data.data || '' );
                            break;
                        case "exit":
                            console.log( data.data );
                            //console.log( "Process finished" );
                            this.disconnect();
                            break;
                    }
                    
                    break;
                case "auth":
                    //console.log("Authentication status: ", packet.data ? "ACCEPTED" : "REJECTED");
                    if ( !packet.data ) {
                    
                        if (!!!packet.hide)
                            DialogBox("Server disconnected you because could not verify your credentials", {
                                "type": "error",
                                "childOf": null,
                                "caption": "Authentication failed"
                            });
                        
                        if ( packet.bad ) {
                            keyRing.unvalidate( packet.bad );
                            console.log("Keyring: Unvalidate credentials: ", packet.bad );
                        }
                        
                        this.connected = false;
                    } else this.focus();
                    this.onCustomEvent("auth", !!packet.data);
                    break;
                
                case "error":
                    
                    DialogBox( packet.data, {
                        "type": "error",
                        "childOf": null,
                        "caption": "Error"
                    } );
                    
                    break;
                
                default:
                    console.log("Unknown server packet type: ", packet.type);
                    break;
            }
        } );
        
        // disconnects from server
        this.disconnect = function() {
            var me = this;
            
            if ( socket && [ socket.CONNECTING, socket.OPEN ].indexOf( socket.readyState ) >= 0 ) {
                socket.close();
                socket = null;
            }
            
            this.onCustomEvent('disconnect');
            
            connected = false;
            socket = null;
            
            this.receive("\r\ndisconnected from terminal server\r\n");
        }
        
        // getter setter for connection state
        Object.defineProperty( this, "connected", {
            "get": function(){
                return connected;
            },
            "set": function( b ) {
                b = !!b;
                if ( b != connected ) {
                    switch ( b ) {
                        case true:
                            this.connect();
                            break;
                        case false:
                            this.disconnect();
                            break;
                    }
                }
            }
        } );
    
        // bind the terminal answerback message to the host
        this.addCustomEventListener( "send", function( utf8String ) {
            //console.log("Send: ", hexData );
            this.sendFrame("input", utf8String );
            return true;
        });
        
        // bind the resize event to notify the host about terminal size
        this.addCustomEventListener( "resize", function() {
            this.sendFrame( "resize", {
                "lines": this.lines,
                "cols": this.cols
            } );
            return true;
        });
        
        // bind the setTitle custom event
        this.addCustomEventListener( "setTitle", function( titleString ) {
            getOwnerWindow( this ).caption = titleString + ( machine ? " (via SSH on " + machine + ")" : "" );
        } );
        
        this.addCustomEventListener( "destroy", function() {
            this.connected = false;
            return true;
        } );
        
        var me = this;
        
        if ( settings.autoConnect ) {
            setTimeout( function() {
                me.connected = true;
            }, 200 );
        }
    
    } );
    
}