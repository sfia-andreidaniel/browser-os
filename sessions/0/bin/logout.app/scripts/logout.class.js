function LogOut() {
    
    DialogBox('Are you sure you want to LogOut from this server?\n\nYou will loose any unsaved data in active applications', {
        "modal": true,
        "caption": "Confirm LogOut",
        "type": "warning",
        "buttons": {
            "Yes": function() {
                $_POST('logout.php');
                window.location.reload();
            },
            "No": function() {
                
            }
        }
    });
    
    return this;
}