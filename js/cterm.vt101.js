var ESC = '\u001b';
var TermProto = {
    
    // VT100 Command parser states
    "ESnormal" : 0, "ESesc" : 1, "ESsquare" : 2, "ESgetpars" : 3, 
    "ESgotpars" : 4, "ESdeviceattr" : 5, "ESfunckey" : 6, "EShash" : 7, 
    "ESsetG0" : 8, "ESsetG1" : 9, "ESsetG2" : 10, "ESsetG3" : 11, 
    "ESbang" : 12, "ESpercent" : 13, "ESignore" : 14, "ESnonstd" : 15, 
    "ESpalette" : 16, "EStitle" : 17, "ESss2" : 18, "ESss3" : 19,
    
    // Mouse events
    "MOUSE_DOWN" : 0, "MOUSE_UP" : 1, "MOUSE_CLICK" : 2,
    
    // Keyboard Mappings
    "KeyMappings": {
        "f1"      : ( ESC + "OP" ).toHex(),
        "shift f1": ( ESC + "OP" ).toHex(),
        "f2"      : ( ESC + "OQ" ).toHex(),
        "shift f2": ( ESC + "OQ" ).toHex(),
        "f3"      : ( ESC + "OR" ).toHex(),
        "shift f3": ( ESC + "OR" ).toHex(),
        "f4"      : ( ESC + "OS" ).toHex(),
        "shift f4": ( ESC + "OS" ).toHex(),
        "f5"      : ( ESC + "[15~" ).toHex(),
        "f6"      : ( ESC + "[17~" ).toHex(),
        "shift f6": ( ESC + "[17~" ).toHex(),
        "f7"      : ( ESC + "[18~" ).toHex(),
        "f8"      : ( ESC + "[19~" ).toHex(),
        "f9"      : ( ESC + "[20~" ).toHex(),
        "f10"     : ( ESC + "[21~" ).toHex(),
        "f11"     : ( ESC + "[23~" ).toHex(),
        "f12"     : ( ESC + "[24~" ).toHex(),
        
        "ctrl f1" : ( ESC + "O4P" ).toHex(),
        "ctrl f2" : ( ESC + "O4Q" ).toHex(),
        "ctrl f3" : ( ESC + "O4R" ).toHex(),
        "ctrl f4" : ( ESC + "O4S" ).toHex(),
        "ctrl f5" : ( ESC + "[15;4~" ).toHex(),
        "ctrl f6" : ( ESC + "[17;4~" ).toHex(),
        "ctrl f7" : ( ESC + "[18;4~" ).toHex(),
        "ctrl f8" : ( ESC + "[19;4~" ).toHex(),
        "ctrl f9" : ( ESC + "[20;4~" ).toHex(),
        "ctrl f10": ( ESC + "[21;4~" ).toHex(),
        "ctrl f11": ( ESC + "[23;4~" ).toHex(),
        "ctrl f12": ( ESC + "[24;4~" ).toHex(),
        // "ctrl `": null, // dont know why's not working
        "ctrl 1": "11",
        "ctrl 2": "12",
        "ctrl 3": "1b",
        "ctrl 4": "1c",
        "ctrl 5": "1d",
        "ctrl 6": "1e",
        "ctrl 7": "1f",
        "ctrl 8": "7f",
        "ctrl 9": "19",
        "ctrl 0": "10",
        "ctrl -": "0D",
        "ctrl =": "1D",
        "ctrl q": "11",
        "ctrl w": null, //closes the current tab
        "ctrl e": "05",
        "ctrl r": "12",
        "ctrl t": null, //opens a new tab
        "ctrl y": "19",
        "ctrl u": "15",
        "ctrl i": "09",
        "ctrl o": "0F",
        "ctrl p": "10",
        "ctrl [": null, //dont know why's not working
        "ctrl ]": null, //dont know why's not working
        "ctrl \\": "1C",
        "ctrl a": "01",
        "ctrl s": "13",
        "ctrl d": "04",
        "ctrl f": "06",
        "ctrl g": "07",
        "ctrl h": "08",
        "ctrl j": "0A",
        "ctrl k": "0B",
        "ctrl l": "0C",
        "ctrl ;": "1B",
        "ctrl '": "07",
        "ctrl z": "1A",
        "ctrl x": "18",
        "ctrl c": "03",
        "ctrl v": "16",
        "ctrl b": "02",
        "ctrl n": null, // opens a new tab
        "ctrl m": "0D",
        "ctrl ,": "0C",
        "ctrl .": "0E",
        "ctrl /": "0F",
        // "alt `": null, // not supported, OS reserved
        "alt 1": ( ESC + "1" ).toHex(),
        "alt 2": ( ESC + "2" ).toHex(),
        "alt 3": ( ESC + "3" ).toHex(),
        "alt 4": ( ESC + "4" ).toHex(),
        "alt 5": ( ESC + "5" ).toHex(),
        "alt 6": ( ESC + "6" ).toHex(),
        "alt 7": ( ESC + "7" ).toHex(),
        "alt 8": ( ESC + "8" ).toHex(),
        "alt 9": ( ESC + "9" ).toHex(),
        "alt 0": ( ESC + "0" ).toHex(),
        "alt -": ( ESC + "-" ).toHex(),
        "alt =": ( ESC + "=" ).toHex(),
        "alt q": ( ESC + "q" ).toHex(),
        "alt w": ( ESC + "w" ).toHex(),
        "alt e": ( ESC + "e" ).toHex(),
        "alt r": ( ESC + "r" ).toHex(),
        "alt t": ( ESC + "t" ).toHex(),
        "alt y": ( ESC + "y" ).toHex(),
        "alt u": ( ESC + "u" ).toHex(),
        "alt i": ( ESC + "i" ).toHex(),
        "alt o": ( ESC + "o" ).toHex(),
        "alt p": ( ESC + "p" ).toHex(),
        // "alt [": null, // combination ignored
        // "alt ]": null, // combination ignored
        "alt \\":(ESC + "\\" ).toHex(),
        "alt a": ( ESC + "a" ).toHex(),
        "alt s": ( ESC + "s" ).toHex(),
        "alt d": ( ESC + "d" ).toHex(),
        "alt f": ( ESC + "f" ).toHex(),
        "alt g": ( ESC + "g" ).toHex(),
        "alt h": ( ESC + "h" ).toHex(),
        "alt j": ( ESC + "j" ).toHex(),
        "alt k": ( ESC + "k" ).toHex(),
        "alt l": ( ESC + "l" ).toHex(),
        "alt ;": ( ESC + ";" ).toHex(),
        "alt '": ( ESC + "'" ).toHex(),
        "alt z": ( ESC + "z" ).toHex(),
        "alt x": ( ESC + "x" ).toHex(),
        "alt c": ( ESC + "c" ).toHex(),
        "alt v": ( ESC + "v" ).toHex(),
        "alt b": ( ESC + "b" ).toHex(),
        "alt n": ( ESC + "n" ).toHex(),
        "alt m": ( ESC + "m" ).toHex(),
        "alt ,": ( ESC + "," ).toHex(),
        "alt .": ( ESC + "." ).toHex(),
        "alt /": ( ESC + "/" ).toHex(),
        // "ctrl alt `": "", // ignored, dont know why's not working
        "ctrl alt 1": "1B11",
        // "ctrl alt 2": "", // ignored, dont know why's not working
        "ctrl alt 3": "1B1B",
        "ctrl alt 4": "1B1C",
        "ctrl alt 5": "1B1D",
        "ctrl alt 6": "1B1E",
        "ctrl alt 7": "1B1F",
        "ctrl alt 8": "1B7F",
        "ctrl alt 9": "1B19",
        "ctrl alt 0": "1B10",
        "ctrl alt -": "1B0D",
        "ctrl alt =": "1B1D",
        // "ctrl alt q": "", // sends empty string, so ignored
        // "ctrl alt w": "", // sends empty string, so ignored
        "ctrl alt e": "1B05",
        "ctrl alt r": "1B12",
        // "ctrl alt t": "", // ignored, opens a new terminal in Ubuntu
        "ctrl alt y": "1B19",
        "ctrl alt u": "1B15",
        "ctrl alt i": "1B09",
        "ctrl alt o": "1B0F",
        "ctrl alt p": "1B10",
        // "ctrl alt [": "", //dont know why's not working
        // "ctrl alt ]": "", //dont know why's not working
        "ctrl alt \\": "5C",
        "ctrl alt a": "1B01",
        // "ctrl alt s": "", //ignored, it doesn't send a thing
        // "ctrl alt d": "", //ignored, it shows desktop in Ubuntu
        "ctrl alt f": "1B06",
        "ctrl alt g": "1B07",
        "ctrl alt h": "1B08",
        "ctrl alt j": "1B0A",
        "ctrl alt k": "1B0B",
        // "ctrl alt l": "", //ignored, it locks computer in Linux
        "ctrl alt ;": "1B1B",
        "ctrl alt '": "1B07",
        "ctrl alt z": "1B1A",
        "ctrl alt x": "1B18",
        "ctrl alt c": "1B03",
        "ctrl alt v": "1B16",
        "ctrl alt b": "1B02",
        "ctrl alt n": "1B0E",
        "ctrl alt m": "1B0D",
        "ctrl alt ,": "1B0C",
        "ctrl alt .": "1B0E",
        "ctrl alt /": "1B0D",

        "enter"               : "0D",
        "ctrl enter"          : "0D",
        "shift enter"         : "0D",
        "alt enter"           : "1B0D",
        "ctrl alt enter"      : "1B0D",
        "ctrl alt shift enter": "0D",
        "tab"               : "09",
        // "alt tab"          : "", // OS reserved
        // "ctrl tab"         : "", // Browser reserved
        "shift tab"         : "09",
        // "ctrl alt tab"     : "", // OS reserved
        "ctrl alt shift tab": "09",
        // "ctrl shift tab"   : "" // ignored
        "backspace"         : "7F",
        "ctrl backspace"    : "08",
        "alt backspace"     : "1B7F",
        "ctrl alt backspace": "1B7F",
        "shift backspace"   : "7F",
        "ctrl alt shift backspace": "7F",
        "ctrl shift backspace": "7F",
        "alt shift backspace": "1B7F",
        "home"         : "1B4F48",
        "alt home"     : "1B4F3248",
        "shift home"   : "1B4F3148",
        "ctrl alt home": "1B4F3648",
        "ctrl home"    : "1B4F3448",
        "delete"       : "1B5B337E",
        // "alt delete"   : "",
        "ctrl delete"  : "1B5B333B347E",
        "end": "1B4F46",
        "ctrl end": "1B4F3446",
        "ctrl alt end": "1B4F3646",
        "alt end": "1B4F3246",
        "page_up": (ESC + "[5~").toHex(),
        // "ctrl page_up": "", // Browser ignored
        "ctrl alt page_up": "1B5B353B367E",
        "alt page_up": "1B3C",
        "page_down": ( ESC + "[6~").toHex(),
        // "ctrl page_down": "", ignored
        "ctrl alt page_down": "1B5B363B367E",
        "alt page_down": "1B3E",

        "up0": "1B5B41",
        "ctrl up": "1B5B3441",
        // "ctrl alt up": "", ignored
        "alt up": "1B70",
        "down0": "1B5B42",
        "ctrl down": "1B5B3442",
        // "ctrl alt down": "", os reserved
        "alt down": "1B6E",
        "left0": "1B5B44",
        "ctrl left": "1B5B3444",
        // "ctrl alt left": "", ignored
        "alt left": "1B62",
        "right0": "1B5B43",
        "ctrl right": "1B5B3443",
        // "ctrl alt right": "", // os reserved
        "alt right": "1B66",

        "up1": "1B4F41",
        "down1": "1B4F42",
        "left1": "1B4F44",
        "right1": "1B4F43",

        "insert": "1B5B327E",
        "ctrl insert": "1B5B323B347E",
        "shift insert": "5F",
        "ctrl alt insert": "1B5B323B367E",
        "space": '20',
        "shift space": "20",
        "ctrl space": "00",
        "ctrl alt space": "1B00",
        
        "esc": '1B'
    }
}

// @def: func this.sendControlToPrinter
// @def: func this.bs
// @def: func this.ht
// @def: func this.lf
// @def: func this.cr
// @def: func this.ri
// @def: func this.rt
// @def: func this.respondID
// @def: func this.saveCursor
// @def: func this.reset                        // NOTE: All calls should be made without any parameters
// @def: func this.flashScreen                  // NOTE: Determine if we can implement it in framebuffer and remove it for good
// @def: func this.respondSecondaryDA
// @def: func this.setMode
// @def: func this.setCursorAttr                // NOTE: Dummy !!!
// @def: func this.showCursor                   // NOTE: IT IS implemented via framebuffer
// @def: func this.hideCursor                   // NOTE: IT IS mplemented via framebuffer
// @def: func this.gotoXY
// @def: func this.gotoXaY
// @def: func this.csiAt
// @def: func this.csii                         // NOTE: Dummy 99% !!!
// @def: func this.csiJ                         // DONE
// @def: func this.csiK                         // DONE
// @def: func this.csiL                         // DONE
// @def: func this.csiM                         // DONE: FIXED: needWrap with this.needWrap @ end of function body
// @def: func this.csim                         // DONE
// @def: func this.csiP                         // NOTE: FIXED: needWrap with this.needWrap @ end of function body
// @def: func this.csiX                         // NOTE: FIXED: needWrap with this.needWrap @ end of function body
// @def: func this.statusReport
// @def: func this.cursorReport
// @def: func this.saveCursor                   
// @def: func this.restoreCursor
// @def: func this.settermCommand
// @def: func this.scrollRegion                 // DONE
// @def: func this.enableAlternateScreen        // DONE: Implemented a double buffer screen memory via framebuffer
// @def: func this.putString                    // DONE
// @def: func beep                              // TODO
// @def: func renderString                      // DONE

// DEPRECATED 
// @DEPRE: this.numScrollbackLines      // int

// INITIALIZATION WHEN RESETTING
// @RDEF : this.applKeyMode             // bool
// @RDEF : this.autoWrapMode            // bool
// @RDEF : this.bottom                  // int
// @RDEF : this.crLfMode                // bool
// @RDEF : this.cursorKeyMode           // bool
// @RDEF : this.dispCtrl                // bool
// @RDEF : this.GMap                    // array [ array [ character mapping ] ]
// @RDEF : this.insertMode              // bool
// @RDEF : this.isEsc                   // intbool
// @RDEF : this.lastCharacter           // char[1]
// @RDEF : this.mouseReporting          // bool
// @RDEF : this.needWrap                // bool
// @RDEF : this.offsetMode              // bool
// @RDEF : this.printing                // bool
// @RDEF : this.translate               // array [ character mapping]
// @RDEF : this.toggleMeta              // bool
// @RDEF : this.top                     // int
// @RDEF : this.useGMap                 // int
// @RDEF : this.userTabStop             // array [int=>bool]
// @RDEF : this.utfEnabled              // bool
// @RDEF : this.utfChar                 // int
// @RDEF : this.utfCount                // int

// INITIALIZATION AT CONSTRUCTOR
// @DEF  : this.autoPrint               // bool
// @DEF  : this.CodePage437Map          // [ CONST STATIC character mapping]
// @DEF  : this.Latin1Map               // [ CONST STATIC character mapping]
// @DEF  : this.VT100GraphicsMap        // [ CONST STATIC character mapping]
// @DEF  : this.isQuestionMark          // bool
// @DEF  : this.npar                    // int
// @DEF  : this.par                     // array [int]
// @DEF  : this.respondString           // string               // NOTE: implement via setter, in order to transmit event to host realtime
// @DEF  : this.savedAttr               // array [2] of <int>attrs
// @DEF  : this.savedGMap               // array [ character mapping ]
// @DEF  : this.savedUseGMap            // int
// @DEF  : this.savedX                  // array [2] of int
// @DEF  : this.savedY                  // array [2] of int
// @DEF  : this.savedValid              // array [2] of bool
// @DEF  : this.titleString             // string
// @DEF  : this.utfPreferred            // bool

// INITIALIZATION THROUGH FRAMEBUFFER
// @GTR  : this.attr                    // int
// @GTR  : this.blinkingCursor          // bool                 // DONE: implement via framebuffer
// @GTR  : this.cursorNeedsShowing      // bool                 // DONE: implement via framebuffer
// @GTR  : this.cursorX                 // int                  // DONE: implemented via framebuffer
// @GTR  : this.cursorY                 // int                  // DONE: implemented via framebuffer
// @GTR  : this.isInverted              // bool                 // DONE: implement via framebuffer
// @GTR  : this.terminalHeight          // int                  // DONE!
// @GTR  : this.terminalWidth           // int                  // DONE!

addOnload( function() {

    var _clipData = '';

    Object.defineProperty( window, "clipData", {
        "get": function() {
            return _clipData;
        },
        "set": function( s ) {
            _clipData = s + '';
        }
    });

    window.addEventListener('paste', function(e) {
        _clipData = e.clipboardData.getData('text/plain');
    }, true );

});

function VT101() {
    return (new CRT_FrameBuffer()).chain( function(){
        
        var _translate = null;
        var _titleString = '';
        
        Object.defineProperty( this, "translate", {
            "get": function() {
                return _translate;
            },
            "set": function(f) {
                //console.log("Translate changed from: ", _translate, " to: ", f );
                _translate = f;
            }
        } );
        
        Object.defineProperty( this, "terminalWidth", {
            "get": function() {
                return this.cols;
            },
            "set": function( i ) {
                throw "terminal width is read-only";
            }
        } );
        
        Object.defineProperty( this, "terminalHeight", {
            "get": function() {
                return this.lines;
            },
            "set": function( i ) {
                throw "terminal height is read-only!";
            }
        } );
        
        Object.defineProperty( this, "currentScreen", {
            "get": function() {
                return this.activePage;
            },
            "set": function( i ) {
                this.activePage = i;
            }
        } );
        
        Object.defineProperty( this, "titleString", {
            "get": function() {
                return _titleString;
            },
            "set": function(str) {
                _titleString = str;
                this.onCustomEvent("setTitle", str );
            }
        } );
        
        this.doControl = function(ch) {
        
            // @undef: lineBuf // varchar
            
            if (this.printing) {
                this.sendControlToPrinter(ch);
                return '';
            }
            
            var lineBuf  = '';
  
            switch (ch) {
                case 0x00: // ignored
                    break;
                case 0x08: 
                    this.bs();
                    break;
                case 0x09: 
                    this.ht(); 
                    break;
                case 0x0A:
                case 0x0B:
                case 0x0C:
                case 0x84: 
                    this.lf(); 
                    if (!this.crLfMode)
                        break;
                case 0x0D: 
                    this.cr();
                    break;
                case 0x85: 
                    this.cr();
                    this.lf();
                    break;
                case 0x0E: 
                    this.useGMap = 1;
                    this.translate = this.GMap[1];
                    this.dispCtrl = true;
                    break;
                case 0x0F: this.useGMap = 0;
                    this.translate = this.GMap[0];
                    this.dispCtrl = false;
                    break;
                case 0x18:
                case 0x1A: 
                    this.isEsc = 0 /* TermProto.ESnormal */;
                    break;
                case 0x1B: 
                    this.isEsc = 1 /* TermProto.ESesc */;
                    break;
                case 0x7F: // ignored
                    break;
                case 0x88: 
                    this.userTabStop[this.cursorX] = true;
                    break;
                case 0x8D: 
                    this.ri();
                    break;
                case 0x8E: 
                    this.isEsc = 18 /* TermProto.ESss2 */; 
                    break;
                case 0x8F: 
                    this.isEsc = 19 /* TermProto.ESss3 */;
                    break;
                case 0x9A: 
                    this.respondID();
                    break;
                case 0x9B: 
                    this.isEsc = 2 /* TermProto.ESsquare */; 
                    break;
                case 0x07: 
                    if (this.isEsc != 17 /* TermProto.EStitle */ ) {
                        this.beep();
                        break;
                    }
                default: // fall thru
                    switch (this.isEsc) {
                        case 1 /* TermProto.ESesc */:
                            this.isEsc = 0 /* TermProto.ESnormal */;
                            switch (ch) {
                                case 0x25: // %
                                    this.isEsc   = 13 /* TermProto.ESbang */;
                                    break;
                                case 0x28: // (
                                    this.isEsc   = 8 /* TermProto.ESsetG0 */;
                                    break;
                                case 0x2D: // -
                                case 0x29: // )
                                    this.isEsc   = 9 /* TermProto.ESsetG1 */;
                                    break;
                                case 0x2E: // .
                                case 0x2A: // *
                                    this.isEsc   = 10 /* TermProto.ESsetG2 */;
                                    break;
                                case 0x2F: // /
                                case 0x2B: // +
                                    this.isEsc   = 11 /* TermProto.ESsetG3 */;
                                    break;
                                case 0x23: // #
                                    this.isEsc   = 7 /* TermProto.EShash */;
                                    break;
                                case 0x37: // 7
                                    this.saveCursor();
                                    break;
                                case 0x38: // 8
                                    this.restoreCursor();
                                    break;
                                case 0x3E: // >
                                    this.applKeyMode = false;
                                    break;
                                case 0x3D: // =
                                    this.applKeyMode = true;
                                    break;
                                case 0x44: // D
                                    this.lf();
                                    break;
                                case 0x45: // E
                                    this.cr(); 
                                    this.lf();
                                    break;
                                case 0x4D: // M
                                    this.ri();
                                    break;
                                case 0x4E: // N
                                    this.isEsc = 18 /* TermProto.ESss2 */;
                                    break;
                                case 0x4F: // O
                                    this.isEsc = 19 /* TermProto.ESss3 */;
                                    break;
                                case 0x48: // H
                                    this.userTabStop[this.cursorX] = true;
                                    break;
                                case 0x5A: // Z
                                    this.respondID();
                                    break;
                                case 0x5B: // [
                                    this.isEsc = 2 /* TermProto.ESsquare */;
                                    break;
                                case 0x5D: // ]
                                    this.isEsc = 15 /* TermProto.ESnonstd */;
                                    break;
                                case 0x63: // c
                                    this.reset();
                                    break;
                                case 0x67: // g
                                    this.flashScreen();
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 15 /* TermProto.ESnonstd */:
                            switch (ch) {
                                case 0x30: // 0
                                case 0x31: // 1
                                case 0x32: // 2
                                    this.isEsc = 17 /* TermProto.EStitle */; 
                                    this.titleString = '';
                                    break;
                                case 0x50: // P
                                    this.npar = 0; 
                                    this.par = [ 0, 0, 0, 0, 0, 0, 0 ];
                                    this.isEsc = 16 /* TermProto.ESpalette */;
                                    break;
                                case 0x52:// R
                                    // Palette support is not implemented
                                    this.isEsc = 0 /* TermProto.ESnormal */;
                                    break;
                                default: 
                                    this.isEsc = 0 /* TermProto.ESnormal */;
                                    break;
                            }
                            break;
                        case 16 /* TermProto.ESpalette */: // ESpalette
                            if ( (ch >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */ ) ||
                                (ch >= 0x41 /* A */  && ch <= 0x46 /* F */ ) ||
                                (ch >= 0x61 /* a */  && ch <= 0x66 /* f */ ) ) 
                            {
                                this.par[ this.npar++ ] = ch > 0x39  // 9
                                    ? (ch & 0xDF) - 55
                                    : (ch & 0xF);
                                if (this.npar == 7) {
                                    // Palette support is not implemented
                                    this.isEsc = 0 /* TermProto.ESnormal */;
                                }
                            } else 
                                this.isEsc = 0 /* TermProto.ESnormal */;
                            break;
                        case 2 /* TermProto.ESsquare */:
                            this.npar = 0;
                            this.par = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
                            this.isEsc = 3 /* TermProto.ESgetpars */;
                            if (ch == 0x5B) { // [ Function key
                                this.isEsc = 6 /* TermProto.ESfunckey */;
                                break;
                            } else {
                                this.isQuestionMark = ch == 0x3F; // ?
                                if (this.isQuestionMark)
                                    break;
                            }
                        // Fall through
                        case 5 /* TermProto.ESdeviceattr */:
                        case 3 /* TermProto.ESgetpars */: 
                            if (ch == 0x3B) { // ;
                                this.npar++;
                                break;
                            } else 
                            if ( ch >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */ ) {
                                var par = this.par[ this.npar ];
                                if (par == undefined)
                                    par = 0;
                                this.par[ this.npar ] = 10 * par + (ch & 0xF);
                                break;
                            } else 
                            if (this.isEsc == 5 /* TermProto.ESdeviceattr */) {
                                switch (ch) {
                                    case 0x63: // c
                                        if (this.par[0] == 0) 
                                            this.respondSecondaryDA();     
                                        break;
                                    case 0x6D: // m
                                        // (re)set key modifier resource values
                                        break;
                                    case 0x6E: // n
                                        //  disable key modifier resource values
                                        break;
                                    case 0x70: // p
                                        // set pointer mode resource value
                                        break;
                                    default:
                                        break;
                                }
                                this.isEsc = 0 /* TermProto.ESnormal */;
                                break;
                            } else
                                this.isEsc = 4 /* TermProto.ESgotpars */;

                            // Fall through
                            case 4 /* TermProto.ESgotpars */:
                                this.isEsc = 0 /* TermProto.ESnormal */;
                                if (this.isQuestionMark) {
                                    switch (ch) {
                                        case 0x68: // h
                                            this.setMode(true);
                                            break;
                                        case 0x6C: // l
                                            this.setMode(false);
                                            break;
                                        case 0x63: // c
                                            this.setCursorAttr(this.par[2], this.par[1]);
                                            break;
                                        default:
                                            break;
                                    }
                                    this.isQuestionMark   = false;
                                    break;
                                }
                                switch (ch) {
                                    case 0x21: // !
                                        this.isEsc = 12 /* TermProto.ESbang */;
                                        break;
                                    case 0x3E: // >
                                        if (!this.npar) 
                                            this.isEsc  = 5 /* TermProto.ESdeviceattr */;
                                        break;
                                    case 0x47: // G
                                    case 0x60: // `
                                        this.gotoXY(this.par[0] - 1, this.cursorY);
                                        break;
                                    case 0x41:// A
                                        this.gotoXY(
                                            this.cursorX, 
                                            this.cursorY - (
                                                this.par[0] 
                                                    ? this.par[0] 
                                                    : 1
                                            )
                                        );
                                        break;
                                    case 0x42: // B
                                    case 0x65: // e
                                        this.gotoXY( this.cursorX, this.cursorY + ( this.par[0] ? this.par[0] : 1 ) );
                                        break;
                                    case 0x43: // C
                                    case 0x61: // a
                                        this.gotoXY( this.cursorX + ( this.par[0] ? this.par[0] : 1 ), this.cursorY );
                                        break;
                                    case 0x44: // D
                                        this.gotoXY( this.cursorX - ( this.par[0] ? this.par[0] : 1 ), this.cursorY ); 
                                        break;
                                    case 0x45: // E
                                        this.gotoXY( 0, this.cursorY + ( this.par[0] ? this.par[0] : 1 ) );
                                        break;
                                    case 0x46: // F
                                        this.gotoXY( 0, this.cursorY - ( this.par[0] ? this.par[0] : 1 ) );
                                        break;
                                    case 0x64: // d
                                        this.gotoXaY( this.cursorX, this.par[0] - 1 );
                                        break;
                                    case 0x48: // H
                                    case 0x66: // f
                                        this.gotoXaY( this.par[1] - 1, this.par[0] - 1 );
                                        break;
                                    case 0x49: // I
                                        this.ht( this.par[0] ? this.par[0] : 1 );
                                        break;
                                    case 0x40: // @
                                        this.csiAt( this.par[0] );
                                        break;
                                    case 0x69: // i
                                        this.csii( this.par[0] );
                                        break;
                                    case 0x4A: // J
                                        this.csiJ( this.par[0] );
                                        break;
                                    case 0x4B: // K
                                        this.csiK( this.par[0] );
                                        break;
                                    case 0x4C: // L
                                        this.csiL( this.par[0] );
                                        break;
                                    case 0x4D: // M
                                        this.csiM( this.par[0] );
                                        break;
                                    case 0x6D: // m
                                        this.csim();
                                        break;
                                    case 0x50: // P
                                        this.csiP(this.par[0]);
                                        break;
                                    case 0x58: // X
                                        this.csiX(this.par[0]);
                                        break;
                                    case 0x53: // S
                                        this.lf( this.par[0] ? this.par[0] : 1);
                                        break;
                                    case 0x54: // T
                                        this.ri( this.par[0] ? this.par[0] : 1 );
                                        break;
                                    case 0x63: // c
                                        if (!this.par[0]) 
                                            this.respondID();
                                        break;
                                    case 0x67: // g
                                        if (this.par[0] == 0) {
                                            this.userTabStop[ this.cursorX ] = false;
                                        } else 
                                        if (this.par[0] == 2 || this.par[0] == 3 ) {
                                            this.userTabStop = [ ];
                                            for ( var i = 0; i < this.terminalWidth; i++ ) {
                                                this.userTabStop[i] = false;
                                            }
                                        }
                                        break;
                                    case 0x68: // h
                                        this.setMode(true);
                                        break;
                                    case 0x6C: // l
                                        this.setMode(false);
                                        break;
                                    case 0x6E: // n
                                        switch (this.par[0]) {
                                            case 5: 
                                                this.statusReport();
                                                break;
                                            case 6: 
                                                this.cursorReport();
                                                break;
                                            default:
                                                break;
                                        }
                                        break;
                                    case 0x71: // q
                                        // LED control not implemented
                                        break;
                                    case 0x72: // r
                                        var t = this.par[0] ? this.par[0] : 1;
                                        var b = this.par[1] ? this.par[1] : this.terminalHeight;
                                        if ( t < b && b <= this.terminalHeight ) {
                                            this.top = t - 1;
                                            this.bottom= b;
                                            this.gotoXaY(0, 0);
                                        }
                                        break;
                                    case 0x62: // b
                                        var c = this.par[0] ? this.par[0] : 1;
                                        if ( c > this.terminalWidth * this.terminalHeight ) {
                                            c = this.terminalWidth * this.terminalHeight;
                                        }
                                        while (c-- > 0) {
                                            lineBuf += this.lastCharacter;
                                        }
                                        break;
                                    case 0x73: // s
                                        this.saveCursor();
                                        break;
                                    case 0x75: // u
                                        this.restoreCursor();
                                        break;
                                    case 0x5A: // Z
                                        this.rt( this.par[0] ? this.par[0] : 1);
                                        break;
                                    case 0x5D: // ]
                                        this.settermCommand();
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case 12 /* TermProto.ESbang */:
                                if (ch == 'p')
                                    this.reset();
                                this.isEsc = 0 /* TermProto.ESnormal */;
                                break;
                            case 13 /* TermProto.ESbang */:
                                this.isEsc = 0 /* TermProto.ESnormal */;
                                switch (ch) {
                                    case 0x40: // @
                                        this.utfEnabled = false;
                                        break;
                                    case 0x47: // G
                                    case 0x38: // 8
                                        this.utfEnabled = true;
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case 6 /* TermProto.ESfunckey */:
                                this.isEsc = 0 /* TermProto.ESnormal */;
                                break;
                            case 7 /* TermProto.EShash */:
                                this.isEsc = 0 /* TermProto.ESnormal */;
                                //if (ch == 0x38) { // 8
                                    // Screen alignment test not implemented
                                //}
                                break;
                            case 8 /* TermProto.ESsetG0 */:
                            case 9 /* TermProto.ESsetG1 */:
                            case 10 /* TermProto.ESsetG2 */:
                            case 11 /* TermProto.ESsetG3 */:
                                var g = this.isEsc - 8 /* TermProto.ESsetG0 */;
                                this.isEsc = 0 /* TermProto.ESnormal */;
                                switch (ch) {
                                    case 0x30: // 0
                                        this.GMap[g] = this.VT100GraphicsMap;
                                        break;
                                    case 0x42: // A
                                    case 0x42: // B
                                        this.GMap[g] = this.Latin1Map;
                                        break;
                                    case 0x55: // U
                                        this.GMap[g] = this.CodePage437Map;
                                        break;
                                    case 0x4B: // K
                                        this.GMap[g] = this.DirectToFontMap;
                                        break;
                                    default:
                                        break;
                                }
                                if (this.useGMap == g) {
                                    this.translate = this.GMap[g];
                                }
                                break;
                            case 17 /* TermProto.EStitle */:
                                if (ch == 0x07) {
                                    if ( this.titleString && this.titleString.charAt(0) == ';') {
                                        this.titleString = this.titleString.substr(1);
                                        if (this.titleString != '') {
                                            this.titleString += ' - ';
                                        }
                                        this.titleString += 'Terminal'
                                    }
                                    this.isEsc = 0 /* TermProto.ESnormal */;
                                } else {
                                        this.titleString += String.fromCharCode(ch);
                                }
                                break;
                            case 18 /* TermProto.ESss2 */:
                            case 19 /* TermProto.ESss3 */:
                                if (ch < 256) {
                                    ch = this.GMap[ this.isEsc - 18 /* TermProto.ESss2 */ + 2 ][ this.toggleMeta ? (ch | 0x80) : ch];
                                    if ((ch & 0xFF00) == 0xF000) {
                                        ch = ch & 0xFF;
                                    } else 
                                    if (ch == 0xFEFF || ( ch >= 0x200A && ch <= 0x200F) ) {
                                        this.isEsc = 0 /* TermProto.ESnormal */;
                                        break;
                                    }
                                }
                                this.lastCharacter = String.fromCharCode(ch);
                                lineBuf += this.lastCharacter;
                                this.isEsc = 0 /* TermProto.ESnormal */;
                                break;
                            default:
                                this.isEsc = 0 /* TermProto.ESnormal */;
                                break;
                        }
                    break;
                }
  
                return lineBuf;
        }
        
        this.sendControlToPrinter = function(ch) {
            try {
                switch (ch) {
                    case  9:
                    case 10:
                    case 12:
                        break;
                    case 27:
                        // ESC
                        this.isEsc = 1 /* TermProto.ESesc */;
                        break;
                    default:
                        switch (this.isEsc) {
                            case 1 /* TermProto.ESesc */:
                                this.isEsc = 0 /* TermProto.ESnormal */;
                                switch (ch) {
                                    case 0x5B: // [
                                        this.isEsc = 2 /* TermProto.ESsquare */;
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case 2 /* TermProto.ESsquare */:
                                this.npar             = 0;
                                this.par              = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
                                this.isEsc            = 3 /* TermProto.ESgetpars */;
                                this.isQuestionMark   = ch == 0x3F; // ?
                                if (this.isQuestionMark)
                                    break;
                            // Fall through
                            case 3 /* TermProto.ESgetpars */: 
                                if (ch == 0x3B) { // ;
                                    this.npar++;
                                    break;
                                } else 
                                if ( ch >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */ ) {
                                    var par = this.par[this.npar];
                                    if (par == undefined)
                                        par = 0;
                                    this.par[this.npar] = 10*par + (ch & 0xF);
                                    break;
                                } else
                                    this.isEsc = 4 /* TermProto.ESgotpars */;
                            // Fall through
                            case 4 /* TermProto.ESgotpars */:
                                this.isEsc = 0 /* TermProto.ESnormal */;
                                if (this.isQuestionMark)
                                    break;
                                switch (ch) {
                                    case 0x69: // i
                                        this.csii( this.par[0] );
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            default:
                                this.isEsc = 0 /* TermProto.ESnormal */;
                                break;
                        }
                        break;
                }
            } catch (e) 
            {
            }
        };
        
        // backspace command
        this.bs = function() {
            if (this.cursorX > 0) {
                this.gotoXY(this.cursorX - 1, this.cursorY);
                this.needWrap = false;
            }
        };

        // horizontal tab command
        this.ht = function(count) {
            if (count == undefined)
                count = 1;
            var cx = this.cursorX;
            while (count-- > 0) {
                while (cx++ < this.terminalWidth) {
                    var tabState = this.userTabStop[cx];
                    if (tabState == false) {
                        // Explicitly cleared tab stop
                        continue;
                    } else if (tabState) {
                        // Explicitly set tab stop
                        break;
                    } else {
                        // Default tab stop at each eighth column
                        if (cx % 8 == 0)
                            break;
                    }
                }
            }
            if (cx > this.terminalWidth - 1)
                cx = this.terminalWidth - 1;
            if (cx != this.cursorX)
                this.gotoXY(cx, this.cursorY);
        };
        
        // line feed
        this.lf = function(count) {
            if (count == undefined) {
                count = 1;
            } else {
                if (count > this.terminalHeight)
                    count  = this.terminalHeight;
                if (count < 1)
                    count  = 1;
            }
            while (count-- > 0) {
                if (this.cursorY == this.bottom - 1) {
                this.scrollRegion(
                    0, 
                    this.top + 1, 
                    this.terminalWidth, 
                    this.bottom - this.top - 1, 
                    0, 
                    -1, 
                    this.attr
                );
                } else if (this.cursorY < this.terminalHeight - 1) {
                this.gotoXY(this.cursorX, this.cursorY + 1);
                }
            }
        };
        
        // carriage return
        this.cr = function() {
            this.gotoXY(0, this.cursorY);
            this.needWrap = false;
        };
        
        // ???
        this.ri = function(count) {
            if (count == undefined) {
                count = 1;
            } else {
                if (count > this.terminalHeight)
                    count = this.terminalHeight;
                if (count < 1)
                    count = 1;
            }
            while (count-- > 0) {
                if (this.cursorY == this.top) {
                    this.scrollRegion(
                        0, 
                        this.top,
                        this.terminalWidth, 
                        this.bottom - this.top - 1,
                        0, 
                        1, 
                        this.attr
                    );
                } else 
                if (this.cursorY > 0) {
                    this.gotoXY(this.cursorX, this.cursorY - 1);
                }
            }
            this.needWrap = false;
        };
        
        // ???
        this.rt = function(count) {
            if (count == undefined) {
                count = 1 ;
            }
            var cx = this.cursorX;
            while (count-- > 0) {
                while (cx-- > 0) {
                    var tabState = this.userTabStop[cx];
                    if (tabState == false) {
                        // Explicitly cleared tab stop
                        continue;
                    } else 
                    if (tabState) {
                        // Explicitly set tab stop
                        break;
                    } else {
                        // Default tab stop at each eighth column
                        if (cx % 8 == 0)
                            break;
                    }
                }
            }
            if (cx < 0)
                cx = 0;
            if (cx != this.cursorX)
                this.gotoXY(cx, this.cursorY);
        };
        
        this.respondID = function() {
            this.respondString += '\u001B[?6c';
        };
        
        this.saveCursor = function() {
            this.savedX[this.currentScreen]     = this.cursorX;
            this.savedY[this.currentScreen]     = this.cursorY;
            this.savedAttr[this.currentScreen]  = this.attr;
            this.savedUseGMap                   = this.useGMap;
            for (var i = 0; i < 4; i++) {
                this.savedGMap[i]                 = this.GMap[i];
            }
            this.savedValid[this.currentScreen] = true;
        };
        
        
        this.reset = function() {
            this.isEsc = 0 /* TermProto.ESnormal */;
            this.needWrap = false;
            this.autoWrapMode = true;
            this.dispCtrl = false;
            this.toggleMeta = false;
            this.insertMode = false;
            this.applKeyMode = false;
            this.cursorKeyMode = false;
            this.crLfMode = false;
            this.offsetMode = false;
            this.mouseReporting = false;
            this.printing = false;
            this.utfEnabled = this.utfPreferred;
            this.utfCount = 0;
            this.utfChar = 0;
            this.attr = 0x00F0 /* ATTR_DEFAULT */;
            this.useGMap = 0;
            this.GMap = [ this.Latin1Map, this.VT100GraphicsMap, this.CodePage437Map, this.DirectToFontMap];
            //console.log("Set translate to: ", this.GMap, this.useGMap );
            this.translate = this.GMap[this.useGMap];
            this.top = 0;
            this.bottom = this.terminalHeight;
            this.lastCharacter = ' ';
            this.userTabStop = [ ];
            this.enableAlternateScreen(false);
            this.gotoXY(0, 0);
            this.showCursor();
            this.isInverted = false;
            this.clearRegion(0, 0, this.terminalWidth, this.terminalHeight, this.attr);
        };
        
        // inverts screen for 100ms
        this.flashScreen = function() {
            this.isInverted = !this.isInverted;
            setTimeout(function(vt100) {
                return function() {
                    vt100.isInverted = !vt100.isInverted;
                };
            }(this), 100);
        };

        this.respondSecondaryDA = function() {
            this.respondString += '\u001B[>0;0;0c';
        };
        
        this.setMode = function( state ) {
            for (var i = 0; i <= this.npar; i++) {
                if (this.isQuestionMark) {
                    switch (this.par[i]) {
                        case  1: 
                            this.cursorKeyMode = state;
                            break;
                        
                        /* Should not be implemented */
                        // case  3: 
                        //    this.set80_132Mode(state);
                        //    break;
                        
                        case  5: 
                            this.isInverted = state; 
                            break;
                        case  6: 
                            this.offsetMode = state;
                            break;
                        case  7: 
                            this.autoWrapMode = state;
                            break;
                        case 1000:
                        case  9: 
                            this.mouseReporting = state;
                            break;
                        case 25: 
                            this.cursorNeedsShowing = state;
                            if (state) { 
                                this.showCursor(); 
                            } else { 
                                this.hideCursor(); 
                            }
                            break;
                        case 1047:
                        case 1049:
                        case 47: 
                            this.enableAlternateScreen(state);
                            break;
                        default:
                            break;
                    }
                } else {
                    switch (this.par[i]) {
                        case  3: 
                            this.dispCtrl = state;
                            break;
                        case  4: 
                            this.insertMode = state;
                            break;
                        case  20:
                            this.crLfMode = state;
                            break;
                        default:
                            break;
                    }
                }
            }
        };
        
        this.setCursorAttr = function(setAttr, xorAttr) {
            // Changing of cursor color is not implemented.
        };
        
        this.showCursor = function(x, y) {
            if ( !this.cursorNeedsShowing ) {
                this.cursorNeedsShowing = true;
                return true;
            } else
            return false;
        };
        
        this.hideCursor = function() {
            if ( this.cursorNeedsShowing ) {
                this.cursorNeedsShowing = false;
                return true;
            } else
            return false;
        };
        
        this.gotoXY = function(x, y) {
            if (x >= this.terminalWidth) {
                x = this.terminalWidth - 1;
            }
            if (x < 0) {
                x = 0;
            }
            var minY, maxY;
            if (this.offsetMode) {
                minY = this.top;
                maxY = this.bottom;
            } else {
                minY = 0;
                maxY = this.terminalHeight;
            }
            if (y >= maxY) {
                y = maxY - 1;
            }
            if (y < minY) {
                y = minY;
            }
            this.cursorX = x;
            this.cursorY = y;
            //this.putString(x, y, '', undefined);
            this.needWrap = false;
        };
        
        this.gotoXaY = function(x, y) {
            this.gotoXY(x, this.offsetMode ? (this.top + y) : y);
        };
        
        this.csiAt = function(number) {
            // Insert spaces
            if (number == 0) {
                number = 1;
            }
            if (number > this.terminalWidth - this.cursorX) {
                number = this.terminalWidth - this.cursorX;
            }
            this.scrollRegion(this.cursorX, this.cursorY, this.terminalWidth - this.cursorX - number, 1, number, 0, this.attr);
            this.needWrap = false;
        };
        
        // Printer control
        this.csii = function(number) {
            switch (number) {
                case 0: // Print Screen
                    break;
                case 4: // Stop printing
                    this.printing = false;
                    break;
                case 5: // Start printing
                    this.printing = 100;
                    break;
                default:
                    break;
            }
        };
        
        this.csiJ = function(number) {
            switch (number) {
                case 0: // Erase from cursor to end of display
                    this.clearRegion(this.cursorX, this.cursorY, this.terminalWidth - this.cursorX, 1, this.attr);
                    if (this.cursorY < this.terminalHeight-2) {
                        this.clearRegion(0, this.cursorY+1, this.terminalWidth, this.terminalHeight-this.cursorY-1, this.attr);
                    }
                    break;
                case 1: // Erase from start to cursor
                    if (this.cursorY > 0) {
                        this.clearRegion(0, 0, this.terminalWidth, this.cursorY, this.attr);
                    }
                    this.clearRegion(0, this.cursorY, this.cursorX + 1, 1, this.attr);
                    break;
                case 2: // Erase whole display
                    this.clearRegion(0, 0, this.terminalWidth, this.terminalHeight, this.attr);
                    break;
                default:
                    return;
            }
            this.needWrap = false;
        };
        
        this.csiK = function(number) {
            switch (number) {
                case 0: // Erase from cursor to end of line
                    this.clearRegion(this.cursorX, this.cursorY, this.terminalWidth - this.cursorX, 1, this.attr);
                    break;
                case 1: // Erase from start of line to cursor
                    this.clearRegion(0, this.cursorY, this.cursorX + 1, 1, this.attr);
                    break;
                case 2: // Erase whole line
                    this.clearRegion(0, this.cursorY, this.terminalWidth, 1, this.attr);
                    break;
                default:
                    return;
            }
            this.needWrap = false;
        };
        
        this.csiL = function(number) {
            // Open line by inserting blank line(s)
            if (this.cursorY >= this.bottom)
                return;
            if (number == 0)
                number = 1;
            if (number > this.bottom - this.cursorY)
                number = this.bottom - this.cursorY;
            this.scrollRegion(0, this.cursorY, this.terminalWidth, this.bottom - this.cursorY - number, 0, number, this.attr);
            this.needWrap = false;
        };
        
        this.csiM = function(number) {
            // Delete line(s), scrolling up the bottom of the screen.
            if (this.cursorY >= this.bottom)
                return;
            if (number == 0)
                number = 1;
            if (number > this.bottom - this.cursorY)
                number = this.bottom - this.cursorY;
            this.scrollRegion(0, this.cursorY + number, this.terminalWidth, this.bottom - this.cursorY - number, 0, -number, this.attr);
            this.needWrap = false;
        };
       
        this.csim = function() {
            for (var i = 0; i <= this.npar; i++) {
                switch (this.par[i]) {
                    case 0:  
                        this.attr  = CRTProto.ATTR_DEFAULT;
                        break;
                    case 1:  
                        this.attr  = (this.attr & CRTProto.ATTR_DIM)|CRTProto.ATTR_BRIGHT;
                        break;
                    case 2:  
                        this.attr  = (this.attr & CRTProto.ATTR_BRIGHT)|CRTProto.ATTR_DIM;
                        break;
                    case 4:
                        this.attr |= CRTProto.ATTR_UNDERLINE;
                        break;
                    case 5:  
                        this.attr |= CRTProto.ATTR_BLINK;
                        break;
                    case 7:
                        this.attr |= CRTProto.ATTR_REVERSE;
                        break;
                    case 10:
                        this.translate    = this.GMap[this.useGMap];
                        this.dispCtrl     = false;
                        this.toggleMeta   = false;
                        break;
                    case 11:
                        this.translate    = this.CodePage437Map;
                        this.dispCtrl     = true;
                        this.toggleMeta   = false;
                        break;
                    case 12:
                        this.translate    = this.CodePage437Map;
                        this.dispCtrl     = true;
                        this.toggleMeta   = true;
                        break;
                    case 21:
                    case 22: 
                        this.attr &= ~( CRTProto.ATTR_BRIGHT | CRTProto.ATTR_DIM );
                        break;
                    case 24: 
                        this.attr &= ~ CRTProto.ATTR_UNDERLINE;
                        break;
                    case 25: 
                        this.attr &= ~ CRTProto.ATTR_BLINK;
                        break;
                    case 27: 
                        this.attr &= ~ CRTProto.ATTR_REVERSE;
                        break;
                    case 38: 
                        this.attr  = (this.attr & ~(CRTProto.ATTR_DIM |CRTProto.ATTR_BRIGHT | 0x0F ) ) | CRTProto.ATTR_UNDERLINE;
                        break;
                    case 39: 
                        this.attr &= ~(CRTProto.ATTR_DIM |CRTProto.ATTR_BRIGHT |CRTProto.ATTR_UNDERLINE | 0x0F );
                        break;
                    case 49:
                        this.attr |= 0xF0;
                        break;
                    default:
                    if (this.par[i] >= 30 && this.par[i] <= 37) {
                        var fg = this.par[i] - 30;
                        this.attr = (this.attr & ~0x0F) | fg;
                    } else 
                    if (this.par[i] >= 40 && this.par[i] <= 47) {
                        var bg = this.par[i] - 40;
                        this.attr = (this.attr & ~0xF0) | (bg << 4);
                    }
                    break;
                }
            }
        };
        
        // Delete character(s) following cursor
        this.csiP = function(number) {
            if (number == 0)
                number = 1;
            if (number > this.terminalWidth - this.cursorX)
                number = this.terminalWidth - this.cursorX;
            this.scrollRegion(this.cursorX + number, this.cursorY, this.terminalWidth - this.cursorX - number, 1, -number, 0, this.attr);
            needWrap = false;
        };
        
        // Clear characters following cursor
        this.csiX = function(number) {
            if (number == 0)
                number++;
            if (number > this.terminalWidth - this.cursorX)
                number = this.terminalWidth - this.cursorX;
            this.clearRegion(this.cursorX, this.cursorY, number, 1, this.attr);
            needWrap = false;
        };
        
        // Ready and operational.
        this.statusReport = function() {
            this.respondString += '\u001B[0n';
        };
        
        // Reports cursor XY back to host
        this.cursorReport = function() {
            this.respondString += 
                '\u001B[' +
                (this.cursorY + (this.offsetMode ? this.top + 1 : 1)) +
                ';' +
                (this.cursorX + 1) +
                'R';
        };
        
        this.saveCursor = function() {
            this.savedX[this.currentScreen] = this.cursorX;
            this.savedY[this.currentScreen] = this.cursorY;
            this.savedAttr[this.currentScreen] = this.attr;
            this.savedUseGMap = this.useGMap;
            for (var i = 0; i < 4; i++) {
                this.savedGMap[i] = this.GMap[i];
            }
            this.savedValid[this.currentScreen] = true;
        };
        
        this.restoreCursor = function() {
            if (!this.savedValid[this.currentScreen])
                return;
            this.attr = this.savedAttr[this.currentScreen];
            this.useGMap = this.savedUseGMap;
            for (var i = 0; i < 4; i++) {
                this.GMap[i] = this.savedGMap[i];
            }
            this.translate = this.GMap[this.useGMap];
            this.needWrap  = false;
            this.gotoXY(this.savedX[this.currentScreen], this.savedY[this.currentScreen]);
        };
        
        // Setterm commands are not implemented
        this.settermCommand = function() {
        };
        
        this.scrollRegion = function(x, y, w, h, incX, incY, attr) {
            
            //console.log( 'scrollr: ', x, y, w, h, incX, incY, attr );
            
            if ( ( incX == 0 && incY == 0 ) ) return;
            
            if ( x < 0 ) {
                w += x;
                x = 0;
            } else if ( x >= cols ) return;
            
            if ( y < 0 ) {
                h += y;
                y = 0;
            } else if ( y >= lines ) return;
            
            if ( w <= 0 || h <= 0 ) return;
            
            var x1 = x + w - 1, y1 = y + h - 1;
            
            if ( x1 >= lines ) x1 = lines - 1;
            if ( y1 >= cols ) y1 = cols - 1;
            
            w = x1 - x + 1; 
            h = y1 - y + 1;

            //console.log( x, y, x1, y1, w, h );

            if ( w <= 0 || h <= 0 )
                return;
            
            var ch, ch1, col, line, cols = this.cols, lines = this.lines;
            
            attr = typeof attr == 'undefined' ? CRTProto.ATTR_DEFAULT : attr;
            
            if ( Math.abs( incX ) >= w ||
                 Math.abs( incY ) >= h
            ) {
                // fill all region
                for ( line = y; line <= y1; line++ ) {
                    for ( col = x; col <=x1; col++ ) {
                        ch = this.mem[ line ][ col ];
                        ch._attr = attr;
                        ch._chr  = '';
                    }
                }
                
                this.changed = true;
                return;
            }
            
            // shift on y 
            if ( incY < 0 ) {
            
                y += incY;
                if ( y < 0 ) y = 0;
            
                for ( var line = y, upto = y1 + incY; line <= upto; line++ ) {
                    for ( var col = x; col <= x1; col++ ) {
                        ch = this.mem[ line ][ col ];
                        ch1= this.mem[ line - incY][ col ];
                        ch._attr = ch1._attr;
                        ch._chr = ch1._chr;
                    }
                }
                // fill at end incY lines
                for ( var line=0, len = -incY; line<len; line++ ) {
                    for ( col = x; col <= x1; col++ ) {
                        ch = this.mem[ y1 - line ][ col ];
                        ch._attr = attr;
                        ch._chr = '';
                    }
                }
                this.changed = true;
            } else 
            if ( incY > 0 ) {
            
                y1 += incY;
                if ( y1 >= lines ) y1 = lines;
            
                for ( var line = y1; line >= y+incY; line-- ) {
                    for ( col=x; col<=x1; col++ ) {
                        ch = this.mem[ line ][ col ];
                        ch1 = this.mem[ line - incY ][ col ];
                        ch._attr = ch1._attr;
                        ch._chr = ch1._chr;
                    }
                }
                // fill at beginning incY lines
                for ( var line = 0; line < incY; line++ ) {
                    for ( col=x; col<=x1; col++ ) {
                        ch = this.mem[ line + y ][ col ];
                        ch._attr = attr;
                        ch._chr  = '';
                    }
                }
                this.changed = true;
            }
            // shift on x
            if ( incX < 0 ) {
            
                x += incX;
                if ( x < 0 ) x = 0;
            
                for ( var col = x, upto = x1 + incX; col <= upto; col++ ) {
                    for ( var line = y; line <= y1; line++ ) {
                        ch = this.mem[ line ][col];
                        ch1 = this.mem[ line ][ col - incX ];
                        ch._attr = ch1._attr;
                        ch._chr = ch1._chr;
                    }
                }
                //fill at end incX cols
                for ( var col=0, len = -incX; col<len; col++ ) {
                    for ( line = y; line <= y1; line++ ) {
                        ch = this.mem[ line ][ x1 - col ];
                        ch._attr = attr;
                        ch._chr = '';
                    }
                }
                this.changed = true;
            } else 
            if ( incX > 0 ) {
            
                x1 += incX;
                if ( x1 >= cols ) x1 = cols;
            
                for ( var col=x1; col >= x + incX; col-- ) {
                    for ( var line = y; line <=y1; line++ ) {
                        ch = this.mem[ line ][ col ];
                        ch1 = this.mem[ line ][ col - incX ];
                        ch._attr = ch1._attr;
                        ch._chr = ch1._chr;
                    }
                }
                // fill at beginning incX lines
                for ( var col=0; col < incX; col++ ) {
                    for ( var line=y; line<=y1; line++ ) {
                        ch = this.mem[ line ][ col ];
                        ch._attr = attr;
                        ch._chr = '';
                    }
                }
                this.changed = true;
            }
        };
        
        this.enableAlternateScreen = function(state) {
            // Don't do anything, if we are already on the desired screen
            if ((state ? 1 : 0) == this.currentScreen) {
                this.render();
                return;
            }
            
            if (state)
                this.saveCursor();

            // Display new screen, and initialize state (the resizer does that for us).
            this.currentScreen = state ? 1 : 0;

            this.render();

            // If we switched to the alternate screen, reset it completely. Otherwise,
            // restore the saved state.
            if (state) {
                this.gotoXY(0, 0);
                this.clearRegion(0, 0, this.terminalWidth, this.terminalHeight);
            } else {
                this.restoreCursor();
            }
        };
        
        this.putString = function(x, y, text, attr) {
        
            if (!attr) {
                attr = this.attr;
            }
            
            if ( !text.length ) {
                this.cursorX = x;
                this.cursorY = y;
                return;
            } else { 
                for ( var i=0,len=text.length; i<len; i++ ) {
                    if ( x + i >= this.cols )
                        break;
                    this.mem[ y ][ x + i ].chain( function() {
                        //console.log(x, y);
                        this.chr = text.charAt( i );
                        this.attr= attr;
                    } );
                }

                this.cursorX = x + text.length;
                this.cursorY = y;
            
            }
        };
        
        // BELL!!!
        this.beep = function() {
            this.isInverted = true;
            (function( term ){ setTimeout( function() { term.isInverted = false; }, 100 ); })( this );
        };
        
        this.renderString = function(s, showCursor) {
            if (this.printing) {
                this.sendToPrinter(s);
                if (showCursor)
                    this.showCursor();
                return;
            }

            if (showCursor)
                this.cursorNeedsShowing = true;
            
            this.putString(this.cursorX, this.cursorY, s, this.attr);
        };
        
        // The core function that's handling incoming characters
        // -- receives a string from host
        this.receive = function(s, hexed) {
            
            hexed = !!hexed;
            s = hexed ? s.unhex() : s;
            
            this.onCustomEvent( 'receive', s );
            
            this.cursorNeedsShowing = this.hideCursor();
            this.respondString = '';
            var lineBuf = '';
            for (var i = 0; i < s.length; i++) {
                var ch = s.charCodeAt(i);
                var isNormalCharacter = 
                    (  ch >= 32 && ch <= 127 
                    || ch >= 160 
                    || this.utfEnabled && ch >= 128 
                    ) && (  ch != 0x7F );
                
                if ( isNormalCharacter && this.isEsc == 0 /* TermProto.ESnormal */ ) {
                    if (ch < 256) {
                        ch = this.translate[ this.toggleMeta ? (ch | 0x80) : ch ];
                    }
                    if ((ch & 0xFF00) == 0xF000) {
                        ch = ch & 0xFF;
                    } else 
                    if (ch == 0xFEFF || (ch >= 0x200A && ch <= 0x200F)) {
                        continue;
                    }
                    if (!this.printing) {
                        if ( this.needWrap || this.insertMode ) {
                            if (lineBuf) {
                                this.renderString(lineBuf);
                                lineBuf = '';
                            }
                        }
                        if (this.needWrap) {
                            this.cr(); this.lf();
                        }
                        if (this.insertMode) {
                            this.scrollRegion(this.cursorX, this.cursorY, this.terminalWidth - this.cursorX - 1, 1, 1, 0, this.attr);
                        }
                    }
                    this.lastCharacter = String.fromCharCode(ch);
                    lineBuf += this.lastCharacter;
                    if (!this.printing &&
                        this.cursorX + lineBuf.length >= this.terminalWidth) {
                        this.needWrap     = this.autoWrapMode;
                    }
                } else {
                    if (lineBuf) {
                        this.renderString(lineBuf);
                        lineBuf           = '';
                    }
                    var expand = this.doControl(ch);
                    if (expand.length) {
                        var r = this.respondString;
                        this.respondString = r + this.vt100(expand);
                    }
                }
            }
            if (lineBuf) {
                this.renderString(lineBuf, this.cursorNeedsShowing);
            } else 
            if (this.cursorNeedsShowing) {
                this.showCursor();
            }
            
            if ( this.respondString )
                this.send( this.respondString );
            
            return this.respondString;
        };
        
        
        // core function -- sends a string to host
        //
        this.send = function( str, allreadyHexed ) {
            allreadyHexed = !!allreadyHexed;
            this.onCustomEvent( 'send', allreadyHexed ? str : str.toHex() );
        }
        
        this.clearRegion = function( x, y, w, h, attr ) {
            
            if ( w < 0 || h < 0 )
                return;
            
            this.mem.createRange( y, h ).each( function( line, lineIndex ) {
                line.createRange( x, w ).each( function( cell, cellIndex ) {
                    cell._chr = ' ';
                    cell._attr= attr;
                } )
            } );
        };
        
        /* =========== GRAPHICS MAPS ==================== */
        this.Latin1Map = [
            0x0000, 0x0001, 0x0002, 0x0003, 0x0004, 0x0005, 0x0006, 0x0007,
            0x0008, 0x0009, 0x000A, 0x000B, 0x000C, 0x000D, 0x000E, 0x000F,
            0x0010, 0x0011, 0x0012, 0x0013, 0x0014, 0x0015, 0x0016, 0x0017,
            0x0018, 0x0019, 0x001A, 0x001B, 0x001C, 0x001D, 0x001E, 0x001F,
            0x0020, 0x0021, 0x0022, 0x0023, 0x0024, 0x0025, 0x0026, 0x0027,
            0x0028, 0x0029, 0x002A, 0x002B, 0x002C, 0x002D, 0x002E, 0x002F,
            0x0030, 0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037,
            0x0038, 0x0039, 0x003A, 0x003B, 0x003C, 0x003D, 0x003E, 0x003F,
            0x0040, 0x0041, 0x0042, 0x0043, 0x0044, 0x0045, 0x0046, 0x0047,
            0x0048, 0x0049, 0x004A, 0x004B, 0x004C, 0x004D, 0x004E, 0x004F,
            0x0050, 0x0051, 0x0052, 0x0053, 0x0054, 0x0055, 0x0056, 0x0057,
            0x0058, 0x0059, 0x005A, 0x005B, 0x005C, 0x005D, 0x005E, 0x005F,
            0x0060, 0x0061, 0x0062, 0x0063, 0x0064, 0x0065, 0x0066, 0x0067,
            0x0068, 0x0069, 0x006A, 0x006B, 0x006C, 0x006D, 0x006E, 0x006F,
            0x0070, 0x0071, 0x0072, 0x0073, 0x0074, 0x0075, 0x0076, 0x0077,
            0x0078, 0x0079, 0x007A, 0x007B, 0x007C, 0x007D, 0x007E, 0x007F,
            0x0080, 0x0081, 0x0082, 0x0083, 0x0084, 0x0085, 0x0086, 0x0087,
            0x0088, 0x0089, 0x008A, 0x008B, 0x008C, 0x008D, 0x008E, 0x008F,
            0x0090, 0x0091, 0x0092, 0x0093, 0x0094, 0x0095, 0x0096, 0x0097,
            0x0098, 0x0099, 0x009A, 0x009B, 0x009C, 0x009D, 0x009E, 0x009F,
            0x00A0, 0x00A1, 0x00A2, 0x00A3, 0x00A4, 0x00A5, 0x00A6, 0x00A7,
            0x00A8, 0x00A9, 0x00AA, 0x00AB, 0x00AC, 0x00AD, 0x00AE, 0x00AF,
            0x00B0, 0x00B1, 0x00B2, 0x00B3, 0x00B4, 0x00B5, 0x00B6, 0x00B7,
            0x00B8, 0x00B9, 0x00BA, 0x00BB, 0x00BC, 0x00BD, 0x00BE, 0x00BF,
            0x00C0, 0x00C1, 0x00C2, 0x00C3, 0x00C4, 0x00C5, 0x00C6, 0x00C7,
            0x00C8, 0x00C9, 0x00CA, 0x00CB, 0x00CC, 0x00CD, 0x00CE, 0x00CF,
            0x00D0, 0x00D1, 0x00D2, 0x00D3, 0x00D4, 0x00D5, 0x00D6, 0x00D7,
            0x00D8, 0x00D9, 0x00DA, 0x00DB, 0x00DC, 0x00DD, 0x00DE, 0x00DF,
            0x00E0, 0x00E1, 0x00E2, 0x00E3, 0x00E4, 0x00E5, 0x00E6, 0x00E7,
            0x00E8, 0x00E9, 0x00EA, 0x00EB, 0x00EC, 0x00ED, 0x00EE, 0x00EF,
            0x00F0, 0x00F1, 0x00F2, 0x00F3, 0x00F4, 0x00F5, 0x00F6, 0x00F7,
            0x00F8, 0x00F9, 0x00FA, 0x00FB, 0x00FC, 0x00FD, 0x00FE, 0x00FF
        ];

        this.VT100GraphicsMap = [
            0x0000, 0x0001, 0x0002, 0x0003, 0x0004, 0x0005, 0x0006, 0x0007,
            0x0008, 0x0009, 0x000A, 0x000B, 0x000C, 0x000D, 0x000E, 0x000F,
            0x0010, 0x0011, 0x0012, 0x0013, 0x0014, 0x0015, 0x0016, 0x0017,
            0x0018, 0x0019, 0x001A, 0x001B, 0x001C, 0x001D, 0x001E, 0x001F,
            0x0020, 0x0021, 0x0022, 0x0023, 0x0024, 0x0025, 0x0026, 0x0027,
            0x0028, 0x0029, 0x002A, 0x2192, 0x2190, 0x2191, 0x2193, 0x002F,
            0x2588, 0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037,
            0x0038, 0x0039, 0x003A, 0x003B, 0x003C, 0x003D, 0x003E, 0x003F,
            0x0040, 0x0041, 0x0042, 0x0043, 0x0044, 0x0045, 0x0046, 0x0047,
            0x0048, 0x0049, 0x004A, 0x004B, 0x004C, 0x004D, 0x004E, 0x004F,
            0x0050, 0x0051, 0x0052, 0x0053, 0x0054, 0x0055, 0x0056, 0x0057,
            0x0058, 0x0059, 0x005A, 0x005B, 0x005C, 0x005D, 0x005E, 0x00A0,
            0x25C6, 0x2592, 0x2409, 0x240C, 0x240D, 0x240A, 0x00B0, 0x00B1,
            0x2591, 0x240B, 0x2518, 0x2510, 0x250C, 0x2514, 0x253C, 0xF800,
            0xF801, 0x2500, 0xF803, 0xF804, 0x251C, 0x2524, 0x2534, 0x252C,
            0x2502, 0x2264, 0x2265, 0x03C0, 0x2260, 0x00A3, 0x00B7, 0x007F,
            0x0080, 0x0081, 0x0082, 0x0083, 0x0084, 0x0085, 0x0086, 0x0087,
            0x0088, 0x0089, 0x008A, 0x008B, 0x008C, 0x008D, 0x008E, 0x008F,
            0x0090, 0x0091, 0x0092, 0x0093, 0x0094, 0x0095, 0x0096, 0x0097,
            0x0098, 0x0099, 0x009A, 0x009B, 0x009C, 0x009D, 0x009E, 0x009F,
            0x00A0, 0x00A1, 0x00A2, 0x00A3, 0x00A4, 0x00A5, 0x00A6, 0x00A7,
            0x00A8, 0x00A9, 0x00AA, 0x00AB, 0x00AC, 0x00AD, 0x00AE, 0x00AF,
            0x00B0, 0x00B1, 0x00B2, 0x00B3, 0x00B4, 0x00B5, 0x00B6, 0x00B7,
            0x00B8, 0x00B9, 0x00BA, 0x00BB, 0x00BC, 0x00BD, 0x00BE, 0x00BF,
            0x00C0, 0x00C1, 0x00C2, 0x00C3, 0x00C4, 0x00C5, 0x00C6, 0x00C7,
            0x00C8, 0x00C9, 0x00CA, 0x00CB, 0x00CC, 0x00CD, 0x00CE, 0x00CF,
            0x00D0, 0x00D1, 0x00D2, 0x00D3, 0x00D4, 0x00D5, 0x00D6, 0x00D7,
            0x00D8, 0x00D9, 0x00DA, 0x00DB, 0x00DC, 0x00DD, 0x00DE, 0x00DF,
            0x00E0, 0x00E1, 0x00E2, 0x00E3, 0x00E4, 0x00E5, 0x00E6, 0x00E7,
            0x00E8, 0x00E9, 0x00EA, 0x00EB, 0x00EC, 0x00ED, 0x00EE, 0x00EF,
            0x00F0, 0x00F1, 0x00F2, 0x00F3, 0x00F4, 0x00F5, 0x00F6, 0x00F7,
            0x00F8, 0x00F9, 0x00FA, 0x00FB, 0x00FC, 0x00FD, 0x00FE, 0x00FF
        ];

        this.CodePage437Map = [
            0x0000, 0x263A, 0x263B, 0x2665, 0x2666, 0x2663, 0x2660, 0x2022,
            0x25D8, 0x25CB, 0x25D9, 0x2642, 0x2640, 0x266A, 0x266B, 0x263C,
            0x25B6, 0x25C0, 0x2195, 0x203C, 0x00B6, 0x00A7, 0x25AC, 0x21A8,
            0x2191, 0x2193, 0x2192, 0x2190, 0x221F, 0x2194, 0x25B2, 0x25BC,
            0x0020, 0x0021, 0x0022, 0x0023, 0x0024, 0x0025, 0x0026, 0x0027,
            0x0028, 0x0029, 0x002A, 0x002B, 0x002C, 0x002D, 0x002E, 0x002F,
            0x0030, 0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037,
            0x0038, 0x0039, 0x003A, 0x003B, 0x003C, 0x003D, 0x003E, 0x003F,
            0x0040, 0x0041, 0x0042, 0x0043, 0x0044, 0x0045, 0x0046, 0x0047,
            0x0048, 0x0049, 0x004A, 0x004B, 0x004C, 0x004D, 0x004E, 0x004F,
            0x0050, 0x0051, 0x0052, 0x0053, 0x0054, 0x0055, 0x0056, 0x0057,
            0x0058, 0x0059, 0x005A, 0x005B, 0x005C, 0x005D, 0x005E, 0x005F,
            0x0060, 0x0061, 0x0062, 0x0063, 0x0064, 0x0065, 0x0066, 0x0067,
            0x0068, 0x0069, 0x006A, 0x006B, 0x006C, 0x006D, 0x006E, 0x006F,
            0x0070, 0x0071, 0x0072, 0x0073, 0x0074, 0x0075, 0x0076, 0x0077,
            0x0078, 0x0079, 0x007A, 0x007B, 0x007C, 0x007D, 0x007E, 0x2302,
            0x00C7, 0x00FC, 0x00E9, 0x00E2, 0x00E4, 0x00E0, 0x00E5, 0x00E7,
            0x00EA, 0x00EB, 0x00E8, 0x00EF, 0x00EE, 0x00EC, 0x00C4, 0x00C5,
            0x00C9, 0x00E6, 0x00C6, 0x00F4, 0x00F6, 0x00F2, 0x00FB, 0x00F9,
            0x00FF, 0x00D6, 0x00DC, 0x00A2, 0x00A3, 0x00A5, 0x20A7, 0x0192,
            0x00E1, 0x00ED, 0x00F3, 0x00FA, 0x00F1, 0x00D1, 0x00AA, 0x00BA,
            0x00BF, 0x2310, 0x00AC, 0x00BD, 0x00BC, 0x00A1, 0x00AB, 0x00BB,
            0x2591, 0x2592, 0x2593, 0x2502, 0x2524, 0x2561, 0x2562, 0x2556,
            0x2555, 0x2563, 0x2551, 0x2557, 0x255D, 0x255C, 0x255B, 0x2510,
            0x2514, 0x2534, 0x252C, 0x251C, 0x2500, 0x253C, 0x255E, 0x255F,
            0x255A, 0x2554, 0x2569, 0x2566, 0x2560, 0x2550, 0x256C, 0x2567,
            0x2568, 0x2564, 0x2565, 0x2559, 0x2558, 0x2552, 0x2553, 0x256B,
            0x256A, 0x2518, 0x250C, 0x2588, 0x2584, 0x258C, 0x2590, 0x2580,
            0x03B1, 0x00DF, 0x0393, 0x03C0, 0x03A3, 0x03C3, 0x00B5, 0x03C4,
            0x03A6, 0x0398, 0x03A9, 0x03B4, 0x221E, 0x03C6, 0x03B5, 0x2229,
            0x2261, 0x00B1, 0x2265, 0x2264, 0x2320, 0x2321, 0x00F7, 0x2248,
            0x00B0, 0x2219, 0x00B7, 0x221A, 0x207F, 0x00B2, 0x25A0, 0x00A0
        ];

        this.DirectToFontMap = [
            0xF000, 0xF001, 0xF002, 0xF003, 0xF004, 0xF005, 0xF006, 0xF007,
            0xF008, 0xF009, 0xF00A, 0xF00B, 0xF00C, 0xF00D, 0xF00E, 0xF00F,
            0xF010, 0xF011, 0xF012, 0xF013, 0xF014, 0xF015, 0xF016, 0xF017,
            0xF018, 0xF019, 0xF01A, 0xF01B, 0xF01C, 0xF01D, 0xF01E, 0xF01F,
            0xF020, 0xF021, 0xF022, 0xF023, 0xF024, 0xF025, 0xF026, 0xF027,
            0xF028, 0xF029, 0xF02A, 0xF02B, 0xF02C, 0xF02D, 0xF02E, 0xF02F,
            0xF030, 0xF031, 0xF032, 0xF033, 0xF034, 0xF035, 0xF036, 0xF037,
            0xF038, 0xF039, 0xF03A, 0xF03B, 0xF03C, 0xF03D, 0xF03E, 0xF03F,
            0xF040, 0xF041, 0xF042, 0xF043, 0xF044, 0xF045, 0xF046, 0xF047,
            0xF048, 0xF049, 0xF04A, 0xF04B, 0xF04C, 0xF04D, 0xF04E, 0xF04F,
            0xF050, 0xF051, 0xF052, 0xF053, 0xF054, 0xF055, 0xF056, 0xF057,
            0xF058, 0xF059, 0xF05A, 0xF05B, 0xF05C, 0xF05D, 0xF05E, 0xF05F,
            0xF060, 0xF061, 0xF062, 0xF063, 0xF064, 0xF065, 0xF066, 0xF067,
            0xF068, 0xF069, 0xF06A, 0xF06B, 0xF06C, 0xF06D, 0xF06E, 0xF06F,
            0xF070, 0xF071, 0xF072, 0xF073, 0xF074, 0xF075, 0xF076, 0xF077,
            0xF078, 0xF079, 0xF07A, 0xF07B, 0xF07C, 0xF07D, 0xF07E, 0xF07F,
            0xF080, 0xF081, 0xF082, 0xF083, 0xF084, 0xF085, 0xF086, 0xF087,
            0xF088, 0xF089, 0xF08A, 0xF08B, 0xF08C, 0xF08D, 0xF08E, 0xF08F,
            0xF090, 0xF091, 0xF092, 0xF093, 0xF094, 0xF095, 0xF096, 0xF097,
            0xF098, 0xF099, 0xF09A, 0xF09B, 0xF09C, 0xF09D, 0xF09E, 0xF09F,
            0xF0A0, 0xF0A1, 0xF0A2, 0xF0A3, 0xF0A4, 0xF0A5, 0xF0A6, 0xF0A7,
            0xF0A8, 0xF0A9, 0xF0AA, 0xF0AB, 0xF0AC, 0xF0AD, 0xF0AE, 0xF0AF,
            0xF0B0, 0xF0B1, 0xF0B2, 0xF0B3, 0xF0B4, 0xF0B5, 0xF0B6, 0xF0B7,
            0xF0B8, 0xF0B9, 0xF0BA, 0xF0BB, 0xF0BC, 0xF0BD, 0xF0BE, 0xF0BF,
            0xF0C0, 0xF0C1, 0xF0C2, 0xF0C3, 0xF0C4, 0xF0C5, 0xF0C6, 0xF0C7,
            0xF0C8, 0xF0C9, 0xF0CA, 0xF0CB, 0xF0CC, 0xF0CD, 0xF0CE, 0xF0CF,
            0xF0D0, 0xF0D1, 0xF0D2, 0xF0D3, 0xF0D4, 0xF0D5, 0xF0D6, 0xF0D7,
            0xF0D8, 0xF0D9, 0xF0DA, 0xF0DB, 0xF0DC, 0xF0DD, 0xF0DE, 0xF0DF,
            0xF0E0, 0xF0E1, 0xF0E2, 0xF0E3, 0xF0E4, 0xF0E5, 0xF0E6, 0xF0E7,
            0xF0E8, 0xF0E9, 0xF0EA, 0xF0EB, 0xF0EC, 0xF0ED, 0xF0EE, 0xF0EF,
            0xF0F0, 0xF0F1, 0xF0F2, 0xF0F3, 0xF0F4, 0xF0F5, 0xF0F6, 0xF0F7,
            0xF0F8, 0xF0F9, 0xF0FA, 0xF0FB, 0xF0FC, 0xF0FD, 0xF0FE, 0xF0FF
        ];

        /* KEYBOARD IMPLEMENTATION */
        
        // Keyboard event handler
        this.addEventListener('keydown', function(e) {
            var arr = [];
            var charCode = e.keyCode || e.charCode;
            
            // If control || shift are pressed without combination ...
            if ( [ 16, 17, 18 ].indexOf( charCode ) >= 0 )
                return;

            var arr = [];

            if ( e.ctrlKey )
                arr.push( 'ctrl' );

            if ( e.altKey )
                arr.push( 'alt' );

            if ( e.shiftKey )
                arr.push( 'shift' );

            var outKey = null;

            for ( var key in Keyboard.keyBindings )
                if (Keyboard.keyBindings[key] === charCode) {
                    arr.push(key);
                    outKey = arr.join(' ');
                    break;
                }

            if ( outKey === null ) {
                console.log("Terminal: Unknown key code: ", charCode );
                return;
            }

            var matches;

            // If the shift key is present, remove the ctrl and alt keys modifiers
            if ( /([\s]|$)shift /.test( outKey ) )
                outKey = outKey.replace(/^(ctrl )?(alt )?([^*])$/, '$3');

            switch ( true ) {
                case ( matches = /^shift ([a-z])$/.exec( outKey ) ) ? true : false:
                    outKey = matches[1].toUpperCase();
                    break;
                case ( matches = /^shift ([\d\`\-\=\[\];\'\\\,\.\/])$/ /* ' mc bug */.exec( outKey ) ) ? true : false: 
                    outKey = ( {  //keyboard top keys: 1..0, `, -, =
                                "1": '!',"2": '@',"3": '#',"4": '$', "5": '%', "6": '^',"7": '&',"8": '*',"9": '(',"0": ')',"-": '_',"=": '+',"`": '~',
                                "[": '{', ']': '}',
                                ";": ':', "'": '"', '\\': "|",
                                ",": '<', ".": ">", "/": "?"
                             } )[ matches[1] ];
                    break;
                case ( matches = /^(shift )?num_([\S])$/.exec( outKey ) ) ? true:false:
                    outKey = matches[2];
                    break;
            }

            var humanReadableKey = outKey;
            //console.log(humanReadableKey );

            // allow paste
            if ( humanReadableKey == 'shift insert' ) {
                (function( vt100 ) {
                    setTimeout( function() {
                        vt100.send( clipData.toHex() );
                    }, 100);
                })( this );
                return;
            }
            
            // allow copy
            if ( humanReadableKey == 'ctrl insert' ) {
                return;
            }

            // we don't stop the propagation of the event if the pressed
            // key is the num-lock, as we're going to want different num-pad keys 
            // functionality
            if ( outKey != 'numlock') {
                e.preventDefault();
                e.stopPropagation();
            }

            outKey = outKey.replace( /(^)(up|down|left|right)$/, ('$2' + ( this.cursorKeyMode ? 1 : 0) ) );

            // key processing
            switch (true) {
                // simple key? a-z, 0-9, ^ # $ %, etc
                case outKey.length == 1:
                    outKey = ( outKey.charCodeAt( 0 ) ).toString( 16 );
                    if ( outKey.length < 2 )
                        outKey = '0' + outKey;
                    break

                case outKey == 'enter':
                case outKey == 'ctrl enter':
                case outKey == 'shift enter':
                    outKey = '0D';
                    break;
                // test if the outkey is defined into the terminal key 2 hex mappings:
                case typeof TermProto.KeyMappings[ outKey ] != 'undefined':
                    outKey = TermProto.KeyMappings[ outKey ];
                    break;
                default:
                    console.log( "'" + outKey + "' key not mapped" );
                    outKey = null;
                    break;
            }
            
            // push the key to stdin
            if ( outKey !== null ) {
                this.onCustomEvent( "VT100_Keyboard", outKey );
            }
        });
        
        /* This is the custom event listener that's listening for the
         * allready processed keys of the terminal 
         */
        this.addCustomEventListener( "VT100_Keyboard", function( vtKeyString ) {
            this.send( vtKeyString, true );
            return true;
        } );

        this.addCustomEventListener('resize', function() {
            this.bottom = this.lines;
        } );
        
        /* INITIALIZATION BLOCK */
        
        this.utfPreferred         = true; //ok
        this.autoprint            = false;
        this.blinkingCursor       = true;
        this.npar                 = 0;
        this.par                  = [ ];
        this.isQuestionMark       = false;
        this.savedX               = [ ];
        this.savedY               = [ ];
        this.savedAttr            = [ ];
        this.savedUseGMap         = 0;
        this.savedGMap            = [ this.Latin1Map, this.VT100GraphicsMap, this.CodePage437Map, this.DirectToFontMap ];
        this.savedValid           = [ ];
        this.respondString        = '';
        this.titleString          = '';
        this.blinkingCursor       = false;
        this.reset();
        
        /* User preferences initialization */
        var preferences = userStorage.getItem("VT101", {
            "font": "14px monospace",
            "charWidth": 11,
            "charHeight": 18
        });
        
        this.font = preferences.font;
        this.charWidth = preferences.charWidth;
        this.charHeight= preferences.charHeight;
        
        // Make item focuseable
        this.tabIndex = 0;

        (function( term ) {
            term.addEventListener('focus', function() {term.solidCursor = term.blinkingCursor = true; }, true);
            term.addEventListener('blur', function(){ term.solidCursor = term.blinkingCursor = false; }, true );
        })( this );

        (function(vt) {
            vt.handler = function( command ) {
                console.log( "VT100.command: ", command );
                switch ( command ) {
                    case 'cmd_copy':
                        vt.copycmd();
                        break;
                    case 'cmd_paste':
                        if ( clipData )
                            vt.send( clipData.toHex() );
                        vt.selection.start = vt.selection.stop = { "x": 0, "y": 0 };
                        break;
                    case 'cmd_reset':
                        vt.reset();
                        break;
                    case 'cmd_preferences':
                        new VT101Preferences( vt );
                        break;
                }
            };
        })( this );
        
        ( function( vt100 ) {
            Keyboard.bindKeyboardHandler( vt100, 'ctrl insert', vt100.copycmd = function() {
                var clipContent = vt100.selection.getText();
                
                if ( !clipContent )
                    return;
            
                var dlg = new Dialog({
                    "alwaysOnTop": true,
                    "appIcon": "",
                    "caption": "Copy",
                    "closeable": true,
                    "height": 193,
                    "maximizeable": false,
                    "maximized": false,
                    "minimizeable": false,
                    "modal": true,
                    "moveable": true,
                    "resizeable": true,
                    "scrollable": false,
                    "visible": true,
                    "width": 377,
                    "childOf": getOwnerWindow( this )
                });
            
                dlg.insert( (new DOMLabel("Because we cannot manipulate browser clipboard directly, please press again CTRL+C in this box:")).setAttr("style", "top: 10px; left: 10px; right: 10px; position: absolute; white-space: normal; height: 30px; text-align: justify") );
                
                dlg.clip = dlg.insert( new TextArea('') ).setAttr("style", "top: 50px; left: 10px; position: absolute; right: 10px; bottom: 10px");
                
                dlg.paint();
                
                dlg.clip.value = clipContent;
                dlg.clip.focus();
                dlg.clip.select();
            
                dlg.clip.oncopy = function(e) {
                    setTimeout( function() {
                        clipData = dlg.clip.value;
                        dlg.close();
                        dlg.purge();
                        vt100.focus();
                    }, 100 );
                }
                
                Keyboard.bindKeyboardHandler( dlg, 'esc', function() {
                    dlg.close();
                    dlg.purge();
                } );
            
                dlg.closeCallback = function() {
                    vt100.focus();
                    return true;
                }
            
            });
            
            vt100.pastecmd = function() {
            
                var dlg = new Dialog({
                    "alwaysOnTop": true,
                    "appIcon": "",
                    "caption": "Paste",
                    "closeable": true,
                    "height": 193,
                    "maximizeable": false,
                    "maximized": false,
                    "minimizeable": false,
                    "modal": true,
                    "moveable": true,
                    "resizeable": true,
                    "scrollable": false,
                    "visible": true,
                    "width": 377,
                    "childOf": getOwnerWindow( this )
                });
            
                dlg.insert( (new DOMLabel("Because we cannot manipulate browser clipboard directly, please press again CTRL+V in this box:")).setAttr("style", "top: 10px; left: 10px; right: 10px; position: absolute; white-space: normal; height: 30px; text-align: justify") );
                
                dlg.clip = dlg.insert( new TextArea('') ).setAttr("style", "top: 50px; left: 10px; position: absolute; right: 10px; bottom: 10px");
                
                dlg.paint();
                
                dlg.clip.value = '';
                dlg.clip.focus();
                dlg.clip.select();
            
                dlg.clip.onpaste = function(e) {
                    setTimeout( function() {
                        clipData = dlg.clip.value;
                        dlg.close();
                        dlg.purge();
                        vt100.focus();
                        vt100.handler("cmd_paste");
                    }, 100 );
                }
                
                Keyboard.bindKeyboardHandler( dlg, 'esc', function() {
                    dlg.close();
                    dlg.purge();
                } );
            
                dlg.closeCallback = function() {
                    vt100.focus();
                    return true;
                }
            
            };
            
        })( this );
        
        
        // Add context menu
        this.addContextMenu([
                {
                    "caption": "Copy",
                    "id"  : "cmd_copy",
                    "handler": this.handler,
                    "shortcut": "Ctrl + Ins"
                },
                {
                    "caption": "Paste",
                    "handler": this.pastecmd,
                    "shortcut": "Shift + Ins"
                },
                null,
                {
                    "caption": "Reset",
                    "id"  : "cmd_reset",
                    "handler": this.handler
                },
                null,
                {
                    "caption": "Preferences",
                    "id"  : "cmd_preferences",
                    "handler": this.handler
                }
        ]);
        
        this.addCustomEventListener('clipboardData', function(str) {
            clipData = str.trim();
            return true;
        });
        
        this.addCustomEventListener('paste', function() {
            this.handler('cmd_paste');
            return true;
        });
        
        /* Expect feature */
        
        ( function( vt100 ) {
            vt100.expect = function( expectList, howLong, noneMatchedCallback ) {
                if ( !expectList instanceof Array )
                    throw "Bad expectation object!";
                
                var fullfilled = 0, unregistered = false;

                var funcParser = function( buffer ) {
                    //console.log("Receive: > " + buffer );
                    var lines = buffer.replace( /[\r\n]+/g, "\n" ).split("\n");

                    for ( var i=0,len=lines.length; i<len; i++ ) {
                        for ( var j=0,n=expectList.length; j<n; j++ ) {
                            if ( expectList[j].when.test( lines[i] ) && fullfilled == 0 ) {
                                fullfilled = 1;
                                try {
                                    expectList[j].then.call( vt100, lines[i] );
                                } catch (e) {
                                    console.log("Expect:: Exception: " + e );
                                }
                                unregister();
                                return;
                            }
                        }
                    }
                    
                };

                var register = function() {
                    console.log("Expect:: register");
                    vt100.addCustomEventListener( 'receive', funcParser );
                }
                
                var unregister = function() {
                    if (!unregistered) {
                        console.log("Expect:: unregister!");
                        vt100.removeCustomEventListener( 'receive', funcParser );
                        unregistered = true;
                    }
                }
                
                register();
                
                setTimeout( function() {
                    unregister();
                    if ( !fullfilled && noneMatchedCallback instanceof Function ) {
                        noneMatchedCallback.call( vt100 );
                    }
                }, howLong );
                
            }
        })( this );
    });
}