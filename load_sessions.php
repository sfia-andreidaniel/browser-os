<?php
    require_once "conf/open_db.php";

    $sql = "SELECT $__DBADMIN__.admin_servers.id AS id,
                   $__DBADMIN__.admin_servers.description AS session_name,
                   $__DBADMIN__.admin_servers.policy_id AS policy
            FROM $__DBADMIN__.admin_servers";
    
    $result = mysql_query($sql) or die("Error enumerating available sessions!\n".mysql_error());
    
    $out = array();
    
    while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
        if (isset($_SESSION['policies']['by_id']["$row[policy]"]) and 
		         ($_SESSION['policies']['by_id']["$row[policy]"]==1)) {
            unset($row['policy']);
            $out[] = $row;
        } // else $out[] = $row; 
    }
    
    echo json_encode($out);
   
?>