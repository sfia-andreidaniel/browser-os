function MMC2_SessionEditor_cmd_remove_variable( app ) {

    app.handlers.cmd_remove_variable = function() {
        for ( var i = app.variables.tbody.rows.length - 1; i>=0; i-- )
            if ( app.variables.tbody.rows[i].selected )
                app.variables.deleteRow(i);
        app.variables.render();
    }
}