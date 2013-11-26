function CanvasDoc( imagesList ){

    var IState = {
        "canceled": -2,
        "loading": -1,
        "error"  : 0,
        "ready"  : 1
    }
    
    var images = [];
    var preloading = 0;
    var imgUp = 1;
    var drawMatrix = [];

    
    imagesList = imagesList || [];
    
    var holder = $('div', 'DOMCanvasDoc');
    
    EnableCustomEventListeners( holder );
    
    var inner = holder.appendChild( $('div').setAnchors({
        "width": function( w,h ) {
            return w + "px";
        },
        "height": function( w,h ) {
            return h + 'px';
        }
    }) );
    
    var scroll = inner.appendChild( $('div', 'scroller' ).setAttr(
        "style", "width: " + ( window.scrollbarWidth || 15 ) + "px"
    ) );
    
    var height = scroll.appendChild( $('div') );
    
    Object.defineProperty(
        holder, "height", {
            "get": function() {
                return height.offsetHeight;
            },
            "set": function( intVal ) {
                var i = isNaN( intVal ) ? 0 : (intVal >> 0);
                if ( i < 0 ) i = 0;
                height.style.height = i + "px";
            }
        }
    );
    
    var canvas = inner.appendChild( $('canvas').setAnchors({
        "width": function(w,h) {
            holder.onCustomEvent('resize');
            return ( canvas.width = ( w - ( window.scrollbarWidth || 15 ) ) * 2 ) + "px";
        },
        "height": function(w,h) {
            holder.onCustomEvent('resize');
            return ( canvas.height = h * 2 ) + "px";
        }
    }) );
    
    Object.defineProperty( holder, "top", {
        
        "get": function() {
            return scroll.scrollTop;
        },
        "set": function( intV ){
            var ptop = scroll.scrollTop;
            scroll.scrollTop = intV;
            if (ptop != scroll.scrollTop)
                holder.onCustomEvent('paint');
        }
        
    } );
    
    canvas.addEventListener( 'mousewheel', function(e) {
        holder.top -= e.wheelDelta || e.wheelDeltaY;
    }, true );
    
    scroll.addEventListener('scroll', function( e ) {
        paint();
    }, true );
    
    var paint = function() {
        var ctx = canvas.getContext( '2d' );
        var width = canvas.offsetWidth;
        var height= canvas.offsetHeight;
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, width, height);
        
        ctx.webkitImageSmoothingEnabled = true;
        
        var yTop = holder.top;
        var yBtm = yTop + height;
        var len  = drawMatrix.length;
        
        for (var i=0; i<len; i++) {
            if (drawMatrix[i].y > yBtm )
                return;
            else
            if (drawMatrix[i].y + drawMatrix[i].height < yTop)
                continue;
            
            drawMatrix[i].img.style.width = drawMatrix[i].width + "px";
            ctx.drawImage( drawMatrix[i].img, drawMatrix[i].x, drawMatrix[i].y - yTop, drawMatrix[i].width, drawMatrix[i].height );
        }
    };
    
    holder.addCustomEventListener('paint', function() {
        try {
            paint();
        } catch ( e ) {}
        // console.log( "paint" );
        return true;
    } );
    
    
    holder.addCustomEventListener('preload', function( img ) {
        // console.log("Preloaded (", img.state, "): ", img.src, img.width, img.height );
        preloading--;
        holder.onCustomEvent("resize");
    } );
    
    
    holder.loadImages = function( imgList ) {
        
        images = [];
        imgList = imgList || [];
        preloading = 0;
        
        for (var i=0; i<images.length; i++)
            images[i].state = IState.canceled;
        
        for (var i=0; i<imgList.length; i++) {
            ( function( src ) {
                var img = new Image();
                preloading++;
                img.state = IState.loading;
                img.onload = function() {
                    if (this.state == IState.canceled)
                        return;
                    this.state = IState.ready;
                    holder.onCustomEvent("preload", this);
                };
                img.onerror= function() {
                    if (this.state == IState.canceled)
                        return;
                    this.state = IState.error;
                    holder.onCustomEvent("preload", this);
                }
                
                img.computeHeight = function( width ) {
                    return img.state != IState.ready ? 0 : ( ( width * img.height ) / img.width ) >> 0;
                };
                
                images.push( img );
                img.src = src;
            } )( imgList[i] );
        }
    
        holder.onCustomEvent('resize');
    
    };
    
    Object.defineProperty(
        holder, "imgUp", {
            "get": function() {
                return imgUp;
            },
            "set": function( intValue ) {
                if (isNaN( intValue ) || intValue < 1) {
                    throw "Bad value. Expecting integer >= 1";
                }
                imgUp = intValue >> 0;
                holder.onCustomEvent('resize');
            }
        }
    );
    
    
    holder.updateMatrix = function( width ) {
        
        drawMatrix = [];
        var itemWidth = ( ( width - ( 10 * imgUp ) ) / imgUp ) >> 0;
        var len = images.length;

        var col = 0;
        var row = 20;
        var max = 0;

        var o = {};

        for (var i=0; i < len; i++) {
            if ( images[i].state == IState.ready ) {
                o = {
                    "x": ( ( itemWidth + 10 ) * col ) + 5,
                    "y": row,
                    "img": images[i],
                    "width": itemWidth,
                    "height": images[i].computeHeight( itemWidth )
                };
                
                if ( max < o.height )
                    max = o.height;
                
                drawMatrix.push( o );
                col++;
                
                if ( col == imgUp ) {
                    row += (max + 10);
                    max = 0;
                    col = 0;
                }
            }
        }
        
        holder.height = row + max + 10;
    }
    
    Object.defineProperty( holder, "matrix", {
        "get": function() {
            return drawMatrix;
        }
    } );
    
    holder.addCustomEventListener('resize', function() {
        holder.updateMatrix( canvas.offsetWidth );
        setTimeout( function() {
            paint();
        }, 1);
        return true;
    });
    
    holder.loadImages( imagesList );
    
    return holder;
}