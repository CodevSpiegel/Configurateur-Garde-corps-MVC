<?php
/*
 * Contrôleur "gardecorps_controller" adapté à ton framework :
 * - index(...$params) route les sous-actions (cables/barres/…/save)
 * - show_page() rend la page du configurateur (vue + scripts + CSS)
 * - save() gère l’endpoint POST JSON /gardecorps/save (enregistrement en BDD)
 */
class gardecorps_controller {

    /** @var string|false Action demandée (segment 2 de l'URL) */
    public $action;

    /** @var string Buffer HTML final (construit via la vue) */
    public $output = "";

    /** @var string Titre de page (balise <title>) */
    public $page_title;

    /** @var string Meta description */
    public $page_description;

    public $css;
    public $script;

    /** @var object Instance de la vue (gardecorps_view) avec start/row/end() */
    public $html;

    /**
     * Entrée principale : route les sous-actions selon segment 2
     * /gardecorps                  -> page configurateur
     * /gardecorps/cables           -> exemple de section 1
     * /gardecorps/barres           -> exemple de section 2
     * /gardecorps/save   (POST)    -> endpoint JSON (enregistrement)
     */
    public function index(...$params)
    {
        // Services globaux exposés par ton bootstrap
        global $func, $print;

        // Récupère l'action (ex: "cables", "barres", "save", etc.)
        $this->action = $params[0] ?? false;

        // Charge la vue dédiée (classe définie dans /views/gardecorps_view.php)
        $this->html = $func->load_view('gardecorps_view');

        // Router interne
        switch ($this->action) {
            case 'cables':
                $this->show_section_1();
                break;

            case 'barres':
                $this->show_section_2();
                break;

            case 'save':
                // ⚠️ Endpoint API JSON : on délègue à save(), qui écrit la réponse JSON
                // et EXIT immédiatement (pas de gabarit HTML).
                $this->save();
                return; // Très important : ne pas enchaîner sur le rendu HTML

            default:
                $this->show_page();
                break;
        }

        // Rendu standard (HTML)
        $print->add_output($this->output);
        $print->do_output(array(
            'HEAD_TITLE'       => $this->page_title,
            'HEAD_DESCRIPTION' => $this->page_description,
            'ADD_CSS'          => $this->css,
            'SCRIPT'           => $this->script
        ));
    }

    /**
     * Page principale du configurateur (GET /gardecorps)
     * Prépare titre/description, token CSRF, CSS et JS (via la vue).
     */
    public function show_page()
    {
        global $site, $func;

        // Si on a un segment mais que ce n'est pas une action connue -> 404
        if ($this->action) {
            $func->error_404();
        }

        $this->page_title       = $site->const['WEBSITE_NAME'] . " - Gardes-corps";
        $this->page_description = "Configurateur de garde-corps";

        // Token CSRF exposé au JS (la vue l'injectera dans window.CSRF_TOKEN)
        $csrf = func::csrf_token();
        $csrf = htmlspecialchars($csrf, ENT_QUOTES, 'UTF-8');

        // La vue connaît comment générer <script> et <link> adaptés :
        $this->script = $this->html->script($csrf);
        $this->css    = $this->html->css();

        // Construction du contenu via la vue
        $this->output  = $this->html->start();
        $this->output .= $this->html->main_content();
        $this->output .= $this->html->end();
    }

    /**
     * Démo section 1 (existant)
     */
    public function show_section_1()
    {
        $timeNow      = time();
        $this->output = $this->html->start();
        $this->output .= $this->html->row($timeNow);
        $this->output .= $this->html->end();
    }

    /**
     * Démo section 2 (existant)
     */
    public function show_section_2()
    {
        $this->output  = $this->html->start();
        $this->output .= $this->html->row("Action 2");
        $this->output .= $this->html->end();
    }

    /**
     * Endpoint POST /gardecorps/save
     * - Reçoit JSON avec slugs (values) + mesures
     * - Vérifie CSRF
     * - Valide sommairement les données
     * - Map slugs -> ids puis INSERT en BDD via models/gardecorps_model.php
     * - Répond en JSON { ok: true, id: <id inséré> } ou { ok:false, error:... }
     *
     * ⚠️ Cette méthode répond DIRECTEMENT et sort sans passer par le moteur HTML.
     */
    public function save()
    {
        // Réponse JSON UTF-8
        header('Content-Type: application/json; charset=utf-8');

        // Méthode autorisée : POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["ok" => false, "error" => "Méthode non autorisée"]);
            exit;
        }

        // Vérification CSRF (header X-CSRF-Token ou champ post csrf_token)
        $csrf = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? ($_POST['csrf_token'] ?? null);
        if (!func::csrf_verify($csrf)) {
            http_response_code(419);
            echo json_encode(["ok" => false, "error" => "CSRF invalide"]);
            exit;
        }

        // Lecture du payload JSON brut
        $raw  = file_get_contents('php://input');
        $data = json_decode($raw, true);
        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(["ok" => false, "error" => "JSON invalide"]);
            exit;
        }

        // Utilisateur courant (si connecté) selon ta logique d'auth (sinon NULL)
        $userId = $_SESSION['user']['u_id'] ?? null;

        // Normalisation minimale
        $payload = [
            'model'    => trim((string)($data['model'] ?? '')),
            'type'     => trim((string)($data['type'] ?? '')),
            'finition' => isset($data['finition']) ? trim((string)$data['finition']) : null,
            'forme'    => isset($data['forme']) ? trim((string)$data['forme']) : null,
            'pose'     => isset($data['pose']) ? trim((string)$data['pose']) : null,
            'ancrage'  => isset($data['ancrage']) ? trim((string)$data['ancrage']) : null,
            'verre'    => isset($data['verre']) ? trim((string)$data['verre']) : null,
            'mesures'  => is_array($data['mesures'] ?? null) ? $data['mesures'] : [],
            'user_id'  => $userId
        ];

        if ($payload['model'] === '' || $payload['type'] === '') {
            http_response_code(422);
            echo json_encode(["ok" => false, "error" => "Champs obligatoires manquants: model/type"]);
            exit;
        }

        // Validation simple des mesures
        $m = $payload['mesures'];
        $norm = function($k) use ($m) {
            return isset($m[$k]) && $m[$k] !== '' ? (float)$m[$k] : null;
        };
        $A     = $norm('a');
        $B     = $norm('b');
        $C     = $norm('c');
        $H     = $norm('hauteur');
        $ANGLE = $norm('angle');

        foreach (['A'=>$A, 'B'=>$B, 'C'=>$C, 'H'=>$H] as $k => $val) {
            if ($val !== null && $val < 0) {
                http_response_code(422);
                echo json_encode(["ok" => false, "error" => "Mesure $k invalide (valeur négative)"]);
                exit;
            }
        }
        if ($ANGLE !== null && ($ANGLE < 0 || $ANGLE > 180)) {
            http_response_code(422);
            echo json_encode(["ok" => false, "error" => "Angle invalide (0 à 180)"]);
            exit;
        }

        // Appel du modèle pour insérer en BDD
        require_once ROOT . "models/gardecorps_model.php";
        $model = new gardecorps_model(); // respecte ta convention de nommage

        try {
            $insertId = $model->create_devis([
                'model_slug'    => $payload['model'],
                'type_slug'     => $payload['type'],
                'finition_slug' => $payload['finition'],
                'forme_slug'    => $payload['forme'],
                'pose_slug'     => $payload['pose'],
                'ancrage_slug'  => $payload['ancrage'],
                'verre_slug'    => $payload['verre'],
                'A'             => $A,
                'B'             => $B,
                'C'             => $C,
                'HAUTEUR'       => $H,
                'ANGLE'         => $ANGLE,
                'user_id'       => $payload['user_id']
            ]);

            echo json_encode(["ok" => true, "id" => (int)$insertId]);
            exit;

        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode([
                "ok"    => false,
                "error" => "Erreur serveur",
                "detail"=> $e->getMessage()
            ]);
            exit;
        }
    }
}
