<?php
/**
 * controllers/ConfigurateurController.php
 */
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Model.php';
require_once __DIR__ . '/../core/Database.php';

class ConfigurateurController extends Controller {
    public function index() {
        $this->view('configurateur/index');
    }
}