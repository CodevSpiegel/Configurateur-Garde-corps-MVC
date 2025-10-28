<?php
/**
 * ============================================================================
 * public/index.php
 * ============================================================================
 * ✨ POINT D’ENTRÉE UNIQUE DU FRAMEWORK MVC ✨
 * 
 * ➤ Rôle :
 *    Ce fichier est le **premier** exécuté lorsqu’un visiteur arrive sur ton site.
 *    Il initialise la session, charge la configuration, le moteur de routage,
 *    puis transmet la requête (URL) au routeur.
 * 
 * ➤ Pourquoi un point d’entrée unique ?
 *    Cela permet de centraliser toutes les requêtes ici et d’éviter
 *    d’accéder directement aux fichiers internes du projet (sécurité + propreté).
 * 
 * ➤ Exemple :
 *    URL → http://localhost/mon_mvc/public/article/show/5
 *    ⤷ index.php reçoit l’URL complète
 *    ⤷ il appelle le routeur → "ArticleController::show(5)"
 * ============================================================================
 */

 // -------------------------------------------------------
 // 1️⃣ — Mode strict pour la sécurité et la stabilité
 // -------------------------------------------------------
 // "declare(strict_types=1)" force PHP à respecter les types (string, int, etc.)
 // Cela évite des erreurs discrètes (ex : passer un texte à la place d’un nombre).
declare(strict_types=1);


// -------------------------------------------------------
// 2️⃣ — Démarrage de la session PHP
// -------------------------------------------------------
// Nécessaire pour stocker des informations persistantes entre les pages,
// comme un utilisateur connecté, un panier, ou des messages flash.
session_start();


// -------------------------------------------------------
// 3️⃣ — Chargement des fichiers essentiels du framework
// -------------------------------------------------------

// Chemin vers le fichier de configuration principale
// (ex: connexion à la BDD, constantes, etc.)
require_once __DIR__ . '/../app/config.php';

// Chemin vers la classe du routeur (moteur de navigation interne)
require_once __DIR__ . '/../app/core/Router.php';


// -------------------------------------------------------
// 4️⃣ — Création du routeur et traitement de la requête
// -------------------------------------------------------

// On crée une nouvelle instance de la classe Router
$router = new Router();

// On demande au routeur de "distribuer" la requête courante
// $_SERVER['REQUEST_URI'] contient tout le chemin demandé par l’utilisateur
// Exemple : "/article/show/5" ou simplement "/"
$router->dispatch($_SERVER['REQUEST_URI'] ?? '/');


// ============================================================================
/**
 * 💡 Résumé du processus :
 * ----------------------------------------------------------------------------
 * 1. Un visiteur entre une URL (ex: /about/contact)
 * 2. Le serveur exécute ce fichier index.php
 * 3. On charge les fichiers de configuration et le routeur
 * 4. Le routeur analyse l’URL :
 *      → "about" → AboutController
 *      → "contact" → méthode contact()
 * 5. Le contrôleur affiche la vue correspondante (HTML)
 * ----------------------------------------------------------------------------
 * 🚀 Ainsi, tout ton site passe toujours par ce fichier unique.
 * ============================================================================
 */
