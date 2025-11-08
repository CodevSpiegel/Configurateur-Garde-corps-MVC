<?php
/*
 * ============================================================================
 * app\views\auth\reset.php
 * ============================================================================
 */

$title='Nouveau mot de passe';

?>
  <?php if (!empty($error)): ?><p class="alert alert-danger"><?= htmlspecialchars($error) ?></p><?php endif; ?>
  <?php if (!empty($msg)): ?><p class="alert alert-success"><?= htmlspecialchars($msg) ?></p><?php endif; ?>
  <form class="formulaire" method="post" action="/auth/reset/<?= htmlspecialchars($token ?? '') ?>">
    <h1>Réinitialiser le mot de passe</h1>
    <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
    <input type="hidden" name="token" value="<?= htmlspecialchars($token ?? '') ?>">
    <div class="form-group">
      <label for="password">Nouveau mot de passe</label>
      <input type="password" id="password" name="password" placeholder="Votre nouveau mot de passe" required>
    </div>
    <div class="form-group">
      <label for="passwordConfirm">Confirmation du mot de passe</label>
      <input type="password" id="passwordConfirm" name="passwordConfirm" placeholder="Confirmez votre nouveau mot de passe" required>
    </div>
    <button type="submit">Mettre à jour</button>
  </form>

