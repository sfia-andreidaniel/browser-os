<?php
    if (!isset($_SESSION)) session_start();
    $_SESSION['policies'] = array();
    session_destroy();
    session_start();
    session_regenerate_id();
    header("Location: .");
    echo 'Redirecting.';
    die('');
?>