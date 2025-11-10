<?php
/*
 * ============================================================================
 * app\views\auth\details_devis.php
 * ============================================================================
 */

$title='Détails devis';
// var_dump($u);
?>

<section class="section">
    <div class="container">
        <h1 class="mb-2">Mon devis #<?=$devis['id'] ?></h1>
        <div class="grid-2">
            <!-- Récap -->
            <div class="card">
                <div class="card-header">
                    <span class="dot"></span>
                    <span class="card-title">Détails</span>
                </div>
                <div class="card-body">
                    <div class="info-group">
                      <div class="info-title">Status :</div>
                      <div class="info-data"><?= $devis['label_status'] ?></div>
                    </div>
                    <div class="info-group">
                      <div class="info-title">Modèle :</div>
                      <div class="info-data"><?= $devis['model_label'] ?></div>
                    </div>
                    <div class="info-group">
                      <div class="info-title">Type :</div>
                      <div class="info-data"><?= $devis['type_label'] ?></div>
                    </div>
<?php
if ( $devis['finition_label'] !== NULL ) {
echo <<<HTML
                    <div class="info-group">
                        <div class="info-title">Finition :</div>
                        <div class="info-data">{$devis['finition_label']}</div>
                    </div>

HTML; }
?>
<?php
if ( $devis['pose_label'] !== NULL ) {
echo <<<HTML
                    <div class="info-group">
                        <div class="info-title">Pose :</div>
                        <div class="info-data">{$devis['pose_label']}</div>
                    </div>

HTML; }
?>
                    <div class="info-group">
                      <div class="info-title">Ancrage :</div>
                      <div class="info-data"><?= $devis['ancrage_label'] ?></div>
                    </div>
                    <div class="info-group">
                      <div class="info-title">Forme :</div>
                      <div class="info-data"><?= $devis['forme_label'] ?></div>
                    </div>

<?php
if ( $devis['verre_label'] !== NULL ) {
echo <<<HTML
                    <div class="info-group">
                        <div class="info-title">Verre :</div>
                        <div class="info-data">{$devis['verre_label']}</div>
                    </div>

HTML; }
?>
<?php
if ( $devis['longueur_a'] !== NULL ) {
echo <<<HTML
                    <div class="info-group">
                        <div class="info-title">Longueur A :</div>
                        <div class="info-data">{$devis['longueur_a']} cm</div>
                    </div>

HTML; }
?>
<?php
if ( $devis['longueur_b'] !== NULL ) {
echo <<<HTML
                    <div class="info-group">
                        <div class="info-title">Longueur B :</div>
                        <div class="info-data">{$devis['longueur_b']} cm</div>
                    </div>

HTML; }
?>
<?php
if ( $devis['longueur_c'] !== NULL ) {
echo <<<HTML
                    <div class="info-group">
                        <div class="info-title">Longueur C :</div>
                        <div class="info-data">{$devis['longueur_c']} cm</div>
                    </div>

HTML; }
?>
                    <div class="info-group">
                      <div class="info-title">Hauteur :</div>
                      <div class="info-data"><?= $devis['hauteur'] ?> cm</div>
                    </div>
<?php
if ( $devis['angle'] !== NULL ) {
echo <<<HTML
                    <div class="info-group">
                        <div class="info-title">Angle :</div>
                        <div class="info-data">{$devis['angle']} °</div>
                    </div>

HTML; }
?>
                    <div class="info-group">
                      <div class="info-title">Quantité :</div>
                      <div class="info-data"><?= $devis['quantity'] ?></div>
                    </div>
                </div>
            </div>
            <!-- Visuel -->
            <div class="card">
                <div class="card-header">
                    <span class="dot"></span>
                    <span class="card-title">Aperçu</span>
                </div>
                <div class="card-body">
                    <img class="appercu" src="../../assets/images/configurateur/previews/<?= $devis['slug_model'] ?>/<?= $devis['slug_type'] ?>/<?= $devis['slug_pose'] ?>/<?= $devis['slug_type'] ?>-<?= $devis['slug_forme'] ?>-<?= $devis['slug_pose'] ?>.png" alt="">
                </div>
                <p class="mt-2">Aperçu non contractuel — rendu indicatif.</p>
                <div class="mt-2">
                    <a class="btn btn-outline" href="/auth/listDevis">Retour à la liste</a>
                </div>
            </div>
        </div>
    </div>
</section>
