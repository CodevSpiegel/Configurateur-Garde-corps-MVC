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

<section class="section">
    <div class="container">
        <h1 class="mb-2">Devis #<?=$row['id'] ?></h1>
        <div class="grid-2">
            <form method="post" action="<?= BASE_URL ?>admin/devis/edit/<?= (int)$row['id'] ?>">
            <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
            <input type="hidden" name="return" value="<?= BASE_URL ?>admin/devis/list?page=<?= (int)($fromPage ?? 1) ?>">
            <!-- Récap -->
            <div class="card">
                <div class="card-header">
                    <span class="dot"></span>
                    <span class="card-title">Détails</span>
                </div>
                <div class="card-body">
                    <div class="info-group">
                      <div class="info-title">Status :</div>
                      <div class="info-data">
                        <select class="input" name="id_status" id="id_status">
                        <?php foreach ($status as $s): ?>
                        <option <?php if($row['id_status'] == $s['id']) echo "selected" ?> value="<?= $s['id'] ?>"><?= $s['label_status'] ?></option>
                        <?php endforeach; ?>
                        </select>
                      </div>
                    </div>
                    <div class="info-group">
                        <div class="info-title">Création :</div>
                        <div class="info-data"><?= $func->formatDateFr($row['create_date'], 'heure') ?></div>
                    </div>
                    <div class="info-group">
                        <div class="info-title">Mise à jour :</div>
                        <div class="info-data"><?= $updateDate ?></div>
                    </div>
                    <div class="info-group">
                      <div class="info-title">Modèle :</div>
                      <div class="info-data"><?= $row['model_label'] ?></div>
                    </div>
                    <div class="info-group">
                      <div class="info-title">Type :</div>
                      <div class="info-data"><?= $row['type_label'] ?></div>
                    </div>
<?php
if ( $row['finition_label'] !== NULL ) {
echo <<<HTML
                    <div class="info-group">
                        <div class="info-title">Finition :</div>
                        <div class="info-data">{$row['finition_label']}</div>
                    </div>

HTML; }
?>
<?php
if ( $row['pose_label'] !== NULL ) {
echo <<<HTML
                    <div class="info-group">
                        <div class="info-title">Pose :</div>
                        <div class="info-data">{$row['pose_label']}</div>
                    </div>

HTML; }
?>
                    <div class="info-group">
                      <div class="info-title">Ancrage :</div>
                      <div class="info-data"><?= $row['ancrage_label'] ?></div>
                    </div>
                    <div class="info-group">
                      <div class="info-title">Forme :</div>
                      <div class="info-data"><?= $row['forme_label'] ?></div>
                    </div>
<?php
if ( $row['verre_label'] !== NULL ) {
echo <<<HTML
                    <div class="info-group">
                        <div class="info-title">Verre :</div>
                        <div class="info-data">{$row['verre_label']}</div>
                    </div>

HTML; }
?>
<?php
if ( $row['longueur_a'] !== NULL ) {
echo <<<HTML
                    <div class="info-group">
                        <div class="info-title">Longueur A :</div>
                        <div class="info-data">{$row['longueur_a']} cm</div>
                    </div>

HTML; }
?>
<?php
if ( $row['longueur_b'] !== NULL ) {
echo <<<HTML
                    <div class="info-group">
                        <div class="info-title">Longueur B :</div>
                        <div class="info-data">{$row['longueur_b']} cm</div>
                    </div>

HTML; }
?>
<?php
if ( $row['longueur_c'] !== NULL ) {
echo <<<HTML
                    <div class="info-group">
                        <div class="info-title">Longueur C :</div>
                        <div class="info-data">{$row['longueur_c']} cm</div>
                    </div>

HTML; }
?>
                    <div class="info-group">
                      <div class="info-title">Hauteur :</div>
                      <div class="info-data"><?= $row['hauteur'] ?> cm</div>
                    </div>
<?php
if ( $row['angle'] !== NULL ) {
echo <<<HTML
                    <div class="info-group">
                        <div class="info-title">Angle :</div>
                        <div class="info-data">{$row['angle']} °</div>
                    </div>

HTML; }
?>
                    <div class="nav-buttons">
                        <a href="<?= BASE_URL ?>admin/devis/list?page=<?= (int)($fromPage ?? 1) ?>">← Retour à la liste</a>
                        <button type="submit" class="btn btn-primary">Enregistrer</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="vetical-card-gap">
                <div class="card">
                    <div class="card-header">
                        <span class="dot"></span>
                        <span class="card-title">Client</span>
                    </div>
                    <div class="card-body">
                        <div class="info-group">
                            <div class="info-title">Login :</div>
                            <div class="info-data"><a href="<?= BASE_URL ?>admin/users/show/<?= (int) $row['user_id'] ?>"><?= htmlspecialchars(ucfirst($row['user_login']) ?? 'Visiteur') ?></a></div>
                        </div>
                        <div class="info-group">
                            <div class="info-title">Email :</div>
                            <div class="info-data"><?= htmlspecialchars($row['user_email']) ?></div>
                        </div>
                        <div class="info-group">
                            <div class="info-title">Groupe :</div>
                            <div class="info-data"><?= htmlspecialchars($row['group_label']) ?></div>
                        </div>
                        <div class="info-group">
                            <div class="info-title">Inscription :</div>
                            <div class="info-data"><?= htmlspecialchars($func->formatDateFr($row['user_registered'], 'heure') ?? 'N/C') ?></div>
                        </div>
                    </div>
                </div>
                <!-- Visuel -->
                <div class="card">
                    <div class="card-header">
                        <span class="dot"></span>
                        <span class="card-title">Aperçu</span>
                    </div>
                    <div class="card-body-img">
                        <?php
                            if( $row['slug_model'] === "verre-a-profile") {
                                if ( $row['slug_type'] === "autoreglable-lateral-y" || 
                                    $row['slug_type'] === "autoreglable-sol-en-f" || 
                                    $row['slug_type'] === "profil-muret" ) 
                                {
                                    $img_preview = $row['slug_model']."/".$row['slug_type']."/".$row['slug_type']."-decoupe";
                                    // var_dump($img_preview);
                                } else {
                                    $img_preview = $row['slug_model']."/".$row['slug_type']."/".$row['slug_type']."-".$row['slug_forme'];
                                    // var_dump($img_preview);
                                }
                            }
                            elseif( $row['slug_model'] === "barriere-piscine") {
                                $img_preview = $row['slug_model']."/".$row['slug_type']."/".$row['slug_model']."-".$row['slug_type']."-".$row['slug_forme'];
                                // var_dump($img_preview);
                            }
                            else {
                                $img_preview = $row['slug_model']."/".$row['slug_type']."/".$row['slug_pose']."/".$row['slug_type']."-".$row['slug_forme']."-".$row['slug_pose'];

                            }
                        ?>
                        <img class="appercu" src="<?php BASE_URL ?>/assets/images/configurateur/previews/<?= $img_preview ?>.webp" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
