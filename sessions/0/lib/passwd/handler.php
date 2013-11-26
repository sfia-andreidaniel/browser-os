<?php

    $old_password = isset($_POST['old_pass']) ? md5($_POST['old_pass']) : die("You forgot to specify your old password!");
    $new_password = isset($_POST['new_pass']) ? md5($_POST['new_pass']) : die("You forgot to specify your new password!");
    
    if (!isset($_SESSION['UNAME']) or strlen($_SESSION['UNAME']) == 0) die("Sorry, we could not determine your user name. Check if you are logged in to system!");
    
    $user = mysql_escape_string($_SESSION['UNAME']);
    
    //check if old password is valid
    
    $sql = "SELECT COUNT(*) FROM $__DBADMIN__.admin_auth WHERE user='$user' AND pass='$old_password' LIMIT 1";
    $result = mysql_query($sql) or die("Server error!");
    
    list($is_correct) = mysql_fetch_row($result);

    if ($is_correct != 1) {
	sleep(5);
	die("Sorry, your old password is incorrect.");
    }
    
    $sql = "UPDATE $__DBADMIN__.admin_auth SET pass='$new_password' WHERE user='$user' LIMIT 1";
    
    $result = mysql_query($sql) or die("Error updating your password!");
    
    echo json_encode('ok');

?>