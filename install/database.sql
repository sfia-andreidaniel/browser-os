DROP TABLE IF EXISTS `admin_auth`;
CREATE TABLE `admin_auth` (
  `id`                  int(10) unsigned NOT NULL AUTO_INCREMENT,
  `gid`                 int(11) NOT NULL DEFAULT '0',
  `user`                varchar(100) NOT NULL DEFAULT '',
  `pass`                varchar(32) NOT NULL DEFAULT '',
  `enabled`             tinyint(1) DEFAULT '0',
  `expires`             datetime DEFAULT NULL,
  `email`               varchar(64) NOT NULL DEFAULT '',
  `phone`               varchar(64) NOT NULL DEFAULT '',
  `description`         varchar(512) NOT NULL DEFAULT '',
  `policy_timestamp`    bigint(20) NOT NULL DEFAULT '0',
  `policies`            longblob NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `admin_defines`;
CREATE TABLE `admin_defines` (
  `id`                  int(10) unsigned NOT NULL AUTO_INCREMENT,
  `server`              int(11) NOT NULL DEFAULT '0',
  `name`                varchar(64) NOT NULL DEFAULT '',
  `value`               varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `adm_defines_unique` (`server`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `admin_group_mappings`;
CREATE TABLE `admin_group_mappings` (
  `uid`                 int(11) NOT NULL DEFAULT '0',
  `gid`                 int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `admin_groups`;
CREATE TABLE `admin_groups` (
  `gid`                 int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name`                varchar(32) NOT NULL DEFAULT '',
  `description`         varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`gid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `admin_policies`;
CREATE TABLE `admin_policies` (
  `id`                  bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name`                varchar(128) NOT NULL DEFAULT '',
  `code`                varchar(32) NOT NULL DEFAULT '',
  `description`         varchar(512) NOT NULL DEFAULT '',
  `enabled`             smallint(1) NOT NULL DEFAULT '1',
  `default`             smallint(1) NOT NULL DEFAULT '0',
  `hidden`              int(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_policies_code` (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `admin_policies_mappings`;
CREATE TABLE `admin_policies_mappings` (
  `pid`                 bigint(20) unsigned NOT NULL DEFAULT '0',
  `uid`                 int(11) NOT NULL DEFAULT '0',
  `gid`                 int(11) NOT NULL DEFAULT '0',
  `allow`               smallint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`pid`,`uid`,`gid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `admin_servers`;
CREATE TABLE `admin_servers` (
  `id`                  int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name`                varchar(100) NOT NULL DEFAULT '',
  `policy_id`           bigint(20) unsigned NOT NULL DEFAULT '0',
  `startup`             blob NOT NULL,
  `description`         varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/* INSERT DATA */
-- create default user root with default password "toor" --
INSERT INTO admin_auth ( gid, user, pass, enabled, expires, email, phone, description, policy_timestamp, policies )
VALUES (
    0,
    'root',
    MD5('toor'),
    1,
    NULL,
    '',
    '',
    'the root account',
    UNIX_TIMESTAMP(NOW()),
    "SESS_1=1=1\nMMC_ACCESS=2=1"
);

-- create default group administrators --
INSERT INTO admin_groups ( name, description )
VALUES (
    'Administrators', 'The administrators group'
);

-- make user root a member of administrators --
INSERT INTO admin_group_mappings (
    gid, uid
) VALUES ( 1, 1 );

-- insert default session policy --
INSERT INTO admin_policies ( name, code, description, enabled, `default`, hidden )
VALUES (
    'Session 1',
    'SESS_1',
    'Default session',
    1,
    0,
    1
);

-- insert management console policy --
INSERT INTO admin_policies ( name, code, description, enabled, `default`, hidden )
VALUES (
    'Management Console',
    'MMC_ACCESS',
    'Allow access to Management Console',
    1,
    0,
    0
);

-- make bindings to policies for the group administrators --
-- allow group administrators to default session --
INSERT INTO admin_policies_mappings ( pid, uid, gid, allow )
VALUES (
    1, 0, 1, 1
);

-- allow group administrators to management console --
INSERT INTO admin_policies_mappings ( pid, uid, gid, allow )
VALUES (
    2, 0, 1, 1
);

-- create the default session --
INSERT INTO admin_servers ( name, policy_id, startup, description )
VALUES (
    'browseros',
    1,
    '',
    'BrowserOS'
);