var tableEditModes = {
    "resize" : 0
};

var TABLE_EDIT_MODE = 0;

var tableMouseModes = {
    "moving": 0,
    "colResize": 1,
    "rowResize": 2,
    "select": 3
}

var tableCursors = [
    "cursor-default",
    "cursor-width-resize",
    "cursor-height-resize",
    "cursor-col-resize",
    "cursor-row-resize",
    "cursor-border-split",
    "cursor-border-merge"
];

Object.defineProperty(HTMLTableElement.prototype, "cursorType", {
    "set": function( str ) {
    
        //console.log("Setting cursor: ", str );
    
        for ( var i=0,len=tableCursors.length; i<len; i++ ) {
            removeStyle( this, tableCursors[i] );
        }
        
        addStyle( this, str );
    }
} );

Object.defineProperty(HTMLTableElement.prototype, "activeXEdge", {
    "get": function( ) {
        return this._activeXEdge;
    },
    "set": function( i ) {
        if ( i != this._activeXEdge && !!!this._XEdgeLocked ) {
            //console.log("Edge X changed from :", this._activeXEdge, " to: ", i );
            
            this._activeXEdge = i;

            switch ( TABLE_EDIT_MODE ) {

                case tableEditModes.resize:
                    this.cursorType = this._activeXEdge == -1 ? 'cursor-default' : 'cursor-col-resize';
                    break;
                    
                default:
                    this.cursorType = 'cursor-default';
                    break;
            }
            
        }
    }
});

Object.defineProperty(HTMLTableElement.prototype, "activeYEdge", {
    "get": function() {
        return this._activeYEdge;
    },
    "set": function( i ) {
        if ( i != this._activeYEdge && !!!this._YEdgeLocked ) {

            //console.log("Edge Y changed from ", this._activeYEdge, " to: ", i );

            this._activeYEdge = i;

            switch ( TABLE_EDIT_MODE ) {

                case tableEditModes.resize:
                    this.cursorType = this._activeYEdge == -1 ? 'cursor-default' : 'cursor-row-resize';
                    break;
                    
                default:
                    this.cursorType = 'cursor-default';
                    break;
            }
        }
    }
});

HTMLTableElement.prototype.getActiveXEdgeIndex = function( layerX ) {

    if ( layerX == 0 )
        return 0;
    
    var allGood = true;
    for ( var i=0, len=this.rows.length; i<len; i++ ) {
        // We need to find a row where all the cells have colSpan = 1
        allGood = true;
        for ( var j=0, n=this.rows[i].cells.length; j<n; j++ ) {
            if ( this.rows[i].cells[j].colSpan > 1 ) {
                allGood = false;
                break;
            }
        }
        if ( !allGood )
            continue;
        else {
        
            for ( var j=0,n=this.rows[i].cells.length; j<n; j++ ) {
                if ( layerX == this.rows[i].cells[j].offsetLeft )
                    return j;
            }
            
            var lastCell = this.rows[i].cells[ this.rows[i].cells.length - 1 ];
            
            if ( layerX == lastCell.offsetLeft + lastCell.offsetWidth )
                return this.rows[i].cells.length;
            
            return -1;
        }
    }
    return -1;
}

HTMLTableElement.prototype.getActiveYEdgeIndex = function( layerY ) {
    if ( layerY == 0 )
        return 0;
    
    for ( var i=0,len=this.rows.length; i<len; i++ ) {
        if ( this.rows[i].offsetTop == layerY )
            return i;
    }
    
    var lastRow = this.rows[ this.rows.length - 1 ];
    
    if ( lastRow.offsetTop + lastRow.offsetHeight == layerY )
        return this.rows.length;
    
    return -1;
}



Object.defineProperty( HTMLTableElement.prototype, "editable", {
    
    "get": function() {
        return !!this._editable;
    },
    "set": function( bool ) {
        bool = !!bool;
        
        if ( bool == !!this._editable )
            return;
        
        this._editable = !!bool;
        
        switch ( this._editable ) {
            
            case false:
            
                removeStyle( this, "table-edit-mode" );
            
                this.removeEventListener( 'mousemove', this.mouseMoveFunction, true );
                this.removeEventListener( 'mousedown', this.mouseDownFunction, true );
                this.removeEventListener( 'mouseup'  , this.mouseUpFunction,   true );
                
                break;
            
            case true:
            
                addStyle( this, "table-edit-mode" );
                
                this.setColWidths( this.getColWidths() );
                
                this._activeXEdge = -1;
                this._activeYEdge = -1;
                
                this._lastMouseX  = -1;
                this._lastMouseY  = -1;
                
                this._mouseMode   = tableMouseModes.moving;
                
                this._uid = getUID();
                
                this._lockWidths = null;
                this._lockHeights= null;
                this._lockX = -1;
                this._lockY = -1;
                
                this.mouseMoveFunction = function(e) {
                    
                    var targ = e.srcElement;
                    
                    while ( targ.nodeName != 'TABLE' )
                        targ = targ.parentNode;
                    
                    if ( targ != this )
                        return;

                    if ( e.layerX == this._lastMouseX &&
                         e.layerY == this._lastMouseY )
                    return;
                    
                    switch ( this._mouseMode ) {
                        
                        case tableMouseModes.moving:
                            
                            if ( e.layerX != this._lastMouseX ) {
                                this._lastMouseX = e.layerX;
                                this.activeXEdge = this.getActiveXEdgeIndex( this._lastMouseX );
                            }
                            
                            if ( e.layerY != this._lastMouseY ) {
                                this._lastMouseY = e.layerY;
                                this.activeYEdge = this.getActiveYEdgeIndex( this._lastMouseY );
                            }
                            
                            break;
                        
                        case tableMouseModes.colResize:
                            
                            var colIndex = this.activeXEdge - 1;

                            if ( colIndex >= 0 && typeof this._lockWidths[ colIndex + 1 ] != 'undefined' ) {
                                this.setColWidths( 
                                    this._lockWidths = 
                                        this.resizeArray( 
                                            this._lockWidths,
                                            colIndex, 
                                            this._initialWidth + ( e.layerX - this._lockX )
                                        )
                                    );
                            }
                            
                            // console.log("Col resize");
                            break;
                        
                        case tableMouseModes.rowResize:
                            var rowIndex = this.activeYEdge - 1;

                            if ( rowIndex >= 0 && typeof this._lockHeights[ rowIndex + 1 ] != 'undefined' ) {
                                this.setRowHeights( 
                                    this._lockHeights = 
                                        this.resizeArray( 
                                            this._lockHeights,
                                            rowIndex, 
                                            this._initialHeight + ( e.layerY - this._lockY )
                                        )
                                    );
                            }
                            // console.log("Row resize");
                            break;
                        
                    }
                };
                
                this.mouseDownFunction = function(e) {
                    var targ = e.srcElement;
                    
                    while ( targ.nodeName != 'TABLE' )
                        targ = targ.parentNode;
                    
                    if ( targ != this )
                        return;
                    
                    switch ( TABLE_EDIT_MODE ) {
                        
                        case tableEditModes.resize:
                            
                            if ( this.activeXEdge != -1 ) {
                                this._XEdgeLocked = true;
                                // console.log("Locking X Edge");
                                this._mouseMode = tableMouseModes.colResize;
                                this._lockX = e.layerX;
                                this._lockWidths = this.getColWidths();
                                this._initialWidth = this._lockWidths[ this.activeXEdge - 1 ] || 0;

                                //console.log( "Initial width: ", this._initialWidth, " activeXEdge: ", this.activeXEdge );

                                e.preventDefault();
                                e.stopPropagation();
                            }
                            
                            if ( this.activeYEdge != -1 ) {
                                this._YEdgeLocked = true;
                                // console.log("Locking Y Edge");
                                this._mouseMode = tableMouseModes.rowResize;
                                this._lockY = e.layerY;
                                this._lockHeights = this.getRowHeights();
                                this._initialHeight = this._lockHeights[ this.activeYEdge - 1 ] || 0;
                                
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            
                            if ( this._YEdgeLocked == -1 &&
                                 this._XEdgeLocked == -1 )
                                this._mouseMode = tableMouseModes.select;
                            
                            break;
                        
                        default:
                            // console.log("Ignored");
                            break;
                        
                    }
                }
                
                this.mouseUpFunction = function( e ) {
                    var targ = e.srcElement;
                    
                    while ( targ.nodeName != 'TABLE' )
                        targ = targ.parentNode;
                    
                    if ( targ != this )
                        return;
                    
                    // unlock edges
                    // console.log("Unlocking edges...");
                    
                    this._XEdgeLocked = false;
                    this._YEdgeLocked = false;
                    
                    this.activeXEdge = -1;
                    this.activeYEdge = -1;

                    if ( this._mouseMode = tableMouseModes.select ) {
                        
                        var sel = window.getSelection();
                        
                        if ( !sel.isCollapsed ) {
                            
                            var rng = sel.getRangeAt( 0 );
                            
                            switch ( true ) {
                            
                                case !this.contains( rng.startContainer ) &&
                                     !this.contains( rng.endContainer ):
                                     break; // The selection includes the whole table
                                
                                default:
                                    var toggleStart = false;
                                    
                                    var addRowsToo = [];
                                    
                                    for ( var i=0, rows = this.rows || [], len = rows.length; i<len; i++ ) {
                                    
                                        for ( var j=0, n=rows[i].cells.length; j<n; j++ ) {
                                            
                                            if ( rows[i].cells[j].contains( rng.startContainer ) )
                                                toggleStart = true;
                                            
                                            if ( toggleStart )
                                                sel.forceAddNode( rows[i].cells[j] );

                                            if ( rows[i].cells[j].contains( rng.endContainer ) ) {
                                                sel.forceAddNode( rows[i].cells[j] );
                                                toggleStart = false;
                                                addRowsToo.push( rows[i] );
                                            }
                                        }
                                        
                                        if ( toggleStart )
                                            addRowsToo.push( rows[i] );
                                    }
                                    
                                    addRowsToo = addRowsToo.unique();
                                    for ( var i=0,len=addRowsToo.length; i<len; i++ )
                                        sel.forceAddNode( addRowsToo[i] );
                            }
                            
                        }
                        
                    }

                    // console.log("Resetting mouse mode...");
                    this._mouseMode = tableMouseModes.moving;
                };
            
                this.addEventListener( 'mousemove', this.mouseMoveFunction, true );
                this.addEventListener( 'mousedown', this.mouseDownFunction, true );
                this.addEventListener( 'mouseup'  , this.mouseUpFunction,   true );
            
                break;
            
        }
    }
    
} );



HTMLTableElement.prototype.getColWidths = function( ) {

    var out = [],
        rows = this.rows;
    
    if ( !rows || !rows.length ) {
        // console.log( "No tbody!" );
        return out;
    }
    
    var isGood = -1;
    
    // console.log( rows.length );
    
    for ( var i=0,len=rows.length; i<len; i++ ) {
        isGood = i;
        //console.log( i );
        
        for ( var j=0, m = rows[i].cells.length; j<m; j++ ) {
            if ( rows[i].cells[j].colSpan != 1 ) { 
                isGood = -1;
                break;
            }
        }
        
        if ( isGood == -1 )
            continue;
        else
            break;
    }
    
    if ( isGood == -1 ) {
        // console.log( "NoGood" );
        console.error("Could not determine the columns widths!");
        return out;
    }
    
    for ( var i=0,len=rows[ isGood ].cells.length; i<len; i++ )
        out.push( rows[ isGood ].cells[i].offsetWidth );

    return out;
};

HTMLTableElement.prototype.setColWidths = function( colConfigs ) {
    colConfigs = colConfigs || [];
    
    var rows = this.tbody ? this.tbody.rows : (this.rows || [] ),
        numCols = colConfigs.length;
    
    for ( var row = 0, numRows = rows.length; row < numRows; row++ ) {
        // We setup the column width only if all the cells
        // in the row have colSpan == 1
        if ( numCols == rows[ row ].cells.length ) {
            sum = 0;
            for ( var col = 0; col < numCols; col++ ) {
                rows[ row ].cells[ col ].style.width = colConfigs[ col ] + "px";
            }
        }
    }
    
    // Trigger the paint event in all table rows
    this.paint();
};

HTMLTableElement.prototype.getRowHeights = function() {
    var out = [], rows = this.rows || [];
    for ( var i=0,len=rows.length; i<len; i++ ) {
        out.push( this.rows[i].offsetHeight );
    }
    return out;
}

HTMLTableElement.prototype.setRowHeights = function( rowConfigs ) {
    for ( var i=0,rows = this.rows || [],len=rows.length; i<len; i++ ) {
        for ( var j=0,n=this.rows[i].cells.length; j<n; j++ ) {
            if ( this.rows[i].cells[j].rowSpan == 1 )
                this.rows[i].cells[j].style.height = rowConfigs[ i ] ? rowConfigs[i] - 3 + "px" : '';
        }
    }
}

HTMLTableElement.prototype.resizeArray = function( arr, index, newValue ) {

    //console.log("ResizeArray: ", arr, index, newValue );

    if ( index < 0 || index > arr.length - 2 )
        return;
    
    if ( newValue < 24 )
        return arr;
    
    var diff = arr[index] - newValue;
    arr[index]=  newValue;
    arr[ index + 1 ] += diff;
    return arr;
}

HTMLTableElement.prototype.getTableMatrix = function() {
    var rows = this.rows || [], 
        numRows = this.getRowHeights().length, 
        numCols = this.getColWidths().length,
        colIndex = 0,
        matrix = [],
        tmp1, tmp2;
    
    // Compute a default table matrix
    for ( var i=0; i<numRows; i++ ) {
        var row = [];
        for ( var j=0; j<numCols; j++ ) {
            row.push({
                "row": i,
                "col": j,
                "cell": null
            });
        }
        matrix.push( row );
    }
    
    // Compute virtual to real bindings table matrix
    for ( var i=0, len=numRows; i<len; i++ ) {
        colIndex = 0;
        for ( var j=0, n=rows[i].cells.length; j<n; j++ ) {
            
            try {
                while ( matrix[ i ][ colIndex ].cell !== null && colIndex < numCols )
                    colIndex++;
            } catch (e) {
                console.log("Matrix build error: skip col: ", colIndex, " on row: ", i );
            }
            
            if ( colIndex < numCols ) {
                for ( tmp1 = 0; tmp1 < rows[i].cells[j].colSpan; tmp1++ ) {
                    for ( tmp2 = 0; tmp2 < rows[i].cells[j].rowSpan; tmp2++ ) {
                        try {
                            matrix[ i + tmp2 ][ colIndex + tmp1  ].cell = rows[ i ].cells[j];
                        } catch (e) {
                            console.log( "Matrix build error: col: ", j, " row ", i );
                        }
                    }
                }
                colIndex += rows[i].cells[i].colSpan;
            }
        }
    }
    
    return matrix;
}

HTMLTableElement.prototype.getBindingCellXY = function( bindingMatrix, layerX, layerY, lockedRowHeights, lockedColWidths, lockedXEdge, lockedYEdge ) {
    
    var direction = null, 
        soFar = 0;
    
    if ( lockedXEdge == -1 && lockedYEdge == -1 ) {
        // Locking should be made on some of the axis
        return null;
    }
    
    var xCell = -1;
    var yCell = -1;
    
    if ( lockedXEdge >= 0 ) {
        xCell = lockedXEdge;
        
        direction = 'left';
        
        for ( var i=0, len=lockedRowHeights.length; i<len; i++ ) {
            if ( layerY >= soFar &&
                 layerY <= soFar + lockedRowHeights[i]
            ) {
                yCell = i;
            }
            soFar += lockedRowHeights[i];
        }
        
        //compute direction
        if ( xCell >= lockedColWidths.length ) {
            xCell--;
            direction = 'right';
        }
        
    } else {
        yCell = lockedYEdge;
        
        direction = 'up';
        
        for ( var i=0, len=lockedColWidths.length; i<len; i++ ) {
            if ( layerX >= soFar &&
                 layerX <= soFar + lockedColWidths[i]
            ) {
                xCell = i;
            }
            soFar += lockedColWidths[i];
        }
        
        if ( yCell >= lockedRowHeights.length ) {
            yCell--;
            direction = 'down';
        }
        
        // compute direction
    }
    
    // Compute physical affected cells
    
    var logical, physical = [];
    
    switch( direction ) {
        case 'up':
            logical = [ { "col": xCell, "row": yCell - 1 }, { "col": xCell, "row": yCell } ];
            break;
        case 'down':
            logical = [ { "col": xCell, "row": yCell }, { "col": xCell, "row": yCell + 1 } ];
            break;
        case 'left':
            logical = [ { "col": xCell - 1, "row": yCell }, { "col": xCell, "row": yCell } ];
            break;
        case 'right':
            logical = [ { "col": xCell, "row": yCell }, { "col": xCell + 1, "row": yCell } ];
            break;
    }
    
    for ( var i=0; i<2; i++ ) {
        switch ( true ) {
            case logical[i].col < 0 ||
                 logical[i].row < 0 ||
                 logical[i].col >= lockedColWidths.length ||
                 logical[i].row >= lockedRowHeights.length:
                physical.push( null );
                break;
            default:
                physical.push( bindingMatrix[ logical[i].row ][ logical[i].col ].cell );
                break;
        }
    }
    
    return {
        "xCell": xCell,
        "yCell": yCell,
        "direction": direction,
        "logical": logical,
        "physical": physical
    };
}

HTMLTableElement.prototype.execCommand = function( command, bindingResult ) {
    var cell1 = bindingResult.physical[0];
    var cell2 = bindingResult.physical[1];
    var tmp, direction;

    if ( [ 'split', 'join' ].indexOf( command ) >= 0 &&
         cell1 === null || cell2 === null
    ) return;

    if ( bindingResult.direction == 'right' || bindingResult.direction == 'down' ) {
        tmp = cell1;
        cell1 = cell2;
        cell2 = tmp;
    }
    
    if ( [ 'left', 'right' ].indexOf( bindingResult.direction ) >= 0 )
        direction = 'horizontal';
    else
        direction = 'vertical';

    switch ( command ) {
        case 'split':
            cell1.execSplit( cell2, direction );
            break;
        case 'join':
            cell1.execJoin( cell2, direction );
            break;
    }

    console.log( "Exec: ", direction, command, " on: ", cell1, 'with' , cell2 );
}

HTMLTableRowElement.prototype.addSiblingRow = function( direction ) {

    switch ( direction ) {
        
        case 'after':

            // If the row has a rowSpan table cell, we ignore the row
            for ( var i=0,len=this.cells.length; i<len; i++ ) {
                if ( this.cells[i].rowSpan > 1 )
                    return false;
            }
            var newRow = this.cloneNode( true );
            
            for ( var i=0,len=newRow.cells.length; i<len; i++ )
                newRow.cells[i].innerHTML = '<p><br /></p>';
            
            this.addAfter( newRow );
            break;
            
        case 'before':
            if ( this.rowIndex > 0 )
                this.parentNode.rows[ this.rowIndex - 1 ].addSiblingRow( 'after' );
            else {
            
                var newRow = this.cloneNode( true );
            
                for ( var i=0,len=newRow.cells.length; i<len; i++ )
                    newRow.cells[i].innerHTML = '<p><br /></p>';
            
                this.addBefore( newRow );
            }
            
            break;
        default:
            throw "Invalid parameter `direction`, allowed only 'before' or 'after'";
            break;
    }
};