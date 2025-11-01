<?php

require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Model.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Functions.php';

class PresentationController extends Controller {

    public function index() {
        $this->view('presentation/index');
    }

}