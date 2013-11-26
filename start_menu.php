<?php

    require_once "conf/open_db.php";

    function extract_icon_from_app($filename) {
        $buff = file_get_contents($filename);
        if ($buff === false) return 'icons/48x48/exe.png';
        else {
            $buff = json_decode($buff);
            return isset($buff->{'icon'}) ? $buff->{'icon'} : 'icons/48x48/exe.png';
        }
    }
    
    function extract_icon_from_dir($filename) {
        $buff = file_exists("$filename/icon") ? file_get_contents("$filename/icon") : '';
        if (!$buff or (strlen($buff) == 0)) return "icons/48x48/exe.png";
        else return "data:image/png;base64,".base64_encode($buff);
    }

    function _scan_dir($path, $replace, $prefix) {
        
        if (!is_dir($path)) return array();
        
        $files = scandir($path);
        
        $out = array();
        
        sort($files);
        
        foreach ($files as $file) {
            if ($file[0] != '.') {
                $info = pathinfo("$path/$file");
                $info['extension'] = isset($info['extension']) ? strtolower($info['extension']) : '';
                $is_file = is_file("$path/$file") ? true : false;
                
                if (($info['extension'] == 'app') and ( $is_file or (!$is_file and (file_exists("$path/$file/.application"))) )) {
                    $out[] = array(
                        'name'=>$info['filename'],
                        'exec'=>"AppExec('".addslashes($prefix.str_replace($replace,"","$path/$file"))."')",
                        'icon'=>$is_file ? extract_icon_from_app("$path/$file") : extract_icon_from_dir("$path/$file")
                    );
                } else
                if (!$is_file) $out[] = array(
                    'name'=>$file,
                    'childs'=>_scan_dir("$path/$file", $replace, $prefix)
                );
                
            }
        }
        
        return $out;
    }
    
    function array_names($arr) {
        $a = array();
        foreach ($arr as $item) $a[] = $item['name'];
        return $a;
    }

    function array_names_find($arr, $name) {
        for ($i=0; $i<count($arr); $i++) {
            if ($arr[$i]['name'] == $name and isset($arr[$i]['childs'])) return true;
        }
        return false;
    }
    
    function array_child_find($arr, $name) {
        for ($i=0; $i<count($arr); $i++) {
            if ($arr[$i]['name'] == $name and isset($arr[$i]['exec'])) return $arr[$i];
        }
        return false;
    }
    
    function array_names_items($arr, $name) {
        for ($i=0; $i<count($arr); $i++) {
            if ($arr[$i]['name'] == $name) return $arr[$i]['childs'];
        }
        return false;
    }
    
    function array_key_combine($arr1, $arr2) {
        $nm_a = array_names($arr1);
        $nm_b = array_names($arr2);
        
        
        $nm_c = array_unique(array_merge($nm_a, $nm_b));
        sort($nm_c);
        
        $out = array();
        
        foreach ($nm_c as $name) {
            $found_a = array_names_find($arr1, $name);
            $found_b = array_names_find($arr2, $name);
            
            if (($found_a === true) and ($found_b === true)) {
                $out[] = array('name'=>$name,
                               'childs'=>array_key_combine(
                                    array_names_items($arr1, $name), 
                                    array_names_items($arr2, $name)
                                )
                              ); 
            } else {
                if ($found_a === true) $out[] = array('name'=>$name, 'childs'=>array_names_items($arr1, $name)); else {
                    $t = array_child_find($arr1, $name);
                    if ($t !== false) $out[] = $t;
                }
                if ($found_b === true) $out[] = array('name'=>$name, 'childs'=>array_names_items($arr2, $name)); else {
                    $t = array_child_find($arr2, $name);
                    if ($t !== false) $out[] = $t;
                }
            }
            
        }
        
        return $out;
    }
    
    $all_users = _scan_dir('sessions/0/Start Menu',  'sessions/0/Start Menu',  'Start Menu');
    
    if (!isset($_SESSION)) session_start();
    
    if (isset($_SESSION['SESSION_INDEX']) and ((int)$_SESSION['SESSION_INDEX'] > 0)) {
        $sess_menu  = _scan_dir("sessions/$_SESSION[SESSION_INDEX]/Start Menu", "sessions/$_SESSION[SESSION_INDEX]/Start Menu", '~/Start Menu');
    }
    else $sess_menu = array();

    $start_menu = array_key_combine($all_users, $sess_menu);

    usort( $start_menu, function($a, $b) {
        
        if ( ( isset( $a['exec'] ) && isset( $b['exec'] ) ) || ( !isset($a['exec']) && !isset($b['exec']) ) ) {
            return strcmp( strtolower( $a['name'] ), strtolower( $b['name'] ) );
        } else
            return isset( $a['exec'] ) ? 1 : -1;
        
    } );
    
    echo json_encode($start_menu);

?>