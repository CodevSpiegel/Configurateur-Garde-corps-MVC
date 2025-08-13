-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 13 août 2025 à 00:29
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
-- Base de données : `moncms`
--

-- --------------------------------------------------------

--
-- Structure de la table `cms_articles`
--

DROP TABLE IF EXISTS `cms_articles`;
CREATE TABLE IF NOT EXISTS `cms_articles` (
  `a_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID unique de l''article',
  `a_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Titre de l''article',
  `a_content` longtext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Contenu HTML de l''article',
  `a_author_id` int UNSIGNED NOT NULL COMMENT 'ID de l''auteur (cms_users.u_id)',
  `a_status` tinyint UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Statut : 0=brouillon, 1=publié, 2=archivé',
  `a_slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Slug unique pour l''URL',
  `a_created_at` int UNSIGNED NOT NULL COMMENT 'Date de création (timestamp UNIX)',
  `a_updated_at` int UNSIGNED DEFAULT NULL COMMENT 'Date de dernière modification (timestamp UNIX)',
  `a_category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Catégorie ou rubrique de l''article',
  PRIMARY KEY (`a_id`),
  UNIQUE KEY `uniq_slug` (`a_slug`),
  KEY `idx_author` (`a_author_id`),
  KEY `idx_status` (`a_status`),
  KEY `idx_category` (`a_category`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table des articles du CMS mon_cms';

--
-- Déchargement des données de la table `cms_articles`
--

INSERT INTO `cms_articles` (`a_id`, `a_title`, `a_content`, `a_author_id`, `a_status`, `a_slug`, `a_created_at`, `a_updated_at`, `a_category`) VALUES
(1, 'Bienvenue sur mon_cms', '<p>Ceci est le premier article de test.</p>', 1, 1, 'bienvenue-sur-mon-cms', 1755043910, NULL, 'Général'),
(2, 'Deuxième article', '<p>Encore un article de démonstration.</p>', 1, 0, 'deuxieme-article', 1755043910, NULL, 'Actu');

-- --------------------------------------------------------

--
-- Structure de la table `cms_page_views`
--

DROP TABLE IF EXISTS `cms_page_views`;
CREATE TABLE IF NOT EXISTS `cms_page_views` (
  `pv_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Clé primaire',
  `pv_time` int UNSIGNED NOT NULL COMMENT 'Timestamp Unix de la vue',
  `pv_s_id` char(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ID de session (cms_sessions.s_id)',
  `pv_user_id` int UNSIGNED NOT NULL DEFAULT '0' COMMENT 'ID utilisateur (0 = invité)',
  `pv_user_group` int UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Groupe utilisateur (ex: GROUP_GEST)',
  `pv_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Chemin/route demandée',
  `pv_method` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GET' COMMENT 'Méthode HTTP',
  `pv_referer` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'Referer si présent',
  `pv_ip` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'Adresse IP',
  `pv_user_agent` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'User-Agent résumé',
  PRIMARY KEY (`pv_id`),
  KEY `idx_time` (`pv_time`),
  KEY `idx_sid` (`pv_s_id`),
  KEY `idx_user` (`pv_user_id`),
  KEY `idx_path_time` (`pv_path`,`pv_time`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Journal des pages vues avec groupe utilisateur';

--
-- Déchargement des données de la table `cms_page_views`
--

INSERT INTO `cms_page_views` (`pv_id`, `pv_time`, `pv_s_id`, `pv_user_id`, `pv_user_group`, `pv_path`, `pv_method`, `pv_referer`, `pv_ip`, `pv_user_agent`) VALUES
(1, 1755037439, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(2, 1755037440, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-02', 'GET', 'http://moncms/home/action-01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(3, 1755037580, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-02', 'GET', 'http://moncms/home/action-02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(4, 1755037581, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01/?test=%3Cscript%3Ealert(`Si%20%C3%A7a%20passe...%20Ca%20craint%20un%20max%20l%C3%A0%20!`)%3C/script%3E', 'GET', 'http://moncms/home/action-02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(5, 1755037586, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/about', 'GET', 'http://moncms/home/action-01/?test=%3Cscript%3Ealert(`Si%20%C3%A7a%20passe...%20Ca%20craint%20un%20max%20l%C3%A0%20!`)%3C/script%3E', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(6, 1755037647, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home', 'GET', 'http://moncms/about', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(7, 1755037650, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/home', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(8, 1755037652, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(9, 1755037658, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-02', 'GET', 'http://moncms/home/action-01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(10, 1755037939, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01', 'GET', 'http://moncms/home/action-02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(11, 1755037940, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-02', 'GET', 'http://moncms/home/action-01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(12, 1755037942, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/nimpxxxxx', 'GET', 'http://moncms/home/action-02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(13, 1755038152, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/admin_stats.php', 'GET', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(14, 1755038750, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home', 'GET', 'http://moncms/admin_stats.php', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(15, 1755038751, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01', 'GET', 'http://moncms/home', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(16, 1755038752, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-02', 'GET', 'http://moncms/home/action-01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(17, 1755038753, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/home/action-02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(18, 1755042005, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/home/action-02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(19, 1755042007, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(20, 1755042044, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(21, 1755042171, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(22, 1755042172, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(23, 1755042173, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/about', 'GET', 'http://moncms/home', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(24, 1755042229, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(25, 1755042230, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/login', 'GET', 'http://moncms/home', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(26, 1755042279, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/login', 'GET', 'http://moncms/home', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(27, 1755042297, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/login', 'GET', 'http://moncms/login', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(28, 1755042299, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home', 'GET', 'http://moncms/login', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(29, 1755042300, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/about', 'GET', 'http://moncms/home', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(30, 1755042303, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/login', 'GET', 'http://moncms/home', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(31, 1755042400, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/login', 'GET', 'http://moncms/home', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(32, 1755042401, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01', 'GET', 'http://moncms/login', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(33, 1755042402, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-02', 'GET', 'http://moncms/home/action-01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(34, 1755042403, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01', 'GET', 'http://moncms/home/action-02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(35, 1755042404, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01/?test=%3Cscript%3Ealert(`Si%20%C3%A7a%20passe...%20Ca%20craint%20un%20max%20l%C3%A0%20!`)%3C/script%3E', 'GET', 'http://moncms/home/action-01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(36, 1755042406, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/nimpxxxxx', 'GET', 'http://moncms/home/action-01/?test=%3Cscript%3Ealert(`Si%20%C3%A7a%20passe...%20Ca%20craint%20un%20max%20l%C3%A0%20!`)%3C/script%3E', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(37, 1755042408, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-02', 'GET', 'http://moncms/home/action-01/?test=%3Cscript%3Ealert(`Si%20%C3%A7a%20passe...%20Ca%20craint%20un%20max%20l%C3%A0%20!`)%3C/script%3E', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(38, 1755042409, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01', 'GET', 'http://moncms/home/action-02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(39, 1755042410, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/home/action-01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(40, 1755043182, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(41, 1755043182, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(42, 1755043183, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-02', 'GET', 'http://moncms/home/action-01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(43, 1755043184, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/home/action-02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(44, 1755043237, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/home/action-02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(45, 1755043238, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(46, 1755043239, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-02', 'GET', 'http://moncms/home/action-01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(47, 1755043240, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01', 'GET', 'http://moncms/home/action-02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(48, 1755043344, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/home/action-01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(49, 1755043345, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(50, 1755043346, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-02', 'GET', 'http://moncms/home/action-01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(51, 1755043346, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/home/action-02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(52, 1755043450, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(53, 1755043452, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-02', 'GET', 'http://moncms/home/action-01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(54, 1755043453, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01', 'GET', 'http://moncms/home/action-02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(55, 1755043454, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01/?test=%3Cscript%3Ealert(`Si%20%C3%A7a%20passe...%20Ca%20craint%20un%20max%20l%C3%A0%20!`)%3C/script%3E', 'GET', 'http://moncms/home/action-01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(56, 1755043913, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/home/action-01/?test=%3Cscript%3Ealert(`Si%20%C3%A7a%20passe...%20Ca%20craint%20un%20max%20l%C3%A0%20!`)%3C/script%3E', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(57, 1755044042, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/home/action-01/?test=%3Cscript%3Ealert(`Si%20%C3%A7a%20passe...%20Ca%20craint%20un%20max%20l%C3%A0%20!`)%3C/script%3E', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(58, 1755044043, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/home/action-01/?test=%3Cscript%3Ealert(`Si%20%C3%A7a%20passe...%20Ca%20craint%20un%20max%20l%C3%A0%20!`)%3C/script%3E', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(59, 1755044043, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/home/action-01/?test=%3Cscript%3Ealert(`Si%20%C3%A7a%20passe...%20Ca%20craint%20un%20max%20l%C3%A0%20!`)%3C/script%3E', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(60, 1755044071, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/home/action-01/?test=%3Cscript%3Ealert(`Si%20%C3%A7a%20passe...%20Ca%20craint%20un%20max%20l%C3%A0%20!`)%3C/script%3E', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(61, 1755044558, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/home/action-01/?test=%3Cscript%3Ealert(`Si%20%C3%A7a%20passe...%20Ca%20craint%20un%20max%20l%C3%A0%20!`)%3C/script%3E', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(62, 1755044559, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/home/action-01/?test=%3Cscript%3Ealert(`Si%20%C3%A7a%20passe...%20Ca%20craint%20un%20max%20l%C3%A0%20!`)%3C/script%3E', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(63, 1755044560, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(64, 1755044563, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(65, 1755044570, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/articles', 'GET', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(66, 1755044618, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/articles', 'GET', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(67, 1755044702, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/articles', 'GET', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(68, 1755044784, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(69, 1755044785, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/home/action-01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(70, 1755044786, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(71, 1755044786, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-02', 'GET', 'http://moncms/home/action-01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(72, 1755044787, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/about', 'GET', 'http://moncms/home/action-02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(73, 1755044790, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/nimpxxxxx', 'GET', 'http://moncms/home/action-02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(74, 1755044793, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/home/action-01/?test=%3Cscript%3Ealert(`Si%20%C3%A7a%20passe...%20Ca%20craint%20un%20max%20l%C3%A0%20!`)%3C/script%3E', 'GET', 'http://moncms/home/action-02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(75, 1755044797, '8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 2, '/', 'GET', 'http://moncms/home/action-01/?test=%3Cscript%3Ealert(`Si%20%C3%A7a%20passe...%20Ca%20craint%20un%20max%20l%C3%A0%20!`)%3C/script%3E', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36');

-- --------------------------------------------------------

--
-- Structure de la table `cms_sessions`
--

DROP TABLE IF EXISTS `cms_sessions`;
CREATE TABLE IF NOT EXISTS `cms_sessions` (
  `s_id` char(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Identifiant unique de session (64 caractères hex)',
  `s_user_id` int UNSIGNED NOT NULL DEFAULT '0' COMMENT 'ID utilisateur lié (0 = invité)',
  `s_user_login` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'Login de l’utilisateur ou "Guest"',
  `s_user_group` smallint UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Groupe (ex: admin, membre, invité)',
  `s_running_time` int UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Dernière activité (timestamp Unix)',
  `s_ip_adress` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'Adresse IP (IPv4 ou IPv6)',
  `s_browser` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'User-Agent ou info navigateur',
  PRIMARY KEY (`s_id`),
  KEY `idx_user_id` (`s_user_id`),
  KEY `idx_running_time` (`s_running_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table des sessions applicatives (cms_sessions)';

--
-- Déchargement des données de la table `cms_sessions`
--

INSERT INTO `cms_sessions` (`s_id`, `s_user_id`, `s_user_login`, `s_user_group`, `s_running_time`, `s_ip_adress`, `s_browser`) VALUES
('8d854e5f85b610a31b99c004149001279fa6f934402a844b14c8925b62f5cb21', 0, 'Guest', 2, 1755044797, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36');

-- --------------------------------------------------------

--
-- Structure de la table `cms_users`
--

DROP TABLE IF EXISTS `cms_users`;
CREATE TABLE IF NOT EXISTS `cms_users` (
  `u_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identifiant unique utilisateur',
  `u_login` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Identifiant de connexion (pseudo ou username)',
  `u_firstname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'Prénom',
  `u_lastname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'Nom de famille',
  `u_email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Adresse email',
  `u_password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Hash du mot de passe via password_hash()',
  `u_group` smallint UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Groupe utilisateur (voir constantes GROUP_*)',
  `u_lang` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'fr' COMMENT 'Langue préférée (code ISO, ex: fr, en)',
  `u_ipadress` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'Adresse IP de la dernière connexion',
  `u_last_visit` int UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Dernière visite (timestamp Unix)',
  `u_last_activity` int UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Dernière activité (timestamp Unix)',
  PRIMARY KEY (`u_id`),
  UNIQUE KEY `uniq_u_login` (`u_login`),
  UNIQUE KEY `uniq_u_email` (`u_email`),
  KEY `idx_u_group` (`u_group`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table des utilisateurs (cms_users)';

--
-- Déchargement des données de la table `cms_users`
--

INSERT INTO `cms_users` (`u_id`, `u_login`, `u_firstname`, `u_lastname`, `u_email`, `u_password`, `u_group`, `u_lang`, `u_ipadress`, `u_last_visit`, `u_last_activity`) VALUES
(1, 'admin', 'Super', 'Admin', 'admin@example.com', '$2y$10$PpMMLUWBDEtA1McjqFhSDuX3L8UOSJ2UXj5QtBEdwCc0l6.6Z9pPO', 27, 'fr', '', 0, 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
