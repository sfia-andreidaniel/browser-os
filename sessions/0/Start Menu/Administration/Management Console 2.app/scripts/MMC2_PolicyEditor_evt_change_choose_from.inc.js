function MMC2_PolicyEditor_evt_change_choose_from( app ) {
    
    var changeFunc = function() {
        app.members.setItems( app.entities[ app.chooseFrom.value ] );
    };
    
    app.chooseFrom.addEventListener('change', changeFunc );
    
    changeFunc();
}