<?php
/*
 * ============================================================================
 * app\views\users\show.php
 * ============================================================================
 */

if (!$row) {
  echo "<p>Aucun utilisateur trouvé.</p>";
  return;
}
?>

<!-- WRAP ADMIN : sidebar + contenu -->
<div class="admin-wrap">

    <?php
    $page_active = "users";
    include_once ROOT . 'app/views/admin/includes/inc-asside.php';
    ?>

    <!-- Contenu principal -->
    <main class="admin-main">
        <!-- Client -->
        <div class="card" style="max-width : 800px">
            <div class="card-header">
                <span class="dot"></span>
                <span class="card-title">Client #<?=$row['id'] ?></span>
            </div>
            <div class="card-body">
                <form method="post" class="form" action="<?= BASE_URL ?>admin/users/edit/<?= (int)$row['id'] ?>">
                <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
                <input type="hidden" name="return" value="<?= BASE_URL ?>admin/users/list?page=<?= (int)($fromPage ?? 1) ?>">
                <div class="info-group">
                    <div class="info-title">Login :</div>
                    <div class="info-data"><?= htmlspecialchars(ucfirst($row['user_login']) ?? 'Visiteur') ?></div>
                </div>
                <div class="info-group">
                    <div class="info-title">Email :</div>
                    <div class="info-data"><?= htmlspecialchars($row['user_email']) ?></div>
                </div>
                <div class="info-group">
                    <div class="info-title">Groupe :</div>
                    <div class="info-data">
                        <select class="input" name="id_group" id="id_group">
                            <?php foreach ($groups as $g): ?>
                            <option <?php if($row['id_group'] == $g['id_group']) echo "selected" ?> value="<?= $g['id_group'] ?>"><?= $g['group_label'] ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>
                <div class="info-group">
                    <div class="info-title">Inscription :</div>
                    <div class="info-data"><?= htmlspecialchars($func->formatDateFr($row['user_registered'], 'heure') ?? 'N/C') ?></div>
                </div>
                <div class="info-group">
                    <div class="info-title">Dernière Visite :</div>
                    <div class="info-data"><?= htmlspecialchars($func->formatDateFr($row['user_last_visit'], 'heure') ?? 'N/C') ?></div>
                </div>
                <div class="info-group">
                    <div class="info-title">Dernière Activité :</div>
                    <div class="info-data"><?= htmlspecialchars($func->formatDateFr($row['user_last_activity'], 'heure') ?? 'N/C') ?></div>
                </div>
                <div class="info-group">
                    <div class="info-title">Nombre de devis :</div>
                    <div class="info-data"><?= $row['nb_devis'] ?></div>
                </div>
                <div class="nav-buttons">
                            <a href="<?= BASE_URL ?>admin/users/list?page=<?= (int)($fromPage ?? 1) ?>">← Retour à la liste</a>
                            <button type="submit" class="btn btn-primary">Enregistrer</button>
                        </div>
                </form>
            </div>
        </div>
    </main>
</div>
