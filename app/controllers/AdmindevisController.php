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

class AdmindevisController extends Controller {

    public function index() {
        $this->view('admindevis/dashboard');
    }

    // ---------- Devis ----------
    public function devis($action = 'index', $id = null) {

        $timeNow = time();
        $func = new Functions();
        $dev  = new Devis();
        $csrf = $this->csrfToken();

        switch ($action) {

            // LISTE : /admindevis/devis/list
            case 'list':
                $page    = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
                $perPage = 10;

                $total = $dev->countAll();
                $rows  = $dev->listPaginated($page, $perPage);
                $pages = (int)ceil($total / $perPage);

                return $this->view('devis/list', [
                    'func'   => $func,
                    'row'    => $rows,
                    'csrf'   => $csrf,
                    'page'   => $page,
                    'pages'  => $pages,
                    'total'  => $total,
                    'perPage'=> $perPage,
                ]);

            // AFFICHAGE D'UN DEVIS : /admindevis/devis/show/{id}
            case 'show':
                // Cast de sécurité
                $safeId = (int)($id ?? 0);

                $fromPage = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;

                // Lecture du devis
                $row = $dev->show($safeId);

                // Vue de détail (ex: app/views/devis/show.php)

                $status = $dev->status();

                return $this->view('devis/show', [
                    'func' => $func,
                    'row'  => $row,
                    'csrf' => $csrf,
                    'status' => $status,
                    'fromPage' => $fromPage,   // ➜ pour le lien “Retour”
                ]);

            // SUPPRESSION : /admindevis/devis/delete/{id}
            case 'delete':
                // On exige POST + CSRF valide
                if ($this->isPost() && $this->checkCsrf($_POST['csrf'] ?? '')) {
                    $safeId = (int)($id ?? 0);
                    $dev->delete($safeId);
                }
                // On revient à la liste
                $return = filter_input(INPUT_POST, 'return', FILTER_SANITIZE_URL);
                $this->redirect($return ?: 'admindevis/devis/list');
                //return $this->redirect('admindevis/devis/list');

            // EDITION : /admindevis/devis/edit/{id}
            case 'edit':
                $safeId = (int)($id ?? 0);
                $row = $dev->find($safeId);
                if (!$row) {
                    // Si l'enregistrement n'existe pas, on repart au dashboard
                    return $this->redirect('admindevis');
                }

                if ($this->isPost()) {
                    // Vérif CSRF
                    if (!$this->checkCsrf($_POST['csrf'] ?? '')) die('CSRF');

                    // ⚙️ Récupération/normalisation des champs (user_id non édité ici)
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
                    $this->redirect($return ?: 'admindevis/devis/list');
                    // return $this->redirect('admindevis/devis/list');
                }

                // GET : on affiche le formulaire édition
                return $this->view('devis/show', [
                    'mode' => 'edit',
                    'row'  => $row,
                    'csrf' => $csrf
                ]);

            // PAR DEFAUT : dashboard
            default:
                return $this->view('admindevis/dashboard');
        }

    }


    // ---------- Utilisateurs ----------
    public function users($action = 'index', $id = null) {

        $timeNow = time();
        $func = new Functions();
        $user  = new Users();
        $csrf = $this->csrfToken();

        switch ($action) {

            // ---------------- LIST ----------------
            // admindevis/users/list
            case 'list':

                // page via query ?page=2 (facile à partager/bookmarker)
                $page    = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
                $perPage = 10;

                // On récupère la liste des utilisateurs
                $total = $user->countAll();
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
            // AFFICHAGE D'UN UTILISATEUR : /admindevis/users/show/{id}
            case 'show':
                // Cast de sécurité
                $safeId = (int)($id ?? 0);

                // récupère la page d’origine pour le bouton "Retour"
                $fromPage = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
                
                $row = $user->show($safeId);

                $groups = $user->userGroups();
                // Vue de détail (ex: app/views/users/show.php)
                return $this->view('users/show', [
                    'func' => $func,
                    'row'  => $row,
                    'csrf' => $csrf,
                    'groups'  => $groups,
                    'fromPage' => $fromPage
                ]);

            // SUPPRESSION : /admindevis/users/delete/{id}
            case 'delete':
                // On exige POST + CSRF valide
                if ($this->isPost() && $this->checkCsrf($_POST['csrf'] ?? '')) {
                    $safeId = (int)($id ?? 0);
                    $user->delete($safeId);
                }
                // On revient à la liste
                return $this->redirect('admindevis/users/list');
            
            // EDITION : /admindevis/users/edit/{id}
            case 'edit':
                $safeId = (int)($id ?? 0);
                $row = $user->find($safeId);
                if (!$row) {
                    // Si l'enregistrement n'existe pas, on repart au dashboard
                    return $this->redirect('admindevis');
                }

                if ($this->isPost()) {
                    // Vérif CSRF
                    if (!$this->checkCsrf($_POST['csrf'] ?? '')) die('CSRF');

                    // ⚙️ Récupération/normalisation des champs (user_id non édité ici)
                    $type_id     = (int)trim($_POST['type_id']     ?? 0);
                    $finition_id =      trim($_POST['finition_id'] ?? null);
                    $pose_id     =      trim($_POST['pose_id']     ?? null);
                    $ancrage_id  =      trim($_POST['ancrage_id']  ?? null);
                    $forme_id    =      trim($_POST['forme_id']    ?? null);
                    $verre_id    =      trim($_POST['verre_id']    ?? null);
                    $longueur_a  =      trim($_POST['longueur_a']  ?? null);
                    $longueur_b  =      trim($_POST['longueur_b']  ?? null);
                    $longueur_c  =      trim($_POST['longueur_c']  ?? null);
                    $hauteur     =      trim($_POST['hauteur']     ?? null);
                    $angle       =      trim($_POST['angle']       ?? null);
                    $quantity    = (int)trim($_POST['quantity']    ?? 1);
                    $id_status   = (int)trim($_POST['id_status']   ?? 1);
                    $update_date = $timeNow;

                    // ✅ Update
                    $user->update(
                        $row['id'],
                        $type_id,
                        $finition_id,
                        $pose_id,
                        $ancrage_id,
                        $forme_id,
                        $verre_id,
                        $longueur_a,
                        $longueur_b,
                        $longueur_c,
                        $hauteur,
                        $angle,
                        $quantity,
                        $id_status,
                        $update_date
                    );

                    return $this->redirect('admindevis');
                }

                // GET : on affiche le formulaire édition
                return $this->view('user/form', [
                    'mode' => 'edit',
                    'row'  => $row,
                    'csrf' => $csrf
                ]);

            // PAR DEFAUT : dashboard
            default:
                return $this->view('admindevis/dashboard');
        }

    }
}