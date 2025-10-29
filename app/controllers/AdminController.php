<?php
/**
 * controllers/AdminController.php
 * CRUD basique pour catégories et astuces (sans auth).
 * Protégé par token CSRF minimal.
 */
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Model.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../models/Category.php';
require_once __DIR__ . '/../models/Tip.php';

class AdminController extends Controller {

  public function index() {
    var_dump("admin 01");
    $cats = (new Category())->all();
    $tips = (new Tip())->latest(10);
    $csrf = $this->csrfToken();
    $this->view('admin/dashboard', compact('cats','tips','csrf'));
  }

  // ---------- Categories ----------
  public function category($action='index', $id=null) {
    var_dump("02");
    $cat = new Category();
    if ($action === 'create') {
      if ($this->isPost()) {
        if (!$this->checkCsrf($_POST['csrf'] ?? '')) die('CSRF');
        $slug = trim($_POST['slug'] ?? '');
        $name = trim($_POST['name'] ?? '');
        $desc = trim($_POST['description'] ?? null);
        if ($slug && $name) $cat->create($slug, $name, $desc);
        return $this->redirect('admin');
      }
      $csrf = $this->csrfToken();
      return $this->view('category/form', ['mode'=>'create','csrf'=>$csrf]);
    }
    if ($action === 'edit') {
      $row = $cat->find((int)$id);
      if (!$row) return $this->redirect('admin');
      if ($this->isPost()) {
        if (!$this->checkCsrf($_POST['csrf'] ?? '')) die('CSRF');
        $slug = trim($_POST['slug'] ?? '');
        $name = trim($_POST['name'] ?? '');
        $desc = trim($_POST['description'] ?? null);
        $cat->update($row['id'], $slug, $name, $desc);
        return $this->redirect('admin');
      }
      $csrf = $this->csrfToken();
      return $this->view('category/form', ['mode'=>'edit','row'=>$row,'csrf'=>$csrf]);
    }
    if ($action === 'delete') {
      if ($this->isPost() && $this->checkCsrf($_POST['csrf'] ?? '')) {
        $cat->delete((int)$id);
      }
      return $this->redirect('admin');
    }
    // index
    $cats = $cat->all();
    $this->view('category/index', compact('cats'));
  }

  // ---------- Tips ----------
  public function tip($action='index', $id=null) {
    $tip = new Tip();
    $cat = new Category();

    if ($action === 'create') {
      if ($this->isPost()) {
        if (!$this->checkCsrf($_POST['csrf'] ?? '')) die('CSRF');
        $tip->create(
          (int)($_POST['category_id'] ?? 0),
          trim($_POST['title'] ?? ''),
          trim($_POST['summary'] ?? null),
          trim($_POST['content'] ?? ''),
          trim($_POST['code'] ?? null),
        );
        return $this->redirect('admin');
      }
      $csrf = $this->csrfToken();
      $cats = $cat->all();
      return $this->view('tip/form', ['mode'=>'create','csrf'=>$csrf,'cats'=>$cats]);
    }

    if ($action === 'edit') {
      $row = $tip->find((int)$id);
      if (!$row) return $this->redirect('admin');
      if ($this->isPost()) {
        if (!$this->checkCsrf($_POST['csrf'] ?? '')) die('CSRF');
        $tip->update(
          $row['id'],
          (int)($_POST['category_id'] ?? $row['category_id']),
          trim($_POST['title'] ?? $row['title']),
          trim($_POST['summary'] ?? $row['summary']),
          trim($_POST['content'] ?? $row['content']),
          trim($_POST['code'] ?? $row['code']),
        );
        return $this->redirect('admin');
      }
      $csrf = $this->csrfToken();
      $cats = $cat->all();
      return $this->view('tip/form', ['mode'=>'edit','row'=>$row,'csrf'=>$csrf,'cats'=>$cats]);
    }

    if ($action === 'delete') {
      if ($this->isPost() && $this->checkCsrf($_POST['csrf'] ?? '')) {
        $tip->delete((int)$id);
      }
      return $this->redirect('admin');
    }

    // index par défaut: redirige vers admin
    return $this->redirect('admin');
  }
}