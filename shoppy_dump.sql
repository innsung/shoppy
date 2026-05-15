CREATE DATABASE  IF NOT EXISTS `shoppy` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `shoppy`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: shoppy
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cid` int NOT NULL AUTO_INCREMENT,
  `size` char(2) NOT NULL,
  `qty` int NOT NULL,
  `pid` int NOT NULL,
  `id` varchar(50) NOT NULL,
  `cdate` datetime NOT NULL,
  PRIMARY KEY (`cid`),
  KEY `fk_cart_pid` (`pid`),
  KEY `fk_cart_id` (`id`),
  CONSTRAINT `fk_cart_id` FOREIGN KEY (`id`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_pid` FOREIGN KEY (`pid`) REFERENCES `product` (`pid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=192 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (189,'XS',1,1,'test','2025-12-30 00:00:00'),(190,'M',1,5,'test','2025-12-30 00:00:00'),(191,'M',3,6,'test','2025-12-30 00:00:00');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `id` varchar(50) NOT NULL,
  `pwd` varchar(100) NOT NULL,
  `name` varchar(20) NOT NULL,
  `phone` char(13) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `mdate` date DEFAULT NULL,
  `role` varchar(20) DEFAULT 'USER',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES ('hong','$2a$10$YOnyJJa.h/1gdMnP/Uvc3ecC76EICQJEZnFZjlCUL.wEANvoajMuy','홍길동','011-1234-7891','hong@naver.com','2025-10-20','USER'),('hong1234','$2a$10$qBm8ABbvSJ3fv9EyGVvCRuo.HvhpkEI10N2zIfVXCP9O9cRfv8CUi','홍길순','010-1234-4567','hong1234@naver.com','2025-10-22','USER'),('hong2','$2a$10$2EVvrYU5w8P/Wh/4nl96WemWo8g9QcJ1JkURTXeFr4rqqNTmk.hu2','홍이','011-1234-1234','hong2naver.com','2025-11-25','USER'),('hong99','$2a$10$9DFrvwKOkIcC9KAzUiDddeFdJ4EkiwifpH6xz6ZWVl8b3UcwrM.Xi','쇼피2','010-1234-9999','hong99@naver.com','2025-11-05','USER'),('shoppyadmin','$2a$10$MK8Qeh6mFJT7gG7PwB7mmu5GofOtSjvC3BwqDA38XsTI8RZe9nBeu','관리자','010-1234-2345','shoppyadmin@gmail.com','2025-11-13','ADMIN'),('test','$2a$10$J68zWd3oRGhLQr4gtCqiU.gqNg1lsZ5jYjhFcFErnekv3E5lhWCN2','테스트','011-1234-7892','test@daum.net','2025-10-20','USER'),('test2','$2a$10$Jnfl673KjEpQ/fT4TrYj7uwq2U9kk3tDrgTAqK.ZSeogHHNhU7pRG','테스트2','010-1234-2345','test2@naver.com','2025-11-13','USER'),('test3','$2a$10$aacoHANW7iRxgozw20UNZuhJrOcBGT6V1hlY.tYgWH9aAj8KsvDRi','테스트3','010-1224-1234','test3@naver.com','2025-11-17','USER'),('test4','$2a$10$7X4hugmy7cjp5Q1xITqVBuhLM0X4Smf4gyKHiD8HbUNTzUmWJaFC6','test4','010-1111-2345','test4@naver.com','2025-11-18','USER');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_detail`
--

DROP TABLE IF EXISTS `order_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_detail` (
  `odid` int NOT NULL AUTO_INCREMENT,
  `order_code` varchar(40) NOT NULL,
  `pid` int NOT NULL,
  `pname` varchar(50) DEFAULT NULL,
  `size` char(2) DEFAULT NULL,
  `qty` int DEFAULT NULL,
  `pid_total_price` decimal(10,0) DEFAULT NULL,
  `discount` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`odid`),
  KEY `fk_order_order_detail` (`order_code`),
  KEY `fk_product_order_detail` (`pid`),
  CONSTRAINT `fk_order_order_detail` FOREIGN KEY (`order_code`) REFERENCES `orders` (`order_code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_product_order_detail` FOREIGN KEY (`pid`) REFERENCES `product` (`pid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_detail`
--

LOCK TABLES `order_detail` WRITE;
/*!40000 ALTER TABLE `order_detail` DISABLE KEYS */;
INSERT INTO `order_detail` VALUES (95,'2b921fe6-f285-45da-8d8e-1044591cf95d',1,'후드티','XS',3,120000,0),(96,'2b921fe6-f285-45da-8d8e-1044591cf95d',6,'스트레치 비스트 드레스','XS',1,120000,0),(97,'2b921fe6-f285-45da-8d8e-1044591cf95d',5,'티셔츠','M',1,120000,0),(98,'4b7fbb11-e400-4ebb-b106-ab0e590ceb7a',1,'후드티','XS',5,75000,0),(99,'608b95da-7976-4226-8a40-fe59757ec76d',5,'티셔츠','XS',3,60000,0),(100,'f54408b7-a4d3-47f4-909e-8d2b692cafa9',3,'원피스','XS',2,50000,0),(101,'9790512b-f75d-4f2e-b8b1-9df9300a5db3',1,'후드티','XS',1,225000,0),(102,'9790512b-f75d-4f2e-b8b1-9df9300a5db3',5,'티셔츠','XS',5,225000,0),(103,'9790512b-f75d-4f2e-b8b1-9df9300a5db3',6,'스트레치 비스트 드레스','XS',2,225000,0),(104,'3b2a56c9-c16f-4f1b-b252-a4ad06006cc3',2,'후드티','XS',2,30000,0),(105,'5d39bdaf-6455-43b4-bb2a-6f9ad8308281',1,'후드티','XS',2,30000,0),(106,'70f232e1-680b-4c98-89d6-a6bdfde9db49',2,'후드티','XS',1,15000,0),(107,'9b3cbfcd-84d4-48cc-8020-bcaf3db7d69b',1,'후드티','XS',4,210000,0),(108,'9b3cbfcd-84d4-48cc-8020-bcaf3db7d69b',3,'원피스','M',6,210000,0);
/*!40000 ALTER TABLE `order_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `oid` int NOT NULL AUTO_INCREMENT,
  `order_code` varchar(40) NOT NULL,
  `id` varchar(50) NOT NULL,
  `status` enum('대기중','결제중','결제완료','취소','환불','만료') NOT NULL DEFAULT '대기중',
  `shipping_fee` int NOT NULL DEFAULT '0',
  `discount_amount` int NOT NULL DEFAULT '0',
  `total_amount` int NOT NULL,
  `receiver_name` varchar(50) DEFAULT NULL,
  `receiver_phone` varchar(50) DEFAULT NULL,
  `zipcode` varchar(20) DEFAULT NULL,
  `address1` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `memo` varchar(255) DEFAULT NULL,
  `odate` datetime DEFAULT NULL,
  PRIMARY KEY (`oid`),
  UNIQUE KEY `order_code` (`order_code`),
  KEY `fk_orders_member` (`id`),
  CONSTRAINT `fk_orders_member` FOREIGN KEY (`id`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (55,'2b921fe6-f285-45da-8d8e-1044591cf95d','test','대기중',0,0,0,'홍길동','010-1234-1234','12345','서울시 강남구 역삼동','123','문앞','2025-12-05 16:04:16'),(56,'4b7fbb11-e400-4ebb-b106-ab0e590ceb7a','test','대기중',0,0,0,'홍길동','010-1234-1234','12345','서울시 강남구 역삼동','123','문앞','2025-12-05 16:17:37'),(57,'608b95da-7976-4226-8a40-fe59757ec76d','test','대기중',0,0,0,'홍길동','010-1234-1234','12345','서울시 강남구 역삼동','123','문앞','2025-12-05 16:27:04'),(58,'f54408b7-a4d3-47f4-909e-8d2b692cafa9','test','대기중',0,0,0,'홍길동','010-1234-1234','12345','서울시 강남구 역삼동','123','문앞','2025-12-05 16:33:50'),(59,'9790512b-f75d-4f2e-b8b1-9df9300a5db3','hong','대기중',0,0,0,'홍길동','010-1234-1234','12345','서울시 강남구 역삼동','123','문앞','2025-12-05 16:45:07'),(60,'3b2a56c9-c16f-4f1b-b252-a4ad06006cc3','hong','대기중',0,0,0,'홍길동','010-1234-1234','12345','서울시 강남구 역삼동','123','문앞','2025-12-05 16:46:31'),(61,'5d39bdaf-6455-43b4-bb2a-6f9ad8308281','hong','대기중',0,0,0,'홍길동','010-1234-1234','12345','서울시 강남구 역삼동','123','문앞','2025-12-05 16:47:46'),(62,'70f232e1-680b-4c98-89d6-a6bdfde9db49','test','대기중',0,0,0,'홍길동','010-1234-1234','12345','서울시 강남구 역삼동','123','문앞','2025-12-05 18:03:11'),(63,'9b3cbfcd-84d4-48cc-8020-bcaf3db7d69b','test','대기중',0,0,0,'홍길동','010-1234-1234','12345','서울시 강남구 역삼동','123','문앞','2025-12-08 17:07:01');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `pid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `price` mediumtext,
  `info` varchar(200) DEFAULT NULL,
  `rate` double DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `img_list` json DEFAULT NULL,
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'후드티','15000','분홍색 후드티',4.2,'1.webp','[\"1.webp\", \"1.webp\", \"1.webp\"]'),(2,'후드티','15000','검정색 후드티',2.2,'2.webp','[\"2.webp\", \"2.webp\", \"2.webp\"]'),(3,'원피스','25000','원피스',4,'3.webp','[\"3.webp\", \"3.webp\", \"3.webp\"]'),(4,'반바지','12000','반바지',3.2,'4.webp','[\"4.webp\", \"4.webp\", \"4.webp\"]'),(5,'티셔츠','20000','티셔츠',5,'5.webp','[\"5.webp\", \"5.webp\", \"5.webp\"]'),(6,'스트레치 비스트 드레스','55000','스트레치 비스트 드레스',3,'6.webp','[\"6.webp\", \"6.webp\", \"6.webp\"]'),(7,'자켓','115000','자켓',3.5,'7.webp','[\"7.webp\", \"7.webp\", \"7.webp\"]');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_detailinfo`
--

DROP TABLE IF EXISTS `product_detailinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_detailinfo` (
  `did` int NOT NULL AUTO_INCREMENT,
  `title_en` varchar(100) NOT NULL,
  `title_ko` varchar(100) NOT NULL,
  `pid` int NOT NULL,
  `list` json DEFAULT NULL,
  PRIMARY KEY (`did`),
  KEY `fk_product_pid` (`pid`),
  CONSTRAINT `fk_product_pid` FOREIGN KEY (`pid`) REFERENCES `product` (`pid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_detailinfo`
--

LOCK TABLES `product_detailinfo` WRITE;
/*!40000 ALTER TABLE `product_detailinfo` DISABLE KEYS */;
INSERT INTO `product_detailinfo` VALUES (1,'FRENCH ZIP-UP HOODIE','프렌치 집업 후디',1,'[{\"color\": \"Grey\", \"title\": \"FABRIC\", \"material\": \"Cotton 100%\", \"description\": [\"원단의 컬러와 두께, 촉감은 모두 파사드패턴에서 기획되어 제작된 FACADE PATTERN 의 EXCLUSIVE 원단입니다.\", \"실켓 가공하여 일반적인 스웻 셔츠보다 표면이 깨끗하고 은은한 광택이 납니다.\", \"탄탄하게 편직 된 프렌치 테리 원단입니다.\", \"원단 수축을 최소화 하기 위해 덤블워싱과 텐타가공이 되었습니다.\", \"22년도 제품에서 보풀이 적고, 여름을 제외한 계절에 입기 좋게 좀 더 얇은 두께감으로 원단을 리뉴얼 했습니다.\"]}, {\"title\": \"DETAIL\", \"description\": [\"풀오버 집업과 앞 포켓이 있어 캐주얼하고 편안한 후디 자켓입니다.\", \"옆 라인에 립 원단으로 사이드 패널을 넣어 움직임이 편안합니다.\", \"탄탄한 원단으로 실루엣이 잘 유지되고 멋스럽습니다.\", \"단품으로 입기에도 부담이 없는 실용적인 아이템입니다\", \"클래식한 재킷이나 맥코트 이너로 매치하면 자연스럽고 무심한 스타일링을 연출할 수 있습니다.\", \"와이드 프렌치 스웻 팬츠와 SET-UP으로 착용 가능합니다.\"]}, {\"title\": \"MAKING\", \"description\": [\"지퍼와 후디 스트링은 아이보리 배색으로 포인트를 주었습니다.\", \"촘촘한 땀수로 봉제되어 옷매무새가 단정하고 깨끗합니다.\"]}, {\"type\": \"SMALL / MEDIUM\", \"title\": \"SIZE\", \"armhole\": \"26cm / 26.5cm\", \"hemLength\": \"47cm / 49cm\", \"chestWidth\": \"59cm / 61cm\", \"totalLength\": \"51cm / 52cm\", \"sleeveLength\": \"61cm / 62cm\", \"shoulderWidth\": \"48.5cm / 50cm\", \"sleeveHemWidth\": \"9.5cm / 10cm\"}, {\"size\": \"MEDIUM size 착용\", \"title\": \"MODEL SIZE\", \"height\": \"Height 175cm\"}, {\"title\": \"CARE INSTRUCTION\", \"description\": [\"전문가에게 드라이 클리닝 맡기는 것을 권장합니다.\", \"30도의 낮은온도로 세탁망에 넣어 세탁도 가능합니다.\", \"표백제 사용을 피해주세요.\", \"건조기 사용을 피해주세요.\", \"낮은 온도에 천을 덧대어 다림질 해주세요.\"]}]'),(2,'FRENCH ZIP-UP HOODIE','프렌치 집업 후디',2,'[{\"color\": \"Grey\", \"title\": \"FABRIC\", \"material\": \"Cotton 100%\", \"description\": [\"원단의 컬러와 두께, 촉감은 모두 파사드패턴에서 기획되어 제작된 FACADE PATTERN 의 EXCLUSIVE 원단입니다.\", \"실켓 가공하여 일반적인 스웻 셔츠보다 표면이 깨끗하고 은은한 광택이 납니다.\", \"탄탄하게 편직 된 프렌치 테리 원단입니다.\", \"원단 수축을 최소화 하기 위해 덤블워싱과 텐타가공이 되었습니다.\", \"22년도 제품에서 보풀이 적고, 여름을 제외한 계절에 입기 좋게 좀 더 얇은 두께감으로 원단을 리뉴얼 했습니다.\"]}, {\"title\": \"DETAIL\", \"description\": [\"풀오버 집업과 앞 포켓이 있어 캐주얼하고 편안한 후디 자켓입니다.\", \"옆 라인에 립 원단으로 사이드 패널을 넣어 움직임이 편안합니다.\", \"탄탄한 원단으로 실루엣이 잘 유지되고 멋스럽습니다.\", \"단품으로 입기에도 부담이 없는 실용적인 아이템입니다\", \"클래식한 재킷이나 맥코트 이너로 매치하면 자연스럽고 무심한 스타일링을 연출할 수 있습니다.\", \"와이드 프렌치 스웻 팬츠와 SET-UP으로 착용 가능합니다.\"]}, {\"title\": \"MAKING\", \"description\": [\"지퍼와 후디 스트링은 아이보리 배색으로 포인트를 주었습니다.\", \"촘촘한 땀수로 봉제되어 옷매무새가 단정하고 깨끗합니다.\"]}, {\"type\": \"SMALL / MEDIUM\", \"title\": \"SIZE\", \"armhole\": \"26cm / 26.5cm\", \"hemLength\": \"47cm / 49cm\", \"chestWidth\": \"59cm / 61cm\", \"totalLength\": \"51cm / 52cm\", \"sleeveLength\": \"61cm / 62cm\", \"shoulderWidth\": \"48.5cm / 50cm\", \"sleeveHemWidth\": \"9.5cm / 10cm\"}, {\"size\": \"MEDIUM size 착용\", \"title\": \"MODEL SIZE\", \"height\": \"Height 175cm\"}, {\"title\": \"CARE INSTRUCTION\", \"description\": [\"전문가에게 드라이 클리닝 맡기는 것을 권장합니다.\", \"30도의 낮은온도로 세탁망에 넣어 세탁도 가능합니다.\", \"표백제 사용을 피해주세요.\", \"건조기 사용을 피해주세요.\", \"낮은 온도에 천을 덧대어 다림질 해주세요.\"]}]'),(3,'FRENCH ZIP-UP HOODIE','프렌치 집업 후디',3,'[{\"color\": \"Grey\", \"title\": \"FABRIC\", \"material\": \"Cotton 100%\", \"description\": [\"원단의 컬러와 두께, 촉감은 모두 파사드패턴에서 기획되어 제작된 FACADE PATTERN 의 EXCLUSIVE 원단입니다.\", \"실켓 가공하여 일반적인 스웻 셔츠보다 표면이 깨끗하고 은은한 광택이 납니다.\", \"탄탄하게 편직 된 프렌치 테리 원단입니다.\", \"원단 수축을 최소화 하기 위해 덤블워싱과 텐타가공이 되었습니다.\", \"22년도 제품에서 보풀이 적고, 여름을 제외한 계절에 입기 좋게 좀 더 얇은 두께감으로 원단을 리뉴얼 했습니다.\"]}, {\"title\": \"DETAIL\", \"description\": [\"풀오버 집업과 앞 포켓이 있어 캐주얼하고 편안한 후디 자켓입니다.\", \"옆 라인에 립 원단으로 사이드 패널을 넣어 움직임이 편안합니다.\", \"탄탄한 원단으로 실루엣이 잘 유지되고 멋스럽습니다.\", \"단품으로 입기에도 부담이 없는 실용적인 아이템입니다\", \"클래식한 재킷이나 맥코트 이너로 매치하면 자연스럽고 무심한 스타일링을 연출할 수 있습니다.\", \"와이드 프렌치 스웻 팬츠와 SET-UP으로 착용 가능합니다.\"]}, {\"title\": \"MAKING\", \"description\": [\"지퍼와 후디 스트링은 아이보리 배색으로 포인트를 주었습니다.\", \"촘촘한 땀수로 봉제되어 옷매무새가 단정하고 깨끗합니다.\"]}, {\"type\": \"SMALL / MEDIUM\", \"title\": \"SIZE\", \"armhole\": \"26cm / 26.5cm\", \"hemLength\": \"47cm / 49cm\", \"chestWidth\": \"59cm / 61cm\", \"totalLength\": \"51cm / 52cm\", \"sleeveLength\": \"61cm / 62cm\", \"shoulderWidth\": \"48.5cm / 50cm\", \"sleeveHemWidth\": \"9.5cm / 10cm\"}, {\"size\": \"MEDIUM size 착용\", \"title\": \"MODEL SIZE\", \"height\": \"Height 175cm\"}, {\"title\": \"CARE INSTRUCTION\", \"description\": [\"전문가에게 드라이 클리닝 맡기는 것을 권장합니다.\", \"30도의 낮은온도로 세탁망에 넣어 세탁도 가능합니다.\", \"표백제 사용을 피해주세요.\", \"건조기 사용을 피해주세요.\", \"낮은 온도에 천을 덧대어 다림질 해주세요.\"]}]'),(4,'FRENCH ZIP-UP HOODIE','프렌치 집업 후디',4,'[{\"color\": \"Grey\", \"title\": \"FABRIC\", \"material\": \"Cotton 100%\", \"description\": [\"원단의 컬러와 두께, 촉감은 모두 파사드패턴에서 기획되어 제작된 FACADE PATTERN 의 EXCLUSIVE 원단입니다.\", \"실켓 가공하여 일반적인 스웻 셔츠보다 표면이 깨끗하고 은은한 광택이 납니다.\", \"탄탄하게 편직 된 프렌치 테리 원단입니다.\", \"원단 수축을 최소화 하기 위해 덤블워싱과 텐타가공이 되었습니다.\", \"22년도 제품에서 보풀이 적고, 여름을 제외한 계절에 입기 좋게 좀 더 얇은 두께감으로 원단을 리뉴얼 했습니다.\"]}, {\"title\": \"DETAIL\", \"description\": [\"풀오버 집업과 앞 포켓이 있어 캐주얼하고 편안한 후디 자켓입니다.\", \"옆 라인에 립 원단으로 사이드 패널을 넣어 움직임이 편안합니다.\", \"탄탄한 원단으로 실루엣이 잘 유지되고 멋스럽습니다.\", \"단품으로 입기에도 부담이 없는 실용적인 아이템입니다\", \"클래식한 재킷이나 맥코트 이너로 매치하면 자연스럽고 무심한 스타일링을 연출할 수 있습니다.\", \"와이드 프렌치 스웻 팬츠와 SET-UP으로 착용 가능합니다.\"]}, {\"title\": \"MAKING\", \"description\": [\"지퍼와 후디 스트링은 아이보리 배색으로 포인트를 주었습니다.\", \"촘촘한 땀수로 봉제되어 옷매무새가 단정하고 깨끗합니다.\"]}, {\"type\": \"SMALL / MEDIUM\", \"title\": \"SIZE\", \"armhole\": \"26cm / 26.5cm\", \"hemLength\": \"47cm / 49cm\", \"chestWidth\": \"59cm / 61cm\", \"totalLength\": \"51cm / 52cm\", \"sleeveLength\": \"61cm / 62cm\", \"shoulderWidth\": \"48.5cm / 50cm\", \"sleeveHemWidth\": \"9.5cm / 10cm\"}, {\"size\": \"MEDIUM size 착용\", \"title\": \"MODEL SIZE\", \"height\": \"Height 175cm\"}, {\"title\": \"CARE INSTRUCTION\", \"description\": [\"전문가에게 드라이 클리닝 맡기는 것을 권장합니다.\", \"30도의 낮은온도로 세탁망에 넣어 세탁도 가능합니다.\", \"표백제 사용을 피해주세요.\", \"건조기 사용을 피해주세요.\", \"낮은 온도에 천을 덧대어 다림질 해주세요.\"]}]'),(5,'FRENCH ZIP-UP HOODIE','프렌치 집업 후디',5,'[{\"color\": \"Grey\", \"title\": \"FABRIC\", \"material\": \"Cotton 100%\", \"description\": [\"원단의 컬러와 두께, 촉감은 모두 파사드패턴에서 기획되어 제작된 FACADE PATTERN 의 EXCLUSIVE 원단입니다.\", \"실켓 가공하여 일반적인 스웻 셔츠보다 표면이 깨끗하고 은은한 광택이 납니다.\", \"탄탄하게 편직 된 프렌치 테리 원단입니다.\", \"원단 수축을 최소화 하기 위해 덤블워싱과 텐타가공이 되었습니다.\", \"22년도 제품에서 보풀이 적고, 여름을 제외한 계절에 입기 좋게 좀 더 얇은 두께감으로 원단을 리뉴얼 했습니다.\"]}, {\"title\": \"DETAIL\", \"description\": [\"풀오버 집업과 앞 포켓이 있어 캐주얼하고 편안한 후디 자켓입니다.\", \"옆 라인에 립 원단으로 사이드 패널을 넣어 움직임이 편안합니다.\", \"탄탄한 원단으로 실루엣이 잘 유지되고 멋스럽습니다.\", \"단품으로 입기에도 부담이 없는 실용적인 아이템입니다\", \"클래식한 재킷이나 맥코트 이너로 매치하면 자연스럽고 무심한 스타일링을 연출할 수 있습니다.\", \"와이드 프렌치 스웻 팬츠와 SET-UP으로 착용 가능합니다.\"]}, {\"title\": \"MAKING\", \"description\": [\"지퍼와 후디 스트링은 아이보리 배색으로 포인트를 주었습니다.\", \"촘촘한 땀수로 봉제되어 옷매무새가 단정하고 깨끗합니다.\"]}, {\"type\": \"SMALL / MEDIUM\", \"title\": \"SIZE\", \"armhole\": \"26cm / 26.5cm\", \"hemLength\": \"47cm / 49cm\", \"chestWidth\": \"59cm / 61cm\", \"totalLength\": \"51cm / 52cm\", \"sleeveLength\": \"61cm / 62cm\", \"shoulderWidth\": \"48.5cm / 50cm\", \"sleeveHemWidth\": \"9.5cm / 10cm\"}, {\"size\": \"MEDIUM size 착용\", \"title\": \"MODEL SIZE\", \"height\": \"Height 175cm\"}, {\"title\": \"CARE INSTRUCTION\", \"description\": [\"전문가에게 드라이 클리닝 맡기는 것을 권장합니다.\", \"30도의 낮은온도로 세탁망에 넣어 세탁도 가능합니다.\", \"표백제 사용을 피해주세요.\", \"건조기 사용을 피해주세요.\", \"낮은 온도에 천을 덧대어 다림질 해주세요.\"]}]'),(6,'FRENCH ZIP-UP HOODIE','프렌치 집업 후디',6,'[{\"color\": \"Grey\", \"title\": \"FABRIC\", \"material\": \"Cotton 100%\", \"description\": [\"원단의 컬러와 두께, 촉감은 모두 파사드패턴에서 기획되어 제작된 FACADE PATTERN 의 EXCLUSIVE 원단입니다.\", \"실켓 가공하여 일반적인 스웻 셔츠보다 표면이 깨끗하고 은은한 광택이 납니다.\", \"탄탄하게 편직 된 프렌치 테리 원단입니다.\", \"원단 수축을 최소화 하기 위해 덤블워싱과 텐타가공이 되었습니다.\", \"22년도 제품에서 보풀이 적고, 여름을 제외한 계절에 입기 좋게 좀 더 얇은 두께감으로 원단을 리뉴얼 했습니다.\"]}, {\"title\": \"DETAIL\", \"description\": [\"풀오버 집업과 앞 포켓이 있어 캐주얼하고 편안한 후디 자켓입니다.\", \"옆 라인에 립 원단으로 사이드 패널을 넣어 움직임이 편안합니다.\", \"탄탄한 원단으로 실루엣이 잘 유지되고 멋스럽습니다.\", \"단품으로 입기에도 부담이 없는 실용적인 아이템입니다\", \"클래식한 재킷이나 맥코트 이너로 매치하면 자연스럽고 무심한 스타일링을 연출할 수 있습니다.\", \"와이드 프렌치 스웻 팬츠와 SET-UP으로 착용 가능합니다.\"]}, {\"title\": \"MAKING\", \"description\": [\"지퍼와 후디 스트링은 아이보리 배색으로 포인트를 주었습니다.\", \"촘촘한 땀수로 봉제되어 옷매무새가 단정하고 깨끗합니다.\"]}, {\"type\": \"SMALL / MEDIUM\", \"title\": \"SIZE\", \"armhole\": \"26cm / 26.5cm\", \"hemLength\": \"47cm / 49cm\", \"chestWidth\": \"59cm / 61cm\", \"totalLength\": \"51cm / 52cm\", \"sleeveLength\": \"61cm / 62cm\", \"shoulderWidth\": \"48.5cm / 50cm\", \"sleeveHemWidth\": \"9.5cm / 10cm\"}, {\"size\": \"MEDIUM size 착용\", \"title\": \"MODEL SIZE\", \"height\": \"Height 175cm\"}, {\"title\": \"CARE INSTRUCTION\", \"description\": [\"전문가에게 드라이 클리닝 맡기는 것을 권장합니다.\", \"30도의 낮은온도로 세탁망에 넣어 세탁도 가능합니다.\", \"표백제 사용을 피해주세요.\", \"건조기 사용을 피해주세요.\", \"낮은 온도에 천을 덧대어 다림질 해주세요.\"]}]'),(7,'FRENCH ZIP-UP HOODIE','프렌치 집업 후디',7,'[{\"color\": \"Grey\", \"title\": \"FABRIC\", \"material\": \"Cotton 100%\", \"description\": [\"원단의 컬러와 두께, 촉감은 모두 파사드패턴에서 기획되어 제작된 FACADE PATTERN 의 EXCLUSIVE 원단입니다.\", \"실켓 가공하여 일반적인 스웻 셔츠보다 표면이 깨끗하고 은은한 광택이 납니다.\", \"탄탄하게 편직 된 프렌치 테리 원단입니다.\", \"원단 수축을 최소화 하기 위해 덤블워싱과 텐타가공이 되었습니다.\", \"22년도 제품에서 보풀이 적고, 여름을 제외한 계절에 입기 좋게 좀 더 얇은 두께감으로 원단을 리뉴얼 했습니다.\"]}, {\"title\": \"DETAIL\", \"description\": [\"풀오버 집업과 앞 포켓이 있어 캐주얼하고 편안한 후디 자켓입니다.\", \"옆 라인에 립 원단으로 사이드 패널을 넣어 움직임이 편안합니다.\", \"탄탄한 원단으로 실루엣이 잘 유지되고 멋스럽습니다.\", \"단품으로 입기에도 부담이 없는 실용적인 아이템입니다\", \"클래식한 재킷이나 맥코트 이너로 매치하면 자연스럽고 무심한 스타일링을 연출할 수 있습니다.\", \"와이드 프렌치 스웻 팬츠와 SET-UP으로 착용 가능합니다.\"]}, {\"title\": \"MAKING\", \"description\": [\"지퍼와 후디 스트링은 아이보리 배색으로 포인트를 주었습니다.\", \"촘촘한 땀수로 봉제되어 옷매무새가 단정하고 깨끗합니다.\"]}, {\"type\": \"SMALL / MEDIUM\", \"title\": \"SIZE\", \"armhole\": \"26cm / 26.5cm\", \"hemLength\": \"47cm / 49cm\", \"chestWidth\": \"59cm / 61cm\", \"totalLength\": \"51cm / 52cm\", \"sleeveLength\": \"61cm / 62cm\", \"shoulderWidth\": \"48.5cm / 50cm\", \"sleeveHemWidth\": \"9.5cm / 10cm\"}, {\"size\": \"MEDIUM size 착용\", \"title\": \"MODEL SIZE\", \"height\": \"Height 175cm\"}, {\"title\": \"CARE INSTRUCTION\", \"description\": [\"전문가에게 드라이 클리닝 맡기는 것을 권장합니다.\", \"30도의 낮은온도로 세탁망에 넣어 세탁도 가능합니다.\", \"표백제 사용을 피해주세요.\", \"건조기 사용을 피해주세요.\", \"낮은 온도에 천을 덧대어 다림질 해주세요.\"]}]');
/*!40000 ALTER TABLE `product_detailinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_qna`
--

DROP TABLE IF EXISTS `product_qna`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_qna` (
  `qid` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `content` varchar(200) DEFAULT NULL,
  `is_complete` tinyint(1) DEFAULT NULL,
  `is_lock` tinyint(1) DEFAULT NULL,
  `id` varchar(50) NOT NULL,
  `pid` int NOT NULL,
  `cdate` datetime DEFAULT NULL,
  PRIMARY KEY (`qid`),
  KEY `fk_product_qna_pid` (`pid`),
  KEY `fk_member_id` (`id`),
  CONSTRAINT `fk_member_id` FOREIGN KEY (`id`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_product_qna_pid` FOREIGN KEY (`pid`) REFERENCES `product` (`pid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_qna`
--

LOCK TABLES `product_qna` WRITE;
/*!40000 ALTER TABLE `product_qna` DISABLE KEYS */;
INSERT INTO `product_qna` VALUES (1,'사이즈문의','자켓 사이즈 문의 드립니다.',1,0,'hong',6,'2025-09-22 00:00:00'),(2,'반품문의','자켓 사이즈 반품 문의 드립니다.',1,1,'test',7,'2025-09-22 00:00:00'),(4,'사이즈문의','자켓 사이즈 문의 드립니다.',1,0,'hong',3,'2025-10-02 00:00:00'),(5,'사이즈문의','자켓 사이즈 문의 드립니다.',0,0,'test',2,'2025-10-03 00:00:00'),(6,'사이즈문의','자켓 사이즈 문의 드립니다.',1,0,'hong',1,'2025-10-10 00:00:00'),(7,'사이즈문의','자켓 사이즈 문의 드립니다.',1,0,'hong',6,'2025-09-22 00:00:00'),(8,'반품문의','자켓 사이즈 반품 문의 드립니다.',1,1,'test',7,'2025-09-22 00:00:00'),(10,'사이즈문의','자켓 사이즈 문의 드립니다.',1,0,'hong',3,'2025-10-02 00:00:00'),(11,'사이즈문의','자켓 사이즈 문의 드립니다.',0,0,'test',2,'2025-10-03 00:00:00'),(12,'사이즈문의','자켓 사이즈 문의 드립니다.',1,0,'hong',1,'2025-10-10 00:00:00');
/*!40000 ALTER TABLE `product_qna` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_return`
--

DROP TABLE IF EXISTS `product_return`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_return` (
  `rid` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `list` json DEFAULT NULL,
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_return`
--

LOCK TABLES `product_return` WRITE;
/*!40000 ALTER TABLE `product_return` DISABLE KEYS */;
INSERT INTO `product_return` VALUES (1,'배송/교환/반품/AS 관련 유의사항','상품상세설명에 배송/교환/반품/취소 관련 안내가 기재된 경우 다음 안내사항보다 우선 적용됩니다.','[{\"title\": \"배송 정보\", \"infoList\": [\"상품별로 상품 특성 및 배송지에 따라 배송유형 및 소요기간이 달라집니다.\", \"일부 주문상품 또는 예약상품의 경우 기본 배송일 외에 추가 배송 소요일이 발생될 수 있습니다.\", \"제주 및 도서산간 지역은 출고, 반품, 교환시 추가 배송비(항공, 도선료)가 부과 될 수 있습니다.\", \"상품의 배송비는 공급업체의 정책에 따라 다르오며 공휴일 및 휴일은 배송이 불가합니다.\"]}, {\"title\": \"취소/반품/교환 안내\", \"infoList\": [\"상품별로 상품 특성 및 배송지에 따라 배송유형 및 소요기간이 달라집니다.\", \"일부 주문상품 또는 예약상품의 경우 기본 배송일 외에 추가 배송 소요일이 발생될 수 있습니다.\", \"제주 및 도서산간 지역은 출고, 반품, 교환시 추가 배송비(항공, 도선료)가 부과 될 수 있습니다.\", \"상품의 배송비는 공급업체의 정책에 따라 다르오며 공휴일 및 휴일은 배송이 불가합니다.\", \"상품별로 상품 특성 및 배송지에 따라 배송유형 및 소요기간이 달라집니다.\", \"일부 주문상품 또는 예약상품의 경우 기본 배송일 외에 추가 배송 소요일이 발생될 수 있습니다.\", \"제주 및 도서산간 지역은 출고, 반품, 교환시 추가 배송비(항공, 도선료)가 부과 될 수 있습니다.\", \"상품의 배송비는 공급업체의 정책에 따라 다르오며 공휴일 및 휴일은 배송이 불가합니다.\", \"상품별로 상품 특성 및 배송지에 따라 배송유형 및 소요기간이 달라집니다.\", \"일부 주문상품 또는 예약상품의 경우 기본 배송일 외에 추가 배송 소요일이 발생될 수 있습니다.\", \"제주 및 도서산간 지역은 출고, 반품, 교환시 추가 배송비(항공, 도선료)가 부과 될 수 있습니다.\", \"상품의 배송비는 공급업체의 정책에 따라 다르오며 공휴일 및 휴일은 배송이 불가합니다.\"]}, {\"title\": \"반품/교환 불가능한 경우\", \"infoList\": [\"상품별로 상품 특성 및 배송지에 따라 배송유형 및 소요기간이 달라집니다.\", \"일부 주문상품 또는 예약상품의 경우 기본 배송일 외에 추가 배송 소요일이 발생될 수 있습니다.\", \"제주 및 도서산간 지역은 출고, 반품, 교환시 추가 배송비(항공, 도선료)가 부과 될 수 있습니다.\", \"상품의 배송비는 공급업체의 정책에 따라 다르오며 공휴일 및 휴일은 배송이 불가합니다.\", \"상품별로 상품 특성 및 배송지에 따라 배송유형 및 소요기간이 달라집니다.\", \"일부 주문상품 또는 예약상품의 경우 기본 배송일 외에 추가 배송 소요일이 발생될 수 있습니다.\", \"제주 및 도서산간 지역은 출고, 반품, 교환시 추가 배송비(항공, 도선료)가 부과 될 수 있습니다.\", \"상품의 배송비는 공급업체의 정책에 따라 다르오며 공휴일 및 휴일은 배송이 불가합니다.\"]}, {\"title\": \"A/S 안내\", \"infoList\": [\"상품별로 상품 특성 및 배송지에 따라 배송유형 및 소요기간이 달라집니다.\", \"일부 주문상품 또는 예약상품의 경우 기본 배송일 외에 추가 배송 소요일이 발생될 수 있습니다.\", \"제주 및 도서산간 지역은 출고, 반품, 교환시 추가 배송비(항공, 도선료)가 부과 될 수 있습니다.\", \"상품의 배송비는 공급업체의 정책에 따라 다르오며 공휴일 및 휴일은 배송이 불가합니다.\"]}]');
/*!40000 ALTER TABLE `product_return` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support`
--

DROP TABLE IF EXISTS `support`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support` (
  `sid` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `content` varchar(200) DEFAULT NULL,
  `stype` varchar(30) NOT NULL,
  `hits` int DEFAULT NULL,
  `rdate` datetime DEFAULT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support`
--

LOCK TABLES `support` WRITE;
/*!40000 ALTER TABLE `support` DISABLE KEYS */;
INSERT INTO `support` VALUES (1,'iOS 18 업데이트 관련 예매 서비스 이용안내','test','system',100,'2024-09-13 00:00:00'),(2,'iOS 18 업데이트 관련 예매 서비스 이용안내',NULL,'system',118692,'2024-09-13 00:00:00'),(3,'iOS 18 업데이트 관련 예매 서비스 이용안내',NULL,'system',118692,'2024-09-13 00:00:00'),(4,'iOS 18 업데이트 관련 예매 서비스 이용안내',NULL,'system',118692,'2024-09-13 00:00:00'),(5,'android 업데이트 관련 예매 서비스 이용안내','test','system',20000,'2025-05-13 00:00:00'),(6,'android 업데이트 관련 예매 서비스 이용안내',NULL,'system',20000,'2025-05-13 00:00:00'),(7,'android 업데이트 관련 예매 서비스 이용안내',NULL,'system',20000,'2025-05-13 00:00:00'),(8,'android 업데이트 관련 예매 서비스 이용안내',NULL,'theater',20000,'2025-05-13 00:00:00'),(9,'android 업데이트 관련 예매 서비스 이용안내',NULL,'event',20000,'2025-05-13 00:00:00'),(10,'android 업데이트 관련 예매 서비스 이용안내',NULL,'theater',20000,'2025-05-13 00:00:00'),(11,'android 업데이트 관련 예매 서비스 이용안내',NULL,'event',20000,'2025-05-13 00:00:00'),(12,'android 업데이트 관련 예매 서비스 이용안내',NULL,'theater',20000,'2025-05-13 00:00:00'),(13,'android 업데이트 관련 예매 서비스 이용안내',NULL,'event',20000,'2025-05-13 00:00:00'),(14,'android 업데이트 관련 예매 서비스 이용안내',NULL,'partner',20000,'2025-05-13 00:00:00'),(15,'android 업데이트 관련 예매 서비스 이용안내',NULL,'partner',20000,'2025-05-13 00:00:00'),(16,'android 업데이트 관련 예매 서비스 이용안내',NULL,'etc',20000,'2025-05-13 00:00:00'),(17,'android 업데이트 관련 예매 서비스 이용안내',NULL,'etc',20000,'2025-05-13 00:00:00'),(18,'android 업데이트 관련 예매 서비스 이용안내','test','system',20000,'2025-05-13 00:00:00');
/*!40000 ALTER TABLE `support` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `view_cartlist`
--

DROP TABLE IF EXISTS `view_cartlist`;
/*!50001 DROP VIEW IF EXISTS `view_cartlist`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_cartlist` AS SELECT 
 1 AS `id`,
 1 AS `mname`,
 1 AS `phone`,
 1 AS `email`,
 1 AS `pid`,
 1 AS `name`,
 1 AS `info`,
 1 AS `image`,
 1 AS `price`,
 1 AS `size`,
 1 AS `qty`,
 1 AS `cid`,
 1 AS `total_price`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `view_cartlist`
--

/*!50001 DROP VIEW IF EXISTS `view_cartlist`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_cartlist` AS select `m`.`id` AS `id`,`m`.`name` AS `mname`,`m`.`phone` AS `phone`,`m`.`email` AS `email`,`p`.`pid` AS `pid`,`p`.`name` AS `name`,`p`.`info` AS `info`,`p`.`image` AS `image`,`p`.`price` AS `price`,`c`.`size` AS `size`,`c`.`qty` AS `qty`,`c`.`cid` AS `cid`,`t`.`total_price` AS `total_price` from (((`member` `m` join `product` `p`) join `cart` `c`) join (select `c`.`id` AS `id`,sum((`c`.`qty` * `p`.`price`)) AS `total_price` from (`cart` `c` join `product` `p` on((`c`.`pid` = `p`.`pid`))) group by `c`.`id`) `t`) where ((`m`.`id` = `c`.`id`) and (`p`.`pid` = `c`.`pid`) and (`c`.`id` = `t`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-05 13:49:06
