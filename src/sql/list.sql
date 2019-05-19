CREATE TABLE `lists` (
  `Id` varchar(36) NOT NULL,
  `OwnerId` varchar(36) NOT NULL,
  `ParentId` varchar(36) NOT NULL,
  `CategoryId` varchar(36) NOT NULL,
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
