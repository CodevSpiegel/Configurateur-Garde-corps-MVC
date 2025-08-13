<?php
/**
 * Vue de la page de connexion
 * -----------------------------------------------------------------------------
 * - Fournit des fragments HTML appelés par le contrôleur :
 *   * start()  : ouverture de la zone principale
 *   * end()    : fermeture de la zone
 *   * row_info($msg)   : messages informatifs (flash)
 *   * row_errors($arr) : affichage d'une liste d'erreurs
 *   * row_form($old)   : formulaire de connexion (avec repop du champ login)
 * - Le rendu global (head/header/footer) est géré par views/global_view.php via Display.
 */

class login_view
{
    /** Début du contenu MAIN */
    public function start(): string
    {
        return <<<HTML
<section class="container" style="max-width:640px; margin:2rem auto;">
  <h1>Connexion</h1>
HTML;
    }

    /** Fin du contenu MAIN */
    public function end(): string
    {
        return <<<HTML
</section>
HTML;
    }

    /** Affiche un message d'information */
    public function row_info(string $message): string
    {
        $message = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        return <<<HTML
<div role="status" aria-live="polite" style="padding:12px; margin:12px 0; border:1px solid #cce5ff; background:#e9f5ff;">
  {$message}
</div>
HTML;
    }

    /** Affiche une liste d'erreurs */
    public function row_errors(array $errors): string
    {
        if (!$errors) return '';
        $lis = '';
        foreach ($errors as $e) {
            $e = htmlspecialchars((string)$e, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
            $lis .= "<li>{$e}</li>";
        }
        return <<<HTML
<div role="alert" style="padding:12px; margin:12px 0; border:1px solid #f5c2c7; background:#f8d7da; color:#842029;">
  <strong>Impossible de vous connecter :</strong>
  <ul style="margin:8px 0 0 20px;">{$lis}</ul>
</div>
HTML;
    }

    /** Formulaire de connexion */
    public function row_form(array $old = [], string $csrf = ""): string
    {
        // Pré-remplir le champ login si disponible
        $login = htmlspecialchars((string)($old['login'] ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

        // Action vers /login/do-login conformément au contrôleur
        $action = htmlspecialchars((string)($_SERVER['PHP_SELF'] ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        // PUBLIC_PATH se termine déjà par /public/, mais ici on poste vers la route "login/do-login"
        $postUrl = PUBLIC_PATH . 'login/do-login';

        return <<<HTML
<form action="{$postUrl}" method="post" style="display:flex; flex-direction:column; gap:12px; margin-top:1rem;">
  <input type="hidden" name="csrf" value="{$csrf}">
  <label>
    Identifiant
    <input type="text" name="login" value="{$login}" required autofocus style="width:100%; padding:8px;">
  </label>
  <label>
    Mot de passe
    <input type="password" name="password" required style="width:100%; padding:8px;">
  </label>
  <button type="submit" style="padding:10px 16px; cursor:pointer;">Se connecter</button>
</form>
<p style="margin-top:1rem; color:#666;">
  Utilisateur de démo : <code>admin</code> (mot de passe défini dans la BDD importée).
</p>
HTML;
    }
}
