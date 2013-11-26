function Game_Stack( config ) {
    
    var holder= $('div', "GameStack");
        holder.cards = [],
        highlight = false;
    
    
    config = config || {};
    
    ( function() {

        var stackMethod = "none";

        Object.defineProperty( holder, "stackMethod", {
            
            "get": function() {
                return stackMethod;
            },
            
            "set": function( str ) {
                
                if ( [ 'none', 'x', 'y', 'both' ].indexOf( str ) == -1 )
                    throw "Invalid stack method!";
                
                if ( str == stackMethod )
                    return;
                
                stackMethod = str;
                
                holder.repaint();
            }
            
        } );
    
    })();
    
    Object.defineProperty( holder, "highlight",  {
        
        "get": function() {
            return highlight;
        },
        "set": function( bool ) {
            
            highlight = !!bool;
            
            for ( var i=0, len=holder.cards.length; i<len; i++ ) {
                ( highlight ? addStyle : removeStyle )( holder.cards[i], 'highlight' );
            }
            
            ( highlight ? addStyle : removeStyle )( holder, "highlight" );
            
        }
        
    } );
    
    ( function() {
        
        var stackPadding = 0;
        
        Object.defineProperty( holder, "stackPadding", {
            "get": function() {
                return stackPadding;
            },
            
            "set": function( _int ) {
                if ( _int == stackPadding )
                    return;
                
                stackPadding = _int;
                
                holder.repaint();
            }
        } );
        
    } )();
    
    holder.repaint = function( index, forceOX, forceOY ) {
        
        if ( !holder.parentNode )
            return;
        
        var ox = forceOX || holder.offsetLeft,
            oy = forceOY || holder.offsetTop,
            x  = 0,
            y  = 0,
            method = holder.stackMethod,
            padding= holder.stackPadding,
            zInd = -1;
        
        for ( var i=Math.max( 0, index || 0 ), len=holder.cards.length; i<len; i++ ) {
            
            holder.cards[ i ].chain( function() {
                
                if ( zInd == -1 )
                    zInd = this.style.zIndex;
                else {
                    zInd++;
                    this.style.zIndex = zInd;
                }
                
                this.style.left = ox + x + "px";
                this.style.top  = oy + y + "px";
                
                switch ( holder.stackMethod ) {
                    
                    case 'x':
                        x += padding;
                        break;
                    
                    case 'both':
                        x += padding;
                        y += padding;
                        break;
                    
                    case 'y':
                        y += padding;
                        break;
                    
                }
                
            } );
            
        }
        
    }
    
    holder.setAnchors( {
        
        "dummy": function() {
            
            holder.repaint();
            return null;
        }
        
    } );
    
    holder.add = function( card ) {
        
        /* Check if the card is contained allready by this stack. If it is,
           first remove it.
         */
        
        var addCards = [ card ],
            cursor   = card.nextCard;
        while ( cursor ) {
            addCards.push( cursor );
            cursor = cursor.nextCard;
        }
        
        for ( var i=0, len=addCards.length; i<len; i++ ) {
        
            (function( card ) {
                holder.remove( card );
                
                holder.cards.push( card );
                
                card.stack = holder;
                
                card.cardIndex = holder.cards.length - 1;
                
                card.prevCard = card.cardIndex == 0 ? null : holder.cards[ card.cardIndex - 1 ];
                
                if ( card.cardIndex > 0 )
                    card.prevCard.nextCard = card;
                
                card.style.zIndex = card.cardIndex + 1;
                
                card.moveable = holder.moveable;
            })( addCards[i] );
        }
        
        holder.repaint( card.cardIndex );
        
        if ( holder.parentNode ) {
            
            getOwnerWindow( holder ).isGameWon();
            
        }

    }
    
    holder.remove = function( card ) {
        for ( var i=0, len=holder.cards.length; i<len; i++ ) {

            if ( holder.cards[i] == card ) {
                
                var nc = card.nextCard;
                var pc = card.prevCard;
                
                holder.cards.splice( i, 1 );
                
                if ( holder.cards.length ) {
                    holder.cards[0].prevCard = null;
                    
                    for ( var i=0, len = holder.cards.length - 1; i<len; i++ ) {
                        holder.cards[i].nextCard = holder.cards[i+1];
                        holder.cards[i+1].prevCard = holder.cards[i];
                    }
                    
                    if ( holder.cards.length == 1 )
                        holder.cards[0].nextCard = null;
                    else {
                        holder.cards.last().prevCard = holder.cards[ holder.cards.length - 2];
                        holder.cards[ holder.cards.length - 2 ].nextCard = holder.cards.last();
                        holder.cards.last().nextCard = null;
                    }
                    
                }
                
                // console.log( "removed: ", card, " from: ", holder, " now we have: ", holder.cards.length );
                
                holder.repaint();
                
                break;
            }
        }
    }
    
    var moveable = false;
    
    Object.defineProperty( holder, "moveable", {
        "get": function() {
            return moveable;
        },
        "set": function( bool ) {
            moveable = !!bool;
            
            for ( var i=0, len = holder.cards.length; i<len; i++ ) {
                holder.cards[i].moveable = moveable;
            }
        }
    } );
    
    holder.stackMethod  = config.stackMethod || 'none';
    holder.stackPadding = config.stackPadding || 0;
    holder.moveable     = config.moveable || false;
    
    return holder;
}