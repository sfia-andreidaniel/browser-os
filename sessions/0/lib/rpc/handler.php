<?php

    $do = isset($_POST['do']) ? $_POST['do'] : die("What to do?");
    
    switch ($do) {
        case 'logout':
            session_destroy();
            echo json_encode('ok');
            break;
        default:
            die("Unknown handler command '$do' in ".__FILE__);
            break;
    }

?>