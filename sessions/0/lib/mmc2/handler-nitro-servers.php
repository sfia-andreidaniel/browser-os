<?php

    define('DISABLE_ONEDB_AUTOLOAD', 1);

    $do = isset($_POST['do'] ) ? $_POST['do'] : die("What to do?");
    
    chdir( "classes/NO2/" );
    
    require_once "Object.class.php";
    
    $db = Object('JSPlatform.Database');
    
    switch ($do) {
    
        case 'get-servers-list':
        
            $out = [];
            
            mysql_query( "SET @now = " . time(), $db->connection )
                or die("MySQL Error: " . mysql_error() );
            
            $sql = "SELECT server_id AS id,
                           server_ip AS name,
                           IF ( @now - last_up > 60, 0, 1 ) AS status
                    FROM cloud_servers
                    ORDER BY server_ip";
            
            $result = mysql_query( $sql, $db->connection )
                or die("MySQL Error: " . mysql_error() );
            
            while ($row = mysql_fetch_array( $result, MYSQL_ASSOC ) ) {
                $row['id'] = 'cmd_nitro_server:' . $row['id'];
                $row['status'] = (int)$row['status'];
                $row['icon'] = "img/mmc2/nitro/server" . $row['status'] . ".png";
                $out[] = $row;
            }
            
            echo json_encode( $out );
        
            break;
        
        
        
        default:
            die("Bad handler command: '$do' in " . __FILE__ );
            break;
    }

?>