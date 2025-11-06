<?php
/**
 * ============================================================================
 * core/Router.php
 * ============================================================================
 * ✨ ROUTEUR PRINCIPAL DU FRAMEWORK MVC ✨
 * 
 * ➤ Rôle :
 *    Ce fichier gère la "traduction" de l'URL en un contrôleur, une action
 *    (méthode) et éventuellement des paramètres supplémentaires.
 * 
 * ➤ Exemple d'URL :
 *    /article/show/12/commentaires
 *    ⤷ contrôleur → ArticleController
 *    ⤷ action      → show
 *    ⤷ paramètres  → [12, "commentaires"]
 * 
 * ➤ Si l’URL est vide ou incomplète :
 *    /         → HomeController::index()
 *    /about    → AboutController::index()
 * 
 * ➤ Architecture attendue :
 *    - controllers/
 *        HomeController.php
 *        AboutController.php
 *    - views/
 *    - core/
 *        Router.php (ce fichier)
 * 
 * ➤ Fonctionnalités :
 *    ✅ Gestion d’un nombre illimité de segments (/controller/action/param1/param2/...)
 *    ✅ Vérifications d’existence des fichiers et classes
 *    ✅ Gestion des erreurs 404 personnalisée
 * ============================================================================
 */

class Router {

    /**
     * --------------------------------------------------------------------------
     * Fonction principale de routage
     * --------------------------------------------------------------------------
     * @param string $uri — l’URI complète demandée (ex: /article/show/5)
     * 
     * 1️⃣ Nettoie l'URL
     * 2️⃣ Extrait les segments
     * 3️⃣ Identifie le contrôleur, l'action et les paramètres
     * 4️⃣ Charge et exécute le contrôleur correspondant
     */

    public function dispatch(string $uri) {

        // --- Étape 1 : Nettoyage de l’URL ---
        // On retire tout ce qui suit le "?" (query string, ex: ?id=5)
        $path = parse_url($uri, PHP_URL_PATH) ?? '/';

        // On remplace plusieurs "/" successifs par un seul
        $path = preg_replace('#/+#', '/', $path);

        // On retire les "/" au début et à la fin
        $path = trim($path, '/');

        // On découpe le chemin en segments (ex: "article/show/12" → ["article","show","12"])
        $segments = $path ? explode('/', $path) : [];


        // --- Étape 2 : Détermination du contrôleur et de l’action ---

        // Premier segment = nom du contrôleur (par défaut "home")
        // ucfirst() met la première lettre en majuscule pour correspondre au nom de la classe
        $controllerName = ucfirst($segments[0] ?? 'home') . 'Controller';

        // Deuxième segment = nom de la méthode (par défaut "index")
        $action = $segments[1] ?? 'index';

        // Tous les segments suivants = paramètres supplémentaires
        $params = array_slice($segments, 2);


        // --- Étape 3 : Localisation du fichier contrôleur ---
        // On construit le chemin complet du fichier PHP du contrôleur
        $controllerFile = ROOT . 'app/controllers/' . $controllerName . '.php';

        // Si le fichier n’existe pas → Erreur 404
        if (!is_file($controllerFile)) {
            return $this->error404("Contrôleur introuvable : $controllerName");
        }

        // On inclut le fichier du contrôleur
        require_once $controllerFile;

        // Si la classe n’existe pas à l’intérieur du fichier → Erreur 404
        if (!class_exists($controllerName)) {
            return $this->error404("Classe inexistante : $controllerName");
        }

        // On instancie dynamiquement la classe du contrôleur
        $controller = new $controllerName();


        // --- Étape 4 : Vérification de la méthode demandée ---
        // Si l’action n’existe pas dans la classe → Erreur 404
        if (!method_exists($controller, $action)) {
            return $this->error404("Action introuvable : $action");
        }

        // --- Étape 5 : Exécution de la méthode avec ses paramètres ---
        // Appel dynamique : équivaut à $controller->action($param1, $param2, ...)
        return call_user_func_array([$controller, $action], $params);
    }


    /**
     * --------------------------------------------------------------------------
     * Gestion des erreurs 404 personnalisée
     * --------------------------------------------------------------------------
     * @param string $msg — message d’erreur à afficher (ex: "Contrôleur introuvable")
     * 
     * ➤ Affiche une page HTML avec un message clair et un lien de retour.
     */
    private function error404(string $msg) {
        // Envoi du code HTTP 404 au navigateur
        http_response_code(404);

        // Titre de la page 404
        $title = "404 — Page introuvable";

        // Inclusion du header (mise en page commune)
        include ROOT . 'app/views/layout/header.php';

        // Contenu principal du message d’erreur
        echo "<main style='text-align:center; padding:2em;'>";
        echo "<h1>❌ Erreur 404</h1>";
        echo "<p>" . htmlspecialchars($msg) . "</p>";
        echo '<p><a href="' . BASE_URL . '">⬅ Retour à l’accueil</a></p>';
        echo "</main>";

        // Inclusion du footer
        include ROOT . 'app/views/layout/footer.php';
    }
}
