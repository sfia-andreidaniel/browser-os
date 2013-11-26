<?php

    function error( $str ) {
        header("Content-Disposition: attachment; name=error.txt");
        header("Content-Type: text/plain; charset=utf-8");
        die( $str );
    }

    $cfg = isset( $_POST['cfg'] ) ? @json_decode( $_POST['cfg'], TRUE ) : error("Which cfg?");

    if (!is_array( $cfg ) )
        error("The POST parameter 'cfg' is not JSON parseable ( or not an array structure )");

    $data = isset( $_POST['data'] ) ? $_POST['data'] : error("Which data?");
    
    if ( isset( $cfg['encType'] ) ) {
        
        switch ( $cfg['encType'] ) {
            case 'base64':
                $data = @base64_decode( $data );
                break;
            default:
                error("Bad contentType: accepted only 'base64' only at this point!");
                break;
        }
        
    }

    if ( isset( $cfg['contentType'] ) )
        header("Content-Type: " . $cfg['contentType'] );
    
    if ( isset( $cfg['name'] ) )
        header("Content-Disposition: attachment; name=\"" . $cfg['name'] . "\"" );
    else
        header("Content-Disposition: attachment; name=\"unnamed-file\"");
    
    echo $data;

?>