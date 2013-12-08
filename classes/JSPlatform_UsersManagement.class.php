<?php
    
    class JSPlatform_User {
        private $_conn = NULL;
        
        protected $_properties = array(
            'id'          => NULL,
            'name'        => NULL,
            'enabled'     => NULL,
            'expires'     => NULL,
            'email'       => NULL,
            'phone'       => NULL,
            'description' => NULL
        );
        
        public function __construct( $userID, &$mysqlConnection ) {
            $this->_conn = is_resource( $mysqlConnection ) ? $mysqlConnection : NULL;
            
            if ($this->_conn == NULL)
                throw new Exception("Class error: 2nd argument (mysqlConnection) is not a valid MySQL resource connection!");
            
            if (!isset($GLOBALS['__DBADMIN__']))
                throw new Exception("Class error: __DBADMIN__ global var is not definde!");
            
            global $__DBADMIN__;
            
            $sql = "SELECT id                                     AS `id`,
                           user                                   AS `name`,
                           IF (enabled = 1, 'Yes', 'No')          AS `enabled`,
                           IF (expires IS NULL, 'Never', expires) AS `expires`,
                           email                                  AS `email`,
                           phone                                  AS `phone`,
                           description                            AS `description`
                    FROM $__DBADMIN__.admin_auth
                    WHERE id = " . (int)$userID . "
                    LIMIT 1";
            $result = mysql_query( $sql, $this->_conn );
            
            if (!$result)
                throw new Exception("Error getting user info: mysql_error(): " . mysql_error( $this->_conn ));
            
            if (!mysql_num_rows( $result ))
                throw new Exception("Error: User #$userID not found!");
            
            list( $this->_properties['id'],
                  $this->_properties['name'],
                  $this->_properties['enabled'],
                  $this->_properties['expires'],
                  $this->_properties['email'],
                  $this->_properties['phone'],
                  $this->_properties['description']
            ) = mysql_fetch_row( $result );
            
            $this->_properties['name'] = strtolower( trim( $this->_properties['name'] ));
        }
        
        private function getGroups() {
            global $__DBADMIN__;
            
            $sql = "SELECT gid 
                    FROM $__DBADMIN__.admin_groups_mappings
                    WHERE uid = {$this->_properties['id']}";
            
            $result = mysql_query( $sql, $this->_conn );
            
            if (!$result)
                throw new Exception("Error enumerating groups: mysql_error(): " . mysql_error( $this->_conn ));
            
            $out = array();
            
            while ($row = mysql_fetch_array( $result, MYSQL_ASSOC ))
                $out[] = new JSPlatform_Group( $row['uid'], $this->_conn );
            
            return $out;
        }
        
        public function __get($propertyName) {
            switch (TRUE) {
                case $propertyName == 'groups':
                    return $this->getGroups();
                    break;
                case in_array( $propertyName, array_keys( $this->_properties) ):
                    return $this->_properties[ $propertyName ];
                    break;
                default:
                    throw new Exception("Class error: Invalid property `$propertyName`");
                    break;
            }
        }
        
        public function __invoke() {
            return "u" . $this->_properties['id'];
        }
    }
    
    class JSPlatform_Group {
        private $_conn = NULL;
        
        protected $_properties = array(
            'id'          => NULL,
            'name'        => NULL,
            'description' => NULL
        );
        
        protected $_cache = NULL;
        
        public function __construct( $groupID, &$mysqlConnection ) {
            $this->_conn = is_resource( $mysqlConnection ) ? $mysqlConnection : NULL;
            
            if ($this->_conn == NULL)
                throw new Exception("Class error: 2nd argument (mysqlConnection) is not a valid MySQL resource connection!");
            
            if (!isset( $GLOBALS['__DBADMIN__'] ))
                throw new Exception("Class error: __DBADMIN__ global var is not defined!");
                
            global $__DBADMIN__;
            
            $sql = "SELECT gid AS id, name, description FROM $__DBADMIN__.admin_groups WHERE gid = " . (int)$groupID . " LIMIT 1";
            $result = mysql_query($sql, $this->_conn);
            
            if (!$result)
                throw new Exception("Error getting group #$groupID info: mysql_error(): " . mysql_error( $this->_conn ));
            
            if (!mysql_num_rows($result))
                throw new Exception("Error: group #$groupID does not exist!");
            
            list( $this->_properties['id'],
                  $this->_properties['name'],
                  $this->_properties['description']
            ) = mysql_fetch_row( $result );
        }
        
        public function __get($propertyName) {
            switch (TRUE) {
                case $propertyName == 'users':
                    return $this->getMembers();
                    break;
                case in_array( $propertyName, array_keys( $this->_properties )):
                    return $this->_properties[ $propertyName ];
                    break;
                default:
                    throw new Exception("Class error: Illegal property name `$propertyName`");
            }
        }
        
        private function getMembers() {
        
            if ($this->_cache !== NULL)
                return $this->_cache;
        
            global $__DBADMIN__;
            
            $sql = "SELECT uid
                    FROM $__DBADMIN__.admin_group_mappings
                    WHERE gid = {$this->_properties['id']}";
            
            $result = mysql_query( $sql, $this->_conn );
            
            if (!$result)
                throw new Exception("Error enumerating users: mysql_error(): " . mysql_error( $this->_conn ) );
            
            $out = array();
            
            while ($row = mysql_fetch_array( $result, MYSQL_ASSOC )) {
                $out[] = new JSPlatform_User( $row['uid'], $this->_conn );
            }
            
            return $out;
        }
        
        public function hasUser( $userName ) {
            $members = $this->getMembers();
            
            $u = strtolower( trim( $userName ));
            
            foreach ($members as $member) {
                if ($member->name == $u)
                    return TRUE;
            }
            
            return FALSE;
        }
        
        public function __invoke() {
            return "g" . $this->_properties['id'];
        }
    }
    
    class JSPlatform_Resource {
        
        private $allows = array();
        private $denies = array();
        
        private $cache  = array();
        
        private $mysqlConnection = NULL;
        
        public function __construct( &$mysqlConnection, $str = '' ) {
        
            $this->mysqlConnection = $mysqlConnection;
        
            if (strlen($str))
                $this->load($str);
        }
        
        public function __get($propertyName) {
            switch ($propertyName) {
                case 'explain':
                case 'toString':
                    return $this->__toString();
                    break;
                case 'text':
                    return $this->toString();
                    break;
            }
        }
        
        public function __set($propertyName, $propertyValue) {
            switch ($propertyName) {
                case 'text':
                    $this->fromString( $propertyValue );
                    break;
            }
        }
        
        private function getEntity( $entityType, $entityID ) {
            $eid = "$entityType$entityID";
            
            if (isset($this->cache[$eid]))
                return $this->cache[$eid];

            switch ($entityType) {
                case 'u':
                    $this->cache[$eid] = new JSPlatform_User($entityID, $this->mysqlConnection);
                    break;
                case 'g':
                    $this->cache[$eid] = new JSPlatform_Group($entityID, $this->mysqlConnection);
                    break;
                default:
                    throw new Exception("Invalid entityType '$entityType'");
                    break;
            }
            
            return $this->cache[$eid];
        }
        
        private function fromString( $str ) {
            $this->allows = array();
            $this->denies = array();
            
            if (!strlen($str))
                return;
            
            $tokens = explode(';', $str);
            
            foreach ($tokens as $token) {
                
                
                if (!preg_match(
                    '/^(\+|\-)(u|g)([\d]+):((([\w]+)((,[\w]+)+)?))?$/',
                    $token,
                    $matches
                    )
                ) { 
                    throw new Exception("Invalid Resource Security: '$token'");
                }
                
                //print_r($matches);
                
                if (!@strlen($matches[4]))
                    continue;
                
                switch ($matches[1]) {
                    case '+':
                        $this->allows[ $matches[1].$matches[2] ] = array(
                            'type'   => $matches[2],
                            'id'     => $matches[3],
                            'entity' => $this->getEntity( $matches[2], $matches[3] ),
                            'rights' => @strlen( $matches[4] ) ? explode(',', $matches[4]) : array()
                        );
                        break;
                    case '-':
                        $this->denies[ $matches[1].$matches[2] ] = array(
                            'type'   => $matches[2],
                            'id'     => $matches[3],
                            'entity' => $this->getEntity( $matches[2], $matches[3] ),
                            'rights' => @strlen( $matches[4] ) ? explode(',', $matches[4]) : array()
                        );
                        break;
                }
                
            }
            
            $this->allows = array_values( $this->allows );
            $this->denies = array_values( $this->denies );
        }
        
        public function toString() {
            $out = array();
            foreach ($this->allows as $allow) {
                $out[] = "+" . $allow['type'] . $allow['id'] . ':' . implode(',', $allow['rights']);
            }
            foreach ($this->denies as $deny) {
                $out[] = "-" . $deny['type'] . $deny['id'] . ':' . implode(',', $deny['rights'] );
            }
            
            return implode(";", $out);
        }
        
        public function test( $userName, $right, $defaultIfNotPresent = FALSE ) {
        
            $user = strtolower( trim ($userName ) );
        
            //Check if there is a deny entry
            foreach ($this->denies as $deny) {
                switch (TRUE) {
                    
                    case $deny['type'] == 'u' && $user == $deny['entity']->name && in_array($right, $deny['rights']):
                        return FALSE;
                        break;
                    
                    case $deny['type'] == 'g' && $deny['entity']->hasUser( $user ):
                        return FALSE;
                        break;
                    
                    break;
                }
            }
            
            //Check if there is any allow entry
            foreach ($this->allows as $allow) {
                switch (TRUE) {
                    
                    case $allow['type'] == 'u' && $user == $allow['entity']->name:
                        return TRUE;
                        break;
                    
                    case $allow['type'] == 'g' && $allow['entity']->hasUser( $user ) && in_array($right, $allow['rights']):
                        return TRUE;
                        break;
                    
                }
            }
            
            return $defaultIfNotPresent;
        }
        
        //entityUID is in format: "/^[u|g][\d]+$/"
        public function getRights( $entityUID ) {
        
            if (!preg_match('/^[u|g][\d]+$/', $entityUID))
                throw new Exception("Invalid entityUID '$entityUID'");
        
            $out = array();
            
            foreach ($this->allows as $allow) {
                if ($allow['type'] . $allow['id'] == $entityUID) {
                    foreach ($allow["rights"] as $right) {
                        $right = strtolower($right);
                        $out["$right:allow"] = true;
                    }
                }
            }
            
            foreach ($this->denies as $deny) {
                if ($deny['type'] . $deny['id'] == $entityUID) {
                    foreach ($deny["rights"] as $right) {
                        $right = strtolower($right);
                        if (isset($out["$right:allow"])) {
                            unset($out["$right:allow"]);
                        }
                        $out["$right:deny"] = true;
                    }
                }
            }
            
            return array_keys( $out );
        }
        
        //->update('allow', 'group', 'administrators', 'read');
        //->update('+', 'g', 'administrators', 'read,write');
        //->update('deny', 'user', 'gigi', 'publish');
        //->update('-', 'u', 'john', 'merge,publish');
        //->update('!', 'u', 'john', 'merge');
        
        public function update( $operation, $entityType, $entityName, $rightsList ) {
            $queue = NULL;
            
            if (!isset($GLOBALS['__DBADMIN__']))
                throw new Exception("Class error: Global var '__DBADMIN__' not defined!");
            
            if (!preg_match('/^(([\w]+)((,[\w]+)+)?)?$/', $rightsList))
                throw new Exception("Invalid rights list: '$rightsList'!");
            
            global $__DBADMIN__;
            
            switch (strtolower( $operation )) {
                case 'allow':
                case '+':
                    $queue = 'allows';
                    $clear = 'denies';
                    $operation = '+';
                    break;
                
                case 'deny':
                case '-':
                    $queue = 'denies';
                    $clear = 'allows';
                    $operation = '-';
                    break;
                
                case 'unset':
                case '!':
                    $operation = '!';
                    break;
                
                default:
                    throw new Exception("Invalid operation! Allowed only ('allow' || '+', 'deny' || '-')");
                    break;
            }
            
            switch (strtolower( $entityType )) {
            
                case 'user':
                case 'u':
                
                    $entityType = 'u';
                
                    $sql = "SELECT id FROM $__DBADMIN__.admin_auth WHERE user='" . mysql_real_escape_string( $entityName ) . "' LIMIT 1";
                    break;
                
                case 'group':
                case 'g':
                    
                    $entityType = 'g';
                    
                    $sql = "SELECT gid FROM $__DBADMIN__.admin_groups WHERE name='" . mysql_real_escape_string( $entityName ) . "' LIMIT 1";
                    break;
                
                default:
                    throw new Exception("Invalid entityType '$entityType'!");
                    break;
            }
            
            //Find out entityID
            $result = mysql_query($sql, $this->mysqlConnection);
            if (!$result)
                throw new Exception("Class error: mysql_error(): " . mysql_error());
            
            if (!mysql_num_rows( $result ))
                throw new Exception( ($entityType == 'u' ? "User " : "Group ") . "'$entityName' was not found!" );
            
            list($entityID) = mysql_fetch_row( $result );
            
            
            if (in_array($operation, array('+', '-'))) {
            
                //Now find out if there is any "allow" or "deny" for entity ID ...
                $entityIndex = NULL;
            
                for ($i=0; $i < count($this->{"$queue"}); $i++) {
                    if ($this->{"$queue"}[$i]['type'] == $entityType && $this->{"$queue"}[$i]['id'] == $entityID) {
                        $entityIndex = $i;
                        break;
                    }
                }

                for ($i=0; $i < count($this->{"$clear"}); $i++) {
                    if ($this->{"$clear"}[$i]['type'] == $entityType && $this->{"$clear"}[$i]['id'] == $entityID) {
                        
                        $this->{"$clear"}[$i]['rights'] = array_diff( $this->{"$clear"}[$i]['rights'], explode(',', strtolower($rightsList)));
                        break;
                    }
                }
            
                if (NULL === $entityIndex) {
                
                    $this->{"$queue"}[] = array(
                        'type'   => $entityType,
                        'id'     => $entityID,
                        'entity' => $this->getEntity("$entityType", "$entityID"),
                        'rights' => array()
                    );
                    
                    $entityIndex = count( $this->{"$queue"} ) - 1;
                }
            
                $this->{"$queue"}[ $entityIndex ]['rights'] = explode(',', strtolower($rightsList));
            } else {
                //If operation is "unset" (!), we delete the right from all security queues
                
                foreach ( array("allows", "denies") as $queueName ) {
                    
                    for ($i=0; $i<count($this->{"$queueName"}); $i++) {
                        
                        if ($this->{"$queueName"}[$i]['type'] == $entityType && $this->{"$queueName"}[$i]['id'] == $entityID) {
                            
                            $this->{"$queueName"}[$i]['rights'] = array_diff( $this->{"$queueName"}[$i]['rights'], explode(',', strtolower($rightsList)));
                            break;
                        }
                        
                    }
                    
                }
            }
        }
        
        public function __toString() {
            $out = array();
            foreach ($this->allows as $allow) {
                $out[] = "ALLOW " . ($allow['type'] == 'u' ? 'USER' : 'GROUP') .
                         ' ' . $allow['entity']->name . ' TO ' . implode(', ', $allow['rights']);
            }
            foreach ($this->denies as $deny) {
                $out[] = "DENY " . ($deny['type'] == 'u' ? 'USER' : 'GROUP') .
                         ' ' . $deny['entity']->name . ' TO ' . implode(', ', $deny['rights'] );
            }
            
            return implode("\n", $out);
        }
        
    }
    
    class JSPlatform_UsersManagement {
        
        private $_conn = NULL;
        
        public function __construct( &$mysqlConnection ) {
            
            if (!isset($GLOBALS['__DBADMIN__']))
                throw new Exception("Class error: __DBADMIN__ global var is not defined!");
            
            if (!is_resource( $mysqlConnection )) {
                throw new Exception("Class error: 1st argument (mysqlConnection) is not a valid MySQL resource connection");
            }
            
            $this->_conn = $mysqlConnection;
        }
        
        private function getGroups() {
            global $__DBADMIN__;
            $sql = "SELECT $__DBADMIN__.admin_groups.gid AS id FROM $__DBADMIN__.admin_groups ORDER BY $__DBADMIN__.admin_groups.name";
            $result = mysql_query($sql, $this->_conn);
            if (!$result)
                throw new Exception("Error getting groups: " . mysql_error( $this->_conn ));
            $out = array();
            
            while ($row = mysql_fetch_array( $result, MYSQL_ASSOC )) {
                $out[] = new JSPlatform_Group( $row['id'], $this->_conn );
            }
            
            return $out;
        }
        
        private function getUsers() {
            global $__DBADMIN__;
            $sql = "SELECT id FROM $__DBADMIN__.admin_auth ORDER BY user";
            $result = mysql_query( $sql, $this->_conn );
            if (!$result)
                throw new Exception("Error enumerating users: mysql_error(): " . mysql_error( $this->_conn ));
            $out = array();
            
            while ($row = mysql_fetch_array( $result, MYSQL_ASSOC ))
                $out[] = new JSPlatform_User( $row['id'], $this->_conn );
            
            return $out;
        }
        
        public function __get( $propertyName ) {
            switch ($propertyName) {
                case 'groups':
                    return $this->getGroups();
                    break;
                case 'users':
                    return $this->getUsers();
                    break;
                case 'createPolicy':
                    return new JSPlatform_Resource($this->_conn);
                    break;
                default:
                    throw new Exception("Class error: Invalid property name `$propertyName`!");
                    break;
            }
        }
    }

?>