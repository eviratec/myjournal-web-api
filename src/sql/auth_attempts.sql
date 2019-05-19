CREATE TABLE `auth_attempts` (
  `Id` varchar(36) NOT NULL,
  `Login` varchar(255) NOT NULL,
  `Finished` tinyint(4) NOT NULL,
  `Error` varchar(255) DEFAULT NULL,
  `TokenId` varchar(36) DEFAULT NULL,
  `Created` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
