window.CSSDefs = window.CSSDefs || {};

/** @param value: initial value.
    @param options: Object {
   
        // default: FALSE
        "allowUpload" : boolean,
        "uploadCallback": boolean   // *) mandatory if allowUpload is set to true
        "maxUploadSize": int        // optional, default : 8 x 1024 x 1024 ( ~ 8mb )
         
        // default: FALSE
        "allowBrowse" : boolean,
        "browseCallback": boolean,  // *) mandatory if allowBrowse is set to true

        // default: FALSE
        "allowEmbed"  : boolean,
        "maxEmbedSize": 32768,      // Maximum embeddable file size
        
        // default: FALSE
        "urlFormat"   : boolean,    // if TRUE: returns url("link") otherwise returns just the link
        
        // default: UNDEFINED
        "contentType" : RegExp      // e.g.: /^image\// // regular expression content type

   }
*/

function CSSSourceInput( value, options ) {
    return $('div', 'CSSSourceInput').chain( function() {

        ( function( holder ) {
            return holder.appendChild( $('div', 'inner') ).chain( function() {
                
                options = options || {};
                
                options.urlFormat   = typeof options.urlFormat == 'undefined' ? false : !!options.urlFormat;
                options.allowInput  = typeof options.allowInput== 'undefined' ? true  : !!options.allowInput;
                
                options.allowUpload = typeof options.allowUpload== 'undefined' ? false: !!options.allowUpload;
                options.allowEmbed  = typeof options.allowEmbed == 'undefined' ? false: !!options.allowEmbed;
                
                if ( options.allowUpload ) {
                    if ( typeof options.uploadCallback != 'function' )
                        throw "CSSSourceInput initialization failure: No uploadCallback was specified, or the callback is not a closure!";
                }
                
                if ( options.allowBrowse ) {
                    if ( typeof options.browseCallback != 'function' )
                        throw "CSSSourceInput initialization failure: No browseCallback was specified, or the callback is not a closure!";
                }
                
                options.allowEmbed = typeof options.allowEmbed == 'undefined' ? false : !!options.allowEmbed;
                options.maxEmbedSize = typeof options.maxEmbedSize == 'undefined' ? 32768 : (
                    !isNaN( options.maxEmbedSize )
                        ? ( options.maxEmbedSize <= 0 
                            ? ( function() { throw "Bad value for maxEmbedSize ( not allowing negative or zero values )!"; } )()
                            : parseInt( options.maxEmbedSize )
                          )
                        : ( function() {
                            throw "Bad maxEmbedSize value: Allowing only numbers";
                        } )()
                );

                options.maxUploadSize = typeof options.maxUploadSize == 'undefined' ? ( 8 * 1024 * 1024 ) : (
                    !isNaN( options.maxUploadSize )
                        ? ( options.maxUploadSize <= 0 
                            ? ( function() { throw "Bad value for maxUploadSize ( not allowing negative or zero values )!"; } )()
                            : parseInt( options.maxUploadSize )
                          )
                        : ( function() {
                            throw "Bad maxUploadSize value: Allowing only numbers";
                        } )()
                );
                
                options.contentType = typeof options.contentType == 'undefined' 
                    ? undefined
                    : ( options.contentType instanceof RegExp 
                        ? options.contentType
                        : ( function() { throw "Bad content type option: Expected undefined or regular expression"; } )()
                      );
                
                this.tabIndex = 0;
                
                var method = this.appendChild( ( new DropDown( ( function() {
                
                    var out = [];
                    
                    out.push({
                        "id": "",
                        "name": "Specify"
                    });
                    
                    if ( options.allowUpload )
                        out.push({
                            "id": "upload",
                            "name": "Upload"
                        });
                    
                    if ( options.allowBrowse )
                        out.push({
                            "id": "browse",
                            "name": "Browse"
                        });
                    
                    if ( options.allowEmbed )
                        out.push({
                            "id": "embed",
                            "name": "Embed"
                        });
                    
                    return out;
                    
                } )() ).addClass("method") ) );
                
                var alternateInput = null;
                
                var inner = this;
                
                var methodChange = function() {
                    holder.removeClass('method-upload').removeClass('method-browse').removeClass('method-embed');

                    if ( method.value )
                        holder.addClass('method-' + method.value );
                    
                    switch ( method.value ) {
                    
                        case 'browse':
                            if ( alternateInput ) {
                                alternateInput.chain( function() {
                                    this.removeFromParent();
                                    this.purge();
                                } );
                                alternateInput = null;
                            }
                            
                            options.browseCallback( holder, options.contentType );
                            
                            break;
                        
                        case 'upload':
                            if ( alternateInput ) {
                                alternateInput.chain( function() {
                                    this.removeFromParent();
                                    this.purge();
                                } );
                                alternateInput = null;
                            }
                            
                            alternateInput = inner.appendChild( new DOMFile({
                                "destination": "server",
                                "dataType"   : "binary",
                                "mime"       : options.contentType,
                                "maxSize"    : options.maxUploadSize || ( 8 * 1024 * 1024 )
                            }) ).chain( function() {
                                
                                this.addCustomEventListener('change', function() {
                                    options.uploadCallback( holder, this.serverPath );
                                    return true;
                                } );
                                
                            } ).addClass( "file" );
                            
                            break;
                        
                        case 'embed':
                            if ( alternateInput ) {
                                alternateInput.chain( function() {
                                    this.removeFromParent();
                                    this.purge();
                                } );
                                alternateInput = null;
                            }
                            
                            alternateInput = inner.appendChild( new DOMFile({
                                "destination": "memory",
                                "dataType"   : "base64",
                                "maxSize"    : options.maxEmbedSize,
                                "mime"       : options.contentType
                            }) ).chain( function() {
                                
                                this.addCustomEventListener('change', function() {
                                    
                                    holder.value = this.value;
                                    holder.onCustomEvent('change');
                                    return true;
                                    
                                } );
                                
                            } ).addClass( "file" );
                            
                            break;
                    }
                };
                
                method.addEventListener('change', methodChange );
                
                var specify = this.appendChild( ( new TextBox('') ) ).addClass('specify');
                
                specify.addCustomEventListener('change', function() {
                    holder.onCustomEvent('change', specify.value );
                });
                
                var src = '';
                
                Object.defineProperty( holder, "value", {
                    "get": function() {
                        return options.urlFormat ? ( ( src = specify.value ) != '' ? 'url("' + src + '")' : "" ) : ( src = specify.value);
                    },
                    "set": function( s ) {
                        s = ( s || '' ).toString().trim().replace(/^url\((["'])?([\s\S]+?)(["'])?\)$/g, "$2"); /* "' #mc bug */
                        
                        if ( options.urlFormat )
                            s = s.replace( /^none$/i, "" );
                        
                        src = specify.value = s;

                        method.value = '';
                        methodChange();
                    }
                } );
                
            } );
        } )( this );
        
    } ).chain( function(){
        this.value = ( value || '' );
    } );
}