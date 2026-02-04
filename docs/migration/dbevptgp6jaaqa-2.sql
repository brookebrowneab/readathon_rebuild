-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 03, 2026 at 09:04 PM
-- Server version: 8.4.5-5
-- PHP Version: 8.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbevptgp6jaaqa`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `user_type` tinytext COLLATE utf8mb3_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `reset_link_token` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `exp_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `AgMinReadByDayFourthGR`
-- (See below for the actual view)
--
CREATE TABLE `AgMinReadByDayFourthGR` (
`stSponsorId` varchar(255)
,`avgMinutesPerDay` bigint
,`stFirstName` tinytext
,`stLastName` tinytext
,`email` varchar(255)
);

-- --------------------------------------------------------

--
-- Table structure for table `audit_log`
--

CREATE TABLE `audit_log` (
  `id` bigint NOT NULL,
  `event_type` varchar(50) NOT NULL,
  `actor_id` int DEFAULT NULL,
  `actor_type` varchar(20) DEFAULT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` varchar(64) DEFAULT NULL,
  `before_state` json DEFAULT NULL,
  `after_state` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `AvgMinByDaySecondGR`
-- (See below for the actual view)
--
CREATE TABLE `AvgMinByDaySecondGR` (
`stSponsorId` varchar(255)
,`avgMinutesPerDay` bigint
,`stFirstName` tinytext
,`stLastName` tinytext
,`email` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `AvgMinByDayThirdGR`
-- (See below for the actual view)
--
CREATE TABLE `AvgMinByDayThirdGR` (
`stSponsorId` varchar(255)
,`avgMinutesPerDay` bigint
,`stFirstName` tinytext
,`stLastName` tinytext
,`email` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `AvgMinReadByDayFifthGR`
-- (See below for the actual view)
--
CREATE TABLE `AvgMinReadByDayFifthGR` (
`stSponsorId` varchar(255)
,`avgMinutesPerDay` bigint
,`stFirstName` tinytext
,`stLastName` tinytext
,`email` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `AvgMinReadByDayFirstGR`
-- (See below for the actual view)
--
CREATE TABLE `AvgMinReadByDayFirstGR` (
`stSponsorId` varchar(255)
,`avgMinutesPerDay` bigint
,`stFirstName` tinytext
,`stLastName` tinytext
,`email` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `AvgMinReadByDayK`
-- (See below for the actual view)
--
CREATE TABLE `AvgMinReadByDayK` (
`stSponsorId` varchar(255)
,`avgMinutesPerDay` bigint
,`stFirstName` tinytext
,`stLastName` tinytext
,`email` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `AvgMinReadByDayPK`
-- (See below for the actual view)
--
CREATE TABLE `AvgMinReadByDayPK` (
`stSponsorId` varchar(255)
,`avgMinutesPerDay` bigint
,`stFirstName` tinytext
,`stLastName` tinytext
,`email` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `AvgMinReadMaxDayTotalRead`
-- (See below for the actual view)
--
CREATE TABLE `AvgMinReadMaxDayTotalRead` (
`stSponsorId` varchar(255)
,`avgMinutesPerDay` bigint
,`stFirstName` tinytext
,`stLastName` tinytext
,`email` varchar(255)
,`maxMinutesPerDay` decimal(32,0)
,`dateWithMaxMinutes` date
,`totalMinutesRead` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `AvgMinReadPerDay`
-- (See below for the actual view)
--
CREATE TABLE `AvgMinReadPerDay` (
`stSponsorId` varchar(255)
,`avgMinutesPerDay` bigint
,`stFirstName` tinytext
,`stLastName` tinytext
,`email` varchar(255)
);

-- --------------------------------------------------------

--
-- Table structure for table `bookLog`
--

CREATE TABLE `bookLog` (
  `title` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `author` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `stSponsorId` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `campaigns`
--

CREATE TABLE `campaigns` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `max_minutes_per_day` int DEFAULT NULL,
  `max_minutes_per_campaign` int DEFAULT NULL,
  `pledge_cutoff_date` date DEFAULT NULL,
  `payment_cutoff_date` date DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `duplicate_pledges`
-- (See below for the actual view)
--
CREATE TABLE `duplicate_pledges` (
`stSponsorId` varchar(255)
,`COUNTstSponsorId` bigint
,`studentFirstName` tinytext
,`COUNTstudentFirstName` bigint
,`studentLastName` tinytext
,`COUNTstudentLastName` bigint
,`amt` decimal(10,2)
,`COUNTamt` bigint
,`unit` varchar(255)
,`COUNTunit` bigint
,`spUserName` varchar(255)
,`COUNTspUserName` bigint
,`pledgeTotal` decimal(42,2)
);

-- --------------------------------------------------------

--
-- Table structure for table `invite_links`
--

CREATE TABLE `invite_links` (
  `id` int NOT NULL,
  `campaign_id` int NOT NULL,
  `type` varchar(20) NOT NULL,
  `token` varchar(64) NOT NULL,
  `stSponsorId` varchar(64) DEFAULT NULL,
  `teacher_username` varchar(255) DEFAULT NULL,
  `created_by_username` varchar(255) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `janneyParents`
--

CREATE TABLE `janneyParents` (
  `COL 1` varchar(8) DEFAULT NULL,
  `COL 2` varchar(3) DEFAULT NULL,
  `COL 3` varchar(3) DEFAULT NULL,
  `COL 4` varchar(3) DEFAULT NULL,
  `COL 5` varchar(16) DEFAULT NULL,
  `COL 6` varchar(21) DEFAULT NULL,
  `COL 7` varchar(46) DEFAULT NULL,
  `COL 8` varchar(13) DEFAULT NULL,
  `COL 9` varchar(2) DEFAULT NULL,
  `COL 10` varchar(9) DEFAULT NULL,
  `COL 11` varchar(34) DEFAULT NULL,
  `COL 12` varchar(10) DEFAULT NULL,
  `COL 13` varchar(19) DEFAULT NULL,
  `COL 14` varchar(18) DEFAULT NULL,
  `COL 15` varchar(34) DEFAULT NULL,
  `COL 16` varchar(13) DEFAULT NULL,
  `COL 17` varchar(2) DEFAULT NULL,
  `COL 18` varchar(9) DEFAULT NULL,
  `COL 19` varchar(37) DEFAULT NULL,
  `COL 20` varchar(18) DEFAULT NULL,
  `COL 21` varchar(54) DEFAULT NULL,
  `COL 22` varchar(51) DEFAULT NULL,
  `COL 23` varchar(90) DEFAULT NULL,
  `COL 24` varchar(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Stand-in structure for view `kitchenSink`
-- (See below for the actual view)
--
CREATE TABLE `kitchenSink` (
`pledgeId` varchar(255)
,`pledgeAmount` decimal(10,2)
,`pledgeUnit` varchar(255)
,`amountPaid` double
,`studentUserName` tinytext
,`readingGoal` int
,`minutesRead` decimal(32,0)
,`studentFirstName` tinytext
,`studentLastName` tinytext
,`teacher` tinytext
,`grade` tinytext
,`studentSponsorId` varchar(255)
,`parentUserName` tinytext
,`familyEmail` varchar(255)
,`spUserName` varchar(255)
,`pledgeTotal` decimal(42,2)
,`sponsorEmail` varchar(255)
);

-- --------------------------------------------------------

--
-- Table structure for table `lastEmailSent`
--

CREATE TABLE `lastEmailSent` (
  `sent_id` int NOT NULL,
  `spUserName` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `dateSent` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `LogOver18Hrs`
-- (See below for the actual view)
--
CREATE TABLE `LogOver18Hrs` (
`firstName` tinytext
,`lastName` tinytext
,`sSponsorId` varchar(255)
,`rLSponsorId` varchar(255)
,`minutes` int
,`dateRead` date
,`dateEntered` timestamp
,`totalread` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int NOT NULL,
  `filename` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `applied_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `MoreThanFiveHrsOneDayLogs`
-- (See below for the actual view)
--
CREATE TABLE `MoreThanFiveHrsOneDayLogs` (
`stSponsorId` varchar(255)
,`dateRead` date
,`stFirstName` tinytext
,`stLastName` tinytext
,`email` varchar(255)
,`total_minutes` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `sponsor_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `order_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `order_date` datetime DEFAULT NULL,
  `pledgeId_json` json NOT NULL,
  `customerId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email_cust` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `paid_amt` float DEFAULT NULL,
  `paid_date` timestamp NULL DEFAULT NULL,
  `pymt_status` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `receipt_link` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_pledges`
--

CREATE TABLE `payment_pledges` (
  `payment_id` int NOT NULL,
  `pledge_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pledges`
--

CREATE TABLE `pledges` (
  `id` int NOT NULL,
  `pledgeId` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `spUserName` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `stSponsorId` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `amt` decimal(10,2) NOT NULL,
  `unit` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `paid` float NOT NULL DEFAULT '0',
  `order_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `payment_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `dateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `campaign_id` int DEFAULT NULL,
  `target_type` varchar(10) COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'student',
  `target_teacher_username` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `pledge_type` varchar(20) COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'flat',
  `rate_per_minute` decimal(10,2) DEFAULT NULL,
  `flat_amount` decimal(10,2) DEFAULT NULL,
  `milestone_minutes_target` int DEFAULT NULL,
  `sponsor_display_name` varchar(120) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `sponsor_email` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `sponsor_phone` varchar(20) COLLATE utf8mb3_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pledgesPvYr`
--

CREATE TABLE `pledgesPvYr` (
  `id` int NOT NULL,
  `pledgeId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `spUserName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `stSponsorId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `amt` decimal(10,2) NOT NULL,
  `unit` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `paid` float NOT NULL DEFAULT '0',
  `order_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `payment_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `dateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `pledgeSums`
-- (See below for the actual view)
--
CREATE TABLE `pledgeSums` (
`stSponsorId` varchar(255)
,`studentFirstName` tinytext
,`studentLastName` tinytext
,`amt` decimal(10,2)
,`unit` varchar(255)
,`spUserName` varchar(255)
,`pledgeId` varchar(255)
,`pledgeTotal` decimal(42,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `pledgeSumsPaid`
-- (See below for the actual view)
--
CREATE TABLE `pledgeSumsPaid` (
`spUserName` varchar(255)
,`sponsorEmail` varchar(255)
,`stSponsorId` varchar(255)
,`studentFirstName` tinytext
,`studentLastName` tinytext
,`amt` decimal(10,2)
,`unit` varchar(255)
,`pledgeTotal` decimal(42,2)
,`pledgeId` varchar(255)
,`amtPaid` double
);

-- --------------------------------------------------------

--
-- Table structure for table `pledgeSumsR0`
--

CREATE TABLE `pledgeSumsR0` (
  `stSponsorId` varchar(20) DEFAULT NULL,
  `studentFirstName` varchar(16) DEFAULT NULL,
  `studentLastName` varchar(25) DEFAULT NULL,
  `spUserName` varchar(16) DEFAULT NULL,
  `SUM(p.``pledgeTotal``)` varchar(20) DEFAULT NULL,
  `teacher` varchar(13) DEFAULT NULL,
  `pl4student` varchar(12) DEFAULT NULL,
  `email` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `pledges_old`
--

CREATE TABLE `pledges_old` (
  `id` int NOT NULL,
  `pledgeId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `spUserName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `stSponsorId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `amt` decimal(10,2) NOT NULL,
  `unit` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `paid` float NOT NULL DEFAULT '0',
  `order_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `payment_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `dateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `readingLog`
--

CREATE TABLE `readingLog` (
  `logId` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `minutes` int NOT NULL,
  `book_title` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `book_author` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `book_cover_id` int DEFAULT NULL,
  `dateRead` date NOT NULL,
  `dateEntered` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `stSponsorId` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `enteredBy` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `campaign_id` int DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'submitted',
  `validated_by` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `validated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `ReadingLogSummedbyStudentDate`
-- (See below for the actual view)
--
CREATE TABLE `ReadingLogSummedbyStudentDate` (
`stSponsorId` varchar(255)
,`dateRead` date
,`stFirstName` tinytext
,`stLastName` tinytext
,`email` varchar(255)
,`total_minutes` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Table structure for table `readingLog_old`
--

CREATE TABLE `readingLog_old` (
  `logId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `minutes` int NOT NULL,
  `dateRead` date NOT NULL,
  `dateEntered` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `stSponsorId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `enteredBy` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `Readover18hrs`
-- (See below for the actual view)
--
CREATE TABLE `Readover18hrs` (
`firstName` tinytext
,`lastName` tinytext
,`minutes` int
,`dateRead` date
,`dateEntered` timestamp
,`totalRead` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `RLSums`
-- (See below for the actual view)
--
CREATE TABLE `RLSums` (
`stSponsorId` varchar(255)
,`readTotal` decimal(32,0)
,`readToday` decimal(32,0)
,`readYest` decimal(32,0)
,`readWeek` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(128) NOT NULL,
  `user_id` int DEFAULT NULL,
  `data` text,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `sponsorTotals`
-- (See below for the actual view)
--
CREATE TABLE `sponsorTotals` (
`sponsorUserName` varchar(255)
,`totalMoneyPledged` decimal(64,2)
,`amountPaid` double
,`totalUnpaid` double
,`numStudentsSponsored` bigint
,`numPledgesMade` bigint
,`sponsorEmail` varchar(255)
);

-- --------------------------------------------------------

--
-- Table structure for table `sponsor_invitations`
--

CREATE TABLE `sponsor_invitations` (
  `id` int NOT NULL,
  `student_sponsor_id` varchar(255) NOT NULL,
  `campaign_id` int NOT NULL,
  `invitee_email` varchar(255) NOT NULL,
  `invited_by_user_id` int NOT NULL,
  `token` varchar(64) NOT NULL,
  `status` enum('pending','accepted') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `stPlus`
-- (See below for the actual view)
--
CREATE TABLE `stPlus` (
`studentUserName` tinytext
,`readingGoal` int
,`studentFirstName` tinytext
,`studentLastName` tinytext
,`teacher` tinytext
,`grade` tinytext
,`studentSponsorId` varchar(255)
,`parentUserName` tinytext
,`familyEmail` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `stPlusPledgeTotals`
-- (See below for the actual view)
--
CREATE TABLE `stPlusPledgeTotals` (
`studentUserName` tinytext
,`readingGoal` int
,`studentFirstName` tinytext
,`studentLastName` tinytext
,`teacher` tinytext
,`grade` tinytext
,`studentSponsorId` varchar(255)
,`parentUserName` tinytext
,`familyEmail` varchar(255)
,`spUserName` varchar(255)
,`pledgeTotal` decimal(42,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `stPlusReadEmailAll`
-- (See below for the actual view)
--
CREATE TABLE `stPlusReadEmailAll` (
`id` int
,`stUserName` tinytext
,`readingGoal` int
,`stFirstName` tinytext
,`stLastName` tinytext
,`teacher` tinytext
,`grade` tinytext
,`stSponsorId` varchar(255)
,`familyUserName` tinytext
,`totalMinRead` decimal(32,0)
,`email` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `studentReading`
-- (See below for the actual view)
--
CREATE TABLE `studentReading` (
`totalRead` decimal(32,0)
,`firstName` tinytext
,`lastName` tinytext
,`class` tinytext
,`grade` tinytext
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `studentReadingInclThoseNotLoggingReading`
-- (See below for the actual view)
--
CREATE TABLE `studentReadingInclThoseNotLoggingReading` (
`id` int
,`stUserName` tinytext
,`readingGoal` int
,`stFirstName` tinytext
,`stLastName` tinytext
,`teacher` tinytext
,`grade` tinytext
,`stSponsorId` varchar(255)
,`familyUserName` tinytext
,`SUM-rL-minutes` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int NOT NULL,
  `stUserName` tinytext COLLATE utf8mb3_unicode_ci NOT NULL,
  `readingGoal` int NOT NULL,
  `stFirstName` tinytext COLLATE utf8mb3_unicode_ci NOT NULL,
  `stLastName` tinytext COLLATE utf8mb3_unicode_ci NOT NULL,
  `schoolId` int NOT NULL,
  `teacher` tinytext COLLATE utf8mb3_unicode_ci NOT NULL,
  `grade` tinytext COLLATE utf8mb3_unicode_ci NOT NULL,
  `stSponsorId` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `familyUserName` tinytext COLLATE utf8mb3_unicode_ci NOT NULL,
  `familyUserid` int NOT NULL,
  `privacy` int NOT NULL,
  `campaign_id` int DEFAULT NULL,
  `homeroom_teacher_username` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `student_public_id` varchar(64) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `share_public_link` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `studentsPvYr`
--

CREATE TABLE `studentsPvYr` (
  `id` int NOT NULL,
  `stUserName` tinytext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `readingGoal` int NOT NULL,
  `stFirstName` tinytext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `stLastName` tinytext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `schoolId` int NOT NULL,
  `teacher` tinytext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `grade` tinytext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `stSponsorId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `familyUserName` tinytext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `familyUserid` int NOT NULL,
  `privacy` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students_old`
--

CREATE TABLE `students_old` (
  `id` int NOT NULL,
  `stUserName` tinytext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `readingGoal` int NOT NULL,
  `stFirstName` tinytext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `stLastName` tinytext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `schoolId` int NOT NULL,
  `teacher` tinytext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `grade` tinytext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `stSponsorId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `familyUserName` tinytext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `familyUserid` int NOT NULL,
  `privacy` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id_table` int NOT NULL,
  `teacherUserName` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `grade` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `defaultVal` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `homeroom` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `TotalsByClass`
-- (See below for the actual view)
--
CREATE TABLE `TotalsByClass` (
`class` tinytext
,`SUM(totalRead)` decimal(54,0)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `TotalsByClassGrade`
-- (See below for the actual view)
--
CREATE TABLE `TotalsByClassGrade` (
`class` tinytext
,`grade` tinytext
,`totalReadSum` decimal(54,0)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `TotalsByGrade`
-- (See below for the actual view)
--
CREATE TABLE `TotalsByGrade` (
`grade` tinytext
,`minRead` decimal(54,0)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `UnpaidSponsorsLastEmail`
-- (See below for the actual view)
--
CREATE TABLE `UnpaidSponsorsLastEmail` (
`sent_id` int
,`spUserName` varchar(50)
,`dateSent` timestamp
);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `user_type` tinytext COLLATE utf8mb3_unicode_ci NOT NULL,
  `display_name` varchar(120) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `reset_link_token` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `exp_date` date DEFAULT NULL,
  `magic_link_token` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `magic_link_expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_audit_log_event_type` (`event_type`),
  ADD KEY `idx_audit_log_entity` (`entity_type`,`entity_id`),
  ADD KEY `idx_audit_log_actor` (`actor_id`),
  ADD KEY `idx_audit_log_created_at` (`created_at`);

--
-- Indexes for table `campaigns`
--
ALTER TABLE `campaigns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_campaigns_is_active` (`is_active`);

--
-- Indexes for table `invite_links`
--
ALTER TABLE `invite_links`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_invite_links_token` (`token`),
  ADD KEY `idx_invite_links_campaign_type` (`campaign_id`,`type`),
  ADD KEY `idx_invite_links_student` (`stSponsorId`);

--
-- Indexes for table `lastEmailSent`
--
ALTER TABLE `lastEmailSent`
  ADD PRIMARY KEY (`sent_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `filename` (`filename`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_pledges`
--
ALTER TABLE `payment_pledges`
  ADD PRIMARY KEY (`payment_id`,`pledge_id`);

--
-- Indexes for table `pledges`
--
ALTER TABLE `pledges`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pledgeId` (`pledgeId`),
  ADD KEY `idx_pledges_campaign_student` (`campaign_id`,`stSponsorId`),
  ADD KEY `idx_pledges_campaign_target` (`campaign_id`,`target_type`,`target_teacher_username`),
  ADD KEY `idx_pledges_campaign_paid` (`campaign_id`,`paid`),
  ADD KEY `idx_pledges_sponsor` (`spUserName`);

--
-- Indexes for table `pledgesPvYr`
--
ALTER TABLE `pledgesPvYr`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pledgeId` (`pledgeId`);

--
-- Indexes for table `pledges_old`
--
ALTER TABLE `pledges_old`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pledgeId` (`pledgeId`);

--
-- Indexes for table `readingLog`
--
ALTER TABLE `readingLog`
  ADD PRIMARY KEY (`logId`),
  ADD KEY `stSponsorId` (`stSponsorId`),
  ADD KEY `idx_readingLog_campaign_student_date` (`campaign_id`,`stSponsorId`,`dateRead`),
  ADD KEY `idx_readingLog_campaign_status` (`campaign_id`,`status`);

--
-- Indexes for table `readingLog_old`
--
ALTER TABLE `readingLog_old`
  ADD PRIMARY KEY (`logId`),
  ADD KEY `stSponsorId` (`stSponsorId`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_sessions_user_id` (`user_id`),
  ADD KEY `idx_sessions_last_activity` (`last_activity`);

--
-- Indexes for table `sponsor_invitations`
--
ALTER TABLE `sponsor_invitations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `idx_invitation_token` (`token`),
  ADD KEY `idx_invitation_email` (`invitee_email`),
  ADD KEY `idx_invitation_student` (`student_sponsor_id`,`campaign_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_students_campaign_homeroom` (`campaign_id`,`homeroom_teacher_username`),
  ADD KEY `idx_students_public_id` (`student_public_id`);

--
-- Indexes for table `studentsPvYr`
--
ALTER TABLE `studentsPvYr`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `students_old`
--
ALTER TABLE `students_old`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id_table`),
  ADD UNIQUE KEY `teacherUserName` (`teacherUserName`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `audit_log`
--
ALTER TABLE `audit_log`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `campaigns`
--
ALTER TABLE `campaigns`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invite_links`
--
ALTER TABLE `invite_links`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lastEmailSent`
--
ALTER TABLE `lastEmailSent`
  MODIFY `sent_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pledges`
--
ALTER TABLE `pledges`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pledgesPvYr`
--
ALTER TABLE `pledgesPvYr`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pledges_old`
--
ALTER TABLE `pledges_old`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sponsor_invitations`
--
ALTER TABLE `sponsor_invitations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `studentsPvYr`
--
ALTER TABLE `studentsPvYr`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `students_old`
--
ALTER TABLE `students_old`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id_table` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

-- --------------------------------------------------------

--
-- Structure for view `AgMinReadByDayFourthGR`
--
DROP TABLE IF EXISTS `AgMinReadByDayFourthGR`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `AgMinReadByDayFourthGR`  AS SELECT `s`.`stSponsorId` AS `stSponsorId`, cast(avg(`dailyMinutes`.`minutes`) as signed) AS `avgMinutesPerDay`, `s`.`stFirstName` AS `stFirstName`, `s`.`stLastName` AS `stLastName`, `u`.`email` AS `email` FROM (((select `r`.`stSponsorId` AS `stSponsorId`,`r`.`dateRead` AS `dateRead`,sum(`r`.`minutes`) AS `minutes` from `readingLog` `r` group by `r`.`stSponsorId`,`r`.`dateRead`) `dailyMinutes` left join `students` `s` on((`dailyMinutes`.`stSponsorId` = `s`.`stSponsorId`))) left join `users` `u` on((`s`.`familyUserName` = `u`.`username`))) WHERE (`s`.`grade` = 'Fourth') GROUP BY `s`.`stSponsorId` ORDER BY `avgMinutesPerDay` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `AvgMinByDaySecondGR`
--
DROP TABLE IF EXISTS `AvgMinByDaySecondGR`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `AvgMinByDaySecondGR`  AS SELECT `s`.`stSponsorId` AS `stSponsorId`, cast(avg(`dailyMinutes`.`minutes`) as signed) AS `avgMinutesPerDay`, `s`.`stFirstName` AS `stFirstName`, `s`.`stLastName` AS `stLastName`, `u`.`email` AS `email` FROM (((select `r`.`stSponsorId` AS `stSponsorId`,`r`.`dateRead` AS `dateRead`,sum(`r`.`minutes`) AS `minutes` from `readingLog` `r` group by `r`.`stSponsorId`,`r`.`dateRead`) `dailyMinutes` left join `students` `s` on((`dailyMinutes`.`stSponsorId` = `s`.`stSponsorId`))) left join `users` `u` on((`s`.`familyUserName` = `u`.`username`))) WHERE (`s`.`grade` = 'Second') GROUP BY `s`.`stSponsorId` ORDER BY `avgMinutesPerDay` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `AvgMinByDayThirdGR`
--
DROP TABLE IF EXISTS `AvgMinByDayThirdGR`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `AvgMinByDayThirdGR`  AS SELECT `s`.`stSponsorId` AS `stSponsorId`, cast(avg(`dailyMinutes`.`minutes`) as signed) AS `avgMinutesPerDay`, `s`.`stFirstName` AS `stFirstName`, `s`.`stLastName` AS `stLastName`, `u`.`email` AS `email` FROM (((select `r`.`stSponsorId` AS `stSponsorId`,`r`.`dateRead` AS `dateRead`,sum(`r`.`minutes`) AS `minutes` from `readingLog` `r` group by `r`.`stSponsorId`,`r`.`dateRead`) `dailyMinutes` left join `students` `s` on((`dailyMinutes`.`stSponsorId` = `s`.`stSponsorId`))) left join `users` `u` on((`s`.`familyUserName` = `u`.`username`))) WHERE (`s`.`grade` = 'Third') GROUP BY `s`.`stSponsorId` ORDER BY `avgMinutesPerDay` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `AvgMinReadByDayFifthGR`
--
DROP TABLE IF EXISTS `AvgMinReadByDayFifthGR`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `AvgMinReadByDayFifthGR`  AS SELECT `s`.`stSponsorId` AS `stSponsorId`, cast(avg(`dailyMinutes`.`minutes`) as signed) AS `avgMinutesPerDay`, `s`.`stFirstName` AS `stFirstName`, `s`.`stLastName` AS `stLastName`, `u`.`email` AS `email` FROM (((select `r`.`stSponsorId` AS `stSponsorId`,`r`.`dateRead` AS `dateRead`,sum(`r`.`minutes`) AS `minutes` from `readingLog` `r` group by `r`.`stSponsorId`,`r`.`dateRead`) `dailyMinutes` left join `students` `s` on((`dailyMinutes`.`stSponsorId` = `s`.`stSponsorId`))) left join `users` `u` on((`s`.`familyUserName` = `u`.`username`))) WHERE (`s`.`grade` = 'Fifth') GROUP BY `s`.`stSponsorId` ORDER BY `avgMinutesPerDay` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `AvgMinReadByDayFirstGR`
--
DROP TABLE IF EXISTS `AvgMinReadByDayFirstGR`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `AvgMinReadByDayFirstGR`  AS SELECT `s`.`stSponsorId` AS `stSponsorId`, cast(avg(`dailyMinutes`.`minutes`) as signed) AS `avgMinutesPerDay`, `s`.`stFirstName` AS `stFirstName`, `s`.`stLastName` AS `stLastName`, `u`.`email` AS `email` FROM (((select `r`.`stSponsorId` AS `stSponsorId`,`r`.`dateRead` AS `dateRead`,sum(`r`.`minutes`) AS `minutes` from `readingLog` `r` group by `r`.`stSponsorId`,`r`.`dateRead`) `dailyMinutes` left join `students` `s` on((`dailyMinutes`.`stSponsorId` = `s`.`stSponsorId`))) left join `users` `u` on((`s`.`familyUserName` = `u`.`username`))) WHERE (`s`.`grade` = 'First') GROUP BY `s`.`stSponsorId` ORDER BY `avgMinutesPerDay` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `AvgMinReadByDayK`
--
DROP TABLE IF EXISTS `AvgMinReadByDayK`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `AvgMinReadByDayK`  AS SELECT `s`.`stSponsorId` AS `stSponsorId`, cast(avg(`dailyMinutes`.`minutes`) as signed) AS `avgMinutesPerDay`, `s`.`stFirstName` AS `stFirstName`, `s`.`stLastName` AS `stLastName`, `u`.`email` AS `email` FROM (((select `r`.`stSponsorId` AS `stSponsorId`,`r`.`dateRead` AS `dateRead`,sum(`r`.`minutes`) AS `minutes` from `readingLog` `r` group by `r`.`stSponsorId`,`r`.`dateRead`) `dailyMinutes` left join `students` `s` on((`dailyMinutes`.`stSponsorId` = `s`.`stSponsorId`))) left join `users` `u` on((`s`.`familyUserName` = `u`.`username`))) WHERE (`s`.`grade` = 'Kindergarten') GROUP BY `s`.`stSponsorId` ORDER BY `avgMinutesPerDay` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `AvgMinReadByDayPK`
--
DROP TABLE IF EXISTS `AvgMinReadByDayPK`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `AvgMinReadByDayPK`  AS SELECT `s`.`stSponsorId` AS `stSponsorId`, cast(avg(`dailyMinutes`.`minutes`) as signed) AS `avgMinutesPerDay`, `s`.`stFirstName` AS `stFirstName`, `s`.`stLastName` AS `stLastName`, `u`.`email` AS `email` FROM (((select `r`.`stSponsorId` AS `stSponsorId`,`r`.`dateRead` AS `dateRead`,sum(`r`.`minutes`) AS `minutes` from `readingLog` `r` group by `r`.`stSponsorId`,`r`.`dateRead`) `dailyMinutes` left join `students` `s` on((`dailyMinutes`.`stSponsorId` = `s`.`stSponsorId`))) left join `users` `u` on((`s`.`familyUserName` = `u`.`username`))) WHERE (`s`.`grade` = 'Pre-K') GROUP BY `s`.`stSponsorId` ORDER BY `avgMinutesPerDay` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `AvgMinReadMaxDayTotalRead`
--
DROP TABLE IF EXISTS `AvgMinReadMaxDayTotalRead`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `AvgMinReadMaxDayTotalRead`  AS SELECT `s`.`stSponsorId` AS `stSponsorId`, cast((sum(`dailyMinutes`.`minutes`) / (to_days('2023-03-17') - to_days('2023-03-02'))) as signed) AS `avgMinutesPerDay`, `s`.`stFirstName` AS `stFirstName`, `s`.`stLastName` AS `stLastName`, `u`.`email` AS `email`, `max_daily_minutes`.`maxMinutes` AS `maxMinutesPerDay`, `max_daily_minutes`.`maxDate` AS `dateWithMaxMinutes`, `total_minutes`.`minutes` AS `totalMinutesRead` FROM (((((select `r`.`stSponsorId` AS `stSponsorId`,`r`.`dateRead` AS `dateRead`,sum(`r`.`minutes`) AS `minutes` from `readingLog` `r` where ((`r`.`dateRead` >= '2023-03-02') and (`r`.`dateRead` <= curdate())) group by `r`.`stSponsorId`,`r`.`dateRead`) `dailyMinutes` left join `students` `s` on((`dailyMinutes`.`stSponsorId` = `s`.`stSponsorId`))) left join `users` `u` on((`s`.`familyUserName` = `u`.`username`))) left join (select `r`.`stSponsorId` AS `stSponsorId`,max(`r`.`sum_minutes`) AS `maxMinutes`,`r`.`dateRead` AS `maxDate` from (select `r`.`stSponsorId` AS `stSponsorId`,`r`.`dateRead` AS `dateRead`,sum(`r`.`minutes`) AS `sum_minutes` from `readingLog` `r` where ((`r`.`dateRead` >= '2023-03-02') and (`r`.`dateRead` <= '2023-03-17')) group by `r`.`stSponsorId`,`r`.`dateRead`) `r` group by `r`.`stSponsorId`) `max_daily_minutes` on(((`dailyMinutes`.`stSponsorId` = `max_daily_minutes`.`stSponsorId`) and (`dailyMinutes`.`dateRead` = `max_daily_minutes`.`maxDate`)))) left join (select `readingLog`.`stSponsorId` AS `stSponsorId`,sum(`readingLog`.`minutes`) AS `minutes` from `readingLog` where (`readingLog`.`dateRead` <= '2023-03-17') group by `readingLog`.`stSponsorId`) `total_minutes` on((`dailyMinutes`.`stSponsorId` = `total_minutes`.`stSponsorId`))) GROUP BY `dailyMinutes`.`stSponsorId` ORDER BY `totalMinutesRead` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `AvgMinReadPerDay`
--
DROP TABLE IF EXISTS `AvgMinReadPerDay`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `AvgMinReadPerDay`  AS SELECT `s`.`stSponsorId` AS `stSponsorId`, cast(avg(`dailyMinutes`.`minutes`) as signed) AS `avgMinutesPerDay`, `s`.`stFirstName` AS `stFirstName`, `s`.`stLastName` AS `stLastName`, `u`.`email` AS `email` FROM (((select `r`.`stSponsorId` AS `stSponsorId`,`r`.`dateRead` AS `dateRead`,sum(`r`.`minutes`) AS `minutes` from `readingLog` `r` group by `r`.`stSponsorId`,`r`.`dateRead`) `dailyMinutes` left join `students` `s` on((`dailyMinutes`.`stSponsorId` = `s`.`stSponsorId`))) left join `users` `u` on((`s`.`familyUserName` = `u`.`username`))) GROUP BY `s`.`stSponsorId` ORDER BY `avgMinutesPerDay` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `duplicate_pledges`
--
DROP TABLE IF EXISTS `duplicate_pledges`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `duplicate_pledges`  AS SELECT `pledgeSums`.`stSponsorId` AS `stSponsorId`, count(`pledgeSums`.`stSponsorId`) AS `COUNTstSponsorId`, `pledgeSums`.`studentFirstName` AS `studentFirstName`, count(`pledgeSums`.`studentFirstName`) AS `COUNTstudentFirstName`, `pledgeSums`.`studentLastName` AS `studentLastName`, count(`pledgeSums`.`studentLastName`) AS `COUNTstudentLastName`, `pledgeSums`.`amt` AS `amt`, count(`pledgeSums`.`amt`) AS `COUNTamt`, `pledgeSums`.`unit` AS `unit`, count(`pledgeSums`.`unit`) AS `COUNTunit`, `pledgeSums`.`spUserName` AS `spUserName`, count(`pledgeSums`.`spUserName`) AS `COUNTspUserName`, `pledgeSums`.`pledgeTotal` AS `pledgeTotal` FROM `pledgeSums` GROUP BY `pledgeSums`.`stSponsorId`, `pledgeSums`.`studentFirstName`, `pledgeSums`.`studentLastName`, `pledgeSums`.`amt`, `pledgeSums`.`unit`, `pledgeSums`.`spUserName` HAVING ((count(`pledgeSums`.`stSponsorId`) > 1) AND (count(`pledgeSums`.`studentFirstName`) > 1) AND (count(`pledgeSums`.`studentLastName`) > 1) AND (count(`pledgeSums`.`amt`) > 1) AND (count(`pledgeSums`.`unit`) > 1) AND (count(`pledgeSums`.`spUserName`) > 1)) ;

-- --------------------------------------------------------

--
-- Structure for view `kitchenSink`
--
DROP TABLE IF EXISTS `kitchenSink`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `kitchenSink`  AS SELECT `p`.`pledgeId` AS `pledgeId`, `p`.`amt` AS `pledgeAmount`, `p`.`unit` AS `pledgeUnit`, `p`.`amtPaid` AS `amountPaid`, `s`.`stUserName` AS `studentUserName`, `s`.`readingGoal` AS `readingGoal`, `idk`.`minutesRead` AS `minutesRead`, `s`.`stFirstName` AS `studentFirstName`, `s`.`stLastName` AS `studentLastName`, `s`.`teacher` AS `teacher`, `s`.`grade` AS `grade`, `s`.`stSponsorId` AS `studentSponsorId`, `s`.`familyUserName` AS `parentUserName`, `u`.`email` AS `familyEmail`, `p`.`spUserName` AS `spUserName`, `p`.`pledgeTotal` AS `pledgeTotal`, `u2`.`email` AS `sponsorEmail` FROM (((`pledgeSumsPaid` `p` left join (`students` `s` left join `users` `u` on((`s`.`familyUserName` = `u`.`username`))) on((`s`.`stSponsorId` = `p`.`stSponsorId`))) left join `users` `u2` on((`p`.`spUserName` = `u2`.`username`))) left join (select sum(`rL`.`minutes`) AS `minutesRead`,`rL`.`minutes` AS `minutes`,`rL`.`stSponsorId` AS `stSponsorId` from `readingLog` `rL` group by `rL`.`stSponsorId`) `idk` on((`p`.`stSponsorId` = `idk`.`stSponsorId`))) ORDER BY `p`.`amtPaid` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `LogOver18Hrs`
--
DROP TABLE IF EXISTS `LogOver18Hrs`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `LogOver18Hrs`  AS SELECT `s`.`stFirstName` AS `firstName`, `s`.`stLastName` AS `lastName`, `s`.`stSponsorId` AS `sSponsorId`, `rL`.`stSponsorId` AS `rLSponsorId`, `rL`.`minutes` AS `minutes`, `rL`.`dateRead` AS `dateRead`, `rL`.`dateEntered` AS `dateEntered`, `trL`.`totalread` AS `totalread` FROM ((`readingLog` `rL` left join `students` `s` on((`s`.`stSponsorId` = `rL`.`stSponsorId`))) left join (select `rL`.`stSponsorId` AS `stSponsorId`,sum(`rL`.`minutes`) AS `totalread` from `readingLog` `rL` group by `rL`.`stSponsorId`) `trL` on((`trL`.`stSponsorId` = `s`.`stSponsorId`))) HAVING (`trL`.`totalread` > 1080) ;

-- --------------------------------------------------------

--
-- Structure for view `MoreThanFiveHrsOneDayLogs`
--
DROP TABLE IF EXISTS `MoreThanFiveHrsOneDayLogs`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `MoreThanFiveHrsOneDayLogs`  AS SELECT `ReadingLogSummedbyStudentDate`.`stSponsorId` AS `stSponsorId`, `ReadingLogSummedbyStudentDate`.`dateRead` AS `dateRead`, `ReadingLogSummedbyStudentDate`.`stFirstName` AS `stFirstName`, `ReadingLogSummedbyStudentDate`.`stLastName` AS `stLastName`, `ReadingLogSummedbyStudentDate`.`email` AS `email`, `ReadingLogSummedbyStudentDate`.`total_minutes` AS `total_minutes` FROM `ReadingLogSummedbyStudentDate` WHERE (`ReadingLogSummedbyStudentDate`.`total_minutes` > 300) ORDER BY `ReadingLogSummedbyStudentDate`.`total_minutes` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `pledgeSums`
--
DROP TABLE IF EXISTS `pledgeSums`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `pledgeSums`  AS SELECT `p`.`stSponsorId` AS `stSponsorId`, `students`.`stFirstName` AS `studentFirstName`, `students`.`stLastName` AS `studentLastName`, `p`.`amt` AS `amt`, `p`.`unit` AS `unit`, `p`.`spUserName` AS `spUserName`, `p`.`pledgeId` AS `pledgeId`, (case when (`p`.`unit` = 'by-the-minute') then (`p`.`amt` * `RLSums`.`readTotal`) else `p`.`amt` end) AS `pledgeTotal` FROM ((`pledges` `p` left join `RLSums` on((`p`.`stSponsorId` = `RLSums`.`stSponsorId`))) left join `students` on((`p`.`stSponsorId` = `students`.`stSponsorId`))) ;

-- --------------------------------------------------------

--
-- Structure for view `pledgeSumsPaid`
--
DROP TABLE IF EXISTS `pledgeSumsPaid`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `pledgeSumsPaid`  AS SELECT `p`.`spUserName` AS `spUserName`, `u`.`email` AS `sponsorEmail`, `p`.`stSponsorId` AS `stSponsorId`, `students`.`stFirstName` AS `studentFirstName`, `students`.`stLastName` AS `studentLastName`, `p`.`amt` AS `amt`, `p`.`unit` AS `unit`, (case when (`p`.`unit` = 'by-the-minute') then (`p`.`amt` * `RLSums`.`readTotal`) else `p`.`amt` end) AS `pledgeTotal`, `p`.`pledgeId` AS `pledgeId`, (`p`.`paid` / 100) AS `amtPaid` FROM (((`pledges` `p` left join `RLSums` on((`p`.`stSponsorId` = `RLSums`.`stSponsorId`))) left join `students` on((`p`.`stSponsorId` = `students`.`stSponsorId`))) left join `users` `u` on((`p`.`spUserName` = `u`.`username`))) ;

-- --------------------------------------------------------

--
-- Structure for view `ReadingLogSummedbyStudentDate`
--
DROP TABLE IF EXISTS `ReadingLogSummedbyStudentDate`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `ReadingLogSummedbyStudentDate`  AS SELECT `r`.`stSponsorId` AS `stSponsorId`, `r`.`dateRead` AS `dateRead`, `s`.`stFirstName` AS `stFirstName`, `s`.`stLastName` AS `stLastName`, `u`.`email` AS `email`, sum(`r`.`minutes`) AS `total_minutes` FROM ((`readingLog` `r` left join `students` `s` on((`r`.`stSponsorId` = `s`.`stSponsorId`))) left join `users` `u` on((`s`.`familyUserName` = `u`.`username`))) GROUP BY `r`.`stSponsorId`, `r`.`dateRead` ;

-- --------------------------------------------------------

--
-- Structure for view `Readover18hrs`
--
DROP TABLE IF EXISTS `Readover18hrs`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `Readover18hrs`  AS SELECT `s`.`stFirstName` AS `firstName`, `s`.`stLastName` AS `lastName`, `trL`.`minutes` AS `minutes`, `trL`.`dateRead` AS `dateRead`, `trL`.`dateEntered` AS `dateEntered`, `trL`.`totalread` AS `totalRead` FROM ((select `rL`.`minutes` AS `minutes`,`rL`.`dateRead` AS `dateRead`,`rL`.`dateEntered` AS `dateEntered`,`rL`.`stSponsorId` AS `stSponsorId`,sum(`rL`.`minutes`) AS `totalread` from `readingLog` `rL` group by `rL`.`stSponsorId`) `trL` left join `students` `s` on((`trL`.`stSponsorId` = `s`.`stSponsorId`))) HAVING (`trL`.`totalread` > 1080) ;

-- --------------------------------------------------------

--
-- Structure for view `RLSums`
--
DROP TABLE IF EXISTS `RLSums`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `RLSums`  AS SELECT `rL`.`stSponsorId` AS `stSponsorId`, sum(`rL`.`minutes`) AS `readTotal`, sum((case when (cast(`rL`.`dateRead` as date) >= (now() - interval 1 day)) then `rL`.`minutes` else 0 end)) AS `readToday`, sum((case when ((cast(`rL`.`dateRead` as date) >= (now() - interval 2 day)) and (cast(`rL`.`dateRead` as date) <= (now() - interval 1 day))) then `rL`.`minutes` else 0 end)) AS `readYest`, sum((case when (cast(`rL`.`dateRead` as date) > (now() - interval 7 day)) then `rL`.`minutes` else 0 end)) AS `readWeek` FROM `readingLog` AS `rL` GROUP BY `rL`.`stSponsorId` ;

-- --------------------------------------------------------

--
-- Structure for view `sponsorTotals`
--
DROP TABLE IF EXISTS `sponsorTotals`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `sponsorTotals`  AS SELECT `p`.`spUserName` AS `sponsorUserName`, sum(`p`.`pledgeTotal`) AS `totalMoneyPledged`, (sum(`p`.`amtPaid`) / 100) AS `amountPaid`, (sum(`p`.`pledgeTotal`) - (sum(`p`.`amtPaid`) / 100)) AS `totalUnpaid`, count(distinct `p`.`stSponsorId`) AS `numStudentsSponsored`, count(`p`.`pledgeId`) AS `numPledgesMade`, `p`.`sponsorEmail` AS `sponsorEmail` FROM `pledgeSumsPaid` AS `p` GROUP BY `p`.`spUserName` ;

-- --------------------------------------------------------

--
-- Structure for view `stPlus`
--
DROP TABLE IF EXISTS `stPlus`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `stPlus`  AS SELECT `s`.`stUserName` AS `studentUserName`, `s`.`readingGoal` AS `readingGoal`, `s`.`stFirstName` AS `studentFirstName`, `s`.`stLastName` AS `studentLastName`, `s`.`teacher` AS `teacher`, `s`.`grade` AS `grade`, `s`.`stSponsorId` AS `studentSponsorId`, `s`.`familyUserName` AS `parentUserName`, `u`.`email` AS `familyEmail` FROM (`students` `s` left join `users` `u` on((`s`.`familyUserName` = `u`.`username`))) ;

-- --------------------------------------------------------

--
-- Structure for view `stPlusPledgeTotals`
--
DROP TABLE IF EXISTS `stPlusPledgeTotals`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `stPlusPledgeTotals`  AS SELECT `s`.`stUserName` AS `studentUserName`, `s`.`readingGoal` AS `readingGoal`, `s`.`stFirstName` AS `studentFirstName`, `s`.`stLastName` AS `studentLastName`, `s`.`teacher` AS `teacher`, `s`.`grade` AS `grade`, `s`.`stSponsorId` AS `studentSponsorId`, `s`.`familyUserName` AS `parentUserName`, `u`.`email` AS `familyEmail`, `p`.`spUserName` AS `spUserName`, `p`.`pledgeTotal` AS `pledgeTotal` FROM ((`students` `s` left join `users` `u` on((`s`.`familyUserName` = `u`.`username`))) left join `pledgeSums` `p` on((`s`.`stSponsorId` = `p`.`stSponsorId`))) ORDER BY `s`.`stLastName` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `stPlusReadEmailAll`
--
DROP TABLE IF EXISTS `stPlusReadEmailAll`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `stPlusReadEmailAll`  AS SELECT `students`.`id` AS `id`, `students`.`stUserName` AS `stUserName`, `students`.`readingGoal` AS `readingGoal`, `students`.`stFirstName` AS `stFirstName`, `students`.`stLastName` AS `stLastName`, `students`.`teacher` AS `teacher`, `students`.`grade` AS `grade`, `students`.`stSponsorId` AS `stSponsorId`, `students`.`familyUserName` AS `familyUserName`, sum(`rL`.`minutes`) AS `totalMinRead`, `u`.`email` AS `email` FROM ((`students` left join `readingLog` `rL` on((`students`.`stSponsorId` = `rL`.`stSponsorId`))) left join `users` `u` on((`u`.`username` = `students`.`stUserName`))) GROUP BY `students`.`stSponsorId` ORDER BY `totalMinRead` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `studentReading`
--
DROP TABLE IF EXISTS `studentReading`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `studentReading`  AS SELECT sum(`rL`.`minutes`) AS `totalRead`, `s`.`stFirstName` AS `firstName`, `s`.`stLastName` AS `lastName`, `s`.`teacher` AS `class`, `s`.`grade` AS `grade` FROM (`readingLog` `rL` join `students` `s` on((`rL`.`stSponsorId` = `s`.`stSponsorId`))) GROUP BY `rL`.`stSponsorId` ;

-- --------------------------------------------------------

--
-- Structure for view `studentReadingInclThoseNotLoggingReading`
--
DROP TABLE IF EXISTS `studentReadingInclThoseNotLoggingReading`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `studentReadingInclThoseNotLoggingReading`  AS SELECT `students`.`id` AS `id`, `students`.`stUserName` AS `stUserName`, `students`.`readingGoal` AS `readingGoal`, `students`.`stFirstName` AS `stFirstName`, `students`.`stLastName` AS `stLastName`, `students`.`teacher` AS `teacher`, `students`.`grade` AS `grade`, `students`.`stSponsorId` AS `stSponsorId`, `students`.`familyUserName` AS `familyUserName`, sum(`rL`.`minutes`) AS `SUM-rL-minutes` FROM (`students` left join `readingLog` `rL` on((`students`.`stSponsorId` = `rL`.`stSponsorId`))) GROUP BY `students`.`stSponsorId` ;

-- --------------------------------------------------------

--
-- Structure for view `TotalsByClass`
--
DROP TABLE IF EXISTS `TotalsByClass`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `TotalsByClass`  AS SELECT `studentReading`.`class` AS `class`, sum(`studentReading`.`totalRead`) AS `SUM(totalRead)` FROM `studentReading` GROUP BY `studentReading`.`class` ;

-- --------------------------------------------------------

--
-- Structure for view `TotalsByClassGrade`
--
DROP TABLE IF EXISTS `TotalsByClassGrade`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `TotalsByClassGrade`  AS SELECT `studentReading`.`class` AS `class`, `studentReading`.`grade` AS `grade`, sum(`studentReading`.`totalRead`) AS `totalReadSum` FROM `studentReading` GROUP BY `studentReading`.`class` ;

-- --------------------------------------------------------

--
-- Structure for view `TotalsByGrade`
--
DROP TABLE IF EXISTS `TotalsByGrade`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `TotalsByGrade`  AS SELECT `studentReading`.`grade` AS `grade`, sum(`studentReading`.`totalRead`) AS `minRead` FROM `studentReading` GROUP BY `studentReading`.`grade` ;

-- --------------------------------------------------------

--
-- Structure for view `UnpaidSponsorsLastEmail`
--
DROP TABLE IF EXISTS `UnpaidSponsorsLastEmail`;

CREATE ALGORITHM=UNDEFINED DEFINER=`sjrt6xbyjpnxw`@`localhost` SQL SECURITY DEFINER VIEW `UnpaidSponsorsLastEmail`  AS SELECT `les`.`sent_id` AS `sent_id`, `les`.`spUserName` AS `spUserName`, `les`.`dateSent` AS `dateSent` FROM ((select `lastEmailSent`.`spUserName` AS `spUserName`,max(`lastEmailSent`.`dateSent`) AS `maxDateSent` from `lastEmailSent` group by `lastEmailSent`.`spUserName`) `maxLes` join `lastEmailSent` `les` on(((`maxLes`.`spUserName` = `les`.`spUserName`) and (`maxLes`.`maxDateSent` = `les`.`dateSent`)))) WHERE `les`.`spUserName` in (select distinct `kitchenSink`.`spUserName` from `kitchenSink` where (`kitchenSink`.`amountPaid` < `kitchenSink`.`pledgeTotal`)) ORDER BY `les`.`dateSent` ASC ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
