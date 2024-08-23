# Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
#
# Licensed under The MIT License
# For full copyright and license information, please see the LICENSE.txt
# Redistributions of files must retain the above copyright notice.
# MIT License (https://opensource.org/licenses/mit-license.php)

CREATE TABLE `admins` (
  `id` char(36) NOT NULL,
  `title` VARCHAR(64) NOT NULL COLLATE 'utf8_general_ci',
  `username` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'unpublished',
  `public` varchar(50) NOT NULL DEFAULT 'unpublished',
  `created` datetime DEFAULT NULL,
  `created_by_admin` char(36) DEFAULT NULL,
  `created_by_user` char(36) DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `modified_by_admin` char(36) DEFAULT NULL,
  `modified_by_user` char(36) DEFAULT NULL,
  `cid` INT(11) NOT NULL AUTO_INCREMENT,
  `superuser` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username` (`username`),
  INDEX `cid` (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
