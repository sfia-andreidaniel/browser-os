<?php

    // print_r($_SESSION);

    if (!isset($_SESSION)) 
        die("Error: Forbidden (ERR_PROTECTED_USAGE)!");

    $uid = isset($_SESSION['UID']) ? (int)$_SESSION['UID'] : 
        die("Error: You must be logged in in order to complete this operation! (ERR_GUEST_NOT_ALLOWED)");
    
    $sid = isset($_POST['sid']) ? (int)$_POST['sid'] : 
        die("Invalid session identifier (ERR_NOT_SPECIFIED)!");
    
    if ($sid <= 0) 
        die("Invalid SID value (ERR_SID_PARSE)!");
    
    $sql = "SELECT policy_id, description, name FROM $__DBADMIN__.admin_servers WHERE id=$sid LIMIT 1";
    
    $result = mysql_query($sql) or die("Server could not log you in (ERR_DB_ERROR).\n\nPlease try again later!\n\n".mysql_error());
    
    if (!mysql_num_rows($result)) die("Error: Invalid session (ERR_NOT_FOUND)!");
    
    list($policy, $sess_name, $sess_db) = mysql_fetch_row($result);
    
    if (!isset($_SESSION['policies']['by_id']["$policy"])) die("Error starting session (ERR_POLICY_NOT_DEFINED: $policy )");
    
    if ($_SESSION['policies']['by_id']["$policy"] != 1) die("Error: Session's policy does not allow you to connect to this session.\n\nPlease contact Administrator");
    
    $sql = "SELECT name, value FROM $__DBADMIN__.admin_defines WHERE (server=0) or (server=$sid)";
    
    $result = mysql_query($sql) or die("Error loading ENV (ERR_DB_LOAD_ENV)!");
    
    $env = array();
    
    while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
        if ($row['name'] != 'SUDO')
        $env["$row[name]"] = $row['value'];
    }
    
    $env['UNAME'] = $_SESSION['UNAME'];
    $env['UID']   = $_SESSION['UID'];
    $env['SESSION_INDEX'] = $sid;
    $env['SESSION_NAME']  = $sess_name;
    
    $_SESSION['SESSION_INDEX'] = $sid;
    $_SESSION['SESSION_NAME'] = $sess_name;
    $_SESSION['SESSION_DB'] = $sess_db;
    
    $startup = array();
    $sql = "SELECT startup FROM $__DBADMIN__.admin_servers WHERE id=$sid LIMIT 1";
    $result = mysql_query($sql) or die("Error fetching startup commands! (ERR_FETCH_STARTUP)");
    
    $master_startup = file_get_contents('.startup_0');
    $master_startup = ($master_startup === false ? '' : $master_startup);
    
    $startup[] = $master_startup;
    
    list($row) = mysql_fetch_row($result);
    $startup[] = $row;
    
    $env = array('env'=>$env);
    
    $env['startup'] = trim(str_replace("\r",'', implode("\n", $startup)));
    
    echo json_encode($env);

?>