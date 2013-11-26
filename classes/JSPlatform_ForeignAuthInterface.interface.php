<?php

    /* Standard Foreign Autentication interface, used to standardize
       an authentication source */

    interface JSPlatform_ForeignAuthInterface {
        
        /* In the $config, you should pass the configuration needed for the class
           to initialize itself
         */
        
        public function __construct($config);
        
        
        
        
        /* The login method should return a structure like this:
            
            array(
                'uid'    => int,
                'user'   => string
                'groups' => array(
                    <string_group_#1>,
                    <string_group_#2>,
                    ...
                )
            )
            
            ON FAILURE THE CLASS SHOULD THROW AN EXCEPTION!!!
        
         */
        public function checkLogin($userName, $password);
        
        
        /* This function is used in order to perform all the login phase,
           and is implemented by JSPlatform.
         */
        
        public function login($userName, $password);
        
    }

?>