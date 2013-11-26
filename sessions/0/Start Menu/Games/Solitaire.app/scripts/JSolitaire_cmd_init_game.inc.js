function JSolitaire_cmd_init_game( app ) {
    
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
            )
        );
    }
    
    //console.log( app.cards );
    
    app.handlers.cmd_init_game = function( warn ) {
        
        var doInit = function() {
        
            var d = 0,
                off = 24;
            
            app.cards = shuffle( app.cards );
            
            for ( var i=0, len = app.cards.length; i<len; i++ ) {
                app.cards[i].stack = null;
                app.cards[i].flipped = false;
            }
            
            for ( var i=0; i<24; i++ ) {
                app.decks.initial.add( app.cards[i] );
                app.cards[i].flipped = false;
            }
            
            for ( var i=0, n = app.decks.transitional.length; i<n; i++ ) {
                d++;
                for ( var j=0; j<d; j++ ) {
                    app.decks.transitional[ i ].add( app.cards[ off ] );
                    off++;
                }
                app.cards[ off-1 ].flipped = true;
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
            "caption": "Solitaire"
            
        } );
    }
    
}