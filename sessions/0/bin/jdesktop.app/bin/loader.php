<?php

    if (!isset($_SESSION)) session_start();
    $uid = isset($_SESSION['UID']) ? (int)$_SESSION['UID'] : '0';
    $sid = isset($_SESSION['SESSION_INDEX']) ? (int)$_SESSION['SESSION_INDEX'] : die("Illegal session index!");
    
    if (file_exists("home/$uid/.jdesktop.$sid")) {
        readfile("home/$uid/.jdesktop.$sid");
    } else {
        echo json_encode(array(
            'appearence'=>array(
                'bgcolor'=>'#000000',
                'bgpos'=>'0% 0%',
                'bgurl'=>'',
                'bgrepeat'=>'repeat'
            ),
            'icons'=>array(
            )
        ));
    }

?>