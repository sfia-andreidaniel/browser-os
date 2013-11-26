function JSIde_CodeBuilder( app ) {

    var code = app.tabs.getSheets(1).insert(
        (new AceEditor()).setAnchors({
            "width": function(w,h) {
                return w + "px";
            },
            "height": function(w,h) {
                return h + "px";
            }
        })
    );

    code.syntax = 'javascript';
    
    var codeVal = '';
    
    var updater = throttle( function() {
        code.value = js_beautify( codeVal, {
            "indent_size": 4,
            "indent_char": ' ',
            "preserve_newlines": true,
            "max_preserve_newlines": 1,
            "brace_style": "end-expand"
        } );
        
    }, 1000 );
    
    Object.defineProperty( app, 'code', {
        "get": function() {
            
            return code.value;
            
        },
        "set": function( str ) {
            codeVal = str + '';
            updater.run();
        }
    } );
}