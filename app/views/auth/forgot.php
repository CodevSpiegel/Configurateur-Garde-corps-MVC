<?php
/*
 * ============================================================================
 * aapp\views\auth\forgot.php
 * ============================================================================
 */

$title='Mot de passe perdu';

?>
<main class="container">
  <h1>Mot de passe perdu</h1>
  <?php if (!empty($error)): ?><p class="alert alert-danger"><?= htmlspecialchars($error) ?></p><?php endif; ?>
  <?php if (!empty($msg)): ?><p class="alert alert-success"><?= htmlspecialchars($msg) ?></p><?php endif; ?>
  <form method="post" action="/auth/forgot" class="card p-3">
    <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
    <div class="mb-2">
      <label>Email</label>
      <input name="email" type="email" class="form-control" required>
    </div>
    <button class="btn btn-primary">Envoyer le lien</button>
  </form>
</main>
