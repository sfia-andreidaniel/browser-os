<?php

    $default = array(
        array(
            'value'   => '',
            'text'    => 'This Server (JSPlatform DB)'
        )
    );

    $buffer = file_get_contents('conf/auth_sources.json');
    
    if (!$buffer)
        die(
            json_encode($default)
        );
    
    $buffer = json_decode($buffer, true);
    
    if (!is_array($buffer))
        die(
            json_encode($default)
        );
    
    $out = array();
    
    foreach ($buffer as $item) {
        $arr = array(
            'value' => isset($item['id']) ? $item['id'] : '',
            'text'  => isset($item['name']) ? $item['name'] : ("Authentication Source #".count($out))
        );
        
        $out[] = $arr;
    }
    
    echo json_encode($out);

?>