function Button(str, func) {
    var b = $('button');
    b.innerHTML = str;
    if (typeof (func) != 'undefined')
        b.onclick = func;
    
    return b;
}