<?php
/**
 * ============================================================================
 * core/Controller.php
 * ============================================================================
 * ✨ CLASSE DE BASE POUR TOUS LES CONTRÔLEURS DU FRAMEWORK MVC ✨
 * 
 * ➤ Rôle :
 *   Cette classe sert de **contrôleur parent** à tous les autres contrôleurs.
 *   Elle fournit des méthodes utilitaires (helpers) pour :
 *     ✅ afficher une vue,
 *     ✅ rediriger vers une autre page,
 *     ✅ vérifier si le formulaire est en POST,
 *     ✅ gérer la sécurité des formulaires via un token CSRF.
 * 
 * ➤ Exemple :
 *   class HomeController extends Controller { ... }
 * ============================================================================
 */

class Controller {

    /**
     * --------------------------------------------------------------------------
     * 🖼️ Méthode view()
     * --------------------------------------------------------------------------
     * ➤ Permet d’afficher une page (vue) complète avec un header et un footer.
     * 
     * @param string $view — le nom du fichier de vue (ex: 'home/index')
     * @param array  $data — tableau de données à transmettre à la vue
     * 
     * Exemple :
     *   $this->view('home/index', ['title' => 'Accueil']);
     *   → charge : 
     *       /views/layout/header.php
     *       /views/home/index.php
     *       /views/layout/footer.php
     */
    protected function view(string $view, array $data = []) {

        // 🔹 extract() transforme le tableau associatif en variables individuelles :
        // ['title' => 'Accueil'] devient $title = 'Accueil';
        extract($data);

        // 🔹 Inclusion du header commun (mise en page globale)
        include __DIR__ . '/../views/layout/header.php';

        // 🔹 Inclusion de la vue principale (contenu spécifique à la page)
        include __DIR__ . '/../views/' . $view . '.php';

        // 🔹 Inclusion du footer commun
        include __DIR__ . '/../views/layout/footer.php';
    }


    /**
     * --------------------------------------------------------------------------
     * 🚀 Méthode redirect()
     * --------------------------------------------------------------------------
     * ➤ Permet de rediriger l’utilisateur vers une autre route de ton site.
     * 
     * @param string $path — chemin relatif à la racine (ex: 'home/index')
     * 
     * Exemple :
     *   $this->redirect('articles');
     *   → redirige vers BASE_URL/articles
     */
    protected function redirect(string $path) {

        // On nettoie les "/" pour éviter les doublons dans l’URL finale
        $url = rtrim(BASE_URL, '/') . '/' . ltrim($path, '/');

        // Envoi d’un en-tête HTTP de redirection
        header('Location: ' . $url);

        // Arrête l’exécution du script après la redirection
        exit;
    }


    /**
     * --------------------------------------------------------------------------
     * 📬 Méthode isPost()
     * --------------------------------------------------------------------------
     * ➤ Vérifie si la requête actuelle est une soumission de formulaire en POST.
     * 
     * @return bool — true si la méthode est POST, sinon false.
     * 
     * Exemple :
     *   if ($this->isPost()) { ... }  // traitement du formulaire
     */
    protected function isPost(): bool {

        // $_SERVER['REQUEST_METHOD'] contient la méthode HTTP utilisée (GET, POST, etc.)
        return ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST';
    }


    /**
     * --------------------------------------------------------------------------
     * 🔐 Méthode csrfToken()
     * --------------------------------------------------------------------------
     * ➤ Génère un "token CSRF" unique pour sécuriser les formulaires.
     * 
     * CSRF = Cross-Site Request Forgery
     * → Ce token empêche qu’un pirate soumette un formulaire à ta place.
     * 
     * Fonctionnement :
     *   1️⃣ Si aucun token CSRF n’existe en session → on en crée un aléatoire.
     *   2️⃣ On le renvoie pour pouvoir l’insérer dans le formulaire (champ caché).
     * 
     * Exemple dans une vue :
     *   <input type="hidden" name="csrf" value="<?= $this->csrfToken(); ?>">
     */
    protected function csrfToken(): string {

        // Si la session n’est pas active, on la démarre
        if (session_status() !== PHP_SESSION_ACTIVE) session_start();

        // Si aucun token CSRF n’existe encore, on en génère un nouveau
        if (empty($_SESSION['csrf'])) {
            // random_bytes(16) crée une chaîne binaire aléatoire très sûre
            // bin2hex() la transforme en chaîne hexadécimale lisible
            $_SESSION['csrf'] = bin2hex(random_bytes(16));
        }

        // Retourne le token actuel
        return $_SESSION['csrf'];
    }


    /**
     * --------------------------------------------------------------------------
     * ✅ Méthode checkCsrf()
     * --------------------------------------------------------------------------
     * ➤ Vérifie si le token CSRF reçu depuis le formulaire est bien valide.
     * 
     * @param string $token — le token reçu via le formulaire (POST)
     * @return bool — true si le token est correct, false sinon.
     * 
     * Exemple :
     *   if (!$this->checkCsrf($_POST['csrf'])) {
     *       die('Erreur CSRF');
     *   }
     */
    protected function checkCsrf(string $token): bool {

        // S’assure que la session est active
        if (session_status() !== PHP_SESSION_ACTIVE) session_start();

        // Vérifie que :
        //   1️⃣ un token existe en session
        //   2️⃣ il correspond exactement à celui envoyé (sécurité hash_equals)
        return isset($_SESSION['csrf']) && hash_equals($_SESSION['csrf'], $token);
    }
}
