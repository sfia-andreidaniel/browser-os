Selection.prototype.forceAddNode = function( DOMNode ) {
    ( this.otherNodes = this.otherNodes || [] ).push( DOMNode.chain( function() {
        this.renderSelected = true;
    } ) );
}

Selection.prototype.forceRemoveNode = function( DOMNode ) {
    var foundIndex;
    
    if ( this.otherNodes && ( foundIndex = this.otherNodes.indexOf( DOMNode ) ) >= 0 )
        this.otherNodes.splice( foundIndex, 1 );
    
    DOMNode.renderSelected = false;
}

window.addEventListener('selectionchange', function() {
    var sel;
    if ( ( sel = window.getSelection() ).otherNodes && sel.otherNodes instanceof Array ) {
        for ( var i=0, len=sel.otherNodes.length; i<len; i++ )
            sel.otherNodes[i].renderSelected = false;
        sel.otherNodes = undefined;
    }
    
    document.body.onCustomEvent('selection-changed');
    
}, true );


Object.defineProperty( Node.prototype, "renderSelected", {
    "get": function() {
        return this.hasAttribute( '_selected' );
    },
    "set": function( bool ) {
        ( bool ? this.setAttribute : this.removeAttribute ).call( this, "_selected", "yes" );
    },
    "enumerable": false
} );

Selection.prototype.getCaretOffsetRelativeTo = function(element) {
    try {
        var caretOffset = 0;
        var range = this.getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
        return caretOffset;
    } catch (e) {
        return 0;
    }
}

Node.prototype.setCaretPosition = function( position ) {
    
    this.focus();
    
    var sel = window.getSelection(), nowPosition = sel.getCaretOffsetRelativeTo( this ), differenceMove = position - nowPosition;
    
    while ( differenceMove != 0 ) {
        if ( differenceMove < 0 ) {
            differenceMove++;
            sel.modify( 'move', 'left', 'character' );
        } else {
            differenceMove--;
            sel.modify( 'move', 'right', 'character' );
        }
    }
}

Node.prototype.outerSelect = function() {
    var selection = window.getSelection(),
        range = document.createRange();
    
    range.selectNode( this );
    selection.addRange( range );

}
