<?php
/*
 * ============================================================================
 * app\views\devis\show.php
 * ============================================================================
 */

$title = "Détail du Devis";

if (!$row) {
  echo "<p>Aucun Devis trouvé.</p>";
  return;
}

$updateDate = $row['id_status'] === 1 ? "..." : $func->formatDateFr($row['update_date'], 'heure');

?>
<section>
    <h1>Administration</h1>
    <h2>Devis #<?= (int)$row['id'] ?></h2>
    <div class="grid grid-2 details">
        <div class="detailsBlock">
            <form method="post" class="form" action="<?= BASE_URL ?>admin/devis/edit/<?= (int)$row['id'] ?>">
            <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
            <input type="hidden" name="return" value="<?= BASE_URL ?>admin/devis/list?page=<?= (int)($fromPage ?? 1) ?>">
            <div class="rowDetails">
                <div class="labelDetails">Statut :</div>
                <div class="valueDetails">
                    <select name="id_status" id="id_status">
                        <?php foreach ($status as $s): ?>
                        <option <?php if($row['id_status'] == $s['id']) echo "selected" ?> value="<?= $s['id'] ?>"><?= $s['label_status'] ?></option>
                        <?php endforeach; ?>
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
                <div class="valueDetails"><a href="<?= BASE_URL ?>admin/users/show/<?= (int) $row['user_id'] ?>"><?= htmlspecialchars(ucfirst($row['user_login']) ?? 'Visiteur') ?></a></div>
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
<?php
if ( $row['finition_label'] !== NULL ) {
echo <<<HTML
            <div class="rowDetails">
                <div class="labelDetails">Finition :</div>
                <div class="valueDetails">{$row['finition_label']}</div>
            </div>

HTML; }
?>
<?php
if ( $row['pose_label'] !== NULL ) {
echo <<<HTML
            <div class="rowDetails">
                <div class="labelDetails">Pose :</div>
                <div class="valueDetails">{$row['pose_label']}</div>
            </div>

HTML; }
?>
            <div class="rowDetails">
                <div class="labelDetails">Ancrage :</div>
                <div class="valueDetails"><?= htmlspecialchars($row['ancrage_label']) ?></div>
            </div>
            <div class="rowDetails">
                <div class="labelDetails">Forme :</div>
                <div class="valueDetails"><?= htmlspecialchars($row['forme_label']) ?></div>
            </div>
<?php
if ( $row['verre_label'] !== NULL ) {
echo <<<HTML
            <div class="rowDetails">
                <div class="labelDetails">Verre :</div>
                <div class="valueDetails">{$row['verre_label']}</div>
            </div>

HTML; }
?>
<?php
if ( $row['longueur_a'] !== NULL ) {
echo <<<HTML
            <div class="rowDetails">
                <div class="labelDetails">Longueur A (cm) :</div>
                <div class="valueDetails">{$row['longueur_a']}</div>
            </div>

HTML; }
?>
<?php
if ( $row['longueur_b'] !== NULL ) {
echo <<<HTML
            <div class="rowDetails">
                <div class="labelDetails">Longueur B (cm) :</div>
                <div class="valueDetails">{$row['longueur_b']}</div>
            </div>

HTML; }
?>
<?php
if ( $row['longueur_c'] !== NULL ) {
echo <<<HTML
            <div class="rowDetails">
                <div class="labelDetails">Longueur C (cm) :</div>
                <div class="valueDetails">{$row['longueur_c']}</div>
            </div>

HTML; }
?>
            <div class="rowDetails">
                <div class="labelDetails">Hauteur (cm) :</div>
                <div class="valueDetails"><?= htmlspecialchars($row['hauteur']) ?></div>
            </div>
<?php
if ( $row['angle'] !== NULL ) {
echo <<<HTML
            <div class="rowDetails">
                <div class="labelDetails">Angle (°) :</div>
                <div class="valueDetails">{$row['angle']}</div>
            </div>

HTML; }
?>
        </div>
    </div>
    <div class="actionDetails">
        <a class="btn" href="<?= BASE_URL ?>admin/devis/list?page=<?= (int)($fromPage ?? 1) ?>">← Retour à la liste</a>
        <button type="submit" class="btn valid">Enregistrer</button>
        </form>
    </div>
</section>