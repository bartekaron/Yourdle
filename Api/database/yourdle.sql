-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Feb 26. 18:37
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

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
  `desc` tinyint(1) NOT NULL,
  `public` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`id`, `categoryName`, `userID`, `classic`, `quote`, `emoji`, `picture`, `desc`, `public`) VALUES
('asf', 'fiu', '05d30dda-6021-47fc-b944-7f0508d3de43', 1, 1, 1, 0, 0, 1);

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
  `birthDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `description`
--

CREATE TABLE `description` (
  `id` varchar(40) NOT NULL,
  `categoryID` varchar(40) NOT NULL,
  `answer` varchar(40) NOT NULL,
  `desc` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `emoji`
--

CREATE TABLE `emoji` (
  `id` varchar(40) NOT NULL,
  `categoryID` varchar(40) NOT NULL,
  `answer` varchar(40) NOT NULL,
  `firstEmoji` varchar(255) NOT NULL,
  `secondEmoji` varchar(255) NOT NULL,
  `thirdEmoji` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `picture`
--

CREATE TABLE `picture` (
  `id` varchar(40) NOT NULL,
  `categoryID` varchar(40) NOT NULL,
  `answer` varchar(40) NOT NULL,
  `picture` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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
('1d9c9c5f-a535-4bc8-a8a3-a23d1617f779', 'Teszt Elek', 'tesztelek8@gmail.com', '$2b$10$ZxsW6QVvX.yyT/AQ41BDue9IyrCsVCcylmL6FlFdgR6rp8YBsKEjy', 'user', NULL),
('1fabc600-f55e-4348-9cfa-3c0b52227055', 'Teszt Elek', 'tesztelek6@gmail.com', '$2b$10$UHwwaNG21dhq1rqX3UHNYObgdMJ13QBm.kqNtBl9vViX5m/L0kbPi', 'user', NULL),
('79dd2b70-259b-48dc-bf8e-49f872df6770', 'Teszt Erik', 'tesztelek7@gmail.com', '$2b$10$zUIG97njFyFgfL7eXerzqOJVlZ.1saSCBqBfiDZSC9YhJyKn5s0mO', 'user', 'f49b46dda59b2c9946661142eeae8f11:a20f5824552bb0186ce6ee4d0782599a973756eab627fedb117706719c27f950fe2f40115bf96e87404c446a500dabafa1ec993b570c151da4cd8705f78ee2ce');

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
  ADD CONSTRAINT `Classic_fk1` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`id`);

--
-- Megkötések a táblához `description`
--
ALTER TABLE `description`
  ADD CONSTRAINT `Description_fk1` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`id`);

--
-- Megkötések a táblához `emoji`
--
ALTER TABLE `emoji`
  ADD CONSTRAINT `Emoji_fk1` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`id`);

--
-- Megkötések a táblához `games`
--
ALTER TABLE `games`
  ADD CONSTRAINT `Games_fk1` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`id`);

--
-- Megkötések a táblához `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD CONSTRAINT `Leaderboard_fk1` FOREIGN KEY (`userID`) REFERENCES `users` (`id`);

--
-- Megkötések a táblához `picture`
--
ALTER TABLE `picture`
  ADD CONSTRAINT `Picture_fk1` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`id`);

--
-- Megkötések a táblához `quote`
--
ALTER TABLE `quote`
  ADD CONSTRAINT `Quote_fk1` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
