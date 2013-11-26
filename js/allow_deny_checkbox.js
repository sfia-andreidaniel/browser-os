function AllowDenyCheckbox( value ) {
    var holder = $('div', 'AllowDenyCheckbox');
    
    var state = '';
    
    holder.tabIndex = 0;

    Object.defineProperty( holder, 'value', {
        "get": function() {
            return state;
        },
        "set": function(stateValue) {
            if (['allow', 'deny', '+', '-', '', null, false, 0].indexOf(stateValue) == -1)
                throw "Invalid state";
                
            stateValue = (stateValue == '+' ? 'allow' : 
                (stateValue == '-' ? 'deny' : stateValue)
            );
            
            removeStyle(holder, state);
            state = stateValue || '';
            addStyle(holder, state);
        }
    });
    
    EnableCustomEventListeners(holder);
    
    holder.click = function(e) {
        switch (holder.value) {
            case '': holder.value = 'allow'; break;
            case 'allow': holder.value = 'deny'; break;
            case 'deny': holder.value = ''; break;
        }
        
        holder.onCustomEvent('click', holder.value);
    };
    
    holder.addEventListener('click', holder.click);
    Keyboard.bindKeyboardHandler( holder, 'space', holder.click );
    disableSelection( holder );

    return holder;
}