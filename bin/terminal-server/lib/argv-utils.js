var workers = 0;
var port    = 0;
var modules = [];
var docroot = null;
var https   = null;

var customArgs = {};

var tmp = null;

for ( var i=2,len=process.argv.length; i<len; i++ ) {
    switch ( process.argv[i] ) {
        case '-workers':
            if (!workers && process.argv[i+1]) {
                workers = parseInt( process.argv[i+1] );
                i++;
            }
            break;
        case '-port':
            if (!port && process.argv[i+1]) {
                port = parseInt( process.argv[i+1] );
                i++;
            }
            break;
        case '-module':
            if ( process.argv[i+1] ) {
                modules.push( process.argv[i+1] );
                i++;
            }
            break;
        case '-docroot':
            if ( process.argv[i+1] && docroot === null ) {
                docroot = process.argv[i+1];
                i++;
            }
            break;
        
        case '-secure':
            https = true;
            break;
        
        default:
        
            if ( tmp = /^\-([a-z_]([a-z\d_\-]+)?)$/i.exec( process.argv[i] ) ) {
                if ( typeof process.argv[i+1] != 'undefined' && [ 'workers', 'port', 'module', 'docroot' ].indexOf( tmp[1] ) == -1 ) {
                    customArgs[ tmp[1].replace(/\-/g, '_') ] = process.argv[ i + 1 ];
                    i++;
                }
            }
            
            break;
    }
}

exports.workers = workers || 1;
exports.port = port || 0;
exports.modules = modules;
exports.docroot = docroot;
exports.customArgs = customArgs;
exports.https = https;