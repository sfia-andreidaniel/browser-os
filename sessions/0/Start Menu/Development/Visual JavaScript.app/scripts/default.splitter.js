window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "split",
    "name"  : "Splitter",
    "group" : "Layout",
    "order" : 3,
    "requires": "placeable",
    "provides": "splitter,event,customevent,dom,chain",
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
            "label": "Tabs_ID",
            "type": "Generic",
            "value": null
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
            "name": "direction",
            "type": "dropdown",
            "label": "Split Direction",
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
            "name": "style",
            "label": "Style",
            "type": "DOMStyle",
            "value": "top: 10px; left: 10px; right: 10px; bottom: 10px; position: absolute"
        }
    ],
    "init": function( cfg, app, children ) {
    
        var split = new Splitter();
        
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;
        
        if ( css.trim() )
            split.setAttribute('style', css );
        
        if ( anchors )
            split.setAnchors( anchors );
        
        /* Split children */
        
        if ( typeof children != 'undefined' && children.length ) {
            
            // console.log("Children: ", children );
            
            var splitRecursive = function( children, cfg, node ) {
                
                // console.log("Args: ", arguments );
                
                var sizes = [];
                var hasAdded = false;

                for ( var i=0, len=children.length; i<len; i++ ) {
                    
                    if ( typeof children[i] == 'object' ) {
                        if (children[i].type == 'cell' ) {
                            hasAdded = true;
                            
                            sizes.push( children[i].cfg.size );
                            
                        } else {
                            if ( hasAdded )
                                throw "Bad splitter config!";
                        }
                    } else {
                        
                    }
                    
                }
                
                if ( sizes.length == 0 )
                    return;
                
                /* We no have the split sizes */
                sizes.pop();
                
                /* Obtain the split direction from the parent */
                var direction = cfg.direction;
                
                if ( ['H','V'].indexOf( cfg.direction ) == -1 )
                    throw "Bad split direction!";
                
                // console.log( "Split: ", sizes, direction );
                
                try {
                    node.split( sizes, direction );
                } catch (e) {
                    node.innerHTML = '';
                    node.appendChild( $text( e ) );
                    return;
                }
                
                for ( var i=0,len=sizes.length+1; i<len; i++ ) {
                    /* Assign attribute jside-id */
                    node.cells( i ).setAttribute( 'jside-id', children[i].id );

                    if ( typeof children[i].items != 'undefined' && children[i].items.length ) {

                        splitRecursive( children[i].items, children[i].cfg, node.cells( i ) );

                    } else {
                        //console.log("No cells in: ", children[i] );
                    }
                }
            }
            
            splitRecursive( children, cfg, split );
        }
        
        split.addCustomEventListener('resize', function( data ) {
            var cells = split.querySelectorAll('div.SplitH, div.SplitV');
            
            var sizes = [], id = '';
            
            for ( var i=0, len=cells.length; i<len; i++ ) {
                if ( id = cells[i].getAttribute('jside-id') ) {
                    if ( hasStyle( cells[i], 'SplitH' ) ) {
                        sizes.push({
                            "id": id,
                            "size": cells[i].offsetHeight
                        })
                    } else
                        sizes.push({
                            "id": id,
                            "size": cells[i].offsetWidth
                        });
                }
            }
            
            if ( sizes.length ) {
                for ( var i=0, len=sizes.length; i<len; i++ ) {
                    
                    var index = app.findElementIndex( sizes[i].id );
                    
                    //console.log( "app.findElementIndex( ",sizes[i].id, ") = ", index );
                    
                    if ( index == -1 )
                        continue;
                    
                    var propertyIndex = app.findPropertyIndex( app.application[ index ].properties, 'size' );
                    
                    //console.log( "app.findPropertyIndex( app.application[", index, ".properties, 'size' )=", propertyIndex );
                    
                    if ( propertyIndex == -1 )
                        continue;
                    
                    app.application[ index ].properties[ propertyIndex ].value = sizes[i].size;
                    
                    if ( app.currentItemProperties.values._id == sizes[i].id ) {
                        app.currentItemProperties.values.size = sizes[i].size;
                        app.currentItemProperties.save();
                    }
                }
            }
            
            return true;
        } );
        
        return split;
    },
    "add": function( root, cfg, app ) {
    },
    "compile": function( cfg, globalName, items ) {
        var out = '( new Splitter() )';
        
        var parser = new CSSParser( cfg.style );
        var css = parser.css;
        var anchors = parser.anchors;

        if ( css.trim() )
            out = out + '.setAttr("style", ' + JSON.stringify( css ) + ')';
        
        if ( anchors )
            out = out + '.setAnchors(' + anchors + ')';
        
        var exporters = [];
        
        var splitRecursive = function( children, cfg, node ) {
        
            var sizes = [];
            var hasAdded = false;
            
            for ( var i=0,len=children.length; i<len; i++ ) {
                if ( typeof children[i] == 'object' ) {
                    if (children[i].type == 'cell' ) {
                        hasAdded = true;
                        sizes.push( children[i].cfg.size );
                    } else {
                        if ( hasAdded )
                            throw "Bad splitter config!";
                    }
                } else {
                }
            }
            
            if ( sizes.length == 0 )
                return;
            
            sizes.pop();
            
            var direction = cfg.direction;
            
            if ( ['H','V'].indexOf( cfg.direction ) == -1 )
                throw "Bad split direction!";
            
            exporters.push( node + '.split(' + JSON.stringify( sizes ) + ', ' + JSON.stringify( direction ) + ');' );
            
            for ( var i=0,len=sizes.length+1; i<len; i++ ) {
            
                exporters.push( '$export( ' + JSON.stringify( children[i].cfg._id ) + ', ' + node + '.cells(' + i + ') );' );
        
                if ( typeof children[i].items != 'undefined' && children[i].items.length ) {
                    splitRecursive( children[i].items, children[i].cfg, node + '.cells(' + i + ')' );
                } else {
                    //console.log("No cells in: ", children[i] );
                }
            }
        };
        
        try {
            splitRecursive( items, cfg, 'this' );
        } catch (e) {
            alert(e);
        }
        
        if ( exporters.length )
            out = out + '.chain( function() { ' + exporters.join('\n') + ' } )';
        
        return new JSIde_StringObject( out, cfg );
    }
}));