function MMC2_ServerInfo_cmd_server_info_refresh( app ) {
    
    app.handlers.cmd_server_info_refresh = function() {
        app.hwInfo.clear();
        app.swInfo.clear();
        
        var req = [];
        req.addPOST('do', 'get-server-info');
        var rsp = $_JSON_POST( app.handler, req );
        if ( !rsp )
            return;
        
        if ( rsp.hwInfo ) {
            for ( var i=0,len=rsp.hwInfo.length; i<len; i++ ) {
                var row = app.hwInfo.tr( [ rsp.hwInfo[i].name, rsp.hwInfo[i].value ] );
                
                (function( rw ) {
                    
                    rw.cells[1].render = function( div,v ) {
                        div.innerHTML = '';
                        div.appendChild( $text( v ) );
                        
                        if ( !v ) {
                            rw.cells[0].firstChild.style.fontWeight = 'bold';
                            rw.style.borderBottom = '1px solid blue';
                            rw.style.zIndex = '10000000';
                        }
                    }
                    
                })( row );
                
            }
            app.hwInfo.render();
        }
        
        if ( rsp.swInfo ) {
            for ( var i=0,len=rsp.swInfo.length; i<len; i++ ) {
                var row = app.swInfo.tr( [ rsp.swInfo[i].name, rsp.swInfo[i].value ] );
                
                ( function( rw ) {
                    
                    rw.cells[1].render = function( div,v ) {
                        div.innerHTML = '';
                        div.appendChild( $text( v ) );
                        
                        if ( !v ) {
                            rw.cells[0].firstChild.style.fontWeight = 'bold';
                            rw.style.borderBottom = '1px solid blue';
                            rw.style.zIndex = '10000000';
                        }
                    }
                    
                } )( row );
            }
            app.swInfo.render();
        }
        
        console.log( rsp );
    }
    
}