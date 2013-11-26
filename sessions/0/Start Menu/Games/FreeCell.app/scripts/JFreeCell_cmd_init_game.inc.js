function JFreeCell_cmd_init_game( app ) {
    
    function shuffle(o){
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };
    
    for ( var i=0, len=app.cards.length; i<len; i++ ) {
        app.cards[i] = app.insert(
            new Game_Card(
                app.cards[i].value,
                app.cards[i].type,
                false
            ).chain( function() {
                this.flipped = true;
            } )
        );
    }
    
    //console.log( app.cards );
    
    app.handlers.cmd_init_game = function( warn ) {
        
        var doInit = function() {

            for ( var i=0, len=app.cards.length; i<len; i++ ) {
                app.cards[i].stack = null;
                app.cards[i].style.left = '';
                app.cards[i].style.top = '';
            }

            app.cards = shuffle( app.cards );

            var k = 0;
        
            for ( var i=0, len = app.decks.columns.length; i<len; i++ ) {
                for ( var j=0, n = !( i%2 ) ? 6 : 7; j<n; j++ ) {
                    app.decks.columns[ i ].add( app.cards[k] );
                    k++;
                }
            }
            
            setTimeout( function() {
                app.paint();
            }, 1 );
        };
        
        if ( !!warn )
            doInit();
        else DialogBox("Are you sure you want to start a new game?", {
            
            "childOf": app,
            "type": "question",
            "buttons": {
                "Yes": doInit,
                "No": function() {}
            },
            "caption": "FreeCell"
            
        } );
    }
    
}