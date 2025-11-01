<?php 
$title = "Liste des Devis";

// $updateDate = $row['id_status'] === 1 ? "..." : $func->formatDateFr($row['update_date'], 'heure');

/** @var array $row @var int $fromPage */
if (!$row) {
  echo "<p>Aucun utilisateur trouvé.</p>";
  return;
}

?>
<section>
    <h1>Administration</h1>
    <h2>Utilisateur #<?= (int) $row['id'] ?></h2>
    <div class="grid grid-2 details">
        <div class="detailsBlock">
            <form method="post" class="form" action="<?= BASE_URL ?>admindevis/users/edit/<?= (int)$row['id'] ?>">
            <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
            <div class="rowDetails">
                <div class="labelDetails">Login :</div>
                <div class="valueDetails"><?= htmlspecialchars(ucfirst($row['user_login']) ?? 'Visiteur') ?></div>
            </div>
            <div class="rowDetails">
                <div class="labelDetails">Email :</div>
                <div class="valueDetails"><?= htmlspecialchars($row['user_email'] ?? 'N/C') ?></div>
            </div>
            <div class="rowDetails">
                <div class="labelDetails">Groupe :</div>
                <div class="valueDetails">
                    <select name="id_group" id="id_group">
                        <?php foreach ($groups as $g): ?>
                        <option <?php if($row['id_group'] == $g['id_group']) echo "selected" ?> value="<?= $g['id_group'] ?>"><?= $g['group_label'] ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
        </div>
        <div class="detailsBlock">
            <div class="rowDetails">
                <div class="labelDetails">Date d'inscription :</div>
                <div class="valueDetails"><?= $func->formatDateFr($row['user_registered'], 'heure') ?></div>
            </div>
            <div class="rowDetails">
                <div class="labelDetails">Dernière Visite :</div>
                <div class="valueDetails"><?= $func->formatDateFr($row['user_last_visit'], 'heure') ?></div>
            </div>
            <div class="rowDetails">
                <div class="labelDetails">Dernière Activité :</div>
                <div class="valueDetails"><?= $func->formatDateFr($row['user_last_activity'], 'heure') ?></div>
            </div>
            <div class="rowDetails">
                <div class="labelDetails">Nombre de devis :</div>
                <div class="valueDetails"><?= $row['nb_devis'] ?></div>
            </div>
        </div>
    </div>
    <div class="actionDetails">
        <a class="btn" href="<?= BASE_URL ?>admindevis/users/list?page=<?= (int)($fromPage ?? 1) ?>">← Retour à la liste</a>
        <button type="submit" class="btn valid">Enregistrer</button>
        </form>
    </div>
</section>