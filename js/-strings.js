String.prototype.isEmail = function() {
    return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this);
};

String.prototype.isInteger = function() {
    return /^(\+|-)?\d+$/.test(this);
};

String.prototype.isDecimal = function() {
    return /^(\+|-)?((\d+(\.\d+)?)|(\.\d+))$/.test(this);
};

String.prototype.isNotEmpty = function() {
    return /\S+/.test(this);
};

String.prototype.isEmpty = function() {
    return ! /\S+/.test(this);
};

String.prototype.isAlpha = function() {
    return /^[a-z]+$/i.test(this);
};

String.prototype.isAlphaNum = function() {
    return /^[a-z\d]+$/i.test(this);
};

String.prototype.lTrim = function(chars) {
    chars = chars || "\\s";
    return this.replace(new RegExp("^[" + chars + "]+", "g"), "");
};

String.prototype.rTrim = function(chars) {
    chars = chars || "\\s";
    return this.replace(new RegExp("[" + chars + "]+$", "g"), "");
};

String.prototype.trim = function(chars) {
    return this.lTrim(chars).rTrim(chars);
}

String.prototype.lPad = function(minLength, optionalChar) {
    var s = this.toString();
    optionalChar = optionalChar || ' ';
    while (s.length < minLength) s = optionalChar.charAt(0).concat(s);
    return s;
};

String.prototype.rPad = function(minLength, optionalChar) {
    var s = this.toString();
    optionalChar = optionalChar || ' ';
    while (s.length < minLength) s = s.concat(optionalChar.charAt(0));
    return s;
};

String.prototype.toHex = function() {
    var out = '', ch = '';
    for ( var i=0,len=this.length; i<len; i++ ) {
        ch = this.charCodeAt( i ).toString(16);
        if ( ch.length == 1 ) ch = '0' + ch;
        out += ch;
    }
    return out;
}

String.prototype.unhex = function() {
    var out = '', len = this.length - ( this.length % 2 );
    for ( var i=0; i<len; i+=2 ) {
        out += String.fromCharCode( parseInt( this.substr( i, 2 ), 16 ) );
    }
    return out;
}

window.addEventListener('load', function() {
    
    var _ruller = document.body.appendChild(
        document.createElement('span')
    );
    
    _ruller.style.visibility = 'hidden';
    _ruller.style.whiteSpace = 'pre';
    _ruller.style.display = 'block';
    _ruller.style['float'] = 'left';
    _ruller.style.zIndex = -1;
    _ruller.style.padding = '0px';
    _ruller.style.margin = '0px';
    _ruller.style.border = 'none';
    
    Object.defineProperty( window, 'ruller', {
        "get": function() {
            return _ruller;
        }
    });
    
}, true);

String.prototype.visualWidth = function(fontSize, fontFamily) {
    fontSize = fontSize || '1em';
    ruller.style.fontSize = fontSize;
    ruller.style.fontFamily = typeof fontFamily == 'undefined' ? 'arial' : fontFamily;
    
    try {
        ruller.innerHTML = '';
        ruller.appendChild($text(this));
        return ruller.offsetWidth;
    } catch(ex) {
        return null;
    }
};

String.prototype.visualHeight = function(fontSize, fontFamily) {
    fontSize = fontSize || '1em';
    ruller.style.fontSize = fontSize;
    ruller.style.fontFamily = typeof fontFamily == 'undefined' ? 'arial' : fontFamily;
    
    try {
        ruller.innerHTML = '';
        ruller.appendChild($text(this));
        return ruller.offsetHeight;
    } catch(ex) {
        return null;
    }
}

String.prototype.divide = function( numberOfChunks ) {
    var len = this.length;
    
    if ( len < numberOfChunks )
        return this.split('');
    
    var avg = ~~( len / numberOfChunks ),
        out = [];
    
    for ( var i=0; i<numberOfChunks; i++ ) {
        out.push( this.substr( ( i * avg ), avg ) );
    }
    
    return out;
}

String.prototype.ensureMaxWordLength = function( maxWordLength ) {
    
    if ( this.length <= maxWordLength )
        return this;
    
    var reg = new RegExp( '[\\S]{' + ( maxWordLength + 1 ) + ',' + this.length + '}' ),
        t   = this.valueOf(),
        m   = null;
    
    // console.log( reg );
    
    function optimalNumSplits( s, l ) {
        var n = 2,
            ln = s.length;
        
        while ( ln / ( n + 1 ) > l )
            n++;
        
        return ~~n;
    }
    
    while ( m = reg.exec( t ) ) {
        
        t = t.replace( m[0], m[0].divide( optimalNumSplits( m[0], maxWordLength ) ).join(' ') );
        
    }
    
    return t;
    
}

window['.htmlEntities'] = document.createElement('b');

(function() {
    
    String.prototype.htmlEntities = function() {
        window['.htmlEntities'].appendChild( $text(this) );
        var ret = window['.htmlEntities'].innerHTML;
        window['.htmlEntities'].innerHTML = '';
        return ret;
    };
})();

String.prototype.strcmp = function( other ) {
    return this == other ? 0 : ( this < other ? -1 : 1 );
}