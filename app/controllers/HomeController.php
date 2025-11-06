<?php

require_once ROOT . 'app/core/Controller.php';
require_once ROOT . 'app/core/Model.php';
require_once ROOT . 'app/core/Database.php';
require_once ROOT . 'app/core/Functions.php';

class HomeController extends Controller {

    public function index() {
        $this->view('home/index');
    }

}