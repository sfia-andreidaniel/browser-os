function MMC2_Menu( app ){
    
    app.getMenu = function(context) {
        
        context = context || '';
        
        var menu = [{
            "caption": "Console",
            "enabled": true,
            "items": [{
                "caption": "Refresh",
                "id": "cmd_refresh",
                "icon": "data:image/gif;base64,R0lGODlhEAAQAOZ/AFmy/6LR/73W87zi/6DT/+b0/63C5OXz/9Hp/57P/7Hg/3W//+31/CyE0Uyf6SqA0nS+/0N5w4q14yyL5YWl1pvM/tbh9MXi/3nB/7Df/xqA7Pj5/KHU/26n3M7d80it/1J+wiqX/3W+/xR0xiqV/E+J1rrk/0qG20uh4dbm9vb7/0+u/4Wp4G+q5ESa4J2+5pC+5zSL4rzl/yp50BBYsWuz72uc1evy/GWb3f3+/zd3yVKj4UOn/3a3+ByQ+GCm7CKA1qrM7Nrm9j16yJbM/z2n/5/P/yd71cTd9ojK/5jP/47J/4On2zqh/8Dk/7fc/5Sx3VKf43Sj3FiOzTyK1iZ4zxhcvVqk6ojC737D/yR72G+c2kqH1c7k9+Pr+YXC/Xax573g/5TM/26q31ew/yd700J8x7TM6qXA5iqC2kqS1kqMzkii6xqI3KDZ/3CNx7DU842y4aHK70qHyKzE6VaR3UKQ3yBxz2O3/8Tb9Dp/zVSb1xhuzqTS/4+66P///yH5BAEAAH8ALAAAAAAQABAAAAeigH+Cg4SFhjAuQA9rZ4aDNT4kTTwLRy+Ocm1YcGATZBgzFnUnhC0Fg0gxIkk0FTqOg3E9YkoZEYMqOYQ3FHoEAQoggkEoO2wOUV02bjJOAyZvgh0HF08cWWMeOCVcc2YGgnsIfUYNEgyFG4NqYQlEP36wglRfI0sQaXmDXiyEdlcpquABoEUKHSZW0DgSUGbFhyIhNGyRJ2TKHT5DoMjbKCgQADs=",
                "enabled": true,
                "handler": app.appHandler
            }, 

            null,

            {
                "caption": "Quit",
                "id": "",
                "icon": "data:image/gif;base64,R0lGODlhEAAQAPcAAAQCBISGRPz+hPx6fPz+pPwCBLy+XPz+vBcNFR4AAAAAAAAAAAAZ3gAcABYQAAD6AA7HNQAEOQCF1wAfWgAXeAIAPwAAAwAAAAABKgEAAwAAIAAAAFgdaOkAPxMAAwAAAHkT2wgAGoIA13wAWgABDAAA9wEAEwAAAFYHcAAAJgAARgAAAGAIhOgAABMAAAAAADEJKpcAA5IAIHwAAIAAhOkAABMAAAAAABgAAO4AAJAAAHwAAHAA3gXwAJH9O3x/Af8sBP/qAP8TAP8AAG0G4gXEBJHYAHxaABVg6QpA34ID1HwAdwDeAAAAABYAAAAAAGA7AQMBAAAAAAAAACjsAS3qABoTAAAAAGgDAGrWABbYAABaAABg6QBA3wAD1AAAd34FBQAAAAAAAMAAAAAqWAAD6wAgEwAAAP9osf8/wv8D2P8AWv+Ee/8Aw/8A2P8AWgAAAAAAAAABAAAAAAABAAAAAAACAAAAAACg3gAAABYAOwAAAZAjEukAnxMAgAAAfGIRqAkA24IAFnwAAGgEAGoAABYAAAAAANsDBwUAAIIAAHwAAEAAAHgAAFAAAAAAAGgAAGoA0AEAFgAAAGwEAAAAAAAAAAAAAMyuAOhSABMAAAAAAACoAADqAAATAAAAAAiDAPwqABOCAAB8ABgAGO4An5AAgHwAfHAA/wUA/5EA/3wA//8AEv8An/8AgP8AfG0pCwW3AJGSAHx8AEqoC/bbAIAWAHwAAAC+WAA+8RaCEwB8AAD//wD//wD//wD//2gAAGoAABYAAAAAAACM1AHq6wATEwAAAAC+xgA+PACCTAB8AFcItPb864ATE3wAALgYd+ruEBOQTwB8AGgA6Gq36xaSEwB8AAL/vgD/PgD/ggD/fACobwDb7QAWEwAAAAC+8wA+/wCC/wB8fwDQZADr7QATEwAAAADdqAA/2wCCFgB8AAEWvgA/PgCCggB8fB4BqAAA2wAAFgAAAAAxrgAAUgAwAAAAAAATAAAAAAAAAAAAABVxtgA56gDXRwBaACH5BAAAAAAALAAAAAAQABAABwhoAAkcGEhQIEGCBggINHhgwICFAw0kFECxosWKEhVWBMCxI8aJGy0C+KiR4siQFDMS2HhSQMuMLjsWOPkyIQEABXLmHFlTYUecNEmuNNmyp8ijKW3+XNpR5cWnAjIGmEq1alUDVrNaDQgAOw==",
                "enabled": true,
                "handler": app.appHandler
            }]
        }];
        
        var contextMenu = {
            "caption": "Actions",
            "items": []
        };
        
        for ( var i=0, len=MMC2_ConfigRoot.length; i<len; i++ ) {
            if ( MMC2_ConfigRoot[i].context ) {
                for ( var contextName in MMC2_ConfigRoot[i].context ) {
                    //console.log("Test: ", contextName );
                    if ( MMC2_ConfigRoot[i].context.propertyIsEnumerable( contextName ) 
                         && context.indexOf( contextName.toString() ) == 0
                    ) {
                        for ( var k=0,lenk=MMC2_ConfigRoot[i].context[ contextName ].length; k<lenk; k++ ) {
                            var mitem = JSON.parse( JSON.stringify( MMC2_ConfigRoot[i].context[ contextName ][k] ) )
                            contextMenu.items.push( !mitem ? mitem : mitem.chain(function(){
                                this.handler = function() {
                                    return app.snapInInterface.appHandler.apply( app.snapInInterface, Array.prototype.slice.call( arguments, 0 ) );
                                }
                            }) );
                        }
                    }
                    
                }
                
            }
        }
        
        if ( contextMenu.items.length )
            menu.push( contextMenu );
        
        app.menu = menu;
    };
    
    app.getMenu();
}