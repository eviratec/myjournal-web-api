CREATE TABLE `entries` (
  `Id` varchar(36) NOT NULL,
  `OwnerId` varchar(36) NOT NULL,
  `JournalId` varchar(36) NOT NULL,
  `Summary` varchar(255) NOT NULL,
  `Created` int(11) NOT NULL,
  `Occurred` int(11) DEFAULT NULL,
  `Deleted` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `OwnerId` (`OwnerId`),
  KEY `JournalId` (`JournalId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
