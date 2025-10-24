<?php
/**
 * core/router.php
 * -----------------------------------------------------------------------------
 * Routeur central avec segments illimités (type /controller/action/param1/param2...)
 * Points clés :
 *  - Nettoyage de l'URL et extraction robuste des segments
 *  - Contrôleur par défaut : "home" ; méthode par défaut : index(...$params)
 *  - Cas API JSON dédié : POST /gardecorps/save  -> appelle directement save() et sort
 *  - Sinon : on délègue à index(...$params) (les contrôleurs peuvent router en interne)
 *  - Gestion 404 propre via $func->error_404()
 *
 * Hypothèses :
 *  - Tous les contrôleurs sont dans ROOT . 'controllers/'
 *  - Convention de nommage : fichier "<nom>_controller.php" / classe "<nom>_controller"
 *  - Tes contrôleurs implémentent généralement index(...$params)
 *  - Ta vue/layout est gérée ensuite par le contrôleur (via $print->do_output())
 */

// -----------------------------------------------------------------------------
// Sécurité minimale sur les entrées (GET/POST) : sanitisation de base
// (Ton framework fait déjà des nettoyages ailleurs ; on reste léger ici.)
// -----------------------------------------------------------------------------
/**
 * Fonction récursive pour nettoyer un tableau d'entrée (GET/POST).
 */
function sanitize_array(&$arr): void {
    foreach ($arr as $k => $v) {
        if (is_array($v)) {
            sanitize_array($arr[$k]); // Appel récursif
        } else {
            // Trim + suppression des caractères non imprimables
            $arr[$k] = trim(filter_var($v, FILTER_UNSAFE_RAW));
        }
    }
}

// Application à GET / POST
if (!empty($_GET))  { sanitize_array($_GET); }
if (!empty($_POST)) { sanitize_array($_POST); }


// -----------------------------------------------------------------------------
// Helpers locaux
// -----------------------------------------------------------------------------

/**
 * Récupère le chemin (path) de la requête sans la base /public et sans query string.
 * Ex: si SCRIPT_NAME = /public/index.php et REQUEST_URI = /gardecorps/save?x=1,
 *     alors path nettoyé = "gardecorps/save".
 */
$resolvePath = static function(): string {
    // Extrait seulement le path (sans ?query=...)
    $uriPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';

    // Base = répertoire du script (souvent "/public") ; on le retire du début du path
    $base = rtrim(dirname($_SERVER['SCRIPT_NAME'] ?? ''), '/'); // ex: "/public"
    if ($base && $base !== '/' && str_starts_with($uriPath, $base)) {
        $uriPath = substr($uriPath, strlen($base));
    }

    // Trim des "/" en trop
    $uriPath = trim($uriPath, "/ \t\n\r\0\x0B");

    // Normalisation : pas d'espaces multiples, etc. (optionnel)
    return $uriPath;
};

/**
 * Charge un contrôleur selon son nom "logical" (ex: "gardecorps") et retourne une instance.
 * - Cherche controllers/<name>_controller.php
 * - Instancie la classe <name>_controller
 */
$loadController = static function(string $name) {
    $file = ROOT . 'controllers/' . $name . '_controller.php';
    $class = $name . '_controller';

    if (!is_file($file)) return false;
    require_once $file;

    if (!class_exists($class, false)) return false;
    return new $class();
};

// -----------------------------------------------------------------------------
// Extraction des segments
// -----------------------------------------------------------------------------
$path = $resolvePath();                 // ex: "gardecorps/save"
$segments = $path === '' ? [] : explode('/', $path);
$segments = array_values(array_filter($segments, static fn($s) => $s !== ''));

// Contrôleur et "action" (au sens 2e segment). Le reste = paramètres.
$controller = $segments[0] ?? 'home';
$action     = $segments[1] ?? null;
$params     = array_slice($segments, 1); // Pour index(...$params), $params[0] = action éventuelle

// Normalisation simple : on n'autorise que a-z0-9-_. dans le nom de contrôleur
// (prévenir chargements de fichiers inattendus)
if (!preg_match('~^[a-zA-Z0-9._-]+$~', $controller)) {
    // Nom de contrôleur douteux -> 404
    global $func;
    $func->error_404();
    exit;
}

// -----------------------------------------------------------------------------
// CAS SPÉCIAL API JSON : POST /gardecorps/save
// -----------------------------------------------------------------------------
// Ici on court-circuite le rendu HTML pour un endpoint JSON propre.
// On appelle directement gardecorps_controller::save() puis on exit.
if ($controller === 'gardecorps' && $action === 'save') {
    // Vérif méthode HTTP : on veut du POST
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(405);
        echo json_encode(['ok' => false, 'error' => 'Méthode non autorisée']);
        exit;
    }

    $instance = $loadController('gardecorps');
    if ($instance === false || !method_exists($instance, 'save')) {
        // Si la méthode n'existe pas, on bascule 404
        global $func;
        $func->error_404();
        exit;
    }

    // Appel direct de l'action save() : c'est elle qui envoie la réponse JSON.
    $instance->save();
    exit;
}

// -----------------------------------------------------------------------------
// ROUTE STANDARD : déléguer au contrôleur demandé (méthode index(...$params))
// -----------------------------------------------------------------------------
// Convention : tous les contrôleurs exposent index(...$params) et gèrent en interne.
// Ex: gardecorps_controller::index('save') gère l'action 'save' si on ne passe pas par le cas spécial.
$instance = $loadController($controller);
if ($instance === false) {
    // Contrôleur introuvable -> 404
    global $func;
    $func->error_404();
    exit;
}

// Appel de la méthode index(...$params) si elle existe, sinon tentative d'appeler $action directement.
if (method_exists($instance, 'index')) {
    // On passe TOUS les segments restants à index : libre au contrôleur de router en interne.
    // Exemple: dans ton gardecorps_controller, index(...$params) sait gérer 'cables', 'barres', etc.
    $instance->index(...$params);
    exit;
}

// (Fallback rare) Si pas d'index, on tente d'appeler directement la méthode demandée
if ($action && method_exists($instance, $action)) {
    // Ex: /home/contact -> home_controller::contact(...$paramsSansAction)
    $callParams = array_slice($segments, 2); // paramètres après l'action
    $instance->{$action}(...$callParams);
    exit;
}

// Rien de tout ça ? -> 404
global $func;
$func->error_404();
exit;
