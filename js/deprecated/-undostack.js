Object.defineProperty( Node.prototype, "undoManager", {
    
    "get": function() {
        return this.undoMgr || null;
    },
    "set": function( bool ) {
        bool = !!bool;
        
        if (!bool && typeof this.undoMgr != 'undefined' ) {
            this.removeEventListener( 'textInput', this.undoMgr.inputEvent, true );
            this.removeEventListener( 'keydown', this.undoMgr.keyDownEvent, true );
            this.undoMgr = undefined;
        }
        
        if ( bool && typeof this.undoMgr == 'undefined' ) {
            
            ( function( element ) {
                
                var setHTML = function( str ) {
                    element.innerHTML = str;
                    
                    /* Fix tables */
                    var tables = element.getElementsByTagName( 'table' ) || [];
                    for ( var i=0,len=tables.length; i<len; i++ )
                        tables[i].editable = true;
                    
                };
                
                element.undoMgr = ({}).chain( function( ) {
                    
                    var undoStack = [];
                    var redoStack = [];
                    
                    this.lastTimeAdded = 0;
                    
                    this.undo = function() {
                        if ( undoStack.length ) {
                            var action = undoStack.pop();
                            redoStack.unshift( action );
                            setHTML(undoStack.length ? undoStack.last().data : '' );
                            element.setCaretPosition( undoStack.length ? undoStack.last().curPos : 0 );
                            return true;
                        }
                        return false;
                    };
                    
                    this.redo = function() {
                        if ( redoStack.length ) {
                            var action = redoStack.shift();
                            undoStack.push( action );
                            setHTML( action.data );
                            element.setCaretPosition( action.curPos );
                        }
                    }
                    
                    this.add = function( why ) {
                        why = why || 'Unknown';
                        
                        var now = ( new Date() ).getTime(),
                            lastEntry;
                        
                        if ( why == 'input' && 
                             undoStack.length && 
                             ( lastEntry = undoStack.last() ) &&
                             lastEntry.event == 'input' &&
                             ( now - lastEntry.time <= 5000 )
                        ) {
                            lastEntry.data = element.innerHTML;
                            lastEntry.time = now;
                            lastEntry.curPos = window.getSelection().getCaretOffsetRelativeTo( element )
                            redoStack = [];
                        } else {
                            undoStack.push( {
                                "event": why,
                                "data" : element.innerHTML,
                                "time" : this.lastTimeAdded = now,
                                "curPos": window.getSelection().getCaretOffsetRelativeTo( element )
                            } );
                            redoStack = [];
                        }
                    }
                    
                    var inputThrottler = throttle( function() {
                        element.undoMgr.add( "input" );
                    }, 300 );

                    element.addEventListener( 'textInput', this.inputEvent = function(e) {
                        inputThrottler.run();
                    }, true );
                    
                    element.addEventListener( 'keydown', this.keyDownEvent = function(e) {
                        var ch = e.keyCode || e.charCode;

                        if ( ch == 8 || ch == 46 ) {
                            setTimeout( function() {
                                inputThrottler.run();
                            }, 1 );
                        }
                    }, true );
                    
                    element.addEventListener( 'cut', this.cutEvent = function( e ) {
                        setTimeout( function() {
                            inputThrottler.run();
                        }, 1 );
                    }, true );
                    
                    this.clear = function() {
                        undoStack = [];
                        redoStack = [];
                    }
                    
                });

                
            } )( this );
            
            
        }
    },
    "enumerable": false
    
} );