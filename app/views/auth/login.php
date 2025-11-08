<?php
/*
 * ============================================================================
 * app\views\auth\login.php
 * ============================================================================
 */

$title='Connexion';

?>
  <?php if (!empty($error)): ?><p class="alert alert-danger"><?= htmlspecialchars($error) ?></p><?php endif; ?>
  <form class="formulaire" method="post" action="/auth/login"">
    <h1>Connexion</h1>
    <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
    <div class="form-group">
      <label for="identity">Login ou email</label>
      <input id="identity" name="identity" placeholder="Login ou adresse email" required>
    </div>
    <div class="form-group">
      <label for="password">Mot de passe</label>
      <input type="password" id="password" name="password"" placeholder="Veuillez saisir votre mot de passe" required>
    </div>
    <div class="form-group">
      <label for="remember"><input type="checkbox" id="remember" name="remember"> Se souvenir de moi</label>
    </div>
    <button type="submit">Se connecter</button>
    <p><a href="/auth/forgot">Mot de passe oublié ?</a></p>
  </form>
