function JUserStorage( ) {

    var userStorage = function() {
        var handler = 'jfs/0/lib/juserstorage/handler.php';
        
        this.getItem = function( itemName, defaultValue ) {
            var req = [];
            req.addPOST('do', 'get-item' );
            req.addPOST('name', itemName );
            var rsp = $_POST( handler, req );
            
            defaultValue = defaultValue || null;
            
            if (rsp === null)
                throw "userStorage: could not fetch item: " + itemName;
            
            try {
                var data = JSON.parse( rsp );
                if ( data === null )
                    return defaultValue;
                else
                    return data;
            } catch (e) {
                console.warn("userStorage: Exception while parsing data for item: " + itemName + ": " + e + ". Returning default value!");
                return defaultValue;
            }
        }
        
        this.setItem = function( itemName, value ) {
            
            var req = [];
            req.addPOST( 'do', 'set-item' );
            req.addPOST( 'name', itemName || 'default' );
            
            req.addPOST( 'value', JSON.stringify( value ) );
            
            var rsp = $_JSON_POST( handler, req );
            
            return rsp == 'ok';
        }
        
        this.removeItem = function( itemName ) {
            var req = [];
            req.addPOST('do', 'remove-item');
            req.addPOST('name', itemName || 'default' );
            
            return $_JSON_POST( handler, req ) == 'ok';
        }
    };
    
    if ( typeof window.userStorage == 'undefined' ) {
        var storage = new userStorage();
        Object.defineProperty( window, "userStorage", {
            "get": function() {
                return storage;
            }
        } );
    }
}