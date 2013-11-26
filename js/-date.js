/* We'll extend the Date object */

window.DEFAULT_DATE_FORMAT = '%Y-%m-%d %H:%i:%s';

Date.prototype.diff = function( otherDate, interval ) {
    switch (interval.toLowerCase()) {
        case 'days':
        case 'day':
            return parseInt( (this.getTime() - otherDate.getTime()) / (24*3600*1000) );
            break;
        case 'weeks':
        case 'week':
            return parseInt( (this.getTime() - otherDate.getTime() ) / (24*3600*1000*7) );
            break;
        case 'months':
        case 'month':
            var d1Y = this.getFullYear();
            var d2Y = otherDate.getFullYear();
            var d1M = this.getMonth();
            var d2M = otherDate.getMonth();
            return (d2M+12*d2Y)-(d1M+12*d1Y);
            break;
        case 'years':
        case 'year':
            return parseInt( (this.getTime() - otherDate.getTime()) / (24*3600*1000 * 365.25) );
            break;
    }
}

Date.prototype.tomorrow = function() { 
    this.setMonth(this.getMonth(), this.getDate()+1); 
    return this; 
};

Date.prototype.yesterday= function() { 
    this.setMonth(this.getMonth(), this.getDate()-1); 
    return this; 
};

Date.prototype.nextMonth= function() { 
    this.setMonth(this.getMonth()+1, 1); 
    return this; 
};

Date.prototype.prevMonth= function() { 
    this.setMonth(this.getMonth()-1, 1); 
    return this; 
};

Date.prototype.nextYear = function() { 
    this.setFullYear(this.getFullYear()+1); 
    return this; 
};

Date.prototype.prevYear = function() { 
    this.setFullYear(this.getFullYear()-1); 
    return this; 
};

Date.prototype.ShortDayNames   = ['Su','Mo','Tu','We','Th','Fr','Sa'];
Date.prototype.LongDayNames    = ['Sunday', 'Monday', 'Tuesday', 'Wedensday', 'Thursday', 'Friday', 'Saturday'];
Date.prototype.ShortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
Date.prototype.LongMonthNames  = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octomber', 'November', 'December'];

Date.prototype.pad      = function(value, digits) {
    var s = value.toString();
    while (s.length < digits) s = '0' + s;
    return s;
};

Date.prototype.toString = function(format) {

    format = format || window.DEFAULT_DATE_FORMAT;

    var s = '';
    var i = 0;
    var c = '';
    var len = format.toString().length;
    var tmp;
    
    while (i<len) {
        c = format.charAt(i);
        switch (c) {
            case '%': {
                i++;
                if (i==len) return s;
                
                c = format.charAt(i);
                
                switch (c) {
                    case 'a': s = s.concat( this.ShortDayNames[this.getDay()] ); break;
                    case 'b': s = s.concat( this.ShortMonthNames[this.getMonth()] ); break;
                    case 'c': s = s.concat( this.getMonth()+1 ); break;
                    case 'd': s = s.concat( this.pad(this.getDate(), 2) ); break;
                    case 'e': s = s.concat( this.getDate() ); break;
                    case 'H': s = s.concat( this.pad(this.getHours(), 2) ); break;
                    case 'h': 
                    case 'I': tmp = this.getHours(); s = s.concat( tmp == 0 ? '12': ( tmp <= 12 ? this.pad(tmp, 2) : this.pad(tmp - 12, 2) ) ); break;
                    case 'i': s = s.concat( this.pad( this.getMinutes(), 2 ) ); break;
                    case 'k': s = s.concat( this.getHours() ); break;
                    case 'l': tmp = this.getHours(); s = s.concat( tmp == 0 ? '12': ( tmp <= 12 ? tmp : tmp - 12 ) ); break;
                    case 'M': s = s.concat( this.LongMonthNames[ this.getMonth() ] ); break;
                    case 'm': s = s.concat( this.pad( this.getMonth()+1, 2 ) ); break;
                    case 'p': tmp = this.getHours(); s = s.concat(tmp < 12 ? 'AM' : 'PM'); break;
                    case 'r': tmp = this.getHours(); 
                              s = s.concat( this.pad( tmp == 0 ? '12' : (tmp < 12 ? tmp : (tmp - 12)), 2 ), ':', 
                                            this.pad( this.getMinutes(), 2 ), ':', 
                                            this.pad( this.getSeconds(), 2 ),' ', this.getHours() < 12 ? 'AM':'PM' );
                              break;
                    case 's':
                    case 'S': s = s.concat( this.pad(this.getSeconds(), 2 ) ); break;
                    case 'T': s = s.concat(this.pad(this.getHours(), 2),':',this.pad(this.getMinutes(), 2),':',this.pad(this.getSeconds(),2));
                    case 'W': s = s.concat( this.LongDayNames[ this.getDay() ] ); break;
                    case 'w': s = s.concat( this.getDay() ); break;
                    case 'Y': s = s.concat( this.getFullYear() ); break;
                    case 'y': s = s.concat( this.getYear().toString().substr(2) ); break;
                    //TO UNIX TIMESTAMP
                    case 'U': s = s.concat( Math.floor(this.getTime() / 1000) ); break;
                    case '%': s = s.concat( '%' );
                    default: throw 'Date.prototype: the %'+c+' specifier is not supported!'; break;
                }
                
                break;
            }
            default:
                s = s.concat( c );
                break;
        }
        
        i++;
    }
    
    return s;
};

Date.prototype.unpad    = function(str) {
    if (str == '') return 0;
    var s = str.toString();
    var i = 0;
    while ((i < s.length) && (s.charAt(i) == '0')) i++;
    s = parseInt(s.substr(i));
    return !isNaN(s) ? s : 0;
};

Date.prototype.resetDate = function() {
    var d = new Date();
    this.setDate(d.getDate());
    this.setMonth(d.getMonth());
    this.setFullYear(d.getFullYear());
    this.setHours(d.getHours());
    this.setMinutes(d.getMinutes());
    this.setSeconds(d.getSeconds());
};

Date.prototype.getInt   = function(str, min_digits, max_digits, max_value) {
    var s = str.toString(); if (s.length < min_digits) throw 'Date.prototype: cannot parse string: not enough length'; var out = s.substr(0, min_digits); var i = min_digits; var digits = '0123456789'; var d;
    while (i < max_digits) { d = s.charAt(i); if (digits.indexOf(d) == -1) break; 
        if (parseInt(this.unpad(out.concat( d ))) <= max_value) out = out.concat( d );
        else return out;
        i++; }
    return out;
};

Date.prototype.getKey   = function(str, arr) {
    var i = 0; var s = str.toLowerCase(); var e;
    for (var i=0; i<arr.length; i++) {
        e = arr[i].toString().toLowerCase();
        if (s.substr(0, e.length) == e) return i;
    }
    throw 'Date.prototype: Unparseable string: key not found (str='+str+', arr=['+arr.join(',')+')!';
};

Date.prototype.fromString   = function(str, format) {
    this.resetDate();
    
    if (typeof str == 'undefined') return;
   
    var h = false; var m = false; var s = false;
    var Y = false; var M = false; var D = false;
    
    var AM = false;
    
    var st = str.toString();
    var f = format.toString();
    
    var spos = 0;
    
    for (var i=0; i<f.length; i++) {
//         console.log('['+spos+']: "'+st+'" => "'+st.substr(spos)+'", i='+i);
        st = st.substr(spos);
        
        if (f.charAt(i) == '%') {
            i++;
            if (i >= f.length) throw 'Date.prototype: unterminated date expression at position '+i+' in string '+f;
            
//             console.log('token: %'+f.charAt(i));
            
            switch(f.charAt(i)) {
                case 'a': spos += this.ShortDayNames[this.getKey(st, this.ShortDayNames)].length;
                          break;
                case 'b': //parse Jan .. Dec
                          M = this.getKey(st, this.ShortMonthNames);
                          spos = this.ShortMonthNames[M].length;
                          break;
                case 'c': M = this.getInt(st, 1, 2, 12);
                          spos = M.length;
                          M = this.unpad(M)-1;
                          break;
                case 'd': D = this.getInt(st, 2, 2, 31);
                          spos = D.length;
                          break;
                case 'e': D = this.getInt(st, 1, 2, 31);
                          spos = D.length;
                          break;
                case 'H': h = this.getInt(st, 2, 2, 23);
                          spos = h.length;
                          break;
                case 'h':
                case 'I': h = this.getInt(st, 2, 2, 12);
                          spos = h.length;
                          break;
                case 'i': m = this.getInt(st, 2, 2, 59);
                          spos = m.length;
                          break;
                case 'k': h = this.getInt(st, 1, 2, 23);
                          spos = h.length;
                          break;
                case 'l': h = this.getInt(st, 1, 2, 12);
                          spos = h.length;
                          break;
                case 'M': M = this.getKey(st, this.LongMonthNames);
                          spos = this.LongMonthNames[M].length;
                          break;
                case 'm': M = this.getInt(st, 2, 2, 12);
                          spos = M.length;
                          M = this.unpad(M) - 1;
                          break;
                case 'p': AM = this.getKey(st, ['AM','PM']);
                          spos = 2;
                          break;
                case 's':
                case 'S': s = this.getInt(st, 2, 2, 59);
                          spos = s.length;
                          break;
                case 'Y': Y = this.getInt(st, 4, 4, 2100);
                          spos = Y.length;
                          break;
                case 'U': var match = /^(\-)?([\d]+)/.exec(st);
                          if (match === null)
                            throw "Date.prototype: Could not parse %U modifier: invalid unix timestamp!";
                          this.setTime( parseInt( (match[1] || '') .concat( match[2] ) ) * 1000 );
                          return this;
                          break;
                
                default: throw 'Date.prototype: Unsupported token "%'+f.charAt(i)+'" while parsing date';
                
            }
            
        } else {
            spos = 1;
//             console.log('skipping: "'+f.charAt(i)+'"');
        }
    }
    
    D = (D === false ? false : this.unpad(D));
    M = (M === false ? false : this.unpad(M));
    Y = (Y === false ? false : this.unpad(Y));
    
    h = (h === false ? false : this.unpad(h));
    m = (m === false ? false : this.unpad(m));
    s = (s === false ? false : this.unpad(s));
    
    if (AM === 1) {
        if (h !== false) {
             h += 12;
             if (h > 23) throw 'Date.prototype: invalid hour : "'+h+'"';
        }
    }
    
    if (M !== false) this.setMonth(M);
    if (D !== false) this.setDate(D);
    if (Y !== false) this.setYear(Y);
    
    if (h !== false) this.setHours(h);
    if (m !== false) this.setMinutes(m);
    if (s !== false) this.setSeconds(s);
    
    return this;
};
