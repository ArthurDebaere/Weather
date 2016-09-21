/*
SQLyog Community v12.09 (64 bit)
MySQL - 5.6.17 : Database - mobileweb-amazeme
*********************************************************************
*/


/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`mobileweb-amazeme` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `mobileweb-amazeme`;

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(30) NOT NULL,
  `password` VARCHAR(30) NOT NULL,
  `email` VARCHAR(30) NOT NULL,
  `geolocation` VARCHAR(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=262 DEFAULT CHARSET=latin1;

/*No truncate needed because we create an empty table*/

/*Table structure for table `user_city` */

DROP TABLE IF EXISTS `user_city`;

CREATE TABLE `user_city` (
  `id` INT(11) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL
) ENGINE=INNODB DEFAULT CHARSET=latin1;

/*No truncate needed because we create an empty table*/


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;