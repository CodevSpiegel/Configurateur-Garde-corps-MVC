<?php
/*
 * ============================================================================
 * app\views\auth\profile.php
 * ============================================================================
 */
?>


<section class="section">
    <div class="container">
        <h1>Mon compte</h1>
        <div class="grid-2">
            <div class="card">
                <div class="card-header">
                    <span class="dot"></span>
                    <span class="card-title">Informations</span>
                </div>
                <div class="card-body">
                    <div class="info-group">
                      <div class="info-title">Login :</div>
                      <div class="info-data"><?= ucfirst($user['user_login']) ?></div>
                    </div>
                    <div class="info-group">
                      <div class="info-title">Email :</div>
                      <div class="info-data"><?= $user['user_email'] ?></div>
                    </div>
                    <div class="info-group">
                      <div class="info-title">Groupe :</div>
                      <div class="info-data"><?= ucfirst($user['group_label']) ?></div>
                    </div>
                    <div class="nav-buttons">
                        <a class="btn btn-outline" href="/auth/email">Changer mon email</a>
                    </div>
                    <div class="nav-buttons">
                        <a class="btn btn-outline" href="/auth/reset">Changer mon mot de passe</a>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="dot"></span>
                    <span class="card-title">Mes devis</span>
                </div>
                <div class="card-body-grid">
                    <?php foreach ($devis as $d): ?>
                    <div class="info-group">
                      <div class="info-title"><?= $d['statut'] ?> :</div>
                      <div class="info-data"><?= $d['total_devis'] ?></div>
                    </div>
                    <?php endforeach; ?>
                    <div class="nav-buttons">
                        <a class="btn btn-outline" href="/auth/listDevis">Voir tous mes devis</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
