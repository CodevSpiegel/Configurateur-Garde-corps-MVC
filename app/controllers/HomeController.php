<?php
/*
 * ============================================================================
 * app\controllers\HomeController.php
 * ============================================================================
 */

class HomeController extends Controller {

    public function index() {
        $title = "Accueil";
        $this->view( 'home/index', compact( 'title' ) );
    }

}