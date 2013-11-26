Number.prototype.between = function( a, b ) {
    return a <= this && b >= this ||
           b <= this && a >= this;
}


Object.defineProperty( Number.prototype, "toSize", {
    "get": function() {
        return function( bitsNotBytes ) {
            var sizes = ['', ' Kb', ' Mb', ' Gb', ' Tb', ' Pb' ];
            var unit  = 0, remain = Math.abs( this * 1 );
            
            if ( bitsNotBytes )
                remain *= 8;
            
            while ( remain >= 1024 && unit<5 )
                remain /= 1024, unit++;
            return (this < 0 ? '-' : '' ) + remain.toFixed(2).replace('.00', '' ) + sizes[ unit ];
        }
    }
} );

Object.defineProperty( Number.prototype, "toTime", {
    "get": function() {
        return function( intl ) {

            intl = intl || {};

            intl.second = intl.second || [ 's',     's' ];
            intl.minute = intl.minute || [ 'm',     'm' ];
            intl.hour   = intl.hour   || [ ' hour', ' hrs'];
            intl.day    = intl.day    || [ ' day',  ' days' ];
            intl.month  = intl.month  || [ ' month',' months' ];
            intl.year   = intl.year   || [ ' year', ' years' ];

            intl.past   = intl.past || '%time% ago';
            intl.future = intl.future || 'in %time%';

            var units    = [ intl.second, intl.minute, intl.hour, intl.day, intl.month, intl.year ],
                divisors = [1,   60,  3600, 86400, 2635200, 31622400 ],
                remain = Math.abs( this * 1 ),
                divisorIndex = 1,
                stack = [],
                tries = 0,
                floatVal = 0,
                current;

            while ( remain >= 1 && tries < 5 ) {
                divisorIndex = 1;

                remain = Math.round( remain );

                while ( ( remain / divisors[ divisorIndex ] ) >= 1 && divisorIndex < 5 )
                    divisorIndex ++;

                floatVal = remain / divisors[ divisorIndex - 1 ];
                stack.push( ( current = Math.floor( floatVal ) ) + units[ divisorIndex - 1][ current == 1 ? 0 : 1 ] );
                remain =  ( ( ( floatVal - Math.floor( floatVal ) ) * divisors[ divisorIndex - 1 ] ) );

                tries++;

            }

            var time = stack.join(' ');

            return this < 0 ? intl.past.replace('%time%', time ) : intl.future.replace( '%time%', time );
        };
    }
} );