<?php
/**
 * controllers/CategoryController.php
 * Listing des catégories + affichage des astuces d'une catégorie.
 */
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Model.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../models/Category.php';
require_once __DIR__ . '/../models/Tip.php';

class CategoryController extends Controller {
  public function index() {
    $cats = (new Category())->all();
    $this->view('category/index', compact('cats'));
  }

  public function show($id = null) {
    $id = (int)($id ?? 0);
    $catModel = new Category();
    $tipModel = new Tip();
    $category = $catModel->find($id);
    if (!$category) {
      http_response_code(404);
      $this->view('category/index', ['cats' => $catModel->all()]);
      return;
    }
    $page = max(1, (int)($_GET['page'] ?? 1));
    $perPage = 12;
    $offset = ($page - 1) * $perPage;
    $tips = $tipModel->byCategory($id, $perPage, $offset);
    $total = $tipModel->countByCategory($id);
    $this->view('category/show', compact('category','tips','page','perPage','total'));
  }
}