<?php

    error_reporting(E_ALL && E_WARNING);
    ini_set('display_errors', 'on');

    require_once "conf/open_db.php";
    
    set_time_limit(60);

    $uname = (isset($_POST['uname']) and (strlen($_POST['uname']))) ? mysql_real_escape_string($_POST['uname']) : false;
    $pass  = (isset($_POST['pass']) and (strlen($_POST['pass']))) ? md5($_POST['pass']) : md5('');
    $auth_source = isset($_POST['auth-source']) ? $_POST['auth-source'] : '';
    
    if ($auth_source != '') {
        
        $buff = file_get_contents("conf/auth_sources.json");
        if (!$buff)
            die("Error opening Foreign Authentication Sources configuration file");
        
        $cfg = json_decode($buff, true);
        
        if (!$cfg || !is_array($cfg))
            die("Error decofing Foreign Authentication Sources configuration file");
        
        $className = null;
        
        for ($i=0; $i<count($cfg); $i++) {
            if (isset($cfg[$i]['id']) && $cfg[$i]['id'] == $auth_source) {
                
                if (!isset($cfg[$i]['class']) || !strlen($cfg[$i]['class']))
                    die("Foreign Authentication Source '$auth_source' does not have a defined class!");
                
                $className = $cfg[$i]['class'];
                $cfg = $cfg[$i];
                break;
                
            }
        }
        
        if ($className === null)
            die("Could not find a suitable class on server to init Foreign Authentication Source '$auth_source'");
        
        if (!file_exists("classes/$className.class.php"))
            die("Class Not Found: $className");
        
        require_once "classes/$className.class.php";
        
        if (!class_exists($className))
            die("Loaded class file '$className.class.php', but no class defined with the name of '$className'");
        
        try {
            
            $auth = new $className(isset($cfg['config']) ? $cfg['config'] : array());
            
            $uname = mysql_real_escape_string(
        	$auth->login($uname, isset($_POST['pass']) ? $_POST['pass'] : die("Which pass?"))
	    );
            
            $pass = md5('');
        
        } catch (Exception $e) {
            die("Exceptie: ".$e->getMessage());
        }
        
        //die("Foreign Authentication Source '$auth_source' NOT IMPLEMENTED");
    }
    
    if ($uname !== false) {
    
        $sql = "SELECT * FROM $__DBADMIN__.admin_auth WHERE user='$uname' AND pass='$pass' LIMIT 1";
        $result = mysql_query($sql) or die("Server error. Please try again later");
        

        if (!mysql_num_rows($result)) {
        
            $attempts = isset($_SESSION['LOGIN_ATTEMPTS']) ? (int)$_SESSION['LOGIN_ATTEMPTS'] : 0;
            $_SESSION['LOGIN_ATTEMPTS'] = $attempts+1;
    
            sleep($attempts);
            
            die("Error: Invalid username or password.\n\nYou will wait additional time on each failed login attempt!");
        
        } else {
            $row = mysql_fetch_array($result, MYSQL_ASSOC);
            
            if ($row['enabled'] == 0) {
                die("Sorry, account is disabled");
            }
            
            if (!isset($_SESSION)) session_start();
            
            $_SESSION['UID'] = $row['id'];
            $_SESSION['GID'] = $row['gid'];
            $_SESSION['UNAME']=$row['user'];
            $_SESSION['LOGIN_ATTEMPTS'] = 0;
            
            //die($row['policies']);
            $policies = explode("\n", $row['policies']);
            

            $_SESSION['policies'] = array(
                'by_code'=>array(),
                'by_id'=>array()
            );
            
            
            for ($i=0; $i<count($policies); $i++) {
                $arr = explode('=', $policies[$i]);
                
                if (count($arr) == 3) {
                
                    list($code, $id, $value) = $arr;
                    $_SESSION['policies']['by_code']["$code"] = $value;
                    $_SESSION['policies']['by_id']["$id"] = $value;
                }
            }
            
            if (!isset($_POST['to_json'])) {
                header("Location: .");
                echo "Redirecting ...";
            } else {
		//print_r($_SESSION);
		die(json_encode('ok'));
    	    }
        }
    } else {
        
    }
    
    die("login failed");
    


?>