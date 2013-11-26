function Cropper(settings) {
    
    var holder = $('div', 'DOMCropper');
    var inner  = holder.appendChild( $('div') );
    
    var left = inner.appendChild( $('div', 'left') );
    var right= inner.appendChild( $('div', 'right') );
    var top  = inner.appendChild( $('div', 'top') );
    var bottom = inner.appendChild( $('div', 'bottom') );

    var dragTopLeft     = inner.appendChild( $('div', 'drag drag-top-left' ) );
    var dragTopRight    = inner.appendChild( $('div', 'drag drag-top-right' ) );
    var dragTop         = inner.appendChild( $('div', 'drag drag-top') );
    
    var dragLeft        = inner.appendChild( $('div', 'drag drag-left') );
    var dragRight       = inner.appendChild( $('div', 'drag drag-right') );
    
    var dragBottomLeft  = inner.appendChild( $('div', 'drag drag-bottom-left') );
    var dragBottomRight = inner.appendChild( $('div', 'drag drag-bottom-right') );
    var dragBottom      = inner.appendChild( $('div', 'drag drag-bottom') );
    var dragCenter      = inner.appendChild( $('div', 'drag drag-center') );
    
    EnableCustomEventListeners( holder );
    
    inner.DOManchors = {
        "dummy": function( w,h ) {
        
            dragTop.style.left = dragBottom.style.left = dragCenter.style.left = left.offsetWidth + ( w - left.offsetWidth - right.offsetWidth ) / 2 - 4 + "px";

            dragRight.style.left = dragTopRight.style.left = dragBottomRight.style.left = w - 4 - right.offsetWidth + "px";

            dragBottomLeft.style.left = dragLeft.style.left = dragTopLeft.style.left = left.offsetWidth - 4 + "px";
            
            dragLeft.style.top = dragRight.style.top = dragCenter.style.top = top.offsetHeight + ( ( h - top.offsetHeight - bottom.offsetHeight ) / 2 ) - 4 + "px";
            dragTopLeft.style.top = dragTop.style.top = dragTopRight.style.top = top.offsetHeight - 4 + "px";
            dragBottomLeft.style.top = dragBottom.style.top = dragBottomRight.style.top = h - bottom.offsetHeight - 4 + "px";
            
        }
    };
    
    Object.defineProperty( holder, 'left', {
        "get": function() {
            return left.style.width ? parseInt( left.style.width ) : left.offsetWidth;
        },
        "set": function( intVal ) {
            left.style.width = intVal + "px";
        }
    });
    
    Object.defineProperty( holder, 'right', {
        "get": function() {
            return right.style.width ? parseInt( right.style.width ) : right.offsetWidth;
        },
        "set": function( intVal ) {
            right.style.width = intVal + "px";
        }
    } );
    
    Object.defineProperty( holder, 'top', {
        "get": function() {
            return top.style.height ? parseInt( top.style.height ) : top.offsetHeight;
        },
        "set": function( intVal ) {
            left.style.top = right.style.top = top.style.height = intVal + "px";
        }
    } );
    
    Object.defineProperty( holder, 'bottom', {
        "get": function() {
            return bottom.style.height ? parseInt( bottom.style.height ) : bottom.offsetHeight;
        },
        "set": function( intVal ) {
            left.style.bottom = right.style.bottom = bottom.style.height = intVal + "px";
        }
    } );
    
    Object.defineProperty( holder, 'width', {
        "get": function() {
            return holder.offsetWidth - holder.left - holder.right;
        }
    } );
    
    Object.defineProperty( holder, 'height', {
        "get": function() {
            return holder.offsetHeight - holder.top - holder.bottom;
        }
    });
    
    /* Create the draggers */
    
    dragTopLeft.setAttribute('dragable', '1');
    dragTopLeft.dragger = new dragObject( dragTopLeft, null, new Position(-4, -4 ), new Position( screen.width, screen.height ), null, function( pos, div, event ) {
        holder.top  = dragTopLeft.offsetTop + 4;
        holder.left = dragTopLeft.offsetLeft + 4;
        inner.paint();
    }, function() {
        holder.onCustomEvent('change');
    } );
    
    dragBottomRight.setAttribute('dragable', '1');
    dragBottomRight.dragger = new dragObject( dragBottomRight, null, new Position( -4, -4 ), new Position( screen.width, screen.height ), null, function( pos, div, event ) {
        holder.right = holder.offsetWidth - dragBottomRight.offsetLeft + 4;
        holder.bottom = holder.offsetHeight - dragBottomRight.offsetTop + 4;
        inner.paint();
    }, function() {
        holder.onCustomEvent('change');
    } );
    
    dragTopRight.setAttribute('dragable', '1');
    dragTopRight.dragger = new dragObject( dragTopRight, null, new Position( -4, -4 ), new Position( 10000, 10000 ), null, function( pos, div, event) {
        holder.top = dragTopRight.offsetTop + 4;
        holder.right = holder.offsetWidth - dragTopRight.offsetLeft + 4;
        inner.paint();
    }, function() {
        holder.onCustomEvent('change');
    } );
    
    dragBottomLeft.setAttribute('dragable', '1');
    dragBottomLeft.dragger = new dragObject( dragBottomLeft, null, new Position( -4, -4 ), new Position( 10000, 10000 ), null, function( pos, div, event ) {
        holder.left = dragBottomLeft.offsetLeft + 4;
        holder.bottom = holder.offsetHeight - dragBottomLeft.offsetTop + 4;
        inner.paint();
    }, function() {
        holder.onCustomEvent('change');
    } );
    
    dragTop.setAttribute('dragable', '1');
    dragTop.dragger = new dragObject( dragTop, null, new Position( -4, -4 ), new Position( 10000, 10000 ), null, function( pos, div, event ){
        holder.top = dragTop.offsetTop + 4;
        inner.paint();
    }, function() {
        holder.onCustomEvent('change');
    } );
    
    dragBottom.setAttribute('dragable', '1');
    dragBottom.dragger = new dragObject( dragBottom, null, new Position( -4, -4 ), new Position( 10000, 10000 ), null, function( pos, div, event ) {
        holder.bottom = holder.offsetHeight - dragBottom.offsetTop + 4;
        inner.paint();
    }, function() {
        holder.onCustomEvent('change');
    } );
    
    dragLeft.setAttribute('dragable', '1');
    dragLeft.dragger = new dragObject( dragLeft, null, new Position( -4, -4 ), new Position( 10000, 10000 ), null, function( pos, div, event ) {
        holder.left = dragLeft.offsetLeft + 4;
        inner.paint();
    }, function() {
        holder.onCustomEvent('change');
    } );
    
    dragRight.setAttribute('dragable', '1');
    dragRight.dragger = new dragObject( dragRight, null, new Position( -4, -4 ), new Position( 10000, 10000 ), null, function( pos, div, event ) {
        holder.right = holder.offsetWidth - dragRight.offsetLeft + 4;
        inner.paint();
    }, function() {
        holder.onCustomEvent('change');
    } );
    
    var width = 0;
    var height = 0;
    
    dragCenter.setAttribute('dragable', '1');

    dragCenter.dragger = new dragObject( dragCenter, null, new Position( -4, -4 ), new Position( 10000, 10000 ), function() {
        
        width = holder.width;
        height= holder.height;
        
    }, function( pos, div, event ) {
        
        var xc = dragCenter.offsetLeft + 4;
        var yc = dragCenter.offsetTop + 4;
        
        holder.left   = xc - Math.floor( width / 2 );
        holder.right  = holder.offsetWidth - xc - Math.floor( width / 2 );
        holder.top    = yc - Math.floor( height / 2 );
        holder.bottom = holder.offsetHeight - yc - Math.floor( height / 2 );
        
        inner.paint();
        
    }, function() {
        holder.onCustomEvent('change');
    });
    
    holder.addCustomEventListener('change', function(){
        
        if ( dragLeft.offsetLeft > dragRight.offsetLeft ) {
            holder.left = dragRight.offsetLeft + 4;
            holder.right= holder.offsetWidth - dragLeft.offsetLeft + 4;
            inner.paint();
        }
        
        if ( dragTop.offsetTop > dragBottom.offsetTop ) {
            holder.top = dragBottom.offsetTop + 4;
            holder.bottom= holder.offsetHeight - dragTop.offsetTop + 4;
            inner.paint();
        }
        
        return true;
        
    });
    
    return holder;
    
}