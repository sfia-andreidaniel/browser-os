<?php

    if (!isset($_SESSION)) session_start();
    
    $do = isset( $_POST['do'] ) ? $_POST['do'] : "default";

    switch ($do) {

        case 'default':
        

            $sid = isset($_SESSION['SESSION_INDEX']) ? (int)$_SESSION['SESSION_INDEX'] : 0;
            $uid = isset($_SESSION['UID']) ? (int)$_SESSION['UID'] : 0;
    
            if ($uid == 0) $sid = -1;
    
            if ($sid > 0) {
                if (!is_dir("home/$uid")) mkdir("home/$uid");
            }
    
            echo json_encode($sid);
            
            break;
        
        case 'check-install':
        
            echo json_encode( !defined( 'NO_DATABASE' ) ? FALSE : TRUE );
            
            break;
    }
?>