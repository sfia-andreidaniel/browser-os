function Game_Card( value, type, flipped ) {

    value = value || 1;
    type  = type  || 'c';
    
    var holder = $('div', 'GameCard '+ type+value + ( flipped ? '' : ' backed' ) );
    
    Object.defineProperty( holder, "value", {
        
        "get": function() {
            return value <= 10 ? value : value - 1;
        }
        
    } );
    
    Object.defineProperty( holder, "color", {
        
        "get": function() {
            return type == 'd' || type == 'h' ? 'red' : 'black';
        }
        
    } );
    
    Object.defineProperty( holder, "sign", {
        "get": function() {
            return type;
        }
    } );
    
    ( function() {
    
        var prevIndex   = null,
            dropStacks  = null,
            dropInStack = null,
            origStack   = null,
            origTop     = null,
            origLeft    = null;
    
        var onDragStart = function( evt ) {
            
            origStack = holder.stack;
            
            origTop   = holder.style.top;
            origLeft  = holder.style.left;
            
            if ( holder.stack ) {
                try {
                    
                    if ( !holder.stack.moveable )
                        throw "col not moveable";
                    
                    if ( !holder.stack.canMoveCard( holder ) )
                        throw "unmoveable card";
                    
                    /* Compute the drop stacks ( others than our stack ) */
                    dropStacks = [];
                    
                    for ( var i=0, stacks = getOwnerWindow( holder ).querySelectorAll( '.GameStack' ), len = stacks.length; i<len; i++ ) {
                        
                        if ( stacks[i] != holder.stack && stacks[i].canAcceptCard )
                            dropStacks.push( stacks[i] );
                        
                    }
                    
                } catch (e) {
                    console.log( "Drag start: " + e );
                    cancelEvent( evt );
                    return 'cancel';
                }
            } else {
                
                dropStacks = null;
                
            }
        
            // console.log( dropStacks );
        
            //console.log( "Drag start: ", arguments );
            
            prevIndex = holder.style.zIndex;

            holder.style.zIndex = 10000;

            if ( holder.stack ) {
                holder.stack.repaint( holder.cardIndex, parseInt( holder.style.left ), parseInt( holder.style.top ) );
            }
            
            addStyle( holder, "dragging" );
        };
        
        var currentDropStack = null;
        
        var onDragRun = function() {

            if ( holder.stack ) {
                holder.stack.repaint( holder.cardIndex, parseInt( holder.style.left ), parseInt( holder.style.top ) );
            }

            currentDropStack = null;
            
            if ( dropStacks ) {
                
                for ( var i=0, len=dropStacks.length; i<len; i++ ) {
                    
                    if ( holder.overlapsWith( dropStacks[i] ) && dropStacks[i].canAcceptCard( holder ) ) {
                        currentDropStack = dropStacks[i];
                        break;
                    }
                    
                }
                
            }
            
            if ( currentDropStack != dropInStack ) {
                
                if ( dropInStack )
                    dropInStack.highlight = false;
                
                dropInStack = currentDropStack;
                
                if ( dropInStack )
                    dropInStack.highlight = true;
            }
            
        };
        
        var onDragEnd = function() {
            
            
            if ( dropInStack ) {
                
                dropInStack.add( holder );
                
                dropInStack.repaint();
                
                dropInStack.highlight = false;
                
                dropInStack = null;
                
            } else {
                holder.style.zIndex = prevIndex;
                
                if ( holder.stack ) {
                    
                    holder.stack.repaint( );
                    
                } else {
                    //console.log( "revert" );
                    holder.style.left = origLeft;
                    holder.style.top  = origTop;
                }
                
            }
            
            removeStyle( holder, "dragging" );
            
            console.log( "Drag end: ", arguments );
        }
    
        var dragger = new dragObject( holder, null, new Position(0,0), new Position(10000,10000), onDragStart, onDragRun, onDragEnd, true );
        
        var moveable = false;
        
        Object.defineProperty( holder, 'moveable', {
            
            "get": function() {
                return moveable;
            },
            
            "set": function( bool ) {
                if ( moveable == !!bool )
                    return;
                
                moveable = !!bool;
                
                holder[ moveable ? 'setAttribute' : 'removeAttribute' ]( 'dragable', '1' );

                dragger[ moveable ? "StartListening" : "StopListening" ]();
            }
            
        } );
    })();
    
    ( function() {
        
        var flipped = false;
        
        Object.defineProperty( holder, 'flipped', {
            
            "get": function() {
                return flipped;
            },
            
            "set": function( bool ) {
                flipped = !!bool;
                
                ( bool ? removeStyle : addStyle )( holder, 'backed' );
            }
            
        } );
        
    } )();
    
    holder.flipped = flipped || false;
    
    ( function() {
        
        var stack = null;
        
        Object.defineProperty( holder, "stack", {
            
            "get": function() {
                return stack;
            },
            
            "set": function( stackNode ) {
                
                if ( stack ) {
                    // First remove the card from the old stack
                    stack.remove( holder );
                }
                
                stack = stackNode;
                
                holder.prevCard = null;
                holder.nextCard = null;
            }
            
        } );
        
    } )();
    
    ( function() {
        
        var cardIndex = 0;
        
        Object.defineProperty( holder, "cardIndex", {
            "get": function() {
                return cardIndex;
            },
            "set": function( i ) {
                cardIndex = i;
            }
        } );
        
    } )();
    
    ( function() {
        
        var next = null;
        
        Object.defineProperty( holder, "nextCard", {
            
            "get": function() {
                return next;
            },
            
            "set": function( card ) {
                next = card;
            }
            
        } );
        
    } )();
    
    ( function() {
        
        var prev = null;
        
        Object.defineProperty( holder, "prevCard", {
            
            "get": function() {
                
                return prev;
            },
            
            "set": function( card ) {
                
                prev = card;
                
            }
            
        } );
        
    } )();
    
    holder.addEventListener( 'click', function() {
        
        if ( holder.stack ) {
            holder.stack.onCustomEvent( 'card-clicked', holder );
        }
        
    }, false );
    
    holder.addEventListener( 'dblclick', function() {
        
        if ( holder.stack ) {
            holder.stack.onCustomEvent( 'pull-up', holder );
        }
        
    } );
    
    return holder;
    
}