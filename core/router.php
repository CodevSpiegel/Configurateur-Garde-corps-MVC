<?php

// Tracer les pages visitées
if( TRACE_PAGES_VIEWS ) 
{
    $requestedPath  = $_SERVER['REQUEST_URI'] ?? '/';
    $httpMethod     = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $referer        = $_SERVER['HTTP_REFERER'] ?? '';

    $sess->trackPageView($requestedPath, $httpMethod, $referer);

    // Purge : tâche CRON qui supprime les logs au-delà de X jours :
    // DELETE FROM cms_page_views WHERE pv_time < UNIX_TIMESTAMP() - 90*24*3600; -- garde 90 jours
}

// ---------------------------------------------------------------------------
// 2. RÉCUPÉRATION ET ANALYSE DE L'URL DEMANDÉE
// ---------------------------------------------------------------------------
// Exemple : si l'utilisateur va sur http://localhost/mon-projet/article/42
// - $_SERVER['REQUEST_URI'] = "/mon-projet/article/42"
// - $_SERVER['SCRIPT_NAME'] = "/mon-projet/public/index.php"

// On récupère l'URL demandée par le visiteur (sans le nom de domaine)
$request = trim($_SERVER['REQUEST_URI'], '/'); 
// trim() supprime les "/" au début et à la fin pour simplifier le traitement

// On récupère le chemin du script principal (index.php)
$scriptName = dirname($_SERVER['SCRIPT_NAME']); 
// dirname() renvoie le dossier parent du script, ex : "/mon-projet/public" -> "/mon-projet"

// On enlève la partie correspondant au dossier du script pour ne garder que le "vrai chemin"
$request = str_replace(trim($scriptName, '/'), '', $request); 
// Ex: "/mon-projet/article/42" -> "/article/42"

// On découpe l'URL en segments (chaque mot séparé par "/")
$segments = explode('/', trim($request, '/')); 
// Exemple : ["article", "42"]

// Parfois, explode peut laisser des segments vides si l'URL a des doubles slashes ou se termine par un slash.
// Filtrons-les pour avoir un tableau propre.
// $segments = array_filter($segments);
$segments = array_filter($segments, function($value) {
    // Pourquoi ajouter function($value) ? :
    // Cette condition garde toutes les valeurs qui ne sont PAS null, false, ou une chaîne vide.
    // Elle gardera spécifiquement 0 (int) et '0' (string) car elles ne sont pas considérées comme "empty" par cette logique,
    // mais elles sont "empty" pour array_filter sans callback.
    // Donc ! Sans cette condition, la valeur 0 (zéro) est considérée comme "false" et sera donc ignorée...
    return $value !== null && $value !== false && $value !== '';
});

// Si l'on veut réindexer le tableau pour qu'il commence toujours à 0
// $segments = array_values($segments);


// Securiser les variables GET et POST contre les injections JAVASCRIPT.
if (!empty($_GET)) {
    // Liste toutes les variables contenues dans $_GET
    foreach( $_GET as $k => $v )
    {
        $k = htmlspecialchars($k);
        $v = htmlspecialchars($v);

        $return[$k] = htmlspecialchars($v);
    }
    $_GET = $return;
}

if (!empty($_POST)) {
    // Liste toutes les variables contenues dans $_POST
    foreach( $_POST as $k => $v )
    {
        $k = htmlspecialchars($k);
        $v = htmlspecialchars($v);

        $return[$k] = htmlspecialchars($v);
    }
    $_POST = $return;
}

// ---------------------------------------------------------------------------
// 3. DÉTERMINATION DU CONTRÔLEUR ET DE LA METHODE
// ---------------------------------------------------------------------------

// Si aucun segment n'existe (URL "/"), on prend "home" comme contrôleur par défaut
$controllerName = !empty($segments[0]) ? $segments[0] : 'home'; 

// Nom de la classe du contrôleur à appeler
// Exemple : "home_controller" ou "article_controller"
$controllerClass = $controllerName . '_controller'; 

// Chemin complet du fichier du contrôleur
$controllerFile = ROOT . 'controllers/' . $controllerClass . '.php'; 

// Vérifie si le fichier contrôleur existe
if (file_exists($controllerFile)) {
    // Si oui, on instancie dynamiquement le contrôleur
    $controller = new $controllerClass();

    // On regarde si le contrôleur possède une méthode "index" par défaut
    if (method_exists($controller, 'index')) {
        // On récupère tous les segments après le nom du contrôleur
        // Exemple : URL "/article/42/commentaire" -> ["42", "commentaire"]
        $params = array_slice($segments, 1);

        // On appelle la méthode "index" avec les paramètres trouvés
        // call_user_func_array permet de passer un tableau comme liste d'arguments
        call_user_func_array([$controller, 'index'], $params);

    } else {
        // Si la méthode index() n'existe pas, on renvoie une page 404
        $func->error_404();
    }

} else {
    // Si le contrôleur n'existe pas, on affiche directement la page 404
    $func->error_404();
}