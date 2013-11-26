<?php

    /* Calculate ACL's for a user, based on a acl entry
       RETURNS 0 || 1
    */
    
    function ACLCalculate($user, $acl) {
        if ($acl['enabled'] != 0) {
            //if user is in acl's deny_users, or count(user's groups intersected with acl's deny groups) > 0
            if ((array_search($user['uid'], $acl['deny_users']) !== false) or
                (count(array_intersect($user['gids'], $acl['deny_groups'])))
            ) return 0; 
            elseif ((array_search($user['uid'], $acl['allow_users']) !== false) or
                (count(array_intersect($user['gids'], $acl['allow_groups'])))
            ) return 1;
            else return $acl['default_allow'];
        } else return 1;
    }
    
    /* Flush policies privileges for a list of user ID's, or for all users
       
       $userIDs should be left FALSE if we want to flush policies for ALL users,
       or set to an array with user ID's if we want to flush policies only to individual users
       
       ON SUCCESS returns true
       ON WARNINGS return an array with warnings
       ON ERROR Throws an exception
     */
    function ACLFlushPolicies($userIDs = false) {
        
        global $__DBADMIN__;
        global $mysql_conn;
        
        $sql = "SELECT $__DBADMIN__.admin_auth.id AS uid,
                       $__DBADMIN__.admin_auth.user AS user,
                       (SELECT GROUP_CONCAT($__DBADMIN__.admin_groups.gid)
                            FROM $__DBADMIN__.admin_group_mappings
                            LEFT JOIN $__DBADMIN__.admin_groups ON $__DBADMIN__.admin_group_mappings.gid = $__DBADMIN__.admin_groups.gid
                            WHERE $__DBADMIN__.admin_group_mappings.uid = $__DBADMIN__.admin_auth.id
                            GROUP BY $__DBADMIN__.admin_group_mappings.uid
                        ) AS gids
                FROM $__DBADMIN__.admin_auth ".
                ($userIDs === false ? 
                    '' : 
                    ("WHERE $__DBADMIN__.admin_auth.id IN (".implode(',', $userIDs).")")
                );
    
        $result = mysql_query($sql, $mysql_conn);
    
        if (!$result) 
            throw new Exception("Error enumerating users groups: \n".mysql_error());
    
        $users = array();
    
        while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) { 
            if ($row['gids'] == null) $row['gids'] = array(); else $row['gids'] = explode(',', $row['gids']);
            $row['acls'] = array();
        
            $users[] = $row;
        }
    
        $sql = "SELECT $__DBADMIN__.admin_policies.id AS id,
                       $__DBADMIN__.admin_policies.code AS code,
                       $__DBADMIN__.admin_policies.enabled AS enabled,
                       $__DBADMIN__.admin_policies.default AS default_allow,
                       
                       (SELECT GROUP_CONCAT($__DBADMIN__.admin_policies_mappings.uid)
                        FROM $__DBADMIN__.admin_policies_mappings
                        WHERE $__DBADMIN__.admin_policies_mappings.uid > 0 AND 
                              $__DBADMIN__.admin_policies_mappings.allow = 1 AND 
                              $__DBADMIN__.admin_policies_mappings.pid = $__DBADMIN__.admin_policies.id
                        GROUP BY $__DBADMIN__.admin_policies_mappings.pid
                       ) AS allow_users,
                       
                       (SELECT GROUP_CONCAT($__DBADMIN__.admin_policies_mappings.uid)
                        FROM $__DBADMIN__.admin_policies_mappings
                        WHERE $__DBADMIN__.admin_policies_mappings.uid > 0 AND 
                              $__DBADMIN__.admin_policies_mappings.allow = 0 AND 
                              $__DBADMIN__.admin_policies_mappings.pid = $__DBADMIN__.admin_policies.id
                        GROUP BY $__DBADMIN__.admin_policies_mappings.pid
                       ) AS deny_users,
                       
                       (SELECT GROUP_CONCAT($__DBADMIN__.admin_policies_mappings.gid)
                        FROM $__DBADMIN__.admin_policies_mappings
                        WHERE $__DBADMIN__.admin_policies_mappings.gid > 0 AND 
                              $__DBADMIN__.admin_policies_mappings.allow = 1 AND 
                              $__DBADMIN__.admin_policies_mappings.pid = $__DBADMIN__.admin_policies.id
                        GROUP BY $__DBADMIN__.admin_policies_mappings.pid
                       ) AS allow_groups,
                       
                       (SELECT GROUP_CONCAT($__DBADMIN__.admin_policies_mappings.gid)
                        FROM $__DBADMIN__.admin_policies_mappings
                        WHERE $__DBADMIN__.admin_policies_mappings.gid > 0 AND 
                              $__DBADMIN__.admin_policies_mappings.allow = 0 AND 
                              $__DBADMIN__.admin_policies_mappings.pid = $__DBADMIN__.admin_policies.id
                        GROUP BY $__DBADMIN__.admin_policies_mappings.pid
                       ) AS deny_groups
                       
                FROM $__DBADMIN__.admin_policies";
                       
        $result = mysql_query($sql, $mysql_conn);
        
        if (!$result) 
            throw new Exception("Error fetching policies rights list");
        
        $policies = array();
            
        while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
            if ($row['allow_users'] == null) $row['allow_users'] = array(); else $row['allow_users'] = explode(',', $row['allow_users']);
            if ($row['allow_groups'] == null) $row['allow_groups'] = array(); else $row['allow_groups'] = explode(',', $row['allow_groups']);
            if ($row['deny_users'] == null) $row['deny_users'] = array(); else $row['deny_users'] = explode(',', $row['deny_users']);
            if ($row['deny_groups'] == null) $row['deny_groups'] = array(); else $row['deny_groups'] = explode(',', $row['deny_groups']);
            
            $policies[] = $row;
        }
            
        $warnings = array();
        
        for ($i=0; $i<count($users); $i++) {
            foreach ($policies AS $acl) {
                $users[$i]['acls'][] = "$acl[code]=$acl[id]=".ACLCalculate($users[$i], $acl);
            }
        
            $users[$i]['acls'] = mysql_escape_string(implode("\n", $users[$i]['acls']));
        
            if (!mysql_query("UPDATE $__DBADMIN__.admin_auth SET policy_timestamp = UNIX_TIMESTAMP(), policies = '".$users[$i]['acls']."' WHERE id= ".$users[$i]['uid']." LIMIT 1", $mysql_conn))
                $warnings[] = "Error updating policies for user '".$users[$i]['user']."'\n";
            
            unset($users[$i]['acls']);
        }
        
        return count($warnings) ? $warnings : true;
    }

?>