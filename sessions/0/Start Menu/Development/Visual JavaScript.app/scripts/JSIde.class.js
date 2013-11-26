function JSIde() {
    
    var dlg = new Dialog({
        "width": Math.min( 850, getMaxX() - 100 ),
        "height": Math.min( 500, getMaxY() - 100 ),
        "caption": "Visual JavaScript",
        "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAERpIDQgTXJ6IDIwMDMgMDA6MjQ6MDQgKzAxMDDdSQ6OAAAAB3RJTUUH0wkEDBwHqwUAnQAAAAlwSFlzAAAK8AAACvABQqw0mAAAAARnQU1BAACxjwv8YQUAAAFWSURBVHjaY2CgEDCCyZn/3YHkDhL1ejCkM+5kgXJ2zDQmXueShwwMh9+ALWSEGcCQfhZIvHlDnAk8PAwMHBxgJtyAa7bXUdT8/cvA8Ps3hP7zB4FBYn/+vGbweqyJaoCmpiZD68FPDKxMDAxsQMwMDB1WZqACEB+oipkNIiYrxMYg9A1o+2MGVANAAKiWwVyFj4EdqJEDiEGGwdggQ2GGP7qDqgcnYGKE2Ap2DRPCEGSA4gJxATYGMU6IIhBmgWliRIixMeMwABRAcdqQkP33DznAGBi+/2Jg+AINVBAGyWMY8OsXNDauXWI4d+4EmK2rawE24Pp1CF9JyYJBRkYPuwEgk0EApDk+PhnMXrhwLpiOjU1m+P8fmICWzGWQltYDs3G6QFvbAq5RXd0CbNvixRC+nBzERXhdoKioB8YgRaBEBKJlZfXAGpETF7oBHtJbyMhM1AAATZJ66qa1CfsAAAAASUVORK5CYII="
    });
    
    dlg.handler = 'vfs/lib/jside/handler.php';
    
    dlg.panel = dlg.insert(
        ( new Splitter() ).setAnchors({
            "width": function(w,h) {
                return w + "px";
            },
            "height": function(w,h){
                return h + "px";
            }
        })
    );
    
    dlg.panel.split( [ 150, dlg.width - 400 ], 'V' );
    
    dlg.tree = dlg.panel.cells(0).insert( 
        ( new Tree({ 
            "id": null, 
            "name": "Application",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGnSURBVDjLnZOxilNBGIW/mXt3CZsYQQtjJYqPkE4L8Q20WARbmxWEFQvBXrByQdDKF3CL1QcQH8DOKmVIkWIFbdybTe7M/x+Lm+zeFELcAz/DwJnD4eOf8OD5p4d37w2f/qrUwR25k3PG5cgMl5AZ5k5/O81Ho+mHo7e7RyxVDu8M97c63TjosIk61cz2gfOAWVKc/T5hU50mxfa9lInXj29vHPDkzYT1ADkAi2x8/jq6fpy7N37+8eJfPHqX+zx7/1397VSNRtOXJRIAMcB4tnOr19thcHWjMt1qZu9KcwMghEBVi+o/eZSW81nARXiUOaXzgBYPuTCH7I65Y1nNyKlN3BxcwtwoLTUNItDmoRhQECWRECIhGKEQhUfK3Pg8G+V0PPm2d5Du5zpxZXDtrA0BCoEkCkEMBWUAC8Ji09TNG8NqXnz8IUnK7sruSmaqzTQ30yIlndZJszrpZJ4kSY9efVnfqjaP9hmBECNFEQkxEIuVP1O2A9Z4LB8Xy3OlrbbfbD1gOp4c7h2k3VwnzAx3Jy0WzY90Q6ZmK93xBsNh0JL8RfUXD1Ut4VHY1QEAAAAASUVORK5CYII="
        }) ).setAnchors({
            "width": function(w,h) {
                return w + "px";
            },
            "height": function(w,h) {
                return h + "px";
            }
        }).chain(function() {
            this.dragAndDrop = true;
        })
    );
    
    dlg.tabs = dlg.panel.cells(1).insert(
        (new TabPanel({
            "initTabs": [
                {
                    "caption": "Design"
                },
                {
                    "caption": "Built Code"
                }
            ]
        })).setAnchors({
            "width": function(w,h) {
                return w - 10 + "px";
            },
            "height": function(w,h) {
                return h - 10 + "px";
            }
        }).setAttr(
            "style", "margin: 5px"
        )
    );
    
    dlg.application = [
    ];
    
    dlg.findElementIndex = function( elementID ) {
        for ( var i=0,len=dlg.application.length; i<len; i++ ) {
            if ( dlg.application[i].id == elementID )
                return i;
        }
        return -1;
    };
    
    dlg.findPropertyIndex = function( propertiesArray, propertyName ) {
        for ( var i=0,len=propertiesArray.length; i<len; i++ ) {
            if ( propertiesArray[i].name == propertyName )
                return i;
        }
        return -1;
    }
    
    JSIde_resizer( dlg );
    JSIde_menu( dlg );
    JSIde_tree( dlg );
    JSIde_cmd_add( dlg );
    JSIde_event_repaint( dlg );
    
    JSIde_cmd_save( dlg );
    JSIde_cmd_load( dlg );
    JSIde_cmd_run( dlg );
    
    JSIde_CodeBuilder( dlg );
    JSIde_reorder( dlg );
    
    JSIde_cmd_delete_node( dlg );
    JSIde_cmd_help( dlg );
    
    dlg.tree.rootNode.focus();
    dlg.paint();
    
//    dlg.appHandler('cmd_load');
    
    window.jside = dlg;
}