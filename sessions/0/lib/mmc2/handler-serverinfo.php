<?php

    $do = isset( $_POST['do'] ) ? $_POST['do'] : die("What to do?");
    
    switch ($do) {
        
        case 'get-server-info':
            
            $info = array();
            
            $cpuinfo = @file_get_contents( '/proc/cpuinfo' );
            
            if ( $cpuinfo ) {
                
                $mode = 'next';
                
                $info[] = array(
                    'name' => 'Processor(s)',
                    'value' => ''
                );
                
                $lines = explode("\n", $cpuinfo );
                
                $index  = 0;
                $model = 'unknown vendor';
                $speed  = 'unknown speed';
                
                foreach ($lines as $line) {
                    
                    $line = trim( $line );
                    
                    switch ($mode) {
                        case 'next':
                            if ( preg_match('/^processor([\s]+)?\:([\s]+)?([\d]+)$/', $line, $matches ) ) {
                                $index = $matches[3];
                                $mode = 'model';
                            }
                            break;
                        case 'model':
                            if ( preg_match('/^model name([\s]+)?\:([\s]+)?(.*)$/', $line, $matches ) ) {
                                $model = $matches[3];
                                $mode = 'speed';
                            }
                            break;
                        case 'speed':
                            if ( preg_match('/^cpu MHz([\s]+)?\:([\s]+)?(.*)$/', $line, $matches ) ) {
                                $speed = $matches[3];
                                $mode = 'next';
                                
                                $info[] = array(
                                    'name' => ( $index + 1 ),
                                    'value' => $model . ' ( @' . $speed . ' Mhz )'
                                );
                            }
                            break;
                    }
                }
            }
        
            $arpinfo = @file_get_contents( '/proc/net/arp' );
            
            if ($arpinfo) {
                
                $info[] = array(
                    'name' => 'Network',
                    'value' => ''
                );
                
                $lines = explode( "\n", $arpinfo );
                
                foreach ( $lines as $line ) {
                    
                    if ( preg_match('/^([\S]+)[\s]+0x[\S]+[\s]+0x[\S]+[\s]+([a-f\d\:]+)[\s]+([\S]+)[\s]+([a-z\d\_]+)$/', $line, $matches ) ) {
                        $info[] = array(
                            'name' => $matches[4],
                            'value' => 'IP: ' . $matches[1] . ' MAC: ' . $matches[2]
                        );
                    }
                    
                }
                
            }
            
            $meminfo = @file_get_contents( '/proc/meminfo' );
            
            if ( $meminfo ) {
                
                $info[] = array( 'name' => 'Memory', 'value' => '' );
                
                $lines = explode("\n", $meminfo );
                
                foreach ($lines as $line) {
                
                    $line = trim( $line );
                    
                    if ( preg_match('/^(MemTotal|MemFree|SwapTotal|SwapFree)\:([\s]+)?(.*)$/', $line, $matches ) )  {
                        $info[] = array(
                            'name' => $matches[1],
                            'value' => $matches[3]
                        );
                    }
                }
                
            }
            
            $uptimeInfo = @file_get_contents( '/proc/uptime' );
            
            if ($uptimeInfo) {
                if ( preg_match('/^([\d]+)/', $uptimeInfo, $matches ) ) {
                    
                    $info[] = array( 'name' => 'Uptime', 'value' => '' );
                    
                    $info[] = array( 'name' => 'Duration', 'value' => $matches[1] . ' seconds' );
                    
                }
            }
        
            $versionInfo = @file_get_contents( '/proc/version' );
            
            if ($versionInfo) {
                $info[] = array( 'name' => 'Operating System', 'value' => '' );
                $info[] = array( 'name' => 'Version', 'value' => trim( $versionInfo ) );
            }
        
            $mountInfo = @file_get_contents( '/proc/mounts' );
            
            if ($mountInfo) {
                
                $lines = explode("\n", $mountInfo );
                
                $info[] = array( 'name' => 'Mounted Locations', 'value' => '' );
                
                foreach ($lines as $line) {
                    
                    $line = trim( $line );
                    
                    if ( preg_match('/^(.*)[\s]+(.*)[\s]+(.*)[\s]+(.*)[\s]+(.*)[\s]+(.*)$/', $line, $matches ) ) {
                        
                        if ($matches[1] != 'none') {
                            $info[] = array(
                                'name' => $matches[1],
                                'value' => $matches[3] . ', in "' . $matches[2] . '", ' . number_format( ( @disk_free_space( $matches[2] ) / ( 1024 * 1024 ) ), 2, '.', '' ) . ' Mb free'
                            );
                        }
                        
                    }
                    
                }
                
            } else {
                $info[] = array( 'name' => 'Mounted Locations', 'value'=> 'Error reading' );
            }
        
            $sinfo = array();
            
            $sinfo[] = array( 'name' => 'Core components', 'value' => '' );
            $sinfo[] = array( 'name' => 'PHP', 'value' => 'Installed, version: ' . phpversion() );
            $sinfo[] = array( 'name' => 'WEBSERVER', 'value' => 'Installed, version: ' . $_SERVER['SERVER_SOFTWARE'] . ', vhost: "' . $_SERVER['SERVER_NAME'] . '"' );
        
            $sinfo[] = array( 'name' => 'PHP components', 'value' => '' );
            
            $check = array(
                'gd',
                'curl',
                'zip',
                'mongo',
                'memcache',
                'memcached',
                'mcrypt',
                'ldap',
                'mysql',
                'dom',
                'ssh2',
                'v8js',
                'pdo',
                'xdebug'
            );
            
            foreach ($check as $extension) {
                
                if ( ( $version = phpversion( $extension ) ) !== FALSE || ( $version = extension_loaded( $extension ) ? 'Built In' : '' ) ) {
                    $sinfo[] = array( 'name' => 'php ' . $extension, 'value' => 'Installed, ' . ( $version == 'Built In' ? $version : " version: " . $version ) );
                } else {
                    $sinfo[] = array( 'name' => 'php ' . $extension, 'value' => 'Not installed' );
                }
                
            }
            
            $sinfo[] = array( 'name' => 'Other (3rd party) components', 'value' => '' );
            
            // FFMPEG Detection
            
            $cmd = "`/usr/bin/which ffmpeg` -version";
            $found = reset( explode( "\n", trim( `$cmd` ) ) );
            
            if ( strlen ($found) ) {
                $sinfo[] = array( 'name' => 'ffpmeg', 'value' => 'Installed, version: ' . $found );
            } else
                $sinfo[] = array( 'name' => 'ffmpeg', 'value' => 'Not detected' );
            
            // MENCODER Detection
            
            $cmd = "`/usr/bin/which mencoder`";
            $found = reset( explode( "\n", trim( `$cmd` ) ) );
            
            if ( strlen ($found) ) {
                $sinfo[] = array( 'name' => 'mencoder', 'value' => 'Installed, version: ' . $found );
            } else
                $sinfo[] = array( 'name' => 'mencoder', 'value' => 'Not detected' );

            // DOCSPLIT Detection
            
            $cmd = "`/usr/bin/which docsplit` --version";
            $found = reset( explode( "\n", trim( `$cmd` ) ) );
            
            if ( strlen ($found) ) {
                $sinfo[] = array( 'name' => 'docsplit', 'value' => 'Installed, version: ' . $found );
            } else {
                $sinfo[] = array( 'name' => 'docsplit', 'value' => 'Not detected' );
            }
            
            // SHELLINABOX Detection
            
            $cmd = "`/usr/bin/which man` shellinaboxd";
            $found = reset( explode( "\n", trim( `$cmd` ) ) );
            
            if ( strlen ($found) ) {
                $sinfo[] = array( 'name' => 'shellinabox', 'value' => 'Installed' );
            } else {
                $sinfo[] = array( 'name' => 'shellinabox', 'value' => 'Not detected' );
            }
            
            // END Of components detection
            
            echo json_encode( array(
                'hwInfo' => $info,
                'swInfo' => $sinfo
            ) );
            
            
            
            break;
    }

?>