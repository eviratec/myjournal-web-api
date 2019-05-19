CREATE TABLE `users` (
  `Id` varchar(36) NOT NULL,
  `Login` varchar(45) DEFAULT NULL,
  `Created` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
