<?php
/*
 * ============================================================================
 * app\views\auth\change_email.php
 * ============================================================================
 */

$title='Changement d\'email';

?>
  <?php if (!empty($error)): ?><p class="alert alert-danger"><?= htmlspecialchars($error) ?></p><?php endif; ?>
  <?php if (!empty($msg)): ?><p class="alert alert-success"><?= htmlspecialchars($msg) ?></p><?php endif; ?>
  <form class="formulaire" method="post" action="/auth/email">
    <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
    <div class="form-group">
      <label for="password">Votre mot de passe</label>
      <input type="password" id="password" name="password"" placeholder="Veuillez saisir votre mot de passe" required>
    </div>
    <div class="form-group">
      <label for="email">Votre nouvel email</label>
      <input type="email" id="email" name="email" placeholder="Indiquez votre nouvelle adresse email" required>
    </div>
    <button type="submit">Valider</button>
  </form>

