<?php

require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Model.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Functions.php';

class HomeController extends Controller {

    public function index() {
        $this->view('home/index');
    }

}