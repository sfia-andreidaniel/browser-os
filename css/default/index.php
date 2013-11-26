<?php

    header("Content-type: text/css");

    $buffer = "/* $_SERVER[HTTP_USER_AGENT] */\n";

    $flist = scandir('.');
    
    $ua = strtolower($_SERVER['HTTP_USER_AGENT']);
    
    for ($i=0; $i<count($flist); $i++) {
        $info = pathinfo($flist[$i]);
        if (!isset($info['extension'])) $info['extension'] = '';
        
        if ($flist[$i] == 'index.css') continue;
        
        if ($info['extension'] && $info['extension'] == 'css') {
            
            if ($flist[$i][0] != '-') {
                $buffer .= "\n /* FILE: ".$flist[$i]." */\n\n";
                $buffer .= file_get_contents($flist[$i]);
            } else {
                $fname = explode('-', $flist[$i]);
                $fname = strtolower($fname[1]);
                if (substr($ua, 0, strlen($fname)) == $fname) {
                    
                    $buffer .= "\n /* FILE: ".$flist[$i]." */\n";
                    $buffer .= " /* PLATFORM: $fname */\n\n";
                    
                    $buffer .= ($flist[$i]);
                    
                }
            }
        }
    }
    
    if (isset($_GET['devel']))
        die($buffer);
    
    
    function error($msg) {
        global $buffer;
        die("/** CSS ERROR: $msg **/\n\n$buffer");
    }

    if (isset($_GET['build'])) {
        
            $compiled_buffer = $buffer;
            
            $compileDate = addslashes(date('l jS \of F Y h:i:s A'));
            
            if (file_put_contents(dirname(__FILE__)."/index.css", 
                "/* You are using an automatically generated CSS code with the help of the YUI Compressor\n".
                "Code was compiled on $compileDate */\n\n$compiled_buffer"
            ) === false) {
                echo "/* WARNING: Could not store the compiled code to disk! */\n";
            } else
                echo "/* Compiled css stored on server!*/\n\n";
            
            die($compiled_buffer);
            
    }

    die($buffer);

?>