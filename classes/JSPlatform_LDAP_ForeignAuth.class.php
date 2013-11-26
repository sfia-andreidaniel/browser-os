<?php

    /** File:  JSPlatform_LDAP_ForeignAuth.class.php
        Description:
            Ldap support for foreign authentication in JSPlatform
    
        Author: Andrei Sfia <sfia.andreidaniel@gmail.com>, <andrei.sfia@targujiu.rcs-rds.ro>
        Date  : 27 May 2011
        
    **/

    require_once "JSPlatform_ForeignAuth.class.php";
    
    class JSPlatform_LDAP_ForeignAuth extends JSPlatform_ForeignAuth {
        
        private $_groups      = array();
        private $_uid         = null;
        private $_phone       = null;
        private $_email       = null;
        private $_description = null;
        
        private function ldapSearchParse($fieldName, $ldapSearchResult, $returnAsLiteral = true) {

            /** @param $ldapSearch is in this format:
                Array
                (
                    [memberof] => Array
                    (
                        [count] => 8
                        [0] => CN=Gxxp_WxB,OU=Grup,OU=Groups,DC=rcs-rds,DC=local
                        [1] => CN=Rxxxxn_Cxxxxxa,OU=Regiuni,OU=Groups,DC=rcs-rds,DC=local
                        [2] => CN=Bxxxxh_Txxxu-Jxu,OU=Branch,OU=Groups,DC=rcs-rds,DC=local
                        [3] => CN=Gxxp_Bxxxxxxe,OU=Grup,OU=Groups,DC=rcs-rds,DC=local
                        [4] => CN=Dxv_xx_MxxS,OU=Dxxxxxe,OU=Groups,DC=rcs-rds,DC=local
                        [5] => CN=LxxP Lxxxx,OU=Axxxxxxxxxxe,OU=Groups,DC=rcs-rds,DC=local
                        [6] => CN=VxxxxN,OU=Axxxxxxxxxxe,OU=Groups,DC=rcs-rds,DC=local
                        [7] => CN=Dxxxxxxxxc,OU=Departament,OU=Groups,DC=rcs-rds,DC=local
                    )
                    
                    [0] => memberof
                    [employeeid] => Array
                    (
                        [count] => 1
                        [0] => 8317
                    )
                    
                    [1] => employeeid
                    [uid] => Array
                    (
                        [count] => 1
                        [0] => 18xxxxxxxxxx45
                    )
                    
                    [2] => uid
                    [mail] => Array
                    (
                        [count] => 1
                        [0] => axxxxxxxxxa@txxxxxxxxxxxxxxxxxo
                    )
                    
                    [3] => mail
                    [count] => 4
                    [dn] => CN=DxxxxxxxxxxxxxxxxA,OU=Txxxxc,OU=Txxxxxxxu,OU=Fxxxxxe,DC=rxs-rxs,DC=lxxxl
                )
            **/


            /* @param $returnAsLiteral = TRUE:
                    if return value is an array with NO elements:
                        return NULL
                    if return value is an array with ONE element:
                        return THAT ELEMENT
                    OTHERWISE, return THAT ARRAY
                @param $returnAsLiteral = FALSE:
                    return the return value as an array, no matter what
            */
            
            $parts    = explode(':', $fieldName);
            $key      = $parts[0];
            $property = count($parts) > 1 ? $parts[1] : null;
            
            //should be an array!
            if (!isset($ldapSearchResult["$key"]) || !is_array($ldapSearchResult["$key"]))
                return null;
            
            if (!isset($ldapSearchResult["$key"]['count']) || !is_numeric($ldapSearchResult["$key"]["count"]))
                return null;
            
            $count = (int)$ldapSearchResult["$key"]['count'];
            
            //Scan through fields ...
            $fields = array();
            
            for ($i=0; $i<$count; $i++) {
                if (!isset($ldapSearchResult["$key"][$i]))
                    throw new Exception("LdapForeignAuth::ldapParse:: Property not found @index $i!");
                
                if ($property === null)
                    $fields[] = $ldapSearchResult["$key"][$i];
                else {
                    $str = $ldapSearchResult["$key"][$i];
                    $arr = explode(',', $str);
                    foreach ($arr as $component) {
                        list($componentName, $componentValue) = explode("=", $component);
                        if ($componentName == $property) {
                            $fields[] = $componentValue;
                            break;
                        }
                    }
                }
            }
            
            switch (true) {
                case ($returnAsLiteral && count($fields) == 0):
                    return null;
                    break;
                case ($returnAsLiteral && count($fields) == 1):
                    return $fields[0];
                    break;
                default:
                    return $fields;
            }
        }
        
        public function checkLogin($userName, $password) {
            
            if (!isset($this->_config['server']) || !strlen($this->_config['server']))
                throw new Exception("LdapForeignAuth: 'server' not defined in configuration!");
            
            if (!isset($this->_config['domain']) || !strlen($this->_config['domain']))
                throw new Exception("LdapForeignAuth: 'domain' not defined in configuration!");
            
            if (!isset($this->_config['dn']) || !strlen($this->_config['dn']))
                throw new Exception("LdapForeignAuth: 'dn' not defined in configuration!");
            
            if (!isset($this->_config['filters']) || !is_array($this->_config['filters']))
                throw new Exception("LdapForeignAuth: 'filters' is not defined in configuration or is not an array!");
            
            $this->conn = ldap_connect(trim($this->_config['server']));
            if (!$this->conn)
                throw new Exception("LdapForeignAuth: Could not connect to ldap server!");
                
            if (!strlen(trim($password)))
                throw new Exception("White passwords are not allowed!");
                
            $addr = trim($userName)."@".$this->_config['domain'];
            
            error_reporting(0);
            $bind = ldap_bind($this->conn, $addr, $password);
            error_reporting(E_STRICT);
            
            if (!$bind) 
                throw new Exception("Invalid userName or password ($addr)");
            
            $filter = ("samAccountName=$userName");
            
            $result = ldap_search($this->conn, $this->_config['dn'], $filter, array('memberof', 'uid', 'mail', 'phone', 'employeeid'));
            
            if (!$result)
                throw new Exception("LdapForeignAuth: LDAPSearch error!");
            
            error_reporting(0);
            $info = ldap_get_entries($this->conn, $result);
            error_reporting(E_STRICT);
            
            if (!is_array($info))
                throw new Exception("Ldap search returned no entries!");
            
            if (!isset($info['count']) || $info['count'] != 1)
                throw new Exception("Ldap search returned a different number of results than 1");
            
            $info = $info[0];
            
            foreach (array('groups', 'uid', 'email', 'phone') as $searchKey) {
                
                if (isset($this->_config['filters']["$searchKey"])) {
                    
                    $returnValue = null;
                    
                    $Field = $this->_config['filters']["$searchKey"];
                    
                    if (is_array($Field)) {
                        for ($i=0; $i<count($Field); $i++) {
                            $returnValue = $this->ldapSearchParse($Field[$i], $info, $searchKey == 'groups' ? false : true);
                            if ($returnValue !== null)
                                break;
                        }
                    } else {
                        $returnValue = $this->ldapSearchParse($Field, $info, $searchKey == 'groups' ? false : true);
                    }
                    
                    if ($returnValue !== null) {
                        switch ($searchKey) {
                            case 'groups':
                                $this->_groups = $returnValue;
                                break;
                            case 'uid':
                                $this->_uid    = $returnValue;
                                break;
                            case 'email':
                                $this->_email  = $returnValue;
                                break;
                            case 'phone':
                                $this->_phone  = $returnValue;
                                break;
                            case 'description':
                                $this->_description = $returnValue;
                                break;
                        }
                    }
                }
            }
            
            if ($this->_groups === null) 
                throw new Exception("LdapForeignAuth:: Could not determine user groups!");
            
            if ($this->_uid    === null)
                throw new Exception("LdapForeignAuth:: Could not determine user uniqueID!");
            
            for ($i=0; $i<count($this->_groups); $i++)
                $this->_groups[$i] = $this->_groups[$i]."@".$this->_config['domain'];
            
            $out = array(
                'user'   => "$userName@".$this->_config['domain'],
                'groups' => $this->_groups,
                'uid'    => $this->_uid
            );
            
            if ($this->_email !== null)
                $out['email'] = $this->_email;
            
            if ($this->_phone !== null)
                $out['phone'] = $this->_phone;
            
            if ($this->_description !== null)
                $out['description'] = $this->_description;
            
            //print_r($out);
            
            //throw new Exception("HERE");
            
            return $out;
        }
        
        public function __destruct() {
            ldap_close($this->conn);
        }
    }
    
    
    /*
    $my = new LdapForeignAuth(array(
        'server' => '82.76.242.230',          //pass here the server IP address
        'domain' => 'rcs-rds.local',          //pass here the domain name
        'dn'     => 'OU=Filiale,DC=rcs-rds,DC=local',  //dn --> see documentation, but you'll need it
        'filters'=> array(                    //binding filters -> see above more explanations
            'groups'     => 'memberof:CN',    //we extract the CN part from the memberof
            'uid'        => array(            //we try to obtain the userID from the
                'employeeid',                 //uid entry. If not found, we then
                'uid'                         //try to find it from the field employeeid
            ),
            'email'      => 'mail',           //we extract the user email address from the 'mail' entry
            'phone'      => 'phone'           //we extract the user phone from the 'phone' entry
        )
    ));

    
    try {
        $my->checkLogin('andrei.sfia', 'a_big_secret_password');
    } catch (Exception $ex) {
        echo $ex->getMessage(),"\n";
    }
    */

?>