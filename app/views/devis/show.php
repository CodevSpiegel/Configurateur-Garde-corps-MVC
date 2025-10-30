<?php 
$title = "Liste des Devis";

$updateDate = $row['id_status'] === 1 ? "..." : $func->formatDateFr($row['update_date'], 'heure');

if ( $row['finition_label'] !== NULL ) {
$finition = <<<HTML
            <div class="rowDetails">
                <div class="labelDetails">Finition :</div>
                <div class="valueDetails">{$row['finition_label']}</div>
            </div>

HTML; } else { $finition = ""; }

if ( $row['pose_label'] !== NULL ) {
$pose = <<<HTML
            <div class="rowDetails">
                <div class="labelDetails">Pose :</div>
                <div class="valueDetails">{$row['pose_label']}</div>
            </div>

HTML; } else { $pose = ""; }

if ( $row['verre_label'] !== NULL ) {
$verre = <<<HTML
            <div class="rowDetails">
                <div class="labelDetails">Verre :</div>
                <div class="valueDetails">{$row['verre_label']}</div>
            </div>

HTML; } else { $verre = ""; }

if ( $row['longueur_a'] !== NULL ) {
$longueur_a = <<<HTML
            <div class="rowDetails">
                <div class="labelDetails">Longueur A (cm) :</div>
                <div class="valueDetails">{$row['longueur_a']}</div>
            </div>

HTML; } else { $longueur_a = ""; }

if ( $row['longueur_b'] !== NULL ) {
$longueur_b = <<<HTML
            <div class="rowDetails">
                <div class="labelDetails">Longueur B (cm) :</div>
                <div class="valueDetails">{$row['longueur_b']}</div>
            </div>

HTML; } else { $longueur_b = ""; }

if ( $row['longueur_c'] !== NULL ) {
$longueur_c = <<<HTML
            <div class="rowDetails">
                <div class="labelDetails">Longueur C (cm) :</div>
                <div class="valueDetails">{$row['longueur_c']}</div>
            </div>

HTML; } else { $longueur_c = ""; }

if ( $row['angle'] !== NULL ) {
$angle = <<<HTML
            <div class="rowDetails">
                <div class="labelDetails">Angle (°) :</div>
                <div class="valueDetails">{$row['angle']}</div>
            </div>

HTML; } else { $angle = ""; }

?>
<section>
    <h1>Administration</h1>
    <h2>Details du Devis #<?= (int)$row['id'] ?></h2>
    <div class="grid grid-2 details">
        <div class="detailsBlock">
            <form method="post" class="form" action="<?= BASE_URL ?>admindevis/devis/edit/<?= (int)$row['id'] ?>">
            <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
            <div class="rowDetails">
                <div class="labelDetails">Statut :</div>
                <div class="valueDetails">
                    <select name="id_status" id="id_status">
                        <option <?php if($row['id_status'] == 1) echo "selected" ?> value="1">En attente</option>
                        <option <?php if($row['id_status'] == 2) echo "selected" ?> value="2">En cours</option>
                        <option <?php if($row['id_status'] == 3) echo "selected" ?> value="3">Accepté</option>
                        <option <?php if($row['id_status'] == 4) echo "selected" ?> value="4">Refusé</option>
                        <option <?php if($row['id_status'] == 5) echo "selected" ?> value="5">Annulé</option>
                        <option <?php if($row['id_status'] == 6) echo "selected" ?> value="6">Terminé</option>
                    </select>
                </div>
            </div>
            <div class="rowDetails">
                <div class="labelDetails">Création :</div>
                <div class="valueDetails"><?= $func->formatDateFr($row['create_date'], 'heure') ?></div>
            </div>
            <div class="rowDetails">
                <div class="labelDetails">Mise à jour :</div>
                <div class="valueDetails"><?= $updateDate ?></div>
            </div>
            <div class="rowDetails">
                <div class="labelDetails">Utilisateur :</div>
                <div class="valueDetails"><?= htmlspecialchars($row['user_login'] ?? 'Visiteur') ?></div>
            </div>
            <div class="rowDetails">
                <div class="labelDetails">Email :</div>
                <div class="valueDetails"><?= htmlspecialchars($row['user_email'] ?? 'N/C') ?></div>
            </div>
            <div class="rowDetails">
                <div class="labelDetails">Inscription :</div>
                <div class="valueDetails"><?= htmlspecialchars($func->formatDateFr($row['user_registered'], 'heure') ?? 'N/C') ?></div>
            </div>
        </div>
        <div class="detailsBlock">
            <div class="rowDetails">
                <div class="labelDetails">Modèle :</div>
                <div class="valueDetails"><?= htmlspecialchars($row['model_label']) ?></div>
            </div>
            <div class="rowDetails">
                <div class="labelDetails">Type :</div>
                <div class="valueDetails"><?= htmlspecialchars($row['type_label']) ?></div>
            </div>
<?= $finition ?>
<?= $pose ?>
            <div class="rowDetails">
                <div class="labelDetails">Ancrage :</div>
                <div class="valueDetails"><?= htmlspecialchars($row['ancrage_label']) ?></div>
            </div>
            <div class="rowDetails">
                <div class="labelDetails">Forme :</div>
                <div class="valueDetails"><?= htmlspecialchars($row['forme_label']) ?></div>
            </div>
<?= $verre ?>
<?= $longueur_a ?>
<?= $longueur_b ?>
<?= $longueur_c ?>
            <div class="rowDetails">
                <div class="labelDetails">Hauteur (cm) :</div>
                <div class="valueDetails"><?= htmlspecialchars($row['hauteur']) ?></div>
            </div>
<?= $angle ?>
        </div>
    </div>
    <div class="actionDetails">
        <a class="btn" href="<?= BASE_URL ?>admindevis/devis/list">Retour</a>
        <!-- <a class="btn" href="<?= BASE_URL ?>admindevis/devis/form/<?= (int)$row['id'] ?>">Valider</a> -->
        <button type="submit" class="btn valid">Enregistrer</button>
        </form>
    </div>
    
</section>