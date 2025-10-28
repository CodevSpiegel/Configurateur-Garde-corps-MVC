<?php
/**
 * controllers/ConfigurateurController.php
 * Page d'accueil avec dernières astuces + recherche.
 */
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Model.php';
require_once __DIR__ . '/../core/Database.php';
// require_once __DIR__ . '/../models/Tip.php';
// require_once __DIR__ . '/../models/Category.php';

class ConfigurateurController extends Controller {
    public function index() {
        // $tipModel = new Tip();
        // $catModel = new Category();
        // $latest = $tipModel->latest(8);
        // $cats = $catModel->all();

        // $q = trim($_GET['q'] ?? '');
        // $results = $q ? (new Tip())->search($q, 25) : [];

        $this->view('configurateur/index');
    }
}