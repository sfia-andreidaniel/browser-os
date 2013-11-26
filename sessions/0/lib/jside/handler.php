<?php

    $do = isset( $_POST['do'] ) ? $_POST['do'] : die("What to do?");
    
    switch ($do) {
        case "save":
            $data = isset( $_POST['data'] ) ? $_POST['data'] : die("Which data?");
            header("Content-Type: application/octet-stream");
            header("Content-Disposition: attachment; name=\"project.jside\"");
            echo $data;
            break;
        case "compile":
            $code = isset( $_POST['code'] ) ? $_POST['code'] : die("Which code?");
            $language = isset( $_POST['language'] ) ? $_POST['language'] : die("Which language?");
            
            ini_set( 'display_errors', 'on');
            
            switch ($language) {
                
                case 'javascript':
                    
                    if ( extension_loaded( 'v8js' ) ) {
                        
                        try {
                            
                            $v8 = new V8Js();
                            $v8->executeString( $code, 'snippet.js' );
                            
                            echo json_encode( array(
                                'status' => 'success'
                            ) );
                            
                        } catch (Exception $e) {
                            echo json_encode( array(
                                'message' => $e->getMessage(),
                                'status'  => 'failure'
                            ) );
                        }
                        
                    } else {
                        
                        echo json_encode( array(
                            'message' => "JavaScript V8 PHP extension is not installed. Please install it first!\n\nBecause of this, we'll assume that you know what you're doing,\nand that the code is semantically correct",
                            'status'  => 'success'
                        ) );
                        
                    }
                    
                    break;
                
                default:
                    echo json_encode( array( 
                        "message" => "JSIde don't know how to compile a code written in $code"
                    ) );
                    break;
            }
            
            break;
    }

?>