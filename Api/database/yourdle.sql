-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Máj 15. 22:52
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
('c8f48f08-b703-4e0a-b430-73dd8d637216', 'Star Wars', '931263cd-ae7f-4af3-8681-c16a4d6256ff', 1, 1, 1, 1, 1, 1);

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
('055b2232-f88a-41c7-84c5-1820a4ddc618', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Yoda', 'férfi', 66, 13, 'fehér', 'Ismeretlen', 900),
('40eece69-37f8-4db2-a6c9-c058bed121ef', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Han Solo', 'férfi', 180, 80, 'barna', 'Corellia', 66),
('42022ac1-9cac-40f2-a050-880950adcdd7', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Chewbacca', 'férfi', 230, 112, 'barna', 'Kashyyyk', 235),
('67beb53f-64b3-41ea-a74e-b0bdc3d0acc2', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Luke Skywalker', 'férfi', 172, 73, 'szőke', 'Tatooine', 53),
('6ecfff5f-4a1a-47dd-885c-7220fb590340', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'R2-D2', 'férfi', 108, 32, 'kopasz', 'Naboo', 67),
('905935d6-97a8-4ace-9bf8-060eec6a0e75', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Obi-Wan Kenobi', 'férfi', 179, 81, 'barna', 'Stewjon', 57),
('a02e5f70-803e-4597-af72-90293e982cc3', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Palpatine', 'férfi', 173, 75, 'fehér', 'Naboo', 117),
('c84a1084-eae6-4864-ad2c-c67c19cc1137', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Anakin Skywalker', 'férfi', 188, 85, 'szőke', 'Tatooine', 45),
('d3fe6c31-fc46-48cb-a69c-17c7bfe0fb9e', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Leia Orgona', 'nő', 155, 51, 'barna', 'Alderaan', 54),
('fa6a02e4-c302-41de-8422-46828136f552', 'c8f48f08-b703-4e0a-b430-73dd8d637216', ' C-3PO', 'férfi', 177, 85, 'kopasz', 'Tatooine', 67);

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
('0398005a-ef47-41e0-a973-08d96c41c960', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Leia Organa', 'Hercegnő és lázadó vezető'),
('0f2bbc1e-9c3f-44bb-a96a-992539b1bff9', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Chewbacca', 'Szőrös, magas '),
('112f4706-ca70-4dbc-8299-fa714e7725c1', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Han Solo', 'Laza, beképzelt, sármos csempész'),
('308a728b-ee3c-451a-ab14-b9b9fba65f63', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Yoda', 'Kicsi, zöld, öreg, nagy fülekkel'),
('340a5df1-9512-41fa-942c-84343e4d7e88', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'R2-D2', 'Kicsi, henger alakú asztromech droid'),
('356fdfec-909c-4997-bce3-d5c37a8838c9', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'C-3PO', 'Folyékonyan beszél több millió nyelvet'),
('3ed0ac82-a9c8-459d-a93e-687d9a8023ae', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Obi-Wan Kenobi', 'Kedveli a magaslatokat'),
('40cc78a8-160e-460d-8369-c876d4137159', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Luke Skywalker', 'Idealista, naiv, de bátor'),
('73ab6fde-3c98-493e-9824-efc6a8ff8529', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Palpatine', 'Ráncos, sápadt arc, sötét köpeny'),
('cf836972-98e2-4e88-8f69-969ddf292032', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Anakin Skywalker', 'Volt Jedi, aki a Sötét oldalra állt');

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
('30fd06b5-017f-4994-baf9-36f07c980174', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Anakin Skywalker', '😡', '🖤', '🫱'),
('49cab903-5b8d-477b-9e8e-8a5aef397ade', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Chewbacca', '🧸', '🐻', '🐵'),
('61631390-1338-4168-af1f-eeffacd0789d', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Yoda', '🟩', '👴', '🍃'),
('64be9f85-37e5-4f58-8818-085c1b7aac16', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Palpatine', '👴', '⚡', '🧙‍♂️'),
('86db74eb-f8f9-48b9-8e8c-05fc82348c18', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Luke Skywalker', '👦', '⭐', '🚶'),
('b8e71cf9-026e-4899-b2b6-912d93eced30', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Obi-Wan Kenobi', '🧔‍♂', '🧘', '⛰️'),
('c7c3166e-55b6-4196-a57e-52f73ef3cf63', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Han Solo', '😎', '🚀', '🔫'),
('d28daada-a7aa-4f73-9582-af7c520e4ebb', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'C-3PO', '🥇', '🤖', '🤓'),
('deeb543f-410d-4de3-8dc9-e868d62cbdd7', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'R2-D2', '🤖', '📢', '🌀'),
('e6aab1c6-47b9-41b7-ac27-ccec0501b2b7', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Leia Organa', '👩‍🦰', '👑', '👨‍❤️‍👨');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `games`
--

CREATE TABLE `games` (
  `id` varchar(40) NOT NULL,
  `categoryID` varchar(40) NOT NULL,
  `player1ID` varchar(40) NOT NULL,
  `player2ID` varchar(40) NOT NULL,
  `winnerID` varchar(40) DEFAULT NULL,
  `finishedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `games`
--

INSERT INTO `games` (`id`, `categoryID`, `player1ID`, `player2ID`, `winnerID`, `finishedAt`) VALUES
('53d56cd3-6571-42ab-bc11-bb83a5aa29f0', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'bc0d5bbb-e885-46e6-9bb8-59e6ce8c48a6', '931263cd-ae7f-4af3-8681-c16a4d6256ff', '931263cd-ae7f-4af3-8681-c16a4d6256ff', '2025-05-15'),
('6d922002-6614-4710-9450-429ca1d5d7f6', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'ee7a3ea8-29e7-45c5-9f89-87c41872d217', 'bc0d5bbb-e885-46e6-9bb8-59e6ce8c48a6', 'bc0d5bbb-e885-46e6-9bb8-59e6ce8c48a6', '2025-05-15'),
('7dc05f07-c34c-4c02-bdb5-b0b75670fc45', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'bc0d5bbb-e885-46e6-9bb8-59e6ce8c48a6', '931263cd-ae7f-4af3-8681-c16a4d6256ff', 'bc0d5bbb-e885-46e6-9bb8-59e6ce8c48a6', '2025-05-15'),
('94067394-46bc-4c36-b605-927639e8f4d4', 'c8f48f08-b703-4e0a-b430-73dd8d637216', '931263cd-ae7f-4af3-8681-c16a4d6256ff', 'bc0d5bbb-e885-46e6-9bb8-59e6ce8c48a6', '931263cd-ae7f-4af3-8681-c16a4d6256ff', '2025-05-15'),
('d9f0eded-baf3-4c09-b9ca-e8ffd543799e', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'bc0d5bbb-e885-46e6-9bb8-59e6ce8c48a6', 'ee7a3ea8-29e7-45c5-9f89-87c41872d217', NULL, '2025-05-15');

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
('3475e9da-7802-42b2-93fb-150238cb8be6', '931263cd-ae7f-4af3-8681-c16a4d6256ff', 2, 3, 1),
('42dbe012-8eda-4424-87c4-000c0d6e9048', 'ee7a3ea8-29e7-45c5-9f89-87c41872d217', 0, 1, 1),
('afagasgasgasgas', '05d30dda-6021-47fc-b944-7f0508d3de43', 40, 21, 10),
('afsafsafsafsaf', '79dd2b70-259b-48dc-bf8e-49f872df6770', 10, 2, 4),
('afsafsafsafsafasfassfaf', '1fabc600-f55e-4348-9cfa-3c0b52227055', 90, 75, 53),
('cccccccccccc', '1d9c9c5f-a535-4bc8-a8a3-a23d1617f779', 3, 8, 21),
('d0ec7a8a-72d4-4843-8a7f-e6dc95abf66e', 'bc0d5bbb-e885-46e6-9bb8-59e6ce8c48a6', 4, 2, 2);

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
('1f781e99-eb2d-4f10-9248-8060fcc87a83', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Obi-Wan Kenobi', '32dd069463269e6e7660b23fbcc696ca:44a564e7c49e5f1cb63dcbb9dbe82a3efd613a3f5904dda408bbb64573b0488d1c8e33af6cad7979aa9fd212d4cfebc3abff5614dee9a782bbd8be32c7a608dd'),
('246e236e-5fe3-4419-a31b-8bea45a5bfe6', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Leia Organa', '08ebb7682db14013e679ea25c2c932f2:646f1e777882e4b896e3688adc94a3f23605980e96899a950f90edee9de18c6ce331d054b6d7b637f0577d513ced9e4c01a707cde2411221fe90358da769b134cd5223bc2aac8a20d996ee0e65c58e3e'),
('36318528-5636-4055-b50f-8d56873c7621', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Palpatine', '90d5ca1f3d1489d43d66640eb3c0aac5:d50e5f70ea2248e4b2c5cfe00a87c324e61725b62f99f56f98c9e6a4697fe945eb90167fc896e3e2edac803cddd4127229732ea1a85d78ed4c6b34c2a5c13e2053aff65a6fa7a7a95cd1e98258d40672'),
('3da12e2a-cff8-4059-9841-dba64cb08869', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Chewbacca', 'cee87918b8119f32f7816fbe50f981a4:882226eeaceb609f649309ecb8d6e93d10aa4daa49eb06515e44a3abe1e1b659427391e886862c7cce60ced3948cfab906f45a563420b2c40ca0617f68a75f93'),
('47030753-5965-4e20-aa3b-1b5e00117824', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Yoda', '886057a4a44b4a0bedf3c4a88f3e10ee:61e2a1d46080abe44740efba88955874a218f0d7ebd59321bd229caf89677adeeeffb75b3fb2144d84901ef7478e8eac6e16af698fc52ae8d6883ee891fc277b'),
('b6ae864b-8630-43fc-b0c5-130e6b6fbdc0', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Han Solo', '3878f85111736af21c3af25d6c21c7d8:995990f3119b84830343f48b2bb122c720eed7b7d4b4e7300c800080529173617d9d9141971fc6bc0f4f1fc70667e2a4316754e976fa98c6ca27f889dd82793f'),
('c4d104e9-7d92-4fa6-8f66-5e2381ecc132', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'R2-D2', '0c3e956998d97d4e081252d7bb76207b:fb7b1f4c120a82e229a73bfb689e491c1b72b0619524eca9d0addad7e04dbcad75b652549d896bbf5c73a3de3a15442549e4947ccc4041770fc8ad085a28e429'),
('db0efbef-c356-4a87-aa63-577150e4a4cb', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Anakin Skywalker', '8bb3bdb7a0dfbf4298323379cb0ef8cb:c9b84a2143e1d362dbe22dec7abc9280a2825cae9bc8687cb633081015368a7fa4a1e7c1a9d92be6cd3916054e90df5fa3d500079cc4bbe222f9404d570dcf3fd15778448250235db5bebe59a863fc8c'),
('e52a54b7-9a3c-4388-9458-7d87567dba9a', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Luke Skywalker', 'd32b1fd4e80ceb3330ab8f87a0e1386e:1bd4cab5c115bd78f718f5c7fdf024e7e507c70df02ca82bb4b6f3e34a4e387dc48ef198f9c3808b8168f927c30cec1a92e83a45e14381b7b93cbc98aaaf14027037248245101b421e31f884024531dc'),
('ff1750b0-f259-4932-a743-b8a58127e00f', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'C-3PO', 'b291968b6bd9bb81e7d64ab133a1f457:6df57b34af8d003afeb1f3cb5ef5028d221612fc97c97a75ecc14426b692e68a1257a03e539d2c2eeb8f7b67153c817fed5cb095d9bf1bddd6ac4fb960912a17');

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
('02478d42-0ec4-4ee5-bd17-ac58e1fc1154', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Luke Skywalker', 'Én egy jedi vagyok, mint az apám előttem'),
('1b1a0123-8a8b-4f81-afac-fb1bc86fc879', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'R2-D2', 'pipupipipu'),
('716e7732-5bfc-41f7-ae79-8a42b886cf59', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Palpatine', 'Korlátlan hatalom'),
('7d4195df-2aa7-46c7-bd68-e0b763ac7af5', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Chewbacca', 'GRUUUUUUU'),
('bc7e3af2-8954-4384-957c-9c06cac2ad30', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Leia Organa', 'Segíts, Obi-Wan Kenobi, te vagy az egyetlen reményem'),
('c6988385-e52d-43b6-b858-68520efe566f', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Yoda', 'Tedd, vagy ne tedd. Nincs próbálkozás'),
('e7d6245d-126b-474c-8d18-1d2f25f78f3a', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Han Solo', 'Tudom'),
('ea6b2c7d-12ff-422e-95b8-d6e3ddf831dc', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Anakin Skywalker', 'Én vagyok az apád'),
('f050c1cd-15e8-4435-b7f5-d573797e08b9', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'C-3PO', 'Valószínűtlen, hogy túléljük, uram'),
('f4134a0f-3891-49ad-bd00-5750435ec4e2', 'c8f48f08-b703-4e0a-b430-73dd8d637216', 'Obi-Wan Kenobi', 'Te voltál a kiválasztott');

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
  `profilePic` text DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `token_expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `passwd`, `role`, `profilePic`, `reset_token`, `token_expires_at`) VALUES
('05d30dda-6021-47fc-b944-7f0508d3de43', 'Béla3', 'bela@gmail.com', '$2b$10$V7CBUXaQhKVtUuQuIOAtbO4Vi2.lxLdd3nm0ZgJOxWdCU/ktGX5dC', 'user', NULL, NULL, NULL),
('1d9c9c5f-a535-4bc8-a8a3-a23d1617f779', 'Teszt Erik', 'teszterik@gmail.com', '$2b$10$ZxsW6QVvX.yyT/AQ41BDue9IyrCsVCcylmL6FlFdgR6rp8YBsKEjy', 'user', NULL, NULL, NULL),
('1fabc600-f55e-4348-9cfa-3c0b52227055', 'Teszt Elek', 'tesztelek@gmail.com', '$2b$10$UHwwaNG21dhq1rqX3UHNYObgdMJ13QBm.kqNtBl9vViX5m/L0kbPi', 'user', 'c5942363e3259c56210c654db7aadfc6:220f8f086e819e2971e3a198b99e39da82ae3f8a343a227aca12a775cbb2da902d9c48a3a63c2b1438a98618ca74ad026d184240e5c5d9de6cc98653a7d0ded8', NULL, NULL),
('39ca2f24-120d-4ce5-99a7-c74ccafde2f7', 'f', 'f@gmail.com', '$2b$10$W3xfFC0PPY1vkcUsytMneewpc4/59ZP7Ptl.U/VkZJ3rDrlW2730i', 'user', NULL, NULL, NULL),
('79dd2b70-259b-48dc-bf8e-49f872df6770', 'admin', 'admin@gmail.com', '$2b$10$zUIG97njFyFgfL7eXerzqOJVlZ.1saSCBqBfiDZSC9YhJyKn5s0mO', 'admin', '47ba698e60bfdb0565c368cc32787265:3daf70544bab57463036d11f822b885ee06fa648d43f9afe5eb56c7223c11035ca2e87c42a3a44e516a269d1e53413aa6e14f24771f1a9715a9330327a384e53', NULL, NULL),
('931263cd-ae7f-4af3-8681-c16a4d6256ff', 'Jani', 'vargajanos@gmail.com', '$2b$10$DULda3TQo/SbsUaqGKw3OOktkcJ4DOPCP5X6kAeIqDtL9bWyRwUfi', 'user', NULL, NULL, NULL),
('bc0d5bbb-e885-46e6-9bb8-59e6ce8c48a6', 'aron', 'aronbartek@gmail.com', '$2b$10$YvIKNf2Eun4nIL4628Q94.Y2PsO9m3wRvt.SwRrREKa7Vjzi.sJc.', 'admin', '7bf388226699261b770415e2d04fcbd2:6d9681eb4589ed6632a4c7043e71947e8f15c8d6d61cdf917c40324e4c54fc6bccab8773a3dea07993cc9f6c12bdc9a0a92b04a66c14589483a25e3feb9d1052', 'null', '0000-00-00 00:00:00'),
('ee7a3ea8-29e7-45c5-9f89-87c41872d217', 'denes', 'denes@gmail.com', '$2b$10$H7Ki44s1hB/aG7CLITdBquI4v2xq4L7Hz4xvdJxUJHRWZR/xi6tme', 'user', '7f58eea7ae52f447a2bbdfe5fdbb7008:066fdc29e74ec144979106032cd1e14fb37c964a9817f221b15f8c055d0369a3ce1fe9df12bf21a8437d6a755e24dc0aab65b6dc84f64156aaa6f51ac44df118be872609c4ce30971a30c83ac427ccbbce144431e8cce3d96acf630e6928ac9f', NULL, NULL);

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
