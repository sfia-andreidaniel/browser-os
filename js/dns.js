function GetMainDomain() {
    return window.location.host.split('.').reverse().slice(0,2).reverse().join('.');
}

function GetDomain(schema) {
    return (window.location.protocol || 'http:').
    concat('//').
    concat(typeof(schema) != 'undefined' ? 
        ( 
          schema.concat('.')) : 
          ''
        ).
    concat(GetMainDomain());
    
}