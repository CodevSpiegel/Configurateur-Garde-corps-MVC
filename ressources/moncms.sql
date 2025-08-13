-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 13 août 2025 à 21:05
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
(1, 'Bienvenue sur mon_cms', '<p>Ceci est le premier article de test.</p>', 1, 1, 'bienvenue-sur-mon-cms', 1750043910, NULL, 'Général'),
(2, 'Deuxième article', '<p>Encore un article de démonstration.</p>', 1, 0, 'deuxieme-article', 1755023910, NULL, 'Actu');

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Journal des pages vues avec groupe utilisateur';

--
-- Déchargement des données de la table `cms_page_views`
--

INSERT INTO `cms_page_views` (`pv_id`, `pv_time`, `pv_s_id`, `pv_user_id`, `pv_user_group`, `pv_path`, `pv_method`, `pv_referer`, `pv_ip`, `pv_user_agent`) VALUES
(1, 1755115759, 'd68f3cc5a4d8cf7454cfcaca514f92221b0650fab709c517daefc734a7072d28', 0, 2, '/', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(2, 1755115780, 'd68f3cc5a4d8cf7454cfcaca514f92221b0650fab709c517daefc734a7072d28', 0, 2, '/home/action-01', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(3, 1755119058, 'd68f3cc5a4d8cf7454cfcaca514f92221b0650fab709c517daefc734a7072d28', 0, 2, '/', 'GET', 'http://moncms/home/action-01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(4, 1755119059, 'd68f3cc5a4d8cf7454cfcaca514f92221b0650fab709c517daefc734a7072d28', 0, 2, '/home/action-01', 'GET', 'http://moncms/', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(5, 1755119060, 'd68f3cc5a4d8cf7454cfcaca514f92221b0650fab709c517daefc734a7072d28', 0, 2, '/home/action-02', 'GET', 'http://moncms/home/action-01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(6, 1755119062, 'd68f3cc5a4d8cf7454cfcaca514f92221b0650fab709c517daefc734a7072d28', 0, 2, '/about', 'GET', 'http://moncms/home/action-02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(7, 1755119063, 'd68f3cc5a4d8cf7454cfcaca514f92221b0650fab709c517daefc734a7072d28', 0, 2, '/home', 'GET', 'http://moncms/about', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(8, 1755119065, 'd68f3cc5a4d8cf7454cfcaca514f92221b0650fab709c517daefc734a7072d28', 0, 2, '/nimpxxxxx', 'GET', 'http://moncms/home', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(9, 1755119066, 'd68f3cc5a4d8cf7454cfcaca514f92221b0650fab709c517daefc734a7072d28', 0, 2, '/home', 'GET', 'http://moncms/nimpxxxxx', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'),
(10, 1755119067, 'd68f3cc5a4d8cf7454cfcaca514f92221b0650fab709c517daefc734a7072d28', 0, 2, '/', 'GET', 'http://moncms/home', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36');

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
('d68f3cc5a4d8cf7454cfcaca514f92221b0650fab709c517daefc734a7072d28', 0, 'Guest', 2, 1755119067, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36');

-- --------------------------------------------------------

--
-- Structure de la table `cms_users`
--

DROP TABLE IF EXISTS `cms_users`;
CREATE TABLE IF NOT EXISTS `cms_users` (
  `u_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identifiant unique utilisateur',
  `u_login` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Identifiant de connexion (pseudo ou username)',
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table des utilisateurs (cms_users)';

--
-- Déchargement des données de la table `cms_users`
--

INSERT INTO `cms_users` (`u_id`, `u_login`, `u_email`, `u_password`, `u_group`, `u_lang`, `u_ipadress`, `u_last_visit`, `u_last_activity`) VALUES
(1, 'admin', 'admin@example.com', '$2y$10$PpMMLUWBDEtA1McjqFhSDuX3L8UOSJ2UXj5QtBEdwCc0l6.6Z9pPO', 27, 'fr', '', 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `cms_users_addresses`
--

DROP TABLE IF EXISTS `cms_users_addresses`;
CREATE TABLE IF NOT EXISTS `cms_users_addresses` (
  `add_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID unique adresse',
  `u_id` int UNSIGNED NOT NULL COMMENT 'FK vers moncms.cms_users.u_id',
  `add_label` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Libellé : Maison, Travail…',
  `add_recipient_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nom complet du destinataire',
  `add_company` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Société (facultatif)',
  `add_line1` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Adresse ligne 1',
  `add_line2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Adresse ligne 2',
  `add_line3` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Adresse ligne 3 (optionnel)',
  `add_city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ville',
  `add_state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Région / État / Province',
  `add_postal_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Code postal',
  `add_country_code` char(2) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Code pays ISO 3166-1 alpha-2',
  `add_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Téléphone',
  `add_delivery_instructions` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Instructions livreur',
  `add_is_default` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1 = par défaut',
  `add_is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 = active',
  `add_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Création',
  `add_updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'MAJ',
  PRIMARY KEY (`add_id`),
  KEY `idx_user` (`u_id`),
  KEY `idx_user_default` (`u_id`,`add_is_default`),
  KEY `idx_country` (`add_country_code`),
  KEY `idx_city` (`add_city`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Adresses de livraison liées aux utilisateurs (1-N)';

--
-- Déchargement des données de la table `cms_users_addresses`
--

INSERT INTO `cms_users_addresses` (`add_id`, `u_id`, `add_label`, `add_recipient_name`, `add_company`, `add_line1`, `add_line2`, `add_line3`, `add_city`, `add_state`, `add_postal_code`, `add_country_code`, `add_phone`, `add_delivery_instructions`, `add_is_default`, `add_is_active`, `add_created_at`, `add_updated_at`) VALUES
(1, 1, 'Maison', 'Admin Principal', NULL, '12 Rue de la Paix', NULL, NULL, 'Paris', 'Île-de-France', '75002', 'FR', '+33123456789', 'Sonner interphone 12', 1, 1, '2025-08-13 22:57:43', '2025-08-13 22:57:43'),
(2, 1, 'Travail', 'Admin Principal', 'ACME SAS', '45 Av. des Champs-Élysées', 'Bât. A', 'Étage 3', 'Paris', 'Île-de-France', '75008', 'FR', '+33198765432', 'Accueil réceptionne', 0, 1, '2025-08-13 22:57:43', '2025-08-13 22:57:43');

-- --------------------------------------------------------

--
-- Structure de la table `cms_users_meta`
--

DROP TABLE IF EXISTS `cms_users_meta`;
CREATE TABLE IF NOT EXISTS `cms_users_meta` (
  `u_meta_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID unique meta',
  `u_id` int UNSIGNED NOT NULL COMMENT 'FK vers moncms.cms_users.u_id',
  `u_first_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Prénom',
  `u_last_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Nom',
  `u_display_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Nom affiché publiquement',
  `u_avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL ou chemin avatar',
  `u_bio` text COLLATE utf8mb4_unicode_ci COMMENT 'Courte biographie',
  `u_facebook` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Lien Facebook',
  `u_twitter` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Lien Twitter',
  `u_instagram` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Lien Instagram',
  `u_linkedin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Lien LinkedIn',
  `u_pref_newsletter` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1=inscrit newsletter',
  `u_pref_dark_mode` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1=mode sombre',
  `u_default_shipping_addr_id` int UNSIGNED DEFAULT NULL COMMENT 'FK -> cms_users_addresses.add_id',
  `u_default_billing_addr_id` int UNSIGNED DEFAULT NULL COMMENT 'FK -> cms_users_addresses.add_id',
  `u_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de création',
  `u_updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Dernière mise à jour',
  PRIMARY KEY (`u_meta_id`),
  UNIQUE KEY `uniq_user_meta` (`u_id`),
  KEY `idx_def_ship` (`u_default_shipping_addr_id`),
  KEY `idx_def_bill` (`u_default_billing_addr_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Profil utilisateur + préférences. Pointeurs vers adresses par défaut.';

--
-- Déchargement des données de la table `cms_users_meta`
--

INSERT INTO `cms_users_meta` (`u_meta_id`, `u_id`, `u_first_name`, `u_last_name`, `u_display_name`, `u_avatar_url`, `u_bio`, `u_facebook`, `u_twitter`, `u_instagram`, `u_linkedin`, `u_pref_newsletter`, `u_pref_dark_mode`, `u_default_shipping_addr_id`, `u_default_billing_addr_id`, `u_created_at`, `u_updated_at`) VALUES
(1, 1, 'Sébastien', 'Spiegel', 'Admin', '/uploads/avatars/admin.png', 'Super administrateur', NULL, NULL, NULL, NULL, 1, 0, 1, 2, '2025-08-13 22:57:43', '2025-08-13 23:00:02');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `cms_users_addresses`
--
ALTER TABLE `cms_users_addresses`
  ADD CONSTRAINT `fk_cms_users_addresses_user` FOREIGN KEY (`u_id`) REFERENCES `cms_users` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `cms_users_meta`
--
ALTER TABLE `cms_users_meta`
  ADD CONSTRAINT `fk_meta_def_bill` FOREIGN KEY (`u_default_billing_addr_id`) REFERENCES `cms_users_addresses` (`add_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_meta_def_ship` FOREIGN KEY (`u_default_shipping_addr_id`) REFERENCES `cms_users_addresses` (`add_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_meta_user` FOREIGN KEY (`u_id`) REFERENCES `cms_users` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
