/** TextBox Input
  
  PARAMS:
  ~~~~~~~~~~~~~~~~~~~~
  
  optional:
  initString: initial value of the input
  
  optional:
  settings = Object {
    (optional) str 'hintText': text to be displayed when the input is in blur state and has empty content
    (optional) str 'icon'    : url or base64 encoded icon (should be 16x16 by default)
  }
  
  internal Param: inpTypeString -- used internally by the TextArea class, don't use it
  
  SETTERS / GETTERS:
  ~~~~~~~~~~~~~~~~~~
  (set | get)Icon
  (set | get)HintText
  (set | get)TextValue
  
**/

function TextBox(initString, settings, inpTypeString) {

    var inp = $( !!!inpTypeString ? 'input' : inpTypeString );

    if (!!!inpTypeString || inpTypeString == 'text')
        inp.setAttribute('type', 'text');
    
    EnableCustomEventListeners( inp );
    
    var editable = true;
    settings = settings || {};
    
    Object.defineProperty( inp, "icon", {
        "get": function() {
            return icon;
        },
        "set": function(str) {
            ( !!str ? addStyle : removeStyle )( inp, 'hasIcon' );
            inp.style.backgroundImage = !!str ? 'url(' + str + ')' : 'none';
            icon = !!!str ? '' : str;
        }
    } );
    
    /* the hint text is kept for legacy and will be removed in the future */
    Object.defineProperty( inp, 'hintText', {
        "get": function() {
            return inp.placeholder;
        },
        "set": function( str ) {
            inp.placeholder = str;
        }
    } );
    
    Object.defineProperty( inp, 'editable', {
        "get": function() {
            return editable;
        },
        "set": function( boolVal ) {
            ( ( editable = !!boolVal ) ? removeStyle : addStyle )( inp, 'non-editable' );
        }
    });
    
    if (typeof initString != 'undefined') 
        inp.value = initString;
    
    inp.addEventListener('input', function() {
        inp.onCustomEvent('change', inp.value);
    } );
    
    if ( typeof settings.editable != 'undefined' )
        inp.editable = !!settings.editable;
    
    inp.addEventListener('keydown', function(e) {
        if (!editable)
            cancelEvent(e);
    }, true );
    
    inp.addEventListener('mousedown', function(e){
        if (!editable)
            cancelEvent(e);
    }, true);
    
    return inp;
}

function PasswordBox(initString, settings) {
    var inp = new TextBox(initString, settings);
    inp.setAttribute('type', 'password');
    return inp;
}

function TextArea(initString, settings) {
    var inp = new TextBox('', settings, 'textarea');
    return inp;
} 

/** Universal Date / Time / DateTime control
    
    SETTERS / GETTERS:
    ~~~~~~~~~~~~~~~~~~~~
    (set | get)dateValue
    
**/

/* Date Control */
function DateBox(settings) {
    var inp = new TextBox( settings.value || '' );

    settings = settings || {};

    settings.value = settings.value || "";
    settings.displayFormat = settings.displayFormat || "%a, %d %b, %Y";
    settings.valueFormat = settings.valueFormat || "%Y-%m-%d";

    if ( !settings.value )
        inp.value = (new Date()).toString(settings.displayFormat);
    
    var picker = new DatePicker(inp, settings.displayFormat);
    
    switch (true) {
        case picker.isDate && picker.isTime: 
            addStyle(inp, 'isDateTime');
            break;
        case picker.isTime : 
            addStyle(inp, 'isTime');
            break;
        case picker.isDate : addStyle(inp, 'isDate');
            break;
    }
    
    inp.readOnly = true;
    
    Object.defineProperty( inp, "dateValue", {
        "get": function() {
            return picker.DT.toString(settings.valueFormat);
        },
        "set": function( dateStr ) {
            picker.DT.fromString(dateStr, settings.valueFormat);
            picker.DD.fromString(dateStr, settings.valueFormat);

            if (picker.isDate) 
                picker.onCustomEvent('render-month');
                
            if (picker.isTime) 
                picker.onCustomEvent('render-time');
            
        }
    } );

    Object.defineProperty( inp, "valueFormat", {
        "get": function() {
            return settings.valueFormat;
        }
    } );

    Object.defineProperty( inp, "displayFormat", {
        "get": function() {
            return settings.displayFormat;
        }
    });

    return inp;
}