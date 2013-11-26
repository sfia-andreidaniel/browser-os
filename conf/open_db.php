<?php

    if (!function_exists('fatal')) {

        function fatal($text = 'Fatal error') {
            $response = array(
                'type'=>'error',
                'data'=>$text
            );
            echo(json_encode($response));
            die('');
        }

    }
    
    if ( file_exists( dirname(__FILE__) . "/database.inc.php" ) && file_exists( dirname(__FILE__) . '/globals.php' ) ) {

    require_once dirname(__FILE__) . "/globals.php";
    require_once dirname(__FILE__) . "/database.inc.php";

    $mysql_conn  = false;
    $mysql_dbase = false;
        
    function start_mysql_connection() {
        global $mysql_conn;
        global $mysql_dbase;
        global $js_define;
            
        global $__DBADMIN__;
        
        $mysql_conn = mysql_connect(mysql_host, mysql_user, mysql_pass) or fatal('Error connecting to project mysql server: ('.mysql_error().')');
        
        $sapi = strtolower(php_sapi_name());
        
        if ($sapi == 'cli') {
            $mysql_dbase= mysql_select_db(mysql_db, $mysql_conn) or fatal('Error using project\'s mysql database');
        } else {
            if (!isset($_SESSION)) session_start();
            if (isset($_SESSION['SESSION_DB']) and (strlen($_SESSION['SESSION_DB'])>0)) {
                mysql_select_db($_SESSION['SESSION_DB'], $mysql_conn) or fatal('Error using project\'s mysql database');
            }
            if (isset($_SESSION['SESSION_INDEX']) and (strlen($_SESSION['SESSION_INDEX']) > 0)) {
                $sql = "SELECT name, value FROM $__DBADMIN__.admin_defines WHERE server=0 OR server=".((int)$_SESSION['SESSION_INDEX']).";";
                $result = mysql_query($sql) or die(mysql_error());
                
                $js_define = array();
                
                while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
                    define($row['name'], $row['value']);
                    $js_define[] = $row;
                }
            }
        }
    }
    
    function mysql_keep_alive() {
        global $mysql_conn;
        if (!mysql_ping($mysql_conn)) {
            mysql_close($mysql_conn);
            start_mysql_connection();
        }
    }
        
    start_mysql_connection();
    
    function start_cli_environment($env_id) {
    
        global $__DBADMIN__;
    
        $sql = "SELECT $__DBADMIN__.admin_defines.name AS name, $__DBADMIN__.admin_defines.value AS value
                FROM $__DBADMIN__.admin_defines WHERE $__DBADMIN__.admin_defines.server = 0 OR $__DBADMIN__.admin_defines.server = $env_id";
        $result = mysql_query($sql) or die("FATAL: start_cli_environment: \n".mysql_error());
        while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
            define($row['name'], $row['value']);
        }
    }
    
    } else {
    
        define("NO_DATABASE", 1);
    }

?>