<?php
/**
 * controllers/TipController.php
 * Détail d'une astuce.
 */
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Model.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../models/Tip.php';

class TipController extends Controller {
  public function show($id = null) {
    $tip = (new Tip())->find((int)($id ?? 0));
    if (!$tip) {
      http_response_code(404);
      $this->redirect('');
    }
    $this->view('tip/show', compact('tip'));
  }
}