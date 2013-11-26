<?php

    class JSPlatform_UserStorage {
        
        protected $_uid  = NULL;
        protected $_home = NULL;
        
        public function __construct( $_uid = NULL ) {
            
            if ($_uid === NULL) {
                
                if (!isset( $_SESSION ))
                    session_start();
                
                if (!isset( $_SESSION['UID'] ) )
                    throw new Exception("Cannot determine currently logged in user!");
                
                $this->_uid = $_SESSION['UID'];
            } else $this->_uid = $_uid;
            
            $this->_home = realpath( dirname( __FILE__ ) . "/../home/$this->_uid" );
            
            if ( empty( $this->_home ))
                throw new Exception("A home directory for user $this->_uid was not created!");
            
            if (!is_dir( "$this->_home/.user-storage" ) && !@mkdir( "$this->_home/.user-storage" ))
                throw new Exception("A .user-storage folder could not be created in $this->_home folder!");
            
            $this->_home .= "/.user-storage/";
        }
        
        public function getItem( $itemName, $defaultIfNotExists = NULL ) {
            $fileName = $this->_home . md5( $itemName ) . '.reg';
            if (!file_exists( $fileName )) {
                return $defaultIfNotExists;
            }
            else {
                $buffer = @file_get_contents( $fileName );
                if (empty( $buffer ))
                    throw new Exception("Could not read file $fileName!");
                else {
                    $data = @json_decode( $buffer, TRUE );
                    return empty( $data ) ? $defaultIfNotExists : $data;
                }
            }
        }
        
        public function setItem( $itemName, $value, $encodeJSON = TRUE ) {
            $fileName = $this->_home . md5( $itemName ) . '.reg';
            if (@file_put_contents( $fileName, $encodeJSON ? json_encode( $value ) : $value ) === FALSE)
                throw new Exception("Could not write in file: $fileName");
            else
                return TRUE;
        }
        
        public function removeItem( $itemName ) {
            $fileName = $this->_home . md5( $itemName ) . '.reg';
            
            if (!file_exists( $fileName ))
                return TRUE;
            else {
                return unlink( $fileName );
            }
        }
        
        public function clear() {
            $files = scandir( $this->_home );
            foreach ($files as $file) {
                if ( preg_match( '/\.reg$/i', $file ) ) {
                    if (!@unlink( "$this->_home/$file" ))
                        return FALSE;
                }
            }
            return TRUE;
        }
        
        public function __get( $itemName ) {
            return $this->getItem( $itemName, NULL );
        }
        
        public function __set( $itemName, $itemValue ) {
            $this->setItem( $itemName, $itemValue );
        }
    }

    /* TestDrive
    
    $storage = new JSPlatform_UserStorage( 1 );

    if ($storage->setItem( 'foo', array( 'bar' ) ) )
        echo "SetItem: foo: OK!\n";
    else
        die("SetItem: foo: FAIL!\n");
    
    $foo = $storage->getItem( 'foo' );
    print_r( $foo );
    
    if ($storage->removeItem( 'foo' ))
        echo "removeItem: foo: OK\n";
    else
        die("Could not remove item foo!\n");
    
    */
    
?>