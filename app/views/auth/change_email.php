<?php $title='Changement d\'email'; ?>
<main class="container">
  <h1>Changer mon email</h1>
  <?php if (!empty($error)): ?><p class="alert alert-danger"><?= htmlspecialchars($error) ?></p><?php endif; ?>
  <?php if (!empty($msg)): ?><p class="alert alert-success"><?= htmlspecialchars($msg) ?></p><?php endif; ?>
  <form method="post" action="/auth/change-email" class="card p-3">
    <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
    <div class="mb-2">
      <label>Nouvel email</label>
      <input name="email" type="email" class="form-control" required>
    </div>
    <button class="btn btn-primary">Valider</button>
  </form>
</main>
