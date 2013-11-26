function PropertyGrid__OneDB_AceEditor( div, settings ) {

    settings.height = settings.height || 128;

    div.parentNode.height = settings.height;
    
    var value = '';
    
    div.input = div.appendChild( (new AceEditor()).setAnchors({
        "width": function(w,h) {
            return w + 'px';
        },
        "height": function(w,h) {
            return h + 'px';
        }
    }) );
    
    Object.defineProperty( div, 'value', {
        "get": function() {
            return settings._getter ? settings._getter(div.input.value) : div.input.value;
        },
        "set": function(str) {
            div.input.value = settings._setter ? settings._setter(str) : str;
        }
    } );
    
    div.value = settings.value || '';
    
    if (typeof settings.syntax != 'undefined')
        div.input.syntax = settings.syntax;

}