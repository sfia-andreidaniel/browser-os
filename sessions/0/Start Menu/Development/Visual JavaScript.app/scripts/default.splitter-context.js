function SplitterCell( cfg ) {

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
    "type"  : "cell",
    "name"  : "SplitterCell",
    "group" : "Layout",
    "order" : 3.1,
    "requires": "splitter,splitterCell",
    "provides": "splitterCell,placeable,event,customevent,dom,chain",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQ5JREFUeNqcU0sKgzAQnWhQKHVb8FCFrj1AewkXLrxEceNK8FQuC125KPjX5k2xqI0tdWDIZPLeczITRZqmRyJyaZvdZNu2rud51y3sJEkusmkaDrYIgEtRFJ27rhtUJeyI4zie5XSOc3BlVVWkNtT3PasahkHLnM5GHAsACMJoupzOtAJCCCrL8qcAcCwAMIBLgWEYOF4znAMnl1/D3YqioDAMf04GHAnwVMA0TVYOguD67QrA+b5/+agAMe6mRsXrmtm2/boCKpj2AOs4xm8V4Axcmec5N2ScOeK6rme5tSaCK7Ms48ZZlvVuIp7oNLf2kMAVjuOc1Oaw5V9QFd4x6J3yvXL5J79V/ngKMACGVh5oEftxvgAAAABJRU5ErkJggg==",
    "properties": [
        {
            "name": "name",
            "label": "Name",
            "type": "varchar",
            "value": ""
        },
        {
            "name": "_id",
            "label": "Context_ID",
            "type": "Generic",
            "value": null
        },
        {
            "name": "declaration",
            "label": "Scope",
            "type": "Generic",
            "value": "private"
        },
        {
            "name": "direction",
            "label": "Split Direction",
            "type": "dropdown",
            "value": "H",
            "values": [
                {
                    "id": "H",
                    "name": "Horizontal"
                },
                {
                    "id": "V",
                    "name": "Vertical"
                }
            ]
        },
        {
            "name": "size",
            "label": "Size",
            "type": "int",
            "min": 0,
            "value": 10
        }
    ],
    "init": function( cfg, app, children ) {
    
        var ctx = new SplitterCell( cfg );
        return ctx;
        
    },
    "add": function( root, cfg, app, recursionLevel ) {
        
        switch (true) {
            case cfg instanceof Node:
            
                setTimeout( function() {
                    var allSplits = app.tabs.getSheets(0).querySelectorAll( 'div.SplitH, div.SplitV' );
                    for ( var i=0,len=allSplits.length; i<len; i++ ) {
                        if ( allSplits[i].getAttribute('jside-id') == root._id ) {
                            allSplits[i].insert( cfg );
                            return;
                        }
                    }
                    console.warn("Could not insert content in the splitter cell!");
                }, recursionLevel * 5 );
                
                break;
        }
    },
    "compile": function( cfg, globalName, items ) {
        return new JSIde_StringObject('$import(' + JSON.stringify( cfg._id ) + ')', cfg );
    }
}));