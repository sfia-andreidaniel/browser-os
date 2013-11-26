function DatePicker(ctl, dateFormat, initValue) {
    
    ctl = ctl || false;
    
    var holder = $('table', 'DomDatePicker').setAttr('border', '0').setAttr('cellpadding','0').setAttr('cellspacing','0'),
        dateFormat = dateFormat || '%Y-%m-%d',
        cellsDays = [];
        
        
    Object.defineProperty( holder, "isDate", {
        "get": function() {
            return /%(b|c|d|e|M|m|Y|y)/.test(dateFormat);
        }
    });
    
    Object.defineProperty( holder, "isTime", {
        "get": function() {
            return /%(k|H|i|S|s)/.test(dateFormat);
        }
    });
    
    EnableCustomEventListeners(holder);

    holder.DT = typeof initValue == 'undefined' 
        ? ( ( !ctl || !ctl.value ) 
              ? new Date() 
              : (new Date()).fromString(ctl.value, dateFormat)
          )
        : (new Date()).fromString(initValue, dateFormat);
    
    holder.DD = (new Date()).fromString( holder.DT.toString('%Y-%m-%d'), '%Y-%m-%d');
    
    var prevMonth = function(e) {
        cancelEvent(e);
        holder.DD.prevMonth();
        renderMonth();
    };
    
    var nextMonth = function(e) {
        cancelEvent(e);
        holder.DD.nextMonth();
        renderMonth();
    };
    
    var prevYear = function(e) {
        cancelEvent(e);
        holder.DD.prevYear();
        renderMonth();
    };
    
    var nextYear = function(e) {
        cancelEvent(e);
        holder.DD.nextYear();
        renderMonth();
    };
    
    if (holder.isDate) {
    
        if ( /%(M|m|c|b|Y|y)/.test(dateFormat) ) {
            var rowMonthYear  = holder.insertRow( holder.rows.length ).addClass('DatePickerRowMonthYear').chain(function(){
                this.style.whiteSpace = 'nowrap';
            });
            
            var cellPrevMonth = rowMonthYear.insertCell(0).addClass('DomPrevMonth').chain(function(){
                this.addEventListener('mousedown', prevMonth );
            });;
            
            var cellCurMonth  = 
                rowMonthYear.insertCell(1).chain( function() {
                        this.title = 'Scroll, or Scroll + Shift, or Click for navigation';
                        this.addEventListener('mousedown', function(e) {
                            cancelEvent(e);
                            displayYearOverlay();
                        });
                        this.setAttr('colspan', 3);
                    } );
            
            var cellNextMonth = rowMonthYear.insertCell(2).addClass('DomNextMonth').chain(function() {
                this.addEventListener('mousedown', nextMonth );
            });
            
            var cellPrevYear = rowMonthYear.insertCell(3).addClass('DomPrevYear').chain(function(){
                this.addEventListener('mousedown', prevYear);
            });
            
            var cellNextYear = rowMonthYear.insertCell(4).addClass('DomNextYear').chain(function(){
                this.addEventListener('mousedown', nextYear);
            });
        }
        
        if ( /%(d|e)/.test( dateFormat ) ) {

            var rowWeekDays = holder.insertRow(holder.rows.length).chain(function(){
                this.addEventListener('mousedown', function(e){
                    cancelEvent( e );
                });
            }).addClass('DatePickerRowWeekDays');
            
            
            for (var i=0; i<7; i++)
                rowWeekDays.insertCell(i).innerHTML = Date.prototype.ShortDayNames[i];
            
            var tmp, cell;
            
            for (var i=0; i<6; i++)
                holder
                    .insertRow(holder.rows.length)
                    .addClass('DomDatePickerRowWeeks')
                    .chain(function(){
                        for (var j=0; j<7; j++) {
                            this.insertCell(j)
                                .addClass('DomDayCell' + ( ( j == 0 || j == 6 ) ? ' DomDateCellWeekend' : '' ) )
                                .chain( function() {
                                    this.addEventListener('mousedown', function(e) {
                                        holder.DT.setDate(this.clickDay);
                                        holder.DT.setMonth(this.clickMonth);
                                        holder.DT.setFullYear(this.clickYear);
                                        holder.DD.fromString(holder.DT.toString('%Y-%m-%d'), '%Y-%m-%d');
                                        
                                        renderMonth();
                                        
                                        holder.onCustomEvent('change', holder);
                                        
                                        hide();
                                        cancelEvent(e);
                                    })
                                    cellsDays.push(this);
                                } )
                        }
                    });
        }
    }
    
    (function() {
        var yearOverlay = false;
        
        Object.defineProperty( holder, "yearOverlay", {
            "get": function() {
                return yearOverlay;
            },
            "set": function( boolVal ) {
                boolVal = !!boolVal;
                
                if (boolVal == !!yearOverlay)
                    return;
                
                switch (boolVal) {
                    case true:
                        
                        try {
                        
                            yearOverlay = holder.parentNode.appendChild(
                                $('div')
                                    .setAttr('style', 'display: block; position: absolute; border: 1px solid black; background-color: white; z-index: 1000000; overflow: hidden')
                                    .chain(function() {
                                        this.style.left = parseInt( holder.style.left ) + cellCurMonth.offsetLeft + 'px';
                                        this.style.top = parseInt( holder.style.top ) + cellCurMonth.offsetTop + cellCurMonth.offsetHeight + 'px';
                                    })
                            )
                            
                            var opts = ([]).chain(function(){
                                for (var i=1900; i<2050; i++)
                                    this.push({
                                        'id': i,
                                        'name': i
                                    });
                            });
                            
                            var picker = yearOverlay.appendChild( new DropDown( opts ) ).
                                setAttr(
                                    "style", "display: block; width: " + yearOverlay.style.width + "; height: " + yearOverlay.style.height + "; border: none; padding: none; margin: none"
                                ).setAttr(
                                    "multiple", "multiple"
                                ).chain(function() {
                                    this.addEventListener('change', function() {
                                        holder.DD.setFullYear( picker.value );
                                        renderMonth();
                                        holder.yearOverlay = false;
                                    });
                                    try { 
                                        this.value = holder.DD.getFullYear()+''; 
                                        if ( this.selectedIndex >= 0 )
                                            this.scrollTop = this.selectedIndex * 16 - ( ( this.offsetHeight / 2 ) >> 0 );
                                    } catch (e){ }
                                });
                            
                        } catch (e) {
                            yearOverlay = false;
                            return;
                        }
                        break;
                    
                    case false:
                        if ( yearOverlay && yearOverlay.parentNode )
                            yearOverlay.parentNode.removeChild( yearOverlay ).purge();
                        yearOverlay = false;
                        break;
                }
            }
        });
    })();
    
    var displayYearOverlay = function() {
        holder.yearOverlay = !!!holder.yearOverlay;
    }
    
    if (holder.isTime) {
    
        var tmArray = [];

        //hours
        if ( /%(k|H)/.test(dateFormat) )
            ( new Spinner( {
                'minValue': 0, 
                'maxValue': 23, 
                'step': 1, 
                'value': parseInt(holder.DT.unpad(holder.DT.toString('%k'))) 
            } ) ).chain( function() {
                this.addCustomEventListener( 'change', function() {
                    holder.DT.setHours( this.value );
                    holder.onCustomEvent('change', holder);
                } );
                this.role = '%k';
                tmArray.push( this );
            } );
            
        //minutes
        if ( /%i/.test( dateFormat ) )
             ( new Spinner({
                'minValue': 0, 
                'maxValue': 59, 
                'step': 1, 
                'value': parseInt(holder.DT.unpad(holder.DT.toString('%i'))) 
             } ) ).chain( function() {
                this.addCustomEventListener('change', function() {
                    holder.DT.setMinutes( this.value );
                    holder.onCustomEvent('change', holder);
                });
                this.role = '%i';
                tmArray.push( this );
             } );

        //seconds
        if ( /%(S|s)/.test( dateFormat ) ) {
            ( new Spinner({
                'minValue': 0, 
                'maxValue': 59, 
                'step': 1, 
                'value': parseInt(holder.DT.unpad(holder.DT.toString('%s'))) 
            })).chain( function() {
                this.addCustomEventListener('change', function() {
                    holder.DT.setSeconds(this.value);
                    holder.onCustomEvent('change', holder);
                });
                this.role = '%s';
                tmArray.push( this );
            });
        }
        
        if (tmArray.length) {
            holder.insertRow( holder.rows.length ).addClass('DomTimeRow').chain( function(){
                for (var i=0,len = tmArray.length; i<len; i++)
                   this.insertCell(i).setAttr('colspan', '2').appendChild( tmArray[i] );
                   
                if ( holder.isDate )
                    this.insertCell( tmArray.length ).setAttr('colspan', (7 - tmArray.length) + '' );
                
            });
        }
    }
    
    var renderTime = function() {
        if ( holder.isTime) {
            try {
                for (var i=0, len=tmArray.length; i<len; i++ )
                    tmArray[i].value = parseInt( holder.DD.unpad( holder.DD.toString( tmArray[i].role ) ) );
            } catch(ex) { }
        }
    };
    
    holder.insertRow(holder.rows.length).chain( function() {
        this.addClass('DatePickerRowReset').insertCell(0)
            .setHTML('Now')
            .setAttr('colspan', '7')
            
            .addEventListener( 'mousedown', function(e){
                holder.DT.resetDate();
                holder.DD.resetDate();

                if (holder.isDate) 
                    renderMonth();

                if (holder.isTime) 
                    renderTime();
        
                holder.onCustomEvent('change', holder);
                cancelEvent(e);
            });
    });

    var renderMonth = function() {
        var yr = holder.DD.toString('%Y');
        var mo = holder.DD.toString('%b');
        
        if (cellCurMonth) 
            cellCurMonth.innerHTML = mo.concat(' ').concat(yr).concat(' ▼');
        
        var aDt = ( new Date() )
            .fromString( holder.DD.toString('%Y-%m-01'), '%Y-%m-%d' );
        
        var cMonth = aDt.getMonth();
        var cYear  = aDt.getFullYear();
        
        if (aDt.getDay() != 0) {
             while (aDt.getDay() != 0) aDt.yesterday();
        } else {
            for (var i=0; i<7; i++)
                aDt.yesterday();
        }
        
        var cDT = new Date();
        cDT = { 'day': cDT.getDate(), 'month': cDT.getMonth(), 'year': cDT.getFullYear() };
        
        for (var i=0, len=cellsDays.length; i<len; i++) {
            cellsDays[i].innerHTML = aDt.getDate();
            cellsDays[i].clickDay = aDt.getDate();
            cellsDays[i].clickMonth = aDt.getMonth();
            cellsDays[i].clickYear = aDt.getFullYear();
            
            ( ( aDt.getMonth() == cMonth && aDt.getFullYear() == cYear) ? removeStyle : addStyle)( cellsDays[i], 'other');
            
            cellsDays[i].flipMonth = !(aDt.getMonth() == cMonth && aDt.getFullYear() == cYear);
            
            ( ( aDt.getMonth() == holder.DT.getMonth() &&
             aDt.getDate() == holder.DT.getDate() &&
             aDt.getFullYear() == holder.DT.getFullYear()
             ) ? addStyle : removeStyle)( cellsDays[i], 'this');
            
            ((aDt.getDate() == cDT.day &&
              aDt.getMonth() == cDT.month &&
              aDt.getFullYear() == cDT.year)
             ? addStyle : removeStyle)( cellsDays[i], 'today');
            
            aDt.tomorrow();
        }
    };
    
    if (holder.isDate) renderMonth();
    
    if (ctl)
        holder.addCustomEventListener('change', function() {
            ctl.value = holder.DT.toString( dateFormat );
            try { ctl.onCustomEvent('change', ctl.value); } catch(ex) {}
        });
    
    var bodyClickListener = function(e) {
        var targ = e.target || e.srcElement;
        if (!targ) return;
        
        while (targ != document.body) {
            if (targ == holder || targ == ctl || targ == holder.yearOverlay)
                return;
            targ = targ.parentNode;
        }
        hide();
    };
    
    holder.tabIndex = 0;
    
    var focusThreadFunc = function() {
        if ( ctl == document.activeElement || holder == document.activeElement ) return;
        
        //IE Fix: check if document.activeElement is childOf holder...
        var ael = document.activeElement;
        while (ael) {
            if (ael == holder) return;
            ael = ael.parentNode;
        }
        
        if ( tmArray ) {
            for (var i=0, len=tmArray.length; i<len; i++) {
                if (document.activeElement == tmArray[i].ctl) return;
            }
        }
        
        hide();
    };
    
    var show = function() {
        if (ctl) {
            
            if (ctl.value == '') 
                ctl.value = (new Date()).toString( dateFormat );
            
            try {
                holder.DT.fromString( ctl.value, dateFormat);
                holder.DD.fromString( ctl.value, dateFormat);
                renderMonth();
            } catch(ex) {
                holder.DT.resetDate();
                holder.DD.resetDate();
            }
            
            renderTime();
            
            if (holder.parentNode != document.body) {

                holder.style.position = 'absolute';
                document.body.appendChild(holder);
                
                document.body.addEventListener('mousedown', bodyClickListener, true);
                window.addEventListener('keyup', focusThreadFunc, true);
            }
            
            var pinner = new Pinner(ctl, holder);
            pinner.setPinMode('bottom-left');
            
            if (holder.offsetTop + holder.offsetHeight > getMaxY())
                pinner.setPinMode('top-left');
        }
    };
    
    var hide = function() {
        if (ctl) {
            if (holder.parentNode)
                holder.parentNode.removeChild(holder);
                
            document.body.removeEventListener('mousedown', bodyClickListener, true);
            window.removeEventListener('keyup', focusThreadFunc, true);
            
            try {
                holder.yearOverlay = false;
            } catch (e) {}
        }
    };
    
    var scrollFunction = function(e) {
        e = e || window.event;
        switch (true) {
            case typeof window.opera != 'undefined': //Presto
                var lines = e.wheelDelta / 40; //Opera has 2 lines / scroll
                break;
            case typeof e.wheelDelta != 'undefined': //Webkit
                var lines = e.wheelDelta / 40; //Chrome has 3 lines / scroll
                break;
            case typeof e.detail != 'undefined': //Gecko
                var lines = - e.detail / 3;
                break;
            default: 
                var lines = 0;
                break;
        }
        //force the num of lines to be eq with 1
        lines = lines < 0 ? -1 : 1;
        
        if (lines < 0) {
            if (!e.shiftKey) nextMonth(); else nextYear();
        } else {
            if (!e.shiftKey) prevMonth(); else prevYear();
        }
    };
    
    if (holder.isDate) {
        rowMonthYear.addEventListener('mousewheel', scrollFunction, true);
        rowMonthYear.addEventListener('DOMMouseScroll', scrollFunction, true);
    }
    
    
    if (ctl) {
        ctl.addEventListener('click', function(e) { 
            if ( typeof ctl.editable != 'undefined' && !ctl.editable ) {
                cancelEvent(e);
                return;
            }
            show(e); 
        }, true);
        
        ctl.addEventListener('focus', function(e) {
            if ( typeof ctl.editable != 'undefined' && !ctl.editable ) {
                cancelEvent(e);
                return;
            }
            show(e)
        }, true);
    }
    
    holder.addCustomEventListener('render-date', function(){
        renderDate();
    });
    
    holder.addCustomEventListener('render-time', function(){
        renderTime();
    });
    
    return holder;
}