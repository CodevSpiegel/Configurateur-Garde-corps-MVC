<?php 
    $title = "Liste des Utilisateurs"; 
?>
<section>
    <h1>Administration</h1>
    <div class="grid">
    <div>
        <h2>Liste des Utilisateurs</h2>
        <!-- <p><a class="btn" href="<?= BASE_URL ?>admindevis/devis/create">+ Nouveau devis</a></p> -->
        <table class="table">
        <thead>
            <tr>
                <th>Reférence</th>
                <th>Date de création</th>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Status</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($devis as $d): ?>
            <tr>
                <td><?= $d['id'] ?></td>
                <td><?= $func->formatDateFr($d['create_date'], 'heure') ?></td>
                <td><?= htmlspecialchars($d['user_login'] ?? 'Visiteur') ?></td>
                <td><?= htmlspecialchars($d['user_email'] ?? 'N/C') ?></td>
                <td><code><?= htmlspecialchars($d['label_status']) ?></code></td>
                <td class="actions">
                <a class="btn" href="<?= BASE_URL ?>admindevis/devis/show/<?= (int)$d['id'] ?>">Détails</a>
                <form method="post" action="<?= BASE_URL ?>admindevis/devis/delete/<?= (int)$d['id'] ?>" onsubmit="return confirm('Supprimer ce devis ?');">
                    <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
                    <button type="submit" class="btn danger">Supprimer</button>
                </form>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
        </table>
    </div>
    </div>
</section>