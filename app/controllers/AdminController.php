<?php
/**
 * controllers/AdminController.php
 * CRUD basique pour catégories et astuces (sans auth).
 * Protégé par token CSRF minimal.
 */
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Model.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Functions.php';
require_once __DIR__ . '/../models/Devis.php';
require_once __DIR__ . '/../models/Users.php';
// require_once __DIR__ . '/../models/DevisTip.php';

class AdminController extends Controller {

    public function index() {
        $this->view('admin/dashboard');
    }

    // ---------- DEVIS ----------
    public function devis( $action = 'index', $id = null ) {

        $timeNow = time();
        $func = new Functions();
        $dev  = new Devis();
        $csrf = $this->csrfToken();

        switch ($action) {

            // ---------------- LIST ----------------
            // admin/devis/list
            case 'list':
                // page via query ?page=2 (facile à partager/bookmarker)
                $page    = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
                $perPage = 10;

                // On récupère le nombre total de devis
                $total = $dev->countAll();

                // On récupère la liste des devis
                $rows  = $dev->listPaginated($page, $perPage);
                $pages = (int)ceil($total / $perPage);

                // On rend la vue liste (ex: app/views/devis/list.php)
                return $this->view('devis/list', [
                    'func'   => $func,
                    'row'    => $rows,
                    'csrf'   => $csrf,
                    'page'   => $page,
                    'pages'  => $pages,
                    'total'  => $total,
                    'perPage'=> $perPage,
                ]);

            // ---------------- SHOW ----------------
            // AFFICHAGE D'UN DEVIS : /admin/devis/show/{id}
            case 'show':
                // Cast de sécurité
                $safeId = (int)($id ?? 0);

                // récupère la page d’origine pour le bouton "Retour"
                $fromPage = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;

                // Lecture du devis
                $row = $dev->show($safeId);

                // Liste des Status
                $status = $dev->status();

                // Vue de détail (ex: app/views/devis/show.php)
                return $this->view('devis/show', [
                    'func' => $func,
                    'row'  => $row,
                    'csrf' => $csrf,
                    'status' => $status,
                    'fromPage' => $fromPage   // ➜ pour le lien “Retour”
                ]);

            // SUPPRESSION : /admin/devis/delete/{id}
            case 'delete':
                // On exige POST + CSRF valide
                if ($this->isPost() && $this->checkCsrf($_POST['csrf'] ?? '')) {
                    $safeId = (int)($id ?? 0);
                    $dev->delete($safeId);
                }
                // On revient à la liste
                $return = filter_input(INPUT_POST, 'return', FILTER_SANITIZE_URL);
                $this->redirect($return ?: 'admin/devis/list');

            // ---------------- EDIT ----------------
            // EDITION : /admin/devis/edit/{id}
            case 'edit':
                $safeId = (int)($id ?? 0);
                $row = $dev->find($safeId);
                if (!$row) {
                    // Si l'enregistrement n'existe pas, on repart au dashboard
                    return $this->redirect('admin/devis/list');
                }

                if ($this->isPost()) {
                    // Vérif CSRF
                    if (!$this->checkCsrf($_POST['csrf'] ?? '')) die('CSRF');

                    // ⚙️ Récupération/normalisation des champs
                    $id_status   = (int)trim($_POST['id_status'] ?? 1);
                    $update_date = $timeNow;

                    // ✅ Update
                    $dev->update(
                        $row['id'],
                        $id_status,
                        $update_date
                    );

                    // On revient à la liste
                    $return = filter_input(INPUT_POST, 'return', FILTER_SANITIZE_URL);
                    $this->redirect($return ?: 'admin/devis/list');
                    // return $this->redirect('admin/devis/list');
                }

                // GET : on affiche le formulaire édition
                return $this->view('devis/show', [
                    'mode' => 'edit',
                    'row'  => $row,
                    'csrf' => $csrf
                ]);

            // PAR DEFAUT : dashboard
            default:
                return $this->view('admin/dashboard');
        }

    }


    // ---------- USERS ----------
    public function users( $action = 'index', $id = null ) {

        $timeNow = time();
        $func = new Functions();
        $user  = new Users();
        $csrf = $this->csrfToken();

        switch ($action) {

            // ---------------- LIST ----------------
            // admin/users/list
            case 'list':
                // page via query ?page=2 (facile à partager/bookmarker)
                $page    = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
                $perPage = 10;

                // On récupère le nombre total d'utilisateurs
                $total = $user->countAll();

                // On récupère la liste des utilisateurs
                $row  = $user->listPaginated($page, $perPage);
                $pages = (int)ceil($total / $perPage);

                // On rend la vue liste (ex: app/views/users/list.php)
                return $this->view('users/list', [
                    'func'  => $func,
                    'users' => $row,
                    'csrf'  => $csrf,
                    'page'    => $page,
                    'pages'   => $pages,
                    'total'   => $total,
                    'perPage' => $perPage,
                ]);

            // ---------------- SHOW ----------------
            // AFFICHAGE D'UN UTILISATEUR : /admin/users/show/{id}
            case 'show':
                // Cast de sécurité
                $safeId = (int)($id ?? 0);

                // récupère la page d’origine pour le bouton "Retour"
                $fromPage = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;

                // Lecture de l'utilisateur
                $row = $user->show($safeId);

                // Liste des Groupes
                $groups = $user->userGroups();

                // Vue de détail (ex: app/views/users/show.php)
                return $this->view('users/show', [
                    'func' => $func,
                    'row'  => $row,
                    'csrf' => $csrf,
                    'groups'  => $groups,
                    'fromPage' => $fromPage   // ➜ pour le lien “Retour”
                ]);

            // SUPPRESSION : /admin/users/delete/{id}
            case 'delete':
                // On exige POST + CSRF valide
                if ($this->isPost() && $this->checkCsrf($_POST['csrf'] ?? '')) {
                    $safeId = (int)($id ?? 0);
                    $user->delete($safeId);
                }
                // On revient à la liste
                $return = filter_input(INPUT_POST, 'return', FILTER_SANITIZE_URL);
                $this->redirect($return ?: 'admin/users/list');

            // ---------------- EDIT ----------------
            // EDITION : /admin/users/edit/{id}
            case 'edit':
                $safeId = (int)($id ?? 0);
                $row = $user->find($safeId);
                if (!$row) {
                    // Si l'enregistrement n'existe pas, on repart au dashboard
                    return $this->redirect('admin/users/list');
                }

                if ($this->isPost()) {
                    // Vérif CSRF
                    if (!$this->checkCsrf($_POST['csrf'] ?? '')) die('CSRF');

                    // ⚙️ Récupération/normalisation des champs
                    $id_groups   = (int)trim($_POST['id_group'] ?? 1);
                    $update_date = $timeNow;

                    // ✅ Update
                    $user->update(
                        $row['id'],
                        $id_groups,
                        $update_date
                    );

                    // On revient à la liste
                    $return = filter_input(INPUT_POST, 'return', FILTER_SANITIZE_URL);
                    $this->redirect($return ?: 'admin/users/list');
                    // return $this->redirect('admin/devis/list');
                }

                // GET : on affiche le formulaire édition
                return $this->view('users/show', [
                    'mode' => 'edit',
                    'row'  => $row,
                    'csrf' => $csrf
                ]);

            // PAR DEFAUT : dashboard
            default:
                return $this->view('admin/dashboard');
        }

    }
}