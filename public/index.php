<?php

// SESSIONS
// ini_set('session.cookie_lifetime', false);
session_start();;

// Activer l’affichage des erreurs pour le développement
ini_set('display_errors', 1);
error_reporting(E_ALL);

// DÉFINITION DE LA CONSTANTE ROOT Pour fonctions d'inclusion php
define('ROOT', dirname(__DIR__) . DIRECTORY_SEPARATOR);
// DIRECTORY_SEPARATOR est une constante PHP
// - Sur Windows : "\"
// - Sur Linux/Mac : "/"
// On l’utilise pour écrire du code compatible multiplateforme

// DÉFINITION DE LA CONSTANTE PUBLIC_PATH Pour images, fichiers etc (html)
define("PUBLIC_PATH", substr($_SERVER['PHP_SELF'], 0, -9));

// Constantes
require_once ROOT."core/defines.php";

// Configuration Glabale
require_once ROOT."core/config.php";