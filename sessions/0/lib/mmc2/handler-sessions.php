<?php

    $do = isset( $_POST['do'] ) ? $_POST['do'] : die("What to do?");
    
    switch ($do) {
        
        case "get-sessions-list":
            $out = array(
                array(
                    'id' => 'grp_sessions:0',
                    'name' => 'All Sessions',
                    'icon' => 'img/mmc2/s0.gif'
                )
            );
            $sql = "SELECT id, description FROM $__DBADMIN__.admin_servers ORDER BY description";
            $result = mysql_query($sql) or die("Could not select sessions: MySQL Error: " . mysql_error() );
            while ($row = mysql_fetch_array($result, MYSQL_ASSOC ) ) {
                $out[] = array(
                    'id' => 'grp_sessions:' . $row['gid'],
                    'name' => $row['description'],
                    'icon' => 'img/mmc2/s.gif'
                );
            }
            echo json_encode($out);
            break;
        
        case "enum-sessions":
            $out = array(
                array(
                    'id' => '0',
                    'name' => 'All Sessions'
                )
            );
            $sql = "SELECT id, description, name FROM $__DBADMIN__.admin_servers ORDER BY description";
            $result = mysql_query($sql) or die("Could not select sessions: MySQL Error: " . mysql_error() );
            while ($row = mysql_fetch_array($result, MYSQL_ASSOC ) ) {
                $out[] = array(
                    'id' => $row['id'],
                    'name' => $row['description']
                );
            }
            echo json_encode($out);
            break;
        case "enum-databases";
            $sql = "SHOW DATABASES";
            $result = mysql_query($sql) or die( mysql_error() );
            $out = array();
            
            while ($row = mysql_fetch_array( $result, MYSQL_ASSOC ) ) {
                // Hide some of them
                if ( in_array( $row['Database'], array( 'information_schema', 'mysql' ) ) )
                    continue;
                
                if ($row['Database'] == $__DBADMIN__)
                    $row['Database'] = "!$row[Database]";
                
                $out[] = $row['Database'];
            }
            
            echo json_encode($out);
            
            break;
        
        case "load-session";
            
            if (!policy_enabled('MMC_ACCESS'))
                die("Not enough rights to complete this action");
            
            $id = isset( $_POST['id'] ) ? (int)$_POST['id'] : die("Which id?");
            
            if ( $id > 0 ) {
            
                $sql = "SELECT `id`,
                               name AS `databaseName`, #it was a bug unfortunately in the past which cannot change this
                               description AS `name`,
                               startup AS `startup`,
                               policy_id AS policyId
                        FROM $__DBADMIN__.admin_servers
                        WHERE id = $id
                        LIMIT 1";
                
                $result = mysql_query( $sql ) or die( mysql_error() );
                
                if (!mysql_num_rows( $result ) )
                    die("Session #$id was not found!");
            
                $out = mysql_fetch_array( $result, MYSQL_ASSOC );
            
            } else {
                
                $out = array(
                    'id' => '0',
                    'name' => 'All Sessions',
                    'databaseName' => $__DBADMIN__,
                    'policyId' => '0',
                    'startup' => @file_get_contents('.startup_0') . ''
                );
                
            }
            
            /* Load session defines */
            
            $sql = "SELECT name, value
                    FROM $__DBADMIN__.admin_defines
                    WHERE $__DBADMIN__.admin_defines.server = $id
                    ORDER BY name";
                
            $out['variables'] = array();
            
            $result = mysql_query( $sql ) or die(mysql_error() );
            
            while ($row = mysql_fetch_array( $result, MYSQL_ASSOC ) )
                $out['variables'][] = $row;
            
            echo json_encode($out);
            
            break;
        
        case 'save-session':

            if (!policy_enabled('MMC_ACCESS'))
                die("Not enough rights to complete this action");
            
            $data = isset($_POST['data'] ) ? @json_decode( $_POST['data'], TRUE ) : die("Which data?");
            
            if (!is_array( $data ))
                die("Unserializeable data!");
            
            $data['name'] = mysql_escape_string( $data['name'] );
            $data['databaseName'] = mysql_escape_string( $data['databaseName'] );
            
            if ( "$data[id]" == '' ) {
                
                $data['startup'] = mysql_escape_string( $data['startup'] );
                
                //attempt to create the session in mysql
                $sql = "INSERT INTO $__DBADMIN__.admin_servers (
                            name, startup, description
                        ) VALUES (
                            '$data[databaseName]', '$data[startup]', '$data[name]'
                        )";
                
                $result = mysql_query( $sql ) or die("Could not create session entry: " . mysql_error() );
                
                function rollback( $sessionID, $errorMessage ) {
                
                    global $__DBADMIN__;
                
                    $sql = "DELETE FROM $__DBADMIN__.admin_policies WHERE code='SESS_$sessionID' LIMIT 1";
                    $result = mysql_query( $sql ) or die("Rollback: " . mysql_error() );
                
                    $sql = "DELETE FROM $__DBADMIN__.admin_defines WHERE server=$sessionID";
                    $result = mysql_query( $sql ) or die("Rollback: " . mysql_error() );
                
                    $sql = "DELETE FROM $__DBADMIN__.admin_servers WHERE id=$sessionID LIMIT 1";
                    $result = mysql_query( $sql ) or die("Rollback: " . mysql_error() );

                    if ( @is_dir( "sessions/$sessionID" ) )
                        @rmdir( "sessions/$sessionID" );
                    
                    die($errorMessage);
                }
                
                $data['id'] = mysql_insert_id();
                
                //attempt to create the session on the disk
                
                if (!@mkdir("sessions/$data[id]")) {
                    if (!@is_dir("sessions/$data[id]"))
                        rollback( $data['id'], 'Could not create the session root on server!' );
                }
                
                foreach ( array( 'Desktop', 'Start Menu', 'bin' ) as $folder ) {
                    if (!realpath( "sessions/$data[id]/$folder" ) ) {
                        if (!@mkdir( "sessions/$data[id]/$folder" ) )
                            rollback( $data['id'], "Could not create sessions/$data[id]/$folder" );
                    }
                }
                
                //now create session's policy id ...
                $sql = "INSERT INTO $__DBADMIN__.admin_policies ( `name`, `code`, `description`, `enabled`, `default`, `hidden` )
                        VALUES ( 'Session: session #$data[id]', 'SESS_$data[id]', 'Allow access to session #$data[id] on server', 1, 0, 1 )";
                
                $result = mysql_query( $sql ) or rollback( $data['id'], "Could not create session's policy!" );
                
                $data['policyId'] = mysql_insert_id();
                
                $sql = "UPDATE $__DBADMIN__.admin_servers SET policy_id = $data[policyId] WHERE id=$data[id] LIMIT 1";
                $result = mysql_query( $sql ) or rollback( $data['id'], "Could not update session's policy!" );
                
            } else {
                
                $data['id'] = (int)$data['id'];
                
                if ($data['id'] > 0 ) {
                
                    $data['startup'] = mysql_escape_string( $data['startup'] );
                    
                    $sql = "UPDATE $__DBADMIN__.admin_servers
                            SET name='$data[databaseName]', startup='$data[startup]', description='$data[name]'
                            WHERE id=$data[id] LIMIT 1";
                    
                    $result = mysql_query($sql) or die("Could not update session data on server: " . mysql_error() );
                
                } else {
                    
                    // just store the startup code
                    if ( @file_put_contents( ".startup_0", $data['startup'] ) === FALSE )
                        die("Could not store master session startup code on server!" );
                }
                
                // we not setup the session's variables...
                
                $sql = "DELETE FROM $__DBADMIN__.admin_defines WHERE server = $data[id]";
                $result = mysql_query( $sql );
                if (!$result) {
                    if ( function_exists( 'rollback' ) )
                        rollback( $data['id'], "Could not clear the admin_defines!" );
                    else
                        die("Clear admin defines: " . mysql_error() );
                }
                
                /* Update admin defines */
                foreach ($data['variables'] as $variable ) {
                    
                    $variable['name'] = mysql_escape_string( $variable['name'] );
                    $variable['value']= mysql_escape_string( $variable['value'] );
                    
                    $sql = "INSERT INTO $__DBADMIN__.admin_defines ( `server`, `name`, `value` )
                            VALUES ( $data[id], '$variable[name]', '$variable[value]' )";
                    
                    $result = mysql_query( $sql );
                    
                    if (!$result) {
                        if ( function_exists( 'rollback' ) )
                            rollback( $data['id'], "Could not insert in admin_defines!" );
                        else
                            die("Insert in admin defines: " . mysql_error() );
                    }
                }
            }
            
            // print_r( $data );
            echo $data['id'];
            
            break;
        
        case 'delete-session':
            
            if (!policy_enabled('MMC_ACCESS'))
                die("Not enough rights to complete this action");
            
            if (!isset( $_SESSION ) || !isset( $_SESSION['UID'] ) || ( $_SESSION['UID'] != 1 ) )
                die("Only user with user id = 1 ( root ) can delete sessions!");
            
            $id = isset( $_POST['id'] ) ? (int)$_POST['id'] : die("Which id?");
            
            if ($id < 1 )
                die("Access denied while deleting session #$id");
            
            /* Delete sessions mappings */
            $sql = "DELETE FROM $__DBADMIN__.admin_defines WHERE server=$id";
            $result = mysql_query( $sql ) or die( mysql_error() );
            
            /* Delete session's associated policy */
            $sql = "DELETE FROM $__DBADMIN__.admin_policies WHERE code='SESS_$id' AND hidden=1 LIMIT 1";
            $result = mysql_query( $sql ) or die( mysql_erorr() );
            
            /* Delete effective server */
            $sql = "DELETE FROM $__DBADMIN__.admin_servers WHERE id=$id LIMIT 1";
            $result = mysql_query( $sql ) or die( mysql_error() );

            function delTree($dir){
                $files = array_diff( scandir($dir), array('.','..') );
                foreach ( $files as $file )
                    (is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file");
                return rmdir($dir);
            }
            
            if ( is_dir( "sessions/$id" ) )
                @delTree( "sessions/$id" );
            
            echo json_encode('ok');
            
            break;
    }

?>