<?php

// DEBUG TIME EXECUTION
if( DEBUG_TIME_EXECUTION ) {
    require_once ROOT."core/Classes/Debug.php";
    $Debug = new Debug;
    $Debug->start();
}

// Fonctions Glabales
require_once ROOT."core/Classes/Functions.php";
$func = new FUNC;

// Fonctions d'affichage
require_once ROOT."core/Classes/Display.php";
$print = new Display();

// DB Driver
require_once ROOT."core/Classes/Db_driver.php";
$db = new Db_driver();

// Sessions
require_once ROOT."core/Classes/Sessions.php";
$sess = new Session($db);


class site {
    public $user            = array();
    public $const           = array();
    // public $session_id      = "";
    // public $skin            = "";
    // public $lastclick       = "";
    // public $location        = "";
    // public $debug_html      = "";
    // public $session_type    = "";
}

// ================================================================
// Emballez le tout dans une super classe facile à transporter
$site = new site();

//--------------------------------
// Charger une session Utilisateur
//--------------------------------
$site->user = $sess->authorise();


$site->const = get_defined_constants();
// ================================================================
$global_view = $func->load_view('global_view');


// ---------------------------------------------------------------------------
// AUTOLOAD
// ---------------------------------------------------------------------------
require_once ROOT . 'core/autoloader.php';