function WebSocketRPC( hostName, aConsole ) {

    if (typeof window.WebSocket == 'undefined')
        throw "WebSocket support is not available for your browser";
    
    var self         = this;
    
    this.hostName    = hostName || null;        // in format "ws://host:port/service"
    this.socket      = null;                    // the WebSocket object
    this.ready       = false;                   // when connected, here it is stored TRUE
    this._methods    = {};                      // we add Available client methods in this object

    this.autoConnect = true;

    self.__defineGetter__('methods',            // we wrap the _methods object into a readOnly getter
        function() {
            return self._methods;
        }
    );

    self.requests    = [];                      // we create here a stack with requests sent to server, in order to know
                                                // what callbacks to execute when responses come back
                                                
    self._requestID  = 0;                       // private, the current ID request that the class has made
    
    self.sendQueue   = [];                      // a virtual queue, in order to delay sent packages to server when in offline mode
    
    
    /* Private method -> sends a callback error to server! */
    self.sendErrorResponse = function(errorString, id) {
        self.send(
            serialize(
                {
                    "id": id,
                    "error": errorString,
                    "data": null
                }
            )
        );
    };
    
    var console = typeof aConsole !== 'undefined' ? aConsole : (window.console || { "log": function(something) { } } );
    
    if (!console.error) {
        console.error = function(something) {
            console.log("Error: "+something.toString());
        };
    }
    
    /* Private method */
    self.uniqueID = function() {
        self._requestID++;
        return self._requestID;
    }
    
    /* Public method -> calls a method on server */
    self.call = function(method, args, callbackFunction) {
        
        /* Calls a method on server, and execute callback function @callback
         * when operation completes on server (async mode only!)
         */
        
        var data = {
            "id"      : self.uniqueID(),
            "method"  : method.toString(),
            "data"    : args,
            "type"    : "client"
        };
        
        if (!self.send(serialize(data))) {
            throw "WebSocketRPC.remoteCall: method '"+method+"' failed -- could not send request to server!";
        } else {
            data.callbackFunction = callbackFunction;
            self.requests.push(data);
            return data;
        }
    };
    
    /* Private method */
    self.clientCallbackHandler = function(data) {
        /* DESCRIPTION: A server callback handler is a request that is coming from the server-side
         *              as a response for a method requested by the client (this class)
         * 
         * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
         * 
         * ANATOMY OF A CLIENT CALLBACK HANDLER DATA PARAMETER IS:
         * 
         * {
         *      (str)   "type": "client",
         *      (int)     "id": <request_id>                 // The request ID
         *      (str)  "error": <exception_error_or_null>    // If an error occured, the error string. Otherwise, NULL
         *      (any)   "data": <svr_response>               // Server response
         *      (str) "method": <svr_previously_requested_method>
         * }
         * 
         * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
         * 
         */
        
        if (!data || !(data instanceof Object)) {
            console.error("WebSocketRPC.clientCallbackHandler: Invalid server package!!!");
            return;
        }
        
        var id = data.id || null;
        if (null === id) {
            console.error("WebSocketRPC.clientCallbackHandler: Decoded package does not contain the package ID!!!");
            return;
        }
        
        var requestObject = null;
        
        for (var i=0; i<self.requests.length; i++) {
            if (self.requests[i].id == id) {
                requestObject = self.requests.splice(i, 1)[0];
                break;
            }
        }
        
        if (requestObject === null) {
            console.error(
                "WebSocketRPC.clientCallbackHandler: Error executing method '"+method+"': NOT_IN_REQUESTED_STACK!"
            );
            return;
        }
        
        var method = data.method || '<UNKNOWN_METHOD>';
        
        if (typeof data.error != 'undefined' && data.error !== null) {
            console.error("WebSocketRPC.clientCallbackHandler: Error executing method '"+method+"': "+data.error.toString());
            return;
        }
        
        var dataResponse = typeof data.data == 'undefined' ? null : data.data;
        
        requestObject.callbackFunction(dataResponse);
        
    };
    
    /* Private method */
    self.serverCallbackHandler = function(data) {
        
        /* DESCRIPTION: A server callback handler is a request that's coming from the server-side
         *              for an action requested by server from the client (this class)
         *
         * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
         * 
         * ANATOMY OF A SERVER CALLBACK HANDLER DATA PARAMETER IS:
         * {
         *         (str) "type"   : "server",
         *  (opt object) "args"   : {
         *                      "argument_1": value,
         *                      "argument_2": value,
         *                      "argument_3": value,
         *                      ...
         *                      "argument_n": value
         *               },
         *         (str) "method" : method_name,
         *         (int) "id"     : integer, that should be passed back to the callback
         * }
         *
         * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
         * 
         * A SERVER CALLBACK HANDLER RESPONSE SHOULD BE IN THE FOLLOWING FORMAT:
         *
         * {
         *                "error" : statusCode, // null || string (if NULL, everything went fine, if string 
         *                                     //                 the description of the error)
         *                   "id" : integer     // should match with the id that was originally sent from the server,
         *                 "data" : <arbitrary_data>
         *                 "type" : "server"
         * }
         *
         */
        
        var id = typeof data.id == 'undefined' ? null : data.id;
        
        if (id === null) {
            console.error("WebSocketRPC.serverCallbackHandler: Error: command 'id' not specified by server");
            return;
        }
        
        var args = typeof data.args == 'undefined' ? null : data.args;
        var method = data.method ? data.method.toString() : null;
        
        if (method === null) {
            console.error("WebSocketRPC.serverCallbackHandler: Error: 'method' name not specified by server");
            
            self.sendErrorResponse(
                "'method' name not specified'",
                id
            );
            
            return;
        }
        
        if (!self.methods[method]) {
            console.error("WebSocketRPC.serverCallbackHandler: Error: method '"+method+"' not implemented!");
            
            self.sendErrorResponse(
                "method '"+method+"' not implemented",
                id
            );
            
            return;
        }
        
        var out;
        
        try {
            out = {
                "id" : id,
                "error": null,
                "data": self.methods[method](args),
                "type": "server"
            };
            
            self.send(
                serialize(out)
            );
            return;
            
        } catch(e) {
            
            self.sendErrorResponse(
                "Exception: "+e,
                id
            );
            return;
        }
        
    }
    
    /* callback executed when the WebSocket is receiving data.
     *
     * usefull information is stored in msg.data as string
     */
    
    self.onMessage = function(msg) {
        var data = json_parse(msg.data);
        
        if (data === null)
            console.error("WebSocketRPC.onMessage: Json error: Unparseable json: '"+msg.data+"'");
        
        if (!(data instanceof Object) || !data.type) {
            console.error("WebSocketRPC.onMessage: Package type error (expected 'type' property):");
            console.log(data);
        }
        
        switch (data.type) {
            case 'client':
                //do the clientCallbackHandler
                self.clientCallbackHandler(data);
                break;
            case 'server':
                self.serverCallbackHandler(data);
                break;
            default:
                console.error("WebSocketRPC.onMessage: Unknown callback type in package \""+data.type+"\"");
                break;
        }
    }
    
    self.onConnect = function() {
        self.call('setEnv', self.methods.getEnv(), function(callback) {
            if (callback === true)
                console.log("RPC: Synchronized env on server!");
            else {
                console.log("RPC: Could not sync env on server. Disconnecting...");
                self.socket.close();
            }
        })
    }
    
    /* Used to connect to WebSocket RPC server.
     * 
     * Returns TRUE or FALSE
     * 
     */
    
    self.connect = function( otherHostname ) {
        
        self.autoConnect = true;
        
        self.hostName = otherHostname || self.hostName;
        
        console.info("Connecting to: "+self.hostName);
        
        try {
        
            self.socket = new WebSocket(self.hostName);
        
            self.socket.onopen = function(e) {
            
                console.info("Connected!");
            
                for (var i=0; i<self.sendQueue.length; i++) {
                    self.socket.send(self.sendQueue[i]);
                }
            
                self.sendQueue = [];
            
                self.ready = true;
            
                console.info("Ready");
                
                if (typeof self.onConnect != 'undefined')
                    self.onConnect();
            }
    
            self.socket.onmessage = self.onMessage;
        
            self.socket.onclose = function(e) {
                self.ready = false;
                console.error("Disconnected!");
                if (self.autoConnect) {
                    console.info("Trying to reconnect again in 10 seconds ...");
                    setTimeout(function() { if (!self.ready) self.connect(); }, 10000);
                }
                if (typeof self.onClose != 'undefined')
                    self.onClose();
            }
            
            return true;
        
        } catch (ex) {
            console.error(ex);
            return false;
        }
    };
    
    self.send = function(buffer) {
//         console.log("-> "+buffer.length+' bytes: "'+buffer+'"');
        
        if (self.ready) {
            self.socket.send(buffer);
            return true;
        }
        else {
            if (self.sendQueue.length < 100) {
                self.sendQueue.push(buffer);
                return true;
            } else {
                console.error("WebSocketRPC: package dropped (queue full)");
                return false;
            }
        }
    };

    self.registerMethod = function(methodName, func) {
        console.log('WebSocketRPC: Registering method "'+methodName+'"...');
        self._methods[methodName] = func;
    };
    
    self.registerMethod('getEnv', function() {
        return {
            'navigator': {
                "userAgent": navigator.userAgent || null,
                "appCodeName": navigator.appCodeName || null,
                "appVersion": navigator.appVersion || null,
                "platform": navigator.platform || null,
                "product": navigator.product || null
            },
            'window': {
                "location": window.location.toString() || null
            },
            'screen': {
                "width": screen.availWidth,
                "height": screen.availHeight,
                "depth": screen.colorDepth || screen.pixelDepth
            },
            'document': {
                "cookie": document.cookie || null
            },
            'session': typeof $_SESSION == 'undefined'? {} : $_SESSION
        };
    });
    
    self.disconnect = function() {
        self.autoConnect = false;
        try {
            if (self.socket !== null) {
                self.socket.close();
            }
            else
                console.warn('Disconnect: nothing to disconnect, not connected');
        } catch (ex) {
            console.error("Disconnect: "+ex);
        }
    };
    
    if (self.hostName !== null)
       self.connect();
    
    return self;
    
}
