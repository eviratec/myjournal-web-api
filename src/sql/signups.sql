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
