var arg_utils = require(__dirname + '/../lib/argv-utils.js');

/* The listening port of the web-server */
exports.port = arg_utils.port || 8081;

/* The web-server document root */
exports.documentRoot = exports.docroot || './htdocs';

/* Enter ip address or class notation in format
   ip/mask where mask is of type [1..32] */
exports.allowFrom = [ '127.0.0.0/8', '188.0.0.0/8', '86.127.139.0/24' ];

/* The pid file name */
exports.pidFile = "/var/run/nitro-client.pid";

exports.workers = arg_utils.workers;

exports.modules = arg_utils.modules || [];

exports.rewrite = {
    
    // Crontab management
    "^\\/crontab\\/([\\da-f]{32})$" : "/crontab/index.js?do=show&job=${1}",
    "^\\/crontab\\/remove\\/([\\da-f]{32})$": "/crontab/index.js?do=remove&job=${1}"

};

/* Custom arguments passed from the command line parser ... */
exports.customArgs = arg_utils.customArgs || {};

exports.https = arg_utils.https;