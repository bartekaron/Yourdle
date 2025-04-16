-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 16. 11:55
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `yourdle`
--
CREATE DATABASE IF NOT EXISTS `yourdle` DEFAULT CHARACTER SET utf8 COLLATE utf8_hungarian_ci;
USE `yourdle`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

CREATE TABLE `categories` (
  `id` varchar(40) NOT NULL,
  `categoryName` varchar(40) NOT NULL,
  `userID` varchar(40) NOT NULL,
  `classic` tinyint(1) NOT NULL,
  `quote` tinyint(1) NOT NULL,
  `emoji` tinyint(1) NOT NULL,
  `picture` tinyint(1) NOT NULL,
  `description` tinyint(1) NOT NULL,
  `public` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`id`, `categoryName`, `userID`, `classic`, `quote`, `emoji`, `picture`, `description`, `public`) VALUES
('723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Ebbe van minden adat is tesztre', '1fabc600-f55e-4348-9cfa-3c0b52227055', 1, 1, 1, 1, 1, 1),
('asf', 'fiu', '05d30dda-6021-47fc-b944-7f0508d3de43', 1, 1, 1, 0, 0, 1),
('f8ab88de-103c-4f88-b929-bdb46baf76ec', 'asfsafa', '1fabc600-f55e-4348-9cfa-3c0b52227055', 1, 0, 0, 0, 0, 1),
('safafcsacsadas', 'emoji', '79dd2b70-259b-48dc-bf8e-49f872df6770', 0, 0, 1, 0, 0, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `classic`
--

CREATE TABLE `classic` (
  `id` varchar(40) NOT NULL,
  `categoryID` varchar(40) NOT NULL,
  `answer` varchar(40) NOT NULL,
  `gender` varchar(40) NOT NULL,
  `height` int(11) NOT NULL,
  `weight` int(11) NOT NULL,
  `hairColor` varchar(40) NOT NULL,
  `address` varchar(40) NOT NULL,
  `age` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `classic`
--

INSERT INTO `classic` (`id`, `categoryID`, `answer`, `gender`, `height`, `weight`, `hairColor`, `address`, `age`) VALUES
('359ec28e-7b7a-4e17-a396-08b3ed8c629c', 'f8ab88de-103c-4f88-b929-bdb46baf76ec', 'afsaf', '2', 2, 2, '2', '2', 2),
('4159d1f8-ad9b-41ef-9c2b-15e8d73f5ce8', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Csoki', 'férfi', 176, 67, 'szőke', 'Föld', 20),
('7f204175-0f54-4e3f-bc1b-f33ce55d4ab4', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Balázs', 'férfi', 169, 67, 'fekete', 'Föld', 19),
('84e3008e-bf4f-4920-8128-a3dd8e4db86f', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Áron', 'nő', 179, 76, 'barna', 'Háromnyúl utca 51', 19),
('a029ec36-dfd0-4494-8489-d7c01bedf825', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Konrád', 'férfi', 186, 96, 'barna', 'Hercegszántó', 19),
('ad', 'asf', 'faf', 'f', 2, 2, '3', '3', 34);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `description`
--

CREATE TABLE `description` (
  `id` varchar(40) NOT NULL,
  `categoryID` varchar(40) NOT NULL,
  `answer` varchar(40) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `description`
--

INSERT INTO `description` (`id`, `categoryID`, `answer`, `description`) VALUES
('8d07184b-f410-4393-b477-e43bd3c2a7d7', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Áron', 'Lolmester37'),
('9e64087f-0fad-499e-96db-d1534bdd0b8b', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Konrád', 'Konrád'),
('a9d1c3b7-99dc-4743-b927-773b5a2c2717', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Csoki', 'csoki'),
('e752c6ee-cb88-46bf-9edf-62b0b04c7b65', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Balázs', 'kicsi');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `emoji`
--

CREATE TABLE `emoji` (
  `id` varchar(40) NOT NULL,
  `categoryID` varchar(40) NOT NULL,
  `answer` varchar(40) NOT NULL,
  `firstEmoji` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `secondEmoji` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `thirdEmoji` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `emoji`
--

INSERT INTO `emoji` (`id`, `categoryID`, `answer`, `firstEmoji`, `secondEmoji`, `thirdEmoji`) VALUES
('10479141-43ae-45ab-bf3a-ef705d22522d', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Áron', '🐒', '👨‍❤️‍💋‍👨', '👾'),
('123213asdsad', 'safafcsacsadas', 'Balázs', '👮‍♂️', '🏋️‍♂️', '🙌'),
('123321', 'safafcsacsadas', 'Dudás', '👩', '👩‍🦱', '👳‍♂️'),
('1df83690-e201-4332-aaf6-667cf640648f', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Csoki', '👄', '👋', '🤓'),
('4f612d4a-b2a3-4887-abff-1769a5b14f3b', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Konrád', '🤒', '🖕', '😅'),
('5d616d97-5241-4024-b3a3-1204f4c1cffc', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Balázs', '🧛', '😷', '👿'),
('kjhkjhk', 'safafcsacsadas', 'Áron', '🏃‍♀️', '🚶‍♂️', '🖖'),
('ljlkjhmhhmg', 'safafcsacsadas', 'Csoki', '💁‍♂️', '🤛', '🤜');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `games`
--

CREATE TABLE `games` (
  `id` varchar(40) NOT NULL,
  `categoryID` varchar(40) NOT NULL,
  `player1ID` varchar(40) NOT NULL,
  `player2ID` varchar(40) NOT NULL,
  `winnerID` varchar(40) NOT NULL,
  `finishedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `games`
--

INSERT INTO `games` (`id`, `categoryID`, `player1ID`, `player2ID`, `winnerID`, `finishedAt`) VALUES
('faccsasc', 'asf', '1d9c9c5f-a535-4bc8-a8a3-a23d1617f779', '1fabc600-f55e-4348-9cfa-3c0b52227055', '', '2025-02-18'),
('gafs', 'asf', '05d30dda-6021-47fc-b944-7f0508d3de43', '1fabc600-f55e-4348-9cfa-3c0b52227055', '05d30dda-6021-47fc-b944-7f0508d3de43', '2025-02-21'),
('vcac', 'asf', '79dd2b70-259b-48dc-bf8e-49f872df6770', '1fabc600-f55e-4348-9cfa-3c0b52227055', '1fabc600-f55e-4348-9cfa-3c0b52227055', '2025-02-21');

-- --------------------------------------------------------

--
-- A nézet helyettes szerkezete `games_vt`
-- (Lásd alább az aktuális nézetet)
--
CREATE TABLE `games_vt` (
`gameID` varchar(40)
,`categoryID` varchar(40)
,`categoryName` varchar(40)
,`player1ID` varchar(40)
,`player1Name` varchar(40)
,`player1ProfilePic` text
,`player2ID` varchar(40)
,`player2Name` varchar(40)
,`player2ProfilePic` text
,`winnerID` varchar(40)
,`winnerName` varchar(40)
,`finishedAt` date
);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `leaderboard`
--

CREATE TABLE `leaderboard` (
  `id` varchar(255) NOT NULL,
  `userID` varchar(255) NOT NULL,
  `wins` int(11) NOT NULL,
  `losses` int(11) NOT NULL,
  `draws` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `leaderboard`
--

INSERT INTO `leaderboard` (`id`, `userID`, `wins`, `losses`, `draws`) VALUES
('afagasgasgasgas', '05d30dda-6021-47fc-b944-7f0508d3de43', 40, 21, 10),
('afsafsafsafsaf', '79dd2b70-259b-48dc-bf8e-49f872df6770', 10, 2, 4),
('afsafsafsafsafasfassfaf', '1fabc600-f55e-4348-9cfa-3c0b52227055', 90, 75, 53),
('cccccccccccc', '1d9c9c5f-a535-4bc8-a8a3-a23d1617f779', 3, 8, 21);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `picture`
--

CREATE TABLE `picture` (
  `id` varchar(40) NOT NULL,
  `categoryID` varchar(40) NOT NULL,
  `answer` varchar(40) NOT NULL,
  `picture` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `picture`
--

INSERT INTO `picture` (`id`, `categoryID`, `answer`, `picture`) VALUES
('2723f35b-1161-468a-ab36-9e0fae241ee7', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Áron', 'd500bf38a7872c99f049cd50fa42832f:cdb6442ae83943f50df67d92be9f81be564b3ecf43083be9d5e0548c991cc131a88e8bd651e96c2ad05424e9fdb6a1db4f847a27f06268055b69c2d694685569'),
('5c67648a-0a76-45bf-92cf-3f53c9f64b6d', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Csaba', '2534d5ac22136979d2267f1748b4059b:78c274d3502b2cedbafa5d9e34905e7f68e876b5812750c8995f81471001d8eaaebd4fa47af3368393b9d76d7913c8b5fee9f7a2d8d3efa6ab8cd686edb190fb'),
('76d3129d-cfc1-49e3-97fa-ec1b0c5a8c96', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Konrád', '6e6079843fa9aca030ecbeeca5618a69:b54d2bc458238a0aab7a7d1e6c96d4dcdab2f6ecc5485324c6fa17c69efd4da364585153bb04a5d5152d4f0d88d3dacb8b0e75820c53ada2d6e69a7be89adb0f'),
('e911cf27-556b-4616-955f-5e9e7145eff9', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Csoki', 'b85d0e1b3a34e37e18aecf494c58a7ed:c50ba9af94cce05dea79d2a37e99ee277e123e7da175f05b34a290bd909a3ce0bcc4a1e54d141576b9cf71e7f4009f47e61cb2ad8451c6fa4fa64268dc8186f1');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `quote`
--

CREATE TABLE `quote` (
  `id` varchar(40) NOT NULL,
  `categoryID` varchar(40) NOT NULL,
  `answer` varchar(40) NOT NULL,
  `quote` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `quote`
--

INSERT INTO `quote` (`id`, `categoryID`, `answer`, `quote`) VALUES
('0de5894b-1c78-455f-83ce-488583300a58', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Csoki', 'Csoki'),
('2124', 'asf', 'ads', 'adda'),
('9e6a251d-72f6-4b4b-b070-ef4ac99969d1', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Konrád', 'Konrád'),
('e2a6e489-671b-4eef-9a6c-3bed0cff229a', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Balázs', 'Balázs'),
('ed2313ff-a333-4a14-82f5-3a42b0de2ab0', '723a8b26-ddc7-4559-9b64-dfbf5fe9c05e', 'Áron', 'Áron');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` varchar(40) NOT NULL,
  `name` varchar(40) NOT NULL,
  `email` varchar(40) NOT NULL,
  `passwd` varchar(100) NOT NULL,
  `role` varchar(15) NOT NULL,
  `profilePic` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `passwd`, `role`, `profilePic`) VALUES
('05d30dda-6021-47fc-b944-7f0508d3de43', 'Béla3', 'bela@gmail.com', '$2b$10$V7CBUXaQhKVtUuQuIOAtbO4Vi2.lxLdd3nm0ZgJOxWdCU/ktGX5dC', 'user', NULL),
('1d9c9c5f-a535-4bc8-a8a3-a23d1617f779', 'Teszt Erik', 'teszterik@gmail.com', '$2b$10$ZxsW6QVvX.yyT/AQ41BDue9IyrCsVCcylmL6FlFdgR6rp8YBsKEjy', 'user', NULL),
('1fabc600-f55e-4348-9cfa-3c0b52227055', 'Teszt Elek', 'tesztelek@gmail.com', '$2b$10$UHwwaNG21dhq1rqX3UHNYObgdMJ13QBm.kqNtBl9vViX5m/L0kbPi', 'user', 'c5942363e3259c56210c654db7aadfc6:220f8f086e819e2971e3a198b99e39da82ae3f8a343a227aca12a775cbb2da902d9c48a3a63c2b1438a98618ca74ad026d184240e5c5d9de6cc98653a7d0ded8'),
('39ca2f24-120d-4ce5-99a7-c74ccafde2f7', 'f', 'f@gmail.com', '$2b$10$W3xfFC0PPY1vkcUsytMneewpc4/59ZP7Ptl.U/VkZJ3rDrlW2730i', 'user', NULL),
('79dd2b70-259b-48dc-bf8e-49f872df6770', 'admin', 'admin@gmail.com', '$2b$10$zUIG97njFyFgfL7eXerzqOJVlZ.1saSCBqBfiDZSC9YhJyKn5s0mO', 'admin', '47ba698e60bfdb0565c368cc32787265:3daf70544bab57463036d11f822b885ee06fa648d43f9afe5eb56c7223c11035ca2e87c42a3a44e516a269d1e53413aa6e14f24771f1a9715a9330327a384e53');

-- --------------------------------------------------------

--
-- Nézet szerkezete `games_vt`
--
DROP TABLE IF EXISTS `games_vt`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `games_vt`  AS SELECT `g`.`id` AS `gameID`, `c`.`id` AS `categoryID`, `c`.`categoryName` AS `categoryName`, `u1`.`id` AS `player1ID`, `u1`.`name` AS `player1Name`, `u1`.`profilePic` AS `player1ProfilePic`, `u2`.`id` AS `player2ID`, `u2`.`name` AS `player2Name`, `u2`.`profilePic` AS `player2ProfilePic`, `w`.`id` AS `winnerID`, coalesce(`w`.`name`,'Döntetlen') AS `winnerName`, `g`.`finishedAt` AS `finishedAt` FROM ((((`games` `g` join `categories` `c` on(`g`.`categoryID` = `c`.`id`)) join `users` `u1` on(`g`.`player1ID` = `u1`.`id`)) join `users` `u2` on(`g`.`player2ID` = `u2`.`id`)) left join `users` `w` on(`g`.`winnerID` = `w`.`id`)) ;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `Categories_fk2` (`userID`);

--
-- A tábla indexei `classic`
--
ALTER TABLE `classic`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `Classic_fk1` (`categoryID`);

--
-- A tábla indexei `description`
--
ALTER TABLE `description`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `Description_fk1` (`categoryID`);

--
-- A tábla indexei `emoji`
--
ALTER TABLE `emoji`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `Emoji_fk1` (`categoryID`);

--
-- A tábla indexei `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `Games_fk1` (`categoryID`);

--
-- A tábla indexei `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD PRIMARY KEY (`id`,`userID`),
  ADD UNIQUE KEY `userID` (`userID`);

--
-- A tábla indexei `picture`
--
ALTER TABLE `picture`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `Picture_fk1` (`categoryID`);

--
-- A tábla indexei `quote`
--
ALTER TABLE `quote`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `Quote_fk1` (`categoryID`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `Categories_fk2` FOREIGN KEY (`userID`) REFERENCES `users` (`id`);

--
-- Megkötések a táblához `classic`
--
ALTER TABLE `classic`
  ADD CONSTRAINT `classic_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `description`
--
ALTER TABLE `description`
  ADD CONSTRAINT `description_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `emoji`
--
ALTER TABLE `emoji`
  ADD CONSTRAINT `emoji_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `games`
--
ALTER TABLE `games`
  ADD CONSTRAINT `games_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD CONSTRAINT `Leaderboard_fk1` FOREIGN KEY (`userID`) REFERENCES `users` (`id`);

--
-- Megkötések a táblához `picture`
--
ALTER TABLE `picture`
  ADD CONSTRAINT `picture_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `quote`
--
ALTER TABLE `quote`
  ADD CONSTRAINT `quote_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
