CREATE TABLE `hashes` (
  `Id` varchar(36) NOT NULL,
  `Value` varchar(255) NOT NULL,
  `OwnerId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `OwnerId_UNIQUE` (`OwnerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
