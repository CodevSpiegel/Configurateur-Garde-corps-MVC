<?php
/*
 * ============================================================================
 * app\views\auth\profile.php
 * ============================================================================
 */

$title='Mon compte';

// var_dump($u);
?>


<main class="container">
  <h1>Bienvenue <?= htmlspecialchars($user['user_login'] ?? '') ?></h1>
  <ul class="list-group">
      <li class="list-group-item">Email : <?= htmlspecialchars($user['user_email'] ?? '') ?></li>
      <li class="list-group-item">Groupe : <?= (int)($user['user_group_id'] ?? 0) ?></li>
  </ul>
  <p class="mt-3">
      <a class="btn btn-secondary" href="/auth/email">Changer mon email</a>
      <a class="btn btn-outline-danger" href="/auth/logout">Se déconnecter</a>
  </p>
</main>
