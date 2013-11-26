<?php

    $do = isset( $_POST['do'] ) ? $_POST['do'] : die("What to do?");
    
    switch ($do) {
        
        case "get-users-list":
            $sql = "SELECT id, user, enabled FROM $__DBADMIN__.admin_auth ORDER BY id != 1, user";
            $out = array();
            $result = mysql_query($sql) or die("Could not select users: MySQL Error: " . mysql_error() );
            while ($row = mysql_fetch_array($result, MYSQL_ASSOC ) ) {
                $out[] = array(
                    'id' => 'cmd_users:' . $row['id'],
                    'name' => $row['user'],
                    'icon' => strtolower( $row['user'] ) == 'root'
                        ? 'img/mmc2/ur.png'
                        : ( $row['enabled'] == '1'
                            ? 'img/mmc2/u1.png'
                            : 'img/mmc2/u0.png'
                        )
                );
            }
            echo json_encode($out);
            break;
        
        case "enum-users":
        
            $sql = "SELECT $__DBADMIN__.admin_auth.id AS id,
                           $__DBADMIN__.admin_auth.user AS name,
                           $__DBADMIN__.admin_auth.enabled AS enabled,
                           TRIM( ( SELECT GROUP_CONCAT( CONCAT( ' ', $__DBADMIN__.admin_groups.name ) ) 
                             FROM $__DBADMIN__.admin_group_mappings
                             LEFT JOIN $__DBADMIN__.admin_groups
                                  ON $__DBADMIN__.admin_groups.gid = $__DBADMIN__.admin_group_mappings.gid
                             WHERE $__DBADMIN__.admin_group_mappings.uid = $__DBADMIN__.admin_auth.id
                             GROUP BY $__DBADMIN__.admin_group_mappings.uid
                           ) ) AS memberOf
                    FROM $__DBADMIN__.admin_auth
                    ORDER BY $__DBADMIN__.admin_auth.id != 1, name";
            
            $result = mysql_query( $sql ) or die( "Error: \n$sql" . "\n\n" . mysql_error() );
            
            $out = array();
            
            while ( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) ) {
                $row['id'] = (int)$row['id'];
                $row['enabled'] = (int)$row['enabled'];
                $out[] = $row;
            }
            
            echo json_encode( $out );
        
            break;
        
        case "load-user":
            
            if (!policy_enabled('MMC_ACCESS'))
                die("Not enough rights to complete this action");

            $id = isset( $_POST['id'] ) ? (int)$_POST['id'] : die("Which id?");
        
            $sql = "SELECT id                                  AS id,
                           user                                AS name,
                           enabled                             AS enabled,
                           IF ( expires IS NULL, '', expires ) AS expireDate,
                           email                               AS email,
                           phone                               AS phone,
                           description                         AS description
                    FROM $__DBADMIN__.admin_auth
                    WHERE id = $id
                    LIMIT 1";
            
            $result = mysql_query( $sql ) or die( mysql_error() );
            
            if (!mysql_num_rows( $result ) )
                die("User #$id was not found!");
            
            $user = mysql_fetch_array( $result, MYSQL_ASSOC );
            
            $user['id'] = (int)$user['id'];
            $user['enabled'] = (int)$user['enabled'];
            
            $user['members'] = array();
            
            $sql = "SELECT gid AS id
                    FROM $__DBADMIN__.admin_group_mappings
                    WHERE uid = $id";
            
            $result = mysql_query( $sql ) or die( mysql_error() );
            
            while ($row = mysql_fetch_row( $result ) )
                $user['members'][] = (int)reset( $row );
        
            echo json_encode( $user );
        
            break;
        
        case "save-user";

            if (!policy_enabled('MMC_ACCESS'))
                die("Not enough rights to complete this action");

            $data = isset( $_POST['data'] ) ? @json_decode( $_POST['data'], TRUE ) : die("Which data?");
            
            if (!is_array( $data ) )
                die("Unserializeable user data!");
        
            $data['enabled'] = $data['enabled'] ? 1 : 0;
            $data['expireDate'] = strlen( $data['expireDate'] ) 
                ? ( "'" . mysql_escape_string( $data['expireDate'] ) . "'" ) 
                : "NULL";
            
            $data['email'] = mysql_escape_string( $data['email'] );
            $data['phone'] = mysql_escape_string( $data['phone'] );
            $data['description'] = mysql_escape_string( $data['description'] );
            $data['name'] = mysql_escape_string( $data['name'] );
            
        
            if ( isset( $data['password'] ) ) {
                $updatePwd = ", `password` = '" . md5( $data['password'] ) . "'";
            } else {
                $updatePwd = '';
            }
        
            if ( strlen( "$data[id]" ) ) {
                
                $data['id'] = (int)$data['id'];
                
                /* We do a user update */
                
                $sql = "UPDATE $__DBADMIN__.admin_auth
                        SET `enabled` = $data[enabled],
                            `expires` = $data[expireDate],
                            `email`   = '$data[email]',
                            `phone`   = '$data[phone]',
                            `description` = '$data[description]'
                            $updatePwd
                        WHERE id = $data[id]
                        LIMIT 1";
                
                $result = mysql_query( $sql ) or die( mysql_error() );
                
            } else {
                
                /* We could place a unique index on the user column, but that would affect previous mmc versions, so we do this check manually */
                
                list( $count ) = mysql_fetch_row( mysql_query( "SELECT count(*) FROM $__DBADMIN__.admin_auth WHERE user = '$data[name]'" ) );
                
                $count = (int)$count;
                
                if ( $count > 0 )
                    die("Error creating user: Another user with that name allready exists!" );
            
                if (!is_dir( "home" ) ||
                    !is_writeable( "home" )
                ) die("Error creating user: home folder does not exists or is not writeable!");
                
                /* We create a new user */
                
                if (!isset( $data['password'] ) )
                    die("Please specify a password first time you are creating an user!");
                
                $data['password'] = md5( $data['password'] );
                
                /* Insert user ... */
                
                $sql = "INSERT INTO $__DBADMIN__.admin_auth (
                            `user`, `pass`, `enabled`, `expires`, `email`, `phone`, `description`
                        ) VALUES (
                            '$data[name]',
                            '$data[password]',
                            $data[enabled],
                            $data[expireDate],
                            '$data[email]',
                            '$data[phone]',
                            '$data[description]'
                        )";
                
                $result = mysql_query( $sql ) or die( mysql_error() );
                
                $data['id'] = mysql_insert_id( );
                
                function rollback( $userID, $originalError ) {
                    global $__DBADMIN__;
                    
                    $sql = "DELETE FROM $__DBADMIN__.admin_auth WHERE id=$userID LIMIT 1";
                    
                    if (!mysql_query( $sql ) )
                        die("Rollback: " . mysql_error() . "\nOriginal error: " . $originalError );
                    
                    @rmdir( "home/$userID" );
                    
                    die( $originalError );
                }
                
                /* We create the user's home */
                if ( !@mkdir("home/$data[id]" ) )
                    rollback( $data['id'], "Error creating user's home folder!" );
            }
        
            $sql = "DELETE FROM $__DBADMIN__.admin_group_mappings WHERE uid = $data[id]";
            $result = mysql_query( $sql );
            if (!$result) {
                if ( function_exists( 'rollback' ) )
                    rollback( $data['id'], "Could not clear user groups mappings: " . mysql_error() );
                else
                    die("Could not clear user groups mappings: " . mysql_error() );
            }
        
            foreach ( $data['members'] as $member ) {
                
                $member = (int)$member;
                
                $sql = "INSERT INTO $__DBADMIN__.admin_group_mappings ( uid, gid ) VALUES ( $data[id], $member )";
                
                $result = mysql_query( $sql );
                
                if (!$result) {
                    if ( function_exists( 'rollback' ) )
                        rollback( $data['id'], "Could not insert group mapping @$member " . mysql_error() );
                    else
                        die("Could not insert groups mapping @$member: " . mysql_error() );
                }
                
            }
        
            echo json_encode( $data['id'] );
        
            break;
        
        case 'delete-user':

            if (!policy_enabled('MMC_ACCESS'))
                die("Not enough rights to complete this action");

            
            $id = isset( $_POST['id'] ) ? (int)$_POST['id'] : die("Which id?");
            
            if ( $id == 1 )
                die( "Root user cannot be deleted!" );
            
            $sql = "DELETE FROM $__DBADMIN__.admin_auth WHERE id = $id LIMIT 1";
            
            if ( !mysql_query( $sql ) )
                die("Could not delete user from database: " . mysql_error() );
            
            /* Delete all user's available mappings */
            
            $sql = "DELETE FROM $__DBADMIN__.admin_group_mappings WHERE uid=$id";
            
            if (!mysql_query( $sql ) )
                die("Could not delete user's mappings!: " . mysql_error() );
            
            function delTree($dir){
                $files = array_diff( scandir($dir), array('.','..') );
                foreach ( $files as $file )
                    (is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file");
                return rmdir($dir);
            }

            if ( is_dir( "home/$id" ) )
                @delTree( "home/$id" );
            
            echo json_encode( 'ok' );
            
            break;
        
        case 'set-enabled':

            if (!policy_enabled('MMC_ACCESS'))
                die("Not enough rights to complete this action");


            $enabled = isset( $_POST['enabled'] ) ? (int)$_POST['enabled'] : 1;

            $id = isset($_POST['id']) ? (int)$_POST['id'] : die("Which id?");

            if ($enabled != 0 && $enabled != 1 )
                die("Bad enabled value");

            $sql = "UPDATE $__DBADMIN__.admin_auth SET enabled = $enabled WHERE id=$id LIMIT 1";

            if (!mysql_query($sql))
                die(mysql_error());

            echo json_encode('ok');

            break;

        
    }

?>