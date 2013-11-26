window.CSSDefs = window.CSSDefs || {};

window.CSSDefs.isCSSBgPosition = function( str ) {
    str = ( str + '' ).toString().toLowerCase().trim();
    
    if ( str == 'inherit' ) {
        return {"x": "inherit", "y": "inherit" };
    }
    
    var x, y,
        cssDimension = /^(auto|inherit|((\-)?([\d]+\.)?[\d]+(px|pt|cm|mm|em|inch|\%)))$/i;
    
    if ( /^(left|right|center|top|bottom)([\s]+(left|right|center|top|bottom))?$/i.test( str ) ) {
        
        x = 'center';
        y = 'center';
        
        var arr = str.split( /[\s]+/ );
        
        for ( var i=0,len=arr.length; i<len; i++ ) {
            if ( ['left', 'right'].indexOf( arr[i] ) >= 0 )
                x = arr[i];
            else
            if ( ['top','bottom'].indexOf(arr[i] ) >= 0 )
                y = arr[i];
        }
        
        return { "x": x, "y": y };
    }
    
    // test if string is in css dimensions
    var arr = str.split( /[\s]+/g );
        x = '0%';
        y = '50%';
            
    if ( !isNaN( arr[0] ) || cssDimension.test( arr[0] ) )
        x = arr[0];
    else
        return null;
    
    if ( arr.length == 2 ) {
        if ( !isNaN( arr[1] ) || cssDimension.test( arr[1] ) )
            y = arr[1];
        else
            return null;
    } else {
        if ( arr.length > 2 )
            return null;
    }
        
    return {"x": x, "y": y };
    
}

window.CSSDefs.isCSSColor = function( str ) {
    str = ( str || '' ).toString().toLowerCase().trim();
    if ( str == 'inherit' )
        return true;
    return CSSColor( str );
}
        
window.CSSDefs.isCSSDimension = function(str) {
    str = ( str || '' ).toString().toLowerCase().trim();
    return /^(auto|inherit|((\-)?([\d]+\.)?[\d]+(px|pt|cm|mm|em|inch|\%)))$/i.test(str);
}

window.CSSDefs.isCSSBorderWidth = function( str ) {
    str = ( str || '' ).toString().toLowerCase().trim();
    return /^(thin|thich|medium|inherit)$/.test( str ) ||
           window.CSSDefs.isCSSDimension( str );
}

window.CSSDefs.isCSSBorderStyle = function( str ) {
    str = ( str || '' ).toString().toLowerCase().trim();
    return /^(none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset|inherit)$/.test( str );
}

window.CSSDefs.attributesPlacement = {
    "padding"                   : "style",
    "padding-top"               : "style",
    "padding-right"             : "style",
    "padding-bottom"            : "style",
    "padding-left"              : "style",
    "margin"                    : "style",
    "margin-top"                : "style",
    "margin-right"              : "style",
    "margin-bottom"             : "style",
    "margin-left"               : "style",
    "border"                    : "style",
    "border-top"                : "style",
    "border-top-style"          : "style",
    "border-top-color"          : "style",
    "border-top-width"          : "style",
    "border-right"              : "style",
    "border-right-style"        : "style",
    "border-right-color"        : "style",
    "border-right-width"        : "style",
    "border-bottom"             : "style",
    "border-bottom-style"       : "style",
    "border-bottom-color"       : "style",
    "border-bottom-width"       : "style",
    "border-left"               : "style",
    "border-left-style"         : "style",
    "border-left-color"         : "style",
    "border-left-width"         : "style",
    "border-radius"             : "style",
    "border-top-left-radius"    : "style",
    "border-top-right-radius"   : "style",
    "border-bottom-right-radius": "style",
    "border-bottom-left-radius" : "style",
    "color"                     : "style",
    "background"                : "style",
    "background-image"          : "style",
    "background-color"          : "style",
    "background-repeat"         : "style",
    "background-attachment"     : "style",
    "background-position-x"     : "style",
    "background-position-y"     : "style",
    "width"                     : "both",
    "height"                    : "both",
    "href"                      : "node",
    "target"                    : "node",
    "anchor"                    : "node",
    "id"                        : "node",
    "class"                     : "node",
    "float"                     : "style",
    "align"                     : "node",
    "text-align"                : "style",
    "clear"                     : "style",
    "position"                  : "style",
    "title"                     : "node",
    "alt"                       : "node",
    "src"                       : "node",
    "poster"                    : "node",
    "display"                   : "style",
    "autostart"                 : "node",
    "controls"                  : "node",
    "posters"                   : "none",
    "sources"                   : "none"
};

/* Converts:
   "border-radius" => "borderRadius"
   "-webkit-border-radius" => "webkitBorderRadius"
 */
window.CSSDefs.transformCSSPropertyToJavascriptNotation = function( str ) {
    var parts = str.trim(' -').split( /\-/ ),
        out = '';
    for ( var i=0, len=parts.length; i<len; i++ ) {
        if ( parts[i] && ( i != 0 ) ) {
            parts[i] = parts[i][0].toUpperCase() + parts[i].substr( 1 );
            out += parts[i];
        } else out += parts[i];
    }
    return out;
};

window.CSSDefs.setupAttributes = function( node, attributesModifications, preferredPlacement ) {
    preferredPlacement = preferredPlacement || 'style';
    
    if ( [ 'node', 'style' ].indexOf( preferredPlacement ) == -1 )
        throw "Bad preferred placement. Allowed only: 'node', 'style'";
    
    for ( var attr in attributesModifications ) {
        if ( attributesModifications.propertyIsEnumerable( attr ) ) {
            ( function( attribute, attributeValue ) {
                
                var whereToSetup = null;
                
                switch ( true ) {
                    case typeof CSSDefs.attributesPlacement[ attribute ] == 'undefined':
                    case CSSDefs.attributesPlacement[ attribute ] == 'none':
                        break;
                    case CSSDefs.attributesPlacement[ attribute ] == 'node':
                        whereToSetup = 'node';
                        break;
                    case CSSDefs.attributesPlacement[ attribute ] == 'style':
                        whereToSetup = 'style';
                        break;
                    case CSSDefs.attributesPlacement[ attribute ] == 'both':
                        whereToSetup = preferredPlacement;
                        break;
                    default:
                        break;
                }
                
                if ( whereToSetup == null )
                    return;
                
                switch ( whereToSetup ) {
                    case 'node':
                        if ( attributeValue ) {
                            node.setAttribute( attribute, attributeValue );
                        } else {
                            node.removeAttribute( attribute );
                        };
                        break;
                    case 'style':
                        node.style[ CSSDefs.transformCSSPropertyToJavascriptNotation( attribute ) ] = attributeValue;
                        break;
                }
                
            } )( attr, attributesModifications[ attr ] );
        }
    }
}

/* CSS DOMNode Editor.
   @param inputNode: string or DOM Node.
   @param options: object {
        
        // Dialog options
        
        "dialog": object {
            "width"  : int,
            "height" : int,
            "caption": string,
            "childOf": DOMNode,
            "appIcon": imageString
        },
        
        // What attributes / styles do you want to edit for that node
        
        "styles": object {
            "border"     : boolean,         // Box Model
            "padding"    : boolean,         // Box Model
            "margin"     : boolean,         // Box Model
            "color"      : boolean,         // Box Model
            "background" : boolean,         // Box Model
            "width"      : boolean,         // Box Model
            "height"     : boolean,         // Box Model
            "href"       : boolean,         // Link
            "target"     : boolean,         // Link
            "anchor"     : boolean,         // Link
            "id"         : boolean,         // Web
            "class"      : boolean,         // Web
            "title"      : boolean,         // Web
            "float"      : boolean,         // Position
            "align"      : boolean,         // Position
            "clear"      : boolean,         // Position
            "audio"      : boolean,         // Audio
            "video"      : boolean,         // Video
            "image"      : boolean,         // Image
        },
        
        // Preferred styling options
        "options" : {
            "useCSS" : boolean,             // weather to use as much possible the style attribute for setting or not
        },
        
        "integration": {
            
            "allowEmbed"    : boolean
            "maxEmbedSize"  : <integer>
            
            "allowUpload"   : boolean
            "uploadCallback": function( <CSSSourceInput> input, <string> serverFilePath ),
            "maxUploadSize": <integer>,

            "allowBrowse"   : boolean
            "browseCallback": function( <CSSSourceInput> input, <string or regular expression> contentType )
        },
        
        "init": function( inputNode, attributes ) {
            // Initialize attributes from your *optional* inputNode here
        },
        "done": function( inputNode, attributes ) {
            // Initialize your node from provided application attributes
        }
   }
*/

function CSSNodeEditor( inputNode, options ) {
    
    options = options || {};
    options.dialog = options.dialog || {};
    options.styles = options.styles || {};
    options.integration = options.integration || {};
    
    var restoreElementOnClose = document.activeElement;
    var restoreCaretPosition  = restoreElementOnClose ? window.getSelection().getCaretOffsetRelativeTo( restoreElementOnClose ) : -1;

    console.log( "On close I will focus the ", restoreElementOnClose, " at position: ", restoreCaretPosition );
    
    //console.log( "Integration: ", options.integration );
    
    //options.styles.padding    = typeof options.styles.padding == 'undefined' ? true : !!options.styles.padding;
    //options.styles.margin     = typeof options.styles.margin  == 'undefined' ? true : !!options.styles.margin;
    //options.styles.width      = typeof options.styles.width   == 'undefined' ? true : !!options.styles.width;
    //options.styles.height     = typeof options.styles.height  == 'undefined' ? true : !!options.styles.height;
    //options.styles.id         = typeof options.styles.id      == 'undefined' ? true : !!options.styles.id;
    //options.styles.class      = typeof options.styles.class   == 'undefined' ? true : !!options.styles.class;
    //options.styles.float      = typeof options.styles.float   == 'undefined' ? true : !!options.styles.float;
    //options.styles.color      = typeof options.styles.color   == 'undefined' ? true : !!options.styles.color;
    //options.styles.background = typeof options.styles.background == 'undefined' ? true : !!options.styles.background;
    
    return new Dialog({
        "width"  : options.dialog.width   || 360,
        "height" : options.dialog.height  || 410,
        "caption": options.dialog.caption || "Item properties",
        "childOf": options.dialog.childOf || null,
        "appIcon": options.dialog.appIcon || undefined,
        "minWidth": 360,
        "minHeight": 410
    }).chain( function() {
        
        var dlg = this;
        
        var modifiedAttributes = {};
        
        var styles = {
            "padding": {
                "top"   : "",
                "right" : "",
                "bottom": "",
                "left"  : ""
            },
            "margin": {
                "top": "",
                "right": "",
                "bottom": "",
                "left": ""
            },
            "border": {
                "top": {
                    "style"  : "",
                    "color"  : "",
                    "width"  : "",
                    
                    "radius" : {
                        "left": "",
                        "right": ""
                    }
                },
                
                "right": {
                    "style"  : "",
                    "color"  : "",
                    "width"  : ""
                },
                
                "bottom": {
                    "style"  : "",
                    "color"  : "",
                    "width"  : "",
                    
                    "radius" : {
                        "left": "",
                        "right": ""
                    }
                },
                
                "left": {
                    "style"  : "",
                    "color"  : "",
                    "width"  : "",
                    "radius" : ""
                }
            },
            "color": "red",
            "background": {
                "image": "",
                "position": {
                    "x": "",
                    "y" : ""
                },
                "color": "",
                "repeat": "",
                "attachment": ""
            },
            "width"    : "",
            "height"   : "",

            "href"     : "",
            "target"   : "",
            "anchor"   : "",

            "id"       : "",
            "class"    : "",
            "float"    : "",
            "align"    : "",
            "clear"    : "",
            "position" : "",
            "title"    : "",
            "alt"      : "",
            "src"      : "",
            "poster"   : "",
            "display"  : "",
            
            "autostart": "",
            "controls" : "",
            
            "posters" : ( [] ).chain( function() {
                
                this.add = function( src ) {
                
                    if ( !src )
                        return;
                
                    for ( var i=0, len=this.length; i<len; i++ )
                        if ( this[i] == src )
                            return;
                    
                    styles.posters.push( src );
                    
                    dlg.onCustomEvent('attribute-changed', {
                        "which": "posters",
                        "value": styles.posters
                    });
                    
                    if ( styles.poster == '' ) {
                        styles.poster = src;
                        dlg.onCustomEvent('attribute-changed', {
                            "which": "poster",
                            "value": styles.poster
                        });
                    }
                };
                
                this.remove = function( src ) {
                    for ( var i=0, len=this.length; i<len; i++ ) {
                        if ( this[i] == src ) {
                            this.splice( i, 1 );
                            dlg.onCustomEvent('attribute-changed', {
                                "which": "posters",
                                "value": styles.posters
                            });
                            if ( styles.poster == src ) {
                                styles.poster = '';
                                dlg.onCustomEvent('attribute-changed', {
                                    "which": "poster",
                                    "value": styles.poster
                                });
                            }
                        }
                    }
                }
                
                this.clear = function() {
                    while ( this.length > 0 )
                        this.shift();
                    
                    dlg.onCustomEvent('attribute-changed', {
                        "which": "posters",
                        "value": styles.posters
                    });
                    
                    styles.poster = '';
                    
                    dlg.onCustomEvent('attribute-changed', {
                        "which": "poster",
                        "value": styles.poster
                    });
                }
                
            } ),
            
            "sources" : ( [] ).chain( function() {
            
                this.add = function( src, type, quality ) {
                    for ( var i=0, len = styles.sources.length; i<len; i++ ) {
                        if ( styles.sources[i].src == src )
                            return;
                    }
                    
                    quality = quality || '';
                    
                    this.push( ({}).chain( function() {
                        Object.defineProperty( this, "src", {
                            "get": function() {
                                return src;
                            },
                            "set": function(str) {
                                src = str;
                                dlg.onCustomEvent('attribute-changed', {
                                    "which": "sources",
                                    "value": styles.sources
                                });
                            }
                        } );
                        Object.defineProperty( this, "type", {
                            "get": function() {
                                return type;
                            },
                            "set": function(str) {
                                type = str;
                                dlg.onCustomEvent('attribute-changed', {
                                    "which": "sources",
                                    "value": styles.sources
                                });
                            }
                        } );
                        
                        Object.defineProperty( this, "quality", {
                            "get": function() {
                                return quality;
                            },
                            "set": function(str) {
                                quality = str;
                                dlg.onCustomEvent('attribute-changed', {
                                    "which": "sources",
                                    "value": styles.sources
                                });
                            }
                        });
                    }));
                    
                    dlg.onCustomEvent('attribute-changed', {
                        "which": "sources",
                        "value": styles.sources
                    });
                };
                
                this.remove = function( src ) {
                    for ( var i=0, len=styles.sources.length; i<len; i++ ) {
                        if ( styles.sources[i].src == src ) {
                            styles.sources.splice(i, 1 );
                            dlg.onCustomEvent('attribute-changed', {
                                "which": "sources",
                                "value": styles.sources
                            });
                            return;
                        }
                    }
                };
                
                this.triggerChange = function() {
                    dlg.onCustomEvent('attribute-changed', {
                        "which": "sources",
                        "value": styles.sources
                    });
                }
            })
        };
        
        var expr = {
            "cssDimension": /^(auto|inherit|((\-)?([\d]+\.)?[\d]+(px|pt|cm|mm|em|inch|\%)))$/i,
            "float": /^(left|right|none|inherit)?$/,
            "align": /^(left|right|center|justify|inherit)$/,
            "position": /^(absolute|relative|static|inherit|fixed)?$/,
            "display": /^(none|box|flex\-box|block|flex|inline|inline\-block|inline\-flex|inline\-table|list\-item|table|table-caption|table\-cell|table\-column|table\-column\-group|table\-footer\-group|table\-header\-group|table\-row|table\-row\-group|inherit)?$/,
            "backgroundAttachment": /^(scroll|fixed|inherit)$/,
            "backgroundRepeat": /^(no\-repeat|repeat|repeat\-x|repeat\-y)$/,
            "urlImage": /^url\([\S\s]+\)$/
        };
        
        var instance = this;
        
        Object.defineProperty( this, "nodeAttributes", {
            
            "get": function() {
                
                return ({}).chain( function() {
                    
                    Object.defineProperty( this, "posters", {
                        "get": function() {
                            return styles.posters;
                        },
                        "set": function() {
                            throw "The posters property does not support direct modification, use the add, remove and clear methods of the posters property instead";
                        }
                    });
                    
                    Object.defineProperty( this, "sources", {
                        "get": function() {
                            return styles.sources;
                        },
                        "set": function(v) {
                            throw "The sources property does not support direct modification, use the add and remove methods of the source property instead";
                        }
                    } );
                    
                    Object.defineProperty( this, "autostart", {
                        "get": function() {
                            return styles.autostart;
                        },
                        "set": function(s) {
                            styles.autostart = s ? "autostart" : "";
                            instance.onCustomEvent('attribute-changed', {
                                "which": "autostart",
                                "value": styles.autostart
                            });
                        }
                    } );
                    
                    Object.defineProperty( this, "controls", {
                        "get": function() {
                            return styles.controls;
                        },
                        "set": function(s) {
                            styles.controls = s ? "controls": "";
                            instance.onCustomEvent('attribute-changed', {
                                "which": "controls",
                                "value": styles.controls
                            });
                        }
                    });
                    
                    Object.defineProperty( this, "width", {
                        "get": function() {
                            return styles.width;
                        },
                        "set": function( s ) {
                            s = ( ( s || '' ) + '' ).toLowerCase().trim();
                            if ( s == '' || expr.cssDimension.test( s ) || !isNaN( s ) ) {
                                styles.width = !isNaN( s ) && s != '' ? s + "px" : s;
                                instance.onCustomEvent('attribute-changed', {
                                    "which": "width",
                                    "value": styles.width
                                } );
                            } else throw "Bad width value!";
                        }
                    } );
                    
                    Object.defineProperty( this, "height", {
                        "get": function() {
                            return styles.height;
                        },
                        "set": function(s) {
                            s = ( ( s || '' ) + '' ).toLowerCase().trim();
                            if ( s == '' || expr.cssDimension.test( s ) || !isNaN(s) ) {
                                styles.height = !isNaN(s) && s != '' ? s + "px" : s;
                                instance.onCustomEvent('attribute-changed', {
                                    "which": "height",
                                    "value": styles.height
                                } );
                            } else throw "Bad height value!";
                        }
                    } );
                    
                    Object.defineProperty( this, "anchor", {
                        "get": function() {
                            return styles.anchor;
                        },
                        "set": function(s) {
                            styles.anchor = ( s || '' );
                            instance.onCustomEvent('attribute-changed', {
                                "which": "anchor",
                                "value": styles.anchor
                            });
                        }
                    } );
                    
                    Object.defineProperty( this, "href", {
                        "get": function() {
                            return styles.href;
                        },
                        "set": function( s ) {
                            s = ( ( s || '' ) + '' ).trim();
                            styles.href = s;
                            instance.onCustomEvent('attribute-changed', {
                                "which": "href",
                                "value": styles.href
                            } );
                        }
                    } );
                    
                    Object.defineProperty( this, "src", {
                        "get": function() {
                            return styles.src;
                        },
                        "set": function( s ) {
                            s = ( ( s || '' ) + '' );
                            styles.src = s;
                            instance.onCustomEvent('attribute-changed', {
                                "which": "src",
                                "value": s
                            } );
                        }
                    } );
                    
                    Object.defineProperty( this, "target", {
                        "get": function() {
                            return styles.target;
                        },
                        "set": function( s ) {
                            s = ( ( s || '' ) + '' ).trim();
                            styles.target = s;
                            instance.onCustomEvent('attribute-changed', {
                                "which": "target",
                                "value": s
                            } );
                        }
                    } );
                    
                    Object.defineProperty( this, "id", {
                        "get": function() {
                            return styles.id;
                        },
                        "set": function(s) {
                            s = ( ( s || '' ) + '' ).trim();
                            styles.id = s;
                            instance.onCustomEvent('attribute-changed', {
                                "which": "id",
                                "value": s
                            } );
                        }
                    } );
                    
                    Object.defineProperty( this, "class", {
                        "get": function() {
                            return styles['class'];
                        },
                        "set": function(s) {
                            s = ( ( s || '' ) + '' );
                            styles['class'] = s;
                            instance.onCustomEvent('attribute-changed', {
                                "which": "class",
                                "value": s
                            } );
                        }
                    } );

                    Object.defineProperty( this, "float", {
                        "get": function() {
                            return styles['float'];
                        },
                        "set": function(s) {
                            s = ( ( s || '' ) + '' ).toLowerCase().trim();
                            
                            if ( !expr['float'].test( s ) )
                                throw "Bad float value!";
                            
                            styles['float'] = s;
                            instance.onCustomEvent('attribute-changed', {
                                "which": "float",
                                "value": s
                            } );
                        }
                    } );

                    Object.defineProperty( this, "display", {
                        "get": function() {
                            return styles.display;
                        },
                        "set": function(s) {
                            s = ( ( s || '' ) + '' ).toLowerCase().trim();
                            
                            if ( !expr.display.test( s ) )
                                throw "Bad display value!";
                            
                            styles.display = s;
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "display",
                                "value": s
                            } );
                        }
                    } );
                    
                    Object.defineProperty( this, "align", {
                        "get": function() {
                            return styles.align;
                        },
                        "set": function(s) {
                            s = ( ( s || '' ) + '' ).toLowerCase().trim();
                            
                            if ( !expr.align.test( s ) && s != '' )
                                throw "Bad align value!";
                            
                            styles.align = s;
                            instance.onCustomEvent('attribute-changed', {
                                "which": "align",
                                "value": s
                            } );
                        }
                    } );

                    Object.defineProperty( this, "clear", {
                        "get": function() {
                            return styles.clear;
                        },
                        "set": function(s) {
                            s = ( ( s || '' ) + '' ).toLowerCase().trim();
                            
                            if ( !/^(left|right|both)?$/.test( s ) )
                                throw "Bad clear value!";
                            
                            styles.clear = s;
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "clear",
                                "value": styles.clear
                            } );
                        }
                    } );

                    Object.defineProperty( this, "position", {
                        "get": function() {
                            return styles.position;
                        },
                        "set": function(s) {
                            s = ( ( s || '' ) + '' ).toLowerCase().trim();
                            
                            if ( !expr.position.test( s ) )
                                throw "Bad position value!";
                            
                            styles.position = s;
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "position",
                                "value": s
                            } );
                        }
                    } );
                    
                    Object.defineProperty( this, "title", {
                        "get": function() {
                            return styles.title;
                        },
                        "set": function(s) {
                            s = ( ( s || '' ) + '' );
                            styles.title = s;
                            instance.onCustomEvent('attribute-changed', {
                                "which": "title",
                                "value": s
                            } );
                        }
                    } );

                    Object.defineProperty( this, "alt", {
                        "get": function() {
                            return styles.alt;
                        },
                        "set": function(s) {
                            s = ( ( s || '' ) + '' );
                            styles.alt = s;
                            instance.onCustomEvent('attribute-changed', {
                                "which": "alt",
                                "value": s
                            } );
                        }
                    } );

                    Object.defineProperty( this, "poster", {
                        "get": function() {
                            return styles.poster;
                        },
                        "set": function(s) {
                            s = ( ( s || '' ) + '' ).trim();
                            styles.poster = s;
                            instance.onCustomEvent('attribute-changed', {
                                "which": "poster",
                                "value": s
                            } );
                        }
                    } );
                    
                    Object.defineProperty( this, "color", {
                        "get": function() {
                            return styles.color;
                        },
                        "set": function( s ) {
                            s = ( ( s || '' ) + '' ).trim();

                            if ( !CSSDefs.isCSSColor( s ) )
                                throw "Bad color value!";
                            
                            styles.color = s;
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "color",
                                "value": s
                            });
                        }
                    } );
                    
                    Object.defineProperty( this, "background", {
                        "get": function() {
                            // This is a short-hand property
                            var out = [];
                            if ( styles.background.color )
                                out.push( styles.background.color );
                            if ( styles.background.image )
                                out.push( styles.background.image );
                            if ( styles.background.repeat )
                                out.push( styles.background.repeat );
                            if ( styles.background.attachment )
                                out.push( styles.background.attachment );
                            if ( styles.background.position.x && styles.background.position.y )
                                out.push( styles.background.position.x + " " + styles.background.position.y );
                            return out.join(' ');
                        },
                        "set": function( s ) {
                        
                            s = ( s || '' ).toString().trim().replace(/[\s]+/g, ' ');
                            
                            if ( s == '' ) {
                                this["background-attachment"] = '';
                                this["background-color"] = '';
                                this["background-image"] = '';
                                this["background-position"] = '';
                                this["background-repeat"] = '';
                                
                                instance.onCustomEvent('attribute-changed', {
                                    "which": "background",
                                    "value": this.background
                                } );
                                
                                return;
                            }

                            var args = s.split(' '),
                                _color = '',
                                _image = '',
                                _repeat= '',
                                _attach= '',
                                _pos   = {
                                    "x": "inherit",
                                    "y": "inherit"
                                };
                            
                            if ( args.length && !!CSSDefs.isCSSColor( args[ 0 ] ) ) {
                                _color = args[0].toLowerCase();
                                args.shift();
                            } else _color = '';
                            
                            if ( args.length && expr.urlImage.test( args[0] ) ) {
                                _image = args[0];
                                args.shift();
                            } else _image = '';
                            
                            
                            if ( args.length && expr.backgroundRepeat.test( args[0] ) ) {
                                _repeat = args[0].toLowerCase();
                                args.shift();
                            } else _repeat = '';
                            
                            
                            if ( args.length && expr.backgroundAttachment.test( args[0] ) ) {
                                _attach = args[0].toLowerCase();
                                args.shift();
                            } else _attach = '';
                            
                            if ( ( args.length && args.length <= 2 ) && ( _pos = CSSDefs.isCSSBgPosition( args.slice(0,2).join(' ') ) ) ) {
                                args.shift();
                                if ( args.length ) args.shift();
                            } else _pos = {"x": "inherit", "y": "inherit"};
                            
                            
                            if ( args.length )
                                throw "Bad background value (failed to parse: '" + args[0] + "'!";
                            
                            this['background-color'] = _color;
                            this['background-image'] = _image;
                            this['background-repeat'] = _repeat;
                            this['background-attachment'] = _attach;
                            this['background-position-x'] = _pos.x;
                            this['background-position-y'] = _pos.y;

                            instance.onCustomEvent('attribute-changed', {
                                "which": "background",
                                "value": this.background
                            } );
                        }
                    } );
                    
                    Object.defineProperty( this, "background-color", {
                        "get": function() {
                            return styles.background.color;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            
                            if ( s == '' || CSSDefs.isCSSColor( s ) )
                                styles.background.color = s;
                            else
                                throw "Bad CSS background color!";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "background-color",
                                "value": styles.background.color
                            } );
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "background",
                                "value": this.background
                            } );
                        }
                    } );
                    
                    Object.defineProperty( this, "background-image", {
                        "get": function() {
                            return styles.background.image;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().trim();
                            
                            if ( s == '' || expr.urlImage.test(s) )
                                styles.background.image = s;
                            else
                                throw "Bad CSS background image!";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "background-image",
                                "value": styles.background.image
                            } );
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "background",
                                "value": this.background
                            } );
                        }
                    } );
                    
                    Object.defineProperty( this, "background-position", {
                        "get": function() {
                            return styles.background.position.x == 'inherit' &&
                                   styles.background.position.y == 'inherit' 
                                        ? "inherit"
                                        : ( styles.background.position.x + ' ' + styles.background.position.y ).trim();
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().trim();
                            
                            var pos;
                            
                            if ( s == '' || ( pos = CSSDefs.isCSSBgPosition(s) ) ) {
                                styles.background.position = s == '' ? {
                                    "x": "inherit",
                                    "y": "inherit"
                                } : pos;
                            } else
                                throw "Bad CSS background position!";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "background-position",
                                "value": this['background-position']
                            } );
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "background",
                                "value": this.background
                            } );
                        }
                    } );
                    
                    Object.defineProperty( this, "background-repeat", {
                        "get": function() {
                            return styles.background.repeat;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().trim();
                            if ( s == '' || expr.backgroundRepeat.test( s ) ) {
                                styles.background.repeat = s;
                            } else throw "Invalid background repeat value!";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "background-repeat",
                                "value": styles.background.repeat
                            } );

                            instance.onCustomEvent('attribute-changed', {
                                "which": "background",
                                "value": this.background
                            } );
                        }
                    } );
                    
                    Object.defineProperty( this, "background-attachment", {
                        "get": function() {
                            return styles.background.attachment;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().trim();
                            if ( s == '' || expr.backgroundAttachment.test( s ) ) {
                                styles.background.attachment = s;
                            } else throw "Invalid background attachment value!";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "background-attachment",
                                "value": styles.background.attachment
                            } );

                            instance.onCustomEvent('attribute-changed', {
                                "which": "background",
                                "value": this.background
                            } );
                        }
                    } );
                    
                    Object.defineProperty( this, "background-position-x", {
                        "get": function() {
                            return styles.background.position.x;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().trim();
                            if ( s == '' || /^(left|right|auto|inherit|((\-)?([\d]+\.)?[\d]+(px|pt|cm|mm|em|inch|\%)))$/i) {
                                styles.background.position.x = s;
                            } else throw "Invalid background position X value!";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "background-position-x",
                                "value": styles.background.position.x
                            } );

                            instance.onCustomEvent('attribute-changed', {
                                "which": "background",
                                "value": this.background
                            } );
                        }
                    } );

                    Object.defineProperty( this, "background-position-y", {
                        "get": function() {
                            return styles.background.position.y;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().trim();
                            if ( s == '' || /^(top|bottom|auto|inherit|((\-)?([\d]+\.)?[\d]+(px|pt|cm|mm|em|inch|\%)))$/i ) {
                                styles.background.position.y = s;
                            } else throw "Invalid background position Y value!";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "background-position-y",
                                "value": styles.background.position.y
                            } );

                            instance.onCustomEvent('attribute-changed', {
                                "which": "background",
                                "value": this.background
                            } );
                        }
                    } );
                    
                    Object.defineProperty( this, "padding-left", {
                        "get": function() {
                            return styles.padding.left;
                        },
                        "set": function( s ) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !isNaN( s ) || CSSDefs.isCSSDimension( s ) ) {
                                styles.padding.left = !isNaN( s ) && s != '' ? ( s + 'px' ) : s;
                            } else throw "Bad padding left value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "padding-left",
                                "value": styles.padding.left
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "padding",
                                "value": this.padding
                            });
                        }
                    } );

                    Object.defineProperty( this, "padding-right", {
                        "get": function() {
                            return styles.padding.right;
                        },
                        "set": function( s ) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !isNaN( s ) || CSSDefs.isCSSDimension( s ) ) {
                                styles.padding.right = !isNaN( s ) && s != '' ? ( s + 'px' ) : s;
                            } else throw "Bad padding right value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "padding-right",
                                "value": styles.padding.right
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "padding",
                                "value": this.padding
                            });
                        }
                    } );

                    Object.defineProperty( this, "padding-top", {
                        "get": function() {
                            return styles.padding.top;
                        },
                        "set": function( s ) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !isNaN( s ) || CSSDefs.isCSSDimension( s ) ) {
                                styles.padding.top = !isNaN( s ) && s != '' ? ( s + 'px' ) : s;
                            } else throw "Bad padding top value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "padding-top",
                                "value": styles.padding.top
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "padding",
                                "value": this.padding
                            });
                        }
                    } );

                    Object.defineProperty( this, "padding-bottom", {
                        "get": function() {
                            return styles.padding.bottom;
                        },
                        "set": function( s ) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !isNaN( s ) || CSSDefs.isCSSDimension( s ) ) {
                                styles.padding.bottom = !isNaN( s ) && s != '' ? ( s + 'px' ) : s;
                            } else throw "Bad padding bottom value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "padding-bottom",
                                "value": styles.padding.bottom
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "padding",
                                "value": this.padding
                            });
                        }
                    } );
                    
                    Object.defineProperty( this, "padding", {
                        
                        "get": function() {
                            switch ( true ) {
                                
                                case styles.padding.top == styles.padding.right &&
                                     styles.padding.right == styles.padding.bottom &&
                                     styles.padding.bottom == styles.padding.left:
                                     
                                     return styles.padding.left || '';
                                     break;
                                
                                case styles.padding.top == styles.padding.bottom &&
                                     styles.padding.left == styles.padding.right:

                                     return ( styles.padding.top + ' ' + styles.padding.right ).trim();
                                     break;
                                
                                default:
                                    return ( ( styles.padding.top == '' ? 'auto' : styles.padding.top ) + ' ' +
                                             ( styles.padding.right == '' ? 'auto' : styles.padding.right ) + ' ' +
                                             ( styles.padding.bottom == '' ? 'auto' : styles.padding.bottom ) + ' ' +
                                             ( styles.padding.left || ( styles.padding.right || 'auto' ) )
                                           ).trim();
                                    break;
                            }
                        },
                        "set": function( s ) {
                            s = ( s || '' ).toString().trim().toLowerCase();
                            
                            if ( s == '' ) {
                                this['padding-left'] = '';
                                this['padding-right'] = '';
                                this['padding-top'] = '';
                                this['padding-bottom'] = '';
                            } else {
                                
                                var args = s.split( /[\s]+/g );
                                
                                if ( args.length > 4 )
                                    throw "Bad padding value (more than 4 args specified)";
                                
                                for ( var i=0,len=args.length; i<len; i++ ) {
                                    if ( isNaN( args[i] ) && !CSSDefs.isCSSDimension( args[i] ) )
                                        throw "Bad padding value (argument #" + ( i+1 ) + " is not a css dimension)";
                                }
                                
                                switch ( args.length ) {
                                    
                                    case 1:
                                        this['padding-top'] =
                                        this['padding-right'] =
                                        this['padding-bottom'] =
                                        this['padding-left'] = args[0];
                                        break;
                                    case 2:
                                        this['padding-top'] = 
                                        this['padding-bottom'] = args[0];
                                        this['padding-left'] =
                                        this['padding-right'] = args[1];
                                        break;
                                    case 3:
                                        this['padding-top'] = args[0];
                                        this['padding-right'] = 
                                        this['padding-left'] = args[1];
                                        this['padding-bottom'] = args[2];
                                        break;
                                    case 4:
                                        this['padding-top'] = args[0];
                                        this['padding-right'] = args[1];
                                        this['padding-bottom'] = args[2];
                                        this['padding-left'] = args[3];
                                        break;
                                }
                            }
                            
                            instance.onCustomEvent( 'attribute-changed', {
                                "which": "padding",
                                "value": this.padding
                            } );
                        }
                        
                    } );

                    Object.defineProperty( this, "margin-left", {
                        "get": function() {
                            return styles.margin.left;
                        },
                        "set": function( s ) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !isNaN( s ) || CSSDefs.isCSSDimension( s ) ) {
                                styles.margin.left = !isNaN( s ) ? ( s + 'px' ) : s;
                            } else throw "Bad margin left value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "margin-left",
                                "value": styles.margin.left
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "margin",
                                "value": this.margin
                            });
                        }
                    } );

                    Object.defineProperty( this, "margin-right", {
                        "get": function() {
                            return styles.margin.right;
                        },
                        "set": function( s ) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !isNaN( s ) || CSSDefs.isCSSDimension( s ) ) {
                                styles.margin.right = !isNaN( s ) ? ( s + 'px' ) : s;
                            } else throw "Bad margin right value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "margin-right",
                                "value": styles.margin.right
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "margin",
                                "value": this.margin
                            });
                        }
                    } );

                    Object.defineProperty( this, "margin-top", {
                        "get": function() {
                            return styles.margin.top;
                        },
                        "set": function( s ) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !isNaN( s ) || CSSDefs.isCSSDimension( s ) ) {
                                styles.margin.top = ( !isNaN( s ) && s != '' ) ? ( s + 'px' ) : s;
                            } else throw "Bad margin top value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "margin-top",
                                "value": styles.margin.top
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "margin",
                                "value": this.margin
                            });
                        }
                    } );

                    Object.defineProperty( this, "margin-bottom", {
                        "get": function() {
                            return styles.margin.bottom;
                        },
                        "set": function( s ) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !isNaN( s ) || CSSDefs.isCSSDimension( s ) ) {
                                styles.margin.bottom = !isNaN( s ) ? ( s + 'px' ) : s;
                            } else throw "Bad margin bottom value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "margin-bottom",
                                "value": styles.margin.bottom
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "margin",
                                "value": this.margin
                            });
                        }
                    } );
                    
                    Object.defineProperty( this, "margin", {
                        
                        "get": function() {
                            switch ( true ) {
                                
                                case styles.margin.top +
                                     styles.margin.left +
                                     styles.margin.bottom +
                                     styles.margin.right == '':
                                        return '';
                                
                                case styles.margin.top == styles.margin.right &&
                                     styles.margin.right == styles.margin.bottom &&
                                     styles.margin.bottom == styles.margin.left:
                                     
                                     return styles.margin.left || 'auto';
                                     break;
                                
                                case styles.margin.top == styles.margin.bottom &&
                                     styles.margin.left == styles.margin.right:

                                     return ( styles.margin.top + ' ' + styles.margin.right ).trim();
                                     break;
                                
                                default:
                                    return ( ( styles.margin.top == '' ? 'auto' : styles.margin.top ) + ' ' +
                                             ( styles.margin.right == '' ? 'auto' : styles.margin.right ) + ' ' +
                                             ( styles.margin.bottom == '' ? 'auto' : styles.margin.bottom ) + ' ' +
                                             ( styles.margin.left || ( styles.margin.right || 'auto' ) )
                                           ).trim();
                                    break;
                            }
                        },
                        "set": function( s ) {
                            s = ( s || '' ).toString().trim().toLowerCase();
                            
                            if ( s == '' ) {
                                this['margin-left'] = '';
                                this['margin-right'] = '';
                                this['margin-top'] = '';
                                this['margin-bottom'] = '';
                            } else {
                                
                                var args = s.split( /[\s]+/g );
                                
                                if ( args.length > 4 )
                                    throw "Bad margin value (more than 4 args specified)";
                                
                                for ( var i=0,len=args.length; i<len; i++ ) {
                                    if ( isNaN( args[i] ) && !CSSDefs.isCSSDimension( args[i] ) )
                                        throw "Bad margin value (argument #" + ( i+1 ) + " is not a css dimension)";
                                }
                                
                                switch ( args.length ) {
                                    
                                    case 1:
                                        this['margin-top'] =
                                        this['margin-right'] =
                                        this['margin-bottom'] =
                                        this['margin-left'] = args[0];
                                        break;
                                    case 2:
                                        this['margin-top'] = 
                                        this['margin-bottom'] = args[0];
                                        this['margin-left'] =
                                        this['margin-right'] = args[1];
                                        break;
                                    case 3:
                                        this['margin-top'] = args[0];
                                        this['margin-right'] = 
                                        this['margin-left'] = args[1];
                                        this['margin-bottom'] = args[2];
                                        break;
                                    case 4:
                                        this['margin-top'] = args[0];
                                        this['margin-right'] = args[1];
                                        this['margin-bottom'] = args[2];
                                        this['margin-left'] = args[3];
                                        break;
                                }
                            }
                            
                            instance.onCustomEvent( 'attribute-changed', {
                                "which": "margin",
                                "value": this.margin
                            } );
                        }
                        
                    } );

                    Object.defineProperty( this, "border-radius", {
                        "get": function() {
                            // This is a shorthand property

                            switch ( true ) {
                                case styles.border.top.radius.left == styles.border.top.radius.right &&
                                     styles.border.top.radius.right == styles.border.bottom.radius.right &&
                                     styles.border.bottom.radius.right == styles.border.bottom.radius.left:
                                     
                                     return styles.border.bottom.radius.left;
                                     break;
                                
                                case styles.border.top.radius.left == styles.border.bottom.radius.right &&
                                     styles.border.top.radius.right == styles.border.bottom.radius.left:
                                     
                                     return (styles.border.top.radius.left || '0px') + ' ' +
                                            (styles.border.top.radius.right || '0px');
                                     break;
                                
                                default:
                                    
                                    return ( styles.border.top.radius.left || '0px' ) + ' ' +
                                           ( styles.border.top.radius.right || '0px' ) + ' ' +
                                           ( styles.border.bottom.radius.right || '0px' ) + ' ' +
                                           ( styles.border.bottom.radius.left || '0px' );
                                    break;
                            }
                        },
                        "set": function( s ) {
                            s = ( s || '' ).toString().toLowerCase().trim();

                            if ( s.indexOf( '/' ) >= 0 ) {
                                console.warn("Warning: Border radius format not implemented (ignored for now)!");
                                return;
                            }
                            
                            if ( s == '' ) {
                                
                                this['border-bottom-left-radius'] =
                                this['border-bottom-right-radius'] =
                                this['border-top-left-radius'] =
                                this['border-top-right-radius'] = '';
                                
                            } else {
                                
                                var args = s.split( /[\s]+/ );

                                if ( args.length > 4 )
                                    throw "Bad border radius format: detected " + args.length + " arguments, max 4 are allowed!";
                                
                                for ( var i=0,len=args.length; i<len; i++ ) {
                                    if ( !isNaN( args[i] ) || CSSDefs.isCSSDimension( args[i] ) ) {
                                        continue;
                                    } else
                                        throw "Bad border radius argument @pos:" + ( i+1) + " detected!";
                                }
                                
                                switch ( args.length ) {
                                    
                                    case 4:
                                        this['border-top-left-radius'] = args[0];
                                        this['border-top-right-radius'] = args[1];
                                        this['border-bottom-right-radius'] = args[2];
                                        this['border-bottom-left-radius'] = args[3];
                                        break;
                                    case 3:
                                        this['border-top-left-radius'] = args[0];
                                        this['border-top-right-radius'] = args[1];
                                        this['border-bottom-right-radius'] = args[2];
                                        this['border-bottom-left-radius'] = args[1];
                                        break;
                                    case 2:
                                        this['border-top-left-radius'] =
                                        this['border-bottom-right-radius'] = args[0];
                                        this['border-top-right-radius'] =
                                        this['border-bottom-left-radius'] = args[1];
                                        break;
                                    case 1:
                                        this['border-top-left-radius'] =
                                        this['border-top-right-radius'] =
                                        this['border-bottom-right-radius'] =
                                        this['border-bottom-left-radius'] = args[0];
                                        break;
                                }
                            }
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-radius",
                                "value": this['border-radius']
                            });
                        }
                    } );
                    
                    Object.defineProperty( this, "border-top-left-radius", {
                        "get": function() {
                            return styles.border.top.radius.left;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !isNaN( s ) || CSSDefs.isCSSDimension( s ) ) {
                                styles.border.top.radius.left = !isNaN( s ) ? ( s + 'px' ) : s;
                            } else throw "Bad border top left radius value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-top-left-radius",
                                "value": styles.border.top.radius.left
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-radius",
                                "value": this['border-radius']
                            });
                        }
                    } );
                    Object.defineProperty( this, "border-top-right-radius", {
                        "get": function() {
                            return styles.border.top.radius.right;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !isNaN( s ) || CSSDefs.isCSSDimension( s ) ) {
                                styles.border.top.radius.right = !isNaN( s ) ? ( s + 'px' ) : s;
                            } else throw "Bad border top right radius value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-top-right-radius",
                                "value": styles.border.top.radius.right
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-radius",
                                "value": this['border-radius']
                            });
                        }
                    } );
                    Object.defineProperty( this, "border-bottom-left-radius", {
                        "get": function() {
                            return styles.border.bottom.radius.left;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !isNaN( s ) || CSSDefs.isCSSDimension( s ) ) {
                                styles.border.bottom.radius.left = !isNaN( s ) ? ( s + 'px' ) : s;
                            } else throw "Bad border bottom left radius value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-bottom-left-radius",
                                "value": styles.border.bottom.radius.left
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-radius",
                                "value": this['border-radius']
                            });
                        }
                    } );
                    Object.defineProperty( this, "border-bottom-right-radius", {
                        "get": function() {
                            return styles.border.bottom.radius.right;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !isNaN( s ) || CSSDefs.isCSSDimension( s ) ) {
                                styles.border.bottom.radius.right = !isNaN( s ) ? ( s + 'px' ) : s;
                            } else throw "Bad border bottom right radius value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-bottom-right-radius",
                                "value": styles.border.bottom.radius.right
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-radius",
                                "value": this['border-radius']
                            });
                        }
                    } );
                    
                    Object.defineProperty( this, "border-width", {
                        "get": function() {
                            // note that this is a shorthand property
                            switch ( true ) {
                                case styles.border.top.width == styles.border.right.width &&
                                     styles.border.right.width == styles.border.bottom.width &&
                                     styles.border.bottom.width == styles.border.left.width:
                                     
                                     return styles.border.left.width;
                                     break;
                                     
                                case styles.border.top.width == styles.border.bottom.width &&
                                     styles.border.left.width == styles.border.right.width:
                                     
                                     return ( styles.border.top.width || '0px' ) + ' ' +
                                            ( styles.border.right.width || '0px' );
                                     break;
                                     
                                default:
                                     return ( styles.border.top.width || '0px ' ) + ' ' +
                                            ( styles.border.right.width || '0px' ) + ' ' +
                                            ( styles.border.bottom.width || '0px' ) + ' ' +
                                            ( styles.border.left.width || '0px' );
                                     break;
                            }
                        },
                        "set": function( s ) {
                            // note that this is a shorthand property
                            s = ( s || '' ).toString().toLowerCase().trim();
                            
                            if ( s == '' ) {
                                this['border-top-width'] =
                                this['border-right-width'] =
                                this['border-bottom-width'] =
                                this['border-left-width'] = '';
                            } else {
                                
                                var args = s.split( /[\s]+/ );
                                
                                if ( args.length > 4 )
                                    throw "Bad border-width value (detected more than 4 arguments)";
                                
                                for ( var i=0,len=args.length; i<len; i++ ) {
                                    if ( !isNaN( args[i] ) || CSSDefs.isCSSBorderWidth( args[i] ) )
                                        continue;
                                    else
                                        throw "Bad border-width property detected @argument " + ( i+1 );
                                }
                                
                                switch ( args.length ) {
                                    
                                    case 4:
                                        this['border-top-width'] = args[0];
                                        this['border-right-width'] = args[1];
                                        this['border-bottom-width'] = args[2];
                                        this['border-left-width'] = args[3];
                                        break;
                                    case 3:
                                        this['border-top-width'] = args[0];
                                        this['border-right-width'] = args[1];
                                        this['border-bottom-width'] = args[2];
                                        this['border-left-width'] = args[1];
                                        break;
                                    case 2:
                                        this['border-top-width'] =
                                        this['border-bottom-width'] = args[0];
                                        this['border-right-width'] =
                                        this['border-left-width'] = args[1];
                                        break;
                                    case 1:
                                        this['border-top-width'] =
                                        this['border-bottom-width'] =
                                        this['border-right-width'] =
                                        this['border-left-width'] = args[0];
                                        break;
                                }
                            }
                        }
                    } );
                    
                    Object.defineProperty( this, "border-left-width", {
                        "get": function() {
                            return styles.border.left.width;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !isNaN( s ) || CSSDefs.isCSSBorderWidth( s ) ) {
                                styles.border.left.width = !isNaN( s ) ? ( s + 'px' ) : s;
                            } else throw "Bad border left width value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-left-width",
                                "value": styles.border.left.width
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-left",
                                "value": this['border-left']
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-width",
                                "value": this['border-width']
                            });
                        }
                    } );
                    Object.defineProperty( this, "border-right-width", {
                        "get": function() {
                            return styles.border.right.width;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !isNaN( s ) || CSSDefs.isCSSBorderWidth( s ) ) {
                                styles.border.right.width = !isNaN( s ) ? ( s + 'px' ) : s;
                            } else throw "Bad border right width value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-right-width",
                                "value": styles.border.right.width
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-right",
                                "value": this['border-right']
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-width",
                                "value": this['border-width']
                            });
                        }
                    } );
                    Object.defineProperty( this, "border-top-width", {
                        "get": function() {
                            return styles.border.top.width;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !isNaN( s ) || CSSDefs.isCSSBorderWidth( s ) ) {
                                styles.border.top.width = !isNaN( s ) ? ( s + 'px' ) : s;
                            } else throw "Bad border top width value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-top-width",
                                "value": styles.border.top.width
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-top",
                                "value": this['border-top']
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-width",
                                "value": this['border-width']
                            });
                        }
                    } );
                    Object.defineProperty( this, "border-bottom-width", {
                        "get": function() {
                            return styles.border.bottom.width;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !isNaN( s ) || CSSDefs.isCSSBorderWidth( s ) ) {
                                styles.border.bottom.width = !isNaN( s ) ? ( s + 'px' ) : s;
                            } else throw "Bad border bottom width value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-bottom-width",
                                "value": styles.border.bottom.width
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-bottom",
                                "value": this['border-bottom']
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-width",
                                "value": this['border-width']
                            });
                        }
                    } );
                    
                    Object.defineProperty( this, "border-color", {
                        
                        "get": function() {
                            // note that this is a short-hand property
                            
                            switch ( true ) {
                                case styles.border.top.color == styles.border.right.color &&
                                     styles.border.right.color == styles.border.bottom.color &&
                                     styles.border.bottom.color == styles.border.left.color:
                                     
                                     return styles.border.left.color;
                                     
                                     break;
                                case styles.border.top.color == styles.border.bottom.color &&
                                     styles.border.left.color == styles.border.right.color:
                                     
                                     return ( styles.border.top.color || 'transparent' ) + ' ' +
                                            ( styles.border.left.color || 'transparent' );
                                     
                                     break;
                                
                                default:
                                     return ( styles.border.top.color || 'transparent' ) + ' ' +
                                            ( styles.border.right.color || 'transparent' ) + ' ' +
                                            ( styles.border.bottom.color || 'transparent' ) + ' ' +
                                            ( styles.border.left.color || 'transparent' );
                                    break;
                            }
                        },
                        "set": function( s ) {
                            // note that this is a short-hand property
                            s = ( s || '' ).toString().toLowerCase().trim();
                            
                            if ( s == '' ) {
                                this['border-top-color'] =
                                this['border-right-color'] =
                                this['border-bottom-color'] =
                                this['border-left-color'] = '';
                            } else {
                                
                                var args = s.split( /[\s]+/ );
                                
                                if ( args.length > 4 )
                                    throw "Bad border-color value (detected more than 4 arguments)";
                                
                                for ( var i=0,len=args.length; i<len; i++ ) {
                                    if ( !!CSSDefs.isCSSColor( args[i] ) )
                                        continue;
                                    else
                                        throw "Bad border-color property detected @argument " + ( i+1 ) + ": " + args[i];
                                }
                                
                                switch ( args.length ) {
                                    case 4: this['border-top-color'] = args[0];
                                            this['border-right-color'] = args[1];
                                            this['border-bottom-color'] = args[2];
                                            this['border-left-color'] = args[3];
                                            break;
                                    case 3: this['border-top-color'] = args[0];
                                            this['border-right-color'] = args[1];
                                            this['border-bottom-color'] = args[2];
                                            this['border-left-color'] = args[1];
                                            break;
                                    case 2: this['border-top-color'] =
                                            this['border-bottom-color'] = args[0];
                                            this['border-right-color'] =
                                            this['border-left-color'] = args[1];
                                            break;
                                    case 1: this['border-top-color'] =
                                            this['border-right-color'] =
                                            this['border-bottom-color'] =
                                            this['border-left-color'] = args[0];
                                            break;
                                }
                            }
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-color",
                                "value": this['border-color']
                            });
                        }
                        
                    } );

                    Object.defineProperty( this, "border-left-color", {
                        "get": function() {
                            return styles.border.left.color;
                        },
                        "set": function( s ) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !!CSSDefs.isCSSColor( s ) ) {
                                styles.border.left.color = s;
                            } else throw "Bad border left color value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-left-color",
                                "value": styles.border.left.color
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-left",
                                "value": this['border-left']
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-color",
                                "value": this['border-color']
                            });
                        }
                    } );
                    Object.defineProperty( this, "border-right-color", {
                        "get": function() {
                            return styles.border.right.color;
                        },
                        "set": function( s ) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !!CSSDefs.isCSSColor( s ) ) {
                                styles.border.right.color = s;
                            } else throw "Bad border right color value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-right-color",
                                "value": styles.border.right.color
                            });

                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-right",
                                "value": this['border-right']
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-color",
                                "value": this['border-color']
                            });
                        }
                    } );
                    Object.defineProperty( this, "border-top-color", {
                        "get": function() {
                            return styles.border.top.color;
                        },
                        "set": function( s ) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !!CSSDefs.isCSSColor( s ) ) {
                                styles.border.top.color = s;
                            } else throw "Bad border top color value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-top-color",
                                "value": styles.border.top.color
                            });

                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-top",
                                "value": this['border-top']
                            });
                            
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-color",
                                "value": this['border-color']
                            });
                        }
                    } );
                    Object.defineProperty( this, "border-bottom-color", {
                        "get": function() {
                            return styles.border.bottom.color;
                        },
                        "set": function( s ) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !!CSSDefs.isCSSColor( s ) ) {
                                styles.border.bottom.color = s;
                            } else throw "Bad border bottom color value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-bottom-color",
                                "value": styles.border.bottom.color
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-bottom",
                                "value": this['border-bottom']
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-color",
                                "value": this['border-color']
                            });
                        }
                    } );
                    
                    Object.defineProperty( this, "border-style", {
                        "get": function() {
                            // note that this is a shorthand property
                            switch ( true ) {
                                
                                case styles.border.top.style == styles.border.right.style &&
                                     styles.border.right.style == styles.border.bottom.style &&
                                     styles.border.bottom.style == styles.border.left.style:
                                     
                                     return styles.border.left.style;
                                     
                                     break;
                                
                                case styles.border.top.style == styles.border.bottom.style &&
                                     styles.border.left.style == styles.border.right.style:
                                     
                                     return ( styles.border.top.style || 'none' ) + ' ' +
                                            ( styles.border.left.style || 'none' );
                                
                                default:
                                     return ( styles.border.top.style || 'none' ) + ' ' +
                                            ( styles.border.right.style || 'none' ) + ' ' +
                                            ( styles.border.bottom.style || 'none' ) + ' ' +
                                            ( styles.border.left.style || 'none' );
                                     break;
                                
                            }
                        },
                        "set": function( s ) {
                            // this is a short-hand property
                            s = ( s || '' ).toString().toLowerCase().trim();
                            
                            if ( s == '' ) {
                                this['border-top-style'] =
                                this['border-right-style'] =
                                this['border-bottom-style'] =
                                this['border-left-style'] = '';
                            } else {
                                
                                var args = s.split( /[\s]+/ );
                                
                                if ( args.length > 4 )
                                    throw "Bad border-style value (detected more than 4 arguments)";
                                
                                for ( var i=0,len=args.length; i<len; i++ ) {
                                    if ( !!CSSDefs.isCSSBorderStyle( args[i] ) )
                                        continue;
                                    else
                                        throw "Bad border-style property detected @argument " + ( i+1 );
                                }
                                
                                switch ( args.length ) {
                                    case 4: this['border-top-style'] = args[0];
                                            this['border-right-style'] = args[1];
                                            this['border-bottom-style'] = args[2];
                                            this['border-left-style'] = args[3];
                                            break;
                                    case 3: this['border-top-style'] = args[0];
                                            this['border-right-style'] = args[1];
                                            this['border-bottom-style'] = args[2];
                                            this['border-left-style'] = args[1];
                                            break;
                                    case 2: this['border-top-style'] =
                                            this['border-bottom-style'] = args[0];
                                            this['border-right-style'] =
                                            this['border-left-style'] = args[1];
                                            break;
                                    case 1: this['border-top-style'] =
                                            this['border-right-style'] =
                                            this['border-bottom-style'] =
                                            this['border-left-style'] = args[0];
                                            break;
                                }
                            }
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-style",
                                "value": this['border-style']
                            });
                            
                        }
                    } );
                    
                    Object.defineProperty( this, "border-left-style", {
                        "get": function() {
                            return styles.border.left.style;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !!CSSDefs.isCSSBorderStyle( s ) ) {
                                styles.border.left.style = s;
                            } else throw "Bad border left style value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-left-style",
                                "value": styles.border.left.style
                            });

                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-left",
                                "value": this['border-left']
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-style",
                                "value": this['border-style']
                            });
                            
                        }
                    } );
                    Object.defineProperty( this, "border-right-style", {
                        "get": function() {
                            return styles.border.right.style;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !!CSSDefs.isCSSBorderStyle( s ) ) {
                                styles.border.right.style = s;
                            } else throw "Bad border right style value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-right-style",
                                "value": styles.border.right.style
                            });

                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-right",
                                "value": this['border-right']
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-style",
                                "value": this['border-style']
                            });
                            
                        }
                    } );
                    Object.defineProperty( this, "border-top-style", {
                        "get": function() {
                            return styles.border.top.style;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !!CSSDefs.isCSSBorderStyle( s ) ) {
                                styles.border.top.style = s;
                            } else throw "Bad border top style value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-top-style",
                                "value": styles.border.top.style
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-top",
                                "value": this['border-top']
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-style",
                                "value": this['border-style']
                            });
                            
                        }
                    } );
                    Object.defineProperty( this, "border-bottom-style", {
                        "get": function() {
                            return styles.border.bottom.style;
                        },
                        "set": function(s) {
                            s = ( s || '' ).toString().toLowerCase().trim();
                            if ( s == '' || !!CSSDefs.isCSSBorderStyle( s ) ) {
                                styles.border.bottom.style = s;
                            } else throw "Bad border bottom style value";
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-bottom-style",
                                "value": styles.border.bottom.style
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-bottom",
                                "value": this['border-bottom']
                            });
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-style",
                                "value": this['border-style']
                            });
                            
                        }
                    } );


                    Object.defineProperty( this, "border-bottom", {
                        "get": function() {
                            
                            var temp, out = [];
                            
                            temp = this['border-bottom-width'];
                            
                            if ( temp != '' && temp.indexOf(' ') == -1 ) {
                                out.push( temp );
                            }
                            
                            temp = this['border-bottom-style'];
                            
                            if ( temp != '' && temp.indexOf( ' ' ) == -1 ) {
                                out.push( temp );
                            }
                            
                            temp = this['border-bottom-color'];
                            
                            if ( temp != '' && temp.indexOf( ' ' ) == -1 ) {
                                out.push( temp );
                            }
                            
                            return out.join(' ');
                        },
                        "set": function( s ) {
                            
                            s = ( s || '' ).toString().toLowerCase().trim();
                            
                            if ( s == '' || s == 'inherit' ) {
                                this['border-bottom-width'] = s;
                                this['border-bottom-style'] = s;
                                this['border-bottom-color'] = s;
                            } else {
                                
                                var args = s.split(/[\s]+/),
                                    _width = '',
                                    _style = '',
                                    _color = '';
                                
                                if ( args.length && CSSDefs.isCSSBorderWidth( args[0] ) ) {
                                    _width = args[0];
                                    args.shift();
                                }
                                
                                if ( args.length && CSSDefs.isCSSBorderStyle( args[0] ) ) {
                                    _style = args[0];
                                    args.shift();
                                }
                                
                                if ( args.length && !!CSSDefs.isCSSColor( args[0] ) ) {
                                    _color = args[0];
                                    args.shift();
                                }
                                
                                if ( args.length )
                                    throw "Failed to parse the border property: (@string: " + args[0] + ")";
                                
                                this['border-bottom-width'] = _width;
                                this['border-bottom-style'] = _style;
                                this['border-bottom-color'] = _color;
                                
                            }
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-bottom",
                                "value": this['border-bottom']
                            });

                            instance.onCustomEvent('attribute-changed', {
                                "which": "border",
                                "value": this['border']
                            });
                            
                        }
                    } );


                    Object.defineProperty( this, "border-top", {
                        "get": function() {
                            
                            var temp, out = [];
                            
                            temp = this['border-top-width'];
                            
                            if ( temp != '' && temp.indexOf(' ') == -1 ) {
                                out.push( temp );
                            }
                            
                            temp = this['border-top-style'];
                            
                            if ( temp != '' && temp.indexOf( ' ' ) == -1 ) {
                                out.push( temp );
                            }
                            
                            temp = this['border-top-color'];
                            
                            if ( temp != '' && temp.indexOf( ' ' ) == -1 ) {
                                out.push( temp );
                            }
                            
                            return out.join(' ');
                        },
                        "set": function( s ) {
                            
                            s = ( s || '' ).toString().toLowerCase().trim();
                            
                            if ( s == '' || s == 'inherit' ) {
                                this['border-top-width'] = s;
                                this['border-top-style'] = s;
                                this['border-top-color'] = s;
                            } else {
                                
                                var args = s.split(/[\s]+/),
                                    _width = '',
                                    _style = '',
                                    _color = '';
                                
                                if ( args.length && CSSDefs.isCSSBorderWidth( args[0] ) ) {
                                    _width = args[0];
                                    args.shift();
                                }
                                
                                if ( args.length && CSSDefs.isCSSBorderStyle( args[0] ) ) {
                                    _style = args[0];
                                    args.shift();
                                }
                                
                                if ( args.length && !!CSSDefs.isCSSColor( args[0] ) ) {
                                    _color = args[0];
                                    args.shift();
                                }
                                
                                if ( args.length )
                                    throw "Failed to parse the border property: (@string: " + args[0] + ")";
                                
                                this['border-top-width'] = _width;
                                this['border-top-style'] = _style;
                                this['border-top-color'] = _color;
                                
                            }
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-top",
                                "value": this['border-top']
                            });

                            instance.onCustomEvent('attribute-changed', {
                                "which": "border",
                                "value": this['border']
                            });
                            
                        }
                    } );


                    Object.defineProperty( this, "border-right", {
                        "get": function() {
                            
                            var temp, out = [];
                            
                            temp = this['border-right-width'];
                            
                            if ( temp != '' && temp.indexOf(' ') == -1 ) {
                                out.push( temp );
                            }
                            
                            temp = this['border-right-style'];
                            
                            if ( temp != '' && temp.indexOf( ' ' ) == -1 ) {
                                out.push( temp );
                            }
                            
                            temp = this['border-right-color'];
                            
                            if ( temp != '' && temp.indexOf( ' ' ) == -1 ) {
                                out.push( temp );
                            }
                            
                            return out.join(' ');
                        },
                        "set": function( s ) {
                            
                            s = ( s || '' ).toString().toLowerCase().trim();
                            
                            if ( s == '' || s == 'inherit' ) {
                                this['border-right-width'] = s;
                                this['border-right-style'] = s;
                                this['border-right-color'] = s;
                            } else {
                                
                                var args = s.split(/[\s]+/),
                                    _width = '',
                                    _style = '',
                                    _color = '';
                                
                                if ( args.length && CSSDefs.isCSSBorderWidth( args[0] ) ) {
                                    _width = args[0];
                                    args.shift();
                                }
                                
                                if ( args.length && CSSDefs.isCSSBorderStyle( args[0] ) ) {
                                    _style = args[0];
                                    args.shift();
                                }
                                
                                if ( args.length && !!CSSDefs.isCSSColor( args[0] ) ) {
                                    _color = args[0];
                                    args.shift();
                                }
                                
                                if ( args.length )
                                    throw "Failed to parse the border property: (@string: " + args[0] + ")";
                                
                                this['border-right-width'] = _width;
                                this['border-right-style'] = _style;
                                this['border-right-color'] = _color;
                                
                            }
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-right",
                                "value": this['border-right']
                            });

                            instance.onCustomEvent('attribute-changed', {
                                "which": "border",
                                "value": this['border']
                            });
                            
                        }
                    } );


                    Object.defineProperty( this, "border-left", {
                        "get": function() {
                            
                            var temp, out = [];
                            
                            temp = this['border-left-width'];
                            
                            if ( temp != '' && temp.indexOf(' ') == -1 ) {
                                out.push( temp );
                            }
                            
                            temp = this['border-left-style'];
                            
                            if ( temp != '' && temp.indexOf( ' ' ) == -1 ) {
                                out.push( temp );
                            }
                            
                            temp = this['border-left-color'];
                            
                            if ( temp != '' && temp.indexOf( ' ' ) == -1 ) {
                                out.push( temp );
                            }
                            
                            return out.join(' ');
                        },
                        "set": function( s ) {
                            
                            s = ( s || '' ).toString().toLowerCase().trim();
                            
                            if ( s == '' || s == 'inherit' ) {
                                this['border-left-width'] = s;
                                this['border-left-style'] = s;
                                this['border-left-color'] = s;
                            } else {
                                
                                var args = s.split(/[\s]+/),
                                    _width = '',
                                    _style = '',
                                    _color = '';
                                
                                if ( args.length && CSSDefs.isCSSBorderWidth( args[0] ) ) {
                                    _width = args[0];
                                    args.shift();
                                }
                                
                                if ( args.length && CSSDefs.isCSSBorderStyle( args[0] ) ) {
                                    _style = args[0];
                                    args.shift();
                                }
                                
                                if ( args.length && !!CSSDefs.isCSSColor( args[0] ) ) {
                                    _color = args[0];
                                    args.shift();
                                }
                                
                                if ( args.length )
                                    throw "Failed to parse the border property: (@string: " + args[0] + ")";
                                
                                this['border-left-width'] = _width;
                                this['border-left-style'] = _style;
                                this['border-left-color'] = _color;
                                
                            }
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border-left",
                                "value": this['border-left']
                            });

                            instance.onCustomEvent('attribute-changed', {
                                "which": "border",
                                "value": this['border']
                            });
                            
                        }
                    } );
                    
                    Object.defineProperty( this, "border", {
                        "get": function() {
                            
                            var temp, out = [];
                            
                            temp = this['border-width'];
                            
                            if ( temp != '' && temp.indexOf(' ') == -1 ) {
                                out.push( temp );
                            }
                            
                            temp = this['border-style'];
                            
                            if ( temp != '' && temp.indexOf( ' ' ) == -1 ) {
                                out.push( temp );
                            }
                            
                            temp = this['border-color'];
                            
                            if ( temp != '' && temp.indexOf( ' ' ) == -1 ) {
                                out.push( temp );
                            }
                            
                            return out.join(' ');
                        },
                        "set": function( s ) {
                            
                            s = ( s || '' ).toString().toLowerCase().trim();
                            
                            if ( s == '' || s == 'inherit' ) {
                                this['border-width'] = s;
                                this['border-style'] = s;
                                this['border-color'] = s;
                            } else {
                                
                                var args = s.split(/[\s]+/),
                                    _width = '',
                                    _style = '',
                                    _color = '';
                                
                                if ( args.length && CSSDefs.isCSSBorderWidth( args[0] ) ) {
                                    _width = args[0];
                                    args.shift();
                                }
                                
                                if ( args.length && CSSDefs.isCSSBorderStyle( args[0] ) ) {
                                    _style = args[0];
                                    args.shift();
                                }
                                
                                if ( args.length && !!CSSDefs.isCSSColor( args[0] ) ) {
                                    _color = args[0];
                                    args.shift();
                                }
                                
                                if ( args.length )
                                    throw "Failed to parse the border property: (@string: " + args[0] + ")";
                                
                                this['border-width'] = _width;
                                this['border-style'] = _style;
                                this['border-color'] = _color;
                                
                            }
                            
                            instance.onCustomEvent('attribute-changed', {
                                "which": "border",
                                "value": this['border']
                            });
                            
                        }
                    } );
                    
                    Object.defineProperty( this, "alteredAttributes", {
                        "get": function() {
                            return modifiedAttributes;
                        }
                    } );

                } );
                
            }
            
        } );
        
        this.addCustomEventListener('attribute-changed', function(data) {
            console.log(data.which, " => ", data.value );
            modifiedAttributes[ data.which ] = data.value;
            return true;
        } );
        
        var tabs = this.insert( new TabPanel( { "initTabs": (function() {
            // Depending on the options.style object, we dynamically
            // generate the tabs of the dialog
            
            var out = [];
            
            if ( !!( options.styles.border || options.styles.padding || 
                     options.styles.margin || options.styles.color   || 
                     options.styles.background || options.styles.width ||
                     options.styles.height )
            ) {
                out.push({
                    "id"       : "styles",
                    "caption"  : "Box Model",
                    "closeable": false
                });
            }

            if ( !!( options.styles.title || options.styles['class'] || options.styles.id )
            ) {
                out.push({
                    "id": "web",
                    "caption": "Web",
                    "closeable": false
                });
            }

            if ( !!( options.styles.href || options.styles.target )
            ) {
                out.push({
                    "id": "link",
                    "caption": "Link",
                    "closeable": false
                });
            }
            
            if ( !!( options.styles['float'] || options.styles.align || options.styles.clear ) 
            ) {
                out.push({
                    "id": "position",
                    "caption": "Position",
                    "closeable": false
                });
            }
            
            if ( !!( options.styles.image ) ) {
                out.push({
                    "id": "image",
                    "caption": "Picture",
                    "closeable": false
                });
            }
            
            if ( !!( options.styles.audio ) ) {
                out.push({
                    "id": "audio",
                    "caption": "Audio",
                    "closeable": false
                });
            }
            
            if ( !!( options.styles.video ) ) {
                out.push({
                    "id": "video",
                    "caption": "Video",
                    "closeable": false
                });
            }
            
            return out;
            
        } )() } ).setAnchors({
            "width": function(w,h) {
                return w - 10 + "px";
            },
            "height": function(w,h) {
                return h - 50 + "px";
            }
        }).setAttr(
            "style", "margin: 10px 5px"
        ) );
        
        ( function( dlg ) {

            dlg.insert( new Button("Ok", function() {
                dlg.appHandler("cmd_ok");
            } ) ).setAttr(
                "style", "position: absolute; bottom: 10px; right: 70px"
            );
        
            dlg.insert( new Button("Cancel", function() {
                dlg.appHandler("cmd_cancel");
            } ) ).setAttr(
                "style", "position: absolute; bottom: 10px; right: 10px"
            );
        
        })( this );
        
        
        // Render window contents
        if ( !!( options.styles.border || options.styles.padding || 
                 options.styles.margin || options.styles.color   || 
                 options.styles.background || options.styles.width ||
                 options.styles.height )
            ) {
            
            CSSNodeEditor_init_style_tab( this, tabs, {
                
                "border":     !!options.styles.border /* || true */,
                "margin":     !!options.styles.margin /* || true */,
                "padding":    !!options.styles.padding /* || true */,
                "color":      !!options.styles.color /* || true */,
                "background": !!options.styles.background /* || true */,
                "width":      !!options.styles.width /* || true */,
                "height":     !!options.styles.height /* || true */,
                
                "integration": options.integration
                
            } );
        }
        
        // Render Web contents
        
        if ( !! ( options.styles.id || options.styles['class'] || options.styles.title ) ) {
            
            CSSNodeEditor_init_web_tab( this, tabs, {
                
                "id"    : !!options.styles.id,
                "class" : !!options.styles['class'],
                "title" : !!options.styles.title
                
            } );
            
        }
        
        // Render Link contents
        if ( !! ( options.styles.href || options.styles.target ) ) {
            
            CSSNodeEditor_init_link_tab( this, tabs, {
                
                "href"   : !!options.styles.href,
                "target" : !!options.styles.target,
                "anchor" : !!options.styles.anchor,
                
                "integration": options.integration
                
            } );
            
        }

        // Render Position contents
        if ( !! ( options.styles['float'] || options.styles.align || options.styles.clear ) ) {
            
            CSSNodeEditor_init_position_tab( this, tabs, {
                
                "float"   : !!options.styles['float'],
                "align"   : !!options.styles.align,
                "clear"   : !!options.styles.clear
                
            } );
            
        }
        
        if ( !! ( options.styles.image ) ) {
            
            CSSNodeEditor_init_image_tab( this, tabs, {
                
                "integration": options.integration
                
            } );
            
        }

        if ( !! ( options.styles.video ) ) {
            
            CSSNodeEditor_init_video_tab( this, tabs, {
                "integration": options.integration
            } );
            
        }
        
        CSSEditor_cmd_edit_margins( this );
        CSSEditor_cmd_edit_padding( this );
        CSSEditor_cmd_edit_size   ( this );
        CSSEditor_cmd_edit_colors ( this );
        CSSEditor_cmd_edit_borders( this );
        
        ( function( dlg ) {

            setTimeout( function() {
                dlg.paint();
            }, 10 );
        
            dlg.handlers.cmd_ok = function() {
                if ( typeof options.done == 'function' ) {
                    options.done( inputNode, dlg.nodeAttributes );
                }
                dlg.close();
            }
            
            dlg.closeCallback = function() {
            
                if ( restoreElementOnClose ) {
                    restoreElementOnClose.focus();
                    if ( restoreCaretPosition >= 0 )
                        restoreElementOnClose.setCaretPosition( restoreCaretPosition );
                }
            
                setTimeout( function() {
                    dlg.purge();
                }, 30 );
                
                return true;
            }
            
            dlg.handlers.cmd_cancel = function() {
                dlg.close();
            }
            
            Keyboard.bindKeyboardHandler( dlg, 'esc', function() {
                dlg.appHandler('cmd_cancel');
            });
            
        } )( this );
        
        if ( typeof options.init == 'function' ) {
            options.init(inputNode , this.nodeAttributes );
        }
        
        
    } );
    
    
}