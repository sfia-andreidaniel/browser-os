<?php

    $url = isset($_GET['url']) ? $_GET['url'] : die("Which url?");
    
    //die($url);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_REFERERER, "http://$_SERVER[SERVER_NAME]");
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.134 Safari/534.16');
    curl_setopt($ch, CURLOPT_FOLLOWREDIRECT, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    
    $buffer = curl_exec($ch);
    if ($buffer === false) die("FALSE!");
    else {
	header("Content-type: data/image");
	header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
	header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
	echo $buffer;
    }

?>