<?php
/**
 * controllers/AdminController.php
 * CRUD basique pour catégories et astuces (sans auth).
 * Protégé par token CSRF minimal.
 */
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Model.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../models/Devis.php';
require_once __DIR__ . '/../models/DevisTip.php';

class AdmindevisController extends Controller {

    public function index() {
        $devis = (new Devis())->all();
        $tips = (new DevisTip())->latest(10);
        $csrf = $this->csrfToken();
        $this->view('admindevis/dashboard', compact('devis','tips','csrf'));
    }


    // ---------- Devis ----------
    public function devis($action='index', $id=null) {
        $dev = new Devis();
        $timeNow = time();
        if ($action === 'create') {
            if ($this->isPost()) {
                if (!$this->checkCsrf($_POST['csrf'] ?? '')) die('CSRF');
                $user_id =      trim($_POST['user_id'] ?? 0);
                $type_id =      trim($_POST['type_id'] ?? '');
                $finition_id =  trim($_POST['finition_id'] ?? null);
                $pose_id =      trim($_POST['pose_id'] ?? null);
                $ancrage_id =   trim($_POST['ancrage_id'] ?? null);
                $forme_id =     trim($_POST['forme_id'] ?? null);
                $verre_id =     trim($_POST['verre_id'] ?? null);
                $longueur_a =   trim($_POST['longueur_a'] ?? null);
                $longueur_b =   trim($_POST['longueur_b'] ?? null);
                $longueur_c =   trim($_POST['longueur_c'] ?? null);
                $hauteur =      trim($_POST['hauteur'] ?? null);
                $angle =        trim($_POST['angle'] ?? null);
                $quantity =     trim($_POST['quantity'] ?? 1);
                $id_status =    trim($_POST['id_status'] ?? 1);
                $create_date =  $timeNow;
                $update_date =  $timeNow;
                if ($user_id && $type_id) {
                    $dev->create( $user_id,
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
                                  $create_date,
                                  $update_date );
                }

                return $this->redirect('admindevis');
            }
            $csrf = $this->csrfToken();
            return $this->view('devis/form', ['mode'=>'create','csrf'=>$csrf]);
        }
        if ($action === 'edit') {
            $row = $dev->find((int)$id);
            if (!$row) return $this->redirect('admindevis');
            if ($this->isPost()) {
            if (!$this->checkCsrf($_POST['csrf'] ?? '')) die('CSRF');
            // $user_id =      trim($_POST['user_id'] ?? 0);
            $type_id =      trim($_POST['type_id'] ?? '');
            $finition_id =  trim($_POST['finition_id'] ?? null);
            $pose_id =      trim($_POST['pose_id'] ?? null);
            $ancrage_id =   trim($_POST['ancrage_id'] ?? null);
            $forme_id =     trim($_POST['forme_id'] ?? null);
            $verre_id =     trim($_POST['verre_id'] ?? null);
            $longueur_a =   trim($_POST['longueur_a'] ?? null);
            $longueur_b =   trim($_POST['longueur_b'] ?? null);
            $longueur_c =   trim($_POST['longueur_c'] ?? null);
            $hauteur =      trim($_POST['hauteur'] ?? null);
            $angle =        trim($_POST['angle'] ?? null);
            $quantity =     trim($_POST['quantity'] ?? 1);
            $id_status =    trim($_POST['id_status'] ?? 1);
            // $create_date =  $timeNow;
            $update_date =  $timeNow;
            $dev->update(
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
                $update_date );

            return $this->redirect('admindevis');
            }
            $csrf = $this->csrfToken();
            return $this->view('devis/form', ['mode'=>'edit','row'=>$row,'csrf'=>$csrf]);
        }
        if ($action === 'delete') {
            if ($this->isPost() && $this->checkCsrf($_POST['csrf'] ?? '')) {
            $dev->delete((int)$id);
            }
            return $this->redirect('admindevis');
        }
        // index
        $devis = $dev->all();
        $this->view('devis/index', compact('devis'));
    }

}