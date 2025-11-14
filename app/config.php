<?php
/**
 * ============================================================================
 * app\config.php
 * ============================================================================
 * Centralise la configuration (DB, options).
 */

define('SITE_TITLE', 'France Inox');
define('SITE_LANGUAGE', 'fr');
define('SITE_CHARSET', 'utf-8');
define('SITE_DESCRIPTION', 'Configurateur visuel de garde-corps');

define('DB_HOST', '127.0.0.1');    // hôte MySQL
define('DB_NAME', 'gardecorps');    // nom de la base
define('DB_USER', 'root');         // utilisateur
define('DB_PASS', '');             // mot de passe
define('DB_CHARSET', 'utf8mb4');   // interclassement moderne

define('BASE_URL', '/');