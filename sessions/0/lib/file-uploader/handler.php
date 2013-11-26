<?php

    $do = isset( $_POST['do'] ) ? $_POST['do'] : die("What to do?");
    
    if (!isset( $_SESSION ) )
        session_start();
    
    $_SESSION['_FILES_'] = isset( $_SESSION['_FILES_'] ) ? $_SESSION['_FILES_'] : array();
    

    $tmpDst = sys_get_temp_dir() . "/.jsplatform";
            
    if (!is_dir( $tmpDst ) )
        if (!@mkdir( $tmpDst ) )
            die("Could not create temporary upload directory!");
    
    $tmpDst = realpath( $tmpDst );

    if ( rand( 0, 10 ) <= 1 ) {
        $files = @scandir( $tmpDst );
        if ( is_array( $files ) ) {
            $now = time();
            foreach ($files as $file) {
                if ( is_file( $_ = $tmpDst . '/' . $file ) ) {
                    $_ = realpath( $_ );
                    
                    if ( $_ && ( $now - filemtime( $_ ) > 300 ) ) {
                        @unlink( $_ );
                    }
                }
            }
        }
    }
    
    switch ($do) {
        case 'fopen':
            
            foreach ( array_keys( $_SESSION['_FILES_'] ) as $fileName )
                if ( !file_exists( $fileName ) )
                    unset( $_SESSION['_FILES_'][ $fileName ] );
            
            $name = isset( $_POST['name'] ) && strlen( $_POST['name'] ) ? $_POST['name'] : die("Which name?");
            
            $info = pathinfo( $name );
            
            $base = $info['basename'];
            $ext  = isset( $info['extension'] ) ? ( '.' . $info['extension'] ) : '';
            
            $base = substr( $base, 0, strlen( $base ) - strlen( $ext ) );
            
            /* Allocate file in the server temp filesystem */
            
            $prefix = 0;
            $serverName = '';
            $tries = 0;
            
            do {
                
                if ( $tries == 0 )
                    $serverName = $base . $ext;
                else
                    $serverName = $base . '_' . $tries . $ext;
                
                $tries++;
                
                $serverName = file_exists( $tmpDst . '/' . $serverName ) ? FALSE : ( $tmpDst . DIRECTORY_SEPARATOR . $serverName );
                
            } while ( $tries < 100 && $serverName === FALSE );
            
            if ($serverName === FALSE)
                die("Could not allocate a file name on server!");
            
            /* Create the file */
            
            if ( @file_put_contents( $serverName, '' ) === FALSE )
                die("Could not create the file on server!");
            
            $_SESSION['_FILES_'][ $serverName ] = 0;
            
            echo json_encode( $serverName );
            
            break;
        
        case 'fwrite':
        
            $data = isset( $_POST['data'] ) && strlen( $_POST['data'] ) ? $_POST['data'] : die("Which data?");
            $file = isset( $_POST['file'] ) && strlen( $_POST['file'] ) ? $_POST['file'] : die("Which file?");
            
            if (!isset( $_SESSION ) || !isset( $_SESSION['_FILES_'] ) || !isset( $_SESSION['_FILES_'][ $file ] ) )
                die("server protection fault!");
            
            $data = @base64_decode( $data );
            
            if ($data === FALSE )
                die("bad fwrite packed!");
            
            if (!@file_put_contents( $file, $data, FILE_APPEND ) )
                die("Could not write to file $file");
            
            $_SESSION['_FILES_'][ $file ] += strlen( $data );
        
            echo 'ok';
            break;
        
        default:
            die("Bad command");
            break;
    }

?>