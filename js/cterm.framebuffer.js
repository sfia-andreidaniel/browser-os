var CRTProto = {
    // Video text-mode characters attributes.
    // Note that in an attribute the colors indexes are also packed
    "ATTR_DEFAULT"  : 240 , //0x00F0,
    "ATTR_REVERSE"  : 256 , //0x0100,
    "ATTR_UNDERLINE": 512 , //0x0200,
    "ATTR_DIM"      : 1024, //0x0400,
    "ATTR_BRIGHT"   : 2048, //0x0800,
    "ATTR_BLINK"    : 4096, //0x1000,
    
    // Video text-mode colors
    "colors": null, // will be automatically assigned with setPalette call
    
    "palette": "linux",
    
    "palettes": {
        "linux": {
            
            "fg": [ "#000000", "#aa0000", "#00aa00", "#aa5500", "#0000aa", "#aa00aa", "#00aaaa", "#aaaaaa",
                    "#555555", "#ff5555", "#55ff55", "#ffff55", "#5555ff", "#ff55ff", "#55ffff", "#ffffff" ],
            
            "bg": [ "#000000", "#aa0000", "#00aa00", "#aa5500", "#0000aa", "#aa00aa", "#00aaaa", "#aaaaaa",
                    "#555555", "#ff5555", "#55ff55", "#ffff55", "#5555ff", "#ff55ff", "#55ffff", "#ffffff" ]
            
        },
        "tango": {

            "fg": [ "#000000", "#cc0000", "#4e9a06", "#c4a000", "#3465a4", "#75507b", "#06989a", "#d3d7cf",
                    "#555753", "#ef2929", "#8ae234", "#fce94f", "#729fcf", "#ad7fa8", "#34e2e2", "#eeeeec" ],
            
            "bg": [ "#000000", "#cc0000", "#4e9a06", "#c4a000", "#3465a4", "#75507b", "#06989a", "#d3d7cf",
                    "#555753", "#ef2929", "#8ae234", "#fce94f", "#729fcf", "#ad7fa8", "#34e2e2", "#eeeeec" ]
            
        },
        "xterm": {

            "fg": [ "#000000", "#cd0000", "#00cd00", "#cdcd00", "#1e90ff", "#cd00cd", "#00cdcd", "#e5e5e5",
                    "#4c4c4c", "#ff0000", "#00ff00", "#ffff00", "#4682b4", "#ff00ff", "#00ffff", "#ffffff" ],
            
            "bg": [ "#000000", "#cd0000", "#00cd00", "#cdcd00", "#1e90ff", "#cd00cd", "#00cdcd", "#e5e5e5",
                    "#4c4c4c", "#ff0000", "#00ff00", "#ffff00", "#4682b4", "#ff00ff", "#00ffff", "#ffffff" ]

        },
        "rxvt": {
        
            "fg": [ "#000000", "#cd0000", "#00cd00", "#cdcd00", "#0000cd", "#cd00cd", "#00cdcd", "#faebd7", 
                    "#404040", "#ff0000", "#00ff00", "#ffff00", "#0000ff", "#ff00ff", "#00ffff", "#ffffff" ],
            
            "bg": [ "#000000", "#cd0000", "#00cd00", "#cdcd00", "#0000cd", "#cd00cd", "#00cdcd", "#faebd7", 
                    "#404040", "#ff0000", "#00ff00", "#ffff00", "#0000ff", "#ff00ff", "#00ffff", "#ffffff" ]
        
        }
    },
    
    "blinkTick"     : true,
    "cursorTick"    : true,
    
    "fontSettings"  : {},
    "domTester"     : null,
    "getFontWidthHeight": function( fontFace, fontSize ) {
    
        //console.log("GetFontWidthHeight: ", fontFace, fontSize );
        
        var fontKey = fontFace.concat( '_' + fontSize );
        
        if ( typeof this.fontSettings[ fontKey ] != 'undefined' )
            return this.fontSettings[ fontKey ];
        else {
            this.domTester = this.domTester ||
                            document.body.appendChild(
                                $('div') .setAttr('style', 'padding: 0; margin: 0; position: absolute; left: -1000px; top: -1000px;')
                                    .setHTML('█')
                            );
            this.domTester.style.fontFamily = fontFace;
            this.domTester.style.fontSize = fontSize;
            return this.fontSettings[ fontKey ] = {
                "width": this.domTester.offsetWidth,
                "height": this.domTester.offsetHeight
            };
        }
    },
    
    "subscribers": [],
    "numSubscribers": 0,
    
    "paintLoop": function() {
        
        if ( CRTProto.numSubscribers == 0 )
            return;
        
        webkitRequestAnimationFrame( CRTProto.paintLoop );
        //setTimeout( CRTProto.paintLoop, 500 ); //paint @1fps
        
        for ( var i=0; i<CRTProto.numSubscribers; i++ )
            CRTProto.subscribers[i].render();
    },
    
    "addSubscriber": function( framebuffer ) {
        for ( var i=0,len=this.nubSubscribers; i<len; i++ )
            if ( subscribers[i] == framebuffer )
                return;
        this.subscribers.push( framebuffer );
        this.numSubscribers++;
        if ( this.numSubscribers == 1 )
            this.paintLoop();
    },
    "removeSubscriber": function( framebuffer ) {
        for ( var i=0,len=this.numSubscribers; i<len; i++ ) {
            if ( framebuffer == this.subscribers[i] ) {
                this.subscribers.splice( i, 1 );
                this.numSubscribers--;
            }
        }
    },
    
    "setPalette": function( paletteName ) {
        if ( typeof this.palettes[ paletteName ] != 'undefined' ) {
            this.colors = this.palettes[ this.palette = paletteName ];
            for ( var i=0,len=this.subscribers.length; i<len; i++ )
                this.subscribers[i].changed = true;
        } else
        throw "Unknown palette name: " + paletteName;
    }

};

addOnload(function request (){
    if ( window.userStorage ) {
        var settings = userStorage.getItem("VT101", { "palette": "linux" });
        CRTProto.setPalette( settings.palette);
    } else setTimeout( request, 1000 );
});

setInterval( function() {
    CRTProto.blinkTick = !CRTProto.blinkTick;
    for ( var i=0, len=CRTProto.subscribers.length; i<len; i++ )
        CRTProto.subscribers[i].changed = true;
}, 800 );

setInterval( function() {
    CRTProto.cursorTick = !CRTProto.cursorTick;
    for ( var i=0,len = CRTProto.subscribers.length; i<len; i++ ) {
        if ( CRTProto.subscribers[i].blinkingCursor )
            CRTProto.subscribers[i].renderCursor();
    }
}, 300 );

function CRT_Rom( fb ) {
    this.fb = fb;
    this._attr = 240 /* CRTProto.ATTR_DEFAULT */;
    this._chr  = '';
    this._selected = false;
}

Object.defineProperty( CRT_Rom.prototype, "attr", {
    "get": function() {
        return this._attr;
    },
    "set": function( i ) {
        this._attr = i;
        this.fb.changed = true;
    }
} );

Object.defineProperty( CRT_Rom.prototype, "chr", {
    "get": function() {
        return this._chr;
    },
    "set": function( ch ) {
        this._chr = ch;
        this.fb.changed = true;
    }
} );

function CRT_FrameBuffer() {
    
    return $('div', 'DOMTerm').chain( function() {
        
        // rom pages
        var mem        = [ [], [] ];
        var activePage = 0;
        
        // cursor
        var cursorX = 0;
        var cursorY = 0;
        var blinkingCursor = false;
        var cursorNeedsShowing = true;
        var solidCursor = false;
        
        
        // font
        var fontFace   = 'monospace';
        var fontSize   = '14px';
        var charWidth  = 0; // dimension of a font character width
        var charHeight = 0  // dimension of a font character height
        
        // dimensions
        var lines = 0;
        var cols = 0;
        var width = 0;
        var height = 0;
        
        // canvas
        var canvas = this.appendChild($('canvas'));
        var ctx = canvas.getContext('2d');
        var changed = false;
        
        // appearence
        var attr = 240 /* CRTProto.ATTR_DEFAULT */;
        var isInverted = false;
        
        /* Selection object */
        var selection = {},
            selectionLength = 0,
            selectionStartX = 0,
            selectionStartY = 0,
            selectionStopX  = 0,
            selectionStopY  = 0,
            selectionMode   = false;
        
        Object.defineProperty( this, "selection", {
            "get": function() {
                return selection;
            }
        } );
        
        Object.defineProperty( selection, "length", {
            "get": function() {
                return selectionLength;
            }
        } );
        
        var updateSelection = throttle( function() {
            var mark = false;
            for ( var line=0; line < lines; line++ ) {
                for ( var col = 0; col < cols; col++ ) {
                    if ( col == selectionStartX && line == selectionStartY ) {
                        mark = true;
                    }
                    if ( col == selectionStopX && line == selectionStopY ) {
                        mark = false;
                    }

                    mem[ activePage ][ line ][ col ]._selected = mark;
                }
            }
            changed = true;
        }, 10 );
        
        Object.defineProperty( selection, "start", {
            "get": function() {
                return { "x": selectionStartX, "y": selectionStartY };
            },
            "set": function( o ) {
                if ( o && ( typeof o.x == 'number' ) && ( typeof o.y == 'number' ) ) {
                    selectionStartX = o.x < 0
                        ? 0
                        : ( o.x >= cols
                            ? Math.max( cols - 1, 0 )
                            : o.x
                        );
                    selectionStartY = o.y < 0
                        ? 0
                        : ( o.y >= lines
                            ? Math.max( lines - 1, 0 )
                            : o.y
                        );
                } else throw "Invalid selection start object. Expected { x: ..., y: ... }!";
                
                selectionStartX = Math.min( selectionStartX, selectionStopX );
                selectionStartY = Math.min( selectionStartY, selectionStopY );
                selectionStopX  = Math.max( selectionStartX, selectionStopX );
                selectionStopY  = Math.max( selectionStartY, selectionStopY );
                selectionLength = ( selectionStopX - selectionStartX ) + (
                    ( selectionStopY - selectionStartY ) * cols
                );
                
                updateSelection.run();
            }
        } );
        
        Object.defineProperty( selection, "stop", {
            "get": function() {
                return { "x": selectionStopX, "y": selectionStopY };
            },
            "set": function( o ) {
                if ( o && ( typeof o.x == 'number' ) && ( typeof o.y == 'number') ) {
                    selectionStopX = o.x < 0
                        ? 0
                        : ( o.x >= cols
                            ? Math.max( cols - 1, 0 )
                            : o.x
                        );
                    selectionStopY = o.y < 0
                        ? 0
                        : ( o.y >= lines
                            ? Math.max( lines - 1, 0 )
                            : o.y
                        );
                } else throw "Invalid selection start object. Expected { x: ..., y: ... }!";

                selectionStartX = Math.min( selectionStartX, selectionStopX );
                selectionStartY = Math.min( selectionStartY, selectionStopY );
                selectionStopX  = Math.max( selectionStartX, selectionStopX );
                selectionStopY  = Math.max( selectionStartY, selectionStopY );
                selectionLength = ( selectionStopX - selectionStartX ) + (
                    ( selectionStopY - selectionStartY ) * cols
                );
                updateSelection.run();
            }
        } );
        
        selection.getText = function( preserveEndSpaces ) {
            preserveEndSpaces = !!preserveEndSpaces;
            
            var lines = [], sline = '', mark = false, code;
            
            for ( var line=selectionStartY; line <= selectionStopY; line++ ) {
                for ( var col = 0; col < cols; col++ ) {
                    if ( col == selectionStartX && line == selectionStartY ) {
                        mark = true;
                    }
                    if ( col == selectionStopX && line == selectionStopY ) {
                        mark = false;
                    }

                    if ( (col == 0) && (line > selectionStartY) && mark ) {
                        lines.push( sline );
                        sline = '';
                    }
                    
                    if ( mark )
                        sline += ( ( code = ( mem[activePage][line][col]._chr || ' ').charCodeAt(0) ) < 32 ? ' ' : String.fromCharCode( code ) );
                }
            }
            
            lines.push( sline );
            
            lines = lines.join('\n');
            
            if ( !preserveEndSpaces )
                lines = lines.replace( /[\s]+\n/g, '\n' );
            
            return lines;
        };
        
        // translates a pixel [ X, Y ] to a [ column, line ]
        var piXYtoCL = function( pixelX, pixelY ) {
            return {
                "x": ( pixelX / charWidth ) << 0,
                "y": ( pixelY / charHeight) << 0
            };
        };
        
        (function( fb ) {

            fb.addEventListener( 'mousedown', function(e) {
                if ( e.which == 1 ) {
                    if ( e.shiftKey ) {
                        selectionMode = !!( fb.selection.start = fb.selection.stop = piXYtoCL( e.layerX, e.layerY ) );
                    } else {
                        fb.selection.start = fb.selection.stop = { "x": 0, "y": 0 };
                    }
                } else
                if ( e.which == 2 ) {
                    fb.onCustomEvent('paste');
                }
            });
            
            fb.addEventListener( 'mousemove', function(e) {
                if ( selectionMode ) {
                    fb.selection.stop = piXYtoCL( e.layerX, e.layerY );
                }
            } );
            
            fb.addEventListener( 'mouseup', function(e) {
                if ( selectionMode ) {
                    fb.selection.stop = piXYtoCL( e.layerX, e.layerY );
                    fb.onCustomEvent('clipboardData', fb.selection.getText() );
                    //fb.selection.start = fb.selection.stop = { "x": 0, "y": 0 };
                    selectionMode = false;
                }
            });
        
        })( this );
        
        var resizeNotifier = (function( framebuffer ) { 
            return throttle( function() {
                framebuffer.onCustomEvent('resize');
            }, 100 );
        })( this );
        
        this.malloc = function( len ) {
            var o = [];
            for ( var i=0; i<len; i++ )
                o.push( new CRT_Rom( this ) );
            return o;
        }
        
        Object.defineProperty( this, "solidCursor", {
            "get": function() {
                return solidCursor;
            },
            "set": function( b ) {
                solidCursor = !!b;
            }
        } );
        
        Object.defineProperty( this, "lines", {
            "get": function() {
                return lines;
            },
            "set": function( i ) {
                if ( i != lines ) {
                    if ( lines < i ) {
                        // increase memory size
                        for ( var scr = 0, scrn = mem.length; scr < scrn; scr++ ) {
                            for ( var line = lines; line < i; line++ ) {
                                mem[ scr ].push( this.malloc( cols ) );
                            }
                        }
                    } else 
                    if ( lines > i ) {
                        // decrease memory size
                        while ( lines-- != i ) {
                            for ( var scr=0, scrn = mem.length; scr<scrn; scr++ )
                                mem[ scr ].splice(0,1);
                        }
                    }
                    
                    lines = i;
                    
                    if ( cursorY >= lines )
                        cursorY = lines - 1;
                    if ( cursorY < 0 )
                        cursorY = 0;
                    
                    this.selection.start = this.selection.start;
                    this.selection.stop  = this.selection.stop;
                    
                    changed = true;
                    
                    resizeNotifier.run();
                }
            }
        } );
        
        Object.defineProperty( this, "cols", {
            "get": function() {
                return cols;
            },
            "set": function( i ) {
                if ( i != cols ) {
                    if ( i > cols ) {
                        // increase memory size
                        for ( var line = 0; line < lines; line++ ) {
                            for ( var scr=0,scrn = mem.length; scr < scrn; scr++ ) {
                                Array.prototype.splice.apply( mem[ scr ][ line ], [ cols, 0 ].merge( this.malloc( i - cols ) ) );
                            }
                        }
                    } else 
                    if ( i < cols ) {
                        // decrease memory size
                        for ( var line = 0; line < lines; line++ ) {
                            for ( var scr=0,scrn=mem.length; scr<scrn; scr++ ) {
                                Array.prototype.splice.apply( mem[scr][line], [ i, cols - i ] );
                            }
                        }
                    }
                    
                    cols = i;
                    
                    if ( cursorX >= cols )
                        cursorX = cols - 1;
                    if ( cursorX < 0 )
                        cursorX = 0;
                    
                    this.selection.start = this.selection.start;
                    this.selection.stop  = this.selection.stop;

                    changed = true;
                    
                    resizeNotifier.run();
                }
            }
        });
        
        Object.defineProperty( this, "mem", {
            "get": function( ) {
                return mem[ activePage ];
            }
        } );
        
        Object.defineProperty( this, "activePage", {
            "get": function( ) {
                return activePage;
            },
            "set": function(i) {
                if ( i >= 0 && i < mem.length ) {
                    activePage = i;
                    this.selection.start = this.selection.stop = { "x": 0, "y": 0 };
                    updateSelection.run();
                    changed = true;
                    this.render();
                } else throw "Failed to set framebuffer rom page #" + i;
            }
        } );
        
        Object.defineProperty( this, "cursorX", {
            "get": function() {
                return cursorX;
            },
            "set": function( i ) {
                if ( i != cursorX ) {
                    cursorX = i < 0 
                        ? 0
                        : i >= cols
                            ? cols - 1
                            : i;
                }
            }
        } );
        
        Object.defineProperty( this, "cursorY", {
            "get": function() {
                return cursorY;
            },
            "set": function( i ) {
                if ( i != cursorY ) {
                    cursorY = i < 0
                        ? 0
                        : i >= lines
                            ? lines - 1
                            : i;
                }
            }
        } );
        
        Object.defineProperty( this, "cursorNeedsShowing", {
            "get": function() {
                return cursorNeedsShowing;
            },
            "set": function( b ) {
                if ( cursorNeedsShowing != !!b ) {
                    cursorNeedsShowing = !!b;
                    changed = true;
                }
            }
        } );
        
        Object.defineProperty( this, "isInverted", {
            "get": function() {
                return isInverted;
            },
            "set": function( b ) {
                if ( isInverted != !!b ) {
                    isInverted = !!b;
                    changed = true;
                }
            }
        } );
        
        Object.defineProperty( this, "blinkingCursor", {
            "get": function() {
                return blinkingCursor;
            },
            "set": function( b ) {
                if ( blinkingCursor != !!b ) {
                    blinkingCursor = !!b;
                    changed = true;
                }
            }
        } );
        
        Object.defineProperty( this, "attr", {
            "get": function() {
                return attr;
            },
            "set": function( i ) {
                attr = i;
            }
        } );
        
        Object.defineProperty( this, "changed", {
            "get": function() {
                return changed;
            },
            "set": function( b ) {
                changed = true;
            }
        } );
        
        this.render = function() {
            
            if ( !changed )
                return;
            
            changed = false;
            
            var underline,
                dim,
                bright,
                blink,
                att,
                bg,
                fg,
                tmp,
                brights = [ 'normal ' + fontSize + ' "' + fontFace + '"', 'bold ' + fontSize + ' "' + fontFace + '"' ],
                _x, _y,
                ch,
                cxfg = null, cxbg = null, cxchr = null,
                rom,
                selected;
            
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            
            for ( var line = 0; line < lines; line++ ) {
                for ( var col = 0; col < cols; col++ ) {
                    
                    rom = mem[ activePage ][ line ][ col ];
                    att = rom._attr;
                    ch  = rom._chr;
                    selected = rom._selected;
                    
                    underline =  att & 512 /* CRTProto.ATTR_UNDERLINE */;
                    
                    bg = ( att >> 4 ) & 0XF;
                    fg = att & 0XF;
                    
                    if ( bg == 0XF ) {
                        bg = 0;
                        if ( fg == 0 ) {
                            fg = 15;
                        }
                    }
                    
                    if ( att & 256 /* CRTProto.ATTR_REVERSE */ ) {
                        tmp = bg; bg = fg; fg = tmp;
                    }
                    
                    if ( ( isInverted && !selected ) || ( selected && !isInverted ) ) {
                        tmp = bg; bg = fg; fg = tmp;
                    }
                    
                    bright = 0;
                    if ( (att & (256 /* CRTProto.ATTR_REVERSE */ | 1024 /* CRTProto.ATTR_DIM */)) == 1024 /* CRTProto.ATTR_DIM */) {
                        fg = 8;
                    } else 
                    if ( att & 2048 /* CRTProto.ATTR_BRIGHT */ ) {
                        fg |= 8;
                        bright = 1;
                    }
                    
                    blink = ( att & 4096 /* CRTProto.ATTR_BLINK */ ) ? 1 : 0;
                    
                    // paint background
                    ctx.fillStyle = CRTProto.colors.bg[ bg ];
                    ctx.fillRect( _x = col * charWidth, _y = line * charHeight, charWidth, charHeight );
                    
                    if ( ( blink && CRTProto.blinkTick ) || !blink ) {
                        // paint char if is not blink or if blink tick is true
                        ctx.font = brights[ bright ];
                        ctx.fillStyle = CRTProto.colors.fg[ fg ];
                        ctx.fillText( ch, _x, _y + charHeight );
                        // paint underline
                        if ( underline )
                            ctx.fillRect( _x, _y + charHeight - 3, charWidth, 2 );
                    }
                }
            }
            
            this.renderCursor();
            
        }
        
        this.renderCursor = function() {
            
            if (!cursorNeedsShowing || !mem[activePage].length) return;
            
            var att, ch, bg, fg, tmp, bright, brights = [ 'normal ' + fontSize + ' "' + fontFace + '"', 'bold ' + fontSize + ' "' + fontFace + '"' ], 
               _x, _y, rom, selected, underline, blink;
            
            rom = mem[ activePage ][ cursorY ][ cursorX ];
            
            att = rom._attr;
            ch  = rom._chr;
            selected = rom._selected;
            
            underline =  att & 512 /* CRTProto.ATTR_UNDERLINE */;
            
            bg = ( att >> 4 ) & 0XF;
            fg = att & 0XF;
                    
            if ( bg == 0XF ) {
                bg = 0;
                if ( fg == 0 ) {
                    fg = 15;
                }
            }
            
            if ( att & 256 /* CRTProto.ATTR_REVERSE */ ) {
                tmp = bg; bg = fg; fg = tmp;
            }
                    
            if ( ( isInverted && !selected ) || ( selected && !isInverted ) ) {
                tmp = bg; bg = fg; fg = tmp;
            }
            
            bright = 0;
            if ( (att & (256 /* CRTProto.ATTR_REVERSE */ | 1024 /* CRTProto.ATTR_DIM */)) == 1024 /* CRTProto.ATTR_DIM */) {
                fg = 8;
            } else 
            if ( att & 2048 /* CRTProto.ATTR_BRIGHT */ ) {
                fg |= 8;
                bright = 1;
            }
                    
            blink = ( att & 4096 /* CRTProto.ATTR_BLINK */ ) ? 1 : 0;
            
            //console.log( ch, blink, CRTProto.blinkTick, solidCursor );
            
            // if cursor is visible, show cursor
            if ( !blinkingCursor || ( blinkingCursor && CRTProto.cursorTick ) ) {

                if ( solidCursor ) {
                    ctx.fillStyle   = CRTProto.colors.fg[ fg ];
                    ctx.fillRect( cursorX * charWidth + 1, cursorY * charHeight + 1, charWidth - 1, charHeight - 1 );
                } else {
                    ctx.fillStyle   = CRTProto.colors.fg[ fg ];
                    ctx.fillRect( cursorX * charWidth, cursorY * charHeight , charWidth, charHeight  );
                    ctx.fillStyle   = CRTProto.colors.bg[ bg ];
                    ctx.fillRect( cursorX * charWidth + 1 , cursorY * charHeight + 1 , charWidth - 2, charHeight - 2 );
                }
                
                if ( ( blink && CRTProto.blinkTick ) || !blink ) {
                    ctx.fillStyle = solidCursor ? CRTProto.colors.bg[ bg ] : CRTProto.colors.fg[ fg ];
                    // paint char if is not blink or if blink tick is true
                    ctx.font = brights[ bright ];
                    ctx.fillText( ch, _x = cursorX * charWidth, ( _y = cursorY * charHeight  ) + charHeight );
                    // paint underline
                    if ( underline )
                        ctx.fillRect( _x, _y + charHeight - 3, charWidth, 2 );
                }
            } else {
                
                ctx.fillStyle   = CRTProto.colors.bg[ bg ];
                ctx.fillRect( _x = cursorX * charWidth, _y = cursorY * charHeight, charWidth, charHeight );

                if ( ( blink && CRTProto.blinkTick ) || !blink ) {
                    ctx.fillStyle = CRTProto.colors.fg[ fg ];
                    
                    // paint char if is not blink or if blink tick is true
                    ctx.font = brights[ bright ];
                    ctx.fillText( ch, _x, _y + charHeight );
                    // paint underline
                    if ( underline )
                        ctx.fillRect( _x, _y + charHeight - 3, charWidth, 2 );
                }
            }
        }
        
        Object.defineProperty( this, "width", {
            "get": function() {
                return width;
            },
            "set": function( i ) {
                i = i < 0 ? 0 : i;
                if ( i != width || changed ) {
                    width = i;
                    canvas.width = width;
                    this.cols = ( width / charWidth ) >> 0;
                    changed = true;
                }
            }
        } );
        
        Object.defineProperty( this, "height", {
            "get": function() {
                return height;
            },
            "set": function( i ) {
                i = i < 0 ? 0 : i;
                if ( i != height || changed) {
                    height = i;
                    canvas.height = height;
                    this.lines = ( height / charHeight ) >> 0;
                    changed = true;
                }
            }
        } );

        this.setFont = function( fSize, fFamily ) {
        
            fontSize = fSize;
            fontFace = fFamily;

            var wh = CRTProto.getFontWidthHeight( fFamily, fSize );
                
            charWidth  = wh.width;
            charHeight = wh.height;
            
            changed = true;
        }
        
        this.setLinesCols = function( lines, cols ) {
            this.lines = lines;
            this.cols = cols;
        };
        
        var anchors = {
            "_dummy": function(w,h) {
                (function( vt ) {
                    setTimeout( function() {
                        vt.width = vt.offsetWidth;
                        vt.height= vt.offsetHeight;
                    }, 1 );
                })( this );
            }
        };
        
        Object.defineProperty( this, "DOManchors", {
            "get": function() {
                return anchors;
            },
            "set": function( o ) {
                for ( var key in anchors ) {
                    if ( key != "_dummy" && anchors.propertyIsEnumerable( key ) )
                        delete anchors[ key ];
                }
                o = o || {};
                for ( var key in o ) {
                    if ( key != "_dummy" && o.propertyIsEnumerable( key ) )
                        anchors[ key ] = o[ key ];
                }
            }
        } );
        
        this.setFont( fontSize, fontFace );
        
        Object.defineProperty( this, "charWidth", {
            "get": function() {
                return charWidth;
            },
            "set": function( i ) {
                if ( i < 4 || i == charWidth )
                    return;
                charWidth = i;
                changed = true;
                this.width = this.width;
            }
        } );

        Object.defineProperty( this, "charHeight", {
            "get": function() {
                return charHeight;
            },
            "set": function( i ) {
                if ( i < 4 || i == charHeight )
                    return;
                charHeight = i;
                changed = true;
                this.height = this.height;
            }
        } );
        
        Object.defineProperty( this, "font", {
            "get": function() {
                return fontSize + " " + fontFace;
            },
            "set": function( str ) {
                var matches;
                if (!(matches = /^([\d]+px) (.*)$/.exec( str ) ) )
                    throw "Invalid font, format is: <n>px fontFace";
                
                this.setFont( matches[1], matches[2] );
                this.width = this.width;
                this.height= this.height;
                this.paint();
                changed = true;
            }
        } );
        
        this.destroy = function( ) {
            this.onCustomEvent('destroy');
            CRTProto.removeSubscriber( this );
            this.purge();
        }
        
        /*
        this.addCustomEventListener('resize', function() {
            console.log("Resized: ", this.cols, this.lines );
            return true;
        } );
        */
        
        CRTProto.addSubscriber( this );
        
    } );
    
}