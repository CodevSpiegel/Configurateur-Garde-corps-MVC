<?php
/**
 * Contrôleur de connexion (Login)
 * -----------------------------------------------------------------------------
 * - Suit la même structure que home_controller.php :
 *   * récupère l'action depuis l'URL (segment 2) ;
 *   * charge la vue via $func->load_view('login_view') ;
 *   * construit $this->output avec $this->html->start()/row()/end() ;
 *   * envoie la sortie via $print->add_output() puis $print->do_output().
 * - Gère 3 cas :
 *   * (default) => affiche le formulaire de connexion
 *   * action "do-login" => traite le POST (identification)
 *   * action "logout"   => déconnexion (suppression de session applicative)
 */

class login_controller
{
    /** @var string|false Action demandée (segment 2 de l'URL) */
    public $action;

    /** @var string Buffer HTML final (construit via la vue) */
    public $output = "";

    /** @var string Titre de page (balise <title>) */
    public $page_title;

    /** @var string Meta description */
    public $page_description;

    /** @var object Instance de la vue "login_view" (méthodes start/row/end/etc.) */
    public $html;

    /**
     * Point d'entrée par défaut
     * -------------------------------------------------------------------------
     * URL attendues :
     *   - /login                       => formulaire
     *   - /login/do-login              => traitement POST
     *   - /login/logout                => déconnexion
     */
    public function index(...$params)
    {
        // Injecte des services globaux exposés par le bootstrap
        global $func, $print;

        // 1) Récupère l'action (ex: "do-login" ou "logout")
        $this->action = $params[0] ?? false;

        // 2) Charge la vue dédiée au login (classe définie dans /views/login_view.php)
        $this->html = $func->load_view('login_view');

        // 3) Router interne selon l'action
        switch ($this->action) {
            case 'do-login':
                $this->do_login();
                break;

            case 'logout':
                $this->logout();
                break;

            default:
                $this->show_form();
                break;
        }

        // 4) Envoie la sortie au moteur de rendu commun (Display)
        $print->add_output($this->output);
        $print->do_output([
            'HEAD_TITLE'       => $this->page_title,
            'HEAD_DESCRIPTION' => $this->page_description
        ]);
    }

    /**
     * Affiche le formulaire de connexion.
     * - Si des erreurs ont été stockées en session "flash", on les remonte.
     */
    
    private function show_form(): void
    {
        global $site;

        $this->page_title       = $site->const['WEBSITE_NAME'] . " - Connexion";
        $this->page_description = "Connectez-vous pour accéder à votre espace";

        // -- Récupère éventuellement des messages flash (erreurs / infos)
        $errors = $_SESSION['flash_errors'] ?? [];
        $info   = $_SESSION['flash_info']   ?? '';

        // -- Nettoie le flash (on affiche une seule fois)
        unset($_SESSION['flash_errors'], $_SESSION['flash_info']);

        // -- Générer un token CSRF spécifique au formulaire de login
        if (empty($_SESSION['csrf_login'])) {
            $_SESSION['csrf_login'] = bin2hex(random_bytes(32));
        }
        $csrf = $_SESSION['csrf_login'];

        // -- Construit la page via la vue
        $this->output  = $this->html->start();
        if (!empty($info)) {
            $this->output .= $this->html->row_info($info);
        }
        if (!empty($errors)) {
            $this->output .= $this->html->row_errors($errors);
        }
        $old = [
            'login' => $_SESSION['old_login'] ?? ''
        ];
        unset($_SESSION['old_login']);

        $this->output .= $this->html->row_form($old, $csrf);
        $this->output .= $this->html->end();
    }

}