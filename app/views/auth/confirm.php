<?php
/*
 * ============================================================================
 * app\views\auth\confirm.php
 * ============================================================================
 */

$title='Confirmation';

?>
  <h1>Confirmation d'email</h1>
  <?php if (!empty($ok)): ?>
    <p class="alert alert-success">Merci, votre adresse est confirmée.</p>
  <?php else: ?>
    <p class="alert alert-danger">Lien invalide ou déjà utilisé.</p>
  <?php endif; ?>
  <p><a class="btn btn-primary" href="/auth/login">Se connecter</a></p>
  