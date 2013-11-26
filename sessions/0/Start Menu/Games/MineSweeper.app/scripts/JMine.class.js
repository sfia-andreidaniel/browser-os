function JMineSweeper_Mine() {
    var d = $('div', "JMine uncovered");
    
    var value =   'empty';
    var values= [ '1', '2', '3', '4', '5', '6', '7', '8', 'empty', 'bomb' ];
    
    var isCovered = true;
    var isFailed  = false;
    
    var states = [ '', 'flagged', 'unknown' ],
        state = '';
    
    Object.defineProperty( d, "value", {
        "get": function() {
            return value;
        },
        "set": function(_v) {
            _v = _v + '';
            
            if ( values.indexOf( _v ) == -1 )
                throw "Bad value";
            
            for ( var i=0, len=values.length; i<len; i++ ) {
                ( values[i] == _v ? addStyle : removeStyle )( d, "val-" + values[i] );
            }
            
            value = _v;
            
            d.state = '';
        }
    } );
    
    Object.defineProperty( d, "failed", {
        "get": function() {
            return isFailed;
        },
        "set": function( b ) {
            b = !!b;
            ( b ? addStyle : removeStyle )( d, "failed" );
            failed = b;
        }
    });
    
    Object.defineProperty( d, "state", {
        "get": function() {
            return state;
        },
        "set": function( s ) {
            if ( states.indexOf( s ) == -1 )
                throw "Bad state";
            else {
                d.removeClass( "state-flagged" ).removeClass( "state-unknown" );
                state = s;
                if ( state )
                    d.addClass( "state-" + s );
            }
        }
    } );
    
    Object.defineProperty( d, "covered", {
        "get": function() {
            return isCovered;
        },
        "set": function( b ) {
            
            b = !!b;
            
            isCovered = b;
            
            ( !b ? removeStyle : addStyle )( d, "uncovered" );
            
        }
    } );
    
    Object.defineProperty( d, "left", {
        
        "get": function() {
            return d.x > 0 ? d.dlg.getMineXY( d.x - 1, d.y ) : null;
        }
        
    } );
    
    Object.defineProperty( d, "right", {
        "get": function() {
            return d.x < d.dlg.cols - 1 ? d.dlg.getMineXY( d.x + 1, d.y ) : null;
        }
    } );
    
    Object.defineProperty( d, "top", {
        "get": function() {
            return d.y > 0 ? d.dlg.getMineXY( d.x, d.y - 1 ) : null;
        }
    } );
    
    Object.defineProperty( d, "bottom", {
        "get": function() {
            return d.y < d.dlg.rows - 1 ? d.dlg.getMineXY( d.x, d.y + 1 ) : null;
        }
    } );
    
    Object.defineProperty( d, "topLeft", {
        "get": function() {
            return d.x > 0 && d.y > 0
                ? d.dlg.getMineXY( d.x - 1, d.y - 1 ) 
                : null;
        }
    } );
    
    Object.defineProperty( d, "bottomLeft", {
        "get": function() {
            return d.x > 0 &&
                   d.y < d.dlg.rows - 1
                   ? d.dlg.getMineXY( d.x - 1, d.y + 1 )
                   : null;
        }
    });
    
    Object.defineProperty( d, "topRight", {
        "get": function() {
            return d.x < d.dlg.rows - 1 &&
                   d.y > 0
                   ? d.dlg.getMineXY( d.x + 1, d.y - 1 )
                   : null;
        }
    } );
    
    Object.defineProperty( d, "bottomRight", {
        "get": function() {
            return d.x < d.dlg.rows - 1 &&
                   d.y < d.dlg.cols - 1
                   ? d.dlg.getMineXY( d.x + 1, d.y + 1 )
                   : null;
        }
    } );
    
    Object.defineProperty( d, "neighbours", {
        "get": function() {
            var out = [], props = [ "left", "right", "top", "bottom", "topLeft", "topRight", "bottomLeft", "bottomRight" ], item;
            for ( var i=0; i<8; i++ ) {
                item = d[ props[i] ];
                if ( item ) out.push( item );
            }
            return out;
        }
    } );
    
    d.uncover = function( stopPropagation ) {
    
        stopPropagation = !!stopPropagation;
    
        if ( d.value == 'bomb' ) {
            d.dlg.appHandler( 'game_over', d );
            return;
        }
        
        d.covered = false;
        
        if ( stopPropagation )
            return;
        
        var neighbours = d.neighbours;
        
        for ( var i=0, len=neighbours.length; i<len; i++ ) {
            if ( ['empty', '1', '2', '3', '4', '5', '6', '7', '8' ].indexOf( neighbours[i].value ) >= 0 && neighbours[i].covered && neighbours[i].state == '' ) {
                neighbours[i].uncover( neighbours[i].value != 'empty' );
            }
        }
    }
    
    d.oncontextmenu = function(e) {
        if ( !e.shiftKey )
        cancelEvent(e);

        if ( d.covered ) {
            
            switch ( d.state ) {
                case '':
                    d.state = 'flagged';
                    break;
                case 'flagged':
                    d.state = 'unknown';
                    break;
                case 'unknown':
                    d.state = '';
                    break;
            }
            
            d.dlg.updateBombs();
        }
    }
    
    d.onclick = function(e) {
        if ( d.covered )
            d.uncover();
    }
    
    return d;
}