window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "toolbar",
    "name"  : "Application Toolbar",
    "group" : "Menus",
    "order" : 1,
    "requires": "toolbar",
    "provides": "apptoolbar",
    "icon": "data:image/gif;base64,R0lGODlhEAAQAOZMAPmTAAUcIgohKJGRkaenpwFeW/b39g4lLAceJQE/UtLS0ry8vNjY2dzc3AQbIq2trb3wAKjbAPr6+gEjLQgfJvv7+8jIyMrKytnZ2LCwsNTU0wsiKbOzs+Hh4SBCTbq6ur29vfn4+fTz8/n6+REoL8b5AObm5ezs7O/v7u/v77LlANHR0fLz8+vq6t3d3cTExMz/ALe3t8HBwdTV1ebm5u3t7hAnLgUcI/j495/SAPv6+wIZIN7e3vz8/LS0tN/g4AwjKg0kK+Hh4tXV1b6+vuvr6sljAGCcFSY9RJkzAABmAP///43l3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEwALAAAAAAQABAAAAeAgEyCg4SFhoeIiYqJBUpKSJCRkkgeCUowR0uam5xLRAdKJUc9EgYiKS00Qi4YQwtAShBHFSEARjW2P7YaPgJKKkc6OEZJJ8Q8xAoECEoRRyMGLChFJh0NDDMrAwFKOUcXFi8yIB8xHBkPBNuNSiQ2B0EbAhQINw47EwmL+/z9/YEAOw==",
    "properties": [
        {
            "name": "name",
            "type": "Generic",
            "value": "toolbars",
            "label": "Name"
        },
        {
            "name": "declaration",
            "label": "Scope",
            "type": "Generic",
            "value": "private"
        },
        {
            "name": "iconSize",
            "value": "normal",
            "values": [
                {
                    "id": "none",
                    "name": "No Icons"
                },
                {
                    "id": "normal",
                    "name": "Small"
                },
                {
                    "id": "large",
                    "name": "Large"
                }
            ],
            "type": "dropdown",
            "label": "Icons Size"
        },
        {
            "name"   : "buttonLabels",
            "value"  : true,
            "type"   : "bool",
            "label"  : "Button Labels"
        },
        {
            "name"   : "toolbarTitles",
            "value"  : false,
            "type"   : "bool",
            "label": "Groups Labels"
        }
    ],
    "init": function( cfg, app, children ) {
        var toolbar = new JSIde_Toolbar( { "cfg": cfg, "items": children } );
        
        setTimeout( function() {
            var bar = app.tabs.getSheets(0).querySelector('.DOM2Window.design-mode .DomDialogToolbar');
            if ( bar ) {
                bar.setAttribute('jside-id', cfg._id );
                if ( cfg._id == app.tree.selectedNode.nodeID )
                    addStyle( cfg, 'jside-focus' );
            }
        }, 50 );
        
        return toolbar;
    },
    "add": function( root, cfg ) {
    },
    "compile": function( cfg, globalName, items ) {
        var toolbarSettings;
        var out = ( toolbarSettings = ( new JSIde_Toolbar( { "cfg": cfg, "items": items }, true ) ) ).toString();
        var settings = toolbarSettings.settings;
        out = out.concat('.chain(function() { ' + 
            'dlg.toolbars = this; ' + 
            'var toolbar = dlg.toolbars; ' + 
            'if ( toolbar ) { ' +
                'toolbar.setIconSize(' + JSON.stringify( settings.iconSize ) + ');' +
                'toolbar.setButtonLabels( ' + JSON.stringify( settings.buttonLabels ) + ');' +
                'toolbar.setTitles( ' + JSON.stringify( settings.toolbarTitles ) + ' );' +
            ' }' +
        '})');
        return new JSIde_StringObject( out, cfg );
    }

}, {
    "autoIncrement": false
}));