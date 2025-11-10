<?php
/*
 * ============================================================================
 * app\views\auth\profile.php
 * ============================================================================
 */

$title='Mon compte';

// var_dump($u);
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
                    <div class="info-group">
                        <a class="btn btn-secondary" href="/auth/email">Changer mon email</a>
                        <a class="btn btn-outline-danger" href="/auth/logout">Se déconnecter</a>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="dot"></span>
                    <span class="card-title">Mes devis</span>
                </div>
                <div class="card-body">
                    <div class="info-group">
                      <div class="info-title">Total :</div>
                      <div class="info-data"><?= $user['nb_devis'] ?></div>
                    </div>
                    <div class="info-group">
                        <a class="btn btn-secondary" href="/auth/listDevis">Consulter mes devis</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
