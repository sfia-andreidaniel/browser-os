<?php

try {

    $do = isset( $_POST['do'] ) ? $_POST['do'] : die("Which do?");
    
    require_once "classes/JSPlatform_UserStorage.class.php";
    $storage = new JSPlatform_UserStorage();
    
    switch ($do) {
        case 'set-item':
            $name = isset( $_POST['name'] ) ? $_POST['name'] : die("Which name?");
            $value= isset( $_POST['value'] ) ? $_POST['value'] : die("Which value?");
            $value = @json_decode( $value, TRUE );
            $storage->setItem( $name, $value );
            echo '"ok"';
            break;
        case 'get-item':
            $name = isset( $_POST['name'] ) ? $_POST['name'] : die("Which name?");
            echo json_encode( $storage->getItem($name) );
            break;
        case 'remove-item':
            $name = isset( $_POST['name'] ) ? $_POST['name'] : die("Which name?");
            echo $storage->removeItem( $name ) ? '"ok"' : "Failed to remove item $name";
            break;
        default:
            throw new Exception("Invalid handler command $do in " . __FILE__);
    }

} catch (Exception $e) {
    die( "Exception: " . $e->getMessage() . "\nLINE: " . $e->getLine() . "\nFILE: " . $e->getFile() );
}

?>