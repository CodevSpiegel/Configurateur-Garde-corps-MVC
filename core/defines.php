<?php
// Website informations
define("WEBSITE_TITLE", "Titre du site");
define("WEBSITE_NAME", "Nova CMS Project");
define("WEBSITE_URL", "http://nova7");
define("WEBSITE_DESCRIPTION", "CMS propulsé par Sébastien Spiegel (2025)");
define("WEBSITE_KEYWORDS", "");
define("WEBSITE_LANGUAGE", "fr");
define("WEBSITE_AUTHOR", "Sébastien SPIEGEL");
define("WEBSITE_AUTHOR_MAIL", "codev.spiegel@gmail.com");

// BALISES OPEN GRAPH (Facebook, LinkedIn, etc.)
define("WEBSITE_FACEBOOK_NAME", WEBSITE_NAME);
define("WEBSITE_FACEBOOK_DESCRIPTION", WEBSITE_DESCRIPTION);
define("WEBSITE_FACEBOOK_URL", WEBSITE_URL);
define("WEBSITE_FACEBOOK_IMAGE", "");

// DataBase informations
define("DATABASE_HOST", "localhost");
define("DATABASE_NAME", "novacmsv2");
define("DATABASE_USER", "root");
define("DATABASE_PASSWORD", "");
define("DATABASE_CHARSET", "utf8");

define("DEBUG_TIME_EXECUTION", true);

// DÉFINITION DE LA CONSTANTE PUBLIC_PATH Pour images, fichiers etc (html)
define("PUBLIC_PATH", substr($_SERVER['PHP_SELF'], 0, -9));