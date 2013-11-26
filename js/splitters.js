function SplitterSurface(config) {
    var holder = $('div', 'DomSplitterSurface');
    
    holder.notifyParent = function( eventName, eventData ) {
        var me = holder.parentNode;
        while (!hasStyle( me, 'DomSplitter' ) )
            me = me.parentNode;
        return me.onCustomEvent( eventName, eventData );
    };
    
    holder.inner    = holder.appendChild($('div', 'DomSplitterInner'));
    holder.settings = config || {};
    holder.__splits   = [];
    holder.__handles = [];
    holder.__splitMode = false;
    
    holder.cells = function(cellIndex) {
      return typeof cellIndex != 'undefined' ?  holder.__splits[cellIndex] : holder.__splits;
    };
    
    holder.handles = function(handleIndex) {
        return typeof handleIndex != 'undefined' ? holder.__handles[handleIndex] : holder.__handles;
    };

    holder.attachVRHandler = function(vHandler) {
    
        vHandler.setAttribute('dragable', '1');
        
        vHandler.onDragStart = function() {
            try {
                vHandler.minX = vHandler.previousSibling.offsetLeft;
                vHandler.maxX = vHandler.nextSibling.offsetLeft + vHandler.nextSibling.offsetWidth;
            } catch (e) {}
        };
        
        vHandler.onDragRun = function() {
            try {
                var x = parseInt(vHandler.style.left) + 1;
            
                if (x < vHandler.minX) { x = vHandler.minX; vHandler.style.left = x - 2 + 'px'; }
                if (x > vHandler.maxX) { x = vHandler.maxX; vHandler.style.left = x - 2 + 'px'; }
            
                vHandler.previousSibling._width = x - vHandler.minX;
            
                vHandler.nextSibling._width = vHandler.maxX - x;

                vHandler.previousSibling.onDOMresize(holder.inner.offsetWidth, holder.inner.offsetHeight);
                vHandler.nextSibling.onDOMresize(holder.inner.offsetWidth, holder.inner.offsetHeight);
            } catch (e) {}
        };
        
        vHandler.onDragStop = function() {
            try {
                vHandler.previousSibling.onDOMresize(holder.inner.offsetWidth, holder.inner.offsetHeight);
                vHandler.nextSibling.onDOMresize(holder.inner.offsetWidth, holder.inner.offsetHeight);
                holder.notifyParent( 'resize', holder );
            } catch (e) {}
        };
        
        vHandler._dragListener = 
                    new dragObject(vHandler, null, new Position(-5000, 0), new Position(5000, 0), 
                                   vHandler.onDragStart, vHandler.onDragRun, vHandler.onDragStop, null, true);
    };

    holder.attachHRHandler = function(vHandler) {
    
        vHandler.setAttribute('dragable', '1');
        
        vHandler.onDragStart = function() {
            vHandler.minX = vHandler.previousSibling.offsetTop;
            vHandler.maxX = vHandler.nextSibling.offsetTop + vHandler.nextSibling.offsetHeight;
        };
        
        vHandler.onDragRun = function() {
            var x = parseInt(vHandler.style.top) + 1;

            if (x < vHandler.minX) { x = vHandler.minX; vHandler.style.top = x - 2 + 'px'; }
            if (x > vHandler.maxX) { x = vHandler.maxX; vHandler.style.top = x - 2 + 'px'; }
            
            vHandler.previousSibling._height = x - vHandler.minX;
            
            vHandler.nextSibling._height = vHandler.maxX - x;

            vHandler.previousSibling.onDOMresize(holder.inner.offsetWidth, holder.inner.offsetHeight);
            vHandler.nextSibling.onDOMresize(holder.inner.offsetWidth, holder.inner.offsetHeight);
        };
        
        vHandler.onDragStop = function() {
            vHandler.previousSibling.onDOMresize(holder.inner.offsetWidth, holder.inner.offsetHeight);
            vHandler.nextSibling.onDOMresize(holder.inner.offsetWidth, holder.inner.offsetHeight);

            /*
            var checksum = 0;
            for (var i = 0; i<holder.__splits.length; i++) {
                console.log(i+': >'+holder.__splits[i].offsetTop +' < '+ (holder.__splits[i].offsetTop + holder.__splits[i].offsetHeight));
                checksum += holder.__splits[i].offsetHeight;
            }
            console.log('checksum: '+checksum);
            */
            holder.notifyParent('resize', holder );
        };
        
        vHandler._dragListener = 
                    new dragObject(vHandler, null, new Position(0, -5000), new Position(0, 5000), 
                                   vHandler.onDragStart, vHandler.onDragRun, vHandler.onDragStop, null, true);
    };

    
    holder.split = function(configPieces, splitMode) {
        
        var numPieces = configPieces.length + 1;
        
        if (numPieces < 2) 
            throw 'A splitter cannot be "splitted" in less than 2 pieces';
        
        splitMode = splitMode || 'V';
        
        if (splitMode != 'H' && splitMode != 'V')
            throw 'splitMode parameter should be "H" (horizontal) or "V" (vertical)';
        
        holder.__splitMode = splitMode;
        
        for (var i=0; i<numPieces; i++) {

            tmp = 
                function (index, splitMode) {

                    var piece =

                    holder.inner.appendChild(
                        piece = $('div', 'Split'.concat(splitMode))
                    )

                    holder.__splits.push(
                        piece
                    );

                    piece.config = configPieces[i];
                    piece.splitIndex = index;
                    piece.splitter = null;

                    if (index < numPieces-1) {
                        piece.handle = holder.inner.appendChild(
                            $('div', splitMode.concat('SplitHandle'))
                        );

                        holder.__handles.push(piece.handle);

                        if (splitMode == 'H') piece._height= configPieces[index];
                        if (splitMode == 'V') piece._width = configPieces[index];
                    } else {
                        if (splitMode == 'H') piece._width = false;
                        if (splitMode == 'V') piece._height= false;
                    }


                    switch (splitMode) {
                        case 'V':

                            piece.getStart = function() {
                                return (piece.previousSibling && piece.previousSibling.previousSibling) ? 
                                    (piece.previousSibling.previousSibling.offsetLeft +
                                     piece.previousSibling.previousSibling.offsetWidth
                                    ) : 0;
                            };

                            //instead of setting a width to the piece,
                            //we rather prefere to setup a 'right' styling,
                            //in order to not make padding influenceable.
                            piece.getStop = function(start, dimension) {
                                var ret = piece.nextSibling ? (piece.parentNode.offsetWidth - start - dimension) : 0;
                                return (ret < 0) ? 0 : ret;
                            };

                            piece._dummyLeft = 0;

                            piece.DOManchors = {
                                'left': function(w,h) {
                                    piece._dummyLeft = piece.getStart();
                                    if (piece.previousSibling) 
                                        piece.previousSibling.style.left = piece._dummyLeft - 2 + 'px';
                                    return piece._dummyLeft + 'px';
                                },
                                'right': function(w,h) {
                                    return piece.getStop( piece._dummyLeft, piece._width ) + 'px';
                                } /*,
                                'debug': function(w,h) {
                                    console.log(piece.splitIndex + ': '+piece.style.left + ', '+piece.style.right);
                                    return '';
                                }*/
                            };


                            //now, attach an event listener
                            if (piece.previousSibling)
                                holder.attachVRHandler(piece.previousSibling);

                            break;

                        case 'H':
                            piece.getStart = function() {
                                return (piece.previousSibling && piece.previousSibling.previousSibling) ? 
                                    (piece.previousSibling.previousSibling.offsetTop +
                                     piece.previousSibling.previousSibling.offsetHeight
                                    ) : 0;
                            };
                            
                            //instead of setting a height to the piece,
                            //we rather prefere to setup a 'bottom' styling,
                            //in order to not make padding influenceable.
                            piece.getStop = function(start, dimension) {
                                var ret = piece.nextSibling ? (piece.parentNode.offsetHeight - start - dimension) : 0;
                                return (ret < 0) ? 0 : ret;
                            };
                        
                            piece._dummyTop = 0;
                        
                            piece.DOManchors = {
                                'top': function(w,h) {
                                    piece._dummyTop = piece.getStart();
                                    if (piece.previousSibling) 
                                        piece.previousSibling.style.top = piece._dummyTop - 2 + 'px';
                                    return piece._dummyTop + 'px';
                                },
                                'bottom': function(w,h) {
                                    return piece.getStop( piece._dummyTop, piece._height ) + 'px';
                                }/*,
                                'debug': function(w,h) {
                                    console.log(piece.splitIndex + ': '+piece.style.top + ', '+piece.style.bottom + ', '+piece._height);
                                    return '';
                                }*/
                            };
                            
                            //now, attach an event listener
                            if (piece.previousSibling)
                                holder.attachHRHandler(piece.previousSibling);
                            
                            break;
                    }
                    
                    piece.insert = function() {
                        
                        if ( !arguments.length )
                            return;
                        
                        var firstArg = arguments[0];
                        
                        if ( !( firstArg instanceof Node ) || hasStyle( firstArg, 'SplitH' ) || hasStyle( firstArg, 'SplitV' ) )
                            return;
                        
                        var lastArg = null;
                        for (var i=0; i<arguments.length; i++) {
                            lastArg = arguments[i];
                            piece.appendChild(lastArg);
                            lastArg.onDOMresize(piece.offsetWidth, piece.offsetHeight);
                        }
                        return lastArg;
                    };
                    
                    piece.split = function(configPieces, splitMode) {
                        piece.innerHTML = '';
                        
                        var splitter = piece.appendChild(new SplitterSurface());
                        
                        splitter.style.border = 'none';
                        
                        piece.style.overflow = 'hidden';
                        piece._items = splitter;
                        piece._items.split(configPieces, splitMode);
                        
                        piece._items.DOManchors = {
                            'width': function(w,h) { return w+'px'; },
                            'height':function(w,h) { return h+'px'; }
                        };
                        
                        piece._items.onDOMresize(piece.offsetWidth, piece.offsetHeight);
                        
                        piece.__splits = piece._items.__splits;
                        
                        piece.cells = function(cellIndex) {
                           return typeof(cellIndex) != 'undefined' ? piece.__splits[cellIndex] : piece.__splits;
                        };
                        
                        piece.handles = function(handleIndex) {
                            return typeof handleIndex != 'undefined' ? piece.__handles[handleIndex] : piece.__handles;
                        };
                        
                        piece.setSplitAt = function(arr) {
                           return piece._items.setSplitAt(arr);
                        };
                    }
                    
                    return piece;
                }(i, splitMode);
                
        }
    };
    
    holder.inner.DOManchors = {
        'width':   function(w,h) { return w + 'px'; },
        'height':  function(w,h) { return h + 'px'; }/*,
        'dummy':   function() { console.log('holder.inner.domresize'); return ''; }*/
    };
    
    holder.setSplitAt = function(arr) {
        var splDefs = [];
        for (var i=0; i<holder.__splits.length; i++) {
            splDefs.push(i < arr.length ? arr[i] : (holder.__splitMode == 'V' ? holder.__splits[i]._width : holder.__splits[i]._height));
        }
        
        var w = (holder.__splitMode == 'V') ? holder.offsetWidth : holder.offsetHeight;
        
        var numAuto = 0;
        var sumMan  = 0;
        
        for (var i=0; i<splDefs.length; i++) {
            if (splDefs[i] === false) numAuto++; else
            sumMan += splDefs[i];
        }
        
        var autoDim = Math.floor( (w - sumMan) / numAuto );
        
        for (var i=0; i < splDefs.length; i++) {
           splDefs[i] = (splDefs[i] === false) ? autoDim : splDefs[i];
           if (holder.__splitMode == 'V')
              holder.__splits[i]._width = splDefs[i];
           else
              holder.__splits[i]._height= splDefs[i];
           
           holder.__splits[i].onDOMresize(holder.offsetWidth, holder.offsetHeight);
        }
    };
    
    return holder;
}

function Splitter(config) {
    var holder = $('div','DomSplitter');
    
    EnableCustomEventListeners( holder );
    
    holder.splitter = holder.appendChild(new SplitterSurface(config));
    
    holder.splitter.DOManchors = {
        'width': function(w,h) { return w - 4 + 'px'; },
        'height': function(w,h){ return h - 4 + 'px'; }
    };
    
    holder.cells = function(cellIndex) {
       return holder.splitter.cells(cellIndex);
    };
    
    holder.handles = function(handleIndex) {
        return holder.splitter.handles(handleIndex);
    };
    
    holder.split = function(arr, mode) {
      return holder.splitter.split(arr, mode);
    };
    
    holder.setSplitAt = function(arr) {
      return holder.splitter.setSplitAt(arr);
    };
    
//     holder.style.backgroundColor = 'red';
    
    return holder;
}
