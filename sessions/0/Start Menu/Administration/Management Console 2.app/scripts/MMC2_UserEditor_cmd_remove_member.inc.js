function MMC2_UserEditor_cmd_remove_member( app ) {

    app.handlers.cmd_remove_member = function() {
        for ( var items=app.groupsList.querySelectorAll( '.member.selected' ), i=items.length-1; i>=0; i-- ) {
            items[i].chain( function() {
                this.parentNode.removeChild( this );
                this.purge();
            } );
        }
    }
    
}