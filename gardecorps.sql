-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 01 nov. 2025 à 19:37
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gardecorps`
--

-- --------------------------------------------------------

--
-- Structure de la table `cfg_ancrages`
--

DROP TABLE IF EXISTS `cfg_ancrages`;
CREATE TABLE IF NOT EXISTS `cfg_ancrages` (
  `id` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `label_ancrage` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `slug_ancrage` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cfg_ancrages_label_ancrage_unique` (`label_ancrage`),
  UNIQUE KEY `cfg_ancrages_slug_ancrage_unique` (`slug_ancrage`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cfg_ancrages`
--

INSERT INTO `cfg_ancrages` (`id`, `label_ancrage`, `slug_ancrage`) VALUES
(1, 'Goujon à frapper pour béton', 'goujon-a-frapper'),
(2, 'Tirefonds pour bois', 'tirefonds-pour-bois'),
(3, 'Tiges Filetées pour scellement Chimique', 'scellement-chimique'),
(4, 'Béton M10 x 100', 'beton-m10x100'),
(5, 'Bois Ø10 mm', 'vis-bois-10mm'),
(6, 'Aucun', 'aucun');

-- --------------------------------------------------------

--
-- Structure de la table `cfg_devis`
--

DROP TABLE IF EXISTS `cfg_devis`;
CREATE TABLE IF NOT EXISTS `cfg_devis` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `type_id` tinyint UNSIGNED NOT NULL,
  `finition_id` tinyint UNSIGNED DEFAULT NULL,
  `forme_id` tinyint UNSIGNED DEFAULT NULL,
  `pose_id` tinyint UNSIGNED DEFAULT NULL,
  `ancrage_id` tinyint UNSIGNED DEFAULT NULL,
  `verre_id` tinyint UNSIGNED DEFAULT NULL,
  `longueur_a` smallint UNSIGNED DEFAULT NULL,
  `longueur_b` smallint UNSIGNED DEFAULT NULL,
  `longueur_c` smallint UNSIGNED DEFAULT NULL,
  `hauteur` smallint UNSIGNED DEFAULT NULL,
  `angle` tinyint UNSIGNED DEFAULT NULL,
  `quantity` tinyint UNSIGNED NOT NULL DEFAULT '1',
  `id_status` tinyint UNSIGNED NOT NULL DEFAULT '1',
  `create_date` int UNSIGNED NOT NULL,
  `update_date` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cfg_devis_pose_id_foreign` (`pose_id`),
  KEY `cfg_devis_forme_id_foreign` (`forme_id`),
  KEY `cfg_devis_type_id_foreign` (`type_id`),
  KEY `cfg_devis_verre_id_foreign` (`verre_id`),
  KEY `cfg_devis_finition_id_foreign` (`finition_id`),
  KEY `cfg_devis_id_status_foreign` (`id_status`),
  KEY `cfg_devis_ancrage_id_foreign` (`ancrage_id`)
) ENGINE=MyISAM AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cfg_devis`
--

INSERT INTO `cfg_devis` (`id`, `user_id`, `type_id`, `finition_id`, `forme_id`, `pose_id`, `ancrage_id`, `verre_id`, `longueur_a`, `longueur_b`, `longueur_c`, `hauteur`, `angle`, `quantity`, `id_status`, `create_date`, `update_date`) VALUES
(32, 21, 15, 3, 5, 2, 3, 23, 125, 200, 189, 110, NULL, 1, 1, 1762018182, 1762018182),
(23, 2, 1, 2, 2, 2, 2, NULL, 100, 420, NULL, 45, 36, 1, 5, 1761653190, 1761857460),
(4, 11, 7, 1, 1, 1, 1, NULL, 100, NULL, NULL, 47, NULL, 1, 5, 1761514545, 1762020971),
(7, 11, 30, 1, 1, 2, 2, NULL, 123, NULL, NULL, 85, NULL, 1, 1, 1761515656, 1762025441),
(34, 15, 1, 2, 1, 3, 3, NULL, 127, NULL, NULL, 100, 27, 1, 1, 1762025174, 1762025174),
(24, 1, 28, NULL, 2, NULL, 6, 9, 100, 100, NULL, 100, 45, 1, 6, 1761654347, 1761935729),
(27, 2, 19, NULL, 5, NULL, 5, 19, 108, 120, 146, 82, NULL, 1, 1, 1762002991, 1762002991),
(28, 5, 7, 2, 1, 3, 1, NULL, 123, NULL, NULL, 145, 46, 1, 1, 1762003018, 1762003018),
(33, 2, 12, 2, 2, 2, 2, 5, 142, 123, NULL, 112, 48, 1, 1, 1762024820, 1762024820),
(26, 7, 34, 2, 5, 2, 2, NULL, 158, 123, 158, 88, NULL, 1, 3, 1761759118, 1761998143),
(30, 11, 28, NULL, 2, NULL, 1, 9, 158, 196, NULL, 100, 49, 1, 2, 1762003114, 1762012942),
(31, 1, 6, 3, 1, 3, 3, NULL, 156, NULL, NULL, 110, 36, 1, 3, 1762003148, 1762020944),
(29, 7, 34, 3, 1, 2, 2, NULL, 158, NULL, NULL, 77, NULL, 1, 1, 1762003053, 1762003053),
(35, 18, 6, 3, 1, 3, 1, NULL, 123, NULL, NULL, 144, 29, 1, 3, 1762025207, 1762025295),
(36, 18, 30, 2, 2, 2, 3, NULL, 158, 145, NULL, 120, 59, 1, 1, 1762025377, 1762025377),
(37, 5, 3, 2, 3, 2, 2, NULL, 125, 360, NULL, 122, NULL, 1, 4, 1762025583, 1762025624);

-- --------------------------------------------------------

--
-- Structure de la table `cfg_finitions`
--

DROP TABLE IF EXISTS `cfg_finitions`;
CREATE TABLE IF NOT EXISTS `cfg_finitions` (
  `id` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `label_finition` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `slug_finition` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cfg_finitions_label_finition_unique` (`label_finition`),
  UNIQUE KEY `cfg_finitions_slug_finition_unique` (`slug_finition`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cfg_finitions`
--

INSERT INTO `cfg_finitions` (`id`, `label_finition`, `slug_finition`) VALUES
(1, 'Inox 304 Brossé (Intérieur)', 'tube-inox-304l'),
(2, 'Inox 316L Brossé (Extérieur)', 'tube-inox-316l'),
(3, 'Inox 316 Poli Miroir (Mer/Piscine)', 'tube-inox-316');

-- --------------------------------------------------------

--
-- Structure de la table `cfg_formes`
--

DROP TABLE IF EXISTS `cfg_formes`;
CREATE TABLE IF NOT EXISTS `cfg_formes` (
  `id` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `label_forme` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `slug_forme` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cfg_formes_label_forme_unique` (`label_forme`),
  UNIQUE KEY `cfg_formes_slug_forme_unique` (`slug_forme`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cfg_formes`
--

INSERT INTO `cfg_formes` (`id`, `label_forme`, `slug_forme`) VALUES
(1, 'Droit', 'droit'),
(2, 'En V', 'en-v'),
(3, 'En L', 'en-l'),
(4, 'En U', 'en-u'),
(5, 'En S', 'en-s'),
(6, 'Complexe', 'complexe');

-- --------------------------------------------------------

--
-- Structure de la table `cfg_models`
--

DROP TABLE IF EXISTS `cfg_models`;
CREATE TABLE IF NOT EXISTS `cfg_models` (
  `id` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `label_model` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `slug_model` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cfg_models_label_model_unique` (`label_model`),
  UNIQUE KEY `cfg_models_slug_model_unique` (`slug_model`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cfg_models`
--

INSERT INTO `cfg_models` (`id`, `label_model`, `slug_model`) VALUES
(1, 'Câbles', 'cables'),
(2, 'Barres', 'barres'),
(3, 'Verre', 'verre'),
(4, 'Verre à profilé', 'verre-a-profile'),
(5, 'Barrière piscine', 'barriere-piscine'),
(6, 'Filet câble inox', 'filet-inox'),
(7, 'Acier inox', 'tole-inox');

-- --------------------------------------------------------

--
-- Structure de la table `cfg_poses`
--

DROP TABLE IF EXISTS `cfg_poses`;
CREATE TABLE IF NOT EXISTS `cfg_poses` (
  `id` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `label_pose` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `slug_pose` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cfg_poses_label_pose_unique` (`label_pose`),
  UNIQUE KEY `cfg_poses_slug_pose_unique` (`slug_pose`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cfg_poses`
--

INSERT INTO `cfg_poses` (`id`, `label_pose`, `slug_pose`) VALUES
(1, 'Sol', 'sol'),
(2, 'Latérale', 'lateral'),
(3, 'Inclinée', 'incline');

-- --------------------------------------------------------

--
-- Structure de la table `cfg_status`
--

DROP TABLE IF EXISTS `cfg_status`;
CREATE TABLE IF NOT EXISTS `cfg_status` (
  `id` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `label_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `slug_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cfg_status_label_status_unique` (`label_status`),
  UNIQUE KEY `cfg_status_slug_status_unique` (`slug_status`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cfg_status`
--

INSERT INTO `cfg_status` (`id`, `label_status`, `slug_status`) VALUES
(1, 'En attente', 'attente'),
(2, 'En cours', 'encours'),
(3, 'Accepté', 'accepte'),
(4, 'Refusé', 'refuse'),
(5, 'Annulé', 'annule'),
(6, 'Terminé', 'termine');

-- --------------------------------------------------------

--
-- Structure de la table `cfg_types`
--

DROP TABLE IF EXISTS `cfg_types`;
CREATE TABLE IF NOT EXISTS `cfg_types` (
  `id` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `model_id` tinyint UNSIGNED NOT NULL,
  `label_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `slug_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cfg_types_label_type_unique` (`label_type`),
  UNIQUE KEY `cfg_types_slug_type_unique` (`slug_type`),
  KEY `cfg_types_model_id_foreign` (`model_id`)
) ENGINE=MyISAM AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cfg_types`
--

INSERT INTO `cfg_types` (`id`, `model_id`, `label_type`, `slug_type`) VALUES
(1, 1, '5 Câbles', '5-cables'),
(2, 1, '7 Câbles', '7-cables'),
(3, 1, '8 Câbles', '8-cables'),
(4, 1, '11 Câbles', '11-cables'),
(5, 1, '2 Câbles Muret', '2-cables-muret'),
(6, 1, '3 Câbles Muret', '3-cables-muret'),
(7, 2, '5 Barres', '5-barres'),
(8, 2, '7 Barres', '7-barres'),
(9, 2, '11 Barres', '11-barres'),
(10, 2, '2 Barres Muret', '2-barres-muret'),
(11, 2, '3 Barres Muret', '3-barres-muret'),
(12, 3, 'Verre et Main-courante', 'verre-et-mc'),
(13, 3, 'Verre et 2 barres', 'verre-et-2-barres'),
(14, 3, 'Verre et 2 cables', 'verre-et-2-cables'),
(15, 3, 'Verre sans Main-Courante', 'verre-sans-mc'),
(16, 3, 'Verre Muret sans Main Courante', 'verre-muret-sans-mc'),
(17, 3, 'Verre sur Muret', 'verre-sur-muret'),
(18, 4, 'Autoréglable Sol', 'autoreglable-sol'),
(19, 4, 'Autoréglable Latéral', 'autoreglable-lateral'),
(20, 4, 'Autoréglable Sol en F', 'autoreglable-sol-en-f'),
(21, 4, 'Autoréglable Latéral Y', 'autoreglable-lateral-y'),
(22, 4, 'Sol en F', 'sol-en-f'),
(23, 4, 'Sol en U', 'sol-en-u'),
(24, 4, 'Latéral', 'lateral'),
(25, 4, 'Latéral Y', 'lateral-y'),
(26, 4, 'Profil Muret', 'profil-muret'),
(27, 5, 'Pince carrée', 'pince-ronde'),
(28, 5, 'Pince ronde', 'pince-carree'),
(29, 6, 'Filet inox', 'filet-inox'),
(30, 6, 'Filet Inox et Cables', 'filet-inox-et-cables'),
(31, 6, 'Filet Inox et Barres', 'filet-inox-et-barres'),
(32, 6, 'Filet Inox Muret', 'filet-inox-muret'),
(33, 7, 'Tôle inox', 'tole-inox'),
(34, 7, 'Tôle inox et Câbles', 'tole-inox-et-cables'),
(35, 7, 'Tôle inox et Barres', 'tole-inox-et-barres'),
(36, 7, 'Tôle inox Muret', 'tole-inox-muret');

-- --------------------------------------------------------

--
-- Structure de la table `cfg_verres`
--

DROP TABLE IF EXISTS `cfg_verres`;
CREATE TABLE IF NOT EXISTS `cfg_verres` (
  `id` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `label_verre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `slug_verre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cfg_verres_label_verre_unique` (`label_verre`),
  UNIQUE KEY `cfg_verres_slug_verre_unique` (`slug_verre`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cfg_verres`
--

INSERT INTO `cfg_verres` (`id`, `label_verre`, `slug_verre`) VALUES
(1, '88-4 Eva HST', '88-4-eva-hst'),
(2, '88-4 Eva HST Extra Clair', '88-4-eva-hst-extra-clair'),
(3, '88-4 Eva Extra Clair', '88-4-eva-extra-clair'),
(4, '88-4 Clair', '88-4-clair'),
(5, '55-2 Clair', '55-2-clair'),
(6, '44-2 Clair', '44-2-clair'),
(7, '88-4 Eva Opale', '88-4-eva-opale'),
(8, '88-4 Eva', '88-4-eva'),
(9, '88-4 Extra Clair', '88-4-extra-clair'),
(10, '88-4 PVB Extra Clair', '88-4-pvb-extra-clair'),
(11, '88-4 PVB HST Extra Clair', '88-4-pvb-hst-extra-clair'),
(12, '88-4 PVB HST', '88-4-pvb-hst'),
(13, '88-4 PVB', '88-4-pvb'),
(14, '1010-4 Eva Extra Clair', '1010-4-eva-extra-clair'),
(15, '1010-4 Eva HST Extra Clair', '1010-4-eva-hst-extra-clair'),
(16, '1010-4 Eva HST', '1010-4-eva-hst'),
(17, '1010-4 Eva Opale', '1010-4-eva-opale'),
(18, '1010-4 Eva', '1010-4-eva'),
(19, '1010-4 PVB Extra Clair', '1010-4-pvb-extra-clair'),
(20, '1010-4 PVB HST Extra Clair', '1010-4-pvb-hst-extra-clair'),
(21, '1010-4 PVB HST', '1010-4-pvb-hst'),
(22, '1010-4 PVB', '1010-4-pvb'),
(23, 'Aucun', 'aucun');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_login` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_group_id` smallint UNSIGNED NOT NULL DEFAULT '0',
  `user_registered` int NOT NULL,
  `user_last_visit` int UNSIGNED NOT NULL,
  `user_last_activity` int UNSIGNED NOT NULL,
  `user_activation_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_user_login_unique` (`user_login`),
  UNIQUE KEY `users_user_email_unique` (`user_email`),
  KEY `users_user_group_id_foreign` (`user_group_id`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `user_login`, `user_email`, `user_password`, `user_group_id`, `user_registered`, `user_last_visit`, `user_last_activity`, `user_activation_key`) VALUES
(1, 'Admin', 'squalbass27@gmail.com', 'password', 27, 1761219976, 1761220005, 1761220021, 'dfgdsfgs3d32132sdfhg315sdfh51'),
(2, 'alex', 'alex@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 3, 1759302900, 1760954700, 1761747600, '5b5db98ed68aa6222c8b3e6a1d70a7ec'),
(3, 'marie', 'marie@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 2, 1759392000, 1761410400, 1761747720, '44d0010532dcd54f2ab5e3c81bfdba23'),
(4, 'julien', 'julien@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 1, 1759474200, 1761675600, 1761747900, '549e9f18d6d29c897e0ae94f9e9b7b75'),
(5, 'claire', 'claire@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 3, 1759563000, 1761495300, 1761748020, 'ac9dc742028f23102f0c62238407e307'),
(6, 'thomas', 'thomas@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 2, 1759654800, 1761566400, 1761748200, '794282a0e17f283fa03c1b5fed1e1fd8'),
(7, 'sophie', 'sophie@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 1, 1759752000, 1761684000, 1761748260, 'd2153cbd3e1578cd442fbe1b3e1e4c32'),
(8, 'lucas', 'lucas@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 1, 1759814100, 1761678000, 1761748380, 'f5cdab89741b65a39e415ad783666d2e'),
(9, 'emma', 'emma@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 3, 1759905000, 1761725400, 1761748440, '67cd2b294d89d25419fcffee2d1693b1'),
(10, 'nicolas', 'nicolas@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 1, 1759999500, 1761423000, 1761748560, '0c06b408e5e3e7afb64110b0a08d597a'),
(11, 'lea', 'lea@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 1, 1760082600, 1761729300, 1761748680, '2f214c0a76cc8d15d0bc6f07772a0d49'),
(12, 'quentin', 'quentin@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 2, 1760166000, 1761649200, 1761748800, 'c1a5bdd1ac02f23dd240be1aab32da3f'),
(14, 'maxime', 'maxime@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 3, 1760348700, 1761559200, 1761748920, '9dce3de905077b61fc919263b89adaac'),
(15, 'camille', 'camille@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 2, 1760439600, 1761672600, 1761748980, '1f2b3a35fa9356a12fff3e67bbea6065'),
(16, 'antoine', 'antoine@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 1, 1760513100, 1761723600, 1761749040, '11a595f648ca5759a7ad128856f3b521'),
(17, 'julie', 'julie@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 3, 1760604000, 1761497100, 1761749100, '0a40c89f518865be3795b3f434653766'),
(18, 'paul', 'paul@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 1, 1760679000, 1761657000, 1761749160, '3853c4818b995bb39ae9b7c81ef66ad2'),
(20, 'martin', 'martin@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 2, 1760857200, 1761647400, 1761749280, 'ec180343d421a21519326c15b8a28cd8'),
(21, 'eva', 'eva@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 1, 1760954400, 1761728400, 1761749340, '8a654f5280d9b5c89058307798c3f68c');

-- --------------------------------------------------------

--
-- Structure de la table `user_groups`
--

DROP TABLE IF EXISTS `user_groups`;
CREATE TABLE IF NOT EXISTS `user_groups` (
  `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_group` smallint NOT NULL,
  `group_label` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_group` (`id_group`),
  KEY `id_group_2` (`id_group`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_groups`
--

INSERT INTO `user_groups` (`id`, `id_group`, `group_label`) VALUES
(1, 1, 'Visiteur'),
(2, 2, 'En attente'),
(3, 3, 'Membre'),
(4, 4, 'Modérateur'),
(5, 27, 'Administrateur');

-- --------------------------------------------------------

--
-- Structure de la table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `s_user_id` bigint UNSIGNED NOT NULL DEFAULT '0',
  `s_running_time` int UNSIGNED NOT NULL DEFAULT '0',
  `s_ip_adress` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `s_browser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_sessions_s_user_id_foreign` (`s_user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
