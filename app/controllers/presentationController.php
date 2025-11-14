<?php
/*
 * ============================================================================
 * app\controllers\HomeController.php
 * ============================================================================
 */

class PresentationController extends Controller {

    public function index() {
        $title = "Présentation";
        $this->view( 'presentation/index', compact( 'title' ) );
    }


}