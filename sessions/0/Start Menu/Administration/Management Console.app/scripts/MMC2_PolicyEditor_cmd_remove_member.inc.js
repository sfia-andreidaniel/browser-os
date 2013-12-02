function MMC2_PolicyEditor_cmd_remove_member( app ) {

    app.handlers.cmd_remove_member = function() {
        for ( var items=app.membersList.querySelectorAll( '.member.selected' ), i=items.length-1; i>=0; i-- ) {
            items[i].chain( function() {
                this.parentNode.removeChild( this );
                this.purge();
            } );
        }
    }
    
}