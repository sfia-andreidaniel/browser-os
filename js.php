<?php

    header("Content-type: text/javascript");


    if (isset($_GET['load_cached']) && file_exists('jsplatform.js')) {
        readfile('jsplatform.js');
        exit;
    }

    $_MAPPINGS = array(
        "1" => 'js/window.js' //This is the first required file to be loaded
    );
    
    function get_num_lines($buffer) {
        return count(explode("\n", $buffer));
    }
    
    $buffer = "//BEGIN FILE: js/window.js\n";
    
    $buffer .= file_get_contents('js/window.js');

    $flist = scandir('./js');
    
    $unoptimizedFiles = array();
    
    for ($i=0; $i<count($flist); $i++) {
        $info = pathinfo($flist[$i]);
        
        if (isset( $info['extension'] ) && $info['extension'] == 'js' && $flist[$i] != 'window.js') {
            
            if ( substr( $flist[$i], 0, 1 ) != '!' ) {
            
                $buffer .= "\n//BEGIN FILE: ".$flist[$i]."\n";
            
                $_MAPPINGS[''.get_num_lines($buffer)] = $flist[$i];
            
                $buffer .= file_get_contents("js/".$flist[$i]);
            
            } else {
                $unoptimizedFiles[] = "\n//UNOPTIMIZED FILE: " . $flist[$i] . "\n" . file_get_contents( "js/" . $flist[$i] ) . "\n";
            }
        }
    }
    
    $unoptimizedFiles = implode("\n", $unoptimizedFiles );
    $buffer = preg_replace('/\n[\s]+/', "\n", $buffer);
    $unoptimizedFiles = preg_replace('/\n[\s]+/', "\n", $unoptimizedFiles);
    
    $argv = isset( $argv ) ? $argv : array();
    
    if (!isset($_GET['debug']) && (count($argv) != 2 || $argv[1] != 'debug'))
        //No closure compiler needed
        die($buffer . $unoptimizedFiles);
    
    function translate_error($line_no) {
        global $_MAPPINGS;
        
        $file = '<unknown>';
        $line = '<unknown>';
        
        for ($i=$line_no; $i>=0; $i--) {
            if (isset($_MAPPINGS["$i"])) {
                $file = $_MAPPINGS["$i"];
                $line = $line_no - $i;
                return array($file, $line);
            }
        }
        return array($file, $line);
    }
    
    define('JAVA_PATH',               trim(`which sudo`).' '.trim(`which java`));
    define('CLOSURE_COMPILER',        realpath('contrib/closure-compiler/compiler.jar'));
    
    function error($msg) {
        global $buffer;
        global $unoptimizedFiles;
        $buffer = "console.warn('JSPlatform: ' + ".json_encode($msg).");\n\n".$buffer;
        file_put_contents( dirname(__FILE__) . "/jsplatform.js", $buffer . "\n\n" . $unoptimizedFiles );
        die($buffer . "\n\n" . $unoptimizedFiles );
    }
    
    if (!strlen(JAVA_PATH))
        error("java not found in your path environment");
    
    if (!strlen(CLOSURE_COMPILER))
        error("closure compiler not found!");
    
    $cmd_line = JAVA_PATH.' -jar '.CLOSURE_COMPILER/*." --compilation_level ADVANCED_OPTIMIZATIONS"*/;
    
    $descriptor_spec = array(
        0 => array('pipe', 'r'), //stdin
        1 => array('pipe', 'w'), //stdout
        2 => array('pipe', 'w')  //stderr
    );
    
    $process = proc_open($cmd_line, $descriptor_spec, $pipes, null, null);
    stream_set_blocking($pipes[2], 0);
    
    if (is_resource($process)) {
        
        //Write the javaScript to the process
        
        fwrite($pipes[0], $buffer);
        fclose($pipes[0]);
        
        $compiled_buffer = trim(stream_get_contents($pipes[1]));
        
        $compiler_errors = stream_get_contents($pipes[2]);

        fclose($pipes[2]);
        fclose($pipes[1]);
        
        $result = proc_close($process);
        
        //Parse compiler errors ...
        
        if (strlen($compiler_errors)) {
        
            $errors = array();
        
            $lines = explode("\n", $compiler_errors);
            for ($i=0; $i<count($lines); $i++) {
                if (preg_match('/^stdin\:([0-9]+)\: ERROR \- ([^*]+)$/', $lines[$i], $matches)) {
                    list($dummy, $line_no, $error_msg) = $matches;
                    list($file, $line) = translate_error((int)$line_no);
                    $lineCode = $lines[$i+1];
                    $lineCode2= $lines[$i+2];
                    $i += 1;
                    
                    $errors[] =
                        (count($errors)+1)."\n".
                        "Error: $error_msg\n".
                        "File : $file\n".
                        "Line : $line\n".
                        "Row  : ".(strpos($lineCode2, '^') + 1)."\n".
                        "@@   : $line_no\n".
                        "Code : \n$lineCode\n$lineCode2";
                    
                }
            }
            
            if (defined('STDIN') && count($errors)) {
                die(implode("\n\n", $errors));
            }
            
            if (count($errors)) {
                error(implode("\n\n", $errors));
            }
        }
        
        if (!strlen($compiled_buffer))
            error("No compiler output");
        
        $compileDate = addslashes(date('l jS \of F Y h:i:s A'));
        
        if (file_put_contents(dirname(__FILE__)."/jsplatform.js", 
            "console.warn('You are using an automatically generated javascript code with the help of the Closure Compiler\\n'+\n".
            "'Code was compiled on $compileDate\\n\\n');\n\n$compiled_buffer\n\n$unoptimizedFiles"
        ) === false) {
            echo "console.warn('Could not store the compiled code to disk!\\n\\n')\n\n";
        } else
            echo "console.info('Compiled javascript stored on server!\\n\\n');\n\n";
        
        die($compiled_buffer . "\n\n$unoptimizedFiles");
        
    } else error("Could not create ClosureCompiler process");
    
?>