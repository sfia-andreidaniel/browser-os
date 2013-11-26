function MMC2_Packages_cmd_refresh( app ) {

    app.grid.add = function( package ) {
        var row = app.grid.tr( [ package.name , package.version, package.description, package.installed, package.buildable ] );
        
        row.primaryKey = package.name;
        
        row.addEventListener('click', row.click = function(e) {
            getOwnerWindow( app.parentNode ).onCustomEvent('focusItem', 'cmd_packager:' + row.primaryKey );
        });
        
        row.addEventListener('dblclick', function(e) {
            app.appHandler('cmd_package_download' );
        });
        
        disableSelection( row );
    };

    app.addCustomEventListener('focusItem', function( packageID ) {
        for ( var i=0,len=app.grid.tbody.rows.length; i<len; i++ )
            if ( app.grid.tbody.rows[i].primaryKey == packageID ) {
                app.grid.tbody.rows[i].selected = true;
                return true;
            }
        return true;
    } );

    app.handlers.cmd_refresh = function() {
    
        var focusPackageId = -1;
    
        if ( app.grid.tbody.rows.length && app.grid.selectedIndex >= 0 )
            focusPackageId = app.grid.tbody.rows[ app.grid.selectedIndex ].primaryKey;
            
        var req = [];
        req.addPOST('do', 'enum-packages');
        var rsp = $_JSON_POST( app.handler, req );
        rsp = rsp || [];
        app.grid.clear();

        var addNodes = [];
        
        for ( var i=0,len=rsp.length; i<len; i++ ) {
            app.grid.add( rsp[i] );
            addNodes.push({
                "id": rsp[i].id,
                "name": rsp[i].name,
                "icon": rsp[i].icon
            });
        }
        app.grid.render();
        
        getOwnerWindow( app.childOf ).onCustomEvent('setNodes', { "nodes": addNodes, "target": "cmd_packager" } );
        
        // Refocus previous policy if possible
        if ( focusPackageId != -1 )
            for ( var i=0,len=app.grid.tbody.rows.length; i<len; i++ ) {
                if ( app.grid.tbody.rows[i].primaryKey == focusPackageId ) {
                    app.grid.tbody.rows[i].click();
                    app.grid.selectedIndex = i;
                    getOwnerWindow( app.childOf ).getMenu('cmd_packager:' + focusPackageId );
                    break;
                }
            }
    };
    
}