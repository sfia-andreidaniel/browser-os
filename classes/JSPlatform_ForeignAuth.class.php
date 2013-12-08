<?php

    /** FILE: JSPlatformForeignAuth.class.php
    
        Description:
            Extendable Abstract class used to
            implement the JSPlatform Foreign Authentication mechanism
        
        Dependencies:
            - classes/JSPlatformForeignAuthInterface.interface.php
            - classes/UsersAndGroups.inc.php
            - conf/open_db.php  //FOR $mysql_conn
            - conf/globals.php  //FOR $__DBADMIN__
        
        File Version       : 1.0
        JSPlatform Version : 2.0
        PHP Version        : >= 5.3 (interfaces support, etc)
        
        Author             : Andrei Sfia <andrei.sfia@gmail.com>, <andrei.sfia@targuju.rcs-rds.ro>
        Date               : 27 May 2011
        
     **/

    require_once "JSPlatform_ForeignAuthInterface.interface.php";

    abstract class JSPlatform_ForeignAuth {
    
        // Class configuration
        protected $_config = array();
        
        /** @__constructor class
            
            The $config should be an ($configArray) [
                <optional> "autoEnable" => (0 | 1 | false | true)  //When inserting user for the first time, to insert it <default> ENABLED
                <optional> "autoExpire" => (mysql_DATETIME_STRING) //When inserting user for the first time, to insert it <default> NULL (never expire)
        //TODO: <optional> "autoRegisterNewGroups"                 // <IMPLEMENTED AS DEFAULT YES>
        //TODO: <optional> "autoFlushPolicies"                     // <IMPLEMENTED AS DEFAULT YES>
                ...
                ...
                ...  // Other options to be passed
                ...  // to child classes
            ]
            
         **/
        final public function __construct($config) {
            if (!is_array($config))
                throw new Exception("Config is not an array!");
            
            $this->_config = $config;
        }
        
        /* This method should be overitten by coder, and return an
                (array)$loginResponse [
                               "user"        => (str),
                               "uid"         => (int),     //NOTE THAT THIS IS THE FOREIGN ID, NOT THE UID FROM JSPLATFORM!!! (E.G. USE SOCIAL NUMBER ID)
                               "groups"      => (array) [
                                 (str)group_1,
                                 ...
                                 (str)group_n
                               ],
                    <optional> "email"       => (str),
                    <optional> "phone"       => (str),
                    <optional> "description" => (str),
                    
                    <optional> "enabled"     => 0 || '0' || 1 || true || false || 'y' || 'n' || 'Y' || 'N' //NOTE THAT ONLY THE {0, FALSE, and 'N'} values are checked
                ]
         */
        abstract public function checkLogin($userName, $password);
        
        //Used to test the result returned by the checkLogin $loginResponse function
        //implemented by the coder
        final protected function registerUser($loginResponse) {
        
            global $__DBADMIN__;
            global $mysql_conn;
            
            if (!isset($__DBADMIN__) || !strlen($__DBADMIN__))
                throw new Exception("registerUser: \$__DBADMIN__ not defined!");
                
            if (!isset($mysql_conn) || !is_resource($mysql_conn))
                throw new Exception("registerUser: \$mysql_conn is not defined or is not a resource!");
        
            if (!is_array($loginResponse))
                throw new Exception("Not a JSPlatformForeignAuth loginResponse");
            if (!isset($loginResponse['uid']) || !preg_match('/^([1-9])([0-9]+)?$/', $loginResponse['uid']))
                throw new Exception("LoginResponse: invalid user id!!!");
            if (!isset($loginResponse['groups']) || !is_array($loginResponse['groups']))
                throw new Exception("LoginResponse: groups not found or not an array!");
            if (!isset($loginResponse['user']) || !preg_match('/^([a-z0-9\.\-_\@]+)$/i', trim($loginResponse['user'])))
                throw new Exception("LoginResponse: invalid user '$loginResponse[user]'");
            
            if (isset($loginResponse['enabled'])) {
                if (in_array(
                        $loginResponse['enabled'], 
                        array(
                        '0', 0, 'n', 'N', false
                        ), TRUE 
                    )
                ) throw new Exception("Error: Account is disabled");
            }
            
            $user = mysql_real_escape_string(trim($loginResponse['user']));
            
            //Checks if there is a user name mismatch on JSPlatform (the same userID, but different userName)
            $sql = "SELECT id, foreign_id, user FROM $__DBADMIN__.admin_auth WHERE user='$user' LIMIT 1";
            $result = mysql_query($sql, $mysql_conn);
            if (!$result)
                throw new Exception("registerUser: MySql error: ".mysql_error()."\nSQL = $sql");
            
            $userExists = false;
            
            //If user allready found, then check if the foreignID of the user corresponds with the foreignID from the
            //admin_auth table
            if (mysql_num_rows($result)) {
                list($localID, $foreignID, $localUser) = mysql_fetch_row($result);
                
                if ($foreignID != $loginResponse['uid'])
                    throw new Exception("registerUser: User is registered locally, but it's foreignID is different. Aborting!");
                
                $userExists = true;
            } else {
                //We insert the user in database ...
                $sql = "INSERT INTO $__DBADMIN__.admin_auth (
                            foreign_id, user, pass, enabled, expires, email, phone, description, policy_timestamp, policies
                        ) VALUES (
                            $loginResponse[uid],
                            '$user',
                            MD5(''),
                            ". (isset($this->_config['autoEnable']) ? (int)$this->_config['autoEnable'] : '1') .",
                            ". (isset($this->_config['autoExpire']) ? ("'".mysql_real_escape_string($this->_config['autoExpire'])."'") : 'NULL') .",
                            '".( isset($loginResponse['email']) ? mysql_real_escape_string($loginResponse['email']) : '' )."',
                            '".( isset($loginResponse['phone']) ? mysql_real_escape_string($loginResponse['phone']) : '' )."',
                            '".( isset($loginResponse['description']) ? mysql_real_escape_string($loginResponse['description']) : '')."',
                            0,
                            ''
                        )";
                $result = mysql_query($sql, $mysql_conn);
                if (!$result)
                    throw new Exception("Could not register user: MySQL Error: ".mysql_error()."\nSQL: $sql");
                    
                $localID = mysql_insert_id();
            }
            
            $userGroups = array();
            
            //Now, bind groups to local JSPlatform groups, and register them dinamically ...
            for ($i=0; $i<count($loginResponse['groups']); $i++) {
                $groupName = trim($loginResponse['groups'][$i]);
                
                //echo "$groupName: ";
                
                if (!strlen($groupName)) continue;
                
                //echo "$groupName\n";
                
                $groupName = mysql_real_escape_string($groupName);
                $sql = "SELECT gid FROM $__DBADMIN__.admin_groups WHERE name = '$groupName' LIMIT 1";
                $result = mysql_query($sql, $mysql_conn);
                
                if (!$result)
                    throw new Exception("MySQL Error: ".mysql_error()."\nSQL = $sql");
                
                if (mysql_num_rows($result)) {
                    list($__gid) = mysql_fetch_row($result);
                    $userGroups[] = $__gid;
                    
                } else {
                    
                    //echo "\ninserting: '$groupName'\n";
                    
                    //We insert the group into JSPlatform ...
                    $sql = "INSERT INTO $__DBADMIN__.admin_groups (name, description) VALUES ('$groupName', 'Foreign Group')";
                    
                    //echo "\n$sql\n";
                    
                    $result = mysql_query($sql, $mysql_conn);
                    
                    if (!$result) {
                        throw new Exception("MySQL Error: Could not insert group '$groupName' into database!: ".mysql_error()."\nSQL = $sql");
                    }
                    else {
                        $__gid = mysql_insert_id();
                        $userGroups[] = $__gid;
                    }
                }
            }
            
            //We create the admin_group_mappings relationships ...
            foreach ($userGroups as $groupMapping) {
                $sql = "SELECT gid FROM $__DBADMIN__.admin_group_mappings WHERE gid = $groupMapping AND uid = $localID LIMIT 1";
                $result = mysql_query($sql, $mysql_conn);
                if (!$result)
                    throw new Exception("MySQL Error: ".mysql_error()."\n$sql");
                if (!mysql_num_rows($result)) {
                    //We register the group mapping
                    $sql = "INSERT INTO $__DBADMIN__.admin_group_mappings (uid, gid) VALUES ($localID, $groupMapping)";
                    $result = mysql_query($sql, $mysql_conn);
                    if (!$result)
                        throw new Exception("Could not register user groupMapping: MySQL Error: ".mysql_error()."\n$sql");
                }
            }
            
            //die("HHH");
            
            //We now flush policies for this user ...
            if (file_exists(dirname(__FILE__)."/UsersAndGroups.inc.php"))
                require_once dirname(__FILE__)."/UsersAndGroups.inc.php";
            else
                throw new Exception("Include file: UsersAndGroups.inc.php was not found!");
            
            $warnings = ACLFlushPolicies(
                array(
                    $localID
                )
            );
            
            if ($warnings !== true)
                throw new Exception("UsersAndGroups: Flush policies errors:\n".implode("\n", $warnings));
            
            return $loginResponse['user'];
        }
        
        /**
            Used to perform the whole login workFlow.
               RETURNS:
                    ON SUCCESS: The ID of the user
                    ON ERROR  : NOTHING (Throws exception)
                    
         **/
        final public function login($userName, $password) {
            $loginResponse = $this->checkLogin($userName, $password);
            return $this->registerUser($loginResponse);
        }
    }

?>