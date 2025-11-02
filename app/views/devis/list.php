<?php 
    $title = "Liste des Devis"; 
?>
<section>
    <h1>Administration</h1>
    <div class="grid">
    <div>
        <h2>Liste des Devis (<?= (int)$total ?>)</h2>
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
            <?php foreach ($row as $r): ?>
            <tr>
                <td><?= $r['id'] ?></td>
                <td><?= $func->formatDateFr($r['create_date'], 'relative') ?></td>
                <td><a href="<?= BASE_URL ?>admin/users/show/<?= (int) $r['user_id'] ?>"><?= htmlspecialchars(ucfirst($r['user_login']) ?? 'Visiteur') ?></a></td>
                <td><?= htmlspecialchars($r['user_email'] ?? 'N/C') ?></td>
                <td><code><?= htmlspecialchars($r['label_status']) ?></code></td>
                <td class="actions">
                <a href="<?= BASE_URL ?>admin/devis/show/<?= (int)$r['id'] ?>?page=<?= (int)$page ?>"><button class="btn">Gerer</button></a>
                <form method="post" action="<?= BASE_URL ?>admin/devis/delete/<?= (int)$r['id'] ?>" onsubmit="return confirm('Supprimer ce devis ?');">
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
    <?php if (!empty($pages) && $pages > 1): ?>
    <div class="pagination">
        <ul>
        <?php for ($p = 1; $p <= $pages; $p++): ?>
            <?php if ($p === (int)$page): ?>
            <li class="active"><?= $p ?></li>
            <?php else: ?>
            <a href="<?= BASE_URL ?>admin/devis/list?page=<?= $p ?>"><li><?= $p ?></li></a>
            <?php endif; ?>
        <?php endfor; ?>
        </ul>
    </div>
    <?php endif; ?>
</section>