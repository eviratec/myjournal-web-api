-- Create syntax for TABLE 'resources'
CREATE TABLE `resources` (
  `Id` varchar(36) NOT NULL DEFAULT '',
  `Uri` varchar(255) DEFAULT NULL,
  `Created` varchar(16) NOT NULL DEFAULT '',
  PRIMARY KEY (`Id`),
  KEY `Uri` (`Uri`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
