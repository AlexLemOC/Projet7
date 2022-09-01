-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: localhost    Database: groupomaniadb
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(255) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Animaux'),(2,'BD'),(3,'Drôle'),(4,'Jeux'),(5,'Blagues'),(6,'Autres');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Users_id` int NOT NULL,
  `Categories_id` int NOT NULL,
  `post_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `title` varchar(100) COLLATE utf8_bin NOT NULL,
  `image_url` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`,`Users_id`,`Categories_id`),
  KEY `fk_Posts_Categories_idx` (`Categories_id`),
  KEY `fk_Posts_Users1_idx` (`Users_id`),
  CONSTRAINT `fk_Posts_Categories` FOREIGN KEY (`Categories_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_Posts_Users1` FOREIGN KEY (`Users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,1,1,'2022-06-04 10:35:01','c\'est si drôle !','https://www.hillspet.com/content/dam/cp-sites/hills/hills-pet/en_us/img/article/cat-hunting-to-mouse-at-home-851992.jpeg'),(2,2,4,'2022-06-07 09:37:01','C\'est un très bon jeu de société','https://ludovox-fr.exactdn.com/wp-content/uploads/2014/06/7wonders.jpg'),(3,2,2,'2022-06-06 09:35:01','HA HA HA !','https://static.positivr.fr/wp-content/uploads/2021/04/cette-bande-dessinee-pleine-dhumour-illustre-ce-que-cest-que-de-vivre-avec-un-chat-20-dessins-une-1.jpg'),(4,1,3,'2020-06-07 07:35:01','Ah, la technologie !','https://img-9gag-fun.9cache.com/photo/angP7bV_460swp.webp'),(5,3,6,'2022-06-07 06:35:01','Vivement le futur!','https://img-9gag-fun.9cache.com/photo/aOQL8dy_460swp.webp'),(43,49,1,'2022-06-07 12:28:58','Quand les servers surchauffent.','https://images.lecho.be/view?iid=Elvis:1gnss1X2afnBK747iR0dzK&context=ONLINE&ratio=16/9&width=640&u=1648135001000');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reactions`
--

DROP TABLE IF EXISTS `reactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reactions` (
  `Posts_id` int NOT NULL,
  `Users_id` int NOT NULL,
  `reaction` varchar(45) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`Posts_id`,`Users_id`),
  KEY `fk_Likes_Users1_idx` (`Users_id`),
  KEY `fk_Reactions_Posts1_idx` (`Posts_id`),
  CONSTRAINT `fk_Likes_Users1` FOREIGN KEY (`Users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_Reactions_Posts1` FOREIGN KEY (`Posts_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reactions`
--

LOCK TABLES `reactions` WRITE;
/*!40000 ALTER TABLE `reactions` DISABLE KEYS */;
INSERT INTO `reactions` VALUES (1,1,'like'),(1,2,'like'),(1,3,'like');
/*!40000 ALTER TABLE `reactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account` varchar(45) COLLATE utf8_bin NOT NULL DEFAULT 'user',
  `user_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `firstName` varchar(45) COLLATE utf8_bin NOT NULL,
  `lastName` varchar(45) COLLATE utf8_bin NOT NULL,
  `email` varchar(100) COLLATE utf8_bin NOT NULL,
  `password` varchar(60) COLLATE utf8_bin NOT NULL,
  `photo_url` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `department` varchar(65) COLLATE utf8_bin DEFAULT NULL,
  `role` varchar(65) COLLATE utf8_bin DEFAULT NULL,
  `linkedin_url` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'user','2022-06-07 11:32:07','Michel','BLANQUETTE','m.blaquette@groupomania.fr','$2b$10$KIkLoZZbDjo.z/wRHiqtFewEl0MEd11a5mxmbqRIF2u.fnXuUBiie','https://journaldesseniors.20minutes.fr/wp-content/uploads/2020/04/Homme-senior-travail.jpg','Resources Humaines','Chargée du Comité d\'Entreprise','https://www.linkedin.com/'),(2,'user','2022-06-04 10:55:15','Jaqueline','DUCHEMIN','j.duchemin@groupomania.fr','$2b$10$KIkLoZZbDjo.z/wRHiqtFewEl0MEd11a5mxmbqRIF2u.fnXuUBiie','https://www.linflux.com/wp-content/uploads/2016/06/femme_1466759610-400x400.jpg','Gestion de la Relation Client','Chargé de l\'ordonnancement','https://www.linkedin.com/jeaneduchemin'),(3,'admin','2022-06-04 05:55:15','Alexis','LEMEE','a.lemee@groupomania.fr','$2b$10$KIkLoZZbDjo.z/wRHiqtFewEl0MEd11a5mxmbqRIF2u.fnXuUBiie','','Gestion des Systèmes d\'informations','Directeur des Services Web Fullstack','https://www.linkedin.com/'),(49,'user','2022-06-03 17:38:56','Sarah','CROCHE','s.croche@groupomania.fr','$2b$10$KIkLoZZbDjo.z/wRHiqtFewEl0MEd11a5mxmbqRIF2u.fnXuUBiie','https://www.vichy.fr/site/pages/showImageResized.aspx?EncMediaId=aVVvWHRCdGpadHNWczRWaTlFVlJVdz09&ImageFormatAppCode=IMAGEFORMAT_VMAG_W670_H347&v=20190307111623&mode=0&ShowCopyRight=True','Gestion Clients','Chargée de Relation Clients Litiges','https://www.linkedin.com/');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-07 14:31:52