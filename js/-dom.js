Object.defineProperty( Node.prototype, "offsetBottom", {
    "get": function() {
        return this.offsetTop + this.offsetHeight;
    }
} );

Object.defineProperty( Node.prototype, "offsetRight", {
    "get": function() {
        return this.offsetLeft + this.offsetWidth;
    }
} );
