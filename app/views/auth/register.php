<?php
/*
 * ============================================================================
 * app\views\auth\register.php
 * ============================================================================
 */

$title='Inscription';

?>
  <?php if (!empty($error)): ?><p class="alert alert-danger"><?= htmlspecialchars($error) ?></p><?php endif; ?>
  <?php if (!empty($msg)): ?><p class="alert alert-success"><?= htmlspecialchars($msg) ?></p><?php endif; ?>
  <form class="formulaire" method="post" action="/auth/register">
    <h1>Inscription</h1>
    <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
    <div class="form-group">
      <label for="login">Login</label>
      <input id="login" name="login" placeholder="Veuillez saisir un Login" required>
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" placeholder="Indiquez votre adresse email" required>
    </div>
    <div class="form-group">
      <label for="password">Mot de passe</label>
      <input type="password" id="password" name="password" placeholder="Choisissez votre mot de passe" required>
    </div>
    <div class="form-group">
      <label for="passwordConfirm">Confirmation du mot de passe</label>
      <input type="password" id="passwordConfirm" name="passwordConfirm" placeholder="Confirmez votre mot de passe" required>
    </div>
    <button type="submit">Créer mon compte</button>
  </form>
