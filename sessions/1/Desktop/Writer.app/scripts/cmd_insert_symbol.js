function DocumentEditor_cmd_insert_symbol( app ) {
    
    app.handlers.cmd_insert_symbol = function() {

        var ed = app.activeDocument;

        if ( !ed )
            return;
        else
            ed = ed.editor;

        var $namespace = {};
    
        var $export = function(objectID, objectData) {
            $namespace[objectID] = objectData;
            return objectData;
        };
        var $import = function(objectID) {
            return $namespace[objectID] || (function() {
                throw "Namespace " + objectID + " is not defined (yet?)";
            })();
        };
        var $pid = getUID();
    
        var dlg = $export("0001-dlg", (new Dialog({
            "alwaysOnTop": false,
            "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODVCNUQzNjg1RDdFMTExOUIzNEIzOEVDOTExMDgyNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxNDJGODVBREVEMzcxMUUxQkRBMjk1NEFDQjRCN0Y0RiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNDJGODVBQ0VEMzcxMUUxQkRBMjk1NEFDQjRCN0Y0RiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA4NUI1RDM2ODVEN0UxMTE5QjM0QjM4RUM5MTEwODI1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA4NUI1RDM2ODVEN0UxMTE5QjM0QjM4RUM5MTEwODI1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+EQvFEAAAAPxJREFUeNpiTEtLYyAXzJw5k4GJgUKAzQAVIJ4AxGeA+A8Ug9iToXJ4DfAD4ktA7AHENUAsAMUgtitUzg9ZAwsSWxeIlwLxUyA2AeIvSHI7oGKXoGqsgPgyugu6gJgHiMvQNMMASKwYqqYLmxcsofRuPGEGk7PBF4hseAyAyf3FZgDMdA88BniguxLZgEog/g71nzQWzdJQue9QtRgG3AFiZyBmBuLDQGyMJGcMFWOGqrmDKwyOA7EqEB8B4igk8XComCpUDdaE1IsUXa3QdAEDBlCxL2hqUQwoAuL/UHwDqgnZgBtI8kXYUiIjntAXwyXB+P//f4pyI0CAAQA6jzYeGS1RgQAAAABJRU5ErkJggg==",
            "caption": "Insert special symbol",
            "closeable": true,
            "height": 324,
            "maximizeable": true,
            "maximized": false,
            "minHeight": 50,
            "minWidth": 50,
            "minimizeable": true,
            "modal": false,
            "moveable": true,
            "resizeable": true,
            "scrollable": false,
            "visible": true,
            "width": 408,
            "childOf": app
        })).chain(function() {
            Object.defineProperty(this, "pid", {
                "get": function() {
                    return $pid;
                }
            });
            this.addClass("PID-" + $pid);
        }));
    
        var charsHolder = $export("0001-holder", (new DOMPlaceable({
            "caption": "Symbols list",
            "appearence": "opaque"
        })).setAttr("style", "top: 30px; left: 10px; right: 105px; position: absolute").setAnchors({
            "height": function(w, h) {
                return h - 75 + "px";
            }
        }));
    
        var previewHolder = $export("0002-holder", (new DOMPlaceable({
            "caption": "Preview",
            "appearence": "opaque"
        })).setAttr("style", "top: 30px; right: 10px; position: absolute; height: 70px; width: 83px"));
    
        $export("0001-btn", (new Button("Cancel", (function() {
            dlg.close(); dlg.purge();
        }))).setAttr("style", "bottom: 10px; right: 10px; position: absolute"));
    
        $export("0002-btn", (new Button("Ok", (function() {
            dlg.close(); dlg.purge();
        }))).setAttr("style", "bottom: 10px; right: 70px; position: absolute"));
    
        Keyboard.bindKeyboardHandler( dlg, 'enter', function() {
            dlg.close(); dlg.purge(); ed.focus();
        } );

        Keyboard.bindKeyboardHandler( dlg, 'esc', function() {
            dlg.close(); dlg.purge(); ed.focus();
        } );
    
        $export("0001-css", (new JSIde_ApplicationCSS(
                "span.preview { text-align: center; }" + 
                "div.character { color: white; text-align: center; width: 32px; height: 32px; border: 2px solid transparent; font-size: 14px; vertical-align: center; display: inline-block; cursor: pointer; overflow: hidden; padding-top: 5px; }" +
                "div.character:hover { border-color: white }"
            )).toString("PID-" + $pid).chain(function() {
            dlg.addCss(this);
        }));
    
        $import("0001-dlg").insert($import("0001-holder"));
        $import("0001-dlg").insert($import("0002-holder"));
        $import("0001-dlg").insert($import("0001-btn"));
        $import("0001-dlg").insert($import("0002-btn"));
    
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);
    
        
        /* Initialize dialog */

        var charmap = [
        ['160', 'no-break space'],
        ['38', 'ampersand'],
        ['34', 'quotation mark'],
        // finance
        ['162', 'cent sign'],
        ['8364', 'euro sign'],
        ['163', 'pound sign'],
        ['165', 'yen sign'],
        // signs
        ['169', 'copyright sign'],
        ['174', 'registered sign'],
        ['8482', 'trade mark sign'],
        ['8240', 'per mille sign'],
        ['181', 'micro sign'],
        ['183', 'middle dot'],
        ['8226', 'bullet'],
        ['8230', 'three dot leader'],
        ['8242', 'minutes / feet'],
        ['8243', 'seconds / inches'],
        ['167', 'section sign'],
        ['182', 'paragraph sign'],
        ['223', 'sharp s / ess-zed'],
        // quotations
        ['8249', 'single left-pointing angle quotation mark'],
        ['8250', 'single right-pointing angle quotation mark'],
        ['171', 'left pointing guillemet'],
        ['187', 'right pointing guillemet'],
        ['8216', 'left single quotation mark'],
        ['8217', 'right single quotation mark'],
        ['8220', 'left double quotation mark'],
        ['8221', 'right double quotation mark'],
        ['8218', 'single low-9 quotation mark'],
        ['8222', 'double low-9 quotation mark'],
        ['60', 'less-than sign'],
        ['62', 'greater-than sign'],
        ['8804', 'less-than or equal to'],
        ['8805', 'greater-than or equal to'],
        ['8211', 'en dash'],
        ['8212', 'em dash'],
        ['175', 'macron'],
        ['8254', 'overline'],
        ['164', 'currency sign'],
        ['166', 'broken bar'],
        ['168', 'diaeresis'],
        ['161', 'inverted exclamation mark'],
        ['191', 'turned question mark'],
        ['710', 'circumflex accent'],
        ['732', 'small tilde'],
        ['176', 'degree sign'],
        ['8722', 'minus sign'],
        ['177', 'plus-minus sign'],
        ['247', 'division sign'],
        ['8260', 'fraction slash'],
        ['215', 'multiplication sign'],
        ['185', 'superscript one'],
        ['178', 'superscript two'],
        ['179', 'superscript three'],
        ['188', 'fraction one quarter'],
        ['189', 'fraction one half'],
        ['190', 'fraction three quarters'],
        // math / logical
        ['402', 'function / florin'],
        ['8747', 'integral'],
        ['8721', 'n-ary sumation'],
        ['8734', 'infinity'],
        ['8730', 'square root'],
        ['8764', 'similar to'],
        ['8773', 'approximately equal to'],
        ['8776', 'almost equal to'],
        ['8800', 'not equal to'],
        ['8801', 'identical to'],
        ['8712', 'element of'],
        ['8713', 'not an element of'],
        ['8715', 'contains as member'],
        ['8719', 'n-ary product'],
        ['8743', 'logical and'],
        ['8744', 'logical or'],
        ['172', 'not sign'],
        ['8745', 'intersection'],
        ['8746', 'union'],
        ['8706', 'partial differential'],
        ['8704', 'for all'],
        ['8707', 'there exists'],
        ['8709', 'diameter'],
        ['8711', 'backward difference'],
        ['8727', 'asterisk operator'],
        ['8733', 'proportional to'],
        ['8736', 'angle'],
        // undefined
        ['180', 'acute accent'],
        ['184', 'cedilla'],
        ['170', 'feminine ordinal indicator'],
        ['186', 'masculine ordinal indicator'],
        ['8224', 'dagger'],
        ['8225', 'double dagger'],
        // alphabetical special chars
        ['192', 'A - grave'],
        ['193', 'A - acute'],
        ['194', 'A - circumflex'],
        ['195', 'A - tilde'],
        ['196', 'A - diaeresis'],
        ['197', 'A - ring above'],
        ['198', 'ligature AE'],
        ['199', 'C - cedilla'],
        ['200', 'E - grave'],
        ['201', 'E - acute'],
        ['202', 'E - circumflex'],
        ['203', 'E - diaeresis'],
        ['204', 'I - grave'],
        ['205', 'I - acute'],
        ['206', 'I - circumflex'],
        ['207', 'I - diaeresis'],
        ['208', 'ETH'],
        ['209', 'N - tilde'],
        ['210', 'O - grave'],
        ['211', 'O - acute'],
        ['212', 'O - circumflex'],
        ['213', 'O - tilde'],
        ['214', 'O - diaeresis'],
        ['216', 'O - slash'],
        ['338', 'ligature OE'],
        ['352', 'S - caron'],
        ['217', 'U - grave'],
        ['218', 'U - acute'],
        ['219', 'U - circumflex'],
        ['220', 'U - diaeresis'],
        ['221', 'Y - acute'],
        ['376', 'Y - diaeresis'],
        ['222', 'THORN'],
        ['224', 'a - grave'],
        ['225', 'a - acute'],
        ['226', 'a - circumflex'],
        ['227', 'a - tilde'],
        ['228', 'a - diaeresis'],
        ['229', 'a - ring above'],
        ['230', 'ligature ae'],
        ['231', 'c - cedilla'],
        ['232', 'e - grave'],
        ['233', 'e - acute'],
        ['234', 'e - circumflex'],
        ['235', 'e - diaeresis'],
        ['236', 'i - grave'],
        ['237', 'i - acute'],
        ['238', 'i - circumflex'],
        ['239', 'i - diaeresis'],
        ['240', 'eth'],
        ['241', 'n - tilde'],
        ['242', 'o - grave'],
        ['243', 'o - acute'],
        ['244', 'o - circumflex'],
        ['245', 'o - tilde'],
        ['246', 'o - diaeresis'],
        ['248', 'o slash'],
        ['339', 'ligature oe'],
        ['353', 's - caron'],
        ['249', 'u - grave'],
        ['250', 'u - acute'],
        ['251', 'u - circumflex'],
        ['252', 'u - diaeresis'],
        ['253', 'y - acute'],
        ['254', 'thorn'],
        ['255', 'y - diaeresis'],
        ['913', 'Alpha'],
        ['914', 'Beta'],
        ['915', 'Gamma'],
        ['916', 'Delta'],
        ['917', 'Epsilon'],
        ['918', 'Zeta'],
        ['919', 'Eta'],
        ['920', 'Theta'],
        ['921', 'Iota'],
        ['922', 'Kappa'],
        ['923', 'Lambda'],
        ['924', 'Mu'],
        ['925', 'Nu'],
        ['926', 'Xi'],
        ['927', 'Omicron'],
        ['928', 'Pi'],
        ['929', 'Rho'],
        ['931', 'Sigma'],
        ['932', 'Tau'],
        ['933', 'Upsilon'],
        ['934', 'Phi'],
        ['935', 'Chi'],
        ['936', 'Psi'],
        ['937', 'Omega'],
        ['945', 'alpha'],
        ['946', 'beta'],
        ['947', 'gamma'],
        ['948', 'delta'],
        ['949', 'epsilon'],
        ['950', 'zeta'],
        ['951', 'eta'],
        ['952', 'theta'],
        ['953', 'iota'],
        ['954', 'kappa'],
        ['955', 'lambda'],
        ['956', 'mu'],
        ['957', 'nu'],
        ['958', 'xi'],
        ['959', 'omicron'],
        ['960', 'pi'],
        ['961', 'rho'],
        ['962', 'final sigma'],
        ['963', 'sigma'],
        ['964', 'tau'],
        ['965', 'upsilon'],
        ['966', 'phi'],
        ['967', 'chi'],
        ['968', 'psi'],
        ['969', 'omega'],
        // symbols
        ['8501', 'alef symbol'],
        ['982',  'pi symbol'],
        ['8476', 'real part symbol'],
        ['978',  'upsilon - hook symbol'],
        ['8472', 'Weierstrass p'],
        ['8465', 'imaginary part'],
        // arrows
        ['8592', 'leftwards arrow'],
        ['8593', 'upwards arrow'],
        ['8594', 'rightwards arrow'],
        ['8595', 'downwards arrow'],
        ['8596', 'left right arrow'],
        ['8629', 'carriage return'],
        ['8656', 'leftwards double arrow'],
        ['8657', 'upwards double arrow'],
        ['8658', 'rightwards double arrow'],
        ['8659', 'downwards double arrow'],
        ['8660', 'left right double arrow'],
        ['8756', 'therefore'],
        ['8834', 'subset of'],
        ['8835', 'superset of'],
        ['8836', 'not a subset of'],
        ['8838', 'subset of or equal to'],
        ['8839', 'superset of or equal to'],
        ['8853', 'circled plus'],
        ['8855', 'circled times'],
        ['8869', 'perpendicular'],
        ['8901', 'dot operator'],
        ['8968', 'left ceiling'],
        ['8969', 'right ceiling'],
        ['8970', 'left floor'],
        ['8971', 'right floor'],
        ['9001', 'left-pointing angle bracket'],
        ['9002', 'right-pointing angle bracket'],
        ['9674', 'lozenge'],
        ['9824', 'black spade suit'],
        ['9827', 'black club suit'],
        ['9829', 'black heart suit'],
        ['9830', 'black diamond suit'],
        ['8194', 'en space'],
        ['8195', 'em space'],
        ['8201', 'thin space'],
        ['8204', 'zero width non-joiner'],
        ['8205', 'zero width joiner'],
        ['8206', 'left-to-right mark'],
        ['8207', 'right-to-left mark'],
        ['173',  'soft hyphen']
        ];
        
        charsHolder.firstChild.style.overflowX = 'hidden';
        charsHolder.firstChild.style.overflowY = 'auto';
        
        for ( var i=0, len=charmap.length; i<len; i++ ) {
            ( function( chr ) {
            
                var dv = $('div', 'character');
                dv.title = chr[1];
                dv.appendChild( $text( String.fromCharCode( ~~chr[0] ) ) );
            
                dv.tabIndex = 0;
            
                disableSelection( dv );
            
                charsHolder.firstChild.appendChild( dv );
                
                dv.onmouseover = function() {
                    previewHolder.firstChild.innerHTML = '<span style="font-size: 32px; text-align: center; display: block; color: white;">' + dv.innerHTML + '</span>';
                }
                
                dv.onclick = function() {
                    ed.insertContent( dv.innerHTML );
                }
            
            })( charmap[i] );
        }

        return dlg;

    }
    
}