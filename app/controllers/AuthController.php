<?php
/**
 * app/controllers/AuthController.php
 * -----------------------------------------------------------------------------
 * Contrôleur d'authentification (front) respectant la logique MVC existante :
 *  - /auth/login         (GET: form, POST: traitement)
 *  - /auth/register
 *  - /auth/logout
 *  - /auth/confirm/<token>
 *  - /auth/forgot
 *  - /auth/reset/<token>
 *  - /auth/profile
 *  - /auth/change-email
 * Utilise : Controller, Auth (modèle), Sessions (core).
 * -----------------------------------------------------------------------------
 */
require_once ROOT . 'app/core/Controller.php';
require_once ROOT . 'app/core/Sessions.php';
require_once ROOT . 'app/models/Auth.php';
require_once ROOT . 'app/core/Sessions.php';
require_once ROOT . 'app/core/Functions.php'; // pour helpers si besoin


class AuthController extends Controller
{
    private Auth $auth;
    private Sessions $session;

    public function __construct()
    {
        $this->auth    = new Auth();
        $this->session = new Sessions();
    }

    public function index() {
        $this->redirect('/auth/login');
    }

    /** Connexion */
    public function login() {
        $csrf = $this->csrfToken();
        $error = null;

        if ($this->isPost()) {
            if (!$this->checkCsrf($_POST['csrf'] ?? '')) die('CSRF');

            $identity = trim($_POST['identity'] ?? '');
            $password = $_POST['password'] ?? '';
            $remember = !empty($_POST['remember']);

            $res = $this->auth->attemptLogin($identity, $password);
            if ($res['ok'] ?? false) {
                $userId = (int)$res['user']['id'];
                $this->session->login($userId, $remember);
                // met à jour la dernière visite
                $this->auth->updateLastVisit($userId);
                $this->redirect('/'); // accueil
            } else {
                $error = $res['error'] ?? 'Erreur inconnue';
            }
        }

        $this->view('auth/login', compact('csrf','error'));
    }

    /** Inscription */
    public function register() {
        $csrf = $this->csrfToken();
        $msg  = null; $error = null;

        if ($this->isPost()) {
            if (!$this->checkCsrf($_POST['csrf'] ?? '')) die('CSRF');

            $login = trim($_POST['login'] ?? '');
            $email = trim($_POST['email'] ?? '');
            $pass  = $_POST['password'] ?? '';

            $res = $this->auth->register($login, $email, $pass);
            if ($res['ok'] ?? false) {
                // "Envoi" du lien de confirmation — ici on affiche en mode dev
                $token = $res['confirm_token'];
                $msg = "Compte créé. Lien de confirmation (dev) : /auth/confirm/$token";
            } else {
                $error = $res['error'] ?? 'Erreur';
            }
        }

        $this->view('auth/register', compact('csrf','msg','error'));
    }

    /** Confirmation d'email */
    public function confirm($token=null) {
        $ok = $token ? $this->auth->confirmEmail($token) : false;
        $this->view('auth/confirm', ['ok'=>$ok]);
    }

    /** Déconnexion */
    public function logout() {
        $this->session->logout();
        $this->redirect('/');
    }

    /** Mot de passe oublié */
    public function forgot() {
        $csrf = $this->csrfToken();
        $msg = null; $error = null;

        if ($this->isPost()) {
            if (!$this->checkCsrf($_POST['csrf'] ?? '')) die('CSRF');
            $email = trim($_POST['email'] ?? '');
            $token = $this->auth->requestReset($email);
            if ($token) {
                $msg = "Lien de réinitialisation (dev) : /auth/reset/$token";
            } else {
                $error = "Email inconnu";
            }
        }

        $this->view('auth/forgot', compact('csrf','msg','error'));
    }

    /** Reset via token */
    public function reset($token=null) {
        $csrf = $this->csrfToken();
        $msg=null; $error=null;

        if ($this->isPost()) {
            if (!$this->checkCsrf($_POST['csrf'] ?? '')) die('CSRF');
            $token = $_POST['token'] ?? '';
            $new   = $_POST['password'] ?? '';
            if (strlen($new) < 6) { $error='Mot de passe trop court'; }
            else {
                $ok = $this->auth->resetPassword($token, $new);
                $msg = $ok ? "Mot de passe réinitialisé, vous pouvez vous connecter." : "Token invalide/expiré";
            }
        }

        $this->view('auth/reset', compact('csrf','token','msg','error'));
    }

    /** Espace utilisateur */
    public function profile() {
        $u = $this->session->user();
        if (!$u) $this->redirect('/auth/login');
        $this->view('auth/profile', ['user'=>$u]);
    }

    /** Changement d'email (demande confirmation à nouveau) */
    public function email() {
        $this->session->requireAuth();
        $csrf = $this->csrfToken();
        $u = $this->session->user();
        $msg=null; $error=null;

        if ($this->isPost()) {
            if (!$this->checkCsrf($_POST['csrf'] ?? '')) die('CSRF');
            $new = trim($_POST['email'] ?? '');
            $res = $this->auth->changeEmail((int)$u['id'], $new);
            if ($res['ok'] ?? false) {
                $msg = "Email changé. Confirmez via le lien (dev) : /auth/confirm/{$res['confirm_token']}";
            } else {
                $error = $res['error'] ?? 'Erreur';
            }
        }

        $this->view('auth/change_email', compact('csrf','u','msg','error'));
    }
}
