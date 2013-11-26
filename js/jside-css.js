function JSIde_ApplicationCSS( cssString, dlg ) {
    var parser = new CSS_Modifier( cssString );

    this.toString = function( pidString ) {
        return parser.inject( pidString ? '.' + pidString + ' ' : '.design-mode ' );
    }
    
    this.setAttribute = function() {};
    
    return this;
}