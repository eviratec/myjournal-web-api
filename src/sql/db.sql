/*
  User manageable
*/

CREATE TABLE `categories` (
  `Id` varchar(36) NOT NULL,
  `OwnerId` varchar(36) NOT NULL,
  `Name` varchar(45) NOT NULL,
  `Created` int(11) NOT NULL,
  `Deleted` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `OwnerId` (`OwnerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `lists` (
  `Id` varchar(36) NOT NULL,
  `OwnerId` varchar(36) NOT NULL,
  `ParentId` varchar(36) DEFAULT NULL,
  `CategoryId` varchar(36) DEFAULT NULL,
  `Title` varchar(255) NOT NULL,
  `Created` int(11) NOT NULL,
  `Due` int(11) DEFAULT NULL,
  `Started` int(11) DEFAULT NULL,
  `Completed` int(11) DEFAULT NULL,
  `Deleted` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `OwnerId` (`OwnerId`),
  KEY `ParentId` (`ParentId`),
  KEY `CategoryId` (`CategoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*
  Not user manageable
*/

CREATE TABLE `auth_attempts` (
  `Id` varchar(36) NOT NULL,
  `Login` varchar(255) NOT NULL,
  `Finished` tinyint(4) NOT NULL,
  `Error` varchar(255) DEFAULT NULL,
  `TokenId` varchar(36) DEFAULT NULL,
  `Created` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `hashes` (
  `Id` varchar(36) NOT NULL,
  `Value` varchar(255) NOT NULL,
  `OwnerId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `OwnerId_UNIQUE` (`OwnerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `resource_owners` (
  `Id` varchar(36) NOT NULL DEFAULT '',
  `ResourceId` varchar(36) NOT NULL DEFAULT '',
  `OwnerId` varchar(36) NOT NULL DEFAULT '',
  `Created` varchar(16) NOT NULL DEFAULT '',
  PRIMARY KEY (`Id`),
  KEY `ResourceId` (`ResourceId`),
  KEY `OwnerId` (`OwnerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `resources` (
  `Id` varchar(36) NOT NULL DEFAULT '',
  `Uri` varchar(255) DEFAULT NULL,
  `Created` varchar(16) NOT NULL DEFAULT '',
  PRIMARY KEY (`Id`),
  KEY `Uri` (`Uri`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `signups` (
  `Id` varchar(36) NOT NULL,
  `NewUserId` varchar(36) NULL,
  `EmailAddress` varchar(255) NULL,
  `Login` varchar(128) NULL,
  `Success` tinyint(4) NOT NULL,
  `Error` varchar(255) DEFAULT NULL,
  `Created` INT(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `NewUserId` (`NewUserId`),
  KEY `EmailAddress` (`EmailAddress`),
  KEY `Login` (`Login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `tokens` (
  `Id` varchar(36) NOT NULL,
  `UserId` varchar(36) NOT NULL,
  `Key` varchar(255) NOT NULL,
  `Created` int(11) NOT NULL,
  `Expiry` int(11) NOT NULL DEFAULT '3600',
  `Revoked` int(11) NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Key_UNIQUE` (`Key`),
  KEY `UserId` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `Id` varchar(36) NOT NULL,
  `Login` varchar(45) DEFAULT NULL,
  `Created` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
