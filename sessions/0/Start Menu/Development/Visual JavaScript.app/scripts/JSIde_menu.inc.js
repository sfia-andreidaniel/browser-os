function JSIde_menu( app ) {
    
    var getItemsByGroup = function( groupName ) {
        var out = [];
        for ( var i=0,len=JSIde_Components.length; i<len; i++ ) {
            if ( JSIde_Components[i].group == groupName )
                ( function(component) {
                    var o = {
                        "caption": JSIde_Components[i].name,
                        "handler": function() {
                            app.appHandler( 'cmd_add', component.type );
                        },
                        "order": component.order
                    };
                    
                    if ( component.icon )
                        o.icon = component.icon;
                    
                    out.push( o );
                })( JSIde_Components[ i ] );
        }
        
        out.sort( function(a,b) {
            return a.order - b.order;
        } );
        
        return out;
    }
    
    var out = [
        {
            "caption": "File",
            "items": [
                {
                    "caption": "Open Project",
                    "id"     : "cmd_load",
                    "handler": app.appHandler
                },
                {
                    "caption": "Save Project",
                    "id"     : "cmd_save",
                    "handler": app.appHandler
                }
            ]
        },
        {
            "caption": "Run",
            "id": "cmd_run",
            "handler": app.appHandler
        },
        {
            "caption": "Components",
            "items": [
                {
                    "caption": "Application",
                    "items": getItemsByGroup("Application"),
                },
                {
                    "caption": "Layout",
                    "items": getItemsByGroup("Layout")
                },
                {
                    "caption": "Inputs",
                    "items": getItemsByGroup("Inputs")
                },
                {
                    "caption": "Grids",
                    "items": getItemsByGroup("Grids")
                },
                {
                    "caption": "PropertyGrids",
                    "items": getItemsByGroup("PropertyGrids")
                },
                {
                    "caption": "Menus",
                    "items": getItemsByGroup("Menus")
                },
                {
                    "caption": "Code",
                    "items": getItemsByGroup("Code")
                }
            ]
        },
        {
            "caption": "Help",
            "id": "cmd_help",
            "handler": app.appHandler
        }
    ];
    
    app.menu = out;
}