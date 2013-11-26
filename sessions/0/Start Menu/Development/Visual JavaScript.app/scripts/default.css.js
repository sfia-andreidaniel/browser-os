window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "css",
    "name"  : "Application CSS",
    "group" : "Code",
    "order" : 1,
    "requires": "css",
    "provides": "nothing",
    "icon": "data:image/gif;base64,R0lGODlhEAAQAOZ/AGmMwVleZuLt/MfS4tnm+re5u+3t7eHs/N3d3cnJyevy/WaLwuTt++Hr+7+/v0RITtjg79Xf79Le7nuVvMfHx+3z/ePu/d/q+1mCxs7a7WKJw7q6ulJWWzM7R0JGTXKRv16ExMLCwsrKysDAwMHBweDg4OXu/Obv/FWAyNbg79fX13aTveTu/Onx/dTU1Ofw/cvLy1BUW8PDw+jw/fv7++70/ZesycnN1c/T28/c78va7u/1/u/v78rKy9LT1NLd7bGysrKysu30/tbk+oKavL7H1uPt/Nzj8OHn87q7vbvF1cDM4KCxyMnT48nT5MrU4srU5M3W487W5JGnxpSqx8THypmsxuHp9N/r/ISYs7jD1eDr/Nvo+ywzPeXu/YuiwneMqs3Nzdnh8MPQ48/b7tDQ0NPT083Z7VtgZtLY4aurrN7e3sPP4W2OwNff7tLd7rCwsLG0usbJzOTk5Obm5lRXW9Pj+fDw8Orq6t3p+oWdvuDk6tvj8H6Xuv///////yH5BAEAAH8ALAAAAAAQABAAAAfsgH+Ccj1VTDZTX3p9fYKCIiEiPAkUPns7NX1+jX9BJQYyIzIGCElCFZqbfxRrZio0KiIjcBUKqZswd3MuZQ4OIUAKLYzEJHh0CDAkJCNqLTMnXkYCjRsuJWEhGwVpLycmFgIHnH9xCQU3VycnLBYHB1sTjlY4SDMvJixG71gXK45UjvAxwQBCii0XJLzh8sFRljp1xEjhwCFCkxgxcrRx1CGKmBRoikiQEEBJBgILHHVxY6QBlABOCAwIMGaIBo5PIuT5oSQAmQxaAugA4QjMgwcDjrI588DDEjsYHBGZMGHFhzYAFmgAgQEFikAAOw==",
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
        },
        {
            "name": "code",
            "type": "code",
            "value": "",
            "label": "Code",
            "tabPanel": "(function() { return jside.tabs; })()",
            "syntax": "css",
            "template": "",
            "snippetName": "(function() { return 'Css: ' + jside.currentItemProperties.values.name; })"
        }
    ],
    "init": function( cfg, app ) {

        return new JSIde_ApplicationCSS(
            cfg.code
        );

    },
    "add": function( root, cfg ) {
        throw "Cannot add something inside a button!";
    },
    "compile": function( cfg, globalName, items ) {
        //console.log("Compile: ", cfg );
        var out = '( new JSIde_ApplicationCSS(' + JSON.stringify( cfg.code.toString().replace(/[\s]+/g, ' ' ) ) + ') ).toString( "PID-" + $pid ).chain( function() { dlg.addCss( this ); } )';
        
        return new JSIde_StringObject( out, cfg );
    }
}));