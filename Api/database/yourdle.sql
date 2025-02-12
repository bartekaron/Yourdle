-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Feb 12. 18:03
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
  `player1UserName` varchar(255) NOT NULL,
  `player2UserName` varchar(255) NOT NULL,
  `winnerUserName` varchar(255) NOT NULL,
  `finishedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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
  `passwd` varchar(40) NOT NULL,
  `profilePic` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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
