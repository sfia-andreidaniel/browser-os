function ajaxAlert( str, caption ) {
    if (window.DialogBox) {
        str = str.split("\n");
        strMore = str.slice(1).join("\n");
        DialogBox(
            str[0] || "Server returned a NULL response", {
                "caption": caption || "Server Error",
                "type"   : "error",
                "details": (strMore || ""),
                "labelDetails": "See more details"
            }
        );
    } else alert( (caption ? caption + "\n" : "") +  str );
}

function displayLoading() {
    if (window.Notifier) {
        var icon = window.Notifier.getNotificationByName('AJAX');
        if (icon !== null) {
            icon.value = !icon.value ? 1 : icon.value + 1;
            icon.viewName = 'loading';
        }
    }
}

function stopLoading() {
    if (window.Notifier) {
        var icon = window.Notifier.getNotificationByName('AJAX');
        if (icon !== null) {
            icon.value = !icon.value ? 0 : icon.value - 1;
            if (icon.value < 0) icon.value = 0;
            if (icon.value == 0) icon.viewName = 'idle';
        }
    }
}

//crossbrowser instance of XMLHttpRequest
function XMLHttp() {

    if (window.ActiveXObject) {

    try { result = new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) { try { result = new ActiveXObject("Microsoft.XMLHTTP"); } catch (err) { result = null; } }
       
    } else result = null;
    if(!result && typeof XMLHttpRequest != "undefined") result = new XMLHttpRequest();
    if (!result) return null; else return result;
}

function urlencode(something) {
    return encodeURIComponent(something);
}

function __uniqueUrl(url) {
    var time = new Date().getTime();
    return (url.indexOf('?') !== -1) ? url + '&rndval='+time.toString() : url + '?rndval='+time.toString();
}

Object.defineProperty( Array.prototype, "addPOST", {
    "get": function() {
        return function(name, value) {
            if (name.length == 0) return;
            var data = urlencode(name).concat('=').concat(urlencode(value));
            this.push(data);
            return this;
        }
    }
} );

function $_GET(url, callback, cacheMaxAge) {

    var targetURL = url;
    var callbackFunction = callback ? callback : null;
    var syncMode = callbackFunction !== null ? false : true;

    if (typeof cacheMaxAge != 'undefined' && cacheMaxAge !== null) {
        cacheMaxAge = cacheMaxAge || 0;
        var now = parseInt((new Date()).getTime() / 1000);
        var cacheName = 'CACHE_'+url;
    }

    if (typeof cacheMaxAge != 'undefined' && cacheMaxAge !== null && window.localStorage) {
        //check in cache if there is any url fetched with that name
        var cache = window.localStorage.getItem(cacheName);
        if (cache !== null) {
            var cacheParts = cache.split('\n\n');
            var cacheTimeStr = cacheParts[0];
            var cacheTime  = parseInt(cacheTimeStr);
            //check if time(now) - cacheTime < cacheSettings.maxAge
            if (!isNaN(cacheTime) && ((cacheMaxAge == 0) || (((now - cacheTime) < cacheMaxAge)))) {
                    try {
                        console.log('restoring url "'+url+'" from localStorage');
                    } catch(ex) {}
                    
                    if (!callbackFunction) 
                        return cache.substr(cacheTimeStr.length+2);
                    else {
                        callbackFunction(cache.substr(cacheTimeStr.length+2));
                        return;
                    }
            }
        }
        window.localStorage.removeItem('CACHE_'+url);
    }
    
    
    var HTTP = XMLHttp();
    
    if (typeof(cacheMaxAge) != 'undefined' && window.localStorage) {
        var HTTPcacheMaxAge = cacheMaxAge;
        var HTTPcacheName   = cacheName;
    }
    
    if (callbackFunction) {
        HTTP.onreadystatechange = function() {
            if (HTTP.readyState == 4) {
                if (HTTP.status == 200) {
                    if (HTTPcacheName) window.localStorage.setItem(HTTPcacheName, now.toString()+'\n\n'+HTTP.responseText);
                    callbackFunction(HTTP.responseText);
                } else callbackFunction(null);
            }
        };
    } else displayLoading();

     
    if (!syncMode) {
        HTTP.open('GET', __uniqueUrl(targetURL), true);
        HTTP.send(null);
        return HTTP;
    } else {
        HTTP.open('GET', __uniqueUrl(targetURL), false);
        HTTP.send(null);
        stopLoading();
        if (HTTP.status == 200) {
            if (HTTPcacheName) window.localStorage.setItem(HTTPcacheName, now.toString()+'\n\n'+HTTP.responseText);
            return HTTP.responseText;
        } else { 
            return null;
        }
    }
}

function $_POST(url, params, callback, cacheMaxAge) {
    var targetURL = url;
    var callbackFunction = callback ? callback : null;
    var syncMode = callbackFunction ? false : true;
    
    if (typeof cacheMaxAge != 'undefined' && cacheMaxAge !== null) {
	cacheMaxAge = cacheMaxAge || 0;
	var now = parseInt((new Date()).getTime() / 1000);
        var cacheName = 'CACHE_'+url+'||'+params.join('||');
    }

    if (typeof cacheMaxAge != 'undefined' && cacheMaxAge !== null && window.localStorage) {
        //check in cache if there is any url fetched with that name
        var cache = window.localStorage.getItem(cacheName);
        if (cache !== null) {
            var cacheParts = cache.split('\n\n');
            var cacheTimeStr = cacheParts[0];
            var cacheTime  = parseInt(cacheTimeStr);
            //check if time(now) - cacheTime < cacheSettings.maxAge
            if (!isNaN(cacheTime) && ((cacheMaxAge <= 0) || (((now - cacheTime) < cacheMaxAge)))) {
                    try {
                        console.log('restoring url "'+url+'" from localStorage');
                    } catch(ex) {}
                    
                    if (!callbackFunction) 
                        return cache.substr(cacheTimeStr.length+2);
                    else {
                        callbackFunction(cache.substr(cacheTimeStr.length+2));
                        return;
                    }
            }
        }
        window.localStorage.removeItem(cacheName);
    }
    
    if (typeof(cacheMaxAge) != 'undefined' && window.localStorage) {
        var HTTPcacheMaxAge = cacheMaxAge;
        var HTTPcacheName   = cacheName;
    }
    
    var HTTP = XMLHttp();
    displayLoading();
    
    if (callbackFunction) {
        HTTP.onreadystatechange = function() {
            if ((HTTP.readyState == 4)) {
                if (HTTP.status == 200) {
                    if (HTTPcacheName) window.localStorage.setItem(HTTPcacheName, now.toString()+'\n\n'+HTTP.responseText);
                    callbackFunction(HTTP.responseText);
                } else {
                    callbackFunction(null);
                }
                stopLoading();
            }
        };
    }
    if (params) {
        var p = params.join('&');
    } else { var p = ''; }
    
    if (!syncMode) {
        HTTP.open('POST', targetURL, true);
        HTTP.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        HTTP.send(p);
        return HTTP;
    } else {
        HTTP.open('POST', targetURL, false);
        HTTP.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        HTTP.send(p);
        stopLoading();
        if (HTTP.status == 200) {
            if (HTTPcacheName) window.localStorage.setItem(HTTPcacheName, now.toString()+'\n\n'+HTTP.responseText);
            return HTTP.responseText;
        } else { 
            return null;
        }
    }
}

function $_JSON_POST(url, params, callback, cacheMaxAge) {
    
    try {
	if (__DEBUG_JSON_POST__)
	console.log('AJAX: '+url+'?'+params.join('&'));
    } catch(ex) {}
    
    callback = typeof callback != 'undefined' ? ( callback ? callback : null ) : null;
        
    if (callback == null) {
        var buffer = $_POST(url, params, null, cacheMaxAge);
        try {
            return (buffer === null) ? null : json_parse(buffer);
        } catch (ex) {
            ajaxAlert( buffer );
            return null;
        }
    } else {
        
        $_POST(url, params, function(buffer) {
            var json;
            try {
                json =  (buffer === null) ? null : json_parse(buffer);
                callback(json);
            } catch (ex) {
                ajaxAlert(buffer,"$_JSON_POST - Async JSON Exception");
                console.error( ex );
                callback(null);
                return null;
            }
        }, cacheMaxAge);
        
    }
}

function $_JSON_GET(url, cacheMaxAge) {
    var buffer = $_GET(url, null, cacheMaxAge);
    try {
        return (buffer === null) ? null : json_parse(buffer);
    } catch (ex) {
        ajaxAlert( buffer, 'Server Exception' );
        return null;
    }
}

function $_FORM_POST(url, params, optionalTargetFrameName) {
    var frm = document.createElement('form');
    frm.setAttribute('method', 'post');
    if (typeof(optionalTargetFrameName) != 'undefined')
        frm.setAttribute('target', optionalTargetFrameName);
    frm.setAttribute('action', url);
    
    var name, value, input, param;
    
    //process params
    for (var i=0; i<params.length; i++) {
    
        param = params[i].toString();
    
        name = param.substr(0, param.indexOf('='));
        value= param.substr(name.length+1);
        
        name = decodeURIComponent(name);
        value= decodeURIComponent(value);
        
        input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name',  name);
        input.value = value;
        frm.appendChild(input);
    }
    
    frm.style.display = 'none';
    
    document.body.appendChild(frm);
    
    frm.submit();
    document.body.removeChild(frm);
};

function $_FORM_GET(url, optionalTargetFrameName) {
    var frm = document.createElement('form');
    frm.setAttribute('method', 'get');
    if (typeof(optionalTargetFrameName) != 'undefined')
        frm.setAttribute('target', optionalTargetFrameName);
    frm.setAttribute('action', url);
    
    var name, value, input, param;
    
    frm.style.display = 'none';
    
    document.body.appendChild(frm);
    
    frm.submit();
    document.body.removeChild(frm);
};

function $_SAVE( buffer, config ) {
    config = config || {};
    config.name = config.name || 'unnamed-file';
    var req = [];
    req.addPOST('data', buffer );
    req.addPOST('cfg', JSON.stringify( config ) );
    $_FORM_POST( 'out/', req );
}