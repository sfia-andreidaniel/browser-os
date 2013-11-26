<?php 

    if (!isset($_SESSION)) session_start();
    $_SERVER['PHP_AUTH_USER'] = isset($_SESSION['UNAME']) ? $_SESSION['UNAME'] : 'nobody';
    
    if (isset($_SESSION['UID'])) require_once "conf/open_db.php";
    
    if (isset( $_GET['devel'] ) || isset( $_GET['build'] ) )
        $_SESSION['EXECUTION_MODE'] = 'development';
    else
        $_SESSION['EXECUTION_MODE'] = 'production';

 ?><!DOCTYPE HTML>
<html>
<head>
    <title><?php echo $_SERVER['PHP_AUTH_USER'],'@', isset($_SESSION['SESSION_NAME']) ? htmlentities($_SESSION['SESSION_NAME']) : 'No Session'; ?></title>
    
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    
    <!-- Google Chrome Frame Compatible Page -->
    
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <!-- <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/chrome-frame/1/CFInstall.min.js"></script> -->

    <!-- END of Google Chrome Frame Compatible Page -->

    <script type="text/javascript">
        var onloadFunc = [];
        function addOnload(func_name) { onloadFunc.push(func_name); }
        function bodyOnload() { for(var i=0; i<onloadFunc.length; i++) { onloadFunc[i](); } }
        
        /* Add Google Chrome Frame Compatible Startup Sequence */
        /* addOnload(function() {
            try {
                CFInstall.check({
                    mode: "overlay",
                    destination: "http://<?php echo $_SERVER['SERVER_NAME']; ?>/"
                });
            } catch (GoogleException) {
                
            }
        }); */
        /* End of Google Chrome Frame Compatible Startup Sequence */
    </script>
    
    <script type="text/javascript" src="<?php 
        switch (true) {
            
            //The debug version will generate a jsplatform.js in the root of the jsplatform,
            //and also dump this file.
            case isset($_GET['build']): 
                echo "js.php?debug";
                break;
            //The devel version will dump only the concatenated scripts
            //from the js folder, without any optimizations
            case isset($_GET['devel']):
                echo "js.php?devel";
                break;
            //the load_cached version will try to load the jsplatform.js
            //file, otherwise will be exactly as devel
            default:
                echo "jsplatform.js";
                break;
        }
    ?>">
        /* This is the core script of JSPlatform */
    </script>
    
    <script type="text/javascript" src="contrib/ace-editor/ace.js">
        /* The ACE Editor project, from http://ace.ajax.org */
    </script>
    
    <!-- 
    <script type="text/javascript" src="contrib/tinymce/jscripts/tiny_mce/tiny_mce_dev.js">
        /* TinyMCE wisiwig html editor */
    </script>
    -->

    <script type="text/javascript" src="contrib/tinymce4/tinymce.min.js">
        /* TinyMCE wisiwig html editor */
    </script>
    
    <script type="text/javascript" src="contrib/jwplayer/jwplayer.js">
        /* JW MediaPlayer 5.9 */
    </script>

    <script type="text/javascript">
        /* Start The Login Process... */
        addOnload(function() { AppExec('bin/jsystem_tray.app'); AppExec('bin/jlogon.app'); });
    </script>
    
    <?php
        if (isset( $_SESSION ) && isset( $_SESSION['UID'] ) && preg_match('/^[\d]+$/', $_SESSION['UID'])) {
            if (file_exists( 'home/' . $_SESSION['UID'] . '/.theme' ) ) {
                $THEME_NAME = @file_get_contents( 'home/' . $_SESSION['UID'] . '/.theme' );

                if (empty( $THEME_NAME ) || !preg_match( '/^[a-z0-9\-\_]+([a-z0-9\-\_\.]+)?$/i', $THEME_NAME ) )
                    $THEME_NAME = 'default';
            }
        } else $THEME_NAME = 'default';
        
        if (!strlen( trim( $THEME_NAME )))
            $THEME_NAME = 'default';
    ?>
    
    <!-- The default stylesheet -->
    <link rel="stylesheet" type="text/css" id="theme-css" href="css/<?php echo $THEME_NAME; ?>/<?php
        switch (true) {
            
            //The debug version will generate a jsplatform.js in the root of the jsplatform,
            //and also dump this file.
            case isset($_GET['build']): 
                echo "index.php?build";
                break;
            //The devel version will dump only the concatenated scripts
            //from the js folder, without any optimizations
            case isset($_GET['devel']):
                echo "index.php";
                break;
            //the load_cached version will try to load the jsplatform.js
            //file, otherwise will be exactly as devel
            default:
                echo "index.css";
                break;
        }
        
    ?>" />
    
</head>
<body style="margin: 0px; padding: 0px" onload="try { bodyOnload(); } catch(e) { alert('Could not load interface:\n\nEnsure that you are using GoogleChrome or Firefox\n\n'+e); } ">
</body>
</html>