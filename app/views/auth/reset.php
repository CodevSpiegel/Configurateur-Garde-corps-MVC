<?php $title='Nouveau mot de passe'; ?>
<main class="container">
  <h1>Réinitialiser le mot de passe</h1>
  <?php if (!empty($error)): ?><p class="alert alert-danger"><?= htmlspecialchars($error) ?></p><?php endif; ?>
  <?php if (!empty($msg)): ?><p class="alert alert-success"><?= htmlspecialchars($msg) ?></p><?php endif; ?>
  <form method="post" action="/auth/reset/<?= htmlspecialchars($token ?? '') ?>" class="card p-3">
    <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
    <input type="hidden" name="token" value="<?= htmlspecialchars($token ?? '') ?>">
    <div class="mb-2">
      <label>Nouveau mot de passe</label>
      <input type="password" name="password" class="form-control" required>
    </div>
    <button class="btn btn-success">Mettre à jour</button>
  </form>
</main>
