<?php $title='Connexion'; ?>
<main class="container">
  <h1>Connexion</h1>
  <?php if (!empty($error)): ?><p class="alert alert-danger"><?= htmlspecialchars($error) ?></p><?php endif; ?>
  <form method="post" action="/auth/login" class="card p-3">
    <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
    <div class="mb-2">
      <label>Login ou email</label>
      <input name="identity" class="form-control" required>
    </div>
    <div class="mb-2">
      <label>Mot de passe</label>
      <input type="password" name="password" class="form-control" required>
    </div>
    <div class="mb-2">
      <label><input type="checkbox" name="remember"> Se souvenir de moi</label>
    </div>
    <button class="btn btn-primary">Se connecter</button>
    <p class="mt-2"><a href="/auth/forgot">Mot de passe oublié ?</a></p>
  </form>
</main>
