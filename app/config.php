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


// ----------------------------------------------------------
// CONFIG E-MAIL
// ----------------------------------------------------------
// Adresse d'expédition par défaut
define('MAIL_FROM', 'no-reply@squal.dev');
// Nom de l'expéditeur (visible dans les clients mail)
define('MAIL_FROM_NAME', 'France Inox');

// Mode :
//  - 'prod' = envoi normal
//  - 'dev'  = sujet tagué + redirection éventuelle + log
define('MAIL_MODE', 'dev');

// En mode DEV : tous les mails sont redirigés vers cette adresse
// (laisser vide/null pour désactiver la redirection)
define('MAIL_DEV_TO', 'spiegel.codeur@gmail.com');

// Fichier de log (optionnel) pour voir le contenu des mails
// (laisser vide/null pour ne pas loguer)
define('MAIL_LOG_FILE', ''); // par ex. app/logs/mails.log
