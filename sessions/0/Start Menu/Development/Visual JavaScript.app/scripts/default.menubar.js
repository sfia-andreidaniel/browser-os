window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "menubar",
    "name"  : "Application Menu",
    "group" : "Menus",
    "order" : 2,
    "requires": "menubar",
    "provides": "menugroup",
    "icon": "data:image/gif;base64,R0lGODlhEAAQANUAAFVpmGV5p1Ntn191omd9qWd9qPL1+/b4/Pn6/Pj5+22DrXOJsnqPt4GWu+/z+lJunoecwOXs+PL1+jhdk+rw+fb4+zhek+zy+vT3+yZSiufv+fH1+vH2+/f5+393ToR5TIB2ToZ6TJB/SIx9SpuERZaBR7GPPqmLQKWJQqGGQ7SQPf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACsALAAAAAAQABAAAAZxwJUwQCwGhMhkAMFkHpPJR6UwABwE0KTFYJAYNpMsMkMuZ1TorKnJRpiypw6kwVgoCIlTFnXoV/p9KFkpGHN1dxwkWSUcjY4cDiVZIheGdgQXIlkjFJ2enSNZIRqWdxohWR8Rq6yrH1kesbKyIGK2SUEAOw==",
    "properties": [
        {
            "name": "name",
            "label": "Name",
            "type": "varchar",
            "value": ""
        },
        {
            "name": "declaration",
            "label": "Scope",
            "type": "Generic",
            "value": "private"
        }
    ],
    "init": function( cfg, app, children ) {
        var menu = new JSIde_MenuBar( { "cfg": cfg, "items": children } );
        
        setTimeout( function() {
            var bar = app.tabs.getSheets(0).querySelector('.DOM2Window.design-mode .DomMenuBar');
            if ( bar ) {
                bar.setAttribute('jside-id', cfg._id );
                if ( cfg._id == app.tree.selectedNode.nodeID )
                    addStyle( cfg, 'jside-focus' );
            }
        }, 50 );
        
        return menu;
    },
    "add": function( root, cfg ) {
    },
    "compile": function( cfg, globalName, items ) {
        var out = ( new JSIde_MenuBar( { "cfg": cfg, "items": items }, true ) ).toString();
        out = out.concat('.chain(function() { dlg.menu = this; })');
        return new JSIde_StringObject( out, cfg );
    }

}, {
    "autoIncrement": false
}));