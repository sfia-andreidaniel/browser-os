-- MySQL dump 10.13  Distrib 5.5.34, for debian-linux-gnu (i686)
--
-- Host: localhost    Database: jsplatform
-- ------------------------------------------------------
-- Server version	5.5.34-0ubuntu0.12.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_auth`
--

DROP TABLE IF EXISTS `admin_auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_auth` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL DEFAULT '0',
  `user` varchar(100) NOT NULL DEFAULT '',
  `pass` varchar(32) NOT NULL DEFAULT '',
  `enabled` tinyint(1) DEFAULT '0',
  `expires` datetime DEFAULT NULL,
  `email` varchar(64) NOT NULL DEFAULT '',
  `phone` varchar(64) NOT NULL DEFAULT '',
  `description` varchar(512) NOT NULL DEFAULT '',
  `policy_timestamp` bigint(20) NOT NULL DEFAULT '0',
  `policies` longblob NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_auth`
--

LOCK TABLES `admin_auth` WRITE;
/*!40000 ALTER TABLE `admin_auth` DISABLE KEYS */;
INSERT INTO `admin_auth` VALUES (1,0,'root','e3b88b93915c44130f9b1f23f2b48264',1,NULL,'','','Administrator',1370855473,'SESS_1=1=1\nMMC_ACCESS=2=1\nOneDB_Administrators=4=1\nOneDB_Programmers=5=1\nDigiSport_ProgramTV=6=1\nOneDB_Gods=8=1\nOneDB_AdvancedInterface=9=1\nOneDB_CanDeleteItemsOnly=10=0'),(2,0,'demo','fe01ce2a7fbac8fafaed7c982a04e229',1,NULL,'','','',1370855473,'SESS_1=1=1\nMMC_ACCESS=2=0\nOneDB_Administrators=4=0\nOneDB_Programmers=5=0\nDigiSport_ProgramTV=6=0\nOneDB_Gods=8=0\nOneDB_AdvancedInterface=9=0\nOneDB_CanDeleteItemsOnly=10=0'),(14,0,'george.nasturas','4b969b6c356a0bb934f7e3a0bee826b8',1,NULL,'','','Balancer stuff',1370855473,'SESS_1=1=1\nMMC_ACCESS=2=0\nOneDB_Administrators=4=0\nOneDB_Programmers=5=0\nDigiSport_ProgramTV=6=0\nOneDB_Gods=8=0\nOneDB_AdvancedInterface=9=0\nOneDB_CanDeleteItemsOnly=10=0'),(12,0,'traian.baron','1e92193a5d007ca436968c85f3d4f948',1,NULL,'','','',1370855473,'SESS_1=1=1\nMMC_ACCESS=2=1\nOneDB_Administrators=4=0\nOneDB_Programmers=5=0\nDigiSport_ProgramTV=6=0\nOneDB_Gods=8=0\nOneDB_AdvancedInterface=9=0\nOneDB_CanDeleteItemsOnly=10=0'),(13,0,'alexandru.buga','1dd75c7f119828ba00b6379fd4924621',1,NULL,'alexandru.buga@rcs-rds.ro','','',1370855473,'SESS_1=1=1\nMMC_ACCESS=2=1\nOneDB_Administrators=4=0\nOneDB_Programmers=5=1\nDigiSport_ProgramTV=6=0\nOneDB_Gods=8=1\nOneDB_AdvancedInterface=9=0\nOneDB_CanDeleteItemsOnly=10=0');
/*!40000 ALTER TABLE `admin_auth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_defines`
--

DROP TABLE IF EXISTS `admin_defines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_defines` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `server` int(11) NOT NULL DEFAULT '0',
  `name` varchar(64) NOT NULL DEFAULT '',
  `value` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `adm_defines_unique` (`server`,`name`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_defines`
--

LOCK TABLES `admin_defines` WRITE;
/*!40000 ALTER TABLE `admin_defines` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_defines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_group_mappings`
--

DROP TABLE IF EXISTS `admin_group_mappings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_group_mappings` (
  `uid` int(11) NOT NULL DEFAULT '0',
  `gid` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_group_mappings`
--

LOCK TABLES `admin_group_mappings` WRITE;
/*!40000 ALTER TABLE `admin_group_mappings` DISABLE KEYS */;
INSERT INTO `admin_group_mappings` VALUES (1,1),(2,2),(13,1),(12,1);
/*!40000 ALTER TABLE `admin_group_mappings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_groups`
--

DROP TABLE IF EXISTS `admin_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_groups` (
  `gid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL DEFAULT '',
  `description` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`gid`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_groups`
--

LOCK TABLES `admin_groups` WRITE;
/*!40000 ALTER TABLE `admin_groups` DISABLE KEYS */;
INSERT INTO `admin_groups` VALUES (1,'Administrators','Platform Administrators'),(2,'Guests','Guest accounts'),(3,'OneDB','OneDB users'),(4,'editori_digisport','Editori DigiSport'),(5,'editori_digi24_bucuresti','Editori Site Digi24 Bucuresti'),(6,'editori_digi24_oradea','Editori Digi24 Oradea'),(7,'editori_digi24','Editori Digi24');
/*!40000 ALTER TABLE `admin_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_policies`
--

DROP TABLE IF EXISTS `admin_policies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_policies` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL DEFAULT '',
  `code` varchar(32) NOT NULL DEFAULT '',
  `description` varchar(512) NOT NULL DEFAULT '',
  `enabled` smallint(1) NOT NULL DEFAULT '1',
  `default` smallint(1) NOT NULL DEFAULT '0',
  `hidden` int(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_policies_code` (`code`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_policies`
--

LOCK TABLES `admin_policies` WRITE;
/*!40000 ALTER TABLE `admin_policies` DISABLE KEYS */;
INSERT INTO `admin_policies` VALUES (1,'Session 1','SESS_1','Default Session',1,0,1),(2,'Management Console','MMC_ACCESS','Allow Access to Management Console',1,0,0),(4,'OneDB_Administrators','OneDB_Administrators','Persons who are administrators for OneDB',1,0,0),(5,'OneDB_Programmers','OneDB_Programmers','Persons who are allowed to edit, view, run and open widgets.',1,0,0),(6,'Digisport Program TV','DigiSport_ProgramTV','',1,0,0),(8,'OneDB_Gods','OneDB_Gods','Persons who are allowed to see everything under OneDB structure, bypassing security',1,0,0),(9,'OneDB_AdvancedInterface','OneDB_AdvancedInterface','Advanced interface features for OneDB.',1,0,0),(10,'OneDB_CanDeleteItemsOnly','OneDB_CanDeleteItemsOnly','Allowed to delete only items from OneDB (not categories)',1,0,0);
/*!40000 ALTER TABLE `admin_policies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_policies_mappings`
--

DROP TABLE IF EXISTS `admin_policies_mappings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_policies_mappings` (
  `pid` bigint(20) unsigned NOT NULL DEFAULT '0',
  `uid` int(11) NOT NULL DEFAULT '0',
  `gid` int(11) NOT NULL DEFAULT '0',
  `allow` smallint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`pid`,`uid`,`gid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_policies_mappings`
--

LOCK TABLES `admin_policies_mappings` WRITE;
/*!40000 ALTER TABLE `admin_policies_mappings` DISABLE KEYS */;
INSERT INTO `admin_policies_mappings` VALUES (1,3,0,1),(2,0,1,1),(3,0,1,1),(1,0,1,1),(4,4,0,1),(8,4,0,1),(5,4,0,1),(5,8,0,1),(4,1,0,1),(6,1,0,1),(1,0,7,1),(7,0,3,1),(7,1,0,1),(8,8,0,1),(8,1,0,1),(5,1,0,1),(4,8,0,1),(9,1,0,1),(1,0,2,1),(8,13,0,1),(5,13,0,1),(1,14,0,1);
/*!40000 ALTER TABLE `admin_policies_mappings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_servers`
--

DROP TABLE IF EXISTS `admin_servers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_servers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `policy_id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `startup` blob NOT NULL,
  `description` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_servers`
--

LOCK TABLES `admin_servers` WRITE;
/*!40000 ALTER TABLE `admin_servers` DISABLE KEYS */;
INSERT INTO `admin_servers` VALUES (1,'jsplatform',1,'#~/Desktop/OneDB.app\n#~/Desktop/HTMLEditor.app\n#~/Desktop/CSSInput.app\n#~/Desktop/Balancer.app\n~/Desktop/Writer.app','JSPlatform');
/*!40000 ALTER TABLE `admin_servers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_sph_indexes`
--

DROP TABLE IF EXISTS `admin_sph_indexes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_sph_indexes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `index_name` varchar(100) NOT NULL DEFAULT '',
  `source_id` int(11) NOT NULL DEFAULT '0',
  `strip_html` smallint(6) NOT NULL DEFAULT '1',
  `min_prefix_len` smallint(6) NOT NULL DEFAULT '3',
  `enable_star` smallint(6) NOT NULL DEFAULT '1',
  `index_frequency` int(11) NOT NULL DEFAULT '-1',
  `last_indexed` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_sph_indexes`
--

LOCK TABLES `admin_sph_indexes` WRITE;
/*!40000 ALTER TABLE `admin_sph_indexes` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_sph_indexes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_sph_settings`
--

DROP TABLE IF EXISTS `admin_sph_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_sph_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `explain` varchar(64) NOT NULL DEFAULT '',
  `name` varchar(100) NOT NULL DEFAULT '',
  `value` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_sph_settings`
--

LOCK TABLES `admin_sph_settings` WRITE;
/*!40000 ALTER TABLE `admin_sph_settings` DISABLE KEYS */;
INSERT INTO `admin_sph_settings` VALUES (1,'Memory Limit','mem_limit','128M'),(2,'Listen Interface','searchd_address','127.0.0.1'),(3,'Listen Port','searchd_port','3312'),(4,'Log File Path','searchd_log','/tmp/sphinx_log.log'),(5,'Log Query File','searchd_query','/tmp/query.log'),(6,'PID File Path','searchd_pid','/tmp/sphinx_searchd.pid'),(7,'Max Matches','searchd_max_matches','1000'),(8,'Data Dir','data_dir','/tmp/'),(9,'Sphinx QL Magics Compatibility','compat_sphinxql_magics','0');
/*!40000 ALTER TABLE `admin_sph_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_sph_sources`
--

DROP TABLE IF EXISTS `admin_sph_sources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_sph_sources` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `source_name` varchar(32) NOT NULL DEFAULT '',
  `sql_host` varchar(100) NOT NULL DEFAULT '127.0.0.1',
  `sql_user` varchar(100) NOT NULL DEFAULT 'root',
  `sql_pass` varchar(100) NOT NULL DEFAULT '',
  `sql_db` varchar(100) NOT NULL DEFAULT '',
  `sql_port` int(11) NOT NULL DEFAULT '3306',
  `sql_query` varchar(2048) NOT NULL DEFAULT '',
  `sql_query_info` varchar(2048) NOT NULL DEFAULT '',
  `timestamp_fields` varchar(256) NOT NULL DEFAULT '',
  `uint_fields` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_sph_sources`
--

LOCK TABLES `admin_sph_sources` WRITE;
/*!40000 ALTER TABLE `admin_sph_sources` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_sph_sources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cloud_scopes`
--

DROP TABLE IF EXISTS `cloud_scopes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cloud_scopes` (
  `scope_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `scope_name` varchar(32) NOT NULL DEFAULT '',
  `scope_password` varchar(32) NOT NULL DEFAULT '',
  `policy_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`scope_id`),
  UNIQUE KEY `scope_name` (`scope_name`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cloud_scopes`
--

LOCK TABLES `cloud_scopes` WRITE;
/*!40000 ALTER TABLE `cloud_scopes` DISABLE KEYS */;
INSERT INTO `cloud_scopes` VALUES (1,'digisport','',NULL);
/*!40000 ALTER TABLE `cloud_scopes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cloud_scopes_layers_list`
--

DROP TABLE IF EXISTS `cloud_scopes_layers_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cloud_scopes_layers_list` (
  `layer_id` int(5) NOT NULL AUTO_INCREMENT,
  `layer_name` varchar(64) NOT NULL DEFAULT 'Unknown layer name',
  PRIMARY KEY (`layer_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cloud_scopes_layers_list`
--

LOCK TABLES `cloud_scopes_layers_list` WRITE;
/*!40000 ALTER TABLE `cloud_scopes_layers_list` DISABLE KEYS */;
INSERT INTO `cloud_scopes_layers_list` VALUES (1,'Data'),(2,'Web'),(3,'Live'),(4,'Static');
/*!40000 ALTER TABLE `cloud_scopes_layers_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cloud_scopes_roles_bindings`
--

DROP TABLE IF EXISTS `cloud_scopes_roles_bindings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cloud_scopes_roles_bindings` (
  `binding_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `scope_id` bigint(20) NOT NULL DEFAULT '0',
  `role_id` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`binding_id`),
  UNIQUE KEY `scope_id` (`scope_id`,`role_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cloud_scopes_roles_bindings`
--

LOCK TABLES `cloud_scopes_roles_bindings` WRITE;
/*!40000 ALTER TABLE `cloud_scopes_roles_bindings` DISABLE KEYS */;
/*!40000 ALTER TABLE `cloud_scopes_roles_bindings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cloud_scopes_roles_list`
--

DROP TABLE IF EXISTS `cloud_scopes_roles_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cloud_scopes_roles_list` (
  `role_id` int(10) NOT NULL AUTO_INCREMENT,
  `parent_role_id` int(10) DEFAULT NULL,
  `layer_id` int(5) DEFAULT NULL,
  `role_name` varchar(64) DEFAULT '',
  `role_identifier` varchar(32) NOT NULL DEFAULT '',
  `min_instances` int(10) NOT NULL DEFAULT '0',
  `max_instances` int(10) NOT NULL DEFAULT '1',
  `role_description` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_identifier` (`role_identifier`),
  KEY `role_id` (`role_id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cloud_scopes_roles_list`
--

LOCK TABLES `cloud_scopes_roles_list` WRITE;
/*!40000 ALTER TABLE `cloud_scopes_roles_list` DISABLE KEYS */;
INSERT INTO `cloud_scopes_roles_list` VALUES (1,NULL,1,'MongoDB Database','mongo_database',1,999,'A MongoDB Database for your Data Manipulation Layer'),(2,NULL,1,'MySQL Database','mysql_database',1,999,'A MySQL Database for your Data Manipulation Layer'),(3,NULL,1,'MySQL Session','mysql_session',1,1,'A MySQL Database where you can store session data'),(4,NULL,1,'Memcache Server','memcache_server',1,999,'A Memcache Collection where you can make caching for your scope'),(5,NULL,1,'Indexer Server','indexer_server',1,1,'A Sphinx real time index where you can index your information for faster access'),(6,NULL,2,'Web Balancer Server','web_balancer',1,999,'A Nginx server used to balance your traffic to your Front Web servers'),(7,NULL,2,'Front Web Server','web_frontend',1,999,'An Apache2 Web server used to run your web applications'),(8,NULL,4,'Storage Controller Server','storage_controller',1,1,'A controller server used for routing your static assets in your cloud'),(9,8,4,'Storage Node Server','storage_node',1,999,'A server used to store your static assets data in your cloud'),(10,8,4,'Transcoder Node Server','transcoder_node',1,999,'A server used to transcode video files in your cloud, and store various video file format versions to your Storage Node Servers'),(11,NULL,4,'Edge Server','edge_server',1,999,'A server used to cache static data from your cloud, and serve it to cloud clients. It also assures video pseudo-streaming functions for your video files.'),(12,NULL,3,'Stream Balancer','stream_balancer',1,1,'The core of your live content layer'),(13,12,3,'Streaming Server','stream_server',1,999,'A server capable of streaming live content');
/*!40000 ALTER TABLE `cloud_scopes_roles_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cloud_servers`
--

DROP TABLE IF EXISTS `cloud_servers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cloud_servers` (
  `server_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `server_ip` varchar(15) NOT NULL DEFAULT '127.0.0.1',
  `last_up` int(11) DEFAULT NULL,
  PRIMARY KEY (`server_id`),
  UNIQUE KEY `server_ip` (`server_ip`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cloud_servers`
--

LOCK TABLES `cloud_servers` WRITE;
/*!40000 ALTER TABLE `cloud_servers` DISABLE KEYS */;
INSERT INTO `cloud_servers` VALUES (1,'127.0.0.1',1363962638);
/*!40000 ALTER TABLE `cloud_servers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cloud_servers_roles_bindings`
--

DROP TABLE IF EXISTS `cloud_servers_roles_bindings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cloud_servers_roles_bindings` (
  `server_id` bigint(20) NOT NULL DEFAULT '0',
  `scope_binding_id` bigint(20) NOT NULL DEFAULT '0',
  UNIQUE KEY `server_id` (`server_id`,`scope_binding_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cloud_servers_roles_bindings`
--

LOCK TABLES `cloud_servers_roles_bindings` WRITE;
/*!40000 ALTER TABLE `cloud_servers_roles_bindings` DISABLE KEYS */;
/*!40000 ALTER TABLE `cloud_servers_roles_bindings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-11-26 12:09:57
