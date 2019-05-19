-- Create syntax for TABLE 'resource_owners'
CREATE TABLE `resource_owners` (
  `Id` varchar(36) NOT NULL DEFAULT '',
  `ResourceId` varchar(36) NOT NULL DEFAULT '',
  `OwnerId` varchar(36) NOT NULL DEFAULT '',
  `Created` varchar(16) NOT NULL DEFAULT '',
  PRIMARY KEY (`Id`),
  KEY `ResourceId` (`ResourceId`),
  KEY `OwnerId` (`OwnerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
