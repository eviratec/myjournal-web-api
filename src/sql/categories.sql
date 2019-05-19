CREATE TABLE `categories` (
  `Id` varchar(36) NOT NULL,
  `OwnerId` varchar(36) NOT NULL,
  `Name` varchar(45) NOT NULL,
  `Created` int(11) NOT NULL,
  `Deleted` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `OwnerId` (`OwnerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
