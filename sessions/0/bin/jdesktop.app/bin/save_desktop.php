<?php

    if (!isset($_SESSION)) session_start();
    $do = isset( $_POST['do'] ) ? $_POST['do'] : 'save-desktop';
    
    switch ($do) {
        
        case 'save-desktop':
            $uid = isset($_SESSION['UID']) ? (int)$_SESSION['UID'] : '0';
            $sid = isset($_SESSION['SESSION_INDEX']) ? (int)$_SESSION['SESSION_INDEX'] : die("Illegal session index!");
            $save_to = "home/$uid/.jdesktop.$sid";
            $settings= json_encode(isset($_POST['settings']) ? $_POST['settings'] : array('icons'=>array(), 'appearence'=>array('bgcolor'=>'#000000','bgpos'=>'0px 0px','bgurl'=>'','bgrepeat'=>'repeat')));
            if (file_put_contents($save_to, $settings)) echo json_encode('ok'); else die("Error saving desktop settings to file '$save_to'\nCheck if the path is accessible and if you have write permissions to that file");
            break;
        
        case 'get-theme':
            $uid = isset($_SESSION['UID']) ? (int)$_SESSION['UID'] : '0';
            $sid = isset($_SESSION['SESSION_INDEX']) ? (int)$_SESSION['SESSION_INDEX'] : die("Illegal session index!");
            $read_from = @file_get_contents( "home/$uid/.theme" );
            $read_from = empty( $read_from ) ? "default" : $read_from;
            echo json_encode( $read_from );
            break;
        
        case 'set-theme':
            $uid = isset($_SESSION['UID']) ? (int)$_SESSION['UID'] : '0';
            $sid = isset($_SESSION['SESSION_INDEX']) ? (int)$_SESSION['SESSION_INDEX'] : die("Illegal session index!");
            $write_to = "home/$uid/.theme";
            $theme = isset( $_POST['theme'] ) ? $_POST['theme'] : die("Which theme?");
            
            if (!preg_match('/^[a-z0-9\-_]([a-z0-9\-_\.]+)?$/i', $theme) )
                die("Bad theme name!");
            
            file_put_contents( $write_to, $theme );
            echo json_encode('ok');
            break;
        
        default:
            die("invalid handler command: '$do' in " . __FILE__ );
            break;
    }

?>