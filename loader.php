<?php

    if (!isset($_SESSION)) session_start();

    if ( isset($_SESSION['UID']) ) {
        require_once "conf/open_db.php";
    } else {

        if ( !file_exists( 'conf/globals.php' ) || !file_exists( 'conf/database.inc.php') ) {
            define('NO_DATABASE', 1 );
        }
    }
    
    function policy_enabled( $policyName ) {
        return isset( $_SESSION ) &&
               isset( $_SESSION['policies'] ) &&
               isset( $_SESSION['policies']['by_code'] ) &&
               isset( $_SESSION['policies']['by_code'][ $policyName ] ) &&
               $_SESSION['policies']['by_code'][ $policyName ] == TRUE ? TRUE : FALSE;
    }
    
    function is_jsplatform_uploaded_file( $filePath, $unset = FALSE ) {
        $itIs = isset( $_SESSION['_FILES_'] ) && isset( $_SESSION['_FILES_'][ $filePath ] ) && file_exists( $filePath );
        if ($itIs && $unset )
            unset( $_SESSION['_FILES_'][ $filePath ] );
        return $itIs;
    }
    
    $sid = isset($_SESSION['SESSION_INDEX']) ? 
        ((substr(isset($_REQUEST['__file']) ? $_REQUEST['__file'] : $_REQUEST['dir'],0,1) == '~') ? $_SESSION['SESSION_INDEX'] : '0') 
    : false;
    
    if (($sid !== '0') and ($sid !== false)) {
        if (isset($_REQUEST['__file'])) $_REQUEST['__file'] = substr($_REQUEST['__file'],1);
        elseif (isset($_REQUEST['dir'])) $_REQUEST['dir'] = substr($_REQUEST['dir'],1);
    }
    
    if ($sid === false) {
        $sid = '0';
        
        $jlogon = realpath('sessions/0/bin/jlogon.app');
        $jsystemtray = realpath('sessions/0/bin/jsystem_tray.app');
        $jinstall = ( defined('NO_DATABASE') || ( isset($_POST['do'] ) && $_POST['do'] == 'check-install' ) ) ? 
            realpath('sessions/0/bin/install.app') : '!!!!!!!!';
        
        if (substr(realpath("sessions/0/$_REQUEST[__file]"),0, strlen($jlogon)) != $jlogon &&
            substr(realpath("sessions/0/$_REQUEST[__file]"),0, strlen($jsystemtray)) != $jsystemtray &&
            substr(realpath("sessions/0/$_REQUEST[__file]"),0, strlen($jinstall)) != $jinstall
        ) {
            header("HTTP/1.0 500 Internal Server Error");
            die("Forbidden");
        }
    }
    
    if ($sid === false) {
        header("HTTP/1.0 500 Internal Server Error");
        die("Invalid session index");
    }

    $sess_path = realpath("sessions/$sid");

    $file   = isset($_REQUEST['__file']) ? realpath("$sess_path/$_REQUEST[__file]")  : false;
    
    $folder = isset($_REQUEST['dir'])? realpath("$sess_path/$_REQUEST[dir]") :false;

    if (($file !== false) and (substr($file, 0, strlen($sess_path)) !== $sess_path)) {
        if (!file_exists( $fp = dirname( $file ) . DIRECTORY_SEPARATOR . ( preg_match( '/\.app$/', $file ) ? basename( $file ) . DIRECTORY_SEPARATOR  : '' ) . '.export' ) ) {
            header("HTTP/1.0 500 Internal Server Error");
            die("Invalid file (file $fp outside session?)!");
        }
    }
    
    if (($folder !== false) and (substr($folder, 0, strlen($sess_path)) !== $sess_path)) {
        if (!file_exists( $folder . DIRECTORY_SEPARATOR . '.export' ) ) {
            header("HTTP/1.0 500 Internal Server Error");
            die("Invalid folder (folder outside session?)");
        }
    }
    
    if (($file !== false) and (is_dir($file))) {
        $folder = $file;
        $file = false;
    }
    
    function ensure_compat($fileName, $buffer) {
        if (!defined('COMPAT_MODE')) return $buffer;
        global $compat;
        $info = pathinfo($fileName);
        $ext = isset($info['extension']) ? strtolower($info['extension']) : '';
        
        for ($i=0; $i<floor(count($compat) / 3); $i++) {
            list($extension, $expr, $replace) = array($compat[$i*3], $compat[$i*3+1], $compat[$i*3+2]);
            if ($extension == $ext) {
                $ret = preg_replace($expr, $replace, $buffer);
                return $ret;
            }
        }
        
        return $buffer;
    }
    
    function embed_resources( $buffer, $fileName ) {
    
        if ( !preg_match( '/\.(css|js)$/i', $fileName ) )
            return $buffer;
    
        $dir = dirname( $fileName ) . '/';
    
        while ( preg_match( '/\{\$include (.*)\}/', $buffer, $matches ) ) {
            $fname = $dir . $matches[1];
            if ( file_exists( $fname ) ) {
                $contents = base64_encode( file_get_contents( $fname ) );
                $buffer = str_replace( $matches[0], $contents, $buffer );
            } else $buffer = str_replace( $matches[0], '', $buffer );
        }
    
        return $buffer;
    }
    
    function get_json_folder($f) {
        $out = array();
        $files = scandir($f);
        
        $js = array();
        
        if ( isset( $_SESSION ) && isset( $_SESSION['EXECUTION_MODE'] ) && $_SESSION['EXECUTION_MODE'] == 'production' ) {
            
            foreach ( $files as $file ) {
                if ( is_file( "$f/$file" ) ) {
                
                    if (preg_match('/\.js$/i', $file ) ) {
                        $js[] = "\n\n/* FILE: $file */\n"
                                . embed_resources( ensure_compat( $file, file_get_contents( "$f/$file" ) ), "$f/$file" );
                    } else
                    $out[] = array(
                        'name'=>$file,
                        'data'=> embed_resources( ensure_compat($file, file_get_contents("$f/$file")), "$f/$file" )
                    );
                }
            }
            
        } else {
        
            foreach ($files as $file) {
                if (is_file("$f/$file")) {
                    $out[] = array(
                        'name'=>$file,
                        'data'=>embed_resources( ensure_compat($file, file_get_contents("$f/$file") ), "$f/$file" )
                    );
                }
            }
        }
        
        if (count($js)) {
            $out[] = array(
                'name' => 'application.js',
                'data' => implode("\n", $js )
            );
        }
        
        return $out;
    }
    
    function is_binary($buff) {
        for ($i=0; $i<strlen($buff); $i++) {
            $ord = ord($buff[$i]);
            if (($ord >= 127) or ($ord < 8)) return true;
        }
        return false;
    }

    function detectbuffermime( $buffer ) {
    
        //return "image/png";
    
        if (strlen($buffer) > 0 && strlen($buffer) < 1000000) {
            
            $img = @imagecreatefromstring( $buffer );
            if (is_resource($img)) {
                imagedestroy($img);
                return "image/png";
            }
            
        } 
        
        return "application/octet-stream";
    }

    function data_uri($file, $file_is_a_buffer = false, $buffer_mime = 'application/octet-stream') {

        if ($file_is_a_buffer === false) {
            if (!file_exists($file)) die("data_uri('$file'): file does not exist!");
            $info = pathinfo($file);
            $extension = strtolower(isset($info['extension']) ? $info['extension'] : '');
            switch ($extension) {
                case 'jpg': $mime = 'image/jpeg'; break;
                case 'png': $mime = 'image/png'; break;
                case 'gif': $mime = 'image/gif'; break;
                case 'jpeg': $mime= 'image/jpeg'; break;
                default: $mime = 'image';  break;
            }
            $contents = file_get_contents($file);
            $mime = detectebuffermime( $contents );
        } else {
                        $contents = $file;
                        $mime = detectbuffermime( $contents );
                }

        if (!strlen($contents) || ($contents === false)) die("Could not load file: $file");

        $base64   = base64_encode($contents);

        $buffer = "data:$mime;base64,$base64";
        
        return $buffer;
    }
    
    if ($file !== false) {

        if (!is_file($file)) {
            header("HTTP/1.0 404 Not Found");
            die("__file '$file' does not exists!");
        }
        
        $info = pathinfo($file);
        $extension = isset($info['extension']) ? strtolower($info['extension']) : '';
        
        switch ($extension) {
        
        case 'app':
        
        $buffer = file_get_contents($file);
        if ($buffer === false) { 
            header("HTTP/1.0 500 Internal Server Error");
            die("Error opening file!");
        }

        $part = isset($_REQUEST['parts'])? $_REQUEST['parts'] : false;
        
        if ($part !== false) { 
        
            $bin = isset($_REQUEST['bin']) ? (int)$_REQUEST['bin'] : false;
        
            $part = explode(',', $part);

            $dec  = json_decode($buffer);
            
            foreach ($part as $var) {
                $out["$var"] = isset($dec->{"$var"}) ? $dec->{"$var"} : null;
            }
            
            $out['__response_type__'] = '__file';
            
            if (!$bin) echo json_encode($out);
            
            else echo implode("\n\n", $out);
            
        } else {
            echo $buffer;
        }
        
        break;
        
        case 'php': require $file; break;
        
        default: readfile($file); break;
        
        }
    } else {

        if (!is_dir($folder)) {
            header("HTTP/1.0 404 Not Found");
            die("Folder '$folder' does not exists!");
        }
        
        $info = pathinfo($folder);
        $extension = strtolower( isset($info['extension']) ? $info['extension'] : '' );
        
        if (($extension != 'app') or (($extension == 'app') and (!file_exists("$folder/.application")))) {
            $flist = scandir($folder);
        
            $folders = array();
            $files   = array();
        
            foreach ($flist as $f) {
                if ($f[0] != '.') {
                    if (is_file("$folder/$f")) $files[] = $f; else $folders[] = $f;
                }
            }
        
            $out = array();
            if (count($files)) $out['__files']=$files;
            if (count($folders)) $out['folders'] = $folders;

            $out['__response_type__'] = 'dir';
        
            echo json_encode($out);
        } else {
        
            $root = scandir($folder);
            
            if (file_exists("$folder/.compat")) {
                $compat = trim(file_get_contents("$folder/.compat"));
                
                $compat = explode("\n", $compat);
                
                if ((count($compat) %3) != 0) {
                    header("HTTP/1.0 500 Internal Server Error");
                    die("'.compat' file found, but invalid syntax (expected 3 line groups, 1st with a file extension, 2nd with a regular expression and 3rd with a replacement string)!");
                }
                
                define("COMPAT_MODE", 1);
            }
            
            $json = array();
            

            if (isset($_REQUEST['parts']) and strlen($_REQUEST['parts'])) {
                $keys = explode(',', $_REQUEST['parts']);
            } else $keys = false;

            foreach ($root as $node) {
                if ((substr($node,0,1) != '.') and (($keys === false) or (in_array($node, $keys)))) {
                    if (is_file("$folder/$node")) {
                        
                        $json["$node"] = file_get_contents("$folder/$node");
                        
                        $binary = is_binary($json["$node"]);
                        if ($binary === true) {
                            $json["$node"] = data_uri($json["$node"], true, 'application/octet-stream');
                        }
                        
                    } else $json["$node"] = get_json_folder("$folder/$node");
                }
            }

            $json["__response_type__"] = '__file';
            
            echo json_encode($json);
        }
    }

?>