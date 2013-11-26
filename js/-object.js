Object.defineProperty(
    Object.prototype, "renameProperty", {
        "get": function() {
            return function( oldProperty, newProperty ) {
                if ( typeof this[ oldProperty ] != 'undefined' ) {
                    this[ newProperty ] = this[ oldProperty ];
                    delete this[ oldProperty ];
                }
                return this;
            }
        }
    }
);