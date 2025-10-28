-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 27 oct. 2025 à 08:18
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
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `slug`, `name`, `description`, `created_at`) VALUES
(1, 'html', 'HTML', 'Structure du document, sémantique, accessibilité', '2025-09-08 22:24:56'),
(2, 'css', 'CSS', 'Mise en forme, layout moderne (Flexbox, Grid)', '2025-09-08 22:24:56'),
(3, 'javascript', 'JavaScript', 'Langage du navigateur, DOM, fetch, asynchrone', '2025-09-08 22:24:56'),
(5, 'mysql', 'MySQL', 'Modélisation, requêtes, index, transactions', '2025-09-08 22:24:56');

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
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cfg_devis`
--

INSERT INTO `cfg_devis` (`id`, `user_id`, `type_id`, `finition_id`, `forme_id`, `pose_id`, `ancrage_id`, `verre_id`, `longueur_a`, `longueur_b`, `longueur_c`, `hauteur`, `angle`, `quantity`, `id_status`, `create_date`, `update_date`) VALUES
(1, 0, 1, NULL, NULL, NULL, NULL, NULL, 1000, NULL, NULL, NULL, NULL, 1, 1, 1761508715, 1761508715),
(2, 0, 1, 1, 1, 1, 1, NULL, 110, NULL, NULL, 40, NULL, 1, 1, 1761513628, 1761513628),
(3, 0, 2, 2, 5, 2, 3, NULL, 110, 120, 130, 80, NULL, 1, 1, 1761513702, 1761513702),
(4, 0, 7, 1, 1, 1, 1, NULL, 100, NULL, NULL, 47, NULL, 1, 1, 1761514545, 1761514545),
(5, 0, 12, 1, 1, 1, 1, NULL, 100, NULL, NULL, 40, NULL, 1, 1, 1761515585, 1761515585),
(6, 0, 27, NULL, 1, NULL, 1, NULL, 150, NULL, NULL, 70, NULL, 1, 1, 1761515620, 1761515620),
(7, 0, 30, 1, 1, 2, 2, NULL, 123, NULL, NULL, 85, NULL, 1, 1, 1761515656, 1761515656),
(8, 0, 36, 1, 2, 2, 3, NULL, 123, 122, NULL, 56, 42, 1, 1, 1761515697, 1761515697),
(9, 0, 25, NULL, 1, NULL, 4, NULL, 111, NULL, NULL, 100, NULL, 1, 1, 1761515730, 1761515730),
(10, 0, 12, 1, 2, 2, 2, 6, 111, 112, NULL, 57, 33, 1, 1, 1761516019, 1761516019),
(11, 0, 18, NULL, 1, NULL, 5, NULL, 120, NULL, NULL, 44, NULL, 1, 1, 1761516076, 1761516076),
(12, 0, 27, NULL, 1, NULL, 1, 9, 111, NULL, NULL, 70, NULL, 1, 1, 1761516150, 1761516150),
(13, 0, 18, NULL, 1, NULL, 4, NULL, 120, NULL, NULL, 89, NULL, 1, 1, 1761516692, 1761516692),
(14, 0, 18, NULL, 1, NULL, 4, NULL, 111, NULL, NULL, 56, NULL, 1, 1, 1761516845, 1761516845),
(15, 0, 18, NULL, 3, NULL, 5, 15, 111, 222, NULL, 83, NULL, 1, 1, 1761549037, 1761549037),
(16, 0, 1, 1, 1, 2, 2, NULL, 145, NULL, NULL, 23, NULL, 1, 1, 1761550809, 1761550809),
(17, 0, 12, 2, 1, 2, 2, 6, 125, NULL, NULL, 123, NULL, 1, 1, 1761550992, 1761550992),
(18, 0, 1, 2, 1, 3, 2, NULL, 123, NULL, NULL, 55, 42, 1, 1, 1761551666, 1761551666);

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
-- Structure de la table `tips`
--

DROP TABLE IF EXISTS `tips`;
CREATE TABLE IF NOT EXISTS `tips` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` int UNSIGNED NOT NULL,
  `title` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `summary` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `content` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tips_category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `tips`
--

INSERT INTO `tips` (`id`, `category_id`, `title`, `summary`, `content`, `code`, `created_at`, `updated_at`) VALUES
(1, 1, 'Balises sémantiques clés', 'Utiliser <main>, <section>, <article>, <aside>, <nav>, <header>, <footer>', 'Les balises sémantiques améliorent l’accessibilité et le SEO. Découpez vos pages en sections logiques et utilisez des <h1..h6> hiérarchisés.', '<main>\n  <article>\n    <h1>Titre</h1>\n    <p>Contenu...</p>\n  </article>\n</main>', '2025-09-08 22:24:57', NULL),
(2, 2, 'Flexbox 1 minute', 'Axe principal, centrage facile', 'Flexbox simplifie l’alignement et la distribution dans un axe. Combinez avec gap pour l’espacement.', '.row { display:flex; align-items:center; justify-content:space-between; gap:1rem; }', '2025-09-08 22:24:57', NULL),
(3, 2, 'Grid responsive', 'Grille fluide sans media-queries', 'CSS Grid avec minmax() et auto-fit permet des grilles responsives élégantes.', '.grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; }', '2025-09-08 22:24:57', NULL),
(4, 3, 'Délégation d’événements', 'Écouter un parent plutôt que chaque enfant', 'Améliore les performances pour les listes dynamiques.', 'document.addEventListener(\"click\", e => { if(e.target.matches(\"[data-rm]\")) e.target.closest(\"li\").remove(); });', '2025-09-08 22:24:57', NULL),
(5, 3, 'fetch + async/await', 'Récupérer du JSON proprement', 'Toujours vérifier res.ok et gérer les erreurs.', 'async function getJSON(u){ const r=await fetch(u); if(!r.ok) throw new Error(r.status); return r.json(); }', '2025-09-08 22:24:57', NULL),
(8, 5, 'Index & FULLTEXT', 'Accélérer les recherches', 'Ajoutez des index sur les clés étrangères et un FULLTEXT sur les champs textuels pour les recherches.', 'CREATE INDEX idx_tips_category ON tips(category_id);\nCREATE FULLTEXT INDEX ft_tips ON tips(title, summary, content);', '2025-09-08 22:24:57', NULL);

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
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `user_login`, `user_email`, `user_password`, `user_group_id`, `user_registered`, `user_last_visit`, `user_last_activity`, `user_activation_key`) VALUES
(1, 'Admin', 'squalbass27@gmail.com', 'password', 27, 1761219976, 1761220005, 1761220021, 'dfgdsfgs3d32132sdfhg315sdfh51');

-- --------------------------------------------------------

--
-- Structure de la table `user_groups`
--

DROP TABLE IF EXISTS `user_groups`;
CREATE TABLE IF NOT EXISTS `user_groups` (
  `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT,
  `group_label` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `tips`
--
ALTER TABLE `tips` ADD FULLTEXT KEY `ft_tips` (`title`,`summary`,`content`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `tips`
--
ALTER TABLE `tips`
  ADD CONSTRAINT `fk_tips_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
