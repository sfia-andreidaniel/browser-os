var kernel_cache = kernel_cache || [];


if ( /(\?|\&)(devel|build)/.test( window.location ) )
window.onerror = function( str, script, line ) {
    alert("Application Fatal Error: " + str + "\nline: " + line );
}



function KernelLog(str, method) {
    method = method || 'log';
    try {
        console[method](str);
    } catch(ex) {}
}

function KExtension(path) {
    if (path == '') return '';
    var arr = path.split('/');
    while (arr.length && (arr[arr.length-1] == '')) {
        arr.splice(arr.length-1, 1);
    }
    if (arr.length == 0) return '';
    arr = arr[arr.length-1];
    arr = arr.split('.');
    return arr[arr.length-1].toLowerCase();
}

window.jKernel = {
    'scripts': 0,
    'styles': 0
};

addOnload(function() {
    window.scriptLoader = new Dialog({ width: 230, height: 100, closeable: false, minimizeable: false, caption: 'Loading Application', maximizeable: false, onTop: true, resizeable: false });
    
    window.scriptLoader.many = $('span');
    
    window.scriptLoader.many.innerHTML = 'some scripts ';

    window.scriptLoader.insert($('img')).setAttr('style','display: block; margin-bottom: 10px; margin-left: auto; margin-right: auto').setAttr('src','img/ajax-loaders/loadbar-148x12.gif');
    
    window.scriptLoader.p = window.scriptLoader.insert($('p'));
    
    
    window.scriptLoader.p.appendChild(document.createTextNode('Please wait, we have to load '));
    window.scriptLoader.p.appendChild(window.scriptLoader.many);
    window.scriptLoader.p.appendChild(document.createTextNode( ' before starting your application ...' ));
    
    window.scriptLoader.childOf = null;
});

function setScriptsPending(intV) {
    if (intV < 0) return;
    window.jKernel.scripts = intV;
    window.scriptLoader.setChildOf( (intV == 0) ? null : document.body );
    window.scriptLoader.many.innerHTML = intV + (intV == 1 ? ' script' : ' scripts');
}

function getScriptsPending() {
    return window.jKernel.scripts;
};

function KernelLoadApplication(fileName) {

    KernelLog('Kernel: Loading "'+fileName+'"');
    
    for (var i=0; i<kernel_cache.length; i++) {
        if (kernel_cache[i].fileName == fileName) {
            KernelLog('Kernel: Application "'+fileName+'" was loaded from cache');
            return kernel_cache[i];
        }
    }

    var rsp = $_JSON_POST('vfs/'+fileName);

    if (rsp === null) { 
        KernelLog("Kernel: Loading '"+fileName+"' returned NULL!", 'error');
        window.setScriptsPending(window.getScriptsPending() - 1);
        return null; 
    }
    
    rsp.fileName = fileName;
    
    var head;
    
    try { head = document.getElementsByTagName('head')[0]; } catch(ex) { head = document.body.parentElement.getElementsByTagName('head')[0]; }
    
    if (rsp.scripts && rsp.scripts.length) {
        KernelLog('Kernel: Loading '+rsp.scripts.length+' Files from file "'+fileName+'"');
        for (var i=0; i<rsp.scripts.length; i++) {
            try {
                var ext = KExtension(rsp.scripts[i].name);
                
                var s;
                var cbdiv;
                
                
                switch (ext) {
                    case 'js': s = $('script');
                               KernelLog('script: '+rsp.scripts[i].name, 'info');
                               
                               window.setScriptsPending(window.getScriptsPending() + 1);
                               
                               
                               s.setAttribute('type', 'text/javascript');
                               rsp.scripts[i].data = 'try {'+rsp.scripts[i].data+' \n\n'+
                                                     '/* KernelLog("Script: '+rsp.scripts[i].name+' was loaded successfully!", "info"); */'+
                                                     'window.setScriptsPending(window.getScriptsPending()-1); } catch(ex_jkernel) { \n\nKernelLog("Script: '+rsp.scripts[i].name+' COULD NOT BE LOADED!: "+ex_jkernel, "error"); window.setScriptsPending(window.getScriptsPending()-1); }' +
                               '\r\n\r\n//@ sourceURL=' + rsp.scripts[i].name;
                               
                               try {
                                   s.appendChild(document.createTextNode( rsp.scripts[i].data ));
                               } catch(ex) {
                                   s.text = rsp.scripts[i].data;
                               }
                               
                               try {
                                   s.script_name = rsp.scripts[i].name;
                                   head.appendChild(s);
                              } catch(ex) {
                                alert('IE');
                              }
                               
                               break;
                               
                    case 'css': 
                                KernelLog('css   : '+rsp.scripts[i].name);
                                s = document.createElement('style');
                                
                                try {
                                    s.appendChild(document.createTextNode(rsp.scripts[i].data));
                                } catch(ex) {
                                    s.setAttribute("type", "text/css");
                                    s.styleSheet.cssText = rsp.scripts[i].data;
                                }
                                head.appendChild(s);
                                
                               break;
                    default: /* KernelLog('Ignoring file: '+rsp.scripts[i].name); */
                               break;
                }
                
            } catch(ex) {
                KernelLog('Kernel: Error loading application "'+fileName+'":\n"'+ext+'" error at script index '+i+' (name="'+rsp.scripts[i].name+')\n'+ex, 'error');
                try { ex.stack(); } catch(nostack) {
                    console.error('no trace information available!');
                }
//                 alert('Application error at script #'+i+':'+rsp.scripts[i].name);
                return null;
            }
        }
    }
    
    kernel_cache.push(rsp);
    
    return rsp;
}

function AppExec(fileName, args_ovrd) {

    window.scripts_pending ++;

    var mem = KernelLoadApplication(fileName);
    
    window.scripts_pending --;
    
    if (mem === null) { 
        KernelLog('Exec failed', 'error');
        return null;
    }
    
    var args = typeof(args_ovrd) == 'undefined' ? ((mem.params && mem.params.toString().length) ? mem.params.toString() : '') : args_ovrd;
    
    if (mem.init_class && mem.init_class.toString().length) {
    
        var ev = 'new '+mem.init_class+'('+args+');';
        KernelLog('exec  : '+ev);
        
        try {
            var r = eval(ev);
        } catch(ex) {
              KernelLog('Kernel: Error executing "'+fileName+'": JavaScript error at startup code: "'+ex+'":', 'error');
              try {
                    KernelLog(ex.stack, 'error');
              } catch(exx) {}
              throw(ex);
              KernelLog(ex.stack ? ex.stack : '(Not enough information for debugging)', 'error');
              return null;
        }
        return r;
    }
    
    return true;
}