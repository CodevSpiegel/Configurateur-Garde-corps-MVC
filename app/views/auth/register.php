<?php $title='Inscription'; ?>
<main class="container">
  <h1>Créer un compte</h1>
  <?php if (!empty($error)): ?><p class="alert alert-danger"><?= htmlspecialchars($error) ?></p><?php endif; ?>
  <?php if (!empty($msg)): ?><p class="alert alert-success"><?= htmlspecialchars($msg) ?></p><?php endif; ?>
  <form method="post" action="/auth/register" class="card p-3">
    <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
    <div class="mb-2">
      <label>Login</label>
      <input name="login" class="form-control" required>
    </div>
    <div class="mb-2">
      <label>Email</label>
      <input name="email" type="email" class="form-control" required>
    </div>
    <div class="mb-2">
      <label>Mot de passe</label>
      <input type="password" name="password" class="form-control" required>
    </div>
    <button class="btn btn-success">Créer mon compte</button>
  </form>
</main>
