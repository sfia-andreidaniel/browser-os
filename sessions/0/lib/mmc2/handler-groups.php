<?php


    $do = isset( $_POST['do'] ) ? $_POST['do'] : die("What to do?");
    
    switch ($do) {
        
        case "get-groups-list":
            $sql = "SELECT gid, name FROM $__DBADMIN__.admin_groups ORDER BY name != 'administrators', name";
            $out = array();
            $result = mysql_query($sql) or die("Could not select users: MySQL Error: " . mysql_error() );
            while ($row = mysql_fetch_array($result, MYSQL_ASSOC ) ) {
                $out[] = array(
                    'id' => 'cmd_groups:' . $row['gid'],
                    'name' => $row['name'],
                    'icon' => 'img/mmc2/g.gif'
                );
            }
            echo json_encode($out);
            break;
        
        case 'enum-groups':
        
            $sql = "SELECT $__DBADMIN__.admin_groups.gid AS id,
                           $__DBADMIN__.admin_groups.name AS name,
                           ( SELECT GROUP_CONCAT( CONCAT( ' ', $__DBADMIN__.admin_auth.user ) )
                             FROM $__DBADMIN__.admin_group_mappings
                             LEFT JOIN $__DBADMIN__.admin_auth
                                  ON $__DBADMIN__.admin_auth.id = $__DBADMIN__.admin_group_mappings.uid
                             WHERE $__DBADMIN__.admin_group_mappings.gid = $__DBADMIN__.admin_groups.gid
                             GROUP BY $__DBADMIN__.admin_group_mappings.gid
                           ) AS members
                    FROM $__DBADMIN__.admin_groups";
                
            $result = mysql_query( $sql ) or die( "Error:\n$sql\n\n" . mysql_error() );
        
            $out = array();
            
            while ($row = mysql_fetch_array( $result, MYSQL_ASSOC ) ) {
                $row['id'] = (int)$row['id'];
                $row['members'] = strlen( $row['members'] ) ? $row['members'] : '-';
                $out[] = $row;
            }
            
            echo json_encode( $out );
        
            break;
        
        case 'load-group':
        
            if (!policy_enabled('MMC_ACCESS'))
                die("Not enough rights to complete this action");
            
            $id = isset( $_POST['id'] ) ? (int)$_POST['id'] : die("Which id?");
        
            $sql = "SELECT gid         AS id,
                           name        AS name,
                           description AS description
                    FROM $__DBADMIN__.admin_groups
                    WHERE gid = $id LIMIT 1";
            
            $result = mysql_query( $sql ) or die( mysql_error() );
            
            if (!mysql_num_rows( $result ) )
                die("Group #$id was not found!");
            
            $group = mysql_fetch_array( $result, MYSQL_ASSOC );
            $group['id'] = (int)$group['id'];
            
            $group['members'] = array();
            
            $sql = "SELECT uid FROM $__DBADMIN__.admin_group_mappings WHERE gid=$id";
            $result = mysql_query( $sql ) or die(mysql_error() );
            
            while ($row = mysql_fetch_row( $result ) )
                $group['members'][] = (int)reset($row);
        
            echo json_encode( $group );
        
            break;
        
        case 'save-group':

            if (!policy_enabled('MMC_ACCESS'))
                die("Not enough rights to complete this action");

            $data = isset( $_POST['data'] ) ? @json_decode( $_POST['data'], TRUE ) : die("Which data?");
            
            if (!is_array( $data ) )
                die("Unserializeable data!");
            
            $data['name'] = mysql_escape_string( $data['name'] );
            $data['description'] = mysql_escape_string( $data['description'] );
            
            if ( strlen( "$data[id]" ) == 0 ) {
                //we do a database insert
                
                $sql = "INSERT INTO $__DBADMIN__.admin_groups ( name, description ) VALUES ( '$data[name]', '$data[description]' )";
                $result = mysql_query( $sql ) or die(mysql_error() );
                
                $data['id'] = mysql_insert_id();
            } else {
                
                //we do a database update
                
                $sql = "UPDATE $__DBADMIN__.admin_groups SET description = '$data[description]' WHERE gid='$data[id]' LIMIT 1";
                $result = mysql_query( $sql ) or die(mysql_error() );
                
            }
            
            /* clear group mappings */
            
            $sql = "DELETE FROM $__DBADMIN__.admin_group_mappings WHERE gid = $data[id]";
            if (!mysql_query( $sql ) )
                die( mysql_error() );
            
            /* Add current users mappings */
            
            if ( is_array( $data['members'] ) ) {
                
                foreach ($data['members'] as $member) {
                    $member = (int)$member;
                    
                    $sql = "INSERT INTO $__DBADMIN__.admin_group_mappings ( uid, gid ) VALUES ( $member, $data[id] )";
                    
                    if (!mysql_query( $sql ) )
                        die( mysql_error() );
                }
                
            }
            
            echo json_encode( $data['id'] );
            
            break;
        
        case 'delete-group':

            if (!policy_enabled('MMC_ACCESS'))
                die("Not enough rights to complete this action");
            
            $id = isset( $_POST['id'] ) ? (int)$_POST['id'] : die("Which id?");
            
            if ($id <= 1 )
                die("Administrative groups cannot be deleted!");
            
            $sql = "DELETE FROM $__DBADMIN__.admin_groups WHERE gid = $id LIMIT 1";

            if (!mysql_query( $sql ))
                die("Could not delete group #$id:" . mysql_error() );
            
            // Delete mappings
            
            $sql = "DELETE FROM $__DBADMIN__.admin_group_mappings WHERE gid = $id";
            $result = mysql_query( $sql ) or die( mysql_error() );
            
            echo json_encode( 'ok' );
            
            break;
        
    }

?>