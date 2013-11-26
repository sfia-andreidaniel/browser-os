<?php

    $do = isset( $_POST['do'] ) ? $_POST['do'] : die("What to do?");
    
    switch ($do) {
        
        case "get-policies-list":
            $sql = "SELECT id, code, enabled FROM $__DBADMIN__.admin_policies WHERE hidden = 0 ORDER BY code";
            $result = mysql_query($sql) or die("Could not select sessions: MySQL Error: " . mysql_error() );
            while ($row = mysql_fetch_array($result, MYSQL_ASSOC ) ) {
                $out[] = array(
                    'id' => 'grp_policies:' . $row['id'],
                    'name' => $row['code'],
                    'icon' => $row[ 'enabled' ] == '1'
                        ? 'img/mmc2/p1.png'
                        : 'img/mmc2/p0.png'
                );
            }
            echo json_encode($out);
            break;
        
        case 'enum-policies':
        
            $sql = "SELECT id, code, name, enabled, description FROM $__DBADMIN__.admin_policies
                    WHERE hidden = 0
                    ORDER BY code";
            
            $result = mysql_query( $sql ) or die("Could not enumerate policies: MySQL Error: " . mysql_error() );
            
            $out = array();
            
            while ($row = mysql_fetch_array( $result, MYSQL_ASSOC ) ) {
                $row['id'] = (int)$row['id'];
                $row['enabled'] = (int)$row['enabled'];
                $out[] = $row;
            }
        
            echo json_encode( $out );
        
            break;
        
        case 'delete-policy':
        
            if (!policy_enabled('MMC_ACCESS'))
                die("Not enough rights to complete this action");
            
            $id = isset( $_POST['id'] ) ? (int)$_POST['id'] : die("Which id?");
            
            $sql = "DELETE FROM $__DBADMIN__.admin_policies WHERE id=$id LIMIT 1";
            
            if ( mysql_query( $sql ) )
                echo json_encode('ok');
            else
                die(mysql_error());
        
            break;
        
        case 'load-policy':
            
            if (!policy_enabled('MMC_ACCESS'))
                die("Not enough rights to complete this action");

            $id = isset( $_POST['id'] ) ? (int)$_POST['id'] : die("Which ID?");
            
            $sql = "SELECT `id`, `name`, `code`, `description`, `enabled`, `default`
                    FROM $__DBADMIN__.admin_policies
                    WHERE id = $id
                    LIMIT 1";
            
            $result = mysql_query( $sql ) or die(mysql_error());
            
            if ( !mysql_num_rows( $result ) )
                die( mysql_error() );
            
            $policy = mysql_fetch_array( $result, MYSQL_ASSOC );
            
            $policy['id'] = (int)$policy['id'];
            $policy['enabled'] = $policy['enabled'] == '1' ? TRUE : FALSE;
            $policy['default'] = (int)$policy['default'];
            
            /* Load mappings */
            
            $sql = "SELECT IF( uid > 0, 'user', 'group' ) AS entityType,
                           uid + gid                      AS entityId,
                           allow                          AS access
                    FROM $__DBADMIN__.admin_policies_mappings
                    WHERE pid = $policy[id]";
            
            $result = mysql_query( $sql ) or die( mysql_error() );
            
            $policy['members'] = array();
            
            while ($row = mysql_fetch_array( $result, MYSQL_ASSOC ) ) {
                $row['entityId'] = (int)$row['entityId'];
                $row['allow'] = (int)$row['allow'];
                $policy['members'][] = $row;
            }
            
            echo json_encode( $policy );
            
            break;
        
        case 'flush-policies':

            if (!policy_enabled('MMC_ACCESS'))
                die("Not enough rights to complete this action");

            require_once "classes/UsersAndGroups.inc.php";
            
            try {
                $warnings = ACLFlushPolicies();
            } catch (Exception $e) {
                die($e->getMessage());
            }

            echo json_encode('ok');

            break;
        
        case 'set-enabled':

            if (!policy_enabled('MMC_ACCESS'))
                die("Not enough rights to complete this action");


            $enabled = isset( $_POST['enabled'] ) ? (int)$_POST['enabled'] : 1;

            $id = isset($_POST['id']) ? (int)$_POST['id'] : die("Which id?");

            if ($enabled != 0 && $enabled != 1 )
                die("Bad enabled value");

            $sql = "UPDATE $__DBADMIN__.admin_policies SET enabled = $enabled WHERE id=$id LIMIT 1";

            if (!mysql_query($sql))
                die(mysql_error());

            echo json_encode('ok');

            break;
        
        case 'save-policy':

            if (!policy_enabled('MMC_ACCESS'))
                die("Not enough rights to complete this action");


            $data = isset( $_POST['data'] ) ? @json_decode( $_POST['data'], TRUE ) : die("Which data?");
            if ( !is_array( $data ) )
                die("Unserializeable data!");
                
            $data['id'] = (int)$data['id'];
            
            $data['name'] = mysql_escape_string( $data['name'] );
            $data['code'] = mysql_escape_string( $data['code'] );
            $data['description'] = mysql_escape_string( $data['description'] );
            $data['enabled'] = (int)$data['enabled'];
            $data['defaultAction'] = (int)$data['defaultAction'];
            
            if ($data['id'] > 0 ) {
                //Do update
                $sql = "UPDATE $__DBADMIN__.admin_policies
                        SET `name` = '$data[name]',
                            `code` = '$data[code]',
                            `description` = '$data[description]',
                            `enabled` = $data[enabled],
                            `default` = $data[defaultAction]
                        WHERE id = $data[id]
                        LIMIT 1";
                $result = mysql_query($sql) or die( "Update Error: " . mysql_error() );
            } else {
                //Do insert
                $sql = "INSERT INTO $__DBADMIN__.admin_policies (
                            `name`,
                            `code`,
                            `description`,
                            `enabled`,
                            `default`
                        ) VALUES (
                            '$data[name]',
                            '$data[code]',
                            '$data[description]',
                            $data[enabled],
                            $data[defaultAction] )";
                $result = mysql_query( $sql ) or die( "Insert error: " . mysql_error() );
                $data['id'] = mysql_insert_id();
            }
            
            /* Setup mappings */
            
            if (!mysql_query( "DELETE FROM $__DBADMIN__.admin_policies_mappings WHERE pid=$data[id]" ) )
                die(mysql_error());
            
            foreach ($data['members'] as $member) {
                
                $member['uid'] = (int)$member['uid'];
                $member['gid'] = (int)$member['gid'];
                $member['access'] = (int)$member['access'];
                
                $sql = "INSERT INTO $__DBADMIN__.admin_policies_mappings (
                            `pid`,
                            `uid`,
                            `gid`,
                            `allow`
                        ) VALUES (
                            $data[id],
                            ". ( $member['entityType'] == 'user' ? $member['entityId'] : '0' ) . ",
                            ". ( $member['entityType'] == 'group'? $member['entityId'] : '0' ) . ",
                            $member[access]
                        )";

                if (!mysql_query($sql))
                    die( "Mapping Error: " . mysql_error() . "\n\n$sql" );
            }
            
            echo json_encode( $data['id'] );
            
            break;
        
    }

?>