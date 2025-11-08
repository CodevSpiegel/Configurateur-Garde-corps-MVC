<?php
/*
 * ============================================================================
 * aapp\views\auth\forgot.php
 * ============================================================================
 */

$title='Mot de passe perdu';

?>
  <?php if (!empty($error)): ?><p class="alert alert-danger"><?= htmlspecialchars($error) ?></p><?php endif; ?>
  <?php if (!empty($msg)): ?><p class="alert alert-success"><?= htmlspecialchars($msg) ?></p><?php endif; ?>
  <form class="formulaire" method="post" action="/auth/forgot">
    <h1>Mot de passe perdu</h1>
    <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" placeholder="Indiquez votre adresse email" required>
    </div>
    <button type="submit">Envoyer le lien</button>
  </form>

