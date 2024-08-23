# Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
#
# Licensed under The MIT License
# For full copyright and license information, please see the LICENSE.txt
# Redistributions of files must retain the above copyright notice.
# MIT License (https://opensource.org/licenses/mit-license.php)

CREATE TABLE `topics` (
	`id` CHAR(36) NOT NULL,
	`title` VARCHAR(255) NOT NULL,
	`url` VARCHAR(512) NOT NULL,
	`url_is_blank` CHAR(1) NOT NULL DEFAULT '0',
	`summary` TEXT NULL,
	`summary_files` LONGTEXT DEFAULT NULL,
	`published` DATE NULL DEFAULT NULL,
	`start_date` DATE NULL DEFAULT NULL,
	`end_date` DATE NULL DEFAULT NULL,
	`status` VARCHAR(50) NULL DEFAULT 'draft',
	`public` VARCHAR(50) NULL DEFAULT 'unpublished',
	`searchtext` MEDIUMTEXT NULL,
	`created` DATETIME NULL DEFAULT NULL,
    `created_by_admin` char(36) DEFAULT NULL,
    `created_by_user` char(36) DEFAULT NULL,
	`modified` DATETIME NULL DEFAULT NULL,
    `modified_by_admin` char(36) DEFAULT NULL,
    `modified_by_user` char(36) DEFAULT NULL,
	`cid` INT(11) NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (`id`),
	INDEX `cid` (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `topics_private` (
	`id` CHAR(36) NOT NULL,
	`title` VARCHAR(255) NOT NULL,
	`url` VARCHAR(512) NOT NULL,
	`url_is_blank` CHAR(1) NOT NULL DEFAULT '0',
	`summary` TEXT NULL,
    `summary_files` LONGTEXT DEFAULT NULL,
	`published` DATE NULL DEFAULT NULL,
	`start_date` DATE NULL DEFAULT NULL,
	`end_date` DATE NULL DEFAULT NULL,
	`status` VARCHAR(50) NULL DEFAULT 'draft',
	`public` VARCHAR(50) NULL DEFAULT 'unpublished',
	`searchtext` MEDIUMTEXT NULL,
	`created` DATETIME NULL DEFAULT NULL,
    `created_by_admin` char(36) DEFAULT NULL,
    `created_by_user` char(36) DEFAULT NULL,
	`modified` DATETIME NULL DEFAULT NULL,
    `modified_by_admin` char(36) DEFAULT NULL,
    `modified_by_user` char(36) DEFAULT NULL,
	`cid` INT(11) NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (`id`),
	INDEX `cid` (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


