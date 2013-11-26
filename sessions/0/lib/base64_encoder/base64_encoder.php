<?php

    $do = isset($_POST['do']) ? $_POST['do'] : false;
    
    function js_die($msg) {
        $_SESSION['BASE64_ENCODER_ERROR'] = $msg;
        die("");
    }
    
    switch ($do) {
        case false: 
            if (!is_uploaded_file($_FILES['localfile']['tmp_name'])) js_die("Error: a file was expected!");
            $contents = base64_encode(file_get_contents($_FILES['localfile']['tmp_name']));
            
            $ext = pathinfo($_FILES['localfile']['name']);
            $ext['extension'] = isset($ext['extension']) ? strtolower($ext['extension']) : '';
            
            $mime = false;
            
            switch ($ext['extension']) {
                case 'jpg':
                case 'jpeg': $mime = 'image/jpeg'; break;
                case 'png': $mime = 'image/png'; break;
                case 'gif': $mime = 'image/gif'; break;
            }
            
            if ($mime !== false) {
                $contents = "data:$mime;base64,$contents";
            }
            
            $_SESSION['base64_encoder'] = $contents;
            
            break;
        case 'fetch': {
            
            echo json_encode(array(
                'error'=>isset($_SESSION['BASE64_ENCODER_ERROR']) ? $_SESSION['BASE64_ENCODER_ERROR'] : false,
                'content'=>isset($_SESSION['base64_encoder']) ? $_SESSION['base64_encoder'] : false
            ));
            
            if (isset($_SESSION['BASE64_ENCODER_ERROR'])) unset($_SESSION['BASE64_ENCODER_ERROR']);
            if (isset($_SESSION['base64_encoder'])) unset($_SESSION['base64_encoder']);
            
            break;
        }
    }

?>