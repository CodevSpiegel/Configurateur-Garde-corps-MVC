<?php
/*
 * ============================================================================
 * app\controllers\HomeController.php
 * ============================================================================
 */

class PresentationController extends Controller {

    public function index() {
        $this->view('presentation/index');
    }

}