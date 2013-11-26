function TabSheet( cfg ) {

    for( var key in cfg ) {
        if ( cfg.propertyIsEnumerable( key ) )
            this[ key ] = cfg[ key ];
    }

    this.setAttribute = function( dummy, value ) {

    }

    return this;
}

window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "sheet",
    "name"  : "Sheet",
    "order" : 2.1,
    "group" : "Layout",
    "requires": "tabs",
    "provides": "placeable,event,customevent,dom,chain",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABpUlEQVQ4jZ1SvW3jYBSjDCWFAbdewEAWuDJZ4Xa4NLoV3F1S55INvEPiMQznUqkxXHoBG7L8J5Ipvh8l7X2NQOCRj+RTUVXVA4A/AGAJBtCRuL66yhgABoNBxpIeZ7PZAwCgqiqv12vbdtM03mw2/nV/7/l8/g0vl8tvGMAP2ygBYDKZYLFYwDYkwRJWqxXG43HGdV2j67qM0yutYDKRJUIUPv59YPn+DpGghNfXN0gEGWZu724rAL9LOQgEsiAZT3+fMBwOMRqN8qbtdovdbof9fo+2bTGdTquiKF5KO9ihBFOgibquIQoUQTK7oAR2DC5DjJvSFpqmgRXIifjVLiUwijiJxh5KyWjbNg73g1moi18SsnJUikGAIg6HQywvKAfLzKKSQCuLWYLp6IDC8Xjs7dI9mX2MEMUhahQMZ7RxOp5ibkPsootEdBa2CKZzMwqQwul8grN1xebDprQ5ndiKXTiXSJzPZ5BdLjC1HErte7AciDFKdnC5XAKZgWA7FtpvlpNA+Gtt9w6eX56D5S+b00lTaY5dCICtLFDYRlEUP/Gf7xPRWWGZOOP2xAAAAABJRU5ErkJggg==",
    "renderProperty": "caption",
    "properties": [
        {
            "name": "_id",
            "label": "Sheet_ID",
            "type": "Generic",
            "value": null
        },
        {
            "name": "name",
            "label": "Name",
            "type": "varchar",
            "value": ""
        },
        {
            "name": "declaration",
            "label": "Scope",
            "type": "dropdown",
            "value": "private",
            "values": [
                {
                    "id": "public",
                    "name": "Public"
                },
                {
                    "id": "protected",
                    "name": "Protected"
                },
                {
                    "id": "private",
                    "name": "Private"
                }
            ]
        },
        {
            "name": "caption",
            "label": "Caption",
            "type": "varchar",
            "value": "Sheet"
        },
        {
            "name": "closeable",
            "label": "Closeable",
            "type": "bool",
            "value": false
        }
    ],
    "init": function( cfg, app ) {
        var sheet = new TabSheet( cfg );
        return sheet;
    },
    "add": function( root, cfg, app, recursionLevel ) {

        setTimeout( function() {
            var divs = app.rootNode.querySelectorAll('div.DomTabPanelSheetInner');

            for ( var i=0,len=divs.length; i<len; i++ ) {
                if ( divs[i].getAttribute('jside-id') == root._id )
                    divs[i].insert( cfg );
            }

        }, recursionLevel * 5 );
    },
    "compile": function( cfg, globalName, items ) {
        return new JSIde_StringObject('$import(' + JSON.stringify( cfg._id ) + ')', cfg );
    }
}));