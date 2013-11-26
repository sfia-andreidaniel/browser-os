function CSSNodeEditor_init_position_tab( app, tabs, opts ) {
    
    var dlg = tabs.getTabById( 'position' ).getSheet();
    
    dlg.style.overflow = 'hidden';

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
    
    var attributes = app.nodeAttributes;
    
    if ( opts['float'] ) {

        $export("0001-holder", (new DOMPlaceable({
            "caption": "Float",
            "appearence": "opaque"
        })).setAttr("style", "top: 30px; left: 10px; right: 10px; position: absolute; height: 100px; zoom: .8"));

        var wrapLeft = $export("0001-img", (new DOMImage({
            "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABQCAIAAADKqIEEAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EGAcWFAFUC84AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAlklEQVRo3u3XwQmAMAwF0FZcUtzAgdxAHDPePAiehJDi+zdvnxhfbY+INlqmNmCUVlrpApkfz+ex1yy6rJv1SE93IipND+tBD6XpYT3oQQ960IMeJv1bPe4vOsEcelRYj+/vzqStR/4fCz3oQQ960MPNxaTdXDJDD3rQgx70oIdJ04Me9DBpetDDetBDaaWVVlpppd9yAZxQRM+n/g9IAAAAAElFTkSuQmCC",
            "displayMode": "best"
        })).setAttr("style", "top: 10px; left: 10px; width: 45px; height: 60px; position: absolute"));

        var wrapRight = $export("0002-img", (new DOMImage({
            "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABQCAIAAADKqIEEAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EGAcWLClWs1AAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAk0lEQVRo3u3YsQ2AMAwEwASxJGIDBsoGiDFNi+igiS2du1S8zOsQ6RHRqs3SCo7QQgudYNbn4TpHzpTbfqjHjOm+iELTQz3oITQ91IMe9KAHPehh0/T44cCnZ9EjQz1eb8Gm1WOWHupBD5umBz38udg0Pdx7qAc9hKaHetBDaHrQgx70oAc96GHTQgsttNBCVwx9AynKRM9UwSHfAAAAAElFTkSuQmCC",
            "displayMode": "best"
        })).setAttr("style", "top: 10px; left: 85px; width: 45px; height: 60px; position: absolute"));

        var wrapNone = $export("0003-img", (new DOMImage({
            "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABQCAIAAADKqIEEAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EGAcYEJi64lkAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAnUlEQVRo3u3XQQqAIBRFUY02Ge2gBbWDaJk2i2ggFGFa582cXb7PKz+mlEJr6UKDAQ0adAXpj4d1meukHMZJPd5I9COCZg/1YA/Q7KEe7MEe7MEe7GHSf7PH/pYv2eZkAPVorh4P3qBJgwYNGrTPpWRu7Ec2F5sLe3xjcykf9mAP9mAP9mAPk2YP9mAPk2YP9lAP9gANGjRo0KAz2QCCvkCtL3GPQAAAAABJRU5ErkJggg==",
            "displayMode": "best"
        })).setAttr("style", "top: 10px; left: 160px; width: 45px; height: 60px; position: absolute"));
        
        switch ( attributes['float'] ) {
            case 'left':
                wrapLeft.style.outline = '3px solid orange';
                break;
            case 'right':
                wrapRight.style.outline = '3px solid orange';
                break;
            default:
                wrapNone.style.outline = '3px solid orange';
                break;
        }
        
        wrapLeft.onclick = function() {
            attributes['float'] = 'left';
            if ( opts.align )
                attributes['align'] = '';
        }
        
        wrapRight.onclick = function() {
            attributes['float'] = 'right';
            if ( opts.align )
                attributes['align'] = '';
        }
        
        wrapNone.onclick = function() {
            attributes['float'] = '';
        }
        
        app.addCustomEventListener('attribute-changed', function( data ) {
            if ( data.which == 'float' ) {
                
                wrapLeft.style.outline =
                wrapRight.style.outline =
                wrapNone.style.outline = 'none';
                
                switch ( data.value ) {
                    case 'left':
                        wrapLeft.style.outline = '3px solid orange';
                        break;
                    case 'right':
                        wrapRight.style.outline = '3px solid orange';
                        break;
                    default:
                        wrapNone.style.outline = '3px solid orange';
                        break;
                }
            }
            
            return true;
        } );

        $export("0001-lbl", (new DOMLabel("Left")).setAttr("style", "top: 75px; left: 24px; width: 25px; position: absolute; text-overflow: ellipsis")).chain( function() {
            this.onclick = function() { wrapLeft.onclick(); };
        } );
        $export("0002-lbl", (new DOMLabel("Right")).setAttr("style", "top: 75px; left: 96px; width: 30px; position: absolute; text-overflow: ellipsis")).chain( function() {
            this.onclick = function() { wrapRight.onclick(); };
        } );
        $export("0004-lbl", (new DOMLabel("Normal")).setAttr("style", "top: 75px; left: 165px; width: 45px; position: absolute; text-overflow: ellipsis")).chain( function() {
            this.onclick = function() { wrapNone.onclick(); };
        } );

        dlg.insertTop( $import("0001-holder"), 20, 105 );
        
        $import("0001-holder").insert($import("0001-img"));
        $import("0001-holder").insert($import("0002-img"));
        $import("0001-holder").insert($import("0003-img"));
        $import("0001-holder").insert($import("0001-lbl"));
        $import("0001-holder").insert($import("0002-lbl"));
        $import("0001-holder").insert($import("0004-lbl"));
    
    }

    if ( opts.align ) {

        $export("0021-holder", (new DOMPlaceable({
            "caption": "Align",
            "appearence": "opaque"
        })).setAttr("style", "top: 30px; left: 10px; right: 10px; position: absolute; height: 100px; zoom: .8"));

        var alignLeft = $export("0021-img", (new DOMImage({
            "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABQCAIAAADKqIEEAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EGAcWFAFUC84AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAlklEQVRo3u3XwQmAMAwF0FZcUtzAgdxAHDPePAiehJDi+zdvnxhfbY+INlqmNmCUVlrpApkfz+ex1yy6rJv1SE93IipND+tBD6XpYT3oQQ960IMeJv1bPe4vOsEcelRYj+/vzqStR/4fCz3oQQ960MPNxaTdXDJDD3rQgx70oIdJ04Me9DBpetDDetBDaaWVVlpppd9yAZxQRM+n/g9IAAAAAElFTkSuQmCC",
            "displayMode": "best"
        })).setAttr("style", "top: 10px; left: 10px; width: 45px; height: 60px; position: absolute"));

        var alignRight = $export("0022-img", (new DOMImage({
            "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABQCAIAAADKqIEEAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EGAcWLClWs1AAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAk0lEQVRo3u3YsQ2AMAwEwASxJGIDBsoGiDFNi+igiS2du1S8zOsQ6RHRqs3SCo7QQgudYNbn4TpHzpTbfqjHjOm+iELTQz3oITQ91IMe9KAHPehh0/T44cCnZ9EjQz1eb8Gm1WOWHupBD5umBz38udg0Pdx7qAc9hKaHetBDaHrQgx70oAc96GHTQgsttNBCVwx9AynKRM9UwSHfAAAAAElFTkSuQmCC",
            "displayMode": "best"
        })).setAttr("style", "top: 10px; left: 85px; width: 45px; height: 60px; position: absolute"));

        var alignCenter = $export("0023-img", (new DOMImage({
            "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABQCAIAAADKqIEEAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EGAgEBoFFTWgAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAjklEQVRo3u3YsQmAMBBA0URcUtzAgdxAHPNsxS42yYV3nd0jHF+SGhEl2ywl4UBDQw8w6/vjvs4xldt+WI8eU/0RodXDeqgHtHpYD/VQD/VQD/Vw0tPU4980NefTAesBDQ0NDQ0NDQ3t5gLdenPx7mE91ANaPayHekCrh3qoh3qoh3qoh5OGhoaGhs6IfgApNjmLKDErUwAAAABJRU5ErkJggg==",
            "displayMode": "best"
        })).setAttr("style", "top: 10px; left: 160px; width: 45px; height: 60px; position: absolute"));
        
        var alignNone = $export("0024-img", (new DOMImage({
            "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABQCAIAAADKqIEEAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EGAcYEJi64lkAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAnUlEQVRo3u3XQQqAIBRFUY02Ge2gBbWDaJk2i2ggFGFa582cXb7PKz+mlEJr6UKDAQ0adAXpj4d1meukHMZJPd5I9COCZg/1YA/Q7KEe7MEe7MEe7GHSf7PH/pYv2eZkAPVorh4P3qBJgwYNGrTPpWRu7Ec2F5sLe3xjcykf9mAP9mAP9mAPk2YP9mAPk2YP9lAP9gANGjRo0KAz2QCCvkCtL3GPQAAAAABJRU5ErkJggg==",
            "displayMode": "best"
        })).setAttr("style", "top: 10px; left: 235px; width: 45px; height: 60px; position: absolute"));
        
        switch ( attributes['align'] ) {
            case 'left':
                alignLeft.style.outline = '3px solid orange';
                break;
            case 'right':
                alignRight.style.outline = '3px solid orange';
                break;
            case 'center':
                alignRight.style.outline = '3px solid orange';
                break;
            default:
                alignNone.style.outline = '3px solid orange';
                break;
        }
        
        alignLeft.onclick = function() {
            attributes['align'] = 'left';
            if ( opts['float'] )
                attributes['float'] = '';
        }
        
        alignRight.onclick = function() {
            attributes['align'] = 'right';
            if ( opts['float'] )
                attributes['float'] = '';
        }
        
        alignCenter.onclick = function() {
            attributes['align'] = 'center';
            if ( opts['float'] )
                attributes['float'] = '';
        }
        
        alignNone.onclick = function() {
            attributes['align'] = '';
        }
        
        app.addCustomEventListener('attribute-changed', function( data ) {
            if ( data.which == 'align' ) {
                
                alignLeft.style.outline =
                alignRight.style.outline =
                alignCenter.style.outline = 
                alignNone.style.outline = 'none';
                
                switch ( data.value ) {
                    case 'left':
                        alignLeft.style.outline = '3px solid orange';
                        break;
                    case 'right':
                        alignRight.style.outline = '3px solid orange';
                        break;
                    case 'center':
                        alignCenter.style.outline = '3px solid orange';
                        break;
                    default:
                        alignNone.style.outline = '3px solid orange';
                        break;
                }
            }
            
            return true;
        } );

        $export("0021-lbl", (new DOMLabel("Left")).setAttr("style", "top: 75px; left: 24px; width: 25px; position: absolute; text-overflow: ellipsis")).chain( function() {
            this.onclick = function() { alignLeft.onclick(); };
        } );
        $export("0022-lbl", (new DOMLabel("Right")).setAttr("style", "top: 75px; left: 96px; width: 30px; position: absolute; text-overflow: ellipsis")).chain( function() {
            this.onclick = function() { alignRight.onclick(); };
        } );
        $export("0024-lbl", (new DOMLabel("Center")).setAttr("style", "top: 75px; left: 165px; width: 45px; position: absolute; text-overflow: ellipsis")).chain( function() {
            this.onclick = function() { alignCenter.onclick(); };
        } );
        $export("0025-lbl", (new DOMLabel("Normal")).setAttr("style", "top: 75px; left: 239px; width: 45px; position: absolute; text-overflow: ellipsis")).chain( function() {
            this.onclick = function() { alignNone.onclick(); };
        } );

        dlg.insertTop( $import("0021-holder"), 20, 105 );
        
        $import("0021-holder").insert($import("0021-img"));
        $import("0021-holder").insert($import("0022-img"));
        $import("0021-holder").insert($import("0023-img"));
        $import("0021-holder").insert($import("0024-img"));
        $import("0021-holder").insert($import("0021-lbl"));
        $import("0021-holder").insert($import("0022-lbl"));
        $import("0021-holder").insert($import("0024-lbl"));
        $import("0021-holder").insert($import("0025-lbl"));
    
    }

    if ( opts.clear ) {

        $export("0031-holder", (new DOMPlaceable({
            "caption": "Clear",
            "appearence": "opaque"
        })).setAttr("style", "top: 30px; left: 10px; right: 10px; position: absolute; height: 100px; zoom: .8"));

        var clearLeft = $export("0031-img", (new DOMImage({
            "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABQCAIAAADKqIEEAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EGAsiIwvZpFIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA70lEQVRo3u2YUQ6DIBAFhfSSTW/ggbxB4zHph0lDAI0NbzdYh78ShWHzdqyGlNJ0tRGnCw6ggQZ6gPEofq/vZUzQ52smHu4j8EQEGnsQD+wBNPYgHtgDe2AP7IE9qPRt7ZF39HZvcyaf37tmb6ZeQVnpg723XXOCk8Tfe4trojVxvXfPGWTQnfX76QwyaG0GDtYxsYcqA811rKCNclxze9hD3otKe7j1YhTW2K0XZfbw7EXxfw+7XnSyh/YM+kw792Ic/JnStAdvLkDz3YN48N0DaOxBPLAH9sAe2AN7UGnsgT2wB5UGGmiggQb6n6E/9yO1fCBlpRUAAAAASUVORK5CYII=",
            "displayMode": "best"
        })).setAttr("style", "top: 10px; left: 10px; width: 45px; height: 60px; position: absolute"));

        var clearRight = $export("0032-img", (new DOMImage({
            "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABQCAIAAADKqIEEAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EGAsjALCl5GEAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA6klEQVRo3u2YQQqEMBAEdfGT4g98kD9YfGb24GVgdIPYoxOpHARDEiuhp0T7UkrXWvt0DTaggQY6QRvszfpdclKO00w8nmg9b0SgsQfxwB5AYw/igT2wB/bAHtiDk36TPcZp3q62x4856vEr/JmlsYd/3tbjx/h9WrLqLHE8rlCe2q0400GUdh09dASlXUcPHUHpq1AJHUSprcJ9eySvwro9ElbhYabjqlBvjxuqUG+PJqpw56TzV2HFHkH5DrRH5rcMXy5A89+DeGAPoLEH8cAe2AN7YA/swUljD+yBPThpoIEGGmig3wz9Az4CtXxg8vglAAAAAElFTkSuQmCC",
            "displayMode": "best"
        })).setAttr("style", "top: 10px; left: 85px; width: 45px; height: 60px; position: absolute"));

        var clearBoth = $export("0033-img", (new DOMImage({
            "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABQCAIAAADKqIEEAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EGAskEgxdA+4AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABCklEQVRo3u2YUQqDMBBEdeklxRt4IG9QPGb8KJRgkk1cU5vI249Cxe4O68wLdXTODb2VDB0WohGN6Abq5X/Z3mubKqd5wR7/qJETEdHQA3tAD0RDD+wBPaAH9IAe0INNP4ke07x8Pv0r4T1m5hx+WzhC2/RB8fdKeE9dnOkjwnFiaPFr3f6I6NbF1kJ/fCVVMiLlE4m2O9Xi4naVEalHKqlYlLe4qNsQIVFi20gKM57uIoV5eij+riXaECGxtahFD1uEpLsURjzdYArz9Cj3920pPEePG04Z2wipeFDZFBtG8M8F0bz3wB6890A09MAe0AN6QA/oAT3YNPSAHtCDTSMa0YhGNKKfLHoH9mKFfM5OtwcAAAAASUVORK5CYII=",
            "displayMode": "best"
        })).setAttr("style", "top: 10px; left: 160px; width: 45px; height: 60px; position: absolute"));
        
        var clearNone = $export("0034-img", (new DOMImage({
            "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABQCAIAAADKqIEEAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EGAcYEJi64lkAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAnUlEQVRo3u3XQQqAIBRFUY02Ge2gBbWDaJk2i2ggFGFa582cXb7PKz+mlEJr6UKDAQ0adAXpj4d1meukHMZJPd5I9COCZg/1YA/Q7KEe7MEe7MEe7GHSf7PH/pYv2eZkAPVorh4P3qBJgwYNGrTPpWRu7Ec2F5sLe3xjcykf9mAP9mAP9mAPk2YP9mAPk2YP9lAP9gANGjRo0KAz2QCCvkCtL3GPQAAAAABJRU5ErkJggg==",
            "displayMode": "best"
        })).setAttr("style", "top: 10px; left: 235px; width: 45px; height: 60px; position: absolute"));
        
        switch ( attributes['clear'] ) {
            case 'left':
                clearLeft.style.outline = '3px solid orange';
                break;
            case 'right':
                clearRight.style.outline = '3px solid orange';
                break;
            case 'both':
                clearBoth.style.outline = '3px solid orange';
                break;
            default:
                clearNone.style.outline = '3px solid orange';
                break;
        }
        
        clearLeft.onclick = function() {
            attributes['clear'] = 'left';
        }
        
        clearRight.onclick = function() {
            attributes['clear'] = 'right';
        }
        
        clearBoth.onclick = function() {
            attributes['clear'] = 'both';
        }
        
        clearNone.onclick = function() {
            attributes['clear'] = '';
        }
        
        app.addCustomEventListener('attribute-changed', function( data ) {
            if ( data.which == 'clear' ) {
                
                clearLeft.style.outline =
                clearRight.style.outline =
                clearBoth.style.outline = 
                clearNone.style.outline = 'none';
                
                switch ( data.value ) {
                    case 'left':
                        clearLeft.style.outline = '3px solid orange';
                        break;
                    case 'right':
                        clearRight.style.outline = '3px solid orange';
                        break;
                    case 'both':
                        clearBoth.style.outline = '3px solid orange';
                        break;
                    default:
                        clearNone.style.outline = '3px solid orange';
                        break;
                }
            }
            
            return true;
        } );

        $export("0031-lbl", (new DOMLabel("Left")).setAttr("style", "top: 75px; left: 24px; width: 25px; position: absolute; text-overflow: ellipsis")).chain( function() {
            this.onclick = function() { clearLeft.onclick(); };
        } );
        $export("0032-lbl", (new DOMLabel("Right")).setAttr("style", "top: 75px; left: 96px; width: 30px; position: absolute; text-overflow: ellipsis")).chain( function() {
            this.onclick = function() { clearRight.onclick(); };
        } );
        $export("0034-lbl", (new DOMLabel("Both")).setAttr("style", "top: 75px; left: 173px; width: 45px; position: absolute; text-overflow: ellipsis")).chain( function() {
            this.onclick = function() { clearBoth.onclick(); };
        } );
        $export("0035-lbl", (new DOMLabel("Normal")).setAttr("style", "top: 75px; left: 239px; width: 45px; position: absolute; text-overflow: ellipsis")).chain( function() {
            this.onclick = function() { clearNone.onclick(); };
        } );

        dlg.insertTop( $import("0031-holder"), 20, 135 );
        
        $import("0031-holder").insert($import("0031-img"));
        $import("0031-holder").insert($import("0032-img"));
        $import("0031-holder").insert($import("0033-img"));
        $import("0031-holder").insert($import("0034-img"));
        $import("0031-holder").insert($import("0031-lbl"));
        $import("0031-holder").insert($import("0032-lbl"));
        $import("0031-holder").insert($import("0034-lbl"));
        $import("0031-holder").insert($import("0035-lbl"));
    
    }

}