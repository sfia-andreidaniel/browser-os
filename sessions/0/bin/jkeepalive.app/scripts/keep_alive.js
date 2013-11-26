function JKeepAlive() {
    if (!window.Notifier) {
        setTimeout(JKeepAlive, 1000);
        return;
    }
    Notifier.addNotification({
        'name': 'KEEP_ALIVE',
        'views': {
            "working": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAF1QTFRFBwcGAACAPz+fP7A/P7o/P6E/P8I/P58/Pz9fc4Skv7+/P5+fP6KcP3zCP26/P3y/IJaKRlrGD2Ob9vvqjJnZKk6uP2G/P1+fDg6AP78/oKCkgICAX19fP3+/AAAAkaIcIgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2wkNDAMKibW/WQAAAExJREFUGNNjYIAAGRhggAmIQ4AUQkAWDIgRkIADDqgAIwxABaTlYEBGCgi4kAVk5ECmSctJCYOAlBzUXUgqIPZhEYBrwakCXUAG1ecAl9QS+3HmINUAAAAASUVORK5CYII='
        },
        "title": "Session Guard"
    }).viewName = "working";
    
    var myKeepAlive;
    
    myKeepAlive = function() {

        $_JSON_POST('jfs/0/lib/keep_alive/handler.php', [], function( data ) {
            if (data != 'ok')
                window.location.reload(true);
            else setTimeout( myKeepAlive, 60000 );
        });
            
    };
    
    myKeepAlive();
}