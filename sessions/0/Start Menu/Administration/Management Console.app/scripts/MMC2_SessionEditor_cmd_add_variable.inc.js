function MMC2_SessionEditor_cmd_add_variable( app ) {

    app.variables.add = function( name, value ) {
        var row = app.variables.tr([ name, value ]);
        row.cells[0].editable = true;
        row.cells[1].editable = true;
        row.primaryKey = getUID();
    }

    app.variables.update = function( colName, oldValue, newValue ) {
        return newValue != '';
    }

    app.handlers.cmd_add_variable = function() {
        var newVar = 'MyVar';
        var seen = 0;
        var ok = true;
        do {
            ok = true;
            for ( var i=0,len=app.variables.tbody.rows.length; i<len; i++ ) {
                if ( app.variables.tbody.rows[i].cells[0].value == ( newVar + ( seen == 0 ? '' : seen ) ) ) {
                    ok = false;
                    break;
                }
            }
            if ( !ok )
                seen++;
            else {
                newVar = newVar + ( seen == 0 ? '' : seen );
            }
        } while ( !ok );
        
        app.variables.add( newVar, 'Value' );
        app.variables.render();
    }
}