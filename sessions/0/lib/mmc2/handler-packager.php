<?php

    $do = isset( $_POST['do'] ) ? $_POST['do'] : die("What to do?");
    
    switch ($do) {
        
        case 'enum-packages':
        
            if (!policy_enabled('MMC_ACCESS'))
                die( json_encode( array() ) );
                        
            $out = array();
            
            $files = array_diff( scandir( "build/" ), array( '.', '..' ) );
            
            foreach ($files as $file) {
                if ( preg_match( '/(.*)\.build$/', $file, $matches ) ) {

                    $packageName = $matches[1];
                    
                    if ( !strlen( $packageName ) )
                        continue;

                    $out[] = array(
                        'name' => $packageName,
                        'description' => ( file_exists( 'build/' . $packageName . ".description" )
                            ? @file_get_contents( "build/$packageName.description" )
                            : "No description available"
                        ),
                        'version'     => ( file_exists( 'build/' . $packageName . ".version" ) 
                            ? @file_get_contents( "build/$packageName.version" )
                            : "No version available"
                        ),
                        'id' => 'cmd_packager:'.$packageName,
                        'icon' => 'img/mmc2/serverp.png',
                        'buildable' => 'Yes',
                        'installed' => file_exists( $_SERVER['DOCUMENT_ROOT'] . '/' . $packageName . '.package' ) ? 'Yes' : 'No'
                    );
                }
            }
            
            /* Scan for .package files present in the server document root */
            
            $packages = scandir( $_SERVER['DOCUMENT_ROOT'] );
            
            function zip_get_contents( $zipName, $zipOpenedFile ) {
                $zip = $zipOpenedFile;
                $stream = @$zip->getStream( $zipName );
                if (!is_resource( $stream ))
                    return FALSE;
                $out = stream_get_contents( $stream );
                @fclose( $stream );
                return $out;
            }

            foreach ($packages as $package) {
                
                if (!preg_match('/^(.*)\.package$/', $package, $matches ) )
                    continue;
                
                /* Check if the package is allready included */
                
                $included = FALSE;
                $pkgname  = $matches[1];
                
                for ( $i=0,$len=count($out); $i<$len; $i++ ) {
                    if ( $out[$i]['name'] == $pkgname ) {
                        $included = TRUE;
                        break;
                    }
                }
                
                if (!$included) {
                
                    $zip = new ZipArchive();

                    if ( (@$zip->open( $_SERVER['DOCUMENT_ROOT'] . '/' . $pkgname . '.package' )) !== TRUE ) {
                        unset( $zip );
                        continue;
                    } else {
                        
                        $VERSION = zip_get_contents( '.version', $zip );
                        $NAME    = zip_get_contents( '.package-name', $zip );
                        $DESCRIPTION = zip_get_contents( '.package-description', $zip );
                        
                        if ($DESCRIPTION === FALSE)
                            $DESCRIPTION = '-';
                        
                        @$zip->close();
                        
                        if ($VERSION !== FALSE && strlen("$NAME") > 0 ) {
                            
                            $included = FALSE;
                            
                            /* Check if the name matches the pkgname */
                            for ( $i=0, $len=count($out); $i<$len; $i++ ) {
                                
                                if ($out[$i]['name'] == $NAME ) {
                                    
                                    if ($out[$i]['installed'] == 'No')
                                        $out[$i]['installed'] = 'Yes (' . $pkgname . '.package)';
                                    
                                    $included = TRUE;
                                    
                                    break;
                                }
                                
                            }
                            
                            if (!$included) {
                                
                                $out[] = array(
                                    'name' => $NAME,
                                    'description' => $DESCRIPTION,
                                    'version' => $VERSION,
                                    'id' => 'cmd_packager:' . $NAME,
                                    'icon' => 'img/mmc2/serverp.png',
                                    'buildable' => 'No',
                                    'installed' => $pkgname == $NAME ? 'Yes' : 'Yes (' . $pkgname . '.package)'
                                );
                                
                            }
                            
                        }
                        
                    }
                
                }

            }
            
            echo json_encode( $out );
            
            break;

        case 'server-info':
        
            if (!policy_enabled('MMC_ACCESS'))
                    die( json_encode( FALSE ) );
                        
        
            $info = array(
                'root' => realpath( $_SERVER['DOCUMENT_ROOT'] )
            );
            
            $info['user'] = posix_getpwuid(posix_geteuid());
            $info['group'] = posix_getgrgid( $info['user']['gid'] );
            
            $info['user'] = $info['user']['name'];
            $info['group']= $info['group']['name'];
            
            echo json_encode( $info );
            
            break;
        
        case 'package-info':
        
            if (!policy_enabled('MMC_ACCESS'))
                die( json_encode( FALSE ) );
                        
        
            $name = isset( $_POST['name'] ) ? $_POST['name'] : die("Which name?");
            
            if ( file_exists( $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . "$name.package" ) ) {
                
                echo json_encode( filesize( $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . "$name.package" ) );
                
            } else echo json_encode( FALSE );
            
            break;
    }

?>